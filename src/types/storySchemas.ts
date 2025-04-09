import { z } from "zod";

const storySchema = z.object({
  title: z
    .string()
    .min(5, "Title must be at least 5 characters")
    .max(75, "Title must be less than 100 characters"),
  description: z
    .string()
    .min(100, "Description must be at least 100 characters")
    .max(500, "Description must be less than 500 characters"),
  genre: z.string().min(1, "Genre is required"),
});

export { storySchema };
