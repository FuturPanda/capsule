import { CapsuleAxios } from "@/api/axios.ts";
import { CreateDatabaseFormValues } from "@/routes/_authenticated/data";
import { GetDatabaseDto } from "@/stores/databases/database.model.ts";

export const databaseRequest = {
  getAllDatabases: () =>
    CapsuleAxios.get<GetDatabaseDto[]>("databases").then((x) => x.data),
  queryDatabase: (database: string, table: string, params: unknown) =>
    CapsuleAxios.get(`dynamic-queries/${database}/${table}`, {
      params: params,
    }).then((x) => x.data),
  createDatabase: (database: CreateDatabaseFormValues) =>
    CapsuleAxios.post(`databases`, database).then((x) => x.data),
};
