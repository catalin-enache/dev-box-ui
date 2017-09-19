'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

let callbacks = [];

const localeAttrs = ['dir', 'lang'];

const rootElement = document.documentElement;

const locale = localeAttrs.reduce((acc, attr) => {
  acc[attr] = rootElement.getAttribute(attr);
  return acc;
}, {});

const observer = new MutationObserver(mutations => {
  mutations.forEach(mutation => {
    const mutationAttributeName = mutation.attributeName;
    if (localeAttrs.includes(mutationAttributeName)) {
      locale[mutationAttributeName] = rootElement.getAttribute(mutationAttributeName);
      callbacks.forEach(callback => callback(locale));
    }
  });
});

observer.observe(rootElement, {
  attributes: true
});

// observer.disconnect();


function registerLocaleChange(callback) {
  callbacks.push(callback);
  callback(locale);
  return function unregisterLocaleChange() {
    callbacks = callbacks.filter(cb => cb !== callback);
  };
}
registerLocaleChange.getCurrentLocale = () => locale;

exports.default = registerLocaleChange;