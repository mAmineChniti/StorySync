"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AuthService } from "@/lib/requests";
import { type UserStruct } from "@/types/authInterfaces";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteCookie, getCookie, setCookie } from "cookies-next/client";
import { Edit2, Save, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export default function ProfileInfo() {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const router = useRouter();

  const [user, setUser] = useState<UserStruct | null>(null);

  useEffect(() => {
    const userData = getCookie("user");
    if (userData) {
      setUser(JSON.parse(userData) as UserStruct);
    }
  }, []);

  const form = useForm<Partial<UserStruct>>({
    defaultValues: {
      username: user?.username ?? "",
      email: user?.email ?? "",
      first_name: user?.first_name ?? "",
      last_name: user?.last_name ?? "",
    },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        username: user.username,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
      });
    }
  }, [user, form]);

  const mutation = useMutation<UserStruct, Error, Partial<UserStruct>>({
    mutationFn: (data) => AuthService.updateProfile(data),
    onSuccess: (data) => {
      if (data) {
        form.setValue("username", data.username);
        form.setValue("email", data.email);
        form.setValue("first_name", data.first_name);
        form.setValue("last_name", data.last_name);

        queryClient.setQueryData(["userProfile"], data);
        deleteCookie("user");
        setCookie("user", JSON.stringify(data));
        setIsEditing(false);
      }
    },
    onError: (error) => {
      console.error("Error updating profile:", error);
    },
  });

  const onSubmit = (formData: Partial<UserStruct>) => {
    mutation.mutate(formData);
  };

  if (!user) {
    return (
      <Card className="bg-card text-card-foreground border-border">
        <CardHeader>
          <CardTitle>Error</CardTitle>
          <CardDescription className="text-muted-foreground">
            Could not load profile. Please re-login and try again.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            variant="secondary"
            onClick={() => router.push("/login")}
          >
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  function handleDeleteUser(): void {
    throw new Error("Function not implemented.");
  }

  return (
    <Card className="bg-card text-card-foreground border-border">
      <CardHeader className="pb-2">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <CardTitle className="text-2xl">Profile Information</CardTitle>
            <CardDescription className="text-muted-foreground">
              View and manage your personal information
            </CardDescription>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              size="sm"
              className="border-border text-foreground hover:bg-accent gap-2"
              onClick={() => setIsEditing(!isEditing)}
            >
              <Edit2 className="h-4 w-4" />
              {isEditing ? "Cancel" : "Edit Profile"}
            </Button>
            <Button
              variant="destructive"
              size="sm"
              className="gap-2"
              onClick={() => handleDeleteUser()}
            >
              <Trash2 className="h-4 w-4" />
              Delete Account
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                name="username"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input
                        disabled={!isEditing}
                        placeholder="Username"
                        className="bg-background text-foreground border-border"
                        {...field}
                      />
                    </FormControl>
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
                        disabled={!isEditing}
                        placeholder="Email"
                        className="bg-background text-foreground border-border"
                        {...field}
                      />
                    </FormControl>
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
                        disabled={!isEditing}
                        placeholder="First Name"
                        className="bg-background text-foreground border-border"
                        {...field}
                      />
                    </FormControl>
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
                        disabled={!isEditing}
                        placeholder="Last Name"
                        className="bg-background text-foreground border-border"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <div className="text-sm text-muted-foreground">
              Joined:{" "}
              {user?.date_joined
                ? new Date(user.date_joined).toLocaleDateString("en-GB")
                : "N/A"}
            </div>

            {isEditing && (
              <div className="space-y-4">
                {mutation.isError && (
                  <div className="text-sm text-destructive">
                    {mutation.error instanceof Error
                      ? mutation.error.message
                      : "An unexpected error occurred. Please try again."}
                  </div>
                )}
                <Button
                  type="submit"
                  className="w-full md:w-auto gap-2"
                  disabled={mutation.isPending}
                >
                  {mutation.isPending ? (
                    "Saving..."
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            )}
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
