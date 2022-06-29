"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prosemirror_inputrules_1 = require("prosemirror-inputrules");
const Node_1 = __importDefault(require("./Node"));
const toggleWrap_1 = __importDefault(require("../commands/toggleWrap"));
const isNodeActive_1 = __importDefault(require("../queries/isNodeActive"));
class Blockquote extends Node_1.default {
    get name() {
        return 'blockquote';
    }
    get schema() {
        return {
            content: 'block+',
            group: 'block',
            defining: true,
            parseDOM: [{ tag: 'blockquote' }],
            toDOM: () => ['blockquote', 0],
        };
    }
    inputRules({ type }) {
        return [(0, prosemirror_inputrules_1.wrappingInputRule)(/^\s*>\s$/, type)];
    }
    commands({ type }) {
        return () => (0, toggleWrap_1.default)(type);
    }
    keys({ type }) {
        return {
            'Ctrl->': (0, toggleWrap_1.default)(type),
            'Mod-]': (0, toggleWrap_1.default)(type),
            'Shift-Enter': (state, dispatch) => {
                if (!(0, isNodeActive_1.default)(type)(state)) {
                    return false;
                }
                const { tr, selection } = state;
                dispatch(tr.split(selection.to));
                return true;
            },
        };
    }
    toMarkdown(state, node) {
        state.wrapBlock('> ', null, node, () => state.renderContent(node));
    }
    parseMarkdown() {
        return { block: 'blockquote' };
    }
}
exports.default = Blockquote;
//# sourceMappingURL=Blockquote.js.map