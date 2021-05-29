"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var baseAttack_1 = require("../perks/baseAttack");
var rage_1 = require("../perks/rage");
exports.Attack = {
    name: "Attack",
    perks: [baseAttack_1.BaseAttack, rage_1.Rage],
};
