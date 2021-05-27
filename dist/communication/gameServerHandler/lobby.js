"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var skilltree_1 = require("../../skilltree/skilltree");
var map_1 = require("../../spreadGame/map/map");
var common_1 = require("./common");
var inGame_1 = __importDefault(require("./inGame"));
var LobbyImplementation = /** @class */ (function () {
    function LobbyImplementation() {
        this.type = "lobby";
        this.map = null;
        this.gameSettings = { mechanics: "basic" };
        this.seatedPlayers = [];
        this.unseatedPlayers = [];
        this.skillTree = skilltree_1.defaultSkillTree;
    }
    LobbyImplementation.prototype.startGame = function () {
        if (this.map !== null) {
            // maybe clients were created faster than they could be added to the game
            var inGame = new inGame_1.default(this.map, this.gameSettings, this.seatedPlayers, this.skillTree);
            return inGame;
        }
        else
            return null;
    };
    // returns tuple whose first element determines wether clients need an update,
    // and the second argument only to the sender
    LobbyImplementation.prototype.onReceiveMessage = function (token, message) {
        if (message.type === "setmap") {
            var value = message.data;
            var toSender = this.setMap(token, value);
            return [true, toSender];
        }
        else if (message.type === "takeseat") {
            var playerId = message.data.playerId;
            var newSeatMessage = this.takeSeat(token, playerId);
            return [true, newSeatMessage];
        }
        else if (message.type === "clearseat") {
            var playerId = message.data.playerId;
            this.clearSeat(token, playerId);
            return [true, null];
        }
        else if (message.type === "seatai") {
            var playerId = message.data.playerId;
            this.seatAi(token, playerId);
            return [true, null];
        }
        else if (message.type === "gamesettings") {
            this.gameSettings = message.data;
            return [true, null];
        }
        else if (message.type === "setskilledperks") {
            this.setSkillTree(token, message.data);
            return [false, null];
        }
        else {
            return [false, null];
        }
    };
    LobbyImplementation.prototype.setSkillTree = function (token, data) {
        var pIndex = this.seatedPlayers.findIndex(function (sp) { return sp.type === "human" && sp.token === token; });
        if (pIndex < 0)
            return;
        var skilledPerks = skilltree_1.skillTreeMethods.toSkilledPerks(data);
        this.seatedPlayers[pIndex].skilledPerks = skilledPerks;
    };
    LobbyImplementation.prototype.updateClientsMessage = function () {
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
        // later add list of unseatedPlayers to lobby and inGame to let them also be displayed on website
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
        var observers = this.unseatedPlayers.map(function (usp) {
            return { name: usp.playerData.name };
        });
        var state = {
            map: this.map,
            players: players,
            observers: observers,
            gameSettings: this.gameSettings,
            skillTree: clientSkillTree,
        };
        var msg = {
            type: "lobbystate",
            data: state,
        };
        return msg;
    };
    LobbyImplementation.prototype.clearAiSeat = function (playerId) {
        var seatedIndex = this.seatedPlayers.findIndex(function (sp) { return sp.playerId === playerId; });
        if (seatedIndex >= 0) {
            if (this.seatedPlayers[seatedIndex].type === "ai") {
                var ai = this.seatedPlayers.splice(seatedIndex, 1)[0];
                // to make compiler happy:
                if (ai.type === "ai")
                    return ai;
                else
                    return null;
            }
        }
        return null;
    };
    LobbyImplementation.prototype.takeSeat = function (token, playerId) {
        var ai = this.clearAiSeat(playerId);
        var seatedIndex = this.seatedPlayers.findIndex(function (sp) { return sp.type === "human" && sp.token === token; });
        var unseatedIndex = this.unseatedPlayers.findIndex(function (usp) { return usp.token === token; });
        if (seatedIndex < 0 && unseatedIndex < 0) {
            return null;
        }
        else if (seatedIndex >= 0) {
            if (ai !== null) {
                ai.playerId = this.seatedPlayers[seatedIndex].playerId;
                this.seatedPlayers[seatedIndex].playerId = playerId;
                this.seatedPlayers.push(ai);
            }
            else {
                this.seatedPlayers[seatedIndex].playerId = playerId;
            }
        }
        else if (unseatedIndex >= 0) {
            this.seatedPlayers.push({
                type: "human",
                token: token,
                playerId: playerId,
                playerData: this.unseatedPlayers[unseatedIndex].playerData,
                skilledPerks: [],
            });
        }
        var setPlayerIdMessage = {
            type: "playerid",
            data: {
                playerId: playerId,
            },
        };
        return setPlayerIdMessage;
    };
    LobbyImplementation.prototype.clearSeat = function (token, playerId) {
        this.clearAiSeat(playerId);
    };
    LobbyImplementation.prototype.seatAi = function (token, playerId) {
        var seatedIndex = this.seatedPlayers.findIndex(function (sp) { return sp.playerId === playerId; });
        if (seatedIndex < 0) {
            var ai = {
                playerId: playerId,
                type: "ai",
                skilledPerks: [],
            };
            this.seatedPlayers.push(ai);
        }
    };
    LobbyImplementation.prototype.remainingLobbySeats = function () {
        if (this.map === null) {
            return [];
        }
        return common_1.remainingSeats(this.map, this.seatedPlayers);
    };
    LobbyImplementation.prototype.seatPlayer = function (token) {
        var seatedIndex = this.seatedPlayers.findIndex(function (sp) { return sp.type === "human" && sp.token === token; });
        if (seatedIndex >= 0)
            return null;
        var unseatedIndex = this.unseatedPlayers.findIndex(function (usp) { return usp.token === token; });
        if (unseatedIndex < 0)
            return null;
        var remSeats = this.remainingLobbySeats();
        if (remSeats.length === 0)
            return null;
        var playerId = remSeats[0];
        var newSeated = {
            type: "human",
            playerId: playerId,
            token: token,
            playerData: this.unseatedPlayers[unseatedIndex].playerData,
            skilledPerks: [],
        };
        this.seatedPlayers.push(newSeated);
        this.unseatedPlayers.splice(unseatedIndex, 1);
        var message = {
            type: "playerid",
            data: {
                playerId: playerId,
            },
        };
        return message;
    };
    LobbyImplementation.prototype.unseatPlayer = function (token) {
        var index = this.seatedPlayers.findIndex(function (sp) { return sp.type === "human" && sp.token === token; });
        if (index >= 0) {
            var sp = this.seatedPlayers[index];
            if (sp.type === "human")
                this.unseatedPlayers.push({
                    token: token,
                    playerData: sp.playerData,
                });
            this.seatedPlayers = this.seatedPlayers.splice(index, 1);
        }
        this.updateClientsMessage();
    };
    LobbyImplementation.prototype.onConnect = function (token, playerData) {
        this.unseatedPlayers.push({ token: token, playerData: playerData });
        var seatMessage = this.seatPlayer(token);
        return seatMessage;
    };
    LobbyImplementation.prototype.setMap = function (token, map) {
        var _a;
        var _this = this;
        this.map = map;
        var currentlySeated = __spreadArrays(this.seatedPlayers);
        (_a = this.unseatedPlayers).push.apply(_a, this.seatedPlayers
            .filter(function (sp) { return sp.type === "human"; })
            .map(function (sp) {
            return { playerData: sp.playerData, token: sp.token };
        }));
        this.seatedPlayers = [];
        currentlySeated.forEach(function (sp) {
            if (sp.type === "human")
                _this.seatPlayer(sp.token);
        });
        var playerIds = map_1.getPlayerIds(map);
        var openIds = Array.from(playerIds).filter(function (pid) { return !_this.seatedPlayers.some(function (sp) { return sp.playerId === pid; }); });
        var toSenderMessage = null;
        if (openIds.length === playerIds.size) {
            toSenderMessage = this.seatPlayer(token);
        }
        openIds.forEach(function (pid) { return _this.seatAi(token, pid); });
        return toSenderMessage;
    };
    return LobbyImplementation;
}());
exports.default = LobbyImplementation;
