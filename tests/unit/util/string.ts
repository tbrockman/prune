import { assert } from "chai";
import { removeTrailingSlashes } from "~util/string";

describe('string utils', () => {
    describe('removeTrailingSlashes', () => {
        it('should remove trailing slashes', () => {
            const result = removeTrailingSlashes('http://google.com/');
            assert.equal(result, 'http://google.com');
        });
        it('should remove multiple trailing slashes', () => {
            const result = removeTrailingSlashes('http://google.com///');
            assert.equal(result, 'http://google.com');
        });
        it('should not remove anything if no trailing slashes', () => {
            const result = removeTrailingSlashes('http://google.com');
            assert.equal(result, 'http://google.com');
        });
    });
});