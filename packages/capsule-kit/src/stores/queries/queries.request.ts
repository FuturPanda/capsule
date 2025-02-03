import { CapsuleAxios } from "@/api/axios.ts";
import { CreateQueryDto } from "@/stores/queries/queries.model.ts";

export const queriesRequest = {
  getAllQueries: () =>
    CapsuleAxios.get(`dynamic-queries/capsule-kit/query`, {
      params: {},
    }).then((x) => x.data),
  saveQuery: (data: CreateQueryDto) =>
    CapsuleAxios.post(`dynamic-queries/capsule-kit/query`, {
      params: { data: data },
    }),
};
