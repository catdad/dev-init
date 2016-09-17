/* jshint node: true */

var path = require('path');

var async = require('async');
var _ = require('lodash');
var gutil = require('gulp-util');
var hitime = require('hitime');

global.__base = path.resolve(__dirname);

var LIST = {
    git: {
        task: require('./src/git-init.js')
    },
    brackets: {
        task: require('./src/brackets.js'),
        optionalDependencies: ['git']
    },
    editorconfig: {
        task: require('./src/editorconfig.js'),
        optionalDependencies: ['git']
    },
    gitignore: {
        task: require('./src/gitignore.js'),
        optionalDependencies: ['git']
    },
    gitattributes: {
        task: require('./src/gitattributes.js'),
        optionalDependencies: ['git']
    },
    readme: {
        task: require('./src/readme.js'),
        optionalDependencies: ['git']
    },

    npm: {
        task: require('./src/npm-init.js'),
        optionalDependencies: ['git']
    },
    'npm-test': {
        task: require('./src/npm-test.js'),
        dependencies: ['npm']
    }
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

    // add dependencies of any of the selected tasks to
    // the list of tasks to run
    tasksNames = tasksNames.concat(tasksNames.reduce(function (memo, name) {
        if (LIST[name].dependencies) {
            return memo.concat(LIST[name].dependencies);
        }

        return memo;
    }, []));

    // resolve the list of tasks to run and their
    // dependencies
    var tasks = tasksNames.reduce(function(memo, name) {
        var def = LIST[name];

        var dependencies = [];

        if (def.dependencies) {
            dependencies = dependencies.concat(def.dependencies);
        }

        if (def.optionalDependencies) {
            dependencies = dependencies.concat(
                _.intersection(def.optionalDependencies, tasksNames)
            );
        }

        dependencies.push(function () {
            var args = [].slice.call(arguments);
            var next = args.pop();

            var start = hitime();

            gutil.log(
                '\'%s\' starting...',
                gutil.colors.cyan(name)
            );

            def.task(opts, function (err) {

                var end = hitime();

                gutil.log(
                    '\'%s\' ended in %sms',
                    gutil.colors.cyan(name),
                    (end - start).toFixed(2)
                );

                next(err);
            });
        });

        memo[name] = dependencies;

        return memo;
    }, {});

    async.auto(tasks, done);
};

module.exports.taskNames = orderedNames;
module.exports.additionalNames = additionalNames;
