import { Store } from "tinybase";
import { createLocalPersister } from "tinybase/persisters/persister-browser";
/**
 * Persisters Hooks
 */

import { useEffect } from "react";

export const usePersisters = (store: Store, localStorageName: string) => {
  useEffect(() => {
    // const cleanups: (() => void)[] = [];
    const localPersister = createLocalPersister(store, localStorageName);
    //cleanups.push(localPersister.destroy);
    localPersister.startAutoLoad(store.getContent()).then(() => {
      localPersister.startAutoSave();
    });
  }, [store, localStorageName]);
};
