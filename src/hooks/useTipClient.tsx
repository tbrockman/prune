import useConfig from '~hooks/useConfig';
import { TipClient } from '~clients/tip';

export default function useTipClient() {
	const { config } = useConfig();

	if (!config.tip) {
		throw new Error('Missing configuration for `config.tip`.');
	}
	return new TipClient(config.tip);
}
