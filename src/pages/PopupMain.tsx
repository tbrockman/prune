import React, { useRef } from 'react';
import { FormGroup, Grid, Link, Typography } from '@mui/material';
import TipForm from '../components/TipForm';
import { PruneHeader } from '../components/PruneHeader';
import { DeduplicateBlock } from '~components/DeduplicateBlock';
import { GroupTabsBlock } from '~components/GroupTabsBlock';
import { RemoveTabsBlock } from '~components/RemoveTabsBlock';
import { LRUBlock } from '~components/LRUBlock';
import { StorageBlock } from '~components/StorageBlock';
import _useConfig from '~hooks/useConfig';
import type { useConfigType } from '~hooks/useConfig';
import { Features } from '~config';

type OptionsHomePageProps = {
	useConfig?: () => useConfigType;
};

const OptionsHomePage = ({ useConfig = _useConfig }: OptionsHomePageProps) => {
	const { config } = useConfig();

	return (
		<>
			<DeduplicateBlock />
			{config.featureSupported(Features.TabGroups) && <GroupTabsBlock />}
			<RemoveTabsBlock />
			<LRUBlock />
			<StorageBlock />
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
				<OptionsHomePage />
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
