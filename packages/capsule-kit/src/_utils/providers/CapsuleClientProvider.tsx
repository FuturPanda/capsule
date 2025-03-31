import {
  CapsuleClient,
  CapsuleConfig,
  createCapsuleClient,
} from "@capsulesh/capsule-client";
import { OAuthScopes } from "@capsulesh/shared-types";
import React, { createContext, ReactNode, useEffect, useState } from "react";
import { migrations } from "../db";

const defaultConfig: CapsuleConfig = {
  identifier: "Capsule-kit",
  scopes: [OAuthScopes.DATABASE_OWNER],
  redirectUri:
    typeof window !== "undefined"
      ? `${window.location.origin}/`
      : "http://localhost:5173/",
  databaseMigrations: migrations,
  models: ["tasks"],
};

export interface CapsuleClientContextType {
  client: CapsuleClient | undefined;
  isLoading: boolean;
  error: Error | null;
  isAuthenticated: boolean;
}

export const CapsuleClientContext = createContext<CapsuleClientContextType>({
  client: undefined,
  isLoading: true,
  error: null,
  isAuthenticated: false,
});

interface CapsuleClientProviderProps {
  children: ReactNode;
  config?: Partial<CapsuleConfig>;
}

export const CapsuleClientProvider: React.FC<CapsuleClientProviderProps> = ({
  children,
  config: customConfig,
}) => {
  const [client, setClient] = useState<CapsuleClient>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const mergedConfig: CapsuleConfig = {
      ...defaultConfig,
      ...customConfig,
    };

    try {
      const newClient = createCapsuleClient(mergedConfig);
      setClient(newClient);

      const checkAuth = async () => {
        try {
          const authStatus = newClient.authStatus();
          setIsAuthenticated(authStatus);
        } catch (err) {
          console.error("Failed to check authentication status", err);
        } finally {
          setIsLoading(false);
        }
      };

      checkAuth();
    } catch (err) {
      console.error("Failed to initialize Capsule client", err);
      setError(
        err instanceof Error
          ? err
          : new Error("Unknown error initializing client"),
      );
      setIsLoading(false);
    }
  }, [customConfig]);

  return (
    <CapsuleClientContext.Provider
      value={{
        client,
        isLoading,
        error,
        isAuthenticated,
      }}
    >
      {children}
    </CapsuleClientContext.Provider>
  );
};
