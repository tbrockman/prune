import { Storage } from '@plasmohq/storage';

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
			result = await this.get(key);
		} catch (e) {
			console.error('error getting key', key, e);
		}
		console.debug('got key', key, 'value', result, 'default', default_value);
		return result ?? default_value;
	}

	async getManyOrDefault(
		defaults: Record<string, any> | string,
		default_value: any = null,
	) {
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

export async function syncStorageSetAsync(kvs: Record<string, any>) {
	return await syncStorage.setMany(kvs);
}

export async function localStorageSetAsync(kvs: Record<string, any>) {
	return await localStorage.setMany(kvs);
}

export async function localStorageGetAsync(
	defaults: Record<string, any> | string,
	default_value: any = null,
): Promise<any> {
	return await localStorage.getManyOrDefault(defaults, default_value);
}

export async function syncStorageGetAsync(
	defaults: Record<string, any> | string,
	default_value: any = null,
): Promise<any> {
	return await syncStorage.getManyOrDefault(defaults, default_value);
}
