// convex/suppliers/mutations.ts
import { mutation } from "../_generated/server";
import { v } from "convex/values";

// Accept order
export const acceptOrder = mutation({
  args: {
    orderId: v.id("orders"),
    supplierId: v.id("suppliers"),
    estimatedDeliveryTime: v.number(), // in hours
  },
  handler: async (ctx, args) => {
    const order = await ctx.db.get(args.orderId);
    if (!order) throw new Error("Order not found");

    if (order.status !== "pending_supplier") {
      throw new Error("Order is not pending supplier acceptance");
    }

    if (order.supplier?.supplierId !== args.supplierId) {
      throw new Error("This order is not assigned to you");
    }

    const now = Date.now();
    const estimatedDelivery = now + (args.estimatedDeliveryTime * 60 * 60 * 1000);

    // Update order status
    await ctx.db.patch(args.orderId, {
      status: "accepted",
      supplier: {
        ...order.supplier,
        acceptedAt: now,
        estimatedDeliveryTime: args.estimatedDeliveryTime,
      },
      timeline: {
        ...order.timeline,
        status: "accepted",
        acceptedAt: now,
        estimatedDeliveryAt: estimatedDelivery,
        events: [
          ...order.timeline.events,
          {
            status: "accepted",
            timestamp: now,
            description: "Supplier accepted the order",
          },
        ],
      },
    });

    // Create notification for buyer
    await ctx.db.insert("notifications", {
      userId: order.buyer.userId,
      type: "order_accepted",
      title: "Order Accepted!",
      body: `Your order ${order.orderNumber} has been accepted by ${order.supplier.businessName}`,
      data: { orderId: args.orderId },
      channels: ["email", "push"],
      priority: "high",
      status: "pending",
      language: "en",
    });

    return { success: true, estimatedDelivery };
  },
});

// Reject order
export const rejectOrder = mutation({
  args: {
    orderId: v.id("orders"),
    supplierId: v.id("suppliers"),
    reason: v.string(),
  },
  handler: async (ctx, args) => {
    const order = await ctx.db.get(args.orderId);
    if (!order) throw new Error("Order not found");

    if (order.status !== "pending_supplier") {
      throw new Error("Order is not pending supplier acceptance");
    }

    if (order.supplier?.supplierId !== args.supplierId) {
      throw new Error("This order is not assigned to you");
    }

    const now = Date.now();

    // Update order status
    await ctx.db.patch(args.orderId, {
      status: "supplier_rejected",
      timeline: {
        ...order.timeline,
        status: "supplier_rejected",
        events: [
          ...order.timeline.events,
          {
            status: "supplier_rejected",
            timestamp: now,
            description: `Supplier rejected: ${args.reason}`,
          },
        ],
      },
    });

    // Restore inventory
    if (order.material.materialId && order.supplier) {
      const inventory = await ctx.db
        .query("supplierInventory")
        .withIndex("by_supplierId", (q) => q.eq("supplierId", order.supplier!.supplierId))
        .filter((q) => q.eq(q.field("materialId"), order.material.materialId!))
        .first();

      if (inventory) {
        await ctx.db.patch(inventory._id, {
          currentStock: inventory.currentStock + order.material.quantity,
        });
      }

      // Restore material stock
      const material = await ctx.db.get(order.material.materialId as any);
      if (material) {
        await ctx.db.patch(order.material.materialId as any, {
          stock: material.stock + order.material.quantity,
        });
      }
    }

    // Create notification for buyer
    await ctx.db.insert("notifications", {
      userId: order.buyer.userId,
      type: "order_rejected",
      title: "Order Rejected",
      body: `Your order ${order.orderNumber} was rejected. We're finding another supplier.`,
      data: { orderId: args.orderId, reason: args.reason },
      channels: ["email", "push", "sms"],
      priority: "high",
      status: "pending",
      language: "en",
    });

    // TODO: Trigger re-matching with next available supplier

    return { success: true };
  },
});

// Mark order as preparing
export const startPreparingOrder = mutation({
  args: { orderId: v.id("orders") },
  handler: async (ctx, args) => {
    const order = await ctx.db.get(args.orderId);
    if (!order) throw new Error("Order not found");

    if (order.status !== "accepted") {
      throw new Error("Order must be accepted first");
    }

    const now = Date.now();

    await ctx.db.patch(args.orderId, {
      status: "preparing",
      timeline: {
        ...order.timeline,
        status: "preparing",
        preparingStartedAt: now,
        events: [
          ...order.timeline.events,
          {
            status: "preparing",
            timestamp: now,
            description: "Order preparation started",
          },
        ],
      },
    });

    // Notify buyer
    await ctx.db.insert("notifications", {
      userId: order.buyer.userId,
      type: "order_preparing",
      title: "Order Being Prepared",
      body: `Your order ${order.orderNumber} is being prepared for delivery`,
      data: { orderId: args.orderId },
      channels: ["push"],
      priority: "normal",
      status: "pending",
      language: "en",
    });

    return { success: true };
  },
});

