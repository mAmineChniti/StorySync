export interface UserStruct {
  id: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  date_joined: string;
}

export interface Tokens {
  access_token: string;
  access_created_at: string;
  access_expires_at: string;
  refresh_token: string;
  refresh_created_at: string;
  refresh_expires_at: string;
}

export interface AccessToken {
  access_token: string;
  access_created_at: string;
  access_expires_at: string;
}

export interface RefreshToken {
  refresh_token: string;
  refresh_created_at: string;
  refresh_expires_at: string;
}

export interface RegisterResponse {
  message: string;
  user: UserStruct;
  tokens: Tokens;
}

export interface LoginResponse {
  message: string;
  user: UserStruct;
  tokens: Tokens;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
}
