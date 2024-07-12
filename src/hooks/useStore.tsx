import { create } from 'zustand';
import type { Commands } from '~types';

interface Store {
	platformInfo?: chrome.runtime.PlatformInfo;
	commands: Commands;
	init: () => Promise<void>;
}

const useStore = create<Store>((set) => ({
	commands: {},
	init: async () => {
		const platformInfo = await chrome.runtime.getPlatformInfo()
		const commands = (await chrome.commands.getAll()).reduce((acc, command) => {
			acc[command.name] = command;
			return acc;
		}, {} as Commands);
		set({ platformInfo, commands });
	}
}));

export { useStore };
export type { Store };
