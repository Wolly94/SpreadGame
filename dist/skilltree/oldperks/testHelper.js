"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.playersWithoutSkills = function (n) {
    var l = new Array(n).fill("");
    return l.map(function (v, index) {
        return { id: index, skills: [] };
    });
};
