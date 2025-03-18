import { env } from "@/env";
import { type Tokens } from "@/types/authInterfaces";

export const refreshTokens = async (refreshToken: string): Promise<Tokens> => {
  const NEXT_PUBLIC_AUTH_API_URL = env.NEXT_PUBLIC_AUTH_API_URL;
  const response = await fetch(`${NEXT_PUBLIC_AUTH_API_URL}/refresh`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${refreshToken}`,
    },
  });

  if (!response.ok) throw new Error("Token refresh failed");

  const data = (await response.json()) as { message: string; tokens: Tokens };
  return data.tokens;
};
