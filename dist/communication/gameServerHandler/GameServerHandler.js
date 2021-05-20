"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var gameClientMessages_1 = require("../../messages/inGame/gameClientMessages");
var ServerCommunication_1 = require("../ServerCommunication");
var lobby_1 = __importDefault(require("./lobby"));
var GameServerHandler = /** @class */ (function () {
    function GameServerHandler() {
        this.serverCommunication = new ServerCommunication_1.ServerCommunication(this.onMessageReceive);
        this.state = new lobby_1.default();
    }
    GameServerHandler.prototype.connectClient = function (token, playerData, sendToClient) {
        this.serverCommunication.connectClient({
            token: token,
            sendToClient: sendToClient,
        });
        if (this.state.type === "lobby") {
            var msgToSend = this.state.onConnect(token, playerData);
            if (msgToSend !== null) {
                this.serverCommunication.sendMessageToClient(msgToSend, token);
                this.updateClients();
            }
        }
        else if (this.state.type === "ingame") {
            var _a = this.state.onConnect(token, playerData), updateAll = _a[0], seatMessage = _a[1], lobbyStateMessage = _a[2];
            if (lobbyStateMessage !== null)
                this.serverCommunication.sendMessageToClient(lobbyStateMessage, token);
            if (seatMessage !== null)
                this.serverCommunication.sendMessageToClient(seatMessage, token);
            if (updateAll)
                this.updateClients();
        }
    };
    GameServerHandler.prototype.updateClients = function () {
        if (this.state.type === "lobby") {
            var msgToAll = this.state.updateClientsMessage();
            this.serverCommunication.sendMessageToClients(msgToAll);
        }
    };
    GameServerHandler.prototype.onMessageReceive = function (message, token) {
        var _this = this;
        var cl = this.serverCommunication.clients.find(function (cl) { return cl.token === token; });
        if (cl === undefined)
            return;
        if (gameClientMessages_1.isClientLobbyMessage(message) && this.state.type === "lobby") {
            if (message.type === "startgame") {
                var inGame = this.state.startGame();
                if (inGame !== null) {
                    this.state = inGame;
                    this.state.startGame(function (msg) {
                        return _this.serverCommunication.sendMessageToClients(msg);
                    });
                    this.updateClients();
                }
            }
            else {
                var _a = this.state.onReceiveMessage(token, message), updateAll = _a[0], toSender = _a[1];
                if (toSender !== null) {
                    this.serverCommunication.sendMessageToClient(toSender, token);
                }
                if (updateAll)
                    this.updateClients();
            }
        }
        else if (!gameClientMessages_1.isClientLobbyMessage(message) && this.state.type === "ingame") {
            var replayMessage = this.state.onReceiveMessage(token, message);
        }
    };
    return GameServerHandler;
}());
exports.GameServerHandler = GameServerHandler;
