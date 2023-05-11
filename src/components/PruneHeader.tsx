import { Grid } from '@mui/material';
import React from 'react';
import PruneLogo from 'react:~assets/prune-banner.svg';

import LinkSection from './LinkSection';

class PruneHeaderProps {
	showLinkSection?: Boolean;
}

export function PruneHeader({ showLinkSection = true }: PruneHeaderProps) {
	return (
		<Grid
			container
			padding="32px"
			paddingTop={'16px'}
			paddingBottom={'16px'}
			alignItems="center"
			justifyContent="space-between"
		>
			<PruneLogo width="200px" />
			{showLinkSection && <LinkSection />}
		</Grid>
	);
}
