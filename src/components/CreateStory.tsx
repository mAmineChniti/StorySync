"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BookOpen } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import type { StoryDetails } from "@/types/storyResponses";
import { env } from "@/env";
import { useRouter } from "next/navigation";
import { getAccessToken } from "@/lib";
const NEXT_PUBLIC_STORY_API_URL = env.NEXT_PUBLIC_STORY_API_URL;

type CreateStoryFormValues = Omit<StoryDetails, "id" | "collaborators" | "forkedFrom" | "ownerId">;

const storySchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  genre: z.string().min(1, "Genre is required"),
  created_at: z.string(),
  updated_at: z.string(),
});


const createStory = async (storyData: CreateStoryFormValues): Promise<string> => {
  const accessToken = getAccessToken();
  if (!accessToken) {
    throw new Error("No authentication token found");
  }
  const response = await fetch(`${NEXT_PUBLIC_STORY_API_URL}/create-story`, {
    method: "POST",
    body: JSON.stringify(storyData),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
  if (!response.ok) {
    throw new Error("Failed to create story");
  }
  return (await response.json()) as string;
};

export default function CreateStory() {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const form = useForm<CreateStoryFormValues>({
    resolver: zodResolver(storySchema),
    defaultValues: {
      title: "",
      description: "",
      genre: "",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  });

  const mutation = useMutation<string, unknown, CreateStoryFormValues>({
    mutationFn: createStory,
    onSuccess: () => {
      setSubmitted(true);
    },
    onError: () => {
      setError("Failed to create story");
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

  const onSubmit = (data: CreateStoryFormValues) => {
    mutation.mutate(data);
  };

  if (submitted) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Story Created</CardTitle>
          <CardDescription>Your story has been created successfully.</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-end gap-4">
          <Button className="bg-purple-600 hover:bg-purple-700">Start Writing the Story</Button>
          <Button className="bg-purple-600 hover:bg-purple-700" onClick={() => { form.reset(); setSubmitted(false); }}>
            Add Another Story
          </Button>
        </CardContent>
      </Card>
    );
  }
  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Error</CardTitle>
          <CardDescription>{error}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => { setError(null); router.refresh(); }}>Retry</Button>
        </CardContent>
      </Card >
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Create New Story</CardTitle>
        <CardDescription>
          Start your new writing journey and share your creativity with the world
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Story Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter a captivating title" {...field} />
                      </FormControl>
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
                        <Textarea placeholder="What is your story about?" rows={5} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="genre"
                  render={({ field: { onChange, value } }) => (
                    <FormItem>
                      <FormLabel>Genre</FormLabel>
                      <Select value={value} onValueChange={onChange}>
                        <SelectTrigger id="genre">
                          <SelectValue placeholder="Select a genre" />
                        </SelectTrigger>
                        <SelectContent>
                          {genres.map((genre) => (
                            <SelectItem key={genre} value={genre}>
                              {genre}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button type="submit" disabled={mutation.isPending} className="bg-purple-600 hover:bg-purple-700">
                {mutation.isPending ? "Creating Story..." : (
                  <>
                    <BookOpen className="mr-2 h-4 w-4" />
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
