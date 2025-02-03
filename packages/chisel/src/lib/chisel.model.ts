import { Database } from "better-sqlite3";
import console from "node:console";
import {
  ClassType,
  ExecParams,
  FilterQuery,
  QuerySelector,
} from "./_utils/types/queries.type";
import { fromClassTypeToSnakeCase } from "./_utils/functions/string-converter.function";

type WriteOutput = {
  success: boolean;
  id: number | bigint | null;
  changes: number;
};

type QueryBuilder = {
  where: (params: FilterQuery<any>) => any;
  orderBy?: (column: any, order: "DESC" | "ASC") => any;
  exec: (params?: ExecParams) => any;
  limit?: (params: number) => any;
  join?: any;
};

export class ChiselModel<T> {
  private readonly db: Database;
  private readonly modelName: string;

  constructor(db: Database, model: ClassType<T>) {
    this.db = db;
    this.modelName = fromClassTypeToSnakeCase(model);
  }

  insert(
    params: Partial<Pick<T, keyof T>> | Record<string, string>,
    opts?: { ignoreExisting: boolean },
  ): WriteOutput {
    const query = this.buildInsertQuery(
      Object.keys(params),
      opts?.ignoreExisting,
    );
    console.log("QUERYYYYY : ", query);
    return this.executeWrite(query, Object.values(params));
  }

  upsert(
    params: Partial<Pick<T, keyof T>> | Record<string, string>,
    conflictColumns: (keyof T)[],
    updateColumns?: (keyof T)[],
  ): WriteOutput {
    const keys = Object.keys(params);
    const baseInsert = this.buildInsertQuery(keys);
    const conflictClause = this.buildConflictClause(
      conflictColumns,
      updateColumns || keys,
    );
    const query = `${baseInsert} ${conflictClause}`;
    return this.executeWrite(query, Object.values(params));
  }

  insertMany(
    rows: (Partial<Pick<T, keyof T>> | Record<string, string>)[],
    opts?: { ignoreExisting: boolean },
  ): WriteOutput {
    if (rows.length === 0) {
      return { success: false, id: null, changes: 0 };
    }

    const keys = Object.keys(rows[0]);
    if (
      !rows.every(
        (row) =>
          Object.keys(row).length === keys.length &&
          Object.keys(row).every((key) => keys.includes(key)),
      )
    ) {
      throw new Error("All rows must have the same structure");
    }

    const placeholders = rows
      .map(() => `(${keys.map(() => "?").join(", ")})`)
      .join(", ");

    const query =
      `INSERT
      ${opts?.ignoreExisting ? "OR IGNORE " : ""}INTO
      ${this.modelName} ` + `(${keys.join(", ")}) VALUES ${placeholders}`;

    const values = rows.flatMap((row) => Object.values(row));

    return this.executeWrite(query, values);
  }

  select(dto?: Record<string, `${string}.${string}`>): QueryBuilder {
    let query = this.buildSelectQuery(dto);
    const exec = (params?: ExecParams): T[] | T | undefined =>
      this.executeSelect(query, params);

    const queryBuilder: QueryBuilder = {
      where: (params: FilterQuery<T>) => {
        query += this.buildWhereClause(params);
        return { ...queryBuilder, exec };
      },
      orderBy: (column: keyof T, order: "DESC" | "ASC") => {
        query += " " + this.buildOrderByClause(column, order);
        return { ...queryBuilder, exec };
      },
      limit: (params: number) => {
        query += " " + this.buildLimitClause(params);
        return { exec };
      },
      join: <Local, Foreign>(
        fromTable: ClassType<Local>,
        toTable: ClassType<Foreign>,
        localKey: keyof Local & string,
        foreignKey: keyof Foreign & string,
        type: "INNER" | "LEFT" | "RIGHT" = "INNER",
      ) => {
        query += this.buildJoinClause(
          fromTable,
          toTable,
          localKey,
          foreignKey,
          type,
        );
        return { ...queryBuilder };
      },
      exec,
    };

    return queryBuilder;
  }

  update(params: { [P in keyof T]?: T[P] }): QueryBuilder {
    const entries = Object.entries(params);
    const placeholders = entries.map(([key]) => `${key} = ?`);
    const values = entries.map(([_, value]) => value);

    let query = `UPDATE ${this.modelName}
                 SET ${placeholders.join(", ")} `;

    const exec = () => this.executeWrite(query, values);

    return {
      where: (params: FilterQuery<T>) => {
        const { whereQuery, whereValues } =
          this.buildWhereClauseWithParams(params);
        query += whereQuery;
        return {
          exec: () => this.executeWrite(query, [...values, ...whereValues]),
        };
      },
      exec,
    };
  }

