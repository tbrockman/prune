import { useEffect, useState } from "react";
import type { Values } from "~types";
import { getStorage, type SyncStorage } from "~util/storage";
import { defaultSyncStorage } from "~util/storage";

// A perhaps incorrect and overly confusing way of ensuring we only 
// try to retrieve keys that are actually in storage (and we've specified defaults for)

export function useSyncStorage<T extends (keyof SyncStorage)[]>(keys: T): {
    [K in T[number]]: SyncStorage[K];
} {
    const obj = keys.reduce((acc, key) => {
        return { ...acc, [key]: defaultSyncStorage[key] }
    }, {} as {
        [K in T[number]]: SyncStorage[K];
    });

    return useStorage(obj, 'sync');
}

export function useStorage<T extends Record<string, Values>>(keysWithDefaults: T, storageArea: chrome.storage.AreaName = 'sync'): T {
    const [state, setState] = useState(keysWithDefaults);

    const listener = (event: Record<string, chrome.storage.StorageChange>, area: chrome.storage.AreaName) => {

        if (area !== storageArea) return;

        const intersection = Object.entries(event).filter(([key,]) => keysWithDefaults.hasOwnProperty(key));

        if (intersection.length == 0) return;

        const newStorage: T = intersection.reduce((acc, [key, { newValue }]) => {
            if (!keysWithDefaults.hasOwnProperty(key)) return acc;

            return { ...acc, [key]: JSON.parse(newValue) }
        }, state);

        setState(newStorage);
    }

    useEffect(() => {
        if (!keysWithDefaults || Object.keys(keysWithDefaults).length == 0) return;

        getStorage(storageArea, keysWithDefaults).then((response) => {
            setState(response);
        });
    }, [])

    useEffect(() => {
        chrome.storage.onChanged.addListener(listener);

        return () => {
            chrome.storage.onChanged.removeListener(listener);
        }
    }, [keysWithDefaults])
    return state;
}