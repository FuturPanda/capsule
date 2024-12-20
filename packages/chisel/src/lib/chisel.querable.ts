import { Database } from 'better-sqlite3';
import { ClassType } from './_utils/types/queries.type';
import { ChiselModel } from './chisel.model';
import {
  GroupByOptions,
  HavingOptions,
  OrderByOptions,
  PaginatedQuery,
  QueryOptions,
  RelationOptions,
  SelectOptions,
  WhereOptions,
} from './_utils/interfaces/query-option.interface';
import { InsertOptions } from './_utils/interfaces/insert-option.interface';
import { UpdateOptions } from './_utils/interfaces/update-option.interface';
import { DeleteOptions } from './_utils/interfaces/delete-options.interface';

/**
 * Class to queries dynamic models.
 * To use when the model isn't known ahead of time
 */
export class ChiselQuerable {
  protected readonly db: Database;

  constructor(db: Database) {
    this.db = db;
  }

  public getModel<T>(model: ClassType<T>) {
    return new ChiselModel(this.db, model);
  }

  close() {
    this.db.close();
  }

  query(tableName: string, options: QueryOptions) {
    const params = [];
    let query = this.buildSelectClause(options.select, options.distinct);
    query += ` FROM ${tableName}`;

    if (options.relations) {
      query += this.buildRelationsClause(options.relations, tableName);
    }

    if (options.where) {
      console.log(options.where);
      const whereClause = this.buildWhereClause(options.where);
      query += whereClause.sql;
      params.push(...whereClause.params);
    }

    if (options.groupBy) {
      query += this.buildGroupByClause(options.groupBy);
    }

    if (options.having) {
      const havingClause = this.buildHavingClause(options.having);
      query += havingClause.sql;
      params.push(...havingClause.params);
    }

    if (options.orderBy) {
      query += this.buildOrderByClause(options.orderBy);
    }

    if (options.pagination) {
      query += this.buildPaginationClause(options.pagination);
    }
    return this.execute(query, params, true);
  }

