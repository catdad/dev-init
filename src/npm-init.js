/* jshint node: true */

var util = require('util');

//var shellton = require('shellton');

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

    var child = require('child_process').spawn(npm, ['init', '--yes'], {
        cwd: process.cwd(),
        stdio: 'inherit'
    });

    child.on('exit', function(code) {
        if (code !== 0) {
            return done(new Error(util.format('process exited with code \'%s\'', code)));
        }

        done();
    });

    child.on('error', function(err) {
        done(err);
    });
};
