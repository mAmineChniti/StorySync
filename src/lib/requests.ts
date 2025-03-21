import { env } from "@/env";
import { getAuthHeaders, getRefreshHeaders, getUserId } from "@/lib";
import {
  type LoginResponse,
  type RegisterResponse,
  type Tokens,
  type UserStruct,
} from "@/types/authInterfaces";
import { type loginSchema, type registerSchema } from "@/types/authSchemas";
import type * as storyResponses from "@/types/storyInterfaces";
import { type storySchema } from "@/types/storySchemas";
import type ObjectId from "bson-objectid";
import { type z } from "zod";

const API_CONFIG = {
  AUTH: {
    BASE_URL: env.NEXT_PUBLIC_AUTH_API_URL,
    ENDPOINTS: {
      LOGIN: "/login",
      REGISTER: "/register",
      REFRESH: "/refresh",
      FETCH_USER: "/fetchuser",
      UPDATE_USER: "/update",
      FETCH_USER_BY_ID: "/fetchuserbyid",
    },
  },
  STORY: {
    BASE_URL: env.NEXT_PUBLIC_STORY_API_URL,
    ENDPOINTS: {
      CREATE_STORY: "/create-story",
      GET_STORIES: "/get-stories",
      STORY_DETAILS: "/get-story-details",
      STORY_CONTENT: "/get-story-content",
      COLLABORATORS: "/get-story-collaborators",
      USER_STORIES: "/get-stories-by-user",
      COLLABORATIONS: "/collaborations",
      FILTERED_STORIES: "/get-stories-by-filters",
      DELETE_STORY: "/delete-story",
    },
  },
} as const;

interface ApiError {
  message?: string;
  [key: string]: unknown;
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData: ApiError = await response
      .json()
      .then((data) => data as ApiError)
      .catch(() => ({}) as ApiError);

    const errorMessage =
      typeof errorData.message === "string"
        ? errorData.message
        : `Request failed with status ${response.status}`;

    throw new Error(errorMessage);
  }
  return response.json() as Promise<T>;
}

export const StoryService = {
  async create(storyData: z.infer<typeof storySchema>): Promise<string> {
    const response = await fetch(
      `${API_CONFIG.STORY.BASE_URL}${API_CONFIG.STORY.ENDPOINTS.CREATE_STORY}`,
      {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(storyData),
      },
    );
    return handleResponse<{ storyId: string }>(response).then(
      (data) => data.storyId,
    );
  },

  async getDetails(storyId: ObjectId): Promise<storyResponses.StoryDetails> {
    const response = await fetch(
      `${API_CONFIG.STORY.BASE_URL}${API_CONFIG.STORY.ENDPOINTS.STORY_DETAILS}/${storyId.toHexString()}`,
      {
        method: "GET",
        headers: getAuthHeaders(),
      },
    );
    return handleResponse<{ story: storyResponses.StoryDetails }>(
      response,
    ).then((data) => data.story);
  },

  async list(
    page: number,
    limit: number,
  ): Promise<storyResponses.StoryDetails[]> {
    const response = await fetch(
      `${API_CONFIG.STORY.BASE_URL}${API_CONFIG.STORY.ENDPOINTS.GET_STORIES}`,
      {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ page, limit }),
      },
    );
    return handleResponse<storyResponses.StoryResponse>(response).then(
      (data) => data.stories,
    );
  },

  async getContent(storyId: ObjectId): Promise<storyResponses.StoryContent> {
    const response = await fetch(
      `${API_CONFIG.STORY.BASE_URL}${API_CONFIG.STORY.ENDPOINTS.STORY_CONTENT}/${storyId.toHexString()}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      },
    );
    return handleResponse<{ content: storyResponses.StoryContent }>(
      response,
    ).then((data) => data.content);
  },

  async delete(storyId: ObjectId): Promise<void> {
    const response = await fetch(
      `${API_CONFIG.STORY.BASE_URL}${API_CONFIG.STORY.ENDPOINTS.DELETE_STORY}/${storyId.toHexString()}`,
      {
        method: "DELETE",
        headers: getAuthHeaders(),
      },
    );
    await handleResponse<{ message: string }>(response);
  },

  async getCollaborators(storyId: ObjectId): Promise<string[]> {
    const response = await fetch(
      `${API_CONFIG.STORY.BASE_URL}${API_CONFIG.STORY.ENDPOINTS.COLLABORATORS}/${storyId.toHexString()}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      },
    );
    return handleResponse<{ collaborators: string[] }>(response).then(
      (data) => data.collaborators,
    );
  },

  async getCollaboratedStories(
    page: number,
    limit: number,
  ): Promise<storyResponses.StoryDetails[]> {
    const response = await fetch(
      `${API_CONFIG.STORY.BASE_URL}${API_CONFIG.STORY.ENDPOINTS.COLLABORATIONS}`,
      {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ page, limit }),
      },
    );
    return handleResponse<storyResponses.StoryResponse>(response).then(
      (data) => data.stories,
    );
  },

  async getByFilters(params: {
    genres?: string[];
    page: number;
    limit: number;
  }): Promise<storyResponses.StoryDetails[]> {
    const response = await fetch(
      `${API_CONFIG.STORY.BASE_URL}${API_CONFIG.STORY.ENDPOINTS.FILTERED_STORIES}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      },
    );
    return handleResponse<storyResponses.StoryResponse>(response).then(
      (data) => data.stories,
    );
  },

  async getUserStories(
    page: number,
    limit: number,
  ): Promise<storyResponses.StoryDetails[]> {
    const userId = getUserId();
    if (!userId) throw new Error("Authentication required");

    const response = await fetch(
      `${API_CONFIG.STORY.BASE_URL}${API_CONFIG.STORY.ENDPOINTS.USER_STORIES}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, page, limit }),
      },
    );
    return handleResponse<storyResponses.StoryResponse>(response).then(
      (data) => data.stories,
    );
  },
};

