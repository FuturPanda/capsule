import { CapsuleAxios } from "@/api/axios";
import { RefreshDto } from "./user.model";
import { UpdateProfileDto } from "server/dist/users/_utils/dto/request/update-profile.dto.ts";

export const userRequests = {
  refreshToken: (refreshToken: string) =>
    CapsuleAxios.post<RefreshDto>("users/refresh", {
      refreshToken: refreshToken,
    }).then((x) => x.data),
  updateUserProfile: (values: UpdateProfileDto) =>
    CapsuleAxios.put("users/owner", values).then((x) => x.data),
};
