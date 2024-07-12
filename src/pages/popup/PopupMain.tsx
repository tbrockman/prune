import React, { useRef } from 'react';
import { FormGroup, Grid, Link, Typography } from '@mui/material';
import TipForm from '../../components/TipForm';
import { PruneHeader } from '../../components/PruneHeader';
import { DeduplicateBlock } from '~components/DeduplicateBlock';
import { GroupTabsBlock } from '~components/GroupTabsBlock';
import { RemoveTabsBlock } from '~components/RemoveTabsBlock';
import { LRUBlock } from '~components/LRUBlock';
import { BookmarkStorageBlock } from '~components/BookmarkStorageBlock';
import _useConfig from '~hooks/useConfig';
import type { useConfigType } from '~hooks/useConfig';
import { Features } from '~config';
import { AdvancedSettingsBlock } from '~components/AdvancedSettingsBlock';
// import StorageAreaBlock from '~components/StorageAreaBlock';

type OptionsProps = {
	useConfig?: () => useConfigType;
};

const OptionsSection = ({ useConfig = _useConfig }: OptionsProps) => {
	const { config } = useConfig();

	return (
		<>
			<DeduplicateBlock />
			{/* Disabled for now, finish later: {config.featureSupported(Features.SyncStorage) && <StorageAreaBlock />} */}
			{config.featureSupported(Features.TabGroups) && <GroupTabsBlock />}
			<RemoveTabsBlock />
			<LRUBlock />
			{config.featureSupported(Features.Bookmarks) && <BookmarkStorageBlock />}
			<AdvancedSettingsBlock />
		</>
	);
};

export function PopupMain() {
	const ref = useRef<HTMLFormElement>();
	const optionsTitle = chrome.i18n.getMessage('optionsTitle');
	const aboutTitle = chrome.i18n.getMessage('aboutTitle');
	const aboutTextStart = chrome.i18n.getMessage('aboutTextStart');
	const aboutTextEnd = chrome.i18n.getMessage('aboutTextEnd');

	return (
		<Grid width="100%">
			<PruneHeader />
			<Typography className="section-title">{optionsTitle}</Typography>
			<FormGroup ref={ref} className="form-group-section options-form-group">
				<OptionsSection />
			</FormGroup>
			<Typography component="h1" className="section-title">
				{aboutTitle}
			</Typography>
			<FormGroup className="form-group-section">
				<Typography marginTop={'8px'} marginBottom={'16px'} maxWidth={'64ch'}>
					<Link href='https://github.com/tbrockman/prune' underline='hover' rel="noopener" target="_blank">prune</Link> {aboutTextStart}{' '}
					<Link href="https://theo.lol/" rel="noopener" underline='hover' target="_blank">
						@tbrockman
					</Link>{' '}
					{aboutTextEnd}
				</Typography>
				<TipForm />
			</FormGroup>
		</Grid>
	);
}
