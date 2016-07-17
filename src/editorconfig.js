/* jshint node: true */
/* global __base */

var path = require('path');
var ec = require('editorconfig-parser');
var _ = require('lodash');

var mergeFile = require(path.posix.join(__base, 'util', 'merge-file.js'));

function merge(existing, source) {
    // let these throw, the merge helper will
    // catch errors and handle them correctly
    var eData = ec.parse(existing);
    var sData = ec.parse(source);

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
