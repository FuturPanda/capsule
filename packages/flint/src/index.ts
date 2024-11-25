import { FlintClient } from "./FlintClient";

export const createClient = (
  capsuleUrl: string,
  capsuleKey: string,
  options?: FlienClientOptions,
): FlintClient => {
  return new FlintClient();
};
