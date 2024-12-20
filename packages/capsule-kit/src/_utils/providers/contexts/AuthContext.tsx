import React from "react";
import { LoginDto } from "@/stores/users/user.model.ts";

export interface AuthContextType {
  login: (apiKey: string) => Promise<LoginDto>;
  logout: () => void;
  isAuthenticated: boolean;
}

export const AuthContext = React.createContext<AuthContextType | undefined>(
  undefined,
);

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
