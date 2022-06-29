import flattenDeep from 'lodash/flattenDeep';
import { Node } from 'prosemirror-model';
import { Plugin, PluginKey } from 'prosemirror-state';
import { findBlockNodes } from 'prosemirror-utils';
import { Decoration, DecorationSet } from 'prosemirror-view';
import { RefractorElement, Text } from 'refractor';
import { refractor } from 'refractor/lib/core';

export const LANGUAGES = {
  none: 'None', // additional entry to disable highlighting
  bash: 'Bash',
  css: 'CSS',
  clike: 'C',
  csharp: 'C#',
  go: 'Go',
  markup: 'HTML',
  java: 'Java',
  javascript: 'JavaScript',
  json: 'JSON',
  php: 'PHP',
  powershell: 'Powershell',
  python: 'Python',
  ruby: 'Ruby',
  sql: 'SQL',
  typescript: 'TypeScript',
  yaml: 'YAML',
};

type ParsedNode = {
  text: string;
  classes: string[];
};

const cache: Record<number, { node: Node; decorations: Decoration[] }> = {};

function getDecorations({ doc, name }: { doc: Node; name: string }) {
  const decorations: Decoration[] = [];
  const blocks: { node: Node; pos: number }[] = findBlockNodes(doc).filter(
    item => item.node.type.name === name
  );

  function parseNodes(
    nodes: (RefractorElement | Text)[],
    classNames: string[] = []
  ): any {
    return nodes.map(node => {
      if (node.type === 'element') {
        const classes = Array.isArray(node.properties?.className)
          ? [...classNames, ...(node.properties?.className.map(String) || [])]
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
    if (!language || language === 'none' || !refractor.registered(language)) {
      return;
    }

    if (!cache[block.pos] || !cache[block.pos].node.eq(block.node)) {
      const root = refractor.highlight(block.node.textContent, language);
      const _decorations = flattenDeep(parseNodes(root.children))
        .map((node: ParsedNode) => {
          const from = startPos;
          const to = from + node.text.length;

          startPos = to;

          return {
            ...node,
            from,
            to,
          };
        })
        .filter(node => node.classes && node.classes.length)
        .map(node =>
          Decoration.inline(node.from, node.to, {
            class: node.classes.join(' '),
          })
        );

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

  return DecorationSet.create(doc, decorations);
}

export default function Prism({ name }) {
  let highlighted = false;

  return new Plugin({
    key: new PluginKey('prism'),
    state: {
      init: (_, { doc }) => {
        return DecorationSet.create(doc, []);
      },
      apply: (transaction, decorationSet, oldState, state) => {
        const nodeName = state.selection.$head.parent.type.name;
        const previousNodeName = oldState.selection.$head.parent.type.name;
        const codeBlockChanged =
          transaction.docChanged && [nodeName, previousNodeName].includes(name);

        if (!highlighted || codeBlockChanged) {
          highlighted = true;
          return getDecorations({ doc: transaction.doc, name });
        }

        return decorationSet.map(transaction.mapping, transaction.doc);
      },
    },
    view: view => {
      if (!highlighted) {
        // we don't highlight code blocks on the first render as part of mounting
        // as it's expensive (relative to the rest of the document). Instead let
        // it render un-highlighted and then trigger a defered render of Prism
        // by updating the plugins metadata
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
