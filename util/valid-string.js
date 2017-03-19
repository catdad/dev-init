/* jshint node: true */

module.exports = function validStr(str) {
    if (!str || typeof str !== 'string' || str.trim() === '') {
        return '';
    }

    return str;
};
