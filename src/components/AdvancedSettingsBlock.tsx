import { FormControlLabel } from "@mui/material";
import { FormOption } from "./FormOption";
import PersistedInput from "./PersistedInput";
import LabelWithHint from "./LabelWithHint";
import { StorageKeys } from "~enums";
import useOptions from "~hooks/useOptions";
import { ExemptPagesBlock } from "./ExemptPagesBlock";
import ProductivityBlock from "./ProductivityBlock";

export function AdvancedSettingsBlock() {
    const { options } = useOptions();

    const advancedSettingsLabel = chrome.i18n.getMessage('advancedSettingsLabel');
    const advancedSettingsHint = chrome.i18n.getMessage('advancedSettingsHint');

    return (
        <>
            <FormOption>
                <FormControlLabel
                    control={
                        <PersistedInput
                            component="checkbox"
                            storageKey={StorageKeys.ENABLED_ADVANCED_SETTINGS}
                        />
                    }
                    label={
                        <LabelWithHint
                            hint={advancedSettingsHint}
                            label={advancedSettingsLabel}
                        />
                    }
                />
            </FormOption>
            {options['show-advanced-settings'] && <ExemptPagesBlock />}
            {options['show-advanced-settings'] && <ProductivityBlock />}
        </>

    )
}