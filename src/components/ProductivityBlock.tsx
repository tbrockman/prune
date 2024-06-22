import React from 'react';
import { FormControlLabel, IconButton, Tooltip } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { FormOption } from './FormOption';
import LabelWithHint from './LabelWithHint';
import PersistedInput from './PersistedInput';
import { useStore, Page } from '../hooks/useStore';
import { StorageKeys } from '~enums';

export default function ProductivityBlock() {

	const hint =
		'helps keep your browsing productive by blocking use of typical time wasting websites.';
	const label = 'turn on productivity mode 👨‍💻';
	const settingsHint = 'change which websites to block.';

	return (
		<FormOption>
			<FormControlLabel
				control={
					<PersistedInput
						component="checkbox"
						storageKey={StorageKeys.PRODUCTIVITY_MODE_ENABLED}
					/>
				}
				label={
					<LabelWithHint
						hint={hint}
						label={label}
						tooltipProps={{ placement: 'top' }}
					/>
				}
			/>
		</FormOption>
	);
}
