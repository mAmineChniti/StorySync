"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { CalendarIcon, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type * as z from "zod";

import { TermsOfServiceModal } from "@/components/TermsOfServiceModal";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
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
import { AuthService } from "@/lib/requests";
import {
  calculateEighteenYearsAgo,
  cn,
  formatDate,
  readFileAsBase64,
} from "@/lib/utils";
import type { RegisterRequest, RegisterResponse } from "@/types/authInterfaces";
import { registerSchema } from "@/types/authSchemas";

export default function Register() {
  const [checked, setChecked] = useState(false);
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
      accept_terms: false,
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
    onError: (error: Error) => {
      let errormsg = "";
      errormsg =
        typeof error.message === "string"
          ? error.message
          : (JSON.parse(error.message) as { message: string }).message;
      toast.error(errormsg);
    },
  });

  const onSubmit = async (data: z.infer<typeof registerSchema>) => {
    const profilePictureBase64 = await readFileAsBase64(
      "/default-profile-picture.png",
    );
    const registerData: RegisterRequest = {
      username: data.username,
      email: data.email,
      password: data.password,
      first_name: data.first_name,
      last_name: data.last_name,
      birthdate: data.birthdate.toISOString(),
      accept_terms: data.accept_terms,
      profile_picture: profilePictureBase64,
    };
    registerMutation.mutate(registerData);
  };

  return (
    <div className="w-full">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-3 w-full"
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
                    autoComplete="email"
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
              const eighteenYearsAgo = calculateEighteenYearsAgo();

              return (
                <FormItem className="flex flex-col">
                  <FormLabel>Birthdate</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full pl-3 text-left font-normal bg-card/50 border-border focus:bg-card focus:ring-2 focus:ring-primary transition-colors cursor-pointer",
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

          <FormField
            name="accept_terms"
            control={form.control}
            render={({ field }) => (
              <FormItem className="flex items-center space-x-2">
                <FormControl>
                  <Checkbox
                    checked={checked}
                    onCheckedChange={(checked) => {
                      setChecked(checked as boolean);
                      field.onChange(checked);
                    }}
                  />
                </FormControl>
                <FormLabel className="!m-0">
                  I accept the{" "}
                  <TermsOfServiceModal
                    onAccept={() => {
                      setChecked(true);
                    }}
                  />
                </FormLabel>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full h-12 text-base transition-opacity cursor-pointer"
            disabled={registerMutation.isPending || !checked}
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
