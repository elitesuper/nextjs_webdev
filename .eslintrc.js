module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'react', 'prettier'],
  extends: [
    'plugin:@next/next/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:prettier/recommended',
  ],
  rules: {
    '@typescript-eslint/no-unused-vars': 'error',
    'react/react-in-jsx-scope': 'off',
  },
  globals: {
    React: 'writable',
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
}
