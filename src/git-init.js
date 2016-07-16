/* jshint node: true */

var shellton = require('shellton');

function logOutput(opts) {
    return function log() {
        if (!opts.silent) {
            console.log.apply(console, arguments);
        }
    };
}

module.exports = function gitInit(opts, done) {
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
};
