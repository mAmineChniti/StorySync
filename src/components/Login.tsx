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
import {
  checkAndRefreshToken,
  REFRESH_THRESHOLD,
} from "@/hooks/useTokenRefresh";
import { AuthService } from "@/lib/requests";
import type { LoginResponse } from "@/types/authInterfaces";
import { loginSchema } from "@/types/authSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { setCookie } from "cookies-next/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import type * as z from "zod";

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
  const loginMutation = useMutation<LoginResponse, Error, z.infer<typeof loginSchema>>({
    mutationFn: (data) => AuthService.login(data),
    onSuccess: async (userData: LoginResponse) => {
      try {
        setCookie("user", JSON.stringify(userData.user), {
          path: "/",
          sameSite: "lax",
          secure: window.location.protocol === "https:",
          expires: new Date(userData.tokens.access_expires_at),
        });
        setCookie("tokens", JSON.stringify(userData.tokens), {
          path: "/",
          sameSite: "lax",
          secure: window.location.protocol === "https:",
          expires: new Date(userData.tokens.refresh_expires_at),
        });
        const firstRefreshTime =
          new Date(userData.tokens.access_expires_at).getTime() -
          Date.now() -
          REFRESH_THRESHOLD;

        if (firstRefreshTime > 0) {
          setTimeout(() => {
            void checkAndRefreshToken();
          }, firstRefreshTime);
        }
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
          <Label className="text-red-500 mt-2" htmlFor="error">
            {errorMessage}
          </Label>
        )}
        <Button
          type="submit"
          className="w-full mt-4 cursor-pointer"
          disabled={loginMutation.isPending}
        >
          {loginMutation.isPending ? "Logging in..." : "Login"}
        </Button>
      </form>
    </Form>
  );
}
