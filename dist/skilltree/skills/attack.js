"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var baseAttack_1 = require("../perks/baseAttack");
var berserk_1 = require("../perks/berserk");
var rage_1 = require("../perks/rage");
var slavery_1 = require("../perks/slavery");
exports.Attack = {
    name: "Attack",
    perks: [baseAttack_1.BaseAttack, rage_1.Rage, berserk_1.Berserk, slavery_1.Slavery],
};
