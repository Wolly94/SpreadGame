"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var entites_1 = require("../spreadGame/entites");
var fromFightStates = function (before, after) {
    var attacker = {
        currentPlayerId: before.attacker.playerId,
        position: before.attacker.position,
        unitsLost: before.attacker.units -
            (after.attacker !== null ? after.attacker.units : 0),
    };
    var defender = {
        currentPlayerId: before.defender.val.playerId,
        position: before.defender.val.position,
        unitsLost: before.defender.val.units -
            (after.defender.val !== null ? after.defender.val.units : 0),
    };
    return { attacker: attacker, defender: defender };
};
exports.latestDistance = function (event) {
    var latestState = event.partialFights.slice(-1)[0].data;
    return entites_1.distance(latestState.attacker.position, latestState.defender.position);
};
exports.fightEventFinished = function (event) {
    return event.finished;
};
exports.finishFightEvent = function (event) {
    event.finished = true;
    return event;
};
exports.entitiesApproached = function (before, after) {
    var newDist = entites_1.distance(after.attacker.position, after.defender.position);
    var latestDist = entites_1.distance(before.attacker.position, before.defender.position);
    return latestDist > newDist;
};
exports.createFightEvent = function (beforeFight, afterFight, timePassed) {
    var partialFight = fromFightStates(beforeFight, afterFight);
    return {
        type: "FightEvent",
        partialFights: [{ timestamp: timePassed, data: partialFight }],
        after: afterFight,
        before: beforeFight,
        finished: false,
    };
};
// either modifies FightEvent in place or creates a new one
exports.combinedFightEvents = function (e1, beforeFight, afterFight, timePassed) {
    var partialFight = fromFightStates(beforeFight, afterFight);
    var latestState = e1.partialFights.slice(-1)[0].data;
    if (exports.entitiesApproached(latestState, partialFight) &&
        !exports.fightEventFinished(e1)) {
        e1.partialFights.push({ timestamp: timePassed, data: partialFight });
        e1.after = afterFight;
        if (afterFight.attacker === null ||
            (afterFight.defender.type === "Bubble" &&
                afterFight.defender.val === null) ||
            (afterFight.defender.type === "Cell" &&
                partialFight.defender.currentPlayerId !== null)) {
            exports.finishFightEvent(e1);
        }
        return true;
    }
    else {
        exports.finishFightEvent(e1);
        return false;
    }
};
