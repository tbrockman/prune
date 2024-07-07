import React from 'react'
import { FormControlLabel } from '@mui/material'
import { FormOption } from './FormOption'
import PersistedInput from './PersistedInput'
import LabelWithHint from './LabelWithHint'
import { SyncStorageKeys } from '~enums'
import { useStorageWithDefaults } from '~hooks/useStorage'
import { SyncKeyValues, defaultSyncStorage } from '~util/storage'

export function GroupTabsBlock() {
	const storage = useStorageWithDefaults<SyncKeyValues>([
		SyncStorageKeys.AUTO_GROUP,
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
					<PersistedInput
						component="textfield"
						storageKey={SyncStorageKeys.AUTO_GROUP_NAME}
						// @ts-ignore
						hiddenLabel
						size="small"
						variant="filled"
						color="secondary"
						disabled={!storage[SyncStorageKeys.AUTO_GROUP]}
					/>
				}
				label=""
			/>
		</FormOption>
	)
}
