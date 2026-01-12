// convex/suppliers/matching.ts
import { v } from "convex/values";
import { query, mutation } from "../_generated/server";

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

// Calculate supplier score based on multiple factors
function calculateSupplierScore(
  distance: number,
  rating: number,
  price: number,
  responseRate: number,
  onTimeDeliveryRate: number
): number {
  // Weighted scoring system
  const weights = {
    distance: 0.3,    // Closer is better
    rating: 0.25,     // Higher rating is better
    price: 0.2,       // Lower price is better
    responseRate: 0.15,
    onTimeDelivery: 0.1,
  };
  
  // Normalize values (0-1 scale)
  const normalizedDistance = Math.max(0, 1 - (distance / 100)); // Assume max 100km
  const normalizedRating = rating / 5; // Rating out of 5
  const normalizedPrice = Math.max(0, 1 - (price / 100000)); // Assume max 100,000 KES
  const normalizedResponseRate = responseRate / 100;
  const normalizedOnTimeDelivery = onTimeDeliveryRate / 100;
  
  // Calculate weighted score
  return (
    normalizedDistance * weights.distance +
    normalizedRating * weights.rating +
    normalizedPrice * weights.price +
    normalizedResponseRate * weights.responseRate +
    normalizedOnTimeDelivery * weights.onTimeDelivery
  ) * 100; // Convert to percentage
}

export const matchSuppliers = query({
  args: {
    materialType: v.string(),
    quantity: v.number(),
    siteLocation: v.object({
      lat: v.number(),
      lng: v.number(),
    }),
    budget: v.optional(v.number()),
    urgency: v.optional(v.union(
      v.literal("standard"),
      v.literal("priority"),
      v.literal("emergency")
    )),
  },
  handler: async (ctx, args) => {
    // Get all suppliers who have the requested material
    const suppliers = await ctx.db
      .query("suppliers")
      .filter(q => 
        q.or(
          q.eq(q.field("materials"), args.materialType),
          q.contains(q.field("materials"), [args.materialType])
        )
      )
      .collect();
    
    // Get inventory for each supplier
    const supplierDetails = [];
    
    for (const supplier of suppliers) {
      // Get supplier's inventory for this material
      const inventory = await ctx.db
        .query("inventory")
        .filter(q => 
          q.and(
            q.eq(q.field("supplierId"), supplier._id),
            q.eq(q.field("materialType"), args.materialType),
            q.gte(q.field("currentStock"), args.quantity),
            q.eq(q.field("available"), true)
          )
        )
        .first();
      
      if (inventory) {
        // Calculate distance
        const distance = calculateDistance(
          supplier.location.lat,
          supplier.location.lng,
          args.siteLocation.lat,
          args.siteLocation.lng
        );
        
        // Calculate total price
        const materialPrice = inventory.pricePerUnit * args.quantity;
        const transportCost = distance * 150; // 150 KES per km
        const totalPrice = materialPrice + transportCost;
        
        // Filter by budget if provided
        if (args.budget && totalPrice > args.budget) {
          continue;
        }
        
        // Calculate supplier score
        const score = calculateSupplierScore(
          distance,
          supplier.rating || 3.5,
          totalPrice,
          supplier.metrics?.responseRate || 80,
          supplier.metrics?.onTimeDeliveryRate || 85
        );
        
        supplierDetails.push({
          supplierId: supplier._id,
          supplier: {
            businessName: supplier.businessName,
            rating: supplier.rating,
            totalRatings: supplier.totalRatings,
            location: supplier.location,
            phone: supplier.phone,
            verified: supplier.verified,
            metrics: supplier.metrics,
          },
          inventory: {
            pricePerUnit: inventory.pricePerUnit,
            currentStock: inventory.currentStock,
            unit: inventory.unit,
            specifications: inventory.specifications,
          },
          orderDetails: {
            materialType: args.materialType,
            quantity: args.quantity,
            totalMaterialCost: materialPrice,
            transportCost,
            totalPrice,
            estimatedDeliveryTime: calculateDeliveryTime(distance, args.urgency || "standard"),
          },
          distance: Math.round(distance * 100) / 100, // Round to 2 decimal places
          score: Math.round(score * 100) / 100, // Round to 2 decimal places
          matchReasons: getMatchReasons(
            supplier,
            distance,
            totalPrice,
            args.urgency || "standard"
          ),
        });
      }
    }
    
    // Sort by score (highest first)
    supplierDetails.sort((a, b) => b.score - a.score);
    
    // Return top 5 suppliers
    return supplierDetails.slice(0, 5).map((supplier, index) => ({
      ...supplier,
      rank: index + 1,
      recommendation: getRecommendation(index, supplier.score),
    }));
  },
});

