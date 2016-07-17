#!/usr/bin/env node
/* jshint node: true */

var chalk = require('chalk');

var argv = require('yargs')
    .describe('force', 'Force all operations.')
    .alias('force', 'f')
    .describe('safe', 'Do not modify existing files in any way.')
    .help('help')
    .alias('help', 'h')
    .argv;

// force and safe are opposites... you can't use both togehter
if (argv.safe && argv.force) {
    console.error(chalk.red('cannot use both force and safe'));
    process.exit(1);
}

require('../index.js')(argv, function(err) {
    // write new line
    console.log();

    if (err) {
        console.error(err);
        process.exitCode = 1;
        return;
    }

    console.log(chalk.bold.green('Done!'));
});
