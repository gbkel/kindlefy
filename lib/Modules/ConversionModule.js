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
const RSSConverterService_1 = __importDefault(require("@/Services/RSSConverterService"));
const MangaConverterService_1 = __importDefault(require("@/Services/MangaConverterService"));
class ConversionModule {
    convert(content) {
        return __awaiter(this, void 0, void 0, function* () {
            const converter = this.getConverterBySourceConfig(content.sourceConfig);
            return yield converter.convert(content);
        });
    }
    getConverterBySourceConfig(sourceConfig) {
        const converterMap = {
            rss: RSSConverterService_1.default,
            manga: MangaConverterService_1.default
        };
        return converterMap[sourceConfig.type];
    }
}
exports.default = ConversionModule;
//# sourceMappingURL=ConversionModule.js.map