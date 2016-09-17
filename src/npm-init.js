/* jshint node: true */

var util = require('util');
var child = require('child_process');

function spawn(cmd, args, callback) {
    var child = require('child_process').spawn(cmd, args, {
        cwd: process.cwd(),
        stdio: ['ignore', 'ignore', 'inherit']
    });

    child.on('exit', function(code) {
        if (code !== 0) {
            return callback(new Error(util.format('process exited with code \'%s\'', code)));
        }

        callback();
    });

    child.on('error', function(err) {
        callback(err);
    });
}

module.exports = function gitInit(opts, done) {
    var npm = /^win[0-9]/.test(process.platform) ? 'npm.cmd' : 'npm';
    spawn(npm, ['init', '--yes'], done);
};
