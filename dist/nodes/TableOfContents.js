"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prosemirror_inputrules_1 = require("prosemirror-inputrules");
const tableOfContents_1 = __importDefault(require("../rules/tableOfContents"));
const Node_1 = __importDefault(require("./Node"));
class TableOfContents extends Node_1.default {
    get name() {
        return 'table_of_contents';
    }
    get schema() {
        return {
            attrs: {
                markup: {
                    default: '<!-- toc -->',
                },
            },
            group: 'block',
            parseDOM: [{ tag: 'table-of-contents' }],
            toDOM: () => [
                'table-of-contents',
                {
                    style: 'display: block; padding: 1em; margin: 1em 0; background: #f9f9f9;',
                },
                ['strong', this.options.dictionary.tableOfContents],
                ['br'],
                '∙ ...',
                ['br'],
                '∙ ...',
            ],
        };
    }
    get rulePlugins() {
        return [tableOfContents_1.default];
    }
    commands({ type }) {
        return attrs => (state, dispatch) => {
            dispatch(state.tr.replaceSelectionWith(type.create(attrs)).scrollIntoView());
            return true;
        };
    }
    inputRules({ type }) {
        return [
            new prosemirror_inputrules_1.InputRule(/<!-- toc -->$/, (state, match, start, end) => {
                const { tr } = state;
                if (match[0]) {
                    tr.replaceWith(start - 1, end, type.create());
                }
                return tr;
            }),
        ];
    }
    toMarkdown(state, node) {
        state.write(`\n${node.attrs.markup}`);
        state.closeBlock(node);
    }
    parseMarkdown() {
        return { node: 'table_of_contents' };
    }
}
exports.default = TableOfContents;
//# sourceMappingURL=TableOfContents.js.map