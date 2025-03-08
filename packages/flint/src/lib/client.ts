import { ApiClient } from './axios';
import { Collections, Documents, Events, Groups, Organizations, People, Places, Things, Users } from './resources';
import { CapsuleConfig } from './types';

export class CapsuleClient {
  private apiClient: ApiClient;

  readonly people: People;
  readonly organizations: Organizations;
  readonly events: Events;
  readonly places: Places;
  readonly things: Things;
  readonly groups: Groups;
  readonly documents: Documents;
  readonly collections: Collections;
  readonly users: Users;

  constructor(config: CapsuleConfig) {
    this.apiClient = new ApiClient(config);

    // Initialize resources
    this.people = new People(this.apiClient);
    this.organizations = new Organizations(this.apiClient);
    this.events = new Events(this.apiClient);
    this.places = new Places(this.apiClient);
    this.things = new Things(this.apiClient);
    this.groups = new Groups(this.apiClient);
    this.documents = new Documents(this.apiClient);
    this.collections = new Collections(this.apiClient);
    this.users = new Users(this.apiClient);
  }
}

export function createCapsuleClient(config: CapsuleConfig): CapsuleClient {
  return new CapsuleClient(config);
}
