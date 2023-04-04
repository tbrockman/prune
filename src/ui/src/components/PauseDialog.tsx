import { Button, Grid, Typography } from '@mui/material';

export default function PausedDialog() {
	return (
		<>
			<Typography gutterBottom padding={'1rem 0'}>
				This website is paused right now because you're in{' '}
				<b>productivity mode</b>. You can make a temporary exception if
				you <i>really</i> want to, but you should probably just go back
				to being productive.
			</Typography>
			<Grid container spacing={1}>
				<Grid item>
					<Button
						color="secondary"
						variant="contained"
						startIcon={<>👨‍💻</>}
					>
						be productive
					</Button>
				</Grid>
				<Grid item>
					<Button color="info" variant="outlined" startIcon={<>⏰</>}>
						snooze
					</Button>
				</Grid>
			</Grid>
		</>
	);
}
