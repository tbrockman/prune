import type { StorageKeys } from '~enums';
import { setOptionAsync, Options } from '../util';
import { useStore as _useStore } from './useStore';

export default function useOptions(useStore = _useStore): {
	options: Options;
	setOptionAsync: (a: keyof Options, b: any) => Promise<void>;
} {
	const options = useStore((state) => state.options);
	const setOption = useStore((state) => state.setOption);

	const setOptionProxy = async (key: keyof Options, value: any) => {
		setOption(key, value);
		await setOptionAsync(key, value);
	};

	return { options, setOptionAsync: setOptionProxy };
}
