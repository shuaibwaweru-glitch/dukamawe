/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as orders_create from "../orders/create.js";
import type * as simple from "../simple.js";
import type * as suppliers_OrderDetails from "../suppliers/OrderDetails.js";
import type * as suppliers_SupplierDashboard from "../suppliers/SupplierDashboard.js";
import type * as suppliers_matching from "../suppliers/matching.js";
import type * as suppliers_mutations from "../suppliers/mutations.js";
import type * as suppliers_queries from "../suppliers/queries.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  "orders/create": typeof orders_create;
  simple: typeof simple;
  "suppliers/OrderDetails": typeof suppliers_OrderDetails;
  "suppliers/SupplierDashboard": typeof suppliers_SupplierDashboard;
  "suppliers/matching": typeof suppliers_matching;
  "suppliers/mutations": typeof suppliers_mutations;
  "suppliers/queries": typeof suppliers_queries;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
