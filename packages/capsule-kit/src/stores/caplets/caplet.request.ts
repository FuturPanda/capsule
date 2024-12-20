import { CapsuleAxios } from "@/api/axios.ts";
import { Caplet } from "@/stores/caplets/caplet.interface.ts";
import {
  CreateCapletContentDto,
  GetCapletContentDto,
} from "@/stores/caplets/caplet.model.ts";

export const capletRequest = {
  getAllCaplets: () =>
    CapsuleAxios.get<Caplet[]>("dynamic-queries/capsule-kit/caplet").then(
      (x) => x.data,
    ),

  getContentPool: () =>
    CapsuleAxios.get<GetCapletContentDto[]>(
      "dynamic-queries/capsule-kit/caplet_content",
    ).then((x) => x.data),

  getCapletContent: (capletId: string) =>
    CapsuleAxios.get<GetCapletContentDto[]>(
      "dynamic-queries/capsule-kit/caplet_content",
      { params: { where: { caplet_id: { operator: "eq", value: capletId } } } },
    ).then((x) => x.data),

  createCaplet: () =>
    CapsuleAxios.post("dynamic-queries/capsule-kit/caplet").then((x) => x.data),

  createContent: (payload: CreateCapletContentDto[]) =>
    CapsuleAxios.post("dynamic-queries/capsule-kit/caplet_content", {
      data: payload,
    }).then((x) => x.data),

  /*
  updateCaplet: (contentId: string, updates: CapletContent) =>
    CapsuleAxios.put("dynamic-queries/capsule-kit/caplet_content", {}),
   */

  updateCapletContent: (capletContentId: string, value: string) =>
    CapsuleAxios.put("dynamic-queries/capsule-kit/caplet_content", {
      data: { value: value },
      where: { id: { operator: "eq", value: capletContentId } },
    }).then((x) => x.data),
};
