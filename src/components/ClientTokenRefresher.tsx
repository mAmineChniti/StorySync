"use client";

import { useTokenRefresh } from "@/hooks/useTokenRefresh";

export default function ClientTokenRefresher() {
  useTokenRefresh();
  return undefined;
}
