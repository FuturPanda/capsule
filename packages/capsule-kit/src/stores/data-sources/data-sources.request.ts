import { CapsuleAxios } from "@/api/axios.ts";

export const dataSourcesRequest = {
  getAllDataSources: () => CapsuleAxios.get("databases").then((x) => x.data),
};
