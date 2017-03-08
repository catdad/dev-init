/* jshint node: true */

var path = require('path');
var root = require('rootrequire');

var renderFile = require(path.posix.join(root, 'util', 'render-file.js'));

module.exports = function bracketsFile(opts, done) {
    renderFile({
        source: path.resolve(root, 'fixtures/README.md'),
        dest: path.resolve('.', 'README.md'),
        argv: opts
    }, done);
};
