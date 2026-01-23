module.exports = {
  root: true,
  env: { es6: true },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
  ],
  parserOptions: { ecmaVersion: 2021, sourceType: 'module' },
  settings: { react: { version: 'detect' } },
  rules: {
    'react/prop-types': 'off',
    'import/no-unresolved': ['error', { ignore: ['^@env$'] }],
  },
};
