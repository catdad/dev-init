/* jshint node: true, esversion: 6 */

var fs = require('fs');
var path = require('path');

var async = require('async');
var _ = require('lodash');

var render = require('./render-template.js');

module.exports = function renderFile(opts, done) {
    var source = opts.source;
    var dest = opts.dest;
    var data = opts.data || {};
    var argv = opts.argv;

    var mergeFunc = opts.mergeFunction;

    async.waterfall([
        function readExisting(next) {
            var bucket = {
                existing: null
            };

            fs.readFile(dest, 'utf8', function(err, file) {
                if (err && err.code === 'ENOENT') {
                    return next(undefined, bucket);
                } else if (err) {
                    return next(err);
                }

                bucket.existing = file;
                next(undefined, bucket);
            });
        },
        function readFile(bucket, next) {
            fs.readFile(source, 'utf8', function(err, file) {
                if (err) {
                    return next(err);
                }

                bucket.source = render(file, data);

                next(undefined, bucket);
            });
        },
        function renderFile(bucket, next) {
            var result = mergeFunc(bucket.existing, bucket.source) || bucket.existing;

            next(undefined, result);
        },
        function writeFile(content, next) {
            fs.writeFile(dest, content, next);
        }
    ], done);
};
