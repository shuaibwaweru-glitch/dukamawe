// convex/suppliers/queries.ts
import { query } from "../_generated/server";
import { v } from "convex/values";

// Get supplier profile by Clerk ID
export const getSupplierByClerkId = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (!user) return null;

    const supplier = await ctx.db
      .query("suppliers")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .first();

    return supplier;
  },
});

// Get pending orders for supplier
export const getSupplierOrders = query({
  args: {
    supplierId: v.id("suppliers"),
    status: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 20;

    let ordersQuery = ctx.db.query("orders");

    // Filter by supplier
    const allOrders = await ordersQuery.collect();
    
    let filteredOrders = allOrders.filter(order => {
      if (!order.supplier) return false;
      if (order.supplier.supplierId !== args.supplierId) return false;
      if (args.status && order.status !== args.status) return false;
      return true;
    });

    // Sort by created date (newest first)
    filteredOrders.sort((a, b) => {
      const aTime = a.timeline?.createdAt || 0;
      const bTime = b.timeline?.createdAt || 0;
      return bTime - aTime;
    });

    return filteredOrders.slice(0, limit);
  },
});

// Get supplier stats
export const getSupplierStats = query({
  args: { supplierId: v.id("suppliers") },
  handler: async (ctx, args) => {
    const supplier = await ctx.db.get(args.supplierId);
    if (!supplier) return null;

    // Get all supplier orders
    const allOrders = await ctx.db.query("orders").collect();
    const supplierOrders = allOrders.filter(
      order => order.supplier?.supplierId === args.supplierId
    );

    // Calculate stats
    const pendingOrders = supplierOrders.filter(o => o.status === "pending_supplier").length;
    const activeOrders = supplierOrders.filter(o => 
      ["accepted", "preparing", "loaded", "in_transit"].includes(o.status)
    ).length;
    const completedOrders = supplierOrders.filter(o => o.status === "delivered").length;
    
    const totalRevenue = supplierOrders
      .filter(o => o.status === "delivered")
      .reduce((sum, o) => sum + o.pricing.total, 0);

    // Today's orders
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayOrders = supplierOrders.filter(o => {
      const orderDate = new Date(o.timeline?.createdAt || 0);
      orderDate.setHours(0, 0, 0, 0);
      return orderDate.getTime() === today.getTime();
    }).length;

    return {
      pendingOrders,
      activeOrders,
      completedOrders,
      totalRevenue,
      todayOrders,
      rating: supplier.rating,
      totalOrders: supplier.totalOrders,
      completionRate: supplier.totalOrders > 0 
        ? (supplier.completedOrders / supplier.totalOrders) * 100 
        : 0,
    };
  },
});

// Get supplier inventory
export const getSupplierInventory = query({
  args: { 
    supplierId: v.id("suppliers"),
    materialId: v.optional(v.id("materials")),
  },
  handler: async (ctx, args) => {
    let inventoryQuery = ctx.db
      .query("supplierInventory")
      .withIndex("by_supplierId", (q) => q.eq("supplierId", args.supplierId));

    const inventory = await inventoryQuery.collect();

    // Get material details for each inventory item
    const inventoryWithMaterials = await Promise.all(
      inventory.map(async (item) => {
        const material = await ctx.db.get(item.materialId);
        return {
          ...item,
          material,
        };
      })
    );

    if (args.materialId) {
      return inventoryWithMaterials.filter(
        item => item.materialId === args.materialId
      );
    }

    return inventoryWithMaterials;
  },
});

// Get order details with buyer info
export const getOrderDetails = query({
  args: { orderId: v.id("orders") },
  handler: async (ctx, args) => {
    const order = await ctx.db.get(args.orderId);
    if (!order) return null;

    // Get material details
    const material = order.material.materialId 
      ? await ctx.db.get(order.material.materialId as any)
      : null;

    return {
      ...order,
      materialDetails: material,
    };
  },
});