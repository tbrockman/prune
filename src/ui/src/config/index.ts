interface TipConfig {
	backend: string;
}

interface ShareConfig {
	url: string;
}

interface ProductivityConfig {
	domains: string[];
}

interface PruneConfig {
	tip?: TipConfig;
	share?: ShareConfig;
	productivity?: ProductivityConfig;
}

const configs: { [key: string]: PruneConfig } = {
	default: {
		tip: {
			backend: 'http://127.0.0.1:8787',
		},
		share: {
			url: 'https://chrome.google.com/webstore/detail/prune/gblddboefgbljpngfhgekbpoigikbenh?hl=en',
		},
		productivity: {
			domains: [
				'youtube',
				'facebook',
				'instagram',
				'reddit',
				'tiktok',
				'buzzfeed',
				'amazon',
				'netflix',
				'ycombinator',
				'hbomax',
			],
		},
	},
	development: {
		tip: {
			backend: 'https://tip.dev.theo.lol',
		},
	},
	production: {
		tip: {
			backend: 'https://tip.theo.lol',
		},
	},
};

const config = { ...configs.default, ...configs[process.env.NODE_ENV] };

export { config };

export type { PruneConfig, TipConfig };
