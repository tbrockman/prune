const createTab = (overrides: Partial<chrome.tabs.Tab> = {}): chrome.tabs.Tab => {
    return {
        id: 1,
        groupId: -1,
        index: 0,
        pinned: false,
        highlighted: false,
        windowId: 0,
        active: false,
        incognito: false,
        selected: false,
        autoDiscardable: false,
        discarded: false,
        ...overrides,
    };
}

export {
    createTab,
}