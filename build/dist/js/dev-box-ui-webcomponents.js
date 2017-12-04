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

},{"../DBUWebComponentBase/DBUWebComponentBase":2,"../DBUWebComponentDummy/DBUWebComponentDummy":3}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = dbuWebComponentsSetUp;

window.DBUWebComponents = {
  'dbu-web-component-dummy': {
    componentStyle: `
       b {
        color: orange;
        font-style: oblique;
        }
    `
  }
};

const appendStyle = win => (componentName, componentStyle) => {
  if (!win.DBUWebComponents) {
    win.DBUWebComponents = {};
  }
  win.DBUWebComponents = Object.assign({}, win.DBUWebComponents, {
    [componentName]: Object.assign({}, win.DBUWebComponents[componentName], {
      componentStyle
    })
  });
};

function dbuWebComponentsSetUp(win) {
  return {
    appendStyle: appendStyle(win)
  };
}

},{}],"dev-box-ui-webcomponents":[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDBUWebComponentDummyParent = exports.getDBUWebComponentDummy = exports.dbuWebComponentsSetUp = undefined;

var _DBUWebComponentsSetup = require('./DBUWebComponentsSetup/DBUWebComponentsSetup');

var _DBUWebComponentsSetup2 = _interopRequireDefault(_DBUWebComponentsSetup);

var _DBUWebComponentDummy = require('./DBUWebComponentDummy/DBUWebComponentDummy');

var _DBUWebComponentDummy2 = _interopRequireDefault(_DBUWebComponentDummy);

var _DBUWebComponentDummyParent = require('./DBUWebComponentDummyParent/DBUWebComponentDummyParent');

var _DBUWebComponentDummyParent2 = _interopRequireDefault(_DBUWebComponentDummyParent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.dbuWebComponentsSetUp = _DBUWebComponentsSetup2.default;
exports.getDBUWebComponentDummy = _DBUWebComponentDummy2.default;
exports.getDBUWebComponentDummyParent = _DBUWebComponentDummyParent2.default;

},{"./DBUWebComponentDummy/DBUWebComponentDummy":3,"./DBUWebComponentDummyParent/DBUWebComponentDummyParent":4,"./DBUWebComponentsSetup/DBUWebComponentsSetup":5}]},{},[])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvbGliL3NlcnZpY2VzL0xvY2FsZVNlcnZpY2UuanMiLCJzcmMvbGliL3dlYmNvbXBvbmVudHMvREJVV2ViQ29tcG9uZW50QmFzZS9EQlVXZWJDb21wb25lbnRCYXNlLmpzIiwic3JjL2xpYi93ZWJjb21wb25lbnRzL0RCVVdlYkNvbXBvbmVudER1bW15L0RCVVdlYkNvbXBvbmVudER1bW15LmpzIiwic3JjL2xpYi93ZWJjb21wb25lbnRzL0RCVVdlYkNvbXBvbmVudER1bW15UGFyZW50L0RCVVdlYkNvbXBvbmVudER1bW15UGFyZW50LmpzIiwic3JjL2xpYi93ZWJjb21wb25lbnRzL0RCVVdlYkNvbXBvbmVudHNTZXR1cC9EQlVXZWJDb21wb25lbnRzU2V0dXAuanMiLCJzcmMvbGliL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7O0FDQ0EsTUFBTSxnQkFBZ0I7QUFDcEIsT0FBSyxLQURlO0FBRXBCLFFBQU07QUFGYyxDQUF0Qjs7QUFLQSxNQUFNLGFBQU4sQ0FBb0I7QUFDbEIsZ0JBQWM7QUFDWixTQUFLLFVBQUwsR0FBa0IsRUFBbEI7QUFDQSxTQUFLLFlBQUwsR0FBb0IsT0FBTyxJQUFQLENBQVksYUFBWixDQUFwQjtBQUNBLFNBQUssWUFBTCxHQUFvQixPQUFPLFFBQVAsQ0FBZ0IsZUFBcEM7QUFDQSxTQUFLLFlBQUwsQ0FBa0IsT0FBbEIsQ0FBMkIsSUFBRCxJQUFVO0FBQ2xDLFVBQUksQ0FBQyxLQUFLLFlBQUwsQ0FBa0IsWUFBbEIsQ0FBK0IsSUFBL0IsQ0FBTCxFQUEyQztBQUN6QyxhQUFLLFlBQUwsQ0FBa0IsWUFBbEIsQ0FBK0IsSUFBL0IsRUFBcUMsY0FBYyxJQUFkLENBQXJDO0FBQ0Q7QUFDRixLQUpEO0FBS0EsU0FBSyxPQUFMLEdBQWUsS0FBSyxZQUFMLENBQWtCLE1BQWxCLENBQXlCLENBQUMsR0FBRCxFQUFNLElBQU4sS0FB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U0FBVCxHQUFzQjs7Ozs7O0dBQXRCOztBQVFBLFFBQU0sMEJBQU4sU0FBeUMsbUJBQXpDLENBQTZEO0FBQzNELGVBQVcsYUFBWCxHQUEyQjtBQUN6QixhQUFPLGdDQUFQO0FBQ0Q7O0FBRUQsZUFBVyxRQUFYLEdBQXNCO0FBQ3BCLGFBQU8sUUFBUDtBQUNEOztBQUVELGVBQVcsWUFBWCxHQUEwQjtBQUN4QixhQUFPLENBQUMsb0JBQUQsQ0FBUDtBQUNEOztBQVgwRDs7QUFlN0QsNEJBQTBCLDBCQUExQjs7QUFFQSxRQUFNLEdBQU4sQ0FBVSxHQUFWLEVBQWUsMEJBQWY7O0FBRUEsU0FBTyxNQUFNLEdBQU4sQ0FBVSxHQUFWLENBQVA7QUFFRDs7Ozs7Ozs7a0JDcEJ1QixxQjs7QUF4QnhCLE9BQU8sZ0JBQVAsR0FBMEI7QUFDeEIsNkJBQTJCO0FBQ3pCLG9CQUFpQjs7Ozs7O0FBRFE7QUFESCxDQUExQjs7QUFXQSxNQUFNLGNBQWUsR0FBRCxJQUFTLENBQUMsYUFBRCxFQUFnQixjQUFoQixLQUFtQztBQUM5RCxNQUFJLENBQUMsSUFBSSxnQkFBVCxFQUEyQjtBQUN6QixRQUFJLGdCQUFKLEdBQXVCLEVBQXZCO0FBQ0Q7QUFDRCxNQUFJLGdCQUFKLHFCQUNLLElBQUksZ0JBRFQ7QUFFRSxLQUFDLGFBQUQscUJBQ0ssSUFBSSxnQkFBSixDQUFxQixhQUFyQixDQURMO0FBRUU7QUFGRjtBQUZGO0FBT0QsQ0FYRDs7QUFhZSxTQUFTLHFCQUFULENBQStCLEdBQS9CLEVBQW9DO0FBQ2pELFNBQU87QUFDTCxpQkFBYSxZQUFZLEdBQVo7QUFEUixHQUFQO0FBR0Q7Ozs7Ozs7Ozs7QUM1QkQ7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7UUFHRSxxQjtRQUNBLHVCO1FBQ0EsNkIiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiXG5jb25zdCBkZWZhdWx0TG9jYWxlID0ge1xuICBkaXI6ICdsdHInLFxuICBsYW5nOiAnZW4nXG59O1xuXG5jbGFzcyBMb2NhbGVTZXJ2aWNlIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5fY2FsbGJhY2tzID0gW107XG4gICAgdGhpcy5fbG9jYWxlQXR0cnMgPSBPYmplY3Qua2V5cyhkZWZhdWx0TG9jYWxlKTtcbiAgICB0aGlzLl9yb290RWxlbWVudCA9IHdpbmRvdy5kb2N1bWVudC5kb2N1bWVudEVsZW1lbnQ7XG4gICAgdGhpcy5fbG9jYWxlQXR0cnMuZm9yRWFjaCgoYXR0cikgPT4ge1xuICAgICAgaWYgKCF0aGlzLl9yb290RWxlbWVudC5nZXRBdHRyaWJ1dGUoYXR0cikpIHtcbiAgICAgICAgdGhpcy5fcm9vdEVsZW1lbnQuc2V0QXR0cmlidXRlKGF0dHIsIGRlZmF1bHRMb2NhbGVbYXR0cl0pO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHRoaXMuX2xvY2FsZSA9IHRoaXMuX2xvY2FsZUF0dHJzLnJlZHVjZSgoYWNjLCBhdHRyKSA9PiB7XG4gICAgICBhY2NbYXR0cl0gPSB0aGlzLl9yb290RWxlbWVudC5nZXRBdHRyaWJ1dGUoYXR0cik7XG4gICAgICByZXR1cm4gYWNjO1xuICAgIH0sIHt9KTtcbiAgICB0aGlzLl9vYnNlcnZlciA9IG5ldyBNdXRhdGlvbk9ic2VydmVyKHRoaXMuX2hhbmRsZU11dGF0aW9ucy5iaW5kKHRoaXMpKTtcbiAgICB0aGlzLl9vYnNlcnZlci5vYnNlcnZlKHRoaXMuX3Jvb3RFbGVtZW50LCB7XG4gICAgICBhdHRyaWJ1dGVzOiB0cnVlXG4gICAgfSk7XG4gIH1cblxuICBfaGFuZGxlTXV0YXRpb25zKG11dGF0aW9ucykge1xuICAgIG11dGF0aW9ucy5mb3JFYWNoKChtdXRhdGlvbikgPT4ge1xuICAgICAgY29uc3QgbXV0YXRpb25BdHRyaWJ1dGVOYW1lID0gbXV0YXRpb24uYXR0cmlidXRlTmFtZTtcbiAgICAgIGlmICh0aGlzLl9sb2NhbGVBdHRycy5pbmNsdWRlcyhtdXRhdGlvbkF0dHJpYnV0ZU5hbWUpKSB7XG4gICAgICAgIHRoaXMuX2xvY2FsZSA9IHtcbiAgICAgICAgICAuLi50aGlzLl9sb2NhbGUsXG4gICAgICAgICAgW211dGF0aW9uQXR0cmlidXRlTmFtZV06IHRoaXMuX3Jvb3RFbGVtZW50LmdldEF0dHJpYnV0ZShtdXRhdGlvbkF0dHJpYnV0ZU5hbWUpXG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuX2NhbGxiYWNrcy5mb3JFYWNoKGNhbGxiYWNrID0+IGNhbGxiYWNrKHRoaXMuX2xvY2FsZSkpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgc2V0IGxvY2FsZShsb2NhbGVPYmopIHtcbiAgICBPYmplY3Qua2V5cyhsb2NhbGVPYmopLmZvckVhY2goKGtleSkgPT4ge1xuICAgICAgdGhpcy5fcm9vdEVsZW1lbnQuc2V0QXR0cmlidXRlKGtleSwgbG9jYWxlT2JqW2tleV0pO1xuICAgIH0pO1xuICB9XG5cbiAgZ2V0IGxvY2FsZSgpIHtcbiAgICByZXR1cm4gdGhpcy5fbG9jYWxlO1xuICB9XG5cbiAgb25Mb2NhbGVDaGFuZ2UoY2FsbGJhY2spIHtcbiAgICB0aGlzLl9jYWxsYmFja3MucHVzaChjYWxsYmFjayk7XG4gICAgY2FsbGJhY2sodGhpcy5sb2NhbGUpO1xuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICB0aGlzLl9jYWxsYmFja3MgPSB0aGlzLl9jYWxsYmFja3MuZmlsdGVyKGNiID0+IGNiICE9PSBjYWxsYmFjayk7XG4gICAgfTtcbiAgfVxufVxuXG5jb25zdCBsb2NhbGVTZXJ2aWNlID0gbmV3IExvY2FsZVNlcnZpY2UoKTtcbmV4cG9ydCBkZWZhdWx0IGxvY2FsZVNlcnZpY2U7XG4iLCJcbmltcG9ydCBMb2NhbGVTZXJ2aWNlIGZyb20gJy4uLy4uL3NlcnZpY2VzL0xvY2FsZVNlcnZpY2UnO1xuXG5jb25zb2xlLmxvZygnaW1wb3J0aW5nIGdldERCVVdlYkNvbXBvbmVudEJhc2UnKTtcblxuZXhwb3J0IGNvbnN0IGNhY2hlID0gbmV3IFdlYWtNYXAoKTtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZ2V0REJVV2ViQ29tcG9uZW50QmFzZSh3aW4pIHtcbiAgaWYgKGNhY2hlLmhhcyh3aW4pKSB7XG4gICAgcmV0dXJuIGNhY2hlLmdldCh3aW4pO1xuICB9XG5cbiAgY29uc3QgeyBkb2N1bWVudCwgSFRNTEVsZW1lbnQsIGN1c3RvbUVsZW1lbnRzIH0gPSB3aW47XG5cbiAgY29uc3QgdGVtcGxhdGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZW1wbGF0ZScpO1xuICB0ZW1wbGF0ZS5pbm5lckhUTUwgPSAnPHN0eWxlPjwvc3R5bGU+PHNsb3Q+PC9zbG90Pic7XG5cbiAgY2xhc3MgREJVV2ViQ29tcG9uZW50QmFzZSBleHRlbmRzIEhUTUxFbGVtZW50IHtcblxuICAgIHN0YXRpYyBnZXQgdGVtcGxhdGUoKSB7XG4gICAgICByZXR1cm4gdGVtcGxhdGU7XG4gICAgfVxuXG4gICAgc3RhdGljIGdldCBkZXBlbmRlbmNpZXMoKSB7XG4gICAgICByZXR1cm4gW107XG4gICAgfVxuXG4gICAgc3RhdGljIGdldCB1c2VTaGFkb3coKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgIHN1cGVyKCk7XG4gICAgICBjb25zdCB7IHVzZVNoYWRvdyB9ID0gdGhpcy5jb25zdHJ1Y3RvcjtcbiAgICAgIGlmICh1c2VTaGFkb3cpIHtcbiAgICAgICAgdGhpcy5hdHRhY2hTaGFkb3coeyBtb2RlOiAnb3BlbicgfSk7XG4gICAgICB9XG4gICAgICB0aGlzLl9pbnNlcnRUZW1wbGF0ZSgpO1xuXG4gICAgICB0aGlzLmNvbm5lY3RlZENhbGxiYWNrID0gdGhpcy5jb25uZWN0ZWRDYWxsYmFjay5iaW5kKHRoaXMpO1xuICAgICAgdGhpcy5kaXNjb25uZWN0ZWRDYWxsYmFjayA9IHRoaXMuZGlzY29ubmVjdGVkQ2FsbGJhY2suYmluZCh0aGlzKTtcbiAgICAgIHRoaXMuX2hhbmRsZUxvY2FsZUNoYW5nZSA9IHRoaXMuX2hhbmRsZUxvY2FsZUNoYW5nZS5iaW5kKHRoaXMpO1xuICAgICAgdGhpcy5vbkxvY2FsZUNoYW5nZSAmJiAodGhpcy5vbkxvY2FsZUNoYW5nZSA9IHRoaXMub25Mb2NhbGVDaGFuZ2UuYmluZCh0aGlzKSk7XG4gICAgICB0aGlzLnVucmVnaXN0ZXJMb2NhbGVDaGFuZ2UgPSBudWxsO1xuICAgIH1cblxuICAgIGNvbm5lY3RlZENhbGxiYWNrKCkge1xuXG4gICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignYmVmb3JldW5sb2FkJywgdGhpcy5kaXNjb25uZWN0ZWRDYWxsYmFjaywgZmFsc2UpO1xuXG4gICAgICB0aGlzLnVucmVnaXN0ZXJMb2NhbGVDaGFuZ2UgPVxuICAgICAgICBMb2NhbGVTZXJ2aWNlLm9uTG9jYWxlQ2hhbmdlKHRoaXMuX2hhbmRsZUxvY2FsZUNoYW5nZSk7XG4gICAgfVxuXG4gICAgZGlzY29ubmVjdGVkQ2FsbGJhY2soKSB7XG4gICAgICB0aGlzLnVucmVnaXN0ZXJMb2NhbGVDaGFuZ2UoKTtcbiAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdiZWZvcmV1bmxvYWQnLCB0aGlzLmRpc2Nvbm5lY3RlZENhbGxiYWNrLCBmYWxzZSk7XG4gICAgfVxuXG4gICAgZ2V0IGNoaWxkcmVuVHJlZSgpIHtcbiAgICAgIHJldHVybiB0aGlzLmNvbnN0cnVjdG9yLnVzZVNoYWRvdyA/IHRoaXMuc2hhZG93Um9vdCA6IHRoaXM7XG4gICAgfVxuXG4gICAgX2luc2VydFRlbXBsYXRlKCkge1xuICAgICAgY29uc3QgeyB0ZW1wbGF0ZSB9ID0gdGhpcy5jb25zdHJ1Y3RvcjtcblxuICAgICAgaWYgKHRlbXBsYXRlKSB7XG4gICAgICAgIHRoaXMuY2hpbGRyZW5UcmVlLmFwcGVuZENoaWxkKHRlbXBsYXRlLmNvbnRlbnQuY2xvbmVOb2RlKHRydWUpKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBfaGFuZGxlTG9jYWxlQ2hhbmdlKGxvY2FsZSkge1xuICAgICAgdGhpcy5jaGlsZHJlblRyZWUuaW5uZXJIVE1MID0gJyc7XG4gICAgICB0aGlzLl9pbnNlcnRUZW1wbGF0ZSgpO1xuICAgICAgdGhpcy5zZXRBdHRyaWJ1dGUoJ2RpcicsIGxvY2FsZS5kaXIpO1xuICAgICAgdGhpcy5zZXRBdHRyaWJ1dGUoJ2xhbmcnLCBsb2NhbGUubGFuZyk7XG4gICAgICB0aGlzLm9uTG9jYWxlQ2hhbmdlICYmIHRoaXMub25Mb2NhbGVDaGFuZ2UobG9jYWxlKTtcbiAgICB9XG5cbiAgfVxuXG4gIGZ1bmN0aW9uIGRlZmluZUNvbW1vblN0YXRpY01ldGhvZHMoa2xhc3MpIHtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoa2xhc3MsICdjb21wb25lbnRTdHlsZScsIHtcbiAgICAgIGdldCgpIHtcbiAgICAgICAgcmV0dXJuIGtsYXNzLnRlbXBsYXRlLmNvbnRlbnQucXVlcnlTZWxlY3Rvcignc3R5bGUnKS5pbm5lckhUTUw7XG4gICAgICB9LFxuICAgICAgc2V0KHZhbHVlKSB7XG4gICAgICAgIGtsYXNzLnRlbXBsYXRlLmNvbnRlbnQucXVlcnlTZWxlY3Rvcignc3R5bGUnKS5pbm5lckhUTUwgPSB2YWx1ZTtcbiAgICAgIH0sXG4gICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAga2xhc3MucmVnaXN0ZXJTZWxmID0gKCkgPT4ge1xuICAgICAgY29uc3QgY29tcG9uZW50TmFtZSA9IGtsYXNzLmNvbXBvbmVudE5hbWU7XG4gICAgICBjb25zdCBkZXBlbmRlbmNpZXMgPSBrbGFzcy5kZXBlbmRlbmNpZXM7XG4gICAgICBkZXBlbmRlbmNpZXMuZm9yRWFjaCgoZGVwZW5kZW5jeSkgPT4gZGVwZW5kZW5jeS5yZWdpc3RlclNlbGYoKSk7XG4gICAgICBpZiAoY3VzdG9tRWxlbWVudHMuZ2V0KGNvbXBvbmVudE5hbWUpKSByZXR1cm47XG4gICAgICBjb25zdCBjb21wb25lbnRTdHlsZSA9ICgod2luLkRCVVdlYkNvbXBvbmVudHMgfHwge30pW2NvbXBvbmVudE5hbWVdIHx8IHt9KS5jb21wb25lbnRTdHlsZTtcbiAgICAgIGlmIChjb21wb25lbnRTdHlsZSkge1xuICAgICAgICBrbGFzcy5jb21wb25lbnRTdHlsZSArPSBjb21wb25lbnRTdHlsZTtcbiAgICAgIH1cbiAgICAgIGN1c3RvbUVsZW1lbnRzLmRlZmluZShjb21wb25lbnROYW1lLCBrbGFzcyk7XG4gICAgfTtcbiAgfVxuXG4gIGNhY2hlLnNldCh3aW4sIHtcbiAgICBEQlVXZWJDb21wb25lbnRCYXNlLFxuICAgIGRlZmluZUNvbW1vblN0YXRpY01ldGhvZHNcbiAgfSk7XG5cbiAgcmV0dXJuIGNhY2hlLmdldCh3aW4pO1xuXG59XG4iLCJcbmltcG9ydCBnZXREQlVXZWJDb21wb25lbnRCYXNlIGZyb20gJy4uL0RCVVdlYkNvbXBvbmVudEJhc2UvREJVV2ViQ29tcG9uZW50QmFzZSc7XG5cbmNvbnNvbGUubG9nKCdpbXBvcnRpbmcgZ2V0REJVV2ViQ29tcG9uZW50Jyk7XG5cbmV4cG9ydCBjb25zdCBjYWNoZSA9IG5ldyBXZWFrTWFwKCk7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGdldERCVVdlYkNvbXBvbmVudER1bW15KHdpbikge1xuICBpZiAoY2FjaGUuaGFzKHdpbikpIHJldHVybiBjYWNoZS5nZXQod2luKTtcblxuICBjb25zdCB7IERCVVdlYkNvbXBvbmVudEJhc2UsIGRlZmluZUNvbW1vblN0YXRpY01ldGhvZHMgfSA9IGdldERCVVdlYkNvbXBvbmVudEJhc2Uod2luKTtcbiAgY29uc3QgeyBkb2N1bWVudCB9ID0gd2luO1xuXG4gIGNvbnN0IHRlbXBsYXRlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGVtcGxhdGUnKTtcbiAgdGVtcGxhdGUuaW5uZXJIVE1MID0gYFxuICAgIDxzdHlsZT5cbiAgICA6aG9zdCB7XG4gICAgICBkaXNwbGF5OiBibG9jaztcbiAgICAgIGNvbG9yOiBtYXJvb247XG4gICAgfVxuICAgIFxuICAgIDpob3N0IGIge1xuICAgICAgdGV4dC1zaGFkb3c6IHZhcigtLWItdGV4dC1zaGFkb3csIG5vbmUpO1xuICAgIH1cbiAgICBcbiAgICA6aG9zdChbZGlyPXJ0bF0pIGIge1xuICAgICAgdGV4dC1kZWNvcmF0aW9uOiB1bmRlcmxpbmU7XG4gICAgICBwYWRkaW5nOiA1cHg7XG4gICAgICBib3JkZXI6IDFweCBzb2xpZCByZWQ7XG4gICAgfVxuICAgIDpob3N0KFtkaXI9bHRyXSkgYiB7XG4gICAgICB0ZXh0LWRlY29yYXRpb246IG92ZXJsaW5lO1xuICAgICAgcGFkZGluZzogNXB4O1xuICAgICAgYm9yZGVyOiAxcHggc29saWQgZ3JlZW47XG4gICAgfVxuICAgIFxuICAgIDpob3N0KFtkaXI9cnRsXSkgc3Bhblt4LWhhcy1zbG90XSB7XG4gICAgICBmbG9hdDogbGVmdDtcbiAgICB9XG4gICAgXG4gICAgOmhvc3QoW2Rpcj1sdHJdKSBzcGFuW3gtaGFzLXNsb3RdIHtcbiAgICAgIGZsb2F0OiByaWdodDtcbiAgICB9XG4gICAgXG4gICAgOmhvc3QoW2Rpcj1sdHJdKSAqW2Rpcj1ydGxdIHtcbiAgICAgIGRpc3BsYXk6IG5vbmU7XG4gICAgfVxuICAgIDpob3N0KFtkaXI9cnRsXSkgKltkaXI9bHRyXSB7XG4gICAgICBkaXNwbGF5OiBub25lO1xuICAgIH1cbiAgICBcbiAgICA8L3N0eWxlPlxuICAgIFxuICAgIDxiIGRpcj1cImx0clwiPkknbSBpbiBzaGFkb3cgZG9tISBsdHIgKERCVVdlYkNvbXBvbmVudER1bW15KTwvYj5cbiAgICA8c3BhbiB4LWhhcy1zbG90PjxzcGFuPls8L3NwYW4+PHNsb3Q+PC9zbG90PjxzcGFuPl08L3NwYW4+PC9zcGFuPlxuICAgIDxiIGRpcj1cInJ0bFwiPkknbSBpbiBzaGFkb3cgZG9tISBydGwgKERCVVdlYkNvbXBvbmVudER1bW15KTwvYj5cbiAgYDtcblxuICBjbGFzcyBEQlVXZWJDb21wb25lbnREdW1teSBleHRlbmRzIERCVVdlYkNvbXBvbmVudEJhc2Uge1xuICAgIHN0YXRpYyBnZXQgY29tcG9uZW50TmFtZSgpIHtcbiAgICAgIHJldHVybiAnZGJ1LXdlYi1jb21wb25lbnQtZHVtbXknO1xuICAgIH1cblxuICAgIHN0YXRpYyBnZXQgdGVtcGxhdGUoKSB7XG4gICAgICByZXR1cm4gdGVtcGxhdGU7XG4gICAgfVxuXG4gICAgb25Mb2NhbGVDaGFuZ2UobG9jYWxlKSB7XG4gICAgICBjb25zb2xlLmxvZygnb25Mb2NhbGVDaGFuZ2UnLCBsb2NhbGUpO1xuICAgIH1cbiAgfVxuXG4gIGRlZmluZUNvbW1vblN0YXRpY01ldGhvZHMoREJVV2ViQ29tcG9uZW50RHVtbXkpO1xuXG4gIGNhY2hlLnNldCh3aW4sIERCVVdlYkNvbXBvbmVudER1bW15KTtcblxuICByZXR1cm4gY2FjaGUuZ2V0KHdpbik7XG59XG5cbiIsIlxuXG5pbXBvcnQgZ2V0REJVV2ViQ29tcG9uZW50QmFzZSBmcm9tICcuLi9EQlVXZWJDb21wb25lbnRCYXNlL0RCVVdlYkNvbXBvbmVudEJhc2UnO1xuaW1wb3J0IGdldERCVVdlYkNvbXBvbmVudER1bW15IGZyb20gJy4uL0RCVVdlYkNvbXBvbmVudER1bW15L0RCVVdlYkNvbXBvbmVudER1bW15JztcblxuZXhwb3J0IGNvbnN0IGNhY2hlID0gbmV3IFdlYWtNYXAoKTtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZ2V0REJVV2ViQ29tcG9uZW50RHVtbXlQYXJlbnQod2luKSB7XG4gIGlmIChjYWNoZS5oYXMod2luKSkgcmV0dXJuIGNhY2hlLmdldCh3aW4pO1xuXG4gIGNvbnN0IHsgREJVV2ViQ29tcG9uZW50QmFzZSwgZGVmaW5lQ29tbW9uU3RhdGljTWV0aG9kcyB9ID0gZ2V0REJVV2ViQ29tcG9uZW50QmFzZSh3aW4pO1xuICBjb25zdCBEQlVXZWJDb21wb25lbnREdW1teSA9IGdldERCVVdlYkNvbXBvbmVudER1bW15KHdpbik7XG5cbiAgY29uc3QgeyBkb2N1bWVudCB9ID0gd2luO1xuXG4gIGNvbnN0IHRlbXBsYXRlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGVtcGxhdGUnKTtcbiAgdGVtcGxhdGUuaW5uZXJIVE1MID0gYFxuICAgIDxzdHlsZT5cbiAgICA6aG9zdCB7ZGlzcGxheTogYmxvY2s7fVxuICAgIDwvc3R5bGU+XG4gICAgPGI+SSdtIGluIHNoYWRvdyBkb20hIChEQlVXZWJDb21wb25lbnREdW1teVBhcmVudCk8L2I+XG4gICAgPGRidS13ZWItY29tcG9uZW50LWR1bW15PjxzbG90Pjwvc2xvdD48L2RidS13ZWItY29tcG9uZW50LWR1bW15PlxuICBgO1xuXG4gIGNsYXNzIERCVVdlYkNvbXBvbmVudER1bW15UGFyZW50IGV4dGVuZHMgREJVV2ViQ29tcG9uZW50QmFzZSB7XG4gICAgc3RhdGljIGdldCBjb21wb25lbnROYW1lKCkge1xuICAgICAgcmV0dXJuICdkYnUtd2ViLWNvbXBvbmVudC1kdW1teS1wYXJlbnQnO1xuICAgIH1cblxuICAgIHN0YXRpYyBnZXQgdGVtcGxhdGUoKSB7XG4gICAgICByZXR1cm4gdGVtcGxhdGU7XG4gICAgfVxuXG4gICAgc3RhdGljIGdldCBkZXBlbmRlbmNpZXMoKSB7XG4gICAgICByZXR1cm4gW0RCVVdlYkNvbXBvbmVudER1bW15XTtcbiAgICB9XG5cbiAgfVxuXG4gIGRlZmluZUNvbW1vblN0YXRpY01ldGhvZHMoREJVV2ViQ29tcG9uZW50RHVtbXlQYXJlbnQpO1xuXG4gIGNhY2hlLnNldCh3aW4sIERCVVdlYkNvbXBvbmVudER1bW15UGFyZW50KTtcblxuICByZXR1cm4gY2FjaGUuZ2V0KHdpbik7XG5cbn1cblxuIiwiXG53aW5kb3cuREJVV2ViQ29tcG9uZW50cyA9IHtcbiAgJ2RidS13ZWItY29tcG9uZW50LWR1bW15Jzoge1xuICAgIGNvbXBvbmVudFN0eWxlOiBgXG4gICAgICAgYiB7XG4gICAgICAgIGNvbG9yOiBvcmFuZ2U7XG4gICAgICAgIGZvbnQtc3R5bGU6IG9ibGlxdWU7XG4gICAgICAgIH1cbiAgICBgXG4gIH1cbn07XG5cbmNvbnN0IGFwcGVuZFN0eWxlID0gKHdpbikgPT4gKGNvbXBvbmVudE5hbWUsIGNvbXBvbmVudFN0eWxlKSA9PiB7XG4gIGlmICghd2luLkRCVVdlYkNvbXBvbmVudHMpIHtcbiAgICB3aW4uREJVV2ViQ29tcG9uZW50cyA9IHt9O1xuICB9XG4gIHdpbi5EQlVXZWJDb21wb25lbnRzID0ge1xuICAgIC4uLndpbi5EQlVXZWJDb21wb25lbnRzLFxuICAgIFtjb21wb25lbnROYW1lXToge1xuICAgICAgLi4ud2luLkRCVVdlYkNvbXBvbmVudHNbY29tcG9uZW50TmFtZV0sXG4gICAgICBjb21wb25lbnRTdHlsZVxuICAgIH1cbiAgfTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGRidVdlYkNvbXBvbmVudHNTZXRVcCh3aW4pIHtcbiAgcmV0dXJuIHtcbiAgICBhcHBlbmRTdHlsZTogYXBwZW5kU3R5bGUod2luKVxuICB9O1xufVxuIiwiXG5pbXBvcnQgZGJ1V2ViQ29tcG9uZW50c1NldFVwIGZyb20gJy4vREJVV2ViQ29tcG9uZW50c1NldHVwL0RCVVdlYkNvbXBvbmVudHNTZXR1cCc7XG5pbXBvcnQgZ2V0REJVV2ViQ29tcG9uZW50RHVtbXkgZnJvbSAnLi9EQlVXZWJDb21wb25lbnREdW1teS9EQlVXZWJDb21wb25lbnREdW1teSc7XG5pbXBvcnQgZ2V0REJVV2ViQ29tcG9uZW50RHVtbXlQYXJlbnQgZnJvbSAnLi9EQlVXZWJDb21wb25lbnREdW1teVBhcmVudC9EQlVXZWJDb21wb25lbnREdW1teVBhcmVudCc7XG5cbmV4cG9ydCB7XG4gIGRidVdlYkNvbXBvbmVudHNTZXRVcCxcbiAgZ2V0REJVV2ViQ29tcG9uZW50RHVtbXksXG4gIGdldERCVVdlYkNvbXBvbmVudER1bW15UGFyZW50XG59O1xuIl19
