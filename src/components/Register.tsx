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
import { AuthService } from "@/lib/requests";
import type { RegisterResponse } from "@/types/authInterfaces";
import { registerSchema } from "@/types/authSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { setCookie } from "cookies-next/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import type * as z from "zod";

export default function Register() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const form = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
    },
  });
  const router = useRouter();
  const registerMutation = useMutation<
    RegisterResponse,
    unknown,
    z.infer<typeof registerSchema>
  >({
    mutationFn: (data) => AuthService.register(data),
    onSuccess: async (userData) => {
      try {
        setCookie("user", JSON.stringify(userData.user));
        setCookie("tokens", JSON.stringify(userData.tokens));
        setErrorMessage(null);
        router.push("/browse");
      } catch (error) {
        console.error("Error setting cookies:", error);
        setErrorMessage("Error setting cookies");
      }
    },
    onError: (error: unknown) => {
      const typedError =
        error instanceof Error ? error : new Error("An unknown error occurred");
      setErrorMessage(typedError.message);
      form.reset();
    },
  });

  const onSubmit = (data: z.infer<typeof registerSchema>) => {
    registerMutation.mutate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          name="username"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="mt-2">Username</FormLabel>
              <FormControl>
                <Input placeholder="Your Username" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="firstName"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="mt-2">First Name</FormLabel>
              <FormControl>
                <Input placeholder="Your First Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="lastName"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="mt-2">Last Name</FormLabel>
              <FormControl>
                <Input placeholder="Your Last Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="email"
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
        <FormField
          name="confirmPassword"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="mt-2">Confirm Password</FormLabel>
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
          disabled={registerMutation.isPending}
        >
          {registerMutation.isPending ? "Registering..." : "Register"}
        </Button>
      </form>
    </Form>
  );
}
