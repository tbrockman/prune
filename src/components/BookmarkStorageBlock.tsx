import React from 'react';
import { FormControlLabel, TextField } from '@mui/material';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import { FormOption } from './FormOption';
import PersistedInput from './PersistedInput';
import LabelWithHint from './LabelWithHint';
import { SyncStorageKeys } from '~enums';
import _useConfig from '~hooks/useConfig';
import { Features } from '~config';
import { useSyncStorage } from '~hooks/useStorage';
import { useBookmarks } from '~hooks/useBookmark';
import { setSyncStorage } from '~util/storage';

const filter = createFilterOptions<string>();

export function BookmarkStorageBlock({ useConfig = _useConfig }) {
	const bookmarks = useBookmarks();
	const storage = useSyncStorage(
		[
			SyncStorageKeys.AUTO_PRUNE,
			SyncStorageKeys.TAB_LRU_ENABLED,
			SyncStorageKeys.TAB_LRU_DESTINATION,
			SyncStorageKeys.AUTO_PRUNE_BOOKMARK,
			SyncStorageKeys.AUTO_PRUNE_BOOKMARK_NAME
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
					<Autocomplete
						autoHighlight
						value={storage[SyncStorageKeys.AUTO_PRUNE_BOOKMARK_NAME]}
						onChange={async (_, newValue) => {
							await setSyncStorage({ [SyncStorageKeys.AUTO_PRUNE_BOOKMARK_NAME]: newValue });
						}}
						filterOptions={(options, params) => {
							const filtered = filter(options, params);
							const { inputValue } = params;
							// Suggest the creation of a new value
							const isExisting = options.some((option) => inputValue === option);
							if (inputValue !== '' && !isExisting) {
								filtered.push(inputValue);
							}
							return filtered;
						}}
						getOptionLabel={(option) => option}
						fullWidth
						options={bookmarks.folders.map((folder) => folder.title)}
						color="secondary"
						disabled={
							!storage[SyncStorageKeys.AUTO_PRUNE_BOOKMARK] || !tabStorageEnabled
						}
						selectOnFocus
						handleHomeEndKeys
						renderInput={(params) =>
							<TextField
								{...params}
								hiddenLabel
								placeholder='🍃 pruned'
								variant="filled"
								style={{ width: '26ch' }} />
						}
					/>
				}
				label=""
			/>
		</FormOption>
	);
}
