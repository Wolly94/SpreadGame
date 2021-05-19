"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var clientComm = __importStar(require("./ClientCommunication"));
exports.clientComm = clientComm;
var serverComm = __importStar(require("./ServerCommunication"));
exports.serverComm = serverComm;
var gameServerHandler = __importStar(require("./gameServerHandler/index"));
exports.gameServerHandler = gameServerHandler;
