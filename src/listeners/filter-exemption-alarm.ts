import { FILTER_ALARM_NAME_REGEX } from "~constants";

// TODO: (potentially) implement this to trigger updating storage when a filter exemption alarm expires
// so that webpage blocks are re-applied immediately after the exemption expires 
export const createListener = () => {
    return async (alarm: chrome.alarms.Alarm) => {
        // filter exemption alarms have unique names to avoid conflicts
        const matches = alarm.name.match(FILTER_ALARM_NAME_REGEX);

        if (!matches) {
            return
        }
        console.debug('filter expired', matches);
    }
}