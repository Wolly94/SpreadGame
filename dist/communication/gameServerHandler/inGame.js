"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var ai_1 = require("../../ai/ai");
var aiClient_1 = __importDefault(require("../../ai/aiClient"));
var skilltree_1 = require("../../skilltree/skilltree");
var spreadGame_1 = require("../../spreadGame");
var common_1 = require("./common");
var updateFrequencyInMs = 50;
var InGameImplementation = /** @class */ (function () {
    function InGameImplementation(map, settings, seatedPlayers, skillTree) {
        this.type = "ingame";
        this.skillTree = skillTree;
        this.intervalId = null;
        this.map = map;
        this.gameSettings = settings;
        var players = seatedPlayers.map(function (sp) {
            return { id: sp.playerId, skills: sp.skilledPerks };
        });
        if (settings.mechanics === "basic") {
            this.gameState = new spreadGame_1.SpreadGameImplementation(map, settings, players);
        }
        else if (settings.mechanics === "scrapeoff") {
            this.gameState = new spreadGame_1.SpreadGameImplementation(map, settings, players);
        }
        else if (settings.mechanics === "bounce") {
            this.gameState = new spreadGame_1.SpreadGameImplementation(map, settings, players);
        }
        else
            throw Error("unregistered mechanics");
        this.moveHistory = [];
        this.seatedPlayers = seatedPlayers;
        this.aiClients = this.seatedPlayers
            .filter(function (sp) {
            return sp.type === "ai";
        })
            .map(function (sp) {
            var ai = new ai_1.GreedyAi();
            var aiClient = new aiClient_1.default(sp.playerId, ai);
            return aiClient;
        });
    }
    InGameImplementation.prototype.isRunning = function () {
        return this.intervalId !== null;
    };
    InGameImplementation.prototype.stop = function () {
        if (this.intervalId !== null)
            clearInterval(this.intervalId);
    };
    InGameImplementation.prototype.onConnect = function (token, playerData) {
        var updateAll = false;
        var toSender = null;
        var index = this.seatedPlayers.findIndex(function (sp) { return sp.type === "human" && sp.token === token; });
        if (index < 0) {
            updateAll = false;
        }
        else {
            updateAll = true;
            var playerIdMessage = {
                type: "playerid",
                data: {
                    playerId: index >= 0 ? this.seatedPlayers[index].playerId : null,
                },
            };
            toSender = playerIdMessage;
        }
        var clientSkillTree = {
            skills: this.skillTree.skills.map(function (sk) {
                return {
                    name: sk.name,
                    perks: sk.perks.map(function (p) {
                        return { name: p.name };
                    }),
                };
            }),
        };
        var players = this.seatedPlayers.map(function (sp) {
            var skilledPerks = skilltree_1.skillTreeMethods.toSkilledPerkData(sp.skilledPerks);
            if (sp.type === "ai") {
                var aip = {
                    type: "ai",
                    playerId: sp.playerId,
                    skilledPerks: skilledPerks,
                };
                return aip;
            }
            else {
                var clp = {
                    type: "human",
                    name: sp.playerData.name,
                    playerId: sp.playerId,
                    skilledPerks: skilledPerks,
                };
                return clp;
            }
        });
        var observers = [];
        var lobbyStateMessage = {
            type: "lobbystate",
            data: {
                skillTree: clientSkillTree,
                map: this.map,
                players: players,
                observers: observers,
                gameSettings: this.gameSettings,
            },
        };
        return [updateAll, toSender, lobbyStateMessage];
    };
    InGameImplementation.prototype.onReceiveMessage = function (token, message) {
        if (message.type === "sendunits" && this.isRunning()) {
            var playerId = common_1.idFromToken(token, this.seatedPlayers);
            if (playerId != null) {
                var value = message.data;
                var move = {
                    type: "sendunitsmove",
                    data: {
                        playerId: playerId,
                        senderIds: value.senderIds,
                        receiverId: value.receiverId,
                    },
                };
                this.gameState.applyMove(move);
                console.log("message received and attack sent: " + message);
            }
            return null;
        }
        else if (message.type === "getreplay") {
            var rep = this.gameState.getReplay();
            var mess = {
                type: "sendreplay",
                data: rep,
            };
            return mess;
        }
        else
            return null;
    };
    InGameImplementation.prototype.startGame = function (updateCallback) {
        var _this = this;
        var ms = updateFrequencyInMs;
        this.intervalId = setInterval(function () {
            if (_this.gameState !== null) {
                _this.gameState.step(ms);
                var message = _this.getGameStateMessage();
                updateCallback(message);
                _this.applyAiMoves();
            }
        }, ms);
    };
    InGameImplementation.prototype.applyAiMoves = function () {
        var _this = this;
        var data = this.gameState.toClientGameState();
        this.aiClients.forEach(function (aiCl) {
            var move = aiCl.getMove(data);
            if (move != null) {
                _this.gameState.applyMove(move);
            }
        });
    };
    InGameImplementation.prototype.getGameStateMessage = function () {
        var data = this.gameState.toClientGameState();
        var message = {
            type: "gamestate",
            data: data,
        };
        return message;
    };
    return InGameImplementation;
}());
exports.default = InGameImplementation;
