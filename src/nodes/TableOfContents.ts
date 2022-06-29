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
      selectable: false,
      group: 'block',
      parseDOM: [{ tag: 'table_of_contents' }],
      toDOM: () => ['table_of_contents'],
    };
  }

  commands({ type }) {
    return () => (state, dispatch) => {
      dispatch(state.tr.replaceSelectionWith(type.create()).scrollIntoView());
      return true;
    };
  }

  toMarkdown(state) {
    state.write(`<!-- toc -->`);
  }

  parseMarkdown() {
    return { node: 'table_of_contents' };
  }
}
