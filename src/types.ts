import type { SyncKey } from "~util/storage";

export type Tab = chrome.tabs.Tab
export type Primitive = string | number | boolean | null | undefined | object;
export type Values = Primitive | Primitive[] | KeyValueStructure

export type KeyValueStructure = {
    [key in keyof SyncKey]: Values;
};

export type KeyValues = KeyValueStructure;
export type NamedCommands = 'toggle-deduplicate' | 'toggle-productivity-mode'
export type Commands = {
    [key in NamedCommands]?: chrome.commands.Command;
}