import { getMatchingFilters } from "~util/filter";
import type { SyncKeyValues } from "~util/storage";

export function tabExemptionsApply(options: SyncKeyValues, tab: chrome.tabs.Tab) {
    let matches = []

    if (options['skip-exempt-pages']) {
        const exemptPages = options['exempt-pages'];
        matches = getMatchingFilters(new URL(tab.url), exemptPages);
        console.debug('exempt pages', exemptPages, matches, tab.url)
    }
    return matches.length > 0;
}