module.exports = {
  trailingComma: 'all',
  arrowParens: 'avoid',
  proseWrap: 'never',
  endOfLine: 'lf',
  useTabs: false,
  semi: true,
  singleQuote: true,
  tabWidth: 2,
  printWidth: 100,
  overrides: [
    {
      files: '.prettierrc',
      options: {
        parser: 'json',
      },
    },
    {
      files: 'document.ejs',
      options: {
        parser: 'html',
      },
    },
  ],
};
