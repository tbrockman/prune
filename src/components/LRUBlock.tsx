import React from 'react'
import {
	FormControl,
	FormControlLabel,
	MenuItem,
} from '@mui/material'
import { FormOption } from './FormOption'
import _useOptions from '../hooks/useOptions'
import PersistedInput from './PersistedInput'
import LabelWithHint from './LabelWithHint'
import { StorageKeys } from '~enums'
import _useConfig from '~hooks/useConfig'
import { Features } from '~config'

export function LRUBlock({ useOptions = _useOptions, useConfig = _useConfig }) {
	const { options } = useOptions()
	const { config } = useConfig()

	const lruTabsHint =
		'you can let prune group or close your oldest tabs once you go over your limit'
	let lruTabsLabel = 'least recently used tabs once'
	lruTabsLabel = config.featureSupported(Features.TabGroups) ? 'close ' + lruTabsLabel : lruTabsLabel
	const lruOptionsComponent = <PersistedInput
		component="select"
		storageKey={StorageKeys.TAB_LRU_DESTINATION}
		disabled={!options[StorageKeys.TAB_LRU_ENABLED]}
	>
		<MenuItem value={'group'}>group</MenuItem>
		<MenuItem value={'close'}>close</MenuItem>
	</PersistedInput>

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
							{!config.featureSupported(Features.TabGroups) && lruOptionsComponent}
						</>
					}
					label={
						<LabelWithHint
							hint={lruTabsHint}
							label={lruTabsLabel}
						/>
					}
					disabled={!options[StorageKeys.TAB_LRU_ENABLED] && !config.featureSupported(Features.TabGroups)}
				/>
				<FormControlLabel
					control={
						<PersistedInput
							component="textfield"
							hiddenLabel
							size="small"
							variant="filled"
							type="number"
							style={{ width: '8ch' }}
							storageKey={StorageKeys.TAB_LRU_SIZE}
							disabled={!options[StorageKeys.TAB_LRU_ENABLED]}
							color="secondary"
							InputProps={{
								inputProps: {
									max: 255,
									min: 0,
								},
							}}
						/>
					}
					label="tabs are open"
				/>
			</FormControl>
		</FormOption>
	)
}
