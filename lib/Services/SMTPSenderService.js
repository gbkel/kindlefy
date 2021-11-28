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
const nodemailer_1 = __importDefault(require("nodemailer"));
const FileUtil_1 = __importDefault(require("@/Utils/FileUtil"));
class SMTPSenderService {
    constructor(config, customTransportOptions) {
        const transportConfig = Object.assign({ port: config.port, host: config.host, auth: {
                user: config.user,
                pass: config.password
            } }, (customTransportOptions || {}));
        this.mailer = nodemailer_1.default.createTransport(transportConfig);
        this.config = config;
    }
    sendToKindle(document, kindleConfig) {
        return __awaiter(this, void 0, void 0, function* () {
            const fileMimetype = FileUtil_1.default.getMimetypeByFileName(document.filename);
            yield this.mailer.sendMail({
                from: this.config.email,
                to: kindleConfig.email,
                subject: `Kindlefy - ${document.title}`,
                text: document.title,
                attachments: [
                    {
                        filename: document.filename,
                        content: document.data,
                        contentType: fileMimetype
                    }
                ]
            });
        });
    }
}
exports.default = SMTPSenderService;
//# sourceMappingURL=SMTPSenderService.js.map