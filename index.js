/* jshint node: true */

var path = require('path');

var async = require('async');

global.__base = path.resolve(__dirname);

var list = {
    git: require('./src/init.js'),
    npm: require('./src/npm-init.js'),
    brackets: require('./src/brackets.js'),
    editorconfig: require('./src/editorconfig.js'),
    gitignore: require('./src/gitignore.js'),
    gitattributes: require('./src/gitattributes.js'),
    readme: require('./src/readme.js'),
};

module.exports = function index(opts, done) {
    // keep the list in order
    var tasks = [
        list.git,
        list.brackets,
        list.editorconfig,
        list.gitignore,
        list.gitattributes,
        list.readme
    ].map(function(mod) {
        return function callModule(next) {
            return mod(opts, next);
        };
    });

    async.series(tasks, done);
};
