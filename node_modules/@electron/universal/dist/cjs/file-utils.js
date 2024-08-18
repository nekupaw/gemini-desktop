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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllAppFiles = exports.AppFileType = void 0;
const cross_spawn_promise_1 = require("@malept/cross-spawn-promise");
const fs = __importStar(require("fs-extra"));
const path = __importStar(require("path"));
const MACHO_PREFIX = 'Mach-O ';
var AppFileType;
(function (AppFileType) {
    AppFileType[AppFileType["MACHO"] = 0] = "MACHO";
    AppFileType[AppFileType["PLAIN"] = 1] = "PLAIN";
    AppFileType[AppFileType["INFO_PLIST"] = 2] = "INFO_PLIST";
    AppFileType[AppFileType["SNAPSHOT"] = 3] = "SNAPSHOT";
    AppFileType[AppFileType["APP_CODE"] = 4] = "APP_CODE";
})(AppFileType = exports.AppFileType || (exports.AppFileType = {}));
/**
 *
 * @param appPath Path to the application
 */
exports.getAllAppFiles = async (appPath) => {
    const files = [];
    const visited = new Set();
    const traverse = async (p) => {
        p = await fs.realpath(p);
        if (visited.has(p))
            return;
        visited.add(p);
        const info = await fs.stat(p);
        if (info.isSymbolicLink())
            return;
        if (info.isFile()) {
            let fileType = AppFileType.PLAIN;
            var fileOutput = '';
            try {
                fileOutput = await cross_spawn_promise_1.spawn('file', ['--brief', '--no-pad', p]);
            }
            catch (e) {
                if (e instanceof cross_spawn_promise_1.ExitCodeError) {
                    /* silently accept error codes from "file" */
                }
                else {
                    throw e;
                }
            }
            if (p.includes('app.asar')) {
                fileType = AppFileType.APP_CODE;
            }
            else if (fileOutput.startsWith(MACHO_PREFIX)) {
                fileType = AppFileType.MACHO;
            }
            else if (p.endsWith('.bin')) {
                fileType = AppFileType.SNAPSHOT;
            }
            else if (path.basename(p) === 'Info.plist') {
                fileType = AppFileType.INFO_PLIST;
            }
            files.push({
                relativePath: path.relative(appPath, p),
                type: fileType,
            });
        }
        if (info.isDirectory()) {
            for (const child of await fs.readdir(p)) {
                await traverse(path.resolve(p, child));
            }
        }
    };
    await traverse(appPath);
    return files;
};
//# sourceMappingURL=file-utils.js.map