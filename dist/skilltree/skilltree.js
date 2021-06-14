"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var spreadGameProps_1 = require("../spreadGame/spreadGameProps");
var attack_1 = require("./skills/attack");
var defense_1 = require("./skills/defense");
var spirit_1 = require("./skills/spirit");
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
    getAttackerModifier: function (skilledPerks, attacker, spreadGame, defender) {
        var combined = skilledPerks
            .flatMap(function (skilledPerk) {
            return skilledPerk.perk.effects
                .filter(function (p) { return p.type === "AttackerFightEffect"; })
                .map(function (getProps) {
                return getProps.getValue(skilledPerk.level, attacker, spreadGame, defender);
            });
        })
            .reduce(spreadGameProps_1.combineAttackerFightProps.combine, spreadGameProps_1.combineAttackerFightProps.default);
        return { combatAbilityModifier: 1 + combined.combatAbilityModifier / 100 };
    },
    getDefenderModifier: function (skilledPerks, defender, spreadGame, attacker) {
        var combined = skilledPerks
            .flatMap(function (skilledPerk) {
            return skilledPerk.perk.effects
                .filter(function (p) { return p.type === "DefenderFightEffect"; })
                .map(function (getProps) {
                return getProps.getValue(skilledPerk.level, defender, spreadGame, attacker);
            });
        })
            .reduce(spreadGameProps_1.combineDefenderFightProps.combine, spreadGameProps_1.combineDefenderFightProps.default);
        return __assign(__assign({}, combined), { combatAbilityModifier: 1 + combined.combatAbilityModifier / 100 });
    },
    getConquerCellProps: function (skilledPerks) {
        return skilledPerks
            .flatMap(function (skilledPerk) {
            return skilledPerk.perk.effects
                .filter(function (p) { return p.type === "ConquerCellEffect"; })
                .map(function (getProps) { return getProps.getValue(skilledPerk.level); });
        })
            .reduce(spreadGameProps_1.combineConquerCellProps.combine, spreadGameProps_1.combineConquerCellProps.default);
    },
    getDefendCellProps: function (skilledPerks) {
        return skilledPerks
            .flatMap(function (skilledPerk) {
            return skilledPerk.perk.effects
                .filter(function (p) { return p.type === "DefendCellEffect"; })
                .map(function (getProps) { return getProps.getValue(skilledPerk.level); });
        })
            .reduce(spreadGameProps_1.combineDefendCellProps.combine, spreadGameProps_1.combineDefendCellProps.default);
    },
};
exports.fullSkillTree = {
    skills: [attack_1.Attack, defense_1.Defense, spirit_1.Spirit],
};
exports.defaultSkillTree = exports.fullSkillTree;
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
