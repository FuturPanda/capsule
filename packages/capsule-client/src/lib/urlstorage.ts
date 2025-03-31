export interface UrlStorageOptions {
  storageKey?: string;
}

export class UrlStorage {
  private storageKey: string;
  private validateUrl: (url: string) => boolean;

  constructor(storageKey: string) {
    this.storageKey = storageKey;
    this.validateUrl = this.defaultUrlValidator;
  }

  private defaultUrlValidator(url: string): boolean {
    try {
      const parsedUrl = new URL(url);
      return parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:";
    } catch (e) {
      return false;
    }
  }

  getUrl(): string | null {
    if (typeof localStorage !== "undefined") {
      return localStorage.getItem(this.storageKey);
    }
    return null;
  }

  saveUrl(url: string): boolean {
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(this.storageKey, `${url}/api/v1`);
    }

    return true;
  }

  promptUserForUrl(): string | null {
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

      isValid = this.validateUrl(url);

      if (!isValid) {
        window.alert(
          "Invalid URL. Please enter a valid URL (e.g., https://api.example.com)",
        );
      }
    }

    this.saveUrl(url ?? "");
    return this.getUrl();
  }

  getOrPromptForUrl(): string | null {
    const storedUrl = this.getUrl();

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
