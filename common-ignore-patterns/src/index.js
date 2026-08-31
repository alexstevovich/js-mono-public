/*
 * ISC License
 *
 * Copyright (c) 2025 Alex Stevovich
 *
 * Permission to use, copy, modify, and/or distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
 * REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
 * AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
 * INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
 * LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
 * OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
 * PERFORMANCE OF THIS SOFTWARE.
 */

const commonIgnorePatterns = Object.freeze([
  'node_modules/',
  'dist/',
  'build/',
  'out/',
  'target/',
  'coverage/',
  '.nyc_output/',
  '__pycache__/',
  '*.py[cod]',
  '.pytest_cache/',
  '.mypy_cache/',
  '.hypothesis/',
  '.tox/',
  '.venv/',
  'venv/',
  '.gradle/',
  '*.class',
  'CMakeFiles/',
  'CMakeCache.txt',
  'cmake-build-*/',
  '*.o',
  '*.obj',
  '*.so',
  '*.dylib',
  '*.dll',
  '*.pdb',
  'DerivedData/',
  '*.xcworkspace/',
  '*.xcodeproj/',
  '.idea/',
  '.vscode/',
  '.history/',
  '*.swp',
  '*.swo',
  '*.bak',
  '*.tmp',
  '*.log',
  '.cache/',
  '.sass-cache/',
  '.DS_Store',
  'Thumbs.db',
  'Desktop.ini',
])

export default commonIgnorePatterns
export { commonIgnorePatterns }
