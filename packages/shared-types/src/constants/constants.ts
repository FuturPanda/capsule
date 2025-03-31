import {
    T_ComparisonOperator,
    T_HavingFunction,
    T_OrderOpts,
    T_SqlFunction,
    T_WhereOperator,
} from "../interfaces/query-option.interface";

export const SQL_FUNCTIONS: T_SqlFunction[] = [
  "COUNT",
  "SUM",
  "AVG",
  "MAX",
  "MIN",
];
export const WHERE_OPERATORS: T_WhereOperator[] = [
  "eq",
  "neq",
  "gt",
  "gte",
  "lt",
  "lte",
  "like",
  "ilike",
  "between",
  "in",
  "null",
];
export const ORDER_OPTIONS: T_OrderOpts[] = [
  "ASC",
  "DESC",
  "ASC NULLS FIRST",
  "DESC NULLS LAST",
];
export const HAVING_FUNCTIONS: T_HavingFunction[] = [
  "COUNT",
  "SUM",
  "AVG",
  "MAX",
  "MIN",
];
export const COMPARISON_OPERATORS: T_ComparisonOperator[] = [
  "eq",
  "neq",
  "gt",
  "gte",
  "lt",
  "lte",
];
