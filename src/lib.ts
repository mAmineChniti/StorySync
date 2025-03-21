import { getCookie } from "cookies-next";
import { type Tokens, type UserStruct } from "@/types/authInterfaces";

type SafeParseResult<T> = { success: true; data: T } | { success: false; error: unknown };

const parseCookie = <T>(cookieName: string): SafeParseResult<T> => {
  try {
    const cookieValue = getCookie(cookieName);

    if (typeof cookieValue !== 'string') {
      return {
        success: false,
        error: new Error(`Cookie ${cookieName} contains non-string value`)
      };
    }

    return {
      success: true,
      data: JSON.parse(cookieValue) as T
    };
  } catch (error) {
    return {
      success: false,
      error
    };
  }
};

const getToken = <K extends keyof Tokens>(tokenType: K): string | null => {
  const result = parseCookie<Tokens>("tokens");
  if (!result.success) {
    console.error(
      `Failed to parse tokens cookie: ${result.error instanceof Error ? result.error.message : String(result.error)}`
    );
    return null;
  }
  return result.data[tokenType]?.trim() || null;
};

export const getAccessToken = (): string | null => getToken("access_token");
export const getRefreshToken = (): string | null => getToken("refresh_token");

export const getAuthHeaders = (): HeadersInit => {
  const token = getAccessToken();
  if (!token) throw new Error("Authorization token not found in cookies");

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

export const getRefreshHeaders = (): HeadersInit => {
  const token = getRefreshToken();
  if (!token) throw new Error("Refresh token not found in cookies");

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

export const formatDate = (dateInput: string | Date | null | undefined): string => {
  const fallback = "N/A";

  if (!dateInput) return fallback;

  const date = dateInput instanceof Date ? dateInput : new Date(dateInput);

  if (!Number.isFinite(date.getTime())) {
    console.error(`Invalid date format received: ${String(dateInput)}`);
    return fallback;
  }

  try {
    return new Intl.DateTimeFormat("en-GB", {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "UTC"
    }).format(date);
  } catch (error) {
    console.error(`Date formatting failed: ${error instanceof Error ? error.message : String(error)}`);
    return fallback;
  }
};

export const getUserId = (): string | null => {
  const result = parseCookie<UserStruct>("user");

  if (!result.success) {
    console.error(
      "Failed to parse user cookie:",
      result.error instanceof Error ? result.error.message : String(result.error)
    );
    return null;
  }

  const userId = result.data.id?.trim();

  if (!userId && userId.trim().length === 0) {
    console.error("Invalid or missing user ID in cookie");
    return null;
  }

  try {
    return userId;
  } catch (error) {
    console.error(
      "ObjectId creation failed:",
      error instanceof Error ? error.message : String(error)
    );
    return null;
  }
};
