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
exports.watchBacklogPaths = watchBacklogPaths;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
function walkAndWatch(dir, onEvent) {
    if (!fs.existsSync(dir))
        return;
    fs.watch(dir, (_event, filename) => {
        if (filename)
            onEvent(path.join(dir, filename));
    });
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        if (entry.isDirectory()) {
            walkAndWatch(path.join(dir, entry.name), onEvent);
        }
    }
}
/** Watch backlog markdown sources (recursive tasks/ + base + backlog). */
function watchBacklogPaths(backlogDir, onChange, debounceMs = 200) {
    let debounce = null;
    const fire = (filePath) => {
        if (debounce)
            clearTimeout(debounce);
        debounce = setTimeout(() => onChange(filePath), debounceMs);
    };
    const tasksDir = path.join(backlogDir, 'tasks');
    if (fs.existsSync(tasksDir)) {
        try {
            fs.watch(tasksDir, { recursive: true }, (_event, filename) => {
                if (filename)
                    fire(path.join(tasksDir, filename));
                else
                    fire(tasksDir);
            });
        }
        catch {
            walkAndWatch(tasksDir, (p) => fire(p));
        }
    }
    for (const name of ['base.md', 'backlog.md']) {
        const file = path.join(backlogDir, name);
        if (fs.existsSync(file)) {
            fs.watch(file, () => fire(file));
        }
    }
}
