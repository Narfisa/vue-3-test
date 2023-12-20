module.exports = {
  root: true,
  env: {
    node: true
  },
  'extends': [
    'plugin:vue/vue3-essential',
    'eslint:recommended'
  ],
  parserOptions: {
    parser: '@typescript-eslint/parser'
  },
  rules: {
    indent: ['error', 4, { SwitchCase: 1 }],
    quotes: ['error', 'single'],
    semi: ['error', 'never'],
    'vue/multi-word-component-names': 'off',
    'vue/no-v-html': 'off',
    'vue/no-template-shadow': 'off',
    'array-callback-return': 0,
    'no-multiple-empty-lines': [2, { max: 3, maxEOF: 1 }],
    'no-console': 'off', // DEFAULT process.env.NODE_ENV === "production" ? "warn" : "off"
    'no-debugger': 'off', // DEFAULT process.env.NODE_ENV === "production" ? "warn" : "off"
    'vue/max-attributes-per-line': [
        'error',
        { singleline: 5, multiline: { max: 5 } }
    ],
    'vue/html-indent': ['warn', 4, {
        attribute: 1,
        baseIndent: 1,
        closeBracket: 0,
        alignAttributesVertically: true,
        ignores: []
    }],
    'vue/attribute-hyphenation': ['warn', 'never', {
        ignore: []
    }]
  }
}
