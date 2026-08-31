/*
 * xml-to-tree
 *
 * Copyright (c) 2016 Alex Stevovich
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

import { DOMParser } from '@xmldom/xmldom'

/**
 * Parse XML → JSON tree (safe for fragments and multi-root)
 * @param {string} xml - XML string or fragment
 * @param {object} [options]
 * @param {string} [options.tagKey='tag'] - key used for tag name
 * @param {string} [options.childrenKey='children'] - key used for child nodes
 * @param {string} [options.textKey='text'] - key used for text content
 * @returns {object|array} JSON tree representation of the XML
 */
function xmlToTree(xml, options = {}) {
  const { tagKey = 'tag', childrenKey = 'children', textKey = 'text' } = options

  // Ensure the XML is wrapped so xmldom accepts fragments
  const wrapped = `<__marle_root__>${xml}</__marle_root__>`

  const dom = new DOMParser().parseFromString(wrapped, 'text/xml')
  const root = dom.documentElement

  function domToTree(node) {
    // Element nodes
    if (node.nodeType === 1) {
      const obj = {
        [tagKey]: node.tagName,
        [childrenKey]: [],
      }

      // Copy attributes directly
      if (node.attributes && node.attributes.length) {
        for (let i = 0; i < node.attributes.length; i++) {
          const attr = node.attributes[i]
          obj[attr.name] = attr.value
        }
      }

      // Recursively convert children
      for (let i = 0; i < node.childNodes.length; i++) {
        const child = domToTree(node.childNodes[i])
        if (child) obj[childrenKey].push(child)
      }

      return obj
    }

    if (node.nodeType === 3) {
      const value = node.nodeValue
      // If it's purely whitespace (no visible characters), ignore it
      if (!value.trim()) return null

      // Otherwise, preserve spacing exactly as-is
      return { [tagKey]: '#text', [textKey]: value }
    }

    // CDATA
    if (node.nodeType === 4) {
      return { [tagKey]: '#cdata', [textKey]: node.nodeValue }
    }

    return null
  }

  // Convert all children of the fake wrapper
  const children = Array.from(root.childNodes).map(domToTree).filter(Boolean)

  // Single root: return object, multiple: return array
  return children.length === 1 ? children[0] : children
}

export { xmlToTree }
export default xmlToTree
