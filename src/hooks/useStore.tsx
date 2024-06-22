import { create } from 'zustand';
import { getOptionsAsync, Options } from '../util';

interface Store {
	options: Options;
	setOption: (key: keyof Options, value: any) => void;
	setOptions: (updated: Options) => void;
	init: () => Promise<void>;
}

const useStore = create<Store>((set) => ({
	options: new Options(),
	setOption: (key: keyof Options, value: any) =>
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
	}
}));

export { useStore };
export type { Store };
