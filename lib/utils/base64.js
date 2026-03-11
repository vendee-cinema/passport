"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.base64UrlEncode = base64UrlEncode;
exports.base64UrlDecode = base64UrlDecode;
function base64UrlEncode(buffer) {
    const s = typeof buffer === 'string' ? Buffer.from(buffer) : buffer;
    return s
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/\=+$/, '');
}
function base64UrlDecode(str) {
    str = str.replace(/-/g, '+').replace(/_/g, '/');
    while (str.length % 4)
        str += '=';
    return Buffer.from(str, 'base64').toString();
}
