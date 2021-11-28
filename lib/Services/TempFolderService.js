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
const path_1 = __importDefault(require("path"));
class TempFolderService {
    get path() {
        return path_1.default.resolve(__dirname, "..", "..", "tmp");
    }
    mountTempPath(filename) {
        return path_1.default.resolve(this.path, filename);
    }
    generate() {
        return __awaiter(this, void 0, void 0, function* () {
            const tmpFolderExists = fs_1.default.existsSync(this.path);
            if (!tmpFolderExists) {
                yield fs_1.default.promises.mkdir(this.path);
            }
        });
    }
    clean() {
        return __awaiter(this, void 0, void 0, function* () {
            yield fs_1.default.promises.rmdir(this.path, {
                recursive: true
            });
        });
    }
}
exports.default = new TempFolderService();
//# sourceMappingURL=TempFolderService.js.map