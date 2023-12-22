import { Storage } from '@plasmohq/storage';

// Fix this so you can DI a storage object
const syncStorage = new Storage();
const localStorage = new Storage({
	area: 'local',
});

export async function syncStorageSetAsync(kvs: Record<string, any>) {
	return storageSet(syncStorage, kvs);
}

export async function localStorageSetAsync(kvs: Record<string, any>) {
	return storageSet(localStorage, kvs);
}

export async function storageSet(storage: Storage, kvs: Record<string, any>) {
	try {
		const promises = Object.entries(kvs).map(async ([key, value]) => {
			return await storage.set(key, value);
		});
		return await Promise.all(promises);
	} catch (e) {
		console.error('error setting kvs', kvs, e);
	}
	return null;
}

export async function getStorageKeyOrDefault(
	storage: Storage,
	key: string,
	default_value: any,
) {
	let result: any;

	try {
		let value = await storage.get(key);
		result = await storage.get(key);
	} catch (e) {
		console.error('error getting key', key, e);
	}
	console.debug('got key', key, 'value', result, 'default', default_value);
	return result ?? default_value;
}

export async function localStorageGetAsync(
	defaults: Record<string, any> | string,
	default_value: any = null,
) {
	return await storageGet(localStorage, defaults, default_value);
}

export async function syncStorageGetAsync(
	defaults: Record<string, any> | string,
	default_value: any = null,
) {
	return await storageGet(syncStorage, defaults, default_value);
}

export async function storageGet(
	storage: Storage,
	defaults: Record<string, any> | string,
	default_value: any = null,
): Promise<Record<string, any>> {
	let promises = [];
	let result = {};

	if (typeof defaults == 'string') {
		promises.push(async () => {
			let value = await getStorageKeyOrDefault(
				storage,
				defaults,
				default_value,
			);
			return [defaults, value];
		});
	} else {
		promises = promises.concat(
			Object.entries(defaults).map(async ([key, default_value]) => {
				let value = await getStorageKeyOrDefault(storage, key, default_value);
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
