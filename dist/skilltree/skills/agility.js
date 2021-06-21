"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var baseAgility_1 = require("../perks/baseAgility");
var spy_1 = require("../perks/spy");
exports.Agility = {
    name: "Agility",
    perks: [baseAgility_1.BaseAgilityPerk.createFromValues(), spy_1.SpyPerk.createFromValues()],
};
