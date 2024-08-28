import { config, type PruneConfig } from '~util/config';

export type useConfigType = {
	config: PruneConfig;
};

export default function useConfig(): useConfigType {
	return { config };
}
