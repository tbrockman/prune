import React from 'react';
import { Autocomplete, Box, Chip, FormControlLabel, Stack, TextField } from '@mui/material';
import { FormOption } from './FormOption';
import LabelWithHint from './LabelWithHint';
import PersistedInput from './PersistedInput';
import { SyncStorageKeys } from '~enums';
import useConfig from '~hooks/useConfig';
import { KeyShortcut } from './KeyShortcut';
import { useSyncStorage } from '~hooks/useStorage';
import { setSyncStorage } from '~util/storage';
import { useTabs } from '~hooks/useTabs';
import { getSuggestedUrls } from '~util/url';

export default function ProductivityBlock() {
	const tabs = useTabs();
	const { config } = useConfig();
	const {
		[SyncStorageKeys.PRODUCTIVITY_SUSPEND_DOMAINS]: suspendedDomains,
		[SyncStorageKeys.PRODUCTIVITY_MODE_ENABLED]: productivityModeEnabled,
		[SyncStorageKeys.PRODUCTIVITY_SUSPEND_EXEMPTIONS]: exemptions,
	} = useSyncStorage([
		SyncStorageKeys.PRODUCTIVITY_SUSPEND_DOMAINS,
		SyncStorageKeys.PRODUCTIVITY_MODE_ENABLED,
		SyncStorageKeys.PRODUCTIVITY_SUSPEND_EXEMPTIONS
	]);
	const productivityModeLabel = chrome.i18n.getMessage('productivityModeLabel');
	const productivityModeHint = chrome.i18n.getMessage('productivityModeHint');
	const productivityModeInputPlaceholder = chrome.i18n.getMessage('productivityModeInputPlaceholder');
	const now = new Date().getTime();

	return (
		<FormOption>
			<FormControlLabel
				control={
					<PersistedInput
						component="checkbox"
						storageKey={SyncStorageKeys.PRODUCTIVITY_MODE_ENABLED}
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
					setSyncStorage({ [SyncStorageKeys.PRODUCTIVITY_SUSPEND_DOMAINS]: newValue });
				}}
				multiple
				freeSolo
				options={getSuggestedUrls(tabs) ?? config.productivity?.domains ?? []}
				disableClearable
				filterSelectedOptions
				autoHighlight
				disabled={!productivityModeEnabled}
				getOptionLabel={(option) => option}
				defaultValue={[suspendedDomains ? suspendedDomains[0] : 'youtube']}
				renderTags={(value: string[], getTagProps) =>
					value.map((option: string, index: number) => {

						let label: string | JSX.Element = option;
						if (exemptions.hasOwnProperty(option) && exemptions[option] > now) {
							label = (<><span>🔓</span><span>{label}</span></>)
						}

						return <Chip
							variant="outlined"
							label={label}
							{...getTagProps({ index })}
							key={option + index}
						/>
					})
				}
				renderInput={(params) => (
					<>
						<TextField
							variant="filled"
							placeholder={productivityModeInputPlaceholder}
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
