
class LocaleService {
  constructor() {
    this._callbacks = [];
    this._localeAttrs = ['dir', 'lang'];
    this._rootElement = window.document.documentElement;
    this._locale = this._localeAttrs.reduce((acc, attr) => {
      acc[attr] = this._rootElement.getAttribute(attr);
      return acc;
    }, {});
    this._observer = new MutationObserver(this._handleMutations.bind(this));
    this._observer.observe(this._rootElement, {
      attributes: true
    });
  }

  _handleMutations(mutations) {
    mutations.forEach((mutation) => {
      const mutationAttributeName = mutation.attributeName;
      if (this._localeAttrs.includes(mutationAttributeName)) {
        this._locale = {
          ...this._locale,
          [mutationAttributeName]: this._rootElement.getAttribute(mutationAttributeName)
        };
        this._callbacks.forEach(callback => callback(this._locale));
      }
    });
  }

  get locale() {
    return this._locale;
  }

  onLocaleChange(callback) {
    this._callbacks.push(callback);
    callback(this.locale);
    return () => {
      this._callbacks = this._callbacks.filter(cb => cb !== callback);
    };
  }
}

const localeService = new LocaleService();
export default localeService;
