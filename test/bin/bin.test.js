/* jshint node: true, mocha: true */

var util = require('util');
var path = require('path');

var expect = require('chai').expect;
var root = require('rootrequire');
var shellton = require('shellton');
var _ = require('lodash');
var mkdirp = require('mkdirp');
var rimraf = require('rimraf');

var index = require(root);

var binpath = path.dirname(process.execPath);
var cli = require.resolve(root + '/bin/cli.js');
var temp = path.resolve(root + '/temp');

function shell(opts, done) {
    if (_.isString(opts)) {
        opts = { task: opts };
    }

    opts.task = util.format('node "%s" %s', cli, opts.task);
    opts.cwd = temp;
    opts.env = {
        path: binpath
    };

    shellton(opts, done);
}

describe('[bin]', function () {
    before(function () {
        mkdirp.sync(temp);
    });

    beforeEach(function () {
        rimraf.sync(temp);
        mkdirp.sync(temp);
    });

    after(function () {
        rimraf.sync(temp);
    });

    describe('ls', function () {
        it('lists all of the tsaks', function (done) {
            shell('ls', function (err, stdout, stderr) {
                if (err) {
                    return done(err);
                }


                expect(stdout).to.be.a('string')
                    .and.to.have.length.above(0);

                index.taskNames.forEach(function (name) {
                    expect(stdout).to.contain(name);
                });

                done();
            });
        });

        it('lists additional tasks with the "--all" flag', function (done) {
            shell('ls --all', function (err, stdout, stderr) {
                if (err) {
                    return done(err);
                }


                expect(stdout).to.be.a('string')
                    .and.to.have.length.above(0);

                index.taskNames.concat(index.additionalNames).forEach(function (name) {
                    expect(stdout).to.contain(name);
                });

                done();
            });
        });
    });
});
