/* jshint node: true */

var util = require('util');
var child = require('child_process');

//var shellton = require('shellton');

function spawn(cmd, args, callback) {
    var child = require('child_process').spawn(cmd, args, {
        cwd: process.cwd(),
        stdio: 'inherit'
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
//    shellton.exec({
//        task: 'npm init',
//        cwd: process.cwd(),
//        stdin: process.stdin,
//        stdout: process.stdout,
//        stderr: process.stderr
//    }, function(err, stdout, stderr) {
//        done(err);
//    });

    var npm = /^win[0-9]/.test(process.platform) ? 'npm.cmd' : 'npm';
    spawn(npm, ['init', '--yes'], done);
};
