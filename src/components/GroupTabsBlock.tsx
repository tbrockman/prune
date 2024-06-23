import React from 'react'
import { FormControlLabel } from '@mui/material'
import { FormOption } from './FormOption'
import PersistedInput from './PersistedInput'
import LabelWithHint from './LabelWithHint'
import { StorageKeys } from '~enums'
import { useStorageWithDefaults } from '~hooks/useStorage'
import { SyncKeyValues, defaultSyncStorage } from '~util/storage'

export function GroupTabsBlock() {
	const storage = useStorageWithDefaults<SyncKeyValues>([
		StorageKeys.AUTO_GROUP,
	], defaultSyncStorage)

	const hideLabel = chrome.i18n.getMessage('hideTabsLabel')
	const hideHint = chrome.i18n.getMessage('hideTabsHint')
	const groupNameHint = chrome.i18n.getMessage('groupNameHint')
	const groupNameLabel = chrome.i18n.getMessage('groupNameLabel')

	return (
		<FormOption>
			<FormControlLabel
				control={
					<PersistedInput
						component="checkbox"
						storageKey={StorageKeys.AUTO_GROUP}
					/>
				}
				label={<LabelWithHint hint={hideHint} label={hideLabel} />}
			/>
			<FormControlLabel
				control={
					<PersistedInput
						component="textfield"
						storageKey={StorageKeys.AUTO_GROUP_THRESHOLD}
						// @ts-ignore
						hiddenLabel
						size="small"
						variant="filled"
						type="number"
						color="secondary"
						style={{ width: '8ch' }}
						InputProps={{
							inputProps: {
								max: 100,
								min: 0,
							},

						}}
						disabled={!storage[StorageKeys.AUTO_GROUP]}
					/>
				}
				label={<LabelWithHint hint={groupNameHint} label={groupNameLabel} />}
			/>
			<FormControlLabel
				control={
					<PersistedInput
						component="textfield"
						storageKey={StorageKeys.AUTO_GROUP_NAME}
						// @ts-ignore
						hiddenLabel
						size="small"
						variant="filled"
						color="secondary"
						disabled={!storage[StorageKeys.AUTO_GROUP]}
					/>
				}
				label=""
			/>
		</FormOption>
	)
}
