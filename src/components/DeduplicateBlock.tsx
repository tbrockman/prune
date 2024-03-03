import React from 'react';
import { FormControlLabel } from '@mui/material';
import { FormOption } from '../components/FormOption';
import PersistedInput from '../components/PersistedInput';
import LabelWithHint from '../components/LabelWithHint';
import { StorageKeys } from '~enums';

import './DeduplicateBlock.css'
import useOptions from '~hooks/useOptions';

export function DeduplicateBlock() {
	const { options } = useOptions();
	const dedupEnabled = options[StorageKeys.AUTO_DEDUPLICATE];
	const dedupMergeEnabled = options[StorageKeys.AUTO_DEDUPLICATE_MERGE];
	const dedupHint =
		'when turned on, if you try to navigate to a website you already have open, prune will undo the navigation and show you the original tab instead (unless it was new tab window, in which case we close it for you)';
	const dedupLable = 'focus existing tabs instead of opening new ones ♻️';
	const closeDuplicateLabel = 'close duplicates when navigating to existing tabs 🗑️';
	const closeDuplicateHint = 'if you were navigating from "abc.com" to "xyz.com" in one tab, and "xyz.com" was already open in another, "abc.com" would be closed, leaving only one "xyz.com" tab'

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
						hint={dedupHint}
						label={dedupLable}
						tooltipProps={{ placement: 'top' }}
					/>
				}
			>
			</FormControlLabel>
			<FormControlLabel
				className={`sub-checkbox ${dedupMergeEnabled && 'is-checked'}`}
				disabled={!dedupEnabled}
				control={
					<PersistedInput
						component="checkbox"
						storageKey={StorageKeys.AUTO_DEDUPLICATE_MERGE}
					/>
				}
				label={
					<LabelWithHint
						hint={closeDuplicateHint}
						label={closeDuplicateLabel}
						tooltipProps={{ placement: 'top' }}
					/>
				} />
		</FormOption>
	);
}
