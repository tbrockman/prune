import React from 'react';
import { FormControl, FormControlLabel, MenuItem } from '@mui/material';
import { FormOption } from './FormOption';
import _useOptions from '../hooks/useOptions';
import PersistedInput from './PersistedInput';
import LabelWithHint from './LabelWithHint';

export function LRUBlock({ useOptions = _useOptions }) {
	const { options } = useOptions();

	const lruTabsHint =
		'you can let prune group or close your oldest tabs once you go over your limit';
	const lruTabsLabel = 'least recently used tabs once';

	return (
		<FormOption className="lru-options">
			<FormControl className="lru-options-control">
				<FormControlLabel
					control={
						<>
							<PersistedInput
								component="checkbox"
								storageKey="tab-lru-enabled"
							/>
							<PersistedInput
								component="select"
								storageKey="tab-lru-destination"
								disabled={!options['tab-lru-enabled']}
							>
								<MenuItem value={'group'}>group</MenuItem>
								<MenuItem value={'close'}>close</MenuItem>
							</PersistedInput>
						</>
					}
					label={
						<LabelWithHint
							hint={lruTabsHint}
							label={lruTabsLabel}
						/>
					}
					disabled={!options['tab-lru-enabled']}
				/>
				<FormControlLabel
					control={
						<PersistedInput
							component="textfield"
							hiddenLabel
							size="small"
							variant="filled"
							type="number"
							storageKey="tab-lru-size"
							disabled={!options['tab-lru-enabled']}
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
	);
}
