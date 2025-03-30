import { ClassType } from "@capsulesh/shared-types";

export const fromClassTypeToSnakeCase = <T>(entity: ClassType<T>) =>
  entity.name
    .replace(/Model$/, "")
    .replace(/([A-Z])/g, "_$1")
    .toLowerCase()
    .replace(/^_/, "");