// Mark order as loaded
export const markOrderLoaded = mutation({
  args: {
    orderId: v.id("orders"),
    driverId: v.id("drivers"),
    vehicleReg: v.string(),
    loadPhoto: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const order = await ctx.db.get(args.orderId);
    if (!order) throw new Error("Order not found");

    if (order.status !== "preparing") {
      throw new Error("Order must be in preparing status");
    }

    const driver = await ctx.db.get(args.driverId);
    if (!driver) throw new Error("Driver not found");

    const now = Date.now();

    await ctx.db.patch(args.orderId, {
      status: "loaded",
      driver: {
        driverId: args.driverId,
        name: driver.fullName,
        phone: driver.phone,
        vehicleReg: args.vehicleReg,
        vehicleType: driver.vehicle.type,
        rating: driver.rating,
        assignedAt: now,
      },
      proof: {
        ...order.proof,
        loadPhoto: args.loadPhoto,
      },
      timeline: {
        ...order.timeline,
        status: "loaded",
        loadedAt: now,
        events: [
          ...order.timeline.events,
          {
            status: "loaded",
            timestamp: now,
            description: `Order loaded on vehicle ${args.vehicleReg}`,
          },
        ],
      },
    });

    // Update driver status
    await ctx.db.patch(args.driverId, {
      available: false,
      currentOrder: args.orderId,
    });

    // Notify buyer
    await ctx.db.insert("notifications", {
      userId: order.buyer.userId,
      type: "order_loaded",
      title: "Order On The Way!",
      body: `Your order ${order.orderNumber} is loaded and on the way. Driver: ${driver.fullName} (${args.vehicleReg})`,
      data: { orderId: args.orderId, driverId: args.driverId },
      channels: ["email", "push", "sms"],
      priority: "high",
      status: "pending",
      language: "en",
    });

    return { success: true, driver: driver.fullName };
  },
});

// Update supplier inventory
export const updateInventory = mutation({
  args: {
    inventoryId: v.id("supplierInventory"),
    currentStock: v.number(),
    pricePerUnit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const inventory = await ctx.db.get(args.inventoryId);
    if (!inventory) throw new Error("Inventory not found");

    const updates: any = {
      currentStock: args.currentStock,
    };

    if (args.pricePerUnit !== undefined) {
      updates.pricePerUnit = args.pricePerUnit;
    }

    if (args.currentStock < inventory.minimumStock) {
      updates.available = false;
    } else {
      updates.available = true;
    }

    await ctx.db.patch(args.inventoryId, updates);

    return { success: true };
  },
});

// Create or update supplier profile
export const createOrUpdateSupplier = mutation({
  args: {
    clerkId: v.string(),
    email: v.string(),
    displayName: v.string(),
  },
  handler: async (ctx, args) => {
    // Check if user exists
    let user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
      .first();

    // Create user if doesn't exist
    if (!user) {
      const userId = await ctx.db.insert("users", {
        clerkId: args.clerkId,
        email: args.email,
        phone: "",
        role: "supplier",
        displayName: args.displayName,
        verified: false,
        active: true,
        language: "en",
        createdAt: Date.now(),
        lastLogin: Date.now(),
      });
      
      user = await ctx.db.get(userId);
    } else {
      await ctx.db.patch(user._id, {
        lastLogin: Date.now(),
      });
    }

    // Check if supplier profile exists
    const existingSupplier = await ctx.db
      .query("suppliers")
      .withIndex("by_userId", (q) => q.eq("userId", user!._id))
      .first();

    if (!existingSupplier) {
      // Create supplier profile
      const supplierId = await ctx.db.insert("suppliers", {
        userId: user._id,
        businessName: args.displayName + "'s Business",
        businessRegNo: "PENDING",
        kraPin: "PENDING",
        verified: false,
        location: { lat: -1.286389, lng: 36.817223 }, // Default Nairobi
        address: "Pending verification",
        phone: "",
        email: args.email,
        materials: [],
        drivers: [],
        rating: 5.0,
        totalRatings: 0,
        totalOrders: 0,
        completedOrders: 0,
        cancelledOrders: 0,
        totalRevenue: 0,
        currentTier: "basic",
        monthlyVolume: 0,
        commissionRate: 0.05,
        metrics: {
          averageAcceptanceTime: 0,
          averageDeliveryTime: 0,
          onTimeDeliveryRate: 100,
          responseRate: 100,
        },
        documents: [],
        status: "pending_verification",
        deliveryRadius: 50, // 50km default
      });

      return { userId: user._id, supplierId };
    }

    return { userId: user._id, supplierId: existingSupplier._id };
  },
});