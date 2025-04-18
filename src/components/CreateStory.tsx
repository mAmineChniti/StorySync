"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { BookOpen } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { type z } from "zod";

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
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { StoryService } from "@/lib/requests";
import { storySchema } from "@/types/storySchemas";

export default function CreateStory() {
  const [submitted, setSubmitted] = useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof storySchema>>({
    resolver: zodResolver(storySchema),
    defaultValues: {
      title: "",
      description: "",
      genre: "",
    },
  });

  const mutation = useMutation<
    { message: string; story_id: string },
    Error,
    z.infer<typeof storySchema>
  >({
    mutationFn: (data) => StoryService.create(data),
    onSuccess: () => {
      setSubmitted(true);
    },
    onError: (error) => {
      let errormsg = "";
      errormsg =
        typeof error.message === "string"
          ? error.message
          : (JSON.parse(error.message) as { message: string }).message;
      toast.error(errormsg);
    },
  });

  const genres = [
    "Fantasy",
    "Science Fiction",
    "Mystery",
    "Romance",
    "Horror",
    "Thriller",
    "Historical Fiction",
    "Young Adult",
    "Children's",
    "Biography",
    "Non-fiction",
    "Poetry",
    "Drama",
  ];

  const onSubmit = (data: z.infer<typeof storySchema>) => {
    mutation.mutate(data);
  };

  if (submitted) {
    return (
      <Card className="mx-auto max-w-7xl border-border">
        <CardHeader>
          <CardTitle className="text-2xl">Story Created</CardTitle>
          <CardDescription className="text-muted-foreground">
            Your story has been created successfully.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row justify-end gap-4">
          <Button
            className="w-full sm:w-auto gap-2 cursor-pointer"
            onClick={() => {
              if (mutation.data?.story_id) {
                router.push(`/story/${mutation.data.story_id}`);
              }
            }}
          >
            <BookOpen className="h-4 w-4" />
            Start Writing the Story
          </Button>
          <Button
            variant="outline"
            className="w-full sm:w-auto border-border cursor-pointer"
            onClick={() => {
              form.reset();
              setSubmitted(false);
            }}
          >
            Add Another Story
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mx-auto max-w-7xl border-border">
      <CardHeader>
        <CardTitle className="text-2xl">Create New Story</CardTitle>
        <CardDescription className="text-muted-foreground">
          Start your new writing journey and share your creativity with the
          world
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Story Title</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter a captivating title"
                          className="bg-background border-border"
                          maxLength={75}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="genre"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Genre</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger
                          id="genre"
                          className="bg-background border-border"
                        >
                          <SelectValue placeholder="Select a genre" />
                        </SelectTrigger>
                        <SelectContent className="bg-background border-border">
                          {genres.map((genre) => (
                            <SelectItem
                              key={genre}
                              value={genre}
                              className="hover:bg-accent cursor-pointer"
                            >
                              {genre}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          className="resize-none bg-background border-border"
                          placeholder="What is your story about?"
                          rows={5}
                          maxLength={500}
                          {...field}
                        />
                      </FormControl>
                      <span className="flex justify-end text-sm text-muted-foreground">
                        {field.value.length + " / 500"}
                      </span>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={mutation.isPending}
                className="w-full sm:w-auto gap-2 cursor-pointer"
              >
                {mutation.isPending ? (
                  "Creating Story..."
                ) : (
                  <>
                    <BookOpen className="h-4 w-4" />
                    Create Story
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
