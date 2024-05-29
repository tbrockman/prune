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

interface IPruneConfig {
	tip?: TipConfig;
	share?: ShareConfig;
	productivity?: ProductivityConfig;
	review?: ReviewConfig;
	unsupportedFeatures?: Set<Features>;
}

interface PruneConfig extends IPruneConfig {
	featureSupported(feature: Features): boolean;
}

export enum Features {
	TabGroups = 'tabGroups',
	TabHighlighting = 'tabHighlighting',
	Sharing = 'sharing',
	Bookmarks = 'bookmarks',
	SyncStorage = 'syncStorage'
}

const configs: { [key: string]: IPruneConfig } = {
	default: {
		tip: {
			backend: 'http://127.0.0.1:8787',
		},
		share: {
			// TODO: Create a proxy that detects your browser and redirects you to the appropriate extension store?
			url: 'https://chrome.google.com/webstore/detail/prune/gblddboefgbljpngfhgekbpoigikbenh',
		},
		review: {
			url: 'https://chrome.google.com/webstore/detail/prune/gblddboefgbljpngfhgekbpoigikbenh',
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
		unsupportedFeatures: new Set(),
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
			url: 'https://chrome.google.com/webstore/detail/prune/gblddboefgbljpngfhgekbpoigikbenh',
		},
	},
	edge: {
		// Even though sharing functionality doesn't work in Edge
		share: {
			url: 'https://microsoftedge.microsoft.com/addons/detail/ideengngoaeoamicacnpipkdmpledphd'
		},
		review: {
			url: 'https://microsoftedge.microsoft.com/addons/detail/ideengngoaeoamicacnpipkdmpledphd'
		},
		unsupportedFeatures: new Set([Features.Sharing]),
	},
	safari: {
		unsupportedFeatures: new Set([Features.TabGroups, Features.TabHighlighting, Features.Bookmarks, Features.SyncStorage]),
		share: {
			url: 'https://apps.apple.com/us/app/prune-your-tabs/id6503263467'
		},
		review: {
			url: 'https://apps.apple.com/us/app/prune-your-tabs/id6503263467?action=write-review'
		}
	},
	firefox: {
		share: {
			url: 'https://addons.mozilla.org/en-US/firefox/addon/prune-tabs/',
		},
		review: {
			url: 'https://addons.mozilla.org/en-US/firefox/addon/prune-tabs/',
		},
		unsupportedFeatures: new Set([Features.TabGroups]),
	},
	opera: {
		share: {
			url: 'https://addons.opera.com/en/extensions/details/prune/',
		},
		review: {
			url: 'https://addons.opera.com/en/extensions/details/prune/'
		},
		unsupportedFeatures: new Set([Features.TabGroups, Features.TabHighlighting, Features.SyncStorage]),
	}
};

const config: PruneConfig = {
	...configs.default,
	...configs[process.env.NODE_ENV ?? 'development'],
	// Okay there's probably a better way to do this so that you can have environment-specific configs per browser platform
	// But I'm not sure what it is, so this is what we're doing for now
	...configs[process.env.PLASMO_BROWSER ?? 'chrome'],
	featureSupported: (feature: Features): boolean => {
		return !config.unsupportedFeatures.has(feature);
	}
};

export { config };
export type { PruneConfig, TipConfig };
