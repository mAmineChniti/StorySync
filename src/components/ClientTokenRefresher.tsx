"use client";

import { useTokenRefresh } from "@/hooks/useTokenRefresh";

export const ClientTokenRefresher = () => {
  useTokenRefresh();
  return undefined;
};
