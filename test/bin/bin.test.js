/* jshint node: true, mocha: true */

var util = require('util');

var expect = require('chai').expect;
var root = require('rootrequire');
var _ = require('lodash');
var async = require('async');

var index = require(root);

var testUtil = require(root + '/test/_util/util.js');
var shell = testUtil.shell;
var assert = testUtil.assert;

describe('[bin]', function () {
    // these spawn stuff, run through nyc, etc.
    // so they can take a while
    this.timeout(5000);

    beforeEach(testUtil.ensureEnv);
    after(testUtil.teardownEnv);

    it('runs all tasks by default', function (done) {
        shell('', function (err, stdout, stderr) {
            if (err) {
                return done(err);
            }

            expect(stdout).to.be.a('string').and.to.have.length.above(0);

            index.taskNames.forEach(function (task) {
                expect(stdout).to.contain(task);
            });

            async.parallel(_.map(assert, function (func) {
                return func;
            }), done);
        });
    });

    index.taskNames.forEach(function (task) {
        describe(util.format('"%s" task', task), function () {
            it('runs as expected', function (done) {
                // make sure we have added an assertion for this task
                expect(assert).to.have.property(task);

                shell('--include ' + task, function (err, stdout, stderr) {
                    if (err) {
                        return done(err);
                    }

                    expect(stdout)
                        .to.be.a('string')
                        .and.to.have.length.above(0)
                        .and.to.contain(task);

                    assert[task](done);
                });
            });
        });
    });

    function listTests(command) {
        it('lists all of the tsaks', function (done) {
            shell(command, function (err, stdout, stderr) {
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
            shell(command + ' --all', function (err, stdout, stderr) {
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
    }

    describe('list', function () {
        listTests('ls');
    });

    describe('ls', function () {
        listTests('ls');
    });
});
