require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

const defaultLocale = {
  dir: 'ltr',
  lang: 'en'
};

class LocaleService {
  constructor() {
    this._callbacks = [];
    this._localeAttrs = Object.keys(defaultLocale);
    this._rootElement = window.document.documentElement;
    this._localeAttrs.forEach(attr => {
      if (!this._rootElement.getAttribute(attr)) {
        this._rootElement.setAttribute(attr, defaultLocale[attr]);
      }
    });
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
    mutations.forEach(mutation => {
      const mutationAttributeName = mutation.attributeName;
      if (this._localeAttrs.includes(mutationAttributeName)) {
        this._locale = Object.assign({}, this._locale, {
          [mutationAttributeName]: this._rootElement.getAttribute(mutationAttributeName)
        });
        this._callbacks.forEach(callback => callback(this._locale));
      }
    });
  }

  set locale(localeObj) {
    Object.keys(localeObj).forEach(key => {
      this._rootElement.setAttribute(key, localeObj[key]);
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
exports.default = localeService;

},{}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.cache = undefined;
exports.default = getDBUWebComponentBase;

var _LocaleService = require('../../services/LocaleService');

var _LocaleService2 = _interopRequireDefault(_LocaleService);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

console.log('importing getDBUWebComponentBase');

const cache = exports.cache = new WeakMap();

function getDBUWebComponentBase(win) {
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

      this.unregisterLocaleChange = _LocaleService2.default.onLocaleChange(this._handleLocaleChange);
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
      dependencies.forEach(dependency => dependency.registerSelf());
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

},{"../../services/LocaleService":1}],3:[function(require,module,exports){
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
    
    :host b {
      text-shadow: var(--b-text-shadow, none);
    }
    
    :host([dir=rtl]) b {
      text-decoration: underline;
      padding: 5px;
      border: 1px solid red;
    }
    :host([dir=ltr]) b {
      text-decoration: overline;
      padding: 5px;
      border: 1px solid green;
    }
    
    :host([dir=rtl]) span[x-has-slot] {
      float: left;
    }
    
    :host([dir=ltr]) span[x-has-slot] {
      float: right;
    }
    
    :host([dir=ltr]) *[dir=rtl] {
      display: none;
    }
    :host([dir=rtl]) *[dir=ltr] {
      display: none;
    }
    
    </style>
    
    <b dir="ltr">I'm in shadow dom! ltr (DBUWebComponentDummy)</b>
    <span x-has-slot><span>[</span><slot></slot><span>]</span></span>
    <b dir="rtl">I'm in shadow dom! rtl (DBUWebComponentDummy)</b>
  `;

  class DBUWebComponentDummy extends DBUWebComponentBase {
    static get componentName() {
      return 'dbu-web-component-dummy';
    }

    static get template() {
      return template;
    }

    onLocaleChange(locale) {
      console.log('onLocaleChange', locale);
    }
  }

  defineCommonStaticMethods(DBUWebComponentDummy);

  cache.set(win, DBUWebComponentDummy);

  return cache.get(win);
}

},{"../DBUWebComponentBase/DBUWebComponentBase":2}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.cache = undefined;
exports.default = getDBUWebComponentDummyParent;

var _DBUWebComponentBase = require('../DBUWebComponentBase/DBUWebComponentBase');

var _DBUWebComponentBase2 = _interopRequireDefault(_DBUWebComponentBase);

var _DBUWebComponentDummy = require('../DBUWebComponentDummy/DBUWebComponentDummy');

var _DBUWebComponentDummy2 = _interopRequireDefault(_DBUWebComponentDummy);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const cache = exports.cache = new WeakMap();

function getDBUWebComponentDummyParent(win) {
  if (cache.has(win)) return cache.get(win);

  const { DBUWebComponentBase, defineCommonStaticMethods } = (0, _DBUWebComponentBase2.default)(win);
  const DBUWebComponentDummy = (0, _DBUWebComponentDummy2.default)(win);

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

},{"../DBUWebComponentBase/DBUWebComponentBase":2,"../DBUWebComponentDummy/DBUWebComponentDummy":3}],"dev-box-ui-webcomponents":[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDBUWebComponentDummyParent = exports.getDBUWebComponentDummy = undefined;

var _DBUWebComponentDummy = require('./DBUWebComponentDummy/DBUWebComponentDummy');

var _DBUWebComponentDummy2 = _interopRequireDefault(_DBUWebComponentDummy);

var _DBUWebComponentDummyParent = require('./DBUWebComponentDummyParent/DBUWebComponentDummyParent');

var _DBUWebComponentDummyParent2 = _interopRequireDefault(_DBUWebComponentDummyParent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.getDBUWebComponentDummy = _DBUWebComponentDummy2.default;
exports.getDBUWebComponentDummyParent = _DBUWebComponentDummyParent2.default;

},{"./DBUWebComponentDummy/DBUWebComponentDummy":3,"./DBUWebComponentDummyParent/DBUWebComponentDummyParent":4}]},{},[])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvbGliL3NlcnZpY2VzL0xvY2FsZVNlcnZpY2UuanMiLCJzcmMvbGliL3dlYmNvbXBvbmVudHMvREJVV2ViQ29tcG9uZW50QmFzZS9EQlVXZWJDb21wb25lbnRCYXNlLmpzIiwic3JjL2xpYi93ZWJjb21wb25lbnRzL0RCVVdlYkNvbXBvbmVudER1bW15L0RCVVdlYkNvbXBvbmVudER1bW15LmpzIiwic3JjL2xpYi93ZWJjb21wb25lbnRzL0RCVVdlYkNvbXBvbmVudER1bW15UGFyZW50L0RCVVdlYkNvbXBvbmVudER1bW15UGFyZW50LmpzIiwic3JjL2xpYi9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7OztBQ0NBLE1BQU0sZ0JBQWdCO0FBQ3BCLE9BQUssS0FEZTtBQUVwQixRQUFNO0FBRmMsQ0FBdEI7O0FBS0EsTUFBTSxhQUFOLENBQW9CO0FBQ2xCLGdCQUFjO0FBQ1osU0FBSyxVQUFMLEdBQWtCLEVBQWxCO0FBQ0EsU0FBSyxZQUFMLEdBQW9CLE9BQU8sSUFBUCxDQUFZLGFBQVosQ0FBcEI7QUFDQSxTQUFLLFlBQUwsR0FBb0IsT0FBTyxRQUFQLENBQWdCLGVBQXBDO0FBQ0EsU0FBSyxZQUFMLENBQWtCLE9BQWxCLENBQTJCLElBQUQsSUFBVTtBQUNsQyxVQUFJLENBQUMsS0FBSyxZQUFMLENBQWtCLFlBQWxCLENBQStCLElBQS9CLENBQUwsRUFBMkM7QUFDekMsYUFBSyxZQUFMLENBQWtCLFlBQWxCLENBQStCLElBQS9CLEVBQXFDLGNBQWMsSUFBZCxDQUFyQztBQUNEO0FBQ0YsS0FKRDtBQUtBLFNBQUssT0FBTCxHQUFlLEtBQUssWUFBTCxDQUFrQixNQUFsQixDQUF5QixDQUFDLEdBQUQsRUFBTSxJQUFOLEtBQWU7QUFDckQsVUFBSSxJQUFKLElBQVksS0FBSyxZQUFMLENBQWtCLFlBQWxCLENBQStCLElBQS9CLENBQVo7QUFDQSxhQUFP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QVgsR0FBMkI7QUFDekIsYUFBTyxnQ0FBUDtBQUNEOztBQUVELGVBQVcsUUFBWCxHQUFzQjtBQUNwQixhQUFPLFFBQVA7QUFDRDs7QUFFRCxlQUFXLFlBQVgsR0FBMEI7QUFDeEIsYUFBTyxDQUFDLG9CQUFELENBQVA7QUFDRDs7QUFYMEQ7O0FBZTdELDRCQUEwQiwwQkFBMUI7O0FBRUEsUUFBTSxHQUFOLENBQVUsR0FBVixFQUFlLDBCQUFmOztBQUVBLFNBQU8sTUFBTSxHQUFOLENBQVUsR0FBVixDQUFQO0FBRUQ7Ozs7Ozs7Ozs7QUM1Q0Q7Ozs7QUFDQTs7Ozs7O1FBR0UsdUI7UUFDQSw2QiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJcbmNvbnN0IGRlZmF1bHRMb2NhbGUgPSB7XG4gIGRpcjogJ2x0cicsXG4gIGxhbmc6ICdlbidcbn07XG5cbmNsYXNzIExvY2FsZVNlcnZpY2Uge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLl9jYWxsYmFja3MgPSBbXTtcbiAgICB0aGlzLl9sb2NhbGVBdHRycyA9IE9iamVjdC5rZXlzKGRlZmF1bHRMb2NhbGUpO1xuICAgIHRoaXMuX3Jvb3RFbGVtZW50ID0gd2luZG93LmRvY3VtZW50LmRvY3VtZW50RWxlbWVudDtcbiAgICB0aGlzLl9sb2NhbGVBdHRycy5mb3JFYWNoKChhdHRyKSA9PiB7XG4gICAgICBpZiAoIXRoaXMuX3Jvb3RFbGVtZW50LmdldEF0dHJpYnV0ZShhdHRyKSkge1xuICAgICAgICB0aGlzLl9yb290RWxlbWVudC5zZXRBdHRyaWJ1dGUoYXR0ciwgZGVmYXVsdExvY2FsZVthdHRyXSk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgdGhpcy5fbG9jYWxlID0gdGhpcy5fbG9jYWxlQXR0cnMucmVkdWNlKChhY2MsIGF0dHIpID0+IHtcbiAgICAgIGFjY1thdHRyXSA9IHRoaXMuX3Jvb3RFbGVtZW50LmdldEF0dHJpYnV0ZShhdHRyKTtcbiAgICAgIHJldHVybiBhY2M7XG4gICAgfSwge30pO1xuICAgIHRoaXMuX29ic2VydmVyID0gbmV3IE11dGF0aW9uT2JzZXJ2ZXIodGhpcy5faGFuZGxlTXV0YXRpb25zLmJpbmQodGhpcykpO1xuICAgIHRoaXMuX29ic2VydmVyLm9ic2VydmUodGhpcy5fcm9vdEVsZW1lbnQsIHtcbiAgICAgIGF0dHJpYnV0ZXM6IHRydWVcbiAgICB9KTtcbiAgfVxuXG4gIF9oYW5kbGVNdXRhdGlvbnMobXV0YXRpb25zKSB7XG4gICAgbXV0YXRpb25zLmZvckVhY2goKG11dGF0aW9uKSA9PiB7XG4gICAgICBjb25zdCBtdXRhdGlvbkF0dHJpYnV0ZU5hbWUgPSBtdXRhdGlvbi5hdHRyaWJ1dGVOYW1lO1xuICAgICAgaWYgKHRoaXMuX2xvY2FsZUF0dHJzLmluY2x1ZGVzKG11dGF0aW9uQXR0cmlidXRlTmFtZSkpIHtcbiAgICAgICAgdGhpcy5fbG9jYWxlID0ge1xuICAgICAgICAgIC4uLnRoaXMuX2xvY2FsZSxcbiAgICAgICAgICBbbXV0YXRpb25BdHRyaWJ1dGVOYW1lXTogdGhpcy5fcm9vdEVsZW1lbnQuZ2V0QXR0cmlidXRlKG11dGF0aW9uQXR0cmlidXRlTmFtZSlcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5fY2FsbGJhY2tzLmZvckVhY2goY2FsbGJhY2sgPT4gY2FsbGJhY2sodGhpcy5fbG9jYWxlKSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBzZXQgbG9jYWxlKGxvY2FsZU9iaikge1xuICAgIE9iamVjdC5rZXlzKGxvY2FsZU9iaikuZm9yRWFjaCgoa2V5KSA9PiB7XG4gICAgICB0aGlzLl9yb290RWxlbWVudC5zZXRBdHRyaWJ1dGUoa2V5LCBsb2NhbGVPYmpba2V5XSk7XG4gICAgfSk7XG4gIH1cblxuICBnZXQgbG9jYWxlKCkge1xuICAgIHJldHVybiB0aGlzLl9sb2NhbGU7XG4gIH1cblxuICBvbkxvY2FsZUNoYW5nZShjYWxsYmFjaykge1xuICAgIHRoaXMuX2NhbGxiYWNrcy5wdXNoKGNhbGxiYWNrKTtcbiAgICBjYWxsYmFjayh0aGlzLmxvY2FsZSk7XG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgIHRoaXMuX2NhbGxiYWNrcyA9IHRoaXMuX2NhbGxiYWNrcy5maWx0ZXIoY2IgPT4gY2IgIT09IGNhbGxiYWNrKTtcbiAgICB9O1xuICB9XG59XG5cbmNvbnN0IGxvY2FsZVNlcnZpY2UgPSBuZXcgTG9jYWxlU2VydmljZSgpO1xuZXhwb3J0IGRlZmF1bHQgbG9jYWxlU2VydmljZTtcbiIsIlxuaW1wb3J0IExvY2FsZVNlcnZpY2UgZnJvbSAnLi4vLi4vc2VydmljZXMvTG9jYWxlU2VydmljZSc7XG5cbmNvbnNvbGUubG9nKCdpbXBvcnRpbmcgZ2V0REJVV2ViQ29tcG9uZW50QmFzZScpO1xuXG5leHBvcnQgY29uc3QgY2FjaGUgPSBuZXcgV2Vha01hcCgpO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBnZXREQlVXZWJDb21wb25lbnRCYXNlKHdpbikge1xuICBpZiAoY2FjaGUuaGFzKHdpbikpIHtcbiAgICByZXR1cm4gY2FjaGUuZ2V0KHdpbik7XG4gIH1cblxuICBjb25zdCB7IGRvY3VtZW50LCBIVE1MRWxlbWVudCwgY3VzdG9tRWxlbWVudHMgfSA9IHdpbjtcblxuICBjb25zdCB0ZW1wbGF0ZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RlbXBsYXRlJyk7XG4gIHRlbXBsYXRlLmlubmVySFRNTCA9ICc8c3R5bGU+PC9zdHlsZT48c2xvdD48L3Nsb3Q+JztcblxuICBjbGFzcyBEQlVXZWJDb21wb25lbnRCYXNlIGV4dGVuZHMgSFRNTEVsZW1lbnQge1xuXG4gICAgc3RhdGljIGdldCB0ZW1wbGF0ZSgpIHtcbiAgICAgIHJldHVybiB0ZW1wbGF0ZTtcbiAgICB9XG5cbiAgICBzdGF0aWMgZ2V0IGRlcGVuZGVuY2llcygpIHtcbiAgICAgIHJldHVybiBbXTtcbiAgICB9XG5cbiAgICBzdGF0aWMgZ2V0IHVzZVNoYWRvdygpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgc3VwZXIoKTtcbiAgICAgIGNvbnN0IHsgdXNlU2hhZG93IH0gPSB0aGlzLmNvbnN0cnVjdG9yO1xuICAgICAgaWYgKHVzZVNoYWRvdykge1xuICAgICAgICB0aGlzLmF0dGFjaFNoYWRvdyh7IG1vZGU6ICdvcGVuJyB9KTtcbiAgICAgIH1cbiAgICAgIHRoaXMuX2luc2VydFRlbXBsYXRlKCk7XG5cbiAgICAgIHRoaXMuY29ubmVjdGVkQ2FsbGJhY2sgPSB0aGlzLmNvbm5lY3RlZENhbGxiYWNrLmJpbmQodGhpcyk7XG4gICAgICB0aGlzLmRpc2Nvbm5lY3RlZENhbGxiYWNrID0gdGhpcy5kaXNjb25uZWN0ZWRDYWxsYmFjay5iaW5kKHRoaXMpO1xuICAgICAgdGhpcy5faGFuZGxlTG9jYWxlQ2hhbmdlID0gdGhpcy5faGFuZGxlTG9jYWxlQ2hhbmdlLmJpbmQodGhpcyk7XG4gICAgICB0aGlzLm9uTG9jYWxlQ2hhbmdlICYmICh0aGlzLm9uTG9jYWxlQ2hhbmdlID0gdGhpcy5vbkxvY2FsZUNoYW5nZS5iaW5kKHRoaXMpKTtcbiAgICAgIHRoaXMudW5yZWdpc3RlckxvY2FsZUNoYW5nZSA9IG51bGw7XG4gICAgfVxuXG4gICAgY29ubmVjdGVkQ2FsbGJhY2soKSB7XG5cbiAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdiZWZvcmV1bmxvYWQnLCB0aGlzLmRpc2Nvbm5lY3RlZENhbGxiYWNrLCBmYWxzZSk7XG5cbiAgICAgIHRoaXMudW5yZWdpc3RlckxvY2FsZUNoYW5nZSA9XG4gICAgICAgIExvY2FsZVNlcnZpY2Uub25Mb2NhbGVDaGFuZ2UodGhpcy5faGFuZGxlTG9jYWxlQ2hhbmdlKTtcbiAgICB9XG5cbiAgICBkaXNjb25uZWN0ZWRDYWxsYmFjaygpIHtcbiAgICAgIHRoaXMudW5yZWdpc3RlckxvY2FsZUNoYW5nZSgpO1xuICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2JlZm9yZXVubG9hZCcsIHRoaXMuZGlzY29ubmVjdGVkQ2FsbGJhY2ssIGZhbHNlKTtcbiAgICB9XG5cbiAgICBnZXQgY2hpbGRyZW5UcmVlKCkge1xuICAgICAgcmV0dXJuIHRoaXMuY29uc3RydWN0b3IudXNlU2hhZG93ID8gdGhpcy5zaGFkb3dSb290IDogdGhpcztcbiAgICB9XG5cbiAgICBfaW5zZXJ0VGVtcGxhdGUoKSB7XG4gICAgICBjb25zdCB7IHRlbXBsYXRlIH0gPSB0aGlzLmNvbnN0cnVjdG9yO1xuXG4gICAgICBpZiAodGVtcGxhdGUpIHtcbiAgICAgICAgdGhpcy5jaGlsZHJlblRyZWUuYXBwZW5kQ2hpbGQodGVtcGxhdGUuY29udGVudC5jbG9uZU5vZGUodHJ1ZSkpO1xuICAgICAgfVxuICAgIH1cblxuICAgIF9oYW5kbGVMb2NhbGVDaGFuZ2UobG9jYWxlKSB7XG4gICAgICB0aGlzLmNoaWxkcmVuVHJlZS5pbm5lckhUTUwgPSAnJztcbiAgICAgIHRoaXMuX2luc2VydFRlbXBsYXRlKCk7XG4gICAgICB0aGlzLnNldEF0dHJpYnV0ZSgnZGlyJywgbG9jYWxlLmRpcik7XG4gICAgICB0aGlzLnNldEF0dHJpYnV0ZSgnbGFuZycsIGxvY2FsZS5sYW5nKTtcbiAgICAgIHRoaXMub25Mb2NhbGVDaGFuZ2UgJiYgdGhpcy5vbkxvY2FsZUNoYW5nZShsb2NhbGUpO1xuICAgIH1cblxuICB9XG5cbiAgZnVuY3Rpb24gZGVmaW5lQ29tbW9uU3RhdGljTWV0aG9kcyhrbGFzcykge1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShrbGFzcywgJ2NvbXBvbmVudFN0eWxlJywge1xuICAgICAgZ2V0KCkge1xuICAgICAgICByZXR1cm4ga2xhc3MudGVtcGxhdGUuY29udGVudC5xdWVyeVNlbGVjdG9yKCdzdHlsZScpLmlubmVySFRNTDtcbiAgICAgIH0sXG4gICAgICBzZXQodmFsdWUpIHtcbiAgICAgICAga2xhc3MudGVtcGxhdGUuY29udGVudC5xdWVyeVNlbGVjdG9yKCdzdHlsZScpLmlubmVySFRNTCA9IHZhbHVlO1xuICAgICAgfSxcbiAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9KTtcbiAgICBrbGFzcy5yZWdpc3RlclNlbGYgPSAoKSA9PiB7XG4gICAgICBjb25zdCBjb21wb25lbnROYW1lID0ga2xhc3MuY29tcG9uZW50TmFtZTtcbiAgICAgIGNvbnN0IGRlcGVuZGVuY2llcyA9IGtsYXNzLmRlcGVuZGVuY2llcztcbiAgICAgIGRlcGVuZGVuY2llcy5mb3JFYWNoKChkZXBlbmRlbmN5KSA9PiBkZXBlbmRlbmN5LnJlZ2lzdGVyU2VsZigpKTtcbiAgICAgIGlmIChjdXN0b21FbGVtZW50cy5nZXQoY29tcG9uZW50TmFtZSkpIHJldHVybjtcbiAgICAgIGNvbnN0IGNvbXBvbmVudFN0eWxlID0gKCh3aW4uREJVV2ViQ29tcG9uZW50cyB8fCB7fSlbY29tcG9uZW50TmFtZV0gfHwge30pLmNvbXBvbmVudFN0eWxlO1xuICAgICAgaWYgKGNvbXBvbmVudFN0eWxlKSB7XG4gICAgICAgIGtsYXNzLmNvbXBvbmVudFN0eWxlICs9IGNvbXBvbmVudFN0eWxlO1xuICAgICAgfVxuICAgICAgY3VzdG9tRWxlbWVudHMuZGVmaW5lKGNvbXBvbmVudE5hbWUsIGtsYXNzKTtcbiAgICB9O1xuICB9XG5cbiAgY2FjaGUuc2V0KHdpbiwge1xuICAgIERCVVdlYkNvbXBvbmVudEJhc2UsXG4gICAgZGVmaW5lQ29tbW9uU3RhdGljTWV0aG9kc1xuICB9KTtcblxuICByZXR1cm4gY2FjaGUuZ2V0KHdpbik7XG5cbn1cbiIsIlxuaW1wb3J0IGdldERCVVdlYkNvbXBvbmVudEJhc2UgZnJvbSAnLi4vREJVV2ViQ29tcG9uZW50QmFzZS9EQlVXZWJDb21wb25lbnRCYXNlJztcblxuY29uc29sZS5sb2coJ2ltcG9ydGluZyBnZXREQlVXZWJDb21wb25lbnQnKTtcblxuZXhwb3J0IGNvbnN0IGNhY2hlID0gbmV3IFdlYWtNYXAoKTtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZ2V0REJVV2ViQ29tcG9uZW50RHVtbXkod2luKSB7XG4gIGlmIChjYWNoZS5oYXMod2luKSkgcmV0dXJuIGNhY2hlLmdldCh3aW4pO1xuXG4gIGNvbnN0IHsgREJVV2ViQ29tcG9uZW50QmFzZSwgZGVmaW5lQ29tbW9uU3RhdGljTWV0aG9kcyB9ID0gZ2V0REJVV2ViQ29tcG9uZW50QmFzZSh3aW4pO1xuICBjb25zdCB7IGRvY3VtZW50IH0gPSB3aW47XG5cbiAgY29uc3QgdGVtcGxhdGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZW1wbGF0ZScpO1xuICB0ZW1wbGF0ZS5pbm5lckhUTUwgPSBgXG4gICAgPHN0eWxlPlxuICAgIDpob3N0IHtcbiAgICAgIGRpc3BsYXk6IGJsb2NrO1xuICAgICAgY29sb3I6IG1hcm9vbjtcbiAgICB9XG4gICAgXG4gICAgOmhvc3QgYiB7XG4gICAgICB0ZXh0LXNoYWRvdzogdmFyKC0tYi10ZXh0LXNoYWRvdywgbm9uZSk7XG4gICAgfVxuICAgIFxuICAgIDpob3N0KFtkaXI9cnRsXSkgYiB7XG4gICAgICB0ZXh0LWRlY29yYXRpb246IHVuZGVybGluZTtcbiAgICAgIHBhZGRpbmc6IDVweDtcbiAgICAgIGJvcmRlcjogMXB4IHNvbGlkIHJlZDtcbiAgICB9XG4gICAgOmhvc3QoW2Rpcj1sdHJdKSBiIHtcbiAgICAgIHRleHQtZGVjb3JhdGlvbjogb3ZlcmxpbmU7XG4gICAgICBwYWRkaW5nOiA1cHg7XG4gICAgICBib3JkZXI6IDFweCBzb2xpZCBncmVlbjtcbiAgICB9XG4gICAgXG4gICAgOmhvc3QoW2Rpcj1ydGxdKSBzcGFuW3gtaGFzLXNsb3RdIHtcbiAgICAgIGZsb2F0OiBsZWZ0O1xuICAgIH1cbiAgICBcbiAgICA6aG9zdChbZGlyPWx0cl0pIHNwYW5beC1oYXMtc2xvdF0ge1xuICAgICAgZmxvYXQ6IHJpZ2h0O1xuICAgIH1cbiAgICBcbiAgICA6aG9zdChbZGlyPWx0cl0pICpbZGlyPXJ0bF0ge1xuICAgICAgZGlzcGxheTogbm9uZTtcbiAgICB9XG4gICAgOmhvc3QoW2Rpcj1ydGxdKSAqW2Rpcj1sdHJdIHtcbiAgICAgIGRpc3BsYXk6IG5vbmU7XG4gICAgfVxuICAgIFxuICAgIDwvc3R5bGU+XG4gICAgXG4gICAgPGIgZGlyPVwibHRyXCI+SSdtIGluIHNoYWRvdyBkb20hIGx0ciAoREJVV2ViQ29tcG9uZW50RHVtbXkpPC9iPlxuICAgIDxzcGFuIHgtaGFzLXNsb3Q+PHNwYW4+Wzwvc3Bhbj48c2xvdD48L3Nsb3Q+PHNwYW4+XTwvc3Bhbj48L3NwYW4+XG4gICAgPGIgZGlyPVwicnRsXCI+SSdtIGluIHNoYWRvdyBkb20hIHJ0bCAoREJVV2ViQ29tcG9uZW50RHVtbXkpPC9iPlxuICBgO1xuXG4gIGNsYXNzIERCVVdlYkNvbXBvbmVudER1bW15IGV4dGVuZHMgREJVV2ViQ29tcG9uZW50QmFzZSB7XG4gICAgc3RhdGljIGdldCBjb21wb25lbnROYW1lKCkge1xuICAgICAgcmV0dXJuICdkYnUtd2ViLWNvbXBvbmVudC1kdW1teSc7XG4gICAgfVxuXG4gICAgc3RhdGljIGdldCB0ZW1wbGF0ZSgpIHtcbiAgICAgIHJldHVybiB0ZW1wbGF0ZTtcbiAgICB9XG5cbiAgICBvbkxvY2FsZUNoYW5nZShsb2NhbGUpIHtcbiAgICAgIGNvbnNvbGUubG9nKCdvbkxvY2FsZUNoYW5nZScsIGxvY2FsZSk7XG4gICAgfVxuICB9XG5cbiAgZGVmaW5lQ29tbW9uU3RhdGljTWV0aG9kcyhEQlVXZWJDb21wb25lbnREdW1teSk7XG5cbiAgY2FjaGUuc2V0KHdpbiwgREJVV2ViQ29tcG9uZW50RHVtbXkpO1xuXG4gIHJldHVybiBjYWNoZS5nZXQod2luKTtcbn1cblxuIiwiXG5cbmltcG9ydCBnZXREQlVXZWJDb21wb25lbnRCYXNlIGZyb20gJy4uL0RCVVdlYkNvbXBvbmVudEJhc2UvREJVV2ViQ29tcG9uZW50QmFzZSc7XG5pbXBvcnQgZ2V0REJVV2ViQ29tcG9uZW50RHVtbXkgZnJvbSAnLi4vREJVV2ViQ29tcG9uZW50RHVtbXkvREJVV2ViQ29tcG9uZW50RHVtbXknO1xuXG5leHBvcnQgY29uc3QgY2FjaGUgPSBuZXcgV2Vha01hcCgpO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBnZXREQlVXZWJDb21wb25lbnREdW1teVBhcmVudCh3aW4pIHtcbiAgaWYgKGNhY2hlLmhhcyh3aW4pKSByZXR1cm4gY2FjaGUuZ2V0KHdpbik7XG5cbiAgY29uc3QgeyBEQlVXZWJDb21wb25lbnRCYXNlLCBkZWZpbmVDb21tb25TdGF0aWNNZXRob2RzIH0gPSBnZXREQlVXZWJDb21wb25lbnRCYXNlKHdpbik7XG4gIGNvbnN0IERCVVdlYkNvbXBvbmVudER1bW15ID0gZ2V0REJVV2ViQ29tcG9uZW50RHVtbXkod2luKTtcblxuICBjb25zdCB7IGRvY3VtZW50IH0gPSB3aW47XG5cbiAgY29uc3QgdGVtcGxhdGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZW1wbGF0ZScpO1xuICB0ZW1wbGF0ZS5pbm5lckhUTUwgPSBgXG4gICAgPHN0eWxlPlxuICAgIDpob3N0IHtkaXNwbGF5OiBibG9jazt9XG4gICAgPC9zdHlsZT5cbiAgICA8Yj5JJ20gaW4gc2hhZG93IGRvbSEgKERCVVdlYkNvbXBvbmVudER1bW15UGFyZW50KTwvYj5cbiAgICA8ZGJ1LXdlYi1jb21wb25lbnQtZHVtbXk+PHNsb3Q+PC9zbG90PjwvZGJ1LXdlYi1jb21wb25lbnQtZHVtbXk+XG4gIGA7XG5cbiAgY2xhc3MgREJVV2ViQ29tcG9uZW50RHVtbXlQYXJlbnQgZXh0ZW5kcyBEQlVXZWJDb21wb25lbnRCYXNlIHtcbiAgICBzdGF0aWMgZ2V0IGNvbXBvbmVudE5hbWUoKSB7XG4gICAgICByZXR1cm4gJ2RidS13ZWItY29tcG9uZW50LWR1bW15LXBhcmVudCc7XG4gICAgfVxuXG4gICAgc3RhdGljIGdldCB0ZW1wbGF0ZSgpIHtcbiAgICAgIHJldHVybiB0ZW1wbGF0ZTtcbiAgICB9XG5cbiAgICBzdGF0aWMgZ2V0IGRlcGVuZGVuY2llcygpIHtcbiAgICAgIHJldHVybiBbREJVV2ViQ29tcG9uZW50RHVtbXldO1xuICAgIH1cblxuICB9XG5cbiAgZGVmaW5lQ29tbW9uU3RhdGljTWV0aG9kcyhEQlVXZWJDb21wb25lbnREdW1teVBhcmVudCk7XG5cbiAgY2FjaGUuc2V0KHdpbiwgREJVV2ViQ29tcG9uZW50RHVtbXlQYXJlbnQpO1xuXG4gIHJldHVybiBjYWNoZS5nZXQod2luKTtcblxufVxuXG4iLCJcbmltcG9ydCBnZXREQlVXZWJDb21wb25lbnREdW1teSBmcm9tICcuL0RCVVdlYkNvbXBvbmVudER1bW15L0RCVVdlYkNvbXBvbmVudER1bW15JztcbmltcG9ydCBnZXREQlVXZWJDb21wb25lbnREdW1teVBhcmVudCBmcm9tICcuL0RCVVdlYkNvbXBvbmVudER1bW15UGFyZW50L0RCVVdlYkNvbXBvbmVudER1bW15UGFyZW50JztcblxuZXhwb3J0IHtcbiAgZ2V0REJVV2ViQ29tcG9uZW50RHVtbXksXG4gIGdldERCVVdlYkNvbXBvbmVudER1bW15UGFyZW50XG59O1xuIl19
