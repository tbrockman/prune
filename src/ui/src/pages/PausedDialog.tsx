import { Grid, Typography } from '@mui/material';
import './Main.css';
import './PausedDialog.css';

export default function PausedTab() {
	return (
		<Grid
			className="paused-tab-group main-form-group"
			width="100%"
			maxWidth={'620px'}
		>
			<Grid
				padding="2rem"
				alignItems="center"
				justifyContent="space-between"
			>
				<Typography variant="h2">tab paused</Typography>
			</Grid>
		</Grid>
	);
}
