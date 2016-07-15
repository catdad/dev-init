#!/usr/bin/env node
/* jshint node: true */

var chalk = require('chalk');

var argv = require('yargs')
    .describe('force', 'Force all operations.')
    .alias('force', 'f')
    .help('help')
    .alias('help', 'h')
    .argv;



require('../index.js')(argv, function(err) {
    // write new line
    console.log();

    if (err) {
        console.error(err);
        process.exitCode = 1;
        return;
    }

    console.log(chalk.green('Done!'));
});
