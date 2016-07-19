/* jshint node: true */
/* global __base */

var path = require('path');
var lines = require('line-merge');

var mergeFile = require(path.posix.join(__base, 'util', 'merge-file.js'));

function validateStr(str) {
    if (!str || typeof str !== 'string' || str.trim() === '') {
        return '';
    }

    return str;
}

// .gitignore is just a list of patterns, so we can actually merge
// all the lines and everything will be fine. I'll still try to
// preserve comments though.
function merge(existing, source) {
    existing = validateStr(existing);
    source = validateStr(source);

    var eData = lines.tokenize(existing);

    console.log(eData);

    throw new Error('do nothing');

    return lines.merge(existing, source);
}

module.exports = function bracketsFile(opts, done) {
    mergeFile({
        source: path.resolve(__base, 'fixtures/gitignore'),
        dest: path.resolve('.', '.gitignore'),
        argv: opts,
        mergeFunction: merge
    }, done);
};
