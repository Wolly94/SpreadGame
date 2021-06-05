"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("./utils");
test("test format description", function () {
    var l = [1, 1, 1];
    var s = utils_1.formatDescription(l, function (s) { return s.toString() + "%"; }, "/");
    expect(s).toBe("1%");
});
test("test format description", function () {
    var l = [1, 2, 3];
    var s = utils_1.formatDescription(l, function (s) { return s.toString() + "%"; }, "/");
    expect(s).toBe("1%/2%/3%");
});
