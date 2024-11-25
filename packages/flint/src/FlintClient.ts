import { ApiClient } from "./lib/axios";
import { FlintClientOptions } from "./lib/types";
import { UsersResource } from "./resources/users.resource";

export class FlintClient {
  private client: ApiClient;
  public users: UsersResource;

  /**
   * Create a new client for use in the browser.
   * @param capsuleUrl The unique Capsule URL which is supplied when you create a new project in your project dashboard.
   * @param supabaseKey The unique Supabase Key which is supplied when you create a new project in your project dashboard.
   * @param options.db.schema You can switch in between schemas. The schema needs to be on the list of exposed schemas inside Supabase.
   * @param options.auth.autoRefreshToken Set to "true" if you want to automatically refresh the token before expiring.
   * @param options.auth.persistSession Set to "true" if you want to automatically save the user session into local storage.
   * @param options.auth.detectSessionInUrl Set to "true" if you want to automatically detects OAuth grants in the URL and signs in the user.
   * @param options.realtime Options passed along to realtime-js constructor.
   * @param options.global.fetch A custom fetch implementation.
   * @param options.global.headers Any additional headers to send with each network request.
   */

  constructor(config: FlintClientOptions) {
    this.client = new ApiClient(config);
    this.users = new UsersResource(this.client);
  }
}
