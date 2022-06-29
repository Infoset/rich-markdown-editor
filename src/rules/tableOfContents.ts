import MarkdownIt from 'markdown-it';
import Token from 'markdown-it/lib/token';

export default function markdownItTableOfContents(md: MarkdownIt): void {
  md.renderer.rules['table_of_contents'] = () => `<!-- toc -->`;

  md.core.ruler.after('inline', 'table_of_contents', state => {
    const tokens = state.tokens;

    for (let i = 0; i < tokens.length - 1; i++) {
      const token = tokens[i];
      if (token && token.content === '<!-- toc -->') {
        const newToken = new Token('table_of_contents', '', 0);
        tokens.splice(i - 1, 3, newToken);
      }
    }
  });
}
