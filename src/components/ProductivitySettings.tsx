import React from 'react';
import {
	Autocomplete,
	Chip,
	Grid,
	TextField,
	Typography,
} from '@mui/material';
import './ProductivitySettings.css';
import useConfig from '../hooks/useConfig';
import ProductivityBlock from './ProductivityBlock';
import { useStorage } from '@plasmohq/storage/hook';

export default function ProductivitySettings() {
	const { config } = useConfig();
	const [suspendedDomains, setSuspendedDomains] = useStorage('productivity-suspend-domains', config.productivity.domains)

	return (
		<Grid
			container
			className="productivity-settings"
			flexDirection={'column'}
		>
			<ProductivityBlock/>
			<Grid item marginBottom='0.75rem' marginTop='0.5rem'>
				<Typography>
					<b>Productivity mode</b> helps you stay focused by temporarily disabling access to unproductive websites. 
				</Typography>
			</Grid>
			<Grid>
				<Autocomplete
					value={suspendedDomains}
					onChange={(_, newValue) => {
						setSuspendedDomains(newValue)
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
							// eslint-disable-next-line react/jsx-key
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
							helperText="Enter websites to block when you're trying to be productive."
						/>
					)}
				/>
			</Grid>
		</Grid>
	);
}
