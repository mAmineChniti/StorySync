"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { env } from "@/env";
import type { LoginResponse } from "@/types/authInterfaces";
import { loginSchema } from "@/types/authSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { setCookie } from "cookies-next/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import type * as z from "zod";

const loginUser = async (
  data: z.infer<typeof loginSchema>,
): Promise<LoginResponse> => {
  const NEXT_PUBLIC_AUTH_API_URL = env.NEXT_PUBLIC_AUTH_API_URL;
  const response = await fetch(`${NEXT_PUBLIC_AUTH_API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Login failed");
  }

  return (await response.json()) as LoginResponse;
};

export default function Login() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });
  const router = useRouter();
  const loginMutation = useMutation({
    mutationFn: loginUser,
    onSuccess: async (userData: LoginResponse) => {
      try {
        setCookie("user", JSON.stringify(userData.user), {
          path: "/",
          sameSite: "lax",
          secure: window.location.protocol === "https:",
        });
        setCookie("tokens", JSON.stringify(userData.tokens), {
          path: "/",
          sameSite: "lax",
          secure: window.location.protocol === "https:",
        });
        setErrorMessage(null);
        router.push("/browse");
      } catch (error) {
        console.error("Error setting cookies:", error);
        setErrorMessage("Failed to set cookies");
      }
    },
    onError: (error: unknown) => {
      const typedError =
        error instanceof Error ? error : new Error("An unknown error occurred");
      setErrorMessage(typedError.message);
      form.reset();
    },
  });

  const onSubmit = (data: z.infer<typeof loginSchema>) => {
    loginMutation.mutate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          name="identifier"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="mt-2">Email</FormLabel>
              <FormControl>
                <Input placeholder="you@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="password"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="mt-2">Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {errorMessage && (
          <Label className="text-red-500" htmlFor="error">
            {errorMessage}
          </Label>
        )}
        <Button
          type="submit"
          className="w-full mt-4"
          disabled={loginMutation.isPending}
        >
          {loginMutation.isPending ? "Logging in..." : "Login"}
        </Button>
      </form>
    </Form>
  );
}
