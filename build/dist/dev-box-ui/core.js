require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
/*
DBUIWebComponentBase (from which all web-components inherit)
will read componentStyle from win.DBUIWebComponents
when klass.registerSelf() is called giving a chance to override default web-component style
just before it is registered.
*/
const appendStyle = win => (registrationName, componentStyle) => {
  if (!win.DBUIWebComponents) {
    win.DBUIWebComponents = {};
  }
  win.DBUIWebComponents = Object.assign({}, win.DBUIWebComponents, {
    [registrationName]: Object.assign({}, win.DBUIWebComponents[registrationName], {
      componentStyle
    })
  });
};

const appendStyles = win => components => {
  components.forEach(({ registrationName, componentStyle }) => {
    appendStyle(win)(registrationName, componentStyle);
  });
  return components;
};

exports.default = appendStyles;

},{}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = ensureSingleRegistration;
function ensureSingleRegistration(win, name, callback) {
  if (!win.DBUIWebComponents) {
    win.DBUIWebComponents = { registrations: {} };
  } else if (!win.DBUIWebComponents.registrations) {
    win.DBUIWebComponents.registrations = {};
  }

  let registration = win.DBUIWebComponents.registrations[name];

  if (registration) return registration;

  registration = callback();
  win.DBUIWebComponents.registrations[name] = registration;

  return win.DBUIWebComponents.registrations[name];
}

},{}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getDBUII18nService;

var _DBUILocaleService = require('./DBUILocaleService');

var _DBUILocaleService2 = _interopRequireDefault(_DBUILocaleService);

var _ensureSingleRegistration = require('../internals/ensureSingleRegistration');

var _ensureSingleRegistration2 = _interopRequireDefault(_ensureSingleRegistration);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const emptyObj = {};

const registrationName = 'DBUII18nService';

function getDBUII18nService(win) {
  const localeService = (0, _DBUILocaleService2.default)(win);
  return (0, _ensureSingleRegistration2.default)(win, registrationName, () => {
    class I18nService {
      constructor() {
        localeService.onLocaleChange(this._handleLocaleChange.bind(this));
        this._locale = localeService.locale;
        this._translations = {};
      }

      _handleLocaleChange(locale) {
        this._locale = locale;
      }

      clearTranslations(lang) {
        delete this._translations[lang];
      }

      registerTranslations(translations) {
        this._translations = Object.keys(translations).reduce((acc, lang) => {
          acc[lang] = Object.assign({}, this._translations[lang], translations[lang]);
          return acc;
        }, this._translations);
      }

      translate(msg) {
        return this.currentLangTranslations[msg];
      }

      get translations() {
        return this._translations;
      }

      get currentLangTranslations() {
        return this._translations[this._locale.lang] || emptyObj;
      }
    }

    const i18nService = new I18nService();
    return i18nService;
  });
}

},{"../internals/ensureSingleRegistration":3,"./DBUILocaleService":5}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getDBUILocaleService;

var _ensureSingleRegistration = require('../internals/ensureSingleRegistration');

var _ensureSingleRegistration2 = _interopRequireDefault(_ensureSingleRegistration);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const defaultLocale = {
  dir: 'ltr',
  lang: 'en'
};

const registrationName = 'DBUILocaleService';

function getDBUILocaleService(win) {
  return (0, _ensureSingleRegistration2.default)(win, registrationName, () => {
    class LocaleService {
      constructor() {
        this._callbacks = [];
        this._localeAttrs = Object.keys(defaultLocale);
        this._rootElement = win.document.querySelector('[x-dbui-locale-root]') || win.document.documentElement;
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
    return localeService;
  });
}

},{"../internals/ensureSingleRegistration":3}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
/* eslint prefer-const: 0 */

/**
 *
 * @param options Object
 * @returns function(String): String
 */
const forceFloat = ({ decPoint = '.' } = {}) => value => {
  const GLOBAL_DEC_POINT = new RegExp(`\\${decPoint}`, 'g');
  const GLOBAL_NON_NUMBER_OR_DEC_POINT = new RegExp(`[^\\d${decPoint}]`, 'g');
  const NUMBER_DEC_POINT_OR_SHORTCUT = new RegExp(`[\\d${decPoint}KkMm]`, '');
  const NUMBER_OR_SIGN = new RegExp('[\\d+-]', '');
  const SIGN = new RegExp('[+-]', '');
  const SHORTCUT = new RegExp('[KkMm]', '');
  const SHORTCUT_THOUSANDS = new RegExp('[Kk]', '');

  let valueToUse = value;
  const indexOfPoint = valueToUse.indexOf(decPoint);
  const lastIndexOfPoint = valueToUse.lastIndexOf(decPoint);
  const hasMoreThanOnePoint = indexOfPoint !== lastIndexOfPoint;

  if (hasMoreThanOnePoint) {
    valueToUse = `${valueToUse.replace(GLOBAL_DEC_POINT, '')}${decPoint}`;
  }

  let firstChar = valueToUse[0] || '';
  let lastChar = (valueToUse.length > 1 ? valueToUse[valueToUse.length - 1] : '') || '';
  let middleChars = valueToUse.substr(1, valueToUse.length - 2) || '';

  if (!firstChar.match(NUMBER_OR_SIGN)) {
    firstChar = '';
  }

  middleChars = middleChars.replace(GLOBAL_NON_NUMBER_OR_DEC_POINT, '');

  if (!lastChar.match(NUMBER_DEC_POINT_OR_SHORTCUT)) {
    lastChar = '';
  } else if (lastChar.match(SHORTCUT)) {
    if (middleChars === decPoint) {
      middleChars = '';
    } else if (middleChars === '' && firstChar.match(SIGN)) {
      lastChar = '';
    }
  } else if (lastChar === decPoint && middleChars === '' && firstChar.match(SIGN)) {
    lastChar = '';
  }

  valueToUse = [firstChar, middleChars, lastChar].join('');

  if (lastChar.match(SHORTCUT)) {
    valueToUse = (Number(`${firstChar}${middleChars}`.replace(decPoint, '.')) * (lastChar.match(SHORTCUT_THOUSANDS) ? 1000 : 1000000)).toString().replace('.', decPoint);
  }

  return valueToUse;
};

/**
 *
 * @param options Object
 * @returns function(String): String
 */
const numberFormatter = ({ decPoint = '.', thousandsSeparator = ',' } = {}) => value => {
  value = value.replace('.', decPoint);
  let firstChar = value[0] || '';
  firstChar = ['+', '-'].includes(firstChar) ? firstChar : '';
  const isFloatingPoint = value.indexOf(decPoint) !== -1;
  let [integerPart = '', decimals = ''] = value.split(decPoint);
  integerPart = integerPart.replace(/[+-]/g, '');
  integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, thousandsSeparator);
  const ret = `${firstChar}${integerPart}${isFloatingPoint ? decPoint : ''}${decimals}`;
  return ret;
};

exports.default = {
  forceFloat,
  numberFormatter
};

},{}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = onScreenConsole;
/* eslint no-console: 0 */

const buttonHeight = '25px';
const buttonStart = '5px';
const buttonTop = '5px';

let consoleMessages = [];
const consoleLog = console.log.bind(console);
const consoleOriginal = {};

function captureConsole(consoleElm, options) {
  const { indent = 2, showLastOnly = false } = options;
  const handler = function handler(action, ...args) {
    if (showLastOnly) {
      consoleMessages = [{ [action]: args }];
    } else {
      consoleMessages.push({ [action]: args });
    }

    consoleElm.innerHTML = consoleMessages.map(entry => {
      const action = Object.keys(entry)[0];
      const values = entry[action];
      const message = values.map(item => {
        return [undefined, null].includes(item) || ['number', 'string', 'function'].includes(typeof item) ? item : ['Map', 'Set'].includes(item.constructor.name) ? `${item.constructor.name} (${JSON.stringify([...item])})` : JSON.stringify(item, (key, value) => {
          if (typeof value === 'function') {
            return value.toString();
          }
          return value;
        }, indent);
      }).join(', ');

      const color = {
        log: '#000',
        warn: 'orange',
        error: 'darkred'
      }[action];

      return `<pre style="color: ${color}">${message}</pre>`;
    }).join('\n');
  };
  ['log', 'warn', 'error'].forEach(action => {
    consoleOriginal[action] = console[action];
    console[action] = handler.bind(console, action);
  });
  window.addEventListener('error', evt => {
    // eslint no-console: 0
    console.error(`"${evt.message}" from ${evt.filename}:${evt.lineno}`);
    console.error(evt, evt.error.stack);
    // evt.preventDefault();
  });
  consoleLog('console captured');
  return function releaseConsole() {
    ['log', 'warn', 'error'].forEach(action => {
      console[action] = consoleOriginal[action];
    });
    consoleLog('console released');
  };
}

function createConsole({
  options,
  consoleStyle: {
    btnStart = buttonStart, btnHeight = buttonHeight,
    width = `calc(100vw - ${btnStart} - 30px)`, height = '400px',
    background = 'rgba(0, 0, 0, 0.5)'
  }
}) {
  const { rtl = false } = options;
  const console = document.createElement('div');
  console.id = 'DBUIonScreenConsole';
  console.style.cssText = `
    display: block;
    margin: 0px;
    padding: 5px;
    position: absolute;
    overflow: auto;
    width: ${width};
    height: ${height};
    top: ${btnHeight};
    ${rtl ? 'right' : 'left'}: 0px;
    background: ${background};
    z-index: 9999;
    -webkit-overflow-scrolling: touch
    `;
  return console;
}

function createButton({
  options,
  buttonStyle: {
    position = 'fixed',
    width = '25px', height = buttonHeight, top = buttonTop, start = buttonStart,
    background = 'rgba(0, 0, 0, 0.5)'
  }
}) {
  const { rtl = false } = options;
  const button = document.createElement('div');
  button.id = 'DBUIonScreenConsoleToggler';
  button.style.cssText = `
    position: ${position};
    width: ${width};
    height: ${height};
    top: ${top};
    ${rtl ? 'right' : 'left'}: ${start};
    background: ${background};
    z-index: 9999;
    `;
  return button;
}

/**
onScreenConsole({
  buttonStyle = { position, width, height, top, start, background },
  consoleStyle = { width, height, background },
  options = { rtl: false, indent, showLastOnly }
})
*/
function onScreenConsole({
  buttonStyle = {},
  consoleStyle = {},
  options = {}
} = {}) {
  const button = createButton({
    options,
    buttonStyle
  });
  const console = createConsole({
    consoleStyle: Object.assign({}, consoleStyle, {
      btnHeight: buttonStyle.height,
      btnStart: buttonStyle.start
    }),
    options
  });

  console.addEventListener('click', e => {
    e.stopPropagation();
  });

  button.addEventListener('click', e => {
    e.stopPropagation();
    if (!button.contains(console)) {
      button.appendChild(console);
      console.scrollTop = console.scrollHeight - console.clientHeight;
    } else {
      button.removeChild(console);
    }
  });

  document.body.appendChild(button);
  const releaseConsole = captureConsole(console, options);

  return function release() {
    document.body.removeChild(button);
    releaseConsole();
  };
}

},{}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = template;
/**
 * const t = template`${0} ${1} ${'two'} ${'three'}`;
 * const tr = t('a', 'b', { two: 'c', three: 'd' });
 * expect(tr).to.equal('a b c d');
 * @param strings
 * @param keys
 * @return {function(...[*])}
 */
function template(strings, ...keys) {
  return (...values) => {
    const dict = values[values.length - 1] || {};
    const result = [strings[0]];
    keys.forEach((key, i) => {
      const value = Number.isInteger(key) ? values[key] : dict[key];
      result.push(value, strings[i + 1]);
    });
    return result.join('');
  };
}

},{}],9:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

// http://raganwald.com/2015/12/31/this-is-not-an-essay-about-traits-in-javascript.html

/*

class A {
  constructor(...args) {
    this.init(...args);
  }
}

class B extends A {
  init(x) {
    this._x = x;
  }
  getX() {
    return this._x;
  }
  setX(value) {
    this._x = value;
  }
  get x() {
    return this._x;
  }
  set x(value) {
    this._x = value;
  }
}

function withDoubleX(klass) {
  return OverrideOrDefine({

    // overrides
    init(originalInit, x, y) {
      originalInit(x);
      this._y = y;
    },
    getX(originalGetX) {
      return originalGetX() * 2;
    },
    setX(originalSetX, value) {
      // this._x = value * 2;
      originalSetX(value * 2);
    },
    get x() {
      return this._x * 2;
    },
    set x(value) {
      this._x = value * 2;
    },

    // new definitions
    set y(value) {
      this._y = value * 2;
    },
    get y() {
      return this._y * 2;
    },
    hello() {
      return `hello ${this._x} and ${this.y}`;
    }
  })(klass);
}

B = withDoubleX(B);

const b = new B(2, 5);
console.log(b.x); // 4
console.log(b.getX()); // 4

b.setX(3);
// b.x = 3;
console.log(b.x); // 12
console.log(b.getX()); // 12

// new
console.log(b.y); // 10
b.y = 9;
console.log(b.hello()); // hello 6 and 36

*/
// TODO:test this
function OverrideOrDefine(behaviour) {
  const instanceKeys = Reflect.ownKeys(behaviour);

  return function define(klass) {
    instanceKeys.forEach(property => {

      const newPropertyDescriptor = Object.getOwnPropertyDescriptor(behaviour, property);
      const originalPropertyDescriptor = Object.getOwnPropertyDescriptor(klass.prototype, property);

      const {
        value: newValue,
        get: newGetter,
        set: newSetter
      } = newPropertyDescriptor;

      if (!originalPropertyDescriptor) {
        if (newValue) {
          Object.defineProperty(klass.prototype, property, {
            value: newValue,
            writable: true,
            enumerable: false,
            configurable: true
          });
        } else {
          Object.defineProperty(klass.prototype, property, {
            get: newGetter,
            set: newSetter,
            enumerable: false,
            configurable: true
          });
        }
      } else {
        const {
          value: originalValue,
          writable: originalWritable,
          get: originalGetter,
          set: originalSetter,
          enumerable: originalEnumerable,
          configurable: originalConfigurable
        } = originalPropertyDescriptor;

        if (newValue) {
          Object.defineProperty(klass.prototype, property, {
            value(...args) {
              const boundedValue = originalValue.bind(this);
              return newValue.call(this, boundedValue, ...args);
            },
            writable: originalWritable,
            enumerable: originalEnumerable,
            configurable: originalConfigurable
          });
        } else {
          Object.defineProperty(klass.prototype, property, {
            get: newGetter || originalGetter,
            set: newSetter || originalSetter,
            enumerable: originalEnumerable,
            configurable: originalConfigurable
          });
        }
      }
    });
    return klass;
  };
}

exports.default = OverrideOrDefine;

},{}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Focusable;

const readOnlyProperties = ['focused'];

const ERROR_MESSAGES = {
  focused: `'focused' property is read-only as it is controlled by the component.
If you want to set focus programmatically call .focus() method on component.
`
};

/**
 * When an inner focusable is focused (ex: via click) the entire component gets focused.
 * When the component gets focused (ex: via tab) the first inner focusable gets focused too.
 * When the component gets disabled it gets blurred too and all inner focusables get disabled and blurred.
 * When disabled the component cannot be focused.
 * When enabled the component can be focused.
 * @param Klass
 * @returns {Focusable}
 * @constructor
 */
function Focusable(Klass) {

  Klass.componentStyle += `
  :host([disabled]) {
    cursor: not-allowed;
    opacity: 0.5;
    
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }
  
  :host([disabled]) * {
    pointer-events: none;
  }
  `;

  class Focusable extends Klass {

    static get name() {
      return super.name;
    }

    static get propertiesToUpgrade() {
      // The reason for upgrading 'focused' is only to show an warning
      // if the consumer of the component attempted to set focus property
      // which is read-only.
      return [...super.propertiesToUpgrade, 'focused', 'disabled'];
    }

    static get observedAttributes() {
      return [...super.observedAttributes, 'disabled'];
    }

    constructor(...args) {
      super(...args);

      this._currentInnerFocused = null;
      this._onInnerFocusableFocused = this._onInnerFocusableFocused.bind(this);
      this._onFocus = this._onFocus.bind(this);
      this._onBlur = this._onBlur.bind(this);
    }

    attributeChangedCallback(name, oldValue, newValue) {
      super.attributeChangedCallback(name, oldValue, newValue);

      const hasValue = newValue !== null;
      if (name === 'disabled') {
        hasValue ? this._applyDisabledSideEffects() : this._applyEnabledSideEffects();
      }
    }

    connectedCallback() {
      super.connectedCallback();

      readOnlyProperties.forEach(readOnlyProperty => {
        if (this.hasAttribute(readOnlyProperty)) {
          this.removeAttribute(readOnlyProperty);
          console.warn(ERROR_MESSAGES[readOnlyProperty]);
        }
      });

      if (!this.disabled) {
        this.setAttribute('tabindex', 0);
      }

      // when component focused/blurred
      this.addEventListener('focus', this._onFocus);
      this.addEventListener('blur', this._onBlur);

      this._innerFocusables.forEach(focusable => {
        // when inner focusable focused
        focusable.addEventListener('focus', this._onInnerFocusableFocused);
      });
    }

    disconnectedCallback() {
      super.disconnectedCallback();

      this.removeEventListener('focus', this._onFocus);
      this.removeEventListener('blur', this._onBlur);

      this._innerFocusables.forEach(focusable => {
        focusable.removeEventListener('focus', this._onInnerFocusableFocused);
      });
    }

    // read-only
    get focused() {
      return this.hasAttribute('focused');
    }

    set focused(_) {
      console.warn(ERROR_MESSAGES.focused);
    }

    get disabled() {
      return this.hasAttribute('disabled');
    }

    set disabled(value) {
      const hasValue = Boolean(value);
      if (hasValue) {
        this.setAttribute('disabled', '');
      } else {
        this.removeAttribute('disabled');
      }
    }

    get _innerFocusables() {
      return this.shadowRoot.querySelectorAll('[tabindex]') || [];
    }

    get _firstInnerFocusable() {
      return this.shadowRoot.querySelector('[tabindex]');
    }

    _onInnerFocusableFocused(evt) {
      this._currentInnerFocused = evt.target;
    }

    _onFocus() {
      if (this.disabled) return;
      // Only for styling purpose.
      // Focused property is controlled from inside.
      // Attempt to set this property from outside will trigger a warning
      // and will be ignored
      this.setAttribute('focused', '');
      this._applyFocusSideEffects();
    }

    _onBlur() {
      this.removeAttribute('focused');
      this._applyBlurSideEffects();
    }

    _applyFocusSideEffects() {
      if (this._currentInnerFocused) {
        // Some inner component is already focused.
        // No need to set focus on anything.
        return;
      }
      this._focusFirstInnerFocusable();
    }

    _applyBlurSideEffects() {
      if (this._currentInnerFocused) {
        this._currentInnerFocused.blur();
        this._currentInnerFocused = null;
      }
    }

    _focusFirstInnerFocusable() {
      const firstInnerFocusable = this._firstInnerFocusable;
      if (firstInnerFocusable) {
        this._currentInnerFocused = firstInnerFocusable;
        firstInnerFocusable.focus();
      }
    }

    _applyDisabledSideEffects() {
      this.removeAttribute('tabindex');
      this._innerFocusables.forEach(innerFocusable => {
        innerFocusable.setAttribute('tabindex', '-1');
        if (innerFocusable.hasAttribute('contenteditable')) {
          innerFocusable.setAttribute('contenteditable', 'false');
        } else {
          innerFocusable.disabled = true;
        }
      });
      this.blur();
    }

    _applyEnabledSideEffects() {
      this.setAttribute('tabindex', '0');
      this._innerFocusables.forEach(innerFocusable => {
        innerFocusable.setAttribute('tabindex', '0');
        if (innerFocusable.hasAttribute('contenteditable')) {
          innerFocusable.setAttribute('contenteditable', 'true');
        } else {
          innerFocusable.disabled = false;
        }
      });
    }
  }

  return Focusable;
}

},{}],11:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

const DBUICommonCssVars = `
  :root {
    --dbui-web-component-global-border-radius: 5px;
    --dbui-web-component-form-input-height: 30px;
    --dbui-web-component-form-input-color: #000;
    --dbui-web-component-form-input-background-color: transparent;
    --dbui-web-component-form-input-border-color: #ccc;
    --dbui-web-component-form-input-border-style: solid;
    --dbui-web-component-form-input-border-width: 1px;
  }
  `;

exports.default = DBUICommonCssVars;

},{}],12:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getDBUIWebComponentCore;

var _DBUILocaleService = require('../../../services/DBUILocaleService');

var _DBUILocaleService2 = _interopRequireDefault(_DBUILocaleService);

var _ensureSingleRegistration = require('../../../internals/ensureSingleRegistration');

var _ensureSingleRegistration2 = _interopRequireDefault(_ensureSingleRegistration);

var _DBUIWebComponentMessage = require('./DBUIWebComponentMessage');

var _DBUIWebComponentMessage2 = _interopRequireDefault(_DBUIWebComponentMessage);

var _DBUICommonCssVars = require('./DBUICommonCssVars');

var _DBUICommonCssVars2 = _interopRequireDefault(_DBUICommonCssVars);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const PARENT_TARGET_TYPE = 'PARENT';
const CHILDREN_TARGET_TYPE = 'CHILDREN';
const SHADOW_DOM_TYPE = 'ShadowDom';
const LIGHT_DOM_TYPE = 'LightDom';
const CHANNEL_INTERNAL = 'Internal';
const MESSAGE_SHADOW_DOM_ANCESTORS_CHAIN_CONNECTED = 'SHADOW_DOM_ANCESTORS_CHAIN_CONNECTED';

const registrationName = 'DBUIWebComponentBase';

function defineCommonCSSVars(win) {
  const { document } = win;
  const commonStyle = document.createElement('style');
  commonStyle.setAttribute('dbui-common-css-vars', '');
  commonStyle.innerHTML = _DBUICommonCssVars2.default;
  document.querySelector('head').appendChild(commonStyle);
}

