// convex/orders/create.ts
import { mutation, query } from "../_generated/server";
import { v } from "convex/values";
import { Id } from "../_generated/dataModel";

// Query to get materials with pricing information
export const getMaterialsWithPricing = query({
  args: {
    siteLatitude: v.number(),
    siteLongitude: v.number(),
  },
  handler: async (ctx, args) => {
    // Get all active materials (without filtering by location for now)
    const materials = await ctx.db
      .query("materials")
      .filter(q => q.eq(q.field("status"), "active"))
      .collect();

    // Return materials in the format expected by frontend
    return materials.map(material => ({
      id: material._id,
      name: material.name,
      category: material.category,
      description: material.description,
      unit: material.unit,
      basePrice: material.basePrice,
      specifications: material.specifications ? 
        material.specifications.map(spec => spec.name || spec.value || 'Standard Specification') : 
        ['Standard Specification'],
      available: material.stock > 0,
      stock: material.stock,
    }));
  }
});

// Mutation to create an order
export const createOrder = mutation({
  args: {
    buyerClerkId: v.string(),
    materialId: v.id("materials"),
    quantity: v.number(),
    siteAddress: v.string(),
    siteName: v.string(),
    deliveryDate: v.string(),
    urgencyLevel: v.union(v.literal("standard"), v.literal("priority"), v.literal("emergency")),
    instructions: v.string(),
    siteLatitude: v.number(),
    siteLongitude: v.number(),
  },
  handler: async (ctx, args) => {
    // Get buyer info
    const user = await ctx.db.query("users").filter(q => q.eq(q.field("clerkId"), args.buyerClerkId)).first();
    if (!user) {
      throw new Error("User not found");
    }

    const buyer = await ctx.db.query("buyers").filter(q => q.eq(q.field("userId"), user._id)).first();
    if (!buyer) {
      throw new Error("Buyer profile not found");
    }

    // Get material info
    const material = await ctx.db.get(args.materialId);
    if (!material) {
      throw new Error("Material not found");
    }

    // Calculate pricing
    const materialCost = material.basePrice * args.quantity;
    const transportCost = Math.ceil(args.quantity * 500);
    
    const urgencyMultiplier = {
      standard: 1,
      priority: 1.15,
      emergency: 1.3
    };
    const urgencyPremium = materialCost * (urgencyMultiplier[args.urgencyLevel] - 1);
    
    const subtotal = materialCost + transportCost + urgencyPremium;
    const platformFee = subtotal * 0.05;
    const subtotalWithFee = subtotal + platformFee;
    const vat = subtotalWithFee * 0.16;
    const total = subtotalWithFee + vat;
    
    const depositAmount = total * 0.4;
    const balanceAmount = total * 0.6;

    // Generate order number
    const orderNumber = `ORD-${Date.now().toString().slice(-6)}`;
    const releaseCode = Math.random().toString(36).substring(2, 8).toUpperCase();

    // Create mock supplier (temporarily using a mock ID)
    const mockSupplierId = "mock_supplier_id" as Id<"suppliers">;

    // Create order document
    const orderId = await ctx.db.insert("orders", {
      orderNumber,
      status: "pending_payment",
      urgency: {
        level: args.urgencyLevel,
        multiplier: urgencyMultiplier[args.urgencyLevel],
        sla: args.urgencyLevel === "standard" ? 72 : args.urgencyLevel === "priority" ? 24 : 12,
        deadline: Date.now() + (args.urgencyLevel === "standard" ? 72 : args.urgencyLevel === "priority" ? 24 : 12) * 60 * 60 * 1000,
        breached: false,
        breachNotified: false,
      },
      buyer: {
        buyerId: buyer._id,
        userId: user._id,
        clerkId: args.buyerClerkId,
        name: buyer.fullName,
        phone: buyer.phone,
        email: buyer.email,
        companyId: buyer.companyId || undefined,
        site: {
          siteId: undefined,
          name: args.siteName,
          location: { lat: args.siteLatitude, lng: args.siteLongitude },
          address: args.siteAddress,
          contact: {
            name: buyer.fullName,
            phone: buyer.phone,
          },
          instructions: args.instructions || undefined,
        },
      },
      material: {
        materialId: args.materialId,
        name: material.name,
        category: material.category,
        specifications: {
          grade: material.specifications && material.specifications.length > 0 ? material.specifications[0]?.value || "Standard" : "Standard",
          unit: material.unit,
        },
        quantity: args.quantity,
        unit: material.unit,
        description: material.description,
        unitPrice: material.basePrice,
      },
      supplier: {
        supplierId: mockSupplierId,
        businessName: "Demo Supplier",
        phone: "+254700000000",
        location: { lat: -1.2921, lng: 36.8219 },
        distance: 5.2,
        rating: 4.8,
        assignedAt: Date.now(),
        acceptedAt: undefined,
      },
      driver: undefined,
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
        depositDueDate: Date.now() + 24 * 60 * 60 * 1000,
        depositPaidAt: undefined,
        depositTransactionId: undefined,
        depositMpesaRef: undefined,
        balanceStatus: "pending",
        balanceAmount,
        balanceDueDate: undefined,
        balancePaidAt: undefined,
        balanceTransactionId: undefined,
        balanceMpesaRef: undefined,
        escrowAmount: total,
        payoutStatus: "pending",
        payoutCompletedAt: undefined,
        payoutDetails: undefined,
      },
      delivery: {
        scheduledDate: args.deliveryDate,
        actualDate: undefined,
        status: "pending",
        assignedSupplier: undefined,
        assignedDriver: undefined,
        vehicle: undefined,
        trackingNumber: undefined,
        estimatedTime: undefined,
        actualTime: undefined,
        distance: undefined,
        supplierLocation: undefined,
        siteLocation: { lat: args.siteLatitude, lng: args.siteLongitude },
      },
      timeline: {
        createdAt: Date.now(),
        lastUpdated: Date.now(),
        status: "pending_payment",
        events: [{
          status: "pending_payment",
          timestamp: Date.now(),
          description: "Order created, awaiting payment",
          actor: "system",
          metadata: null,
        }],
      },
      tracking: undefined,
      proof: {
        releaseCode,
        codeUsed: false,
        codeUsedAt: undefined,
        loadPhoto: undefined,
        deliveryPhoto: undefined,
        signature: undefined,
        proofOfDelivery: undefined,
      },
      ratings: undefined,
      dispute: undefined,
      scheduledOrderId: undefined,
      corporateAccountId: undefined,
      notifications: {
        sent: [],
        pending: [],
        preferences: {
          email: true,
          sms: true,
          push: true,
        },
      },
      metadata: {
        version: "1.0",
        source: "web",
        ipAddress: undefined,
        userAgent: undefined,
        createdBy: "buyer",
        materialSnapshot: material,
      },
      deletedAt: undefined,
    });

    return {
      orderId,
      orderNumber,
      depositAmount,
      releaseCode,
      supplier: {
        name: "Demo Supplier",
        distance: 5.2,
        rating: 4.8,
      }
    };
  }
});