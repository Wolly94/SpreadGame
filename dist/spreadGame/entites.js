"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.distance = function (pos1, pos2) {
    return Math.sqrt(Math.pow((pos1[0] - pos2[0]), 2) + Math.pow((pos1[1] - pos2[1]), 2));
};
exports.distanceToEntity = function (entity, pos) {
    var result = Math.max(0, exports.distance(entity.position, pos) - entity.radius);
    return result;
};
exports.entityContainsPoint = function (entity, pos) {
    return exports.distanceToEntity(entity, pos) <= 0;
};
