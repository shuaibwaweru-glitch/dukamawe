// convex/schema.ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    clerkId: v.string(),
    email: v.string(),
    phone: v.string(),
    role: v.string(), // 'buyer' | 'supplier' | 'driver' | 'admin'
    displayName: v.string(),
    verified: v.boolean(),
    active: v.boolean(),
    language: v.string(), // 'en' | 'sw'
    createdAt: v.number(),
    lastLogin: v.optional(v.number()),
  })
    .index("by_clerkId", ["clerkId"])
    .index("by_email", ["email"]),

  // Buyers
  buyers: defineTable({
    userId: v.id("users"),
    clerkId: v.string(),
    companyId: v.optional(v.string()),
    fullName: v.string(),
    phone: v.string(),
    email: v.string(),
    defaultLocation: v.optional(v.object({
      lat: v.number(),
      lng: v.number(),
    })),
    shippingAddresses: v.array(v.object({
      id: v.string(),
      name: v.string(),
      address: v.string(),
      location: v.object({
        lat: v.number(),
        lng: v.number(),
      }),
      county: v.string(),
      contact: v.object({
        name: v.string(),
        phone: v.string(),
      }),
      isDefault: v.boolean(),
      instructions: v.optional(v.string()),
    })),
    loyaltyPoints: v.number(),
    loyaltyTier: v.union(
      v.literal("bronze"),
      v.literal("silver"),
      v.literal("gold"),
      v.literal("platinum")
    ),
    totalOrders: v.number(),
    totalSpent: v.number(),
    averageOrderValue: v.number(),
    preferredSuppliers: v.array(v.id("suppliers")),
    paymentMethods: v.array(v.object({
      type: v.literal("mpesa"),
      phone: v.string(),
      default: v.boolean(),
    })),
    notificationPreferences: v.object({
      sms: v.boolean(),
      email: v.boolean(),
      push: v.boolean(),
    }),
    createdAt: v.number(),
    lastOrderAt: v.optional(v.number()),
  })
    .index("by_userId", ["userId"])
    .index("by_clerkId", ["clerkId"])
    .index("by_email", ["email"])
    .index("by_companyId", ["companyId"]),

  // Materials Catalog
  materials: defineTable({
    name: v.string(),
    category: v.string(),
    description: v.string(),
    unit: v.string(),
    specifications: v.array(v.object({
      name: v.string(),
      value: v.string(),
      unit: v.optional(v.string()),
    })),
    basePrice: v.number(),
    minOrderQuantity: v.number(),
    stock: v.number(),
    images: v.array(v.string()),
    status: v.union(v.literal("active"), v.literal("inactive")),
    metadata: v.optional(v.any()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_category", ["category"])
    .index("by_status", ["status"])
    .index("by_name", ["name"]),

  // Suppliers
  suppliers: defineTable({
    userId: v.id("users"),
    businessName: v.string(),
    businessRegNo: v.string(),
    kraPin: v.string(),
    verified: v.boolean(),
    verifiedAt: v.optional(v.number()),
    location: v.object({
      lat: v.number(),
      lng: v.number(),
    }),
    address: v.string(),
    phone: v.string(),
    email: v.string(),
    operatingHours: v.optional(v.any()),
    materials: v.array(v.id("materials")),
    deliveryRadius: v.number(),
    baseTransportCost: v.number(),
    perKmCost: v.number(),
    drivers: v.array(v.id("drivers")),
    rating: v.number(),
    totalRatings: v.number(),
    totalOrders: v.number(),
    completedOrders: v.number(),
    cancelledOrders: v.number(),
    totalRevenue: v.number(),
    currentTier: v.union(
      v.literal("basic"),
      v.literal("silver"),
      v.literal("gold"),
      v.literal("platinum")
    ),
    monthlyVolume: v.number(),
    commissionRate: v.number(),
    metrics: v.object({
      averageAcceptanceTime: v.number(),
      averageDeliveryTime: v.number(),
      onTimeDeliveryRate: v.number(),
      responseRate: v.number(),
    }),
    bankDetails: v.optional(v.object({
      accountName: v.string(),
      accountNumber: v.string(),
      bankName: v.string(),
      branchCode: v.string(),
    })),
    mpesaNumber: v.optional(v.string()),
    documents: v.array(v.object({
      type: v.string(),
      url: v.string(),
      uploadedAt: v.number(),
      verified: v.boolean(),
    })),
    status: v.union(v.literal("active"), v.literal("inactive"), v.literal("suspended")),
    capacity: v.number(),
    createdAt: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_verified", ["verified"])
    .index("by_rating", ["rating"])
    .index("by_status", ["status"])
    .index("by_location", ["location.lat", "location.lng"]),

  // Supplier Inventory
  supplierInventory: defineTable({
    supplierId: v.id("suppliers"),
    materialId: v.id("materials"),
    currentStock: v.number(),
    minimumStock: v.number(),
    reorderLevel: v.number(),
    pricePerUnit: v.number(),
    available: v.boolean(),
    lastRestocked: v.optional(v.number()),
    lastUpdated: v.number(),
  })
    .index("by_supplierId", ["supplierId"])
    .index("by_materialId", ["materialId"])
    .index("by_available", ["available"])
    .index("by_supplier_material", ["supplierId", "materialId"]),

  // Drivers
  drivers: defineTable({
    userId: v.id("users"),
    supplierId: v.id("suppliers"),
    fullName: v.string(),
    phone: v.string(),
    email: v.optional(v.string()),
    licenseNumber: v.string(),
    licenseExpiry: v.number(),
    idNumber: v.string(),
    photo: v.optional(v.string()),
    vehicle: v.object({
      registrationNumber: v.string(),
      make: v.string(),
      model: v.string(),
      year: v.number(),
      capacity: v.number(),
      type: v.string(),
      insuranceExpiry: v.number(),
      photos: v.array(v.string()),
    }),
    available: v.boolean(),
    currentLocation: v.optional(v.object({
      lat: v.number(),
      lng: v.number(),
    })),
    currentOrder: v.optional(v.id("orders")),
    rating: v.number(),
    totalRatings: v.number(),
    totalDeliveries: v.number(),
    completedDeliveries: v.number(),
    totalEarnings: v.number(),
    todayEarnings: v.number(),
    todayDeliveries: v.number(),
    metrics: v.object({
      averageDeliveryTime: v.number(),
      onTimeRate: v.number(),
      customerSatisfaction: v.number(),
    }),
    bankDetails: v.optional(v.any()),
    mpesaNumber: v.optional(v.string()),
    documents: v.array(v.any()),
    verified: v.boolean(),
    active: v.boolean(),
  })
    .index("by_userId", ["userId"])
    .index("by_supplierId", ["supplierId"])
    .index("by_available", ["available"]),

  // Sites
  sites: defineTable({
    buyerId: v.id("buyers"),
    companyId: v.optional(v.string()),
    name: v.string(),
    location: v.object({
      lat: v.number(),
      lng: v.number(),
    }),
    address: v.string(),
    county: v.string(),
    siteManager: v.object({
      name: v.string(),
      phone: v.string(),
    }),
    accessInstructions: v.optional(v.string()),
    workingHours: v.optional(v.object({
      start: v.string(),
      end: v.string(),
    })),
    budget: v.optional(v.number()),
    totalSpent: v.number(),
    orderCount: v.number(),
    active: v.boolean(),
    photos: v.array(v.string()),
    createdAt: v.number(),
    isDefault: v.boolean(),
  })
    .index("by_buyerId", ["buyerId"])
    .index("by_companyId", ["companyId"])
    .index("by_active", ["active"])
    .index("by_location", ["location.lat", "location.lng"]),

  // Orders
  orders: defineTable({
    orderNumber: v.string(),
    status: v.union(
      v.literal("pending_payment"),
      v.literal("payment_received"),
      v.literal("searching_suppliers"),
      v.literal("assigned_to_supplier"),
      v.literal("processing"),
      v.literal("in_transit"),
      v.literal("delivered"),
      v.literal("completed"),
      v.literal("cancelled"),
      v.literal("refunded")
    ),
    urgency: v.object({
      level: v.union(
        v.literal("standard"),
        v.literal("priority"),
        v.literal("emergency")
      ),
      multiplier: v.number(),
      sla: v.number(),
      deadline: v.number(),
      breached: v.boolean(),
      breachNotified: v.boolean(),
    }),
    buyer: v.object({
      buyerId: v.id("buyers"),
      userId: v.id("users"),
      clerkId: v.string(),
      name: v.string(),
      phone: v.string(),
      email: v.string(),
      companyId: v.optional(v.string()),
      site: v.object({
        siteId: v.optional(v.id("sites")),
        name: v.string(),
        location: v.object({ lat: v.number(), lng: v.number() }),
        address: v.string(),
        contact: v.object({
          name: v.string(),
          phone: v.string(),
        }),
        instructions: v.optional(v.string()),
      }),
    }),
    material: v.object({
      materialId: v.id("materials"),
      name: v.string(),
      category: v.string(),
      specifications: v.object({
        grade: v.string(),
        unit: v.string(),
      }),
      quantity: v.number(),
      unit: v.string(),
      description: v.string(),
      unitPrice: v.number(),
    }),
    supplier: v.optional(v.object({
      supplierId: v.id("suppliers"),
      businessName: v.string(),
      phone: v.string(),
      location: v.object({ lat: v.number(), lng: v.number() }),
      distance: v.number(),
      rating: v.number(),
      assignedAt: v.number(),
      acceptedAt: v.optional(v.number()),
    })),
    driver: v.optional(v.object({
      driverId: v.id("drivers"),
      name: v.string(),
      phone: v.string(),
      vehicleReg: v.string(),
      vehicleType: v.string(),
      rating: v.number(),
      currentLocation: v.optional(v.object({ lat: v.number(), lng: v.number() })),
      assignedAt: v.number(),
    })),
    pricing: v.object({
      materialCost: v.number(),
      transportCost: v.number(),
      urgencyPremium: v.number(),
      subtotal: v.number(),
      platformFee: v.number(),
      platformFeeRate: v.number(),
      subtotalWithFee: v.number(),
      vat: v.number(),
      vatRate: v.number(),
      total: v.number(),
      depositAmount: v.number(),
      balanceAmount: v.number(),
      currency: v.string(),
      discount: v.number(),
    }),
    payment: v.object({
      depositStatus: v.union(
        v.literal("pending"),
        v.literal("paid"),
        v.literal("failed"),
        v.literal("refunded"),
        v.literal("refund_pending")
      ),
      depositAmount: v.number(),
      depositDueDate: v.number(),
      depositPaidAt: v.optional(v.number()),
      depositTransactionId: v.optional(v.id("transactions")),
      depositMpesaRef: v.optional(v.string()),
      balanceStatus: v.union(
        v.literal("pending"),
        v.literal("paid"),
        v.literal("failed"),
        v.literal("cancelled")
      ),
      balanceAmount: v.number(),
      balanceDueDate: v.optional(v.number()),
      balancePaidAt: v.optional(v.number()),
      balanceTransactionId: v.optional(v.id("transactions")),
      balanceMpesaRef: v.optional(v.string()),
      escrowAmount: v.number(),
      payoutStatus: v.union(
        v.literal("pending"),
        v.literal("processing"),
        v.literal("completed"),
        v.literal("failed")
      ),
      payoutCompletedAt: v.optional(v.number()),
      payoutDetails: v.optional(v.any()),
    }),
    delivery: v.object({
      scheduledDate: v.string(),
      actualDate: v.optional(v.string()),
      status: v.union(
        v.literal("pending"),
        v.literal("assigned"),
        v.literal("in_transit"),
        v.literal("delivered"),
        v.literal("failed")
      ),
      assignedSupplier: v.optional(v.id("suppliers")),
      assignedDriver: v.optional(v.id("drivers")),
      vehicle: v.optional(v.any()),
      trackingNumber: v.optional(v.string()),
      estimatedTime: v.optional(v.number()),
      actualTime: v.optional(v.number()),
      distance: v.optional(v.number()),
      supplierLocation: v.optional(v.object({ lat: v.number(), lng: v.number() })),
      siteLocation: v.object({ lat: v.number(), lng: v.number() }),
    }),
    timeline: v.object({
      createdAt: v.number(),
      lastUpdated: v.number(),
      status: v.string(),
      events: v.array(v.object({
        status: v.string(),
        timestamp: v.number(),
        description: v.string(),
        actor: v.string(),
        metadata: v.optional(v.any()),
      })),
    }),
    tracking: v.optional(v.object({
      currentLocation: v.optional(v.object({ lat: v.number(), lng: v.number() })),
      lastUpdate: v.optional(v.number()),
      route: v.array(v.object({ lat: v.number(), lng: v.number() })),
      distanceRemaining: v.optional(v.number()),
      eta: v.optional(v.number()),
      speed: v.optional(v.number()),
    })),
    proof: v.object({
      releaseCode: v.string(),
      codeUsed: v.boolean(),
      codeUsedAt: v.optional(v.number()),
      loadPhoto: v.optional(v.string()),
      deliveryPhoto: v.optional(v.string()),
      signature: v.optional(v.string()),
      proofOfDelivery: v.optional(v.object({
        signed: v.boolean(),
        signedAt: v.optional(v.number()),
        signedBy: v.optional(v.string()),
        witness: v.optional(v.string()),
      })),
    }),
    ratings: v.optional(v.object({
      supplierRating: v.optional(v.number()),
      driverRating: v.optional(v.number()),
      materialRating: v.optional(v.number()),
      comments: v.optional(v.string()),
      submittedAt: v.optional(v.number()),
    })),
    dispute: v.optional(v.any()),
    scheduledOrderId: v.optional(v.id("scheduledOrders")),
    corporateAccountId: v.optional(v.id("corporateAccounts")),
    notifications: v.object({
      sent: v.array(v.string()),
      pending: v.array(v.string()),
      preferences: v.object({
        email: v.boolean(),
        sms: v.boolean(),
        push: v.boolean(),
      }),
    }),
    metadata: v.object({
      version: v.string(),
      source: v.string(),
      ipAddress: v.optional(v.string()),
      userAgent: v.optional(v.string()),
      createdBy: v.string(),
      materialSnapshot: v.optional(v.any()),
    }),
    deletedAt: v.optional(v.number()),
  })
    .index("by_orderNumber", ["orderNumber"])
    .index("by_status", ["status"])
    .index("by_buyerId", ["buyer.buyerId"])
    .index("by_supplierId", ["supplier.supplierId"])
    .index("by_driverId", ["driver.driverId"])
    .index("by_createdAt", ["timeline.createdAt"])
    .index("by_urgency_deadline", ["urgency.deadline"])
    .index("by_material", ["material.materialId"]),

  // Transactions
  transactions: defineTable({
    orderId: v.id("orders"),
    orderNumber: v.string(),
    type: v.union(
      v.literal("deposit"),
      v.literal("balance"),
      v.literal("payout"),
      v.literal("refund"),
      v.literal("commission")
    ),
    direction: v.union(v.literal("incoming"), v.literal("outgoing")),
    amount: v.number(),
    currency: v.string(),
    fromUser: v.optional(v.id("users")),
    toUser: v.optional(v.id("users")),
    status: v.union(
      v.literal("pending"),
      v.literal("processing"),
      v.literal("completed"),
      v.literal("failed"),
      v.literal("cancelled")
    ),
    paymentMethod: v.string(),
    mpesaDetails: v.optional(v.object({
      transactionId: v.string(),
      phone: v.string(),
      reference: v.string(),
      amount: v.number(),
      timestamp: v.number(),
    })),
    bankDetails: v.optional(v.any()),
    fee: v.number(),
    netAmount: v.number(),
    description: v.string(),
    metadata: v.optional(v.any()),
    createdAt: v.number(),
    processedAt: v.optional(v.number()),
    completedAt: v.optional(v.number()),
  })
    .index("by_orderId", ["orderId"])
    .index("by_orderNumber", ["orderNumber"])
    .index("by_status", ["status"])
    .index("by_type", ["type"])
    .index("by_createdAt", ["createdAt"])
    .index("by_fromUser", ["fromUser"])
    .index("by_toUser", ["toUser"]),

  // Loyalty Transactions
  loyaltyTransactions: defineTable({
    buyerId: v.id("buyers"),
    orderId: v.optional(v.id("orders")),
    type: v.union(
      v.literal("earned"),
      v.literal("redeemed"),
      v.literal("expired"),
      v.literal("bonus")
    ),
    points: v.number(),
    balance: v.number(),
    description: v.string(),
    expiryDate: v.optional(v.number()),
    metadata: v.optional(v.any()),
    createdAt: v.number(),
  })
    .index("by_buyerId", ["buyerId"])
    .index("by_orderId", ["orderId"])
    .index("by_type", ["type"])
    .index("by_expiryDate", ["expiryDate"]),

  // Corporate Accounts
  corporateAccounts: defineTable({
    companyName: v.string(),
    registrationNumber: v.string(),
    kraPin: v.string(),
    industry: v.string(),
    address: v.string(),
    phone: v.string(),
    email: v.string(),
    creditLimit: v.number(),
    creditUsed: v.number(),
    creditAvailable: v.number(),
    paymentTerms: v.number(),
    adminUsers: v.array(v.id("users")),
    users: v.array(v.id("users")),
    approvalWorkflow: v.optional(v.any()),
    spendingLimits: v.optional(v.any()),
    accountManager: v.optional(v.id("users")),
    tier: v.string(),
    monthlyFee: v.number(),
    discount: v.number(),
    totalOrders: v.number(),
    totalSpent: v.number(),
    documents: v.array(v.any()),
    billingCycle: v.string(),
    nextBillingDate: v.number(),
    status: v.string(),
  })
    .index("by_email", ["email"])
    .index("by_status", ["status"]),

  // Scheduled Orders
  scheduledOrders: defineTable({
    buyerId: v.id("buyers"),
    siteId: v.id("sites"),
    material: v.any(),
    quantity: v.number(),
    urgency: v.string(),
    recurrence: v.any(),
    nextOccurrence: v.number(),
    lastOrderCreated: v.optional(v.number()),
    totalOrdersCreated: v.number(),
    active: v.boolean(),
    pausedUntil: v.optional(v.number()),
  })
    .index("by_buyerId", ["buyerId"])
    .index("by_active", ["active"])
    .index("by_nextOccurrence", ["nextOccurrence"]),

  // Notifications
  notifications: defineTable({
    userId: v.id("users"),
    orderId: v.optional(v.id("orders")),
    orderNumber: v.optional(v.string()),
    type: v.string(),
    title: v.string(),
    body: v.string(),
    data: v.optional(v.any()),
    channels: v.array(v.string()),
    priority: v.string(),
    status: v.string(),
    scheduledAt: v.number(),
    sentAt: v.optional(v.number()),
    readAt: v.optional(v.number()),
    language: v.string(),
    expiresAt: v.optional(v.number()),
  })
    .index("by_userId", ["userId"])
    .index("by_status", ["status"])
    .index("by_sentAt", ["sentAt"])
    .index("by_orderId", ["orderId"])
    .index("by_scheduledAt", ["scheduledAt"]),

  // SMS Logs
  smsLogs: defineTable({
    supplierId: v.optional(v.id("suppliers")),
    orderId: v.optional(v.id("orders")),
    phoneNumber: v.string(),
    messageId: v.string(),
    status: v.string(),
    cost: v.number(),
    message: v.string(),
    error: v.optional(v.string()),
    timestamp: v.number(),
  })
    .index("by_supplierId", ["supplierId"])
    .index("by_orderId", ["orderId"])
    .index("by_status", ["status"])
    .index("by_timestamp", ["timestamp"]),

  // System Config
  systemConfig: defineTable({
    key: v.string(),
    value: v.any(),
    updatedAt: v.number(),
  }).index("by_key", ["key"]),
});