export interface InsertOptions {
  data: Record<string, any>[];
  conflict?: {
    columns: string[];
    update?: string[];
    action?: "IGNORE" | "REPLACE" | "UPDATE";
  };
  returning?: string[];
}
