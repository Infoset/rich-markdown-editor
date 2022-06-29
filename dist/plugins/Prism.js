"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LANGUAGES = void 0;
const flattenDeep_1 = __importDefault(require("lodash/flattenDeep"));
const prosemirror_state_1 = require("prosemirror-state");
const prosemirror_utils_1 = require("prosemirror-utils");
const prosemirror_view_1 = require("prosemirror-view");
const core_1 = require("refractor/lib/core");
exports.LANGUAGES = {
    none: 'None',
    bash: 'Bash',
    css: 'CSS',
    clike: 'C',
    csharp: 'C#',
    go: 'Go',
    markup: 'HTML',
    objectivec: 'Objective-C',
    java: 'Java',
    javascript: 'JavaScript',
    json: 'JSON',
    perl: 'Perl',
    php: 'PHP',
    powershell: 'Powershell',
    python: 'Python',
    ruby: 'Ruby',
    rust: 'Rust',
    sql: 'SQL',
    typescript: 'TypeScript',
    yaml: 'YAML',
};
const cache = {};
function getDecorations({ doc, name }) {
    const decorations = [];
    const blocks = (0, prosemirror_utils_1.findBlockNodes)(doc).filter(item => item.node.type.name === name);
    function parseNodes(nodes, classNames = []) {
        return nodes.map(node => {
            var _a, _b;
            if (node.type === 'element') {
                const classes = Array.isArray((_a = node.properties) === null || _a === void 0 ? void 0 : _a.className)
                    ? [...classNames, ...(((_b = node.properties) === null || _b === void 0 ? void 0 : _b.className.map(String)) || [])]
                    : [...classNames];
                return parseNodes(node.children, classes);
            }
            return {
                text: node.value,
                classes: classNames,
            };
        });
    }
    blocks.forEach(block => {
        let startPos = block.pos + 1;
        const language = block.node.attrs.language;
        if (!language || language === 'none' || !core_1.refractor.registered(language)) {
            return;
        }
        if (!cache[block.pos] || !cache[block.pos].node.eq(block.node)) {
            const root = core_1.refractor.highlight(block.node.textContent, language);
            const _decorations = (0, flattenDeep_1.default)(parseNodes(root.children))
                .map((node) => {
                const from = startPos;
                const to = from + node.text.length;
                startPos = to;
                return Object.assign(Object.assign({}, node), { from,
                    to });
            })
                .filter(node => node.classes && node.classes.length)
                .map(node => prosemirror_view_1.Decoration.inline(node.from, node.to, {
                class: node.classes.join(' '),
            }));
            cache[block.pos] = {
                node: block.node,
                decorations: _decorations,
            };
        }
        cache[block.pos].decorations.forEach(decoration => {
            decorations.push(decoration);
        });
    });
    Object.keys(cache)
        .filter(pos => !blocks.find(block => block.pos === Number(pos)))
        .forEach(pos => {
        delete cache[Number(pos)];
    });
    return prosemirror_view_1.DecorationSet.create(doc, decorations);
}
function Prism({ name }) {
    let highlighted = false;
    return new prosemirror_state_1.Plugin({
        key: new prosemirror_state_1.PluginKey('prism'),
        state: {
            init: (_, { doc }) => {
                return prosemirror_view_1.DecorationSet.create(doc, []);
            },
            apply: (transaction, decorationSet, oldState, state) => {
                const nodeName = state.selection.$head.parent.type.name;
                const previousNodeName = oldState.selection.$head.parent.type.name;
                const codeBlockChanged = transaction.docChanged && [nodeName, previousNodeName].includes(name);
                const ySyncEdit = !!transaction.getMeta('y-sync$');
                if (!highlighted || codeBlockChanged || ySyncEdit) {
                    highlighted = true;
                    return getDecorations({ doc: transaction.doc, name });
                }
                return decorationSet.map(transaction.mapping, transaction.doc);
            },
        },
        view: view => {
            if (!highlighted) {
                setTimeout(() => {
                    view.dispatch(view.state.tr.setMeta('prism', { loaded: true }));
                }, 10);
            }
            return {};
        },
        props: {
            decorations(state) {
                return this.getState(state);
            },
        },
    });
}
exports.default = Prism;
//# sourceMappingURL=Prism.js.map