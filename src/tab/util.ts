import type { Options } from "~util";
import { getMatchingFilters, urlToPartialHref } from "~util/filter";

export function tabExemptionsApply(options: Options, tab: chrome.tabs.Tab) {
    let matches = []

    if (options['skip-exempt-pages']) {
        const exemptPages = options['exempt-pages'];
        const url = urlToPartialHref(new URL(tab.url))
        matches = getMatchingFilters(url, exemptPages);
        console.debug('exempt pages', exemptPages, matches, tab.url, url)
    }
    return matches.length > 0;
}