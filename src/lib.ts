import { getCookie } from "cookies-next/client";
import { type Tokens, type UserStruct } from "./types/authInterfaces";

const getAccessToken = (): string | null => {
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

const formatDate = (dateString: string | Date): string => {
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

const getUserId = (): string | null => {
  const tokenString = getCookie("user");
  if (!tokenString) return null;
  try {
    const user = JSON.parse(tokenString) as UserStruct;
    return user.id || null;
  } catch (error) {
    console.error("Invalid token format", error);
    return null;
  }
};

export { formatDate, getAccessToken, getUserId };
