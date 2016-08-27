#!/usr/bin/env node
/* jshint node: true */

var chalk = require('chalk');
var _ = require('lodash');

var init = require('../index.js');
var menu = require('./menu.js');

var yargs = require('yargs');
var argv = yargs
    .describe('force', 'Force all operations.')
    .alias('force', 'f')
    .describe('safe', 'Do not modify existing files in any way.')
    .alias('include', 'i')
    .array('include')
    .default('include', [], 'all tasks')
    .alias('exclude', 'e')
    .array('exclude')
    .default('exclude', [], 'empty list')
    .help('help')
    .alias('help', 'h')
    .alias('version', 'v')
    .version()
    .argv;

// force and safe are opposites... you can't use both togehter
if (argv.safe && argv.force) {
    console.error(chalk.red('cannot use both force and safe'));
    process.exit(1);
}

function handleError(err) {
    console.error(err);
    process.exitCode = 1;
}

function runTasks(tasks) {
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

function routeCommand(command) {
    switch (command) {
        case 'select':
            menu(init.taskNames, function(err, tasks) {
                if (err && err === 'cancel') {
                    process.exitCode = 0;
                    return;
                }

                if (err) {
                    return handleError(err);
                }

                if (tasks.length) {
                    runTasks(tasks);
                } else {
                    runTasks();
                }
            });

            return;
        case 'list':
        case 'ls':
            console.log('Task names:\n\n%s\n', init.taskNames.map(function (v) {
                return '  ' + v;
            }).join('\n'));

            // let's show the help, just for fun
            yargs.showHelp('log');

            return;
    }

    // the default is to run all the things... taking into account
    // include and exclude flags
    var tasks = init.taskNames;

    if (argv.include.length) {
        tasks = _.intersection(tasks, argv.include);
    }

    if (argv.exclude.length) {
        tasks = _.pullAll(tasks, argv.exclude);
    }

    runTasks(tasks);
}

routeCommand((argv._ && argv._[0]) || undefined);
