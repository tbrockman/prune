import { useEffect, useState } from "react";
import type { KeyValues, Values } from "~types";
import { defaultSyncStorage, type SyncKey } from "~util/storage";


function parseStorageResponse(response: Record<string, Values>): Record<string, Values> {
    return Object.entries(response).reduce((acc, [key, value]) => {

        if (typeof value !== 'string') {
            return { ...acc, [key]: value }
        }
        else {
            try {
                return { ...acc, [key]: JSON.parse(value) }
            } catch (e) {
                return { ...acc, [key]: value }
            }
        }
    }, {})
}

export async function setSyncStorage<T extends Partial<Record<SyncKey, Values>>>(data: T): Promise<void> {
    return await setStorage('sync', data);
}

export async function getSyncStorage<T extends SyncKey[]>(keys?: T): Promise<Record<SyncKey, Values>> {
    if (!keys) {
        return getStorage('sync', defaultSyncStorage);
    }

    return getStorage('sync', keys.reduce((acc, key) => {
        return { ...acc, [key]: defaultSyncStorage[key] }
    }, {} as Record<SyncKey, Values>));
}

export async function getStorage<T extends Record<string, Values>>(storageArea: chrome.storage.AreaName, keysWithDefaults: T): Promise<T> {
    return parseStorageResponse(await chrome.storage[storageArea].get(keysWithDefaults)) as T;
}

export async function setStorage<T extends Record<string, Values>>(storageArea: chrome.storage.AreaName, data: T): Promise<void> {
    const serialized = Object.entries(data).reduce((acc, [key, value]) => {
        return { ...acc, [key]: JSON.stringify(value) }
    }, {} as KeyValues);
    return await chrome.storage[storageArea].set(serialized)
}

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