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

import * as lydio from '@alexstevovich/lydio'
import MetaTags from '@alexstevovich/lydio-meta-tags'
import Schema from '@alexstevovich/lydio-schema'

export class LydioMegalodomHtml extends lydio.Tag {
  constructor(lang = 'en-US') {
    super('html')
    this.setAttribute('lang', lang)
    this.head = this.add(new lydio.Tag('head'))
    this.body = this.add(new lydio.Tag('body'))
    this.head.meta = this.head.add(new MetaTags())
    this.head.styles = this.head.add(new lydio.Fragment())
    this.head.scripts = this.head.add(new lydio.Fragment())
    this.head.schema = this.head.add(new Schema())
    this.body.premain = this.body.add(new lydio.Fragment())
    this.body.main = this.body.add(new lydio.Tag('main'))
    this.body.postmain = this.body.add(new lydio.Fragment())
  }
}

export class LydioMegalodomDom extends lydio.Fragment {
  constructor() {
    super()
    this.add(new lydio.Doctype())
    this.html = this.add(new LydioMegalodomHtml())
  }

  get schema() {
    return this.html.head.schema
  }
  get styles() {
    return this.html.head.styles
  }
  get scripts() {
    return this.html.head.scripts
  }
  get meta() {
    return this.html.head.meta
  }

  get head() {
    return this.html.head
  }

  get body() {
    return this.html.body
  }

  get main() {
    return this.html.body.main
  }

  set title(value) {
    this.meta.allTitle = value
  }

  set description(value) {
    this.meta.allDescription = value
  }

  set canonical(value) {
    this.meta.allCanonical = value
  }
}

export { LydioMegalodomDom as Dom, LydioMegalodomHtml as Html }
export default LydioMegalodomDom
