/** @type {import('prettier').Config & import('prettier-plugin-tailwindcss').PluginOptions} */
export default {
  plugins: ['prettier-plugin-tailwindcss', 'prettier-plugin-organize-imports'],
  semi: true,
  singleQuote: true,
  trailingComma: 'all',
  bracketSpacing: true,
  tabWidth: 2,
  useTabs: false,
  printWidth: 80,
  endOfLine: 'auto',
};
