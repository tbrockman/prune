import React, { useRef } from 'react';
import { FormGroup, Grid, Link, Typography } from '@mui/material';
import TipForm from '../components/TipForm';
import { Page, useStore } from '../hooks/useStore';
import { PruneHeader } from '../components/PruneHeader';
import { DeduplicateBlock } from '~components/DeduplicateBlock';
import { GroupTabsBlock } from '~components/GroupTabsBlock';
import { RemoveTabsBlock } from '~components/RemoveTabsBlock';
import { LRUBlock } from '~components/LRUBlock';
import { StorageBlock } from '~components/StorageBlock';

type OptionsHomePageProps = {
	isFirefox: boolean;
};

const OptionsHomePage = ({ isFirefox }: OptionsHomePageProps) => {
	return (
		<>
			<DeduplicateBlock />
			{!isFirefox && <GroupTabsBlock />}
			<RemoveTabsBlock />
			<LRUBlock isFirefox={isFirefox} />
			<StorageBlock isFirefox={isFirefox} />
		</>
	);
};

export function PopupMain() {
	const ref = useRef<HTMLFormElement>();

	return (
		<Grid width="100%">
			<PruneHeader />
			<Typography className="section-title">options 🔧</Typography>
			<FormGroup ref={ref} className="main-form-group options-form-group">
				<OptionsHomePage isFirefox={process.env.PLASMO_BROWSER == 'firefox'} />
			</FormGroup>
			<Typography component="h1" className="section-title">
				about 📝
			</Typography>
			<FormGroup className="main-form-group">
				<Typography marginTop={'8px'} marginBottom={'16px'}>
					<b>prune</b> is a free, open-source extension made by{' '}
					<Link href="https://theo.lol/resume" target="_blank">
						@tbrockman
					</Link>{' '}
					to help make your browsing less cluttered and more productive.
				</Typography>
				<TipForm />
			</FormGroup>
		</Grid>
	);
}
