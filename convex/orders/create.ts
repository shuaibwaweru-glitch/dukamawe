// convex/orders/create.ts
import { v } from "convex/values";
import { mutation, query } from "../_generated/server";

// Generate unique order number
function generateOrderNumber(): string {
  const prefix = "DKM";
  const timestamp = Date.now().toString().slice(-8);
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
}

// Generate 6-digit release code
function generateReleaseCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Calculate distance between two coordinates (Haversine formula)
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

export const createOrder = mutation({
  args: {
    // Buyer info
    buyerClerkId: v.string(),
    
    // Material info
    materialId: v.id("materials"),
    quantity: v.number(),
    
    // Delivery info
    deliveryAddressId: v.optional(v.string()),
    siteName: v.optional(v.string()),
    siteAddress: v.string(),
    deliveryDate: v.string(),
    urgencyLevel: v.union(
      v.literal("standard"),
      v.literal("priority"),
      v.literal("emergency")
    ),
    instructions: v.optional(v.string()),
    
    // Location coordinates
    siteLatitude: v.number(),
    siteLongitude: v.number(),
    
    // Optional: Custom pricing
    customUnitPrice: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const orderNumber = generateOrderNumber();
    const releaseCode = generateReleaseCode();
    const now = Date.now();

    // 1. VALIDATE MATERIAL
    const material = await ctx.db.get(args.materialId);
    if (!material) {
      throw new Error("Material not found");
    }
    
    if (material.stock < args.quantity) {
      throw new Error(`Insufficient stock. Available: ${material.stock}, Requested: ${args.quantity}`);
    }
    
    if (args.quantity < material.minOrderQuantity) {
      throw new Error(`Minimum order quantity is ${material.minOrderQuantity}`);
    }

    // 2. GET BUYER
    const buyer = await ctx.db
      .query("buyers")
      .withIndex("by_clerkId", q => q.eq("clerkId", args.buyerClerkId))
      .first();
      
    if (!buyer) {
      throw new Error("Buyer profile not found. Please complete registration.");
    }
    
    // Get delivery address
    let deliveryAddress = buyer.shippingAddresses.find(addr => 
      args.deliveryAddressId ? addr.id === args.deliveryAddressId : addr.isDefault
    );
    
    if (!deliveryAddress && !args.siteAddress) {
      throw new Error("Delivery address required");
    }

    // 3. FIND SUPPLIER WITH INVENTORY
    const supplierInventories = await ctx.db
      .query("supplierInventory")
      .withIndex("by_materialId", q => q.eq("materialId", args.materialId))
      .collect();
    
    let bestSupplier = null;
    let bestSupplierInventory = null;
    let minDistance = Infinity;
    
    for (const inventory of supplierInventories) {
      if (inventory.currentStock >= args.quantity && inventory.available) {
        const supplier = await ctx.db.get(inventory.supplierId);
        if (supplier && supplier.status === "active") {
          const distance = calculateDistance(
            supplier.location.lat,
            supplier.location.lng,
            args.siteLatitude,
            args.siteLongitude
          );
          
          if (distance <= supplier.deliveryRadius && distance < minDistance) {
            minDistance = distance;
            bestSupplier = supplier;
            bestSupplierInventory = inventory;
          }
        }
      }
    }
    
    if (!bestSupplier || !bestSupplierInventory) {
      throw new Error("No available supplier with sufficient stock within delivery radius");
    }
    
    // 4. CALCULATE PRICING
    const unitPrice = args.customUnitPrice || bestSupplierInventory.pricePerUnit;
    const materialCost = unitPrice * args.quantity;
    const transportCost = bestSupplier.baseTransportCost + (minDistance * bestSupplier.perKmCost);
    
    // 5. CALCULATE URGENCY
    const urgencyConfig = {
      standard: { multiplier: 1, sla: 72 },
      priority: { multiplier: 1.15, sla: 24 },
      emergency: { multiplier: 1.3, sla: 8 },
    };
    
    const urgencyData = urgencyConfig[args.urgencyLevel];
    const urgencyPremium = materialCost * (urgencyData.multiplier - 1);
    const deadline = now + (urgencyData.sla * 60 * 60 * 1000);
    
    // 6. CALCULATE FINAL PRICING
    const subtotal = materialCost + transportCost + urgencyPremium;
    const platformFee = subtotal * 0.05;
    const subtotalWithFee = subtotal + platformFee;
    const vat = subtotalWithFee * 0.16;
    const total = subtotalWithFee + vat;
    const depositAmount = total * 0.4;
    const balanceAmount = total * 0.6;
    
    // 7. CREATE ORDER
    const orderId = await ctx.db.insert("orders", {
      orderNumber,
      status: "pending_payment",
      
      urgency: {
        level: args.urgencyLevel,
        multiplier: urgencyData.multiplier,
        sla: urgencyData.sla,
        deadline,
        breached: false,
        breachNotified: false,
      },

      buyer: {
        buyerId: buyer._id,
        userId: buyer.userId,
        clerkId: buyer.clerkId,
        name: buyer.fullName,
        phone: buyer.phone,
        email: buyer.email,
        companyId: buyer.companyId,
        site: {
          siteId: undefined as any, // Optional field
          name: args.siteName || deliveryAddress?.name || "Delivery Site",
          location: {
            lat: args.siteLatitude,
            lng: args.siteLongitude,
          },
          address: args.siteAddress || deliveryAddress?.address || "",
          contact: {
            name: buyer.fullName,
            phone: buyer.phone,
          },
          instructions: args.instructions || "",
        },
      },

      material: {
        materialId: args.materialId,
        name: material.name,
        category: material.category,
        specifications: {
          grade: material.specifications[0]?.value || "Standard",
          unit: material.unit,
        },
        quantity: args.quantity,
        unit: material.unit,
        description: material.description,
        unitPrice: unitPrice,
      },

      supplier: {
        supplierId: bestSupplier._id,
        businessName: bestSupplier.businessName,
        phone: bestSupplier.phone,
        location: bestSupplier.location,
        distance: minDistance,
        rating: bestSupplier.rating,
        assignedAt: now,
      },

      driver: undefined as any, // Optional field

      pricing: {
        materialCost,
        transportCost,
        urgencyPremium,
        subtotal,
        platformFee,
        platformFeeRate: 0.05,
        subtotalWithFee,
        vat,
        vatRate: 0.16,
        total,
        depositAmount,
        balanceAmount,
        currency: "KES",
        discount: 0,
      },

      payment: {
        depositStatus: "pending",
        depositAmount,
        depositDueDate: now + (24 * 60 * 60 * 1000),
        depositPaidAt: null,
        depositTransactionId: null,
        depositMpesaRef: null,
        balanceStatus: "pending",
        balanceAmount,
        balanceDueDate: null,
        balancePaidAt: null,
        balanceTransactionId: null,
        balanceMpesaRef: null,
        escrowAmount: 0,
        payoutStatus: "pending",
        payoutCompletedAt: null,
        payoutDetails: null,
      },

      delivery: {
        scheduledDate: args.deliveryDate,
        actualDate: null,
        status: "pending",
        assignedSupplier: bestSupplier._id,
        assignedDriver: null,
        vehicle: null,
        trackingNumber: null,
        estimatedTime: null,
        actualTime: null,
        distance: minDistance,
        supplierLocation: bestSupplier.location,
        siteLocation: {
          lat: args.siteLatitude,
          lng: args.siteLongitude,
        },
      },

      timeline: {
        createdAt: now,
        lastUpdated: now,
        status: "pending_payment",
        events: [
          {
            status: "pending_payment",
            timestamp: now,
            description: "Order created, awaiting deposit payment",
            actor: "system",
            metadata: {
              orderNumber,
              releaseCode,
              material: material.name,
              quantity: args.quantity,
            },
          },
        ],
      },

      tracking: undefined as any, // Optional field

      proof: {
        releaseCode,
        codeUsed: false,
        codeUsedAt: null,
        loadPhoto: null,
        deliveryPhoto: null,
        signature: null,
        proofOfDelivery: undefined as any, // Optional field
      },

      ratings: undefined as any, // Optional field
      dispute: undefined as any, // Optional field
      scheduledOrderId: undefined as any, // Optional field
      corporateAccountId: undefined as any, // Optional field

      notifications: {
        sent: [],
        pending: ["deposit_reminder", "order_confirmation"],
        preferences: {
          email: true,
          sms: true,
          push: true,
        },
      },

      metadata: {
        version: "2.0",
        source: "web",
        ipAddress: null,
        userAgent: null,
        createdBy: args.buyerClerkId,
        materialSnapshot: {
          basePrice: material.basePrice,
          stock: material.stock,
          minOrderQuantity: material.minOrderQuantity,
        },
      },

      deletedAt: null,
    });

    // 8. UPDATE MATERIAL STOCK
    await ctx.db.patch(args.materialId, {
      stock: material.stock - args.quantity,
      updatedAt: now,
    });

    // 9. UPDATE SUPPLIER INVENTORY
    await ctx.db.patch(bestSupplierInventory._id, {
      currentStock: bestSupplierInventory.currentStock - args.quantity,
      lastUpdated: now,
    });

    // 10. UPDATE BUYER STATS
    await ctx.db.patch(buyer._id, {
      totalOrders: buyer.totalOrders + 1,
      totalSpent: buyer.totalSpent + total,
      lastOrderAt: now,
    });

    // 11. CREATE TRANSACTION RECORD
    const depositTransactionId = await ctx.db.insert("transactions", {
      orderId,
      orderNumber,
      type: "deposit",
      direction: "incoming",
      amount: depositAmount,
      currency: "KES",
      status: "pending",
      paymentMethod: "mpesa",
      fee: platformFee * 0.5,
      netAmount: depositAmount - (platformFee * 0.5),
      description: `Deposit for order ${orderNumber}`,
      metadata: {
        orderNumber,
        releaseCode,
        urgencyLevel: args.urgencyLevel,
        buyerEmail: buyer.email,
        material: material.name,
        supplier: bestSupplier.businessName,
      },
      createdAt: now,
      processedAt: null,
      completedAt: null,
      fromUser: buyer.userId,
      toUser: undefined as any,
      mpesaDetails: undefined as any,
      bankDetails: undefined as any,
    });

    // 12. UPDATE ORDER WITH TRANSACTION ID
    await ctx.db.patch(orderId, {
      payment: {
        ...(await ctx.db.get(orderId))!.payment,
        depositTransactionId,
      },
    });

    // 13. CREATE NOTIFICATION
    await ctx.db.insert("notifications", {
      userId: buyer.userId,
      orderId,
      orderNumber,
      type: "order_created",
      title: "Order Created Successfully",
      body: `Your order ${orderNumber} has been created. Please proceed with the deposit payment of KES ${depositAmount.toLocaleString()}.`,
      data: {
        orderId: orderId,
        amount: depositAmount,
        paymentLink: `/payment/${orderId}/deposit`,
      },
      channels: buyer.notificationPreferences.email ? ["email"] : [],
      priority: "high",
      status: "pending",
      scheduledAt: now,
      sentAt: null,
      readAt: null,
      language: "en",
      expiresAt: now + (7 * 24 * 60 * 60 * 1000), // 7 days
    });

    return {
      success: true,
      orderId,
      orderNumber,
      depositAmount,
      balanceAmount,
      total,
      releaseCode,
      transactionId: depositTransactionId,
      supplier: {
        name: bestSupplier.businessName,
        distance: `${minDistance.toFixed(1)} km`,
        rating: bestSupplier.rating,
        phone: bestSupplier.phone,
      },
      message: "Order created successfully. Please proceed to payment.",
      nextSteps: [
        `Complete deposit payment of KES ${depositAmount.toLocaleString()} within 24 hours`,
        `Balance of KES ${balanceAmount.toLocaleString()} due upon delivery`,
        `Keep your release code (${releaseCode}) safe for delivery verification`,
      ],
    };
  },
});

