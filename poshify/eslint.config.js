import js from '@eslint/js'
import globals from 'globals'

export default [
  { ignores: ['node_modules/**', 'coverage/**', 'dist/**', 'build/**'] },
  { ...js.configs.recommended, languageOptions: { globals: globals.node } },
]
