import { type ObjectId } from 'mongodb';

export interface StoryDetails {
  id: ObjectId;
  title: string;
  description: string;
  genre: string;
  ownerId: ObjectId;
  collaborators?: ObjectId[];
  created_at: string;
  updated_at: string;
  forkedFrom?: ObjectId | null;
}

export interface StoryResponse {
  message: string;
  stories: StoryDetails[];
}

export interface FetchStoriesByFilterParams {
  genres: string[];
  page?: number;
  limit?: number;
}
