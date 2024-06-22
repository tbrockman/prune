import { FormControlLabel } from "@mui/material";
import { FormOption } from "./FormOption";
import PersistedInput from "./PersistedInput";
import { StorageKeys } from "~enums";
import LabelWithHint from "./LabelWithHint";

export function ExemptPageSettings() {
    const exemptPagesLabel = chrome.i18n.getMessage('exemptPagesLabel');
    const exemptPagesHint = chrome.i18n.getMessage('exemptPagesHint');

    return (
        <FormOption>
            <FormControlLabel
                control={
                    <PersistedInput
                        component="checkbox"
                        storageKey={StorageKeys.SKIP_EXEMPT_PAGES}
                    />
                }
                label={
                    <LabelWithHint
                        hint={exemptPagesHint}
                        label={exemptPagesLabel}
                    />
                }
            />
        </FormOption>
    )
}