import { StateCreator } from "zustand";
import {
  GetDatabaseDto,
  GetEntitiesDto,
} from "@/stores/databases/database.model.ts";

export interface DatabaseSlice {
  databases: GetDatabaseDto[];
  selectedDatabaseId: string;
  setSelectedDatabaseId: () => void;
  findDatabase: (databaseId: string) => GetDatabaseDto | undefined;
  findTable: (
    databaseId: string,
    tableId: string,
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
  setSelectedDatabaseId: () => {},
  findDatabase: (databaseId: string) => {
    const state = get();
    return state.databases.find(
      (db) => db.id.toString() === databaseId.toString(),
    );
  },
  findTable: (databaseId: string, tableId: string) => {
    const state = get();
    return state.databases
      .find((db) => db.id.toString() === databaseId.toString())
      ?.entities.find((en) => en.id.toString() === tableId.toString());
  },
  setDatabases: (databases: GetDatabaseDto[]) =>
    set((state) => ({
      ...state,
      databases: databases,
    })),
});
