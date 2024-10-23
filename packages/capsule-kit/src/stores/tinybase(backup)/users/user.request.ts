import { CapsuleAxios } from "@/api/axios";
import { LoginResponseDto } from "./user.model";

const userRequests = {
  login: (email: string, password: string) =>
    CapsuleAxios.post<LoginResponseDto>("users/login", {
      email: email,
      password: password,
    }).then((x) => {
      const response = x.data;
      console.log(response);
      return response;
    }),
  refreshToken: (refreshToken: string) =>
    CapsuleAxios.post<{ access_token: string }>("users/refresh-token", {
      refreshToken: refreshToken,
    }).then((x) => x.data),
};

export default userRequests;
