import { removeTrailingSlashes } from "./string";

export function getMatchingFilters(url: URL, filters: string[]): string[] {

	const domains = url.host.split('.');

	return filters.filter((f) => {

		// Match string from top domain to bottom
		for (let i = domains.length; i > 0; i--) {
			const domain = domains.slice(i - 1).join('.');
			// remove trailing slashes from both url and filter
			const stringUrl = removeTrailingSlashes(`${domain}${url.pathname}${url.search}${url.hash}`);
			f = removeTrailingSlashes(f);

			// match with or without protocol
			if (stringUrl.startsWith(f) || (url.protocol + '//' + stringUrl).startsWith(f)) {
				return true;
			}
		}

		// If no match, try matching with regex
		const regex = new RegExp(`^${f}`);
		return url.toString().match(regex);
	})
}

export function getExemptFilters(
	filters: string[],
	exemptions: { [key: string]: any },
) {
	return filters.filter((filter) => {
		const now = new Date().getTime();
		return exemptions.hasOwnProperty(filter) && exemptions[filter] > now;
	});
}
