import { createStore } from "tinybase";

import {
  useCreateStore,
  useProvideStore,
  useSetValueCallback,
  useStore,
  useValue,
  useValues,
} from "tinybase/ui-react";
import { usePersisters } from "./common";

/**
 * Constants
 */

export const USER_STORE_ID = "user";
export const USER_ID = "userId";
export const USER_REFRESH_TOKEN = "refresh_token";
export const USER_ACCESS_TOKEN = "access_token";

/**
 * Store for the connected user auth information
 */
export const UIUserStore = () => {
  const userStore = useCreateStore(createStore);
  useProvideStore(USER_STORE_ID, userStore);
  usePersisters(userStore, USER_STORE_ID);
  return null;
};

/**
 * Hooks for values
 */

/**
 * GETTERS
 */

export const useUserStore = () => useStore(USER_STORE_ID);

export const useUserRefreshToken = () =>
  useValue(USER_REFRESH_TOKEN, USER_STORE_ID) as string;

export const useUserId = () => useValue(USER_ID, USER_STORE_ID) as string;

export const useUserValues = () => useValues(USER_STORE_ID);

/**
 * SETTERS
 */
export const useSetUserRefreshToken = (refreshToken: string) =>
  useSetValueCallback(
    USER_ACCESS_TOKEN,
    () => refreshToken,
    [refreshToken],
    USER_STORE_ID,
  );
