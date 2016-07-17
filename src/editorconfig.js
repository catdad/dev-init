/* jshint node: true */
/* global __base */

var path = require('path');
var ec = require('editorconfig-parser');
var _ = require('lodash');

var mergeFile = require(path.posix.join(__base, 'util', 'merge-file.js'));

function merge(existing, source) {
    var eData;
    var sData;

    try {
        eData = ec.parse(existing);
        sData = ec.parse(source);
    } catch(err) {
        // avoid overwriting the existing file,
        // even though it is wrong
        return existing;
    }

    var merged = _.merge(eData, sData);

    return ec.serialize(merged);
}

module.exports = function bracketsFile(opts, done) {
    mergeFile({
        source: path.resolve(__base, 'fixtures/editorconfig'),
        dest: path.resolve('.', '.editorconfig'),
        argv: opts,
        mergeFunction: merge
    }, done);
};
