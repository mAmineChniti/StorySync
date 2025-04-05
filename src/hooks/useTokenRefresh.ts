"use client";

import { deleteCookie, setCookie } from "cookies-next";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

import { AuthService } from "@/lib/requests";
import { parseCookie } from "@/lib/utils";
import type {
  AccessToken,
  RefreshToken,
  UserStruct,
} from "@/types/authInterfaces";

const REFRESH_THRESHOLD = 5 * 60 * 1000;

const handleLogout = async () => {
  await Promise.all([
    deleteCookie("user"),
    deleteCookie("access"),
    deleteCookie("refresh"),
  ]);
  window.location.href = "/";
};

export const checkAndRefreshToken = async () => {
  try {
    const accessResult = await parseCookie<AccessToken>("access");
    const refreshResult = await parseCookie<RefreshToken>("refresh");
    const userResult = await parseCookie<UserStruct>("user");

    if (
      !accessResult.success ||
      !refreshResult.success ||
      !userResult.success
    ) {
      await handleLogout();
      return { success: false };
    }

    const refreshExpiresAt = new Date(refreshResult.data.refresh_expires_at);
    if (refreshExpiresAt < new Date()) {
      await handleLogout();
      return { success: false };
    }

    const accessExpiresAt = new Date(accessResult.data.access_expires_at);
    const timeUntilExpiry = accessExpiresAt.getTime() - Date.now();

    if (timeUntilExpiry < REFRESH_THRESHOLD) {
      const newTokens = await AuthService.refreshTokens();

      const cookieOptions = {
        path: "/",
        sameSite: "lax" as const,
        secure: globalThis.location?.protocol === "https:",
        expires: new Date(newTokens.access_expires_at),
      };

      await Promise.all([
        setCookie("user", JSON.stringify(userResult.data), cookieOptions),

        setCookie(
          "access",
          JSON.stringify({
            access_token: newTokens.access_token,
            access_created_at: newTokens.access_created_at,
            access_expires_at: newTokens.access_expires_at,
          }),
          cookieOptions,
        ),

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
            secure: globalThis.location?.protocol === "https:",
            expires: new Date(newTokens.refresh_expires_at),
          },
        ),
      ]);

      const nextRefreshTime =
        new Date(newTokens.access_expires_at).getTime() -
        Date.now() -
        REFRESH_THRESHOLD;

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
    await handleLogout();
    return { success: false };
  }
};

export const useTokenRefresh = () => {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const isOuterPage =
      pathname === "/login" ||
      pathname === "/register" ||
      pathname === "/terms-of-service" ||
      pathname === "/privacy-policy";
    let timeoutId: number;

    const checkAuthState = async () => {
      try {
        const result = await checkAndRefreshToken();

        if (!result.success) {
          if (!isOuterPage) {
            router.push("/");
          }
          return;
        }

        if (result.expiresAt) {
          const nextCheck =
            new Date(result.expiresAt).getTime() -
            Date.now() -
            REFRESH_THRESHOLD;

          timeoutId = setTimeout(() => {
            void checkAuthState().catch((error) => {
              console.error("Background sync failed:", error);
            });
          }, nextCheck) as unknown as number;
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
  }, [router, pathname]);
};
