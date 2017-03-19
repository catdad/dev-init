/* jshint node: true */

var path = require('path');

var ec = require('editorconfig-parser');
var _ = require('lodash');
var root = require('rootrequire');

var mergeFile = require(path.posix.join(root, 'util', 'merge-file.js'));
var validString = require(path.posix.join(root, 'util', 'valid-string.js'));

var DEFAULT_SPACES = 4;

function merge(existing, source) {
    existing = validString(existing);
    source = validString(source);

    // let these throw, the merge helper will
    // catch errors and handle them correctly
    var eData = ec.parse(existing);
    var sData = ec.parse(source);

    var merged = _.merge(eData, sData);

    return ec.serialize(merged);
}

function getSpaces(opts) {
    return (opts.spaces == +opts.spaces) ?
        opts.spaces :
        DEFAULT_SPACES;
}

module.exports = function bracketsFile(opts, done) {
    mergeFile({
        source: path.resolve(root, 'fixtures/editorconfig'),
        dest: path.resolve('.', '.editorconfig'),
        data: {
            spaces: getSpaces(opts)
        },
        argv: opts,
        mergeFunction: merge
    }, done);
};
