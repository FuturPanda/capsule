import {
  CapsuleEventType,
  CreateDatabase,
  Migration,
  ModelType,
  OAuthConfig,
  OAuthScopes as _OAuthScopes,
} from "@capsulesh/shared-types";
import { ApiClient } from "./axios";
import { EventEmitter } from "./event-emitter";
import { Events, Tasks } from "./resources";
import { Persons } from "./resources/person";
import { UrlStorage } from "./urlstorage";
export const OAuthScopes = _OAuthScopes;

export interface CapsuleConfig extends OAuthConfig {
  redirectUri?: string;
  capsuleUrl?: string;
  databaseMigrations?: Migration[];
  models?: ModelType[];
}

export class CapsuleClient {
  private apiClient: ApiClient | null = null;
  private urlStorage: UrlStorage;
  private capsuleUrl: string | null = null;
  private config: CapsuleConfig;
  private tasks?: Tasks;
  private persons?: Persons;
  private events?: Events;
  private eventEmitter = new EventEmitter();

  get models() {
    const base = {
      ...(this.tasks && { tasks: this.tasks }),
      ...(this.events && { events: this.events }),
      ...(this.persons && { persons: this.persons }),
    };

    return Object.freeze(base);
  }

  get<T>(key: string): T | undefined {
    return (this.models as any)[key] as T;
  }

  constructor(config: CapsuleConfig) {
    this.urlStorage = new UrlStorage(`${config.identifier}::capsule_url`);
    this.config = config;
    const url = this.urlStorage.getUrl();
    if (url) {
      this.apiClient = new ApiClient({
        ...this.config,
        capsuleUrl: url,
      });
    }
  }

  async handleOnLoginClick(options = { newTab: true }): Promise<boolean> {
    if (!this.capsuleUrl) {
      const url = this.urlStorage.getOrPromptForUrl();
      if (url) {
        this.apiClient = new ApiClient({
          ...{ ...this.config, capsuleUrl: url },
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
      const loginPath = "/users/login";
      const loginUrl = new URL(`${apiUrl}${loginPath}`);

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
          sessionStorage.setItem(`${this.config.identifier}:::capsule_auth_tokens", JSON.stringify(tokens));
        }

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

  connectReactivity() {
    this.apiClient?.connectToSseEvents((data) => {
      if (data) {
        this.eventEmitter.emit(data.type, data.payload);
      }
    });
  }

  authStatus(): boolean {
    const tokens = JSON.parse(
      sessionStorage.getItem("capsule_auth_tokens") || "{}",
    );
    console.log(!!tokens.accessToken, "In capsule client authStatus");
    return !!tokens.accessToken;
  }

  async clearApiUrl(): Promise<void> {
    await this.urlStorage.clearUrl();
  }

  createResources() {
    const scopeResourceMap = {
      [OAuthScopes.TASKS_READ]: ["tasks"],
      [OAuthScopes.TASKS_WRITE]: ["tasks"],
      [OAuthScopes.EVENTS_READ]: ["events"],
      [OAuthScopes.EVENTS_WRITE]: ["events"],
      [OAuthScopes.PROFILE_READ]: ["profile"],
      [OAuthScopes.PROFILE_WRITE]: ["profile"],
      [OAuthScopes.EMAIL_READ]: ["profile"],
      [OAuthScopes.EMAIL_WRITE]: ["profile"],
      [OAuthScopes.DATABASE_OWNER]: ["profile", "tasks", "events", "persons"],
    };

    const enabledResources = new Set<string>();
    if (this.config.scopes)
      for (const scope of this.config.scopes) {
        const resources: string[] = scopeResourceMap[scope];
        if (resources) {
          resources.forEach((resource) => enabledResources.add(resource));
        }
      }
    if (!this.apiClient) {
      return;
    }
    if (enabledResources.has("tasks")) {
      this.tasks = new Tasks(this.apiClient, this.eventEmitter);
    }

    if (enabledResources.has("persons")) {
      this.persons = new Persons(this.apiClient);
    }
    if (enabledResources.has("events")) {
      this.events = new Events(this.apiClient);
    }
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

  on(event: CapsuleEventType, callback: (data: any) => void): () => void {
    return this.eventEmitter.on(event, callback);
  }

  getAllDatabases() {
    return this.apiClient?.getDatabases();
  }
  createDatabase(dto: CreateDatabase) {
    return this.apiClient?.createDatabase(dto);
  }

  queryDatabase(databaseId: string, tableName: string, query: unknown) {
    return this.apiClient?.queryDatabase(databaseId, tableName, query);
  }
}

export function createCapsuleClient(config: CapsuleConfig): CapsuleClient {
  const capsuleClient = new CapsuleClient(config);

  if (typeof window !== "undefined") {
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

    if (capsuleClient.authStatus()) {
      capsuleClient.createResources();
      capsuleClient.connectReactivity();
      capsuleClient.handleMigration();
    }
  }

  return capsuleClient;
}
