/* jshint node: true */

var fs = require('fs');

// I'll take my chances with the race condition here
module.exports = function fsExists(path, done) {
    fs.stat(path, function(err) {
        if (err && err.code === 'ENOENT') {
            return done(false);
        } else {
            return done(true);
        }
    });
};
