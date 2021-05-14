"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var spreadGame_1 = require("./spreadGame");
exports.SpreadGameImplementation = spreadGame_1.SpreadGameImplementation;
var entities = __importStar(require("./entites"));
exports.entities = entities;
var mapStuff = __importStar(require("./map/index"));
exports.mapStuff = mapStuff;
