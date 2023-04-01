import React from 'react';
import { Grid } from '@mui/material';
import { ReactComponent as PruneLogo } from '../assets/prune-banner.svg';
import LinkSection from './LinkSection';

class PruneHeaderProps {
	showLinkSection?: Boolean;
}

export function PruneHeader({ showLinkSection = true }: PruneHeaderProps) {
	return (
		<Grid
			xs
			container
			padding="2rem"
			alignItems="center"
			justifyContent="space-between"
		>
			<PruneLogo width="200px" />
			{showLinkSection && <LinkSection />}
		</Grid>
	);
}
