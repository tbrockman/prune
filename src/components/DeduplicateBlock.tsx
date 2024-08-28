import React from 'react';
import { Box, FormControlLabel, Stack } from '@mui/material';
import { FormOption } from '~components/FormOption';
import PersistedInput from '~components/PersistedInput';
import LabelWithHint from '~components/LabelWithHint';
import { SyncStorageKeys } from '~enums';
import { config, Features } from '~util/config';

import './DeduplicateBlock.css'
import { KeyShortcut } from '~components/KeyShortcut';
import { useSyncStorage } from '~hooks/useStorage';

export function DeduplicateBlock() {
	const storage = useSyncStorage([
		SyncStorageKeys['AUTO_DEDUPLICATE'],
		SyncStorageKeys['AUTO_DEDUPLICATE_CLOSE'],
		SyncStorageKeys['DEDUPLICATE_ACROSS_CONTAINERS'],
	])
	// IDEA: type-safe i18n message keys
	const dedupHint = chrome.i18n.getMessage('deduplicateHint');
	const dedupLabel = chrome.i18n.getMessage('deduplicateLabel');
	const closeDuplicateLabel = chrome.i18n.getMessage('closeDuplicateLabel');
	const closeDuplicateHint = chrome.i18n.getMessage('closeDuplicateHint', ['abc.com', 'xyz.com']);
	const deduplicateAcrossContainersLabel = chrome.i18n.getMessage('deduplicateAcrossContainersLabel');
	const deduplicateAcrossContainersHint = chrome.i18n.getMessage('deduplicateAcrossContainersHint');
	const containersSupported = config.featureSupported(Features.Containers);

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
			{containersSupported && <FormControlLabel
				className={`sub-checkbox ${storage[SyncStorageKeys.DEDUPLICATE_ACROSS_CONTAINERS] && 'is-checked'}`}
				disabled={!storage[SyncStorageKeys.AUTO_DEDUPLICATE]}
				control={
					<PersistedInput
						component="checkbox"
						storageKey={SyncStorageKeys.DEDUPLICATE_ACROSS_CONTAINERS}
					/>
				}
				label={
					<LabelWithHint
						hint={deduplicateAcrossContainersHint}
						label={deduplicateAcrossContainersLabel}
						tooltipProps={{ placement: 'top' }}
					/>
				} />}
		</FormOption >
	);
}
