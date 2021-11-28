"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoValidSetupInputFoundException = void 0;
class NoValidSetupInputFoundException extends Error {
    constructor() {
        super("No setup input config was found, make sure you have set it by environment variables or github actions variables.");
    }
}
exports.NoValidSetupInputFoundException = NoValidSetupInputFoundException;
//# sourceMappingURL=SetupInputException.js.map