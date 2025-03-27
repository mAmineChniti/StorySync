import { env } from "@/env";
import {
  type LoginRequest,
  type LoginResponse,
  type RegisterRequest,
  type RegisterResponse,
  type Tokens,
  type UpdateRequest,
  type UserStruct,
} from "@/types/authInterfaces";
import type * as storyResponses from "@/types/storyInterfaces";
import { getAuthHeaders, getRefreshHeaders, getUserId } from "@/utils/lib";
import { TFetchClient } from "@thatguyjamal/type-fetch";

const tfetch = new TFetchClient({
  retry: {
    count: 2,
    delay: 1000,
  },
});

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
      RESEND_CONFIRMATION_EMAIL: "/resend-confirmation-email",
      PASSWORD_RESET: "/password-reset/initiate",
      PASSWORD_RESET_CONFIRM: "/password-reset/confirm",
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
      FORK_STORY: "/fork-story",
      DELETE_STORY: "/delete-story",
      DELETE_ALL_STORIES: "/delete-all-stories",
    },
  },
} as const;

type ApiError = {
  message?: string;
  [key: string]: unknown;
};

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
  async create(
    storyData: storyResponses.StoryRequest,
  ): Promise<{ message: string; story_id: string }> {
    const headers = getAuthHeaders();
    if (!headers || Object.keys(headers).length === 0) {
      return { message: "", story_id: "" };
    }
    const { data, error } = await tfetch.post<{
      message: string;
      story_id: string;
    }>(
      `${API_CONFIG.STORY.BASE_URL}${API_CONFIG.STORY.ENDPOINTS.CREATE_STORY}`,
      headers,
      { type: "json", data: storyData },
    );
    if (error) {
      throw new Error(error.message);
    }
    return data ?? { message: "", story_id: "" };
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
        headers: {
          "Content-Type": "application/json",
          ...headers,
        },
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
    const { data, error } = await tfetch.get<{
      story: storyResponses.StoryDetails;
    }>(
      `${API_CONFIG.STORY.BASE_URL}${API_CONFIG.STORY.ENDPOINTS.STORY_DETAILS}/${storyId}`,
      headers,
    );
    if (error) {
      throw new Error(error.message);
    }
    return data?.story ?? ({} as storyResponses.StoryDetails);
  },

  async list(
    page: number,
    limit: number,
  ): Promise<storyResponses.StoryDetails[]> {
    const { data, error } = await tfetch.post<storyResponses.StoryResponse>(
      `${API_CONFIG.STORY.BASE_URL}${API_CONFIG.STORY.ENDPOINTS.GET_STORIES}`,
      getAuthHeaders(),
      { type: "json", data: { page, limit } },
    );
    if (error) {
      throw new Error(error.message);
    }
    return data?.stories ?? [];
  },

  async getContent(storyId: string): Promise<storyResponses.StoryContent> {
    const { data, error } = await tfetch.get<{
      content: storyResponses.StoryContent;
    }>(
      `${API_CONFIG.STORY.BASE_URL}${API_CONFIG.STORY.ENDPOINTS.STORY_CONTENT}/${storyId}`,
      getAuthHeaders() ?? {},
    );
    if (error) {
      throw new Error(error.message);
    }
    return data?.content ?? ([] as unknown as storyResponses.StoryContent);
  },

  async delete(storyId: string): Promise<void> {
    const headers = getAuthHeaders();
    if (!headers || Object.keys(headers).length === 0) {
      return;
    }
    const { error } = await tfetch.delete<{ message: string }>(
      `${API_CONFIG.STORY.BASE_URL}${API_CONFIG.STORY.ENDPOINTS.DELETE_STORY}/${storyId}`,
      headers,
    );
    if (error) {
      throw new Error(error.message);
    }
  },

  async getCollaborators(storyId: string): Promise<string[]> {
    const { data, error } = await tfetch.get<string[]>(
      `${API_CONFIG.STORY.BASE_URL}${API_CONFIG.STORY.ENDPOINTS.COLLABORATORS}/${storyId}`,
      getAuthHeaders(),
    );
    if (error) {
      throw new Error(error.message);
    }
    return data ?? [];
  },

  async getCollaboratedStories(
    page: number,
    limit: number,
  ): Promise<storyResponses.StoryDetails[]> {
    const headers = getAuthHeaders();
    if (!headers || Object.keys(headers).length === 0) {
      return [];
    }
    const { data, error } = await tfetch.post<storyResponses.StoryResponse>(
      `${API_CONFIG.STORY.BASE_URL}${API_CONFIG.STORY.ENDPOINTS.COLLABORATIONS}`,
      headers,
      { type: "json", data: { page, limit } },
    );
    if (error) {
      throw new Error(error.message);
    }
    return data?.stories ?? [];
  },

  async getByFilters(
    params: storyResponses.FetchStoriesByFilterParams,
  ): Promise<storyResponses.StoryDetails[]> {
    const headers = getAuthHeaders();
    if (!headers || Object.keys(headers).length === 0) {
      return [];
    }
    const { data, error } = await tfetch.post<storyResponses.StoryResponse>(
      `${API_CONFIG.STORY.BASE_URL}${API_CONFIG.STORY.ENDPOINTS.FILTERED_STORIES}`,
      headers,
      { type: "json", data: params },
    );
    if (error) {
      throw new Error(error.message);
    }
    return data?.stories ?? [];
  },

  async getUserStories(
    page: number,
    limit: number,
  ): Promise<storyResponses.StoryDetails[]> {
    const userId = getUserId();
    if (!userId) return [];
    const headers = getAuthHeaders();
    if (!headers || Object.keys(headers).length === 0) {
      return [];
    }
    const { data, error } = await tfetch.post<storyResponses.StoryResponse>(
      `${API_CONFIG.STORY.BASE_URL}${API_CONFIG.STORY.ENDPOINTS.USER_STORIES}`,
      headers,
      { type: "json", data: { user_id: userId, page, limit } },
    );
    if (error) {
      throw new Error(error.message);
    }
    return data?.stories ?? [];
  },

  async forkStory(storyId: string): Promise<storyResponses.ForkStoryResponse> {
    const headers = getAuthHeaders();
    if (!headers || Object.keys(headers).length === 0) {
      return { message: "", story_id: "" };
    }
    const { data, error } = await tfetch.get<storyResponses.ForkStoryResponse>(
      `${API_CONFIG.STORY.BASE_URL}${API_CONFIG.STORY.ENDPOINTS.FORK_STORY}${storyId}`,
      headers,
    );
    if (error) {
      throw new Error(error.message);
    }
    return data ?? { message: "", story_id: "" };
  },

  async deleteAllStories(): Promise<void> {
    const headers = getAuthHeaders();
    if (!headers || Object.keys(headers).length === 0) {
      return;
    }
    const { error } = await tfetch.delete<{ message: string }>(
      `${API_CONFIG.STORY.BASE_URL}${API_CONFIG.STORY.ENDPOINTS.DELETE_ALL_STORIES}`,
      headers,
    );
    if (error) {
      throw new Error(error.message);
    }
  },
};

