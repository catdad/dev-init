/* jshint node: true */
/* global __base */

var path = require('path');
var _ = require('lodash');

var mergeFile = require(path.posix.join(__base, 'util', 'merge-file.js'));

var DEFAULT_LINTER = ['JSHint'];

function customizer(objValue, srcValue) {
    if (_.isArray(objValue)) {
        return _.uniq(objValue.concat(srcValue));
    }
}

function validateStr(str) {
    if (!str || typeof str !== 'string' || str.trim() === '') {
        return '{}';
    }

    return str;
}

function mergeJson(existing, source) {
    existing = validateStr(existing);
    source = validateStr(source);

    // let these throw, the merge helper will
    // catch errors and handle them correctly
    var eData = JSON.parse(existing);
    var sData = JSON.parse(source);

    var merged = _.mergeWith(sData, eData, customizer);

    return JSON.stringify(merged, undefined, 4);
}

module.exports = function bracketsFile(opts, done) {
    mergeFile({
        source: path.resolve(__base, 'fixtures/brackets.json'),
        dest: path.resolve('.', '.brackets.json'),
        data: {
            linter: JSON.stringify(opts.linter || DEFAULT_LINTER)
        },
        argv: opts,
        mergeFunction: mergeJson
    }, done);
};
