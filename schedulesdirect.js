/**
 * Copyright (C) 2019. Drew Gauderman
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

//requirements
const request = require('request'),
  crypto = require('crypto'),
  pack = require('./package.json');

//returns sha1_hex hash of the string
const sha1hex = str =>
  crypto
    .createHash('sha1')
    .update(str, 'binary')
    .digest('hex');

//export the sonar class
module.exports = class SchedulesDirect {
  //class startup
  constructor(opts) {
    //require token or username/password
    if (!opts.hasOwnProperty('token') && !opts.hasOwnProperty('username') && !opts.hasOwnProperty('password')) {
      throw new Error('SchedulesDirect: Token or Username/Password is a required argument.');
    }

    //save options
    this.opts = {
      host: 'https://json.schedulesdirect.org/20141201',
      ...opts
    };
  }

  //request that returns a promise
  modem(opts, postData = []) {
    let options = {
      uri: `${this.opts.host}/${opts.action}`,
      method: opts.method || 'GET',
      headers: {
        'User-Agent': `${pack.name} ${pack.version}`
      },
      json: true
    };

    if (this.opts.token) {
      options.headers.token = this.opts.token;
    }

    if (postData) {
      options.json = postData;
    }

    return Promise.resolve()
      .then(async () => {
        //console.log('this.opts', this.opts);

        //token missing, so lets request one
        if (!this.opts.token && opts.action != 'token') {
          const tokenData = await this.getTokenData(this.opts.username, this.opts.password);

          if (!tokenData.token) {
            throw new Error(`SchedulesDirect: ${tokenData.code} ${tokenData.message}`);
          }

          //save token
          this.opts.token = tokenData.token;
          options.headers.token = tokenData.token;
        }
      })
      .then(() => new Promise((res, rej) => request(options, (e, r) => (e ? rej(e) : r.body.error ? rej(r.body.error) : res(r.body)))));
  }

  //get something
  get(action, opts = {}) {
    return this.modem({
      action: action,
      ...opts
    });
  }

  post(action, opts, postData) {
    if (!postData) {
      postData = opts;
      opts = {};
    }

    return this.modem(
      {
        method: 'POST',
        action: action,
        ...opts
      },
      postData
    );
  }

  //get new token
  getTokenData(username, password) {
    return this.modem(
      {
        method: 'POST',
        action: 'token'
      },
      {
        username: username,
        password: sha1hex(password)
      }
    );
  }
};
