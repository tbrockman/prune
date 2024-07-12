import {
	getMatchingFilters,
	getExemptFilters,
} from '../../../src/util/filter';
import { assert } from 'chai';

describe('filter utils', () => {
	describe('getMatchingFilters', () => {
		it('should return an empty array if no filters match', () => {
			const url = new URL('https://google.com');
			const filters = ['facebook', 'twitter', 'not.google'];
			const result = getMatchingFilters(url, filters);
			assert.equal(result.length, 0);
		});

		it('should return an array of matching filters', () => {
			const url = new URL('https://google.com');
			const filters = ['facebook', 'twitter', 'google'];
			const result = getMatchingFilters(url, filters);
			assert.equal(result.length, 1);
		});

		it('should return an array of matching filters (when one is a regex)', () => {
			const url = new URL('https://google.com');
			const filters = ['facebook', 'twitter', '.*gle'];
			const result = getMatchingFilters(url, filters);
			assert.equal(result.length, 1);
		});

		it('should return an array of matching filters (when multiple are matching)', () => {
			const url = new URL('https://google.com');
			const filters = ['facebook', 'goog', '.*gle'];
			const result = getMatchingFilters(url, filters);
			assert.equal(result.length, 2);
		});

		it('should match www subdomains', () => {
			const url = new URL('https://www.google.com');
			const filters = ['facebook', 'twitter', 'google'];
			const result = getMatchingFilters(url, filters);
			assert.equal(result.length, 1);
		});

		it('should match subdomains', () => {
			const url = new URL('https://mail.google.com');
			const filters = ['facebook', 'twitter', 'google'];
			const result = getMatchingFilters(url, filters);
			assert.equal(result.length, 1);
		})

		it('should match subdomains (multiple)', () => {
			const url = new URL('https://dev.mail.google.com');
			const filters = ['google', 'mail.google'];
			const result = getMatchingFilters(url, filters);
			assert.equal(result.length, 2);
		})

		it('shouldnt match filters with additional subdomains', () => {
			const url = new URL('https://mail.google.com');
			const filters = ['dev.mail.google.com'];
			const result = getMatchingFilters(url, filters);
			assert.equal(result.length, 0);
		})

		// TODO: change getMatchingFilters to match subdomains more specifically
		// 
		// it('shouldnt match insufficiently specific subdomains', () => {
		// 	const url = new URL('https://mail.google.com');
		// 	const filters = ['mail'];
		// 	const result = getMatchingFilters(url, filters);
		// 	assert.equal(result.length, 0);
		// })

		it('should allow matching on strings (which contain regex chars)', () => {
			const url = new URL('https://www.themisbar.com/learners/index.php?service=course');
			const filters = ['https://www.themisbar.com/learners/index.php?service=course'];
			const result = getMatchingFilters(url, filters);
			assert.equal(result.length, 1);
		})

		it('should match filters with or without www (for non-regex)', () => {
			const url = new URL('https://www.google.com/search?q=facebook');
			const filters = ['google.com/search?q=facebook', 'www.google.com/search?q=facebook'];
			const result = getMatchingFilters(url, filters);
			assert.equal(result.length, 2);
		})

		it('shouldnt match filters with www when url doesnt have www', () => {
			const url = new URL('https://google.com');
			const filters = ['www.google.com'];
			const result = getMatchingFilters(url, filters);
			assert.equal(result.length, 0);
		})

		it('shouldnt match filters which match query params only', () => {
			const url = new URL('https://www.google.com/search?q=facebook');
			const filters = ['facebook'];
			const result = getMatchingFilters(url, filters);
			assert.equal(result.length, 0);
		})
	});

	describe('getExemptFilters', () => {
		it('should return an array of exempt filters', () => {
			const filters = ['facebook', 'twitter', 'google'];
			const exemptions = {
				facebook: new Date().getTime() + 10000,
			};
			const result = getExemptFilters(filters, exemptions);
			assert.equal(result.length, 1);
		});
		it('should return an empty array if no filters exempt (empty exemption)', () => {
			const filters = ['facebook', 'twitter', 'google'];
			const exemptions = {};
			const result = getExemptFilters(filters, exemptions);
			assert.equal(result.length, 0);
		});

		it('should return an empty array if no filters exempt (expired exemption)', () => {
			const filters = ['facebook', 'twitter', 'google'];
			const exemptions = {
				facebook: new Date().getTime() - 10000,
			};
			const result = getExemptFilters(filters, exemptions);
			assert.equal(result.length, 0);
		});
	});
});
