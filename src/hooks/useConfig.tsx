import { config, type PruneConfig } from '../config';

type useConfigType = {
	config: PruneConfig;
};

export default function useConfig(): useConfigType {
	return { config };
}
