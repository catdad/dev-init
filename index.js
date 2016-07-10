/* jshint node: true */

var path = require('path');

var async = require('async');
var argv = require('yargs').argv;

global.__base = path.resolve(__dirname);

var list = [
    require('./src/init.js'),
    require('./src/brackets.js'),
    require('./src/gitignore.js'),
    require('./src/gitattributes.js'),
].map(function(mod) {
    return function callModule(next) {
        return mod(argv, next);
    };
});

async.series(list, function(err) {
    if (err) {
        console.error(err);
        process.exitCode = 1;
        return;
    }
    
    console.log('Done!');
});
