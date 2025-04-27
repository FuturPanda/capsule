---
title: SDK Models
description: Built-in models in the Capsule SDK
---

# Capsule SDK Models

The Capsule SDK provides several built-in models that you can use to interact with your Capsule data. These models represent common data types and provide type-safe methods for creating, reading, updating, and deleting data.

## Available Models

The SDK includes the following built-in models:

### Tasks

The `Tasks` model allows you to manage to-do items and tasks in your Capsule.

```ts
import { createCapsuleClient, OAuthScopes } from "@capsulesh/capsule-client";

const client = createCapsuleClient({
  identifier: "my-app",
  scopes: [OAuthScopes.TASKS_READ, OAuthScopes.TASKS_WRITE],
});

// Access the tasks model
const tasksModel = client.models.tasks;
```

#### Task Data Structure

```ts
interface Task {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

interface CreateTask {
  title: string;
  description?: string;
  completed?: boolean;
  dueDate?: string;
}

interface UpdateTask {
  title?: string;
  description?: string;
  completed?: boolean;
  dueDate?: string;
}
```

#### Working with Tasks

```ts
// Create a new task
const newTask = await tasksModel.create({
  title: "Complete documentation",
  description: "Finish the Capsule SDK documentation",
  dueDate: "2023-12-31",
});

// Get all tasks
const allTasks = await tasksModel.list();

// Get only completed tasks with selective fields
const completedTasks = await tasksModel
  .select(["id", "title"])
  .where({ completed: { $eq: true } })
  .list();

// Update a task
const updatedTask = await tasksModel.update(1, {
  completed: true,
});

// Delete a task
const result = await tasksModel.delete(1);
```

### Persons

The `Persons` model allows you to manage contacts and people in your Capsule.

```ts
import { createCapsuleClient, OAuthScopes } from "@capsulesh/capsule-client";

const client = createCapsuleClient({
  identifier: "my-app",
  scopes: [OAuthScopes.PROFILE_READ, OAuthScopes.PROFILE_WRITE],
});

// Access the persons model
const personsModel = client.models.persons;
```

#### Person Data Structure

```ts
interface Person {
  id: number;
  name: string;
  email?: string;
  avatar?: string;
  phone?: string;
  createdAt: string;
  updatedAt: string;
}

interface CreatePerson {
  name: string;
  email?: string;
  avatar?: string;
  phone?: string;
}

interface UpdatePerson {
  name?: string;
  email?: string;
  avatar?: string;
  phone?: string;
}
```

#### Working with Persons

```ts
// Create a new person
const newPerson = await personsModel.create({
  name: "Jane Doe",
  email: "jane@example.com",
  phone: "+1234567890",
});

// Get all persons
const allPersons = await personsModel.list();

// Get persons with a specific email pattern
const filteredPersons = await personsModel
  .select(["id", "name", "email"])
  .where({ email: { $like: "%example.com%" } })
  .list();

// Update a person
const updatedPerson = await personsModel.update(1, {
  phone: "+0987654321",
});

// Delete a person
const result = await personsModel.delete(1);
```

### Events

The `Events` model allows you to manage calendar events and appointments in your Capsule.

```ts
import { createCapsuleClient, OAuthScopes } from "@capsulesh/capsule-client";

const client = createCapsuleClient({
  identifier: "my-app",
  scopes: [OAuthScopes.EVENTS_READ, OAuthScopes.EVENTS_WRITE],
});

// Access the events model
const eventsModel = client.models.events;
```

#### Event Data Structure

```ts
interface Event {
  id: number;
  title: string;
  description?: string;
  location?: string;
  startDate: string;
  endDate?: string;
  allDay: boolean;
  createdAt: string;
  updatedAt: string;
}

interface CreateEvent {
  title: string;
  description?: string;
  location?: string;
  startDate: string;
  endDate?: string;
  allDay?: boolean;
}

interface UpdateEvent {
  title?: string;
  description?: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  allDay?: boolean;
}
```

