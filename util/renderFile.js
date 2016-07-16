/* jshint node: true */

var fs = require('fs');
var path = require('path');

var async = require('async');
var chalk = require('chalk');

var render = require('./render-template.js');

var ENOOVERWRITE = new Error('will not overwrite file');
ENOOVERWRITE.code = 'ENOOVERWRITE';

// I'll take my chances with the race condition here
function fileExists(file, done) {
    fs.stat(file, function(err) {
        if (err && err.code === 'ENOENT') {
            return done(false);
        } else {
            return done(true);
        }
    });
}

module.exports = function renderFile(opts, done) {
    var source = opts.source;
    var dest = opts.dest;
    var data = opts.data || {};
    var argv = opts.argv;

    async.waterfall([
        function checkExists(next) {
            if (argv.force) {
                return next();
            }

            fileExists(dest, function(exists) {
                if (exists) {
                    next(ENOOVERWRITE);
                } else {
                    next();
                }
            });
        },
        function readFile(next) {
            fs.readFile(source, next);
        },
        function renderFile(content, next) {
            next(undefined, render(content, data));
        },
        function writeFile(content, next) {
            fs.writeFile(dest, content, next);
        }
    ], function(err) {
        if (err && err === ENOOVERWRITE) {
            console.log(chalk.red(err.message, path.basename(dest)));
            return done();
        }

        done(err);
    });
};
