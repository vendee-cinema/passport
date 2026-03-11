"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var PassportService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PassportService = void 0;
const common_1 = require("@nestjs/common");
const node_crypto_1 = require("node:crypto");
const constants_1 = require("./constants");
const utils_1 = require("./utils");
let PassportService = class PassportService {
    static { PassportService_1 = this; }
    options;
    SECRET_KEY;
    static HMAC_DOMAIN = 'PassportTokenAuth/v1';
    static INTERNAL_SEPARATOR = '|';
    constructor(options) {
        this.options = options;
        this.SECRET_KEY = options.secretKey;
    }
    now() {
        return Math.floor(Date.now() / 1000);
    }
    serialize(user, iat, exp) {
        return [PassportService_1.HMAC_DOMAIN, user, iat, exp].join(PassportService_1.INTERNAL_SEPARATOR);
    }
    computeHmac(data) {
        return (0, node_crypto_1.createHmac)('sha256', this.SECRET_KEY).update(data).digest('hex');
    }
    generate(userId, ttl) {
        const issuedAt = this.now();
        const expiresAt = issuedAt + ttl;
        const userPart = (0, utils_1.base64UrlEncode)(userId);
        const iatPart = (0, utils_1.base64UrlEncode)(String(issuedAt));
        const expPart = (0, utils_1.base64UrlEncode)(String(expiresAt));
        const serialized = this.serialize(userPart, iatPart, expPart);
        const mac = this.computeHmac(serialized);
        return `${userPart}.${iatPart}.${expPart}.${mac}`;
    }
    verify(token) {
        const parts = token.split('.');
        if (parts.length !== 4)
            return { valid: false, reason: 'Invalid token format' };
        const [userPart, iatPart, expPart, mac] = parts;
        const serialized = this.serialize(userPart, iatPart, expPart);
        const expectedMac = this.computeHmac(serialized);
        if (!(0, utils_1.constantTimeEqual)(expectedMac, mac))
            return { valid: false, reason: 'Invalid token signature' };
        const expNumber = Number((0, utils_1.base64UrlDecode)(expPart));
        if (!Number.isFinite(expNumber))
            return { valid: false, reason: 'Invalid token expire date' };
        if (this.now() > expNumber)
            return { valid: false, reason: 'Token expired' };
        return { valid: true, userId: (0, utils_1.base64UrlDecode)(userPart) };
    }
};
exports.PassportService = PassportService;
exports.PassportService = PassportService = PassportService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(constants_1.PASSPORT_OPTIONS)),
    __metadata("design:paramtypes", [Object])
], PassportService);
