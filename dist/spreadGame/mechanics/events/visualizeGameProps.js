"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var type = "VisualizeGameProps";
exports.visualizeGameUtils = {
    combine: function (a, b) {
        return {
            type: type,
            deadlyEnvironment: a.deadlyEnvironment || b.deadlyEnvironment,
        };
    },
    default: {
        type: type,
        deadlyEnvironment: false,
    },
    collect: function (props) {
        return props
            .filter(function (prop) { return prop.type === type; })
            .reduce(function (prev, curr) {
            if (curr.type === type)
                return exports.visualizeGameUtils.combine(prev, curr);
            else
                return prev;
        }, exports.visualizeGameUtils.default);
    },
};
