import React from 'react';
import {
	Autocomplete,
	Chip,
	Grid,
	Link,
	TextField,
	Typography,
} from '@mui/material';
import useOptions from '../hooks/useOptions';
import './ProductivitySettings.css';
import useConfig from '../hooks/useConfig';

export default function ProductivitySettingsPage() {
	const { options, setOptionAsync } = useOptions();
	const { config } = useConfig();
	const suspendedDomains = options['productivity-suspend-domains'];

	return (
		<Grid className="productivity-settings" flexDirection={'column'}>
			<Typography>
				Productivity mode helps you keep yourself accountable for
				staying focused.
			</Typography>
			<Typography gutterBottom>
				{' '}
				Add additional filters below, which you can specify by name or
				by using&nbsp;
				<Link
					underline="hover"
					href="https://en.wikipedia.org/wiki/Regular_expression"
				>
					{'regular expressions'}
				</Link>
				:
			</Typography>
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
						label="Pause the following websites when turned on"
					/>
				)}
			/>
		</Grid>
	);
}
