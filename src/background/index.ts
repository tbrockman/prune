import AlarmHandler from '~handlers/alarm';
import TabUpdatedHandler from '~handlers/tab-updated';
import TabFocusedHandler from '~handlers/tab-focused';
import TabBookmarker from '~tab/bookmarker';
import TabDeduplicator from '~tab/deduplicator';
import TabGrouper from '~tab/grouper';
import TabPruner from '~tab/pruner';
import TabTracker from '~tab/tracker';

import '@plasmohq/messaging/background';

import { initLogging } from '~util';
import { StorageKeys } from '~enums';
import { Features, config } from '~config';
import { tabExemptionsApply } from '~tab/util';
import type { NamedCommands } from '~types';
import { defaultSyncStorage, localStorage, syncStorage, type SyncKey, type SyncStorage } from '~util/storage';
import { getStorage, getSyncStorage, setSyncStorage } from "~util/storage";

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

	const options = await getStorage("sync", defaultSyncStorage);
	const tracker = new TabTracker({ storage: options[StorageKeys.USE_SYNC_STORAGE] ? syncStorage : localStorage });
	const grouper = new TabGrouper(config.featureSupported(Features.TabGroups));
	const bookmarker = new TabBookmarker(
		options[StorageKeys.AUTO_PRUNE_BOOKMARK_NAME],
		options[StorageKeys.AUTO_PRUNE_BOOKMARK] && config.featureSupported(Features.Bookmarks),
	);
	const pruner = new TabPruner(bookmarker);
	const handler = new AlarmHandler({
		tracker,
		grouper,
		pruner,
		options,
		config
	});
	await handler.execute();
});

// Ran every minute
chrome.alarms.create({ periodInMinutes: 1 });
chrome.alarms.onAlarm.addListener(async () => {
	console.debug('alarm listener triggered');
	const options = await getSyncStorage() as SyncStorage;
	const tracker = new TabTracker({ storage: options[StorageKeys.USE_SYNC_STORAGE] ? syncStorage : localStorage });
	const grouper = new TabGrouper(config.featureSupported(Features.TabGroups));
	const bookmarker = new TabBookmarker(
		options[StorageKeys.AUTO_PRUNE_BOOKMARK_NAME],
		options[StorageKeys.AUTO_PRUNE_BOOKMARK] && config.featureSupported(Features.Bookmarks),
	);
	const pruner = new TabPruner(bookmarker);
	const handler = new AlarmHandler({
		tracker,
		grouper,
		pruner,
		options,
		config
	});
	await handler.execute();
});

// When a new tab is created, or a navigation occurs in an existing tab
chrome.tabs.onUpdated.addListener(async (tabId, updatedInfo, tab) => {
	console.debug('tab updated', updatedInfo, tab);

	// TODO: handle when updatedInfo is tab being ungrouped
	if (updatedInfo.status == 'complete' || (updatedInfo.status && updatedInfo.url)) {
		const options = await getStorage("sync", defaultSyncStorage);

		if (tabExemptionsApply(options, tab)) {
			console.debug('exempt page', tab.url);
			return;
		}

		const tracker = new TabTracker({ storage: options[StorageKeys.USE_SYNC_STORAGE] ? syncStorage : localStorage });
		const grouper = new TabGrouper(config.featureSupported(Features.TabGroups));
		const bookmarker = new TabBookmarker(
			options[StorageKeys.AUTO_PRUNE_BOOKMARK_NAME],
			options[StorageKeys.AUTO_PRUNE_BOOKMARK] && config.featureSupported(Features.Bookmarks),
		);
		const pruner = new TabPruner(bookmarker);
		const deduplicator = new TabDeduplicator(
			lock,
			config.featureSupported(Features.TabHighlighting),
			options[StorageKeys.AUTO_DEDUPLICATE_CLOSE]
		);
		const handler = new TabUpdatedHandler({
			tracker,
			grouper,
			pruner,
			deduplicator,
			options,
			config
		});
		await handler.execute(tab);
	}
});

// Whenever a tab comes into focus
chrome.tabs.onActivated.addListener(async (activeInfo) => {
	console.debug('tab activated listener', activeInfo);

	const options = await getSyncStorage();
	const tracker = new TabTracker({ storage: options[StorageKeys.USE_SYNC_STORAGE] ? syncStorage : localStorage });
	const handler = new TabFocusedHandler({
		tracker,
		options,
	});
	await handler.execute(activeInfo);
});

async function toggleOption(key: SyncKey) {
	const response = await getSyncStorage([key]);
	// @ts-ignore
	response[key] = !response[key]
	await setSyncStorage(response);
}

// Handling extension commands
chrome.commands.onCommand.addListener(async (command: NamedCommands) => {

	switch (command) {
		case 'toggle-deduplicate':
			await toggleOption(StorageKeys.AUTO_DEDUPLICATE);
			break;
		case 'toggle-productivity-mode':
			await toggleOption(StorageKeys.PRODUCTIVITY_MODE_ENABLED);
			break;
	};
});