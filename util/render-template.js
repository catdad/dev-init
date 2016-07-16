/* jshint node: true */

var _ = require('lodash');

function render(str, data) {
    // to be responsible, save the default tempalte
    // settings in lodash
    var settings = _.clone(_.templateSettings);
    _.templateSettings.interpolate = /{{([\s\S]+?)}}/g;

    var rendered = _.template(str)(data);

    // restore the default settings
    _.templateSettings = settings;

    return rendered;
}

module.exports = render;
