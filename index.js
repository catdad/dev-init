/* jshint node: true */

var path = require('path');

var async = require('async');
var _ = require('lodash');
var gutil = require('gulp-util');
var hitime = require('hitime');

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

var experimental = [
    'npm',
    'npm-test'
];

module.exports = function index(opts, done) {
    var tasksNames;

    if (opts.tasks && Array.isArray(opts.tasks)) {
        // find the tasks that are included in the array
        tasksNames = _.keys(LIST).filter(function(name) {
            return _.includes(opts.tasks, name);
        });
    } else {
        // run all of them
        tasksNames = module.exports.taskNames;
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
            var timer = new hitime.Timer();

            timer.start(name);

            gutil.log(
                '\'%s\' starting...',
                gutil.colors.cyan(name)
            );

            def.task(opts, function (err) {
                timer.end(name);

                gutil.log(
                    '\'%s\' ended in ' + gutil.colors.magenta('%sms'),
                    gutil.colors.cyan(name),
                    (timer.duration(name) || 0).toFixed(2)
                );

                next(err);
            });
        });

        memo[name] = dependencies;

        return memo;
    }, {});

    async.auto(tasks, done);
};

Object.defineProperties(module.exports, {
    taskNames: {
        configurable: false,
        enumerable: true,
        get: function () {
            return _.difference(_.keys(LIST), experimental);
        }
    },
    additionalNames: {
        configurable: false,
        enumerable: true,
        get: function () {
            return [].concat(experimental);
        }
    }
});
