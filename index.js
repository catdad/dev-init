/* jshint node: true */

var path = require('path');

var async = require('async');
var _ = require('lodash');

global.__base = path.resolve(__dirname);

var LIST = {
    git: require('./src/git-init.js'),
    brackets: require('./src/brackets.js'),
    editorconfig: require('./src/editorconfig.js'),
    gitignore: require('./src/gitignore.js'),
    gitattributes: require('./src/gitattributes.js'),
    readme: require('./src/readme.js'),

    npm: require('./src/npm-init.js'),
    'npm-test': require('./src/npm-test.js')
};

var orderedNames = [
    'git',
    'brackets',
    'editorconfig',
    'gitignore',
    'gitattributes',
    'readme'
];

var additionalNames = [
    'npm',
    'npm-test'
];

module.exports = function index(opts, done) {
    var tasksNames;

    if (opts.tasks && Array.isArray(opts.tasks)) {
        // find the tasks that are included in the array
        tasksNames = orderedNames.filter(function(name) {
            return _.includes(opts.tasks, name);
        }).concat(additionalNames.filter(function(name) {
            return _.includes(opts.tasks, name);
        }));
    } else {
        // run all of them
        tasksNames = orderedNames;
    }

    // keep the list in order
    var tasks = tasksNames.map(function(name) {
        return function callModule(next) {
            return LIST[name](opts, next);
        };
    });

    async.series(tasks, done);
};

module.exports.taskNames = orderedNames;
module.exports.additionalNames = additionalNames;
