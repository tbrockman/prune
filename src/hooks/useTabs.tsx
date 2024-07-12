import { useEffect, useState } from "react";

export function useTabs() {
    const [tabs, setTabs] = useState<chrome.tabs.Tab[]>([]);

    useEffect(() => {
        const listener = async () => {
            const tabs = await new Promise<chrome.tabs.Tab[]>(resolve => {
                chrome.tabs.query({}, resolve);
            });
            setTabs(tabs);
        }
        chrome.tabs.onUpdated.addListener(listener);
        chrome.tabs.onRemoved.addListener(listener);
        chrome.tabs.onCreated.addListener(listener);

        listener();

        return () => {
            chrome.tabs.onUpdated.removeListener(listener);
            chrome.tabs.onRemoved.removeListener(listener);
            chrome.tabs.onCreated.removeListener(listener);
        }
    }, [])

    return tabs
}