"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("../utils");
var values = [10, 20, 30];
exports.BaseAttack = {
    name: "Base",
    values: values,
    description: "Raises damage of your bubbles by " +
        utils_1.formatDescription(values, function (val) { return val.toString() + "%"; }, "/") +
        ".",
    effect: [
        {
            type: "FightEffect",
            getValue: function (lvl) {
                if (lvl <= 0)
                    return { attackModifier: 0 };
                else
                    return { attackModifier: values[Math.min(lvl, values.length) - 1] };
            },
        },
    ],
    skillable: function (skilltree, skilledPerks) { return true; },
};
exports.Attack = {
    name: "Attack",
    perks: [exports.BaseAttack],
};
