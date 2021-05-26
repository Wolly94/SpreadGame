"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var skilltree_1 = require("../skilltree/skilltree");
var cell_1 = __importDefault(require("./cell"));
var basicMechanics_1 = __importDefault(require("./mechanics/basicMechanics"));
var bounceMechanics_1 = __importDefault(require("./mechanics/bounceMechanics"));
var scrapeOffMechanics_1 = __importDefault(require("./mechanics/scrapeOffMechanics"));
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
            var cell = new cell_1.default(mapCell.id, mapCell.playerId, mapCell.position, mapCell.units, mapCell.radius);
            return cell;
        });
        this.bubbles = [];
        this.players = players;
        this.timePassed = 0;
        this.pastMoves = [];
    }
    SpreadGameImplementation.prototype.getReplay = function () {
        var rep = {
            map: this.map,
            gameSettings: this.gameSettings,
            moveHistory: this.pastMoves,
            players: this.players,
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
        this.bubbles.map(function (bubble) { return _this.mechanics.move(bubble, ms); });
        this.cells.forEach(function (cell) {
            if (cell.playerId !== null)
                cell.grow(ms);
        });
        this.collideBubblesWithCells();
        this.collideBubblesWithBubbles();
        this.timePassed += ms;
    };
    SpreadGameImplementation.prototype.collideBubblesWithBubbles = function () {
        var _this = this;
        var remainingBubbles = [];
        this.bubbles.forEach(function (bubble) {
            var st1 = _this.players.find(function (pl) { return pl.id === bubble.playerId; });
            var f1 = st1 === undefined
                ? { attackModifier: 1.0 }
                : skilltree_1.skillTreeMethods.getAttackerModifier(st1.skills);
            var currentBubble = bubble;
            remainingBubbles = remainingBubbles.filter(function (bubble2) {
                if (currentBubble != null) {
                    var st2 = _this.players.find(function (pl) { return pl.id === bubble2.playerId; });
                    var f2 = st2 === undefined
                        ? { attackModifier: 1.0 }
                        : skilltree_1.skillTreeMethods.getAttackerModifier(st2.skills);
                    var _a = _this.mechanics.collideBubble(bubble2, currentBubble, f2, f1), rem1 = _a[0], rem2 = _a[1];
                    currentBubble = rem2;
                    return rem1 !== null;
                }
                else
                    return true;
            });
            if (currentBubble != null) {
                remainingBubbles.push(currentBubble);
            }
        });
        this.bubbles = remainingBubbles;
    };
    SpreadGameImplementation.prototype.collideBubblesWithCells = function () {
        var _this = this;
        var remainingBubbles = [];
        this.bubbles.forEach(function (bubble) {
            var st1 = _this.players.find(function (pl) { return pl.id === bubble.playerId; });
            var f1 = st1 === undefined
                ? { attackModifier: 1.0 }
                : skilltree_1.skillTreeMethods.getAttackerModifier(st1.skills);
            var currentBubble = bubble;
            _this.cells.forEach(function (cell) {
                if (currentBubble != null &&
                    (currentBubble.motherId !== cell.id ||
                        currentBubble.playerId !== cell.playerId)) {
                    currentBubble = _this.mechanics.collideCell(currentBubble, cell, f1, {
                        attackModifier: 1.0,
                    });
                }
            });
            if (currentBubble != null) {
                remainingBubbles.push(currentBubble);
            }
        });
        this.bubbles = remainingBubbles;
    };
    SpreadGameImplementation.prototype.sendUnits = function (playerId, senderIds, receiverId) {
        var _this = this;
        var player = this.players.find(function (p) { return p.id == playerId; });
        if (player == undefined)
            return false;
        var targetCell = this.cells.find(function (c) { return c.id == receiverId; });
        if (targetCell == undefined)
            return false;
        var sentIds = senderIds.filter(function (senderId) {
            var sender = _this.cells.find(function (c) {
                return c.id == senderId && c.playerId == playerId && senderId != receiverId;
            });
            if (sender == undefined)
                return false;
            var bubble = sender.trySend(targetCell);
            if (bubble != null) {
                _this.bubbles.push(bubble);
                return true;
            }
            else {
                return false;
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
        var gs = {
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
                return {
                    id: bubble.id,
                    playerId: bubble.playerId,
                    units: bubble.units,
                    position: bubble.position,
                    radius: bubble.radius,
                };
            }),
        };
        return gs;
    };
    return SpreadGameImplementation;
}());
exports.SpreadGameImplementation = SpreadGameImplementation;
