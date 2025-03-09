import { ApiClient } from "./axios";
import { CapsuleConfig, OAuthScopes } from "./types";
import { UrlStorage } from "./urlstorage";

export class CapsuleClient {
  private apiClient: ApiClient | null = null;
  private urlStorage: UrlStorage;
  private capsuleUrl: string | null = null;
  private config: CapsuleConfig;

  constructor(config: CapsuleConfig) {
    this.urlStorage = new UrlStorage(`${config.identifier}::capsule_url`);
    this.config = config;
  }

  async handleOnLoginClick(options = { newTab: true }): Promise<boolean> {
    if (!this.capsuleUrl) {
      const url = this.urlStorage.getOrPromptForUrl();
      if (url) {
        this.capsuleUrl = url;
        this.apiClient = new ApiClient({
          ...this.config,
          capsuleUrl: this.capsuleUrl,
        });
      } else {
        throw new Error(
          "Capsule API URL is required. User canceled or no URL available.",
        );
      }
    }
    this.loadTokensFromStorage();

    return this.handleLoginRedirect(options);
  }
  async handleLoginRedirect(options = {}): Promise<boolean> {
    if (typeof window === "undefined") {
      throw new Error("Cannot redirect to login in non-browser environment");
    }

    const apiUrl = this.urlStorage.getOrPromptForUrl();

    if (!apiUrl) {
      return false;
    }

    try {
      const baseUrl = new URL(apiUrl);
      const loginPath = "/api/v1/users/login";
      const loginUrl = new URL(loginPath, baseUrl.origin);

      const redirectUrl = window.location.href;
      loginUrl.searchParams.append("redirect_uri", redirectUrl);

      const scopes = this.config.scopes;
      if (scopes && scopes.length > 0) {
        loginUrl.searchParams.append("scopes", scopes.join(","));
      }

      if (this.config.identifier) {
        loginUrl.searchParams.append(
          "client_identifier",
          this.config.identifier,
        );
      }

      const authWindow = window.open(
        loginUrl.toString(),
        "OAuthConsent",
        "width=500,height=600,resizable,scrollbars=yes,status=1",
      );
      if (!authWindow) window.open(loginUrl.toString(), "_blank");

      return true;
    } catch (error) {
      console.error("Failed to redirect to login page:", error);
      return false;
    }
  }

  async handleLoginCallback(singleUseToken: string) {
    try {
      const response =
        await this.apiClient?.exchangeSingleUseTokenForTokens(singleUseToken);

      if (response && response.data) {
        const tokens = {
          accessToken: response.data.access_token,
          refreshToken: response.data.refresh_token,
        };

        this.apiClient?.setAuthTokens(tokens);

        if (typeof window !== "undefined") {
          sessionStorage.setItem("capsule_auth_tokens", JSON.stringify(tokens));
        }

        console.log("Tokens received and stored in session storage");
        return response;
      }

      throw new Error("Invalid response from token exchange");
    } catch (error) {
      console.error("Error handling login callback:", error);
      throw error;
    }
  }
  getRedirectUri(): string {
    return this.config.redirectUri || "";
  }

  authStatus(): boolean {
    const tokens = JSON.parse(
      sessionStorage.getItem("capsule_auth_tokens") || "{}",
    );
    return tokens.accessToken;
  }

  async clearApiUrl(): Promise<void> {
    await this.urlStorage.clearUrl();
  }

  private loadTokensFromStorage(): void {
    if (typeof window !== "undefined" && this.apiClient) {
      const storedTokens = sessionStorage.getItem("capsule_auth_tokens");
      if (storedTokens) {
        try {
          const tokens = JSON.parse(storedTokens);
          this.apiClient.setAuthTokens(tokens);
        } catch (e) {
          console.error("Failed to parse stored tokens", e);
          sessionStorage.removeItem("capsule_auth_tokens");
        }
      }
    }
  }

  async handleMigration(): Promise<void> {
    if (this.apiClient && this.config.databaseMigrations) {
      this.apiClient.migrateDatabase(this.config.databaseMigrations);
    }
  }
}

export { OAuthScopes };

export function createCapsuleClient(config: CapsuleConfig): CapsuleClient {
  const capsuleClient = new CapsuleClient(config);

  if (typeof window !== "undefined") {
    console.log("creating window event listeners");
    window.addEventListener("message", async (event) => {
      const message = event.data;

      if (message && message.type === "oauth_complete") {
        if (message.approved) {
          console.log("User approved the authorization");
          await capsuleClient.handleLoginCallback(message.singleUseToken);
          await capsuleClient.handleMigration();
          window.removeEventListener("message", () => {});
          window.location.replace(capsuleClient.getRedirectUri());
        } else {
          console.log("User denied the authorization");
        }
      }
    });
  }

  return capsuleClient;
}
