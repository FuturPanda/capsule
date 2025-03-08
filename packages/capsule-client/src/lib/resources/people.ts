import { ApiClient } from "../axios";
import { BaseResource } from "./base";

interface Person {
  id: string;
  name: string;
  email?: string;
  phone?: string;
}

interface CreatePersonParams {
  name: string;
  email?: string;
  phone?: string;
}

interface UpdatePersonParams {
  name?: string;
  email?: string;
  phone?: string;
}

export class People extends BaseResource<
  Person,
  CreatePersonParams,
  UpdatePersonParams
> {
  constructor(apiClient: ApiClient) {
    super(apiClient, "/people");
  }

  async search(query: string): Promise<Person[]> {
    return this.apiClient.get<Person[]>(`${this.basePath}/search`, { query });
  }
}
