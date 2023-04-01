import React from 'react';
import { FormControlLabel } from '@mui/material';
import { FormOption } from './FormOption';
import _useOptions from '../hooks/useOptions';
import PersistedInput from './PersistedInput';
import LabelWithHint from './LabelWithHint';

export function StorageBlock({ useOptions = _useOptions }) {
	const { options } = useOptions();
	const tabStorageEnabled =
		options['auto-prune'] ||
		(options['tab-lru-destination'] === 'close' &&
			options['tab-lru-enabled']);
	const bookmarkHint =
		"if you're afraid of losing your tabs forever, prune can store them in your bookmarks before closing";
	const bookmarkLabel = 'bookmark closed tabs under';

	return (
		<FormOption>
			<FormControlLabel
				control={
					<PersistedInput
						component="checkbox"
						storageKey="auto-prune-bookmark"
						disabled={!tabStorageEnabled}
					/>
				}
				label={
					<LabelWithHint hint={bookmarkHint} label={bookmarkLabel} />
				}
				disabled={!tabStorageEnabled}
			/>
			<FormControlLabel
				control={
					<PersistedInput
						component="textfield"
						hiddenLabel
						size="small"
						placeholder="pruned"
						variant="filled"
						color="secondary"
						fullWidth={false}
						storageKey="auto-prune-bookmark-name"
						disabled={
							!options['auto-prune-bookmark'] ||
							!tabStorageEnabled
						}
					/>
				}
				label=""
			/>
		</FormOption>
	);
}
