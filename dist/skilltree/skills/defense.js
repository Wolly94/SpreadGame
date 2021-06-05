"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var baseDefense_1 = require("../perks/baseDefense");
var preparation_1 = require("../perks/preparation");
exports.Defense = {
    name: "Attack",
    perks: [baseDefense_1.BaseDefense, preparation_1.Preparation],
};
