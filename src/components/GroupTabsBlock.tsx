import React from 'react'
import { FormControlLabel, TextField } from '@mui/material'
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import { FormOption } from './FormOption'
import PersistedInput from './PersistedInput'
import LabelWithHint from './LabelWithHint'
import { SyncStorageKeys } from '~enums'
import { useSyncStorage } from '~hooks/useStorage'
import { setSyncStorage } from '~util/storage'
import { useTabGroups } from '~hooks/useTabGroups';

const filter = createFilterOptions<string>();

export function GroupTabsBlock() {
	const groups = useTabGroups();
	const storage = useSyncStorage([
		SyncStorageKeys.AUTO_GROUP,
		SyncStorageKeys.AUTO_GROUP_NAME,
	])

	const hideLabel = chrome.i18n.getMessage('hideTabsLabel')
	const hideHint = chrome.i18n.getMessage('hideTabsHint')
	const groupNameHint = chrome.i18n.getMessage('groupNameHint')
	const groupNameLabel = chrome.i18n.getMessage('groupNameLabel')
	const groupNameDefault = chrome.i18n.getMessage('groupNameDefault');
	const groupsWithDefault = Array.from(new Set(groups.map((group) => group.title)).add(groupNameDefault))

	return (
		<FormOption>
			<FormControlLabel
				control={
					<PersistedInput
						component="checkbox"
						storageKey={SyncStorageKeys.AUTO_GROUP}
					/>
				}
				label={<LabelWithHint hint={hideHint} label={hideLabel} />}
			/>
			<FormControlLabel
				control={
					<PersistedInput
						component="textfield"
						storageKey={SyncStorageKeys.AUTO_GROUP_THRESHOLD}
						// @ts-ignore
						hiddenLabel
						size="small"
						variant="filled"
						type="number"
						color="secondary"
						style={{ width: '8ch' }}
						// @ts-ignore
						InputProps={{
							inputProps: {
								max: 100,
								min: 0,
							},

						}}
						disabled={!storage[SyncStorageKeys.AUTO_GROUP]}
					/>
				}
				label={<LabelWithHint hint={groupNameHint} label={groupNameLabel} />}
			/>
			<FormControlLabel
				control={
					<Autocomplete
						autoHighlight
						value={storage[SyncStorageKeys.AUTO_GROUP_NAME]}
						onChange={async (_, newValue) => {
							await setSyncStorage({ [SyncStorageKeys.AUTO_GROUP_NAME]: newValue });
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
						options={groupsWithDefault}
						color="secondary"
						disabled={
							!storage[SyncStorageKeys.AUTO_GROUP]
						}
						selectOnFocus
						handleHomeEndKeys
						renderInput={(params) =>
							<TextField
								{...params}
								placeholder={groupNameDefault}
								hiddenLabel
								variant="filled"
								style={{ width: '29ch' }} />
						}
					/>
				}
				label=""
			/>
		</FormOption>
	)
}
