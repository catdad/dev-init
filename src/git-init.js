/* jshint node: true */
/* global __base */

var path = require('path');
var util = require('util');

var shellton = require('shellton');

var fsExists = require(path.posix.join(__base, 'util', 'fs-exists.js'));

function logOutput(opts) {
    return function log() {
        if (!opts.silent) {
            var content = util.format.apply(util, arguments);
            console.log(content.trim());
        }
    };
}

function executeInit(opts, done) {
    var log = logOutput(opts);

    shellton({
        task: 'git init',
        cwd: process.cwd()
    }, function(err, stdout, stderr) {
        if (err) {
            log(stderr);
            return done(err);
        }

        log(stdout);
        done();
    });
}

module.exports = function gitInit(opts, done) {
    fsExists(path.resolve('.', '.git'), function(exists) {
        if (exists && !opts.force) {
            done();
        } else {
            executeInit(opts, done);
        }
    });
};
