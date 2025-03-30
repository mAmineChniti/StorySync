export interface StoryDetails {
  id: string;
  title: string;
  description: string;
  genre: string;
  owner_id: string;
  collaborators?: string[];
  created_at: string;
  updated_at: string;
  forked_from?: string | null;
}

export interface StoryContent {
  id: string;
  story_id: string;
  content: string;
}

export interface StoryResponse {
  message: string;
  stories: StoryDetails[];
}

export interface FetchStoriesByFilterParameters {
  genres?: string[];
  page: number;
  limit: number;
}

export interface StoryRequest {
  title: string;
  description: string;
  genre: string;
}

export interface ForkStoryResponse {
  message: string;
  story_id: string;
}
