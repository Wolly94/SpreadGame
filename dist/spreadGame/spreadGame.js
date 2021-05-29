"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var rage_1 = require("../skilltree/perks/rage");
var skilltree_1 = require("../skilltree/skilltree");
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
    SpreadGameImplementation.prototype.step = function (ms) {
        var _this = this;
        this.bubbles = this.bubbles.map(function (bubble) {
            return _this.mechanics.move(bubble, ms);
        });
        this.cells = this.cells.map(function (cell) { return _this.mechanics.grow(cell, ms); });
        this.collideBubblesWithCells();
        this.collideBubblesWithBubbles();
        this.timePassed += ms;
    };
    SpreadGameImplementation.prototype.collideBubblesWithBubbles = function () {
        var _this = this;
        var eventsToAdd = [];
        var remainingBubbles = [];
        this.bubbles.forEach(function (bubble) {
            var st1 = _this.players.find(function (pl) { return pl.id === bubble.playerId; });
            var f1 = st1 === undefined
                ? { attackModifier: 1.0 }
                : skilltree_1.skillTreeMethods.getAttackerModifier(st1.skills, bubble, _this);
            var currentBubble = bubble;
            remainingBubbles = remainingBubbles.map(function (bubble2) {
                if (currentBubble !== null && bubble2 !== null) {
                    var st2 = _this.players.find(function (pl) { return pl.id === bubble2.playerId; });
                    var f2 = st2 === undefined
                        ? { attackModifier: 1.0 }
                        : skilltree_1.skillTreeMethods.getAttackerModifier(st2.skills, bubble2, _this);
                    var _a = _this.mechanics.collideBubble(bubble2, currentBubble, f2, f1), rem1 = _a[0], rem2 = _a[1];
                    if (rem1 === null) {
                        eventsToAdd.push({
                            type: "LostBubble",
                            playerId: bubble2.playerId,
                            opponentEntity: { type: "Bubble", bubble: currentBubble },
                        });
                    }
                    if (rem2 === null) {
                        eventsToAdd.push({
                            type: "LostBubble",
                            playerId: currentBubble.playerId,
                            opponentEntity: { type: "Bubble", bubble: bubble2 },
                        });
                    }
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
        this.eventHistory = this.eventHistory.concat(eventsToAdd.map(function (ev) {
            return { timestamp: _this.timePassed, data: ev };
        }));
    };
    SpreadGameImplementation.prototype.collideBubblesWithCells = function () {
        var _this = this;
        var eventsToAdd = [];
        var remainingBubbles = [];
        this.bubbles.forEach(function (bubble) {
            var st1 = _this.players.find(function (pl) { return pl.id === bubble.playerId; });
            var f1 = st1 === undefined
                ? { attackModifier: 1.0 }
                : skilltree_1.skillTreeMethods.getAttackerModifier(st1.skills, bubble, _this);
            var currentBubble = bubble;
            _this.cells = _this.cells.map(function (cell) {
                if (currentBubble != null &&
                    (currentBubble.motherId !== cell.id ||
                        currentBubble.playerId !== cell.playerId)) {
                    var _a = _this.mechanics.collideCell(currentBubble, cell, f1, {
                        attackModifier: 1.0,
                    }), newCurrentBubble = _a[0], newCell = _a[1];
                    if (newCell.playerId !== cell.playerId) {
                        eventsToAdd.push({
                            type: "LostCell",
                            opponentPlayerId: newCell.id,
                            opponentBubbleId: currentBubble.id,
                            cellId: newCell.id,
                            playerId: cell.playerId,
                        });
                    }
                    if (newCurrentBubble === null) {
                        eventsToAdd.push({
                            type: "LostBubble",
                            playerId: currentBubble.playerId,
                            opponentEntity: { type: "Cell", cell: cell },
                        });
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
        this.eventHistory = this.eventHistory.concat(eventsToAdd.map(function (ev) {
            return { timestamp: _this.timePassed, data: ev };
        }));
    };
    SpreadGameImplementation.prototype.sendUnits = function (playerId, senderIds, receiverId) {
        var _this = this;
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
                var _a = _this.mechanics.sendBubble(sender, targetCell), remCell = _a[0], bubble = _a[1];
                if (bubble !== null) {
                    _this.bubbles.push(bubble);
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
    };
    SpreadGameImplementation.prototype.toClientGameState = function () {
        var _this = this;
        var gs = {
            timePassedInMs: this.timePassed,
            cells: this.cells.map(function (cell) {
                return {
                    id: cell.id,
                    playerId: cell.playerId,
                    units: cell.units,
                    position: cell.position,
                    radius: cell.radius,
                };
            }),
            bubbles: this.bubbles.map(function (bubble) {
                var _a;
                var pl = _this.players.find(function (pl) { return pl.id === bubble.playerId; });
                var ragePerkLevel = (_a = pl === null || pl === void 0 ? void 0 : pl.skills.find(function (sk) { return sk.perk.name === rage_1.Rage.name; })) === null || _a === void 0 ? void 0 : _a.level;
                return {
                    id: bubble.id,
                    playerId: bubble.playerId,
                    units: bubble.units,
                    position: bubble.position,
                    radius: bubble.radius,
                    rage: ragePerkLevel === undefined
                        ? false
                        : rage_1.rageCondition(ragePerkLevel, _this.eventHistory, _this.timePassed, bubble.playerId),
                };
            }),
        };
        return gs;
    };
    return SpreadGameImplementation;
}());
exports.SpreadGameImplementation = SpreadGameImplementation;
