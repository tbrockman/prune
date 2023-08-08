import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import { useStorage as _useStorage } from '@plasmohq/storage/hook';
import LockedApp from '~apps/Locked';
// IMPORTANT: all css must currently be specified in Locked.css
// as traditional css-import functionality seems to be unavailable in content-scripts
import cssText from 'data-text:~/contents/Locked.css';

import type { PlasmoCSConfig } from 'plasmo';
import _useConfig from '~hooks/useConfig';
import { StorageKeys } from '~enums';
import {
	getExemptFilters as getExemptFilters,
	getMatchingFilters,
	urlToPartialHref,
} from '~util/filter';
import { useState } from 'react';

const styleElement = document.createElement('style');
styleElement.textContent = cssText;
const styleCache = createCache({
	key: 'plasmo-mui-cache',
	prepend: true,
	container: styleElement,
});

export const getStyle = () => styleElement;

export const config: PlasmoCSConfig = {
	matches: ['<all_urls>'],
	all_frames: true,
};

export default function Locked({
	useConfig = _useConfig,
	useStorage = _useStorage,
}) {
	const [update, forceUpdate] = useState(0);
	const { config } = useConfig();
	const [productivityModeEnabled] = useStorage(
		StorageKeys.PRODUCTIVITY_MODE_ENABLED,
	);
	const [domainFilters] = useStorage(
		StorageKeys.PRODUCTIVITY_SUSPEND_DOMAINS,
		config.productivity?.domains,
	);
	const [exemptions] = useStorage<{ [key: string]: string }>(
		StorageKeys.PRODUCTIVITY_SUSPEND_EXEMPTIONS,
		{},
	);
	const partialHref = urlToPartialHref(new URL(window.location.href));
	console.debug('exemptions', exemptions);
	console.debug('matching on', partialHref);
	console.debug('domain filters', domainFilters);
	// Get an array of matched filters, this is probably always length 1 but let's make
	// sure we're handling power users that use regexes properly
	const matchingFilters = getMatchingFilters(partialHref, domainFilters);
	console.debug('matching filters for url', matchingFilters);
	// In order to be exempt, we have to have created an exemption for all matching filters
	const exemptFilters = getExemptFilters(matchingFilters, exemptions);
	const isExempt = exemptFilters.length === matchingFilters.length;

	console.debug('window is exempt', isExempt);

	if (productivityModeEnabled && matchingFilters.length > 0) {

		if (!isExempt) {
			return (
				<CacheProvider value={styleCache}>
					<LockedApp matchingFilters={matchingFilters} />
				</CacheProvider>
			);
		}
		else {
			// For each exempt filter, set a timeout to force updating (rendering the lock screen) when the exemption expires
			exemptFilters.forEach((filter) => {
				setTimeout(() => {
					forceUpdate(update+1)
				}, Number.parseInt(exemptions[filter]) - new Date().getTime() + 1000);
			});
		}
	}
	return <></>;
}
