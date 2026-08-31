/*
 * Copyright 2025 Alex Stevovich
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Replaces multiple placeholders in a string using a key-value map.
 *
 * @param {string} content - The input string containing placeholders to replace.
 * @param {Record<string, string | number | null | undefined>} replacementsMap -
 *        An object mapping keys (placeholders) to their replacement values.
 * @returns {string} - A new string with all replacements applied.
 *
 * @example
 * const content = "Hello, {{name}}! You have {{count}} new messages.";
 * const replacements = { "{{name}}": "Alice", "{{count}}": 5 };
 * const result = replaceMany(content, replacements);
 * console.log(result); // "Hello, Alice! You have 5 new messages."
 */
export default function replaceStringMap(content, replacementsMap) {
  for (const [search, replace] of Object.entries(replacementsMap)) {
    content = content.replaceAll(search, replace)
  }

  return content
}
