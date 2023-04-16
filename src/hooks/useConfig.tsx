import { config, PruneConfig } from '../config/index';

type useConfigType = {
	config: PruneConfig;
};

export default function useConfig(): useConfigType {
	return { config };
}
