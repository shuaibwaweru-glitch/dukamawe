// convex/suppliers/SupplierNotification.ts (Simplified)
import { v } from "convex/values";
import { query, mutation, action } from "../_generated/server";

export const sendSupplierSMS = action({
  args: {
    supplierId: v.id("suppliers"),
    orderId: v.id("orders"),
    message: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Simplified version - just log that we would send SMS
    console.log(`Would send SMS for order ${args.orderId} to supplier ${args.supplierId}`);
    
    return {
      success: true,
      message: "SMS would be sent in production",
      orderId: args.orderId,
      supplierId: args.supplierId,
      timestamp: Date.now(),
    };
  },
});

export const getSupplierNotifications = query({
  args: {
    supplierId: v.id("suppliers"),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const supplier = await ctx.db.get(args.supplierId);
    if (!supplier) {
      throw new Error("Supplier not found");
    }
    
    const notifications = await ctx.db
      .query("notifications")
      .filter(q => q.eq(q.field("userId"), supplier.userId))
      .order("desc")
      .take(args.limit || 20);
    
    return {
      supplier: {
        name: supplier.businessName,
        phone: supplier.phone,
      },
      notifications: notifications.map(n => ({
        id: n._id,
        title: n.title,
        body: n.body,
        type: n.type,
        read: !!n.readAt,
        sentAt: n.sentAt,
      })),
    };
  },
});

export const markNotificationAsRead = mutation({
  args: {
    notificationId: v.id("notifications"),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.notificationId, {
      readAt: Date.now(),
    });
    
    return { success: true };
  },
});