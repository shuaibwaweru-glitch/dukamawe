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
    buyerName: v.string(),
    buyerEmail: v.string(),
    buyerPhone: v.optional(v.string()),
    
    // Material info
    materialId: v.string(),
    materialName: v.string(),
    materialCategory: v.string(),
    specification: v.string(),
    quantity: v.number(),
    unit: v.string(),
    
    // Delivery info
    siteName: v.string(),
    siteAddress: v.string(),
    deliveryDate: v.string(),
    urgencyLevel: v.union(
      v.literal("standard"),
      v.literal("priority"),
      v.literal("emergency")
    ),
    instructions: v.optional(v.string()),
    
    // Pricing
    materialCost: v.number(),
    transportCost: v.number(),
    urgencyPremium: v.number(),
    platformFee: v.number(),
    vat: v.number(),
    total: v.number(),
    depositAmount: v.number(),
    balanceAmount: v.number(),
  },
  handler: async (ctx, args) => {
    const orderNumber = generateOrderNumber();
    const releaseCode = generateReleaseCode();
    const now = Date.now();

    // Calculate urgency multiplier and SLA
    const urgencyConfig = {
      standard: { multiplier: 1, sla: 72 * 60 * 60 * 1000 }, // 72 hours
      priority: { multiplier: 1.15, sla: 24 * 60 * 60 * 1000 }, // 24 hours
      emergency: { multiplier: 1.3, sla: 8 * 60 * 60 * 1000 }, // 8 hours
    };

    const urgencyData = urgencyConfig[args.urgencyLevel];
    const deadline = now + urgencyData.sla;

    // Create the order
    const orderId = await ctx.db.insert("orders", {
      orderNumber,
      status: "pending_payment",
      
      urgency: {
        level: args.urgencyLevel,
        multiplier: urgencyData.multiplier,
        sla: urgencyData.sla,
        deadline,
        breached: false,
      },

      buyer: {
        buyerId: "temp_buyer_id" as any, // Will be updated with real buyer system
        userId: "temp_user_id" as any,
        name: args.buyerName,
        phone: args.buyerPhone || "",
        email: args.buyerEmail,
        site: {
          siteId: "temp_site_id" as any,
          name: args.siteName,
          location: { lat: -1.286389, lng: 36.817223 }, // Default Nairobi coordinates
          address: args.siteAddress,
          contact: {
            name: args.buyerName,
            phone: args.buyerPhone || "",
          },
          instructions: args.instructions,
        },
      },

      material: {
        type: args.materialName,
        category: args.materialCategory,
        specifications: {
          grade: args.specification,
          unit: args.unit,
        },
        quantity: args.quantity,
        unit: args.unit,
        description: `${args.specification} ${args.materialName}`,
      },

      pricing: {
        materialCost: args.materialCost,
        transportCost: args.transportCost,
        urgencyPremium: args.urgencyPremium,
        subtotal: args.materialCost + args.transportCost + args.urgencyPremium,
        platformFee: args.platformFee,
        platformFeeRate: 0.05,
        subtotalWithFee: args.materialCost + args.transportCost + args.urgencyPremium + args.platformFee,
        vat: args.vat,
        total: args.total,
        depositAmount: args.depositAmount,
        balanceAmount: args.balanceAmount,
        currency: "KES",
      },

      payment: {
        depositStatus: "pending",
        depositPaidAt: null,
        depositTransactionId: null,
        depositMpesaRef: null,
        balanceStatus: "pending",
        balancePaidAt: null,
        balanceTransactionId: null,
        balanceMpesaRef: null,
        escrowAmount: 0,
        payoutStatus: "pending",
        payoutCompletedAt: null,
        payoutDetails: null,
      },

      timeline: {
        createdAt: now,
        status: "pending_payment",
        events: [
          {
            status: "pending_payment",
            timestamp: now,
            description: "Order created, awaiting deposit payment",
            actor: "system",
          },
        ],
      },

      proof: {
        releaseCode,
        codeUsed: false,
        codeUsedAt: null,
        loadPhoto: null,
        deliveryPhoto: null,
        signature: null,
      },

      notifications: [],
      metadata: {
        version: "1.0",
        source: "web",
      },
    });

    // Create initial transaction record
    await ctx.db.insert("transactions", {
      orderId,
      type: "deposit",
      direction: "incoming",
      amount: args.depositAmount,
      currency: "KES",
      status: "pending",
      paymentMethod: "mpesa",
      fee: args.platformFee * 0.5, // 50% of platform fee for deposit
      netAmount: args.depositAmount - (args.platformFee * 0.5),
      description: `Deposit for order ${orderNumber}`,
      metadata: {
        orderNumber,
        releaseCode,
      },
    });

    return {
      success: true,
      orderId,
      orderNumber,
      depositAmount: args.depositAmount,
      releaseCode,
      message: "Order created successfully. Please proceed to payment.",
    };
  },
});

