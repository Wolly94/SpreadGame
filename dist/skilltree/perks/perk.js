"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getValue = function (values, level, defaultValue) {
    if (level <= 0)
        return defaultValue;
    else {
        var val = values[Math.min(level, values.length) - 1];
        return val;
    }
};
