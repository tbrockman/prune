import { removeTrailingSlashes } from "./string";

export function isSystemUrl(url: string) {
    return url.startsWith('chrome') || url.startsWith('about') || url.startsWith('edge');
}

export function getSuggestedUrls(tabs: chrome.tabs.Tab[]) {
    return Array.from(tabs.reduce((acc: Set<string>, tab) => {
        if (tab.url && !isSystemUrl(tab.url)) {
            const url = new URL(tab.url);
            const domain = url.hostname;

            // domain without tld if length > 0
            const parts = domain.split('.');

            if (parts.length > 1) {
                parts.pop();

                if (parts[0] == 'www') {
                    parts.shift();
                }
            }

            const domainWithoutTld = parts.join('.');
            acc.add(domainWithoutTld);
            const root = parts[parts.length - 1]
            acc.add(root);
            const full = removeTrailingSlashes(url.hostname + url.pathname + url.search + url.hash);

            if (full !== domain) {
                acc.add(full);
            }
        }
        return acc;
    }, new Set<string>()).values()).sort((a, b) => a.length != b.length ? a.length - b.length : a.localeCompare(b));
}