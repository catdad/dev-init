/* jshint node: true */
/* global __base */

var path = require('path');

var renderFile = require(path.posix.join(__base, 'util', 'renderFile.js'));

var DEFAULT_LINTER = ['JSHint'];

module.exports = function bracketsFile(opts, done) {
    renderFile(
        path.resolve(__base, 'fixtures/brackets.json'),
        path.resolve('.', '.brackets.json'),
        {
            linter: JSON.stringify(opts.linter || DEFAULT_LINTER)
        },
        done
    );
};
