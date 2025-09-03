module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'taro/react'
  ],
  plugins: [
    '@typescript-eslint',
    'react',
    'react-hooks'
  ],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    },
    project: './tsconfig.json'
  },
  settings: {
    react: {
      version: 'detect'
    }
  },
  env: {
    browser: true,
    es6: true,
    node: true
  },
  rules: {
    // TypeScript 规则 - 严格模式
    '@typescript-eslint/no-explicit-any': 'error', // 禁止使用 any 类型
    '@typescript-eslint/no-unused-vars': ['error', { 
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_' 
    }],
    '@typescript-eslint/explicit-function-return-type': 'warn', // 要求函数返回类型
    '@typescript-eslint/explicit-module-boundary-types': 'warn', // 要求模块边界类型
    '@typescript-eslint/no-non-null-assertion': 'warn', // 警告非空断言
    '@typescript-eslint/prefer-nullish-coalescing': 'warn', // 推荐使用 ??
    '@typescript-eslint/prefer-optional-chain': 'warn', // 推荐使用可选链
    
    // React 规则
    'react/react-in-jsx-scope': 'off', // React 17+ 不需要导入 React
    'react/prop-types': 'off', // 使用 TypeScript，不需要 prop-types
    'react/display-name': 'off',
    'react/no-unknown-property': ['error', { ignore: ['className'] }],
    
    // React Hooks 规则
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    
    // 通用规则
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'warn', // 生产环境禁用 console
    'no-debugger': 'warn',
    'no-unused-vars': 'off', // 使用 TypeScript 版本
    'prefer-const': 'warn',
    'no-var': 'error',
    
    // 代码格式
    'indent': ['warn', 2],
    'quotes': ['warn', 'single'],
    'semi': ['warn', 'never'],
    'comma-dangle': ['warn', 'never'],
    'object-curly-spacing': ['warn', 'always'],
    'array-bracket-spacing': ['warn', 'never'],
    
    // Taro 特定规则
    'no-undef': 'off' // Taro 全局变量
  },
  globals: {
    // Taro 全局变量
    wx: 'readonly',
    swan: 'readonly',
    tt: 'readonly',
    my: 'readonly',
    jd: 'readonly',
    qq: 'readonly',
    Taro: 'readonly',
    Component: 'readonly',
    Page: 'readonly',
    App: 'readonly',
    getApp: 'readonly',
    getCurrentPages: 'readonly'
  },
  ignorePatterns: [
    'dist/',
    'node_modules/',
    'config/',
    '*.config.js',
    '*.config.ts',
    '.eslintrc.js'
  ]
}