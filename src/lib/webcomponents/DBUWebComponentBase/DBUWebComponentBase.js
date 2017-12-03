
console.log('importing getDBUWebComponentBase');

export const cache = new WeakMap();

export default function getDBUWebComponentBase(win) {
  if (cache.has(win)) {
    return cache.get(win);
  }

  const { document, HTMLElement, customElements } = win;

  const template = document.createElement('template');
  template.innerHTML = '<style></style><slot></slot>';

  class DBUWebComponentBase extends HTMLElement {

    static get template() {
      return template;
    }

    constructor() {
      super();
      const { template } = this.constructor;
      if (template) {
        const shadowRoot = this.attachShadow({ mode: 'open' });
        shadowRoot.appendChild(template.content.cloneNode(true));
      }
    }

    connectedCallback() {
      if (this.hasAttribute('componentInstanceStyle')) {
        const componentInstanceStyle = this.getAttribute('componentInstanceStyle');
        this.shadowRoot.querySelector('style').innerHTML = componentInstanceStyle;
      }
    }
  }

  function defineCommonStaticMethods(klass) {
    Object.defineProperty(klass, 'componentStyle', {
      get() {
        return klass.template.content.querySelector('style').innerHTML;
      },
      set(value) {
        klass.template.content.querySelector('style').innerHTML = value;
      },
      enumerable: true,
      configurable: true
    });
    klass.registerSelf = () => {
      const componentName = klass.componentName;
      if (customElements.get(componentName)) return;
      customElements.define(componentName, klass);
    };
  }

  cache.set(win, {
    DBUWebComponentBase,
    defineCommonStaticMethods
  });

  return cache.get(win);

}
