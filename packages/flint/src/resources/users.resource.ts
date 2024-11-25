import { ApiClient } from "../client";
import { BaseResource } from "./base.resource";

export interface User {
  id: number;
  name: string;
  email: string;
}

export class UsersResource extends BaseResource {
  constructor(api: ApiClient) {
    super(api);
  }
  async getUser(id: number): Promise<User> {
    const { data } = await this.client.get(`/users/${id}`);
    return data;
  }

  async createUser(userData: Omit<User, "id">): Promise<User> {
    const { data } = await this.client.post("/users", userData);
    return data;
  }
}
