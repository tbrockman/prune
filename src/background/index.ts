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
import { SyncStorageKeys } from '~enums';
import { Features, config } from '~config';
import { getSuspendPageRedirectUrl, tabExemptionsApply } from '~tab/util';
import type { NamedCommands } from '~types';
import { defaultSyncStorage, localStorage, syncStorage, type SyncStorage } from '~util/storage';
import { getStorage, getSyncStorage, setSyncStorage } from "~util/storage";
import { getMatchingFilters, getNonExemptFilters } from '~util/filter';

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
	const tracker = new TabTracker({ storage: options[SyncStorageKeys.USE_SYNC_STORAGE] ? syncStorage : localStorage });
	const grouper = new TabGrouper(config.featureSupported(Features.TabGroups));
	const bookmarker = new TabBookmarker(
		options[SyncStorageKeys.AUTO_PRUNE_BOOKMARK_NAME],
		options[SyncStorageKeys.AUTO_PRUNE_BOOKMARK] && config.featureSupported(Features.Bookmarks),
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
chrome.alarms.create('check-tab-age', { periodInMinutes: 1 });
chrome.alarms.onAlarm.addListener(async (alarm) => {
	const isExpiration = alarm.name.startsWith('filter-expired-');

	if (!isExpiration) {
		return
	}

	console.debug('filter expired');
	// TODO: clean this up
})
chrome.alarms.onAlarm.addListener(async (alarm) => {
	console.debug('alarm listener triggered');

	// TODO: clean this up
	if (alarm.name !== 'check-tab-age') {
		return;
	}
	const options = await getSyncStorage() as SyncStorage;
	const tracker = new TabTracker({ storage: options[SyncStorageKeys.USE_SYNC_STORAGE] ? syncStorage : localStorage });
	const grouper = new TabGrouper(config.featureSupported(Features.TabGroups));
	const bookmarker = new TabBookmarker(
		options[SyncStorageKeys.AUTO_PRUNE_BOOKMARK_NAME],
		options[SyncStorageKeys.AUTO_PRUNE_BOOKMARK] && config.featureSupported(Features.Bookmarks),
	);
	const pruner = new TabPruner(bookmarker);
	const handler = new AlarmHandler({
		tracker,
		grouper,
		pruner,
		options,
		config
	});
	await handler.execute(alarm);
});

// When a new tab is created, or a navigation occurs in an existing tab
chrome.tabs.onUpdated.addListener(async (tabId, updatedInfo, tab) => {
	console.debug('tab updated', updatedInfo, tab);
	const options = await getStorage("sync", defaultSyncStorage);

	// TODO: handle when updatedInfo is tab being ungrouped
	if (updatedInfo.status == 'complete' || (updatedInfo.status && updatedInfo.url)) {

		if (tabExemptionsApply(options, tab)) {
			console.debug('exempt page', tab.url);
			return;
		}

		if (options[SyncStorageKeys.PRODUCTIVITY_MODE_ENABLED]) {
			const url = getSuspendPageRedirectUrl(tab,
				options[SyncStorageKeys.PRODUCTIVITY_SUSPEND_DOMAINS],
				options[SyncStorageKeys.PRODUCTIVITY_SUSPEND_EXEMPTIONS])

			if (url) {
				chrome.tabs.update(tab.id, { url })
				return;
			}
		}

		const tracker = new TabTracker({ storage: options[SyncStorageKeys.USE_SYNC_STORAGE] ? syncStorage : localStorage });
		const grouper = new TabGrouper(config.featureSupported(Features.TabGroups));
		const bookmarker = new TabBookmarker(
			options[SyncStorageKeys.AUTO_PRUNE_BOOKMARK_NAME],
			options[SyncStorageKeys.AUTO_PRUNE_BOOKMARK] && config.featureSupported(Features.Bookmarks),
		);
		const pruner = new TabPruner(bookmarker);
		const deduplicator = new TabDeduplicator(
			lock,
			config.featureSupported(Features.TabHighlighting),
			options[SyncStorageKeys.AUTO_DEDUPLICATE_CLOSE]
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
	const tab = await chrome.tabs.get(activeInfo.tabId);

	const options = await getSyncStorage();

	if (tabExemptionsApply(options, tab)) {
		console.debug('exempt page', tab.url);
		return;
	}

	if (options[SyncStorageKeys.PRODUCTIVITY_MODE_ENABLED]) {
		const url = getSuspendPageRedirectUrl(tab,
			options[SyncStorageKeys.PRODUCTIVITY_SUSPEND_DOMAINS],
			options[SyncStorageKeys.PRODUCTIVITY_SUSPEND_EXEMPTIONS])

		if (url) {
			chrome.tabs.update(tab.id, { url })
			return;
		}
	}

	const tracker = new TabTracker({ storage: options[SyncStorageKeys.USE_SYNC_STORAGE] ? syncStorage : localStorage });
	const handler = new TabFocusedHandler({
		tracker,
		options,
	});
	await handler.execute(tab);
});

async function toggleOption(key: SyncStorageKeys) {
	const response = await getSyncStorage([key]);
	// @ts-ignore
	response[key] = !response[key]
	await setSyncStorage(response);
}

// Handling extension commands
chrome.commands.onCommand.addListener(async (command: NamedCommands) => {

	switch (command) {
		case 'toggle-deduplicate':
			await toggleOption(SyncStorageKeys.AUTO_DEDUPLICATE);
			break;
		case 'toggle-productivity-mode':
			await toggleOption(SyncStorageKeys.PRODUCTIVITY_MODE_ENABLED);
			break;
	};
});