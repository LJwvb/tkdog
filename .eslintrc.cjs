/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution');

/**
 * Phase 1 质量门禁（务实版）：在原有 vue3-essential 基础上叠加高价值规则。
 * 设计原则：先"看见问题"（warn），再"卡死问题"（error），避免一次性 6000+ 报错压垮团队。
 * 后续 Phase 2 再整体升级到 plugin:vue/vue3-recommended。
 */
module.exports = {
  root: true,
  env: {
    node: true,
  },
  ignorePatterns: ['public/**', 'dist/**', 'node_modules/**'],
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/eslint-config-typescript',
    '@vue/eslint-config-prettier',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    // 组件命名：仅放行极少数必要的单单词组件，其余强制多单词
    // index/User/admin/register/Tinymce 为目录入口页或专有名词，属合理例外
    'vue/multi-word-component-names': [
      'error',
      {
        ignores: [
          'App',
          'Slide',
          'Login',
          'NavBar',
          'BottomBar',
          'index',
          'User',
          'admin',
          'register',
          'Tinymce',
        ],
      },
    ],
    // 类型安全：any 先 warn，给团队清零窗口（Phase 2 升 error）
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-unused-vars': [
      'error',
      { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
    ],
    '@typescript-eslint/no-empty-function': 'off',
    // 代码卫生
    'no-console': 'warn',
    'no-debugger': 'error',
    'prefer-const': 'error',
    'no-var': 'error',
    // 组件写法（warn，Phase 2 升 error）
    'vue/attributes-order': 'warn',
    'vue/no-v-html': 'warn',
    // 换行符统一：先不在这里硬卡（全仓当前为 CRLF，硬设 lf 会一次性报 6000+ 错误）。
    // 换行符规范化放在「一次性 prettier --write 提交」里做，见 ARCHITECTURE-AUDIT.md Phase 1 第 0 步。
    'prettier/prettier': ['error', { endOfLine: 'auto' }],
  },
  overrides: [
    {
      files: ['**/*.ts', '**/*.tsx', '**/*.vue'],
      rules: {
        'no-undef': 'off',
      },
    },
  ],
};
