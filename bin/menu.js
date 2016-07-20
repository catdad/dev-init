/* jshint node: true */

var _ = require('lodash');
var Menu = require('terminal-menu');
var menu = Menu({ width: 29, x: 4, y: 2 });

var tasks = {
    git: false,
    npm: false,
    brackets: false,
    editorconfig: false,
    gitignore: false,
    gitattributes: false,
    readme: false,
};

var DONE = 'Done';
var CANCEL = 'Cancel';

function drawMenu() {
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
}

var cancelled = false;

menu.on('select', function (label) {
    if (label === CANCEL) {
        cancelled = true;
        return menu.close();
    } else if (label === DONE) {
        return menu.close();
    }
});

process.stdin.pipe(menu.createStream()).pipe(process.stdout);
process.stdin.setRawMode(true);

menu.on('close', function () {
    process.stdin.setRawMode(false);
    process.stdin.pause();

    if (cancelled) {
        console.log('user cancelled');
        return;
    }
    var selected = _.reduce(tasks, function(arr, selected, key) {
        if (selected) {
            arr.push(key);
        }

        return arr;
    }, []);

    console.log(selected);
});

drawMenu();
