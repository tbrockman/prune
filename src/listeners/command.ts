import { SyncStorageKeys } from "~enums";
import type { NamedCommands } from "~types";
import { getSyncStorage, setSyncStorage, type SyncStorage } from "~util/storage";

type OptionToggle = {
    [K in keyof SyncStorage]: SyncStorage[K] extends boolean ? K : never;
}[keyof SyncStorage]

async function toggleOption(key: OptionToggle) {
    const response = await getSyncStorage([key]);
    response[key] = !response[key]
    await setSyncStorage(response);
}

export const createListener = () => {
    return async (command: NamedCommands) => {

        switch (command) {
            case 'toggle-deduplicate':
                await toggleOption(SyncStorageKeys.AUTO_DEDUPLICATE);
                break;
            case 'toggle-productivity-mode':
                await toggleOption(SyncStorageKeys.PRODUCTIVITY_MODE_ENABLED);
                break;
        };
    }
}