import { InputRule } from 'prosemirror-inputrules';
import tableOfContentsRule from '../rules/tableOfContents';
import Node from './Node';
export default class TableOfContents extends Node {
    get name(): string;
    get schema(): {
        attrs: {
            markup: {
                default: string;
            };
        };
        group: string;
        parseDOM: {
            tag: string;
        }[];
        toDOM: () => (string | any[] | {
            style: string;
        })[];
    };
    get rulePlugins(): (typeof tableOfContentsRule)[];
    commands({ type }: {
        type: any;
    }): (attrs: any) => (state: any, dispatch: any) => boolean;
    inputRules({ type }: {
        type: any;
    }): InputRule[];
    toMarkdown(state: any, node: any): void;
    parseMarkdown(): {
        node: string;
    };
}
//# sourceMappingURL=TableOfContents.d.ts.map