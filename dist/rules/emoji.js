"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const gemoji_1 = require("gemoji");
const markdown_it_emoji_1 = __importDefault(require("markdown-it-emoji"));
function emoji(md) {
    return (0, markdown_it_emoji_1.default)(md, {
        defs: gemoji_1.nameToEmoji,
        shortcuts: {},
    });
}
exports.default = emoji;
//# sourceMappingURL=emoji.js.map