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
const fs_1 = __importDefault(require("fs"));
const rss_parser_1 = __importDefault(require("rss-parser"));
const epub_gen_1 = __importDefault(require("epub-gen"));
const node_calibre_1 = require("node-calibre");
const TempFolderService_1 = __importDefault(require("@/Services/TempFolderService"));
const FileUtil_1 = __importDefault(require("@/Utils/FileUtil"));
class RSSConverterService {
    constructor() {
        this.rssParser = new rss_parser_1.default();
        this.calibre = new node_calibre_1.Calibre();
    }
    convert(content) {
        return __awaiter(this, void 0, void 0, function* () {
            const epubFilePath = yield this.RSSToEPUB(content.data);
            const mobiFilePath = yield this.EPUBToMOBI(epubFilePath);
            const { filename, name } = FileUtil_1.default.parseFilePath(mobiFilePath);
            const mobiData = fs_1.default.createReadStream(mobiFilePath);
            return [{
                    title: name,
                    filename,
                    data: mobiData,
                    type: content.sourceConfig.type
                }];
        });
    }
    RSSToEPUB(rssBuffer) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const rssString = rssBuffer.toString();
            const parsedRSS = yield this.rssParser.parseString(rssString);
            const ebookConfig = {
                title: parsedRSS === null || parsedRSS === void 0 ? void 0 : parsedRSS.title,
                author: parsedRSS === null || parsedRSS === void 0 ? void 0 : parsedRSS.author,
                publisher: parsedRSS === null || parsedRSS === void 0 ? void 0 : parsedRSS.creator,
                cover: (_a = parsedRSS === null || parsedRSS === void 0 ? void 0 : parsedRSS.image) === null || _a === void 0 ? void 0 : _a.url,
                content: (_b = parsedRSS === null || parsedRSS === void 0 ? void 0 : parsedRSS.items) === null || _b === void 0 ? void 0 : _b.map(item => ({
                    title: item === null || item === void 0 ? void 0 : item.title,
                    author: item === null || item === void 0 ? void 0 : item.creator,
                    data: item === null || item === void 0 ? void 0 : item.content
                }))
            };
            const epubFileName = `${parsedRSS.title}.epub`;
            const epubFilePath = TempFolderService_1.default.mountTempPath(epubFileName);
            const epubParser = new epub_gen_1.default(ebookConfig, epubFilePath);
            yield epubParser.promise;
            return epubFilePath;
        });
    }
    EPUBToMOBI(epubFilePath) {
        return __awaiter(this, void 0, void 0, function* () {
            const mobiFilePath = yield this.calibre.ebookConvert(epubFilePath, "mobi");
            return mobiFilePath;
        });
    }
}
exports.default = new RSSConverterService();
//# sourceMappingURL=RSSConverterService.js.map