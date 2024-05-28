"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.randomBoolean = exports.getRandomNumber = void 0;
function getRandomNumber(min, max) {
    return Math.floor(Math.random() * max) + min;
}
exports.getRandomNumber = getRandomNumber;
// has a {float}% chance of returning true
function randomBoolean(float) {
    return Math.random() < float;
}
exports.randomBoolean = randomBoolean;
