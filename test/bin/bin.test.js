/* jshint node: true, mocha: true */

var util = require('util');
var path = require('path');
var fs = require('fs');

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

function assertFile(filename, done) {
    fs.stat(path.resolve(temp, filename), function (err, stat) {
        if (err) {
            return done(err);
        }

        try {
            expect(stat.isFile()).to.equal(true);
        } catch(e) {
            return done(e);
        }

        done();
    });
}

var assert = {
    git: function assertGit(done) {
        fs.stat(path.resolve(temp, '.git'), function (err, stat) {
            if (err) {
                return done(err);
            }

            try {
                expect(stat.isDirectory()).to.equal(true);
            } catch(e) {
                return done(e);
            }

            done();
        });
    },
    brackets: function assertBrackets(done) {
        assertFile('.brackets.json', done);
    }
};


describe('[bin]', function () {
    function setup() {
        var count = 5;
        var err;

        while (count) {
            try {
                mkdirp.sync(temp, {
                    mode: '0777'
                });
                count = 0;
                err = null;
            } catch(e) {
                err = e;
                count -= 1;
            }
        }

        if (err) {
            throw err;
        }
    }
    function teardown() {
//        rimraf.sync(temp);
    }

    before(function () {
        setup();
    });

    beforeEach(function () {
        teardown();
        setup();
    });

    after(function () {
        teardown();
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

                    assert.git(done);
                });
            });
        });
    });


});
