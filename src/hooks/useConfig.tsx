import { config, type PruneConfig } from '../config';

export type useConfigType = {
	config: PruneConfig;
};

export default function useConfig(): useConfigType {
	return { config };
}
