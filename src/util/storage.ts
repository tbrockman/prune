import { Storage } from '@plasmohq/storage';
import { Features, config } from '~util/config';
import { SyncStorageKeys } from '~enums';
import type { KeyValues, Values } from '~types';

class PruneStorage extends Storage {
	async setMany(kvs: Record<string, any>) {
		try {
			const promises = Object.entries(kvs).map(async ([key, value]) => {
				return await this.set(key, value);
			});
			return await Promise.all(promises);
		} catch (e) {
			console.error('error setting kvs', kvs, e);
		}
		return null;
	}

	async getOrDefault(key: string, default_value: any = null) {
		let result: any;

		try {
			result = await this.get<any>(key);
		} catch (e) {
			console.error('error getting key', key, e);
		}
		return result ?? default_value;
	}

	async getManyOrDefault(
		defaults: Record<string, any> | string,
		default_value: any = null,
	): Promise<Record<string, any>> {
		let promises = [];
		let result = {};

		if (typeof defaults == 'string') {
			promises.push(async () => {
				let value = await this.getOrDefault(defaults, default_value);
				return [defaults, value];
			});
		} else {
			promises = promises.concat(
				Object.entries(defaults).map(async ([key, default_value]) => {
					let value = await this.getOrDefault(key, default_value);
					return [key, value];
				}),
			);
		}

		try {
			let results = await Promise.all(promises);
			results.forEach(([key, value]) => {
				result[key] = value;
			});
		} catch (e) {
			console.error('error getting results', e);
		}
		return result;
	}
}

// Fix this so you can DI a storage object
const syncStorage = new PruneStorage();
const localStorage = new PruneStorage({
	area: 'local',
});

export type SyncStorage = {
	[K in SyncStorageKeys]: SyncKeyValues[K];
}
export class SyncKeyValues implements Record<SyncStorageKeys, Values> {
	[SyncStorageKeys.AUTO_DEDUPLICATE] = true;
	[SyncStorageKeys.AUTO_DEDUPLICATE_CLOSE] = true;
	[SyncStorageKeys.AUTO_PRUNE] = true;
	[SyncStorageKeys.AUTO_PRUNE_THRESHOLD] = config.featureSupported(Features.TabGroups) ? 7 : 4;
	[SyncStorageKeys.AUTO_GROUP] = true;
	[SyncStorageKeys.AUTO_GROUP_THRESHOLD] = 2;
	[SyncStorageKeys.AUTO_GROUP_NAME] = '🕒 old tabs';
	[SyncStorageKeys.AUTO_PRUNE_BOOKMARK] = true;
	[SyncStorageKeys.AUTO_PRUNE_BOOKMARK_NAME] = '🍃 pruned';
	[SyncStorageKeys.TAB_LRU_ENABLED] = false;
	[SyncStorageKeys.TAB_LRU_SIZE] = 16;
	[SyncStorageKeys.TAB_LRU_DESTINATION] = 'group';
	[SyncStorageKeys.SHOW_HINTS] = true;
	[SyncStorageKeys.PRODUCTIVITY_MODE_ENABLED] = false;
	[SyncStorageKeys.PRODUCTIVITY_SUSPEND_DOMAINS] = config.productivity?.domains;
	[SyncStorageKeys.PRODUCTIVITY_SUSPEND_EXEMPTIONS] = {};
	[SyncStorageKeys.USE_SYNC_STORAGE] = false;
	[SyncStorageKeys.PRODUCTIVITY_LAST_PRODUCTIVE_TAB] = 0;
	[SyncStorageKeys.SHOW_ADVANCED_SETTINGS] = false;
	[SyncStorageKeys.SKIP_EXEMPT_PAGES] = false;
	[SyncStorageKeys.EXEMPT_PAGES] = config.exemptions || [];
	[SyncStorageKeys.DEDUPLICATE_ACROSS_CONTAINERS] = true;
}

const defaultSyncStorage = new SyncKeyValues() as SyncStorage;

export async function getOptionsAsync() {
	const area = defaultSyncStorage['use-sync-storage'] ? 'sync' : 'local';
	return await getStorage(area, defaultSyncStorage);
}

export { defaultSyncStorage, PruneStorage, syncStorage, localStorage }; function parseStorageResponse(response: Record<string, Values>): Record<string, Values> {
	return Object.entries(response).reduce((acc, [key, value]) => {

		if (typeof value !== 'string') {
			return { ...acc, [key]: value };
		}
		else {
			try {
				return { ...acc, [key]: JSON.parse(value) };
			} catch (e) {
				return { ...acc, [key]: value };
			}
		}
	}, {});
}

export async function setSyncStorage<T extends Partial<SyncKeyValues>>(data: T): Promise<void> {
	return await setStorage('sync', data);
}

type ExtractKeys<T extends (keyof SyncStorage)[] | undefined> = T extends undefined
	? SyncStorage
	: { [K in T[number]]: SyncStorage[K] };

export async function getSyncStorage<T extends (keyof SyncStorage)[] | undefined>(keys?: T): Promise<ExtractKeys<T>> {
	if (!keys) {
		return await getStorage('sync', defaultSyncStorage) as ExtractKeys<T>;
	}

	const selectedStorage = keys.reduce((acc, key) => {
		acc[key] = defaultSyncStorage[key];
		return acc;
	}, {} as { [K in T[number]]: SyncStorage[K] });

	return await getStorage('sync', selectedStorage) as ExtractKeys<T>;
}

export async function getStorage<T extends Record<string, Values>>(storageArea: chrome.storage.AreaName, keysWithDefaults: T): Promise<T> {
	return parseStorageResponse(await chrome.storage[storageArea].get(keysWithDefaults)) as T;
}

export async function setStorage<T extends Record<string, Values>>(storageArea: chrome.storage.AreaName, data: T): Promise<void> {
	const serialized = Object.entries(data).reduce((acc, [key, value]) => {
		return { ...acc, [key]: JSON.stringify(value) };
	}, {} as KeyValues);
	return await chrome.storage[storageArea].set(serialized);
}