function getDBUIWebComponentCore(win) {
  const LocaleService = (0, _DBUILocaleService2.default)(win);

  return (0, _ensureSingleRegistration2.default)(win, registrationName, () => {
    defineCommonCSSVars(win);

    const { document, HTMLElement, customElements } = win;

    class DBUIWebComponentBase extends HTMLElement {

      static get registrationName() {
        throw new Error('registrationName must be defined in derived classes');
      }

      static get templateInnerHTML() {
        return '<style></style><slot></slot>';
      }

      static get dependencies() {
        return [];
      }

      static get propertiesToUpgrade() {
        return [];
      }

      static get propertiesToDefine() {
        return { 'dbui-web-component': '' };
      }

      static get CONSTANTS() {
        return {
          PARENT_TARGET_TYPE,
          CHILDREN_TARGET_TYPE,
          SHADOW_DOM_TYPE,
          LIGHT_DOM_TYPE,
          CHANNEL_INTERNAL,
          MESSAGE_SHADOW_DOM_ANCESTORS_CHAIN_CONNECTED
        };
      }

      // web components standard API
      static get observedAttributes() {
        return [];
      }

      get isSelfOrParentShadowDomAncestorsChainConnected() {
        // if !this.shadowDomParent we're in light DOM (we are the chain head)
        // Return true if we are either chain head or a child of a parent having ancestors chain connected.
        // A parent has shadowDomAncestorsChainConnected if it was told so by its parent (via passed down message).
        // This implies that its parent connectedCallback has run.
        // this.shadowDomParent.shadowDomAncestorsChainConnected is useful for shadow dom bits
        // that were added programmatically at runtime.
        return !this.shadowDomParent || this.shadowDomParent.shadowDomAncestorsChainConnected;
      }

      get shadowDomAncestorsChainConnected() {
        return this._shadowDomAncestorsChainConnected;
      }

      get shadowDomChildren() {
        return [...this.shadowRoot.querySelectorAll('[dbui-web-component]')];
      }

      get shadowDomParent() {
        return this.getRootNode().host || null;
      }

      get shadowDomParents() {
        const shadowDomParents = [];
        let shadowDomParent = this.shadowDomParent;
        if (shadowDomParent) {
          shadowDomParents.push(shadowDomParent);
          while (shadowDomParent.shadowDomParent) {
            shadowDomParent = shadowDomParent.shadowDomParent;
            shadowDomParents.push(shadowDomParent);
          }
        }
        return shadowDomParents;
      }

      get lightDomChildren() {
        // return [...this.shadowRoot.querySelectorAll('slot')]
        //   .reduce((acc, slot) => {
        //     return [...acc, ...slot.assignedNodes()
        //       .filter((node) => node.nodeType === Node.ELEMENT_NODE)
        //       .reduce((acc, node) => [...acc, ...node.querySelectorAll('[dbui-web-component]')], [])];
        //   }, []);
        return [...this.querySelectorAll('[dbui-web-component]')];
      }

      get lightDomChildrenFirstLevel() {
        return [];
      }

      get lightDomParent() {
        let parent = this.parentElement;
        while (parent && !parent.hasAttribute('dbui-web-component')) {
          parent = parent.parentElement;
        }
        return parent || null;
      }

      get closestDbuiParent() {
        const parent = this.parentElement;
        const closestParent = parent.closest('[dbui-web-component]');
        return closestParent || this.shadowDomParent;
      }

      get isConnected() {
        return this._isConnected;
      }

      constructor(...args) {
        super();

        this.attachShadow({
          mode: 'open'
          // delegatesFocus: true
          // Not working on IPad so we do an workaround
          // by setting "focused" attribute when needed.
        });

        this._isConnected = false;
        this._shadowDomAncestorsChainConnected = false;
        this._insertTemplate();

        this.connectedCallback = this.connectedCallback.bind(this);
        this.disconnectedCallback = this.disconnectedCallback.bind(this);
        // TODO: _handleLocaleChange only if user sets locale-aware attribute
        this._handleLocaleChange = this._handleLocaleChange.bind(this);
        this.onLocaleChange = this.onLocaleChange.bind(this);
        this.unregisterLocaleChange = null;

        // provide support for traits if any as they can't override constructor
        this.init && this.init(...args);
      }

      // https://developers.google.com/web/fundamentals/web-components/best-practices#lazy-properties
      // https://developers.google.com/web/fundamentals/web-components/examples/howto-checkbox
      /* eslint no-prototype-builtins: 0 */
      _upgradeProperty(prop) {
        if (this.hasOwnProperty(prop)) {
          const value = this[prop];
          // get rid of the property that might shadow a setter/getter
          delete this[prop];
          // this time if a setter was defined it will be properly called
          this[prop] = value;
          // if a getter was defined, it will be called from now on
        }
      }

      _defineProperty(key, value) {
        // don't override user defined value
        if (!this.hasAttribute(key)) {
          this.setAttribute(key, value);
        }
      }

      _insertTemplate() {
        const { template } = this.constructor;
        template && this.shadowRoot.appendChild(template.content.cloneNode(true));
      }

      _handleLocaleChange(locale) {
        this.setAttribute('dir', locale.dir);
        this.setAttribute('lang', locale.lang);
        this.onLocaleChange(locale);
      }

      _propagateMessage(messageInst) {
        // Will be ignored if rememberNodesPath was false at message creation
        messageInst.appendVisitedNode(this);
        this.onMessageReceived(messageInst);
        // Inside onMessageReceived there is a chance that
        // message#stopPropagation has been called.
        if (messageInst.shouldPropagate) {
          this.sendMessage(messageInst);
        }
      }

      // web components standard API
      /*
      * connectedCallback is fired from children to parent in shadow DOM
      * but the order is less predictable in light DOM.
      * Should not read light/shadowDomParent/Children here.
      * */
      connectedCallback() {
        this._isConnected = true;
        win.addEventListener('beforeunload', this.disconnectedCallback, false);
        this.unregisterLocaleChange = LocaleService.onLocaleChange(this._handleLocaleChange);
        const { propertiesToUpgrade, propertiesToDefine } = this.constructor;
        propertiesToUpgrade.forEach(property => {
          this._upgradeProperty(property);
        });
        Object.keys(propertiesToDefine).forEach(property => {
          this._defineProperty(property, propertiesToDefine[property]);
        });

        const info = () => {
          const selfId = this.id || 'no id';
          const isDefined = !!win.customElements.get(this.constructor.registrationName);
          const hasAttr = this.hasAttribute('dbui-web-component');

          const closestDbuiParent = this.closestDbuiParent;
          const shadowDomParent = this.shadowDomParent;
          const shadowDomParents = this.shadowDomParents;
          const shadowDomChildren = this.shadowDomChildren;
          const lightDomParent = this.lightDomParent;
          const lightDomChildren = this.lightDomChildren;
          // const lightParentHasAttr = lightDomParent && lightDomParent.hasAttribute('dbui-web-component');
          const ownerDocument = this.ownerDocument;
          const parentNode = this.parentNode;
          const defaultView = ownerDocument.defaultView;

          console.log({
            selfId,
            closestDbuiParent: (closestDbuiParent || {}).id || null
            // isDefined,
            // hasAttr,
            // ownerDocument,
            // parentNode,
            // defaultView,
            // lightParentHasAttr,
            // lightDomParent: (lightDomParent || {}).id || null,
            // lightDomChildren: lightDomChildren.map((child) => child.id).join(', '),
            // shadowDomParents: shadowDomParents.map((child) => child.id).join(', '),
            // shadowDomParent: (shadowDomParent || {}).id || null,
            // shadowDomChildren: shadowDomChildren.map((child) => child.id).join(', ')
          });
        };
        info();
        // setTimeout(info, 0);

        // If is in light DOM or is a child of a parent having connected ancestors
        // notify descendants that ancestor chain is connected.
        // if (this.isSelfOrParentShadowDomAncestorsChainConnected) {
        //   this.shadowDomSendMessageToChildrenAndSelf({
        //     channel: CHANNEL_INTERNAL,
        //     message: MESSAGE_SHADOW_DOM_ANCESTORS_CHAIN_CONNECTED
        //   });
        // }
      }

      // web components standard API
      disconnectedCallback() {
        this._isConnected = false;
        this.unregisterLocaleChange();
        win.removeEventListener('beforeunload', this.disconnectedCallback, false);
      }

      // web components standard API
      attributeChangedCallback() {
        // no op
      }

      onLocaleChange() {
        // no op
      }

      createMessage({
        channel, message, data, rememberNodesPath, targetType, domType, appendSelf = true
      } = {}) {
        const messageInst = new _DBUIWebComponentMessage2.default({
          channel,
          message,
          data,
          source: this,
          rememberNodesPath,
          targetType,
          domType
        });
        // will be ignored if rememberNodesPath was false at message creation
        appendSelf && messageInst.appendVisitedNode(this);
        return messageInst;
      }

      sendMessage(messageInst) {
        const { targetType, domType } = messageInst;
        if (targetType === PARENT_TARGET_TYPE) {
          const parent = domType === SHADOW_DOM_TYPE ? this.shadowDomParent : this.lightDomParent;
          parent && parent._propagateMessage(messageInst.cloneOrInstance);
        } else if (targetType === CHILDREN_TARGET_TYPE) {
          const children = domType === SHADOW_DOM_TYPE ? this.shadowDomChildren : this.lightDomChildren;
          children.forEach(child => {
            child._propagateMessage(messageInst.cloneOrInstance);
          });
        }
      }

      onMessageReceived(messageInst) {
        // console.log(this.id, 'isConnected', this.isConnected, `received message ${messageInst.message}`, 'path', JSON.stringify(messageInst.visitedNodes.map((node) => node.id)), 'source', messageInst.source.id);
        const { domType } = messageInst;
        this[`on${domType}Message`](messageInst);
      }

      [`on${SHADOW_DOM_TYPE}Message`](messageInst) {
        const { channel, domType } = messageInst;
        const listener = `on${domType}${channel}Message`;
        this[listener] && this[listener](messageInst);
      }

      [`on${LIGHT_DOM_TYPE}Message`](messageInst) {
        const { channel, domType } = messageInst;
        const listener = `on${domType}${channel}Message`;
        this[listener] && this[listener](messageInst);
      }

      [`on${SHADOW_DOM_TYPE}${CHANNEL_INTERNAL}Message`](messageInst) {
        const { message } = messageInst;
        message === MESSAGE_SHADOW_DOM_ANCESTORS_CHAIN_CONNECTED && this.onShadowDomAncestorsChainConnected(messageInst);
      }

      // eslint-disable-next-line
      onShadowDomAncestorsChainConnected(messageInst) {
        this._shadowDomAncestorsChainConnected = true;
        // console.log(this.id, 'isConnected', this.isConnected, 'onShadowDomAncestorsChainConnected', messageInst.source.id);
      }

      shadowDomSendMessageToParent({ channel, message, data, rememberNodesPath }) {
        this.sendMessage(this.createMessage({
          channel,
          message,
          data,
          rememberNodesPath,
          targetType: PARENT_TARGET_TYPE,
          domType: SHADOW_DOM_TYPE
        }));
      }

      shadowDomSendMessageToChildren({ channel, message, data, rememberNodesPath }) {
        this.sendMessage(this.createMessage({
          channel,
          message,
          data,
          rememberNodesPath,
          targetType: CHILDREN_TARGET_TYPE,
          domType: SHADOW_DOM_TYPE
        }));
      }

      shadowDomSendMessageToParentAndSelf({ channel, message, data, rememberNodesPath }) {
        const messageInst = this.createMessage({
          channel,
          message,
          data,
          rememberNodesPath,
          targetType: PARENT_TARGET_TYPE,
          domType: SHADOW_DOM_TYPE,
          appendSelf: false
        });
        this._propagateMessage(messageInst);
      }

      shadowDomSendMessageToChildrenAndSelf({ channel, message, data, rememberNodesPath }) {
        const messageInst = this.createMessage({
          channel,
          message,
          data,
          rememberNodesPath,
          targetType: CHILDREN_TARGET_TYPE,
          domType: SHADOW_DOM_TYPE,
          appendSelf: false
        });
        this._propagateMessage(messageInst);
      }

    }

    function defineCommonStaticMethods(klass) {
      const templateInnerHTML = klass.templateInnerHTML;
      const template = document.createElement('template');
      template.innerHTML = templateInnerHTML;

      Object.defineProperty(klass, 'template', {
        get() {
          return template;
        },
        enumerable: false,
        configurable: true
      });

      Object.defineProperty(klass, 'componentStyle', {
        get() {
          return klass.template.content.querySelector('style').innerHTML;
        },
        set(value) {
          klass.template.content.querySelector('style').innerHTML = value;
        },
        enumerable: false,
        configurable: true
      });

      return klass;
    }

    function Registerable(klass) {
      klass.registerSelf = () => {
        const registrationName = klass.registrationName;
        const dependencies = klass.dependencies;
        // Make sure our dependencies are registered before we register self
        dependencies.forEach(dependency => dependency.registerSelf());
        // Don't try to register self if already registered
        if (customElements.get(registrationName)) return registrationName;
        // Give a chance to override web-component style if provided before being registered.
        const componentStyle = ((win.DBUIWebComponents || {})[registrationName] || {}).componentStyle;
        if (componentStyle) {
          klass.componentStyle += '\n\n/* ==== overrides ==== */\n\n';
          klass.componentStyle += componentStyle;
        }
        // Do registration
        customElements.define(registrationName, klass);
        return registrationName;
      };

      Object.defineProperty(klass, 'prototypeChainInfo', {
        get() {
          const chain = [klass];
          let parentProto = Object.getPrototypeOf(klass);
          while (parentProto !== HTMLElement) {
            chain.push(parentProto);
            parentProto = Object.getPrototypeOf(parentProto);
          }
          chain.push(parentProto);
          return chain;
        },
        enumerable: false,
        configurable: true
      });

      return klass;
    }

    return {
      DBUIWebComponentBase,
      defineCommonStaticMethods,
      Registerable
    };
  });
}

},{"../../../internals/ensureSingleRegistration":3,"../../../services/DBUILocaleService":5,"./DBUICommonCssVars":11,"./DBUIWebComponentMessage":13}],13:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
class DBUIWebComponentMessage {
  constructor({
    channel, message, data, source, rememberNodesPath,
    domType, targetType, metadata
  }) {
    this._channel = channel;
    this._message = message;
    this._data = data;
    this._source = source; // instance of node creating the message
    this._rememberNodesPath = rememberNodesPath;
    this._domType = domType; // LIGHT_DOM_TYPE || SHADOW_DOM_TYPE
    this._targetType = targetType; // PARENT_TARGET_TYPE || CHILDREN_TARGET_TYPE
    this._metadata = metadata;

    // internals
    this._shouldPropagate = true;
    this._visitedNodes = [];
  }

  get cloneOrInstance() {
    // The clone only makes sense if we're remembering the nodes path.
    // If we don't need that, reusing the instance should be fine.
    if (!this.rememberNodesPath) return this;
    const messageClone = new DBUIWebComponentMessage({
      channel: this.channel,
      message: this.message,
      data: this.data,
      source: this.source,
      rememberNodesPath: this.rememberNodesPath,
      domType: this.domType,
      targetType: this.targetType,
      metadata: this.metadata
    });
    messageClone._shouldPropagate = this.shouldPropagate;
    messageClone._visitedNodes = [...this.visitedNodes];
    return messageClone;
  }

  appendVisitedNode(node) {
    if (!this.rememberNodesPath) return;
    this._visitedNodes.push(node);
  }

  stopPropagation() {
    this._shouldPropagate = false;
  }

  get shouldPropagate() {
    return this._shouldPropagate;
  }

  get channel() {
    return this._channel;
  }

  get message() {
    return this._message;
  }

  get data() {
    return this._data;
  }

  get source() {
    return this._source;
  }

  get rememberNodesPath() {
    return this._rememberNodesPath;
  }

  get domType() {
    return this._domType;
  }

  get targetType() {
    return this._targetType;
  }

  get metadata() {
    return this._metadata;
  }

  get visitedNodes() {
    return [...this._visitedNodes];
  }

}
exports.default = DBUIWebComponentMessage;

},{}],14:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getDBUIWebComponentDummy;

var _DBUIWebComponentCore = require('../DBUIWebComponentCore/DBUIWebComponentCore');

var _DBUIWebComponentCore2 = _interopRequireDefault(_DBUIWebComponentCore);

var _ensureSingleRegistration = require('../../../internals/ensureSingleRegistration');

var _ensureSingleRegistration2 = _interopRequireDefault(_ensureSingleRegistration);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const registrationName = 'dbui-web-component-dummy';

function getDBUIWebComponentDummy(win) {
  return (0, _ensureSingleRegistration2.default)(win, registrationName, () => {
    const {
      DBUIWebComponentBase,
      defineCommonStaticMethods,
      Registerable
    } = (0, _DBUIWebComponentCore2.default)(win);

    class DBUIWebComponentDummy extends DBUIWebComponentBase {

      static get registrationName() {
        return registrationName;
      }

      static get templateInnerHTML() {
        return `
          <style>
          :host {
            display: inline-block;
            width: 100%;
            max-width: 400px;
            height: var(--dbui-input-height, 50px);
            color: maroon;
            border: 1px solid gray;
            box-sizing: border-box;
          }
          
          :host b, :host div[x-has-slot] span[x-slot-wrapper] {
            unicode-bidi: bidi-override;
            text-shadow: var(--dummy-b-text-shadow, none);
          }
    
          :host([dir=rtl]) b {
            text-decoration: underline;
          }
          
          :host([dir=ltr]) b {
            text-decoration: overline;
          }
    
          :host([dir=ltr]) #container > div[dir=rtl],
          :host([dir=rtl]) #container > div[dir=ltr] {
            display: none;
          }
          
          :host #container > div[x-has-slot] {
            margin-left: 0px;
          }
          
          #container {
            width: 100%;
            height: 100%;
            display: flex;
            flex-flow: row nowrap;
            align-items: stretch;
          }
          
          #container > div {
            border: 1px solid gray;
            border-radius: var(--dummy-inner-sections-border-radius, 0px);
            flex: 1 0 0%;
            display: flex;
            margin: 5px;
          }
          
          #container > div > div {
            margin: auto;
          }
          
          </style>
          
          <div id="container">
            <div dir="ltr">
              <div>
                <b>Dummy shadow</b> [LTR]
              </div>
            </div>
            
            <div x-has-slot>
              <div>
                <span>[</span><span x-slot-wrapper><slot></slot></span><span>]</span>
              </div>
            </div>
            
            <div dir="rtl">
              <div>
                <b>Dummy shadow</b> [RTL]
              </div>
            </div>
          </div>
        `;
      }

      onLocaleChange(locale) {
        // console.log('onLocaleChange', locale);
      }
    }

    return Registerable(defineCommonStaticMethods(DBUIWebComponentDummy));
  });
}

getDBUIWebComponentDummy.registrationName = registrationName;

},{"../../../internals/ensureSingleRegistration":3,"../DBUIWebComponentCore/DBUIWebComponentCore":12}],15:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getDBUIWebComponentDummyParent;

var _DBUIWebComponentCore = require('../DBUIWebComponentCore/DBUIWebComponentCore');

var _DBUIWebComponentCore2 = _interopRequireDefault(_DBUIWebComponentCore);

var _DBUIWebComponentDummy = require('../DBUIWebComponentDummy/DBUIWebComponentDummy');

var _DBUIWebComponentDummy2 = _interopRequireDefault(_DBUIWebComponentDummy);

var _ensureSingleRegistration = require('../../../internals/ensureSingleRegistration');

var _ensureSingleRegistration2 = _interopRequireDefault(_ensureSingleRegistration);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const registrationName = 'dbui-web-component-dummy-parent';

function getDBUIWebComponentDummyParent(win) {
  return (0, _ensureSingleRegistration2.default)(win, registrationName, () => {
    const {
      DBUIWebComponentBase,
      defineCommonStaticMethods,
      Registerable
    } = (0, _DBUIWebComponentCore2.default)(win);
    const DBUIWebComponentDummy = (0, _DBUIWebComponentDummy2.default)(win);

    class DBUIWebComponentDummyParent extends DBUIWebComponentBase {

      static get registrationName() {
        return registrationName;
      }

      static get templateInnerHTML() {
        return `
          <style>
          :host {
            display: inline-block;
            width: 100%;
            max-width: 400px;
          }
          </style>
          <div>
            <div>
              <b>Dummy Parent shadow</b>
            </div>
            <div>
              <dbui-web-component-dummy><slot></slot></dbui-web-component-dummy>
            </div>
          </div>
        `;
      }

      static get dependencies() {
        return [DBUIWebComponentDummy];
      }

    }

    return Registerable(defineCommonStaticMethods(DBUIWebComponentDummyParent));
  });
}

getDBUIWebComponentDummyParent.registrationName = registrationName;

},{"../../../internals/ensureSingleRegistration":3,"../DBUIWebComponentCore/DBUIWebComponentCore":12,"../DBUIWebComponentDummy/DBUIWebComponentDummy":14}],16:[function(require,module,exports){
(function (process){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getDBUIWebComponentFormInputText;

var _DBUIWebComponentCore = require('../DBUIWebComponentCore/DBUIWebComponentCore');

var _DBUIWebComponentCore2 = _interopRequireDefault(_DBUIWebComponentCore);

var _ensureSingleRegistration = require('../../../internals/ensureSingleRegistration');

var _ensureSingleRegistration2 = _interopRequireDefault(_ensureSingleRegistration);

var _Focusable = require('../../behaviours/Focusable');

var _Focusable2 = _interopRequireDefault(_Focusable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const registrationName = 'dbui-web-component-form-input-text';

function getDBUIWebComponentFormInputText(win) {
  return (0, _ensureSingleRegistration2.default)(win, registrationName, () => {
    const {
      DBUIWebComponentBase,
      defineCommonStaticMethods,
      Registerable
    } = (0, _DBUIWebComponentCore2.default)(win);

    class DBUIWebComponentFormInputText extends DBUIWebComponentBase {

      static get registrationName() {
        return registrationName;
      }

      static get templateInnerHTML() {
        return `
          <style>
          :host {
            all: initial; 
            display: inline-block;
            width: 100%;
            /*height: var(--dbui-web-component-form-input-height);*/
            /*line-height: var(--dbui-web-component-form-input-height);*/
            height: 300px;
            padding: 0px;
            font-size: 18px;
            color: var(--dbui-web-component-form-input-color);
            /*background-color: var(--dbui-web-component-form-input-background-color);*/
            background-color: rgba(255, 100, 0, 0.1);
            unicode-bidi: bidi-override;
            box-sizing: border-box;
            border: none;
            border-bottom: var(--dbui-web-component-form-input-border-width) var(--dbui-web-component-form-input-border-style) var(--dbui-web-component-form-input-border-color);
          }
          
          :host [tabindex] {
            width: 100%;
            height: 50px;
            line-height: 50px;
            border: none;
            margin: 0px;
            padding: 0px;
            background-color: transparent;
            border-radius: 0px;
            box-sizing: border-box;
            unicode-bidi: bidi-override;
          }
          
          :host [tabindex]:focus {
            background-color: rgba(255, 0, 0, .3);
            outline: none;
          }
    
          :host([focused]) {
            background-color: rgba(0, 255, 0, .3);
          }
          
          /*:host([disabled]) {*/
            /*background-color: rgba(0, 0, 0, .3);*/
          /*}*/
    
          :host([hidden]) {
            display: none;
          }
    
          :host([dir=rtl]) {
          
          }
          
          :host([dir=ltr]) {
          
          }
          </style>
          <p>DBUIWebComponentFormInputText</p>
          <div contenteditable="true" tabindex="0"></div>
          <div contenteditable="true" tabindex="0"></div>
          <input type="text" tabindex="0" />
          <input type="text" tabindex="0" />
        `;
      }

      static get propertiesToDefine() {
        return {
          role: 'form-input'
        };
      }

      onLocaleChange(locale) {
        if (process.env.NODE_ENV !== 'production') {
          /* eslint no-console: 0 */
          // console.log('onLocaleChange', locale);
        }
      }

    }

    return Registerable((0, _Focusable2.default)(defineCommonStaticMethods(DBUIWebComponentFormInputText)));
  });
}

getDBUIWebComponentFormInputText.registrationName = registrationName;

}).call(this,require('_process'))

},{"../../../internals/ensureSingleRegistration":3,"../../behaviours/Focusable":10,"../DBUIWebComponentCore/DBUIWebComponentCore":12,"_process":1}],17:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getDBUIWebComponentIcon;

var _DBUIWebComponentCore = require('../DBUIWebComponentCore/DBUIWebComponentCore');

var _DBUIWebComponentCore2 = _interopRequireDefault(_DBUIWebComponentCore);

var _ensureSingleRegistration = require('../../../internals/ensureSingleRegistration');

var _ensureSingleRegistration2 = _interopRequireDefault(_ensureSingleRegistration);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const registrationName = 'dbui-web-component-icon';

// https://github.com/gorangajic/react-icon-base/blob/master/index.js
// https://raw.githubusercontent.com/gorangajic/react-icons/master/icons/go/mark-github.svg
// https://github.com/gorangajic/react-icons
// https://github.com/gorangajic/react-icons/blob/master/go/mark-github.js
// https://gorangajic.github.io/react-icons/go.html

function getDBUIWebComponentIcon(win) {
  return (0, _ensureSingleRegistration2.default)(win, registrationName, () => {
    const {
      DBUIWebComponentBase,
      defineCommonStaticMethods,
      Registerable
    } = (0, _DBUIWebComponentCore2.default)(win);

    class DBUIWebComponentIcon extends DBUIWebComponentBase {

      static get registrationName() {
        return registrationName;
      }

      static get templateInnerHTML() {
        return `
          <style>
          :host {
            all: initial;
            font-size: inherit; 
            display: inline-block;
            width: 1em;
            height: 1em;
            vertical-align: middle;
            color: inherit;
          }
          :host svg {
            display: inline-block;
            width: 1em;
            height: 1em;
            vertical-align: top;
            fill: currentColor;
          }
          </style>
          <svg viewBox="0 0 40 40"  preserveAspectRatio="xMidYMid meet" >
            <g><path d=""/></g>
          </svg>
        `;
      }

      static get propertiesToUpgrade() {
        const inheritedPropertiesToUpgrade = super.propertiesToUpgrade || [];
        return [...inheritedPropertiesToUpgrade, 'shape'];
      }

      static get observedAttributes() {
        const inheritedObservedAttributes = super.observedAttributes || [];
        return [...inheritedObservedAttributes, 'shape'];
      }

      get shape() {
        return this.getAttribute('shape');
      }

      set shape(value) {
        const hasValue = ![undefined, null].includes(value);
        const stringValue = String(value);
        if (hasValue) {
          this.setAttribute('shape', stringValue);
        } else {
          this.removeAttribute('shape');
        }
      }

      attributeChangedCallback(name, oldValue, newValue) {
        super.attributeChangedCallback && super.attributeChangedCallback(name, oldValue, newValue);

        const hasValue = ![undefined, null].includes(newValue);
        if (name === 'shape') {
          hasValue ? this._setShape() : this._removeShape();
        }
      }

      _setShape() {
        const path = this.shadowRoot.querySelector('svg g path');
        path.setAttribute('d', this.shape);
      }

      _removeShape() {
        const path = this.shadowRoot.querySelector('svg g path');
        path.setAttribute('d', '');
      }

    }

    return Registerable(defineCommonStaticMethods(DBUIWebComponentIcon));
  });
}

getDBUIWebComponentIcon.registrationName = registrationName;

},{"../../../internals/ensureSingleRegistration":3,"../DBUIWebComponentCore/DBUIWebComponentCore":12}],18:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _appendStyles = require('../../internals/appendStyles');

var _appendStyles2 = _interopRequireDefault(_appendStyles);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
* @param components Array<Object> [{
*  registrationName,
*  componentStyle,
*  ...
* }]
* @returns components Array<Object>
*/
const dbuiWebComponentsSetUp = win => components => {
  return (0, _appendStyles2.default)(win)(components);
};

