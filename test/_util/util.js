/* jshint node: true, mocha: true, unused: true */

var util = require('util');
var path = require('path');
var fs = require('fs');

var expect = require('chai').expect;
var root = require('rootrequire');
var shellton = require('shellton');
var _ = require('lodash');
var mkdirp = require('mkdirp');
var rimraf = require('rimraf');

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

function readFile(filename, done) {
    fs.readFile(path.resolve(temp, filename), 'utf8', done);
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
    },
    editorconfig: function assertEditorconfig(done) {
        assertFile('.editorconfig', done);
    },
    gitignore: function assertGitignore(done) {
        assertFile('.gitignore', done);
    },
    gitattributes: function assertGitattributes(done) {
        assertFile('.gitattributes', done);
    },
    readme: function assertReadme(done) {
        assertFile('README.md', done);
    },
    npm: function assertNpm(done) {
        assertFile('package.json', done);
    },
    'npm-test': function assertNpmTest(done) {
        readFile('package.json', function (err, content) {
            if (err) {
                return done(err);
            }

            try {
                var json = JSON.parse(content);

                expect(json).to.have.property('devDependencies')
                    .and.to.be.an('object')
                    .and.to.have.keys(['mocha', 'istanbul', 'chai']);

                expect(json).to.have.property('scripts')
                    .and.to.be.an('object')
                    .and.to.have.keys(['test', 'coverage']);
            } catch (e) {
                return done(e);
            }

            done();
        });
    }
};


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
    rimraf.sync(temp);
}

module.exports = {
    setupEnv: setup,
    teardownEnv: teardown,
    ensureEnv: function () {
        teardown();
        setup();
    },
    shell: shell,
    assert: assert
};
