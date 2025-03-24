"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { formatDate } from "@/lib";
import { AuthService } from "@/lib/requests";
import { cn } from "@/lib/utils";
import type { RegisterRequest, RegisterResponse } from "@/types/authInterfaces";
import { registerSchema } from "@/types/authSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { CalendarIcon, Loader2 } from "lucide-react";
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
      first_name: "",
      last_name: "",
      birthdate: undefined,
    },
  });
  const router = useRouter();

  const registerMutation = useMutation<
    RegisterResponse,
    Error,
    RegisterRequest
  >({
    mutationFn: (data) => AuthService.register(data),
    onSuccess: () => {
      router.push("/login");
    },
    onError: (error) => {
      setErrorMessage(error.message);
      form.reset();
    },
  });

  const onSubmit = (data: z.infer<typeof registerSchema>) => {
    const registerData: RegisterRequest = {
      username: data.username,
      email: data.email,
      password: data.password,
      first_name: data.first_name,
      last_name: data.last_name,
      birthdate: data.birthdate.toISOString(),
    };
    registerMutation.mutate(registerData);
  };

  return (
    <div className="w-full">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 w-full"
        >
          <FormField
            name="username"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Your username"
                    className="bg-card/50 border-border focus:bg-card focus:ring-2 focus:ring-primary transition-colors"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="first_name"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Your first name"
                    className="bg-card/50 border-border focus:bg-card focus:ring-2 focus:ring-primary transition-colors"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="last_name"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Your last name"
                    className="bg-card/50 border-border focus:bg-card focus:ring-2 focus:ring-primary transition-colors"
                    {...field}
                  />
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
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="you@example.com"
                    className="bg-card/50 border-border focus:bg-card focus:ring-2 focus:ring-primary transition-colors"
                    {...field}
                  />
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
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="••••••"
                    className="bg-card/50 border-border focus:bg-card focus:ring-2 focus:ring-primary transition-colors"
                    {...field}
                  />
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
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="••••••"
                    className="bg-card/50 border-border focus:bg-card focus:ring-2 focus:ring-primary transition-colors"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="birthdate"
            control={form.control}
            render={({ field }) => {
              // Calculate minimum valid birthdate (18 years ago from today)
              const eighteenYearsAgo = new Date();
              eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);

              return (
                <FormItem className="flex flex-col">
                  <FormLabel>Birthdate</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full pl-3 text-left font-normal bg-card/50 border-border focus:bg-card focus:ring-2 focus:ring-primary transition-colors",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          {field.value ? (
                            formatDate(field.value)
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={(selectedDate) => {
                          if (
                            selectedDate &&
                            selectedDate <= eighteenYearsAgo
                          ) {
                            field.onChange(selectedDate);
                          }
                        }}
                        disabled={(date) => date > eighteenYearsAgo}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              );
            }}
          />

          {errorMessage && (
            <div className="text-destructive text-sm font-medium p-2 rounded bg-destructive/10">
              {errorMessage}
            </div>
          )}

          <Button
            type="submit"
            className="w-full h-12 text-base transition-opacity cursor-pointer"
            disabled={registerMutation.isPending}
          >
            {registerMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Account...
              </>
            ) : (
              "Create Account"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
