"use client";

import { refreshTokens } from "@/lib/auth";
import type { Tokens, UserStruct } from "@/types/authInterfaces";
import { getCookie, setCookie } from "cookies-next/client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export const REFRESH_THRESHOLD = 5 * 60 * 1000;

export const checkAndRefreshToken = async () => {
  const tokensCookie = getCookie("tokens");
  if (!tokensCookie) return;
  const userCookie = getCookie("user");
  if (!userCookie) return;

  try {
    const tokens: Tokens = JSON.parse(tokensCookie.toString()) as Tokens;
    const accessExpiresAt = new Date(tokens.access_expires_at);
    const now = new Date();
    const user: UserStruct = JSON.parse(userCookie.toString()) as UserStruct;

    if (accessExpiresAt.getTime() - now.getTime() < REFRESH_THRESHOLD) {
      const newTokens = await refreshTokens(tokens.refresh_token);

      setCookie("tokens", JSON.stringify(newTokens), {
        path: "/",
        sameSite: "lax",
        secure: window.location.protocol === "https:",
        expires: new Date(newTokens.refresh_expires_at),
      });

      setCookie("user", JSON.stringify(user), {
        path: "/",
        sameSite: "lax",
        secure: window.location.protocol === "https:",
        expires: new Date(newTokens.refresh_expires_at),
      });

      scheduleRefresh(newTokens.access_expires_at);
    }
  } catch (error) {
    console.error("Token refresh failed:", error);
    setCookie("user", "", { expires: new Date(0) });
    setCookie("tokens", "", { expires: new Date(0) });
  }
};

export const scheduleRefresh = (expiration: string) => {
  const expirationTime = new Date(expiration).getTime();
  const timeUntilRefresh = expirationTime - Date.now() - REFRESH_THRESHOLD;

  if (timeUntilRefresh > 0) {
    setTimeout(() => {
      void checkAndRefreshToken();
    }, timeUntilRefresh);
  }
};

export const useTokenRefresh = () => {
  const router = useRouter();

  useEffect(() => {
    (async () => {
      await checkAndRefreshToken();
    })().catch((error) => {
      console.error("Initial token check failed:", error);
    });

    const interval = setInterval(() => {
      void checkAndRefreshToken();
    }, 60 * 1000);

    return () => clearInterval(interval);
  }, [router]);
};
