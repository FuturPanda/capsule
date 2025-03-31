import { JournalType } from "@capsulesh/shared-types";
import fs from "node:fs";

export function getCurrentVersion(journalPath: string): number {
  const journal = JSON.parse(
    fs.readFileSync(journalPath, "utf8"),
  ) as JournalType;

  return Math.max(...journal.entries.map((entry) => entry.version));
}
