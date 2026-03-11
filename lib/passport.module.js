"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var PassportModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PassportModule = void 0;
const common_1 = require("@nestjs/common");
const constants_1 = require("./constants");
const passport_providers_1 = require("./passport.providers");
const passport_service_1 = require("./passport.service");
let PassportModule = PassportModule_1 = class PassportModule {
    static register(options) {
        const optionsProvider = (0, passport_providers_1.createPassportOptionsProvider)(options);
        return {
            module: PassportModule_1,
            providers: [optionsProvider, passport_service_1.PassportService],
            exports: [passport_service_1.PassportService, constants_1.PASSPORT_OPTIONS]
        };
    }
    static registerAsync(options) {
        const optionsProvider = (0, passport_providers_1.createPassportAsyncOptionsProvider)(options);
        return {
            module: PassportModule_1,
            imports: options.imports ?? [],
            providers: [optionsProvider, passport_service_1.PassportService],
            exports: [passport_service_1.PassportService, constants_1.PASSPORT_OPTIONS]
        };
    }
};
exports.PassportModule = PassportModule;
exports.PassportModule = PassportModule = PassportModule_1 = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({})
], PassportModule);
