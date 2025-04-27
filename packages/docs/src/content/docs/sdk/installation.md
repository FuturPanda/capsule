---
title: Install Capsule SDK
description: Add Capsule client to your application
---

# Installing the Capsule Client SDK

You can easily integrate your application with Capsule using our client SDK.

## Installation

Install the package using npm:

```bash
npm install @capsulesh/capsule-client
```

Or using yarn:

```bash
yarn add @capsulesh/capsule-client
```

Or using pnpm:

```bash
pnpm add @capsulesh/capsule-client
```

## Basic Setup

Once installed, you can create a Capsule client instance:

```ts
import { createCapsuleClient, OAuthScopes } from "@capsulesh/capsule-client";

const client = createCapsuleClient({
  identifier: "my-app-v1.0.0",
  scopes: [OAuthScopes.PROFILE_READ],
  redirectUri: "https://my-app.com/callback",
});
```

## Available Scopes

The SDK supports the following scopes:

| Scope          | Description                   |
| -------------- | ----------------------------- |
| `PROFILE_READ` | Read user profile information |
| `TASKS_READ`   | Read user tasks               |
| `TASKS_WRITE`  | Create and modify tasks       |
| `NOTES_READ`   | Read user notes               |
| `NOTES_WRITE`  | Create and modify notes       |

## Next Steps

After installation, you can:

1. [Handle user authentication](/sdk/login/)
2. [Work with data models](/sdk/models/)
3. [Create caplets and objects](/sdk/objects/)

## Requirements

- Node.js 16 or higher
- Modern browser with ES6 support
