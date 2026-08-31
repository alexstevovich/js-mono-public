/*
 * Copyright 2024 Alex Stevovich
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

const propertyValuePairRegex = /([^:]+):([^;]*);/
const universalRegex =
  /(\/\*[\s\S]*?\*\/)|([^\s;{}][^;{}]*(?=\{))|(\})|([^;{}]+;(?!\s*\*\/))/gim

const selectorCaptureGroup = 2
const closingBraceCaptureGroup = 3
const decoratorCaptureGroup = 4

function isEmpty(value) {
  return typeof value === 'undefined' || value === null || value.length === 0
}

const defaultArgs = {
  ordered: false,
  comments: false,
  stripComments: false,
  split: false,
}

/**
 * Parses raw CSS into a structured JavaScript object.
 * @param {string} cssString - The raw CSS string.
 * @param {Object} options - Optional settings (e.g., comments).
 * @returns {Object} Parsed CSS structure.
 */
export function parseCss(cssString, options = {}) {
  let args = { ...defaultArgs, ...options }
  let root = { rules: [], declarations: [] }

  // Extract comments if enabled
  if (args.comments) {
    root.comments = []
    cssString = cssString.replace(/\/\*([\s\S]*?)\*\//g, (match) => {
      root.comments.push(match.trim())

      return '' // Remove from parsing process
    })
  }

  let stack = [root] // Stack to track nested rules
  let currentNode = root
  let match

  while ((match = universalRegex.exec(cssString)) !== null) {
    if (!isEmpty(match[selectorCaptureGroup])) {
      let selectors = match[selectorCaptureGroup]
        .trim()
        .split(',')
        .map((s) => s.trim())

      let newRule = { selectors, declarations: [], rules: [] }
      currentNode.rules.push(newRule)
      stack.push(currentNode)
      currentNode = newRule
    } else if (!isEmpty(match[closingBraceCaptureGroup])) {
      currentNode = stack.pop()
    } else if (!isEmpty(match[decoratorCaptureGroup])) {
      let line = match[decoratorCaptureGroup].trim()
      let attr = propertyValuePairRegex.exec(line)
      if (attr) {
        let attrName = attr[1].trim()
        let attrValue = attr[2].trim()

        currentNode.declarations.push({
          property: attrName,
          value: attrValue,
        })
      }
    }
  }

  return root
}

/**
 * Converts a structured JavaScript CSS object back into a raw CSS string.
 * @param {Object} parsedStructure - The structured CSS object.
 * @param {number} depth - (Internal) Depth for recursion.
 * @returns {string} Generated CSS string.
 */
export function serializeCss(parsedStructure, depth = 0) {
  let cssString = ''

  // Handle comments if present
  if (parsedStructure.comments) {
    parsedStructure.comments.forEach((comment) => {
      cssString += comment + '\n'
    })
  }

  parsedStructure.rules.forEach((rule) => {
    const selector = rule.selectors.join(',')
    cssString += selector + '{'
    rule.declarations.forEach((attr) => {
      cssString += `${attr.property}:${attr.value};`
    })

    // Recursively process nested rules
    rule.rules.forEach((nestedRule) => {
      cssString += serializeCss(
        { rules: [nestedRule], declarations: [] },
        depth + 1,
      )
    })

    cssString += '}'
  })

  return cssString
}
