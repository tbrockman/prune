import { removeTrailingSlashes } from "./string";

export function getMatchingFilters(url: string, filters: string[]): string[] {
	url = removeTrailingSlashes(url);
	return filters.filter((f) => {
		// strip protocol and any trailing slashes
		f = removeTrailingSlashes(f.split('://').pop());
		const regex = new RegExp(`^(?:www\\.)?${f}`);
		// attempt to match the url as either a regex or a string
		return url.match(regex) || url.indexOf(f) > -1;
	});
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

export function urlToPartialHref(url: URL) {
	return `${url.host}${url.pathname}${url.search}${url.hash}`;
}
