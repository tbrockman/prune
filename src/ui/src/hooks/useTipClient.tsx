import useConfig from "./useConfig";
import { TipClient } from "../clients/tip";
import { PruneConfig } from "../config";

export default function useTipClient() {

    const { config } = useConfig()

    if (!config.tip) {
        throw new Error('Missing configuration for `config.tip`.')
    }

    return new TipClient(config.tip)
}