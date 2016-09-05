/* jshint node: true */

var util = require('util');
var fs = require('fs');
var path = require('path');

var shellton = require('shellton');
var async = require('async');
var mkdirp = require('mkdirp');
var ns = require('node-stream');
var _ = require('lodash');

var MODULES = ['mocha', 'chai', 'istanbul'];

module.exports = function gitInit(opts, done) {
    var modules = [].concat(MODULES);
    var pkgPath = path.resolve(process.cwd(), 'package.json');

    async.series([
        function checkExistingModules(next) {
            ns.wait.json(fs.createReadStream(pkgPath), function (err, body) {
                if (err && err.code === 'ENOENT') {
                    // package.json doesn't exist, so we can move on
                    return next();
                }

                if (err) {
                    return next(err);
                }

                var devDependencies = _.keys(body.devDependencies || {});
                modules = _.difference(modules, devDependencies);

                next();
            });
        },
        function installStuff(next) {
            if (!modules.length) {
                return next();
            }

            shellton({
                task: 'npm i -D ' + modules.join(' '),
                cwd: process.cwd(),
                stdout: process.stdout,
                stderr: process.stderr
            }, function(err, stdout, stderr) {
                next(err);
            });
        },
        function addPackageScripts(next) {
            ns.wait.json(fs.createReadStream(pkgPath), function (err, body) {

                if (err && err.code === 'ENOENT') {
                    body = {};
                } else if (err) {
                    return next(err);
                }

                var testScript = _.get(body, 'scripts.test', null);

                if (testScript && /echo .* \&\& exit 1/.test(testScript)) {
                    delete body.scripts.test;
                }

                body.scripts = _.merge({
                    test: 'mocha',
                    coverage: 'istanbul cover --dir coverage node_modules/mocha/bin/_mocha'
                }, body.scripts || {});

                // We can't just stream the data into an fs.createWriteStream :(
                fs.writeFile(pkgPath, JSON.stringify(body, null, 2) + '\n', next);
            });
        },
        function makeTestFolder(next) {
            mkdirp(path.resolve(process.cwd(), 'test'), next);
        }
    ], done);
};
