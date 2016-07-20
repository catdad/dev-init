/* jshint node: true, esversion: 6 */

var fs = require('fs');
var path = require('path');

var async = require('async');
var _ = require('lodash');
var chalk = require('chalk');

var render = require('./render-template.js');

module.exports = function renderFile(opts, done) {
    var source = opts.source;
    var dest = opts.dest;
    var data = opts.data || {};
    var argv = opts.argv;

    var filename = path.basename(dest);

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
            if (argv.safe && bucket.existing !== null) {
                console.log(chalk.yellow('will not modify %s in safe mode'), filename);
                return next(undefined, bucket.existing);
            }

            // set to the existing file, in order to avoid overwriting
            // this file if there is a merge error
            var result = bucket.existing;

            if (bucket.existing === bucket.source) {
                // files are the same, no need to merge
                return next(undefined, result);
            }

            try {
                result = mergeFunc(bucket.existing, bucket.source) || bucket.existing;
            } catch(err) {
                console.error(chalk.red(filename, 'merge error:'), err);
            }

            next(undefined, result);
        },
        function writeFile(content, next) {
            fs.writeFile(dest, content, next);
        }
    ], done);
};
