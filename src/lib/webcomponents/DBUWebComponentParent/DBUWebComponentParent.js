

import getDBUWebComponentBase from '../DBUWebComponentBase/DBUWebComponentBase';
import getDBUWebComponent from '../DBUWebComponent/DBUWebComponent';

export const cache = new WeakMap();

export default function getDBUWebComponentParent(win) {
  if (cache.has(win)) return cache.get(win);

  const { DBUWebComponentBase, defineCommonStaticMethods } = getDBUWebComponentBase(win);
  const DBUWebComponent = getDBUWebComponent(win);

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

