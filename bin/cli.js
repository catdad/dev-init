#!/usr/bin/env node
/* jshint node: true */

var argv = require('yargs').argv;

require('../index.js')(argv, function(err) {
    if (err) {
        console.error(err);
        process.exitCode = 1;
        return;
    }

    console.log('Done!');
});
