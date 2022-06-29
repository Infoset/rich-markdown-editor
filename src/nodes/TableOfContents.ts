import { InputRule } from 'prosemirror-inputrules';
import tableOfContentsRule from '../rules/tableOfContents';
import Node from './Node';

export default class TableOfContents extends Node {
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
          style:
            'display: block; padding: 1em; margin: 1em 0; background: #f9f9f9;',
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
    return [tableOfContentsRule];
  }

  commands({ type }) {
    return attrs => (state, dispatch) => {
      dispatch(
        state.tr.replaceSelectionWith(type.create(attrs)).scrollIntoView()
      );
      return true;
    };
  }

  inputRules({ type }) {
    return [
      new InputRule(/<!-- toc -->$/, (state, match, start, end) => {
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
