/* jshint node: true */
/* global __base */

var path = require('path');

var renderFile = require(path.posix.join(__base, 'util', 'renderFile.js'));

module.exports = function bracketsFile(opts, done) {
    renderFile(
        path.resolve(__base, 'fixtures/gitignore'),
        path.resolve('.', '.gitignore'),
        {},
        done
    );
};
