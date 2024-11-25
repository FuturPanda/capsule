import { StateCreator } from "zustand";
import { GetUserDto } from "./user.model";

export interface UserSlice {
  access_token: string | null;
  refresh_token: string | null;
  user: GetUserDto | null;
  login: (accessToken: string, refreshToken: string, user: GetUserDto) => void;
  logout: () => void;
  updateUser: (updatedUser: Partial<GetUserDto>) => void;
}

export const createUserSlice: StateCreator<
  UserSlice,
  [],
  [["zustand/persist", unknown]]
> = (set) => ({
  access_token: null,
  refresh_token: null,
  user: null,
  login: (accessToken: string, refreshToken: string, user: GetUserDto) =>
    set({ access_token: accessToken, refresh_token: refreshToken, user: user }),
  logout: () => set({ access_token: null, user: null }),
  updateUser: (updatedUser: Partial<GetUserDto>) =>
    set((state) => {
      if (!state.user) return state;
      else
        return {
          ...state,
          user: { ...state.user, ...updatedUser },
        };
    }),
});
