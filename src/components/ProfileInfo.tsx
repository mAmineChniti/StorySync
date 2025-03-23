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
import { formatDate, parseCookie } from "@/lib";
import { AuthService } from "@/lib/requests";
import { cn } from "@/lib/utils";
import { type UserStruct } from "@/types/authInterfaces";
import { eighteenYearsAgo } from "@/types/authSchemas";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteCookie, setCookie } from "cookies-next/client";
import { format } from "date-fns";
import { CalendarIcon, Edit2, Loader2, Save, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export default function ProfileInfo() {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [user, setUser] = useState<UserStruct | null>(null);
  const router = useRouter();

  const form = useForm<Partial<UserStruct>>({
    defaultValues: {
      username: "",
      email: "",
      first_name: "",
      last_name: "",
      birthdate: "",
    },
  });

  useEffect(() => {
    const userData = parseCookie<UserStruct>("user");
    if (userData.success) setUser(userData.data);
  }, []);

  useEffect(() => {
    if (user) {
      form.reset(user);
    }
  }, [user, form]);

  const updateMutation = useMutation({
    mutationFn: (data: Partial<UserStruct>) => AuthService.updateProfile(data),
    onSuccess: (data) => {
      if (data) {
        queryClient.setQueryData(["userProfile"], data);
        deleteCookie("user");
        setCookie("user", JSON.stringify(data));
        setIsEditing(false);
        setUpdateError(null);
      }
    },
    onError: (error: Error) => {
      setUpdateError(error.message || "Failed to update profile");
    },
  });

  const onUpdateSubmit = (data: Partial<UserStruct>) => {
    updateMutation.mutate(data);
  };

  const deleteMutation = useMutation({
    mutationFn: () => AuthService.deleteAccount(),
    onSuccess: () => {
      deleteCookie("user");
      deleteCookie("auth_token");
      queryClient.removeQueries({ queryKey: ["userProfile"] });
      router.push("/login");
    },
    onError: (error: Error) => {
      setDeleteError(error.message || "Failed to delete account");
    },
  });

  const onDeleteSubmit = () => {
    deleteMutation.mutate();
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    setUpdateError(null);
    if (isEditing) form.reset(user!);
  };

  const onDeleteCancel = () => {
    setIsDeleteDialogOpen(false);
    setDeleteError(null);
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
                if (!open) {
                  onDeleteCancel();
                } else {
                  setIsDeleteDialogOpen(true);
                }
              }}
            >
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  size="sm"
                  type="button"
                  className="gap-2 cursor-pointer"
                  disabled={deleteMutation.isPending}
                >
                  {deleteMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                  {deleteMutation.isPending ? "Deleting..." : "Delete Account"}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent
                onClick={onDeleteCancel}
                onEscapeKeyDown={() => onDeleteCancel}
                className="border-border bg-background text-foreground max-w-[95vw] sm:max-w-md mx-2 sm:mx-0 p-4 sm:p-6"
              >
                <AlertDialogHeader className="space-y-4">
                  <AlertDialogTitle className="text-lg sm:text-xl">
                    Confirm Deletion
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-sm sm:text-base">
                    This will permanently delete your account and all data.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                {deleteError && (
                  <div className="text-destructive text-sm px-6">
                    {deleteError}
                  </div>
                )}
                <AlertDialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-4 mt-6">
                  <AlertDialogCancel className="cursor-pointer border-border bg-muted text-muted-foreground hover:bg-muted/90 w-full sm:w-auto">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    className="cursor-pointer bg-destructive text-white hover:bg-destructive/70 w-full sm:w-auto"
                    onClick={() => onDeleteSubmit()}
                    disabled={deleteMutation.isPending}
                  >
                    {deleteMutation.isPending && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Confirm Delete
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
              {["username", "email", "first_name", "last_name"].map((field) => (
                <FormField
                  key={field}
                  name={field as keyof UserStruct}
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {field.name
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
              ))}
              <FormField
                name="birthdate"
                control={form.control}
                render={({ field }) => {
                  let dateValue: Date | undefined = undefined;
                  if (field.value) {
                    if (typeof field.value === "string") {
                      dateValue = new Date(field.value);
                    } else if (
                      field.value &&
                      typeof field.value === "object" &&
                      "getMonth" in field.value
                    ) {
                      dateValue = field.value as Date;
                    }
                  }

                  return (
                    <FormItem>
                      <FormLabel>Birthdate</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !dateValue && "text-muted-foreground",
                              )}
                              disabled={!isEditing || updateMutation.isPending}
                            >
                              {dateValue ? (
                                format(dateValue, "PPP")
                              ) : (
                                <span>Optional: Pick a date (18+ only)</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={dateValue}
                            onSelect={(newDate) => field.onChange(newDate)}
                            disabled={(date) =>
                              date > eighteenYearsAgo ||
                              date < new Date("1900-01-01")
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </FormItem>
                  );
                }}
              />
            </div>
            <div className="text-sm">
              Joined: {formatDate(user?.date_joined)}
            </div>
            {isEditing && (
              <div className="space-y-4">
                {updateError && (
                  <div className="text-destructive text-sm">{updateError}</div>
                )}
                <Button
                  type="submit"
                  className="gap-2 cursor-pointer"
                  disabled={updateMutation.isPending}
                >
                  {updateMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  Save Changes
                </Button>
              </div>
            )}
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
