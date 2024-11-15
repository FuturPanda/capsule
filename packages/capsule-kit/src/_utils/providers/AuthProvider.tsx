import { userRequests } from "@/stores/users/user.request";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FC, ReactNode, useCallback } from "react";
import { AuthContext } from "./contexts/AuthContext";
import { useBoundStore } from "@/stores/global.store.ts";

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const accessToken = useBoundStore.getState().access_token;
  const queryClient = useQueryClient();

  const loginMutation = useMutation({
    mutationFn: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) => {
      return userRequests.login(email, password);
    },
    onSuccess: (data) => {
      const { access_token, user, refresh_token } = data;
      useBoundStore.setState({
        user: user,
        access_token: access_token,
        refresh_token: refresh_token,
      });
      queryClient.setQueryData(["user"], user);
    },
    onError: (error) => {
      console.error("Login failed", error);
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      return Promise.resolve();
    },
    onSuccess: () => {
      queryClient.setQueryData(["user"], null);
      queryClient.clear();
    },
  });

  const login = useCallback(
    async (email: string, password: string) => {
      await loginMutation.mutateAsync({ email, password });
    },
    [loginMutation],
  );

  const logout = useCallback(() => {
    logoutMutation.mutate();
  }, [logoutMutation]);

  const values = {
    login,
    logout,
    isAuthenticated: !!accessToken,
    isLoading: loginMutation.isPending || logoutMutation.isPending,
  };

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};
