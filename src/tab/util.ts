import { getMatchingFilters, urlToPartialHref } from "~util/filter";
import type { SyncKeyValues } from "~util/storage";

export function tabExemptionsApply(options: SyncKeyValues, tab: chrome.tabs.Tab) {
    let matches = []

    if (options['skip-exempt-pages']) {
        const exemptPages = options['exempt-pages'];
        const url = urlToPartialHref(new URL(tab.url))
        matches = getMatchingFilters(url, exemptPages);
        console.debug('exempt pages', exemptPages, matches, tab.url, url)
    }
    return matches.length > 0;
}