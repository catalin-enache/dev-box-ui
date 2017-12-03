'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.cache = undefined;
exports.default = getDBUWebComponent;

var _DBUWebComponentBase = require('../DBUWebComponentBase/DBUWebComponentBase');

var _DBUWebComponentBase2 = _interopRequireDefault(_DBUWebComponentBase);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

console.log('importing getDBUWebComponent');

const cache = exports.cache = new WeakMap();

function getDBUWebComponent(win) {
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
    </style>
    <b>I'm in shadow dom!</b>
    <slot></slot>
  `;

  class DBUWebComponent extends DBUWebComponentBase {
    static get componentName() {
      return 'dbu-web-component';
    }

    static get template() {
      return template;
    }
  }

  defineCommonStaticMethods(DBUWebComponent);

  cache.set(win, DBUWebComponent);

  return cache.get(win);
}