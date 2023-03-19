import React from 'react';
import {
	Breadcrumbs,
	FormControl,
	FormControlLabel,
	FormGroup,
	Grid,
	Link,
	MenuItem,
	Typography,
} from '@mui/material';
import './Main.css';
import TipForm from '../components/TipForm';
import { FormOption } from '../components/FormOption';
import _useOptions from '../hooks/useOptions';
import PersistedInput from '../components/PersistedInput';
import LabelWithHint from '../components/LabelWithHint';
import { ReactComponent as PruneLogo } from '../assets/prune-banner.svg';
import LinkSection from '../components/LinkSection';
import ProductivityBlock from '../components/ProductivityBlock';
import { Page, useStore } from '../hooks/useStore';
import ProductivitySettingsPage from './ProductivitySettings';

function DeduplicateBlock() {
	const dedupHint =
		'when turned on, if you try to navigate to a website you already have open, prune will just show you the original tab instead';
	const label = 'show existing tabs instead of opening duplicates  ♻️';
	const text = `${dedupHint}`;

	return (
		<FormOption>
			<FormControlLabel
				control={
					<PersistedInput
						component="checkbox"
						storageKey="auto-deduplicate"
					/>
				}
				label={
					<LabelWithHint
						hint={text}
						label={label}
						tooltipProps={{ placement: 'top' }}
					/>
				}
			/>
		</FormOption>
	);
}

function GroupTabsBlock({ useOptions = _useOptions }) {
	const { options } = useOptions();

	const hideLabel = 'hide tabs after';
	const hideHint =
		"you can choose to tuck away your neglected tabs until you're ready to see them again";
	const groupHint =
		"if the group doesn't already exist, it will be created for you";
	const groupLabel = 'days in a group named';

	return (
		<FormOption>
			<FormControlLabel
				control={
					<PersistedInput
						component="checkbox"
						storageKey="auto-group"
					/>
				}
				label={<LabelWithHint hint={hideHint} label={hideLabel} />}
			/>
			<FormControlLabel
				control={
					<PersistedInput
						component="textfield"
						storageKey="auto-group-threshold"
						hiddenLabel
						size="small"
						variant="filled"
						type="number"
						color="secondary"
						InputProps={{
							inputProps: {
								max: 100,
								min: 0,
							},
						}}
						disabled={!options['auto-group']}
						value={options['auto-group-threshold']}
					/>
				}
				label={<LabelWithHint hint={groupHint} label={groupLabel} />}
			/>
			<FormControlLabel
				control={
					<PersistedInput
						component="textfield"
						storageKey="auto-group-name"
						hiddenLabel
						size="small"
						variant="filled"
						color="secondary"
						disabled={!options['auto-group']}
						value={options['auto-group-name']}
					/>
				}
				label=""
			/>
		</FormOption>
	);
}

function RemoveTabsBlock({ useOptions = _useOptions }) {
	const { options } = useOptions();

	const closeTabsHint =
		"prune can also clean up any pages you haven't looked at in awhile. don't worry, you won't miss them";
	const closeTabsLabel = 'close old tabs after';

	return (
		<FormOption>
			<FormControlLabel
				control={
					<PersistedInput
						component="checkbox"
						storageKey="auto-prune"
					/>
				}
				label={
					<LabelWithHint
						hint={closeTabsHint}
						label={closeTabsLabel}
					/>
				}
			/>
			<FormControlLabel
				control={
					<PersistedInput
						component="textfield"
						hiddenLabel
						size="small"
						variant="filled"
						type="number"
						color="secondary"
						storageKey="prune-threshold"
						disabled={!options['auto-prune']}
						InputProps={{
							inputProps: {
								max: 1024,
								min: 0,
							},
						}}
					/>
				}
				label="days"
			/>
		</FormOption>
	);
}

