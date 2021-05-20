"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ClientCommunication = /** @class */ (function () {
    function ClientCommunication(token) {
        this.token = token;
        this.onReceiveMessage = null;
        this.sendMessageToServer = null;
    }
    ClientCommunication.prototype.isReady = function () {
        return this.onReceiveMessage !== null && this.sendMessageToServer !== null;
    };
    ClientCommunication.prototype.connect = function (sendMessageToServer) {
        var _this = this;
        this.sendMessageToServer = function (msg) {
            return sendMessageToServer({ token: _this.token, data: msg });
        };
    };
    ClientCommunication.prototype.setReceiver = function (onReceiveMessage) {
        this.onReceiveMessage = onReceiveMessage;
    };
    return ClientCommunication;
}());
exports.ClientCommunication = ClientCommunication;
