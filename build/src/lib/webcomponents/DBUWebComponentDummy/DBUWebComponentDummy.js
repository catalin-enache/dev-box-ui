'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.cache = undefined;
exports.default = getDBUWebComponentDummy;

var _DBUWebComponentBase = require('../DBUWebComponentBase/DBUWebComponentBase');

var _DBUWebComponentBase2 = _interopRequireDefault(_DBUWebComponentBase);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

console.log('importing getDBUWebComponent');

const cache = exports.cache = new WeakMap();

function getDBUWebComponentDummy(win) {
  if (cache.has(win)) return cache.get(win);

  const { DBUWebComponentBase, defineCommonStaticMethods } = (0, _DBUWebComponentBase2.default)(win);
  const { document } = win;
  const template = document.createElement('template');
  template.innerHTML = `
    <style>
    :host {
      display: block;
      color: maroon;
    }
    b {
      text-shadow: var(--b-text-shadow, none);
    }
    </style>
    <b>I'm in shadow dom!</b>
    <slot></slot>
  `;

  class DBUWebComponentDummy extends DBUWebComponentBase {
    static get componentName() {
      return 'dbu-web-component-dummy';
    }

    static get template() {
      return template;
    }
  }

  defineCommonStaticMethods(DBUWebComponentDummy);

  cache.set(win, DBUWebComponentDummy);

  return cache.get(win);
}