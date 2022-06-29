"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const token_1 = __importDefault(require("markdown-it/lib/token"));
function markdownItTableOfContents(md) {
    md.renderer.rules['table_of_contents'] = () => `<!-- toc -->`;
    md.core.ruler.after('inline', 'table_of_contents', state => {
        const tokens = state.tokens;
        for (let i = 0; i < tokens.length - 1; i++) {
            const token = tokens[i];
            if (token && token.content === '<!-- toc -->') {
                const newToken = new token_1.default('table_of_contents', '', 0);
                tokens.splice(i - 1, 3, newToken);
            }
        }
    });
}
exports.default = markdownItTableOfContents;
//# sourceMappingURL=tableOfContents.js.map