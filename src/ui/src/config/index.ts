interface TipConfig {
	backend: string;
}

interface ShareConfig {
	url: string;
}

interface PruneConfig {
	tip?: TipConfig;
	share?: ShareConfig;
}

const configs: { [key: string]: PruneConfig } = {
	default: {
		tip: {
			backend: 'http://127.0.0.1:8787',
		},
		share: {
			url: 'https://chrome.google.com/webstore/detail/prune/gblddboefgbljpngfhgekbpoigikbenh?hl=en',
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