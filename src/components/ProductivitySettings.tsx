import React from 'react';
import { Autocomplete, Chip, Grid, TextField } from '@mui/material';
import './ProductivitySettings.css';
import useConfig from '../hooks/useConfig';
import ProductivityBlock from './ProductivityBlock';
import { useStorage } from '@plasmohq/storage/hook';
import { StorageKeys } from '~enums';

export default function ProductivitySettings() {
	const { config } = useConfig();
	const [suspendedDomains, setSuspendedDomains] = useStorage(
		StorageKeys.PRODUCTIVITY_SUSPEND_DOMAINS,
		config.productivity.domains,
	);

	return (
		<Grid container className="productivity-settings" flexDirection={'column'}>
			<ProductivityBlock />
			<Grid>
				<Autocomplete
					value={suspendedDomains}
					onChange={(_, newValue) => {
						setSuspendedDomains(newValue);
					}}
					multiple
					freeSolo
					options={config.productivity?.domains ?? []}
					disableClearable
					filterSelectedOptions
					autoHighlight
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
								{...params}
								variant="outlined"
								placeholder="block unproductive websites ↩"
								inputProps={{
									...params.inputProps,
									style: {
										minWidth: '27ch',
									},
								}}
								autoFocus
							/>
						</>
					)}
				/>
			</Grid>
		</Grid>
	);
}
