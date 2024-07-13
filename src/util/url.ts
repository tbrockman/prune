import { removeTrailingSlashes } from "./string";

const ipReg = /((^\s*((([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]))\s*$)|(^\s*((([0-9a-f]{1,4}:){7}([0-9a-f]{1,4}|:))|(([0-9a-f]{1,4}:){6}(:[0-9a-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9a-f]{1,4}:){5}(((:[0-9a-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9a-f]{1,4}:){4}(((:[0-9a-f]{1,4}){1,3})|((:[0-9a-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){3}(((:[0-9a-f]{1,4}){1,4})|((:[0-9a-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){2}(((:[0-9a-f]{1,4}){1,5})|((:[0-9a-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){1}(((:[0-9a-f]{1,4}){1,6})|((:[0-9a-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9a-f]{1,4}){1,7})|((:[0-9a-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$))/ig;

export function isIp(hostname: string) {
    return ipReg.test(hostname);
}

export function isSystemUrl(url: string) {
    return url.startsWith('chrome') || url.startsWith('about') || url.startsWith('edge') || url.startsWith('moz-extension');
}

export function getSuggestedUrls(tabs: chrome.tabs.Tab[]) {
    return Array.from(tabs.reduce((acc: Set<string>, tab) => {
        if (tab.url && !isSystemUrl(tab.url)) {
            const url = new URL(tab.url);
            const domain = url.hostname;

            if (isIp(domain)) {
                return acc;
            }
            const parts = domain.split('.');

            if (parts.length == 2 || (parts.length == 3 && parts[0] == 'www')) {
                parts.pop();

                if (parts[0] == 'www') {
                    parts.shift();
                }
            }

            const domainWithoutPath = parts.join('.');
            acc.add(domainWithoutPath);

            // const root = parts[parts.length - 1]
            // acc.add(root);
            const full = removeTrailingSlashes(url.hostname + url.pathname + url.search + url.hash);

            if (full !== domain) {
                acc.add(full);
            }
        }
        // lazy hack
        acc.delete('')
        return acc;
    }, new Set<string>()).values()).sort((a, b) => a.length != b.length ? a.length - b.length : a.localeCompare(b));
}