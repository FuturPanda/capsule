import { AuthManager, LoginOptions } from "./auth";
import { ApiClient } from "./axios";
import { Events, People, Tasks } from "./resources";
import { AuthTokens, CapsuleConfig } from "./types";
import { UrlStorage } from "./urlstorage";

export class CapsuleClient {
  private apiClient: ApiClient;
  private urlStorage: UrlStorage;
  private authManager: AuthManager;

  readonly people: People;
  readonly events: Events;
  readonly tasks: Tasks;

  constructor(config: CapsuleConfig) {
    this.urlStorage = new UrlStorage({
      storageKey: config.urlStorageKey || "capsule_api_url",
      validateUrl: config.validateUrl,
    });

    this.authManager = new AuthManager(this.urlStorage);

    this.apiClient = new ApiClient(config);

    this.people = new People(this.apiClient);
    this.events = new Events(this.apiClient);
    this.tasks = new Tasks(this.apiClient);

    if (typeof window !== "undefined") {
      const tokens = this.authManager.handleLoginCallback();
      if (tokens) {
        this.apiClient.setAuthTokens(tokens);
      }
    }
  }

  async handleOnLoginClick(
    options: LoginOptions = { newTab: true },
  ): Promise<boolean> {
    return this.authManager.handleLoginRedirect(options);
  }

  async login(username: string, password: string): Promise<AuthTokens> {
    return this.apiClient.authenticate(username, password);
  }

  logout(): void {
    this.apiClient.logout();
  }

  getAuthTokens(): AuthTokens | null {
    return this.apiClient.getAuthTokens();
  }

  setAuthTokens(tokens: AuthTokens): void {
    this.apiClient.setAuthTokens(tokens);
  }

  async ensureApiUrl(): Promise<string | null> {
    return this.urlStorage.getOrPromptForUrl();
  }

  async updateApiUrl(url: string): Promise<boolean> {
    const success = await this.urlStorage.saveUrl(url);
    if (success) {
      this.apiClient.updateBaseUrl(url);
    }
    return success;
  }

  async clearApiUrl(): Promise<void> {
    await this.urlStorage.clearUrl();
  }
}

export async function createCapsuleClient(
  config: CapsuleConfig,
): Promise<CapsuleClient> {
  const urlStorage = new UrlStorage({
    storageKey: config.urlStorageKey || "capsule_api_url",
    validateUrl: config.validateUrl,
  });

  if (!config.capsuleUrl) {
    const url = await urlStorage.getOrPromptForUrl();
    if (url) {
      config = { ...config, capsuleUrl: url };
    } else {
      throw new Error(
        "Capsule API URL is required. User canceled or no URL available.",
      );
    }
  }

  return new CapsuleClient(config);
}
