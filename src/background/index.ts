import '@plasmohq/messaging/background';

import { initLogging } from '~util';
import { TAB_AGE_ALARM_NAME } from '~constants';
import { createListener as createCommandListener } from '~listeners/command';
import { createListener as createExtensionInstalledListener } from '~listeners/extension-installed';
import { createListener as createFilterExemptionAlarm } from '~listeners/filter-exemption-alarm';
import { createListener as createTabAgeAlarmListener } from '~listeners/tab-age-alarm';
import { createListener as createTabFocusedListener } from '~listeners/tab-focused';
import { createListener as createTabUpdatedListener } from '~listeners/tab-updated';

initLogging();

const tabLock = new Set<number>();

// Executed on app installs, clears storage on major version upgrades > 3
chrome.runtime.onInstalled.addListener(
	createExtensionInstalledListener()
);
// Ran every minute
chrome.alarms.create(TAB_AGE_ALARM_NAME, { periodInMinutes: 1 });
// When a filter exemption expires
chrome.alarms.onAlarm.addListener(
	createFilterExemptionAlarm()
)
// Periodic check for tab age
chrome.alarms.onAlarm.addListener(
	createTabAgeAlarmListener()
);
// When a new tab is created, or a navigation occurs in an existing tab
chrome.tabs.onUpdated.addListener(
	createTabUpdatedListener(tabLock)
);
// Whenever a tab comes into focus
chrome.tabs.onActivated.addListener(
	createTabFocusedListener()
);
// Handling extension commands
chrome.commands.onCommand.addListener(
	createCommandListener()
);