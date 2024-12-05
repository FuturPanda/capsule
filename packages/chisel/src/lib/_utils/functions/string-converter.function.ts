import { ClassType } from "../types/queries.type";

export const fromClassTypeToSnakeCase = <T>(entity: ClassType<T>) =>
  entity.name
    .replace(/([A-Z])/g, "_$1")
    .toLowerCase()
    .replace(/^_/, "");
