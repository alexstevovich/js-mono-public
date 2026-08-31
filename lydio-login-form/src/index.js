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

export class LydioLoginForm extends lydio.Tag {
  /**
   * @param {string} actionUrl  where to POST credentials
   * @param {object} [opts]
   * @param {string} [opts.usernameLabel="Username"]
   * @param {string} [opts.passwordLabel="Password"]
   * @param {string} [opts.submitLabel="Login"]
   * @param {string[]} [opts.classes=[]]
   */
  constructor(actionUrl, opts = {}) {
    const {
      usernameLabel = 'Username',
      passwordLabel = 'Password',
      submitLabel = 'Login',
    } = opts

    super('form')
    this.setAttribute('method', 'POST')
    this.setAttribute('action', actionUrl)

    this.form = this
    // Username
    this.usernameLabel = this.add(new lydio.Tag('label'))
    this.usernameLabel.setAttribute('for', 'username')
    this.usernameLabel.add(usernameLabel)

    this.usernameInput = this.add(new lydio.Leaf('input'))
    this.usernameInput.setAttribute('id', 'username')
    this.usernameInput.setAttribute('type', 'text')
    this.usernameInput.setAttribute('name', 'username')
    this.usernameInput.setAttribute('placeholder', usernameLabel)
    this.usernameInput.setAttribute('autocomplete', 'username')
    this.usernameInput.setAttribute('required')

    // Password
    this.passwordLabel = this.add(new lydio.Tag('label'))
    this.passwordLabel.setAttribute('for', 'password')
    this.passwordLabel.add(passwordLabel)

    this.passwordInput = this.add(new lydio.Leaf('input'))
    this.passwordInput.setAttribute('id', 'password')
    this.passwordInput.setAttribute('type', 'password')
    this.passwordInput.setAttribute('name', 'password')
    this.passwordInput.setAttribute('placeholder', passwordLabel)
    this.passwordInput.setAttribute('autocomplete', 'current-password')
    this.passwordInput.setAttribute('required')

    // Submit
    this.button = this.add(new lydio.Tag('button'))
    this.button.setAttribute('type', 'submit')
    this.button.add(submitLabel)
  }
}

export { LydioLoginForm as LoginForm }
export default LydioLoginForm
