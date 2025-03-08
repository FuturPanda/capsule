import { UrlStorage } from "./dynamic/url-storage";

export interface LoginOptions {
  /**
   * The path to the login page, relative to the base URL
   * Default: '/login'
   */
  loginPath?: string;

  /**
   * The redirect URL to return to after login
   * Default: current window location
   */
  redirectUrl?: string;

  /**
   * Custom query parameters to add to the login URL
   */
  queryParams?: Record<string, string>;

  /**
   * Whether to open the login page in a new tab/window
   * Default: false
   */
  newTab?: boolean;
}

export class AuthManager {
  private urlStorage: UrlStorage;

  constructor(urlStorage: UrlStorage) {
    this.urlStorage = urlStorage;
  }

  /**
   * Redirects the user to the login page
   */
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
      const loginPath = options.loginPath || "/login";
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

  /**
   * Handles OAuth callback after login redirect
   * This can be used to extract tokens from URL parameters after login redirect
   */
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
