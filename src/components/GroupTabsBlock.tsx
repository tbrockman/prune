import React from 'react';
import { FormControlLabel } from '@mui/material';
import { FormOption } from './FormOption';
import _useOptions from '../hooks/useOptions';
import PersistedInput from './PersistedInput';
import LabelWithHint from './LabelWithHint';
import { StorageKeys } from '~enums';

export function GroupTabsBlock({ useOptions = _useOptions }) {
	const { options } = useOptions();

	const hideLabel = 'hide tabs after';
	const hideHint =
		"you can choose to tuck away your neglected tabs until you're ready to see them again";
	const groupHint =
		"if the group doesn't already exist, it will be created for you";
	const groupLabel = 'days in a group named';

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
						hiddenLabel
						size="small"
						variant="filled"
						type="number"
						color="secondary"
						InputProps={{
							inputProps: {
								max: 100,
								min: 0,
							},
						}}
						disabled={!options[StorageKeys.AUTO_GROUP]}
						value={options[StorageKeys.AUTO_GROUP_THRESHOLD]}
					/>
				}
				label={<LabelWithHint hint={groupHint} label={groupLabel} />}
			/>
			<FormControlLabel
				control={
					<PersistedInput
						component="textfield"
						storageKey={StorageKeys.AUTO_GROUP_NAME}
						hiddenLabel
						size="small"
						variant="filled"
						color="secondary"
						disabled={!options[StorageKeys.AUTO_GROUP]}
						value={options[StorageKeys.AUTO_GROUP_NAME]}
					/>
				}
				label=""
			/>
		</FormOption>
	);
}
