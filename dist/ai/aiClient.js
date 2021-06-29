"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AiClient = /** @class */ (function () {
    function AiClient(ai) {
        this.playerId = ai.playerId;
        this.ai = ai;
        this.timeoutInterval = 500;
        this.currentlyTimedOut = false;
    }
    AiClient.prototype.getMove = function (gameState) {
        var _this = this;
        if (!this.currentlyTimedOut) {
            var move = this.ai.getMove(gameState);
            if (move !== null) {
                this.currentlyTimedOut = true;
                setTimeout(function () { return (_this.currentlyTimedOut = false); }, this.timeoutInterval);
                return move;
            }
        }
        return null;
    };
    return AiClient;
}());
exports.default = AiClient;
