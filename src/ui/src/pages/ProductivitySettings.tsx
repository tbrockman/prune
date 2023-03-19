import React from 'react';
import { Autocomplete, Chip, Grid, TextField } from '@mui/material';
import useOptions from '../hooks/useOptions';
import './ProductivitySettings.css';
import useConfig from '../hooks/useConfig';

export default function ProductivitySettingsPage() {
	const { options, setOptionAsync } = useOptions();
	const { config } = useConfig();
	const suspendedDomains = options['productivity-suspend-domains'];

	return (
		<Grid className="productivity-settings">
			<Autocomplete
				value={suspendedDomains}
				onChange={(_, newValue) => {
					setOptionAsync('productivity-suspend-domains', newValue);
				}}
				multiple
				freeSolo
				options={config.productivity?.domains ?? []}
				disableClearable
				autoSelect
				filterSelectedOptions
				autoHighlight
				getOptionLabel={(option) => option}
				defaultValue={[
					suspendedDomains ? suspendedDomains[0] : 'youtube',
				]}
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
					<TextField
						{...params}
						variant="standard"
						label="Unproductive websites"
					/>
				)}
			/>
		</Grid>
	);
}
