import { Database } from "better-sqlite3";
import console from "node:console";
import {
  ClassType,
  ExecParams,
  FilterQuery,
  QuerySelector,
} from "./_utils/types/queries.type";

export class ChiselModel<T> {
  private readonly db: Database;
  private readonly model: ClassType<T>;
  private readonly modelName: string;

  constructor(db: Database, model: ClassType<T>) {
    this.db = db;
    this.model = model;
    this.modelName = model.name.toLowerCase();
  }

  insert(
    params: Partial<Pick<T, keyof T>> | Record<string, string>,
    opts?: { ignoreExisting: boolean },
  ) {
    let query: string = `INSERT ${opts?.ignoreExisting ? "OR IGNORE " : ""}INTO ${this.modelName}`;
    const keys = Object.keys(params);
    const placeholders = keys.map(() => "?").join(", ");
    query += ` (${keys.join(", ")}) VALUES (${placeholders})`;
    try {
      const stmt = this.db.prepare(query);
      stmt.run(Object.values(params));
    } catch (error) {
      console.error("Error writing to the database:", error);
    }
  }

  select(params?: (keyof T)[]) {
    let query = `SELECT ${params ? Object.values(params).join(", ") : "*"} FROM ${this.modelName} `;

    const where = (params: FilterQuery<T>) => {
      for (const field in params) {
        const conditions = params[field];
        if (conditions && typeof conditions === "object") {
          for (const conditionKey in conditions) {
            const conditionValue = conditions[conditionKey];
            query += this.generateFilterQuery(
              field,
              conditionValue,
              conditionKey as keyof QuerySelector<T>,
            );
          }
        }
      }
      return { exec, limit, orderBy };
    };

    const orderBy = (column: keyof T, params: "DESC" | "ASC") => {
      query += `ORDER BY ${String(column)} ${params === "DESC" ? "DESC" : "ASC"}`;
      return {
        exec,
        limit,
      };
    };
    //function groupBy(params: OrderByQuery) {}
    function limit(params: number) {
      query += `LIMIT ${params}`;
      return { exec };
    }

    const exec = (params?: ExecParams): T[] | T | undefined => {
      try {
        console.log("before exec ", query);
        const stmt = this.db.prepare(query);
        const res = stmt.all() as T[];
        if (params?.one && res.length > 0) return res[0];
        else if (res.length === 0) return undefined;
        else return res;
      } catch (error) {
        console.error("Error writing to the database:", error);
      }
    };

    return { where, orderBy, exec, limit };
  }

  update(params: { [P in keyof T]?: T[P] }) {
    if (!this) throw new Error("Database not initialized");
    let query: string = `UPDATE ${this.modelName} `;

    let entries = Object.entries(params);
    const values = entries.map(([key, value]) => `${key} = ${value}`);
    query += `SET ${values.join(", ")} `;

    const where = (params: FilterQuery<T>) => {
      for (const field in params) {
        const conditions = params[field];
        if (conditions && typeof conditions === "object") {
          for (const conditionKey in conditions) {
            const conditionValue = conditions[conditionKey];

            query += this.generateFilterQuery(
              field,
              conditionValue,
              conditionKey as keyof QuerySelector<T>,
            );
          }
        }
      }
      return { exec, limit, orderBy };
    };

    const orderBy = (column: keyof T, params: "DESC" | "ASC") => {
      query += `ORDER BY ${String(column)} ${params === "DESC" ? "DESC" : "ASC"}`;
      return {
        exec,
        limit,
      };
    };
    //function groupBy(params: OrderByQuery) {}
    const limit = (params: number) => {
      query += `LIMIT ${params}`;
      return { exec };
    };

    const exec = () => {
      try {
        query += ";";
        const stmt = this.db.prepare(
          "UPDATE client SET email = ? WHERE id = 6;",
        );
        stmt.run(["Bonjuorno"]);
      } catch (error) {
        console.error("Error writing to the database:", error);
      }
    };

    return { where, orderBy, exec, limit };
  }

  delete() {
    if (!this) throw new Error("Database not initialized");
    let query: string = `DELETE FROM ${this.model} `;

    const where = (params: FilterQuery<T>) => {
      for (const field in params) {
        const conditions = params[field];
        if (conditions && typeof conditions === "object") {
          for (const conditionKey in conditions) {
            const conditionValue = conditions[conditionKey];
            query += this.generateFilterQuery(
              field,
              conditionValue,
              conditionKey as keyof QuerySelector<T>,
            );
          }
        }
      }
      return { exec };
    };

    const exec = () => {
      try {
        const stmt = this.db.prepare(query);
        stmt.run();
      } catch (error) {
        console.error("Error writing to the database:", error);
      }
    };

    return { where };
  }

  private generateFilterQuery<T extends T[], K extends keyof QuerySelector<T>>(
    field: string,
    conditionValue: T,
    conditionKey: K,
  ) {
    let conditionOutput = "";
    switch (conditionKey) {
      case "$eq":
        conditionOutput += `${field} = \'${conditionValue}\'`;
        break;
      case "$ne":
        conditionOutput += `${field} != \'${conditionValue}\'`;
        break;
      case "$gt":
        conditionOutput += `${field} > \'${conditionValue}\'}`;
        break;
      case "$lt":
        conditionOutput += `${field} < \'${conditionValue}\'`;
        break;
      case "$gte":
        conditionOutput += `${field} >= \'${conditionValue}\'`;
        break;
      case "$lte":
        console.log(`Field ${field}: Less than \'${conditionValue}\'`);
        conditionOutput += `${field} <= \'${conditionValue}\'`;
        break;
      case "$btw":
        conditionOutput += `${field} BETWEEN \'${conditionValue[0]}\' AND \'${conditionValue[1]}\'`;
        break;
      case "$in":
        conditionOutput += `${field} IN (${conditionValue.map((value) => `'${value}'`).join(", ")})`;
        break;
      case "$nin":
        conditionOutput += `${field} NOT IN (${conditionValue.map((value) => `'${value}'`).join(", ")})`;
        break;
      case "$like":
        conditionOutput += `${field} LIKE \'${conditionValue[1]}\'`;
        break;
      case "$ilike":
        conditionOutput += `${field} LIKE \'${conditionValue[1]}\' COLLATE NOCASE`;
        break;
      default:
        console.log(
          `Field ${field}: Unknown condition \'${conditionValue[1]}\'`,
        );
    }
    return `WHERE ${conditionOutput}`;
  }
}