  insert(tableName: string, options: InsertOptions) {
    const data = options.data;

    if (data.length === 0) {
      return { success: false, id: null, changes: 0 };
    }

    try {
      const query = this.buildInsertQuery(
        tableName,
        data[0],
        options.conflict,
        data.length,
      );

      const params = data.flatMap((row) =>
        Object.values(row).map((value) => this.formatValue(value)),
      );

      console.log("Executing query:", query);
      console.log("With params:", params);

      const stmt = this.db.prepare(query);

      if (options.returning) {
        const results: Record<string, any>[] = stmt.all(params);
        return {
          success: true,
          id: results[0]?.id || null,
          changes: results.length,
          returning: results,
        };
      }

      const result = stmt.run(params);

      return {
        success: result.changes > 0,
        id: result.lastInsertRowid,
        changes: result.changes,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Updates records in the specified table based on the provided options
   * @param tableName The name of the table to update
   * @param options Update options including data and where conditions
   * @returns Object containing success status and number of affected rows
   */
  update(tableName: string, options: UpdateOptions) {
    const initialParams: any[] = [];

    let query = `UPDATE ${tableName}
                 SET `;

    const setStatements = Object.entries(options.data)
      .map(([field, value]) => {
        initialParams.push(this.formatValue(value));
        return `${field} = ?`;
      })
      .join(", ");

    query += setStatements;
    const { finalQuery, params } = this.buildOpts(
      options,
      query,
      initialParams,
    );

    return this.execute(finalQuery, params, options.returning);
  }

  /**
   * Deletes records from the specified table based on the provided options
   * @param tableName The name of the table to delete from
   * @param options Delete options including where conditions
   * @returns Object containing success status and number of affected rows
   */
  delete(tableName: string, options: DeleteOptions) {
    let query = `DELETE
                 FROM ${tableName}`;
    const { finalQuery, params } = this.buildOpts(options, query);

    return this.execute(finalQuery, params, options.returning);
  }

  private buildOpts(
    options: UpdateOptions | DeleteOptions,
    query: string,
    initialParams = [],
  ) {
    let finalQuery = query;
    const newParams = [];
    if (options.where) {
      const whereClause = this.buildWhereClause(options.where);
      finalQuery += whereClause.sql;
      newParams.push(...whereClause.params);
    }

    if (options.returning) {
      finalQuery += ` RETURNING ${options.returning.join(", ")}`;
    }
    return { params: [...initialParams, ...newParams], finalQuery };
  }

  private buildInsertQuery(
    modelName: string,
    firstRow: Record<string, any>,
    conflict?: InsertOptions["conflict"],
    rowCount: number = 1,
    returning?: string[],
  ): string {
    const columns = Object.keys(firstRow);

    let query = `INSERT`;

    if (conflict?.action === "IGNORE") {
      query += " OR IGNORE";
    } else if (conflict?.action === "REPLACE") {
      query += " OR REPLACE";
    }

    query += ` INTO ${modelName} (${columns.join(", ")})`;

    const rowPlaceholders = `(${columns.map(() => "?").join(", ")})`;
    const allPlaceholders = Array(rowCount).fill(rowPlaceholders).join(", ");
    query += ` VALUES ${allPlaceholders}`;

    return query;
  }

  private buildSelectClause(
    select?: SelectOptions,
    distinct?: boolean,
  ): string {
    if (!select) {
      return `SELECT ${distinct ? "DISTINCT " : ""}*`;
    }

    const fields = select.fields || [];
    const functions = select.functions || {};

    const selectParts = [
      ...fields,
      ...Object.entries(functions).map(([key, func]) => {
        return `${func.function}(${func.field}) AS ${func.alias || key}`;
      }),
    ];

    return `SELECT ${distinct ? "DISTINCT " : ""}${
      selectParts.length > 0 ? selectParts.join(", ") : "*"
    }`;
  }

  private buildWhereClause(where: WhereOptions) {
    const params = [];
    const conditions = Object.entries(where).map(([field, condition]) => {
      const { operator, value, not } = condition;
      params.push(value);
      console.log("IN WHERE ", condition, operator, value);
      const placeholder = "?";

      switch (operator) {
        case "eq":
          return `${field} ${not ? "!=" : "="} ${placeholder}`;
        case "gt":
          return `${field} > ${placeholder}`;
        case "gte":
          return `${field} >= ${placeholder}`;
        case "lt":
          return `${field} < ${placeholder}`;
        case "lte":
          return `${field} <= ${placeholder}`;
        case "like":
          return `${field} LIKE ${placeholder}`;
        case "ilike":
          return `${field} LIKE ${placeholder} COLLATE NOCASE`;
        case "between":
          const [start, end] = value;
          params.push(start);
          params.push(end);
          const startPlaceholder = "?";
          const endPlaceholder = "?";
          return `${field} BETWEEN ${startPlaceholder} AND ${endPlaceholder}`;
        case "in":
          const placeholders = value.map((v) => {
            params.push(v);
            return "?";
          });
          return `${field} IN (${placeholders.join(", ")})`;
        case "null":
          return `${field} IS ${not ? "NOT " : ""}NULL`;
        default:
          throw new Error(`Unknown operator: ${operator}`);
      }
    });

    return {
      sql: conditions.length > 0 ? ` WHERE ${conditions.join(" AND ")}` : "",
      params: params,
    };
  }

  private buildOrderByClause(orderBy: OrderByOptions): string {
    const orders = Object.entries(orderBy)
      .map(([field, order]) => `${field} ${order}`)
      .join(", ");
    return ` ORDER BY ${orders}`;
  }

  private buildPaginationClause(pagination: PaginatedQuery): string {
    const { limit, offset, page } = pagination;
    let query = "";

    if (limit) {
      query += ` LIMIT ${limit}`;
    }

    if (offset) {
      query += ` OFFSET ${offset}`;
    } else if (page && limit) {
      query += ` OFFSET ${(page - 1) * limit}`;
    }

    return query;
  }

  private buildRelationsClause(
    relations: RelationOptions,
    modelName: string,
  ): string {
    return Object.entries(relations)
      .map(([table, options]) => {
        let join = ` LEFT JOIN ${table} ON ${modelName}.id = ${table}.${modelName}_id`;

        if (options.where) {
          join += this.buildWhereClause(options.where);
        }

        if (options.orderBy) {
          join += this.buildOrderByClause(options.orderBy);
        }

        return join;
      })
      .join("");
  }

  private buildGroupByClause(groupBy: GroupByOptions): string {
    return ` GROUP BY ${groupBy.fields.join(", ")}`;
  }

  private buildHavingClause(having: HavingOptions) {
    const params = [];
    const conditions = Object.entries(having).map(([field, condition]) => {
      const { function: func, operator, value } = condition;
      params.push(value);
      const placeholder = "?";
      return `${func}(${field}) ${this.getOperatorSymbol(operator)} ${placeholder}`;
    });

    return {
      sql: conditions.length > 0 ? ` HAVING ${conditions.join(" AND ")}` : "",
      params: params,
    };
  }

  private getOperatorSymbol(operator: string): string {
    const operators: Record<string, string> = {
      eq: "=",
      neq: "!=",
      gt: ">",
      gte: ">=",
      lt: "<",
      lte: "<=",
    };
    return operators[operator] || "=";
  }

  private execute(query: string, params: string[] = [], returning?: any) {
    try {
      console.log("Executing query:", query);
      console.log("With params:", params);

      const stmt = this.db.prepare(query);

      if (returning) {
        return stmt.all(params);
      }

      const result = stmt.run(params);
      console.log("IOJIFOEJO", result);
      return {
        success: result.changes > 0,
        changes: result.changes,
      };
    } catch (error) {
      console.error("Error executing delete query:", error);
      throw error;
    }
  }

  private formatValue(value: any): any {
    if (value === null || value === undefined) {
      return null;
    }

    if (value instanceof Date) {
      return value.toISOString();
    }

    if (typeof value === "object") {
      return JSON.stringify(value);
    }

    return value;
  }
}
