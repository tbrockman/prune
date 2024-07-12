import { Autocomplete, Chip, FormControlLabel, TextField } from "@mui/material";
import { FormOption } from "./FormOption";
import PersistedInput from "./PersistedInput";
import { SyncStorageKeys } from "~enums";
import LabelWithHint from "./LabelWithHint";
import { useSyncStorage } from "~hooks/useStorage";
import { setSyncStorage } from "~util/storage";
import { useTabs } from "~hooks/useTabs";
import { getSuggestedUrls } from "~util/url";

export function ExemptPagesBlock() {
    const tabs = useTabs();
    const storage = useSyncStorage([
        SyncStorageKeys.SKIP_EXEMPT_PAGES,
        SyncStorageKeys.EXEMPT_PAGES
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
                        storageKey={SyncStorageKeys.SKIP_EXEMPT_PAGES}
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
                value={storage[SyncStorageKeys.EXEMPT_PAGES] as string[]}
                onChange={(_, newValue, reason) => {

                    if (reason === 'blur') {
                        return;
                    }
                    setSyncStorage({ [SyncStorageKeys.EXEMPT_PAGES]: newValue });
                }}
                multiple
                freeSolo
                options={getSuggestedUrls(tabs) || []} // TODO: pre-fill options with currently open pages
                disableClearable
                filterSelectedOptions
                autoHighlight
                disabled={!storage[SyncStorageKeys.SKIP_EXEMPT_PAGES]}
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