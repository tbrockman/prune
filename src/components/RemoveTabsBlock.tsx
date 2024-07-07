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
	const closeTabsHint =
		"prune can also clean up any pages you haven't looked at in awhile. don't worry, you won't miss them"
	const closeTabsLabel = 'close old tabs after'

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
						InputProps={{
							inputProps: {
								max: 1024,
								min: 0,
							},
						}}
					/>
				}
				label="days 🗑️"
			/>
		</FormOption>
	)
}
