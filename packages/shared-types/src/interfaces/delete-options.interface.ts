import { WhereOptions } from "./query-option.interface";

export interface DeleteOptions {
  where?: WhereOptions;
  returning?: string[];
}
