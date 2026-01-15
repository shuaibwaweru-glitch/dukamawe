// convex/seed.ts
import { mutation } from "./_generated/server";

export default mutation({
  handler: async (ctx) => {
    const existingMaterials = await ctx.db.query("materials").collect();
    if (existingMaterials.length > 0) {
      return { message: "Materials already seeded", count: existingMaterials.length };
    }

    const materials = [
      {
        name: "Portland Cement",
        category: "cement",
        description: "High-quality Portland cement for construction",
        unit: "bag",
        specifications: [
          { name: "Grade", value: "42.5R", unit: "" },
          { name: "Weight", value: "50", unit: "kg" },
          { name: "Standard", value: "KEBS Certified", unit: "" }
        ],
        basePrice: 850,
        minOrderQuantity: 10,
        stock: 500,
        images: [],
        status: "active",
        metadata: null,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
      {
        name: "Crushed Stone Aggregate",
        category: "aggregates",
        description: "20mm crushed stone for concrete and foundations",
        unit: "ton",
        specifications: [
          { name: "Size", value: "20", unit: "mm" },
          { name: "Type", value: "Crushed", unit: "" },
          { name: "Quality", value: "Construction Grade", unit: "" }
        ],
        basePrice: 2200,
        minOrderQuantity: 1,
        stock: 200,
        images: [],
        status: "active",
        metadata: null,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      }
    ];

    const insertedIds = [];
    for (const material of materials) {
      const id = await ctx.db.insert("materials", material);
      insertedIds.push(id);
    }

    return { message: "Materials seeded successfully", count: insertedIds.length };
  }
});