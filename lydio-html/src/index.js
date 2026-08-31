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

import { Doctype, Fragment, Leaf, Tag } from '@alexstevovich/lydio'

class LydioOl extends Tag {
  constructor() {
    super('ol')
  }

  addItem() {
    return this.add(new Tag('li'))
  }
}

class LydioUl extends Tag {
  constructor() {
    super('ul')
  }

  addItem() {
    return this.add(new Tag('li'))
  }
}

class LydioA extends Tag {
  constructor() {
    super('a')
  }

  get href() {
    return this.getAttribute('href')
  }

  set href(value) {
    this.setAttribute('href', value)
  }

  get ariaLabel() {
    return this.getAttribute('aria-label')
  }

  set ariaLabel(value) {
    this.setAttribute('aria-label', value)
  }

  setExternal() {
    this.setAttribute('rel', 'noopener noreferrer')
    this.setAttribute('target', '_blank')
  }
}

class LydioImg extends Leaf {
  constructor() {
    super('img')
    this.alt = ''
  }

  get src() {
    return this.getAttribute('src')
  }

  set src(value) {
    this.setAttribute('src', value)
  }

  get alt() {
    return this.getAttribute('alt')
  }

  set alt(value) {
    this.setAttribute('alt', value)
  }

  get ariaLabel() {
    return this.getAttribute('aria-label')
  }

  set ariaLabel(value) {
    this.setAttribute('aria-label', value)
  }

  get aspectRatio() {
    return this.getStyle('aspect-ratio')
  }

  set aspectRatio(value) {
    this.setStyle('aspect-ratio', value)
  }

  get maxHeight() {
    return this.getStyle('max-height')
  }

  set maxHeight(value) {
    this.setStyle('max-height', value)
  }

  get maxWidth() {
    return this.getStyle('max-width')
  }

  set maxWidth(value) {
    this.setStyle('max-width', value)
  }

  get fetchPriority() {
    return this.getAttribute('fetchpriority')
  }

  set fetchPriority(value) {
    if (value == null) {
      this.removeAttribute('fetchpriority')
      return
    }

    const allowed = new Set(['high', 'low', 'auto'])

    if (!allowed.has(value)) {
      throw new Error(
        `[Lydio Error]: Invalid fetchPriority '${value}'. Expected 'high', 'low', or 'auto'.`,
      )
    }

    this.setAttribute('fetchpriority', value)
  }

  get loading() {
    return this.getAttribute('loading')
  }

  set loading(value) {
    const LOADING_VALUES = new Set(['lazy', 'eager'])

    if (value == null) {
      this.removeAttribute('loading')
      return
    }

    if (!LOADING_VALUES.has(value)) {
      throw new Error(
        `[Lydio Error]: Invalid loading '${value}'. Expected 'lazy' or 'eager'.`,
      )
    }

    this.setAttribute('loading', value)
  }
}

class LydioMeta extends Leaf {
  constructor() {
    super('meta')
  }
}

class LydioMetaName extends LydioMeta {
  constructor(name, value = '') {
    super()

    this.setAttribute('name', name)

    if (value) {
      this.value = value
    }
  }

  get value() {
    return this.getAttribute('content')
  }

  set value(content) {
    this.setAttribute('content', content ?? '')
  }
}

class LydioMetaProperty extends LydioMeta {
  constructor(property, value = '') {
    super()

    this.setAttribute('property', property)

    if (value) {
      this.value = value
    }
  }

  get value() {
    return this.getAttribute('content')
  }

  set value(content) {
    this.setAttribute('content', content ?? '')
  }
}

class LydioScript extends Tag {
  constructor() {
    super('script')
  }

  get src() {
    return this.getAttribute('src')
  }

  set src(value) {
    this.setAttribute('src', value)
  }

  get type() {
    return this.getAttribute('type')
  }

  set type(value) {
    this.setAttribute('type', value)
  }

  module() {
    this.type = 'module'
  }

  loading(value) {
    this.setAttribute(value)
  }
}

class LydioLink extends Leaf {
  constructor() {
    super('link')
  }

  get rel() {
    return this.getAttribute('rel')
  }

  set rel(value) {
    this.setAttribute('rel', value)
  }

  get href() {
    return this.getAttribute('href')
  }

  set href(value) {
    this.setAttribute('href', value)
  }
}

class LydioHtml extends Tag {
  constructor(lang = 'en-US') {
    super('html')
    this.lang = lang
    this.head = this.add(new Tag('head'))
    this.body = this.add(new Tag('body'))
  }

  get lang() {
    return this.getAttribute('lang')
  }

  set lang(value) {
    this.setAttribute('lang', value)
  }
}

class LydioDom extends Fragment {
  constructor(lang = 'en-US') {
    super()

    this.add(new Doctype())
    this.html = this.add(new LydioHtml(lang))
    this.head = this.html.head
    this.body = this.html.body
  }
}

function ol() {
  return new LydioOl()
}

function ul() {
  return new LydioUl()
}

function a() {
  return new LydioA()
}

function img() {
  return new LydioImg()
}

function meta() {
  return new LydioMeta()
}

function metaName(name, value = '') {
  return new LydioMetaName(name, value)
}

function metaProperty(property, value = '') {
  return new LydioMetaProperty(property, value)
}

function script() {
  return new LydioScript()
}

function link() {
  return new LydioLink()
}

function html(lang = 'en-US') {
  return new LydioHtml(lang)
}

function dom(lang = 'en-US') {
  return new LydioDom(lang)
}

export {
  ol,
  ul,
  a,
  img,
  meta,
  metaName,
  metaProperty,
  script,
  link,
  html,
  dom,
  LydioOl as Ol,
  LydioUl as Ul,
  LydioA as A,
  LydioImg as Img,
  LydioMeta as Meta,
  LydioMetaName as MetaName,
  LydioMetaProperty as MetaProperty,
  LydioScript as Script,
  LydioLink as Link,
  LydioHtml as Html,
  LydioDom as Dom,
}

export default {
  ol,
  ul,
  a,
  img,
  meta,
  metaName,
  metaProperty,
  script,
  link,
  html,
  dom,
  Ol: LydioOl,
  Ul: LydioUl,
  A: LydioA,
  Img: LydioImg,
  Meta: LydioMeta,
  MetaName: LydioMetaName,
  MetaProperty: LydioMetaProperty,
  Script: LydioScript,
  Link: LydioLink,
  Html: LydioHtml,
  Dom: LydioDom,
}
