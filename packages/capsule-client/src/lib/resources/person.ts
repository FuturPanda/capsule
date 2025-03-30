import { CreatePerson, Person, UpdatePerson } from "@capsulesh/shared-types";
import { ApiClient } from "../axios";
import { BaseResource } from "./base";

export class Persons extends BaseResource<Person, CreatePerson, UpdatePerson> {
  constructor(apiClient: ApiClient) {
    super(apiClient, "/persons");
  }
}
