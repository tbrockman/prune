import React from 'react';
import { Autocomplete, Box, Chip, FormControlLabel, Stack, TextField } from '@mui/material';
import { FormOption } from './FormOption';
import LabelWithHint from './LabelWithHint';
import PersistedInput from './PersistedInput';
import { StorageKeys } from '~enums';
import useConfig from '~hooks/useConfig';
import { KeyShortcut } from './KeyShortcut';
import { useSyncStorage } from '~hooks/useStorage';

export default function ProductivityBlock() {

	const { config } = useConfig();
	const {
		[StorageKeys.PRODUCTIVITY_SUSPEND_DOMAINS]: suspendedDomains,
		[StorageKeys.PRODUCTIVITY_MODE_ENABLED]: productivityModeEnabled,
	} = useSyncStorage([
		StorageKeys.PRODUCTIVITY_SUSPEND_DOMAINS,
		StorageKeys.PRODUCTIVITY_MODE_ENABLED
	]);
	const productivityModeLabel = chrome.i18n.getMessage('productivityModeLabel');
	const productivityModeHint = chrome.i18n.getMessage('productivityModeHint');

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
						hint={productivityModeHint}
						label={
							<Stack direction="row" spacing={1}>
								<Box>{productivityModeLabel}</Box>
								<KeyShortcut commandName='toggle-productivity-mode' />
							</Stack>}
						tooltipProps={{ placement: 'top' }}
					/>
				}
			/>
			<Autocomplete
				value={suspendedDomains as string[]}
				onChange={(_, newValue, reason) => {

					if (reason === 'blur') {
						return;
					}
					chrome.storage.sync.set({ [StorageKeys.PRODUCTIVITY_SUSPEND_DOMAINS]: newValue });
				}}
				multiple
				freeSolo
				options={config.productivity?.domains ?? []}
				disableClearable
				filterSelectedOptions
				autoHighlight
				disabled={!productivityModeEnabled}
				getOptionLabel={(option) => option}
				defaultValue={[suspendedDomains ? suspendedDomains[0] : 'youtube']}
				renderTags={(value: string[], getTagProps) =>
					value.map((option: string, index: number) => (
						<Chip
							variant="outlined"
							label={option}
							{...getTagProps({ index })}
						/>
					))
				}
				renderInput={(params) => (
					<>
						<TextField
							variant="filled"
							placeholder="block unproductive websites ↩"
							{...params}
							inputProps={{
								...params.inputProps,
								style: {
									minWidth: '31ch'
								},
							}}
						/>
					</>
				)}
			/>
		</FormOption>
	);
}
