import { Database } from "better-sqlite3";
import { ChiselQueries } from "./_utils/interfaces/queries.interfaces";
import {
  ClassType,
  FilterQuery,
  QuerySelector,
} from "./_utils/types/queries.type";
import { ChiselModel } from "./chisel.model";

export type Model<T> = ClassType<T> | string;

function getModelName<T>(model: Model<T>) {
  if (typeof model === "string") return model.toLowerCase();
  return model.toString().toLowerCase();
}

export class ChiselQuerable implements ChiselQueries {
  private readonly db: Database;
  private model: string = "";

  constructor(db: Database) {
    this.db = db;
  }

  insertInto<T>(table: Model<T>) {
    if (!this) throw new Error("Database not initialized");
    let query: string = "";
    this.model = getModelName(table);

    const values = (
      params: Partial<Pick<T, keyof T>> | Record<string, string>,
    ) => {
      const keys = Object.keys(params);
      const placeholders = keys.map(() => "?").join(", ");
      query += ` (${keys.join(", ")}) VALUES (${placeholders})`;
      try {
        const stmt = this.db.prepare(query);
        stmt.run(Object.values(params));
      } catch (error) {
        console.error("Error writing to the database:", error);
      }
    };

    query += `INSERT INTO ${this.model}`;
    return { values };
  }

  selectFrom<T>(table: ClassType<T> | string) {
    if (!this) throw new Error("Database not initialized");
    let query: string = "";

    const values = (params: (keyof T)[]) => {
      let values = Object.values(params);
      query += `SELECT ${values.join(", ")} FROM ${this.model}`;
      return { where, orderBy, exec, limit };
    };

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

    const exec = () => {
      try {
        console.log("before exec ", query);
        const stmt = this.db.prepare(query);
        return stmt.all();
      } catch (error) {
        console.error("Error writing to the database:", error);
      }
    };

    return { values };
  }

  updateFrom<T>(table: ClassType<T> | string) {
    if (!this) throw new Error("Database not initialized");
    let query: string = `UPDATE ${typeof table === "string" ? table.toLowerCase() : table.name.toLowerCase()} `;

    const set = (params: { [P in keyof T]?: T[P] }) => {
      let entries = Object.entries(params);
      const values = entries.map(([key, value]) => `${key} = ${value}`);
      query += `SET ${values.join(", ")} `;
      return { where, orderBy, exec, limit };
    };

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

    return { set };
  }

  deleteFrom<T>(table: ClassType<T> | string) {
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

  public getModel<T>(model: ClassType<T>) {
    return new ChiselModel(this.db, model);
  }

  private generateFilterQuery<T extends T[], K extends keyof QuerySelector<T>>(
    field: string,
    conditionValue: T,
    conditionKey: K,
  ) {
    let conditionOutput = "";
    switch (conditionKey) {
      case "$eq":
        conditionOutput += `${field} = ${conditionValue}`;
        break;
      case "$ne":
        conditionOutput += `${field} != ${conditionValue}`;
        break;
      case "$gt":
        conditionOutput += `${field} > ${conditionValue}`;
        break;
      case "$lt":
        conditionOutput += `${field} < ${conditionValue}`;
        break;
      case "$gte":
        conditionOutput += `${field} >= ${conditionValue}`;
        break;
      case "$lte":
        console.log(`Field ${field}: Less than ${conditionValue}`);
        conditionOutput += `${field} <= ${conditionValue}`;
        break;
      case "$btw":
        conditionOutput += `${field} BETWEEN ${conditionValue[0]} AND ${conditionValue[1]}`;
        break;
      case "$in":
        conditionOutput += `${field} IN (${conditionValue.join(", ")})`;
        break;
      case "$nin":
        conditionOutput += `${field} NOT IN (${conditionValue.join(", ")})`;
        break;
      case "$like":
        conditionOutput += `${field} LIKE ${conditionValue}`;
        break;
      case "$ilike":
        conditionOutput += `${field} LIKE ${conditionValue} COLLATE NOCASE`;
        break;
      default:
        console.log(`Field ${field}: Unknown condition ${conditionKey}`);
    }
    return `WHERE ${conditionOutput}`;
  }
}
