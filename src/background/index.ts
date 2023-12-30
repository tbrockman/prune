import AlarmHandler from '~handlers/alarm';
import TabCreatedHandler from '~handlers/tab-created';
import TabFocusedHandler from '~handlers/tab-focused';
import TabBookmarker from '~tab/tab-bookmarker';
import TabDeduplicator from '~tab/tab-deduplicator';
import TabGrouper from '~tab/tab-grouper';
import TabPruner from '~tab/tab-pruner';
import TabSuspender from '~tab/tab-suspender';
import TabTracker from '~tab/tab-tracker';

import '@plasmohq/messaging/background';

import { getOptionsAsync } from '../util';
import { Storage } from '@plasmohq/storage';
import { StorageKeys } from '~enums';

const lock = new Set<number>();
const isFirefox = process.env.PLASMO_BROWSER == 'firefox';

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

async function alarmHandler() {
	console.debug('alarm handler executing');

	const options = await getOptionsAsync();
	const tracker = new TabTracker();
	const grouper = new TabGrouper(!isFirefox);
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
		isFirefox,
	});
	await handler.execute();
}

// Ran every minute
chrome.alarms.onAlarm.addListener(alarmHandler);

// When a new tab might be created
chrome.tabs.onUpdated.addListener(async (tabId, updatedInfo, tab) => {
	console.debug('tab updated', updatedInfo, tab);

	// TODO: handle when updatedInfo is tab being ungrouped
	if (updatedInfo.status != 'loading') return;

	const options = await getOptionsAsync();

	const tracker = new TabTracker();
	const grouper = new TabGrouper(!isFirefox);
	const bookmarker = new TabBookmarker(
		options[StorageKeys.AUTO_PRUNE_BOOKMARK_NAME],
		options[StorageKeys.AUTO_PRUNE_BOOKMARK],
	);
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

	const localStorage = new Storage({
		area: 'local',
	});

	const options = await getOptionsAsync();
	const tracker = new TabTracker();
	const grouper = new TabGrouper(!isFirefox);
	const suspender = new TabSuspender(localStorage);
	const bookmarker = new TabBookmarker(
		options[StorageKeys.AUTO_PRUNE_BOOKMARK_NAME],
		options[StorageKeys.AUTO_PRUNE_BOOKMARK],
	);
	const pruner = new TabPruner(bookmarker);
	const handler = new TabFocusedHandler({
		tracker,
		grouper,
		pruner,
		options,
		suspender,
	});
	await handler.execute(activeInfo);
});
