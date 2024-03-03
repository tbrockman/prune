import AlarmHandler from '~handlers/alarm';
import TabUpdatedHandler from '~handlers/tab-updated';
import TabFocusedHandler from '~handlers/tab-focused';
import TabBookmarker from '~tab/tab-bookmarker';
import TabDeduplicator from '~tab/tab-deduplicator';
import TabGrouper from '~tab/tab-grouper';
import TabPruner from '~tab/tab-pruner';
import TabTracker from '~tab/tab-tracker';

import '@plasmohq/messaging/background';

import { getOptionsAsync, initLogging } from '../util';
import { StorageKeys } from '~enums';
import { Features, config } from '~config';

initLogging();

const lock = new Set<number>();

// Executed on app installs, clears storage on major version upgrades > 3
chrome.runtime.onInstalled.addListener(async (details: any) => {
	if (details.reason == 'update') {
		const version = chrome.runtime.getManifest().version;
		let split = version.split('.');
		const major = parseInt(split[0]);
		split = details.previousVersion.split('.');
		const prevMajor = parseInt(split[0]);

		console.debug(
			'Updated from ' + details.previousVersion + ' to ' + version + '!',
		);

		if (major >= 3 && major > prevMajor) {
			await chrome.storage.local.clear();
		}
	}
});

// Ran every minute
chrome.alarms.create({ periodInMinutes: 1 });
chrome.alarms.onAlarm.addListener(async () => {
	console.debug('alarm handler executing');
	const options = await getOptionsAsync();
	const tracker = new TabTracker();
	const grouper = new TabGrouper(config.unsupportedFeatures.has(Features.TabGroups));
	const bookmarker = new TabBookmarker(
		options[StorageKeys.AUTO_PRUNE_BOOKMARK_NAME],
		options[StorageKeys.AUTO_PRUNE_BOOKMARK],
	);
	const pruner = new TabPruner(bookmarker);
	const handler = new AlarmHandler({
		tracker,
		grouper,
		pruner,
		options,
		unsupportedFeatures: config.unsupportedFeatures,
	});
	await handler.execute();
});

// When a new tab is created, or a navigation occurs in an existing tab
chrome.tabs.onUpdated.addListener(async (tabId, updatedInfo, tab) => {
	console.debug('tab updated', updatedInfo, tab);

	// TODO: handle when updatedInfo is tab being ungrouped
	if (updatedInfo.status == 'complete' || (updatedInfo.status && updatedInfo.url)) {
		const options = await getOptionsAsync();

		const tracker = new TabTracker();
		const grouper = new TabGrouper(!config.unsupportedFeatures.has(Features.TabGroups));
		const bookmarker = new TabBookmarker(
			options[StorageKeys.AUTO_PRUNE_BOOKMARK_NAME],
			options[StorageKeys.AUTO_PRUNE_BOOKMARK],
		);
		const pruner = new TabPruner(bookmarker);
		const deduplicator = new TabDeduplicator(
			lock,
			config.unsupportedFeatures,
			options[StorageKeys.AUTO_DEDUPLICATE_CLOSE]
		);
		const handler = new TabUpdatedHandler({
			tracker,
			grouper,
			pruner,
			deduplicator,
			options,
		});
		await handler.execute(tab);
	}
});

// Whenever a tab comes into focus
chrome.tabs.onActivated.addListener(async (activeInfo) => {
	console.debug('tab activated listener', activeInfo);

	const options = await getOptionsAsync();
	const tracker = new TabTracker();
	const handler = new TabFocusedHandler({
		tracker,
		options,
	});
	await handler.execute(activeInfo);
});
