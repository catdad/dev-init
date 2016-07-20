#!/usr/bin/env node
/* jshint node: true */

var chalk = require('chalk');

var init = require('../index.js');
var menu = require('./menu.js');

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

if (argv._ && argv._[0] === 'select') {
    menu(init.taskNames, function(err, tasks) {
        if (err && err === 'cancel') {
            process.exitCode = 0;
            return;
        }

        if (err) {
            return handleError(err);
        }

        if (tasks.length) {
            runInit(tasks);
        } else {
            runInit();
        }
    });
} else {
    runInit();
}

function handleError(err) {
    console.error(err);
    process.exitCode = 1;
}

function runInit(tasks) {
    if (Array.isArray(tasks)) {
        argv.tasks = tasks;
    }

    init(argv, function(err) {
        // write new line
        console.log();

        if (err) {
            return handleError(err);
        }

        console.log(chalk.bold.green('Done!'));
    });
}

