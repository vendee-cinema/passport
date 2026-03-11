"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.constantTimeEqual = constantTimeEqual;
const crypto_1 = require("crypto");
function constantTimeEqual(a, b) {
    const bufferA = Buffer.from(a);
    const bufferB = Buffer.from(b);
    if (bufferA.length !== bufferB.length)
        return false;
    return (0, crypto_1.timingSafeEqual)(bufferA, bufferB);
}
