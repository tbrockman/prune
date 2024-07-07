import React from 'react';
import { FormControlLabel } from '@mui/material';
import { FormOption } from './FormOption';
import PersistedInput from './PersistedInput';
import LabelWithHint from './LabelWithHint';
import { SyncStorageKeys } from '~enums';
import _useConfig from '~hooks/useConfig';
import { Features } from '~config';
import { useSyncStorage } from '~hooks/useStorage';

export function TabStorageBlock({ useConfig = _useConfig }) {
	const storage = useSyncStorage(
		[
			SyncStorageKeys.AUTO_PRUNE,
			SyncStorageKeys.TAB_LRU_ENABLED,
			SyncStorageKeys.TAB_LRU_DESTINATION,
			SyncStorageKeys.AUTO_PRUNE_BOOKMARK,
		]
	)

	const { config } = useConfig();
	const tabStorageEnabled =
		storage[SyncStorageKeys.AUTO_PRUNE] ||
		(storage[SyncStorageKeys.TAB_LRU_DESTINATION] === 'close' &&
			storage[SyncStorageKeys.TAB_LRU_ENABLED]) ||
		(storage[SyncStorageKeys.TAB_LRU_ENABLED] && !config.featureSupported(Features.TabGroups));
	const bookmarkHint = chrome.i18n.getMessage('bookmarkHint');
	const bookmarkLabel = chrome.i18n.getMessage('bookmarkLabel');

	return (
		<FormOption>
			<FormControlLabel
				control={
					<PersistedInput
						component="checkbox"
						storageKey={SyncStorageKeys.AUTO_PRUNE_BOOKMARK}
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
						placeholder="🍃 pruned"
						variant="filled"
						color="secondary"
						fullWidth={false}
						storageKey={SyncStorageKeys.AUTO_PRUNE_BOOKMARK_NAME}
						disabled={
							!storage[SyncStorageKeys.AUTO_PRUNE_BOOKMARK] || !tabStorageEnabled
						}
					/>
				}
				label=""
			/>
		</FormOption>
	);
}
