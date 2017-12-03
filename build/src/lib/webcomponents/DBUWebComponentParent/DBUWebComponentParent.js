'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.cache = undefined;
exports.default = getDBUWebComponentParent;

var _DBUWebComponentBase = require('../DBUWebComponentBase/DBUWebComponentBase');

var _DBUWebComponentBase2 = _interopRequireDefault(_DBUWebComponentBase);

var _DBUWebComponent = require('../DBUWebComponent/DBUWebComponent');

var _DBUWebComponent2 = _interopRequireDefault(_DBUWebComponent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const cache = exports.cache = new WeakMap();

function getDBUWebComponentParent(win) {
  if (cache.has(win)) return cache.get(win);

  const { DBUWebComponentBase, defineCommonStaticMethods } = (0, _DBUWebComponentBase2.default)(win);
  const DBUWebComponent = (0, _DBUWebComponent2.default)(win);

  const { document } = win;
  DBUWebComponent.registerSelf();
  const template = document.createElement('template');
  template.innerHTML = `
    <style>
    :host {display: block;}
    </style>
    <b>I'm in shadow dom! (parent)</b>
    <dbu-web-component>aaa</dbu-web-component>
    <slot></slot>
  `;

  class DBUWebComponentParent extends DBUWebComponentBase {
    static get componentName() {
      return 'dbu-web-component-parent';
    }

    static get template() {
      return template;
    }
  }

  defineCommonStaticMethods(DBUWebComponentParent);

  cache.set(win, DBUWebComponentParent);

  return cache.get(win);
}