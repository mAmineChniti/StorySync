import type {
  AccessToken,
  RefreshToken,
  UserStruct,
} from "@/types/authInterfaces";
import { getCookie } from "cookies-next";

type SafeParseResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

export const parseCookie = <T>(cookieName: string): SafeParseResult<T> => {
  try {
    const cookieValue = getCookie(cookieName);
    if (typeof cookieValue !== "string")
      return { success: false, error: `Cookie ${cookieName} not found` };
    return { success: true, data: JSON.parse(cookieValue) as T };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return { success: false, error: errorMessage };
  }
};

const getToken = (
  cookieName: "access" | "refresh",
  tokenField: keyof AccessToken | keyof RefreshToken,
): string | null => {
  const result =
    cookieName === "access"
      ? parseCookie<AccessToken>(cookieName)
      : parseCookie<RefreshToken>(cookieName);

  if (!result.success) {
    return null;
  }

  const token = result.data[tokenField as keyof typeof result.data] as string;
  return typeof token === "string" ? token.trim() : null;
};

export const getAccessToken = (): string | null =>
  getToken("access", "access_token");
export const getRefreshToken = (): string | null =>
  getToken("refresh", "refresh_token");

export const getAuthHeaders = (): HeadersInit => {
  const token = getAccessToken();
  if (!token) {
    return {};
  }
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

export const getRefreshHeaders = (): HeadersInit => {
  const token = getRefreshToken();
  if (!token) {
    window.location.href = "/login";
    return {};
  }
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

export const formatDate = (
  dateInput: string | Date | null | undefined,
): string => {
  const fallback = "N/A";
  if (!dateInput) return fallback;

  const date = dateInput instanceof Date ? dateInput : new Date(dateInput);
  if (!Number.isFinite(date.getTime())) return fallback;

  try {
    return new Intl.DateTimeFormat("en-GB", {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "UTC",
    }).format(date);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`Date formatting failed: ${errorMessage}`);
    return fallback;
  }
};

export const getUserId = (): string | null => {
  const result = parseCookie<UserStruct>("user");
  if (!result.success) {
    return null;
  }

  const userId = result.data.id?.trim();
  return userId?.length ? userId : null;
};
