/* jshint node: true */

var util = require('util');
var fs = require('fs');
var path = require('path');

var shellton = require('shellton');
var async = require('async');
var mkdirp = require('mkdirp');
var es = require('event-stream');
var _ = require('lodash');

module.exports = function gitInit(opts, done) {

    async.series([
        function installStuff(next) {
            shellton({
                task: 'npm i -D mocha chai istanbul',
                cwd: process.cwd(),
                stdout: process.stdout,
                stderr: process.stderr
            }, function(err, stdout, stderr) {
                next(err);
            });

            next();
        },
        function addPackageScripts(next) {
            var pkgPath = path.resolve(process.cwd(), 'package.json');

            fs.createReadStream(pkgPath).pipe(es.wait(function (err, body) {
                if (err) {
                    return next(err);
                }
            })).pipe(es.map(function (data, cb) {
                var jsonData;

                try {
                    jsonData = JSON.parse(data.toString());
                } catch (e) {
                    return cb(e);
                }

                var scripts = jsonData.scripts || {};

                jsonData.scripts = _.merge({
                    test: 'mocha',
                    coverage: 'istanbul cover --dir coverage node_modules/mocha/bin/_mocha'
                }, scripts);

                console.log(jsonData);

                cb(null, JSON.stringify(jsonData, null, 2));
            })).pipe(es.wait(function (err, body) {
                // We can't just stream the data into an fs.createWriteStream :(
                fs.writeFile(pkgPath, body, next);
            }));
        }
    ], done);

    // TODO:
    // - do not install already available modules
    // - make 'test' folder
};
