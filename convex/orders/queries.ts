// convex/orders/queries.ts
import { query } from "../_generated/server";
import { v } from "convex/values";

// Get order by ID
export const getOrderById = query({
  args: { orderId: v.id("orders") },
  handler: async (ctx, args) => {
    try {
      const order = await ctx.db.get(args.orderId);
      return order;
    } catch (error) {
      console.error("Error fetching order:", error);
      return null;
    }
  }
});

// Get orders by buyer clerk ID
export const getOrdersByBuyerClerkId = query({
  args: { buyerClerkId: v.string() },
  handler: async (ctx, args) => {
    try {
      // First find the user
      const user = await ctx.db
        .query("users")
        .filter(q => q.eq(q.field("clerkId"), args.buyerClerkId))
        .first();
      
      if (!user) return [];
      
      // Find the buyer
      const buyer = await ctx.db
        .query("buyers")
        .filter(q => q.eq(q.field("userId"), user._id))
        .first();
      
      if (!buyer) return [];
      
      // Get orders for this buyer
      const orders = await ctx.db
        .query("orders")
        .filter(q => q.eq(q.field("buyer.buyerId"), buyer._id))
        .order("desc")
        .collect();
      
      return orders;
    } catch (error) {
      console.error("Error fetching orders:", error);
      return [];
    }
  }
});

// Get order by order number
export const getOrderByOrderNumber = query({
  args: { orderNumber: v.string() },
  handler: async (ctx, args) => {
    try {
      const order = await ctx.db
        .query("orders")
        .filter(q => q.eq(q.field("orderNumber"), args.orderNumber))
        .first();
      
      return order;
    } catch (error) {
      console.error("Error fetching order by number:", error);
      return null;
    }
  }
});