export const AuthService = {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const { data, error } = await tfetch.post<LoginResponse>(
      `${API_CONFIG.AUTH.BASE_URL}${API_CONFIG.AUTH.ENDPOINTS.LOGIN}`,
      { "Content-Type": "application/json" },
      { type: "json", data: credentials },
    );
    if (error) {
      throw new Error(error.message);
    }
    return data ?? ({} as LoginResponse);
  },

  async register(data: RegisterRequest): Promise<RegisterResponse> {
    const { data: responseData, error } = await tfetch.post<RegisterResponse>(
      `${API_CONFIG.AUTH.BASE_URL}${API_CONFIG.AUTH.ENDPOINTS.REGISTER}`,
      { "Content-Type": "application/json" },
      {
        type: "json",
        data: {
          username: data.username,
          email: data.email,
          password: data.password,
          first_name: data.first_name,
          last_name: data.last_name,
          birthdate: data.birthdate,
        },
      },
    );
    if (error) {
      throw new Error(error.message);
    }
    return responseData ?? ({} as RegisterResponse);
  },

  async getProfile(
    userId: string,
  ): Promise<{ first_name: string; last_name: string }> {
    const { data, error } = await tfetch.post<UserStruct>(
      `${API_CONFIG.AUTH.BASE_URL}${API_CONFIG.AUTH.ENDPOINTS.FETCH_USER}`,
      { type: "json", data: { user_id: userId } },
    );
    if (error) {
      throw new Error(error.message);
    }
    return {
      first_name: data?.first_name ?? "",
      last_name: data?.last_name ?? "",
    };
  },

  async updateProfile(updatedData: UpdateRequest): Promise<UserStruct> {
    const headers = getAuthHeaders();
    if (!headers || Object.keys(headers).length === 0) {
      return {} as UserStruct;
    }
    const { data, error } = await tfetch.put<UserStruct>(
      `${API_CONFIG.AUTH.BASE_URL}${API_CONFIG.AUTH.ENDPOINTS.UPDATE_USER}`,
      headers,
      { type: "json", data: updatedData },
    );
    if (error) {
      throw new Error(error.message);
    }
    return data ?? ({} as UserStruct);
  },

  async getUserName(
    ownerId: string,
  ): Promise<{ first_name: string; last_name: string }> {
    const headers = getAuthHeaders();
    if (!headers || Object.keys(headers).length === 0) {
      return { first_name: "", last_name: "" };
    }
    const { data, error } = await tfetch.post<{ user: UserStruct }>(
      `${API_CONFIG.AUTH.BASE_URL}${API_CONFIG.AUTH.ENDPOINTS.FETCH_USER_BY_ID}`,
      headers,
      { type: "json", data: { user_id: ownerId } },
    );
    if (error) {
      throw new Error(error.message);
    }
    return {
      first_name: data?.user.first_name ?? "",
      last_name: data?.user.last_name ?? "",
    };
  },

  async deleteAccount(): Promise<void> {
    const headers = getAuthHeaders();
    if (!headers || Object.keys(headers).length === 0) {
      return;
    }
    const { error } = await tfetch.delete<{ message: string }>(
      `${API_CONFIG.AUTH.BASE_URL}${API_CONFIG.AUTH.ENDPOINTS.DELETE_USER}`,
      headers,
    );
    if (error) {
      throw new Error(error.message);
    }
  },

  async refreshTokens(): Promise<Tokens> {
    const refreshHeaders = getRefreshHeaders();
    if (!refreshHeaders || Object.keys(refreshHeaders).length === 0) {
      return {} as Tokens;
    }
    const { data, error } = await tfetch.get<{ tokens: Tokens }>(
      `${API_CONFIG.AUTH.BASE_URL}${API_CONFIG.AUTH.ENDPOINTS.REFRESH}`,
      refreshHeaders,
    );
    if (error) {
      throw new Error(error.message);
    }
    return data?.tokens ?? ({} as Tokens);
  },

  async resendConfirmationEmail(): Promise<void> {
    const headers = getAuthHeaders();
    if (!headers || Object.keys(headers).length === 0) {
      return;
    }
    const { error } = await tfetch.get<{ message: string }>(
      `${API_CONFIG.AUTH.BASE_URL}${API_CONFIG.AUTH.ENDPOINTS.RESEND_CONFIRMATION_EMAIL}`,
      headers,
    );
    if (error) {
      throw new Error(error.message);
    }
  },

  async initiatePasswordReset(email: string): Promise<void> {
    const { error } = await tfetch.post<{ message: string }>(
      `${API_CONFIG.AUTH.BASE_URL}${API_CONFIG.AUTH.ENDPOINTS.PASSWORD_RESET}`,
      { type: "json", data: { email } },
    );
    if (error) {
      throw new Error(error.message);
    }
  },

  async confirmPasswordReset(
    token: string,
    new_password: string,
  ): Promise<void> {
    const { error } = await tfetch.post<{ message: string }>(
      `${API_CONFIG.AUTH.BASE_URL}${API_CONFIG.AUTH.ENDPOINTS.PASSWORD_RESET_CONFIRM}`,
      { type: "json", data: { token, new_password } },
    );
    if (error) {
      throw new Error(error.message);
    }
  },
};
