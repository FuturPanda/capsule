import { ApiClient } from "../client";

export class BaseResource {
  constructor(protected client: ApiClient) {}
}