function LRUBlock({ useOptions = _useOptions }) {
	const { options } = useOptions();

	const lruTabsHint =
		'you can let prune group or close your oldest tabs once you go over your limit';
	const lruTabsLabel = 'least recently used tabs once';

	return (
		<FormOption className="lru-options">
			<FormControl className="lru-options-control">
				<FormControlLabel
					control={
						<>
							<PersistedInput
								component="checkbox"
								storageKey="tab-lru-enabled"
							/>
							<PersistedInput
								component="select"
								storageKey="tab-lru-destination"
								disabled={!options['tab-lru-enabled']}
							>
								<MenuItem value={'group'}>group</MenuItem>
								<MenuItem value={'close'}>close</MenuItem>
							</PersistedInput>
						</>
					}
					label={
						<LabelWithHint
							hint={lruTabsHint}
							label={lruTabsLabel}
						/>
					}
					disabled={!options['tab-lru-enabled']}
				/>
				<FormControlLabel
					control={
						<PersistedInput
							component="textfield"
							hiddenLabel
							size="small"
							variant="filled"
							type="number"
							storageKey="tab-lru-size"
							disabled={!options['tab-lru-enabled']}
							color="secondary"
							InputProps={{
								inputProps: {
									max: 255,
									min: 0,
								},
							}}
						/>
					}
					label="tabs are open"
				/>
			</FormControl>
		</FormOption>
	);
}

function StorageBlock({ useOptions = _useOptions }) {
	const { options } = useOptions();
	const tabStorageEnabled =
		options['auto-prune'] ||
		(options['tab-lru-destination'] === 'close' &&
			options['tab-lru-enabled']);
	const bookmarkHint =
		"if you're afraid of losing your tabs forever, prune can store them in your bookmarks before closing";
	const bookmarkLabel = 'bookmark closed tabs under';

	return (
		<FormOption>
			<FormControlLabel
				control={
					<PersistedInput
						component="checkbox"
						storageKey="auto-prune-bookmark"
						disabled={!tabStorageEnabled}
					/>
				}
				label={
					<LabelWithHint hint={bookmarkHint} label={bookmarkLabel} />
				}
				disabled={!tabStorageEnabled}
			/>
			<FormControlLabel
				control={
					<PersistedInput
						component="textfield"
						hiddenLabel
						size="small"
						placeholder="pruned"
						variant="filled"
						color="secondary"
						fullWidth={false}
						storageKey="auto-prune-bookmark-name"
						disabled={
							!options['auto-prune-bookmark'] ||
							!tabStorageEnabled
						}
					/>
				}
				label=""
			/>
		</FormOption>
	);
}

function PruneHeader() {
	return (
		<Grid
			xs
			container
			padding="2rem"
			alignItems="center"
			justifyContent="space-between"
		>
			<PruneLogo width="200px" />
			<LinkSection />
		</Grid>
	);
}

const OptionsHomePage = () => {
	return (
		<>
			<ProductivityBlock />
			<DeduplicateBlock />
			<GroupTabsBlock />
			<RemoveTabsBlock />
			<LRUBlock />
			<StorageBlock />
		</>
	);
};

function buildBreadcrumbs(page: Page, setPage: (a: Page) => void) {
	let stack: [Page, string][] = [];
	let hierarchy = {
		[Page.ProductivitySettings]: Page.Home,
		[Page.Home]: null,
	};
	let titles = {
		[Page.ProductivitySettings]: 'productivity',
		[Page.Home]: 'options',
	};
	let node: Page | null = page;

	while (node != null) {
		stack.push([node, titles[node]]);
		node = hierarchy[node];
	}

	return stack.reverse().map(([page, title]) => (
		<Link
			underline="none"
			color="black"
			href={'#' + title}
			onClick={() => setPage(page)}
		>
			{title}
		</Link>
	));
}

export default function Main() {
	const page = useStore((state) => state.page);
	const setPage = useStore((state) => state.setPage);
	let pageComponent;

	if (page == Page.Home) {
		pageComponent = <OptionsHomePage />;
	} else if (page == Page.ProductivitySettings) {
		pageComponent = <ProductivitySettingsPage />;
	}

	return (
		<Grid width="100%">
			<PruneHeader />
			<Breadcrumbs className="section-title">
				{buildBreadcrumbs(page, setPage)}
			</Breadcrumbs>
			<FormGroup className="main-form-group options-form-group">
				{pageComponent}
			</FormGroup>

			<Typography component="h1" className="section-title">
				other stuff
			</Typography>
			<FormGroup className="main-form-group">
				<TipForm />
			</FormGroup>
		</Grid>
	);
}
