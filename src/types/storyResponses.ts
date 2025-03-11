import { type ObjectId } from 'mongodb';

export interface StoryDetails {
  id: ObjectId;
  title: string;
  description: string;
  genre: string;
  ownerId: ObjectId; collaborators?: ObjectId[];
  createdAt: Date;
  updatedAt: Date;
  forkedFrom?: ObjectId | null;
}

export interface StoryResponse {
  message: string;
  stories: StoryDetails[];
}

export interface FetchStoriesByFilterParams {
  genre: string;
  page?: number;
  limit?: number;
}
