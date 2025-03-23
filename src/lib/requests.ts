import { env } from "@/env";
import {
  getAccessToken,
  getAuthHeaders,
  getRefreshHeaders,
  getUserId,
} from "@/lib";
import {
  type LoginResponse,
  type RegisterResponse,
  type Tokens,
  type UserStruct,
} from "@/types/authInterfaces";
import { type loginSchema, type registerSchema } from "@/types/authSchemas";
import type * as storyResponses from "@/types/storyInterfaces";
import { type storySchema } from "@/types/storySchemas";
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
      DELETE_USER: "/delete",
    },
  },
  STORY: {
    BASE_URL: env.NEXT_PUBLIC_STORY_API_URL,
    ENDPOINTS: {
      CREATE_STORY: "/create-story",
      EDIT_STORY: "/edit-story",
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
  async create(storyData: z.infer<typeof storySchema>): Promise<{ message: string; story_id: string }> {
    const headers = getAuthHeaders();
    if (!headers || Object.keys(headers).length === 0) {
      return { message: "", story_id: "" };
    }
    const response = await fetch(
      `${API_CONFIG.STORY.BASE_URL}${API_CONFIG.STORY.ENDPOINTS.CREATE_STORY}`,
      {
        method: "POST",
        headers,
        body: JSON.stringify(storyData),
      },
    );
    return handleResponse<{ message: string; story_id: string }>(response);
  },

  async edit(storyId: string, content: string): Promise<void> {
    const headers = getAuthHeaders();
    if (!headers || Object.keys(headers).length === 0) {
      return;
    }
    const response = await fetch(
      `${API_CONFIG.STORY.BASE_URL}${API_CONFIG.STORY.ENDPOINTS.EDIT_STORY}`,
      {
        method: "PATCH",
        headers,
        body: JSON.stringify({ story_id: storyId, content }),
      },
    );
    await handleResponse<{ message: string }>(response);
  },

  async getDetails(storyId: string): Promise<storyResponses.StoryDetails> {
    const headers = getAuthHeaders();
    if (!headers || Object.keys(headers).length === 0) {
      return {} as storyResponses.StoryDetails;
    }
    const response = await fetch(
      `${API_CONFIG.STORY.BASE_URL}${API_CONFIG.STORY.ENDPOINTS.STORY_DETAILS}/${storyId}`,
      {
        method: "GET",
        headers,
      },
    );
    return handleResponse<{ story: storyResponses.StoryDetails }>(
      response,
    ).then((data) => data.story ?? ({} as storyResponses.StoryDetails));
  },

  async list(
    page: number,
    limit: number,
  ): Promise<storyResponses.StoryDetails[]> {

    const response = await fetch(
      `${API_CONFIG.STORY.BASE_URL}${API_CONFIG.STORY.ENDPOINTS.GET_STORIES}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ page, limit }),
      },
    );
    return handleResponse<storyResponses.StoryResponse>(response).then((data) => data.stories ?? []);
  },

  async getContent(storyId: string): Promise<storyResponses.StoryContent> {
    const response = await fetch(
      `${API_CONFIG.STORY.BASE_URL}${API_CONFIG.STORY.ENDPOINTS.STORY_CONTENT}/${storyId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    return handleResponse<{ content: storyResponses.StoryContent }>(
      response,
    ).then((data) => data.content ?? []);
  },

  async delete(storyId: string): Promise<void> {
    const headers = getAuthHeaders();
    if (!headers || Object.keys(headers).length === 0) {
      return;
    }
    const response = await fetch(
      `${API_CONFIG.STORY.BASE_URL}${API_CONFIG.STORY.ENDPOINTS.DELETE_STORY}/${storyId}`,
      {
        method: "DELETE",
        headers,
      },
    );
    await handleResponse<{ message: string }>(response);
  },

  async getCollaborators(storyId: string): Promise<string[]> {
    const response = await fetch(
      `${API_CONFIG.STORY.BASE_URL}${API_CONFIG.STORY.ENDPOINTS.COLLABORATORS}/${storyId}`,
      {
        method: "GET",
      },
    );
    return handleResponse<{ collaborators: string[] }>(response).then(
      (data) => data.collaborators ?? [],
    );
  },

  async getCollaboratedStories(
    page: number,
    limit: number,
  ): Promise<storyResponses.StoryDetails[]> {
    const headers = getAuthHeaders();
    if (!headers || Object.keys(headers).length === 0) {
      return [];
    }
    const response = await fetch(
      `${API_CONFIG.STORY.BASE_URL}${API_CONFIG.STORY.ENDPOINTS.COLLABORATIONS}`,
      {
        method: "POST",
        headers,
        body: JSON.stringify({ page, limit }),
      },
    );
    return handleResponse<storyResponses.StoryResponse>(response).then(
      (data) => data.stories ?? [],
    );
  },

  async getByFilters(params: {
    genres?: string[];
    page: number;
    limit: number;
  }): Promise<storyResponses.StoryDetails[]> {
    const headers = getAuthHeaders();
    if (!headers || Object.keys(headers).length === 0) {
      return [];
    }
    const response = await fetch(
      `${API_CONFIG.STORY.BASE_URL}${API_CONFIG.STORY.ENDPOINTS.FILTERED_STORIES}`,
      {
        method: "POST",
        headers,
        body: JSON.stringify(params),
      },
    );
    return handleResponse<storyResponses.StoryResponse>(response).then(
      (data) => data.stories || [],
    );
  },

  async getUserStories(
    page: number,
    limit: number,
  ): Promise<storyResponses.StoryDetails[]> {
    const userId = getUserId();
    if (!userId) return [];
    const token = getAccessToken();
    if (!token) return [];
    const headers = getAuthHeaders();
    if (!headers || Object.keys(headers).length === 0) {
      return [];
    }
    const response = await fetch(
      `${API_CONFIG.STORY.BASE_URL}${API_CONFIG.STORY.ENDPOINTS.USER_STORIES}`,
      {
        method: "POST",
        headers,
        body: JSON.stringify({ user_id: userId, page, limit }),
      },
    );
    return handleResponse<storyResponses.StoryResponse>(response).then(
      (data) => data.stories ?? [],
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
          first_name: data.first_name,
          last_name: data.last_name,
        }),
      },
    );
    return handleResponse<RegisterResponse>(response);
  },

  async getProfile(
    userId: string,
  ): Promise<{ first_name: string; last_name: string }> {
    const response = await fetch(
      `${API_CONFIG.AUTH.BASE_URL}${API_CONFIG.AUTH.ENDPOINTS.FETCH_USER}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId }),
      },
    );
    return handleResponse<UserStruct>(response).then((user) => ({
      first_name: user.first_name ?? "",
      last_name: user.last_name ?? "",
    }));
  },

  async updateProfile(updatedData: Partial<UserStruct>): Promise<UserStruct> {
    const headers = getAuthHeaders();
    if (!headers || Object.keys(headers).length === 0) {
      return {} as UserStruct;
    }
    const response = await fetch(
      `${API_CONFIG.AUTH.BASE_URL}${API_CONFIG.AUTH.ENDPOINTS.UPDATE_USER}`,
      {
        method: "PUT",
        headers,
        body: JSON.stringify(updatedData),
      },
    );
    return handleResponse<UserStruct>(response);
  },

  async getUserName(
    ownerId: string,
  ): Promise<{ first_name: string; last_name: string }> {
    const headers = getAuthHeaders();
    if (!headers || Object.keys(headers).length === 0) {
      return { first_name: "", last_name: "" };
    }
    const response = await fetch(
      `${API_CONFIG.AUTH.BASE_URL}${API_CONFIG.AUTH.ENDPOINTS.FETCH_USER_BY_ID}`,
      {
        method: "POST",
        headers: headers,
        body: JSON.stringify({ user_id: ownerId }),
      },
    );
    return handleResponse<{ user: UserStruct }>(response).then((data) => ({
      first_name: data.user.first_name ?? "",
      last_name: data.user.last_name ?? "",
    }));
  },

  async deleteAccount(): Promise<void> {
    const headers = getAuthHeaders();
    if (!headers || Object.keys(headers).length === 0) {
      return;
    }
    const response = await fetch(
      `${API_CONFIG.AUTH.BASE_URL}${API_CONFIG.AUTH.ENDPOINTS.DELETE_USER}`,
      {
        method: "DELETE",
        headers,
      },
    );
    await handleResponse<{ message: string }>(response);
  },

  async refreshTokens(): Promise<Tokens> {
    const refreshHeaders = getRefreshHeaders();
    if (!refreshHeaders || Object.keys(refreshHeaders).length === 0) {
      return {} as Tokens;
    }
    const response = await fetch(
      `${API_CONFIG.AUTH.BASE_URL}${API_CONFIG.AUTH.ENDPOINTS.REFRESH}`,
      {
        method: "GET",
        headers: refreshHeaders,
      },
    );
    return handleResponse<{ message: string; tokens: Tokens }>(response).then(
      (data) => data.tokens ?? ({} as Tokens),
    );
  },
};
