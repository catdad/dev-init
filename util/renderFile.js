/* jshint node: true */

var fs = require('fs');

var async = require('async');
var _ = require('lodash');

function render(str, data) {
    var settings = _.clone(_.templateSettings);
    _.templateSettings.interpolate = /{{([\s\S]+?)}}/g;
    
    var rendered = _.template(str)(data);
    
    _.templateSettings = settings;
    
    return rendered;
}

module.exports = function renderFile(source, dest, data, done) {
    async.waterfall([
        function readFile(next) {
            fs.readFile(source, next);
        },
        function renderFile(content, next) {
            next(undefined, render(content, data));
        },
        function writeFile(content, next) {
            fs.writeFile(dest, content, next);
        }
    ], done);
};
