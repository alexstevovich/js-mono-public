/*
 * front-matter-yaml
 *
 *
 * Copyright 2014 Alex Stevovich
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

import yaml from 'js-yaml'

const FRONT_MATTER_REGEX = /^---[\r\n]+([\s\S]+?)[\r\n]+---[\r\n]*([\s\S]*)$/

/**
 * Parses YAML front matter and returns the extracted data and content.
 * @param {string} text - The full content containing front matter and content.
 * @returns {{ data: object, content: string }} - The parsed front matter and content.
 * @throws {TypeError} - If the input is not a string.
 * @throws {Error} - If the front matter format is invalid or YAML parsing fails.
 */
export function parse(text) {
  if (typeof text !== 'string') {
    throw new TypeError(`parse expected a string, but received ${typeof text}.`)
  }

  const match = text.match(FRONT_MATTER_REGEX)
  if (!match) {
    throw new Error(
      `Invalid front matter format. Ensure the document starts with "---" and follows YAML syntax.`,
    )
  }

  try {
    const data = yaml.load(match[1])

    return { data, content: match[2] || '' }
  } catch (error) {
    throw new Error(`YAML Parsing Error: ${error.message}`, { cause: error })
  }
}

/**
 * Serializes data and content into a formatted YAML front matter string.
 * @param {object} data - The front matter object.
 * @param {string} content - The document content.
 * @param {yaml.DumpOptions} [options={}] - Optional YAML dump configuration.
 * @returns {string} - The serialized front matter and content.
 * @throws {TypeError} - If data is not an object or content is not a string.
 */
export function serialize(data, content, options = {}) {
  if (typeof data !== 'object' || data === null) {
    throw new TypeError(
      `serialize expected an object, but received ${typeof data}.`,
    )
  }
  if (typeof content !== 'string') {
    throw new TypeError(
      `serialize expected a string, but received ${typeof content}.`,
    )
  }

  try {
    const frontMatter = yaml.dump(data, options).trim()

    return `---\n${frontMatter}\n---\n${content}`
  } catch (error) {
    throw new Error(`YAML Serialization Error: ${error.message}`, {
      cause: error,
    })
  }
}

/**
 * Validates whether a given text has properly formatted front matter and parsable YAML.
 * @param {string} text - The full document to validate.
 * @returns {boolean} - `true` if the format is valid and YAML is parsable, otherwise `false`.
 */
export function validate(text) {
  if (typeof text !== 'string') {
    return false
  }

  const match = text.match(FRONT_MATTER_REGEX)
  if (!match) {
    return false
  }

  try {
    yaml.load(match[1]) // Validate YAML

    return true
  } catch {
    return false // Invalid YAML
  }
}

export default { parse, serialize, validate }
