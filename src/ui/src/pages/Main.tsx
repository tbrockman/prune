import React from 'react';
import ProductivityBlock from '../components/ProductivityBlock';
import { StorageBlock } from '../components/StorageBlock';
import { LRUBlock } from '../components/LRUBlock';
import { RemoveTabsBlock } from '../components/RemoveTabsBlock';
import { GroupTabsBlock } from '../components/GroupTabsBlock';
import { DeduplicateBlock } from '../components/DeduplicateBlock';
import { OptionsMain } from './OptionsMain';
import { Context } from '../types';
import './Main.css';
import { ContentScriptMain } from './ContentScriptMain';

export const OptionsHomePage = () => {
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

type MainProps = {
	context: Context;
};

export default function Main({ context }: MainProps) {
	switch (context) {
		case Context.Options:
			return <OptionsMain />;
		case Context.ContentScript:
			return <ContentScriptMain />;
	}
}