  delete(): QueryBuilder {
    let query = `DELETE
                 FROM ${this.modelName} `;
    const exec = () => this.executeWrite(query, []);

    return {
      where: (params: FilterQuery<T>) => {
        query += this.buildWhereClause(params);
        return { exec };
      },
      exec,
    };
  }

  private buildInsertQuery(keys: string[], ignoreExisting = false): string {
    const placeholders = keys.map(() => "?").join(", ");
    return `INSERT
    ${ignoreExisting ? "OR IGNORE " : ""}INTO
    ${this.modelName}
    (
    ${keys.join(", ")}
    )
    VALUES (${placeholders})`;
  }

  private buildConflictClause(
    conflictColumns: (keyof T)[],
    updateColumns: (keyof T | string)[],
  ): string {
    if (conflictColumns.length === 0) return "";
    const updates = updateColumns
      .filter((col) => !conflictColumns.includes(col as keyof T))
      .map((col) => `${String(col)} = excluded.${String(col)}`)
      .join(", ");
    return `ON CONFLICT(${conflictColumns.join(", ")}) DO UPDATE SET ${updates}`;
  }

  private executeWrite(query: string, values: unknown[]): WriteOutput {
    console.log("BEFORE EXE = ", query);
    try {
      const stmt = this.db.prepare(query);
      const res = stmt.run(values);
      return {
        success: res.changes > 0,
        id: res.lastInsertRowid,
        changes: res.changes,
      };
    } catch (error) {
      console.error("Error writing to the database:", error);
      return { success: false, id: null, changes: 0 };
    }
  }

  private buildWhereClause(params: FilterQuery<T>, tableName?: string): string {
    let query = "";
    let isFirstCondition = true;

    for (const field in params) {
      const conditions = params[field];
      if (conditions && typeof conditions === "object") {
        for (const conditionKey in conditions) {
          const conditionValue = conditions[conditionKey];
          const fieldParts = field.split(".");
          const fieldName =
            fieldParts.length > 1
              ? field
              : `${tableName || this.modelName}.${field}`;
          query += this.generateFilterQuery(
            fieldName,
            conditionValue,
            conditionKey as keyof QuerySelector<T>,
            isFirstCondition,
          );
          isFirstCondition = false;
        }
      }
    }
    return query;
  }

  private buildWhereClauseWithParams(
    params: FilterQuery<T>,
    tableName?: string,
  ): {
    whereQuery: string;
    whereValues: unknown[];
  } {
    let whereQuery = "";
    let isFirstCondition = true;
    const whereValues: unknown[] = [];

    for (const field in params) {
      const conditions = params[field];
      if (conditions && typeof conditions === "object") {
        for (const conditionKey in conditions) {
          const conditionValue = conditions[conditionKey];
          const fieldParts = field.split(".");
          const fieldName =
            fieldParts.length > 1
              ? field
              : `${tableName || this.modelName}.${field}`;

          const { clause, values } = this.generateFilterQueryWithParams(
            fieldName,
            conditionValue,
            conditionKey as keyof QuerySelector<T>,
            isFirstCondition,
          );

          whereQuery += clause;
          whereValues.push(...values);
          isFirstCondition = false;
        }
      }
    }

    return { whereQuery, whereValues };
  }

  private buildOrderByClause(column: keyof T, order: "DESC" | "ASC"): string {
    return `ORDER BY ${String(column)} ${order}`;
  }

  private buildLimitClause(limit: number): string {
    return `LIMIT ${limit}`;
  }

  private buildSelectQuery(
    dto?: Record<string, `${string}.${string}`>,
  ): string {
    if (!dto)
      return `SELECT *
              FROM ${this.modelName} `;

    const aliases = Object.entries(dto)
      .filter(([_, param]) => param.split(".")[1] !== "*")
      .map(([alias, param]) => `${param} AS ${alias}`);

    return `SELECT ${aliases.length > 0 ? aliases.join(", ") : "*"}
            FROM ${this.modelName} `;
  }

