import { Migration } from "@capsule/chisel";
import m2024121201 from "./changelog/2024-12-12-initial-database.toml";
import m2025013101 from "./changelog/2025-01-31-add-queries.toml";

export const migrations: Migration[] = [m2024121201, m2025013101];
