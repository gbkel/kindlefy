"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mime_types_1 = __importDefault(require("mime-types"));
const path_1 = __importDefault(require("path"));
class FileUtil {
    getMimetypeByFileName(filename) {
        return mime_types_1.default.lookup(filename) || null;
    }
    parseFilePath(filePath) {
        const filename = path_1.default.basename(filePath);
        const [name, extension] = filename.split(".");
        return {
            name,
            filename,
            extension
        };
    }
}
exports.default = new FileUtil();
//# sourceMappingURL=FileUtil.js.map