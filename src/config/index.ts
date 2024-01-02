interface TipConfig {
	backend: string;
}

interface ShareConfig {
	url: string;
}

interface ProductivityConfig {
	domains: string[];
}

interface ReviewConfig {
	url: string;
}

interface PruneConfig {
	tip?: TipConfig;
	share?: ShareConfig;
	productivity?: ProductivityConfig;
	review?: ReviewConfig;
}

const configs: { [key: string]: PruneConfig } = {
	default: {
		tip: {
			backend: 'http://127.0.0.1:8787',
		},
		share: {
			// TODO: Create a proxy that detects your browser and redirects you to the appropriate extension store
			url: 'https://chrome.google.com/webstore/detail/prune/gblddboefgbljpngfhgekbpoigikbenh?hl=en',
		},
		review: {
			url: 'https://chrome.google.com/webstore/detail/prune/gblddboefgbljpngfhgekbpoigikbenh?hl=en',
		},
		// DEPRECATED: dead config from attempting to allow prune to block sites
		// maybe revisit when incremental permissions makes this a bit less scary for users
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
				'news.ycombinator',
				'hbomax',
				'linkedin.com/feed',
				'disneyplus',
				'hulu',
				'primevideo',
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
	chrome: {
		review: {
			url: 'https://chrome.google.com/webstore/detail/prune/gblddboefgbljpngfhgekbpoigikbenh?hl=en',
		},
	},
	edge: {
		review: {
			// TODO: change when we have a page on the edge store
			url: 'https://chrome.google.com/webstore/detail/prune/gblddboefgbljpngfhgekbpoigikbenh?hl=en',
		},
	},
	safari: {
		review: {
			// TODO: change when we have a page on app store
			url: 'https://chrome.google.com/webstore/detail/prune/gblddboefgbljpngfhgekbpoigikbenh?hl=en',
		},
	},
	firefox: {
		review: {
			// TODO: change when we have a page on the firefox add-on store
			url: 'https://chrome.google.com/webstore/detail/prune/gblddboefgbljpngfhgekbpoigikbenh?hl=en',
		},
	},
};

const config = {
	...configs.default,
	...configs[process.env.NODE_ENV ?? 'development'],
	// Okay there's probably a better way to do this so that you can have environment-specific configs per browser platform
	// But I'm not sure what it is, so this is what we're doing for now
	...configs[process.env.PLASMO_ENV ?? 'chrome'],
};

export { config };

export type { PruneConfig, TipConfig };
