"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var messages = __importStar(require("./messages/index"));
exports.messages = messages;
var spreadGame = __importStar(require("./spreadGame/index"));
exports.spreadGame = spreadGame;
var aiStuff = __importStar(require("./ai/index"));
exports.aiStuff = aiStuff;
var comm = __importStar(require("./communication/index"));
exports.comm = comm;
var skilltree = __importStar(require("./skilltree/index"));
exports.skilltree = skilltree;