export const AuthService = {
  async login(
    credentials: z.infer<typeof loginSchema>,
  ): Promise<LoginResponse> {
    const response = await fetch(
      `${API_CONFIG.AUTH.BASE_URL}${API_CONFIG.AUTH.ENDPOINTS.LOGIN}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      },
    );
    return handleResponse<LoginResponse>(response);
  },

  async register(
    data: z.infer<typeof registerSchema>,
  ): Promise<RegisterResponse> {
    const response = await fetch(
      `${API_CONFIG.AUTH.BASE_URL}${API_CONFIG.AUTH.ENDPOINTS.REGISTER}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: data.username,
          email: data.email,
          password: data.password,
          first_name: data.firstName,
          last_name: data.lastName,
        }),
      },
    );
    return handleResponse<RegisterResponse>(response);
  },

  async getProfile(
    userId: ObjectId,
  ): Promise<{ first_name: string; last_name: string }> {
    const response = await fetch(
      `${API_CONFIG.AUTH.BASE_URL}${API_CONFIG.AUTH.ENDPOINTS.FETCH_USER}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId.toHexString() }),
      },
    );
    return handleResponse<UserStruct>(response).then((user) => ({
      first_name: user.first_name,
      last_name: user.last_name,
    }));
  },

  async updateProfile(updatedData: Partial<UserStruct>): Promise<UserStruct> {
    const response = await fetch(
      `${API_CONFIG.AUTH.BASE_URL}${API_CONFIG.AUTH.ENDPOINTS.UPDATE_USER}`,
      {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(updatedData),
      },
    );
    return handleResponse<UserStruct>(response);
  },

  async getUserName(
    ownerId: ObjectId,
  ): Promise<{ first_name: string; last_name: string }> {
    const response = await fetch(
      `${API_CONFIG.AUTH.BASE_URL}${API_CONFIG.AUTH.ENDPOINTS.FETCH_USER_BY_ID}`,
      {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ id: ownerId.toHexString() }),
      },
    );
    return handleResponse<{ user: UserStruct }>(response).then((data) => ({
      first_name: data.user.first_name,
      last_name: data.user.last_name,
    }));
  },

  async refreshTokens(): Promise<Tokens> {
    const refreshHeaders = getRefreshHeaders();
    if (!refreshHeaders) throw new Error("Refresh token not found in cookies");
    const response = await fetch(
      `${API_CONFIG.AUTH.BASE_URL}${API_CONFIG.AUTH.ENDPOINTS.REFRESH}`,
      {
        method: "GET",
        headers: refreshHeaders,
      },
    );
    return handleResponse<{ message: string; tokens: Tokens }>(response).then(
      (data) => data.tokens,
    );
  },
};
