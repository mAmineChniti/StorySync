"use client";

import { parseCookie } from "@/lib";
import { AuthService } from "@/lib/requests";
import type { AccessToken, UserStruct } from "@/types/authInterfaces";
import { setCookie } from "cookies-next/client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export const REFRESH_THRESHOLD = 5 * 60 * 1000;

export const checkAndRefreshToken = async () => {
  const accessResult = parseCookie<AccessToken>("access");
  const userResult = parseCookie<UserStruct>("user");

  if (!accessResult.success || !userResult.success) {
    return;
  }

  try {
    const access = accessResult.data;
    const user = userResult.data;

    const accessExpiresAt = new Date(access.access_expires_at);
    const now = new Date();

    if (accessExpiresAt.getTime() - now.getTime() < REFRESH_THRESHOLD) {
      const newTokens = await AuthService.refreshTokens();

      setCookie(
        "access",
        JSON.stringify({
          access_token: newTokens.access_token,
          access_created_at: newTokens.access_created_at,
          access_expires_at: newTokens.access_expires_at,
        }),
        {
          path: "/",
          sameSite: "lax",
          secure: window.location.protocol === "https:",
          expires: new Date(newTokens.access_expires_at),
        },
      );

      setCookie(
        "refresh",
        JSON.stringify({
          refresh_token: newTokens.refresh_token,
          refresh_created_at: newTokens.refresh_created_at,
          refresh_expires_at: newTokens.refresh_expires_at,
        }),
        {
          path: "/",
          sameSite: "lax",
          secure: window.location.protocol === "https:",
          expires: new Date(newTokens.refresh_expires_at),
        },
      );

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
    setCookie("access", "", { expires: new Date(0) });
    setCookie("refresh", "", { expires: new Date(0) });
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
