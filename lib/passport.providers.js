"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPassportOptionsProvider = createPassportOptionsProvider;
exports.createPassportAsyncOptionsProvider = createPassportAsyncOptionsProvider;
const constants_1 = require("./constants");
function createPassportOptionsProvider(options) {
    return { provide: constants_1.PASSPORT_OPTIONS, useValue: Object.freeze({ ...options }) };
}
function createPassportAsyncOptionsProvider(options) {
    return {
        provide: constants_1.PASSPORT_OPTIONS,
        useFactory: async (...args) => {
            const resolved = await options.useFactory(args);
            if (!resolved || typeof resolved.secretKey !== 'string')
                throw new Error('[PassportModule] "secretKey" is required and must be a string');
            return Object.freeze({ ...resolved });
        },
        inject: options.inject ?? []
    };
}
