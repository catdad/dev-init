/* jshint node: true */

var _ = require('lodash');
var Menu = require('terminal-menu');
var menu = Menu({ width: 29, x: 4, y: 2 });

var DONE = 'Done';
var CANCEL = 'Cancel';

function drawMenu(tasknames, done) {
    var cancelled = false;

    var tasks = _.reduce(tasknames, function(obj, name) {
        obj[name] = false;
        return obj;
    }, {});

    menu.reset();

    menu.write('Select tasks to run\n');
    menu.write('-------------------------\n');

    function setLabel(selected, value) {
        var pre = selected ? 'x ' : '  ';
        var regex = new RegExp('^(x|\\s)\\s' + value + '$');
        var idx;

        _.forEach(menu.items, function(item, i) {
            if (regex.test(item.label)) {
                item.label = pre + value;
                idx = i;
            }
        });

        if (idx !== undefined) {
            menu._drawRow(idx);
        }
    }

    _.forEach(tasks, function(selected, value) {
        var pre = selected ? 'x ' : '  ';

        menu.add(pre + value, function() {
            if (tasks[value]) {
                tasks[value] = false;
            } else {
                tasks[value] = true;
            }

            setLabel(tasks[value], value);
        });
    });

    menu.write('-------------------------\n');

    menu.add(DONE);
    menu.add(CANCEL);

    menu.on('select', function (label) {
        if (label === CANCEL) {
            cancelled = true;
            menu.reset();
            return menu.close();
        } else if (label === DONE) {
            return menu.close();
        }
    });

    process.stdin.pipe(menu.createStream()).pipe(process.stdout);
    process.stdin.setRawMode(true);

    menu.on('close', function () {
        // reset raw mode and pause input, so that we can use
        // the input later if needed, and node can exit when
        // all of the work is done
        process.stdin.setRawMode(false);
        process.stdin.pause();

        // clears all of the screen stuffs
        process.stdout.write('\033c');

        if (cancelled) {
            done('cancel');
            return;
        }
        var selected = _.reduce(tasks, function(arr, selected, key) {
            if (selected) {
                arr.push(key);
            }

            return arr;
        }, []);

        done(undefined, selected);
    });
}

module.exports = drawMenu;
