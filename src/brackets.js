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
    var eData;
    var sData;

    existing = validateStr(existing);
    source = validateStr(source);

    try {
        eData = JSON.parse(existing);
        sData = JSON.parse(source);
    } catch(err) {
        console.log('merge error', err, source);
        // avoid overwriting the existing file
        // if we cannot parse it
        return existing;
    }

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
