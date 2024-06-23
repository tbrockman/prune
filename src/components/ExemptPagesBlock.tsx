import { Autocomplete, Chip, FormControlLabel, TextField } from "@mui/material";
import { FormOption } from "./FormOption";
import PersistedInput from "./PersistedInput";
import { StorageKeys } from "~enums";
import LabelWithHint from "./LabelWithHint";
import { setSyncStorage, useSyncStorage } from "~hooks/useStorage";

export function ExemptPagesBlock() {

    const storage = useSyncStorage([
        StorageKeys.SKIP_EXEMPT_PAGES,
        StorageKeys.EXEMPT_PAGES
    ])

    const exemptPagesInputPlaceholder = chrome.i18n.getMessage('exemptPagesInputPlaceholder');
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
            <Autocomplete
                value={storage[StorageKeys.EXEMPT_PAGES] as string[]}
                onChange={(_, newValue, reason) => {

                    if (reason === 'blur') {
                        return;
                    }
                    setSyncStorage({ [StorageKeys.EXEMPT_PAGES]: newValue });
                }}
                multiple
                freeSolo
                options={[]} // TODO: pre-fill options with currently open pages
                disableClearable
                filterSelectedOptions
                autoHighlight
                disabled={!storage[StorageKeys.SKIP_EXEMPT_PAGES]}
                getOptionLabel={(option) => option}
                renderTags={(value: string[], getTagProps) =>
                    value.map((option: string, index: number) => (
                        <Chip
                            variant="outlined"
                            label={option}
                            {...getTagProps({ index })}
                        />
                    ))
                }
                renderInput={(params) => (
                    <>
                        <TextField
                            variant="filled"
                            placeholder={exemptPagesInputPlaceholder}
                            {...params}
                            inputProps={{
                                ...params.inputProps,
                                style: {
                                    minWidth: '31ch'
                                },
                            }}
                        />
                    </>
                )}
            />
        </FormOption>
    )
}