exports.default = dbuiWebComponentsSetUp;

},{"../../internals/appendStyles":2}],"dev-box-ui-core":[function(require,module,exports){
(function (process){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDBUIWebComponentIcon = exports.getDBUIWebComponentFormInputText = exports.getDBUIWebComponentDummyParent = exports.getDBUIWebComponentDummy = exports.onScreenConsole = exports.template = exports.traits = exports.formatters = exports.getDBUII18nService = exports.getDBUILocaleService = exports.Focusable = exports.getDBUIWebComponentCore = exports.ensureSingleRegistration = exports.dbuiWebComponentsSetUp = exports.quickSetupAndLoad = exports.registrations = undefined;

var _dbuiWebComponentsSetup = require('./web-components/helpers/dbuiWebComponentsSetup');

var _dbuiWebComponentsSetup2 = _interopRequireDefault(_dbuiWebComponentsSetup);

var _ensureSingleRegistration = require('./internals/ensureSingleRegistration');

var _ensureSingleRegistration2 = _interopRequireDefault(_ensureSingleRegistration);

var _DBUIWebComponentCore = require('./web-components/components/DBUIWebComponentCore/DBUIWebComponentCore');

var _DBUIWebComponentCore2 = _interopRequireDefault(_DBUIWebComponentCore);

var _Focusable = require('./web-components/behaviours/Focusable');

var _Focusable2 = _interopRequireDefault(_Focusable);

var _DBUILocaleService = require('./services/DBUILocaleService');

var _DBUILocaleService2 = _interopRequireDefault(_DBUILocaleService);

var _DBUII18nService = require('./services/DBUII18nService');

var _DBUII18nService2 = _interopRequireDefault(_DBUII18nService);

var _formatters = require('./utils/formatters');

var _formatters2 = _interopRequireDefault(_formatters);

var _traits = require('./utils/traits');

var _traits2 = _interopRequireDefault(_traits);

var _template = require('./utils/template');

var _template2 = _interopRequireDefault(_template);

var _onScreenConsole = require('./utils/onScreenConsole');

var _onScreenConsole2 = _interopRequireDefault(_onScreenConsole);

var _DBUIWebComponentDummy = require('./web-components/components/DBUIWebComponentDummy/DBUIWebComponentDummy');

var _DBUIWebComponentDummy2 = _interopRequireDefault(_DBUIWebComponentDummy);

var _DBUIWebComponentDummyParent = require('./web-components/components/DBUIWebComponentDummyParent/DBUIWebComponentDummyParent');

var _DBUIWebComponentDummyParent2 = _interopRequireDefault(_DBUIWebComponentDummyParent);

var _DBUIWebComponentFormInputText = require('./web-components/components/DBUIWebComponentFormInputText/DBUIWebComponentFormInputText');

var _DBUIWebComponentFormInputText2 = _interopRequireDefault(_DBUIWebComponentFormInputText);

var _DBUIWebComponentIcon = require('./web-components/components/DBUIWebComponentIcon/DBUIWebComponentIcon');

var _DBUIWebComponentIcon2 = _interopRequireDefault(_DBUIWebComponentIcon);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Components


// Utils


// Services


// ComponentBase

// Helpers
const registrations = {
  [_DBUIWebComponentDummy2.default.registrationName]: _DBUIWebComponentDummy2.default,
  [_DBUIWebComponentDummyParent2.default.registrationName]: _DBUIWebComponentDummyParent2.default,
  [_DBUIWebComponentFormInputText2.default.registrationName]: _DBUIWebComponentFormInputText2.default,
  [_DBUIWebComponentIcon2.default.registrationName]: _DBUIWebComponentIcon2.default
};

/*
This helper function is just for convenience.
Using it implies that entire DBUIWebComponents library is already loaded.
It is useful especially when working with distribution build.
If one wants to load just one web-component or a subset of core
they should be loaded from node_modules/dev-box-ui/core by their path
ex:
import SomeComponentLoader from node_modules/dev-box-ui/core/path/to/SomeComponent;
*/


// Behaviours


// Internals
function quickSetupAndLoad(win = window) {
  /**
   * @param components Object {
   *  registrationName,
   *  componentStyle
   * }
   * @return Object { <registrationName>, <componentClass> }
   */
  return function (components) {
    return (0, _dbuiWebComponentsSetup2.default)(win)(components).reduce((acc, { registrationName }) => {
      const componentClass = registrations[registrationName](window);
      componentClass.registerSelf();
      acc[registrationName] = componentClass;
      return acc;
    }, {});
  };
}

exports.registrations = registrations;
exports.quickSetupAndLoad = quickSetupAndLoad;
exports.dbuiWebComponentsSetUp = _dbuiWebComponentsSetup2.default;
exports.ensureSingleRegistration = _ensureSingleRegistration2.default;
exports.getDBUIWebComponentCore = _DBUIWebComponentCore2.default;
exports.Focusable = _Focusable2.default;
exports.getDBUILocaleService = _DBUILocaleService2.default;
exports.getDBUII18nService = _DBUII18nService2.default;
exports.formatters = _formatters2.default;
exports.traits = _traits2.default;
exports.template = _template2.default;
exports.onScreenConsole = _onScreenConsole2.default;
exports.getDBUIWebComponentDummy = _DBUIWebComponentDummy2.default;
exports.getDBUIWebComponentDummyParent = _DBUIWebComponentDummyParent2.default;
exports.getDBUIWebComponentFormInputText = _DBUIWebComponentFormInputText2.default;
exports.getDBUIWebComponentIcon = _DBUIWebComponentIcon2.default;

/* eslint no-console: 0 */

let build = 'production';

if (process.env.NODE_ENV !== 'production') {
  build = 'develop';
}

console.log(`Using DBUIWebComponentsDistLib ${build} build.`);

}).call(this,require('_process'))

},{"./internals/ensureSingleRegistration":3,"./services/DBUII18nService":4,"./services/DBUILocaleService":5,"./utils/formatters":6,"./utils/onScreenConsole":7,"./utils/template":8,"./utils/traits":9,"./web-components/behaviours/Focusable":10,"./web-components/components/DBUIWebComponentCore/DBUIWebComponentCore":12,"./web-components/components/DBUIWebComponentDummy/DBUIWebComponentDummy":14,"./web-components/components/DBUIWebComponentDummyParent/DBUIWebComponentDummyParent":15,"./web-components/components/DBUIWebComponentFormInputText/DBUIWebComponentFormInputText":16,"./web-components/components/DBUIWebComponentIcon/DBUIWebComponentIcon":17,"./web-components/helpers/dbuiWebComponentsSetup":18,"_process":1}]},{},[])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvcHJvY2Vzcy9icm93c2VyLmpzIiwic3JjL2xpYi9jb3JlL2ludGVybmFscy9hcHBlbmRTdHlsZXMuanMiLCJzcmMvbGliL2NvcmUvaW50ZXJuYWxzL2Vuc3VyZVNpbmdsZVJlZ2lzdHJhdGlvbi5qcyIsInNyYy9saWIvY29yZS9zZXJ2aWNlcy9EQlVJSTE4blNlcnZpY2UuanMiLCJzcmMvbGliL2NvcmUvc2VydmljZXMvREJVSUxvY2FsZVNlcnZpY2UuanMiLCJzcmMvbGliL2NvcmUvdXRpbHMvZm9ybWF0dGVycy5qcyIsInNyYy9saWIvY29yZS91dGlscy9vblNjcmVlbkNvbnNvbGUuanMiLCJzcmMvbGliL2NvcmUvdXRpbHMvdGVtcGxhdGUuanMiLCJzcmMvbGliL2NvcmUvdXRpbHMvdHJhaXRzLmpzIiwic3JjL2xpYi9jb3JlL3dlYi1jb21wb25lbnRzL2JlaGF2aW91cnMvRm9jdXNhYmxlLmpzIiwic3JjL2xpYi9jb3JlL3dlYi1jb21wb25lbnRzL2NvbXBvbmVudHMvREJVSVdlYkNvbXBvbmVudENvcmUvREJVSUNvbW1vbkNzc1ZhcnMuanMiLCJzcmMvbGliL2NvcmUvd2ViLWNvbXBvbmVudHMvY29tcG9uZW50cy9EQlVJV2ViQ29tcG9uZW50Q29yZS9EQlVJV2ViQ29tcG9uZW50Q29yZS5qcyIsInNyYy9saWIvY29yZS93ZWItY29tcG9uZW50cy9jb21wb25lbnRzL0RCVUlXZWJDb21wb25lbnRDb3JlL0RCVUlXZWJDb21wb25lbnRNZXNzYWdlLmpzIiwic3JjL2xpYi9jb3JlL3dlYi1jb21wb25lbnRzL2NvbXBvbmVudHMvREJVSVdlYkNvbXBvbmVudER1bW15L0RCVUlXZWJDb21wb25lbnREdW1teS5qcyIsInNyYy9saWIvY29yZS93ZWItY29tcG9uZW50cy9jb21wb25lbnRzL0RCVUlXZWJDb21wb25lbnREdW1teVBhcmVudC9EQlVJV2ViQ29tcG9uZW50RHVtbXlQYXJlbnQuanMiLCJzcmMvbGliL2NvcmUvd2ViLWNvbXBvbmVudHMvY29tcG9uZW50cy9EQlVJV2ViQ29tcG9uZW50Rm9ybUlucHV0VGV4dC9EQlVJV2ViQ29tcG9uZW50Rm9ybUlucHV0VGV4dC5qcyIsInNyYy9saWIvY29yZS93ZWItY29tcG9uZW50cy9jb21wb25lbnRzL0RCVUlXZWJDb21wb25lbnRJY29uL0RCVUlXZWJDb21wb25lbnRJY29uLmpzIiwic3JjL2xpYi9jb3JlL3dlYi1jb21wb25lbnRzL2hlbHBlcnMvZGJ1aVdlYkNvbXBvbmVudHNTZXR1cC5qcyIsInNyYy9saWIvc3JjL2xpYi9jb3JlL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtB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QixNQUFNLE1BQWpDLEVBQXlDO0FBQ3ZDOzs7Ozs7O0FBT0EsU0FBTyxVQUFVLFVBQVYsRUFBc0I7QUFDM0IsV0FBTyxzQ0FBdUIsR0FBdkIsRUFBNEIsVUFBNUIsRUFDSixNQURJLENBQ0csQ0FBQyxHQUFELEVBQU0sRUFBRSxnQkFBRixFQUFOLEtBQStCO0FBQ3JDLFlBQU0saUJBQWlCLGNBQWMsZ0JBQWQsRUFBZ0MsTUFBaEMsQ0FBdkI7QUFDQSxxQkFBZSxZQUFmO0FBQ0EsVUFBSSxnQkFBSixJQUF3QixjQUF4QjtBQUNBLGFBQU8sR0FBUDtBQUNELEtBTkksRUFNRixFQU5FLENBQVA7QUFPRCxHQVJEO0FBU0Q7O1FBR0MsYSxHQUFBLGE7UUFHQSxpQixHQUFBLGlCO1FBQ0Esc0I7UUFHQSx3QjtRQUdBLHVCO1FBR0EsUztRQUdBLG9CO1FBQ0Esa0I7UUFHQSxVO1FBQ0EsTTtRQUNBLFE7UUFDQSxlO1FBR0Esd0I7UUFDQSw4QjtRQUNBLGdDO1FBQ0EsdUI7O0FBR0Y7O0FBRUEsSUFBSSxRQUFRLFlBQVo7O0FBRUEsSUFBSSxRQUFRLEdBQVIsQ0FBWSxRQUFaLEtBQXlCLFlBQTdCLEVBQTJDO0FBQ3pDLFVBQVEsU0FBUjtBQUNEOztBQUVELFFBQVEsR0FBUixDQUFhLGtDQUFpQyxLQUFNLFNBQXBEIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8vIHNoaW0gZm9yIHVzaW5nIHByb2Nlc3MgaW4gYnJvd3NlclxudmFyIHByb2Nlc3MgPSBtb2R1bGUuZXhwb3J0cyA9IHt9O1xuXG4vLyBjYWNoZWQgZnJvbSB3aGF0ZXZlciBnbG9iYWwgaXMgcHJlc2VudCBzbyB0aGF0IHRlc3QgcnVubmVycyB0aGF0IHN0dWIgaXRcbi8vIGRvbid0IGJyZWFrIHRoaW5ncy4gIEJ1dCB3ZSBuZWVkIHRvIHdyYXAgaXQgaW4gYSB0cnkgY2F0Y2ggaW4gY2FzZSBpdCBpc1xuLy8gd3JhcHBlZCBpbiBzdHJpY3QgbW9kZSBjb2RlIHdoaWNoIGRvZXNuJ3QgZGVmaW5lIGFueSBnbG9iYWxzLiAgSXQncyBpbnNpZGUgYVxuLy8gZnVuY3Rpb24gYmVjYXVzZSB0cnkvY2F0Y2hlcyBkZW9wdGltaXplIGluIGNlcnRhaW4gZW5naW5lcy5cblxudmFyIGNhY2hlZFNldFRpbWVvdXQ7XG52YXIgY2FjaGVkQ2xlYXJUaW1lb3V0O1xuXG5mdW5jdGlvbiBkZWZhdWx0U2V0VGltb3V0KCkge1xuICAgIHRocm93IG5ldyBFcnJvcignc2V0VGltZW91dCBoYXMgbm90IGJlZW4gZGVmaW5lZCcpO1xufVxuZnVuY3Rpb24gZGVmYXVsdENsZWFyVGltZW91dCAoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdjbGVhclRpbWVvdXQgaGFzIG5vdCBiZWVuIGRlZmluZWQnKTtcbn1cbihmdW5jdGlvbiAoKSB7XG4gICAgdHJ5IHtcbiAgICAgICAgaWYgKHR5cGVvZiBzZXRUaW1lb3V0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gc2V0VGltZW91dDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBkZWZhdWx0U2V0VGltb3V0O1xuICAgICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gZGVmYXVsdFNldFRpbW91dDtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgaWYgKHR5cGVvZiBjbGVhclRpbWVvdXQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGNsZWFyVGltZW91dDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGRlZmF1bHRDbGVhclRpbWVvdXQ7XG4gICAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGRlZmF1bHRDbGVhclRpbWVvdXQ7XG4gICAgfVxufSAoKSlcbmZ1bmN0aW9uIHJ1blRpbWVvdXQoZnVuKSB7XG4gICAgaWYgKGNhY2hlZFNldFRpbWVvdXQgPT09IHNldFRpbWVvdXQpIHtcbiAgICAgICAgLy9ub3JtYWwgZW52aXJvbWVudHMgaW4gc2FuZSBzaXR1YXRpb25zXG4gICAgICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfVxuICAgIC8vIGlmIHNldFRpbWVvdXQgd2Fzbid0IGF2YWlsYWJsZSBidXQgd2FzIGxhdHRlciBkZWZpbmVkXG4gICAgaWYgKChjYWNoZWRTZXRUaW1lb3V0ID09PSBkZWZhdWx0U2V0VGltb3V0IHx8ICFjYWNoZWRTZXRUaW1lb3V0KSAmJiBzZXRUaW1lb3V0KSB7XG4gICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBzZXRUaW1lb3V0O1xuICAgICAgICByZXR1cm4gc2V0VGltZW91dChmdW4sIDApO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICAvLyB3aGVuIHdoZW4gc29tZWJvZHkgaGFzIHNjcmV3ZWQgd2l0aCBzZXRUaW1lb3V0IGJ1dCBubyBJLkUuIG1hZGRuZXNzXG4gICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfSBjYXRjaChlKXtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIC8vIFdoZW4gd2UgYXJlIGluIEkuRS4gYnV0IHRoZSBzY3JpcHQgaGFzIGJlZW4gZXZhbGVkIHNvIEkuRS4gZG9lc24ndCB0cnVzdCB0aGUgZ2xvYmFsIG9iamVjdCB3aGVuIGNhbGxlZCBub3JtYWxseVxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQuY2FsbChudWxsLCBmdW4sIDApO1xuICAgICAgICB9IGNhdGNoKGUpe1xuICAgICAgICAgICAgLy8gc2FtZSBhcyBhYm92ZSBidXQgd2hlbiBpdCdzIGEgdmVyc2lvbiBvZiBJLkUuIHRoYXQgbXVzdCBoYXZlIHRoZSBnbG9iYWwgb2JqZWN0IGZvciAndGhpcycsIGhvcGZ1bGx5IG91ciBjb250ZXh0IGNvcnJlY3Qgb3RoZXJ3aXNlIGl0IHdpbGwgdGhyb3cgYSBnbG9iYWwgZXJyb3JcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0LmNhbGwodGhpcywgZnVuLCAwKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG59XG5mdW5jdGlvbiBydW5DbGVhclRpbWVvdXQobWFya2VyKSB7XG4gICAgaWYgKGNhY2hlZENsZWFyVGltZW91dCA9PT0gY2xlYXJUaW1lb3V0KSB7XG4gICAgICAgIC8vbm9ybWFsIGVudmlyb21lbnRzIGluIHNhbmUgc2l0dWF0aW9uc1xuICAgICAgICByZXR1cm4gY2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfVxuICAgIC8vIGlmIGNsZWFyVGltZW91dCB3YXNuJ3QgYXZhaWxhYmxlIGJ1dCB3YXMgbGF0dGVyIGRlZmluZWRcbiAgICBpZiAoKGNhY2hlZENsZWFyVGltZW91dCA9PT0gZGVmYXVsdENsZWFyVGltZW91dCB8fCAhY2FjaGVkQ2xlYXJUaW1lb3V0KSAmJiBjbGVhclRpbWVvdXQpIHtcbiAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gY2xlYXJUaW1lb3V0O1xuICAgICAgICByZXR1cm4gY2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIC8vIHdoZW4gd2hlbiBzb21lYm9keSBoYXMgc2NyZXdlZCB3aXRoIHNldFRpbWVvdXQgYnV0IG5vIEkuRS4gbWFkZG5lc3NcbiAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH0gY2F0Y2ggKGUpe1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgLy8gV2hlbiB3ZSBhcmUgaW4gSS5FLiBidXQgdGhlIHNjcmlwdCBoYXMgYmVlbiBldmFsZWQgc28gSS5FLiBkb2Vzbid0ICB0cnVzdCB0aGUgZ2xvYmFsIG9iamVjdCB3aGVuIGNhbGxlZCBub3JtYWxseVxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dC5jYWxsKG51bGwsIG1hcmtlcik7XG4gICAgICAgIH0gY2F0Y2ggKGUpe1xuICAgICAgICAgICAgLy8gc2FtZSBhcyBhYm92ZSBidXQgd2hlbiBpdCdzIGEgdmVyc2lvbiBvZiBJLkUuIHRoYXQgbXVzdCBoYXZlIHRoZSBnbG9iYWwgb2JqZWN0IGZvciAndGhpcycsIGhvcGZ1bGx5IG91ciBjb250ZXh0IGNvcnJlY3Qgb3RoZXJ3aXNlIGl0IHdpbGwgdGhyb3cgYSBnbG9iYWwgZXJyb3IuXG4gICAgICAgICAgICAvLyBTb21lIHZlcnNpb25zIG9mIEkuRS4gaGF2ZSBkaWZmZXJlbnQgcnVsZXMgZm9yIGNsZWFyVGltZW91dCB2cyBzZXRUaW1lb3V0XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0LmNhbGwodGhpcywgbWFya2VyKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG5cbn1cbnZhciBxdWV1ZSA9IFtdO1xudmFyIGRyYWluaW5nID0gZmFsc2U7XG52YXIgY3VycmVudFF1ZXVlO1xudmFyIHF1ZXVlSW5kZXggPSAtMTtcblxuZnVuY3Rpb24gY2xlYW5VcE5leHRUaWNrKCkge1xuICAgIGlmICghZHJhaW5pbmcgfHwgIWN1cnJlbnRRdWV1ZSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGRyYWluaW5nID0gZmFsc2U7XG4gICAgaWYgKGN1cnJlbnRRdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgcXVldWUgPSBjdXJyZW50UXVldWUuY29uY2F0KHF1ZXVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBxdWV1ZUluZGV4ID0gLTE7XG4gICAgfVxuICAgIGlmIChxdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgZHJhaW5RdWV1ZSgpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gZHJhaW5RdWV1ZSgpIHtcbiAgICBpZiAoZHJhaW5pbmcpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB2YXIgdGltZW91dCA9IHJ1blRpbWVvdXQoY2xlYW5VcE5leHRUaWNrKTtcbiAgICBkcmFpbmluZyA9IHRydWU7XG5cbiAgICB2YXIgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIHdoaWxlKGxlbikge1xuICAgICAgICBjdXJyZW50UXVldWUgPSBxdWV1ZTtcbiAgICAgICAgcXVldWUgPSBbXTtcbiAgICAgICAgd2hpbGUgKCsrcXVldWVJbmRleCA8IGxlbikge1xuICAgICAgICAgICAgaWYgKGN1cnJlbnRRdWV1ZSkge1xuICAgICAgICAgICAgICAgIGN1cnJlbnRRdWV1ZVtxdWV1ZUluZGV4XS5ydW4oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBxdWV1ZUluZGV4ID0gLTE7XG4gICAgICAgIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB9XG4gICAgY3VycmVudFF1ZXVlID0gbnVsbDtcbiAgICBkcmFpbmluZyA9IGZhbHNlO1xuICAgIHJ1bkNsZWFyVGltZW91dCh0aW1lb3V0KTtcbn1cblxucHJvY2Vzcy5uZXh0VGljayA9IGZ1bmN0aW9uIChmdW4pIHtcbiAgICB2YXIgYXJncyA9IG5ldyBBcnJheShhcmd1bWVudHMubGVuZ3RoIC0gMSk7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBhcmdzW2kgLSAxXSA9IGFyZ3VtZW50c1tpXTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBxdWV1ZS5wdXNoKG5ldyBJdGVtKGZ1biwgYXJncykpO1xuICAgIGlmIChxdWV1ZS5sZW5ndGggPT09IDEgJiYgIWRyYWluaW5nKSB7XG4gICAgICAgIHJ1blRpbWVvdXQoZHJhaW5RdWV1ZSk7XG4gICAgfVxufTtcblxuLy8gdjggbGlrZXMgcHJlZGljdGlibGUgb2JqZWN0c1xuZnVuY3Rpb24gSXRlbShmdW4sIGFycmF5KSB7XG4gICAgdGhpcy5mdW4gPSBmdW47XG4gICAgdGhpcy5hcnJheSA9IGFycmF5O1xufVxuSXRlbS5wcm90b3R5cGUucnVuID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuZnVuLmFwcGx5KG51bGwsIHRoaXMuYXJyYXkpO1xufTtcbnByb2Nlc3MudGl0bGUgPSAnYnJvd3Nlcic7XG5wcm9jZXNzLmJyb3dzZXIgPSB0cnVlO1xucHJvY2Vzcy5lbnYgPSB7fTtcbnByb2Nlc3MuYXJndiA9IFtdO1xucHJvY2Vzcy52ZXJzaW9uID0gJyc7IC8vIGVtcHR5IHN0cmluZyB0byBhdm9pZCByZWdleHAgaXNzdWVzXG5wcm9jZXNzLnZlcnNpb25zID0ge307XG5cbmZ1bmN0aW9uIG5vb3AoKSB7fVxuXG5wcm9jZXNzLm9uID0gbm9vcDtcbnByb2Nlc3MuYWRkTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5vbmNlID0gbm9vcDtcbnByb2Nlc3Mub2ZmID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVBbGxMaXN0ZW5lcnMgPSBub29wO1xucHJvY2Vzcy5lbWl0ID0gbm9vcDtcbnByb2Nlc3MucHJlcGVuZExpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3MucHJlcGVuZE9uY2VMaXN0ZW5lciA9IG5vb3A7XG5cbnByb2Nlc3MubGlzdGVuZXJzID0gZnVuY3Rpb24gKG5hbWUpIHsgcmV0dXJuIFtdIH1cblxucHJvY2Vzcy5iaW5kaW5nID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuYmluZGluZyBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xuXG5wcm9jZXNzLmN3ZCA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuICcvJyB9O1xucHJvY2Vzcy5jaGRpciA9IGZ1bmN0aW9uIChkaXIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuY2hkaXIgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcbnByb2Nlc3MudW1hc2sgPSBmdW5jdGlvbigpIHsgcmV0dXJuIDA7IH07XG4iLCIvKlxuREJVSVdlYkNvbXBvbmVudEJhc2UgKGZyb20gd2hpY2ggYWxsIHdlYi1jb21wb25lbnRzIGluaGVyaXQpXG53aWxsIHJlYWQgY29tcG9uZW50U3R5bGUgZnJvbSB3aW4uREJVSVdlYkNvbXBvbmVudHNcbndoZW4ga2xhc3MucmVnaXN0ZXJTZWxmKCkgaXMgY2FsbGVkIGdpdmluZyBhIGNoYW5jZSB0byBvdmVycmlkZSBkZWZhdWx0IHdlYi1jb21wb25lbnQgc3R5bGVcbmp1c3QgYmVmb3JlIGl0IGlzIHJlZ2lzdGVyZWQuXG4qL1xuY29uc3QgYXBwZW5kU3R5bGUgPSAod2luKSA9PiAocmVnaXN0cmF0aW9uTmFtZSwgY29tcG9uZW50U3R5bGUpID0+IHtcbiAgaWYgKCF3aW4uREJVSVdlYkNvbXBvbmVudHMpIHtcbiAgICB3aW4uREJVSVdlYkNvbXBvbmVudHMgPSB7fTtcbiAgfVxuICB3aW4uREJVSVdlYkNvbXBvbmVudHMgPSB7XG4gICAgLi4ud2luLkRCVUlXZWJDb21wb25lbnRzLFxuICAgIFtyZWdpc3RyYXRpb25OYW1lXToge1xuICAgICAgLi4ud2luLkRCVUlXZWJDb21wb25lbnRzW3JlZ2lzdHJhdGlvbk5hbWVdLFxuICAgICAgY29tcG9uZW50U3R5bGVcbiAgICB9XG4gIH07XG59O1xuXG5jb25zdCBhcHBlbmRTdHlsZXMgPSAod2luKSA9PiAoY29tcG9uZW50cykgPT4ge1xuICBjb21wb25lbnRzLmZvckVhY2goKHsgcmVnaXN0cmF0aW9uTmFtZSwgY29tcG9uZW50U3R5bGUgfSkgPT4ge1xuICAgIGFwcGVuZFN0eWxlKHdpbikocmVnaXN0cmF0aW9uTmFtZSwgY29tcG9uZW50U3R5bGUpO1xuICB9KTtcbiAgcmV0dXJuIGNvbXBvbmVudHM7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBhcHBlbmRTdHlsZXM7XG4iLCJcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZW5zdXJlU2luZ2xlUmVnaXN0cmF0aW9uKHdpbiwgbmFtZSwgY2FsbGJhY2spIHtcbiAgaWYgKCF3aW4uREJVSVdlYkNvbXBvbmVudHMpIHtcbiAgICB3aW4uREJVSVdlYkNvbXBvbmVudHMgPSB7IHJlZ2lzdHJhdGlvbnM6IHt9IH07XG4gIH0gZWxzZSBpZiAoIXdpbi5EQlVJV2ViQ29tcG9uZW50cy5yZWdpc3RyYXRpb25zKSB7XG4gICAgd2luLkRCVUlXZWJDb21wb25lbnRzLnJlZ2lzdHJhdGlvbnMgPSB7fTtcbiAgfVxuXG4gIGxldCByZWdpc3RyYXRpb24gPSB3aW4uREJVSVdlYkNvbXBvbmVudHMucmVnaXN0cmF0aW9uc1tuYW1lXTtcblxuICBpZiAocmVnaXN0cmF0aW9uKSByZXR1cm4gcmVnaXN0cmF0aW9uO1xuXG4gIHJlZ2lzdHJhdGlvbiA9IGNhbGxiYWNrKCk7XG4gIHdpbi5EQlVJV2ViQ29tcG9uZW50cy5yZWdpc3RyYXRpb25zW25hbWVdID0gcmVnaXN0cmF0aW9uO1xuXG4gIHJldHVybiB3aW4uREJVSVdlYkNvbXBvbmVudHMucmVnaXN0cmF0aW9uc1tuYW1lXTtcbn1cblxuIiwiaW1wb3J0IGdldERCVUlsb2NhbGVTZXJ2aWNlIGZyb20gJy4vREJVSUxvY2FsZVNlcnZpY2UnO1xuaW1wb3J0IGVuc3VyZVNpbmdsZVJlZ2lzdHJhdGlvbiBmcm9tICcuLi9pbnRlcm5hbHMvZW5zdXJlU2luZ2xlUmVnaXN0cmF0aW9uJztcblxuY29uc3QgZW1wdHlPYmogPSB7fTtcblxuY29uc3QgcmVnaXN0cmF0aW9uTmFtZSA9ICdEQlVJSTE4blNlcnZpY2UnO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBnZXREQlVJSTE4blNlcnZpY2Uod2luKSB7XG4gIGNvbnN0IGxvY2FsZVNlcnZpY2UgPSBnZXREQlVJbG9jYWxlU2VydmljZSh3aW4pO1xuICByZXR1cm4gZW5zdXJlU2luZ2xlUmVnaXN0cmF0aW9uKHdpbiwgcmVnaXN0cmF0aW9uTmFtZSwgKCkgPT4ge1xuICAgIGNsYXNzIEkxOG5TZXJ2aWNlIHtcbiAgICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBsb2NhbGVTZXJ2aWNlLm9uTG9jYWxlQ2hhbmdlKHRoaXMuX2hhbmRsZUxvY2FsZUNoYW5nZS5iaW5kKHRoaXMpKTtcbiAgICAgICAgdGhpcy5fbG9jYWxlID0gbG9jYWxlU2VydmljZS5sb2NhbGU7XG4gICAgICAgIHRoaXMuX3RyYW5zbGF0aW9ucyA9IHt9O1xuICAgICAgfVxuXG4gICAgICBfaGFuZGxlTG9jYWxlQ2hhbmdlKGxvY2FsZSkge1xuICAgICAgICB0aGlzLl9sb2NhbGUgPSBsb2NhbGU7XG4gICAgICB9XG5cbiAgICAgIGNsZWFyVHJhbnNsYXRpb25zKGxhbmcpIHtcbiAgICAgICAgZGVsZXRlIHRoaXMuX3RyYW5zbGF0aW9uc1tsYW5nXTtcbiAgICAgIH1cblxuICAgICAgcmVnaXN0ZXJUcmFuc2xhdGlvbnModHJhbnNsYXRpb25zKSB7XG4gICAgICAgIHRoaXMuX3RyYW5zbGF0aW9ucyA9IE9iamVjdC5rZXlzKHRyYW5zbGF0aW9ucykucmVkdWNlKChhY2MsIGxhbmcpID0+IHtcbiAgICAgICAgICBhY2NbbGFuZ10gPSB7XG4gICAgICAgICAgICAuLi50aGlzLl90cmFuc2xhdGlvbnNbbGFuZ10sXG4gICAgICAgICAgICAuLi50cmFuc2xhdGlvbnNbbGFuZ11cbiAgICAgICAgICB9O1xuICAgICAgICAgIHJldHVybiBhY2M7XG4gICAgICAgIH0sIHRoaXMuX3RyYW5zbGF0aW9ucyk7XG4gICAgICB9XG5cbiAgICAgIHRyYW5zbGF0ZShtc2cpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY3VycmVudExhbmdUcmFuc2xhdGlvbnNbbXNnXTtcbiAgICAgIH1cblxuICAgICAgZ2V0IHRyYW5zbGF0aW9ucygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3RyYW5zbGF0aW9ucztcbiAgICAgIH1cblxuICAgICAgZ2V0IGN1cnJlbnRMYW5nVHJhbnNsYXRpb25zKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fdHJhbnNsYXRpb25zW3RoaXMuX2xvY2FsZS5sYW5nXSB8fCBlbXB0eU9iajtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBpMThuU2VydmljZSA9IG5ldyBJMThuU2VydmljZSgpO1xuICAgIHJldHVybiBpMThuU2VydmljZTtcbiAgfSk7XG59XG4iLCJcbmltcG9ydCBlbnN1cmVTaW5nbGVSZWdpc3RyYXRpb24gZnJvbSAnLi4vaW50ZXJuYWxzL2Vuc3VyZVNpbmdsZVJlZ2lzdHJhdGlvbic7XG5cbmNvbnN0IGRlZmF1bHRMb2NhbGUgPSB7XG4gIGRpcjogJ2x0cicsXG4gIGxhbmc6ICdlbidcbn07XG5cbmNvbnN0IHJlZ2lzdHJhdGlvbk5hbWUgPSAnREJVSUxvY2FsZVNlcnZpY2UnO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBnZXREQlVJTG9jYWxlU2VydmljZSh3aW4pIHtcbiAgcmV0dXJuIGVuc3VyZVNpbmdsZVJlZ2lzdHJhdGlvbih3aW4sIHJlZ2lzdHJhdGlvbk5hbWUsICgpID0+IHtcbiAgICBjbGFzcyBMb2NhbGVTZXJ2aWNlIHtcbiAgICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLl9jYWxsYmFja3MgPSBbXTtcbiAgICAgICAgdGhpcy5fbG9jYWxlQXR0cnMgPSBPYmplY3Qua2V5cyhkZWZhdWx0TG9jYWxlKTtcbiAgICAgICAgdGhpcy5fcm9vdEVsZW1lbnQgPSB3aW4uZG9jdW1lbnQucXVlcnlTZWxlY3RvcignW3gtZGJ1aS1sb2NhbGUtcm9vdF0nKSB8fCB3aW4uZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50O1xuICAgICAgICB0aGlzLl9sb2NhbGVBdHRycy5mb3JFYWNoKChhdHRyKSA9PiB7XG4gICAgICAgICAgaWYgKCF0aGlzLl9yb290RWxlbWVudC5nZXRBdHRyaWJ1dGUoYXR0cikpIHtcbiAgICAgICAgICAgIHRoaXMuX3Jvb3RFbGVtZW50LnNldEF0dHJpYnV0ZShhdHRyLCBkZWZhdWx0TG9jYWxlW2F0dHJdKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLl9sb2NhbGUgPSB0aGlzLl9sb2NhbGVBdHRycy5yZWR1Y2UoKGFjYywgYXR0cikgPT4ge1xuICAgICAgICAgIGFjY1thdHRyXSA9IHRoaXMuX3Jvb3RFbGVtZW50LmdldEF0dHJpYnV0ZShhdHRyKTtcbiAgICAgICAgICByZXR1cm4gYWNjO1xuICAgICAgICB9LCB7fSk7XG4gICAgICAgIHRoaXMuX29ic2VydmVyID0gbmV3IE11dGF0aW9uT2JzZXJ2ZXIodGhpcy5faGFuZGxlTXV0YXRpb25zLmJpbmQodGhpcykpO1xuICAgICAgICB0aGlzLl9vYnNlcnZlci5vYnNlcnZlKHRoaXMuX3Jvb3RFbGVtZW50LCB7XG4gICAgICAgICAgYXR0cmlidXRlczogdHJ1ZVxuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgX2hhbmRsZU11dGF0aW9ucyhtdXRhdGlvbnMpIHtcbiAgICAgICAgbXV0YXRpb25zLmZvckVhY2goKG11dGF0aW9uKSA9PiB7XG4gICAgICAgICAgY29uc3QgbXV0YXRpb25BdHRyaWJ1dGVOYW1lID0gbXV0YXRpb24uYXR0cmlidXRlTmFtZTtcbiAgICAgICAgICBpZiAodGhpcy5fbG9jYWxlQXR0cnMuaW5jbHVkZXMobXV0YXRpb25BdHRyaWJ1dGVOYW1lKSkge1xuICAgICAgICAgICAgdGhpcy5fbG9jYWxlID0ge1xuICAgICAgICAgICAgICAuLi50aGlzLl9sb2NhbGUsXG4gICAgICAgICAgICAgIFttdXRhdGlvbkF0dHJpYnV0ZU5hbWVdOiB0aGlzLl9yb290RWxlbWVudC5nZXRBdHRyaWJ1dGUobXV0YXRpb25BdHRyaWJ1dGVOYW1lKVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHRoaXMuX2NhbGxiYWNrcy5mb3JFYWNoKGNhbGxiYWNrID0+IGNhbGxiYWNrKHRoaXMuX2xvY2FsZSkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIHNldCBsb2NhbGUobG9jYWxlT2JqKSB7XG4gICAgICAgIE9iamVjdC5rZXlzKGxvY2FsZU9iaikuZm9yRWFjaCgoa2V5KSA9PiB7XG4gICAgICAgICAgdGhpcy5fcm9vdEVsZW1lbnQuc2V0QXR0cmlidXRlKGtleSwgbG9jYWxlT2JqW2tleV0pO1xuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgZ2V0IGxvY2FsZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2xvY2FsZTtcbiAgICAgIH1cblxuICAgICAgb25Mb2NhbGVDaGFuZ2UoY2FsbGJhY2spIHtcbiAgICAgICAgdGhpcy5fY2FsbGJhY2tzLnB1c2goY2FsbGJhY2spO1xuICAgICAgICBjYWxsYmFjayh0aGlzLmxvY2FsZSk7XG4gICAgICAgIHJldHVybiAoKSA9PiB7XG4gICAgICAgICAgdGhpcy5fY2FsbGJhY2tzID0gdGhpcy5fY2FsbGJhY2tzLmZpbHRlcihjYiA9PiBjYiAhPT0gY2FsbGJhY2spO1xuICAgICAgICB9O1xuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IGxvY2FsZVNlcnZpY2UgPSBuZXcgTG9jYWxlU2VydmljZSgpO1xuICAgIHJldHVybiBsb2NhbGVTZXJ2aWNlO1xuICB9KTtcbn1cbiIsIi8qIGVzbGludCBwcmVmZXItY29uc3Q6IDAgKi9cblxuLyoqXG4gKlxuICogQHBhcmFtIG9wdGlvbnMgT2JqZWN0XG4gKiBAcmV0dXJucyBmdW5jdGlvbihTdHJpbmcpOiBTdHJpbmdcbiAqL1xuY29uc3QgZm9yY2VGbG9hdCA9ICh7IGRlY1BvaW50ID0gJy4nIH0gPSB7fSkgPT4gKHZhbHVlKSA9PiB7XG4gIGNvbnN0IEdMT0JBTF9ERUNfUE9JTlQgPSBuZXcgUmVnRXhwKGBcXFxcJHtkZWNQb2ludH1gLCAnZycpO1xuICBjb25zdCBHTE9CQUxfTk9OX05VTUJFUl9PUl9ERUNfUE9JTlQgPSBuZXcgUmVnRXhwKGBbXlxcXFxkJHtkZWNQb2ludH1dYCwgJ2cnKTtcbiAgY29uc3QgTlVNQkVSX0RFQ19QT0lOVF9PUl9TSE9SVENVVCA9IG5ldyBSZWdFeHAoYFtcXFxcZCR7ZGVjUG9pbnR9S2tNbV1gLCAnJyk7XG4gIGNvbnN0IE5VTUJFUl9PUl9TSUdOID0gbmV3IFJlZ0V4cCgnW1xcXFxkKy1dJywgJycpO1xuICBjb25zdCBTSUdOID0gbmV3IFJlZ0V4cCgnWystXScsICcnKTtcbiAgY29uc3QgU0hPUlRDVVQgPSBuZXcgUmVnRXhwKCdbS2tNbV0nLCAnJyk7XG4gIGNvbnN0IFNIT1JUQ1VUX1RIT1VTQU5EUyA9IG5ldyBSZWdFeHAoJ1tLa10nLCAnJyk7XG5cbiAgbGV0IHZhbHVlVG9Vc2UgPSB2YWx1ZTtcbiAgY29uc3QgaW5kZXhPZlBvaW50ID0gdmFsdWVUb1VzZS5pbmRleE9mKGRlY1BvaW50KTtcbiAgY29uc3QgbGFzdEluZGV4T2ZQb2ludCA9IHZhbHVlVG9Vc2UubGFzdEluZGV4T2YoZGVjUG9pbnQpO1xuICBjb25zdCBoYXNNb3JlVGhhbk9uZVBvaW50ID0gaW5kZXhPZlBvaW50ICE9PSBsYXN0SW5kZXhPZlBvaW50O1xuXG4gIGlmIChoYXNNb3JlVGhhbk9uZVBvaW50KSB7XG4gICAgdmFsdWVUb1VzZSA9IGAke3ZhbHVlVG9Vc2UucmVwbGFjZShHTE9CQUxfREVDX1BPSU5ULCAnJyl9JHtkZWNQb2ludH1gO1xuICB9XG5cbiAgbGV0IGZpcnN0Q2hhciA9IHZhbHVlVG9Vc2VbMF0gfHwgJyc7XG4gIGxldCBsYXN0Q2hhciA9ICh2YWx1ZVRvVXNlLmxlbmd0aCA+IDEgPyB2YWx1ZVRvVXNlW3ZhbHVlVG9Vc2UubGVuZ3RoIC0gMV0gOiAnJykgfHwgJyc7XG4gIGxldCBtaWRkbGVDaGFycyA9IHZhbHVlVG9Vc2Uuc3Vic3RyKDEsIHZhbHVlVG9Vc2UubGVuZ3RoIC0gMikgfHwgJyc7XG5cbiAgaWYgKCFmaXJzdENoYXIubWF0Y2goTlVNQkVSX09SX1NJR04pKSB7XG4gICAgZmlyc3RDaGFyID0gJyc7XG4gIH1cblxuICBtaWRkbGVDaGFycyA9IG1pZGRsZUNoYXJzLnJlcGxhY2UoR0xPQkFMX05PTl9OVU1CRVJfT1JfREVDX1BPSU5ULCAnJyk7XG5cbiAgaWYgKCFsYXN0Q2hhci5tYXRjaChOVU1CRVJfREVDX1BPSU5UX09SX1NIT1JUQ1VUKSkge1xuICAgIGxhc3RDaGFyID0gJyc7XG4gIH0gZWxzZSBpZiAobGFzdENoYXIubWF0Y2goU0hPUlRDVVQpKSB7XG4gICAgaWYgKG1pZGRsZUNoYXJzID09PSBkZWNQb2ludCkge1xuICAgICAgbWlkZGxlQ2hhcnMgPSAnJztcbiAgICB9IGVsc2UgaWYgKG1pZGRsZUNoYXJzID09PSAnJyAmJiBmaXJzdENoYXIubWF0Y2goU0lHTikpIHtcbiAgICAgIGxhc3RDaGFyID0gJyc7XG4gICAgfVxuICB9IGVsc2UgaWYgKGxhc3RDaGFyID09PSBkZWNQb2ludCAmJiBtaWRkbGVDaGFycyA9PT0gJycgJiYgZmlyc3RDaGFyLm1hdGNoKFNJR04pKSB7XG4gICAgbGFzdENoYXIgPSAnJztcbiAgfVxuXG4gIHZhbHVlVG9Vc2UgPSBbZmlyc3RDaGFyLCBtaWRkbGVDaGFycywgbGFzdENoYXJdLmpvaW4oJycpO1xuXG4gIGlmIChsYXN0Q2hhci5tYXRjaChTSE9SVENVVCkpIHtcbiAgICB2YWx1ZVRvVXNlID0gKFxuICAgICAgTnVtYmVyKGAke2ZpcnN0Q2hhcn0ke21pZGRsZUNoYXJzfWAucmVwbGFjZShkZWNQb2ludCwgJy4nKSkgKlxuICAgICAgKGxhc3RDaGFyLm1hdGNoKFNIT1JUQ1VUX1RIT1VTQU5EUykgPyAxMDAwIDogMTAwMDAwMClcbiAgICApLnRvU3RyaW5nKCkucmVwbGFjZSgnLicsIGRlY1BvaW50KTtcbiAgfVxuXG4gIHJldHVybiB2YWx1ZVRvVXNlO1xufTtcblxuLyoqXG4gKlxuICogQHBhcmFtIG9wdGlvbnMgT2JqZWN0XG4gKiBAcmV0dXJucyBmdW5jdGlvbihTdHJpbmcpOiBTdHJpbmdcbiAqL1xuY29uc3QgbnVtYmVyRm9ybWF0dGVyID0gKHsgZGVjUG9pbnQgPSAnLicsIHRob3VzYW5kc1NlcGFyYXRvciA9ICcsJyB9ID0ge30pID0+IHZhbHVlID0+IHtcbiAgdmFsdWUgPSB2YWx1ZS5yZXBsYWNlKCcuJywgZGVjUG9pbnQpO1xuICBsZXQgZmlyc3RDaGFyID0gdmFsdWVbMF0gfHwgJyc7XG4gIGZpcnN0Q2hhciA9IFsnKycsICctJ10uaW5jbHVkZXMoZmlyc3RDaGFyKSA/IGZpcnN0Q2hhciA6ICcnO1xuICBjb25zdCBpc0Zsb2F0aW5nUG9pbnQgPSB2YWx1ZS5pbmRleE9mKGRlY1BvaW50KSAhPT0gLTE7XG4gIGxldCBbaW50ZWdlclBhcnQgPSAnJywgZGVjaW1hbHMgPSAnJ10gPSB2YWx1ZS5zcGxpdChkZWNQb2ludCk7XG4gIGludGVnZXJQYXJ0ID0gaW50ZWdlclBhcnQucmVwbGFjZSgvWystXS9nLCAnJyk7XG4gIGludGVnZXJQYXJ0ID0gaW50ZWdlclBhcnQucmVwbGFjZSgvXFxCKD89KFxcZHszfSkrKD8hXFxkKSkvZywgdGhvdXNhbmRzU2VwYXJhdG9yKTtcbiAgY29uc3QgcmV0ID0gYCR7Zmlyc3RDaGFyfSR7aW50ZWdlclBhcnR9JHtpc0Zsb2F0aW5nUG9pbnQgPyBkZWNQb2ludCA6ICcnfSR7ZGVjaW1hbHN9YDtcbiAgcmV0dXJuIHJldDtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgZm9yY2VGbG9hdCxcbiAgbnVtYmVyRm9ybWF0dGVyXG59O1xuXG4iLCIvKiBlc2xpbnQgbm8tY29uc29sZTogMCAqL1xuXG5jb25zdCBidXR0b25IZWlnaHQgPSAnMjVweCc7XG5jb25zdCBidXR0b25TdGFydCA9ICc1cHgnO1xuY29uc3QgYnV0dG9uVG9wID0gJzVweCc7XG5cbmxldCBjb25zb2xlTWVzc2FnZXMgPSBbXTtcbmNvbnN0IGNvbnNvbGVMb2cgPSBjb25zb2xlLmxvZy5iaW5kKGNvbnNvbGUpO1xuY29uc3QgY29uc29sZU9yaWdpbmFsID0ge307XG5cbmZ1bmN0aW9uIGNhcHR1cmVDb25zb2xlKGNvbnNvbGVFbG0sIG9wdGlvbnMpIHtcbiAgY29uc3QgeyBpbmRlbnQgPSAyLCBzaG93TGFzdE9ubHkgPSBmYWxzZSB9ID0gb3B0aW9ucztcbiAgY29uc3QgaGFuZGxlciA9IGZ1bmN0aW9uIGhhbmRsZXIoYWN0aW9uLCAuLi5hcmdzKSB7XG4gICAgaWYgKHNob3dMYXN0T25seSkge1xuICAgICAgY29uc29sZU1lc3NhZ2VzID0gW3sgW2FjdGlvbl06IGFyZ3MgfV07XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnNvbGVNZXNzYWdlcy5wdXNoKHsgW2FjdGlvbl06IGFyZ3MgfSk7XG4gICAgfVxuXG4gICAgY29uc29sZUVsbS5pbm5lckhUTUwgPSBjb25zb2xlTWVzc2FnZXMubWFwKChlbnRyeSkgPT4ge1xuICAgICAgY29uc3QgYWN0aW9uID0gT2JqZWN0LmtleXMoZW50cnkpWzBdO1xuICAgICAgY29uc3QgdmFsdWVzID0gZW50cnlbYWN0aW9uXTtcbiAgICAgIGNvbnN0IG1lc3NhZ2UgPSB2YWx1ZXMubWFwKChpdGVtKSA9PiB7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgW3VuZGVmaW5lZCwgbnVsbF0uaW5jbHVkZXMoaXRlbSkgfHxcbiAgICAgICAgICBbJ251bWJlcicsICdzdHJpbmcnLCAnZnVuY3Rpb24nXS5pbmNsdWRlcyh0eXBlb2YgaXRlbSlcbiAgICAgICAgKSA/XG4gICAgICAgICAgaXRlbSA6XG4gICAgICAgICAgWydNYXAnLCAnU2V0J10uaW5jbHVkZXMoaXRlbS5jb25zdHJ1Y3Rvci5uYW1lKSA/XG4gICAgICAgICAgICBgJHtpdGVtLmNvbnN0cnVjdG9yLm5hbWV9ICgke0pTT04uc3RyaW5naWZ5KFsuLi5pdGVtXSl9KWAgOlxuICAgICAgICAgICAgSlNPTi5zdHJpbmdpZnkoaXRlbSwgKGtleSwgdmFsdWUpID0+IHtcbiAgICAgICAgICAgICAgaWYgKCh0eXBlb2YgdmFsdWUpID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlLnRvU3RyaW5nKCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgICAgICAgfSwgaW5kZW50KTtcbiAgICAgIH0pLmpvaW4oJywgJyk7XG5cbiAgICAgIGNvbnN0IGNvbG9yID0ge1xuICAgICAgICBsb2c6ICcjMDAwJyxcbiAgICAgICAgd2FybjogJ29yYW5nZScsXG4gICAgICAgIGVycm9yOiAnZGFya3JlZCdcbiAgICAgIH1bYWN0aW9uXTtcblxuICAgICAgcmV0dXJuIGA8cHJlIHN0eWxlPVwiY29sb3I6ICR7Y29sb3J9XCI+JHttZXNzYWdlfTwvcHJlPmA7XG4gICAgfSkuam9pbignXFxuJyk7XG4gIH07XG4gIFsnbG9nJywgJ3dhcm4nLCAnZXJyb3InXS5mb3JFYWNoKChhY3Rpb24pID0+IHtcbiAgICBjb25zb2xlT3JpZ2luYWxbYWN0aW9uXSA9IGNvbnNvbGVbYWN0aW9uXTtcbiAgICBjb25zb2xlW2FjdGlvbl0gPSBoYW5kbGVyLmJpbmQoY29uc29sZSwgYWN0aW9uKTtcbiAgfSk7XG4gIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdlcnJvcicsIChldnQpID0+IHtcbiAgICAvLyBlc2xpbnQgbm8tY29uc29sZTogMFxuICAgIGNvbnNvbGUuZXJyb3IoYFwiJHtldnQubWVzc2FnZX1cIiBmcm9tICR7ZXZ0LmZpbGVuYW1lfToke2V2dC5saW5lbm99YCk7XG4gICAgY29uc29sZS5lcnJvcihldnQsIGV2dC5lcnJvci5zdGFjayk7XG4gICAgLy8gZXZ0LnByZXZlbnREZWZhdWx0KCk7XG4gIH0pO1xuICBjb25zb2xlTG9nKCdjb25zb2xlIGNhcHR1cmVkJyk7XG4gIHJldHVybiBmdW5jdGlvbiByZWxlYXNlQ29uc29sZSgpIHtcbiAgICBbJ2xvZycsICd3YXJuJywgJ2Vycm9yJ10uZm9yRWFjaCgoYWN0aW9uKSA9PiB7XG4gICAgICBjb25zb2xlW2FjdGlvbl0gPSBjb25zb2xlT3JpZ2luYWxbYWN0aW9uXTtcbiAgICB9KTtcbiAgICBjb25zb2xlTG9nKCdjb25zb2xlIHJlbGVhc2VkJyk7XG4gIH07XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUNvbnNvbGUoe1xuICBvcHRpb25zLFxuICBjb25zb2xlU3R5bGU6IHtcbiAgICBidG5TdGFydCA9IGJ1dHRvblN0YXJ0LCBidG5IZWlnaHQgPSBidXR0b25IZWlnaHQsXG4gICAgd2lkdGggPSBgY2FsYygxMDB2dyAtICR7YnRuU3RhcnR9IC0gMzBweClgLCBoZWlnaHQgPSAnNDAwcHgnLFxuICAgIGJhY2tncm91bmQgPSAncmdiYSgwLCAwLCAwLCAwLjUpJ1xuICB9XG59KSB7XG4gIGNvbnN0IHsgcnRsID0gZmFsc2UgfSA9IG9wdGlvbnM7XG4gIGNvbnN0IGNvbnNvbGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgY29uc29sZS5pZCA9ICdEQlVJb25TY3JlZW5Db25zb2xlJztcbiAgY29uc29sZS5zdHlsZS5jc3NUZXh0ID0gYFxuICAgIGRpc3BsYXk6IGJsb2NrO1xuICAgIG1hcmdpbjogMHB4O1xuICAgIHBhZGRpbmc6IDVweDtcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gICAgb3ZlcmZsb3c6IGF1dG87XG4gICAgd2lkdGg6ICR7d2lkdGh9O1xuICAgIGhlaWdodDogJHtoZWlnaHR9O1xuICAgIHRvcDogJHtidG5IZWlnaHR9O1xuICAgICR7cnRsID8gJ3JpZ2h0JyA6ICdsZWZ0J306IDBweDtcbiAgICBiYWNrZ3JvdW5kOiAke2JhY2tncm91bmR9O1xuICAgIHotaW5kZXg6IDk5OTk7XG4gICAgLXdlYmtpdC1vdmVyZmxvdy1zY3JvbGxpbmc6IHRvdWNoXG4gICAgYDtcbiAgcmV0dXJuIGNvbnNvbGU7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUJ1dHRvbih7XG4gIG9wdGlvbnMsXG4gIGJ1dHRvblN0eWxlOiB7XG4gICAgcG9zaXRpb24gPSAnZml4ZWQnLFxuICAgIHdpZHRoID0gJzI1cHgnLCBoZWlnaHQgPSBidXR0b25IZWlnaHQsIHRvcCA9IGJ1dHRvblRvcCwgc3RhcnQgPSBidXR0b25TdGFydCxcbiAgICBiYWNrZ3JvdW5kID0gJ3JnYmEoMCwgMCwgMCwgMC41KSdcbiAgfVxufSkge1xuICBjb25zdCB7IHJ0bCA9IGZhbHNlIH0gPSBvcHRpb25zO1xuICBjb25zdCBidXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgYnV0dG9uLmlkID0gJ0RCVUlvblNjcmVlbkNvbnNvbGVUb2dnbGVyJztcbiAgYnV0dG9uLnN0eWxlLmNzc1RleHQgPSBgXG4gICAgcG9zaXRpb246ICR7cG9zaXRpb259O1xuICAgIHdpZHRoOiAke3dpZHRofTtcbiAgICBoZWlnaHQ6ICR7aGVpZ2h0fTtcbiAgICB0b3A6ICR7dG9wfTtcbiAgICAke3J0bCA/ICdyaWdodCcgOiAnbGVmdCd9OiAke3N0YXJ0fTtcbiAgICBiYWNrZ3JvdW5kOiAke2JhY2tncm91bmR9O1xuICAgIHotaW5kZXg6IDk5OTk7XG4gICAgYDtcbiAgcmV0dXJuIGJ1dHRvbjtcbn1cblxuLyoqXG5vblNjcmVlbkNvbnNvbGUoe1xuICBidXR0b25TdHlsZSA9IHsgcG9zaXRpb24sIHdpZHRoLCBoZWlnaHQsIHRvcCwgc3RhcnQsIGJhY2tncm91bmQgfSxcbiAgY29uc29sZVN0eWxlID0geyB3aWR0aCwgaGVpZ2h0LCBiYWNrZ3JvdW5kIH0sXG4gIG9wdGlvbnMgPSB7IHJ0bDogZmFsc2UsIGluZGVudCwgc2hvd0xhc3RPbmx5IH1cbn0pXG4qL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gb25TY3JlZW5Db25zb2xlKHtcbiAgYnV0dG9uU3R5bGUgPSB7fSxcbiAgY29uc29sZVN0eWxlID0ge30sXG4gIG9wdGlvbnMgPSB7fVxufSA9IHt9KSB7XG4gIGNvbnN0IGJ1dHRvbiA9IGNyZWF0ZUJ1dHRvbih7XG4gICAgb3B0aW9ucyxcbiAgICBidXR0b25TdHlsZVxuICB9KTtcbiAgY29uc3QgY29uc29sZSA9IGNyZWF0ZUNvbnNvbGUoe1xuICAgIGNvbnNvbGVTdHlsZToge1xuICAgICAgLi4uY29uc29sZVN0eWxlLFxuICAgICAgYnRuSGVpZ2h0OiBidXR0b25TdHlsZS5oZWlnaHQsXG4gICAgICBidG5TdGFydDogYnV0dG9uU3R5bGUuc3RhcnRcbiAgICB9LFxuICAgIG9wdGlvbnNcbiAgfSk7XG5cbiAgY29uc29sZS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XG4gICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgfSk7XG5cbiAgYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcbiAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIGlmICghYnV0dG9uLmNvbnRhaW5zKGNvbnNvbGUpKSB7XG4gICAgICBidXR0b24uYXBwZW5kQ2hpbGQoY29uc29sZSk7XG4gICAgICBjb25zb2xlLnNjcm9sbFRvcCA9IGNvbnNvbGUuc2Nyb2xsSGVpZ2h0IC0gY29uc29sZS5jbGllbnRIZWlnaHQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIGJ1dHRvbi5yZW1vdmVDaGlsZChjb25zb2xlKTtcbiAgICB9XG4gIH0pO1xuXG4gIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoYnV0dG9uKTtcbiAgY29uc3QgcmVsZWFzZUNvbnNvbGUgPSBjYXB0dXJlQ29uc29sZShjb25zb2xlLCBvcHRpb25zKTtcblxuICByZXR1cm4gZnVuY3Rpb24gcmVsZWFzZSgpIHtcbiAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKGJ1dHRvbik7XG4gICAgcmVsZWFzZUNvbnNvbGUoKTtcbiAgfTtcbn1cbiIsIi8qKlxuICogY29uc3QgdCA9IHRlbXBsYXRlYCR7MH0gJHsxfSAkeyd0d28nfSAkeyd0aHJlZSd9YDtcbiAqIGNvbnN0IHRyID0gdCgnYScsICdiJywgeyB0d286ICdjJywgdGhyZWU6ICdkJyB9KTtcbiAqIGV4cGVjdCh0cikudG8uZXF1YWwoJ2EgYiBjIGQnKTtcbiAqIEBwYXJhbSBzdHJpbmdzXG4gKiBAcGFyYW0ga2V5c1xuICogQHJldHVybiB7ZnVuY3Rpb24oLi4uWypdKX1cbiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gdGVtcGxhdGUoc3RyaW5ncywgLi4ua2V5cykge1xuICByZXR1cm4gKCguLi52YWx1ZXMpID0+IHtcbiAgICBjb25zdCBkaWN0ID0gdmFsdWVzW3ZhbHVlcy5sZW5ndGggLSAxXSB8fCB7fTtcbiAgICBjb25zdCByZXN1bHQgPSBbc3RyaW5nc1swXV07XG4gICAga2V5cy5mb3JFYWNoKChrZXksIGkpID0+IHtcbiAgICAgIGNvbnN0IHZhbHVlID0gTnVtYmVyLmlzSW50ZWdlcihrZXkpID8gdmFsdWVzW2tleV0gOiBkaWN0W2tleV07XG4gICAgICByZXN1bHQucHVzaCh2YWx1ZSwgc3RyaW5nc1tpICsgMV0pO1xuICAgIH0pO1xuICAgIHJldHVybiByZXN1bHQuam9pbignJyk7XG4gIH0pO1xufVxuIiwiXG4vLyBodHRwOi8vcmFnYW53YWxkLmNvbS8yMDE1LzEyLzMxL3RoaXMtaXMtbm90LWFuLWVzc2F5LWFib3V0LXRyYWl0cy1pbi1qYXZhc2NyaXB0Lmh0bWxcblxuLypcblxuY2xhc3MgQSB7XG4gIGNvbnN0cnVjdG9yKC4uLmFyZ3MpIHtcbiAgICB0aGlzLmluaXQoLi4uYXJncyk7XG4gIH1cbn1cblxuY2xhc3MgQiBleHRlbmRzIEEge1xuICBpbml0KHgpIHtcbiAgICB0aGlzLl94ID0geDtcbiAgfVxuICBnZXRYKCkge1xuICAgIHJldHVybiB0aGlzLl94O1xuICB9XG4gIHNldFgodmFsdWUpIHtcbiAgICB0aGlzLl94ID0gdmFsdWU7XG4gIH1cbiAgZ2V0IHgoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3g7XG4gIH1cbiAgc2V0IHgodmFsdWUpIHtcbiAgICB0aGlzLl94ID0gdmFsdWU7XG4gIH1cbn1cblxuZnVuY3Rpb24gd2l0aERvdWJsZVgoa2xhc3MpIHtcbiAgcmV0dXJuIE92ZXJyaWRlT3JEZWZpbmUoe1xuXG4gICAgLy8gb3ZlcnJpZGVzXG4gICAgaW5pdChvcmlnaW5hbEluaXQsIHgsIHkpIHtcbiAgICAgIG9yaWdpbmFsSW5pdCh4KTtcbiAgICAgIHRoaXMuX3kgPSB5O1xuICAgIH0sXG4gICAgZ2V0WChvcmlnaW5hbEdldFgpIHtcbiAgICAgIHJldHVybiBvcmlnaW5hbEdldFgoKSAqIDI7XG4gICAgfSxcbiAgICBzZXRYKG9yaWdpbmFsU2V0WCwgdmFsdWUpIHtcbiAgICAgIC8vIHRoaXMuX3ggPSB2YWx1ZSAqIDI7XG4gICAgICBvcmlnaW5hbFNldFgodmFsdWUgKiAyKTtcbiAgICB9LFxuICAgIGdldCB4KCkge1xuICAgICAgcmV0dXJuIHRoaXMuX3ggKiAyO1xuICAgIH0sXG4gICAgc2V0IHgodmFsdWUpIHtcbiAgICAgIHRoaXMuX3ggPSB2YWx1ZSAqIDI7XG4gICAgfSxcblxuICAgIC8vIG5ldyBkZWZpbml0aW9uc1xuICAgIHNldCB5KHZhbHVlKSB7XG4gICAgICB0aGlzLl95ID0gdmFsdWUgKiAyO1xuICAgIH0sXG4gICAgZ2V0IHkoKSB7XG4gICAgICByZXR1cm4gdGhpcy5feSAqIDI7XG4gICAgfSxcbiAgICBoZWxsbygpIHtcbiAgICAgIHJldHVybiBgaGVsbG8gJHt0aGlzLl94fSBhbmQgJHt0aGlzLnl9YDtcbiAgICB9XG4gIH0pKGtsYXNzKTtcbn1cblxuQiA9IHdpdGhEb3VibGVYKEIpO1xuXG5jb25zdCBiID0gbmV3IEIoMiwgNSk7XG5jb25zb2xlLmxvZyhiLngpOyAvLyA0XG5jb25zb2xlLmxvZyhiLmdldFgoKSk7IC8vIDRcblxuYi5zZXRYKDMpO1xuLy8gYi54ID0gMztcbmNvbnNvbGUubG9nKGIueCk7IC8vIDEyXG5jb25zb2xlLmxvZyhiLmdldFgoKSk7IC8vIDEyXG5cbi8vIG5ld1xuY29uc29sZS5sb2coYi55KTsgLy8gMTBcbmIueSA9IDk7XG5jb25zb2xlLmxvZyhiLmhlbGxvKCkpOyAvLyBoZWxsbyA2IGFuZCAzNlxuXG4qL1xuLy8gVE9ETzp0ZXN0IHRoaXNcbmZ1bmN0aW9uIE92ZXJyaWRlT3JEZWZpbmUoYmVoYXZpb3VyKSB7XG4gIGNvbnN0IGluc3RhbmNlS2V5cyA9IFJlZmxlY3Qub3duS2V5cyhiZWhhdmlvdXIpO1xuXG4gIHJldHVybiBmdW5jdGlvbiBkZWZpbmUoa2xhc3MpIHtcbiAgICBpbnN0YW5jZUtleXMuZm9yRWFjaCgocHJvcGVydHkpID0+IHtcblxuICAgICAgY29uc3QgbmV3UHJvcGVydHlEZXNjcmlwdG9yID1cbiAgICAgICAgT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihiZWhhdmlvdXIsIHByb3BlcnR5KTtcbiAgICAgIGNvbnN0IG9yaWdpbmFsUHJvcGVydHlEZXNjcmlwdG9yID1cbiAgICAgICAgT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihrbGFzcy5wcm90b3R5cGUsIHByb3BlcnR5KTtcblxuICAgICAgY29uc3Qge1xuICAgICAgICB2YWx1ZTogbmV3VmFsdWUsXG4gICAgICAgIGdldDogbmV3R2V0dGVyLFxuICAgICAgICBzZXQ6IG5ld1NldHRlclxuICAgICAgfSA9IG5ld1Byb3BlcnR5RGVzY3JpcHRvcjtcblxuICAgICAgaWYgKCFvcmlnaW5hbFByb3BlcnR5RGVzY3JpcHRvcikge1xuICAgICAgICBpZiAobmV3VmFsdWUpIHtcbiAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoa2xhc3MucHJvdG90eXBlLCBwcm9wZXJ0eSwge1xuICAgICAgICAgICAgdmFsdWU6IG5ld1ZhbHVlLFxuICAgICAgICAgICAgd3JpdGFibGU6IHRydWUsXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoa2xhc3MucHJvdG90eXBlLCBwcm9wZXJ0eSwge1xuICAgICAgICAgICAgZ2V0OiBuZXdHZXR0ZXIsXG4gICAgICAgICAgICBzZXQ6IG5ld1NldHRlcixcbiAgICAgICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCB7XG4gICAgICAgICAgdmFsdWU6IG9yaWdpbmFsVmFsdWUsXG4gICAgICAgICAgd3JpdGFibGU6IG9yaWdpbmFsV3JpdGFibGUsXG4gICAgICAgICAgZ2V0OiBvcmlnaW5hbEdldHRlcixcbiAgICAgICAgICBzZXQ6IG9yaWdpbmFsU2V0dGVyLFxuICAgICAgICAgIGVudW1lcmFibGU6IG9yaWdpbmFsRW51bWVyYWJsZSxcbiAgICAgICAgICBjb25maWd1cmFibGU6IG9yaWdpbmFsQ29uZmlndXJhYmxlXG4gICAgICAgIH0gPSBvcmlnaW5hbFByb3BlcnR5RGVzY3JpcHRvcjtcblxuICAgICAgICBpZiAobmV3VmFsdWUpIHtcbiAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoa2xhc3MucHJvdG90eXBlLCBwcm9wZXJ0eSwge1xuICAgICAgICAgICAgdmFsdWUoLi4uYXJncykge1xuICAgICAgICAgICAgICBjb25zdCBib3VuZGVkVmFsdWUgPSBvcmlnaW5hbFZhbHVlLmJpbmQodGhpcyk7XG4gICAgICAgICAgICAgIHJldHVybiBuZXdWYWx1ZS5jYWxsKHRoaXMsIGJvdW5kZWRWYWx1ZSwgLi4uYXJncyk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgd3JpdGFibGU6IG9yaWdpbmFsV3JpdGFibGUsXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiBvcmlnaW5hbEVudW1lcmFibGUsXG4gICAgICAgICAgICBjb25maWd1cmFibGU6IG9yaWdpbmFsQ29uZmlndXJhYmxlLFxuICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShrbGFzcy5wcm90b3R5cGUsIHByb3BlcnR5LCB7XG4gICAgICAgICAgICBnZXQ6IG5ld0dldHRlciB8fCBvcmlnaW5hbEdldHRlcixcbiAgICAgICAgICAgIHNldDogbmV3U2V0dGVyIHx8IG9yaWdpbmFsU2V0dGVyLFxuICAgICAgICAgICAgZW51bWVyYWJsZTogb3JpZ2luYWxFbnVtZXJhYmxlLFxuICAgICAgICAgICAgY29uZmlndXJhYmxlOiBvcmlnaW5hbENvbmZpZ3VyYWJsZSxcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBrbGFzcztcbiAgfTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgT3ZlcnJpZGVPckRlZmluZTtcbiIsIlxuY29uc3QgcmVhZE9ubHlQcm9wZXJ0aWVzID0gWydmb2N1c2VkJ107XG5cbmNvbnN0IEVSUk9SX01FU1NBR0VTID0ge1xuICBmb2N1c2VkOiBgJ2ZvY3VzZWQnIHByb3BlcnR5IGlzIHJlYWQtb25seSBhcyBpdCBpcyBjb250cm9sbGVkIGJ5IHRoZSBjb21wb25lbnQuXG5JZiB5b3Ugd2FudCB0byBzZXQgZm9jdXMgcHJvZ3JhbW1hdGljYWxseSBjYWxsIC5mb2N1cygpIG1ldGhvZCBvbiBjb21wb25lbnQuXG5gXG59O1xuXG4vKipcbiAqIFdoZW4gYW4gaW5uZXIgZm9jdXNhYmxlIGlzIGZvY3VzZWQgKGV4OiB2aWEgY2xpY2spIHRoZSBlbnRpcmUgY29tcG9uZW50IGdldHMgZm9jdXNlZC5cbiAqIFdoZW4gdGhlIGNvbXBvbmVudCBnZXRzIGZvY3VzZWQgKGV4OiB2aWEgdGFiKSB0aGUgZmlyc3QgaW5uZXIgZm9jdXNhYmxlIGdldHMgZm9jdXNlZCB0b28uXG4gKiBXaGVuIHRoZSBjb21wb25lbnQgZ2V0cyBkaXNhYmxlZCBpdCBnZXRzIGJsdXJyZWQgdG9vIGFuZCBhbGwgaW5uZXIgZm9jdXNhYmxlcyBnZXQgZGlzYWJsZWQgYW5kIGJsdXJyZWQuXG4gKiBXaGVuIGRpc2FibGVkIHRoZSBjb21wb25lbnQgY2Fubm90IGJlIGZvY3VzZWQuXG4gKiBXaGVuIGVuYWJsZWQgdGhlIGNvbXBvbmVudCBjYW4gYmUgZm9jdXNlZC5cbiAqIEBwYXJhbSBLbGFzc1xuICogQHJldHVybnMge0ZvY3VzYWJsZX1cbiAqIEBjb25zdHJ1Y3RvclxuICovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBGb2N1c2FibGUoS2xhc3MpIHtcblxuICBLbGFzcy5jb21wb25lbnRTdHlsZSArPSBgXG4gIDpob3N0KFtkaXNhYmxlZF0pIHtcbiAgICBjdXJzb3I6IG5vdC1hbGxvd2VkO1xuICAgIG9wYWNpdHk6IDAuNTtcbiAgICBcbiAgICAtd2Via2l0LXRvdWNoLWNhbGxvdXQ6IG5vbmU7XG4gICAgLXdlYmtpdC11c2VyLXNlbGVjdDogbm9uZTtcbiAgICAta2h0bWwtdXNlci1zZWxlY3Q6IG5vbmU7XG4gICAgLW1vei11c2VyLXNlbGVjdDogbm9uZTtcbiAgICAtbXMtdXNlci1zZWxlY3Q6IG5vbmU7XG4gICAgdXNlci1zZWxlY3Q6IG5vbmU7XG4gIH1cbiAgXG4gIDpob3N0KFtkaXNhYmxlZF0pICoge1xuICAgIHBvaW50ZXItZXZlbnRzOiBub25lO1xuICB9XG4gIGA7XG5cbiAgY2xhc3MgRm9jdXNhYmxlIGV4dGVuZHMgS2xhc3Mge1xuXG4gICAgc3RhdGljIGdldCBuYW1lKCkge1xuICAgICAgcmV0dXJuIHN1cGVyLm5hbWU7XG4gICAgfVxuXG4gICAgc3RhdGljIGdldCBwcm9wZXJ0aWVzVG9VcGdyYWRlKCkge1xuICAgICAgLy8gVGhlIHJlYXNvbiBmb3IgdXBncmFkaW5nICdmb2N1c2VkJyBpcyBvbmx5IHRvIHNob3cgYW4gd2FybmluZ1xuICAgICAgLy8gaWYgdGhlIGNvbnN1bWVyIG9mIHRoZSBjb21wb25lbnQgYXR0ZW1wdGVkIHRvIHNldCBmb2N1cyBwcm9wZXJ0eVxuICAgICAgLy8gd2hpY2ggaXMgcmVhZC1vbmx5LlxuICAgICAgcmV0dXJuIFsuLi5zdXBlci5wcm9wZXJ0aWVzVG9VcGdyYWRlLCAnZm9jdXNlZCcsICdkaXNhYmxlZCddO1xuICAgIH1cblxuICAgIHN0YXRpYyBnZXQgb2JzZXJ2ZWRBdHRyaWJ1dGVzKCkge1xuICAgICAgcmV0dXJuIFsuLi5zdXBlci5vYnNlcnZlZEF0dHJpYnV0ZXMsICdkaXNhYmxlZCddO1xuICAgIH1cblxuICAgIGNvbnN0cnVjdG9yKC4uLmFyZ3MpIHtcbiAgICAgIHN1cGVyKC4uLmFyZ3MpO1xuXG4gICAgICB0aGlzLl9jdXJyZW50SW5uZXJGb2N1c2VkID0gbnVsbDtcbiAgICAgIHRoaXMuX29uSW5uZXJGb2N1c2FibGVGb2N1c2VkID0gdGhpcy5fb25Jbm5lckZvY3VzYWJsZUZvY3VzZWQuYmluZCh0aGlzKTtcbiAgICAgIHRoaXMuX29uRm9jdXMgPSB0aGlzLl9vbkZvY3VzLmJpbmQodGhpcyk7XG4gICAgICB0aGlzLl9vbkJsdXIgPSB0aGlzLl9vbkJsdXIuYmluZCh0aGlzKTtcbiAgICB9XG5cbiAgICBhdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2sobmFtZSwgb2xkVmFsdWUsIG5ld1ZhbHVlKSB7XG4gICAgICBzdXBlci5hdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2sobmFtZSwgb2xkVmFsdWUsIG5ld1ZhbHVlKTtcblxuICAgICAgY29uc3QgaGFzVmFsdWUgPSBuZXdWYWx1ZSAhPT0gbnVsbDtcbiAgICAgIGlmIChuYW1lID09PSAnZGlzYWJsZWQnKSB7XG4gICAgICAgIGhhc1ZhbHVlID8gdGhpcy5fYXBwbHlEaXNhYmxlZFNpZGVFZmZlY3RzKCkgOiB0aGlzLl9hcHBseUVuYWJsZWRTaWRlRWZmZWN0cygpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGNvbm5lY3RlZENhbGxiYWNrKCkge1xuICAgICAgc3VwZXIuY29ubmVjdGVkQ2FsbGJhY2soKTtcblxuICAgICAgcmVhZE9ubHlQcm9wZXJ0aWVzLmZvckVhY2goKHJlYWRPbmx5UHJvcGVydHkpID0+IHtcbiAgICAgICAgaWYgKHRoaXMuaGFzQXR0cmlidXRlKHJlYWRPbmx5UHJvcGVydHkpKSB7XG4gICAgICAgICAgdGhpcy5yZW1vdmVBdHRyaWJ1dGUocmVhZE9ubHlQcm9wZXJ0eSk7XG4gICAgICAgICAgY29uc29sZS53YXJuKEVSUk9SX01FU1NBR0VTW3JlYWRPbmx5UHJvcGVydHldKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIGlmICghdGhpcy5kaXNhYmxlZCkge1xuICAgICAgICB0aGlzLnNldEF0dHJpYnV0ZSgndGFiaW5kZXgnLCAwKTtcbiAgICAgIH1cblxuICAgICAgLy8gd2hlbiBjb21wb25lbnQgZm9jdXNlZC9ibHVycmVkXG4gICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoJ2ZvY3VzJywgdGhpcy5fb25Gb2N1cyk7XG4gICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoJ2JsdXInLCB0aGlzLl9vbkJsdXIpO1xuXG4gICAgICB0aGlzLl9pbm5lckZvY3VzYWJsZXMuZm9yRWFjaCgoZm9jdXNhYmxlKSA9PiB7XG4gICAgICAgIC8vIHdoZW4gaW5uZXIgZm9jdXNhYmxlIGZvY3VzZWRcbiAgICAgICAgZm9jdXNhYmxlLmFkZEV2ZW50TGlzdGVuZXIoJ2ZvY3VzJywgdGhpcy5fb25Jbm5lckZvY3VzYWJsZUZvY3VzZWQpO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgZGlzY29ubmVjdGVkQ2FsbGJhY2soKSB7XG4gICAgICBzdXBlci5kaXNjb25uZWN0ZWRDYWxsYmFjaygpO1xuXG4gICAgICB0aGlzLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2ZvY3VzJywgdGhpcy5fb25Gb2N1cyk7XG4gICAgICB0aGlzLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2JsdXInLCB0aGlzLl9vbkJsdXIpO1xuXG4gICAgICB0aGlzLl9pbm5lckZvY3VzYWJsZXMuZm9yRWFjaCgoZm9jdXNhYmxlKSA9PiB7XG4gICAgICAgIGZvY3VzYWJsZS5yZW1vdmVFdmVudExpc3RlbmVyKCdmb2N1cycsIHRoaXMuX29uSW5uZXJGb2N1c2FibGVGb2N1c2VkKTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vIHJlYWQtb25seVxuICAgIGdldCBmb2N1c2VkKCkge1xuICAgICAgcmV0dXJuIHRoaXMuaGFzQXR0cmlidXRlKCdmb2N1c2VkJyk7XG4gICAgfVxuXG4gICAgc2V0IGZvY3VzZWQoXykge1xuICAgICAgY29uc29sZS53YXJuKEVSUk9SX01FU1NBR0VTLmZvY3VzZWQpO1xuICAgIH1cblxuICAgIGdldCBkaXNhYmxlZCgpIHtcbiAgICAgIHJldHVybiB0aGlzLmhhc0F0dHJpYnV0ZSgnZGlzYWJsZWQnKTtcbiAgICB9XG5cbiAgICBzZXQgZGlzYWJsZWQodmFsdWUpIHtcbiAgICAgIGNvbnN0IGhhc1ZhbHVlID0gQm9vbGVhbih2YWx1ZSk7XG4gICAgICBpZiAoaGFzVmFsdWUpIHtcbiAgICAgICAgdGhpcy5zZXRBdHRyaWJ1dGUoJ2Rpc2FibGVkJywgJycpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5yZW1vdmVBdHRyaWJ1dGUoJ2Rpc2FibGVkJyk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZ2V0IF9pbm5lckZvY3VzYWJsZXMoKSB7XG4gICAgICByZXR1cm4gdGhpcy5zaGFkb3dSb290LnF1ZXJ5U2VsZWN0b3JBbGwoJ1t0YWJpbmRleF0nKSB8fCBbXTtcbiAgICB9XG5cbiAgICBnZXQgX2ZpcnN0SW5uZXJGb2N1c2FibGUoKSB7XG4gICAgICByZXR1cm4gdGhpcy5zaGFkb3dSb290LnF1ZXJ5U2VsZWN0b3IoJ1t0YWJpbmRleF0nKTtcbiAgICB9XG5cbiAgICBfb25Jbm5lckZvY3VzYWJsZUZvY3VzZWQoZXZ0KSB7XG4gICAgICB0aGlzLl9jdXJyZW50SW5uZXJGb2N1c2VkID0gZXZ0LnRhcmdldDtcbiAgICB9XG5cbiAgICBfb25Gb2N1cygpIHtcbiAgICAgIGlmICh0aGlzLmRpc2FibGVkKSByZXR1cm47XG4gICAgICAvLyBPbmx5IGZvciBzdHlsaW5nIHB1cnBvc2UuXG4gICAgICAvLyBGb2N1c2VkIHByb3BlcnR5IGlzIGNvbnRyb2xsZWQgZnJvbSBpbnNpZGUuXG4gICAgICAvLyBBdHRlbXB0IHRvIHNldCB0aGlzIHByb3BlcnR5IGZyb20gb3V0c2lkZSB3aWxsIHRyaWdnZXIgYSB3YXJuaW5nXG4gICAgICAvLyBhbmQgd2lsbCBiZSBpZ25vcmVkXG4gICAgICB0aGlzLnNldEF0dHJpYnV0ZSgnZm9jdXNlZCcsICcnKTtcbiAgICAgIHRoaXMuX2FwcGx5Rm9jdXNTaWRlRWZmZWN0cygpO1xuICAgIH1cblxuICAgIF9vbkJsdXIoKSB7XG4gICAgICB0aGlzLnJlbW92ZUF0dHJpYnV0ZSgnZm9jdXNlZCcpO1xuICAgICAgdGhpcy5fYXBwbHlCbHVyU2lkZUVmZmVjdHMoKTtcbiAgICB9XG5cbiAgICBfYXBwbHlGb2N1c1NpZGVFZmZlY3RzKCkge1xuICAgICAgaWYgKHRoaXMuX2N1cnJlbnRJbm5lckZvY3VzZWQpIHtcbiAgICAgICAgLy8gU29tZSBpbm5lciBjb21wb25lbnQgaXMgYWxyZWFkeSBmb2N1c2VkLlxuICAgICAgICAvLyBObyBuZWVkIHRvIHNldCBmb2N1cyBvbiBhbnl0aGluZy5cbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgdGhpcy5fZm9jdXNGaXJzdElubmVyRm9jdXNhYmxlKCk7XG4gICAgfVxuXG4gICAgX2FwcGx5Qmx1clNpZGVFZmZlY3RzKCkge1xuICAgICAgaWYgKHRoaXMuX2N1cnJlbnRJbm5lckZvY3VzZWQpIHtcbiAgICAgICAgdGhpcy5fY3VycmVudElubmVyRm9jdXNlZC5ibHVyKCk7XG4gICAgICAgIHRoaXMuX2N1cnJlbnRJbm5lckZvY3VzZWQgPSBudWxsO1xuICAgICAgfVxuICAgIH1cblxuICAgIF9mb2N1c0ZpcnN0SW5uZXJGb2N1c2FibGUoKSB7XG4gICAgICBjb25zdCBmaXJzdElubmVyRm9jdXNhYmxlID0gdGhpcy5fZmlyc3RJbm5lckZvY3VzYWJsZTtcbiAgICAgIGlmIChmaXJzdElubmVyRm9jdXNhYmxlKSB7XG4gICAgICAgIHRoaXMuX2N1cnJlbnRJbm5lckZvY3VzZWQgPSBmaXJzdElubmVyRm9jdXNhYmxlO1xuICAgICAgICBmaXJzdElubmVyRm9jdXNhYmxlLmZvY3VzKCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgX2FwcGx5RGlzYWJsZWRTaWRlRWZmZWN0cygpIHtcbiAgICAgIHRoaXMucmVtb3ZlQXR0cmlidXRlKCd0YWJpbmRleCcpO1xuICAgICAgdGhpcy5faW5uZXJGb2N1c2FibGVzLmZvckVhY2goKGlubmVyRm9jdXNhYmxlKSA9PiB7XG4gICAgICAgIGlubmVyRm9jdXNhYmxlLnNldEF0dHJpYnV0ZSgndGFiaW5kZXgnLCAnLTEnKTtcbiAgICAgICAgaWYgKGlubmVyRm9jdXNhYmxlLmhhc0F0dHJpYnV0ZSgnY29udGVudGVkaXRhYmxlJykpIHtcbiAgICAgICAgICBpbm5lckZvY3VzYWJsZS5zZXRBdHRyaWJ1dGUoJ2NvbnRlbnRlZGl0YWJsZScsICdmYWxzZScpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlubmVyRm9jdXNhYmxlLmRpc2FibGVkID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICB0aGlzLmJsdXIoKTtcbiAgICB9XG5cbiAgICBfYXBwbHlFbmFibGVkU2lkZUVmZmVjdHMoKSB7XG4gICAgICB0aGlzLnNldEF0dHJpYnV0ZSgndGFiaW5kZXgnLCAnMCcpO1xuICAgICAgdGhpcy5faW5uZXJGb2N1c2FibGVzLmZvckVhY2goKGlubmVyRm9jdXNhYmxlKSA9PiB7XG4gICAgICAgIGlubmVyRm9jdXNhYmxlLnNldEF0dHJpYnV0ZSgndGFiaW5kZXgnLCAnMCcpO1xuICAgICAgICBpZiAoaW5uZXJGb2N1c2FibGUuaGFzQXR0cmlidXRlKCdjb250ZW50ZWRpdGFibGUnKSkge1xuICAgICAgICAgIGlubmVyRm9jdXNhYmxlLnNldEF0dHJpYnV0ZSgnY29udGVudGVkaXRhYmxlJywgJ3RydWUnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpbm5lckZvY3VzYWJsZS5kaXNhYmxlZCA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gRm9jdXNhYmxlO1xufVxuIiwiXG5jb25zdCBEQlVJQ29tbW9uQ3NzVmFycyA9IGBcbiAgOnJvb3Qge1xuICAgIC0tZGJ1aS13ZWItY29tcG9uZW50LWdsb2JhbC1ib3JkZXItcmFkaXVzOiA1cHg7XG4gICAgLS1kYnVpLXdlYi1jb21wb25lbnQtZm9ybS1pbnB1dC1oZWlnaHQ6IDMwcHg7XG4gICAgLS1kYnVpLXdlYi1jb21wb25lbnQtZm9ybS1pbnB1dC1jb2xvcjogIzAwMDtcbiAgICAtLWRidWktd2ViLWNvbXBvbmVudC1mb3JtLWlucHV0LWJhY2tncm91bmQtY29sb3I6IHRyYW5zcGFyZW50O1xuICAgIC0tZGJ1aS13ZWItY29tcG9uZW50LWZvcm0taW5wdXQtYm9yZGVyLWNvbG9yOiAjY2NjO1xuICAgIC0tZGJ1aS13ZWItY29tcG9uZW50LWZvcm0taW5wdXQtYm9yZGVyLXN0eWxlOiBzb2xpZDtcbiAgICAtLWRidWktd2ViLWNvbXBvbmVudC1mb3JtLWlucHV0LWJvcmRlci13aWR0aDogMXB4O1xuICB9XG4gIGA7XG5cbmV4cG9ydCBkZWZhdWx0IERCVUlDb21tb25Dc3NWYXJzO1xuIiwiXG5pbXBvcnQgZ2V0REJVSUxvY2FsZVNlcnZpY2UgZnJvbSAnLi4vLi4vLi4vc2VydmljZXMvREJVSUxvY2FsZVNlcnZpY2UnO1xuaW1wb3J0IGVuc3VyZVNpbmdsZVJlZ2lzdHJhdGlvbiBmcm9tICcuLi8uLi8uLi9pbnRlcm5hbHMvZW5zdXJlU2luZ2xlUmVnaXN0cmF0aW9uJztcbmltcG9ydCBEQlVJV2ViQ29tcG9uZW50TWVzc2FnZSBmcm9tICcuL0RCVUlXZWJDb21wb25lbnRNZXNzYWdlJztcbmltcG9ydCBEQlVJQ29tbW9uQ3NzVmFycyBmcm9tICcuL0RCVUlDb21tb25Dc3NWYXJzJztcblxuY29uc3QgUEFSRU5UX1RBUkdFVF9UWVBFID0gJ1BBUkVOVCc7XG5jb25zdCBDSElMRFJFTl9UQVJHRVRfVFlQRSA9ICdDSElMRFJFTic7XG5jb25zdCBTSEFET1dfRE9NX1RZUEUgPSAnU2hhZG93RG9tJztcbmNvbnN0IExJR0hUX0RPTV9UWVBFID0gJ0xpZ2h0RG9tJztcbmNvbnN0IENIQU5ORUxfSU5URVJOQUwgPSAnSW50ZXJuYWwnO1xuY29uc3QgTUVTU0FHRV9TSEFET1dfRE9NX0FOQ0VTVE9SU19DSEFJTl9DT05ORUNURUQgPSAnU0hBRE9XX0RPTV9BTkNFU1RPUlNfQ0hBSU5fQ09OTkVDVEVEJztcblxuY29uc3QgcmVnaXN0cmF0aW9uTmFtZSA9ICdEQlVJV2ViQ29tcG9uZW50QmFzZSc7XG5cbmZ1bmN0aW9uIGRlZmluZUNvbW1vbkNTU1ZhcnMod2luKSB7XG4gIGNvbnN0IHsgZG9jdW1lbnQgfSA9IHdpbjtcbiAgY29uc3QgY29tbW9uU3R5bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpO1xuICBjb21tb25TdHlsZS5zZXRBdHRyaWJ1dGUoJ2RidWktY29tbW9uLWNzcy12YXJzJywgJycpO1xuICBjb21tb25TdHlsZS5pbm5lckhUTUwgPSBEQlVJQ29tbW9uQ3NzVmFycztcbiAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignaGVhZCcpLmFwcGVuZENoaWxkKGNvbW1vblN0eWxlKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZ2V0REJVSVdlYkNvbXBvbmVudENvcmUod2luKSB7XG4gIGNvbnN0IExvY2FsZVNlcnZpY2UgPSBnZXREQlVJTG9jYWxlU2VydmljZSh3aW4pO1xuXG4gIHJldHVybiBlbnN1cmVTaW5nbGVSZWdpc3RyYXRpb24od2luLCByZWdpc3RyYXRpb25OYW1lLCAoKSA9PiB7XG4gICAgZGVmaW5lQ29tbW9uQ1NTVmFycyh3aW4pO1xuXG4gICAgY29uc3QgeyBkb2N1bWVudCwgSFRNTEVsZW1lbnQsIGN1c3RvbUVsZW1lbnRzIH0gPSB3aW47XG5cbiAgICBjbGFzcyBEQlVJV2ViQ29tcG9uZW50QmFzZSBleHRlbmRzIEhUTUxFbGVtZW50IHtcblxuICAgICAgc3RhdGljIGdldCByZWdpc3RyYXRpb25OYW1lKCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ3JlZ2lzdHJhdGlvbk5hbWUgbXVzdCBiZSBkZWZpbmVkIGluIGRlcml2ZWQgY2xhc3NlcycpO1xuICAgICAgfVxuXG4gICAgICBzdGF0aWMgZ2V0IHRlbXBsYXRlSW5uZXJIVE1MKCkge1xuICAgICAgICByZXR1cm4gJzxzdHlsZT48L3N0eWxlPjxzbG90Pjwvc2xvdD4nO1xuICAgICAgfVxuXG4gICAgICBzdGF0aWMgZ2V0IGRlcGVuZGVuY2llcygpIHtcbiAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgfVxuXG4gICAgICBzdGF0aWMgZ2V0IHByb3BlcnRpZXNUb1VwZ3JhZGUoKSB7XG4gICAgICAgIHJldHVybiBbXTtcbiAgICAgIH1cblxuICAgICAgc3RhdGljIGdldCBwcm9wZXJ0aWVzVG9EZWZpbmUoKSB7XG4gICAgICAgIHJldHVybiB7ICdkYnVpLXdlYi1jb21wb25lbnQnOiAnJyB9O1xuICAgICAgfVxuXG4gICAgICBzdGF0aWMgZ2V0IENPTlNUQU5UUygpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBQQVJFTlRfVEFSR0VUX1RZUEUsXG4gICAgICAgICAgQ0hJTERSRU5fVEFSR0VUX1RZUEUsXG4gICAgICAgICAgU0hBRE9XX0RPTV9UWVBFLFxuICAgICAgICAgIExJR0hUX0RPTV9UWVBFLFxuICAgICAgICAgIENIQU5ORUxfSU5URVJOQUwsXG4gICAgICAgICAgTUVTU0FHRV9TSEFET1dfRE9NX0FOQ0VTVE9SU19DSEFJTl9DT05ORUNURURcbiAgICAgICAgfTtcbiAgICAgIH1cblxuICAgICAgLy8gd2ViIGNvbXBvbmVudHMgc3RhbmRhcmQgQVBJXG4gICAgICBzdGF0aWMgZ2V0IG9ic2VydmVkQXR0cmlidXRlcygpIHtcbiAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgfVxuXG4gICAgICBnZXQgaXNTZWxmT3JQYXJlbnRTaGFkb3dEb21BbmNlc3RvcnNDaGFpbkNvbm5lY3RlZCgpIHtcbiAgICAgICAgLy8gaWYgIXRoaXMuc2hhZG93RG9tUGFyZW50IHdlJ3JlIGluIGxpZ2h0IERPTSAod2UgYXJlIHRoZSBjaGFpbiBoZWFkKVxuICAgICAgICAvLyBSZXR1cm4gdHJ1ZSBpZiB3ZSBhcmUgZWl0aGVyIGNoYWluIGhlYWQgb3IgYSBjaGlsZCBvZiBhIHBhcmVudCBoYXZpbmcgYW5jZXN0b3JzIGNoYWluIGNvbm5lY3RlZC5cbiAgICAgICAgLy8gQSBwYXJlbnQgaGFzIHNoYWRvd0RvbUFuY2VzdG9yc0NoYWluQ29ubmVjdGVkIGlmIGl0IHdhcyB0b2xkIHNvIGJ5IGl0cyBwYXJlbnQgKHZpYSBwYXNzZWQgZG93biBtZXNzYWdlKS5cbiAgICAgICAgLy8gVGhpcyBpbXBsaWVzIHRoYXQgaXRzIHBhcmVudCBjb25uZWN0ZWRDYWxsYmFjayBoYXMgcnVuLlxuICAgICAgICAvLyB0aGlzLnNoYWRvd0RvbVBhcmVudC5zaGFkb3dEb21BbmNlc3RvcnNDaGFpbkNvbm5lY3RlZCBpcyB1c2VmdWwgZm9yIHNoYWRvdyBkb20gYml0c1xuICAgICAgICAvLyB0aGF0IHdlcmUgYWRkZWQgcHJvZ3JhbW1hdGljYWxseSBhdCBydW50aW1lLlxuICAgICAgICByZXR1cm4gIXRoaXMuc2hhZG93RG9tUGFyZW50IHx8IHRoaXMuc2hhZG93RG9tUGFyZW50LnNoYWRvd0RvbUFuY2VzdG9yc0NoYWluQ29ubmVjdGVkO1xuICAgICAgfVxuXG4gICAgICBnZXQgc2hhZG93RG9tQW5jZXN0b3JzQ2hhaW5Db25uZWN0ZWQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9zaGFkb3dEb21BbmNlc3RvcnNDaGFpbkNvbm5lY3RlZDtcbiAgICAgIH1cblxuICAgICAgZ2V0IHNoYWRvd0RvbUNoaWxkcmVuKCkge1xuICAgICAgICByZXR1cm4gWy4uLnRoaXMuc2hhZG93Um9vdC5xdWVyeVNlbGVjdG9yQWxsKCdbZGJ1aS13ZWItY29tcG9uZW50XScpXTtcbiAgICAgIH1cblxuICAgICAgZ2V0IHNoYWRvd0RvbVBhcmVudCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0Um9vdE5vZGUoKS5ob3N0IHx8IG51bGw7XG4gICAgICB9XG5cbiAgICAgIGdldCBzaGFkb3dEb21QYXJlbnRzKCkge1xuICAgICAgICBjb25zdCBzaGFkb3dEb21QYXJlbnRzID0gW107XG4gICAgICAgIGxldCBzaGFkb3dEb21QYXJlbnQgPSB0aGlzLnNoYWRvd0RvbVBhcmVudDtcbiAgICAgICAgaWYgKHNoYWRvd0RvbVBhcmVudCkge1xuICAgICAgICAgIHNoYWRvd0RvbVBhcmVudHMucHVzaChzaGFkb3dEb21QYXJlbnQpO1xuICAgICAgICAgIHdoaWxlIChzaGFkb3dEb21QYXJlbnQuc2hhZG93RG9tUGFyZW50KSB7XG4gICAgICAgICAgICBzaGFkb3dEb21QYXJlbnQgPSBzaGFkb3dEb21QYXJlbnQuc2hhZG93RG9tUGFyZW50O1xuICAgICAgICAgICAgc2hhZG93RG9tUGFyZW50cy5wdXNoKHNoYWRvd0RvbVBhcmVudClcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHNoYWRvd0RvbVBhcmVudHM7XG4gICAgICB9XG5cbiAgICAgIGdldCBsaWdodERvbUNoaWxkcmVuKCkge1xuICAgICAgICAvLyByZXR1cm4gWy4uLnRoaXMuc2hhZG93Um9vdC5xdWVyeVNlbGVjdG9yQWxsKCdzbG90JyldXG4gICAgICAgIC8vICAgLnJlZHVjZSgoYWNjLCBzbG90KSA9PiB7XG4gICAgICAgIC8vICAgICByZXR1cm4gWy4uLmFjYywgLi4uc2xvdC5hc3NpZ25lZE5vZGVzKClcbiAgICAgICAgLy8gICAgICAgLmZpbHRlcigobm9kZSkgPT4gbm9kZS5ub2RlVHlwZSA9PT0gTm9kZS5FTEVNRU5UX05PREUpXG4gICAgICAgIC8vICAgICAgIC5yZWR1Y2UoKGFjYywgbm9kZSkgPT4gWy4uLmFjYywgLi4ubm9kZS5xdWVyeVNlbGVjdG9yQWxsKCdbZGJ1aS13ZWItY29tcG9uZW50XScpXSwgW10pXTtcbiAgICAgICAgLy8gICB9LCBbXSk7XG4gICAgICAgIHJldHVybiBbLi4udGhpcy5xdWVyeVNlbGVjdG9yQWxsKCdbZGJ1aS13ZWItY29tcG9uZW50XScpXTtcbiAgICAgIH1cblxuICAgICAgZ2V0IGxpZ2h0RG9tQ2hpbGRyZW5GaXJzdExldmVsKCkge1xuICAgICAgICByZXR1cm4gW107XG4gICAgICB9XG5cbiAgICAgIGdldCBsaWdodERvbVBhcmVudCgpIHtcbiAgICAgICAgbGV0IHBhcmVudCA9IHRoaXMucGFyZW50RWxlbWVudDtcbiAgICAgICAgd2hpbGUgKHBhcmVudCAmJiAhcGFyZW50Lmhhc0F0dHJpYnV0ZSgnZGJ1aS13ZWItY29tcG9uZW50JykpIHtcbiAgICAgICAgICBwYXJlbnQgPSBwYXJlbnQucGFyZW50RWxlbWVudDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcGFyZW50IHx8IG51bGw7XG4gICAgICB9XG5cbiAgICAgIGdldCBjbG9zZXN0RGJ1aVBhcmVudCgpIHtcbiAgICAgICAgY29uc3QgcGFyZW50ID0gdGhpcy5wYXJlbnRFbGVtZW50O1xuICAgICAgICBjb25zdCBjbG9zZXN0UGFyZW50ID0gcGFyZW50LmNsb3Nlc3QoJ1tkYnVpLXdlYi1jb21wb25lbnRdJyk7XG4gICAgICAgIHJldHVybiBjbG9zZXN0UGFyZW50IHx8IHRoaXMuc2hhZG93RG9tUGFyZW50O1xuICAgICAgfVxuXG4gICAgICBnZXQgaXNDb25uZWN0ZWQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9pc0Nvbm5lY3RlZDtcbiAgICAgIH1cblxuICAgICAgY29uc3RydWN0b3IoLi4uYXJncykge1xuICAgICAgICBzdXBlcigpO1xuXG4gICAgICAgIHRoaXMuYXR0YWNoU2hhZG93KHtcbiAgICAgICAgICBtb2RlOiAnb3BlbicsXG4gICAgICAgICAgLy8gZGVsZWdhdGVzRm9jdXM6IHRydWVcbiAgICAgICAgICAvLyBOb3Qgd29ya2luZyBvbiBJUGFkIHNvIHdlIGRvIGFuIHdvcmthcm91bmRcbiAgICAgICAgICAvLyBieSBzZXR0aW5nIFwiZm9jdXNlZFwiIGF0dHJpYnV0ZSB3aGVuIG5lZWRlZC5cbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5faXNDb25uZWN0ZWQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5fc2hhZG93RG9tQW5jZXN0b3JzQ2hhaW5Db25uZWN0ZWQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5faW5zZXJ0VGVtcGxhdGUoKTtcblxuICAgICAgICB0aGlzLmNvbm5lY3RlZENhbGxiYWNrID0gdGhpcy5jb25uZWN0ZWRDYWxsYmFjay5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzLmRpc2Nvbm5lY3RlZENhbGxiYWNrID0gdGhpcy5kaXNjb25uZWN0ZWRDYWxsYmFjay5iaW5kKHRoaXMpO1xuICAgICAgICAvLyBUT0RPOiBfaGFuZGxlTG9jYWxlQ2hhbmdlIG9ubHkgaWYgdXNlciBzZXRzIGxvY2FsZS1hd2FyZSBhdHRyaWJ1dGVcbiAgICAgICAgdGhpcy5faGFuZGxlTG9jYWxlQ2hhbmdlID0gdGhpcy5faGFuZGxlTG9jYWxlQ2hhbmdlLmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMub25Mb2NhbGVDaGFuZ2UgPSB0aGlzLm9uTG9jYWxlQ2hhbmdlLmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMudW5yZWdpc3RlckxvY2FsZUNoYW5nZSA9IG51bGw7XG5cbiAgICAgICAgLy8gcHJvdmlkZSBzdXBwb3J0IGZvciB0cmFpdHMgaWYgYW55IGFzIHRoZXkgY2FuJ3Qgb3ZlcnJpZGUgY29uc3RydWN0b3JcbiAgICAgICAgdGhpcy5pbml0ICYmIHRoaXMuaW5pdCguLi5hcmdzKTtcbiAgICAgIH1cblxuICAgICAgLy8gaHR0cHM6Ly9kZXZlbG9wZXJzLmdvb2dsZS5jb20vd2ViL2Z1bmRhbWVudGFscy93ZWItY29tcG9uZW50cy9iZXN0LXByYWN0aWNlcyNsYXp5LXByb3BlcnRpZXNcbiAgICAgIC8vIGh0dHBzOi8vZGV2ZWxvcGVycy5nb29nbGUuY29tL3dlYi9mdW5kYW1lbnRhbHMvd2ViLWNvbXBvbmVudHMvZXhhbXBsZXMvaG93dG8tY2hlY2tib3hcbiAgICAgIC8qIGVzbGludCBuby1wcm90b3R5cGUtYnVpbHRpbnM6IDAgKi9cbiAgICAgIF91cGdyYWRlUHJvcGVydHkocHJvcCkge1xuICAgICAgICBpZiAodGhpcy5oYXNPd25Qcm9wZXJ0eShwcm9wKSkge1xuICAgICAgICAgIGNvbnN0IHZhbHVlID0gdGhpc1twcm9wXTtcbiAgICAgICAgICAvLyBnZXQgcmlkIG9mIHRoZSBwcm9wZXJ0eSB0aGF0IG1pZ2h0IHNoYWRvdyBhIHNldHRlci9nZXR0ZXJcbiAgICAgICAgICBkZWxldGUgdGhpc1twcm9wXTtcbiAgICAgICAgICAvLyB0aGlzIHRpbWUgaWYgYSBzZXR0ZXIgd2FzIGRlZmluZWQgaXQgd2lsbCBiZSBwcm9wZXJseSBjYWxsZWRcbiAgICAgICAgICB0aGlzW3Byb3BdID0gdmFsdWU7XG4gICAgICAgICAgLy8gaWYgYSBnZXR0ZXIgd2FzIGRlZmluZWQsIGl0IHdpbGwgYmUgY2FsbGVkIGZyb20gbm93IG9uXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgX2RlZmluZVByb3BlcnR5KGtleSwgdmFsdWUpIHtcbiAgICAgICAgLy8gZG9uJ3Qgb3ZlcnJpZGUgdXNlciBkZWZpbmVkIHZhbHVlXG4gICAgICAgIGlmICghdGhpcy5oYXNBdHRyaWJ1dGUoa2V5KSkge1xuICAgICAgICAgIHRoaXMuc2V0QXR0cmlidXRlKGtleSwgdmFsdWUpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIF9pbnNlcnRUZW1wbGF0ZSgpIHtcbiAgICAgICAgY29uc3QgeyB0ZW1wbGF0ZSB9ID0gdGhpcy5jb25zdHJ1Y3RvcjtcbiAgICAgICAgdGVtcGxhdGUgJiZcbiAgICAgICAgdGhpcy5zaGFkb3dSb290LmFwcGVuZENoaWxkKHRlbXBsYXRlLmNvbnRlbnQuY2xvbmVOb2RlKHRydWUpKTtcbiAgICAgIH1cblxuICAgICAgX2hhbmRsZUxvY2FsZUNoYW5nZShsb2NhbGUpIHtcbiAgICAgICAgdGhpcy5zZXRBdHRyaWJ1dGUoJ2RpcicsIGxvY2FsZS5kaXIpO1xuICAgICAgICB0aGlzLnNldEF0dHJpYnV0ZSgnbGFuZycsIGxvY2FsZS5sYW5nKTtcbiAgICAgICAgdGhpcy5vbkxvY2FsZUNoYW5nZShsb2NhbGUpO1xuICAgICAgfVxuXG4gICAgICBfcHJvcGFnYXRlTWVzc2FnZShtZXNzYWdlSW5zdCkge1xuICAgICAgICAvLyBXaWxsIGJlIGlnbm9yZWQgaWYgcmVtZW1iZXJOb2Rlc1BhdGggd2FzIGZhbHNlIGF0IG1lc3NhZ2UgY3JlYXRpb25cbiAgICAgICAgbWVzc2FnZUluc3QuYXBwZW5kVmlzaXRlZE5vZGUodGhpcyk7XG4gICAgICAgIHRoaXMub25NZXNzYWdlUmVjZWl2ZWQobWVzc2FnZUluc3QpO1xuICAgICAgICAvLyBJbnNpZGUgb25NZXNzYWdlUmVjZWl2ZWQgdGhlcmUgaXMgYSBjaGFuY2UgdGhhdFxuICAgICAgICAvLyBtZXNzYWdlI3N0b3BQcm9wYWdhdGlvbiBoYXMgYmVlbiBjYWxsZWQuXG4gICAgICAgIGlmIChtZXNzYWdlSW5zdC5zaG91bGRQcm9wYWdhdGUpIHtcbiAgICAgICAgICB0aGlzLnNlbmRNZXNzYWdlKG1lc3NhZ2VJbnN0KTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyB3ZWIgY29tcG9uZW50cyBzdGFuZGFyZCBBUElcbiAgICAgIC8qXG4gICAgICAqIGNvbm5lY3RlZENhbGxiYWNrIGlzIGZpcmVkIGZyb20gY2hpbGRyZW4gdG8gcGFyZW50IGluIHNoYWRvdyBET01cbiAgICAgICogYnV0IHRoZSBvcmRlciBpcyBsZXNzIHByZWRpY3RhYmxlIGluIGxpZ2h0IERPTS5cbiAgICAgICogU2hvdWxkIG5vdCByZWFkIGxpZ2h0L3NoYWRvd0RvbVBhcmVudC9DaGlsZHJlbiBoZXJlLlxuICAgICAgKiAqL1xuICAgICAgY29ubmVjdGVkQ2FsbGJhY2soKSB7XG4gICAgICAgIHRoaXMuX2lzQ29ubmVjdGVkID0gdHJ1ZTtcbiAgICAgICAgd2luLmFkZEV2ZW50TGlzdGVuZXIoJ2JlZm9yZXVubG9hZCcsIHRoaXMuZGlzY29ubmVjdGVkQ2FsbGJhY2ssIGZhbHNlKTtcbiAgICAgICAgdGhpcy51bnJlZ2lzdGVyTG9jYWxlQ2hhbmdlID1cbiAgICAgICAgICBMb2NhbGVTZXJ2aWNlLm9uTG9jYWxlQ2hhbmdlKHRoaXMuX2hhbmRsZUxvY2FsZUNoYW5nZSk7XG4gICAgICAgIGNvbnN0IHsgcHJvcGVydGllc1RvVXBncmFkZSwgcHJvcGVydGllc1RvRGVmaW5lIH0gPSB0aGlzLmNvbnN0cnVjdG9yO1xuICAgICAgICBwcm9wZXJ0aWVzVG9VcGdyYWRlLmZvckVhY2goKHByb3BlcnR5KSA9PiB7XG4gICAgICAgICAgdGhpcy5fdXBncmFkZVByb3BlcnR5KHByb3BlcnR5KTtcbiAgICAgICAgfSk7XG4gICAgICAgIE9iamVjdC5rZXlzKHByb3BlcnRpZXNUb0RlZmluZSkuZm9yRWFjaCgocHJvcGVydHkpID0+IHtcbiAgICAgICAgICB0aGlzLl9kZWZpbmVQcm9wZXJ0eShwcm9wZXJ0eSwgcHJvcGVydGllc1RvRGVmaW5lW3Byb3BlcnR5XSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGNvbnN0IGluZm8gPSAoKSA9PiB7XG4gICAgICAgICAgY29uc3Qgc2VsZklkID0gdGhpcy5pZCB8fCAnbm8gaWQnO1xuICAgICAgICAgIGNvbnN0IGlzRGVmaW5lZCA9ICEhd2luLmN1c3RvbUVsZW1lbnRzLmdldCh0aGlzLmNvbnN0cnVjdG9yLnJlZ2lzdHJhdGlvbk5hbWUpO1xuICAgICAgICAgIGNvbnN0IGhhc0F0dHIgPSB0aGlzLmhhc0F0dHJpYnV0ZSgnZGJ1aS13ZWItY29tcG9uZW50Jyk7XG5cbiAgICAgICAgICBjb25zdCBjbG9zZXN0RGJ1aVBhcmVudCA9IHRoaXMuY2xvc2VzdERidWlQYXJlbnQ7XG4gICAgICAgICAgY29uc3Qgc2hhZG93RG9tUGFyZW50ID0gdGhpcy5zaGFkb3dEb21QYXJlbnQ7XG4gICAgICAgICAgY29uc3Qgc2hhZG93RG9tUGFyZW50cyA9IHRoaXMuc2hhZG93RG9tUGFyZW50cztcbiAgICAgICAgICBjb25zdCBzaGFkb3dEb21DaGlsZHJlbiA9IHRoaXMuc2hhZG93RG9tQ2hpbGRyZW47XG4gICAgICAgICAgY29uc3QgbGlnaHREb21QYXJlbnQgPSB0aGlzLmxpZ2h0RG9tUGFyZW50O1xuICAgICAgICAgIGNvbnN0IGxpZ2h0RG9tQ2hpbGRyZW4gPSB0aGlzLmxpZ2h0RG9tQ2hpbGRyZW47XG4gICAgICAgICAgLy8gY29uc3QgbGlnaHRQYXJlbnRIYXNBdHRyID0gbGlnaHREb21QYXJlbnQgJiYgbGlnaHREb21QYXJlbnQuaGFzQXR0cmlidXRlKCdkYnVpLXdlYi1jb21wb25lbnQnKTtcbiAgICAgICAgICBjb25zdCBvd25lckRvY3VtZW50ID0gdGhpcy5vd25lckRvY3VtZW50O1xuICAgICAgICAgIGNvbnN0IHBhcmVudE5vZGUgPSB0aGlzLnBhcmVudE5vZGU7XG4gICAgICAgICAgY29uc3QgZGVmYXVsdFZpZXcgPSBvd25lckRvY3VtZW50LmRlZmF1bHRWaWV3O1xuXG4gICAgICAgICAgY29uc29sZS5sb2coe1xuICAgICAgICAgICAgc2VsZklkLFxuICAgICAgICAgICAgY2xvc2VzdERidWlQYXJlbnQ6IChjbG9zZXN0RGJ1aVBhcmVudCB8fCB7fSkuaWQgfHwgbnVsbFxuICAgICAgICAgICAgLy8gaXNEZWZpbmVkLFxuICAgICAgICAgICAgLy8gaGFzQXR0cixcbiAgICAgICAgICAgIC8vIG93bmVyRG9jdW1lbnQsXG4gICAgICAgICAgICAvLyBwYXJlbnROb2RlLFxuICAgICAgICAgICAgLy8gZGVmYXVsdFZpZXcsXG4gICAgICAgICAgICAvLyBsaWdodFBhcmVudEhhc0F0dHIsXG4gICAgICAgICAgICAvLyBsaWdodERvbVBhcmVudDogKGxpZ2h0RG9tUGFyZW50IHx8IHt9KS5pZCB8fCBudWxsLFxuICAgICAgICAgICAgLy8gbGlnaHREb21DaGlsZHJlbjogbGlnaHREb21DaGlsZHJlbi5tYXAoKGNoaWxkKSA9PiBjaGlsZC5pZCkuam9pbignLCAnKSxcbiAgICAgICAgICAgIC8vIHNoYWRvd0RvbVBhcmVudHM6IHNoYWRvd0RvbVBhcmVudHMubWFwKChjaGlsZCkgPT4gY2hpbGQuaWQpLmpvaW4oJywgJyksXG4gICAgICAgICAgICAvLyBzaGFkb3dEb21QYXJlbnQ6IChzaGFkb3dEb21QYXJlbnQgfHwge30pLmlkIHx8IG51bGwsXG4gICAgICAgICAgICAvLyBzaGFkb3dEb21DaGlsZHJlbjogc2hhZG93RG9tQ2hpbGRyZW4ubWFwKChjaGlsZCkgPT4gY2hpbGQuaWQpLmpvaW4oJywgJylcbiAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICAgICAgaW5mbygpO1xuICAgICAgICAvLyBzZXRUaW1lb3V0KGluZm8sIDApO1xuXG4gICAgICAgIC8vIElmIGlzIGluIGxpZ2h0IERPTSBvciBpcyBhIGNoaWxkIG9mIGEgcGFyZW50IGhhdmluZyBjb25uZWN0ZWQgYW5jZXN0b3JzXG4gICAgICAgIC8vIG5vdGlmeSBkZXNjZW5kYW50cyB0aGF0IGFuY2VzdG9yIGNoYWluIGlzIGNvbm5lY3RlZC5cbiAgICAgICAgLy8gaWYgKHRoaXMuaXNTZWxmT3JQYXJlbnRTaGFkb3dEb21BbmNlc3RvcnNDaGFpbkNvbm5lY3RlZCkge1xuICAgICAgICAvLyAgIHRoaXMuc2hhZG93RG9tU2VuZE1lc3NhZ2VUb0NoaWxkcmVuQW5kU2VsZih7XG4gICAgICAgIC8vICAgICBjaGFubmVsOiBDSEFOTkVMX0lOVEVSTkFMLFxuICAgICAgICAvLyAgICAgbWVzc2FnZTogTUVTU0FHRV9TSEFET1dfRE9NX0FOQ0VTVE9SU19DSEFJTl9DT05ORUNURURcbiAgICAgICAgLy8gICB9KTtcbiAgICAgICAgLy8gfVxuICAgICAgfVxuXG4gICAgICAvLyB3ZWIgY29tcG9uZW50cyBzdGFuZGFyZCBBUElcbiAgICAgIGRpc2Nvbm5lY3RlZENhbGxiYWNrKCkge1xuICAgICAgICB0aGlzLl9pc0Nvbm5lY3RlZCA9IGZhbHNlO1xuICAgICAgICB0aGlzLnVucmVnaXN0ZXJMb2NhbGVDaGFuZ2UoKTtcbiAgICAgICAgd2luLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2JlZm9yZXVubG9hZCcsIHRoaXMuZGlzY29ubmVjdGVkQ2FsbGJhY2ssIGZhbHNlKTtcbiAgICAgIH1cblxuICAgICAgLy8gd2ViIGNvbXBvbmVudHMgc3RhbmRhcmQgQVBJXG4gICAgICBhdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2soKSB7XG4gICAgICAgIC8vIG5vIG9wXG4gICAgICB9XG5cbiAgICAgIG9uTG9jYWxlQ2hhbmdlKCkge1xuICAgICAgICAvLyBubyBvcFxuICAgICAgfVxuXG4gICAgICBjcmVhdGVNZXNzYWdlKHtcbiAgICAgICAgY2hhbm5lbCwgbWVzc2FnZSwgZGF0YSwgcmVtZW1iZXJOb2Rlc1BhdGgsIHRhcmdldFR5cGUsIGRvbVR5cGUsIGFwcGVuZFNlbGYgPSB0cnVlXG4gICAgICB9ID0ge30pIHtcbiAgICAgICAgY29uc3QgbWVzc2FnZUluc3QgPSBuZXcgREJVSVdlYkNvbXBvbmVudE1lc3NhZ2Uoe1xuICAgICAgICAgIGNoYW5uZWwsXG4gICAgICAgICAgbWVzc2FnZSxcbiAgICAgICAgICBkYXRhLFxuICAgICAgICAgIHNvdXJjZTogdGhpcyxcbiAgICAgICAgICByZW1lbWJlck5vZGVzUGF0aCxcbiAgICAgICAgICB0YXJnZXRUeXBlLFxuICAgICAgICAgIGRvbVR5cGVcbiAgICAgICAgfSk7XG4gICAgICAgIC8vIHdpbGwgYmUgaWdub3JlZCBpZiByZW1lbWJlck5vZGVzUGF0aCB3YXMgZmFsc2UgYXQgbWVzc2FnZSBjcmVhdGlvblxuICAgICAgICBhcHBlbmRTZWxmICYmIG1lc3NhZ2VJbnN0LmFwcGVuZFZpc2l0ZWROb2RlKHRoaXMpO1xuICAgICAgICByZXR1cm4gbWVzc2FnZUluc3Q7XG4gICAgICB9XG5cbiAgICAgIHNlbmRNZXNzYWdlKG1lc3NhZ2VJbnN0KSB7XG4gICAgICAgIGNvbnN0IHsgdGFyZ2V0VHlwZSwgZG9tVHlwZSB9ID0gbWVzc2FnZUluc3Q7XG4gICAgICAgIGlmICh0YXJnZXRUeXBlID09PSBQQVJFTlRfVEFSR0VUX1RZUEUpIHtcbiAgICAgICAgICBjb25zdCBwYXJlbnQgPVxuICAgICAgICAgICAgZG9tVHlwZSA9PT0gU0hBRE9XX0RPTV9UWVBFID8gdGhpcy5zaGFkb3dEb21QYXJlbnQgOiB0aGlzLmxpZ2h0RG9tUGFyZW50O1xuICAgICAgICAgIHBhcmVudCAmJiBwYXJlbnQuX3Byb3BhZ2F0ZU1lc3NhZ2UobWVzc2FnZUluc3QuY2xvbmVPckluc3RhbmNlKTtcbiAgICAgICAgfSBlbHNlIGlmICh0YXJnZXRUeXBlID09PSBDSElMRFJFTl9UQVJHRVRfVFlQRSkge1xuICAgICAgICAgIGNvbnN0IGNoaWxkcmVuID1cbiAgICAgICAgICAgIGRvbVR5cGUgPT09IFNIQURPV19ET01fVFlQRSA/IHRoaXMuc2hhZG93RG9tQ2hpbGRyZW4gOiB0aGlzLmxpZ2h0RG9tQ2hpbGRyZW47XG4gICAgICAgICAgY2hpbGRyZW4uZm9yRWFjaCgoY2hpbGQpID0+IHtcbiAgICAgICAgICAgIGNoaWxkLl9wcm9wYWdhdGVNZXNzYWdlKG1lc3NhZ2VJbnN0LmNsb25lT3JJbnN0YW5jZSk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgb25NZXNzYWdlUmVjZWl2ZWQobWVzc2FnZUluc3QpIHtcbiAgICAgICAgLy8gY29uc29sZS5sb2codGhpcy5pZCwgJ2lzQ29ubmVjdGVkJywgdGhpcy5pc0Nvbm5lY3RlZCwgYHJlY2VpdmVkIG1lc3NhZ2UgJHttZXNzYWdlSW5zdC5tZXNzYWdlfWAsICdwYXRoJywgSlNPTi5zdHJpbmdpZnkobWVzc2FnZUluc3QudmlzaXRlZE5vZGVzLm1hcCgobm9kZSkgPT4gbm9kZS5pZCkpLCAnc291cmNlJywgbWVzc2FnZUluc3Quc291cmNlLmlkKTtcbiAgICAgICAgY29uc3QgeyBkb21UeXBlIH0gPSBtZXNzYWdlSW5zdDtcbiAgICAgICAgdGhpc1tgb24ke2RvbVR5cGV9TWVzc2FnZWBdKG1lc3NhZ2VJbnN0KTtcbiAgICAgIH1cblxuICAgICAgW2BvbiR7U0hBRE9XX0RPTV9UWVBFfU1lc3NhZ2VgXShtZXNzYWdlSW5zdCkge1xuICAgICAgICBjb25zdCB7IGNoYW5uZWwsIGRvbVR5cGUgfSA9IG1lc3NhZ2VJbnN0O1xuICAgICAgICBjb25zdCBsaXN0ZW5lciA9IGBvbiR7ZG9tVHlwZX0ke2NoYW5uZWx9TWVzc2FnZWA7XG4gICAgICAgIHRoaXNbbGlzdGVuZXJdICYmIHRoaXNbbGlzdGVuZXJdKG1lc3NhZ2VJbnN0KTtcbiAgICAgIH1cblxuICAgICAgW2BvbiR7TElHSFRfRE9NX1RZUEV9TWVzc2FnZWBdKG1lc3NhZ2VJbnN0KSB7XG4gICAgICAgIGNvbnN0IHsgY2hhbm5lbCwgZG9tVHlwZSB9ID0gbWVzc2FnZUluc3Q7XG4gICAgICAgIGNvbnN0IGxpc3RlbmVyID0gYG9uJHtkb21UeXBlfSR7Y2hhbm5lbH1NZXNzYWdlYDtcbiAgICAgICAgdGhpc1tsaXN0ZW5lcl0gJiYgdGhpc1tsaXN0ZW5lcl0obWVzc2FnZUluc3QpO1xuICAgICAgfVxuXG4gICAgICBbYG9uJHtTSEFET1dfRE9NX1RZUEV9JHtDSEFOTkVMX0lOVEVSTkFMfU1lc3NhZ2VgXShtZXNzYWdlSW5zdCkge1xuICAgICAgICBjb25zdCB7IG1lc3NhZ2UgfSA9IG1lc3NhZ2VJbnN0O1xuICAgICAgICBtZXNzYWdlID09PSBNRVNTQUdFX1NIQURPV19ET01fQU5DRVNUT1JTX0NIQUlOX0NPTk5FQ1RFRCAmJlxuICAgICAgICAgIHRoaXMub25TaGFkb3dEb21BbmNlc3RvcnNDaGFpbkNvbm5lY3RlZChtZXNzYWdlSW5zdCk7XG4gICAgICB9XG5cbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZVxuICAgICAgb25TaGFkb3dEb21BbmNlc3RvcnNDaGFpbkNvbm5lY3RlZChtZXNzYWdlSW5zdCkge1xuICAgICAgICB0aGlzLl9zaGFkb3dEb21BbmNlc3RvcnNDaGFpbkNvbm5lY3RlZCA9IHRydWU7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKHRoaXMuaWQsICdpc0Nvbm5lY3RlZCcsIHRoaXMuaXNDb25uZWN0ZWQsICdvblNoYWRvd0RvbUFuY2VzdG9yc0NoYWluQ29ubmVjdGVkJywgbWVzc2FnZUluc3Quc291cmNlLmlkKTtcbiAgICAgIH1cblxuICAgICAgc2hhZG93RG9tU2VuZE1lc3NhZ2VUb1BhcmVudCh7IGNoYW5uZWwsIG1lc3NhZ2UsIGRhdGEsIHJlbWVtYmVyTm9kZXNQYXRoIH0pIHtcbiAgICAgICAgdGhpcy5zZW5kTWVzc2FnZSh0aGlzLmNyZWF0ZU1lc3NhZ2Uoe1xuICAgICAgICAgIGNoYW5uZWwsXG4gICAgICAgICAgbWVzc2FnZSxcbiAgICAgICAgICBkYXRhLFxuICAgICAgICAgIHJlbWVtYmVyTm9kZXNQYXRoLFxuICAgICAgICAgIHRhcmdldFR5cGU6IFBBUkVOVF9UQVJHRVRfVFlQRSxcbiAgICAgICAgICBkb21UeXBlOiBTSEFET1dfRE9NX1RZUEVcbiAgICAgICAgfSkpO1xuICAgICAgfVxuXG4gICAgICBzaGFkb3dEb21TZW5kTWVzc2FnZVRvQ2hpbGRyZW4oeyBjaGFubmVsLCBtZXNzYWdlLCBkYXRhLCByZW1lbWJlck5vZGVzUGF0aCB9KSB7XG4gICAgICAgIHRoaXMuc2VuZE1lc3NhZ2UodGhpcy5jcmVhdGVNZXNzYWdlKHtcbiAgICAgICAgICBjaGFubmVsLFxuICAgICAgICAgIG1lc3NhZ2UsXG4gICAgICAgICAgZGF0YSxcbiAgICAgICAgICByZW1lbWJlck5vZGVzUGF0aCxcbiAgICAgICAgICB0YXJnZXRUeXBlOiBDSElMRFJFTl9UQVJHRVRfVFlQRSxcbiAgICAgICAgICBkb21UeXBlOiBTSEFET1dfRE9NX1RZUEVcbiAgICAgICAgfSkpO1xuICAgICAgfVxuXG4gICAgICBzaGFkb3dEb21TZW5kTWVzc2FnZVRvUGFyZW50QW5kU2VsZih7IGNoYW5uZWwsIG1lc3NhZ2UsIGRhdGEsIHJlbWVtYmVyTm9kZXNQYXRoIH0pIHtcbiAgICAgICAgY29uc3QgbWVzc2FnZUluc3QgPSB0aGlzLmNyZWF0ZU1lc3NhZ2Uoe1xuICAgICAgICAgIGNoYW5uZWwsXG4gICAgICAgICAgbWVzc2FnZSxcbiAgICAgICAgICBkYXRhLFxuICAgICAgICAgIHJlbWVtYmVyTm9kZXNQYXRoLFxuICAgICAgICAgIHRhcmdldFR5cGU6IFBBUkVOVF9UQVJHRVRfVFlQRSxcbiAgICAgICAgICBkb21UeXBlOiBTSEFET1dfRE9NX1RZUEUsXG4gICAgICAgICAgYXBwZW5kU2VsZjogZmFsc2VcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuX3Byb3BhZ2F0ZU1lc3NhZ2UobWVzc2FnZUluc3QpO1xuICAgICAgfVxuXG4gICAgICBzaGFkb3dEb21TZW5kTWVzc2FnZVRvQ2hpbGRyZW5BbmRTZWxmKHsgY2hhbm5lbCwgbWVzc2FnZSwgZGF0YSwgcmVtZW1iZXJOb2Rlc1BhdGggfSkge1xuICAgICAgICBjb25zdCBtZXNzYWdlSW5zdCA9IHRoaXMuY3JlYXRlTWVzc2FnZSh7XG4gICAgICAgICAgY2hhbm5lbCxcbiAgICAgICAgICBtZXNzYWdlLFxuICAgICAgICAgIGRhdGEsXG4gICAgICAgICAgcmVtZW1iZXJOb2Rlc1BhdGgsXG4gICAgICAgICAgdGFyZ2V0VHlwZTogQ0hJTERSRU5fVEFSR0VUX1RZUEUsXG4gICAgICAgICAgZG9tVHlwZTogU0hBRE9XX0RPTV9UWVBFLFxuICAgICAgICAgIGFwcGVuZFNlbGY6IGZhbHNlXG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLl9wcm9wYWdhdGVNZXNzYWdlKG1lc3NhZ2VJbnN0KTtcbiAgICAgIH1cblxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGRlZmluZUNvbW1vblN0YXRpY01ldGhvZHMoa2xhc3MpIHtcbiAgICAgIGNvbnN0IHRlbXBsYXRlSW5uZXJIVE1MID0ga2xhc3MudGVtcGxhdGVJbm5lckhUTUw7XG4gICAgICBjb25zdCB0ZW1wbGF0ZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RlbXBsYXRlJyk7XG4gICAgICB0ZW1wbGF0ZS5pbm5lckhUTUwgPSB0ZW1wbGF0ZUlubmVySFRNTDtcblxuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGtsYXNzLCAndGVtcGxhdGUnLCB7XG4gICAgICAgIGdldCgpIHsgcmV0dXJuIHRlbXBsYXRlOyB9LFxuICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgICB9KTtcblxuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGtsYXNzLCAnY29tcG9uZW50U3R5bGUnLCB7XG4gICAgICAgIGdldCgpIHtcbiAgICAgICAgICByZXR1cm4ga2xhc3MudGVtcGxhdGUuY29udGVudC5xdWVyeVNlbGVjdG9yKCdzdHlsZScpLmlubmVySFRNTDtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0KHZhbHVlKSB7XG4gICAgICAgICAga2xhc3MudGVtcGxhdGUuY29udGVudC5xdWVyeVNlbGVjdG9yKCdzdHlsZScpLmlubmVySFRNTCA9IHZhbHVlO1xuICAgICAgICB9LFxuICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgICB9KTtcblxuICAgICAgcmV0dXJuIGtsYXNzO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIFJlZ2lzdGVyYWJsZShrbGFzcykge1xuICAgICAga2xhc3MucmVnaXN0ZXJTZWxmID0gKCkgPT4ge1xuICAgICAgICBjb25zdCByZWdpc3RyYXRpb25OYW1lID0ga2xhc3MucmVnaXN0cmF0aW9uTmFtZTtcbiAgICAgICAgY29uc3QgZGVwZW5kZW5jaWVzID0ga2xhc3MuZGVwZW5kZW5jaWVzO1xuICAgICAgICAvLyBNYWtlIHN1cmUgb3VyIGRlcGVuZGVuY2llcyBhcmUgcmVnaXN0ZXJlZCBiZWZvcmUgd2UgcmVnaXN0ZXIgc2VsZlxuICAgICAgICBkZXBlbmRlbmNpZXMuZm9yRWFjaCgoZGVwZW5kZW5jeSkgPT4gZGVwZW5kZW5jeS5yZWdpc3RlclNlbGYoKSk7XG4gICAgICAgIC8vIERvbid0IHRyeSB0byByZWdpc3RlciBzZWxmIGlmIGFscmVhZHkgcmVnaXN0ZXJlZFxuICAgICAgICBpZiAoY3VzdG9tRWxlbWVudHMuZ2V0KHJlZ2lzdHJhdGlvbk5hbWUpKSByZXR1cm4gcmVnaXN0cmF0aW9uTmFtZTtcbiAgICAgICAgLy8gR2l2ZSBhIGNoYW5jZSB0byBvdmVycmlkZSB3ZWItY29tcG9uZW50IHN0eWxlIGlmIHByb3ZpZGVkIGJlZm9yZSBiZWluZyByZWdpc3RlcmVkLlxuICAgICAgICBjb25zdCBjb21wb25lbnRTdHlsZSA9ICgod2luLkRCVUlXZWJDb21wb25lbnRzIHx8IHt9KVtyZWdpc3RyYXRpb25OYW1lXSB8fCB7fSkuY29tcG9uZW50U3R5bGU7XG4gICAgICAgIGlmIChjb21wb25lbnRTdHlsZSkge1xuICAgICAgICAgIGtsYXNzLmNvbXBvbmVudFN0eWxlICs9ICdcXG5cXG4vKiA9PT09IG92ZXJyaWRlcyA9PT09ICovXFxuXFxuJztcbiAgICAgICAgICBrbGFzcy5jb21wb25lbnRTdHlsZSArPSBjb21wb25lbnRTdHlsZTtcbiAgICAgICAgfVxuICAgICAgICAvLyBEbyByZWdpc3RyYXRpb25cbiAgICAgICAgY3VzdG9tRWxlbWVudHMuZGVmaW5lKHJlZ2lzdHJhdGlvbk5hbWUsIGtsYXNzKTtcbiAgICAgICAgcmV0dXJuIHJlZ2lzdHJhdGlvbk5hbWU7XG4gICAgICB9O1xuXG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoa2xhc3MsICdwcm90b3R5cGVDaGFpbkluZm8nLCB7XG4gICAgICAgIGdldCgpIHtcbiAgICAgICAgICBjb25zdCBjaGFpbiA9IFtrbGFzc107XG4gICAgICAgICAgbGV0IHBhcmVudFByb3RvID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKGtsYXNzKTtcbiAgICAgICAgICB3aGlsZSAocGFyZW50UHJvdG8gIT09IEhUTUxFbGVtZW50KSB7XG4gICAgICAgICAgICBjaGFpbi5wdXNoKHBhcmVudFByb3RvKTtcbiAgICAgICAgICAgIHBhcmVudFByb3RvID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKHBhcmVudFByb3RvKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgY2hhaW4ucHVzaChwYXJlbnRQcm90byk7XG4gICAgICAgICAgcmV0dXJuIGNoYWluO1xuICAgICAgICB9LFxuICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgICB9KTtcblxuICAgICAgcmV0dXJuIGtsYXNzO1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICBEQlVJV2ViQ29tcG9uZW50QmFzZSxcbiAgICAgIGRlZmluZUNvbW1vblN0YXRpY01ldGhvZHMsXG4gICAgICBSZWdpc3RlcmFibGVcbiAgICB9O1xuICB9KTtcbn1cbiIsIlxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgREJVSVdlYkNvbXBvbmVudE1lc3NhZ2Uge1xuICBjb25zdHJ1Y3Rvcih7XG4gICAgY2hhbm5lbCwgbWVzc2FnZSwgZGF0YSwgc291cmNlLCByZW1lbWJlck5vZGVzUGF0aCxcbiAgICBkb21UeXBlLCB0YXJnZXRUeXBlLCBtZXRhZGF0YVxuICB9KSB7XG4gICAgdGhpcy5fY2hhbm5lbCA9IGNoYW5uZWw7XG4gICAgdGhpcy5fbWVzc2FnZSA9IG1lc3NhZ2U7XG4gICAgdGhpcy5fZGF0YSA9IGRhdGE7XG4gICAgdGhpcy5fc291cmNlID0gc291cmNlOyAvLyBpbnN0YW5jZSBvZiBub2RlIGNyZWF0aW5nIHRoZSBtZXNzYWdlXG4gICAgdGhpcy5fcmVtZW1iZXJOb2Rlc1BhdGggPSByZW1lbWJlck5vZGVzUGF0aDtcbiAgICB0aGlzLl9kb21UeXBlID0gZG9tVHlwZTsgLy8gTElHSFRfRE9NX1RZUEUgfHwgU0hBRE9XX0RPTV9UWVBFXG4gICAgdGhpcy5fdGFyZ2V0VHlwZSA9IHRhcmdldFR5cGU7IC8vIFBBUkVOVF9UQVJHRVRfVFlQRSB8fCBDSElMRFJFTl9UQVJHRVRfVFlQRVxuICAgIHRoaXMuX21ldGFkYXRhID0gbWV0YWRhdGE7XG5cbiAgICAvLyBpbnRlcm5hbHNcbiAgICB0aGlzLl9zaG91bGRQcm9wYWdhdGUgPSB0cnVlO1xuICAgIHRoaXMuX3Zpc2l0ZWROb2RlcyA9IFtdO1xuICB9XG5cbiAgZ2V0IGNsb25lT3JJbnN0YW5jZSgpIHtcbiAgICAvLyBUaGUgY2xvbmUgb25seSBtYWtlcyBzZW5zZSBpZiB3ZSdyZSByZW1lbWJlcmluZyB0aGUgbm9kZXMgcGF0aC5cbiAgICAvLyBJZiB3ZSBkb24ndCBuZWVkIHRoYXQsIHJldXNpbmcgdGhlIGluc3RhbmNlIHNob3VsZCBiZSBmaW5lLlxuICAgIGlmICghdGhpcy5yZW1lbWJlck5vZGVzUGF0aCkgcmV0dXJuIHRoaXM7XG4gICAgY29uc3QgbWVzc2FnZUNsb25lID0gbmV3IERCVUlXZWJDb21wb25lbnRNZXNzYWdlKHtcbiAgICAgIGNoYW5uZWw6IHRoaXMuY2hhbm5lbCxcbiAgICAgIG1lc3NhZ2U6IHRoaXMubWVzc2FnZSxcbiAgICAgIGRhdGE6IHRoaXMuZGF0YSxcbiAgICAgIHNvdXJjZTogdGhpcy5zb3VyY2UsXG4gICAgICByZW1lbWJlck5vZGVzUGF0aDogdGhpcy5yZW1lbWJlck5vZGVzUGF0aCxcbiAgICAgIGRvbVR5cGU6IHRoaXMuZG9tVHlwZSxcbiAgICAgIHRhcmdldFR5cGU6IHRoaXMudGFyZ2V0VHlwZSxcbiAgICAgIG1ldGFkYXRhOiB0aGlzLm1ldGFkYXRhXG4gICAgfSk7XG4gICAgbWVzc2FnZUNsb25lLl9zaG91bGRQcm9wYWdhdGUgPSB0aGlzLnNob3VsZFByb3BhZ2F0ZTtcbiAgICBtZXNzYWdlQ2xvbmUuX3Zpc2l0ZWROb2RlcyA9IFsuLi50aGlzLnZpc2l0ZWROb2Rlc107XG4gICAgcmV0dXJuIG1lc3NhZ2VDbG9uZTtcbiAgfVxuXG4gIGFwcGVuZFZpc2l0ZWROb2RlKG5vZGUpIHtcbiAgICBpZiAoIXRoaXMucmVtZW1iZXJOb2Rlc1BhdGgpIHJldHVybjtcbiAgICB0aGlzLl92aXNpdGVkTm9kZXMucHVzaChub2RlKTtcbiAgfVxuXG4gIHN0b3BQcm9wYWdhdGlvbigpIHtcbiAgICB0aGlzLl9zaG91bGRQcm9wYWdhdGUgPSBmYWxzZTtcbiAgfVxuXG4gIGdldCBzaG91bGRQcm9wYWdhdGUoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3Nob3VsZFByb3BhZ2F0ZTtcbiAgfVxuXG4gIGdldCBjaGFubmVsKCkge1xuICAgIHJldHVybiB0aGlzLl9jaGFubmVsO1xuICB9XG5cbiAgZ2V0IG1lc3NhZ2UoKSB7XG4gICAgcmV0dXJuIHRoaXMuX21lc3NhZ2U7XG4gIH1cblxuICBnZXQgZGF0YSgpIHtcbiAgICByZXR1cm4gdGhpcy5fZGF0YTtcbiAgfVxuXG4gIGdldCBzb3VyY2UoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3NvdXJjZTtcbiAgfVxuXG4gIGdldCByZW1lbWJlck5vZGVzUGF0aCgpIHtcbiAgICByZXR1cm4gdGhpcy5fcmVtZW1iZXJOb2Rlc1BhdGg7XG4gIH1cblxuICBnZXQgZG9tVHlwZSgpIHtcbiAgICByZXR1cm4gdGhpcy5fZG9tVHlwZTtcbiAgfVxuXG4gIGdldCB0YXJnZXRUeXBlKCkge1xuICAgIHJldHVybiB0aGlzLl90YXJnZXRUeXBlO1xuICB9XG5cbiAgZ2V0IG1ldGFkYXRhKCkge1xuICAgIHJldHVybiB0aGlzLl9tZXRhZGF0YTtcbiAgfVxuXG4gIGdldCB2aXNpdGVkTm9kZXMoKSB7XG4gICAgcmV0dXJuIFsuLi50aGlzLl92aXNpdGVkTm9kZXNdO1xuICB9XG5cbn1cblxuIiwiXG5pbXBvcnQgZ2V0REJVSVdlYkNvbXBvbmVudENvcmUgZnJvbSAnLi4vREJVSVdlYkNvbXBvbmVudENvcmUvREJVSVdlYkNvbXBvbmVudENvcmUnO1xuaW1wb3J0IGVuc3VyZVNpbmdsZVJlZ2lzdHJhdGlvbiBmcm9tICcuLi8uLi8uLi9pbnRlcm5hbHMvZW5zdXJlU2luZ2xlUmVnaXN0cmF0aW9uJztcblxuY29uc3QgcmVnaXN0cmF0aW9uTmFtZSA9ICdkYnVpLXdlYi1jb21wb25lbnQtZHVtbXknO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBnZXREQlVJV2ViQ29tcG9uZW50RHVtbXkod2luKSB7XG4gIHJldHVybiBlbnN1cmVTaW5nbGVSZWdpc3RyYXRpb24od2luLCByZWdpc3RyYXRpb25OYW1lLCAoKSA9PiB7XG4gICAgY29uc3Qge1xuICAgICAgREJVSVdlYkNvbXBvbmVudEJhc2UsXG4gICAgICBkZWZpbmVDb21tb25TdGF0aWNNZXRob2RzLFxuICAgICAgUmVnaXN0ZXJhYmxlXG4gICAgfSA9IGdldERCVUlXZWJDb21wb25lbnRDb3JlKHdpbik7XG5cbiAgICBjbGFzcyBEQlVJV2ViQ29tcG9uZW50RHVtbXkgZXh0ZW5kcyBEQlVJV2ViQ29tcG9uZW50QmFzZSB7XG5cbiAgICAgIHN0YXRpYyBnZXQgcmVnaXN0cmF0aW9uTmFtZSgpIHtcbiAgICAgICAgcmV0dXJuIHJlZ2lzdHJhdGlvbk5hbWU7XG4gICAgICB9XG5cbiAgICAgIHN0YXRpYyBnZXQgdGVtcGxhdGVJbm5lckhUTUwoKSB7XG4gICAgICAgIHJldHVybiBgXG4gICAgICAgICAgPHN0eWxlPlxuICAgICAgICAgIDpob3N0IHtcbiAgICAgICAgICAgIGRpc3BsYXk6IGlubGluZS1ibG9jaztcbiAgICAgICAgICAgIHdpZHRoOiAxMDAlO1xuICAgICAgICAgICAgbWF4LXdpZHRoOiA0MDBweDtcbiAgICAgICAgICAgIGhlaWdodDogdmFyKC0tZGJ1aS1pbnB1dC1oZWlnaHQsIDUwcHgpO1xuICAgICAgICAgICAgY29sb3I6IG1hcm9vbjtcbiAgICAgICAgICAgIGJvcmRlcjogMXB4IHNvbGlkIGdyYXk7XG4gICAgICAgICAgICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xuICAgICAgICAgIH1cbiAgICAgICAgICBcbiAgICAgICAgICA6aG9zdCBiLCA6aG9zdCBkaXZbeC1oYXMtc2xvdF0gc3Bhblt4LXNsb3Qtd3JhcHBlcl0ge1xuICAgICAgICAgICAgdW5pY29kZS1iaWRpOiBiaWRpLW92ZXJyaWRlO1xuICAgICAgICAgICAgdGV4dC1zaGFkb3c6IHZhcigtLWR1bW15LWItdGV4dC1zaGFkb3csIG5vbmUpO1xuICAgICAgICAgIH1cbiAgICBcbiAgICAgICAgICA6aG9zdChbZGlyPXJ0bF0pIGIge1xuICAgICAgICAgICAgdGV4dC1kZWNvcmF0aW9uOiB1bmRlcmxpbmU7XG4gICAgICAgICAgfVxuICAgICAgICAgIFxuICAgICAgICAgIDpob3N0KFtkaXI9bHRyXSkgYiB7XG4gICAgICAgICAgICB0ZXh0LWRlY29yYXRpb246IG92ZXJsaW5lO1xuICAgICAgICAgIH1cbiAgICBcbiAgICAgICAgICA6aG9zdChbZGlyPWx0cl0pICNjb250YWluZXIgPiBkaXZbZGlyPXJ0bF0sXG4gICAgICAgICAgOmhvc3QoW2Rpcj1ydGxdKSAjY29udGFpbmVyID4gZGl2W2Rpcj1sdHJdIHtcbiAgICAgICAgICAgIGRpc3BsYXk6IG5vbmU7XG4gICAgICAgICAgfVxuICAgICAgICAgIFxuICAgICAgICAgIDpob3N0ICNjb250YWluZXIgPiBkaXZbeC1oYXMtc2xvdF0ge1xuICAgICAgICAgICAgbWFyZ2luLWxlZnQ6IDBweDtcbiAgICAgICAgICB9XG4gICAgICAgICAgXG4gICAgICAgICAgI2NvbnRhaW5lciB7XG4gICAgICAgICAgICB3aWR0aDogMTAwJTtcbiAgICAgICAgICAgIGhlaWdodDogMTAwJTtcbiAgICAgICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgICAgICBmbGV4LWZsb3c6IHJvdyBub3dyYXA7XG4gICAgICAgICAgICBhbGlnbi1pdGVtczogc3RyZXRjaDtcbiAgICAgICAgICB9XG4gICAgICAgICAgXG4gICAgICAgICAgI2NvbnRhaW5lciA+IGRpdiB7XG4gICAgICAgICAgICBib3JkZXI6IDFweCBzb2xpZCBncmF5O1xuICAgICAgICAgICAgYm9yZGVyLXJhZGl1czogdmFyKC0tZHVtbXktaW5uZXItc2VjdGlvbnMtYm9yZGVyLXJhZGl1cywgMHB4KTtcbiAgICAgICAgICAgIGZsZXg6IDEgMCAwJTtcbiAgICAgICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgICAgICBtYXJnaW46IDVweDtcbiAgICAgICAgICB9XG4gICAgICAgICAgXG4gICAgICAgICAgI2NvbnRhaW5lciA+IGRpdiA+IGRpdiB7XG4gICAgICAgICAgICBtYXJnaW46IGF1dG87XG4gICAgICAgICAgfVxuICAgICAgICAgIFxuICAgICAgICAgIDwvc3R5bGU+XG4gICAgICAgICAgXG4gICAgICAgICAgPGRpdiBpZD1cImNvbnRhaW5lclwiPlxuICAgICAgICAgICAgPGRpdiBkaXI9XCJsdHJcIj5cbiAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICA8Yj5EdW1teSBzaGFkb3c8L2I+IFtMVFJdXG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIDxkaXYgeC1oYXMtc2xvdD5cbiAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICA8c3Bhbj5bPC9zcGFuPjxzcGFuIHgtc2xvdC13cmFwcGVyPjxzbG90Pjwvc2xvdD48L3NwYW4+PHNwYW4+XTwvc3Bhbj5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgPGRpdiBkaXI9XCJydGxcIj5cbiAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICA8Yj5EdW1teSBzaGFkb3c8L2I+IFtSVExdXG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIGA7XG4gICAgICB9XG5cbiAgICAgIG9uTG9jYWxlQ2hhbmdlKGxvY2FsZSkge1xuICAgICAgICAvLyBjb25zb2xlLmxvZygnb25Mb2NhbGVDaGFuZ2UnLCBsb2NhbGUpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBSZWdpc3RlcmFibGUoXG4gICAgICBkZWZpbmVDb21tb25TdGF0aWNNZXRob2RzKFxuICAgICAgICBEQlVJV2ViQ29tcG9uZW50RHVtbXlcbiAgICAgIClcbiAgICApO1xuICB9KTtcbn1cblxuZ2V0REJVSVdlYkNvbXBvbmVudER1bW15LnJlZ2lzdHJhdGlvbk5hbWUgPSByZWdpc3RyYXRpb25OYW1lO1xuXG4iLCJcblxuaW1wb3J0IGdldERCVUlXZWJDb21wb25lbnRDb3JlIGZyb20gJy4uL0RCVUlXZWJDb21wb25lbnRDb3JlL0RCVUlXZWJDb21wb25lbnRDb3JlJztcbmltcG9ydCBnZXREQlVJV2ViQ29tcG9uZW50RHVtbXkgZnJvbSAnLi4vREJVSVdlYkNvbXBvbmVudER1bW15L0RCVUlXZWJDb21wb25lbnREdW1teSc7XG5pbXBvcnQgZW5zdXJlU2luZ2xlUmVnaXN0cmF0aW9uIGZyb20gJy4uLy4uLy4uL2ludGVybmFscy9lbnN1cmVTaW5nbGVSZWdpc3RyYXRpb24nO1xuXG5jb25zdCByZWdpc3RyYXRpb25OYW1lID0gJ2RidWktd2ViLWNvbXBvbmVudC1kdW1teS1wYXJlbnQnO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBnZXREQlVJV2ViQ29tcG9uZW50RHVtbXlQYXJlbnQod2luKSB7XG4gIHJldHVybiBlbnN1cmVTaW5nbGVSZWdpc3RyYXRpb24od2luLCByZWdpc3RyYXRpb25OYW1lLCAoKSA9PiB7XG4gICAgY29uc3Qge1xuICAgICAgREJVSVdlYkNvbXBvbmVudEJhc2UsXG4gICAgICBkZWZpbmVDb21tb25TdGF0aWNNZXRob2RzLFxuICAgICAgUmVnaXN0ZXJhYmxlXG4gICAgfSA9IGdldERCVUlXZWJDb21wb25lbnRDb3JlKHdpbik7XG4gICAgY29uc3QgREJVSVdlYkNvbXBvbmVudER1bW15ID0gZ2V0REJVSVdlYkNvbXBvbmVudER1bW15KHdpbik7XG5cbiAgICBjbGFzcyBEQlVJV2ViQ29tcG9uZW50RHVtbXlQYXJlbnQgZXh0ZW5kcyBEQlVJV2ViQ29tcG9uZW50QmFzZSB7XG5cbiAgICAgIHN0YXRpYyBnZXQgcmVnaXN0cmF0aW9uTmFtZSgpIHtcbiAgICAgICAgcmV0dXJuIHJlZ2lzdHJhdGlvbk5hbWU7XG4gICAgICB9XG5cbiAgICAgIHN0YXRpYyBnZXQgdGVtcGxhdGVJbm5lckhUTUwoKSB7XG4gICAgICAgIHJldHVybiBgXG4gICAgICAgICAgPHN0eWxlPlxuICAgICAgICAgIDpob3N0IHtcbiAgICAgICAgICAgIGRpc3BsYXk6IGlubGluZS1ibG9jaztcbiAgICAgICAgICAgIHdpZHRoOiAxMDAlO1xuICAgICAgICAgICAgbWF4LXdpZHRoOiA0MDBweDtcbiAgICAgICAgICB9XG4gICAgICAgICAgPC9zdHlsZT5cbiAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgPGI+RHVtbXkgUGFyZW50IHNoYWRvdzwvYj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgPGRidWktd2ViLWNvbXBvbmVudC1kdW1teT48c2xvdD48L3Nsb3Q+PC9kYnVpLXdlYi1jb21wb25lbnQtZHVtbXk+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgYDtcbiAgICAgIH1cblxuICAgICAgc3RhdGljIGdldCBkZXBlbmRlbmNpZXMoKSB7XG4gICAgICAgIHJldHVybiBbREJVSVdlYkNvbXBvbmVudER1bW15XTtcbiAgICAgIH1cblxuICAgIH1cblxuICAgIHJldHVybiBSZWdpc3RlcmFibGUoXG4gICAgICBkZWZpbmVDb21tb25TdGF0aWNNZXRob2RzKFxuICAgICAgICBEQlVJV2ViQ29tcG9uZW50RHVtbXlQYXJlbnRcbiAgICAgIClcbiAgICApO1xuICB9KTtcbn1cblxuZ2V0REJVSVdlYkNvbXBvbmVudER1bW15UGFyZW50LnJlZ2lzdHJhdGlvbk5hbWUgPSByZWdpc3RyYXRpb25OYW1lO1xuXG4iLCJcbmltcG9ydCBnZXREQlVJV2ViQ29tcG9uZW50Q29yZSBmcm9tICcuLi9EQlVJV2ViQ29tcG9uZW50Q29yZS9EQlVJV2ViQ29tcG9uZW50Q29yZSc7XG5pbXBvcnQgZW5zdXJlU2luZ2xlUmVnaXN0cmF0aW9uIGZyb20gJy4uLy4uLy4uL2ludGVybmFscy9lbnN1cmVTaW5nbGVSZWdpc3RyYXRpb24nO1xuaW1wb3J0IEZvY3VzYWJsZSBmcm9tICcuLi8uLi9iZWhhdmlvdXJzL0ZvY3VzYWJsZSc7XG5cbmNvbnN0IHJlZ2lzdHJhdGlvbk5hbWUgPSAnZGJ1aS13ZWItY29tcG9uZW50LWZvcm0taW5wdXQtdGV4dCc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGdldERCVUlXZWJDb21wb25lbnRGb3JtSW5wdXRUZXh0KHdpbikge1xuICByZXR1cm4gZW5zdXJlU2luZ2xlUmVnaXN0cmF0aW9uKHdpbiwgcmVnaXN0cmF0aW9uTmFtZSwgKCkgPT4ge1xuICAgIGNvbnN0IHtcbiAgICAgIERCVUlXZWJDb21wb25lbnRCYXNlLFxuICAgICAgZGVmaW5lQ29tbW9uU3RhdGljTWV0aG9kcyxcbiAgICAgIFJlZ2lzdGVyYWJsZVxuICAgIH0gPSBnZXREQlVJV2ViQ29tcG9uZW50Q29yZSh3aW4pO1xuXG4gICAgY2xhc3MgREJVSVdlYkNvbXBvbmVudEZvcm1JbnB1dFRleHQgZXh0ZW5kcyBEQlVJV2ViQ29tcG9uZW50QmFzZSB7XG5cbiAgICAgIHN0YXRpYyBnZXQgcmVnaXN0cmF0aW9uTmFtZSgpIHtcbiAgICAgICAgcmV0dXJuIHJlZ2lzdHJhdGlvbk5hbWU7XG4gICAgICB9XG5cbiAgICAgIHN0YXRpYyBnZXQgdGVtcGxhdGVJbm5lckhUTUwoKSB7XG4gICAgICAgIHJldHVybiBgXG4gICAgICAgICAgPHN0eWxlPlxuICAgICAgICAgIDpob3N0IHtcbiAgICAgICAgICAgIGFsbDogaW5pdGlhbDsgXG4gICAgICAgICAgICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XG4gICAgICAgICAgICB3aWR0aDogMTAwJTtcbiAgICAgICAgICAgIC8qaGVpZ2h0OiB2YXIoLS1kYnVpLXdlYi1jb21wb25lbnQtZm9ybS1pbnB1dC1oZWlnaHQpOyovXG4gICAgICAgICAgICAvKmxpbmUtaGVpZ2h0OiB2YXIoLS1kYnVpLXdlYi1jb21wb25lbnQtZm9ybS1pbnB1dC1oZWlnaHQpOyovXG4gICAgICAgICAgICBoZWlnaHQ6IDMwMHB4O1xuICAgICAgICAgICAgcGFkZGluZzogMHB4O1xuICAgICAgICAgICAgZm9udC1zaXplOiAxOHB4O1xuICAgICAgICAgICAgY29sb3I6IHZhcigtLWRidWktd2ViLWNvbXBvbmVudC1mb3JtLWlucHV0LWNvbG9yKTtcbiAgICAgICAgICAgIC8qYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tZGJ1aS13ZWItY29tcG9uZW50LWZvcm0taW5wdXQtYmFja2dyb3VuZC1jb2xvcik7Ki9cbiAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMjU1LCAxMDAsIDAsIDAuMSk7XG4gICAgICAgICAgICB1bmljb2RlLWJpZGk6IGJpZGktb3ZlcnJpZGU7XG4gICAgICAgICAgICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xuICAgICAgICAgICAgYm9yZGVyOiBub25lO1xuICAgICAgICAgICAgYm9yZGVyLWJvdHRvbTogdmFyKC0tZGJ1aS13ZWItY29tcG9uZW50LWZvcm0taW5wdXQtYm9yZGVyLXdpZHRoKSB2YXIoLS1kYnVpLXdlYi1jb21wb25lbnQtZm9ybS1pbnB1dC1ib3JkZXItc3R5bGUpIHZhcigtLWRidWktd2ViLWNvbXBvbmVudC1mb3JtLWlucHV0LWJvcmRlci1jb2xvcik7XG4gICAgICAgICAgfVxuICAgICAgICAgIFxuICAgICAgICAgIDpob3N0IFt0YWJpbmRleF0ge1xuICAgICAgICAgICAgd2lkdGg6IDEwMCU7XG4gICAgICAgICAgICBoZWlnaHQ6IDUwcHg7XG4gICAgICAgICAgICBsaW5lLWhlaWdodDogNTBweDtcbiAgICAgICAgICAgIGJvcmRlcjogbm9uZTtcbiAgICAgICAgICAgIG1hcmdpbjogMHB4O1xuICAgICAgICAgICAgcGFkZGluZzogMHB4O1xuICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogdHJhbnNwYXJlbnQ7XG4gICAgICAgICAgICBib3JkZXItcmFkaXVzOiAwcHg7XG4gICAgICAgICAgICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xuICAgICAgICAgICAgdW5pY29kZS1iaWRpOiBiaWRpLW92ZXJyaWRlO1xuICAgICAgICAgIH1cbiAgICAgICAgICBcbiAgICAgICAgICA6aG9zdCBbdGFiaW5kZXhdOmZvY3VzIHtcbiAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMjU1LCAwLCAwLCAuMyk7XG4gICAgICAgICAgICBvdXRsaW5lOiBub25lO1xuICAgICAgICAgIH1cbiAgICBcbiAgICAgICAgICA6aG9zdChbZm9jdXNlZF0pIHtcbiAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMCwgMjU1LCAwLCAuMyk7XG4gICAgICAgICAgfVxuICAgICAgICAgIFxuICAgICAgICAgIC8qOmhvc3QoW2Rpc2FibGVkXSkgeyovXG4gICAgICAgICAgICAvKmJhY2tncm91bmQtY29sb3I6IHJnYmEoMCwgMCwgMCwgLjMpOyovXG4gICAgICAgICAgLyp9Ki9cbiAgICBcbiAgICAgICAgICA6aG9zdChbaGlkZGVuXSkge1xuICAgICAgICAgICAgZGlzcGxheTogbm9uZTtcbiAgICAgICAgICB9XG4gICAgXG4gICAgICAgICAgOmhvc3QoW2Rpcj1ydGxdKSB7XG4gICAgICAgICAgXG4gICAgICAgICAgfVxuICAgICAgICAgIFxuICAgICAgICAgIDpob3N0KFtkaXI9bHRyXSkge1xuICAgICAgICAgIFxuICAgICAgICAgIH1cbiAgICAgICAgICA8L3N0eWxlPlxuICAgICAgICAgIDxwPkRCVUlXZWJDb21wb25lbnRGb3JtSW5wdXRUZXh0PC9wPlxuICAgICAgICAgIDxkaXYgY29udGVudGVkaXRhYmxlPVwidHJ1ZVwiIHRhYmluZGV4PVwiMFwiPjwvZGl2PlxuICAgICAgICAgIDxkaXYgY29udGVudGVkaXRhYmxlPVwidHJ1ZVwiIHRhYmluZGV4PVwiMFwiPjwvZGl2PlxuICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIHRhYmluZGV4PVwiMFwiIC8+XG4gICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgdGFiaW5kZXg9XCIwXCIgLz5cbiAgICAgICAgYDtcbiAgICAgIH1cblxuICAgICAgc3RhdGljIGdldCBwcm9wZXJ0aWVzVG9EZWZpbmUoKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgcm9sZTogJ2Zvcm0taW5wdXQnXG4gICAgICAgIH07XG4gICAgICB9XG5cbiAgICAgIG9uTG9jYWxlQ2hhbmdlKGxvY2FsZSkge1xuICAgICAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgICAgICAgIC8qIGVzbGludCBuby1jb25zb2xlOiAwICovXG4gICAgICAgICAgLy8gY29uc29sZS5sb2coJ29uTG9jYWxlQ2hhbmdlJywgbG9jYWxlKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgfVxuXG4gICAgcmV0dXJuIFJlZ2lzdGVyYWJsZShcbiAgICAgIEZvY3VzYWJsZShcbiAgICAgICAgZGVmaW5lQ29tbW9uU3RhdGljTWV0aG9kcyhcbiAgICAgICAgICBEQlVJV2ViQ29tcG9uZW50Rm9ybUlucHV0VGV4dFxuICAgICAgICApXG4gICAgICApXG4gICAgKTtcblxuICB9KTtcbn1cblxuZ2V0REJVSVdlYkNvbXBvbmVudEZvcm1JbnB1dFRleHQucmVnaXN0cmF0aW9uTmFtZSA9IHJlZ2lzdHJhdGlvbk5hbWU7XG5cbiIsIlxuaW1wb3J0IGdldERCVUlXZWJDb21wb25lbnRDb3JlIGZyb20gJy4uL0RCVUlXZWJDb21wb25lbnRDb3JlL0RCVUlXZWJDb21wb25lbnRDb3JlJztcbmltcG9ydCBlbnN1cmVTaW5nbGVSZWdpc3RyYXRpb24gZnJvbSAnLi4vLi4vLi4vaW50ZXJuYWxzL2Vuc3VyZVNpbmdsZVJlZ2lzdHJhdGlvbic7XG5cbmNvbnN0IHJlZ2lzdHJhdGlvbk5hbWUgPSAnZGJ1aS13ZWItY29tcG9uZW50LWljb24nO1xuXG4vLyBodHRwczovL2dpdGh1Yi5jb20vZ29yYW5nYWppYy9yZWFjdC1pY29uLWJhc2UvYmxvYi9tYXN0ZXIvaW5kZXguanNcbi8vIGh0dHBzOi8vcmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbS9nb3JhbmdhamljL3JlYWN0LWljb25zL21hc3Rlci9pY29ucy9nby9tYXJrLWdpdGh1Yi5zdmdcbi8vIGh0dHBzOi8vZ2l0aHViLmNvbS9nb3JhbmdhamljL3JlYWN0LWljb25zXG4vLyBodHRwczovL2dpdGh1Yi5jb20vZ29yYW5nYWppYy9yZWFjdC1pY29ucy9ibG9iL21hc3Rlci9nby9tYXJrLWdpdGh1Yi5qc1xuLy8gaHR0cHM6Ly9nb3JhbmdhamljLmdpdGh1Yi5pby9yZWFjdC1pY29ucy9nby5odG1sXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGdldERCVUlXZWJDb21wb25lbnRJY29uKHdpbikge1xuICByZXR1cm4gZW5zdXJlU2luZ2xlUmVnaXN0cmF0aW9uKHdpbiwgcmVnaXN0cmF0aW9uTmFtZSwgKCkgPT4ge1xuICAgIGNvbnN0IHtcbiAgICAgIERCVUlXZWJDb21wb25lbnRCYXNlLFxuICAgICAgZGVmaW5lQ29tbW9uU3RhdGljTWV0aG9kcyxcbiAgICAgIFJlZ2lzdGVyYWJsZVxuICAgIH0gPSBnZXREQlVJV2ViQ29tcG9uZW50Q29yZSh3aW4pO1xuXG4gICAgY2xhc3MgREJVSVdlYkNvbXBvbmVudEljb24gZXh0ZW5kcyBEQlVJV2ViQ29tcG9uZW50QmFzZSB7XG5cbiAgICAgIHN0YXRpYyBnZXQgcmVnaXN0cmF0aW9uTmFtZSgpIHtcbiAgICAgICAgcmV0dXJuIHJlZ2lzdHJhdGlvbk5hbWU7XG4gICAgICB9XG5cbiAgICAgIHN0YXRpYyBnZXQgdGVtcGxhdGVJbm5lckhUTUwoKSB7XG4gICAgICAgIHJldHVybiBgXG4gICAgICAgICAgPHN0eWxlPlxuICAgICAgICAgIDpob3N0IHtcbiAgICAgICAgICAgIGFsbDogaW5pdGlhbDtcbiAgICAgICAgICAgIGZvbnQtc2l6ZTogaW5oZXJpdDsgXG4gICAgICAgICAgICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XG4gICAgICAgICAgICB3aWR0aDogMWVtO1xuICAgICAgICAgICAgaGVpZ2h0OiAxZW07XG4gICAgICAgICAgICB2ZXJ0aWNhbC1hbGlnbjogbWlkZGxlO1xuICAgICAgICAgICAgY29sb3I6IGluaGVyaXQ7XG4gICAgICAgICAgfVxuICAgICAgICAgIDpob3N0IHN2ZyB7XG4gICAgICAgICAgICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XG4gICAgICAgICAgICB3aWR0aDogMWVtO1xuICAgICAgICAgICAgaGVpZ2h0OiAxZW07XG4gICAgICAgICAgICB2ZXJ0aWNhbC1hbGlnbjogdG9wO1xuICAgICAgICAgICAgZmlsbDogY3VycmVudENvbG9yO1xuICAgICAgICAgIH1cbiAgICAgICAgICA8L3N0eWxlPlxuICAgICAgICAgIDxzdmcgdmlld0JveD1cIjAgMCA0MCA0MFwiICBwcmVzZXJ2ZUFzcGVjdFJhdGlvPVwieE1pZFlNaWQgbWVldFwiID5cbiAgICAgICAgICAgIDxnPjxwYXRoIGQ9XCJcIi8+PC9nPlxuICAgICAgICAgIDwvc3ZnPlxuICAgICAgICBgO1xuICAgICAgfVxuXG4gICAgICBzdGF0aWMgZ2V0IHByb3BlcnRpZXNUb1VwZ3JhZGUoKSB7XG4gICAgICAgIGNvbnN0IGluaGVyaXRlZFByb3BlcnRpZXNUb1VwZ3JhZGUgPSBzdXBlci5wcm9wZXJ0aWVzVG9VcGdyYWRlIHx8IFtdO1xuICAgICAgICByZXR1cm4gWy4uLmluaGVyaXRlZFByb3BlcnRpZXNUb1VwZ3JhZGUsICdzaGFwZSddO1xuICAgICAgfVxuXG4gICAgICBzdGF0aWMgZ2V0IG9ic2VydmVkQXR0cmlidXRlcygpIHtcbiAgICAgICAgY29uc3QgaW5oZXJpdGVkT2JzZXJ2ZWRBdHRyaWJ1dGVzID0gc3VwZXIub2JzZXJ2ZWRBdHRyaWJ1dGVzIHx8IFtdO1xuICAgICAgICByZXR1cm4gWy4uLmluaGVyaXRlZE9ic2VydmVkQXR0cmlidXRlcywgJ3NoYXBlJ107XG4gICAgICB9XG5cbiAgICAgIGdldCBzaGFwZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0QXR0cmlidXRlKCdzaGFwZScpO1xuICAgICAgfVxuXG4gICAgICBzZXQgc2hhcGUodmFsdWUpIHtcbiAgICAgICAgY29uc3QgaGFzVmFsdWUgPSAhW3VuZGVmaW5lZCwgbnVsbF0uaW5jbHVkZXModmFsdWUpO1xuICAgICAgICBjb25zdCBzdHJpbmdWYWx1ZSA9IFN0cmluZyh2YWx1ZSk7XG4gICAgICAgIGlmIChoYXNWYWx1ZSkge1xuICAgICAgICAgIHRoaXMuc2V0QXR0cmlidXRlKCdzaGFwZScsIHN0cmluZ1ZhbHVlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLnJlbW92ZUF0dHJpYnV0ZSgnc2hhcGUnKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBhdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2sobmFtZSwgb2xkVmFsdWUsIG5ld1ZhbHVlKSB7XG4gICAgICAgIHN1cGVyLmF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjayAmJlxuICAgICAgICAgIHN1cGVyLmF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjayhuYW1lLCBvbGRWYWx1ZSwgbmV3VmFsdWUpO1xuXG4gICAgICAgIGNvbnN0IGhhc1ZhbHVlID0gIVt1bmRlZmluZWQsIG51bGxdLmluY2x1ZGVzKG5ld1ZhbHVlKTtcbiAgICAgICAgaWYgKG5hbWUgPT09ICdzaGFwZScpIHtcbiAgICAgICAgICBoYXNWYWx1ZSA/IHRoaXMuX3NldFNoYXBlKCkgOiB0aGlzLl9yZW1vdmVTaGFwZSgpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIF9zZXRTaGFwZSgpIHtcbiAgICAgICAgY29uc3QgcGF0aCA9IHRoaXMuc2hhZG93Um9vdC5xdWVyeVNlbGVjdG9yKCdzdmcgZyBwYXRoJyk7XG4gICAgICAgIHBhdGguc2V0QXR0cmlidXRlKCdkJywgdGhpcy5zaGFwZSk7XG4gICAgICB9XG5cbiAgICAgIF9yZW1vdmVTaGFwZSgpIHtcbiAgICAgICAgY29uc3QgcGF0aCA9IHRoaXMuc2hhZG93Um9vdC5xdWVyeVNlbGVjdG9yKCdzdmcgZyBwYXRoJyk7XG4gICAgICAgIHBhdGguc2V0QXR0cmlidXRlKCdkJywgJycpO1xuICAgICAgfVxuXG4gICAgfVxuXG4gICAgcmV0dXJuIFJlZ2lzdGVyYWJsZShcbiAgICAgIGRlZmluZUNvbW1vblN0YXRpY01ldGhvZHMoXG4gICAgICAgIERCVUlXZWJDb21wb25lbnRJY29uXG4gICAgICApXG4gICAgKTtcblxuICB9KTtcbn1cblxuZ2V0REJVSVdlYkNvbXBvbmVudEljb24ucmVnaXN0cmF0aW9uTmFtZSA9IHJlZ2lzdHJhdGlvbk5hbWU7XG5cbiIsImltcG9ydCBhcHBlbmRTdHlsZXMgZnJvbSAnLi4vLi4vaW50ZXJuYWxzL2FwcGVuZFN0eWxlcyc7XG5cbi8qKlxuKiBAcGFyYW0gY29tcG9uZW50cyBBcnJheTxPYmplY3Q+IFt7XG4qICByZWdpc3RyYXRpb25OYW1lLFxuKiAgY29tcG9uZW50U3R5bGUsXG4qICAuLi5cbiogfV1cbiogQHJldHVybnMgY29tcG9uZW50cyBBcnJheTxPYmplY3Q+XG4qL1xuY29uc3QgZGJ1aVdlYkNvbXBvbmVudHNTZXRVcCA9ICh3aW4pID0+IChjb21wb25lbnRzKSA9PiB7XG4gIHJldHVybiBhcHBlbmRTdHlsZXMod2luKShjb21wb25lbnRzKTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGRidWlXZWJDb21wb25lbnRzU2V0VXA7XG4iLCJcbi8vIEhlbHBlcnNcbmltcG9ydCBkYnVpV2ViQ29tcG9uZW50c1NldFVwIGZyb20gJy4vd2ViLWNvbXBvbmVudHMvaGVscGVycy9kYnVpV2ViQ29tcG9uZW50c1NldHVwJztcblxuLy8gSW50ZXJuYWxzXG5pbXBvcnQgZW5zdXJlU2luZ2xlUmVnaXN0cmF0aW9uIGZyb20gJy4vaW50ZXJuYWxzL2Vuc3VyZVNpbmdsZVJlZ2lzdHJhdGlvbic7XG5cbi8vIENvbXBvbmVudEJhc2VcbmltcG9ydCBnZXREQlVJV2ViQ29tcG9uZW50Q29yZSBmcm9tICcuL3dlYi1jb21wb25lbnRzL2NvbXBvbmVudHMvREJVSVdlYkNvbXBvbmVudENvcmUvREJVSVdlYkNvbXBvbmVudENvcmUnO1xuXG4vLyBCZWhhdmlvdXJzXG5pbXBvcnQgRm9jdXNhYmxlIGZyb20gJy4vd2ViLWNvbXBvbmVudHMvYmVoYXZpb3Vycy9Gb2N1c2FibGUnO1xuXG4vLyBTZXJ2aWNlc1xuaW1wb3J0IGdldERCVUlMb2NhbGVTZXJ2aWNlIGZyb20gJy4vc2VydmljZXMvREJVSUxvY2FsZVNlcnZpY2UnO1xuaW1wb3J0IGdldERCVUlJMThuU2VydmljZSBmcm9tICcuL3NlcnZpY2VzL0RCVUlJMThuU2VydmljZSc7XG5cbi8vIFV0aWxzXG5pbXBvcnQgZm9ybWF0dGVycyBmcm9tICcuL3V0aWxzL2Zvcm1hdHRlcnMnO1xuaW1wb3J0IHRyYWl0cyBmcm9tICcuL3V0aWxzL3RyYWl0cyc7XG5pbXBvcnQgdGVtcGxhdGUgZnJvbSAnLi91dGlscy90ZW1wbGF0ZSc7XG5pbXBvcnQgb25TY3JlZW5Db25zb2xlIGZyb20gJy4vdXRpbHMvb25TY3JlZW5Db25zb2xlJztcblxuLy8gQ29tcG9uZW50c1xuaW1wb3J0IGdldERCVUlXZWJDb21wb25lbnREdW1teSBmcm9tICcuL3dlYi1jb21wb25lbnRzL2NvbXBvbmVudHMvREJVSVdlYkNvbXBvbmVudER1bW15L0RCVUlXZWJDb21wb25lbnREdW1teSc7XG5pbXBvcnQgZ2V0REJVSVdlYkNvbXBvbmVudER1bW15UGFyZW50IGZyb20gJy4vd2ViLWNvbXBvbmVudHMvY29tcG9uZW50cy9EQlVJV2ViQ29tcG9uZW50RHVtbXlQYXJlbnQvREJVSVdlYkNvbXBvbmVudER1bW15UGFyZW50JztcbmltcG9ydCBnZXREQlVJV2ViQ29tcG9uZW50Rm9ybUlucHV0VGV4dCBmcm9tICcuL3dlYi1jb21wb25lbnRzL2NvbXBvbmVudHMvREJVSVdlYkNvbXBvbmVudEZvcm1JbnB1dFRleHQvREJVSVdlYkNvbXBvbmVudEZvcm1JbnB1dFRleHQnO1xuaW1wb3J0IGdldERCVUlXZWJDb21wb25lbnRJY29uIGZyb20gJy4vd2ViLWNvbXBvbmVudHMvY29tcG9uZW50cy9EQlVJV2ViQ29tcG9uZW50SWNvbi9EQlVJV2ViQ29tcG9uZW50SWNvbic7XG5cbmNvbnN0IHJlZ2lzdHJhdGlvbnMgPSB7XG4gIFtnZXREQlVJV2ViQ29tcG9uZW50RHVtbXkucmVnaXN0cmF0aW9uTmFtZV06XG4gICAgZ2V0REJVSVdlYkNvbXBvbmVudER1bW15LFxuICBbZ2V0REJVSVdlYkNvbXBvbmVudER1bW15UGFyZW50LnJlZ2lzdHJhdGlvbk5hbWVdOlxuICAgIGdldERCVUlXZWJDb21wb25lbnREdW1teVBhcmVudCxcbiAgW2dldERCVUlXZWJDb21wb25lbnRGb3JtSW5wdXRUZXh0LnJlZ2lzdHJhdGlvbk5hbWVdOlxuICAgIGdldERCVUlXZWJDb21wb25lbnRGb3JtSW5wdXRUZXh0LFxuICBbZ2V0REJVSVdlYkNvbXBvbmVudEljb24ucmVnaXN0cmF0aW9uTmFtZV06XG4gICAgZ2V0REJVSVdlYkNvbXBvbmVudEljb25cbn07XG5cbi8qXG5UaGlzIGhlbHBlciBmdW5jdGlvbiBpcyBqdXN0IGZvciBjb252ZW5pZW5jZS5cblVzaW5nIGl0IGltcGxpZXMgdGhhdCBlbnRpcmUgREJVSVdlYkNvbXBvbmVudHMgbGlicmFyeSBpcyBhbHJlYWR5IGxvYWRlZC5cbkl0IGlzIHVzZWZ1bCBlc3BlY2lhbGx5IHdoZW4gd29ya2luZyB3aXRoIGRpc3RyaWJ1dGlvbiBidWlsZC5cbklmIG9uZSB3YW50cyB0byBsb2FkIGp1c3Qgb25lIHdlYi1jb21wb25lbnQgb3IgYSBzdWJzZXQgb2YgY29yZVxudGhleSBzaG91bGQgYmUgbG9hZGVkIGZyb20gbm9kZV9tb2R1bGVzL2Rldi1ib3gtdWkvY29yZSBieSB0aGVpciBwYXRoXG5leDpcbmltcG9ydCBTb21lQ29tcG9uZW50TG9hZGVyIGZyb20gbm9kZV9tb2R1bGVzL2Rldi1ib3gtdWkvY29yZS9wYXRoL3RvL1NvbWVDb21wb25lbnQ7XG4qL1xuZnVuY3Rpb24gcXVpY2tTZXR1cEFuZExvYWQod2luID0gd2luZG93KSB7XG4gIC8qKlxuICAgKiBAcGFyYW0gY29tcG9uZW50cyBPYmplY3Qge1xuICAgKiAgcmVnaXN0cmF0aW9uTmFtZSxcbiAgICogIGNvbXBvbmVudFN0eWxlXG4gICAqIH1cbiAgICogQHJldHVybiBPYmplY3QgeyA8cmVnaXN0cmF0aW9uTmFtZT4sIDxjb21wb25lbnRDbGFzcz4gfVxuICAgKi9cbiAgcmV0dXJuIGZ1bmN0aW9uIChjb21wb25lbnRzKSB7XG4gICAgcmV0dXJuIGRidWlXZWJDb21wb25lbnRzU2V0VXAod2luKShjb21wb25lbnRzKVxuICAgICAgLnJlZHVjZSgoYWNjLCB7IHJlZ2lzdHJhdGlvbk5hbWUgfSkgPT4ge1xuICAgICAgICBjb25zdCBjb21wb25lbnRDbGFzcyA9IHJlZ2lzdHJhdGlvbnNbcmVnaXN0cmF0aW9uTmFtZV0od2luZG93KTtcbiAgICAgICAgY29tcG9uZW50Q2xhc3MucmVnaXN0ZXJTZWxmKCk7XG4gICAgICAgIGFjY1tyZWdpc3RyYXRpb25OYW1lXSA9IGNvbXBvbmVudENsYXNzO1xuICAgICAgICByZXR1cm4gYWNjO1xuICAgICAgfSwge30pO1xuICB9O1xufVxuXG5leHBvcnQge1xuICByZWdpc3RyYXRpb25zLFxuXG4gIC8vIEhlbHBlcnNcbiAgcXVpY2tTZXR1cEFuZExvYWQsXG4gIGRidWlXZWJDb21wb25lbnRzU2V0VXAsXG5cbiAgLy8gSW50ZXJuYWxzXG4gIGVuc3VyZVNpbmdsZVJlZ2lzdHJhdGlvbixcblxuICAvLyBDb21wb25lbnRDb3JlXG4gIGdldERCVUlXZWJDb21wb25lbnRDb3JlLFxuXG4gIC8vIEJlaGF2aW91cnNcbiAgRm9jdXNhYmxlLFxuXG4gIC8vIFNlcnZpY2VzXG4gIGdldERCVUlMb2NhbGVTZXJ2aWNlLFxuICBnZXREQlVJSTE4blNlcnZpY2UsXG5cbiAgLy8gVXRpbHNcbiAgZm9ybWF0dGVycyxcbiAgdHJhaXRzLFxuICB0ZW1wbGF0ZSxcbiAgb25TY3JlZW5Db25zb2xlLFxuXG4gIC8vIENvbXBvbmVudHNcbiAgZ2V0REJVSVdlYkNvbXBvbmVudER1bW15LFxuICBnZXREQlVJV2ViQ29tcG9uZW50RHVtbXlQYXJlbnQsXG4gIGdldERCVUlXZWJDb21wb25lbnRGb3JtSW5wdXRUZXh0LFxuICBnZXREQlVJV2ViQ29tcG9uZW50SWNvblxufTtcblxuLyogZXNsaW50IG5vLWNvbnNvbGU6IDAgKi9cblxubGV0IGJ1aWxkID0gJ3Byb2R1Y3Rpb24nO1xuXG5pZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICBidWlsZCA9ICdkZXZlbG9wJztcbn1cblxuY29uc29sZS5sb2coYFVzaW5nIERCVUlXZWJDb21wb25lbnRzRGlzdExpYiAke2J1aWxkfSBidWlsZC5gKTtcblxuIl19
