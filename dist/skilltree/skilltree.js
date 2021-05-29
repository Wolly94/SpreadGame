"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var attack_1 = require("./skills/attack");
exports.validSkillTree = function (skillTree, skilledPerks) {
    return true;
};
exports.skillTreeMethods = {
    toData: function (skillTree) {
        return {
            skills: skillTree.skills.map(function (sk) {
                return {
                    name: sk.name,
                    perks: sk.perks.map(function (p) {
                        return { name: p.name };
                    }),
                };
            }),
        };
    },
    fromData: function (skillTreeData) {
        return {
            skills: skillTreeData.skills.map(function (skd) {
                return {
                    name: skd.name,
                    perks: skd.perks
                        .map(function (p) { return exports.getPerkByName(p.name); })
                        .filter(function (p) { return p !== null; }),
                };
            }),
        };
    },
    toSkilledPerks: function (skilledPerkData) {
        return skilledPerkData
            .map(function (spd) {
            return { level: spd.level, perk: exports.getPerkByName(spd.name) };
        })
            .filter(function (v) { return v.perk !== null; });
    },
    toSkilledPerkData: function (skilledPerks) {
        return skilledPerks.map(function (sp) {
            return { level: sp.level, name: sp.perk.name };
        });
    },
    getAttackerModifier: function (skilledPerks, attacker, spreadGame) {
        var attackModifier = 0;
        skilledPerks.forEach(function (skilledPerk) {
            skilledPerk.perk.effect
                .filter(function (p) { return p.type === "FightEffect"; })
                .forEach(function (eff) {
                attackModifier += eff.getValue(skilledPerk.level, attacker, spreadGame).attackModifier;
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
exports.getSkillByName = function (name) {
    var skill = exports.fullSkillTree.skills.find(function (sk) { return sk.name === name; });
    if (skill === undefined)
        return null;
    else
        return skill;
};
exports.getPerkByName = function (name) {
    var perk = exports.allPerks.find(function (p) { return p.name === name; });
    if (perk === undefined)
        return null;
    else
        return perk;
};
