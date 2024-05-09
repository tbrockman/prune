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

export { PruneStorage, syncStorage, localStorage };
