import { getMatchingFilters, getNonExemptFilters } from "~util/filter";
import type { SyncKeyValues } from "~util/storage";

export function tabExemptionsApply(options: SyncKeyValues, tab: chrome.tabs.Tab) {
    let matches = []

    if (options['skip-exempt-pages'] && tab.url) {
        const exemptPages = options['exempt-pages'];
        matches = getMatchingFilters(new URL(tab.url), exemptPages);
        console.debug('exempt pages', exemptPages, matches, tab.url)
    }
    return matches.length > 0;
}

export function getSuspendPageRedirectUrl(tab: chrome.tabs.Tab, filters: string[], exemptions: Record<string, any>) {
    const nonExemptFilters = getNonExemptFilters(filters, exemptions)
    const matchingFilters = getMatchingFilters(new URL(tab.url), nonExemptFilters);
    console.debug('filters', nonExemptFilters, 'matchingFilters', matchingFilters)

    if (matchingFilters.length > 0) {
        console.debug('suspended page', tab.url);
        let url = chrome.runtime.getURL('tabs/suspended.html')
        const params = new URLSearchParams({
            url: tab.url,
            matched_by: matchingFilters.join(','),
        })
        url += '?' + params.toString();
        return url;
    }
    return null;
}