// convex/buyers/mutations.ts
import { mutation } from "../_generated/server";
import { v } from "convex/values";

// Create or update buyer profile - COMPLETE WITH ALL FIELDS
export const createOrUpdateBuyer = mutation({
  args: {
    clerkId: v.string(),
    email: v.string(),
    displayName: v.string(),
    phone: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    console.log("createOrUpdateBuyer called with:", args);
    
    // Check if user exists
    let user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
      .first();

    // Create user if doesn't exist
    if (!user) {
      console.log("Creating new user...");
      const userId = await ctx.db.insert("users", {
        clerkId: args.clerkId,
        email: args.email,
        phone: args.phone || "",
        role: "buyer",
        displayName: args.displayName,
        verified: false,
        active: true,
        language: "en",
        createdAt: Date.now(),
        lastLogin: Date.now(),
      });
      
      user = await ctx.db.get(userId);
      console.log("User created:", userId);
    } else {
      console.log("User exists, updating last login");
      await ctx.db.patch(user._id, {
        lastLogin: Date.now(),
      });
    }

    // Check if buyer profile exists
    const existingBuyer = await ctx.db
      .query("buyers")
      .withIndex("by_userId", (q) => q.eq("userId", user!._id))
      .first();

    if (!existingBuyer) {
      console.log("Creating new buyer profile with ALL required fields...");
      // Create buyer profile with ALL required fields from schema
      const buyerId = await ctx.db.insert("buyers", {
        userId: user._id,
        fullName: args.displayName,
        phone: args.phone || "",
        email: args.email,
        companyId: undefined,
        defaultShippingAddress: {
          address: "Pending setup",
          city: "Nairobi",
          area: "CBD",
          location: { lat: -1.286389, lng: 36.817223 },
          instructions: undefined,
          isPrimary: true,
        },
        savedSites: [],
        preferredSuppliers: [],
        orderHistory: [],
        loyaltyPoints: 0,
        tier: "bronze",
        notifications: {
          email: true,
          sms: true,
          push: true,
        },
        paymentMethods: [],
        verificationStatus: "pending",
        documents: [],
        createdAt: Date.now(),
        // ✅ ADD MISSING FIELD:
        averageOrderValue: 0,  // This was missing!
      });

      console.log("Buyer profile created successfully:", buyerId);
      return { userId: user._id, buyerId, success: true };
    }

    console.log("Buyer already exists:", existingBuyer._id);
    return { userId: user._id, buyerId: existingBuyer._id, success: true, alreadyExists: true };
  },
});

// Query to get buyer by clerk ID
export const getBuyerByClerkId = mutation({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (!user) return null;

    const buyer = await ctx.db
      .query("buyers")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .first();

    return buyer;
  },
});