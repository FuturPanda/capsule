import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { SESSION_STORAGE_AUTH_TOKENS } from "./constants";
import { AuthTokens, CapsuleConfig, Migration, OAuthConfig } from "./types";

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
    console.log("creating apiclient and axios instance");
    const tokens = this.getAuthTokens();

    this.client = axios.create({
      baseURL: this.baseUrl,
      headers: {
        "Content-Type": "application/json",
        "Client-Id": config.identifier || "",
        ...(tokens?.accessToken && {
          Authorization: `Bearer ${tokens.accessToken}`,
        }),
      },
      timeout: 30000,
    });

    this.setupInterceptors();
    this.oauthConfig = {
      identifier: config.identifier,
      scopes: config.scopes,
    };
  }

  updateBaseUrl(url: string): void {
    this.baseUrl = url;
    this.client.defaults.baseURL = url;
  }

  private setupInterceptors() {
    this.client.interceptors.request.use(async (config) => {
      const tokens = this.getAuthTokens();
      if (tokens?.accessToken) {
        config.headers.Authorization = `Bearer ${tokens.accessToken}`;
      }
      console.log("Capsule SDK - Outgoing request:", {
        method: config.method,
        url: config.url,
        headers: config.headers,
      });

      return config;
    });

    this.client.interceptors.response.use(
      async (response: AxiosResponse) => response,
      async (error) => {
        const tokens = this.getAuthTokens();
        if (error.response) {
          if (error.response.status === 401 && tokens?.refreshToken) {
            console.log("Capsule SDK - Attempting to refresh token");
            try {
              await this.refreshAccessToken();
              const originalRequest = error.config;
              originalRequest.headers.Authorization = `Bearer ${tokens?.accessToken}`;
              return this.client(originalRequest);
            } catch (refreshError) {
              console.error(
                "Capsule SDK - Token refresh failed:",
                refreshError,
              );
            }
          }
        } else {
          return new Error(`Error setting up request: ${error.message}`);
        }
      },
    );
  }

  async exchangeSingleUseTokenForTokens(singleUseToken: string) {
    const response = await this.client.post("users/oauth/single-use-token", {
      singleUseToken,
    });
    console.log("After Token SingleUse Exchange", response.data);
    return response;
  }

  private async refreshAccessToken(): Promise<void> {
    if (!this.tokens?.refreshToken) {
      throw new Error("No refresh token available");
    }

    try {
      const payload: Record<string, any> = {
        grant_type: "refresh_token",
        refresh_token: this.tokens.refreshToken,
      };

      if (this.oauthConfig?.identifier) {
        payload.client_identifier = this.oauthConfig.identifier;
      }

      const response = await this.client.post("/oauth/token", payload);
      this.setTokens(response.data);
    } catch (error) {
      this.tokens = null;
      throw error;
    }
  }

  setAuthTokens(tokens: AuthTokens): void {
    sessionStorage.setItem(
      SESSION_STORAGE_AUTH_TOKENS,
      JSON.stringify({
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      }),
    );
  }

  getAuthTokens(): AuthTokens | null {
    const tokensString = sessionStorage.getItem(SESSION_STORAGE_AUTH_TOKENS);
    const tokens: AuthTokens | null = tokensString
      ? JSON.parse(tokensString)
      : null;
    return tokens;
  }

  logout(): void {
    this.tokens = null;
  }

  async migrateDatabase(migrations: Migration[]) {
    try {
      const response = await this.client
        .post("/migrations/check", {
          migrations: migrations,
        })
        .then((x) => x.data);

      console.log("After migrations check :", response);
      return response.data;
    } catch (error) {
      console.error("Migration check failed:", error);
      throw error;
    }
  }

  private setTokens(tokenData: any): void {}

  async get<T>(url: string, params?: any): Promise<T> {
    const config: AxiosRequestConfig = { params };
    const response = await this.client.get<T>(url, config);
    return response.data;
  }

  async post<T>(url: string, data?: any): Promise<T> {
    const response = await this.client.post<T>(url, data);
    return response.data;
  }

  async put<T>(url: string, data?: any): Promise<T> {
    const response = await this.client.put<T>(url, data);
    return response.data;
  }

  async patch<T>(url: string, data?: any): Promise<T> {
    const response = await this.client.patch<T>(url, data);
    return response.data;
  }

  async delete<T>(url: string): Promise<T> {
    const response = await this.client.delete<T>(url);
    return response.data;
  }
}
