import { CapsuleAxios } from "@/api/axios";
import { LoginDto, RefreshDto, RegisterDto } from "./user.model";

export const userRequests = {
  login: (email: string, password: string) =>
    CapsuleAxios.post<LoginDto>("users/login", {
      email: email,
      password: password,
    }).then((x) => x.data),
  register: (registerDto: RegisterDto) =>
    CapsuleAxios.post<RegisterDto>("users/register", registerDto).then(
      (x) => x.data,
    ),
  refreshToken: (refreshToken: string) =>
    CapsuleAxios.post<RefreshDto>("users/refresh", {
      refreshToken: refreshToken,
    }).then((x) => x.data),
};
