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
const SyncModule_1 = __importDefault(require("@/Modules/SyncModule"));
const ImportationModule_1 = __importDefault(require("@/Modules/ImportationModule"));
const SetupInputModule_1 = __importDefault(require("@/Modules/SetupInputModule"));
const ConversionModule_1 = __importDefault(require("@/Modules/ConversionModule"));
const NotificationService_1 = __importDefault(require("@/Services/NotificationService"));
const TempFolderService_1 = __importDefault(require("@/Services/TempFolderService"));
class App {
    constructor() {
        this.setupInputModule = new SetupInputModule_1.default();
        this.importationModule = new ImportationModule_1.default();
        this.conversionModule = new ConversionModule_1.default();
    }
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            const config = yield NotificationService_1.default.task("Fetch setup input", (task) => __awaiter(this, void 0, void 0, function* () {
                const result = yield this.setupInputModule.fetch();
                task.setOutput(`Found kindle email (${result.kindle.email}), sources (${result.sources.length}), senders (${result.sender.length})`);
                return result;
            }));
            yield TempFolderService_1.default.generate();
            const syncModule = new SyncModule_1.default(config.sender, config.kindle);
            for (const source of config.sources) {
                yield NotificationService_1.default.task(`Sync ${source.type} source (${source.name || source.url})`, (task) => __awaiter(this, void 0, void 0, function* () {
                    task.setStatus("Importing source");
                    const importedSource = yield this.importationModule.import(source);
                    task.setStatus("Converting source into documents");
                    const documents = yield this.conversionModule.convert(importedSource);
                    for (const documentIndex in documents) {
                        const document = documents[documentIndex];
                        task.setStatus(`Syncing source documents: ${document.title} (${Number(documentIndex) + 1}/${documents.length})`);
                        yield syncModule.sync(document);
                    }
                    task.setOutput(`Successfully sync ${documents.length} documents (${documents.map(document => document.title).join(", ")})`);
                }));
            }
            yield TempFolderService_1.default.clean();
        });
    }
}
exports.default = App;
//# sourceMappingURL=App.js.map