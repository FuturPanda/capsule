import { Migration } from "./migrations.type";

export type ClassType<T> = new (...args: any[]) => T;

export interface IFactoryOpts {
  uri: string;
  dbName: string;
  // entities?: TableOptions[];
  migrations?: Migration[];
  generateTypes?: boolean;
  typesDir?: string;
}

export interface IChiselDbParams {
  filePath?: string;
}

export type Condition<T> = T | QuerySelector<T>;

export type FilterQuery<T> = {
  [P in keyof T]?: Condition<T[P]>;
} & RootQuerySelector<T>;

export type AbstractFilterQuery = FilterQuery<Record<string, any>>;

export type AnyArray<T> = T[] | ReadonlyArray<T>;

export type Unpacked<T> = T extends (infer U)[]
  ? U
  : T extends ReadonlyArray<infer U>
    ? U
    : T;

export type QuerySelector<T> = {
  /** Comparaisons */
  $eq?: T;
  //SELECT * FROM table_name WHERE column = value;
  $ne?: T;
  //SELECT * FROM table_name WHERE column != value;
  $gt?: T;
  //SELECT * FROM table_name WHERE column > value;
  $gte?: T;
  //SELECT * FROM table_name WHERE column >= value;
  $lt?: T;
  //SELECT * FROM table_name WHERE column < value;
  $lte?: T;
  //SELECT * FROM table_name WHERE column <= value;
  $btw?: [T, T];
  //SELECT * FROM table_name WHERE column BETWEEN value1 AND value2;
  $like?: string | RegExp;
  //SELECT * FROM users WHERE name LIKE 'A%';  -- Finds all names starting with 'A'

  $ilike?: string | RegExp;
  //SELECT * FROM table_name WHERE column LIKE 'pattern%' COLLATE NOCASE;

  $in?: [T] extends AnyArray<any> ? Unpacked<T>[] : T[];
  //SELECT * FROM table_name WHERE column IN (value1, value2, value3);

  $nin?: [T] extends AnyArray<any> ? Unpacked<T>[] : T[];
  //SELECT * FROM table_name WHERE column NOT IN (value1, value2, value3);
};

export type RootQuerySelector<T> = {
  $and?: Array<FilterQuery<T>>;
  //SELECT * FROM table_name WHERE column1 = value1 AND column2 = value2;
  $or?: Array<FilterQuery<T>>;
  //SELECT * FROM table_name WHERE column1 = value1 OR column2 = value2;
  null?: T;
  //SELECT * FROM table_name WHERE column IS NULL;
  noll?: T;
  //SELECT * FROM table_name WHERE column IS NOT NULL;

  $true?: T;
  //SELECT * FROM table_name WHERE column IS TRUE;
  $false?: T;
  // SELECT * FROM table_name WHERE column IS FALSE;
  $not?: FilterQuery<T>;
  //SELECT * FROM table_name WHERE NOT column = value;

  $all?: Array<FilterQuery<T>>;
  $any?: Array<FilterQuery<T>>;
  $exists?: Array<FilterQuery<T>>;
  // SELECT * FROM table_name WHERE EXISTS (SELECT 1 FROM another_table WHERE condition);
};
export type OrderByQuery<T> = { [P in keyof T]?: "DESC" | "ASC" };
//SELECT name, salary FROM employees ORDER BY salary DESC

export type ExecParams = {
  returning?: boolean;
  one: boolean;
};
