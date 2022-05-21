import { setOptionAsync, Options } from '../util';
import { useStore } from './useStore';

export default function useOptions(): {
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
