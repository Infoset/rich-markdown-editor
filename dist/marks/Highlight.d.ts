import Mark from './Mark';
export default class Highlight extends Mark {
    get name(): string;
    get schema(): {
        parseDOM: {
            tag: string;
        }[];
        toDOM: () => string[];
    };
    inputRules({ type }: {
        type: any;
    }): import("prosemirror-inputrules").InputRule[];
    keys({ type }: {
        type: any;
    }): {
        'Mod-Ctrl-h': import("prosemirror-state").Command;
    };
    get rulePlugins(): ((md: any) => void)[];
    get toMarkdown(): {
        open: string;
        close: string;
        mixable: boolean;
        expelEnclosingWhitespace: boolean;
    };
    parseMarkdown(): {
        mark: string;
    };
}
//# sourceMappingURL=Highlight.d.ts.map