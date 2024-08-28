import type { TipConfig } from '~util/config';

class TipClient {
	backend: string;

	constructor({ backend }: TipConfig) {
		this.backend = backend;
	}

	async createSession(tipInCents: number) {
		let response = await fetch(this.backend, {
			method: 'post',
			headers: {
				'content-type': 'application/json',
				accept: 'application/json',
			},
			body: JSON.stringify({
				tip: tipInCents,
			}),
		});

		if (response.status !== 200) {
			const text = await response.text();
			throw new Error(text);
		}
		return await response.json();
	}
}

export { TipClient };
