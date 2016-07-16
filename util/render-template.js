/* jshint node: true */

var _ = require('lodash');

function render(str, data) {
    var settings = _.clone(_.templateSettings);
    _.templateSettings.interpolate = /{{([\s\S]+?)}}/g;

    var rendered = _.template(str)(data);

    _.templateSettings = settings;

    return rendered;
}

module.exports = render;
