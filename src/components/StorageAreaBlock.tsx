import { FormOption } from './FormOption';
import { FormControlLabel } from '@mui/material';
import PersistedInput from './PersistedInput';
import { StorageKeys } from '~enums';
import LabelWithHint from './LabelWithHint';

export default function StorageAreaBlock() {
    const hint = chrome.i18n.getMessage('useSyncStorageHint')
    const label = chrome.i18n.getMessage('useSyncStorageLabel')

    return (
        <FormOption>
            <FormControlLabel
                control={
                    <PersistedInput
                        component="checkbox"
                        storageKey={StorageKeys.USE_SYNC_STORAGE}
                    />
                }
                label={<LabelWithHint hint={hint} label={label} />}
            />
        </FormOption>
    )
}