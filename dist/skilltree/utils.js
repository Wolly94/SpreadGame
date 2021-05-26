"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatDescription = function (values, formatValue, delimeter) {
    var result = values.reduce(function (res, val) {
        if (res.length === 0) {
            return formatValue(val);
        }
        else {
            return res + delimeter + formatValue(val);
        }
    }, "");
    return result;
};
