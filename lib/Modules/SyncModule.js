"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const SMTPSenderService_1 = __importDefault(require("@/Services/SMTPSenderService"));
const GmailSenderService_1 = __importDefault(require("@/Services/GmailSenderService"));
const OutlookSenderService_1 = __importDefault(require("@/Services/OutlookSenderService"));
class SyncModule {
    constructor(senderConfig, kindleConfig) {
        this.senderConfig = senderConfig;
        this.kindleConfig = kindleConfig;
    }
    sync(document) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.sender.sendToKindle(document, this.kindleConfig);
        });
    }
    get sender() {
        const [config] = this.senderConfig;
        const senderMap = {
            smtp: new SMTPSenderService_1.default(config),
            gmail: new GmailSenderService_1.default(config.email, config.password),
            outlook: new OutlookSenderService_1.default(config.email, config.password)
        };
        return senderMap[config.type];
    }
}
exports.default = SyncModule;
//# sourceMappingURL=SyncModule.js.map