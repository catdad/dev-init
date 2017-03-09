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

            async.parallel(_.map(index.taskNames, function (name) {
                return assert[name];
            }), done);
        });
    });

    it('can include only specific tasks using the "--include" flag', function (done) {
        var include = ['brackets', 'editorconfig'];

        shell('--include ' + include.join(' '), function (err, stdout, stderr) {
            if (err) {
                return done(err);
            }

            expect(stdout).to.be.a('string')
                .and.to.have.length.above(0);

            include.forEach(function (name) {
                expect(stdout).to.contain(name);
            });

            var tasks = include.map(function (name) {
                return assert[name];
            });

            async.parallel(tasks, done);
        });
    });

    it('can exclude specific tasks using the "--exclude" flag', function (done) {
        var include = ['brackets', 'editorconfig'];
        var exclude = _.difference(index.taskNames, include);

        shell('--exclude ' + exclude.join(' '), function (err, stdout, stderr) {
            if (err) {
                return done(err);
            }

            expect(stdout).to.be.a('string')
                .and.to.have.length.above(0);

            include.forEach(function (name) {
                expect(stdout).to.contain(name);
            });

            var tasks = include.map(function (name) {
                return assert[name];
            });

            async.parallel(tasks, done);
        });
    });

    function taskTest(task, allFlag) {
        it('runs as expected', function (done) {
            // make sure we have added an assertion for this task
            expect(assert).to.have.property(task);

            var command = '--include ' + task;

            if (allFlag) {
                command += ' --all';
            }

            shell(command, function (err, stdout, stderr) {
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
    }

    index.taskNames.forEach(function (task) {
        describe(util.format('"%s" task', task), function () {
            taskTest(task, false);
        });
    });

    index.additionalNames.forEach(function (task) {
        describe(util.format('"%s" task with the --all flag', task), function () {
            // two minutes is extreme...
            // npm-install usually takes about 8 seconds, but I want to
            // be sure... networks can be slow sometimes
            this.timeout(2 * 60 * 1000);

            taskTest(task, true);
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
        listTests('list');
    });

    describe('ls', function () {
        listTests('ls');
    });
});
