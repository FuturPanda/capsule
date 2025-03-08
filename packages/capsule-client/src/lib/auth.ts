import { OAuthConfig } from "./types";
import { UrlStorage } from "./urlstorage";

export interface LoginOptions {
  loginPath?: string;
  redirectUrl?: string;
  queryParams?: Record<string, string>;
  newTab?: boolean;
  scopes?: string[];
}

export class AuthManager {
  private urlStorage: UrlStorage;
  private oauthConfig?: OAuthConfig;

  constructor(urlStorage: UrlStorage, oauthConfig: OAuthConfig) {
    this.urlStorage = urlStorage;
    this.oauthConfig = oauthConfig;
  }


}
