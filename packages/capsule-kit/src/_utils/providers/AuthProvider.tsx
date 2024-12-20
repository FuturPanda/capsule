import { userRequests } from "@/stores/users/user.request";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FC, ReactNode, useCallback } from "react";
import { AuthContext } from "./contexts/AuthContext";
import { useBoundStore } from "@/stores/global.store.ts";
import { ApiKey } from "@/stores/users/user.model.ts";

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const accessToken = useBoundStore.getState().access_token;
  const queryClient = useQueryClient();

  const loginMutation = useMutation({
    mutationFn: async (encodedApiKey: string) => {
      const apiKey: ApiKey = JSON.parse(atob(encodedApiKey));
      useBoundStore.setState({
        base_url: apiKey.baseUrl,
        client_id: apiKey.clientId,
      });
      return userRequests.login(apiKey.email, apiKey.password);
    },
    onSuccess: (data) => {
      const { access_token, user, refresh_token } = data;
      useBoundStore.setState({
        user: user,
        access_token: access_token,
        refresh_token: refresh_token,
      });
      queryClient.setQueryData(["user"], user);
      return true;
    },
    onError: (error) => {
      console.error("Login failed", error);
      return false;
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
    async (encodedApiKey: string) => {
      return loginMutation.mutateAsync(encodedApiKey);
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
