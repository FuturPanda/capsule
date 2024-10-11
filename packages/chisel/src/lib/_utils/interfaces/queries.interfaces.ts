import { AbstractFilterQuery, ClassType, FilterQuery } from '../types/queries.type';

export interface QueryMethods<T> {
  values: (
    params: Partial<Pick<T, keyof T>> | (keyof T)[] | string[] | Record<string, string>,
  ) => Partial<QueryMethods<T>> | void;
  where: (params: FilterQuery<T> | AbstractFilterQuery) => void | Partial<QueryMethods<T>>;
  exec: () => void | Partial<QueryMethods<T>> | unknown[];
  limit: (params: number) => void | Partial<QueryMethods<T>>;
  orderBy: (column: keyof T | string, params: 'DESC' | 'ASC') => void | Partial<QueryMethods<T>>;
  set: (params: { [P in keyof T]?: T[P] } | Record<string, string>) => void | Partial<QueryMethods<T>>;
}

export interface ChiselQueries {
  insertInto<T>(table: ClassType<T>): Partial<QueryMethods<T>>;
  insertInto(table: string): Partial<QueryMethods<Record<string, any>>>;

  selectFrom<T>(table: ClassType<T>): Partial<QueryMethods<T>>;
  selectFrom(table: string): Partial<QueryMethods<Record<string, any>>>;

  updateFrom<T>(table: ClassType<T>): Partial<QueryMethods<T>>;
  updateFrom(table: string): Partial<QueryMethods<Record<string, any>>>;

  deleteFrom<T>(table: ClassType<T>): Partial<QueryMethods<T>>;
  deleteFrom(table: string): Partial<QueryMethods<Record<string, any>>>;
}