  private buildJoinClause<Local, Foreign>(
    fromTable: ClassType<Local>,
    toTable: ClassType<Foreign>,
    localKey: keyof Local & string,
    foreignKey: keyof Foreign & string,
    type: "INNER" | "LEFT" | "RIGHT",
  ): string {
    return ` ${type} JOIN ${fromClassTypeToSnakeCase(toTable)} ON ${fromClassTypeToSnakeCase(fromTable)}.${localKey} = ${fromClassTypeToSnakeCase(toTable)}.${foreignKey}`;
  }

  private executeSelect(
    query: string,
    params?: ExecParams,
  ): T[] | T | undefined {
    try {
      console.log("before exec ", query);
      const stmt = this.db.prepare(query);
      const res = stmt.all() as T[];
      if (params?.one && res.length > 0) return res[0];
      return res.length === 0 ? undefined : res;
    } catch (error) {
      console.error("Error reading from the database:", error);
      throw error;
    }
  }

  private generateFilterQuery<T extends T[], K extends keyof QuerySelector<T>>(
    field: string,
    conditionValue: T,
    conditionKey: K,
    isFirstCondition: boolean = true,
  ): string {
    const conditions = {
      $eq: () => `${field} = '${conditionValue}'`,
      $ne: () => `${field} != '${conditionValue}'`,
      $gt: () => `${field} > '${conditionValue}'`,
      $lt: () => `${field} < '${conditionValue}'`,
      $gte: () => `${field} >= '${conditionValue}'`,
      $lte: () => `${field} <= '${conditionValue}'`,
      $btw: () =>
        `${field} BETWEEN '${conditionValue[0]}' AND '${conditionValue[1]}'`,
      $in: () =>
        `${field} IN (${conditionValue.map((value) => `'${value}'`).join(", ")})`,
      $nin: () =>
        `${field} NOT IN (${conditionValue.map((value) => `'${value}'`).join(", ")})`,
      $like: () => `${field} LIKE '${conditionValue[1]}'`,
      $ilike: () => `${field} LIKE '${conditionValue[1]}' COLLATE NOCASE`,
    };

    const condition = conditions[conditionKey as keyof typeof conditions];
    if (!condition) {
      console.log(`Field ${field}: Unknown condition '${conditionValue[1]}'`);
      return "";
    }

    return `${isFirstCondition ? "WHERE" : "AND"} ${condition()}`;
  }

  private generateFilterQueryWithParams<
    T extends T[],
    K extends keyof QuerySelector<T>,
  >(
    field: string,
    conditionValue: T,
    conditionKey: K,
    isFirstCondition: boolean = true,
  ): { clause: string; values: unknown[] } {
    const conditions: Record<
      string,
      () => { clause: string; values: unknown[] }
    > = {
      $eq: () => ({
        clause: `${field} = ?`,
        values: [conditionValue],
      }),
      $ne: () => ({
        clause: `${field} != ?`,
        values: [conditionValue],
      }),
      $gt: () => ({
        clause: `${field} > ?`,
        values: [conditionValue],
      }),
      $lt: () => ({
        clause: `${field} < ?`,
        values: [conditionValue],
      }),
      $gte: () => ({
        clause: `${field} >= ?`,
        values: [conditionValue],
      }),
      $lte: () => ({
        clause: `${field} <= ?`,
        values: [conditionValue],
      }),
      $btw: () => ({
        clause: `${field} BETWEEN ? AND ?`,
        values: [conditionValue[0], conditionValue[1]],
      }),
      $in: () => ({
        clause: `${field} IN (${Array(conditionValue.length).fill("?").join(", ")})`,
        values: [...conditionValue],
      }),
      $nin: () => ({
        clause: `${field} NOT IN (${Array(conditionValue.length).fill("?").join(", ")})`,
        values: [...conditionValue],
      }),
      $like: () => ({
        clause: `${field} LIKE ?`,
        values: [conditionValue[1]],
      }),
      $ilike: () => ({
        clause: `${field} LIKE ? COLLATE NOCASE`,
        values: [conditionValue[1]],
      }),
    };

    const condition = conditions[conditionKey as keyof typeof conditions];
    if (!condition) {
      console.log(`Field ${field}: Unknown condition '${conditionValue[1]}'`);
      return { clause: "", values: [] };
    }

    const { clause, values } = condition();
    return {
      clause: `${isFirstCondition ? "WHERE" : "AND"} ${clause}`,
      values,
    };
  }
}
