import AlarmHandler from '~src/handlers/alarm';
import TabCreatedHandler from '~src/handlers/tab-created';
import TabFocusedHandler from '~src/handlers/tab-focused';
import TabBookmarker from '~src/tab/tab-bookmarker';
import TabDeduplicator from '~src/tab/tab-deduplicator';
import TabGrouper from '~src/tab/tab-grouper';
import TabPruner from '~src/tab/tab-pruner';
import TabSuspender from '~src/tab/tab-suspender';
import TabTracker from '~src/tab/tab-tracker';

import '@plasmohq/messaging/background';

import { getOptionsAsync } from '../util';
import { Storage } from '@plasmohq/storage';
import { StorageKeys } from '~enums';

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
chrome.alarms.create({ periodInMinutes: 1 });

// Ran every minute
chrome.alarms.onAlarm.addListener(async (alarm) => {
	let bookmarker;
	const options = await getOptionsAsync();
	const tracker = new TabTracker();
	const grouper = new TabGrouper(process.env.PLASMO_BROWSER != 'firefox');

	if (options[StorageKeys.AUTO_PRUNE_BOOKMARK]) {
		bookmarker = new TabBookmarker(
			options[StorageKeys.AUTO_PRUNE_BOOKMARK_NAME],
		);
	}
	const pruner = new TabPruner(bookmarker);
	const handler = new AlarmHandler({ tracker, grouper, pruner, options });
	await handler.execute();
});

// When a new tab might be created
chrome.tabs.onUpdated.addListener(async (tabId, updatedInfo, tab) => {
	console.debug('tab updated', updatedInfo, tab);

	// TODO: handle when updatedInfo is tab being ungrouped
	if (updatedInfo.status != 'loading') return;

	let bookmarker;
	const options = await getOptionsAsync();

	const tracker = new TabTracker();
	const grouper = new TabGrouper(process.env.PLASMO_BROWSER != 'firefox');

	if (options[StorageKeys.AUTO_PRUNE_BOOKMARK]) {
		bookmarker = new TabBookmarker(
			options[StorageKeys.AUTO_PRUNE_BOOKMARK_NAME],
		);
	}
	const pruner = new TabPruner(bookmarker);
	const deduplicator = new TabDeduplicator(lock);
	const handler = new TabCreatedHandler({
		tracker,
		grouper,
		pruner,
		deduplicator,
		options,
	});
	await handler.execute(tab);
});

// Whenever a tab comes into focus
chrome.tabs.onActivated.addListener(async (activeInfo) => {
	console.debug('tab activated listener', activeInfo);
	let bookmarker;

	const storage = new Storage({
		area: 'local',
	});
	console.debug('created storage');
	const options = await getOptionsAsync();
	console.debug('got options');
	const tracker = new TabTracker();
	console.debug('made tracker');
	const grouper = new TabGrouper(process.env.PLASMO_BROWSER != 'firefox');
	console.debug('created grouper');
	const suspender = new TabSuspender(storage);
	console.debug('created suspender');
	if (options[StorageKeys.AUTO_PRUNE_BOOKMARK]) {
		bookmarker = new TabBookmarker(
			options[StorageKeys.AUTO_PRUNE_BOOKMARK_NAME],
		);
	}
	const pruner = new TabPruner(bookmarker);
	const handler = new TabFocusedHandler({
		tracker,
		grouper,
		pruner,
		options,
		suspender,
	});
	console.debug('created handler', handler);
	await handler.execute(activeInfo);
});
