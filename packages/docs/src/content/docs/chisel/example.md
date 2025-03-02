---
title: Chisel ORM
description: A reference page
---

# Technical Specification: @capsulesh/chisel

## 1. Overview

`@capsulesh/chisel` is a lightweight and efficient Object-Relational Mapping (ORM) tool specifically designed for SQLite databases. It provides a type-safe, intuitive API for database operations while maintaining high performance. Chisel offers robust schema management, migrations support, and query building capabilities to streamline SQLite database interactions in Node.js applications.

## 2. Core Features

### 2.1 Database Management

- Simple connection management with both file-based and in-memory options
- Automatic schema creation and validation
- Database backup and restoration utilities
- Support for database versioning

### 2.2 Schema Definition

- Type-safe schema definition using TypeScript interfaces
- Support for all SQLite data types (INTEGER, TEXT, BLOB, REAL, NUMERIC, NULL)
- Column constraints (PRIMARY KEY, NOT NULL, UNIQUE, DEFAULT)
- Foreign key relationships
- Composite primary keys and unique constraints
- Index creation and management

### 2.3 Migration System

- Schema versioning with automatic journal tracking
- Schema comparison to detect differences
- Automatic SQL migration script generation
- Migration history tracking
- Forward and backward migration capabilities

### 2.4 Query Interface

- Fluent query builder API
- Support for complex WHERE conditions
- Pagination support
- Sorting and grouping
- Relationship handling (joins)
- Aggregate functions (COUNT, SUM, AVG, MAX, MIN)
- Transaction support

### 2.5 Model Interface

- Type-safe model definitions
- CRUD operations (Create, Read, Update, Delete)
- Bulk operations
- Relationship management
- Default value handling
- Data validation

### 2.6 Utilities

- TypeScript type generation based on schema
- SQL query sanitization
- Schema snapshots and rollbacks
- Performance optimization tools

## 3. Technical Architecture

### 3.1 Core Components

- `ChiselDb`: Main connection and database management class
- `ChiselModel`: Type-safe model interface for table operations
- `ChiselQuerable`: Base query builder for dynamic queries
- `ChiselSchema`: Schema definition and management
- Migration utilities: Schema comparison, SQL generation, versioning

### 3.2 Dependencies

- `better-sqlite3`: Core SQLite interface
- `pino`: Logging
- `uuid`: Used for unique identifier generation
- `unique-names-generator`: Used for creating readable migration filenames

### 3.3 Data Flow

1. Schema definition via TypeScript interfaces
2. Database connection initialization with schema validation
3. Migration detection and application when schema changes
4. Model interface for type-safe CRUD operations
5. Query builder for complex data retrieval and manipulation

## 4. API Design

### 4.1 Database Initialization

```typescript
// Create a new database connection with schema definition
const db = ChiselDb.create({
  uri: "./data",
  dbName: "myapp",
  migrations: [...migrations],
});

// Connect to existing database
const db = ChiselDb.getConnectionFromPath("./data/myapp.capsule");
```

### 4.2 Model Operations

```typescript
// Get a type-safe model interface
const userModel = db.getModel(User);

// CRUD operations
userModel.insert({ name: "John", email: "john@example.com" });
userModel
  .select()
  .where({ email: { $eq: "john@example.com" } })
  .exec();
userModel
  .update({ name: "John Doe" })
  .where({ id: { $eq: 1 } })
  .exec();
userModel
  .delete()
  .where({ id: { $eq: 1 } })
  .exec();
```

### 4.3 Query Building

```typescript
// Dynamic querying
db.query("users", {
  select: { fields: ["id", "name", "email"] },
  where: { active: { operator: "eq", value: true } },
  orderBy: { createdAt: "DESC" },
  pagination: { page: 1, limit: 10 },
});

// Joins and relations
db.query("users", {
  relations: {
    posts: {
      select: ["id", "title"],
      where: { published: { operator: "eq", value: true } },
    },
  },
});
```

### 4.4 Migrations

```typescript
// Define migrations
const migration = {
  changeSetId: "add-users-table",
  author: "dev-team",
  operations: [
    {
      type: "createTable",
      tableName: "users",
      columns: [
        {
          name: "id",
          type: "integer",
          constraints: { primaryKey: true, nullable: false },
        },
        {
          name: "email",
          type: "text",
          constraints: { nullable: false, unique: true },
        },
      ],
    },
  ],
};

// Apply migrations
db.applyMigrations([migration]);
```

## 5. Performance Considerations

### 5.1 Query Optimization

- Prepared statements for all database operations
- Parameter binding to prevent SQL injection
- Index utilization recommendations
- Query result caching options

### 5.2 Memory Usage

- Streaming large result sets
- Batch processing for bulk operations
- Connection pooling for multi-threaded applications

### 5.3 Disk I/O

- Transaction batching for multiple operations
- Journal mode configuration options
- Checkpoint tuning for WAL mode

## 6. Security Considerations

### 6.1 SQL Injection Prevention

- Parameter binding for all user-provided values
- Input sanitization for dynamic queries
- Query building with proper escaping

### 6.2 Data Validation

- Schema-based validation before insertion
- Type checking for all fields
- Special character handling

### 6.3 Access Control

- Read-only connection options
- Transaction isolation levels
- Database encryption support

## 7. Extensibility

### 7.1 Custom Query Functions

- Plugin system for custom query methods
- Raw SQL execution with safety measures
- Custom type converters

### 7.2 Event Hooks

- Before/after operation hooks
- Transaction lifecycle events
- Migration events

### 7.3 Integration Points

- Framework adapters (Express, Fastify, etc.)
- Data validation library integration
- Logging integration

## 8. Limitations and Constraints

### 8.1 SQLite Limitations

- No true concurrent writes (SQLite limitation)
- Limited ALTER TABLE capabilities (requires workarounds)
- Maximum database size considerations

### 8.2 ORM Limitations

- No automatic relationship detection
- Manual index management required for optimal performance
- Limited support for complex SQL features

## 9. Future Roadmap

### 9.1 Short-term

- Query builder enhancements
- Migration rollback support
- Enhanced TypeScript type generation

### 9.2 Mid-term

- Schema visualization tools
- Query performance analysis
- Database monitoring utilities

### 9.3 Long-term

- Support for additional SQLite extensions
- Distributed SQLite support (with replication)
- GUI tools for schema management

## 10. Conclusion

`@capsulesh/chisel` provides a robust, type-safe interface for SQLite databases with a focus on developer experience and performance. By combining the simplicity of SQLite with the power of a modern ORM, Chisel enables rapid development of applications that require a reliable, embedded database solution.
