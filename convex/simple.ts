// convex/simple.ts
import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const hello = mutation({
  args: { name: v.string() },
  handler: async (ctx, args) => {
    return `Hello ${args.name}!`;
  },
});