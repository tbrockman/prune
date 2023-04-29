import React from 'react';
import { Breadcrumbs, FormGroup, Grid, Link } from '@mui/material';
import PausedDialog from '../components/PauseDialog';
import { PruneHeader } from '../components/PruneHeader';
import { useStorage } from '@plasmohq/storage/hook';
import { StorageKeys } from '~enums';

export function ContentScriptMain({ matchingFilters }) {
	const [exemptions, setExemptions] = useStorage<{ [key: string]: string }>(StorageKeys.PRODUCTIVITY_SUSPEND_EXEMPTIONS, {})

	return (
		<Grid width="620px">
			<PruneHeader></PruneHeader>
			<Breadcrumbs className="section-title">
				<Link underline="none" color="black">
					{'page locked 🔒'}
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
