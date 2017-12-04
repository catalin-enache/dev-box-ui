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
exports.default = getDBUWebComponentBase;

var _LocaleService = require('../../services/LocaleService');

var _LocaleService2 = _interopRequireDefault(_LocaleService);

var _ensureSingleRegistration = require('../internals/ensureSingleRegistration');

var _ensureSingleRegistration2 = _interopRequireDefault(_ensureSingleRegistration);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

console.log('importing getDBUWebComponentBase');

const registrationName = 'DBUWebComponentBase';

function getDBUWebComponentBase(win) {
  return (0, _ensureSingleRegistration2.default)(win, registrationName, () => {
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
        if (customElements.get(componentName)) return componentName;
        const componentStyle = ((win.DBUWebComponents || {})[componentName] || {}).componentStyle;
        if (componentStyle) {
          klass.componentStyle += componentStyle;
        }
        customElements.define(componentName, klass);
        return componentName;
      };
    }

    return {
      DBUWebComponentBase,
      defineCommonStaticMethods
    };
  });
}

},{"../../services/LocaleService":1,"../internals/ensureSingleRegistration":6}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getDBUWebComponentDummy;

var _DBUWebComponentBase = require('../DBUWebComponentBase/DBUWebComponentBase');

var _DBUWebComponentBase2 = _interopRequireDefault(_DBUWebComponentBase);

var _ensureSingleRegistration = require('../internals/ensureSingleRegistration');

var _ensureSingleRegistration2 = _interopRequireDefault(_ensureSingleRegistration);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

console.log('importing getDBUWebComponent');

const registrationName = 'dbu-web-component-dummy';

function getDBUWebComponentDummy(win) {
  return (0, _ensureSingleRegistration2.default)(win, registrationName, () => {
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
        return registrationName;
      }

      static get template() {
        return template;
      }

      onLocaleChange(locale) {
        console.log('onLocaleChange', locale);
      }
    }

    defineCommonStaticMethods(DBUWebComponentDummy);

    return DBUWebComponentDummy;
  });
}

},{"../DBUWebComponentBase/DBUWebComponentBase":2,"../internals/ensureSingleRegistration":6}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getDBUWebComponentDummyParent;

var _DBUWebComponentBase = require('../DBUWebComponentBase/DBUWebComponentBase');

var _DBUWebComponentBase2 = _interopRequireDefault(_DBUWebComponentBase);

var _DBUWebComponentDummy = require('../DBUWebComponentDummy/DBUWebComponentDummy');

var _DBUWebComponentDummy2 = _interopRequireDefault(_DBUWebComponentDummy);

var _ensureSingleRegistration = require('../internals/ensureSingleRegistration');

var _ensureSingleRegistration2 = _interopRequireDefault(_ensureSingleRegistration);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const registrationName = 'dbu-web-component-dummy-parent';

