"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const cheerio = __importStar(require("cheerio"));
class MangaImporterService {
    constructor() {
        this.client = axios_1.default.create({
            baseURL: "http://w12.mangafreak.net"
        });
    }
    import(sourceConfig) {
        return __awaiter(this, void 0, void 0, function* () {
            const manga = yield this.getManga(sourceConfig.name);
            manga.chapters = manga.chapters
                .sort((a, b) => b.no - a.no)
                .slice(0, 1);
            return {
                data: manga,
                sourceConfig
            };
        });
    }
    getManga(name) {
        return __awaiter(this, void 0, void 0, function* () {
            const manga = yield this.searchManga(name);
            const mangaChapters = yield this.searchMangaChapters(manga.path);
            return {
                title: manga.title,
                chapters: mangaChapters
            };
        });
    }
    searchManga(name) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.client.get(`/Search/${name}`);
            const html = result.data;
            const $ = cheerio.load(html);
            const links = $("a");
            const mangaList = links.toArray()
                .filter(link => { var _a, _b; return (_b = (_a = link === null || link === void 0 ? void 0 : link.attribs) === null || _a === void 0 ? void 0 : _a.href) === null || _b === void 0 ? void 0 : _b.startsWith("/Manga/"); })
                .filter(link => { var _a, _b; return ((_b = (_a = link === null || link === void 0 ? void 0 : link.children) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.type) === "text"; })
                .map(link => {
                var _a, _b;
                return ({
                    path: link.attribs.href,
                    title: (_b = (_a = link === null || link === void 0 ? void 0 : link.children) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.data
                });
            });
            const [mostProbablyManga] = mangaList;
            return mostProbablyManga;
        });
    }
    searchMangaChapters(mangaPath) {
        return __awaiter(this, void 0, void 0, function* () {
            const mangaSlug = mangaPath.split("/").pop();
            const result = yield this.client.get(mangaPath);
            const html = result.data;
            const $ = cheerio.load(html);
            const rows = $("tbody > *").toArray();
            const chapters = rows.map((row, index) => {
                var _a, _b, _c, _d, _e, _f, _g, _h, _j;
                const subRows = row.children.filter(child => child.name === "td");
                const title = (_e = (_d = (_c = (_b = (_a = subRows === null || subRows === void 0 ? void 0 : subRows[0]) === null || _a === void 0 ? void 0 : _a.children) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.children) === null || _d === void 0 ? void 0 : _d[0]) === null || _e === void 0 ? void 0 : _e.data;
                const createdAt = (_h = (_g = (_f = subRows === null || subRows === void 0 ? void 0 : subRows[1]) === null || _f === void 0 ? void 0 : _f.children) === null || _g === void 0 ? void 0 : _g[0]) === null || _h === void 0 ? void 0 : _h.data;
                const chapterNumber = +((_j = title.match(/Chapter.\w+/g)[0]) === null || _j === void 0 ? void 0 : _j.replace(/\D/g, ""));
                const no = chapterNumber || (index + 1);
                return {
                    no,
                    title,
                    createdAt,
                    pagesFileUrl: `http://images.mangafreak.net/downloads/${mangaSlug}_${no}`
                };
            });
            return chapters;
        });
    }
}
exports.default = new MangaImporterService();
//# sourceMappingURL=MangaImporterService.js.map