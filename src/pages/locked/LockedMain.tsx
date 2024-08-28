import React, { useEffect } from 'react';
import { Breadcrumbs, FormGroup, Grid, Link } from '@mui/material';
import PausedDialog from '~components/PauseDialog';
import { PruneHeader } from '~components/PruneHeader';
import { useSyncStorage, useStorage } from '~hooks/useStorage';
import { SyncStorageKeys } from '~enums';

export function LockedMain() {
	const {
		[SyncStorageKeys.PRODUCTIVITY_SUSPEND_EXEMPTIONS]: filters,
	} =
		useSyncStorage([
			SyncStorageKeys.PRODUCTIVITY_SUSPEND_EXEMPTIONS
		])
	// Retrieve `PRODUCTIVITY_MODE_ENABLED` with default of `true` to prevent infinite redirect
	// if rendering before the value has been retrieved from storage
	const {
		[SyncStorageKeys.PRODUCTIVITY_MODE_ENABLED]: productivityModeEnabled,
	} = useStorage({ [SyncStorageKeys.PRODUCTIVITY_MODE_ENABLED]: true }, 'sync');


	const params = new URLSearchParams(window.location.search);
	const matchingFilters = params.get('matched_by')?.split(',') || [];
	const url = params.get('url');
	const pageLockedTitle = chrome.i18n.getMessage('pageLockedTitle');
	document.title = '🔒 | ' + url

	useEffect(() => {
		const tabExempt = !productivityModeEnabled || matchingFilters.every((filter) => {
			const expiration = filters[filter];
			return expiration && expiration > new Date().getTime();
		});

		if (tabExempt) {
			window.location.href = url;
		}
	}, [filters, productivityModeEnabled])

	return (
		<Grid width="620px">
			<PruneHeader></PruneHeader>
			<Breadcrumbs className="section-title">
				<Link underline="none" color="black">
					{pageLockedTitle}
				</Link>
			</Breadcrumbs>
			<FormGroup className="form-group-section">
				<Grid container>
					<PausedDialog
						matchingFilters={matchingFilters}
						url={url}
					></PausedDialog>
				</Grid>
			</FormGroup>
		</Grid>
	);
}
