import { Storage } from '@plasmohq/storage';
import { Features, config } from '~config';
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

export type SyncKey = 'auto-deduplicate' | 'auto-deduplicate-close' | 'auto-prune' | 'prune-threshold' | 'auto-group' | 'auto-group-threshold' | 'auto-group-name' | 'auto-prune-bookmark' | 'auto-prune-bookmark-name' | 'tab-lru-enabled' | 'tab-lru-size' | 'tab-lru-destination' | 'show-hints' | 'productivity-mode-enabled' | 'productivity-suspend-domains' | 'productivity-suspend-exemptions' | 'use-sync-storage' | 'productivity-last-productive-tab' | 'show-advanced-settings' | 'skip-exempt-pages' | 'exempt-pages';
export type SyncStorage = {
	[K in SyncKey]: SyncKeyValues[K];
}
export class SyncKeyValues implements Record<SyncKey, Values> {
	'auto-deduplicate' = true;
	'auto-deduplicate-close' = true;
	'auto-prune' = true;
	'prune-threshold' = config.featureSupported(Features.TabGroups) ? 7 : 4;
	'auto-group' = true;
	'auto-group-threshold' = 2;
	'auto-group-name' = '🕒 old tabs';
	'auto-prune-bookmark' = true;
	'auto-prune-bookmark-name' = '🌱 pruned';
	'tab-lru-enabled' = false;
	'tab-lru-size' = 16;
	'tab-lru-destination': 'group' | 'close' = 'group';
	'show-hints' = true;
	'productivity-mode-enabled' = false;
	'productivity-suspend-domains' = config.productivity?.domains;
	'productivity-suspend-exemptions' = {};
	'use-sync-storage' = false;
	'productivity-last-productive-tab' = 0;
	'show-advanced-settings' = false;
	'skip-exempt-pages' = false;
	'exempt-pages' = config.exemptions || [];
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

export async function setSyncStorage<T extends Partial<Record<SyncKey, Values>>>(data: T): Promise<void> {
	return await setStorage('sync', data);
}

export async function getSyncStorage<T extends SyncKey[]>(keys?: T): Promise<{
	[K in T[number]]: SyncStorage[K];
} | SyncStorage> {
	if (!keys) {
		return await getStorage('sync', defaultSyncStorage);
	}

	return await getStorage('sync', keys.reduce((acc, key) => {
		return { ...acc, [key]: defaultSyncStorage[key] };
	}, {} as {
		[K in T[number]]: SyncStorage[K];
	}));
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

