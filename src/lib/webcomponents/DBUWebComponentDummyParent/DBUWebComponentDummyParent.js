

import getDBUWebComponentBase from '../DBUWebComponentBase/DBUWebComponentBase';
import getDBUWebComponentDummy from '../DBUWebComponentDummy/DBUWebComponentDummy';

export const cache = new WeakMap();

export default function getDBUWebComponentDummyParent(win) {
  if (cache.has(win)) return cache.get(win);

  const { DBUWebComponentBase, defineCommonStaticMethods } = getDBUWebComponentBase(win);
  const DBUWebComponentDummy = getDBUWebComponentDummy(win);

  const { document } = win;

  const template = document.createElement('template');
  template.innerHTML = `
    <style>
    :host {display: block;}
    </style>
    <b>I'm in shadow dom! (DBUWebComponentDummyParent)</b>
    <dbu-web-component-dummy><slot></slot></dbu-web-component-dummy>
  `;

  class DBUWebComponentDummyParent extends DBUWebComponentBase {
    static get componentName() {
      return 'dbu-web-component-dummy-parent';
    }

    static get template() {
      return template;
    }

    static get dependencies() {
      return [DBUWebComponentDummy];
    }

  }

  defineCommonStaticMethods(DBUWebComponentDummyParent);

  cache.set(win, DBUWebComponentDummyParent);

  return cache.get(win);

}

