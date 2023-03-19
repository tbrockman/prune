import React from 'react';
import { Autocomplete, Chip, Grid, IconButton, TextField } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Page, useStore } from '../hooks/useStore';
import useOptions from '../hooks/useOptions';
import './ProductivitySettings.css';

export default function ProductivitySettingsPage() {
	const { options, setOptionAsync } = useOptions();
	const suspendedDomains = options['productivity-suspend-domains'];
	const { setPage } = useStore();

	const backButtonClicked = () => {
		setPage(Page.Home);
	};

	return (
		<Grid className="productivity-settings">
			<Autocomplete
				value={suspendedDomains}
				onChange={(_, newValue) => {
					setOptionAsync('productivity-suspend-domains', newValue);
				}}
				multiple
				freeSolo
				options={suspendedDomains}
				disableClearable
				autoSelect
				filterSelectedOptions
				autoHighlight
				getOptionLabel={(option) => option}
				defaultValue={[suspendedDomains[0]]}
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
			<IconButton aria-label="settings" onClick={backButtonClicked}>
				<CloseIcon />
			</IconButton>
		</Grid>
	);
}
