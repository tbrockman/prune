import { useEffect, useState } from "react";



export function useTabGroups() {
    const [groups, setGroups] = useState<chrome.tabGroups.TabGroup[]>([])

    useEffect(() => {
        const listener = async () => {
            const groups = await chrome.tabGroups.query({})
            setGroups(groups)
        }

        chrome.tabGroups.onCreated.addListener(listener)
        chrome.tabGroups.onUpdated.addListener(listener)
        chrome.tabGroups.onRemoved.addListener(listener)

        listener()

        return () => {
            chrome.tabGroups.onCreated.removeListener(listener)
            chrome.tabGroups.onUpdated.removeListener(listener)
            chrome.tabGroups.onRemoved.removeListener(listener)
        }
    }, [])

    return groups
}