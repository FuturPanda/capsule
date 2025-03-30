import { WhereOptions } from "./query-option.interface";

export interface UpdateOptions {
  data: Record<string, any>;
  where?: WhereOptions;
  returning?: string[];
}
