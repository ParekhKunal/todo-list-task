module.exports = {
    env: {
        node: true,
        es2022: true,
        jest: true,
    },
    extends: ['eslint:recommended', 'prettier'],
    plugins: ['prettier'],
    parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
    },
    rules: {
        'prettier/prettier': 'error',
        'no-console': ['error', { allow: ['warn', 'error', 'info'] }],
        'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
};