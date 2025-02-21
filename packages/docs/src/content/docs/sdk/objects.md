---
title: Create your models
description: Your first digital space.
---

This documentation describes the database configuration file for the capsule, in case you want to create your own models.
The configuration uses TOML format to define database schema changes and structure. It really similar to liquibase and permit versionning of the database.

## Configuration Header

```toml
version = "1.0.0"
changeSetId = "20241214-01"
author = "steevy"
description = "Initial schema setup"
database = "capsule-kit"
```

### Header Fields

| Field         | Description                         | Example                |
| ------------- | ----------------------------------- | ---------------------- |
| `version`     | Schema version number               | `1.0.0`                |
| `changeSetId` | Unique identifier for the changeset | `20241214-01`          |
| `author`      | Author of the changes               | `steevy`               |
| `description` | Brief description of changes        | `Initial schema setup` |
| `database`    | Target database name                | `capsule-kit`          |

## Schema Structure

### Operations

The `operations` tag is the main tag to define an action to be performed on the database.

```toml
[[operations]]
type = "createTable"
tableName = "caplet"
```

#### Operations Fields

| Field         | Data Type                   | Description                                        |
| ------------- | --------------------------- | -------------------------------------------------- |
| `type`        | text                        | The operation type to execute against the database |
| `tableName`   | text                        | Name of the table to execute the operatio against  |
| `columns`     | List [ColumnDefinition]     | Definitions of the columns in the table            |
| `foreignKeys` | List [ForeignKeyDefinition] | Definitions of the foreign keys in the table       |

##### Operations Type

Can be of value :

- createTable
- dropTable
- alterTable

##### Columns Définitions

{ name = "id", type = "text", constraints = { primaryKey = true, nullable = false } },

| Column Name   | Data Type             | Description               |
| ------------- | --------------------- | ------------------------- |
| `name`        | text                  | Name of the column        |
| `type`        | text                  | Type of content stored    |
| `constraints` | Constraint Definition | constraints of the column |

###### Constraint Definitions

| Constraint Type | Constraint Definition | Value   |
| --------------- | --------------------- | ------- |
| primaryKey      | PRIMARY KEY           | boolean |
| notNull         | NOT NULL              | boolean |

#### Foreign Key Relationships

| Constraint Name      | Referenced Column                      |
| -------------------- | -------------------------------------- |
| baseColumnName       | The name of the Primary Column         |
| referencedTableName  | The name of the referenced table       |
| referencedColumnName | The name of the referenced table       |
| constraintName       | The name of the foreign key constraint |

Example

> ```toml
> { baseColumnName = "caplet_id", referencedTableName = "caplet", referencedColumnName = "id", constraintName = "fk_content_caplet_id_caplet_id" },
> ```

## Usage Example

```toml
version = "1.0.0"
changeSetId = "20241214-01"
author = "steevy"
description = "Initial schema setup"
database = "capsule-kit"

[[operations]]
type = "createTable"
tableName = "caplet"
columns = [
    { name = "id", type = "text", constraints = { primaryKey = true, nullable = false } },
    { name = "title", type = "text", constraints = { nullable = false } },
    { name = "icon", type = "text" },
]


[[operations]]
type = "createTable"
tableName = "caplet_content"
columns = [
    { name = "id", type = "text", constraints = { primaryKey = true, nullable = false } },
    { name = "content_type", type = "text" },
    { name = "value", type = "text" },
    { name = "caplet_id", type = "text" }
]
foreignKeys = [
    { baseColumnName = "caplet_id", referencedTableName = "caplet", referencedColumnName = "id", constraintName = "fk_content_caplet_id_caplet_id" },
]
```
