import axios, { AxiosInstance } from "axios";
import { CapsuleApiError, CapsuleNetworkError } from "./errors";
import { AuthTokens, CapsuleConfig, OAuthConfig } from "./types";

export class ApiClient {
  private client: AxiosInstance;
  private tokens: AuthTokens | null = null;
  private oauthConfig?: OAuthConfig;
  private baseUrl: string;

  constructor(config: CapsuleConfig) {
    if (!config.capsuleUrl) {
      throw new Error("API URL is required");
    }

    this.baseUrl = config.capsuleUrl;
    this.client = axios.create({
      baseURL: this.baseUrl,
      headers: {
        "Content-Type": "application/json",
        "Client-Id": config.oauth?.clientId || "",
        ...(config.apiKey && { Authorization: `Bearer ${config.apiKey}` }),
      },
      timeout: config.timeout || 30000,
    });
    this.oauthConfig = config.oauth;
    this.setupInterceptors();
  }

  updateBaseUrl(url: string): void {
    this.baseUrl = url;
    this.client.defaults.baseURL = url;
  }

  private setupInterceptors() {
    this.client.interceptors.request.use(async (config) => {
      if (this.tokens?.accessToken) {
        config.headers.Authorization = `Bearer ${this.tokens.accessToken}`;
      }
      return config;
    });

    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response) {
          if (error.response.status === 401 && this.tokens?.refreshToken) {
            return this.refreshAccessToken().then(() => {
              const originalRequest = error.config;
              originalRequest.headers.Authorization = `Bearer ${this.tokens?.accessToken}`;
              return this.client(originalRequest);
            });
          }
          return Promise.reject(
            new CapsuleApiError(
              error.response.data.message || "API error occurred",
              error.response.status,
              error.response.data,
            ),
          );
        } else if (error.request) {
          return Promise.reject(
            new CapsuleNetworkError(
              "No response received from server",
              error.request,
            ),
          );
        } else {
          return Promise.reject(
            new Error(`Error setting up request: ${error.message}`),
          );
        }
      },
    );
  }

  async authenticate(username: string, password: string): Promise<AuthTokens> {
    if (!this.oauthConfig?.clientId) {
      throw new Error("OAuth configuration is missing");
    }

    const response = await this.client.post("/oauth/token", {
      username,
      password,
      client_id: this.oauthConfig.clientId,
    });

    this.setTokens(response.data);
    return this.tokens as AuthTokens;
  }

  private async refreshAccessToken(): Promise<void> {
    if (!this.tokens?.refreshToken || !this.oauthConfig?.clientId) {
      throw new Error("No refresh token available or OAuth config missing");
    }

    try {
      const response = await this.client.post("/oauth/token", {
        grant_type: "refresh_token",
        refresh_token: this.tokens.refreshToken,
        client_id: this.oauthConfig.clientId,
        client_secret: this.oauthConfig.clientSecret,
      });

      this.setTokens(response.data);
    } catch (error) {
      this.tokens = null;
      throw error;
    }
  }

  setAuthTokens(tokens: AuthTokens): void {
    this.tokens = tokens;
  }

  getAuthTokens(): AuthTokens | null {
    return this.tokens;
  }

  logout(): void {
    this.tokens = null;
  }

  private setTokens(tokenData: any): void {
    this.tokens = {
      accessToken: tokenData.access_token,
      refreshToken: tokenData.refresh_token,
      expiresAt: tokenData.expires_in
        ? Date.now() + tokenData.expires_in * 1000
        : undefined,
    };
  }

  async get<T>(path: string, params?: Record<string, any>): Promise<T> {
    const response = await this.client.get<T>(path, { params });
    return response.data;
  }

  async post<T>(path: string, data?: any): Promise<T> {
    const response = await this.client.post<T>(path, data);
    return response.data;
  }

  async put<T>(path: string, data?: any): Promise<T> {
    const response = await this.client.put<T>(path, data);
    return response.data;
  }

  async patch<T>(path: string, data?: any): Promise<T> {
    const response = await this.client.patch<T>(path, data);
    return response.data;
  }

  async delete<T>(path: string): Promise<T> {
    const response = await this.client.delete<T>(path);
    return response.data;
  }
}
