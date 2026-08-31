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

export class PropBase {}

export class Prop extends PropBase {
  constructor(name, value = '', { important = false } = {}) {
    super()
    this.name = name
    this.value = value
    this.important = important
  }

  setValue(value) {
    this.value = value
    return this
  }

  setImportant(flag = true) {
    this.important = flag
    return this
  }

  toCss() {
    return `${this.name}: ${this.value}${this.important ? ' !important' : ''};`
  }

  clone() {
    return new Prop(this.name, this.value, { important: this.important })
  }
}

export class Var extends Prop {
  constructor(name, value = '', options = {}) {
    // Enforce CSS var naming rule
    if (name.startsWith('--')) {
      throw new Error(
        `Do not prefix CSS variable names with "--" in Lydio-CSS: use "${name.slice(2)}" instead.`,
      )
    }
    super(`--${name}`, value, options)
  }

  get var() {
    return `var(${this.name})`
  }

  toCss() {
    const important = this.important ? ' !important' : ''
    return `${this.name}: ${this.value}${important};`
  }

  clone() {
    return new Var(this.name.slice(2), this.value, {
      important: this.important,
    })
  }
}

export class RuleBase {
  toCss() {
    throw new Error('Not implemented')
  }
  clone() {
    throw new Error('Not implemented')
  }
}

export class Rule extends RuleBase {
  constructor(selectors = []) {
    super()
    this.selectors = Array.isArray(selectors) ? selectors : [selectors]
    this.props = []
    this.rules = []
  }
  /** Build a :is(...) selector from list */
  static composeIs(...selectors) {
    return `:is(${selectors.join(', ')})`
  }

  /** Build a :where(...) selector from list */
  static composeWhere(...selectors) {
    return `:where(${selectors.join(', ')})`
  }
  chainSelector(selector) {
    this.selectors.push(selector)
    return this
  }

  addProp(name, value) {
    const prop = new Prop(name, value)
    this.props.push(prop)
    return prop
  }

  chainProp(name, value) {
    this.addProp(name, value)
    return this
  }

  addPropObj(prop) {
    if (!(prop instanceof Prop))
      throw new Error('addPropObj expects a Prop or subclass')
    this.props.push(prop)
    return prop
  }

  chainPropObj(prop) {
    this.addPropObj(prop)
    return this
  }

  addVar(name, value) {
    const prop = new Var(name, value)
    this.props.push(prop)
    return prop
  }

  chainVar(name, value) {
    this.addVar(name, value)
    return this
  }

  addRule(selector) {
    const rule = new Rule(selector)
    this.rules.push(rule)
    return rule
  }

  addRuleObj(rule) {
    if (!(rule instanceof RuleBase))
      throw new Error('addRuleObj expects a Rule or Sheet')
    this.rules.push(rule)
    return rule
  }

  apply(properties) {
    for (const [key, val] of Object.entries(properties)) this.addProp(key, val)
    return this
  }

  toCss(indentLevel = 0) {
    const indent = '  '.repeat(indentLevel)
    const innerIndent = '  '.repeat(indentLevel + 1)

    const props = this.props.map((p) => `${innerIndent}${p.toCss()}`).join('\n')
    const nested = this.rules.map((r) => r.toCss(indentLevel + 1)).join('\n')

    const isAtRule =
      this.selectors.length === 1 && this.selectors[0].trim().startsWith('@')

    if (isAtRule) {
      // Example: @media, @supports, @keyframes
      const selector = this.selectors[0]
      const content = [props, nested].filter(Boolean).join('\n')
      return `${indent}${selector} {\n${content}\n${indent}}`
    } else {
      // Normal CSS rule
      const selector = this.selectors.join(', ')
      const content = [props, nested].filter(Boolean).join('\n')
      return `${indent}${selector} {\n${content}\n${indent}}`
    }
  }

  clone() {
    const clone = new Rule([...this.selectors])
    clone.props = this.props.map((p) => p.clone())
    clone.rules = this.rules.map((r) => r.clone())
    return clone
  }
}

export class Sheet extends RuleBase {
  constructor() {
    super()
    this.rules = [] // may contain Rule or Sheet
  }

  addRule(selector) {
    const rule = new Rule(selector)
    this.rules.push(rule)
    return rule
  }

  addSheet() {
    const sheet = new Sheet()
    this.rules.push(sheet)
    return sheet
  }

  addRuleObj(rule) {
    if (!(rule instanceof RuleBase)) throw new Error('Expected a Rule or Sheet')
    this.rules.push(rule)
    return rule
  }

  toCss() {
    return this.rules
      .map((rule) => {
        if (rule instanceof Sheet) {
          return rule.toCss()
        } else if (rule instanceof Rule) {
          return rule.toCss()
        } else {
          console.warn('Invalid rule entry in sheet:', rule)
          return ''
        }
      })
      .filter(Boolean)
      .join('\n\n')
  }

  clone() {
    const clone = new Sheet()
    clone.rules = this.rules.map((r) => r.clone())
    return clone
  }
}

/** Utility helper */
export function applyPropertiesToRules(rules, properties) {
  rules.forEach((rule) => rule.apply(properties))
}
