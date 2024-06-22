import React from 'react';
import { Box, FormControlLabel, Stack } from '@mui/material';
import { FormOption } from '../components/FormOption';
import PersistedInput from '../components/PersistedInput';
import LabelWithHint from '../components/LabelWithHint';
import { StorageKeys } from '~enums';

import './DeduplicateBlock.css'
import useOptions from '~hooks/useOptions';
import { KeyShortcut } from './KeyShortcut';

export function DeduplicateBlock() {
	const { options } = useOptions();
	const dedupEnabled = options[StorageKeys.AUTO_DEDUPLICATE];
	const dedupMergeEnabled = options[StorageKeys.AUTO_DEDUPLICATE_CLOSE];
	// IDEA: type-safe i18n message keys
	const dedupHint = chrome.i18n.getMessage('deduplicateHint');
	const dedupLabel = chrome.i18n.getMessage('deduplicateLabel');
	const closeDuplicateLabel = chrome.i18n.getMessage('closeDuplicateLabel');
	const closeDuplicateHint = chrome.i18n.getMessage('closeDuplicateHint');

	return (
		<FormOption className='form-option-with-subgroup'>
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
						label={
							<Stack direction="row" spacing={1}>
								<Box>{dedupLabel}</Box>
								<KeyShortcut modifiers={['alt', 'shift']} keys={['w']}></KeyShortcut>
							</Stack>}
						tooltipProps={{ placement: 'top' }}
					/>
				}
			>
			</FormControlLabel >
			<FormControlLabel
				className={`sub-checkbox ${dedupMergeEnabled && 'is-checked'}`}
				disabled={!dedupEnabled}
				control={
					<PersistedInput
						component="checkbox"
						storageKey={StorageKeys.AUTO_DEDUPLICATE_CLOSE}
					/>
				}
				label={
					<LabelWithHint
						hint={closeDuplicateHint}
						label={closeDuplicateLabel}
						tooltipProps={{ placement: 'top' }}
					/>
				} />
		</FormOption >
	);
}
