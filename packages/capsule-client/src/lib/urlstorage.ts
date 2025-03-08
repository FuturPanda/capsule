export interface UrlStorageOptions {
  storageKey?: string;
  validateUrl?: (url: string) => boolean | Promise<boolean>;
}

export class UrlStorage {
  private storageKey: string;
  private validateUrl: (url: string) => boolean | Promise<boolean>;

  constructor(options: UrlStorageOptions = {}) {
    this.storageKey = options.storageKey || "capsule_api_url";
    this.validateUrl = options.validateUrl || this.defaultUrlValidator;
  }

  private defaultUrlValidator(url: string): boolean {
    try {
      const parsedUrl = new URL(url);
      return parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:";
    } catch (e) {
      return false;
    }
  }

  async getUrl(): Promise<string | null> {
    if (typeof localStorage !== "undefined") {
      return localStorage.getItem(this.storageKey);
    }
    return null;
  }

  async saveUrl(url: string): Promise<boolean> {
    const isValid = await this.validateUrl(url);

    if (!isValid) {
      return false;
    }

    if (typeof localStorage !== "undefined") {
      localStorage.setItem(this.storageKey, url);
    }

    return true;
  }

  async promptUserForUrl(): Promise<string | null> {
    if (typeof window === "undefined") {
      throw new Error("Cannot prompt for URL in non-browser environment");
    }

    let url: string | null = null;
    let isValid = false;

    while (!isValid) {
      url = window.prompt("Please enter your Capsule API URL:");

      if (url === null) {
        return null;
      }

      isValid = await this.validateUrl(url);

      if (!isValid) {
        window.alert(
          "Invalid URL. Please enter a valid URL (e.g., https://api.example.com)",
        );
      }
    }

    await this.saveUrl(url ?? "");
    return url;
  }

  async getOrPromptForUrl(): Promise<string | null> {
    const storedUrl = await this.getUrl();

    if (storedUrl) {
      return storedUrl;
    }

    return this.promptUserForUrl();
  }

  async clearUrl(): Promise<void> {
    if (typeof localStorage !== "undefined") {
      localStorage.removeItem(this.storageKey);
    }
  }
}
