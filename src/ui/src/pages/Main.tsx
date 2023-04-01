import React from 'react';
import { Breadcrumbs, FormGroup, Grid, Link, Typography } from '@mui/material';
import './Main.css';
import TipForm from '../components/TipForm';
import ProductivityBlock from '../components/ProductivityBlock';
import { Page, useStore } from '../hooks/useStore';
import ProductivitySettingsPage from './ProductivitySettings';
import { PruneHeader } from '../components/PruneHeader';
import { StorageBlock } from '../components/StorageBlock';
import { LRUBlock } from '../components/LRUBlock';
import { RemoveTabsBlock } from '../components/RemoveTabsBlock';
import { GroupTabsBlock } from '../components/GroupTabsBlock';
import { DeduplicateBlock } from '../components/DeduplicateBlock';

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
