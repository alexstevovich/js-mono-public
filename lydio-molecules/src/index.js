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

/**
 * Key–value layout component.
 * @param {object} [opts]
 * @param {string|string[]} [opts.rootClass='key-value'] - Root class or classes.
 * @param {string|string[]} [opts.keyClass='key'] - Class for the key element.
 * @param {string|string[]} [opts.valueClass='value'] - Class for the value element.
 */
class LydioKeyValue extends lydio.Tag {
  constructor(opts = {}) {
    const {
      rootClass = 'key_value',
      keyClass = 'key',
      valueClass = 'value',
    } = opts

    super('div').addClass(rootClass)

    this.key = this.add(new lydio.Tag('div'))
    this.key.addClass(keyClass)

    this.value = this.add(new lydio.Tag('div'))
    this.value.addClass(valueClass)
  }
}

/**
 * Two–column pair layout.
 * @param {object} [opts]
 * @param {string|string[]} [opts.rootClass='column-pair'] - Root class or classes.
 * @param {string|string[]} [opts.leftClass='left'] - Class for left column.
 * @param {string|string[]} [opts.rightClass='right'] - Class for right column.
 */
class LydioColumnPair extends lydio.Tag {
  constructor(opts = {}) {
    const {
      rootClass = 'column_pair',
      leftClass = 'left',
      rightClass = 'right',
    } = opts

    super('div').addClass(rootClass)

    this.left = this.add(new lydio.Tag('div'))
    this.left.addClass(leftClass)

    this.right = this.add(new lydio.Tag('div'))
    this.right.addClass(rightClass)
  }
}

/**
 * Masked element for applying image–based masks.
 * @param {object} [opts]
 * @param {string|string[]} [opts.rootClass='mask'] - Root class or classes.
 */
class LydioMask extends lydio.Tag {
  constructor(opts = {}) {
    const { rootClass = 'mask' } = opts
    super('div')
    this.addClass(rootClass)
  }

  set src(src) {
    const maskUrl = `url('${src}')`
    this.setStyle('-webkit-mask-image', maskUrl)
    this.setStyle('mask-image', maskUrl)
  }
}

export {
  LydioKeyValue as KeyValue,
  LydioColumnPair as ColumnPair,
  LydioMask as Mask,
}

export default {
  KeyValue: LydioKeyValue,
  ColumnPair: LydioColumnPair,
  Mask: LydioMask,
}
