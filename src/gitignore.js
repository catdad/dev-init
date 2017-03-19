/* jshint node: true */

var path = require('path');
var lines = require('line-merge');
var root = require('rootrequire');

var mergeFile = require(path.posix.join(root, 'util', 'merge-file.js'));
var validString = require(path.posix.join(root, 'util', 'valid-string.js'));

// .gitignore is just a list of patterns, so we can actually merge
// all the lines and everything will be fine. I'll still try to
// preserve comments though.
function merge(existing, source) {
    existing = validString(existing);
    source = validString(source);

    return lines.merge(existing, source);
}

module.exports = function bracketsFile(opts, done) {
    mergeFile({
        source: path.resolve(root, 'fixtures/gitignore'),
        dest: path.resolve('.', '.gitignore'),
        argv: opts,
        mergeFunction: merge
    }, done);
};
