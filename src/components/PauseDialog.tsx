import React, { useLayoutEffect, useRef } from 'react';
import type { SelectChangeEvent } from '@mui/material';
import { Button, Grid, MenuItem, Select, Typography } from '@mui/material';
import { useState } from 'react';
import { useStorage as _useStorage } from '@plasmohq/storage/hook';
import { usePort as _usePort } from '@plasmohq/messaging/hook';
import { Ports, StorageKeys } from '~enums';

export default function PausedDialog({
	matchingFilters,
	useStorage = _useStorage,
	usePort = _usePort,
}) {
	const productivityPort = usePort(Ports.PRODUCTIVITY);
	const [exemptions, setExemptions] = useStorage<{ [key: string]: string }>(
		StorageKeys.PRODUCTIVITY_SUSPEND_EXEMPTIONS,
		{},
	);
	const [unlockMinutes, setUnlockMinutes] = useState('15');
	const [current, setCurrent] = useState<HTMLElement>(null);
	const ref = useRef<HTMLElement>();

	const handleUnlockTimeChange = (event: SelectChangeEvent) => {
		setUnlockMinutes(event.target.value as string);
	};

	const unlockClicked = () => {
		const end =
			new Date().getTime() + Number.parseInt(unlockMinutes) * 60 * 1000;
		const newExemptions = {};
		matchingFilters.forEach((filter) => {
			newExemptions[filter] = end;
		});
		setExemptions({ ...exemptions, ...newExemptions });
	};

	const beProductiveClicked = () => {
		console.log('clicked', productivityPort);
		productivityPort.send({ message: 'test' });
	};

	useLayoutEffect(() => {
		setCurrent(ref.current);
	});

	return (
		<>
			<Typography gutterBottom padding={'16px 0'}>
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
						onClick={beProductiveClicked}
					>
						be productive
					</Button>
				</Grid>
				<Grid item>
					<Button
						onClick={unlockClicked}
						color="info"
						variant="outlined"
						endIcon={<>🔓</>}
					>
						unlock
					</Button>
				</Grid>
				<Grid item>
					<Typography>for</Typography>
				</Grid>
				<Grid item width={'87px'} height={'100%'}>
					<Select
						variant="filled"
						color="info"
						labelId="unlock-time-select-label"
						id="unlock-time-select"
						value={unlockMinutes}
						label="Time"
						autoWidth={false}
						onChange={handleUnlockTimeChange}
						className="unlock-container"
						ref={ref}
						MenuProps={{
							container: current,
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
