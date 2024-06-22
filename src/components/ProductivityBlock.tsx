import React from 'react';
import { Autocomplete, Box, Chip, FormControlLabel, Stack, TextField } from '@mui/material';
import { FormOption } from './FormOption';
import LabelWithHint from './LabelWithHint';
import PersistedInput from './PersistedInput';
import { StorageKeys } from '~enums';
import useConfig from '~hooks/useConfig';
import useOptions from '~hooks/useOptions';
import { useStorage } from '@plasmohq/storage/hook';
import { KeyShortcut } from './KeyShortcut';

export default function ProductivityBlock() {

	const { config } = useConfig();
	const { options } = useOptions();
	const [suspendedDomains, setSuspendedDomains] = useStorage(
		StorageKeys.PRODUCTIVITY_SUSPEND_DOMAINS,
		config.productivity.domains,
	);
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
								<KeyShortcut modifiers={['alt', 'shift']} keys={['d']}></KeyShortcut>
							</Stack>}
						tooltipProps={{ placement: 'top' }}
					/>
				}
			/>
			<Autocomplete
				value={suspendedDomains}
				onChange={(_, newValue, reason) => {

					if (reason === 'blur') {
						return;
					}
					setSuspendedDomains(newValue);
				}}
				multiple
				freeSolo
				fullWidth
				options={config.productivity?.domains ?? []}
				disableClearable
				filterSelectedOptions
				autoHighlight
				disabled={!options['productivity-mode-enabled']}
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
