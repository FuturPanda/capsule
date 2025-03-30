import { CreateEvent, UpdateEvent } from "@capsulesh/shared-types";
import { ApiClient } from "../axios";
import { BaseResource } from "./base";

export class Events extends BaseResource<Event, CreateEvent, UpdateEvent> {
  constructor(apiClient: ApiClient) {
    super(apiClient, "/events");
  }
}
