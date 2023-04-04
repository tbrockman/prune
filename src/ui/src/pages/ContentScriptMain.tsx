import React from 'react';
import { Breadcrumbs, FormGroup, Grid, Link } from '@mui/material';
import { PruneHeader } from '../components/PruneHeader';
import PausedDialog from '../components/PauseDialog';

export function ContentScriptMain() {
	return (
		<Grid width="100%">
			<PruneHeader />
			<Breadcrumbs className="section-title">
				<Link underline="none" color="black">
					{'tab paused'}
				</Link>
			</Breadcrumbs>
			<FormGroup className="main-form-group options-form-group">
				<Grid container>
					<PausedDialog></PausedDialog>
				</Grid>
			</FormGroup>
		</Grid>
	);
}
