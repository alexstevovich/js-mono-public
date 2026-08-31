/*
 * Copyright 2015 Alex Stevovich (https://alexstevovich.com)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

function escapeHtml(value) {
  if (typeof value !== 'string') {
    value = String(value)
  }

  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function defineCoreType(cls, type) {
  Object.defineProperty(cls, 'nodeCoreType', {
    value: type,
    writable: false,
    configurable: false,
    enumerable: true,
  })
}

class LydioNode {
  constructor() {
    this._parentElement = null
    this._nodeId = null

    this._children = []

    this._tagName = null
    this._classes = new Set()
    this._attributes = {}
    this._styles = new Map()
    this._id = null
  }

  get nodeId() {
    return this._nodeId
  }

  set nodeId(value) {
    this._nodeId = value
  }

  get nodeType() {
    return this.constructor.nodeCoreType
  }

  get parent() {
    return this._parentElement
  }

  set parent(parentNode) {
    if (parentNode === null) {
      if (this._parentElement) {
        const oldParent = this._parentElement
        const index = oldParent._children.indexOf(this)

        if (index !== -1) {
          oldParent._children.splice(index, 1)
        }

        this._parentElement = null
      }

      return
    }

    if (!(parentNode instanceof LydioNode)) {
      throw new Error(
        '[Lydio Error]: parent only accepts a Lydio node or null.',
      )
    }

    if (typeof parentNode.add !== 'function') {
      throw new Error('[Lydio Error]: parent node cannot accept children.')
    }

    parentNode.add(this)
  }

  get root() {
    let node = this

    while (node._parentElement) {
      node = node._parentElement
    }

    return node
  }

  get tagName() {
    return this._tagName
  }

  get id() {
    return this._id
  }

  set id(value) {
    this._id = value
  }

  removeId() {
    this._id = null
  }

  addClass(className) {
    if (typeof className !== 'string' || !className.trim()) {
      throw new Error('[Lydio Error]: class name must be a non-empty string.')
    }

    this._classes.add(className)
  }

  removeClass(className) {
    this._classes.delete(className)
  }

  getClasses() {
    return Array.from(this._classes)
  }

  setAttribute(key, value = null) {
    if (typeof key !== 'string' || !key.trim()) {
      throw new Error(
        '[Lydio Error]: attribute key must be a non-empty string.',
      )
    }

    this._attributes[key] = value
  }

  removeAttribute(key) {
    delete this._attributes[key]
  }

  getAttribute(key) {
    return this._attributes[key] ?? null
  }

  setStyle(prop, value) {
    if (typeof prop !== 'string' || !prop.trim()) {
      throw new Error(
        '[Lydio Error]: style property must be a non-empty string.',
      )
    }

    this._styles.set(prop, value)
  }

  removeStyle(prop) {
    this._styles.delete(prop)
  }

  _renderAttributes() {
    const attrs = []

    if (this._classes.size) {
      attrs.push(`class="${Array.from(this._classes).join(' ')}"`)
    }

    if (this._id) {
      attrs.push(`id="${escapeHtml(this._id)}"`)
    }

    if (this._styles.size) {
      const styleText = Array.from(this._styles.entries())
        .map(([prop, value]) => `${prop}: ${value}`)
        .join('; ')

      attrs.push(
        `style="${escapeHtml(styleText.endsWith(';') ? styleText : styleText + ';')}"`,
      )
    }

    for (const [key, value] of Object.entries(this._attributes)) {
      if (key === 'class' || key === 'id' || key === 'style') {
        continue
      }

      if (value === null) {
        attrs.push(key)
      } else {
        attrs.push(`${key}="${escapeHtml(value)}"`)
      }
    }

    return attrs.length ? ' ' + attrs.join(' ') : ''
  }

  _childrenHtml() {
    return this._children.reduce((html, child) => html + child.toHtml(), '')
  }
}

class LydioContainerNode extends LydioNode {
  add(child) {
    if (
      typeof child === 'string' ||
      typeof child === 'number' ||
      typeof child === 'bigint'
    ) {
      child = text(child)
    }

    if (!(child instanceof LydioNode)) {
      throw new Error(
        '[Lydio Error]: add() only accepts a Lydio node, string, number, or bigint.',
      )
    }

    child.parent = null
    child._parentElement = this
    this._children.push(child)

    return child
  }

  addAt(child, index) {
    if (
      typeof child === 'string' ||
      typeof child === 'number' ||
      typeof child === 'bigint'
    ) {
      child = text(child)
    }

    if (!(child instanceof LydioNode)) {
      throw new Error(
        '[Lydio Error]: addAt() only accepts a Lydio node, string, number, or bigint.',
      )
    }

    child.parent = null
    child._parentElement = this
    this._children.splice(index, 0, child)

    return child
  }

  clear() {
    for (const child of this._children) {
      child._parentElement = null
    }

    this._children.length = 0
  }
}

class LydioTag extends LydioContainerNode {
  constructor(tagName) {
    super()

    if (typeof tagName !== 'string' || !tagName.trim()) {
      throw new Error('[Lydio Error]: tagName must be a non-empty string.')
    }

    Object.defineProperty(this, '_tagName', {
      value: tagName,
      writable: false,
      configurable: false,
      enumerable: false,
    })
  }

  toHtml() {
    const attrs = this._renderAttributes()
    const content = this._childrenHtml()

    return `<${this._tagName}${attrs}>${content}</${this._tagName}>`
  }
}

class LydioFragment extends LydioContainerNode {
  toHtml() {
    return this._childrenHtml()
  }
}

class LydioLeaf extends LydioNode {
  constructor(tagName) {
    super()

    if (typeof tagName !== 'string' || !tagName.trim()) {
      throw new Error('[Lydio Error]: tagName must be a non-empty string.')
    }

    Object.defineProperty(this, '_tagName', {
      value: tagName,
      writable: false,
      configurable: false,
      enumerable: false,
    })
  }

  toHtml({ xmlCompliant = false } = {}) {
    const attrs = this._renderAttributes()

    return xmlCompliant
      ? `<${this._tagName}${attrs}/>`
      : `<${this._tagName}${attrs}>`
  }
}

class LydioText extends LydioNode {
  constructor(content) {
    super()
    this._content = content
  }

  get content() {
    return this._content
  }

  set content(value) {
    this._content = value
  }

  toHtml() {
    return this._content
  }
}

class LydioDoctype extends LydioNode {
  constructor(type = 'html') {
    super()
    this._type = type
  }

  get type() {
    return this._type
  }

  set type(value) {
    this._type = value
  }

  toHtml() {
    return `<!DOCTYPE ${this._type}>`
  }
}

defineCoreType(LydioNode, 'node')
defineCoreType(LydioContainerNode, 'container')
defineCoreType(LydioTag, 'tag')
defineCoreType(LydioFragment, 'fragment')
defineCoreType(LydioLeaf, 'leaf')
defineCoreType(LydioText, 'text')
defineCoreType(LydioDoctype, 'doctype')

function tag(tagName) {
  return new LydioTag(tagName)
}

function leaf(tagName) {
  return new LydioLeaf(tagName)
}

function text(content) {
  return new LydioText(content)
}

function fragment() {
  return new LydioFragment()
}

function doctype(type = 'html') {
  return new LydioDoctype(type)
}

export {
  tag,
  leaf,
  text,
  fragment,
  doctype,
  LydioTag as Tag,
  LydioLeaf as Leaf,
  LydioText as Text,
  LydioFragment as Fragment,
  LydioDoctype as Doctype,
}

export default {
  tag,
  leaf,
  text,
  fragment,
  doctype,
  Tag: LydioTag,
  Leaf: LydioLeaf,
  Text: LydioText,
  Fragment: LydioFragment,
  Doctype: LydioDoctype,
}
