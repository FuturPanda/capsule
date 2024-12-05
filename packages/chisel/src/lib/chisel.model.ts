import {Database} from "better-sqlite3";
import console from "node:console";
import {ClassType, ExecParams, FilterQuery, QuerySelector,} from "./_utils/types/queries.type";
import {fromClassTypeToSnakeCase} from "./_utils/functions/string-converter.function";

/**
 * Main Class for the NestJs Module.
 * To use when the model is known.
 */

export class ChiselModel<T> {
  private readonly db: Database;
  private readonly model: ClassType<T>;
  private readonly modelName: string;

  constructor(db: Database, model: ClassType<T>) {
    this.db = db;
    this.model = model;
    this.modelName = fromClassTypeToSnakeCase(model);
  }

  insert(
    params: Partial<Pick<T, keyof T>> | Record<string, string>,
    opts?: { ignoreExisting: boolean },
  ) {
    let query: string = `INSERT
        ${opts?.ignoreExisting ? "OR IGNORE " : ""}INTO
        ${this.modelName}`;
    const keys = Object.keys(params);
    const placeholders = keys.map(() => "?").join(", ");
    query += ` (${keys.join(", ")}) VALUES (${placeholders})`;
    let output = {
      success: false,
      id: null,
      changes: 0,
    };
    try {
      const stmt = this.db.prepare(query);
      const res = stmt.run(Object.values(params));
      output = {
        success: res.changes > 0,
        id: res.lastInsertRowid,
        changes: res.changes,
      };
    } catch (error) {
      console.error("Error writing to the database:", error);
    }
    return output;
  }

  /**
   * Basic function to select from tables.
   * The output is dependent on the dto param.
   * !! the star selector isn't yet implemented.
   * No dto means that everything will be selected, meaning some collision might happen
   * during joins.
   * @param dto
   */
  select(dto?: Record<string, `${string}.${string}`>) {
    let query: string = `SELECT *
                             FROM ${this.modelName} `;
    if (dto) {
      const aliases = [];
      const attributes = Object.keys(dto);
      for (const [index, param] of Object.values(dto).entries()) {
        const [tableName, tableField] = param.split(".");
        if (tableField === "*") {
        } else {
          aliases.push(`${param} AS ${attributes[index]}`);
        }
      }
      query = `SELECT ${aliases.length > 0 ? aliases.join(", ") : "*"}
                     FROM ${this.modelName} `;
    }

    const join = <Local, Foreign>(
      fromTable: ClassType<Local>,
      toTable: ClassType<Foreign>,
      localKey: keyof Local & string,
      foreignKey: keyof Foreign & string,
      type: "INNER" | "LEFT" | "RIGHT" = "INNER",
    ) => {
      query += ` ${type} JOIN ${fromClassTypeToSnakeCase(toTable)} ON ${fromClassTypeToSnakeCase(fromTable)}.${localKey} = ${fromClassTypeToSnakeCase(toTable)}.${foreignKey}`;

      return { where, orderBy, exec, limit, join };
    };

    const where = (params: FilterQuery<T>) => {
      let isFirstCondition = true;

      for (const field in params) {
        const conditions = params[field];
        if (conditions && typeof conditions === "object") {
          for (const conditionKey in conditions) {
            const conditionValue = conditions[conditionKey];
            const fieldParts = field.split(".");
            const fieldName =
              fieldParts.length > 1 ? field : `${this.modelName}.${field}`;
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
        throw error;
      }
    };

    return { where, orderBy, exec, limit, join };
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
          `UPDATE client
                     SET email = ?
                     WHERE id = 6;`,
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
    let query: string = `DELETE
                             FROM ${this.model} `;

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
    isFirstCondition: boolean = true,
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
    return `${isFirstCondition ? "WHERE" : "AND"} ${conditionOutput}`;
  }
}
