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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var spreadGame_1 = require("../spreadGame");
var common_1 = require("../spreadGame/common");
var basicMechanics_1 = __importDefault(require("../spreadGame/mechanics/basicMechanics"));
var sendUnits_1 = require("../spreadGame/mechanics/events/sendUnits");
exports.getAttackerData = function (attackers, reachType) {
    var effectiveAttackers = 0;
    if ((reachType === null || reachType === void 0 ? void 0 : reachType.type) === "scratch") {
        effectiveAttackers = Math.max(attackers, reachType.maxReceivableUnits);
    }
    else if ((reachType === null || reachType === void 0 ? void 0 : reachType.type) === "basic") {
        if (attackers >= reachType.maxSendableUnits)
            effectiveAttackers = 0;
        else
            effectiveAttackers = attackers;
    }
    else if ((reachType === null || reachType === void 0 ? void 0 : reachType.type) === "bounce") {
        effectiveAttackers = Math.max(0, attackers - reachType.absoluteUnitLoss);
    }
    if (reachType === null)
        return { effectiveAttackers: 0, durationInMs: 0 };
    else {
        return {
            effectiveAttackers: effectiveAttackers,
            durationInMs: reachType.durationInMs,
        };
    }
};
var maxSendableUnits = function (cell) {
    var dummyCell = {
        id: -1,
        playerId: 0,
        position: [-100, -100],
        radius: 50,
        units: 50,
    };
    var _a = basicMechanics_1.default.sendBubble(__assign(__assign({}, cell), { units: common_1.radiusToUnits(cell.radius) * 10 }), dummyCell, 0, sendUnits_1.sendUnitsUtils.default), newCell = _a[0], newBubble = _a[1];
    return newBubble === null ? 0 : newBubble.units;
};
exports.reachByUnit = function (map, settings, skills, senderId, receiverId, unitsToSend) {
    var _a;
    var players = [{ id: 0, skills: skills }];
    var newMap = __assign(__assign({}, map), { cells: map.cells.map(function (c) {
            if (c.id === senderId)
                return __assign(__assign({}, c), { playerId: 0, units: unitsToSend * 2 });
            else
                return __assign(__assign({}, c), { units: 1000000, playerId: null });
        }) });
    var game = new spreadGame_1.SpreadGameImplementation(newMap, settings, players, skills.map(function (sk) { return sk.perk; }));
    game.sendUnits(0, [senderId], receiverId);
    var bubbleId = (_a = game.bubbles.find(function () { return true; })) === null || _a === void 0 ? void 0 : _a.id;
    while (game.bubbles.length === 1) {
        game.step(settings.updateFrequencyInMs);
    }
    var expectedEvent = game.eventHistory
        .filter(function (ev) {
        return ev.data.type === "FightEvent";
    })
        .find(function (ev) {
        return ev.data.before.attacker.id === bubbleId &&
            ev.data.before.defender.type === "Cell" &&
            ev.data.before.defender.val.id === receiverId;
    });
    if (expectedEvent === undefined)
        return { duration: "Infinity", receivedUnits: 0 };
    else {
        var afterUnits = expectedEvent.data.after.defender.type === "Cell"
            ? expectedEvent.data.after.defender.val.units
            : 0;
        var unitDiff = expectedEvent.data.before.defender.val.units - afterUnits;
        return { duration: game.timePassed, receivedUnits: unitDiff };
    }
};
exports.reach = function (map, settings, skills, senderId, receiverId) {
    var senderCell = map.cells.find(function (c) { return c.id === senderId; });
    if (senderCell === undefined)
        return null;
    var maxSendUnits = maxSendableUnits(__assign({}, senderCell));
    if (settings.mechanics === "basic") {
        var currentUnitsToSend = maxSendUnits;
        while (currentUnitsToSend >= 0) {
            var r = exports.reachByUnit(map, settings, skills, senderId, receiverId, currentUnitsToSend);
            if (r.duration === "Infinity")
                currentUnitsToSend -= 1;
            else
                return {
                    type: "basic",
                    durationInMs: r.duration,
                    maxSendableUnits: currentUnitsToSend,
                };
        }
        return null;
    }
    else if (settings.mechanics === "scrapeoff") {
        var currentUnitsToSend = maxSendUnits;
        var r = exports.reachByUnit(map, settings, skills, senderId, receiverId, currentUnitsToSend);
        if (r.duration === "Infinity")
            return null;
        else
            return {
                type: "scratch",
                durationInMs: r.duration,
                maxReceivableUnits: r.receivedUnits,
            };
    }
    else if (settings.mechanics === "bounce") {
        var maxBounced = -1;
        var maxDuration = -1;
        var unitsInPercentToSend = 0.1;
        while (unitsInPercentToSend <= 1) {
            var currentUnitsToSend = maxSendUnits * unitsInPercentToSend;
            var r = exports.reachByUnit(map, settings, skills, senderId, receiverId, currentUnitsToSend);
            if (r.duration !== "Infinity") {
                maxBounced = Math.max(maxBounced, currentUnitsToSend - r.receivedUnits);
                maxDuration = Math.max(maxDuration, r.duration);
            }
            unitsInPercentToSend += 0.1;
        }
        if (maxBounced < 0)
            return null;
        else {
            return {
                type: "bounce",
                durationInMs: maxDuration,
                absoluteUnitLoss: Math.round(maxBounced),
            };
        }
    }
    return null;
};