function getDBUWebComponentDummyParent(win) {
  return (0, _ensureSingleRegistration2.default)(win, registrationName, () => {
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
        return registrationName;
      }

      static get template() {
        return template;
      }

      static get dependencies() {
        return [DBUWebComponentDummy];
      }

    }

    defineCommonStaticMethods(DBUWebComponentDummyParent);

    return DBUWebComponentDummyParent;
  });
}

},{"../DBUWebComponentBase/DBUWebComponentBase":2,"../DBUWebComponentDummy/DBUWebComponentDummy":3,"../internals/ensureSingleRegistration":6}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = dbuWebComponentsSetUp;


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

},{}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = ensureSingleRegistration;
function ensureSingleRegistration(win, name, callback) {
  if (!win.DBUWebComponents) {
    win.DBUWebComponents = { registrations: {} };
  } else if (!win.DBUWebComponents.registrations) {
    win.DBUWebComponents.registrations = {};
  }

  let registration = win.DBUWebComponents.registrations[name];

  if (registration) return registration;

  registration = callback();
  win.DBUWebComponents.registrations[name] = registration;

  return win.DBUWebComponents.registrations[name];
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvbGliL3NlcnZpY2VzL0xvY2FsZVNlcnZpY2UuanMiLCJzcmMvbGliL3dlYmNvbXBvbmVudHMvREJVV2ViQ29tcG9uZW50QmFzZS9EQlVXZWJDb21wb25lbnRCYXNlLmpzIiwic3JjL2xpYi93ZWJjb21wb25lbnRzL0RCVVdlYkNvbXBvbmVudER1bW15L0RCVVdlYkNvbXBvbmVudER1bW15LmpzIiwic3JjL2xpYi93ZWJjb21wb25lbnRzL0RCVVdlYkNvbXBvbmVudER1bW15UGFyZW50L0RCVVdlYkNvbXBvbmVudER1bW15UGFyZW50LmpzIiwic3JjL2xpYi93ZWJjb21wb25lbnRzL0RCVVdlYkNvbXBvbmVudHNTZXR1cC9EQlVXZWJDb21wb25lbnRzU2V0dXAuanMiLCJzcmMvbGliL3dlYmNvbXBvbmVudHMvaW50ZXJuYWxzL2Vuc3VyZVNpbmdsZVJlZ2lzdHJhdGlvbi5qcyIsInNyYy9saWIvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7QUNDQSxNQUFNLGdCQUFnQjtBQUNwQixPQUFLLEtBRGU7QUFFcEIsUUFBTTtBQUZjLENBQXRCOztBQUtBLE1BQU0sYUFBTixDQUFvQjtBQUNsQixnQkFBYztBQUNaLFNBQUssVUFBTCxHQUFrQixFQUFsQjtBQUNBLFNBQUssWUFBTCxHQUFvQixPQUFPLElBQVAsQ0FBWSxhQUFaLENBQXBCO0FBQ0EsU0FBSyxZQUFMLEdBQW9CLE9BQU8sUUFBUCxDQUFnQixlQUFwQztBQUNBLFNBQUssWUFBTCxDQUFrQixPQUFsQixDQUEyQixJQUFELElBQVU7QUFDbEMsVUFBSSxDQUFDLEtBQUssWUFBTCxDQUFrQixZQUFsQixDQUErQixJQUEvQixDQUFMLEVBQTJDO0FBQ3pDLGFBQUssWUFBTCxDQUFrQixZQUFsQixDQUErQixJQUEvQixFQUFxQyxjQUFjLElBQWQsQ0FBckM7QUFDRDtBQUNGLEtBSkQ7QUFLQSxTQUFL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QUksZ0JBQUosQ0FBcUIsYUFBckIsQ0FBbUMsSUFBbkMsSUFBMkMsWUFBM0M7O0FBRUEsU0FBTyxJQUFJLGdCQUFKLENBQXFCLGFBQXJCLENBQW1DLElBQW5DLENBQVA7QUFDRDs7Ozs7Ozs7OztBQ2hCRDs7OztBQUNBOzs7O0FBQ0E7Ozs7OztRQUdFLHFCO1FBQ0EsdUI7UUFDQSw2QiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJcbmNvbnN0IGRlZmF1bHRMb2NhbGUgPSB7XG4gIGRpcjogJ2x0cicsXG4gIGxhbmc6ICdlbidcbn07XG5cbmNsYXNzIExvY2FsZVNlcnZpY2Uge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLl9jYWxsYmFja3MgPSBbXTtcbiAgICB0aGlzLl9sb2NhbGVBdHRycyA9IE9iamVjdC5rZXlzKGRlZmF1bHRMb2NhbGUpO1xuICAgIHRoaXMuX3Jvb3RFbGVtZW50ID0gd2luZG93LmRvY3VtZW50LmRvY3VtZW50RWxlbWVudDtcbiAgICB0aGlzLl9sb2NhbGVBdHRycy5mb3JFYWNoKChhdHRyKSA9PiB7XG4gICAgICBpZiAoIXRoaXMuX3Jvb3RFbGVtZW50LmdldEF0dHJpYnV0ZShhdHRyKSkge1xuICAgICAgICB0aGlzLl9yb290RWxlbWVudC5zZXRBdHRyaWJ1dGUoYXR0ciwgZGVmYXVsdExvY2FsZVthdHRyXSk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgdGhpcy5fbG9jYWxlID0gdGhpcy5fbG9jYWxlQXR0cnMucmVkdWNlKChhY2MsIGF0dHIpID0+IHtcbiAgICAgIGFjY1thdHRyXSA9IHRoaXMuX3Jvb3RFbGVtZW50LmdldEF0dHJpYnV0ZShhdHRyKTtcbiAgICAgIHJldHVybiBhY2M7XG4gICAgfSwge30pO1xuICAgIHRoaXMuX29ic2VydmVyID0gbmV3IE11dGF0aW9uT2JzZXJ2ZXIodGhpcy5faGFuZGxlTXV0YXRpb25zLmJpbmQodGhpcykpO1xuICAgIHRoaXMuX29ic2VydmVyLm9ic2VydmUodGhpcy5fcm9vdEVsZW1lbnQsIHtcbiAgICAgIGF0dHJpYnV0ZXM6IHRydWVcbiAgICB9KTtcbiAgfVxuXG4gIF9oYW5kbGVNdXRhdGlvbnMobXV0YXRpb25zKSB7XG4gICAgbXV0YXRpb25zLmZvckVhY2goKG11dGF0aW9uKSA9PiB7XG4gICAgICBjb25zdCBtdXRhdGlvbkF0dHJpYnV0ZU5hbWUgPSBtdXRhdGlvbi5hdHRyaWJ1dGVOYW1lO1xuICAgICAgaWYgKHRoaXMuX2xvY2FsZUF0dHJzLmluY2x1ZGVzKG11dGF0aW9uQXR0cmlidXRlTmFtZSkpIHtcbiAgICAgICAgdGhpcy5fbG9jYWxlID0ge1xuICAgICAgICAgIC4uLnRoaXMuX2xvY2FsZSxcbiAgICAgICAgICBbbXV0YXRpb25BdHRyaWJ1dGVOYW1lXTogdGhpcy5fcm9vdEVsZW1lbnQuZ2V0QXR0cmlidXRlKG11dGF0aW9uQXR0cmlidXRlTmFtZSlcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5fY2FsbGJhY2tzLmZvckVhY2goY2FsbGJhY2sgPT4gY2FsbGJhY2sodGhpcy5fbG9jYWxlKSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBzZXQgbG9jYWxlKGxvY2FsZU9iaikge1xuICAgIE9iamVjdC5rZXlzKGxvY2FsZU9iaikuZm9yRWFjaCgoa2V5KSA9PiB7XG4gICAgICB0aGlzLl9yb290RWxlbWVudC5zZXRBdHRyaWJ1dGUoa2V5LCBsb2NhbGVPYmpba2V5XSk7XG4gICAgfSk7XG4gIH1cblxuICBnZXQgbG9jYWxlKCkge1xuICAgIHJldHVybiB0aGlzLl9sb2NhbGU7XG4gIH1cblxuICBvbkxvY2FsZUNoYW5nZShjYWxsYmFjaykge1xuICAgIHRoaXMuX2NhbGxiYWNrcy5wdXNoKGNhbGxiYWNrKTtcbiAgICBjYWxsYmFjayh0aGlzLmxvY2FsZSk7XG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgIHRoaXMuX2NhbGxiYWNrcyA9IHRoaXMuX2NhbGxiYWNrcy5maWx0ZXIoY2IgPT4gY2IgIT09IGNhbGxiYWNrKTtcbiAgICB9O1xuICB9XG59XG5cbmNvbnN0IGxvY2FsZVNlcnZpY2UgPSBuZXcgTG9jYWxlU2VydmljZSgpO1xuZXhwb3J0IGRlZmF1bHQgbG9jYWxlU2VydmljZTtcbiIsIlxuaW1wb3J0IExvY2FsZVNlcnZpY2UgZnJvbSAnLi4vLi4vc2VydmljZXMvTG9jYWxlU2VydmljZSc7XG5pbXBvcnQgZW5zdXJlU2luZ2xlUmVnaXN0cmF0aW9uIGZyb20gJy4uL2ludGVybmFscy9lbnN1cmVTaW5nbGVSZWdpc3RyYXRpb24nO1xuXG5jb25zb2xlLmxvZygnaW1wb3J0aW5nIGdldERCVVdlYkNvbXBvbmVudEJhc2UnKTtcblxuY29uc3QgcmVnaXN0cmF0aW9uTmFtZSA9ICdEQlVXZWJDb21wb25lbnRCYXNlJztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZ2V0REJVV2ViQ29tcG9uZW50QmFzZSh3aW4pIHtcbiAgcmV0dXJuIGVuc3VyZVNpbmdsZVJlZ2lzdHJhdGlvbih3aW4sIHJlZ2lzdHJhdGlvbk5hbWUsICgpID0+IHtcbiAgICBjb25zdCB7IGRvY3VtZW50LCBIVE1MRWxlbWVudCwgY3VzdG9tRWxlbWVudHMgfSA9IHdpbjtcblxuICAgIGNvbnN0IHRlbXBsYXRlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGVtcGxhdGUnKTtcbiAgICB0ZW1wbGF0ZS5pbm5lckhUTUwgPSAnPHN0eWxlPjwvc3R5bGU+PHNsb3Q+PC9zbG90Pic7XG5cbiAgICBjbGFzcyBEQlVXZWJDb21wb25lbnRCYXNlIGV4dGVuZHMgSFRNTEVsZW1lbnQge1xuXG4gICAgICBzdGF0aWMgZ2V0IHRlbXBsYXRlKCkge1xuICAgICAgICByZXR1cm4gdGVtcGxhdGU7XG4gICAgICB9XG5cbiAgICAgIHN0YXRpYyBnZXQgZGVwZW5kZW5jaWVzKCkge1xuICAgICAgICByZXR1cm4gW107XG4gICAgICB9XG5cbiAgICAgIHN0YXRpYyBnZXQgdXNlU2hhZG93KCkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cblxuICAgICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIGNvbnN0IHsgdXNlU2hhZG93IH0gPSB0aGlzLmNvbnN0cnVjdG9yO1xuICAgICAgICBpZiAodXNlU2hhZG93KSB7XG4gICAgICAgICAgdGhpcy5hdHRhY2hTaGFkb3coeyBtb2RlOiAnb3BlbicgfSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5faW5zZXJ0VGVtcGxhdGUoKTtcblxuICAgICAgICB0aGlzLmNvbm5lY3RlZENhbGxiYWNrID0gdGhpcy5jb25uZWN0ZWRDYWxsYmFjay5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzLmRpc2Nvbm5lY3RlZENhbGxiYWNrID0gdGhpcy5kaXNjb25uZWN0ZWRDYWxsYmFjay5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzLl9oYW5kbGVMb2NhbGVDaGFuZ2UgPSB0aGlzLl9oYW5kbGVMb2NhbGVDaGFuZ2UuYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy5vbkxvY2FsZUNoYW5nZSAmJiAodGhpcy5vbkxvY2FsZUNoYW5nZSA9IHRoaXMub25Mb2NhbGVDaGFuZ2UuYmluZCh0aGlzKSk7XG4gICAgICAgIHRoaXMudW5yZWdpc3RlckxvY2FsZUNoYW5nZSA9IG51bGw7XG4gICAgICB9XG5cbiAgICAgIGNvbm5lY3RlZENhbGxiYWNrKCkge1xuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignYmVmb3JldW5sb2FkJywgdGhpcy5kaXNjb25uZWN0ZWRDYWxsYmFjaywgZmFsc2UpO1xuXG4gICAgICAgIHRoaXMudW5yZWdpc3RlckxvY2FsZUNoYW5nZSA9XG4gICAgICAgICAgTG9jYWxlU2VydmljZS5vbkxvY2FsZUNoYW5nZSh0aGlzLl9oYW5kbGVMb2NhbGVDaGFuZ2UpO1xuICAgICAgfVxuXG4gICAgICBkaXNjb25uZWN0ZWRDYWxsYmFjaygpIHtcbiAgICAgICAgdGhpcy51bnJlZ2lzdGVyTG9jYWxlQ2hhbmdlKCk7XG4gICAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdiZWZvcmV1bmxvYWQnLCB0aGlzLmRpc2Nvbm5lY3RlZENhbGxiYWNrLCBmYWxzZSk7XG4gICAgICB9XG5cbiAgICAgIGdldCBjaGlsZHJlblRyZWUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbnN0cnVjdG9yLnVzZVNoYWRvdyA/IHRoaXMuc2hhZG93Um9vdCA6IHRoaXM7XG4gICAgICB9XG5cbiAgICAgIF9pbnNlcnRUZW1wbGF0ZSgpIHtcbiAgICAgICAgY29uc3QgeyB0ZW1wbGF0ZSB9ID0gdGhpcy5jb25zdHJ1Y3RvcjtcblxuICAgICAgICBpZiAodGVtcGxhdGUpIHtcbiAgICAgICAgICB0aGlzLmNoaWxkcmVuVHJlZS5hcHBlbmRDaGlsZCh0ZW1wbGF0ZS5jb250ZW50LmNsb25lTm9kZSh0cnVlKSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgX2hhbmRsZUxvY2FsZUNoYW5nZShsb2NhbGUpIHtcbiAgICAgICAgdGhpcy5jaGlsZHJlblRyZWUuaW5uZXJIVE1MID0gJyc7XG4gICAgICAgIHRoaXMuX2luc2VydFRlbXBsYXRlKCk7XG4gICAgICAgIHRoaXMuc2V0QXR0cmlidXRlKCdkaXInLCBsb2NhbGUuZGlyKTtcbiAgICAgICAgdGhpcy5zZXRBdHRyaWJ1dGUoJ2xhbmcnLCBsb2NhbGUubGFuZyk7XG4gICAgICAgIHRoaXMub25Mb2NhbGVDaGFuZ2UgJiYgdGhpcy5vbkxvY2FsZUNoYW5nZShsb2NhbGUpO1xuICAgICAgfVxuXG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZGVmaW5lQ29tbW9uU3RhdGljTWV0aG9kcyhrbGFzcykge1xuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGtsYXNzLCAnY29tcG9uZW50U3R5bGUnLCB7XG4gICAgICAgIGdldCgpIHtcbiAgICAgICAgICByZXR1cm4ga2xhc3MudGVtcGxhdGUuY29udGVudC5xdWVyeVNlbGVjdG9yKCdzdHlsZScpLmlubmVySFRNTDtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0KHZhbHVlKSB7XG4gICAgICAgICAga2xhc3MudGVtcGxhdGUuY29udGVudC5xdWVyeVNlbGVjdG9yKCdzdHlsZScpLmlubmVySFRNTCA9IHZhbHVlO1xuICAgICAgICB9LFxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICAgIH0pO1xuXG4gICAgICBrbGFzcy5yZWdpc3RlclNlbGYgPSAoKSA9PiB7XG4gICAgICAgIGNvbnN0IGNvbXBvbmVudE5hbWUgPSBrbGFzcy5jb21wb25lbnROYW1lO1xuICAgICAgICBjb25zdCBkZXBlbmRlbmNpZXMgPSBrbGFzcy5kZXBlbmRlbmNpZXM7XG4gICAgICAgIGRlcGVuZGVuY2llcy5mb3JFYWNoKChkZXBlbmRlbmN5KSA9PiBkZXBlbmRlbmN5LnJlZ2lzdGVyU2VsZigpKTtcbiAgICAgICAgaWYgKGN1c3RvbUVsZW1lbnRzLmdldChjb21wb25lbnROYW1lKSkgcmV0dXJuIGNvbXBvbmVudE5hbWU7XG4gICAgICAgIGNvbnN0IGNvbXBvbmVudFN0eWxlID0gKCh3aW4uREJVV2ViQ29tcG9uZW50cyB8fCB7fSlbY29tcG9uZW50TmFtZV0gfHwge30pLmNvbXBvbmVudFN0eWxlO1xuICAgICAgICBpZiAoY29tcG9uZW50U3R5bGUpIHtcbiAgICAgICAgICBrbGFzcy5jb21wb25lbnRTdHlsZSArPSBjb21wb25lbnRTdHlsZTtcbiAgICAgICAgfVxuICAgICAgICBjdXN0b21FbGVtZW50cy5kZWZpbmUoY29tcG9uZW50TmFtZSwga2xhc3MpO1xuICAgICAgICByZXR1cm4gY29tcG9uZW50TmFtZTtcbiAgICAgIH07XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIERCVVdlYkNvbXBvbmVudEJhc2UsXG4gICAgICBkZWZpbmVDb21tb25TdGF0aWNNZXRob2RzXG4gICAgfTtcbiAgfSk7XG59XG4iLCJcbmltcG9ydCBnZXREQlVXZWJDb21wb25lbnRCYXNlIGZyb20gJy4uL0RCVVdlYkNvbXBvbmVudEJhc2UvREJVV2ViQ29tcG9uZW50QmFzZSc7XG5pbXBvcnQgZW5zdXJlU2luZ2xlUmVnaXN0cmF0aW9uIGZyb20gJy4uL2ludGVybmFscy9lbnN1cmVTaW5nbGVSZWdpc3RyYXRpb24nO1xuXG5jb25zb2xlLmxvZygnaW1wb3J0aW5nIGdldERCVVdlYkNvbXBvbmVudCcpO1xuXG5jb25zdCByZWdpc3RyYXRpb25OYW1lID0gJ2RidS13ZWItY29tcG9uZW50LWR1bW15JztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZ2V0REJVV2ViQ29tcG9uZW50RHVtbXkod2luKSB7XG4gIHJldHVybiBlbnN1cmVTaW5nbGVSZWdpc3RyYXRpb24od2luLCByZWdpc3RyYXRpb25OYW1lLCAoKSA9PiB7XG4gICAgY29uc3QgeyBEQlVXZWJDb21wb25lbnRCYXNlLCBkZWZpbmVDb21tb25TdGF0aWNNZXRob2RzIH0gPSBnZXREQlVXZWJDb21wb25lbnRCYXNlKHdpbik7XG4gICAgY29uc3QgeyBkb2N1bWVudCB9ID0gd2luO1xuXG4gICAgY29uc3QgdGVtcGxhdGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZW1wbGF0ZScpO1xuICAgIHRlbXBsYXRlLmlubmVySFRNTCA9IGBcbiAgICAgIDxzdHlsZT5cbiAgICAgIDpob3N0IHtcbiAgICAgICAgZGlzcGxheTogYmxvY2s7XG4gICAgICAgIGNvbG9yOiBtYXJvb247XG4gICAgICB9XG4gICAgICBcbiAgICAgIDpob3N0IGIge1xuICAgICAgICB0ZXh0LXNoYWRvdzogdmFyKC0tYi10ZXh0LXNoYWRvdywgbm9uZSk7XG4gICAgICB9XG4gICAgICBcbiAgICAgIDpob3N0KFtkaXI9cnRsXSkgYiB7XG4gICAgICAgIHRleHQtZGVjb3JhdGlvbjogdW5kZXJsaW5lO1xuICAgICAgICBwYWRkaW5nOiA1cHg7XG4gICAgICAgIGJvcmRlcjogMXB4IHNvbGlkIHJlZDtcbiAgICAgIH1cbiAgICAgIDpob3N0KFtkaXI9bHRyXSkgYiB7XG4gICAgICAgIHRleHQtZGVjb3JhdGlvbjogb3ZlcmxpbmU7XG4gICAgICAgIHBhZGRpbmc6IDVweDtcbiAgICAgICAgYm9yZGVyOiAxcHggc29saWQgZ3JlZW47XG4gICAgICB9XG4gICAgICBcbiAgICAgIDpob3N0KFtkaXI9cnRsXSkgc3Bhblt4LWhhcy1zbG90XSB7XG4gICAgICAgIGZsb2F0OiBsZWZ0O1xuICAgICAgfVxuICAgICAgXG4gICAgICA6aG9zdChbZGlyPWx0cl0pIHNwYW5beC1oYXMtc2xvdF0ge1xuICAgICAgICBmbG9hdDogcmlnaHQ7XG4gICAgICB9XG4gICAgICBcbiAgICAgIDpob3N0KFtkaXI9bHRyXSkgKltkaXI9cnRsXSB7XG4gICAgICAgIGRpc3BsYXk6IG5vbmU7XG4gICAgICB9XG4gICAgICA6aG9zdChbZGlyPXJ0bF0pICpbZGlyPWx0cl0ge1xuICAgICAgICBkaXNwbGF5OiBub25lO1xuICAgICAgfVxuICAgICAgXG4gICAgICA8L3N0eWxlPlxuICAgICAgXG4gICAgICA8YiBkaXI9XCJsdHJcIj5JJ20gaW4gc2hhZG93IGRvbSEgbHRyIChEQlVXZWJDb21wb25lbnREdW1teSk8L2I+XG4gICAgICA8c3BhbiB4LWhhcy1zbG90PjxzcGFuPls8L3NwYW4+PHNsb3Q+PC9zbG90PjxzcGFuPl08L3NwYW4+PC9zcGFuPlxuICAgICAgPGIgZGlyPVwicnRsXCI+SSdtIGluIHNoYWRvdyBkb20hIHJ0bCAoREJVV2ViQ29tcG9uZW50RHVtbXkpPC9iPlxuICAgIGA7XG5cbiAgICBjbGFzcyBEQlVXZWJDb21wb25lbnREdW1teSBleHRlbmRzIERCVVdlYkNvbXBvbmVudEJhc2Uge1xuICAgICAgc3RhdGljIGdldCBjb21wb25lbnROYW1lKCkge1xuICAgICAgICByZXR1cm4gcmVnaXN0cmF0aW9uTmFtZTtcbiAgICAgIH1cblxuICAgICAgc3RhdGljIGdldCB0ZW1wbGF0ZSgpIHtcbiAgICAgICAgcmV0dXJuIHRlbXBsYXRlO1xuICAgICAgfVxuXG4gICAgICBvbkxvY2FsZUNoYW5nZShsb2NhbGUpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ29uTG9jYWxlQ2hhbmdlJywgbG9jYWxlKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBkZWZpbmVDb21tb25TdGF0aWNNZXRob2RzKERCVVdlYkNvbXBvbmVudER1bW15KTtcblxuICAgIHJldHVybiBEQlVXZWJDb21wb25lbnREdW1teTtcbiAgfSk7XG59XG5cbiIsIlxuXG5pbXBvcnQgZ2V0REJVV2ViQ29tcG9uZW50QmFzZSBmcm9tICcuLi9EQlVXZWJDb21wb25lbnRCYXNlL0RCVVdlYkNvbXBvbmVudEJhc2UnO1xuaW1wb3J0IGdldERCVVdlYkNvbXBvbmVudER1bW15IGZyb20gJy4uL0RCVVdlYkNvbXBvbmVudER1bW15L0RCVVdlYkNvbXBvbmVudER1bW15JztcbmltcG9ydCBlbnN1cmVTaW5nbGVSZWdpc3RyYXRpb24gZnJvbSAnLi4vaW50ZXJuYWxzL2Vuc3VyZVNpbmdsZVJlZ2lzdHJhdGlvbic7XG5cbmNvbnN0IHJlZ2lzdHJhdGlvbk5hbWUgPSAnZGJ1LXdlYi1jb21wb25lbnQtZHVtbXktcGFyZW50JztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZ2V0REJVV2ViQ29tcG9uZW50RHVtbXlQYXJlbnQod2luKSB7XG4gIHJldHVybiBlbnN1cmVTaW5nbGVSZWdpc3RyYXRpb24od2luLCByZWdpc3RyYXRpb25OYW1lLCAoKSA9PiB7XG4gICAgY29uc3QgeyBEQlVXZWJDb21wb25lbnRCYXNlLCBkZWZpbmVDb21tb25TdGF0aWNNZXRob2RzIH0gPSBnZXREQlVXZWJDb21wb25lbnRCYXNlKHdpbik7XG4gICAgY29uc3QgREJVV2ViQ29tcG9uZW50RHVtbXkgPSBnZXREQlVXZWJDb21wb25lbnREdW1teSh3aW4pO1xuXG4gICAgY29uc3QgeyBkb2N1bWVudCB9ID0gd2luO1xuXG4gICAgY29uc3QgdGVtcGxhdGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZW1wbGF0ZScpO1xuICAgIHRlbXBsYXRlLmlubmVySFRNTCA9IGBcbiAgICAgIDxzdHlsZT5cbiAgICAgIDpob3N0IHtkaXNwbGF5OiBibG9jazt9XG4gICAgICA8L3N0eWxlPlxuICAgICAgPGI+SSdtIGluIHNoYWRvdyBkb20hIChEQlVXZWJDb21wb25lbnREdW1teVBhcmVudCk8L2I+XG4gICAgICA8ZGJ1LXdlYi1jb21wb25lbnQtZHVtbXk+PHNsb3Q+PC9zbG90PjwvZGJ1LXdlYi1jb21wb25lbnQtZHVtbXk+XG4gICAgYDtcblxuICAgIGNsYXNzIERCVVdlYkNvbXBvbmVudER1bW15UGFyZW50IGV4dGVuZHMgREJVV2ViQ29tcG9uZW50QmFzZSB7XG4gICAgICBzdGF0aWMgZ2V0IGNvbXBvbmVudE5hbWUoKSB7XG4gICAgICAgIHJldHVybiByZWdpc3RyYXRpb25OYW1lO1xuICAgICAgfVxuXG4gICAgICBzdGF0aWMgZ2V0IHRlbXBsYXRlKCkge1xuICAgICAgICByZXR1cm4gdGVtcGxhdGU7XG4gICAgICB9XG5cbiAgICAgIHN0YXRpYyBnZXQgZGVwZW5kZW5jaWVzKCkge1xuICAgICAgICByZXR1cm4gW0RCVVdlYkNvbXBvbmVudER1bW15XTtcbiAgICAgIH1cblxuICAgIH1cblxuICAgIGRlZmluZUNvbW1vblN0YXRpY01ldGhvZHMoREJVV2ViQ29tcG9uZW50RHVtbXlQYXJlbnQpO1xuXG4gICAgcmV0dXJuIERCVVdlYkNvbXBvbmVudER1bW15UGFyZW50O1xuICB9KTtcbn1cblxuIiwiXG5cbmNvbnN0IGFwcGVuZFN0eWxlID0gKHdpbikgPT4gKGNvbXBvbmVudE5hbWUsIGNvbXBvbmVudFN0eWxlKSA9PiB7XG4gIGlmICghd2luLkRCVVdlYkNvbXBvbmVudHMpIHtcbiAgICB3aW4uREJVV2ViQ29tcG9uZW50cyA9IHt9O1xuICB9XG4gIHdpbi5EQlVXZWJDb21wb25lbnRzID0ge1xuICAgIC4uLndpbi5EQlVXZWJDb21wb25lbnRzLFxuICAgIFtjb21wb25lbnROYW1lXToge1xuICAgICAgLi4ud2luLkRCVVdlYkNvbXBvbmVudHNbY29tcG9uZW50TmFtZV0sXG4gICAgICBjb21wb25lbnRTdHlsZVxuICAgIH1cbiAgfTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGRidVdlYkNvbXBvbmVudHNTZXRVcCh3aW4pIHtcbiAgcmV0dXJuIHtcbiAgICBhcHBlbmRTdHlsZTogYXBwZW5kU3R5bGUod2luKVxuICB9O1xufVxuIiwiXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGVuc3VyZVNpbmdsZVJlZ2lzdHJhdGlvbih3aW4sIG5hbWUsIGNhbGxiYWNrKSB7XG4gIGlmICghd2luLkRCVVdlYkNvbXBvbmVudHMpIHtcbiAgICB3aW4uREJVV2ViQ29tcG9uZW50cyA9IHsgcmVnaXN0cmF0aW9uczoge30gfTtcbiAgfSBlbHNlIGlmICghd2luLkRCVVdlYkNvbXBvbmVudHMucmVnaXN0cmF0aW9ucykge1xuICAgIHdpbi5EQlVXZWJDb21wb25lbnRzLnJlZ2lzdHJhdGlvbnMgPSB7fTtcbiAgfVxuXG4gIGxldCByZWdpc3RyYXRpb24gPSB3aW4uREJVV2ViQ29tcG9uZW50cy5yZWdpc3RyYXRpb25zW25hbWVdO1xuXG4gIGlmIChyZWdpc3RyYXRpb24pIHJldHVybiByZWdpc3RyYXRpb247XG5cbiAgcmVnaXN0cmF0aW9uID0gY2FsbGJhY2soKTtcbiAgd2luLkRCVVdlYkNvbXBvbmVudHMucmVnaXN0cmF0aW9uc1tuYW1lXSA9IHJlZ2lzdHJhdGlvbjtcblxuICByZXR1cm4gd2luLkRCVVdlYkNvbXBvbmVudHMucmVnaXN0cmF0aW9uc1tuYW1lXTtcbn1cblxuIiwiXG5pbXBvcnQgZGJ1V2ViQ29tcG9uZW50c1NldFVwIGZyb20gJy4vREJVV2ViQ29tcG9uZW50c1NldHVwL0RCVVdlYkNvbXBvbmVudHNTZXR1cCc7XG5pbXBvcnQgZ2V0REJVV2ViQ29tcG9uZW50RHVtbXkgZnJvbSAnLi9EQlVXZWJDb21wb25lbnREdW1teS9EQlVXZWJDb21wb25lbnREdW1teSc7XG5pbXBvcnQgZ2V0REJVV2ViQ29tcG9uZW50RHVtbXlQYXJlbnQgZnJvbSAnLi9EQlVXZWJDb21wb25lbnREdW1teVBhcmVudC9EQlVXZWJDb21wb25lbnREdW1teVBhcmVudCc7XG5cbmV4cG9ydCB7XG4gIGRidVdlYkNvbXBvbmVudHNTZXRVcCxcbiAgZ2V0REJVV2ViQ29tcG9uZW50RHVtbXksXG4gIGdldERCVVdlYkNvbXBvbmVudER1bW15UGFyZW50XG59O1xuIl19
