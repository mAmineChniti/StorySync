export type StoryDetails = {
  id: string;
  title: string;
  description: string;
  genre: string;
  owner_id: string;
  collaborators?: string[];
  created_at: string;
  updated_at: string;
  forkedFrom?: string | null;
}

export type StoryContent = {
  id: string;
  story_id: string;
  content: string;
}

export type StoryResponse = {
  message: string;
  stories: StoryDetails[];
}

export type FetchStoriesByFilterParams = {
  genres?: string[];
  page: number;
  limit: number;
}

export type StoryRequest = {
  title: string;
  description: string;
  genre: string;
}
