"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ServerCommunication = /** @class */ (function () {
    function ServerCommunication(onReceiveMessage) {
        this.clients = [];
        this.onReceiveMessage = onReceiveMessage;
    }
    ServerCommunication.prototype.connectClient = function (client) {
        var exClientIndex = this.clients.findIndex(function (cl) { return cl.token === client.token; });
        if (exClientIndex >= 0) {
            this.clients[exClientIndex] = client;
        }
        else {
            this.clients.push(client);
        }
    };
    ServerCommunication.prototype.sendMessageToClients = function (message) {
        this.clients.forEach(function (cl) { return cl.sendToClient(message); });
    };
    ServerCommunication.prototype.sendMessageToClient = function (message, token) {
        var cl = this.clients.find(function (cl) { return cl.token === token; });
        if (cl !== undefined)
            cl.sendToClient(message);
        else
            console.log("Could not send message to client because client could not be found!");
    };
    return ServerCommunication;
}());
exports.ServerCommunication = ServerCommunication;
