export class AuthorizationModel {
  id: number;
  name: string;
}

export class ResourceClientAuthorizationModel {
  resource_id: number;
  client_id: number;
  authorization_id: number;
}
