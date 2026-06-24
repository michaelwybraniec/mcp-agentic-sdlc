"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.watchGitHead = watchGitHead;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
/** Watch git refs/logs so the Kanban server can push commit updates over SSE. */
function watchGitHead(appDir, onChange, debounceMs = 400) {
    const gitDir = path.join(appDir, '.git');
    if (!fs.existsSync(gitDir))
        return;
    let debounce = null;
    const fire = () => {
        if (debounce)
            clearTimeout(debounce);
        debounce = setTimeout(() => onChange(), debounceMs);
    };
    const watchFile = (file) => {
        if (!fs.existsSync(file))
            return;
        fs.watch(file, fire);
    };
    watchFile(path.join(gitDir, 'logs', 'HEAD'));
    watchFile(path.join(gitDir, 'HEAD'));
    const refsHeads = path.join(gitDir, 'refs', 'heads');
    if (!fs.existsSync(refsHeads))
        return;
    try {
        fs.watch(refsHeads, { recursive: true }, fire);
    }
    catch {
        for (const name of fs.readdirSync(refsHeads)) {
            watchFile(path.join(refsHeads, name));
        }
    }
}
