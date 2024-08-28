export type Tab = chrome.tabs.Tab & {
    cookieStoreId?: string;
}
export type Primitive = string | number | boolean | null | undefined | object;
export type Values = Primitive | Primitive[] | KeyValueStructure

export type KeyValueStructure = {
    [key in string]: Values;
};

export type KeyValues = KeyValueStructure;
export type NamedCommands = 'toggle-deduplicate' | 'toggle-productivity-mode'
export type Commands = {
    [key in NamedCommands]?: chrome.commands.Command;
}