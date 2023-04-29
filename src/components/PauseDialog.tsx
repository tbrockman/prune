import React, { useLayoutEffect, useRef } from 'react';
import type { SelectChangeEvent } from '@mui/material';
import { Button, Grid, MenuItem, Select, Typography } from '@mui/material';
import { useState } from 'react';

export default function PausedDialog() {
	const [unlockMinutes, setUnlockMinutes] = useState('15');
	const [current, setCurrent] = useState<HTMLElement>(null);
	const ref = useRef<HTMLElement>();

	const handleUnlockTimeChange = (event: SelectChangeEvent) => {
		setUnlockMinutes(event.target.value as string)
	}

	useLayoutEffect(() => {
		setCurrent(ref.current)
	})

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
					<Button color="info" variant="outlined" endIcon={<>🔓</>}>
						unlock
					</Button>
				</Grid>
				<Grid item>
					<Typography>for</Typography>
				</Grid>
				<Grid item width={'12ch'} height={'100%'}>
					<Select
						variant='filled'
						color='info'
						labelId="unlock-time-select-label"
						id="unlock-time-select"
						value={unlockMinutes}
						label="Time"
						autoWidth={false}
						onChange={handleUnlockTimeChange}
						className='unlock-container'
						ref={ref}
						MenuProps={{
							container: current
						}}
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
