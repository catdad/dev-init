/* jshint node: true */

var util = require('util');
var shellton = require('shellton');

module.exports = function gitInit(opts, done) {
    shellton({
        task: 'npm i -D mocha chai istanbul',
        cwd: process.cwd(),
        stdout: process.stdout,
        stderr: process.stderr
    }, function(err, stdout, stderr) {
        done(err);
    });
};
