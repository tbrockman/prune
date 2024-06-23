import { useEffect, useState } from "react";
import type { KeyValues, Values } from "~types";
import { getStorage } from "~util/storage";
import { defaultSyncStorage, type SyncKey } from "~util/storage";


export function useSyncStorage<T extends SyncKey[]>(keys: T): Partial<Record<SyncKey, Values>> {
    return useStorageWithDefaults(keys, defaultSyncStorage);
}

export function useStorageWithDefaults<T extends Record<keyof T, Values>>(keys: (keyof T)[], defaults: T, storageArea: chrome.storage.AreaName = 'sync'): Partial<T> {
    const obj = keys.reduce((acc, key) => {
        return { ...acc, [key]: defaults[key] }
    }, {} as T);

    return useStorage(obj, storageArea);
}

export function useStorage<T extends Record<keyof T, Values>>(keysWithDefaults: Partial<T>, storageArea: chrome.storage.AreaName = 'sync'): Partial<T> {
    const [state, setState] = useState<Partial<T>>(keysWithDefaults);

    const listener = (event: Record<keyof KeyValues, chrome.storage.StorageChange>, area: chrome.storage.AreaName) => {

        if (area !== storageArea) return;

        const intersection = Object.keys(event).filter(key => keysWithDefaults.hasOwnProperty(key));

        if (intersection.length == 0) return;

        const newStorage: Partial<T> = Object.entries(event).reduce((acc, [key, { newValue }]) => {
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