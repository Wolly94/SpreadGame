"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ClientCommunication = /** @class */ (function () {
    function ClientCommunication(token, onReceiveMessage, sendMessageToServer) {
        var _this = this;
        this.token = token;
        this.onReceiveMessage = onReceiveMessage;
        this.sendMessageToServer = function (msg) {
            var mess = {
                token: _this.token,
                data: msg,
            };
            sendMessageToServer(mess);
        };
    }
    return ClientCommunication;
}());
exports.ClientCommunication = ClientCommunication;
