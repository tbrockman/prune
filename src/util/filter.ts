export function getMatchingFilters(host, filters: string[]): string[] {
	console.debug('trying to match filters on host', host, filters);
	return filters.filter((f) => {
		const regex = new RegExp('^(?:www\.)?' + f);
		return host.match(regex);
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
