import React from 'react';
import { FormControlLabel } from '@mui/material';
import { FormOption } from './FormOption';
import PersistedInput from './PersistedInput';
import LabelWithHint from './LabelWithHint';
import { StorageKeys } from '~enums';
import _useConfig from '~hooks/useConfig';
import { Features } from '~config';
import { useSyncStorage } from '~hooks/useStorage';

export function TabStorageBlock({ useConfig = _useConfig }) {
	const storage = useSyncStorage(
		[
			StorageKeys.AUTO_PRUNE,
			StorageKeys.TAB_LRU_ENABLED,
			StorageKeys.TAB_LRU_DESTINATION,
			StorageKeys.AUTO_PRUNE_BOOKMARK,
		]
	)

	const { config } = useConfig();
	const tabStorageEnabled =
		storage[StorageKeys.AUTO_PRUNE] ||
		(storage[StorageKeys.TAB_LRU_DESTINATION] === 'close' &&
			storage[StorageKeys.TAB_LRU_ENABLED]) ||
		(storage[StorageKeys.TAB_LRU_ENABLED] && !config.featureSupported(Features.TabGroups));
	const bookmarkHint = chrome.i18n.getMessage('bookmarkHint');
	const bookmarkLabel = chrome.i18n.getMessage('bookmarkLabel');

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
						// @ts-ignore
						hiddenLabel
						size="small"
						placeholder="🌱 pruned"
						variant="filled"
						color="secondary"
						fullWidth={false}
						storageKey={StorageKeys.AUTO_PRUNE_BOOKMARK_NAME}
						disabled={
							!storage[StorageKeys.AUTO_PRUNE_BOOKMARK] || !tabStorageEnabled
						}
					/>
				}
				label=""
			/>
		</FormOption>
	);
}
