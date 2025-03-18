import ObjectId from "bson-objectid";
import { getCookie } from "cookies-next/client";
import { type Tokens, type UserStruct } from "./types/authInterfaces";
export const getAccessToken = (): string | null => {
  const tokenString = getCookie("tokens");
  if (!tokenString) return null;
  try {
    const tokens = JSON.parse(tokenString) as Tokens;
    return tokens.access_token || null;
  } catch (error) {
    console.error("Invalid token format", error);
    return null;
  }
};

export const getRefreshToken = (): string | null => {
  const tokenString = getCookie("tokens");
  if (!tokenString) return null;
  try {
    const tokens = JSON.parse(tokenString) as Tokens;
    return tokens.refresh_token || null;
  } catch (error) {
    console.error("Invalid token format", error);
    return null;
  }
};

export const formatDate = (dateString: string | Date): string => {
  if (!dateString) {
    console.error("Invalid date:", dateString);
    return "N/A";
  }

  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    console.error("Invalid date:", dateString);
    return "N/A";
  }

  return date.toLocaleDateString("en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const getUserId = (): ObjectId | null => {
  const tokenString = getCookie("user");
  if (!tokenString) return null;
  try {
    const user = JSON.parse(tokenString) as UserStruct;
    return new ObjectId(user.id) || null;
  } catch (error) {
    console.error("Invalid token format", error);
    return null;
  }
};
