import { Grid } from '@mui/material';
import React from 'react';
import PruneLogo from 'react:~assets/prune-banner.svg';

import LinkSection from './LinkSection';

import './PruneHeader.css';

class PruneHeaderProps {
	showLinkSection?: Boolean;
}

export function PruneHeader({ showLinkSection = true }: PruneHeaderProps) {
	return (
		<Grid
			className="prune-header"
			container
			padding="32px"
			paddingTop={'16px'}
			paddingBottom={'16px'}
			alignItems="center"
			justifyContent="space-between"
		>
			<PruneLogo />
			{showLinkSection && <LinkSection />}
		</Grid>
	);
}