export const calculatePricing = query({
  args: {
    materialPrice: v.number(),
    quantity: v.number(),
    urgencyLevel: v.union(
      v.literal("standard"),
      v.literal("priority"),
      v.literal("emergency")
    ),
    distance: v.optional(v.number()), // Distance in km
  },
  handler: async (ctx, args) => {
    const materialCost = args.materialPrice * args.quantity;
    
    // Transport cost calculation
    const baseTransportCost = 5000; // Base cost in KES
    const perKmCost = 150; // Cost per km
    const transportCost = args.distance 
      ? baseTransportCost + (args.distance * perKmCost)
      : baseTransportCost + (10 * perKmCost); // Default 10km
    
    // Urgency multiplier
    const urgencyMultiplier = {
      standard: 1,
      priority: 1.15,
      emergency: 1.3,
    };
    
    const urgencyPremium = materialCost * (urgencyMultiplier[args.urgencyLevel] - 1);
    const subtotal = materialCost + transportCost + urgencyPremium;
    const platformFee = subtotal * 0.05;
    const subtotalWithFee = subtotal + platformFee;
    const vat = subtotalWithFee * 0.16;
    const total = subtotalWithFee + vat;
    const deposit = total * 0.4;
    const balance = total * 0.6;
    
    return {
      materialCost,
      transportCost,
      urgencyPremium,
      subtotal,
      platformFee,
      vat,
      total,
      deposit,
      balance,
      breakdown: {
        material: `${args.quantity} units @ KES ${args.materialPrice.toLocaleString()} each`,
        transport: `KES ${transportCost.toLocaleString()} (base: ${baseTransportCost.toLocaleString()} + ${args.distance || 10}km @ ${perKmCost}/km)`,
        urgency: `${args.urgencyLevel} (${urgencyMultiplier[args.urgencyLevel]}x)`,
        platformFeePercent: "5%",
        vatPercent: "16%",
        depositPercent: "40%",
        balancePercent: "60%",
      },
    };
  },
});

export const getOrderById = query({
  args: {
    orderId: v.id("orders"),
  },
  handler: async (ctx, args) => {
    const order = await ctx.db.get(args.orderId);
    if (!order) {
      throw new Error("Order not found");
    }
    
    // Get related transactions
    const transactions = await ctx.db
      .query("transactions")
      .filter(q => q.eq(q.field("orderId"), args.orderId))
      .collect();
    
    return {
      ...order,
      transactions,
    };
  },
});

export const updateOrderStatus = mutation({
  args: {
    orderId: v.id("orders"),
    status: v.union(
      v.literal("pending_payment"),
      v.literal("payment_received"),
      v.literal("searching_suppliers"),
      v.literal("assigned_to_supplier"),
      v.literal("processing"),
      v.literal("in_transit"),
      v.literal("delivered"),
      v.literal("completed"),
      v.literal("cancelled")
    ),
    description: v.string(),
    actor: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const order = await ctx.db.get(args.orderId);
    if (!order) {
      throw new Error("Order not found");
    }
    
    const now = Date.now();
    const newEvent = {
      status: args.status,
      timestamp: now,
      description: args.description,
      actor: args.actor || "system",
    };
    
    // Update order status
    await ctx.db.patch(args.orderId, {
      status: args.status,
      timeline: {
        ...order.timeline,
        status: args.status,
        events: [...order.timeline.events, newEvent],
      },
    });
    
    // If status is delivered, update proof
    if (args.status === "delivered") {
      await ctx.db.patch(args.orderId, {
        proof: {
          ...order.proof,
          codeUsed: true,
          codeUsedAt: now,
        },
      });
    }
    
    return {
      success: true,
      orderId: args.orderId,
      newStatus: args.status,
      timestamp: now,
    };
  },
});

export const getUserOrders = query({
  args: {
    buyerEmail: v.string(),
    limit: v.optional(v.number()),
    status: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 50;
    
    let query = ctx.db
      .query("orders")
      .filter(q => q.eq(q.field("buyer.email"), args.buyerEmail));
    
    // Filter by status if provided
    if (args.status) {
      query = query.filter(q => q.eq(q.field("status"), args.status));
    }
    
    const orders = await query
      .order("desc")
      .take(limit);
    
    return orders.map(order => ({
      id: order._id,
      orderNumber: order.orderNumber,
      status: order.status,
      material: order.material,
      pricing: order.pricing,
      timeline: order.timeline,
      createdAt: order.timeline.createdAt,
    }));
  },
});