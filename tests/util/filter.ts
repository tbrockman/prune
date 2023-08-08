import { getMatchingFilters, getExemptFilters, urlToPartialHref } from '../../src/util/filter'
import { assert } from 'chai'

describe('filter utils', () => {

    describe('getMatchingFilters', () => {

        it('should return an empty array if no filters match', () => {
            const host = 'google.com'
            const filters = ['facebook', 'twitter', 'not\.google']
            const result = getMatchingFilters(host, filters)
            assert.equal(result.length, 0)
        })

        it('should return an array of matching filters', () => {
            const host = 'google.com'
            const filters = ['facebook', 'twitter', 'google']
            const result = getMatchingFilters(host, filters)
            assert.equal(result.length, 1)
        })

        it('should return an array of matching filters (when one is a regex)', () => {
            const host = 'google.com'
            const filters = ['facebook', 'twitter', '.*gle']
            const result = getMatchingFilters(host, filters)
            assert.equal(result.length, 1)
        })

        it('should return an array of matching filters (when multiple are matching)', () => {
            const host = 'google.com'
            const filters = ['facebook', 'goog', '.*gle']
            const result = getMatchingFilters(host, filters)
            assert.equal(result.length, 2)
        })

        it('should match www subdomains', () => {
            const host = 'www.google.com'
            const filters = ['facebook', 'twitter', 'google']
            const result = getMatchingFilters(host, filters)
            assert.equal(result.length, 1)
        })
    })

    describe('getExemptFilters', () => {
        it('should return an array of exempt filters', () => {
            const filters = ['facebook', 'twitter', 'google']
            const exemptions = {
                'facebook': new Date().getTime() + 10000
            }
            const result = getExemptFilters(filters, exemptions)
            assert.equal(result.length, 1)
        })
        it('should return an empty array if no filters exempt (empty exemption)', () => {
            const filters = ['facebook', 'twitter', 'google']
            const exemptions = {}
            const result = getExemptFilters(filters, exemptions)
            assert.equal(result.length, 0)
        })

        it('should return an empty array if no filters exempt (expired exemption)', () => {
            const filters = ['facebook', 'twitter', 'google']
            const exemptions = {
                'facebook': new Date().getTime() - 10000
            }
            const result = getExemptFilters(filters, exemptions)
            assert.equal(result.length, 0)
        })
    })

    describe('urlToPartialHref', () => {
        it('should return the host, path, search, and hash of a url', () => {
            const url = new URL('https://www.google.com/search?q=hello#world')
            const result = urlToPartialHref(url)
            assert.equal(result, 'www.google.com/search?q=hello#world')
        })
    })
})