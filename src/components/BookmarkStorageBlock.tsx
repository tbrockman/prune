import React from 'react';
import { FormControlLabel, TextField } from '@mui/material';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import { FormOption } from '~components/FormOption';
import PersistedInput from '~components/PersistedInput';
import LabelWithHint from '~components/LabelWithHint';
import { SyncStorageKeys } from '~enums';
import _useConfig from '~hooks/useConfig';
import { Features } from '~util/config';
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
	const defaultBookmarkName = '🍃 pruned'
	const options = Array.from(new Set(bookmarks.folders.map((folder) => folder.title)).add(defaultBookmarkName));

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
						options={options}
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
								placeholder={defaultBookmarkName}
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
