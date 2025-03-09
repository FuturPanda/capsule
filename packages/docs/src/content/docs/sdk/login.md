---
title: Handle login with your Capsule
description: Auth made simple with your Capsule.
---

# createCapsuleClient

```ts
const client = createCapsuleClient(config);
```

## Configuration :

```ts
interface CapsuleConfig extends OAuthConfig {
  timeout?: number;
  validateUrl?: (url: string) => boolean;
  redirectUri?: string;
  capsuleUrl?: string;
}
interface OAuthConfig {
  identifier: string;
  scopes?: OAuthScopes[];
  clientId?: string;
}
```

## Ask for scopes authorization

For more information about models see [Models](/docs/sdk/models).

# Full Example :

```ts
import {
  CapsuleClient,
  createCapsuleClient,
  OAuthScopes,
  type CapsuleConfig,
} from "@capsule-mono-repo/capsule-client";

const config: CapsuleConfig = {
  scopes: [
    OAuthScopes.PROFILE_READ,
    OAuthScopes.TASKS_READ,
    OAuthScopes.TASKS_WRITE,
  ],
  identifier: "my-awesome-app-v1.0.3",
  redirectUri: "http://localhost:5173/",
};

let client: CapsuleClient | null = $state(null);

const useCapsuleClient = () => {
  try {
    if (!client) {
      console.log("Creating Capsule client");
      client = createCapsuleClient(config);
    }
    return client;
  } catch (error) {
    console.error("Failed to create Capsule client:", error);
    throw error;
  }
};
export default useCapsuleClient;
```
