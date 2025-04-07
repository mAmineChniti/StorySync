"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Dropzone from "@/components/ui/Dropzone";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { AuthService, StoryService } from "@/lib/requests";
import {
  calculateEighteenYearsAgo,
  cn,
  formatDate,
  parseCookie,
} from "@/lib/utils";
import { type UpdateRequest, type UserStruct } from "@/types/authInterfaces";
import { type profileUpdateSchema } from "@/types/authSchemas";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteCookie, setCookie } from "cookies-next";
import { CalendarIcon, Edit2, Loader2, Save, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type * as z from "zod";

export default function ProfileInfo() {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [user, setUser] = useState<UserStruct | undefined>(undefined);
  const [profilePicturePreview, setProfilePicturePreview] = useState<
    string | undefined
  >(undefined);
  const router = useRouter();

  const form = useForm<z.infer<typeof profileUpdateSchema>>({
    defaultValues: {
      username: "",
      email: "",
      first_name: "",
      last_name: "",
      birthdate: undefined,
      profile_picture: undefined,
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    parseCookie<UserStruct>("user")
      .then((userData) => {
        if (userData.success) setUser(userData.data);
      })
      .catch(() => {
        toast.error("Failed to parse user data", {
          description: "Please log in again.",
        });
        router.push("/login");
      });
  }, [router]);

  useEffect(() => {
    if (user) {
      form.reset({
        username: user.username,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        birthdate: user.birthdate ? new Date(user.birthdate) : undefined,
        password: "",
        confirmPassword: "",
      });
    }
  }, [user, form]);

  useEffect(() => {
    return () => {
      if (profilePicturePreview) URL.revokeObjectURL(profilePicturePreview);
    };
  }, [profilePicturePreview]);

  const updateMutation = useMutation<UserStruct, Error, UpdateRequest>({
    mutationFn: (data) => AuthService.updateProfile(data),
    onSuccess: async (data) => {
      toast.success("Profile updated successfully");
      queryClient.setQueryData(["userProfile"], data);
      await deleteCookie("user");
      await setCookie("user", JSON.stringify(data));
      setIsEditing(false);
    },
    onError: (error: Error) => {
      const errormsg =
        typeof error.message === "string"
          ? error.message
          : (JSON.parse(error.message) as { message: string }).message;
      toast.error(errormsg);
    },
  });

  const accountDeleteMutation = useMutation<void, Error>({
    mutationFn: async () => {
      await StoryService.deleteAllStories();
      await AuthService.deleteAccount();
    },
    onSuccess: async () => {
      toast.success("Account deleted successfully");
      await deleteCookie("user");
      await deleteCookie("auth_token");
      queryClient.removeQueries({ queryKey: ["userProfile"] });
      router.push("/login");
    },
    onError: (error: Error) => {
      const errormsg =
        typeof error.message === "string"
          ? error.message
          : (JSON.parse(error.message) as { message: string }).message;
      toast.error(errormsg);
    },
  });

  const onUpdateSubmit = (data: z.infer<typeof profileUpdateSchema>) => {
    if (!user) return;
    if (data.password && data.password !== data.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    const updatedData: UpdateRequest = {};
    if (data.username && data.username !== user.username)
      updatedData.username = data.username;
    if (data.email && data.email !== user.email) updatedData.email = data.email;
    if (data.first_name && data.first_name !== user.first_name)
      updatedData.first_name = data.first_name;
    if (data.last_name && data.last_name !== user.last_name)
      updatedData.last_name = data.last_name;
    if (
      data.birthdate &&
      (!user.birthdate ||
        new Date(user.birthdate).toISOString() !== data.birthdate.toISOString())
    ) {
      updatedData.birthdate = data.birthdate.toISOString();
    }
    if (data.password) updatedData.password = data.password;
    if (data.profile_picture)
      updatedData.profile_picture = data.profile_picture;
    if (Object.keys(updatedData).length > 0) {
      updateMutation.mutate(updatedData);
    } else {
      toast.info("No changes to update");
      setIsEditing(false);
    }
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (isEditing)
      form.reset({
        username: user?.username ?? "",
        email: user?.email ?? "",
        first_name: user?.first_name ?? "",
        last_name: user?.last_name ?? "",
        birthdate: user?.birthdate ? new Date(user.birthdate) : undefined,
        password: "",
        confirmPassword: "",
      });
  };

  return (
    <Card className="mx-auto max-w-7xl border-border">
      <CardHeader className="pb-2">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <CardTitle className="text-2xl">Profile Information</CardTitle>
            <CardDescription>Manage your personal information</CardDescription>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-2 cursor-pointer"
              onClick={handleEditToggle}
              disabled={updateMutation.isPending}
            >
              {updateMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Edit2 className="h-4 w-4" />
              )}
              {isEditing ? "Cancel" : "Edit"}
            </Button>
            <AlertDialog
              open={isDeleteDialogOpen}
              onOpenChange={(open) => {
                setIsDeleteDialogOpen(open);
              }}
            >
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  size="sm"
                  className="gap-2 cursor-pointer"
                  disabled={accountDeleteMutation.isPending}
                >
                  {accountDeleteMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                  {accountDeleteMutation.isPending
                    ? "Deleting..."
                    : "Delete Account"}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent
                onClick={() => setIsDeleteDialogOpen(false)}
                onEscapeKeyDown={() => setIsDeleteDialogOpen(false)}
                className="border-border bg-background text-foreground max-w-[95vw] sm:max-w-md mx-2 sm:mx-0 p-4 sm:p-6"
              >
                <AlertDialogHeader className="space-y-4">
                  <AlertDialogTitle className="text-lg sm:text-xl">
                    Confirm Deletion
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-sm sm:text-base">
                    This will permanently delete your account and all associated
                    stories.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-4 mt-6">
                  <AlertDialogCancel className="cursor-pointer border-border bg-muted text-muted-foreground hover:bg-muted/90 w-full sm:w-auto">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    className="cursor-pointer bg-destructive text-white hover:bg-destructive/70 w-full sm:w-auto"
                    disabled={accountDeleteMutation.isPending}
                    onClick={() => accountDeleteMutation.mutate()}
                  >
                    {accountDeleteMutation.isPending && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Confirm Deletion
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onUpdateSubmit)}
            className="space-y-4"
          >
            <div className="grid gap-4 md:grid-cols-2">
              {(["username", "email", "first_name", "last_name"] as const).map(
                (fieldName) => (
                  <FormField
                    key={fieldName}
                    name={fieldName}
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {fieldName
                            .split("_")
                            .map(
                              (word) =>
                                word.charAt(0).toUpperCase() + word.slice(1),
                            )
                            .join(" ")}
                        </FormLabel>
                        <FormControl>
                          <Input
                            disabled={!isEditing || updateMutation.isPending}
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                ),
              )}
              <FormField
                name="birthdate"
                control={form.control}
                render={({ field }) => {
                  const eighteenYearsAgo = calculateEighteenYearsAgo();
                  const dateValue = field.value
                    ? new Date(field.value)
                    : undefined;
                  return (
                    <FormItem>
                      <FormLabel>Birthdate</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full pl-3 text-left font-normal cursor-pointer",
                                !dateValue && "text-muted-foreground",
                              )}
                              disabled={!isEditing || updateMutation.isPending}
                            >
                              {dateValue ? (
                                formatDate(dateValue)
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
                            selected={dateValue}
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
                    </FormItem>
                  );
                }}
              />
            </div>
            {isEditing && (
              <>
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          className="w-full"
                          placeholder="New password"
                          disabled={updateMutation.isPending}
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          className="w-full"
                          placeholder="Confirm password"
                          disabled={updateMutation.isPending}
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="profile_picture"
                  render={({ field: { onChange } }) => (
                    <FormItem>
                      <FormLabel>Profile Picture</FormLabel>
                      <FormControl>
                        <Dropzone
                          onFileAccepted={(file) => {
                            if (file instanceof File) {
                              if (file.size > 10 * 1024 * 1024) {
                                toast.error("File size must not exceed 10MB");
                                return;
                              }
                              const reader = new FileReader();
                              reader.onload = () => {
                                const base64 = reader.result as string;
                                onChange(base64);
                                setProfilePicturePreview(base64);
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                          preview={profilePicturePreview}
                          disabled={!isEditing || updateMutation.isPending}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </>
            )}
            <div className="text-sm text-muted-foreground">
              Joined: {formatDate(user?.date_joined)}
            </div>
            {isEditing && (
              <div className="space-y-4">
                <Button
                  type="submit"
                  className="gap-2 cursor-pointer"
                  disabled={updateMutation.isPending}
                >
                  {updateMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Saving Changes...
                    </>
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
