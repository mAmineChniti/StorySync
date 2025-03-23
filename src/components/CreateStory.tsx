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
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { BookOpen } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { type z } from "zod";

export default function CreateStory() {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const form = useForm<z.infer<typeof storySchema>>({
    resolver: zodResolver(storySchema),
    defaultValues: {
      title: "",
      description: "",
      genre: "",
    },
  });

  const mutation = useMutation<{ message: string; story_id: string }, Error, z.infer<typeof storySchema>>({
    mutationFn: (data) => StoryService.create(data),
    onSuccess: () => {
      setSubmitted(true);
    },
    onError: (error) => {
      setError(error.message);
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
      <Card className="mx-auto max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl">Story Created</CardTitle>
          <CardDescription>
            Your story has been created successfully.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row justify-end gap-4">
          <Button
            className="bg-purple-600 hover:bg-purple-700 cursor-pointer w-full sm:w-auto"
            onClick={() => {
              if (mutation.data?.story_id) {
                router.push(`/story/${mutation.data.story_id}`);
              }
            }}
          >
            <BookOpen className="mr-2 h-4 w-4" /> Start Writing the Story
          </Button>
          <Button
            className="bg-purple-600 hover:bg-purple-700 cursor-pointer w-full sm:w-auto"
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

  if (error) {
    return (
      <Card className="mx-auto max-w-2xl">
        <CardHeader>
          <CardTitle>Error</CardTitle>
          <CardDescription>{error}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={() => {
              setError(null);
              router.refresh();
            }}
          >
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mx-auto max-w-2xl">
      <CardHeader>
        <CardTitle className="text-2xl">Create New Story</CardTitle>
        <CardDescription>
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
                          {...field}
                          className="w-full"
                        />
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
                        <Textarea
                          className="resize-none w-full"
                          placeholder="What is your story about?"
                          rows={5}
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
                        <SelectTrigger id="genre" className="w-full">
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
              <Button
                type="submit"
                disabled={mutation.isPending}
                className="bg-purple-600 hover:bg-purple-700 cursor-pointer w-full sm:w-auto"
              >
                {mutation.isPending ? (
                  "Creating Story..."
                ) : (
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