export const calculateOrderPrice = query({
  args: {
    materialId: v.id("materials"),
    quantity: v.number(),
    urgencyLevel: v.union(
      v.literal("standard"),
      v.literal("priority"),
      v.literal("emergency")
    ),
    siteLatitude: v.number(),
    siteLongitude: v.number(),
  },
  handler: async (ctx, args) => {
    const material = await ctx.db.get(args.materialId);
    if (!material) throw new Error("Material not found");
    
    // Find supplier inventory
    const supplierInventories = await ctx.db
      .query("supplierInventory")
      .withIndex("by_materialId", q => q.eq("materialId", args.materialId))
      .collect();
    
    let minDistance = Infinity;
    let nearestSupplier = null;
    let nearestInventory = null;
    
    for (const inventory of supplierInventories) {
      if (inventory.currentStock >= args.quantity && inventory.available) {
        const supplier = await ctx.db.get(inventory.supplierId);
        if (supplier && supplier.status === "active") {
          const distance = calculateDistance(
            supplier.location.lat,
            supplier.location.lng,
            args.siteLatitude,
            args.siteLongitude
          );
          
          if (distance <= supplier.deliveryRadius && distance < minDistance) {
            minDistance = distance;
            nearestSupplier = supplier;
            nearestInventory = inventory;
          }
        }
      }
    }
    
    if (!nearestSupplier || !nearestInventory) {
      return {
        available: false,
        message: "No available supplier with sufficient stock within delivery radius",
        material: material.name,
        requestedQuantity: args.quantity,
      };
    }
    
    // Calculate pricing
    const unitPrice = nearestInventory.pricePerUnit;
    const materialCost = unitPrice * args.quantity;
    const transportCost = nearestSupplier.baseTransportCost + (minDistance * nearestSupplier.perKmCost);
    
    const urgencyConfig = {
      standard: { multiplier: 1 },
      priority: { multiplier: 1.15 },
      emergency: { multiplier: 1.3 },
    };
    
    const urgencyData = urgencyConfig[args.urgencyLevel];
    const urgencyPremium = materialCost * (urgencyData.multiplier - 1);
    const subtotal = materialCost + transportCost + urgencyPremium;
    const platformFee = subtotal * 0.05;
    const subtotalWithFee = subtotal + platformFee;
    const vat = subtotalWithFee * 0.16;
    const total = subtotalWithFee + vat;
    const depositAmount = total * 0.4;
    const balanceAmount = total * 0.6;
    
    return {
      available: true,
      material: {
        name: material.name,
        category: material.category,
        unit: material.unit,
        stock: material.stock,
        minOrderQuantity: material.minOrderQuantity,
      },
      supplier: {
        name: nearestSupplier.businessName,
        distance: minDistance,
        rating: nearestSupplier.rating,
        deliveryRadius: nearestSupplier.deliveryRadius,
      },
      pricing: {
        unitPrice,
        materialCost,
        transportCost,
        urgencyPremium,
        platformFee,
        vat,
        total,
        depositAmount,
        balanceAmount,
        currency: "KES",
      },
      breakdown: {
        material: `${args.quantity} ${material.unit} @ KES ${unitPrice.toLocaleString()} each`,
        transport: `KES ${transportCost.toLocaleString()} (base: ${nearestSupplier.baseTransportCost.toLocaleString()} + ${minDistance.toFixed(1)}km @ ${nearestSupplier.perKmCost}/km)`,
        urgency: `${args.urgencyLevel} (${urgencyData.multiplier}x)`,
        platformFeePercent: "5%",
        vatPercent: "16%",
        depositPercent: "40%",
        balancePercent: "60%",
      },
    };
  },
});

