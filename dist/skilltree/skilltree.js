"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var attack_1 = require("./attack/attack");
exports.validSkillTree = function (skillTree, skilledPerks) {
    return true;
};
exports.skillTreeMethods = {
    getAttackerModifier: function (skilledPerks) {
        var attackModifier = 0;
        skilledPerks.forEach(function (skilledPerk) {
            skilledPerk.perk.effect
                .filter(function (p) { return p.type === "FightEffect"; })
                .forEach(function (eff) {
                attackModifier += eff.getValue(skilledPerk.level).attackModifier;
            });
        });
        return { attackModifier: 1 + attackModifier / 100 };
    },
};
exports.defaultSkillTree = {
    skills: [attack_1.Attack],
};
exports.fullSkillTree = {
    skills: [attack_1.Attack],
};
exports.allPerks = exports.fullSkillTree.skills.flatMap(function (sk) { return sk.perks; });
exports.getPerkByName = function (name) {
    var perk = exports.allPerks.find(function (p) { return p.name === name; });
    if (perk === undefined)
        return null;
    else
        return perk;
};
