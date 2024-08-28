import { config, Features } from "~util/config";
import { SyncStorageKeys } from "~enums";
import TabBookmarker from "~tab/bookmarker";
import TabGrouper from "~tab/grouper";
import TabPruner from "~tab/pruner";
import TabTracker from "~tab/tracker";
import { getSyncStorage, localStorage, syncStorage } from "~util/storage";
import { TabAgeAlarmListener } from "./tab-age-alarm";

export const createListener = () => {
    return async (details: any) => {
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

        const options = await getSyncStorage();
        const tracker = new TabTracker({ storage: options[SyncStorageKeys.USE_SYNC_STORAGE] ? syncStorage : localStorage });
        const grouper = new TabGrouper(config.featureSupported(Features.TabGroups));
        const bookmarker = new TabBookmarker(
            options[SyncStorageKeys.AUTO_PRUNE_BOOKMARK_NAME],
            options[SyncStorageKeys.AUTO_PRUNE_BOOKMARK] && config.featureSupported(Features.Bookmarks),
        );
        const pruner = new TabPruner(bookmarker);
        // Run our initial tab age check alarm to track all open tabs on install/updates
        const handler = new TabAgeAlarmListener({
            tracker,
            grouper,
            pruner,
            options,
            config
        });
        await handler.execute();
    }
}