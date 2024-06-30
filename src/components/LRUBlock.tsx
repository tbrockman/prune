import React from 'react'
import {
	FormControl,
	FormControlLabel,
	MenuItem,
} from '@mui/material'
import { FormOption } from './FormOption'
import PersistedInput from './PersistedInput'
import LabelWithHint from './LabelWithHint'
import { StorageKeys } from '~enums'
import _useConfig from '~hooks/useConfig'
import { Features } from '~config'
import { useStorageWithDefaults } from '~hooks/useStorage'
import { SyncKeyValues, defaultSyncStorage } from '~util/storage'

export function LRUBlock({ useConfig = _useConfig }) {
	const { config } = useConfig()
	const storage = useStorageWithDefaults<SyncKeyValues>([StorageKeys.TAB_LRU_ENABLED], defaultSyncStorage)

	const lruTabsHint = chrome.i18n.getMessage('leastRecentlyUsedTabsHint')
	let lruTabsLabel = chrome.i18n.getMessage('leastRecentlyUsedTabsLabel')
	lruTabsLabel = !config.featureSupported(Features.TabGroups) ? chrome.i18n.getMessage('leastRecentlyUsedTabsLabelAction') + ' ' + lruTabsLabel : lruTabsLabel
	const lruSizeLabel = chrome.i18n.getMessage('leastRecentlyUsedTabsSizeLabel')

	return (
		<FormOption className="lru-options">
			<FormControl className="lru-options-control">
				<FormControlLabel
					control={
						<>
							<PersistedInput
								component="checkbox"
								storageKey={StorageKeys.TAB_LRU_ENABLED}
							/>
							{config.featureSupported(Features.TabGroups) && <PersistedInput
								component="select"
								storageKey={StorageKeys.TAB_LRU_DESTINATION}
								disabled={!storage[StorageKeys.TAB_LRU_ENABLED]}
							>
								<MenuItem value={'group'}>{chrome.i18n.getMessage('leastRecentlyUsedTabsDestinationGroup')}</MenuItem>
								<MenuItem value={'close'}>{chrome.i18n.getMessage('leastRecentlyUsedTabsDestinationClose')}</MenuItem>
							</PersistedInput>}
						</>
					}
					label={
						<LabelWithHint
							hint={lruTabsHint}
							label={lruTabsLabel}
						/>
					}
					disabled={!storage[StorageKeys.TAB_LRU_ENABLED]}
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
							style={{ width: '10ch' }}
							storageKey={StorageKeys.TAB_LRU_SIZE}
							disabled={!storage[StorageKeys.TAB_LRU_ENABLED]}
							color="secondary"
							InputProps={{
								inputProps: {
									max: 255,
									min: 0,
								},
							}}
						/>
					}
					label={lruSizeLabel}
				/>
			</FormControl>
		</FormOption>
	)
}
