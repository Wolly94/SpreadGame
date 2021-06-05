"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var allEqual = function (l) {
    if (l.length <= 1)
        return true;
    else
        return l[0] === l[1] && allEqual(l.slice(1));
};
exports.formatDescription = function (values, formatValue, delimeter) {
    var formatted = values.map(formatValue);
    if (allEqual(formatted))
        return formatted[0];
    else {
        var result = formatted.reduce(function (res, val) {
            if (res.length === 0) {
                return val;
            }
            else {
                return res + delimeter + val;
            }
        }, "");
        return result;
    }
};
