import { Autocomplete, Chip, FormControlLabel, TextField } from "@mui/material";
import { FormOption } from "./FormOption";
import PersistedInput from "./PersistedInput";
import { StorageKeys } from "~enums";
import LabelWithHint from "./LabelWithHint";
import { useStorage } from "@plasmohq/storage/hook";
import useConfig from "~hooks/useConfig";
import useOptions from "~hooks/useOptions";

export function ExemptPagesBlock() {

    const { config } = useConfig();
    const { options } = useOptions();

    const [exemptPages, setExemptPages] = useStorage(
        StorageKeys.EXEMPT_PAGES,
        config.exemptions || [],
    );

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
                value={exemptPages}
                onChange={(_, newValue, reason) => {

                    if (reason === 'blur') {
                        return;
                    }
                    setExemptPages(newValue);
                }}
                multiple
                freeSolo
                fullWidth
                options={[]} // TODO: pre-fill options with currently open pages
                disableClearable
                filterSelectedOptions
                autoHighlight
                disabled={!options["skip-exempt-pages"]}
                getOptionLabel={(option) => option}
                defaultValue={[exemptPages ? exemptPages[0] : 'bing']}
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