function calculateDeliveryTime(distance: number, urgency: string): string {
  const baseHours = distance * 0.5; // 0.5 hours per km (30 km/h average)
  
  const urgencyMultiplier = {
    standard: 1,
    priority: 0.7,
    emergency: 0.5,
  };
  
  const estimatedHours = baseHours * urgencyMultiplier[urgency];
  
  if (estimatedHours < 1) {
    return `${Math.round(estimatedHours * 60)} minutes`;
  } else if (estimatedHours < 24) {
    return `${Math.round(estimatedHours)} hours`;
  } else {
    return `${Math.round(estimatedHours / 24)} days`;
  }
}

function getMatchReasons(supplier: any, distance: number, price: number, urgency: string): string[] {
  const reasons = [];
  
  if (supplier.verified) {
    reasons.push("Verified supplier");
  }
  
  if (supplier.rating >= 4) {
    reasons.push("High rating");
  }
  
  if (distance < 20) {
    reasons.push("Close proximity");
  }
  
  if (urgency === "emergency" && supplier.metrics?.responseRate > 90) {
    reasons.push("Fast responder");
  }
  
  if (supplier.metrics?.onTimeDeliveryRate > 95) {
    reasons.push("Reliable delivery");
  }
  
  if (reasons.length === 0) {
    reasons.push("Available stock");
  }
  
  return reasons;
}

function getRecommendation(rank: number, score: number): string {
  if (rank === 0 && score > 80) {
    return "Highly recommended";
  } else if (score > 70) {
    return "Good match";
  } else if (score > 60) {
    return "Suitable option";
  } else {
    return "Available option";
  }
}

export const notifySuppliers = mutation({
  args: {
    orderId: v.id("orders"),
    supplierIds: v.array(v.id("suppliers")),
    message: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const order = await ctx.db.get(args.orderId);
    if (!order) {
      throw new Error("Order not found");
    }
    
    const notificationResults = [];
    const now = Date.now();
    
    for (const supplierId of args.supplierIds) {
      const supplier = await ctx.db.get(supplierId);
      if (!supplier) {
        notificationResults.push({
          supplierId,
          success: false,
          reason: "Supplier not found",
        });
        continue;
      }
      
      // Create notification for supplier
      const notificationId = await ctx.db.insert("notifications", {
        userId: supplier.userId,
        type: "order_available",
        title: `New Order Available: ${order.orderNumber}`,
        body: args.message || `New ${order.material.type} order available. Quantity: ${order.material.quantity} ${order.material.unit}. Delivery to: ${order.buyer.site.name}`,
        data: {
          orderId: args.orderId,
          orderNumber: order.orderNumber,
          material: order.material.type,
          quantity: order.material.quantity,
          unit: order.material.unit,
          totalAmount: order.pricing.total,
          depositAmount: order.pricing.depositAmount,
          siteLocation: order.buyer.site.location,
          siteAddress: order.buyer.site.address,
          urgency: order.urgency.level,
          deadline: order.urgency.deadline,
        },
        channels: ["in_app", "sms", "email"],
        priority: order.urgency.level === "emergency" ? "high" : "medium",
        status: "sent",
        sentAt: now,
        readAt: null,
        language: "en",
        expiresAt: now + (24 * 60 * 60 * 1000), // 24 hours
      });
      
      // Update order notifications
      await ctx.db.patch(args.orderId, {
        notifications: [...(order.notifications || []), {
          supplierId,
          notificationId,
          sentAt: now,
          status: "sent",
        }],
      });
      
      notificationResults.push({
        supplierId,
        notificationId,
        success: true,
        supplierName: supplier.businessName,
        supplierPhone: supplier.phone,
      });
    }
    
    // Update order status if this is the first notification
    if (order.status === "pending_payment" || order.status === "payment_received") {
      await ctx.db.patch(args.orderId, {
        status: "searching_suppliers",
        timeline: {
          ...order.timeline,
          status: "searching_suppliers",
          events: [
            ...order.timeline.events,
            {
              status: "searching_suppliers",
              timestamp: now,
              description: `Order sent to ${args.supplierIds.length} potential suppliers`,
              actor: "system",
            },
          ],
        },
      });
    }
    
    return {
      success: true,
      notifiedCount: args.supplierIds.length,
      results: notificationResults,
      orderStatus: "searching_suppliers",
    };
  },
});

