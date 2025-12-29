import { createQueryBuilder } from "@taylordb/query-builder";
import type { TaylorDatabase } from "./taylordb.types";

let apiKey: string | undefined;

if (typeof window !== "undefined") {
  const searchParams = new URLSearchParams(window.location.search);
  const apiKeyFromParams = searchParams.get("apiKey");

  if (apiKeyFromParams) {
    // Store in session storage if found in search params
    sessionStorage.setItem("authToken", apiKeyFromParams);
    apiKey = apiKeyFromParams;
  } else {
    // If not in search params, try to get it from session storage
    apiKey = sessionStorage.getItem("authToken") ?? undefined;
  }
}

if (!apiKey) {
  throw new Error("No authentication token found");
}

export const queryBuilder = createQueryBuilder<TaylorDatabase>({
  baseUrl: import.meta.env.VITE_TAYLORDB_BASE_URL,
  baseId: import.meta.env.VITE_TAYLORDB_BASE_ID,
  apiKey,
});
