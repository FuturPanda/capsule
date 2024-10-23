import { CapsuleAxios, setupInterceptors } from "@/api/axios";
import userRequests from "@/stores/tinybase(backup)/users/user.request";
import {
  USER_ACCESS_TOKEN,
  useUserStore,
} from "@/stores/tinybase(backup)/users/user.store";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect } from "react";
import { AuthContext } from "./contexts/AuthContext";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const userStore = useUserStore();
  const queryClient = useQueryClient();

  useEffect(() => {
    setupInterceptors(
      CapsuleAxios,
      () => (userStore?.getValue(USER_ACCESS_TOKEN) as string) || null,
      (token) => userStore?.setValue(USER_ACCESS_TOKEN, token),
      () => (userStore?.getValue("REFRESH_TOKEN") as string) || null,
      logout,
    );
  }, [userStore]);

  const loginMutation = useMutation({
    mutationFn: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) => {
      const res = await userRequests.login(email, password);
      return res;
    },
    onSuccess: (data) => {
      const { access_token, user, refresh_token } = data;
      userStore?.setValues({
        user: user.toString(),
        access_token: access_token,
        resfresh_token: refresh_token,
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
      userStore?.delValues();
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
    isAuthenticated: true, //!!userStore?.getValue(USER_ACCESS_TOKEN),
    isLoading: loginMutation.isPending || logoutMutation.isPending,
  };

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};
