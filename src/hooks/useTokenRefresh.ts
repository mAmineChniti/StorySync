"use client";

import { parseCookie } from "@/lib";
import { AuthService } from "@/lib/requests";
import type { AccessToken, UserStruct } from "@/types/authInterfaces";
import { setCookie, deleteCookie } from "cookies-next/client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export const REFRESH_THRESHOLD = 5 * 60 * 1000;

const handleLogout = () => {
  deleteCookie("user");
  deleteCookie("access");
  deleteCookie("refresh");
};

export const checkAndRefreshToken = async () => {
  try {
    const accessResult = parseCookie<AccessToken>("access");
    const refreshResult = parseCookie<{ refresh_expires_at: string }>("refresh");
    const userResult = parseCookie<UserStruct>("user");

    if (!accessResult.success || !refreshResult.success || !userResult.success) {
      handleLogout();
      return { success: false };
    }

    const refreshExpiresAt = new Date(refreshResult.data.refresh_expires_at);
    if (refreshExpiresAt < new Date()) {
      handleLogout();
      return { success: false };
    }

    const accessExpiresAt = new Date(accessResult.data.access_expires_at);
    const timeUntilExpiry = accessExpiresAt.getTime() - Date.now();

    if (timeUntilExpiry < REFRESH_THRESHOLD) {
      const newTokens = await AuthService.refreshTokens();

      setCookie("access", JSON.stringify({
        access_token: newTokens.access_token,
        access_created_at: newTokens.access_created_at,
        access_expires_at: newTokens.access_expires_at,
      }), {
        path: "/",
        sameSite: "lax",
        secure: window.location.protocol === "https:",
        expires: new Date(newTokens.access_expires_at),
      });

      setCookie("refresh", JSON.stringify({
        refresh_token: newTokens.refresh_token,
        refresh_created_at: newTokens.refresh_created_at,
        refresh_expires_at: newTokens.refresh_expires_at,
      }), {
        path: "/",
        sameSite: "lax",
        secure: window.location.protocol === "https:",
        expires: new Date(newTokens.refresh_expires_at),
      });

      const nextRefreshTime = new Date(newTokens.access_expires_at).getTime()
        - Date.now()
        - REFRESH_THRESHOLD;

      if (nextRefreshTime > 0) {
        setTimeout(() => {
          void checkAndRefreshToken().catch((error) => {
            console.error("Scheduled refresh failed:", error);
          });
        }, nextRefreshTime);
      }

      return { success: true, expiresAt: newTokens.access_expires_at };
    }

    return { success: true };
  } catch (error) {
    console.error("Token refresh failed:", error);
    handleLogout();
    return { success: false };
  }
};

export const useTokenRefresh = () => {
  const router = useRouter();

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const checkAuthState = async () => {
      try {
        const result = await checkAndRefreshToken();

        if (!result.success) {
          router.push("/login");
          return;
        }

        if (result.expiresAt) {
          const nextCheck = new Date(result.expiresAt).getTime()
            - Date.now()
            - REFRESH_THRESHOLD;

          timeoutId = setTimeout(() => {
            void checkAuthState().catch((error) => {
              console.error("Background sync failed:", error);
            });
          }, nextCheck);
        }
      } catch (error) {
        console.error("Auth check failed:", error);
      }
    };

    void checkAuthState();

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        void checkAuthState().catch((error) => {
          console.error("Visibility check failed:", error);
        });
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [router]);
};
