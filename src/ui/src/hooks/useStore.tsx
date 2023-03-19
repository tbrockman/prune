import create from 'zustand';
import { getOptionsAsync, Options } from '../util';

export enum Page {
	// eslint-disable-next-line no-unused-vars
	Home,
	// eslint-disable-next-line no-unused-vars
	ProductivitySettings,
}

interface Store {
	options: Options;
	setOption: (key: string, value: any) => void;
	setOptions: (updated: Options) => void;
	page: Page;
	setPage: (a: Page) => void;
	init: () => Promise<void>;
}

const useStore = create<Store>((set) => ({
	options: new Options(),
	setOption: (key: string, value: any) =>
		set((state) => ({
			options: { ...state.options, [key]: value },
		})),
	setOptions: (updated: Options) =>
		set((state) => ({
			options: { ...state.options, ...updated },
		})),
	init: async () => {
		const asyncOptions = await getOptionsAsync();
		set({ options: asyncOptions });
	},
	page: Page.Home,
	setPage: (page: Page) => {
		set({ page: page });
	},
}));

export { useStore };
export type { Store };
