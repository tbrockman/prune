import React from 'react';
import { Box, FormControlLabel, Stack } from '@mui/material';
import { FormOption } from '../components/FormOption';
import PersistedInput from '../components/PersistedInput';
import LabelWithHint from '../components/LabelWithHint';
import { SyncStorageKeys } from '~enums';

import './DeduplicateBlock.css'
import { KeyShortcut } from './KeyShortcut';
import { useSyncStorage } from '~hooks/useStorage';

export function DeduplicateBlock() {
	const storage = useSyncStorage([
		SyncStorageKeys['AUTO_DEDUPLICATE'],
		SyncStorageKeys['AUTO_DEDUPLICATE_CLOSE'],
	])
	// IDEA: type-safe i18n message keys
	const dedupHint = chrome.i18n.getMessage('deduplicateHint');
	const dedupLabel = chrome.i18n.getMessage('deduplicateLabel');
	const closeDuplicateLabel = chrome.i18n.getMessage('closeDuplicateLabel');
	const closeDuplicateHint = chrome.i18n.getMessage('closeDuplicateHint', ['abc.com', 'xyz.com']);

	return (
		<FormOption className='form-option-with-subgroup'>
			<FormControlLabel
				control={
					<PersistedInput
						component="checkbox"
						storageKey={SyncStorageKeys['AUTO_DEDUPLICATE']}
					/>
				}
				label={
					<LabelWithHint
						hint={dedupHint}
						label={
							<Stack direction="row" spacing={1}>
								<Box>{dedupLabel}</Box>
								<KeyShortcut commandName={'toggle-deduplicate'}></KeyShortcut>
							</Stack>}
						tooltipProps={{ placement: 'top' }}
					/>
				}
			>
			</FormControlLabel >
			<FormControlLabel
				className={`sub-checkbox ${storage[SyncStorageKeys.AUTO_DEDUPLICATE_CLOSE] && 'is-checked'}`}
				disabled={!storage[SyncStorageKeys.AUTO_DEDUPLICATE]}
				control={
					<PersistedInput
						component="checkbox"
						storageKey={SyncStorageKeys.AUTO_DEDUPLICATE_CLOSE}
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
