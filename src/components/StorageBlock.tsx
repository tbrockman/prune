import React from 'react';
import { FormControlLabel } from '@mui/material';
import { FormOption } from './FormOption';
import _useOptions from '../hooks/useOptions';
import PersistedInput from './PersistedInput';
import LabelWithHint from './LabelWithHint';
import { StorageKeys } from '~enums';

export function StorageBlock({ useOptions = _useOptions, isFirefox }) {
	const { options } = useOptions();
	const tabStorageEnabled =
		options[StorageKeys.AUTO_PRUNE] ||
		(options[StorageKeys.TAB_LRU_DESTINATION] === 'close' &&
			options[StorageKeys.TAB_LRU_ENABLED]) ||
		(options[StorageKeys.TAB_LRU_ENABLED] && isFirefox);
	const bookmarkHint =
		"if you're afraid of losing your tabs forever, prune can store them in your bookmarks before closing";
	const bookmarkLabel = 'bookmark closed tabs under';

	return (
		<FormOption>
			<FormControlLabel
				control={
					<PersistedInput
						component="checkbox"
						storageKey={StorageKeys.AUTO_PRUNE_BOOKMARK}
						disabled={!tabStorageEnabled}
					/>
				}
				label={<LabelWithHint hint={bookmarkHint} label={bookmarkLabel} />}
				disabled={!tabStorageEnabled}
			/>
			<FormControlLabel
				control={
					<PersistedInput
						component="textfield"
						hiddenLabel
						size="small"
						placeholder="pruned"
						variant="filled"
						color="secondary"
						fullWidth={false}
						storageKey={StorageKeys.AUTO_PRUNE_BOOKMARK_NAME}
						disabled={
							!options[StorageKeys.AUTO_PRUNE_BOOKMARK] || !tabStorageEnabled
						}
					/>
				}
				label=""
			/>
		</FormOption>
	);
}
