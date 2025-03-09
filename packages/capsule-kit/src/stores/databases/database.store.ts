import {
  GetDatabaseDto,
  GetEntitiesDto,
} from "@/stores/databases/database.model.ts";
import { StateCreator } from "zustand";

export interface DatabaseSlice {
  databases: GetDatabaseDto[];
  selectedDatabaseId: string;
  selectedDatabase: GetDatabaseDto | undefined;
  setSelectedDatabaseId: (databaseId: string) => void;
  findDatabase: (databaseId: string) => GetDatabaseDto | undefined;
  findTable: (
    databaseId: string,
    tableName: string,
  ) => GetEntitiesDto | undefined;
  setDatabases: (databases: GetDatabaseDto[]) => void;
}

export const createDatabaseSlice: StateCreator<
  DatabaseSlice,
  [],
  [["zustand/persist", unknown]]
> = (set, get) => ({
  databases: [],
  selectedDatabaseId: "",
  selectedDatabase: undefined,
  setSelectedDatabaseId: (databaseId: string) => {
    console.log("");
    return set({
      selectedDatabaseId: databaseId,
      selectedDatabase: get().findDatabase(databaseId),
    });
  },
  findDatabase: (databaseId: string) => {
    const state = get();
    return state.databases.find(
      (db) => db.id.toString() === databaseId.toString(),
    );
  },
  findTable: (databaseId: string, tableName: string) => {
    const state = get();
    return state.databases
      .find((db) => db.id.toString() === databaseId.toString())
      ?.entities.find((en) => en.tableName === tableName);
  },
  setDatabases: (databases: GetDatabaseDto[]) =>
    set((state) => ({
      ...state,
      databases: databases,
    })),
});
