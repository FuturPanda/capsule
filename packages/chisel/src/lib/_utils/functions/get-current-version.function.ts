import fs from "node:fs";
import { JournalType } from "../types/journal.type";

export function getCurrentVersion(journalPath: string): number {
  const journal = JSON.parse(
    fs.readFileSync(journalPath, "utf8"),
  ) as JournalType;

  return Math.max(...journal.entries.map((entry) => entry.version));
}
