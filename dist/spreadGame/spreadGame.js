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
var events_1 = require("../skilltree/events");
var entites_1 = require("./entites");
var attackerConquerCell_1 = require("./gameProps/attackerConquerCell");
var attackerFight_1 = require("./gameProps/attackerFight");
var defenderDefendCell_1 = require("./gameProps/defenderDefendCell");
var defenderFight_1 = require("./gameProps/defenderFight");
var basicMechanics_1 = __importDefault(require("./mechanics/basicMechanics"));
var bounceMechanics_1 = __importDefault(require("./mechanics/bounceMechanics"));
var scrapeOffMechanics_1 = __importDefault(require("./mechanics/scrapeOffMechanics"));
var player_1 = require("./player");
var getMechanics = function (settings) {
    if (settings.mechanics === "basic") {
        return basicMechanics_1.default;
    }
    else if (settings.mechanics === "scrapeoff") {
        return scrapeOffMechanics_1.default;
    }
    else if (settings.mechanics === "bounce") {
        return bounceMechanics_1.default;
    }
    else
        throw Error("unregistered mechanics");
};
var SpreadGameImplementation = /** @class */ (function () {
    function SpreadGameImplementation(map, gameSettings, players) {
        //const players = getPlayerIds(map);
        this.gameSettings = gameSettings;
        this.mechanics = getMechanics(gameSettings);
        this.map = map;
        this.cells = map.cells.map(function (mapCell) {
            var cell = {
                id: mapCell.id,
                playerId: mapCell.playerId,
                position: mapCell.position,
                radius: mapCell.radius,
                units: mapCell.units,
            };
            return cell;
        });
        this.bubbles = [];
        this.players = players;
        this.timePassed = 0;
        this.pastMoves = [];
        this.eventHistory = [];
    }
    SpreadGameImplementation.fromReplay = function (replay) {
        var spreadGame = new SpreadGameImplementation(replay.map, replay.gameSettings, replay.players.map(player_1.playerFromData));
        return spreadGame;
    };
    SpreadGameImplementation.prototype.runReplay = function (replay, ms) {
        var _this = this;
        var movesToDo = replay.moveHistory.filter(function (mv) {
            return mv.timestamp >= _this.timePassed && mv.timestamp < _this.timePassed + ms;
        });
        var finalTime = Math.min(this.timePassed + ms, replay.lengthInMs);
        while (this.timePassed < finalTime) {
            movesToDo.forEach(function (mv) {
                if (mv.timestamp === _this.timePassed) {
                    _this.applyMove(mv.data);
                }
            });
            this.step(replay.gameSettings.updateFrequencyInMs);
        }
    };
    SpreadGameImplementation.prototype.getReplay = function () {
        var rep = {
            map: this.map,
            gameSettings: this.gameSettings,
            moveHistory: this.pastMoves,
            players: this.players.map(function (pl) { return player_1.dataFromPlayer(pl); }),
            lengthInMs: this.timePassed,
        };
        return rep;
    };
    SpreadGameImplementation.prototype.applyMove = function (move) {
        if (move.type === "sendunitsmove") {
            this.sendUnits(move.data.playerId, move.data.senderIds, move.data.receiverId);
        }
    };
    SpreadGameImplementation.prototype.run = function (ms, updateFrequencyInMs) {
        if (ms <= 0)
            return;
        else {
            this.step(updateFrequencyInMs);
            this.run(ms - updateFrequencyInMs, updateFrequencyInMs);
        }
    };
    SpreadGameImplementation.prototype.step = function (ms) {
        var _this = this;
        this.bubbles = this.bubbles.map(function (bubble) {
            return _this.mechanics.move(bubble, ms);
        });
        this.cells = this.cells.map(function (cell) { return _this.mechanics.grow(cell, ms); });
        this.collideBubblesWithCells();
        this.collideBubblesWithBubbles();
        this.checkForFinishedFights();
        this.timePassed += ms;
    };
    SpreadGameImplementation.prototype.collideBubblesWithBubbles = function () {
        var _this = this;
        var fightResults = [];
        var remainingBubbles = [];
        this.bubbles.forEach(function (bubble) {
            var skills1 = _this.getSkilledPerks(bubble.playerId);
            var currentBubble = bubble;
            remainingBubbles = remainingBubbles.map(function (bubble2) {
                if (currentBubble !== null &&
                    bubble2 !== null &&
                    _this.mechanics.collidesWithBubble(bubble2, currentBubble)) {
                    var f1 = attackerFight_1.attackerFightUtils.collect(skills1, { attacker: bubble2, defender: currentBubble }, _this);
                    var skills2 = _this.getSkilledPerks(bubble2.playerId);
                    var f2 = attackerFight_1.attackerFightUtils.collect(skills2, { attacker: currentBubble, defender: bubble2 }, _this);
                    var _a = _this.mechanics.collideBubble(bubble2, currentBubble, f2, f1), rem1 = _a[0], rem2 = _a[1];
                    fightResults.push([
                        {
                            attacker: bubble2,
                            defender: { type: "Bubble", val: currentBubble },
                        },
                        {
                            attacker: rem1,
                            defender: { type: "Bubble", val: rem2 },
                        },
                    ]);
                    currentBubble = rem2;
                    return rem1;
                }
                else {
                    return bubble2;
                }
            });
            if (currentBubble != null) {
                remainingBubbles.push(currentBubble);
            }
        });
        this.bubbles = remainingBubbles.filter(function (b) { return b !== null; });
        fightResults.forEach(function (_a) {
            var before = _a[0], after = _a[1];
            return _this.processFight(before, after);
        });
    };
    SpreadGameImplementation.prototype.checkForFinishedFights = function () {
        var _this = this;
        this.eventHistory = this.eventHistory.map(function (ev) {
            if (ev.data.type === "FightEvent" && !ev.data.finished) {
                var returnEvent = __assign({}, ev.data);
                var eventData_1 = ev.data;
                var currentAttacker = _this.bubbles.find(function (b) { return b.id === eventData_1.before.attacker.id; });
                var currentDefender = eventData_1.before.defender.type === "Cell"
                    ? _this.cells.find(function (c) { return c.id === eventData_1.before.defender.val.id; })
                    : _this.bubbles.find(function (b) { return b.id === eventData_1.before.defender.val.id; });
                if (currentAttacker === undefined || currentDefender === undefined) {
                    // attacker or defender got killed by someone else
                    events_1.finishFightEvent(returnEvent);
                }
                else if (events_1.latestDistance(eventData_1) <
                    entites_1.distance(currentAttacker.position, currentDefender.position)) {
                    // they are moving away from each other
                    events_1.finishFightEvent(returnEvent);
                }
                return __assign(__assign({}, ev), { data: returnEvent });
            }
            else
                return ev;
        });
    };
    // this either adds a FightEvent or a PartialFightEvent or modifies a PartialFightEvent in the event history
    SpreadGameImplementation.prototype.processFight = function (before, after) {
        var _this = this;
        var _a;
        var capturedCellEvent = before.defender.type === "Cell" &&
            after.defender.val !== null &&
            after.defender.val.playerId !== null &&
            before.defender.val.playerId !== after.defender.val.playerId
            ? {
                afterPlayerId: after.defender.val.playerId,
                beforePlayerId: before.defender.val.playerId,
                cellId: before.defender.val.id,
                type: "CapturedCell",
            }
            : null;
        var defeatedBubbleEvents = [];
        if (after.attacker === null) {
            defeatedBubbleEvents.push({
                type: "DefeatedBubble",
                defender: after.defender,
            });
        }
        if (after.defender.type === "Bubble" && after.defender.val === null) {
            defeatedBubbleEvents.push({
                type: "DefeatedBubble",
                defender: { type: "Bubble", val: after.attacker },
            });
        }
        var existingPartialFightEvent = (_a = this.eventHistory.find(function (ev) {
            return ev.data.type === "FightEvent" &&
                !ev.data.finished &&
                ev.data.before.attacker.id === before.attacker.id &&
                ev.data.before.defender.type === before.defender.type &&
                ev.data.before.defender.val.id === before.defender.val.id;
        })) === null || _a === void 0 ? void 0 : _a.data;
        if (existingPartialFightEvent !== undefined &&
            events_1.combinedFightEvents(existingPartialFightEvent, before, after, this.timePassed)) {
        }
        else {
            var newEvent = events_1.createFightEvent(before, after, this.timePassed);
            this.eventHistory.push({ timestamp: this.timePassed, data: newEvent });
        }
        if (capturedCellEvent !== null)
            this.eventHistory.push({
                timestamp: this.timePassed,
                data: capturedCellEvent,
            });
        defeatedBubbleEvents.forEach(function (ev) {
            return _this.eventHistory.push({ timestamp: _this.timePassed, data: ev });
        });
    };
    SpreadGameImplementation.prototype.collideBubblesWithCells = function () {
        var _this = this;
        var fightResults = [];
        var remainingBubbles = [];
        this.bubbles.forEach(function (bubble) {
            var skills1 = _this.getSkilledPerks(bubble.playerId);
            var currentBubble = bubble;
            _this.cells = _this.cells.map(function (cell) {
                if (currentBubble != null &&
                    (currentBubble.motherId !== cell.id ||
                        currentBubble.playerId !== cell.playerId) &&
                    _this.mechanics.collidesWithCell(bubble, cell)) {
                    var f1 = attackerFight_1.attackerFightUtils.collect(skills1, { attacker: bubble, defender: cell }, _this);
                    var skills2 = cell.playerId !== null ? _this.getSkilledPerks(cell.playerId) : [];
                    var f2 = defenderFight_1.defenderFightUtils.collect(skills2, { defender: cell, attacker: bubble }, _this);
                    var _a = _this.mechanics.collideCell(currentBubble, cell, f1, f2), newCurrentBubble = _a[0], newCell = _a[1];
                    fightResults.push([
                        { attacker: currentBubble, defender: { type: "Cell", val: cell } },
                        {
                            attacker: newCurrentBubble,
                            defender: { type: "Cell", val: newCell },
                        },
                    ]);
                    if (newCell.playerId !== cell.playerId) {
                        var conquerProps = attackerConquerCell_1.attackerConquerCellFightUtils.collect(skills1, {}, _this);
                        newCell = __assign(__assign({}, newCell), { units: newCell.units + conquerProps.additionalUnits });
                    }
                    else {
                        /* if (newCell.playerId === cell.playerId) { */
                        var defendCellProps = defenderDefendCell_1.defenderDefendCellUtils.collect(skills2, {}, _this);
                        newCell = __assign(__assign({}, newCell), { units: newCell.units + defendCellProps.additionalUnits });
                    }
                    currentBubble = newCurrentBubble;
                    //if (event !== null) eventsToAdd.push(event);
                    return newCell;
                }
                else {
                    return cell;
                }
            });
            if (currentBubble != null) {
                remainingBubbles.push(currentBubble);
            }
        });
        this.bubbles = remainingBubbles;
        fightResults.forEach(function (_a) {
            var before = _a[0], after = _a[1];
            return _this.processFight(before, after);
        });
    };
    SpreadGameImplementation.prototype.sendUnits = function (playerId, senderIds, receiverId) {
        var _this = this;
        var eventsToAdd = [];
        var player = this.players.find(function (p) { return p.id == playerId; });
        if (player == undefined)
            return false;
        var targetCell = this.cells.find(function (c) { return c.id == receiverId; });
        if (targetCell == undefined)
            return false;
        var sentIds = [];
        this.cells = this.cells.map(function (sender) {
            if (senderIds.some(function (id) { return id === sender.id; }) &&
                sender.playerId === playerId &&
                sender.id !== receiverId) {
                var _a = _this.mechanics.sendBubble(sender, targetCell, _this.timePassed), remCell = _a[0], bubble = _a[1];
                if (bubble !== null) {
                    _this.bubbles.push(bubble);
                    eventsToAdd.push({
                        type: "SendBubbleEvent",
                        sender: sender,
                        receiver: targetCell,
                    });
                    sentIds.push(sender.id);
                }
                return remCell;
            }
            else {
                return sender;
            }
        });
        this.pastMoves.push({
            timestamp: this.timePassed,
            data: {
                type: "sendunitsmove",
                data: {
                    receiverId: targetCell.id,
                    senderIds: sentIds,
                    playerId: playerId,
                },
            },
        });
        this.eventHistory = this.eventHistory.concat(eventsToAdd.map(function (ev) {
            return { timestamp: _this.timePassed, data: ev };
        }));
    };
    SpreadGameImplementation.prototype.toClientGameState = function () {
        var _this = this;
        var gs = {
            timePassedInMs: this.timePassed,
            cells: this.cells.map(function (cell) {
                var skills = cell.playerId !== null ? _this.getSkilledPerks(cell.playerId) : [];
                var fightProps = defenderFight_1.defenderFightUtils.collect(skills, { defender: cell, attacker: null }, _this);
                return {
                    id: cell.id,
                    playerId: cell.playerId,
                    units: cell.units,
                    position: cell.position,
                    radius: cell.radius,
                    defenderCombatAbilities: fightProps.combatAbilityModifier,
                };
            }),
            bubbles: this.bubbles.map(function (bubble) {
                var skills = _this.getSkilledPerks(bubble.playerId);
                var fightProps = attackerFight_1.attackerFightUtils.collect(skills, { attacker: bubble, defender: null }, _this);
                return {
                    id: bubble.id,
                    playerId: bubble.playerId,
                    units: bubble.units,
                    position: bubble.position,
                    radius: bubble.radius,
                    attackCombatAbilities: fightProps.combatAbilityModifier,
                };
            }),
        };
        return gs;
    };
    SpreadGameImplementation.prototype.getSkilledPerks = function (playerId) {
        var pl = this.players.find(function (pl) { return pl.id === playerId; });
        if (pl === undefined)
            return [];
        else
            return pl.skills;
    };
    return SpreadGameImplementation;
}());
exports.SpreadGameImplementation = SpreadGameImplementation;
