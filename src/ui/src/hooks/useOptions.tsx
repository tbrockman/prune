import { setOptionAsync, Options } from '../util';
import { useStore as _useStore } from './useStore';

export default function useOptions(useStore = _useStore): {
	options: Options;
	setOptionAsync: Function;
} {
	const options = useStore((state) => state.options);
	const setOption = useStore((state) => state.setOption);

	const setOptionProxy = async (key: string, value: any) => {
		setOption(key, value);
		await setOptionAsync(key, value);
	};

	return { options, setOptionAsync: setOptionProxy };
}
