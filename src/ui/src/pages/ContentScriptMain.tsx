import React from 'react';
import { Breadcrumbs, FormGroup, Grid, Link } from '@mui/material';
import PausedDialog from '../components/PauseDialog';
import { PruneHeader } from '../components/PruneHeader';

export function ContentScriptMain() {
	return (
		<Grid width="100%">
			<PruneHeader></PruneHeader>
			<Breadcrumbs className="section-title">
				<Link underline="none" color="black">
					{'tab locked 🔒'}
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
