import { AuthTokens } from "./types";
import { UrlStorage } from "./urlstorage";

export interface LoginOptions {
  loginPath?: string;
  redirectUrl?: string;
  queryParams?: Record<string, string>;
  newTab?: boolean;
}

export class AuthManager {
  private urlStorage: UrlStorage;

  constructor(urlStorage: UrlStorage) {
    this.urlStorage = urlStorage;
  }

  async handleLoginRedirect(options: LoginOptions = {}): Promise<boolean> {
    if (typeof window === "undefined") {
      throw new Error("Cannot redirect to login in non-browser environment");
    }

    // Get or prompt for API URL
    const apiUrl = await this.urlStorage.getOrPromptForUrl();

    if (!apiUrl) {
      console.error("Login failed: No API URL provided");
      return false;
    }

    try {
      // Construct the login URL
      const baseUrl = new URL(apiUrl);
      const loginPath = options.loginPath || "/api/v1/users/login";
      const loginUrl = new URL(loginPath, baseUrl.origin);

      // Add redirect URL if provided, otherwise use current location
      const redirectUrl = options.redirectUrl || window.location.href;
      loginUrl.searchParams.append("redirect_uri", redirectUrl);

      // Add any custom query parameters
      if (options.queryParams) {
        Object.entries(options.queryParams).forEach(([key, value]) => {
          loginUrl.searchParams.append(key, value);
        });
      }

      // Redirect to the login page
      if (options.newTab) {
        window.open(loginUrl.toString(), "_blank");
      } else {
        window.location.href = loginUrl.toString();
      }

      return true;
    } catch (error) {
      console.error("Failed to redirect to login page:", error);
      return false;
    }
  }

  handleLoginCallback(): AuthTokens | null {
    if (typeof window === "undefined") {
      return null;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const accessToken = urlParams.get("access_token");
    const refreshToken = urlParams.get("refresh_token");
    const expiresIn = urlParams.get("expires_in");

    if (!accessToken) {
      return null;
    }

    return {
      accessToken,
      refreshToken: refreshToken || undefined,
      expiresAt: expiresIn
        ? Date.now() + parseInt(expiresIn, 10) * 1000
        : undefined,
    };
  }
}
