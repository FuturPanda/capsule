import React, { createContext, useEffect, useState } from "react";
import { CapsuleAxios } from "@/api/axios.ts";
import { migrations } from "@/_utils/db";

interface DatabaseContextType {
  isInitialized: boolean;
  error: Error | null;
  currentHash?: string;
}

const DatabaseContext = createContext<DatabaseContextType | undefined>(
  undefined,
);

async function checkAndMigrateIfNeeded() {
  try {
    const response = await CapsuleAxios.post("/migrations/check", {
      migrations: migrations,
    }).then((x) => x.data);

    return response.data;
  } catch (error) {
    console.error("Migration check failed:", error);
    throw error;
  }
}

export function FlintProvider({ children }: { children: React.ReactNode }) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [currentHash, setCurrentHash] = useState<string>();

  useEffect(() => {
    const initialize = async () => {
      try {
        const result = await checkAndMigrateIfNeeded();
        setCurrentHash(result.schemaHash);
        setIsInitialized(true);
      } catch (err) {
        setError(
          err instanceof Error
            ? err
            : new Error("Failed to initialize database"),
        );
      }
    };

    initialize().then((data) => console.log(data));
  }, []);

  return (
    <DatabaseContext.Provider value={{ isInitialized, error, currentHash }}>
      {children}
    </DatabaseContext.Provider>
  );
}
