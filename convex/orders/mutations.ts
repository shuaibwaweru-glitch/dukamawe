// convex/orders/mutations.ts
import { v } from "convex/values";
import { mutation } from "../_generated/server";

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
        buyerId: "temp_buyer_id" as any, // We'll fix this when buyer system is ready
        userId: "temp_user_id" as any,
        name: args.buyerName,
        phone: args.buyerPhone || "",
        email: args.buyerEmail,
        site: {
          siteId: "temp_site_id" as any,
          name: args.siteName,
          location: { lat: 0, lng: 0 }, // Will be updated with real coordinates
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
        balanceStatus: "pending",
        escrowAmount: 0,
        payoutStatus: "pending",
      },

      timeline: {
        createdAt: now,
        status: "pending_payment",
        events: [
          {
            status: "pending_payment",
            timestamp: now,
            description: "Order created, awaiting deposit payment",
          },
        ],
      },

      proof: {
        releaseCode,
        codeUsed: false,
      },

      notifications: [],
    });

    return {
      success: true,
      orderId,
      orderNumber,
      depositAmount: args.depositAmount,
      releaseCode,
    };
  },
});

// Get order by ID
export const getOrder = mutation({
  args: { orderId: v.id("orders") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.orderId);
  },
});

// Update order status
export const updateOrderStatus = mutation({
  args: {
    orderId: v.id("orders"),
    newStatus: v.string(),
    description: v.string(),
  },
  handler: async (ctx, args) => {
    const order = await ctx.db.get(args.orderId);
    if (!order) throw new Error("Order not found");

    const now = Date.now();
    const newEvent = {
      status: args.newStatus,
      timestamp: now,
      description: args.description,
    };

    await ctx.db.patch(args.orderId, {
      status: args.newStatus,
      timeline: {
        ...order.timeline,
        status: args.newStatus,
        events: [...order.timeline.events, newEvent],
      },
    });

    return { success: true };
  },
});

// Get user's orders
export const getUserOrders = mutation({
  args: {
    userEmail: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 10;
    
    const orders = await ctx.db
      .query("orders")
      .filter((q) => q.eq(q.field("buyer").email, args.userEmail))
      .order("desc")
      .take(limit);

    return orders;
  },
});