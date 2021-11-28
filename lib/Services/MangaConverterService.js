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
const axios_1 = __importDefault(require("axios"));
const node_calibre_1 = require("node-calibre");
const fs_1 = __importDefault(require("fs"));
const TempFolderService_1 = __importDefault(require("@/Services/TempFolderService"));
const FileUtil_1 = __importDefault(require("@/Utils/FileUtil"));
class MangaConverterService {
    constructor() {
        this.calibre = new node_calibre_1.Calibre();
    }
    convert(content) {
        return __awaiter(this, void 0, void 0, function* () {
            const documents = [];
            for (const mangaChapter of content.data.chapters) {
                const fullChapterName = `${content.data.title} - ${mangaChapter.title}`;
                const cbzFilePath = yield this.URLToCBZ(mangaChapter.pagesFileUrl, fullChapterName);
                const mobiFilePath = yield this.CBZToMOBI(cbzFilePath);
                const mobiData = fs_1.default.createReadStream(mobiFilePath);
                const { filename } = FileUtil_1.default.parseFilePath(mobiFilePath);
                documents.push({
                    title: fullChapterName,
                    filename,
                    data: mobiData,
                    type: content.sourceConfig.type
                });
            }
            return documents;
        });
    }
    URLToCBZ(url, title) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield axios_1.default.get(url, {
                responseType: "stream"
            });
            const cbzFileName = `${title}.cbz`;
            const cbzFilePath = TempFolderService_1.default.mountTempPath(cbzFileName);
            yield fs_1.default.promises.writeFile(cbzFilePath, result.data);
            return cbzFilePath;
        });
    }
    CBZToMOBI(cbzFilePath) {
        return __awaiter(this, void 0, void 0, function* () {
            const mobiFilePath = yield this.calibre.ebookConvert(cbzFilePath, "mobi");
            return mobiFilePath;
        });
    }
}
exports.default = new MangaConverterService();
//# sourceMappingURL=MangaConverterService.js.map