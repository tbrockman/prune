import React from 'react'
import { FormControlLabel } from '@mui/material'
import { FormOption } from './FormOption'
import PersistedInput from './PersistedInput'
import LabelWithHint from './LabelWithHint'
import { SyncStorageKeys } from '~enums'
import { useSyncStorage } from '~hooks/useStorage'

export function RemoveTabsBlock() {
	const storage = useSyncStorage([
		SyncStorageKeys.AUTO_PRUNE,
	])
	const closeTabsHint = chrome.i18n.getMessage('closeTabsHint')
	const closeTabsLabel = chrome.i18n.getMessage('closeTabsLabel')
	const closeTabsTimeUnit = chrome.i18n.getMessage('closeTabsTimeUnit')

	return (
		<FormOption>
			<FormControlLabel
				control={
					<PersistedInput
						component="checkbox"
						storageKey={SyncStorageKeys.AUTO_PRUNE}
					/>
				}
				label={
					<LabelWithHint
						hint={closeTabsHint}
						label={closeTabsLabel}
					/>
				}
			/>
			<FormControlLabel
				control={
					<PersistedInput
						component="textfield"
						// @ts-ignore
						hiddenLabel
						size="small"
						variant="filled"
						type="number"
						color="secondary"
						style={{ width: '8ch' }}
						storageKey={SyncStorageKeys.AUTO_PRUNE_THRESHOLD}
						disabled={!storage[SyncStorageKeys.AUTO_PRUNE]}
						// @ts-ignore
						InputProps={{
							inputProps: {
								max: 1024,
								min: 0,
							},
						}}
					/>
				}
				label={closeTabsTimeUnit}
			/>
		</FormOption>
	)
}