#### Working with Events

```ts
// Create a new event
const newEvent = await eventsModel.create({
  title: "Team Meeting",
  description: "Weekly team sync",
  startDate: "2023-11-15T10:00:00Z",
  endDate: "2023-11-15T11:00:00Z",
  location: "Conference Room A",
});

// Get all events
const allEvents = await eventsModel.list();

// Get future events
const futureEvents = await eventsModel
  .select(["id", "title", "startDate"])
  .where({ startDate: { $gt: new Date().toISOString() } })
  .list();

// Update an event
const updatedEvent = await eventsModel.update(1, {
  location: "Virtual Meeting",
});

// Delete an event
const result = await eventsModel.delete(1);
```

## Common Query Methods

All models support these common query methods:

### select()

Select specific fields to return from the query.

```ts
// Select only specific fields
const tasks = await tasksModel.select(["id", "title", "dueDate"]).list();
```

### where()

Filter records based on specific conditions.

```ts
// Basic equality
const tasks = await tasksModel.where({ completed: true }).list();

// Advanced operators
const tasks = await tasksModel
  .where({
    dueDate: { $lt: new Date().toISOString() },
    completed: { $eq: false },
  })
  .list();
```

### Available operators

| Operator | Description              | Example                                  |
| -------- | ------------------------ | ---------------------------------------- |
| `$eq`    | Equal to                 | `{ $eq: 'value' }`                       |
| `$ne`    | Not equal to             | `{ $ne: 'value' }`                       |
| `$gt`    | Greater than             | `{ $gt: 100 }`                           |
| `$lt`    | Less than                | `{ $lt: 100 }`                           |
| `$gte`   | Greater than or equal to | `{ $gte: 100 }`                          |
| `$lte`   | Less than or equal to    | `{ $lte: 100 }`                          |
| `$like`  | Similar to (SQL LIKE)    | `{ $like: '%value%' }`                   |
| `$ilike` | Case-insensitive LIKE    | `{ $ilike: '%Value%' }`                  |
| `$in`    | In a list of values      | `{ $in: [1, 2, 3] }`                     |
| `$btw`   | Between two values       | `{ $btw: ['2023-01-01', '2023-12-31'] }` |

### list()

Return all records that match the query.

```ts
const allTasks = await tasksModel.list();
```

### one()

Return a single record that matches the query.

```ts
const task = await tasksModel.where({ id: 1 }).one();
```

### paginated()

Get paginated results.

```ts
const result = await tasksModel
  .where({ completed: false })
  .paginated({ page: 1, limit: 10 });

// Result includes:
// {
//   data: Task[],  // The results for the current page
//   total: number, // Total number of matching records
//   page: number,  // Current page
//   limit: number, // Items per page
//   pages: number  // Total number of pages
// }
```

## Reactivity

The Capsule SDK supports reactivity, allowing you to subscribe to data changes.

```ts
// Subscribe to task creation events
client.on("TASK_CREATED", (task) => {
  console.log("New task created:", task);
  // Update your UI here
});

// Subscribe to task updates
client.on("TASK_UPDATED", (task) => {
  console.log("Task updated:", task);
  // Update your UI here
});

// Subscribe to task deletions
client.on("TASK_DELETED", (taskId) => {
  console.log("Task deleted:", taskId);
  // Update your UI here
});
```

## Custom Databases and Models

You can also define your own custom databases and models:

```ts
// Create a custom database
await client.createDatabase({
  name: "my-custom-db",
  description: "A database for my custom app",
});

// Query a custom table
const results = await client.queryDatabase("my-custom-db", "my-table", {
  select: { fields: ["id", "name"] },
  where: { status: { operator: "eq", value: "active" } },
  orderBy: { createdAt: "DESC" },
  pagination: { page: 1, limit: 20 },
});
```

## Need more help?

Check out these additional resources:

- [SDK Installation](/sdk/installation/)
- [Authentication Guide](/sdk/login/)
- [Caplets and Objects](/sdk/objects/)
