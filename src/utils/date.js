"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatTime = exports.formatDate = void 0;
const date_fns_1 = require("date-fns");
// Function to generate formatted date string
const formatDate = (date) => (0, date_fns_1.format)(date, "MMMM do");
exports.formatDate = formatDate;
const formatTime = (date) => {
    return (0, date_fns_1.format)(date, "hh:mm aa");
};
exports.formatTime = formatTime;
