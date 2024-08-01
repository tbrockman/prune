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
	exemptions?: string[];
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
			url: 'https://download.prune.lol',
		},
		review: {
			url: 'https://chrome.google.com/webstore/detail/prune/gblddboefgbljpngfhgekbpoigikbenh',
		},
		exemptions: ['bing', 'docs.google'],
		productivity: {
			// TODO: for domains like youtube and reddit
			// maybe determine whether the contents are actually productive or not
			domains: [
				'youtube',
				'facebook',
				'instagram',
				'reddit',
				'tiktok',
				'buzzfeed',
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
		// Note: sharing functionality doesn't seem to work in Edge extensions
		review: {
			url: 'https://microsoftedge.microsoft.com/addons/detail/ideengngoaeoamicacnpipkdmpledphd'
		},
		unsupportedFeatures: new Set([Features.Sharing]),
	},
	safari: {
		unsupportedFeatures: new Set([Features.TabGroups, Features.TabHighlighting, Features.Bookmarks, Features.SyncStorage]),
		review: {
			url: 'https://apps.apple.com/us/app/prune-your-tabs/id6503263467?action=write-review'
		}
	},
	firefox: {
		review: {
			url: 'https://addons.mozilla.org/en-US/firefox/addon/prune-tabs/',
		},
		unsupportedFeatures: new Set([Features.TabGroups]),
	},
	opera: {
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
