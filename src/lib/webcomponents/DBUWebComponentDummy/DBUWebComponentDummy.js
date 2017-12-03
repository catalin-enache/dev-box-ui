
import getDBUWebComponentBase from '../DBUWebComponentBase/DBUWebComponentBase';

console.log('importing getDBUWebComponent');

export const cache = new WeakMap();

export default function getDBUWebComponentDummy(win) {
  if (cache.has(win)) return cache.get(win);

  const { DBUWebComponentBase, defineCommonStaticMethods } = getDBUWebComponentBase(win);
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

