import React from 'react';
import { FormControlLabel } from '@mui/material';
import { FormOption } from '../components/FormOption';
import PersistedInput from '../components/PersistedInput';
import LabelWithHint from '../components/LabelWithHint';
import { StorageKeys } from '~enums';

export function DeduplicateBlock() {
	const dedupHint =
		'when turned on, if you try to navigate to a website you already have open, prune will just show you the original tab instead';
	const label = 'show existing tabs instead of opening duplicates  ♻️';
	const text = `${dedupHint}`;

	return (
		<FormOption>
			<FormControlLabel
				control={
					<PersistedInput
						component="checkbox"
						storageKey={StorageKeys.AUTO_DEDUPLICATE}
					/>
				}
				label={
					<LabelWithHint
						hint={text}
						label={label}
						tooltipProps={{ placement: 'top' }}
					/>
				}
			/>
		</FormOption>
	);
}
