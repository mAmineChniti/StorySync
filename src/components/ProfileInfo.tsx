'use client';

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useState, useEffect } from "react";
import { Edit2, Save } from "lucide-react";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { type UserStruct } from "@/types/authInterfaces";
import { env } from '@/env';
import { getAccessToken } from "@/lib";

const NEXT_PUBLIC_AUTH_API_URL = env.NEXT_PUBLIC_AUTH_API_URL;

const fetchUserProfile = async (): Promise<UserStruct> => {
  const authToken = getAccessToken();
  if (!authToken) {
    throw new Error("No authentication token found");
  }

  const response = await fetch(`${NEXT_PUBLIC_AUTH_API_URL}/fetchuser`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch user profile");
  }

  const responseData = await response.json() as { message: string, user: UserStruct };
  return responseData.user;
};

const updateUserProfile = async (updatedData: Partial<UserStruct>): Promise<UserStruct> => {
  const authToken = getAccessToken();
  if (!authToken) {
    throw new Error("No authentication token found");
  }

  const response = await fetch(`${NEXT_PUBLIC_AUTH_API_URL}/update`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify(updatedData),
  });

  if (!response.ok) {
    throw new Error("Failed to update profile");
  }
  const responseData = await response.json() as { message: string, user: UserStruct };
  return responseData.user;
};

export default function ProfileInfo() {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const { data: user, isLoading, isError } = useQuery<UserStruct>({
    queryKey: ["userProfile"],
    queryFn: fetchUserProfile,
  });

  const form = useForm<Partial<UserStruct>>({
    defaultValues: {
      username: "",
      email: "",
      first_name: "",
      last_name: "",
    },
  });

  useEffect(() => {
    if (user) {
      form.setValue("username", user.username);
      form.setValue("email", user.email);
      form.setValue("first_name", user.first_name);
      form.setValue("last_name", user.last_name);
    }
  }, [user, form]);

  const mutation = useMutation({
    mutationFn: updateUserProfile,
    onSuccess: (data) => {
      form.setValue("username", data.username);
      form.setValue("email", data.email);
      form.setValue("first_name", data.first_name);
      form.setValue("last_name", data.last_name);

      queryClient.setQueryData(["userProfile"], data);

      setIsEditing(false);
    },
    onError: (error: string) => {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
    },
  });

  const onSubmit = (formData: Partial<UserStruct>) => {
    mutation.mutate(formData);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-1/3 mb-2" />
          <Skeleton className="h-4 w-2/3" />
        </CardHeader>
        <CardContent className="space-y-6">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Error</CardTitle>
          <CardDescription>There was an error loading your profile. Please try again later.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-2xl">Profile Information</CardTitle>
            <CardDescription>View and manage your personal information</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={() => setIsEditing(!isEditing)}>
            {isEditing ? (
              <>
                <Edit2 className="h-4 w-4 mr-2" />
                Cancel
              </>
            ) : (
              <>
                <Edit2 className="h-4 w-4 mr-2" />
                Edit Profile
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField name="username" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input
                    disabled={!isEditing}
                    placeholder="Username"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )} />

            <FormField name="email" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    disabled={!isEditing}
                    placeholder="Email"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )} />

            <FormField name="first_name" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input
                    disabled={!isEditing}
                    placeholder="First Name"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )} />

            <FormField name="last_name" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input
                    disabled={!isEditing}
                    placeholder="Last Name"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )} />

            <div className="mt-4 text-sm text-gray-500">
              Joined: {user?.date_joined ? new Date(user.date_joined).toLocaleDateString() : "N/A"}
            </div>

            {isEditing && (
              <Button type="submit" className="w-full md:w-auto" disabled={mutation.isPending}>
                {mutation.isPending ? "Saving..." : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            )}
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
