export interface SelectOptions {
  fields?: string[];
  functions?: {
    [key: string]: {
      function: T_SqlFunction;
      field: string;
      alias?: string;
    };
  };
}

export type T_SqlFunction = "COUNT" | "SUM" | "AVG" | "MAX" | "MIN";
export type T_ComparisonOperator = "eq" | "neq" | "gt" | "gte" | "lt" | "lte";
export type T_WhereOperator =
  | T_ComparisonOperator
  | "like"
  | "ilike"
  | "between"
  | "in"
  | "null";
export type T_OrderOpts =
  | "ASC"
  | "DESC"
  | "ASC NULLS FIRST"
  | "DESC NULLS LAST";
export type T_HavingFunction = "COUNT" | "SUM" | "AVG" | "MAX" | "MIN";

export interface WhereOptions {
  [key: string]: {
    operator: T_WhereOperator;
    value: any;
    not?: boolean;
  };
}

export interface OrderByOptions {
  [key: string]: T_OrderOpts;
}

export interface PaginatedQuery {
  page?: number;
  limit?: number;
  offset?: number;
}

export interface RelationOptions {
  [key: string]: {
    select?: string[];
    where?: WhereOptions;
    orderBy?: OrderByOptions;
  };
}

export interface GroupByOptions {
  fields: string[];
}

export interface HavingOptions {
  [key: string]: {
    function: T_HavingFunction;
    operator: T_ComparisonOperator;
    value: any;
  };
}

export interface QueryOptions {
  select?: SelectOptions;
  where?: WhereOptions;
  orderBy?: OrderByOptions;
  pagination?: PaginatedQuery;
  relations?: RelationOptions;
  groupBy?: GroupByOptions;
  having?: HavingOptions;
  distinct?: boolean;
}
