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
import type * as orders_mutations from "../orders/mutations.js";
import type * as suppliers_SupplierNotification from "../suppliers/SupplierNotification.js";
import type * as suppliers_matching from "../suppliers/matching.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  "orders/create": typeof orders_create;
  "orders/mutations": typeof orders_mutations;
  "suppliers/SupplierNotification": typeof suppliers_SupplierNotification;
  "suppliers/matching": typeof suppliers_matching;
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