export const getMaterialsWithPricing = query({
  args: {
    category: v.optional(v.string()),
    siteLatitude: v.number(),
    siteLongitude: v.number(),
  },
  handler: async (ctx, args) => {
    let query = ctx.db.query("materials");
    
    if (args.category) {
      query = query.withIndex("by_category", q => q.eq("category", args.category));
    } else {
      query = query.filter(q => q.eq(q.field("status"), "active"));
    }
    
    const materials = await query.collect();
    
    const results = await Promise.all(
      materials.map(async (material) => {
        // Find available supplier inventory
        const supplierInventories = await ctx.db
          .query("supplierInventory")
          .withIndex("by_materialId", q => q.eq("materialId", material._id))
          .collect();
        
        let minDistance = Infinity;
        let nearestSupplier = null;
        let nearestInventory = null;
        
        for (const inventory of supplierInventories) {
          if (inventory.available) {
            const supplier = await ctx.db.get(inventory.supplierId);
            if (supplier && supplier.status === "active") {
              const distance = calculateDistance(
                supplier.location.lat,
                supplier.location.lng,
                args.siteLatitude,
                args.siteLongitude
              );
              
              if (distance <= supplier.deliveryRadius && distance < minDistance) {
                minDistance = distance;
                nearestSupplier = supplier;
                nearestInventory = inventory;
              }
            }
          }
        }
        
        const transportCost = nearestSupplier 
          ? nearestSupplier.baseTransportCost + (minDistance * nearestSupplier.perKmCost)
          : null;
        
        return {
          id: material._id,
          name: material.name,
          category: material.category,
          description: material.description,
          unit: material.unit,
          specifications: material.specifications,
          basePrice: material.basePrice,
          minOrderQuantity: material.minOrderQuantity,
          stock: material.stock,
          images: material.images,
          available: !!nearestSupplier,
          estimatedDeliveryCost: transportCost,
          supplierPrice: nearestInventory?.pricePerUnit,
          nearestSupplier: nearestSupplier ? {
            name: nearestSupplier.businessName,
            distance: minDistance,
            rating: nearestSupplier.rating,
            deliveryRadius: nearestSupplier.deliveryRadius,
          } : null,
        };
      })
    );
    
    return results;
  },
});