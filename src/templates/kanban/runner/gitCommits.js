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
exports.loadGitCommits = loadGitCommits;
exports.taskIdFromCommitSubject = taskIdFromCommitSubject;
exports.isBatchStepCommit = isBatchStepCommit;
exports.loadAgentCommits = loadAgentCommits;
const child_process_1 = require("child_process");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
/** Matches commitStandard: type(scope step): subject */
const AWP_COMMIT_PATTERN = /^(feat|fix|docs|test|chore|refactor)(\([^)]+\s+\d+(?:\.\d+)*\)):\s+.+/;
function loadGitCommits(appDir, limit = 30) {
    const gitDir = path.join(appDir, '.git');
    if (!fs.existsSync(gitDir))
        return [];
    try {
        const out = (0, child_process_1.execSync)(`git log -n ${limit} --pretty=format:%H%x1f%ai%x1f%an%x1f%s`, { cwd: appDir, encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] });
        return out
            .trim()
            .split('\n')
            .filter(Boolean)
            .map((line) => {
            const [hash, date, author, subject] = line.split('\x1f');
            return {
                hash,
                shortHash: hash.slice(0, 7),
                date,
                author,
                subject,
                isAwp: AWP_COMMIT_PATTERN.test(subject),
            };
        });
    }
    catch {
        return [];
    }
}
/** Extract task/step id from commitStandard subject e.g. feat(scaffold 1.0): ... */
function taskIdFromCommitSubject(subject) {
    const m = subject.match(/\([^)]+\s+(\d+(?:\.\d+)*)\)/);
    return m ? m[1] : '';
}
/** Step range in commit scope e.g. (console 1.0-9.0) — invalid for awp auto loop. */
function isBatchStepCommit(subject) {
    return /\(\s*[^)]*\s+\d+(?:\.\d+)?\s*-\s*\d+/.test(subject);
}
/** Commits matching AWP commitStandard (agent workflow commits). Excludes batch step ranges. */
function loadAgentCommits(appDir, limit = 30) {
    return loadGitCommits(appDir, limit).filter((c) => c.isAwp && !isBatchStepCommit(c.subject));
}
