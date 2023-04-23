import React from 'react';
import type { SelectChangeEvent } from '@mui/material';
import { Button, Grid, MenuItem, Select, Typography } from '@mui/material';
import { useState } from 'react';
import styleText from "data-text:./PauseDialog.css";
import type { PlasmoGetStyle } from "plasmo"

export default function PausedDialog() {
	const [snoozeMinutes, setSnoozeMinutes] = useState('15');

	const handleSnoozeTimeChange = (event: SelectChangeEvent) => {
		setSnoozeMinutes(event.target.value as string)
	}

	return (
		<>
			<Typography gutterBottom padding={'1rem 0'}>
				This website can't be accessed right now because you're in{' '}
				<b>productivity mode</b>. You can make a temporary exception if
				you <i>really</i> want to, but you should probably just go back
				to being productive. 💁‍♀️
			</Typography>
			<Grid container spacing={1} alignItems={'center'}>
				<Grid item>
					<Button
						color="secondary"
						variant="contained"
						endIcon={<>👨‍💻</>}
					>
						be productive
					</Button>
				</Grid>
				<Grid item>
					<Button color="info" variant="outlined" endIcon={<>⏰</>}>
						snooze
					</Button>
				</Grid>
				<Grid item>
					<Typography>for</Typography>
				</Grid>
				<Grid item width={'10ch'} height={'100%'}>
					<Select
						variant='filled'
						color='info'
						labelId="snooze-time-select-label"
						id="snooze-time-select"
						value={snoozeMinutes}
						label="Time"
						autoWidth={false}
						MenuProps={{
							anchorEl: document.getElementById('plasmo-shadow-container')
						}}
						onChange={handleSnoozeTimeChange}
						className='snooze-container'
					>
						<MenuItem value={15}>15 min</MenuItem>
						<MenuItem value={60}>1 hour</MenuItem>
						<MenuItem value={1440}>1 day</MenuItem>
					</Select>
				</Grid>
			</Grid>
		</>
	);
}