export const acceptOrder = mutation({
  args: {
    orderId: v.id("orders"),
    supplierId: v.id("suppliers"),
    driverId: v.optional(v.id("drivers")),
    estimatedPickupTime: v.optional(v.number()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const order = await ctx.db.get(args.orderId);
    if (!order) {
      throw new Error("Order not found");
    }
    
    const supplier = await ctx.db.get(args.supplierId);
    if (!supplier) {
      throw new Error("Supplier not found");
    }
    
    const now = Date.now();
    
    // Get driver details if provided
    let driverDetails = null;
    if (args.driverId) {
      const driver = await ctx.db.get(args.driverId);
      if (driver) {
        driverDetails = {
          driverId: driver._id,
          name: driver.fullName,
          phone: driver.phone,
          vehicleReg: driver.vehicle.registrationNumber,
          vehicleType: driver.vehicle.type,
          rating: driver.rating,
          currentLocation: driver.currentLocation,
          assignedAt: now,
        };
      }
    }
    
    // Calculate distance
    const distance = calculateDistance(
      supplier.location.lat,
      supplier.location.lng,
      order.buyer.site.location.lat,
      order.buyer.site.location.lng
    );
    
    // Update order with supplier assignment
    await ctx.db.patch(args.orderId, {
      supplier: {
        supplierId: args.supplierId,
        businessName: supplier.businessName,
        phone: supplier.phone,
        location: supplier.location,
        distance: Math.round(distance * 100) / 100,
        rating: supplier.rating,
        assignedAt: now,
        acceptedAt: now,
        notes: args.notes,
      },
      driver: driverDetails,
      status: "assigned_to_supplier",
      timeline: {
        ...order.timeline,
        status: "assigned_to_supplier",
        events: [
          ...order.timeline.events,
          {
            status: "assigned_to_supplier",
            timestamp: now,
            description: `Order accepted by ${supplier.businessName}`,
            actor: supplier.businessName,
            details: {
              supplierId: args.supplierId,
              estimatedPickupTime: args.estimatedPickupTime,
              notes: args.notes,
            },
          },
        ],
      },
    });
    
    // Update supplier metrics
    const updatedTotalOrders = (supplier.totalOrders || 0) + 1;
    await ctx.db.patch(args.supplierId, {
      totalOrders: updatedTotalOrders,
      metrics: {
        ...supplier.metrics,
        averageAcceptanceTime: calculateAverageAcceptanceTime(
          supplier.metrics?.averageAcceptanceTime || 0,
          supplier.totalOrders || 0,
          15 // Assume 15 minutes for this acceptance
        ),
      },
    });
    
    // Create notification for buyer
    await ctx.db.insert("notifications", {
      userId: order.buyer.userId,
      type: "order_accepted",
      title: "Order Accepted!",
      body: `Your order ${order.orderNumber} has been accepted by ${supplier.businessName}. They will contact you shortly.`,
      data: {
        orderId: args.orderId,
        orderNumber: order.orderNumber,
        supplierName: supplier.businessName,
        supplierPhone: supplier.phone,
        estimatedPickupTime: args.estimatedPickupTime,
      },
      channels: ["in_app", "sms"],
      priority: "high",
      status: "sent",
      sentAt: now,
      readAt: null,
      language: "en",
    });
    
    return {
      success: true,
      orderId: args.orderId,
      supplierId: args.supplierId,
      supplierName: supplier.businessName,
      assignedAt: now,
      nextStep: "Supplier will prepare and deliver the order",
    };
  },
});

function calculateAverageAcceptanceTime(
  currentAverage: number,
  currentCount: number,
  newTime: number
): number {
  return ((currentAverage * currentCount) + newTime) / (currentCount + 1);
}