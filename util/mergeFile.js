/* jshint node: true, esversion: 6 */

var fs = require('fs');
var path = require('path');

var async = require('async');
var _ = require('lodash');

function trim(v) {
    if (v.trim) {
        return v.trim();
    }

    return v;
}

function unique(arr) {
    console.log(arr);
    return _.uniq(arr);
}

module.exports = function renderFile(opts, done) {
    var source = opts.source;
    var dest = opts.dest;
    var data = opts.data || {};
    var argv = opts.argv;

    async.waterfall([
        function readExisting(next) {
            fs.readFile(dest, 'utf8', function(err, file) {
                if (err && err.code === 'ENOENT') {
                    return next();
                } else if (err) {
                    return next(err);
                }

                next(undefined, file.split('\n').map(trim));
            });
        },
        function readFile(arr, next) {
            fs.readFile(source, 'utf8', function(err, file) {
                if (err) {
                    return next(err);
                }

                next(undefined, arr.concat(file.split('\n').map(trim)));
            });
        },
        function renderFile(arr, next) {
            next(undefined, unique(arr).join('\n'));
        },
        function writeFile(content, next) {
            console.log(content);
            fs.writeFile(dest, content, next);
        }
    ], done);
};
