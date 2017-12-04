
import LocaleService from '../../services/LocaleService';

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

    static get dependencies() {
      return [];
    }

    static get useShadow() {
      return true;
    }

    constructor() {
      super();
      const { useShadow } = this.constructor;
      if (useShadow) {
        this.attachShadow({ mode: 'open' });
      }
      this._insertTemplate();

      this.connectedCallback = this.connectedCallback.bind(this);
      this.disconnectedCallback = this.disconnectedCallback.bind(this);
      this._handleLocaleChange = this._handleLocaleChange.bind(this);
      this.onLocaleChange && (this.onLocaleChange = this.onLocaleChange.bind(this));
      this.unregisterLocaleChange = null;
    }

    connectedCallback() {

      window.addEventListener('beforeunload', this.disconnectedCallback, false);

      this.unregisterLocaleChange =
        LocaleService.onLocaleChange(this._handleLocaleChange);
    }

    disconnectedCallback() {
      this.unregisterLocaleChange();
      window.removeEventListener('beforeunload', this.disconnectedCallback, false);
    }

    get childrenTree() {
      return this.constructor.useShadow ? this.shadowRoot : this;
    }

    _insertTemplate() {
      const { template } = this.constructor;

      if (template) {
        this.childrenTree.appendChild(template.content.cloneNode(true));
      }
    }

    _handleLocaleChange(locale) {
      this.childrenTree.innerHTML = '';
      this._insertTemplate();
      this.setAttribute('dir', locale.dir);
      this.setAttribute('lang', locale.lang);
      this.onLocaleChange && this.onLocaleChange(locale);
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
      const dependencies = klass.dependencies;
      dependencies.forEach((dependency) => dependency.registerSelf());
      if (customElements.get(componentName)) return;
      const componentStyle = ((win.DBUWebComponents || {})[componentName] || {}).componentStyle;
      if (componentStyle) {
        klass.componentStyle += componentStyle;
      }
      customElements.define(componentName, klass);
    };
  }

  cache.set(win, {
    DBUWebComponentBase,
    defineCommonStaticMethods
  });

  return cache.get(win);

}
