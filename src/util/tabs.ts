import type { Tab } from "~types";

const createTab = (overrides: Partial<Tab> = {}): Tab => {
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