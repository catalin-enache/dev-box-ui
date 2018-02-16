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
      return this.childrenTree.querySelectorAll('[tabindex]') || [];
    }

    get _firstInnerFocusable() {
      return this.childrenTree.querySelector('[tabindex]');
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
const CHANNEL_INTERNAL = 'Internal';
const MESSAGE_ANCESTORS_CHAIN_CONNECTED = 'ANCESTORS_CHAIN_CONNECTED';

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

      static get useShadow() {
        return true;
      }

      static get propertiesToUpgrade() {
        return [];
      }

      static get propertiesToDefine() {
        return { 'dbui-web-component': '' };
      }

      // web components standard API
      static get observedAttributes() {
        return [];
      }

      constructor(...args) {
        super();

        const { useShadow } = this.constructor;
        if (useShadow) {
          this.attachShadow({
            mode: 'open'
            // delegatesFocus: true
            // Not working on IPad so we do an workaround
            // by setting "focused" attribute when needed.
          });
        }
        this._isConnected = false;
        this._ancestorsConnected = false;
        this._insertTemplate();

        this.connectedCallback = this.connectedCallback.bind(this);
        this.disconnectedCallback = this.disconnectedCallback.bind(this);
        this._handleLocaleChange = this._handleLocaleChange.bind(this);
        this.onLocaleChange = this.onLocaleChange.bind(this);
        this.unregisterLocaleChange = null;

        // provide support for traits if any as they cant override constructor
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
        if (!this.hasAttribute(key)) {
          this.setAttribute(key, value);
        }
      }

      // web components standard API
      connectedCallback() {
        this._isConnected = true;
        window.addEventListener('beforeunload', this.disconnectedCallback, false);
        this.unregisterLocaleChange = LocaleService.onLocaleChange(this._handleLocaleChange);
        const { propertiesToUpgrade, propertiesToDefine } = this.constructor;
        propertiesToUpgrade.forEach(property => {
          this._upgradeProperty(property);
        });
        Object.keys(propertiesToDefine).forEach(property => {
          this._defineProperty(property, propertiesToDefine[property]);
        });
        // if in light dom notify descendants that ancestor chain is connected
        if (!this.dbuiParentHost) {
          this.sendMessageToChildren({
            channel: CHANNEL_INTERNAL,
            message: MESSAGE_ANCESTORS_CHAIN_CONNECTED
          });
        }
      }

      // web components standard API
      disconnectedCallback() {
        this._isConnected = false;
        this.unregisterLocaleChange();
        window.removeEventListener('beforeunload', this.disconnectedCallback, false);
      }

      // web components standard API
      attributeChangedCallback() {
        // no op
      }

      onLocaleChange() {
        // no op
      }

      get ancestorsConnected() {
        return this._ancestorsConnected;
      }

      get dbuiChildren() {
        return this.childrenTree.querySelectorAll('[dbui-web-component]');
      }

      get dbuiParentHost() {
        return this.getRootNode().host;
      }

      createMessage({
        channel, message, data, rememberNodesPath, targetType
      } = {}) {
        const messageInst = new _DBUIWebComponentMessage2.default({
          channel,
          message,
          data,
          source: this,
          rememberNodesPath,
          metadata: {
            targetType
          }
        });
        // will be ignored if rememberNodesPath was false at message creation
        messageInst.appendVisitedNode(this);
        return messageInst;
      }

      sendMessage(messageInst) {
        const { targetType } = messageInst.metadata;
        if (targetType === PARENT_TARGET_TYPE) {
          const dbuiParentHost = this.dbuiParentHost;
          if (dbuiParentHost) {
            dbuiParentHost._propagateMessage(messageInst.cloneOrInstance);
          }
        } else if (targetType === CHILDREN_TARGET_TYPE) {
          const dbuChildren = this.dbuiChildren;
          dbuChildren.forEach(child => {
            child._propagateMessage(messageInst.cloneOrInstance);
          });
        }
      }

      _propagateMessage(messageInst) {
        // Will be ignored if rememberNodesPath was false at message creation
        messageInst.appendVisitedNode(this);
        // Inside onMessageReceived there is a chance that
        // message#stopPropagation has been called.
        this.onMessageReceived(messageInst);
        if (messageInst.shouldPropagate) {
          this.sendMessage(messageInst);
        }
      }

      onMessageReceived(messageInst) {
        // console.log(this.id, 'isConnected', this.isConnected, `received message ${messageInst.message}`, 'path', JSON.stringify(messageInst.visitedNodes.map((node) => node.id)), 'source', messageInst.source.id);
        const { channel } = messageInst;
        this[`on${channel}Message`] && this[`on${channel}Message`](messageInst);
      }

      [`on${CHANNEL_INTERNAL}Message`](messageInst) {
        const { message } = messageInst;
        message === MESSAGE_ANCESTORS_CHAIN_CONNECTED && this.onAncestorsChainConnected(messageInst);
      }

      onAncestorsChainConnected(messageInst) {
        this._ancestorsConnected = true;
        // console.log(this.id, 'isConnected', this.isConnected, 'onAncestorsChainConnected', messageInst.source.id);
      }

      sendMessageToParent({ channel, message, data, rememberNodesPath }) {
        this.sendMessage(this.createMessage({
          channel,
          message,
          data,
          rememberNodesPath,
          targetType: PARENT_TARGET_TYPE
        }));
      }

      sendMessageToChildren({ channel, message, data, rememberNodesPath }) {
        this.sendMessage(this.createMessage({
          channel,
          message,
          data,
          rememberNodesPath,
          targetType: CHILDREN_TARGET_TYPE
        }));
      }

      get isConnected() {
        return this._isConnected;
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
        this.setAttribute('dir', locale.dir);
        this.setAttribute('lang', locale.lang);
        this.onLocaleChange(locale);
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
    channel, message, data, source, rememberNodesPath, metadata
  }) {
    this._channel = channel;
    this._message = message;
    this._data = data;
    this._source = source; // instance of node creating the message
    this._rememberNodesPath = rememberNodesPath;
    // can contain fields like targetType: children | parent or whatever else
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
        const path = this.childrenTree.querySelector('svg g path');
        path.setAttribute('d', this.shape);
      }

      _removeShape() {
        const path = this.childrenTree.querySelector('svg g path');
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvcHJvY2Vzcy9icm93c2VyLmpzIiwic3JjL2xpYi9jb3JlL2ludGVybmFscy9hcHBlbmRTdHlsZXMuanMiLCJzcmMvbGliL2NvcmUvaW50ZXJuYWxzL2Vuc3VyZVNpbmdsZVJlZ2lzdHJhdGlvbi5qcyIsInNyYy9saWIvY29yZS9zZXJ2aWNlcy9EQlVJSTE4blNlcnZpY2UuanMiLCJzcmMvbGliL2NvcmUvc2VydmljZXMvREJVSUxvY2FsZVNlcnZpY2UuanMiLCJzcmMvbGliL2NvcmUvdXRpbHMvZm9ybWF0dGVycy5qcyIsInNyYy9saWIvY29yZS91dGlscy9vblNjcmVlbkNvbnNvbGUuanMiLCJzcmMvbGliL2NvcmUvdXRpbHMvdGVtcGxhdGUuanMiLCJzcmMvbGliL2NvcmUvdXRpbHMvdHJhaXRzLmpzIiwic3JjL2xpYi9jb3JlL3dlYi1jb21wb25lbnRzL2JlaGF2aW91cnMvRm9jdXNhYmxlLmpzIiwic3JjL2xpYi9jb3JlL3dlYi1jb21wb25lbnRzL2NvbXBvbmVudHMvREJVSVdlYkNvbXBvbmVudENvcmUvREJVSUNvbW1vbkNzc1ZhcnMuanMiLCJzcmMvbGliL2NvcmUvd2ViLWNvbXBvbmVudHMvY29tcG9uZW50cy9EQlVJV2ViQ29tcG9uZW50Q29yZS9EQlVJV2ViQ29tcG9uZW50Q29yZS5qcyIsInNyYy9saWIvY29yZS93ZWItY29tcG9uZW50cy9jb21wb25lbnRzL0RCVUlXZWJDb21wb25lbnRDb3JlL0RCVUlXZWJDb21wb25lbnRNZXNzYWdlLmpzIiwic3JjL2xpYi9jb3JlL3dlYi1jb21wb25lbnRzL2NvbXBvbmVudHMvREJVSVdlYkNvbXBvbmVudER1bW15L0RCVUlXZWJDb21wb25lbnREdW1teS5qcyIsInNyYy9saWIvY29yZS93ZWItY29tcG9uZW50cy9jb21wb25lbnRzL0RCVUlXZWJDb21wb25lbnREdW1teVBhcmVudC9EQlVJV2ViQ29tcG9uZW50RHVtbXlQYXJlbnQuanMiLCJzcmMvbGliL2NvcmUvd2ViLWNvbXBvbmVudHMvY29tcG9uZW50cy9EQlVJV2ViQ29tcG9uZW50Rm9ybUlucHV0VGV4dC9EQlVJV2ViQ29tcG9uZW50Rm9ybUlucHV0VGV4dC5qcyIsInNyYy9saWIvY29yZS93ZWItY29tcG9uZW50cy9jb21wb25lbnRzL0RCVUlXZWJDb21wb25lbnRJY29uL0RCVUlXZWJDb21wb25lbnRJY29uLmpzIiwic3JjL2xpYi9jb3JlL3dlYi1jb21wb25lbnRzL2hlbHBlcnMvZGJ1aVdlYkNvbXBvbmVudHNTZXR1cC5qcyIsInNyYy9saWIvc3JjL2xpYi9jb3JlL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtB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K0IsZ0JBQWhDLHdDQUhvQjtBQUtwQixHQUFDLHdDQUFpQyxnQkFBbEMsMENBTG9CO0FBT3BCLEdBQUMsK0JBQXdCLGdCQUF6QjtBQVBvQixDQUF0Qjs7QUFXQTs7Ozs7Ozs7Ozs7QUE5QkE7OztBQU5BO0FBNkNBLFNBQVMsaUJBQVQsQ0FBMkIsTUFBTSxNQUFqQyxFQUF5QztBQUN2Qzs7Ozs7OztBQU9BLFNBQU8sVUFBVSxVQUFWLEVBQXNCO0FBQzNCLFdBQU8sc0NBQXVCLEdBQXZCLEVBQTRCLFVBQTVCLEVBQ0osTUFESSxDQUNHLENBQUMsR0FBRCxFQUFNLEVBQUUsZ0JBQUYsRUFBTixLQUErQjtBQUNyQyxZQUFNLGlCQUFpQixjQUFjLGdCQUFkLEVBQWdDLE1BQWhDLENBQXZCO0FBQ0EscUJBQWUsWUFBZjtBQUNBLFVBQUksZ0JBQUosSUFBd0IsY0FBeEI7QUFDQSxhQUFPLEdBQVA7QUFDRCxLQU5JLEVBTUYsRUFORSxDQUFQO0FBT0QsR0FSRDtBQVNEOztRQUdDLGEsR0FBQSxhO1FBR0EsaUIsR0FBQSxpQjtRQUNBLHNCO1FBR0Esd0I7UUFHQSx1QjtRQUdBLFM7UUFHQSxvQjtRQUNBLGtCO1FBR0EsVTtRQUNBLE07UUFDQSxRO1FBQ0EsZTtRQUdBLHdCO1FBQ0EsOEI7UUFDQSxnQztRQUNBLHVCOztBQUdGOztBQUVBLElBQUksUUFBUSxZQUFaOztBQUVBLElBQUksUUFBUSxHQUFSLENBQVksUUFBWixLQUF5QixZQUE3QixFQUEyQztBQUN6QyxVQUFRLFNBQVI7QUFDRDs7QUFFRCxRQUFRLEdBQVIsQ0FBYSxrQ0FBaUMsS0FBTSxTQUFwRCIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvLyBzaGltIGZvciB1c2luZyBwcm9jZXNzIGluIGJyb3dzZXJcbnZhciBwcm9jZXNzID0gbW9kdWxlLmV4cG9ydHMgPSB7fTtcblxuLy8gY2FjaGVkIGZyb20gd2hhdGV2ZXIgZ2xvYmFsIGlzIHByZXNlbnQgc28gdGhhdCB0ZXN0IHJ1bm5lcnMgdGhhdCBzdHViIGl0XG4vLyBkb24ndCBicmVhayB0aGluZ3MuICBCdXQgd2UgbmVlZCB0byB3cmFwIGl0IGluIGEgdHJ5IGNhdGNoIGluIGNhc2UgaXQgaXNcbi8vIHdyYXBwZWQgaW4gc3RyaWN0IG1vZGUgY29kZSB3aGljaCBkb2Vzbid0IGRlZmluZSBhbnkgZ2xvYmFscy4gIEl0J3MgaW5zaWRlIGFcbi8vIGZ1bmN0aW9uIGJlY2F1c2UgdHJ5L2NhdGNoZXMgZGVvcHRpbWl6ZSBpbiBjZXJ0YWluIGVuZ2luZXMuXG5cbnZhciBjYWNoZWRTZXRUaW1lb3V0O1xudmFyIGNhY2hlZENsZWFyVGltZW91dDtcblxuZnVuY3Rpb24gZGVmYXVsdFNldFRpbW91dCgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3NldFRpbWVvdXQgaGFzIG5vdCBiZWVuIGRlZmluZWQnKTtcbn1cbmZ1bmN0aW9uIGRlZmF1bHRDbGVhclRpbWVvdXQgKCkge1xuICAgIHRocm93IG5ldyBFcnJvcignY2xlYXJUaW1lb3V0IGhhcyBub3QgYmVlbiBkZWZpbmVkJyk7XG59XG4oZnVuY3Rpb24gKCkge1xuICAgIHRyeSB7XG4gICAgICAgIGlmICh0eXBlb2Ygc2V0VGltZW91dCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IHNldFRpbWVvdXQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gZGVmYXVsdFNldFRpbW91dDtcbiAgICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IGRlZmF1bHRTZXRUaW1vdXQ7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIGlmICh0eXBlb2YgY2xlYXJUaW1lb3V0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBjbGVhclRpbWVvdXQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBkZWZhdWx0Q2xlYXJUaW1lb3V0O1xuICAgICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBkZWZhdWx0Q2xlYXJUaW1lb3V0O1xuICAgIH1cbn0gKCkpXG5mdW5jdGlvbiBydW5UaW1lb3V0KGZ1bikge1xuICAgIGlmIChjYWNoZWRTZXRUaW1lb3V0ID09PSBzZXRUaW1lb3V0KSB7XG4gICAgICAgIC8vbm9ybWFsIGVudmlyb21lbnRzIGluIHNhbmUgc2l0dWF0aW9uc1xuICAgICAgICByZXR1cm4gc2V0VGltZW91dChmdW4sIDApO1xuICAgIH1cbiAgICAvLyBpZiBzZXRUaW1lb3V0IHdhc24ndCBhdmFpbGFibGUgYnV0IHdhcyBsYXR0ZXIgZGVmaW5lZFxuICAgIGlmICgoY2FjaGVkU2V0VGltZW91dCA9PT0gZGVmYXVsdFNldFRpbW91dCB8fCAhY2FjaGVkU2V0VGltZW91dCkgJiYgc2V0VGltZW91dCkge1xuICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gc2V0VGltZW91dDtcbiAgICAgICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgLy8gd2hlbiB3aGVuIHNvbWVib2R5IGhhcyBzY3Jld2VkIHdpdGggc2V0VGltZW91dCBidXQgbm8gSS5FLiBtYWRkbmVzc1xuICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dChmdW4sIDApO1xuICAgIH0gY2F0Y2goZSl7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvLyBXaGVuIHdlIGFyZSBpbiBJLkUuIGJ1dCB0aGUgc2NyaXB0IGhhcyBiZWVuIGV2YWxlZCBzbyBJLkUuIGRvZXNuJ3QgdHJ1c3QgdGhlIGdsb2JhbCBvYmplY3Qgd2hlbiBjYWxsZWQgbm9ybWFsbHlcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0LmNhbGwobnVsbCwgZnVuLCAwKTtcbiAgICAgICAgfSBjYXRjaChlKXtcbiAgICAgICAgICAgIC8vIHNhbWUgYXMgYWJvdmUgYnV0IHdoZW4gaXQncyBhIHZlcnNpb24gb2YgSS5FLiB0aGF0IG11c3QgaGF2ZSB0aGUgZ2xvYmFsIG9iamVjdCBmb3IgJ3RoaXMnLCBob3BmdWxseSBvdXIgY29udGV4dCBjb3JyZWN0IG90aGVyd2lzZSBpdCB3aWxsIHRocm93IGEgZ2xvYmFsIGVycm9yXG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dC5jYWxsKHRoaXMsIGZ1biwgMCk7XG4gICAgICAgIH1cbiAgICB9XG5cblxufVxuZnVuY3Rpb24gcnVuQ2xlYXJUaW1lb3V0KG1hcmtlcikge1xuICAgIGlmIChjYWNoZWRDbGVhclRpbWVvdXQgPT09IGNsZWFyVGltZW91dCkge1xuICAgICAgICAvL25vcm1hbCBlbnZpcm9tZW50cyBpbiBzYW5lIHNpdHVhdGlvbnNcbiAgICAgICAgcmV0dXJuIGNsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH1cbiAgICAvLyBpZiBjbGVhclRpbWVvdXQgd2Fzbid0IGF2YWlsYWJsZSBidXQgd2FzIGxhdHRlciBkZWZpbmVkXG4gICAgaWYgKChjYWNoZWRDbGVhclRpbWVvdXQgPT09IGRlZmF1bHRDbGVhclRpbWVvdXQgfHwgIWNhY2hlZENsZWFyVGltZW91dCkgJiYgY2xlYXJUaW1lb3V0KSB7XG4gICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGNsZWFyVGltZW91dDtcbiAgICAgICAgcmV0dXJuIGNsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICAvLyB3aGVuIHdoZW4gc29tZWJvZHkgaGFzIHNjcmV3ZWQgd2l0aCBzZXRUaW1lb3V0IGJ1dCBubyBJLkUuIG1hZGRuZXNzXG4gICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9IGNhdGNoIChlKXtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIC8vIFdoZW4gd2UgYXJlIGluIEkuRS4gYnV0IHRoZSBzY3JpcHQgaGFzIGJlZW4gZXZhbGVkIHNvIEkuRS4gZG9lc24ndCAgdHJ1c3QgdGhlIGdsb2JhbCBvYmplY3Qgd2hlbiBjYWxsZWQgbm9ybWFsbHlcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQuY2FsbChudWxsLCBtYXJrZXIpO1xuICAgICAgICB9IGNhdGNoIChlKXtcbiAgICAgICAgICAgIC8vIHNhbWUgYXMgYWJvdmUgYnV0IHdoZW4gaXQncyBhIHZlcnNpb24gb2YgSS5FLiB0aGF0IG11c3QgaGF2ZSB0aGUgZ2xvYmFsIG9iamVjdCBmb3IgJ3RoaXMnLCBob3BmdWxseSBvdXIgY29udGV4dCBjb3JyZWN0IG90aGVyd2lzZSBpdCB3aWxsIHRocm93IGEgZ2xvYmFsIGVycm9yLlxuICAgICAgICAgICAgLy8gU29tZSB2ZXJzaW9ucyBvZiBJLkUuIGhhdmUgZGlmZmVyZW50IHJ1bGVzIGZvciBjbGVhclRpbWVvdXQgdnMgc2V0VGltZW91dFxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dC5jYWxsKHRoaXMsIG1hcmtlcik7XG4gICAgICAgIH1cbiAgICB9XG5cblxuXG59XG52YXIgcXVldWUgPSBbXTtcbnZhciBkcmFpbmluZyA9IGZhbHNlO1xudmFyIGN1cnJlbnRRdWV1ZTtcbnZhciBxdWV1ZUluZGV4ID0gLTE7XG5cbmZ1bmN0aW9uIGNsZWFuVXBOZXh0VGljaygpIHtcbiAgICBpZiAoIWRyYWluaW5nIHx8ICFjdXJyZW50UXVldWUpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBkcmFpbmluZyA9IGZhbHNlO1xuICAgIGlmIChjdXJyZW50UXVldWUubGVuZ3RoKSB7XG4gICAgICAgIHF1ZXVlID0gY3VycmVudFF1ZXVlLmNvbmNhdChxdWV1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcXVldWVJbmRleCA9IC0xO1xuICAgIH1cbiAgICBpZiAocXVldWUubGVuZ3RoKSB7XG4gICAgICAgIGRyYWluUXVldWUoKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGRyYWluUXVldWUoKSB7XG4gICAgaWYgKGRyYWluaW5nKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdmFyIHRpbWVvdXQgPSBydW5UaW1lb3V0KGNsZWFuVXBOZXh0VGljayk7XG4gICAgZHJhaW5pbmcgPSB0cnVlO1xuXG4gICAgdmFyIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB3aGlsZShsZW4pIHtcbiAgICAgICAgY3VycmVudFF1ZXVlID0gcXVldWU7XG4gICAgICAgIHF1ZXVlID0gW107XG4gICAgICAgIHdoaWxlICgrK3F1ZXVlSW5kZXggPCBsZW4pIHtcbiAgICAgICAgICAgIGlmIChjdXJyZW50UXVldWUpIHtcbiAgICAgICAgICAgICAgICBjdXJyZW50UXVldWVbcXVldWVJbmRleF0ucnVuKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcXVldWVJbmRleCA9IC0xO1xuICAgICAgICBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgfVxuICAgIGN1cnJlbnRRdWV1ZSA9IG51bGw7XG4gICAgZHJhaW5pbmcgPSBmYWxzZTtcbiAgICBydW5DbGVhclRpbWVvdXQodGltZW91dCk7XG59XG5cbnByb2Nlc3MubmV4dFRpY2sgPSBmdW5jdGlvbiAoZnVuKSB7XG4gICAgdmFyIGFyZ3MgPSBuZXcgQXJyYXkoYXJndW1lbnRzLmxlbmd0aCAtIDEpO1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSkge1xuICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgYXJnc1tpIC0gMV0gPSBhcmd1bWVudHNbaV07XG4gICAgICAgIH1cbiAgICB9XG4gICAgcXVldWUucHVzaChuZXcgSXRlbShmdW4sIGFyZ3MpKTtcbiAgICBpZiAocXVldWUubGVuZ3RoID09PSAxICYmICFkcmFpbmluZykge1xuICAgICAgICBydW5UaW1lb3V0KGRyYWluUXVldWUpO1xuICAgIH1cbn07XG5cbi8vIHY4IGxpa2VzIHByZWRpY3RpYmxlIG9iamVjdHNcbmZ1bmN0aW9uIEl0ZW0oZnVuLCBhcnJheSkge1xuICAgIHRoaXMuZnVuID0gZnVuO1xuICAgIHRoaXMuYXJyYXkgPSBhcnJheTtcbn1cbkl0ZW0ucHJvdG90eXBlLnJ1biA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmZ1bi5hcHBseShudWxsLCB0aGlzLmFycmF5KTtcbn07XG5wcm9jZXNzLnRpdGxlID0gJ2Jyb3dzZXInO1xucHJvY2Vzcy5icm93c2VyID0gdHJ1ZTtcbnByb2Nlc3MuZW52ID0ge307XG5wcm9jZXNzLmFyZ3YgPSBbXTtcbnByb2Nlc3MudmVyc2lvbiA9ICcnOyAvLyBlbXB0eSBzdHJpbmcgdG8gYXZvaWQgcmVnZXhwIGlzc3Vlc1xucHJvY2Vzcy52ZXJzaW9ucyA9IHt9O1xuXG5mdW5jdGlvbiBub29wKCkge31cblxucHJvY2Vzcy5vbiA9IG5vb3A7XG5wcm9jZXNzLmFkZExpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3Mub25jZSA9IG5vb3A7XG5wcm9jZXNzLm9mZiA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUxpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlQWxsTGlzdGVuZXJzID0gbm9vcDtcbnByb2Nlc3MuZW1pdCA9IG5vb3A7XG5wcm9jZXNzLnByZXBlbmRMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLnByZXBlbmRPbmNlTGlzdGVuZXIgPSBub29wO1xuXG5wcm9jZXNzLmxpc3RlbmVycyA9IGZ1bmN0aW9uIChuYW1lKSB7IHJldHVybiBbXSB9XG5cbnByb2Nlc3MuYmluZGluZyA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmJpbmRpbmcgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcblxucHJvY2Vzcy5jd2QgPSBmdW5jdGlvbiAoKSB7IHJldHVybiAnLycgfTtcbnByb2Nlc3MuY2hkaXIgPSBmdW5jdGlvbiAoZGlyKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmNoZGlyIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5wcm9jZXNzLnVtYXNrID0gZnVuY3Rpb24oKSB7IHJldHVybiAwOyB9O1xuIiwiLypcbkRCVUlXZWJDb21wb25lbnRCYXNlIChmcm9tIHdoaWNoIGFsbCB3ZWItY29tcG9uZW50cyBpbmhlcml0KVxud2lsbCByZWFkIGNvbXBvbmVudFN0eWxlIGZyb20gd2luLkRCVUlXZWJDb21wb25lbnRzXG53aGVuIGtsYXNzLnJlZ2lzdGVyU2VsZigpIGlzIGNhbGxlZCBnaXZpbmcgYSBjaGFuY2UgdG8gb3ZlcnJpZGUgZGVmYXVsdCB3ZWItY29tcG9uZW50IHN0eWxlXG5qdXN0IGJlZm9yZSBpdCBpcyByZWdpc3RlcmVkLlxuKi9cbmNvbnN0IGFwcGVuZFN0eWxlID0gKHdpbikgPT4gKHJlZ2lzdHJhdGlvbk5hbWUsIGNvbXBvbmVudFN0eWxlKSA9PiB7XG4gIGlmICghd2luLkRCVUlXZWJDb21wb25lbnRzKSB7XG4gICAgd2luLkRCVUlXZWJDb21wb25lbnRzID0ge307XG4gIH1cbiAgd2luLkRCVUlXZWJDb21wb25lbnRzID0ge1xuICAgIC4uLndpbi5EQlVJV2ViQ29tcG9uZW50cyxcbiAgICBbcmVnaXN0cmF0aW9uTmFtZV06IHtcbiAgICAgIC4uLndpbi5EQlVJV2ViQ29tcG9uZW50c1tyZWdpc3RyYXRpb25OYW1lXSxcbiAgICAgIGNvbXBvbmVudFN0eWxlXG4gICAgfVxuICB9O1xufTtcblxuY29uc3QgYXBwZW5kU3R5bGVzID0gKHdpbikgPT4gKGNvbXBvbmVudHMpID0+IHtcbiAgY29tcG9uZW50cy5mb3JFYWNoKCh7IHJlZ2lzdHJhdGlvbk5hbWUsIGNvbXBvbmVudFN0eWxlIH0pID0+IHtcbiAgICBhcHBlbmRTdHlsZSh3aW4pKHJlZ2lzdHJhdGlvbk5hbWUsIGNvbXBvbmVudFN0eWxlKTtcbiAgfSk7XG4gIHJldHVybiBjb21wb25lbnRzO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgYXBwZW5kU3R5bGVzO1xuIiwiXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGVuc3VyZVNpbmdsZVJlZ2lzdHJhdGlvbih3aW4sIG5hbWUsIGNhbGxiYWNrKSB7XG4gIGlmICghd2luLkRCVUlXZWJDb21wb25lbnRzKSB7XG4gICAgd2luLkRCVUlXZWJDb21wb25lbnRzID0geyByZWdpc3RyYXRpb25zOiB7fSB9O1xuICB9IGVsc2UgaWYgKCF3aW4uREJVSVdlYkNvbXBvbmVudHMucmVnaXN0cmF0aW9ucykge1xuICAgIHdpbi5EQlVJV2ViQ29tcG9uZW50cy5yZWdpc3RyYXRpb25zID0ge307XG4gIH1cblxuICBsZXQgcmVnaXN0cmF0aW9uID0gd2luLkRCVUlXZWJDb21wb25lbnRzLnJlZ2lzdHJhdGlvbnNbbmFtZV07XG5cbiAgaWYgKHJlZ2lzdHJhdGlvbikgcmV0dXJuIHJlZ2lzdHJhdGlvbjtcblxuICByZWdpc3RyYXRpb24gPSBjYWxsYmFjaygpO1xuICB3aW4uREJVSVdlYkNvbXBvbmVudHMucmVnaXN0cmF0aW9uc1tuYW1lXSA9IHJlZ2lzdHJhdGlvbjtcblxuICByZXR1cm4gd2luLkRCVUlXZWJDb21wb25lbnRzLnJlZ2lzdHJhdGlvbnNbbmFtZV07XG59XG5cbiIsImltcG9ydCBnZXREQlVJbG9jYWxlU2VydmljZSBmcm9tICcuL0RCVUlMb2NhbGVTZXJ2aWNlJztcbmltcG9ydCBlbnN1cmVTaW5nbGVSZWdpc3RyYXRpb24gZnJvbSAnLi4vaW50ZXJuYWxzL2Vuc3VyZVNpbmdsZVJlZ2lzdHJhdGlvbic7XG5cbmNvbnN0IGVtcHR5T2JqID0ge307XG5cbmNvbnN0IHJlZ2lzdHJhdGlvbk5hbWUgPSAnREJVSUkxOG5TZXJ2aWNlJztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZ2V0REJVSUkxOG5TZXJ2aWNlKHdpbikge1xuICBjb25zdCBsb2NhbGVTZXJ2aWNlID0gZ2V0REJVSWxvY2FsZVNlcnZpY2Uod2luKTtcbiAgcmV0dXJuIGVuc3VyZVNpbmdsZVJlZ2lzdHJhdGlvbih3aW4sIHJlZ2lzdHJhdGlvbk5hbWUsICgpID0+IHtcbiAgICBjbGFzcyBJMThuU2VydmljZSB7XG4gICAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgbG9jYWxlU2VydmljZS5vbkxvY2FsZUNoYW5nZSh0aGlzLl9oYW5kbGVMb2NhbGVDaGFuZ2UuYmluZCh0aGlzKSk7XG4gICAgICAgIHRoaXMuX2xvY2FsZSA9IGxvY2FsZVNlcnZpY2UubG9jYWxlO1xuICAgICAgICB0aGlzLl90cmFuc2xhdGlvbnMgPSB7fTtcbiAgICAgIH1cblxuICAgICAgX2hhbmRsZUxvY2FsZUNoYW5nZShsb2NhbGUpIHtcbiAgICAgICAgdGhpcy5fbG9jYWxlID0gbG9jYWxlO1xuICAgICAgfVxuXG4gICAgICBjbGVhclRyYW5zbGF0aW9ucyhsYW5nKSB7XG4gICAgICAgIGRlbGV0ZSB0aGlzLl90cmFuc2xhdGlvbnNbbGFuZ107XG4gICAgICB9XG5cbiAgICAgIHJlZ2lzdGVyVHJhbnNsYXRpb25zKHRyYW5zbGF0aW9ucykge1xuICAgICAgICB0aGlzLl90cmFuc2xhdGlvbnMgPSBPYmplY3Qua2V5cyh0cmFuc2xhdGlvbnMpLnJlZHVjZSgoYWNjLCBsYW5nKSA9PiB7XG4gICAgICAgICAgYWNjW2xhbmddID0ge1xuICAgICAgICAgICAgLi4udGhpcy5fdHJhbnNsYXRpb25zW2xhbmddLFxuICAgICAgICAgICAgLi4udHJhbnNsYXRpb25zW2xhbmddXG4gICAgICAgICAgfTtcbiAgICAgICAgICByZXR1cm4gYWNjO1xuICAgICAgICB9LCB0aGlzLl90cmFuc2xhdGlvbnMpO1xuICAgICAgfVxuXG4gICAgICB0cmFuc2xhdGUobXNnKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmN1cnJlbnRMYW5nVHJhbnNsYXRpb25zW21zZ107XG4gICAgICB9XG5cbiAgICAgIGdldCB0cmFuc2xhdGlvbnMoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl90cmFuc2xhdGlvbnM7XG4gICAgICB9XG5cbiAgICAgIGdldCBjdXJyZW50TGFuZ1RyYW5zbGF0aW9ucygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3RyYW5zbGF0aW9uc1t0aGlzLl9sb2NhbGUubGFuZ10gfHwgZW1wdHlPYmo7XG4gICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgaTE4blNlcnZpY2UgPSBuZXcgSTE4blNlcnZpY2UoKTtcbiAgICByZXR1cm4gaTE4blNlcnZpY2U7XG4gIH0pO1xufVxuIiwiXG5pbXBvcnQgZW5zdXJlU2luZ2xlUmVnaXN0cmF0aW9uIGZyb20gJy4uL2ludGVybmFscy9lbnN1cmVTaW5nbGVSZWdpc3RyYXRpb24nO1xuXG5jb25zdCBkZWZhdWx0TG9jYWxlID0ge1xuICBkaXI6ICdsdHInLFxuICBsYW5nOiAnZW4nXG59O1xuXG5jb25zdCByZWdpc3RyYXRpb25OYW1lID0gJ0RCVUlMb2NhbGVTZXJ2aWNlJztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZ2V0REJVSUxvY2FsZVNlcnZpY2Uod2luKSB7XG4gIHJldHVybiBlbnN1cmVTaW5nbGVSZWdpc3RyYXRpb24od2luLCByZWdpc3RyYXRpb25OYW1lLCAoKSA9PiB7XG4gICAgY2xhc3MgTG9jYWxlU2VydmljZSB7XG4gICAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5fY2FsbGJhY2tzID0gW107XG4gICAgICAgIHRoaXMuX2xvY2FsZUF0dHJzID0gT2JqZWN0LmtleXMoZGVmYXVsdExvY2FsZSk7XG4gICAgICAgIHRoaXMuX3Jvb3RFbGVtZW50ID0gd2luLmRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ1t4LWRidWktbG9jYWxlLXJvb3RdJykgfHwgd2luLmRvY3VtZW50LmRvY3VtZW50RWxlbWVudDtcbiAgICAgICAgdGhpcy5fbG9jYWxlQXR0cnMuZm9yRWFjaCgoYXR0cikgPT4ge1xuICAgICAgICAgIGlmICghdGhpcy5fcm9vdEVsZW1lbnQuZ2V0QXR0cmlidXRlKGF0dHIpKSB7XG4gICAgICAgICAgICB0aGlzLl9yb290RWxlbWVudC5zZXRBdHRyaWJ1dGUoYXR0ciwgZGVmYXVsdExvY2FsZVthdHRyXSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5fbG9jYWxlID0gdGhpcy5fbG9jYWxlQXR0cnMucmVkdWNlKChhY2MsIGF0dHIpID0+IHtcbiAgICAgICAgICBhY2NbYXR0cl0gPSB0aGlzLl9yb290RWxlbWVudC5nZXRBdHRyaWJ1dGUoYXR0cik7XG4gICAgICAgICAgcmV0dXJuIGFjYztcbiAgICAgICAgfSwge30pO1xuICAgICAgICB0aGlzLl9vYnNlcnZlciA9IG5ldyBNdXRhdGlvbk9ic2VydmVyKHRoaXMuX2hhbmRsZU11dGF0aW9ucy5iaW5kKHRoaXMpKTtcbiAgICAgICAgdGhpcy5fb2JzZXJ2ZXIub2JzZXJ2ZSh0aGlzLl9yb290RWxlbWVudCwge1xuICAgICAgICAgIGF0dHJpYnV0ZXM6IHRydWVcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIF9oYW5kbGVNdXRhdGlvbnMobXV0YXRpb25zKSB7XG4gICAgICAgIG11dGF0aW9ucy5mb3JFYWNoKChtdXRhdGlvbikgPT4ge1xuICAgICAgICAgIGNvbnN0IG11dGF0aW9uQXR0cmlidXRlTmFtZSA9IG11dGF0aW9uLmF0dHJpYnV0ZU5hbWU7XG4gICAgICAgICAgaWYgKHRoaXMuX2xvY2FsZUF0dHJzLmluY2x1ZGVzKG11dGF0aW9uQXR0cmlidXRlTmFtZSkpIHtcbiAgICAgICAgICAgIHRoaXMuX2xvY2FsZSA9IHtcbiAgICAgICAgICAgICAgLi4udGhpcy5fbG9jYWxlLFxuICAgICAgICAgICAgICBbbXV0YXRpb25BdHRyaWJ1dGVOYW1lXTogdGhpcy5fcm9vdEVsZW1lbnQuZ2V0QXR0cmlidXRlKG11dGF0aW9uQXR0cmlidXRlTmFtZSlcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICB0aGlzLl9jYWxsYmFja3MuZm9yRWFjaChjYWxsYmFjayA9PiBjYWxsYmFjayh0aGlzLl9sb2NhbGUpKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICBzZXQgbG9jYWxlKGxvY2FsZU9iaikge1xuICAgICAgICBPYmplY3Qua2V5cyhsb2NhbGVPYmopLmZvckVhY2goKGtleSkgPT4ge1xuICAgICAgICAgIHRoaXMuX3Jvb3RFbGVtZW50LnNldEF0dHJpYnV0ZShrZXksIGxvY2FsZU9ialtrZXldKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIGdldCBsb2NhbGUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9sb2NhbGU7XG4gICAgICB9XG5cbiAgICAgIG9uTG9jYWxlQ2hhbmdlKGNhbGxiYWNrKSB7XG4gICAgICAgIHRoaXMuX2NhbGxiYWNrcy5wdXNoKGNhbGxiYWNrKTtcbiAgICAgICAgY2FsbGJhY2sodGhpcy5sb2NhbGUpO1xuICAgICAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgICAgIHRoaXMuX2NhbGxiYWNrcyA9IHRoaXMuX2NhbGxiYWNrcy5maWx0ZXIoY2IgPT4gY2IgIT09IGNhbGxiYWNrKTtcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBsb2NhbGVTZXJ2aWNlID0gbmV3IExvY2FsZVNlcnZpY2UoKTtcbiAgICByZXR1cm4gbG9jYWxlU2VydmljZTtcbiAgfSk7XG59XG4iLCIvKiBlc2xpbnQgcHJlZmVyLWNvbnN0OiAwICovXG5cbi8qKlxuICpcbiAqIEBwYXJhbSBvcHRpb25zIE9iamVjdFxuICogQHJldHVybnMgZnVuY3Rpb24oU3RyaW5nKTogU3RyaW5nXG4gKi9cbmNvbnN0IGZvcmNlRmxvYXQgPSAoeyBkZWNQb2ludCA9ICcuJyB9ID0ge30pID0+ICh2YWx1ZSkgPT4ge1xuICBjb25zdCBHTE9CQUxfREVDX1BPSU5UID0gbmV3IFJlZ0V4cChgXFxcXCR7ZGVjUG9pbnR9YCwgJ2cnKTtcbiAgY29uc3QgR0xPQkFMX05PTl9OVU1CRVJfT1JfREVDX1BPSU5UID0gbmV3IFJlZ0V4cChgW15cXFxcZCR7ZGVjUG9pbnR9XWAsICdnJyk7XG4gIGNvbnN0IE5VTUJFUl9ERUNfUE9JTlRfT1JfU0hPUlRDVVQgPSBuZXcgUmVnRXhwKGBbXFxcXGQke2RlY1BvaW50fUtrTW1dYCwgJycpO1xuICBjb25zdCBOVU1CRVJfT1JfU0lHTiA9IG5ldyBSZWdFeHAoJ1tcXFxcZCstXScsICcnKTtcbiAgY29uc3QgU0lHTiA9IG5ldyBSZWdFeHAoJ1srLV0nLCAnJyk7XG4gIGNvbnN0IFNIT1JUQ1VUID0gbmV3IFJlZ0V4cCgnW0trTW1dJywgJycpO1xuICBjb25zdCBTSE9SVENVVF9USE9VU0FORFMgPSBuZXcgUmVnRXhwKCdbS2tdJywgJycpO1xuXG4gIGxldCB2YWx1ZVRvVXNlID0gdmFsdWU7XG4gIGNvbnN0IGluZGV4T2ZQb2ludCA9IHZhbHVlVG9Vc2UuaW5kZXhPZihkZWNQb2ludCk7XG4gIGNvbnN0IGxhc3RJbmRleE9mUG9pbnQgPSB2YWx1ZVRvVXNlLmxhc3RJbmRleE9mKGRlY1BvaW50KTtcbiAgY29uc3QgaGFzTW9yZVRoYW5PbmVQb2ludCA9IGluZGV4T2ZQb2ludCAhPT0gbGFzdEluZGV4T2ZQb2ludDtcblxuICBpZiAoaGFzTW9yZVRoYW5PbmVQb2ludCkge1xuICAgIHZhbHVlVG9Vc2UgPSBgJHt2YWx1ZVRvVXNlLnJlcGxhY2UoR0xPQkFMX0RFQ19QT0lOVCwgJycpfSR7ZGVjUG9pbnR9YDtcbiAgfVxuXG4gIGxldCBmaXJzdENoYXIgPSB2YWx1ZVRvVXNlWzBdIHx8ICcnO1xuICBsZXQgbGFzdENoYXIgPSAodmFsdWVUb1VzZS5sZW5ndGggPiAxID8gdmFsdWVUb1VzZVt2YWx1ZVRvVXNlLmxlbmd0aCAtIDFdIDogJycpIHx8ICcnO1xuICBsZXQgbWlkZGxlQ2hhcnMgPSB2YWx1ZVRvVXNlLnN1YnN0cigxLCB2YWx1ZVRvVXNlLmxlbmd0aCAtIDIpIHx8ICcnO1xuXG4gIGlmICghZmlyc3RDaGFyLm1hdGNoKE5VTUJFUl9PUl9TSUdOKSkge1xuICAgIGZpcnN0Q2hhciA9ICcnO1xuICB9XG5cbiAgbWlkZGxlQ2hhcnMgPSBtaWRkbGVDaGFycy5yZXBsYWNlKEdMT0JBTF9OT05fTlVNQkVSX09SX0RFQ19QT0lOVCwgJycpO1xuXG4gIGlmICghbGFzdENoYXIubWF0Y2goTlVNQkVSX0RFQ19QT0lOVF9PUl9TSE9SVENVVCkpIHtcbiAgICBsYXN0Q2hhciA9ICcnO1xuICB9IGVsc2UgaWYgKGxhc3RDaGFyLm1hdGNoKFNIT1JUQ1VUKSkge1xuICAgIGlmIChtaWRkbGVDaGFycyA9PT0gZGVjUG9pbnQpIHtcbiAgICAgIG1pZGRsZUNoYXJzID0gJyc7XG4gICAgfSBlbHNlIGlmIChtaWRkbGVDaGFycyA9PT0gJycgJiYgZmlyc3RDaGFyLm1hdGNoKFNJR04pKSB7XG4gICAgICBsYXN0Q2hhciA9ICcnO1xuICAgIH1cbiAgfSBlbHNlIGlmIChsYXN0Q2hhciA9PT0gZGVjUG9pbnQgJiYgbWlkZGxlQ2hhcnMgPT09ICcnICYmIGZpcnN0Q2hhci5tYXRjaChTSUdOKSkge1xuICAgIGxhc3RDaGFyID0gJyc7XG4gIH1cblxuICB2YWx1ZVRvVXNlID0gW2ZpcnN0Q2hhciwgbWlkZGxlQ2hhcnMsIGxhc3RDaGFyXS5qb2luKCcnKTtcblxuICBpZiAobGFzdENoYXIubWF0Y2goU0hPUlRDVVQpKSB7XG4gICAgdmFsdWVUb1VzZSA9IChcbiAgICAgIE51bWJlcihgJHtmaXJzdENoYXJ9JHttaWRkbGVDaGFyc31gLnJlcGxhY2UoZGVjUG9pbnQsICcuJykpICpcbiAgICAgIChsYXN0Q2hhci5tYXRjaChTSE9SVENVVF9USE9VU0FORFMpID8gMTAwMCA6IDEwMDAwMDApXG4gICAgKS50b1N0cmluZygpLnJlcGxhY2UoJy4nLCBkZWNQb2ludCk7XG4gIH1cblxuICByZXR1cm4gdmFsdWVUb1VzZTtcbn07XG5cbi8qKlxuICpcbiAqIEBwYXJhbSBvcHRpb25zIE9iamVjdFxuICogQHJldHVybnMgZnVuY3Rpb24oU3RyaW5nKTogU3RyaW5nXG4gKi9cbmNvbnN0IG51bWJlckZvcm1hdHRlciA9ICh7IGRlY1BvaW50ID0gJy4nLCB0aG91c2FuZHNTZXBhcmF0b3IgPSAnLCcgfSA9IHt9KSA9PiB2YWx1ZSA9PiB7XG4gIHZhbHVlID0gdmFsdWUucmVwbGFjZSgnLicsIGRlY1BvaW50KTtcbiAgbGV0IGZpcnN0Q2hhciA9IHZhbHVlWzBdIHx8ICcnO1xuICBmaXJzdENoYXIgPSBbJysnLCAnLSddLmluY2x1ZGVzKGZpcnN0Q2hhcikgPyBmaXJzdENoYXIgOiAnJztcbiAgY29uc3QgaXNGbG9hdGluZ1BvaW50ID0gdmFsdWUuaW5kZXhPZihkZWNQb2ludCkgIT09IC0xO1xuICBsZXQgW2ludGVnZXJQYXJ0ID0gJycsIGRlY2ltYWxzID0gJyddID0gdmFsdWUuc3BsaXQoZGVjUG9pbnQpO1xuICBpbnRlZ2VyUGFydCA9IGludGVnZXJQYXJ0LnJlcGxhY2UoL1srLV0vZywgJycpO1xuICBpbnRlZ2VyUGFydCA9IGludGVnZXJQYXJ0LnJlcGxhY2UoL1xcQig/PShcXGR7M30pKyg/IVxcZCkpL2csIHRob3VzYW5kc1NlcGFyYXRvcik7XG4gIGNvbnN0IHJldCA9IGAke2ZpcnN0Q2hhcn0ke2ludGVnZXJQYXJ0fSR7aXNGbG9hdGluZ1BvaW50ID8gZGVjUG9pbnQgOiAnJ30ke2RlY2ltYWxzfWA7XG4gIHJldHVybiByZXQ7XG59O1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIGZvcmNlRmxvYXQsXG4gIG51bWJlckZvcm1hdHRlclxufTtcblxuIiwiLyogZXNsaW50IG5vLWNvbnNvbGU6IDAgKi9cblxuY29uc3QgYnV0dG9uSGVpZ2h0ID0gJzI1cHgnO1xuY29uc3QgYnV0dG9uU3RhcnQgPSAnNXB4JztcbmNvbnN0IGJ1dHRvblRvcCA9ICc1cHgnO1xuXG5sZXQgY29uc29sZU1lc3NhZ2VzID0gW107XG5jb25zdCBjb25zb2xlTG9nID0gY29uc29sZS5sb2cuYmluZChjb25zb2xlKTtcbmNvbnN0IGNvbnNvbGVPcmlnaW5hbCA9IHt9O1xuXG5mdW5jdGlvbiBjYXB0dXJlQ29uc29sZShjb25zb2xlRWxtLCBvcHRpb25zKSB7XG4gIGNvbnN0IHsgaW5kZW50ID0gMiwgc2hvd0xhc3RPbmx5ID0gZmFsc2UgfSA9IG9wdGlvbnM7XG4gIGNvbnN0IGhhbmRsZXIgPSBmdW5jdGlvbiBoYW5kbGVyKGFjdGlvbiwgLi4uYXJncykge1xuICAgIGlmIChzaG93TGFzdE9ubHkpIHtcbiAgICAgIGNvbnNvbGVNZXNzYWdlcyA9IFt7IFthY3Rpb25dOiBhcmdzIH1dO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlTWVzc2FnZXMucHVzaCh7IFthY3Rpb25dOiBhcmdzIH0pO1xuICAgIH1cblxuICAgIGNvbnNvbGVFbG0uaW5uZXJIVE1MID0gY29uc29sZU1lc3NhZ2VzLm1hcCgoZW50cnkpID0+IHtcbiAgICAgIGNvbnN0IGFjdGlvbiA9IE9iamVjdC5rZXlzKGVudHJ5KVswXTtcbiAgICAgIGNvbnN0IHZhbHVlcyA9IGVudHJ5W2FjdGlvbl07XG4gICAgICBjb25zdCBtZXNzYWdlID0gdmFsdWVzLm1hcCgoaXRlbSkgPT4ge1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgIFt1bmRlZmluZWQsIG51bGxdLmluY2x1ZGVzKGl0ZW0pIHx8XG4gICAgICAgICAgWydudW1iZXInLCAnc3RyaW5nJywgJ2Z1bmN0aW9uJ10uaW5jbHVkZXModHlwZW9mIGl0ZW0pXG4gICAgICAgICkgP1xuICAgICAgICAgIGl0ZW0gOlxuICAgICAgICAgIFsnTWFwJywgJ1NldCddLmluY2x1ZGVzKGl0ZW0uY29uc3RydWN0b3IubmFtZSkgP1xuICAgICAgICAgICAgYCR7aXRlbS5jb25zdHJ1Y3Rvci5uYW1lfSAoJHtKU09OLnN0cmluZ2lmeShbLi4uaXRlbV0pfSlgIDpcbiAgICAgICAgICAgIEpTT04uc3RyaW5naWZ5KGl0ZW0sIChrZXksIHZhbHVlKSA9PiB7XG4gICAgICAgICAgICAgIGlmICgodHlwZW9mIHZhbHVlKSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZS50b1N0cmluZygpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgICAgICAgIH0sIGluZGVudCk7XG4gICAgICB9KS5qb2luKCcsICcpO1xuXG4gICAgICBjb25zdCBjb2xvciA9IHtcbiAgICAgICAgbG9nOiAnIzAwMCcsXG4gICAgICAgIHdhcm46ICdvcmFuZ2UnLFxuICAgICAgICBlcnJvcjogJ2RhcmtyZWQnXG4gICAgICB9W2FjdGlvbl07XG5cbiAgICAgIHJldHVybiBgPHByZSBzdHlsZT1cImNvbG9yOiAke2NvbG9yfVwiPiR7bWVzc2FnZX08L3ByZT5gO1xuICAgIH0pLmpvaW4oJ1xcbicpO1xuICB9O1xuICBbJ2xvZycsICd3YXJuJywgJ2Vycm9yJ10uZm9yRWFjaCgoYWN0aW9uKSA9PiB7XG4gICAgY29uc29sZU9yaWdpbmFsW2FjdGlvbl0gPSBjb25zb2xlW2FjdGlvbl07XG4gICAgY29uc29sZVthY3Rpb25dID0gaGFuZGxlci5iaW5kKGNvbnNvbGUsIGFjdGlvbik7XG4gIH0pO1xuICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignZXJyb3InLCAoZXZ0KSA9PiB7XG4gICAgLy8gZXNsaW50IG5vLWNvbnNvbGU6IDBcbiAgICBjb25zb2xlLmVycm9yKGBcIiR7ZXZ0Lm1lc3NhZ2V9XCIgZnJvbSAke2V2dC5maWxlbmFtZX06JHtldnQubGluZW5vfWApO1xuICAgIGNvbnNvbGUuZXJyb3IoZXZ0LCBldnQuZXJyb3Iuc3RhY2spO1xuICAgIC8vIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuICB9KTtcbiAgY29uc29sZUxvZygnY29uc29sZSBjYXB0dXJlZCcpO1xuICByZXR1cm4gZnVuY3Rpb24gcmVsZWFzZUNvbnNvbGUoKSB7XG4gICAgWydsb2cnLCAnd2FybicsICdlcnJvciddLmZvckVhY2goKGFjdGlvbikgPT4ge1xuICAgICAgY29uc29sZVthY3Rpb25dID0gY29uc29sZU9yaWdpbmFsW2FjdGlvbl07XG4gICAgfSk7XG4gICAgY29uc29sZUxvZygnY29uc29sZSByZWxlYXNlZCcpO1xuICB9O1xufVxuXG5mdW5jdGlvbiBjcmVhdGVDb25zb2xlKHtcbiAgb3B0aW9ucyxcbiAgY29uc29sZVN0eWxlOiB7XG4gICAgYnRuU3RhcnQgPSBidXR0b25TdGFydCwgYnRuSGVpZ2h0ID0gYnV0dG9uSGVpZ2h0LFxuICAgIHdpZHRoID0gYGNhbGMoMTAwdncgLSAke2J0blN0YXJ0fSAtIDMwcHgpYCwgaGVpZ2h0ID0gJzQwMHB4JyxcbiAgICBiYWNrZ3JvdW5kID0gJ3JnYmEoMCwgMCwgMCwgMC41KSdcbiAgfVxufSkge1xuICBjb25zdCB7IHJ0bCA9IGZhbHNlIH0gPSBvcHRpb25zO1xuICBjb25zdCBjb25zb2xlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gIGNvbnNvbGUuaWQgPSAnREJVSW9uU2NyZWVuQ29uc29sZSc7XG4gIGNvbnNvbGUuc3R5bGUuY3NzVGV4dCA9IGBcbiAgICBkaXNwbGF5OiBibG9jaztcbiAgICBtYXJnaW46IDBweDtcbiAgICBwYWRkaW5nOiA1cHg7XG4gICAgcG9zaXRpb246IGFic29sdXRlO1xuICAgIG92ZXJmbG93OiBhdXRvO1xuICAgIHdpZHRoOiAke3dpZHRofTtcbiAgICBoZWlnaHQ6ICR7aGVpZ2h0fTtcbiAgICB0b3A6ICR7YnRuSGVpZ2h0fTtcbiAgICAke3J0bCA/ICdyaWdodCcgOiAnbGVmdCd9OiAwcHg7XG4gICAgYmFja2dyb3VuZDogJHtiYWNrZ3JvdW5kfTtcbiAgICB6LWluZGV4OiA5OTk5O1xuICAgIC13ZWJraXQtb3ZlcmZsb3ctc2Nyb2xsaW5nOiB0b3VjaFxuICAgIGA7XG4gIHJldHVybiBjb25zb2xlO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVCdXR0b24oe1xuICBvcHRpb25zLFxuICBidXR0b25TdHlsZToge1xuICAgIHBvc2l0aW9uID0gJ2ZpeGVkJyxcbiAgICB3aWR0aCA9ICcyNXB4JywgaGVpZ2h0ID0gYnV0dG9uSGVpZ2h0LCB0b3AgPSBidXR0b25Ub3AsIHN0YXJ0ID0gYnV0dG9uU3RhcnQsXG4gICAgYmFja2dyb3VuZCA9ICdyZ2JhKDAsIDAsIDAsIDAuNSknXG4gIH1cbn0pIHtcbiAgY29uc3QgeyBydGwgPSBmYWxzZSB9ID0gb3B0aW9ucztcbiAgY29uc3QgYnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gIGJ1dHRvbi5pZCA9ICdEQlVJb25TY3JlZW5Db25zb2xlVG9nZ2xlcic7XG4gIGJ1dHRvbi5zdHlsZS5jc3NUZXh0ID0gYFxuICAgIHBvc2l0aW9uOiAke3Bvc2l0aW9ufTtcbiAgICB3aWR0aDogJHt3aWR0aH07XG4gICAgaGVpZ2h0OiAke2hlaWdodH07XG4gICAgdG9wOiAke3RvcH07XG4gICAgJHtydGwgPyAncmlnaHQnIDogJ2xlZnQnfTogJHtzdGFydH07XG4gICAgYmFja2dyb3VuZDogJHtiYWNrZ3JvdW5kfTtcbiAgICB6LWluZGV4OiA5OTk5O1xuICAgIGA7XG4gIHJldHVybiBidXR0b247XG59XG5cbi8qKlxub25TY3JlZW5Db25zb2xlKHtcbiAgYnV0dG9uU3R5bGUgPSB7IHBvc2l0aW9uLCB3aWR0aCwgaGVpZ2h0LCB0b3AsIHN0YXJ0LCBiYWNrZ3JvdW5kIH0sXG4gIGNvbnNvbGVTdHlsZSA9IHsgd2lkdGgsIGhlaWdodCwgYmFja2dyb3VuZCB9LFxuICBvcHRpb25zID0geyBydGw6IGZhbHNlLCBpbmRlbnQsIHNob3dMYXN0T25seSB9XG59KVxuKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIG9uU2NyZWVuQ29uc29sZSh7XG4gIGJ1dHRvblN0eWxlID0ge30sXG4gIGNvbnNvbGVTdHlsZSA9IHt9LFxuICBvcHRpb25zID0ge31cbn0gPSB7fSkge1xuICBjb25zdCBidXR0b24gPSBjcmVhdGVCdXR0b24oe1xuICAgIG9wdGlvbnMsXG4gICAgYnV0dG9uU3R5bGVcbiAgfSk7XG4gIGNvbnN0IGNvbnNvbGUgPSBjcmVhdGVDb25zb2xlKHtcbiAgICBjb25zb2xlU3R5bGU6IHtcbiAgICAgIC4uLmNvbnNvbGVTdHlsZSxcbiAgICAgIGJ0bkhlaWdodDogYnV0dG9uU3R5bGUuaGVpZ2h0LFxuICAgICAgYnRuU3RhcnQ6IGJ1dHRvblN0eWxlLnN0YXJ0XG4gICAgfSxcbiAgICBvcHRpb25zXG4gIH0pO1xuXG4gIGNvbnNvbGUuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xuICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gIH0pO1xuXG4gIGJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XG4gICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICBpZiAoIWJ1dHRvbi5jb250YWlucyhjb25zb2xlKSkge1xuICAgICAgYnV0dG9uLmFwcGVuZENoaWxkKGNvbnNvbGUpO1xuICAgICAgY29uc29sZS5zY3JvbGxUb3AgPSBjb25zb2xlLnNjcm9sbEhlaWdodCAtIGNvbnNvbGUuY2xpZW50SGVpZ2h0O1xuICAgIH0gZWxzZSB7XG4gICAgICBidXR0b24ucmVtb3ZlQ2hpbGQoY29uc29sZSk7XG4gICAgfVxuICB9KTtcblxuICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGJ1dHRvbik7XG4gIGNvbnN0IHJlbGVhc2VDb25zb2xlID0gY2FwdHVyZUNvbnNvbGUoY29uc29sZSwgb3B0aW9ucyk7XG5cbiAgcmV0dXJuIGZ1bmN0aW9uIHJlbGVhc2UoKSB7XG4gICAgZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZChidXR0b24pO1xuICAgIHJlbGVhc2VDb25zb2xlKCk7XG4gIH07XG59XG4iLCIvKipcbiAqIGNvbnN0IHQgPSB0ZW1wbGF0ZWAkezB9ICR7MX0gJHsndHdvJ30gJHsndGhyZWUnfWA7XG4gKiBjb25zdCB0ciA9IHQoJ2EnLCAnYicsIHsgdHdvOiAnYycsIHRocmVlOiAnZCcgfSk7XG4gKiBleHBlY3QodHIpLnRvLmVxdWFsKCdhIGIgYyBkJyk7XG4gKiBAcGFyYW0gc3RyaW5nc1xuICogQHBhcmFtIGtleXNcbiAqIEByZXR1cm4ge2Z1bmN0aW9uKC4uLlsqXSl9XG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHRlbXBsYXRlKHN0cmluZ3MsIC4uLmtleXMpIHtcbiAgcmV0dXJuICgoLi4udmFsdWVzKSA9PiB7XG4gICAgY29uc3QgZGljdCA9IHZhbHVlc1t2YWx1ZXMubGVuZ3RoIC0gMV0gfHwge307XG4gICAgY29uc3QgcmVzdWx0ID0gW3N0cmluZ3NbMF1dO1xuICAgIGtleXMuZm9yRWFjaCgoa2V5LCBpKSA9PiB7XG4gICAgICBjb25zdCB2YWx1ZSA9IE51bWJlci5pc0ludGVnZXIoa2V5KSA/IHZhbHVlc1trZXldIDogZGljdFtrZXldO1xuICAgICAgcmVzdWx0LnB1c2godmFsdWUsIHN0cmluZ3NbaSArIDFdKTtcbiAgICB9KTtcbiAgICByZXR1cm4gcmVzdWx0LmpvaW4oJycpO1xuICB9KTtcbn1cbiIsIlxuLy8gaHR0cDovL3JhZ2Fud2FsZC5jb20vMjAxNS8xMi8zMS90aGlzLWlzLW5vdC1hbi1lc3NheS1hYm91dC10cmFpdHMtaW4tamF2YXNjcmlwdC5odG1sXG5cbi8qXG5cbmNsYXNzIEEge1xuICBjb25zdHJ1Y3RvciguLi5hcmdzKSB7XG4gICAgdGhpcy5pbml0KC4uLmFyZ3MpO1xuICB9XG59XG5cbmNsYXNzIEIgZXh0ZW5kcyBBIHtcbiAgaW5pdCh4KSB7XG4gICAgdGhpcy5feCA9IHg7XG4gIH1cbiAgZ2V0WCgpIHtcbiAgICByZXR1cm4gdGhpcy5feDtcbiAgfVxuICBzZXRYKHZhbHVlKSB7XG4gICAgdGhpcy5feCA9IHZhbHVlO1xuICB9XG4gIGdldCB4KCkge1xuICAgIHJldHVybiB0aGlzLl94O1xuICB9XG4gIHNldCB4KHZhbHVlKSB7XG4gICAgdGhpcy5feCA9IHZhbHVlO1xuICB9XG59XG5cbmZ1bmN0aW9uIHdpdGhEb3VibGVYKGtsYXNzKSB7XG4gIHJldHVybiBPdmVycmlkZU9yRGVmaW5lKHtcblxuICAgIC8vIG92ZXJyaWRlc1xuICAgIGluaXQob3JpZ2luYWxJbml0LCB4LCB5KSB7XG4gICAgICBvcmlnaW5hbEluaXQoeCk7XG4gICAgICB0aGlzLl95ID0geTtcbiAgICB9LFxuICAgIGdldFgob3JpZ2luYWxHZXRYKSB7XG4gICAgICByZXR1cm4gb3JpZ2luYWxHZXRYKCkgKiAyO1xuICAgIH0sXG4gICAgc2V0WChvcmlnaW5hbFNldFgsIHZhbHVlKSB7XG4gICAgICAvLyB0aGlzLl94ID0gdmFsdWUgKiAyO1xuICAgICAgb3JpZ2luYWxTZXRYKHZhbHVlICogMik7XG4gICAgfSxcbiAgICBnZXQgeCgpIHtcbiAgICAgIHJldHVybiB0aGlzLl94ICogMjtcbiAgICB9LFxuICAgIHNldCB4KHZhbHVlKSB7XG4gICAgICB0aGlzLl94ID0gdmFsdWUgKiAyO1xuICAgIH0sXG5cbiAgICAvLyBuZXcgZGVmaW5pdGlvbnNcbiAgICBzZXQgeSh2YWx1ZSkge1xuICAgICAgdGhpcy5feSA9IHZhbHVlICogMjtcbiAgICB9LFxuICAgIGdldCB5KCkge1xuICAgICAgcmV0dXJuIHRoaXMuX3kgKiAyO1xuICAgIH0sXG4gICAgaGVsbG8oKSB7XG4gICAgICByZXR1cm4gYGhlbGxvICR7dGhpcy5feH0gYW5kICR7dGhpcy55fWA7XG4gICAgfVxuICB9KShrbGFzcyk7XG59XG5cbkIgPSB3aXRoRG91YmxlWChCKTtcblxuY29uc3QgYiA9IG5ldyBCKDIsIDUpO1xuY29uc29sZS5sb2coYi54KTsgLy8gNFxuY29uc29sZS5sb2coYi5nZXRYKCkpOyAvLyA0XG5cbmIuc2V0WCgzKTtcbi8vIGIueCA9IDM7XG5jb25zb2xlLmxvZyhiLngpOyAvLyAxMlxuY29uc29sZS5sb2coYi5nZXRYKCkpOyAvLyAxMlxuXG4vLyBuZXdcbmNvbnNvbGUubG9nKGIueSk7IC8vIDEwXG5iLnkgPSA5O1xuY29uc29sZS5sb2coYi5oZWxsbygpKTsgLy8gaGVsbG8gNiBhbmQgMzZcblxuKi9cblxuZnVuY3Rpb24gT3ZlcnJpZGVPckRlZmluZShiZWhhdmlvdXIpIHtcbiAgY29uc3QgaW5zdGFuY2VLZXlzID0gUmVmbGVjdC5vd25LZXlzKGJlaGF2aW91cik7XG5cbiAgcmV0dXJuIGZ1bmN0aW9uIGRlZmluZShrbGFzcykge1xuICAgIGluc3RhbmNlS2V5cy5mb3JFYWNoKChwcm9wZXJ0eSkgPT4ge1xuXG4gICAgICBjb25zdCBuZXdQcm9wZXJ0eURlc2NyaXB0b3IgPVxuICAgICAgICBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKGJlaGF2aW91ciwgcHJvcGVydHkpO1xuICAgICAgY29uc3Qgb3JpZ2luYWxQcm9wZXJ0eURlc2NyaXB0b3IgPVxuICAgICAgICBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKGtsYXNzLnByb3RvdHlwZSwgcHJvcGVydHkpO1xuXG4gICAgICBjb25zdCB7XG4gICAgICAgIHZhbHVlOiBuZXdWYWx1ZSxcbiAgICAgICAgZ2V0OiBuZXdHZXR0ZXIsXG4gICAgICAgIHNldDogbmV3U2V0dGVyXG4gICAgICB9ID0gbmV3UHJvcGVydHlEZXNjcmlwdG9yO1xuXG4gICAgICBpZiAoIW9yaWdpbmFsUHJvcGVydHlEZXNjcmlwdG9yKSB7XG4gICAgICAgIGlmIChuZXdWYWx1ZSkge1xuICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShrbGFzcy5wcm90b3R5cGUsIHByb3BlcnR5LCB7XG4gICAgICAgICAgICB2YWx1ZTogbmV3VmFsdWUsXG4gICAgICAgICAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICAgICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShrbGFzcy5wcm90b3R5cGUsIHByb3BlcnR5LCB7XG4gICAgICAgICAgICBnZXQ6IG5ld0dldHRlcixcbiAgICAgICAgICAgIHNldDogbmV3U2V0dGVyLFxuICAgICAgICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IHtcbiAgICAgICAgICB2YWx1ZTogb3JpZ2luYWxWYWx1ZSxcbiAgICAgICAgICB3cml0YWJsZTogb3JpZ2luYWxXcml0YWJsZSxcbiAgICAgICAgICBnZXQ6IG9yaWdpbmFsR2V0dGVyLFxuICAgICAgICAgIHNldDogb3JpZ2luYWxTZXR0ZXIsXG4gICAgICAgICAgZW51bWVyYWJsZTogb3JpZ2luYWxFbnVtZXJhYmxlLFxuICAgICAgICAgIGNvbmZpZ3VyYWJsZTogb3JpZ2luYWxDb25maWd1cmFibGVcbiAgICAgICAgfSA9IG9yaWdpbmFsUHJvcGVydHlEZXNjcmlwdG9yO1xuXG4gICAgICAgIGlmIChuZXdWYWx1ZSkge1xuICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShrbGFzcy5wcm90b3R5cGUsIHByb3BlcnR5LCB7XG4gICAgICAgICAgICB2YWx1ZSguLi5hcmdzKSB7XG4gICAgICAgICAgICAgIGNvbnN0IGJvdW5kZWRWYWx1ZSA9IG9yaWdpbmFsVmFsdWUuYmluZCh0aGlzKTtcbiAgICAgICAgICAgICAgcmV0dXJuIG5ld1ZhbHVlLmNhbGwodGhpcywgYm91bmRlZFZhbHVlLCAuLi5hcmdzKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB3cml0YWJsZTogb3JpZ2luYWxXcml0YWJsZSxcbiAgICAgICAgICAgIGVudW1lcmFibGU6IG9yaWdpbmFsRW51bWVyYWJsZSxcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogb3JpZ2luYWxDb25maWd1cmFibGUsXG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGtsYXNzLnByb3RvdHlwZSwgcHJvcGVydHksIHtcbiAgICAgICAgICAgIGdldDogbmV3R2V0dGVyIHx8IG9yaWdpbmFsR2V0dGVyLFxuICAgICAgICAgICAgc2V0OiBuZXdTZXR0ZXIgfHwgb3JpZ2luYWxTZXR0ZXIsXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiBvcmlnaW5hbEVudW1lcmFibGUsXG4gICAgICAgICAgICBjb25maWd1cmFibGU6IG9yaWdpbmFsQ29uZmlndXJhYmxlLFxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIGtsYXNzO1xuICB9O1xufVxuXG5leHBvcnQgZGVmYXVsdCBPdmVycmlkZU9yRGVmaW5lO1xuIiwiXG5jb25zdCByZWFkT25seVByb3BlcnRpZXMgPSBbJ2ZvY3VzZWQnXTtcblxuY29uc3QgRVJST1JfTUVTU0FHRVMgPSB7XG4gIGZvY3VzZWQ6IGAnZm9jdXNlZCcgcHJvcGVydHkgaXMgcmVhZC1vbmx5IGFzIGl0IGlzIGNvbnRyb2xsZWQgYnkgdGhlIGNvbXBvbmVudC5cbklmIHlvdSB3YW50IHRvIHNldCBmb2N1cyBwcm9ncmFtbWF0aWNhbGx5IGNhbGwgLmZvY3VzKCkgbWV0aG9kIG9uIGNvbXBvbmVudC5cbmBcbn07XG5cbi8qKlxuICogV2hlbiBhbiBpbm5lciBmb2N1c2FibGUgaXMgZm9jdXNlZCAoZXg6IHZpYSBjbGljaykgdGhlIGVudGlyZSBjb21wb25lbnQgZ2V0cyBmb2N1c2VkLlxuICogV2hlbiB0aGUgY29tcG9uZW50IGdldHMgZm9jdXNlZCAoZXg6IHZpYSB0YWIpIHRoZSBmaXJzdCBpbm5lciBmb2N1c2FibGUgZ2V0cyBmb2N1c2VkIHRvby5cbiAqIFdoZW4gdGhlIGNvbXBvbmVudCBnZXRzIGRpc2FibGVkIGl0IGdldHMgYmx1cnJlZCB0b28gYW5kIGFsbCBpbm5lciBmb2N1c2FibGVzIGdldCBkaXNhYmxlZCBhbmQgYmx1cnJlZC5cbiAqIFdoZW4gZGlzYWJsZWQgdGhlIGNvbXBvbmVudCBjYW5ub3QgYmUgZm9jdXNlZC5cbiAqIFdoZW4gZW5hYmxlZCB0aGUgY29tcG9uZW50IGNhbiBiZSBmb2N1c2VkLlxuICogQHBhcmFtIEtsYXNzXG4gKiBAcmV0dXJucyB7Rm9jdXNhYmxlfVxuICogQGNvbnN0cnVjdG9yXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEZvY3VzYWJsZShLbGFzcykge1xuXG4gIEtsYXNzLmNvbXBvbmVudFN0eWxlICs9IGBcbiAgOmhvc3QoW2Rpc2FibGVkXSkge1xuICAgIGN1cnNvcjogbm90LWFsbG93ZWQ7XG4gICAgb3BhY2l0eTogMC41O1xuICAgIFxuICAgIC13ZWJraXQtdG91Y2gtY2FsbG91dDogbm9uZTtcbiAgICAtd2Via2l0LXVzZXItc2VsZWN0OiBub25lO1xuICAgIC1raHRtbC11c2VyLXNlbGVjdDogbm9uZTtcbiAgICAtbW96LXVzZXItc2VsZWN0OiBub25lO1xuICAgIC1tcy11c2VyLXNlbGVjdDogbm9uZTtcbiAgICB1c2VyLXNlbGVjdDogbm9uZTtcbiAgfVxuICBcbiAgOmhvc3QoW2Rpc2FibGVkXSkgKiB7XG4gICAgcG9pbnRlci1ldmVudHM6IG5vbmU7XG4gIH1cbiAgYDtcblxuICBjbGFzcyBGb2N1c2FibGUgZXh0ZW5kcyBLbGFzcyB7XG5cbiAgICBzdGF0aWMgZ2V0IG5hbWUoKSB7XG4gICAgICByZXR1cm4gc3VwZXIubmFtZTtcbiAgICB9XG5cbiAgICBzdGF0aWMgZ2V0IHByb3BlcnRpZXNUb1VwZ3JhZGUoKSB7XG4gICAgICAvLyBUaGUgcmVhc29uIGZvciB1cGdyYWRpbmcgJ2ZvY3VzZWQnIGlzIG9ubHkgdG8gc2hvdyBhbiB3YXJuaW5nXG4gICAgICAvLyBpZiB0aGUgY29uc3VtZXIgb2YgdGhlIGNvbXBvbmVudCBhdHRlbXB0ZWQgdG8gc2V0IGZvY3VzIHByb3BlcnR5XG4gICAgICAvLyB3aGljaCBpcyByZWFkLW9ubHkuXG4gICAgICByZXR1cm4gWy4uLnN1cGVyLnByb3BlcnRpZXNUb1VwZ3JhZGUsICdmb2N1c2VkJywgJ2Rpc2FibGVkJ107XG4gICAgfVxuXG4gICAgc3RhdGljIGdldCBvYnNlcnZlZEF0dHJpYnV0ZXMoKSB7XG4gICAgICByZXR1cm4gWy4uLnN1cGVyLm9ic2VydmVkQXR0cmlidXRlcywgJ2Rpc2FibGVkJ107XG4gICAgfVxuXG4gICAgY29uc3RydWN0b3IoLi4uYXJncykge1xuICAgICAgc3VwZXIoLi4uYXJncyk7XG5cbiAgICAgIHRoaXMuX2N1cnJlbnRJbm5lckZvY3VzZWQgPSBudWxsO1xuICAgICAgdGhpcy5fb25Jbm5lckZvY3VzYWJsZUZvY3VzZWQgPSB0aGlzLl9vbklubmVyRm9jdXNhYmxlRm9jdXNlZC5iaW5kKHRoaXMpO1xuICAgICAgdGhpcy5fb25Gb2N1cyA9IHRoaXMuX29uRm9jdXMuYmluZCh0aGlzKTtcbiAgICAgIHRoaXMuX29uQmx1ciA9IHRoaXMuX29uQmx1ci5iaW5kKHRoaXMpO1xuICAgIH1cblxuICAgIGF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjayhuYW1lLCBvbGRWYWx1ZSwgbmV3VmFsdWUpIHtcbiAgICAgIHN1cGVyLmF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjayhuYW1lLCBvbGRWYWx1ZSwgbmV3VmFsdWUpO1xuXG4gICAgICBjb25zdCBoYXNWYWx1ZSA9IG5ld1ZhbHVlICE9PSBudWxsO1xuICAgICAgaWYgKG5hbWUgPT09ICdkaXNhYmxlZCcpIHtcbiAgICAgICAgaGFzVmFsdWUgPyB0aGlzLl9hcHBseURpc2FibGVkU2lkZUVmZmVjdHMoKSA6IHRoaXMuX2FwcGx5RW5hYmxlZFNpZGVFZmZlY3RzKCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgY29ubmVjdGVkQ2FsbGJhY2soKSB7XG4gICAgICBzdXBlci5jb25uZWN0ZWRDYWxsYmFjaygpO1xuXG4gICAgICByZWFkT25seVByb3BlcnRpZXMuZm9yRWFjaCgocmVhZE9ubHlQcm9wZXJ0eSkgPT4ge1xuICAgICAgICBpZiAodGhpcy5oYXNBdHRyaWJ1dGUocmVhZE9ubHlQcm9wZXJ0eSkpIHtcbiAgICAgICAgICB0aGlzLnJlbW92ZUF0dHJpYnV0ZShyZWFkT25seVByb3BlcnR5KTtcbiAgICAgICAgICBjb25zb2xlLndhcm4oRVJST1JfTUVTU0FHRVNbcmVhZE9ubHlQcm9wZXJ0eV0pO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgaWYgKCF0aGlzLmRpc2FibGVkKSB7XG4gICAgICAgIHRoaXMuc2V0QXR0cmlidXRlKCd0YWJpbmRleCcsIDApO1xuICAgICAgfVxuXG4gICAgICAvLyB3aGVuIGNvbXBvbmVudCBmb2N1c2VkL2JsdXJyZWRcbiAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcignZm9jdXMnLCB0aGlzLl9vbkZvY3VzKTtcbiAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcignYmx1cicsIHRoaXMuX29uQmx1cik7XG5cbiAgICAgIHRoaXMuX2lubmVyRm9jdXNhYmxlcy5mb3JFYWNoKChmb2N1c2FibGUpID0+IHtcbiAgICAgICAgLy8gd2hlbiBpbm5lciBmb2N1c2FibGUgZm9jdXNlZFxuICAgICAgICBmb2N1c2FibGUuYWRkRXZlbnRMaXN0ZW5lcignZm9jdXMnLCB0aGlzLl9vbklubmVyRm9jdXNhYmxlRm9jdXNlZCk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBkaXNjb25uZWN0ZWRDYWxsYmFjaygpIHtcbiAgICAgIHN1cGVyLmRpc2Nvbm5lY3RlZENhbGxiYWNrKCk7XG5cbiAgICAgIHRoaXMucmVtb3ZlRXZlbnRMaXN0ZW5lcignZm9jdXMnLCB0aGlzLl9vbkZvY3VzKTtcbiAgICAgIHRoaXMucmVtb3ZlRXZlbnRMaXN0ZW5lcignYmx1cicsIHRoaXMuX29uQmx1cik7XG5cbiAgICAgIHRoaXMuX2lubmVyRm9jdXNhYmxlcy5mb3JFYWNoKChmb2N1c2FibGUpID0+IHtcbiAgICAgICAgZm9jdXNhYmxlLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2ZvY3VzJywgdGhpcy5fb25Jbm5lckZvY3VzYWJsZUZvY3VzZWQpO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gcmVhZC1vbmx5XG4gICAgZ2V0IGZvY3VzZWQoKSB7XG4gICAgICByZXR1cm4gdGhpcy5oYXNBdHRyaWJ1dGUoJ2ZvY3VzZWQnKTtcbiAgICB9XG5cbiAgICBzZXQgZm9jdXNlZChfKSB7XG4gICAgICBjb25zb2xlLndhcm4oRVJST1JfTUVTU0FHRVMuZm9jdXNlZCk7XG4gICAgfVxuXG4gICAgZ2V0IGRpc2FibGVkKCkge1xuICAgICAgcmV0dXJuIHRoaXMuaGFzQXR0cmlidXRlKCdkaXNhYmxlZCcpO1xuICAgIH1cblxuICAgIHNldCBkaXNhYmxlZCh2YWx1ZSkge1xuICAgICAgY29uc3QgaGFzVmFsdWUgPSBCb29sZWFuKHZhbHVlKTtcbiAgICAgIGlmIChoYXNWYWx1ZSkge1xuICAgICAgICB0aGlzLnNldEF0dHJpYnV0ZSgnZGlzYWJsZWQnLCAnJyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnJlbW92ZUF0dHJpYnV0ZSgnZGlzYWJsZWQnKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBnZXQgX2lubmVyRm9jdXNhYmxlcygpIHtcbiAgICAgIHJldHVybiB0aGlzLmNoaWxkcmVuVHJlZS5xdWVyeVNlbGVjdG9yQWxsKCdbdGFiaW5kZXhdJykgfHwgW107XG4gICAgfVxuXG4gICAgZ2V0IF9maXJzdElubmVyRm9jdXNhYmxlKCkge1xuICAgICAgcmV0dXJuIHRoaXMuY2hpbGRyZW5UcmVlLnF1ZXJ5U2VsZWN0b3IoJ1t0YWJpbmRleF0nKTtcbiAgICB9XG5cbiAgICBfb25Jbm5lckZvY3VzYWJsZUZvY3VzZWQoZXZ0KSB7XG4gICAgICB0aGlzLl9jdXJyZW50SW5uZXJGb2N1c2VkID0gZXZ0LnRhcmdldDtcbiAgICB9XG5cbiAgICBfb25Gb2N1cygpIHtcbiAgICAgIGlmICh0aGlzLmRpc2FibGVkKSByZXR1cm47XG4gICAgICAvLyBPbmx5IGZvciBzdHlsaW5nIHB1cnBvc2UuXG4gICAgICAvLyBGb2N1c2VkIHByb3BlcnR5IGlzIGNvbnRyb2xsZWQgZnJvbSBpbnNpZGUuXG4gICAgICAvLyBBdHRlbXB0IHRvIHNldCB0aGlzIHByb3BlcnR5IGZyb20gb3V0c2lkZSB3aWxsIHRyaWdnZXIgYSB3YXJuaW5nXG4gICAgICAvLyBhbmQgd2lsbCBiZSBpZ25vcmVkXG4gICAgICB0aGlzLnNldEF0dHJpYnV0ZSgnZm9jdXNlZCcsICcnKTtcbiAgICAgIHRoaXMuX2FwcGx5Rm9jdXNTaWRlRWZmZWN0cygpO1xuICAgIH1cblxuICAgIF9vbkJsdXIoKSB7XG4gICAgICB0aGlzLnJlbW92ZUF0dHJpYnV0ZSgnZm9jdXNlZCcpO1xuICAgICAgdGhpcy5fYXBwbHlCbHVyU2lkZUVmZmVjdHMoKTtcbiAgICB9XG5cbiAgICBfYXBwbHlGb2N1c1NpZGVFZmZlY3RzKCkge1xuICAgICAgaWYgKHRoaXMuX2N1cnJlbnRJbm5lckZvY3VzZWQpIHtcbiAgICAgICAgLy8gU29tZSBpbm5lciBjb21wb25lbnQgaXMgYWxyZWFkeSBmb2N1c2VkLlxuICAgICAgICAvLyBObyBuZWVkIHRvIHNldCBmb2N1cyBvbiBhbnl0aGluZy5cbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgdGhpcy5fZm9jdXNGaXJzdElubmVyRm9jdXNhYmxlKCk7XG4gICAgfVxuXG4gICAgX2FwcGx5Qmx1clNpZGVFZmZlY3RzKCkge1xuICAgICAgaWYgKHRoaXMuX2N1cnJlbnRJbm5lckZvY3VzZWQpIHtcbiAgICAgICAgdGhpcy5fY3VycmVudElubmVyRm9jdXNlZC5ibHVyKCk7XG4gICAgICAgIHRoaXMuX2N1cnJlbnRJbm5lckZvY3VzZWQgPSBudWxsO1xuICAgICAgfVxuICAgIH1cblxuICAgIF9mb2N1c0ZpcnN0SW5uZXJGb2N1c2FibGUoKSB7XG4gICAgICBjb25zdCBmaXJzdElubmVyRm9jdXNhYmxlID0gdGhpcy5fZmlyc3RJbm5lckZvY3VzYWJsZTtcbiAgICAgIGlmIChmaXJzdElubmVyRm9jdXNhYmxlKSB7XG4gICAgICAgIHRoaXMuX2N1cnJlbnRJbm5lckZvY3VzZWQgPSBmaXJzdElubmVyRm9jdXNhYmxlO1xuICAgICAgICBmaXJzdElubmVyRm9jdXNhYmxlLmZvY3VzKCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgX2FwcGx5RGlzYWJsZWRTaWRlRWZmZWN0cygpIHtcbiAgICAgIHRoaXMucmVtb3ZlQXR0cmlidXRlKCd0YWJpbmRleCcpO1xuICAgICAgdGhpcy5faW5uZXJGb2N1c2FibGVzLmZvckVhY2goKGlubmVyRm9jdXNhYmxlKSA9PiB7XG4gICAgICAgIGlubmVyRm9jdXNhYmxlLnNldEF0dHJpYnV0ZSgndGFiaW5kZXgnLCAnLTEnKTtcbiAgICAgICAgaWYgKGlubmVyRm9jdXNhYmxlLmhhc0F0dHJpYnV0ZSgnY29udGVudGVkaXRhYmxlJykpIHtcbiAgICAgICAgICBpbm5lckZvY3VzYWJsZS5zZXRBdHRyaWJ1dGUoJ2NvbnRlbnRlZGl0YWJsZScsICdmYWxzZScpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlubmVyRm9jdXNhYmxlLmRpc2FibGVkID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICB0aGlzLmJsdXIoKTtcbiAgICB9XG5cbiAgICBfYXBwbHlFbmFibGVkU2lkZUVmZmVjdHMoKSB7XG4gICAgICB0aGlzLnNldEF0dHJpYnV0ZSgndGFiaW5kZXgnLCAnMCcpO1xuICAgICAgdGhpcy5faW5uZXJGb2N1c2FibGVzLmZvckVhY2goKGlubmVyRm9jdXNhYmxlKSA9PiB7XG4gICAgICAgIGlubmVyRm9jdXNhYmxlLnNldEF0dHJpYnV0ZSgndGFiaW5kZXgnLCAnMCcpO1xuICAgICAgICBpZiAoaW5uZXJGb2N1c2FibGUuaGFzQXR0cmlidXRlKCdjb250ZW50ZWRpdGFibGUnKSkge1xuICAgICAgICAgIGlubmVyRm9jdXNhYmxlLnNldEF0dHJpYnV0ZSgnY29udGVudGVkaXRhYmxlJywgJ3RydWUnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpbm5lckZvY3VzYWJsZS5kaXNhYmxlZCA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gRm9jdXNhYmxlO1xufVxuIiwiXG5jb25zdCBEQlVJQ29tbW9uQ3NzVmFycyA9IGBcbiAgOnJvb3Qge1xuICAgIC0tZGJ1aS13ZWItY29tcG9uZW50LWdsb2JhbC1ib3JkZXItcmFkaXVzOiA1cHg7XG4gICAgLS1kYnVpLXdlYi1jb21wb25lbnQtZm9ybS1pbnB1dC1oZWlnaHQ6IDMwcHg7XG4gICAgLS1kYnVpLXdlYi1jb21wb25lbnQtZm9ybS1pbnB1dC1jb2xvcjogIzAwMDtcbiAgICAtLWRidWktd2ViLWNvbXBvbmVudC1mb3JtLWlucHV0LWJhY2tncm91bmQtY29sb3I6IHRyYW5zcGFyZW50O1xuICAgIC0tZGJ1aS13ZWItY29tcG9uZW50LWZvcm0taW5wdXQtYm9yZGVyLWNvbG9yOiAjY2NjO1xuICAgIC0tZGJ1aS13ZWItY29tcG9uZW50LWZvcm0taW5wdXQtYm9yZGVyLXN0eWxlOiBzb2xpZDtcbiAgICAtLWRidWktd2ViLWNvbXBvbmVudC1mb3JtLWlucHV0LWJvcmRlci13aWR0aDogMXB4O1xuICB9XG4gIGA7XG5cbmV4cG9ydCBkZWZhdWx0IERCVUlDb21tb25Dc3NWYXJzO1xuIiwiXG5pbXBvcnQgZ2V0REJVSUxvY2FsZVNlcnZpY2UgZnJvbSAnLi4vLi4vLi4vc2VydmljZXMvREJVSUxvY2FsZVNlcnZpY2UnO1xuaW1wb3J0IGVuc3VyZVNpbmdsZVJlZ2lzdHJhdGlvbiBmcm9tICcuLi8uLi8uLi9pbnRlcm5hbHMvZW5zdXJlU2luZ2xlUmVnaXN0cmF0aW9uJztcbmltcG9ydCBEQlVJV2ViQ29tcG9uZW50TWVzc2FnZSBmcm9tICcuL0RCVUlXZWJDb21wb25lbnRNZXNzYWdlJztcbmltcG9ydCBEQlVJQ29tbW9uQ3NzVmFycyBmcm9tICcuL0RCVUlDb21tb25Dc3NWYXJzJztcblxuY29uc3QgUEFSRU5UX1RBUkdFVF9UWVBFID0gJ1BBUkVOVCc7XG5jb25zdCBDSElMRFJFTl9UQVJHRVRfVFlQRSA9ICdDSElMRFJFTic7XG5jb25zdCBDSEFOTkVMX0lOVEVSTkFMID0gJ0ludGVybmFsJztcbmNvbnN0IE1FU1NBR0VfQU5DRVNUT1JTX0NIQUlOX0NPTk5FQ1RFRCA9ICdBTkNFU1RPUlNfQ0hBSU5fQ09OTkVDVEVEJztcblxuY29uc3QgcmVnaXN0cmF0aW9uTmFtZSA9ICdEQlVJV2ViQ29tcG9uZW50QmFzZSc7XG5cbmZ1bmN0aW9uIGRlZmluZUNvbW1vbkNTU1ZhcnMod2luKSB7XG4gIGNvbnN0IHsgZG9jdW1lbnQgfSA9IHdpbjtcbiAgY29uc3QgY29tbW9uU3R5bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpO1xuICBjb21tb25TdHlsZS5zZXRBdHRyaWJ1dGUoJ2RidWktY29tbW9uLWNzcy12YXJzJywgJycpO1xuICBjb21tb25TdHlsZS5pbm5lckhUTUwgPSBEQlVJQ29tbW9uQ3NzVmFycztcbiAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignaGVhZCcpLmFwcGVuZENoaWxkKGNvbW1vblN0eWxlKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZ2V0REJVSVdlYkNvbXBvbmVudENvcmUod2luKSB7XG4gIGNvbnN0IExvY2FsZVNlcnZpY2UgPSBnZXREQlVJTG9jYWxlU2VydmljZSh3aW4pO1xuXG4gIHJldHVybiBlbnN1cmVTaW5nbGVSZWdpc3RyYXRpb24od2luLCByZWdpc3RyYXRpb25OYW1lLCAoKSA9PiB7XG4gICAgZGVmaW5lQ29tbW9uQ1NTVmFycyh3aW4pO1xuXG4gICAgY29uc3QgeyBkb2N1bWVudCwgSFRNTEVsZW1lbnQsIGN1c3RvbUVsZW1lbnRzIH0gPSB3aW47XG5cbiAgICBjbGFzcyBEQlVJV2ViQ29tcG9uZW50QmFzZSBleHRlbmRzIEhUTUxFbGVtZW50IHtcblxuICAgICAgc3RhdGljIGdldCByZWdpc3RyYXRpb25OYW1lKCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ3JlZ2lzdHJhdGlvbk5hbWUgbXVzdCBiZSBkZWZpbmVkIGluIGRlcml2ZWQgY2xhc3NlcycpO1xuICAgICAgfVxuXG4gICAgICBzdGF0aWMgZ2V0IHRlbXBsYXRlSW5uZXJIVE1MKCkge1xuICAgICAgICByZXR1cm4gJzxzdHlsZT48L3N0eWxlPjxzbG90Pjwvc2xvdD4nO1xuICAgICAgfVxuXG4gICAgICBzdGF0aWMgZ2V0IGRlcGVuZGVuY2llcygpIHtcbiAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgfVxuXG4gICAgICBzdGF0aWMgZ2V0IHVzZVNoYWRvdygpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG5cbiAgICAgIHN0YXRpYyBnZXQgcHJvcGVydGllc1RvVXBncmFkZSgpIHtcbiAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgfVxuXG4gICAgICBzdGF0aWMgZ2V0IHByb3BlcnRpZXNUb0RlZmluZSgpIHtcbiAgICAgICAgcmV0dXJuIHsgJ2RidWktd2ViLWNvbXBvbmVudCc6ICcnIH07XG4gICAgICB9XG5cbiAgICAgIC8vIHdlYiBjb21wb25lbnRzIHN0YW5kYXJkIEFQSVxuICAgICAgc3RhdGljIGdldCBvYnNlcnZlZEF0dHJpYnV0ZXMoKSB7XG4gICAgICAgIHJldHVybiBbXTtcbiAgICAgIH1cblxuICAgICAgY29uc3RydWN0b3IoLi4uYXJncykge1xuICAgICAgICBzdXBlcigpO1xuXG4gICAgICAgIGNvbnN0IHsgdXNlU2hhZG93IH0gPSB0aGlzLmNvbnN0cnVjdG9yO1xuICAgICAgICBpZiAodXNlU2hhZG93KSB7XG4gICAgICAgICAgdGhpcy5hdHRhY2hTaGFkb3coe1xuICAgICAgICAgICAgbW9kZTogJ29wZW4nLFxuICAgICAgICAgICAgLy8gZGVsZWdhdGVzRm9jdXM6IHRydWVcbiAgICAgICAgICAgIC8vIE5vdCB3b3JraW5nIG9uIElQYWQgc28gd2UgZG8gYW4gd29ya2Fyb3VuZFxuICAgICAgICAgICAgLy8gYnkgc2V0dGluZyBcImZvY3VzZWRcIiBhdHRyaWJ1dGUgd2hlbiBuZWVkZWQuXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5faXNDb25uZWN0ZWQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5fYW5jZXN0b3JzQ29ubmVjdGVkID0gZmFsc2U7XG4gICAgICAgIHRoaXMuX2luc2VydFRlbXBsYXRlKCk7XG5cbiAgICAgICAgdGhpcy5jb25uZWN0ZWRDYWxsYmFjayA9IHRoaXMuY29ubmVjdGVkQ2FsbGJhY2suYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy5kaXNjb25uZWN0ZWRDYWxsYmFjayA9IHRoaXMuZGlzY29ubmVjdGVkQ2FsbGJhY2suYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy5faGFuZGxlTG9jYWxlQ2hhbmdlID0gdGhpcy5faGFuZGxlTG9jYWxlQ2hhbmdlLmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMub25Mb2NhbGVDaGFuZ2UgPSB0aGlzLm9uTG9jYWxlQ2hhbmdlLmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMudW5yZWdpc3RlckxvY2FsZUNoYW5nZSA9IG51bGw7XG5cbiAgICAgICAgLy8gcHJvdmlkZSBzdXBwb3J0IGZvciB0cmFpdHMgaWYgYW55IGFzIHRoZXkgY2FudCBvdmVycmlkZSBjb25zdHJ1Y3RvclxuICAgICAgICB0aGlzLmluaXQgJiYgdGhpcy5pbml0KC4uLmFyZ3MpO1xuICAgICAgfVxuXG4gICAgICAvLyBodHRwczovL2RldmVsb3BlcnMuZ29vZ2xlLmNvbS93ZWIvZnVuZGFtZW50YWxzL3dlYi1jb21wb25lbnRzL2Jlc3QtcHJhY3RpY2VzI2xhenktcHJvcGVydGllc1xuICAgICAgLy8gaHR0cHM6Ly9kZXZlbG9wZXJzLmdvb2dsZS5jb20vd2ViL2Z1bmRhbWVudGFscy93ZWItY29tcG9uZW50cy9leGFtcGxlcy9ob3d0by1jaGVja2JveFxuICAgICAgLyogZXNsaW50IG5vLXByb3RvdHlwZS1idWlsdGluczogMCAqL1xuICAgICAgX3VwZ3JhZGVQcm9wZXJ0eShwcm9wKSB7XG4gICAgICAgIGlmICh0aGlzLmhhc093blByb3BlcnR5KHByb3ApKSB7XG4gICAgICAgICAgY29uc3QgdmFsdWUgPSB0aGlzW3Byb3BdO1xuICAgICAgICAgIC8vIGdldCByaWQgb2YgdGhlIHByb3BlcnR5IHRoYXQgbWlnaHQgc2hhZG93IGEgc2V0dGVyL2dldHRlclxuICAgICAgICAgIGRlbGV0ZSB0aGlzW3Byb3BdO1xuICAgICAgICAgIC8vIHRoaXMgdGltZSBpZiBhIHNldHRlciB3YXMgZGVmaW5lZCBpdCB3aWxsIGJlIHByb3Blcmx5IGNhbGxlZFxuICAgICAgICAgIHRoaXNbcHJvcF0gPSB2YWx1ZTtcbiAgICAgICAgICAvLyBpZiBhIGdldHRlciB3YXMgZGVmaW5lZCwgaXQgd2lsbCBiZSBjYWxsZWQgZnJvbSBub3cgb25cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBfZGVmaW5lUHJvcGVydHkoa2V5LCB2YWx1ZSkge1xuICAgICAgICBpZiAoIXRoaXMuaGFzQXR0cmlidXRlKGtleSkpIHtcbiAgICAgICAgICB0aGlzLnNldEF0dHJpYnV0ZShrZXksIHZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyB3ZWIgY29tcG9uZW50cyBzdGFuZGFyZCBBUElcbiAgICAgIGNvbm5lY3RlZENhbGxiYWNrKCkge1xuICAgICAgICB0aGlzLl9pc0Nvbm5lY3RlZCA9IHRydWU7XG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdiZWZvcmV1bmxvYWQnLCB0aGlzLmRpc2Nvbm5lY3RlZENhbGxiYWNrLCBmYWxzZSk7XG4gICAgICAgIHRoaXMudW5yZWdpc3RlckxvY2FsZUNoYW5nZSA9XG4gICAgICAgICAgTG9jYWxlU2VydmljZS5vbkxvY2FsZUNoYW5nZSh0aGlzLl9oYW5kbGVMb2NhbGVDaGFuZ2UpO1xuICAgICAgICBjb25zdCB7IHByb3BlcnRpZXNUb1VwZ3JhZGUsIHByb3BlcnRpZXNUb0RlZmluZSB9ID0gdGhpcy5jb25zdHJ1Y3RvcjtcbiAgICAgICAgcHJvcGVydGllc1RvVXBncmFkZS5mb3JFYWNoKChwcm9wZXJ0eSkgPT4ge1xuICAgICAgICAgIHRoaXMuX3VwZ3JhZGVQcm9wZXJ0eShwcm9wZXJ0eSk7XG4gICAgICAgIH0pO1xuICAgICAgICBPYmplY3Qua2V5cyhwcm9wZXJ0aWVzVG9EZWZpbmUpLmZvckVhY2goKHByb3BlcnR5KSA9PiB7XG4gICAgICAgICAgdGhpcy5fZGVmaW5lUHJvcGVydHkocHJvcGVydHksIHByb3BlcnRpZXNUb0RlZmluZVtwcm9wZXJ0eV0pO1xuICAgICAgICB9KTtcbiAgICAgICAgLy8gaWYgaW4gbGlnaHQgZG9tIG5vdGlmeSBkZXNjZW5kYW50cyB0aGF0IGFuY2VzdG9yIGNoYWluIGlzIGNvbm5lY3RlZFxuICAgICAgICBpZiAoIXRoaXMuZGJ1aVBhcmVudEhvc3QpIHtcbiAgICAgICAgICB0aGlzLnNlbmRNZXNzYWdlVG9DaGlsZHJlbih7XG4gICAgICAgICAgICBjaGFubmVsOiBDSEFOTkVMX0lOVEVSTkFMLFxuICAgICAgICAgICAgbWVzc2FnZTogTUVTU0FHRV9BTkNFU1RPUlNfQ0hBSU5fQ09OTkVDVEVEXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gd2ViIGNvbXBvbmVudHMgc3RhbmRhcmQgQVBJXG4gICAgICBkaXNjb25uZWN0ZWRDYWxsYmFjaygpIHtcbiAgICAgICAgdGhpcy5faXNDb25uZWN0ZWQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy51bnJlZ2lzdGVyTG9jYWxlQ2hhbmdlKCk7XG4gICAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdiZWZvcmV1bmxvYWQnLCB0aGlzLmRpc2Nvbm5lY3RlZENhbGxiYWNrLCBmYWxzZSk7XG4gICAgICB9XG5cbiAgICAgIC8vIHdlYiBjb21wb25lbnRzIHN0YW5kYXJkIEFQSVxuICAgICAgYXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrKCkge1xuICAgICAgICAvLyBubyBvcFxuICAgICAgfVxuXG4gICAgICBvbkxvY2FsZUNoYW5nZSgpIHtcbiAgICAgICAgLy8gbm8gb3BcbiAgICAgIH1cblxuICAgICAgZ2V0IGFuY2VzdG9yc0Nvbm5lY3RlZCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2FuY2VzdG9yc0Nvbm5lY3RlZDtcbiAgICAgIH1cblxuICAgICAgZ2V0IGRidWlDaGlsZHJlbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2hpbGRyZW5UcmVlLnF1ZXJ5U2VsZWN0b3JBbGwoJ1tkYnVpLXdlYi1jb21wb25lbnRdJyk7XG4gICAgICB9XG5cbiAgICAgIGdldCBkYnVpUGFyZW50SG9zdCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0Um9vdE5vZGUoKS5ob3N0O1xuICAgICAgfVxuXG4gICAgICBjcmVhdGVNZXNzYWdlKHtcbiAgICAgICAgY2hhbm5lbCwgbWVzc2FnZSwgZGF0YSwgcmVtZW1iZXJOb2Rlc1BhdGgsIHRhcmdldFR5cGVcbiAgICAgIH0gPSB7fSkge1xuICAgICAgICBjb25zdCBtZXNzYWdlSW5zdCA9IG5ldyBEQlVJV2ViQ29tcG9uZW50TWVzc2FnZSh7XG4gICAgICAgICAgY2hhbm5lbCxcbiAgICAgICAgICBtZXNzYWdlLFxuICAgICAgICAgIGRhdGEsXG4gICAgICAgICAgc291cmNlOiB0aGlzLFxuICAgICAgICAgIHJlbWVtYmVyTm9kZXNQYXRoLFxuICAgICAgICAgIG1ldGFkYXRhOiB7XG4gICAgICAgICAgICB0YXJnZXRUeXBlXG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgLy8gd2lsbCBiZSBpZ25vcmVkIGlmIHJlbWVtYmVyTm9kZXNQYXRoIHdhcyBmYWxzZSBhdCBtZXNzYWdlIGNyZWF0aW9uXG4gICAgICAgIG1lc3NhZ2VJbnN0LmFwcGVuZFZpc2l0ZWROb2RlKHRoaXMpO1xuICAgICAgICByZXR1cm4gbWVzc2FnZUluc3Q7XG4gICAgICB9XG5cbiAgICAgIHNlbmRNZXNzYWdlKG1lc3NhZ2VJbnN0KSB7XG4gICAgICAgIGNvbnN0IHsgdGFyZ2V0VHlwZSB9ID0gbWVzc2FnZUluc3QubWV0YWRhdGE7XG4gICAgICAgIGlmICh0YXJnZXRUeXBlID09PSBQQVJFTlRfVEFSR0VUX1RZUEUpIHtcbiAgICAgICAgICBjb25zdCBkYnVpUGFyZW50SG9zdCA9IHRoaXMuZGJ1aVBhcmVudEhvc3Q7XG4gICAgICAgICAgaWYgKGRidWlQYXJlbnRIb3N0KSB7XG4gICAgICAgICAgICBkYnVpUGFyZW50SG9zdC5fcHJvcGFnYXRlTWVzc2FnZShtZXNzYWdlSW5zdC5jbG9uZU9ySW5zdGFuY2UpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmICh0YXJnZXRUeXBlID09PSBDSElMRFJFTl9UQVJHRVRfVFlQRSkge1xuICAgICAgICAgIGNvbnN0IGRidUNoaWxkcmVuID0gdGhpcy5kYnVpQ2hpbGRyZW47XG4gICAgICAgICAgZGJ1Q2hpbGRyZW4uZm9yRWFjaCgoY2hpbGQpID0+IHtcbiAgICAgICAgICAgIGNoaWxkLl9wcm9wYWdhdGVNZXNzYWdlKG1lc3NhZ2VJbnN0LmNsb25lT3JJbnN0YW5jZSk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgX3Byb3BhZ2F0ZU1lc3NhZ2UobWVzc2FnZUluc3QpIHtcbiAgICAgICAgLy8gV2lsbCBiZSBpZ25vcmVkIGlmIHJlbWVtYmVyTm9kZXNQYXRoIHdhcyBmYWxzZSBhdCBtZXNzYWdlIGNyZWF0aW9uXG4gICAgICAgIG1lc3NhZ2VJbnN0LmFwcGVuZFZpc2l0ZWROb2RlKHRoaXMpO1xuICAgICAgICAvLyBJbnNpZGUgb25NZXNzYWdlUmVjZWl2ZWQgdGhlcmUgaXMgYSBjaGFuY2UgdGhhdFxuICAgICAgICAvLyBtZXNzYWdlI3N0b3BQcm9wYWdhdGlvbiBoYXMgYmVlbiBjYWxsZWQuXG4gICAgICAgIHRoaXMub25NZXNzYWdlUmVjZWl2ZWQobWVzc2FnZUluc3QpO1xuICAgICAgICBpZiAobWVzc2FnZUluc3Quc2hvdWxkUHJvcGFnYXRlKSB7XG4gICAgICAgICAgdGhpcy5zZW5kTWVzc2FnZShtZXNzYWdlSW5zdCk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgb25NZXNzYWdlUmVjZWl2ZWQobWVzc2FnZUluc3QpIHtcbiAgICAgICAgLy8gY29uc29sZS5sb2codGhpcy5pZCwgJ2lzQ29ubmVjdGVkJywgdGhpcy5pc0Nvbm5lY3RlZCwgYHJlY2VpdmVkIG1lc3NhZ2UgJHttZXNzYWdlSW5zdC5tZXNzYWdlfWAsICdwYXRoJywgSlNPTi5zdHJpbmdpZnkobWVzc2FnZUluc3QudmlzaXRlZE5vZGVzLm1hcCgobm9kZSkgPT4gbm9kZS5pZCkpLCAnc291cmNlJywgbWVzc2FnZUluc3Quc291cmNlLmlkKTtcbiAgICAgICAgY29uc3QgeyBjaGFubmVsIH0gPSBtZXNzYWdlSW5zdDtcbiAgICAgICAgdGhpc1tgb24ke2NoYW5uZWx9TWVzc2FnZWBdICYmXG4gICAgICAgICAgdGhpc1tgb24ke2NoYW5uZWx9TWVzc2FnZWBdKG1lc3NhZ2VJbnN0KTtcbiAgICAgIH1cblxuICAgICAgW2BvbiR7Q0hBTk5FTF9JTlRFUk5BTH1NZXNzYWdlYF0obWVzc2FnZUluc3QpIHtcbiAgICAgICAgY29uc3QgeyBtZXNzYWdlIH0gPSBtZXNzYWdlSW5zdDtcbiAgICAgICAgbWVzc2FnZSA9PT0gTUVTU0FHRV9BTkNFU1RPUlNfQ0hBSU5fQ09OTkVDVEVEICYmXG4gICAgICAgICAgdGhpcy5vbkFuY2VzdG9yc0NoYWluQ29ubmVjdGVkKG1lc3NhZ2VJbnN0KTtcbiAgICAgIH1cblxuICAgICAgb25BbmNlc3RvcnNDaGFpbkNvbm5lY3RlZChtZXNzYWdlSW5zdCkge1xuICAgICAgICB0aGlzLl9hbmNlc3RvcnNDb25uZWN0ZWQgPSB0cnVlO1xuICAgICAgICAvLyBjb25zb2xlLmxvZyh0aGlzLmlkLCAnaXNDb25uZWN0ZWQnLCB0aGlzLmlzQ29ubmVjdGVkLCAnb25BbmNlc3RvcnNDaGFpbkNvbm5lY3RlZCcsIG1lc3NhZ2VJbnN0LnNvdXJjZS5pZCk7XG4gICAgICB9XG5cbiAgICAgIHNlbmRNZXNzYWdlVG9QYXJlbnQoeyBjaGFubmVsLCBtZXNzYWdlLCBkYXRhLCByZW1lbWJlck5vZGVzUGF0aCB9KSB7XG4gICAgICAgIHRoaXMuc2VuZE1lc3NhZ2UodGhpcy5jcmVhdGVNZXNzYWdlKHtcbiAgICAgICAgICBjaGFubmVsLFxuICAgICAgICAgIG1lc3NhZ2UsXG4gICAgICAgICAgZGF0YSxcbiAgICAgICAgICByZW1lbWJlck5vZGVzUGF0aCxcbiAgICAgICAgICB0YXJnZXRUeXBlOiBQQVJFTlRfVEFSR0VUX1RZUEVcbiAgICAgICAgfSkpO1xuICAgICAgfVxuXG4gICAgICBzZW5kTWVzc2FnZVRvQ2hpbGRyZW4oeyBjaGFubmVsLCBtZXNzYWdlLCBkYXRhLCByZW1lbWJlck5vZGVzUGF0aCB9KSB7XG4gICAgICAgIHRoaXMuc2VuZE1lc3NhZ2UodGhpcy5jcmVhdGVNZXNzYWdlKHtcbiAgICAgICAgICBjaGFubmVsLFxuICAgICAgICAgIG1lc3NhZ2UsXG4gICAgICAgICAgZGF0YSxcbiAgICAgICAgICByZW1lbWJlck5vZGVzUGF0aCxcbiAgICAgICAgICB0YXJnZXRUeXBlOiBDSElMRFJFTl9UQVJHRVRfVFlQRVxuICAgICAgICB9KSk7XG4gICAgICB9XG5cbiAgICAgIGdldCBpc0Nvbm5lY3RlZCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2lzQ29ubmVjdGVkO1xuICAgICAgfVxuXG4gICAgICBnZXQgY2hpbGRyZW5UcmVlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jb25zdHJ1Y3Rvci51c2VTaGFkb3cgPyB0aGlzLnNoYWRvd1Jvb3QgOiB0aGlzO1xuICAgICAgfVxuXG4gICAgICBfaW5zZXJ0VGVtcGxhdGUoKSB7XG4gICAgICAgIGNvbnN0IHsgdGVtcGxhdGUgfSA9IHRoaXMuY29uc3RydWN0b3I7XG5cbiAgICAgICAgaWYgKHRlbXBsYXRlKSB7XG4gICAgICAgICAgdGhpcy5jaGlsZHJlblRyZWUuYXBwZW5kQ2hpbGQodGVtcGxhdGUuY29udGVudC5jbG9uZU5vZGUodHJ1ZSkpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIF9oYW5kbGVMb2NhbGVDaGFuZ2UobG9jYWxlKSB7XG4gICAgICAgIHRoaXMuc2V0QXR0cmlidXRlKCdkaXInLCBsb2NhbGUuZGlyKTtcbiAgICAgICAgdGhpcy5zZXRBdHRyaWJ1dGUoJ2xhbmcnLCBsb2NhbGUubGFuZyk7XG4gICAgICAgIHRoaXMub25Mb2NhbGVDaGFuZ2UobG9jYWxlKTtcbiAgICAgIH1cblxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGRlZmluZUNvbW1vblN0YXRpY01ldGhvZHMoa2xhc3MpIHtcbiAgICAgIGNvbnN0IHRlbXBsYXRlSW5uZXJIVE1MID0ga2xhc3MudGVtcGxhdGVJbm5lckhUTUw7XG4gICAgICBjb25zdCB0ZW1wbGF0ZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RlbXBsYXRlJyk7XG4gICAgICB0ZW1wbGF0ZS5pbm5lckhUTUwgPSB0ZW1wbGF0ZUlubmVySFRNTDtcblxuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGtsYXNzLCAndGVtcGxhdGUnLCB7XG4gICAgICAgIGdldCgpIHsgcmV0dXJuIHRlbXBsYXRlOyB9LFxuICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgICB9KTtcblxuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGtsYXNzLCAnY29tcG9uZW50U3R5bGUnLCB7XG4gICAgICAgIGdldCgpIHtcbiAgICAgICAgICByZXR1cm4ga2xhc3MudGVtcGxhdGUuY29udGVudC5xdWVyeVNlbGVjdG9yKCdzdHlsZScpLmlubmVySFRNTDtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0KHZhbHVlKSB7XG4gICAgICAgICAga2xhc3MudGVtcGxhdGUuY29udGVudC5xdWVyeVNlbGVjdG9yKCdzdHlsZScpLmlubmVySFRNTCA9IHZhbHVlO1xuICAgICAgICB9LFxuICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgICB9KTtcblxuICAgICAgcmV0dXJuIGtsYXNzO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIFJlZ2lzdGVyYWJsZShrbGFzcykge1xuICAgICAga2xhc3MucmVnaXN0ZXJTZWxmID0gKCkgPT4ge1xuICAgICAgICBjb25zdCByZWdpc3RyYXRpb25OYW1lID0ga2xhc3MucmVnaXN0cmF0aW9uTmFtZTtcbiAgICAgICAgY29uc3QgZGVwZW5kZW5jaWVzID0ga2xhc3MuZGVwZW5kZW5jaWVzO1xuICAgICAgICAvLyBNYWtlIHN1cmUgb3VyIGRlcGVuZGVuY2llcyBhcmUgcmVnaXN0ZXJlZCBiZWZvcmUgd2UgcmVnaXN0ZXIgc2VsZlxuICAgICAgICBkZXBlbmRlbmNpZXMuZm9yRWFjaCgoZGVwZW5kZW5jeSkgPT4gZGVwZW5kZW5jeS5yZWdpc3RlclNlbGYoKSk7XG4gICAgICAgIC8vIERvbid0IHRyeSB0byByZWdpc3RlciBzZWxmIGlmIGFscmVhZHkgcmVnaXN0ZXJlZFxuICAgICAgICBpZiAoY3VzdG9tRWxlbWVudHMuZ2V0KHJlZ2lzdHJhdGlvbk5hbWUpKSByZXR1cm4gcmVnaXN0cmF0aW9uTmFtZTtcbiAgICAgICAgLy8gR2l2ZSBhIGNoYW5jZSB0byBvdmVycmlkZSB3ZWItY29tcG9uZW50IHN0eWxlIGlmIHByb3ZpZGVkIGJlZm9yZSBiZWluZyByZWdpc3RlcmVkLlxuICAgICAgICBjb25zdCBjb21wb25lbnRTdHlsZSA9ICgod2luLkRCVUlXZWJDb21wb25lbnRzIHx8IHt9KVtyZWdpc3RyYXRpb25OYW1lXSB8fCB7fSkuY29tcG9uZW50U3R5bGU7XG4gICAgICAgIGlmIChjb21wb25lbnRTdHlsZSkge1xuICAgICAgICAgIGtsYXNzLmNvbXBvbmVudFN0eWxlICs9ICdcXG5cXG4vKiA9PT09IG92ZXJyaWRlcyA9PT09ICovXFxuXFxuJztcbiAgICAgICAgICBrbGFzcy5jb21wb25lbnRTdHlsZSArPSBjb21wb25lbnRTdHlsZTtcbiAgICAgICAgfVxuICAgICAgICAvLyBEbyByZWdpc3RyYXRpb25cbiAgICAgICAgY3VzdG9tRWxlbWVudHMuZGVmaW5lKHJlZ2lzdHJhdGlvbk5hbWUsIGtsYXNzKTtcbiAgICAgICAgcmV0dXJuIHJlZ2lzdHJhdGlvbk5hbWU7XG4gICAgICB9O1xuXG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoa2xhc3MsICdwcm90b3R5cGVDaGFpbkluZm8nLCB7XG4gICAgICAgIGdldCgpIHtcbiAgICAgICAgICBjb25zdCBjaGFpbiA9IFtrbGFzc107XG4gICAgICAgICAgbGV0IHBhcmVudFByb3RvID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKGtsYXNzKTtcbiAgICAgICAgICB3aGlsZSAocGFyZW50UHJvdG8gIT09IEhUTUxFbGVtZW50KSB7XG4gICAgICAgICAgICBjaGFpbi5wdXNoKHBhcmVudFByb3RvKTtcbiAgICAgICAgICAgIHBhcmVudFByb3RvID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKHBhcmVudFByb3RvKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgY2hhaW4ucHVzaChwYXJlbnRQcm90byk7XG4gICAgICAgICAgcmV0dXJuIGNoYWluO1xuICAgICAgICB9LFxuICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgICB9KTtcblxuICAgICAgcmV0dXJuIGtsYXNzO1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICBEQlVJV2ViQ29tcG9uZW50QmFzZSxcbiAgICAgIGRlZmluZUNvbW1vblN0YXRpY01ldGhvZHMsXG4gICAgICBSZWdpc3RlcmFibGVcbiAgICB9O1xuICB9KTtcbn1cbiIsIlxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgREJVSVdlYkNvbXBvbmVudE1lc3NhZ2Uge1xuICBjb25zdHJ1Y3Rvcih7XG4gICAgY2hhbm5lbCwgbWVzc2FnZSwgZGF0YSwgc291cmNlLCByZW1lbWJlck5vZGVzUGF0aCwgbWV0YWRhdGFcbiAgfSkge1xuICAgIHRoaXMuX2NoYW5uZWwgPSBjaGFubmVsO1xuICAgIHRoaXMuX21lc3NhZ2UgPSBtZXNzYWdlO1xuICAgIHRoaXMuX2RhdGEgPSBkYXRhO1xuICAgIHRoaXMuX3NvdXJjZSA9IHNvdXJjZTsgLy8gaW5zdGFuY2Ugb2Ygbm9kZSBjcmVhdGluZyB0aGUgbWVzc2FnZVxuICAgIHRoaXMuX3JlbWVtYmVyTm9kZXNQYXRoID0gcmVtZW1iZXJOb2Rlc1BhdGg7XG4gICAgLy8gY2FuIGNvbnRhaW4gZmllbGRzIGxpa2UgdGFyZ2V0VHlwZTogY2hpbGRyZW4gfCBwYXJlbnQgb3Igd2hhdGV2ZXIgZWxzZVxuICAgIHRoaXMuX21ldGFkYXRhID0gbWV0YWRhdGE7XG5cbiAgICAvLyBpbnRlcm5hbHNcbiAgICB0aGlzLl9zaG91bGRQcm9wYWdhdGUgPSB0cnVlO1xuICAgIHRoaXMuX3Zpc2l0ZWROb2RlcyA9IFtdO1xuICB9XG5cbiAgZ2V0IGNsb25lT3JJbnN0YW5jZSgpIHtcbiAgICAvLyBUaGUgY2xvbmUgb25seSBtYWtlcyBzZW5zZSBpZiB3ZSdyZSByZW1lbWJlcmluZyB0aGUgbm9kZXMgcGF0aC5cbiAgICAvLyBJZiB3ZSBkb24ndCBuZWVkIHRoYXQsIHJldXNpbmcgdGhlIGluc3RhbmNlIHNob3VsZCBiZSBmaW5lLlxuICAgIGlmICghdGhpcy5yZW1lbWJlck5vZGVzUGF0aCkgcmV0dXJuIHRoaXM7XG4gICAgY29uc3QgbWVzc2FnZUNsb25lID0gbmV3IERCVUlXZWJDb21wb25lbnRNZXNzYWdlKHtcbiAgICAgIGNoYW5uZWw6IHRoaXMuY2hhbm5lbCxcbiAgICAgIG1lc3NhZ2U6IHRoaXMubWVzc2FnZSxcbiAgICAgIGRhdGE6IHRoaXMuZGF0YSxcbiAgICAgIHNvdXJjZTogdGhpcy5zb3VyY2UsXG4gICAgICByZW1lbWJlck5vZGVzUGF0aDogdGhpcy5yZW1lbWJlck5vZGVzUGF0aCxcbiAgICAgIG1ldGFkYXRhOiB0aGlzLm1ldGFkYXRhXG4gICAgfSk7XG4gICAgbWVzc2FnZUNsb25lLl9zaG91bGRQcm9wYWdhdGUgPSB0aGlzLnNob3VsZFByb3BhZ2F0ZTtcbiAgICBtZXNzYWdlQ2xvbmUuX3Zpc2l0ZWROb2RlcyA9IFsuLi50aGlzLnZpc2l0ZWROb2Rlc107XG4gICAgcmV0dXJuIG1lc3NhZ2VDbG9uZTtcbiAgfVxuXG4gIGFwcGVuZFZpc2l0ZWROb2RlKG5vZGUpIHtcbiAgICBpZiAoIXRoaXMucmVtZW1iZXJOb2Rlc1BhdGgpIHJldHVybjtcbiAgICB0aGlzLl92aXNpdGVkTm9kZXMucHVzaChub2RlKTtcbiAgfVxuXG4gIHN0b3BQcm9wYWdhdGlvbigpIHtcbiAgICB0aGlzLl9zaG91bGRQcm9wYWdhdGUgPSBmYWxzZTtcbiAgfVxuXG4gIGdldCBzaG91bGRQcm9wYWdhdGUoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3Nob3VsZFByb3BhZ2F0ZTtcbiAgfVxuXG4gIGdldCBjaGFubmVsKCkge1xuICAgIHJldHVybiB0aGlzLl9jaGFubmVsO1xuICB9XG5cbiAgZ2V0IG1lc3NhZ2UoKSB7XG4gICAgcmV0dXJuIHRoaXMuX21lc3NhZ2U7XG4gIH1cblxuICBnZXQgZGF0YSgpIHtcbiAgICByZXR1cm4gdGhpcy5fZGF0YTtcbiAgfVxuXG4gIGdldCBzb3VyY2UoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3NvdXJjZTtcbiAgfVxuXG4gIGdldCByZW1lbWJlck5vZGVzUGF0aCgpIHtcbiAgICByZXR1cm4gdGhpcy5fcmVtZW1iZXJOb2Rlc1BhdGg7XG4gIH1cblxuICBnZXQgbWV0YWRhdGEoKSB7XG4gICAgcmV0dXJuIHRoaXMuX21ldGFkYXRhO1xuICB9XG5cbiAgZ2V0IHZpc2l0ZWROb2RlcygpIHtcbiAgICByZXR1cm4gWy4uLnRoaXMuX3Zpc2l0ZWROb2Rlc107XG4gIH1cblxufVxuXG4iLCJcbmltcG9ydCBnZXREQlVJV2ViQ29tcG9uZW50Q29yZSBmcm9tICcuLi9EQlVJV2ViQ29tcG9uZW50Q29yZS9EQlVJV2ViQ29tcG9uZW50Q29yZSc7XG5pbXBvcnQgZW5zdXJlU2luZ2xlUmVnaXN0cmF0aW9uIGZyb20gJy4uLy4uLy4uL2ludGVybmFscy9lbnN1cmVTaW5nbGVSZWdpc3RyYXRpb24nO1xuXG5jb25zdCByZWdpc3RyYXRpb25OYW1lID0gJ2RidWktd2ViLWNvbXBvbmVudC1kdW1teSc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGdldERCVUlXZWJDb21wb25lbnREdW1teSh3aW4pIHtcbiAgcmV0dXJuIGVuc3VyZVNpbmdsZVJlZ2lzdHJhdGlvbih3aW4sIHJlZ2lzdHJhdGlvbk5hbWUsICgpID0+IHtcbiAgICBjb25zdCB7XG4gICAgICBEQlVJV2ViQ29tcG9uZW50QmFzZSxcbiAgICAgIGRlZmluZUNvbW1vblN0YXRpY01ldGhvZHMsXG4gICAgICBSZWdpc3RlcmFibGVcbiAgICB9ID0gZ2V0REJVSVdlYkNvbXBvbmVudENvcmUod2luKTtcblxuICAgIGNsYXNzIERCVUlXZWJDb21wb25lbnREdW1teSBleHRlbmRzIERCVUlXZWJDb21wb25lbnRCYXNlIHtcblxuICAgICAgc3RhdGljIGdldCByZWdpc3RyYXRpb25OYW1lKCkge1xuICAgICAgICByZXR1cm4gcmVnaXN0cmF0aW9uTmFtZTtcbiAgICAgIH1cblxuICAgICAgc3RhdGljIGdldCB0ZW1wbGF0ZUlubmVySFRNTCgpIHtcbiAgICAgICAgcmV0dXJuIGBcbiAgICAgICAgICA8c3R5bGU+XG4gICAgICAgICAgOmhvc3Qge1xuICAgICAgICAgICAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xuICAgICAgICAgICAgd2lkdGg6IDEwMCU7XG4gICAgICAgICAgICBtYXgtd2lkdGg6IDQwMHB4O1xuICAgICAgICAgICAgaGVpZ2h0OiB2YXIoLS1kYnVpLWlucHV0LWhlaWdodCwgNTBweCk7XG4gICAgICAgICAgICBjb2xvcjogbWFyb29uO1xuICAgICAgICAgICAgYm9yZGVyOiAxcHggc29saWQgZ3JheTtcbiAgICAgICAgICAgIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XG4gICAgICAgICAgfVxuICAgICAgICAgIFxuICAgICAgICAgIDpob3N0IGIsIDpob3N0IGRpdlt4LWhhcy1zbG90XSBzcGFuW3gtc2xvdC13cmFwcGVyXSB7XG4gICAgICAgICAgICB1bmljb2RlLWJpZGk6IGJpZGktb3ZlcnJpZGU7XG4gICAgICAgICAgICB0ZXh0LXNoYWRvdzogdmFyKC0tZHVtbXktYi10ZXh0LXNoYWRvdywgbm9uZSk7XG4gICAgICAgICAgfVxuICAgIFxuICAgICAgICAgIDpob3N0KFtkaXI9cnRsXSkgYiB7XG4gICAgICAgICAgICB0ZXh0LWRlY29yYXRpb246IHVuZGVybGluZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgXG4gICAgICAgICAgOmhvc3QoW2Rpcj1sdHJdKSBiIHtcbiAgICAgICAgICAgIHRleHQtZGVjb3JhdGlvbjogb3ZlcmxpbmU7XG4gICAgICAgICAgfVxuICAgIFxuICAgICAgICAgIDpob3N0KFtkaXI9bHRyXSkgI2NvbnRhaW5lciA+IGRpdltkaXI9cnRsXSxcbiAgICAgICAgICA6aG9zdChbZGlyPXJ0bF0pICNjb250YWluZXIgPiBkaXZbZGlyPWx0cl0ge1xuICAgICAgICAgICAgZGlzcGxheTogbm9uZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgXG4gICAgICAgICAgOmhvc3QgI2NvbnRhaW5lciA+IGRpdlt4LWhhcy1zbG90XSB7XG4gICAgICAgICAgICBtYXJnaW4tbGVmdDogMHB4O1xuICAgICAgICAgIH1cbiAgICAgICAgICBcbiAgICAgICAgICAjY29udGFpbmVyIHtcbiAgICAgICAgICAgIHdpZHRoOiAxMDAlO1xuICAgICAgICAgICAgaGVpZ2h0OiAxMDAlO1xuICAgICAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgICAgIGZsZXgtZmxvdzogcm93IG5vd3JhcDtcbiAgICAgICAgICAgIGFsaWduLWl0ZW1zOiBzdHJldGNoO1xuICAgICAgICAgIH1cbiAgICAgICAgICBcbiAgICAgICAgICAjY29udGFpbmVyID4gZGl2IHtcbiAgICAgICAgICAgIGJvcmRlcjogMXB4IHNvbGlkIGdyYXk7XG4gICAgICAgICAgICBib3JkZXItcmFkaXVzOiB2YXIoLS1kdW1teS1pbm5lci1zZWN0aW9ucy1ib3JkZXItcmFkaXVzLCAwcHgpO1xuICAgICAgICAgICAgZmxleDogMSAwIDAlO1xuICAgICAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgICAgIG1hcmdpbjogNXB4O1xuICAgICAgICAgIH1cbiAgICAgICAgICBcbiAgICAgICAgICAjY29udGFpbmVyID4gZGl2ID4gZGl2IHtcbiAgICAgICAgICAgIG1hcmdpbjogYXV0bztcbiAgICAgICAgICB9XG4gICAgICAgICAgXG4gICAgICAgICAgPC9zdHlsZT5cbiAgICAgICAgICBcbiAgICAgICAgICA8ZGl2IGlkPVwiY29udGFpbmVyXCI+XG4gICAgICAgICAgICA8ZGl2IGRpcj1cImx0clwiPlxuICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgIDxiPkR1bW15IHNoYWRvdzwvYj4gW0xUUl1cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgPGRpdiB4LWhhcy1zbG90PlxuICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgIDxzcGFuPls8L3NwYW4+PHNwYW4geC1zbG90LXdyYXBwZXI+PHNsb3Q+PC9zbG90Pjwvc3Bhbj48c3Bhbj5dPC9zcGFuPlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgXG4gICAgICAgICAgICA8ZGl2IGRpcj1cInJ0bFwiPlxuICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgIDxiPkR1bW15IHNoYWRvdzwvYj4gW1JUTF1cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgYDtcbiAgICAgIH1cblxuICAgICAgb25Mb2NhbGVDaGFuZ2UobG9jYWxlKSB7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdvbkxvY2FsZUNoYW5nZScsIGxvY2FsZSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIFJlZ2lzdGVyYWJsZShcbiAgICAgIGRlZmluZUNvbW1vblN0YXRpY01ldGhvZHMoXG4gICAgICAgIERCVUlXZWJDb21wb25lbnREdW1teVxuICAgICAgKVxuICAgICk7XG4gIH0pO1xufVxuXG5nZXREQlVJV2ViQ29tcG9uZW50RHVtbXkucmVnaXN0cmF0aW9uTmFtZSA9IHJlZ2lzdHJhdGlvbk5hbWU7XG5cbiIsIlxuXG5pbXBvcnQgZ2V0REJVSVdlYkNvbXBvbmVudENvcmUgZnJvbSAnLi4vREJVSVdlYkNvbXBvbmVudENvcmUvREJVSVdlYkNvbXBvbmVudENvcmUnO1xuaW1wb3J0IGdldERCVUlXZWJDb21wb25lbnREdW1teSBmcm9tICcuLi9EQlVJV2ViQ29tcG9uZW50RHVtbXkvREJVSVdlYkNvbXBvbmVudER1bW15JztcbmltcG9ydCBlbnN1cmVTaW5nbGVSZWdpc3RyYXRpb24gZnJvbSAnLi4vLi4vLi4vaW50ZXJuYWxzL2Vuc3VyZVNpbmdsZVJlZ2lzdHJhdGlvbic7XG5cbmNvbnN0IHJlZ2lzdHJhdGlvbk5hbWUgPSAnZGJ1aS13ZWItY29tcG9uZW50LWR1bW15LXBhcmVudCc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGdldERCVUlXZWJDb21wb25lbnREdW1teVBhcmVudCh3aW4pIHtcbiAgcmV0dXJuIGVuc3VyZVNpbmdsZVJlZ2lzdHJhdGlvbih3aW4sIHJlZ2lzdHJhdGlvbk5hbWUsICgpID0+IHtcbiAgICBjb25zdCB7XG4gICAgICBEQlVJV2ViQ29tcG9uZW50QmFzZSxcbiAgICAgIGRlZmluZUNvbW1vblN0YXRpY01ldGhvZHMsXG4gICAgICBSZWdpc3RlcmFibGVcbiAgICB9ID0gZ2V0REJVSVdlYkNvbXBvbmVudENvcmUod2luKTtcbiAgICBjb25zdCBEQlVJV2ViQ29tcG9uZW50RHVtbXkgPSBnZXREQlVJV2ViQ29tcG9uZW50RHVtbXkod2luKTtcblxuICAgIGNsYXNzIERCVUlXZWJDb21wb25lbnREdW1teVBhcmVudCBleHRlbmRzIERCVUlXZWJDb21wb25lbnRCYXNlIHtcblxuICAgICAgc3RhdGljIGdldCByZWdpc3RyYXRpb25OYW1lKCkge1xuICAgICAgICByZXR1cm4gcmVnaXN0cmF0aW9uTmFtZTtcbiAgICAgIH1cblxuICAgICAgc3RhdGljIGdldCB0ZW1wbGF0ZUlubmVySFRNTCgpIHtcbiAgICAgICAgcmV0dXJuIGBcbiAgICAgICAgICA8c3R5bGU+XG4gICAgICAgICAgOmhvc3Qge1xuICAgICAgICAgICAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xuICAgICAgICAgICAgd2lkdGg6IDEwMCU7XG4gICAgICAgICAgICBtYXgtd2lkdGg6IDQwMHB4O1xuICAgICAgICAgIH1cbiAgICAgICAgICA8L3N0eWxlPlxuICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICA8Yj5EdW1teSBQYXJlbnQgc2hhZG93PC9iPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICA8ZGJ1aS13ZWItY29tcG9uZW50LWR1bW15PjxzbG90Pjwvc2xvdD48L2RidWktd2ViLWNvbXBvbmVudC1kdW1teT5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICBgO1xuICAgICAgfVxuXG4gICAgICBzdGF0aWMgZ2V0IGRlcGVuZGVuY2llcygpIHtcbiAgICAgICAgcmV0dXJuIFtEQlVJV2ViQ29tcG9uZW50RHVtbXldO1xuICAgICAgfVxuXG4gICAgfVxuXG4gICAgcmV0dXJuIFJlZ2lzdGVyYWJsZShcbiAgICAgIGRlZmluZUNvbW1vblN0YXRpY01ldGhvZHMoXG4gICAgICAgIERCVUlXZWJDb21wb25lbnREdW1teVBhcmVudFxuICAgICAgKVxuICAgICk7XG4gIH0pO1xufVxuXG5nZXREQlVJV2ViQ29tcG9uZW50RHVtbXlQYXJlbnQucmVnaXN0cmF0aW9uTmFtZSA9IHJlZ2lzdHJhdGlvbk5hbWU7XG5cbiIsIlxuaW1wb3J0IGdldERCVUlXZWJDb21wb25lbnRDb3JlIGZyb20gJy4uL0RCVUlXZWJDb21wb25lbnRDb3JlL0RCVUlXZWJDb21wb25lbnRDb3JlJztcbmltcG9ydCBlbnN1cmVTaW5nbGVSZWdpc3RyYXRpb24gZnJvbSAnLi4vLi4vLi4vaW50ZXJuYWxzL2Vuc3VyZVNpbmdsZVJlZ2lzdHJhdGlvbic7XG5pbXBvcnQgRm9jdXNhYmxlIGZyb20gJy4uLy4uL2JlaGF2aW91cnMvRm9jdXNhYmxlJztcblxuY29uc3QgcmVnaXN0cmF0aW9uTmFtZSA9ICdkYnVpLXdlYi1jb21wb25lbnQtZm9ybS1pbnB1dC10ZXh0JztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZ2V0REJVSVdlYkNvbXBvbmVudEZvcm1JbnB1dFRleHQod2luKSB7XG4gIHJldHVybiBlbnN1cmVTaW5nbGVSZWdpc3RyYXRpb24od2luLCByZWdpc3RyYXRpb25OYW1lLCAoKSA9PiB7XG4gICAgY29uc3Qge1xuICAgICAgREJVSVdlYkNvbXBvbmVudEJhc2UsXG4gICAgICBkZWZpbmVDb21tb25TdGF0aWNNZXRob2RzLFxuICAgICAgUmVnaXN0ZXJhYmxlXG4gICAgfSA9IGdldERCVUlXZWJDb21wb25lbnRDb3JlKHdpbik7XG5cbiAgICBjbGFzcyBEQlVJV2ViQ29tcG9uZW50Rm9ybUlucHV0VGV4dCBleHRlbmRzIERCVUlXZWJDb21wb25lbnRCYXNlIHtcblxuICAgICAgc3RhdGljIGdldCByZWdpc3RyYXRpb25OYW1lKCkge1xuICAgICAgICByZXR1cm4gcmVnaXN0cmF0aW9uTmFtZTtcbiAgICAgIH1cblxuICAgICAgc3RhdGljIGdldCB0ZW1wbGF0ZUlubmVySFRNTCgpIHtcbiAgICAgICAgcmV0dXJuIGBcbiAgICAgICAgICA8c3R5bGU+XG4gICAgICAgICAgOmhvc3Qge1xuICAgICAgICAgICAgYWxsOiBpbml0aWFsOyBcbiAgICAgICAgICAgIGRpc3BsYXk6IGlubGluZS1ibG9jaztcbiAgICAgICAgICAgIHdpZHRoOiAxMDAlO1xuICAgICAgICAgICAgLypoZWlnaHQ6IHZhcigtLWRidWktd2ViLWNvbXBvbmVudC1mb3JtLWlucHV0LWhlaWdodCk7Ki9cbiAgICAgICAgICAgIC8qbGluZS1oZWlnaHQ6IHZhcigtLWRidWktd2ViLWNvbXBvbmVudC1mb3JtLWlucHV0LWhlaWdodCk7Ki9cbiAgICAgICAgICAgIGhlaWdodDogMzAwcHg7XG4gICAgICAgICAgICBwYWRkaW5nOiAwcHg7XG4gICAgICAgICAgICBmb250LXNpemU6IDE4cHg7XG4gICAgICAgICAgICBjb2xvcjogdmFyKC0tZGJ1aS13ZWItY29tcG9uZW50LWZvcm0taW5wdXQtY29sb3IpO1xuICAgICAgICAgICAgLypiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1kYnVpLXdlYi1jb21wb25lbnQtZm9ybS1pbnB1dC1iYWNrZ3JvdW5kLWNvbG9yKTsqL1xuICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgyNTUsIDEwMCwgMCwgMC4xKTtcbiAgICAgICAgICAgIHVuaWNvZGUtYmlkaTogYmlkaS1vdmVycmlkZTtcbiAgICAgICAgICAgIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XG4gICAgICAgICAgICBib3JkZXI6IG5vbmU7XG4gICAgICAgICAgICBib3JkZXItYm90dG9tOiB2YXIoLS1kYnVpLXdlYi1jb21wb25lbnQtZm9ybS1pbnB1dC1ib3JkZXItd2lkdGgpIHZhcigtLWRidWktd2ViLWNvbXBvbmVudC1mb3JtLWlucHV0LWJvcmRlci1zdHlsZSkgdmFyKC0tZGJ1aS13ZWItY29tcG9uZW50LWZvcm0taW5wdXQtYm9yZGVyLWNvbG9yKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgXG4gICAgICAgICAgOmhvc3QgW3RhYmluZGV4XSB7XG4gICAgICAgICAgICB3aWR0aDogMTAwJTtcbiAgICAgICAgICAgIGhlaWdodDogNTBweDtcbiAgICAgICAgICAgIGxpbmUtaGVpZ2h0OiA1MHB4O1xuICAgICAgICAgICAgYm9yZGVyOiBub25lO1xuICAgICAgICAgICAgbWFyZ2luOiAwcHg7XG4gICAgICAgICAgICBwYWRkaW5nOiAwcHg7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiB0cmFuc3BhcmVudDtcbiAgICAgICAgICAgIGJvcmRlci1yYWRpdXM6IDBweDtcbiAgICAgICAgICAgIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XG4gICAgICAgICAgICB1bmljb2RlLWJpZGk6IGJpZGktb3ZlcnJpZGU7XG4gICAgICAgICAgfVxuICAgICAgICAgIFxuICAgICAgICAgIDpob3N0IFt0YWJpbmRleF06Zm9jdXMge1xuICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgyNTUsIDAsIDAsIC4zKTtcbiAgICAgICAgICAgIG91dGxpbmU6IG5vbmU7XG4gICAgICAgICAgfVxuICAgIFxuICAgICAgICAgIDpob3N0KFtmb2N1c2VkXSkge1xuICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgwLCAyNTUsIDAsIC4zKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgXG4gICAgICAgICAgLyo6aG9zdChbZGlzYWJsZWRdKSB7Ki9cbiAgICAgICAgICAgIC8qYmFja2dyb3VuZC1jb2xvcjogcmdiYSgwLCAwLCAwLCAuMyk7Ki9cbiAgICAgICAgICAvKn0qL1xuICAgIFxuICAgICAgICAgIDpob3N0KFtoaWRkZW5dKSB7XG4gICAgICAgICAgICBkaXNwbGF5OiBub25lO1xuICAgICAgICAgIH1cbiAgICBcbiAgICAgICAgICA6aG9zdChbZGlyPXJ0bF0pIHtcbiAgICAgICAgICBcbiAgICAgICAgICB9XG4gICAgICAgICAgXG4gICAgICAgICAgOmhvc3QoW2Rpcj1sdHJdKSB7XG4gICAgICAgICAgXG4gICAgICAgICAgfVxuICAgICAgICAgIDwvc3R5bGU+XG4gICAgICAgICAgPHA+REJVSVdlYkNvbXBvbmVudEZvcm1JbnB1dFRleHQ8L3A+XG4gICAgICAgICAgPGRpdiBjb250ZW50ZWRpdGFibGU9XCJ0cnVlXCIgdGFiaW5kZXg9XCIwXCI+PC9kaXY+XG4gICAgICAgICAgPGRpdiBjb250ZW50ZWRpdGFibGU9XCJ0cnVlXCIgdGFiaW5kZXg9XCIwXCI+PC9kaXY+XG4gICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgdGFiaW5kZXg9XCIwXCIgLz5cbiAgICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiB0YWJpbmRleD1cIjBcIiAvPlxuICAgICAgICBgO1xuICAgICAgfVxuXG4gICAgICBzdGF0aWMgZ2V0IHByb3BlcnRpZXNUb0RlZmluZSgpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICByb2xlOiAnZm9ybS1pbnB1dCdcbiAgICAgICAgfTtcbiAgICAgIH1cblxuICAgICAgb25Mb2NhbGVDaGFuZ2UobG9jYWxlKSB7XG4gICAgICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgICAgICAgLyogZXNsaW50IG5vLWNvbnNvbGU6IDAgKi9cbiAgICAgICAgICAvLyBjb25zb2xlLmxvZygnb25Mb2NhbGVDaGFuZ2UnLCBsb2NhbGUpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICB9XG5cbiAgICByZXR1cm4gUmVnaXN0ZXJhYmxlKFxuICAgICAgRm9jdXNhYmxlKFxuICAgICAgICBkZWZpbmVDb21tb25TdGF0aWNNZXRob2RzKFxuICAgICAgICAgIERCVUlXZWJDb21wb25lbnRGb3JtSW5wdXRUZXh0XG4gICAgICAgIClcbiAgICAgIClcbiAgICApO1xuXG4gIH0pO1xufVxuXG5nZXREQlVJV2ViQ29tcG9uZW50Rm9ybUlucHV0VGV4dC5yZWdpc3RyYXRpb25OYW1lID0gcmVnaXN0cmF0aW9uTmFtZTtcblxuIiwiXG5pbXBvcnQgZ2V0REJVSVdlYkNvbXBvbmVudENvcmUgZnJvbSAnLi4vREJVSVdlYkNvbXBvbmVudENvcmUvREJVSVdlYkNvbXBvbmVudENvcmUnO1xuaW1wb3J0IGVuc3VyZVNpbmdsZVJlZ2lzdHJhdGlvbiBmcm9tICcuLi8uLi8uLi9pbnRlcm5hbHMvZW5zdXJlU2luZ2xlUmVnaXN0cmF0aW9uJztcblxuY29uc3QgcmVnaXN0cmF0aW9uTmFtZSA9ICdkYnVpLXdlYi1jb21wb25lbnQtaWNvbic7XG5cbi8vIGh0dHBzOi8vZ2l0aHViLmNvbS9nb3JhbmdhamljL3JlYWN0LWljb24tYmFzZS9ibG9iL21hc3Rlci9pbmRleC5qc1xuLy8gaHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tL2dvcmFuZ2FqaWMvcmVhY3QtaWNvbnMvbWFzdGVyL2ljb25zL2dvL21hcmstZ2l0aHViLnN2Z1xuLy8gaHR0cHM6Ly9naXRodWIuY29tL2dvcmFuZ2FqaWMvcmVhY3QtaWNvbnNcbi8vIGh0dHBzOi8vZ2l0aHViLmNvbS9nb3JhbmdhamljL3JlYWN0LWljb25zL2Jsb2IvbWFzdGVyL2dvL21hcmstZ2l0aHViLmpzXG4vLyBodHRwczovL2dvcmFuZ2FqaWMuZ2l0aHViLmlvL3JlYWN0LWljb25zL2dvLmh0bWxcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZ2V0REJVSVdlYkNvbXBvbmVudEljb24od2luKSB7XG4gIHJldHVybiBlbnN1cmVTaW5nbGVSZWdpc3RyYXRpb24od2luLCByZWdpc3RyYXRpb25OYW1lLCAoKSA9PiB7XG4gICAgY29uc3Qge1xuICAgICAgREJVSVdlYkNvbXBvbmVudEJhc2UsXG4gICAgICBkZWZpbmVDb21tb25TdGF0aWNNZXRob2RzLFxuICAgICAgUmVnaXN0ZXJhYmxlXG4gICAgfSA9IGdldERCVUlXZWJDb21wb25lbnRDb3JlKHdpbik7XG5cbiAgICBjbGFzcyBEQlVJV2ViQ29tcG9uZW50SWNvbiBleHRlbmRzIERCVUlXZWJDb21wb25lbnRCYXNlIHtcblxuICAgICAgc3RhdGljIGdldCByZWdpc3RyYXRpb25OYW1lKCkge1xuICAgICAgICByZXR1cm4gcmVnaXN0cmF0aW9uTmFtZTtcbiAgICAgIH1cblxuICAgICAgc3RhdGljIGdldCB0ZW1wbGF0ZUlubmVySFRNTCgpIHtcbiAgICAgICAgcmV0dXJuIGBcbiAgICAgICAgICA8c3R5bGU+XG4gICAgICAgICAgOmhvc3Qge1xuICAgICAgICAgICAgYWxsOiBpbml0aWFsO1xuICAgICAgICAgICAgZm9udC1zaXplOiBpbmhlcml0OyBcbiAgICAgICAgICAgIGRpc3BsYXk6IGlubGluZS1ibG9jaztcbiAgICAgICAgICAgIHdpZHRoOiAxZW07XG4gICAgICAgICAgICBoZWlnaHQ6IDFlbTtcbiAgICAgICAgICAgIHZlcnRpY2FsLWFsaWduOiBtaWRkbGU7XG4gICAgICAgICAgICBjb2xvcjogaW5oZXJpdDtcbiAgICAgICAgICB9XG4gICAgICAgICAgOmhvc3Qgc3ZnIHtcbiAgICAgICAgICAgIGRpc3BsYXk6IGlubGluZS1ibG9jaztcbiAgICAgICAgICAgIHdpZHRoOiAxZW07XG4gICAgICAgICAgICBoZWlnaHQ6IDFlbTtcbiAgICAgICAgICAgIHZlcnRpY2FsLWFsaWduOiB0b3A7XG4gICAgICAgICAgICBmaWxsOiBjdXJyZW50Q29sb3I7XG4gICAgICAgICAgfVxuICAgICAgICAgIDwvc3R5bGU+XG4gICAgICAgICAgPHN2ZyB2aWV3Qm94PVwiMCAwIDQwIDQwXCIgIHByZXNlcnZlQXNwZWN0UmF0aW89XCJ4TWlkWU1pZCBtZWV0XCIgPlxuICAgICAgICAgICAgPGc+PHBhdGggZD1cIlwiLz48L2c+XG4gICAgICAgICAgPC9zdmc+XG4gICAgICAgIGA7XG4gICAgICB9XG5cbiAgICAgIHN0YXRpYyBnZXQgcHJvcGVydGllc1RvVXBncmFkZSgpIHtcbiAgICAgICAgY29uc3QgaW5oZXJpdGVkUHJvcGVydGllc1RvVXBncmFkZSA9IHN1cGVyLnByb3BlcnRpZXNUb1VwZ3JhZGUgfHwgW107XG4gICAgICAgIHJldHVybiBbLi4uaW5oZXJpdGVkUHJvcGVydGllc1RvVXBncmFkZSwgJ3NoYXBlJ107XG4gICAgICB9XG5cbiAgICAgIHN0YXRpYyBnZXQgb2JzZXJ2ZWRBdHRyaWJ1dGVzKCkge1xuICAgICAgICBjb25zdCBpbmhlcml0ZWRPYnNlcnZlZEF0dHJpYnV0ZXMgPSBzdXBlci5vYnNlcnZlZEF0dHJpYnV0ZXMgfHwgW107XG4gICAgICAgIHJldHVybiBbLi4uaW5oZXJpdGVkT2JzZXJ2ZWRBdHRyaWJ1dGVzLCAnc2hhcGUnXTtcbiAgICAgIH1cblxuICAgICAgZ2V0IHNoYXBlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXRBdHRyaWJ1dGUoJ3NoYXBlJyk7XG4gICAgICB9XG5cbiAgICAgIHNldCBzaGFwZSh2YWx1ZSkge1xuICAgICAgICBjb25zdCBoYXNWYWx1ZSA9ICFbdW5kZWZpbmVkLCBudWxsXS5pbmNsdWRlcyh2YWx1ZSk7XG4gICAgICAgIGNvbnN0IHN0cmluZ1ZhbHVlID0gU3RyaW5nKHZhbHVlKTtcbiAgICAgICAgaWYgKGhhc1ZhbHVlKSB7XG4gICAgICAgICAgdGhpcy5zZXRBdHRyaWJ1dGUoJ3NoYXBlJywgc3RyaW5nVmFsdWUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMucmVtb3ZlQXR0cmlidXRlKCdzaGFwZScpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjayhuYW1lLCBvbGRWYWx1ZSwgbmV3VmFsdWUpIHtcbiAgICAgICAgc3VwZXIuYXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrICYmXG4gICAgICAgICAgc3VwZXIuYXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrKG5hbWUsIG9sZFZhbHVlLCBuZXdWYWx1ZSk7XG5cbiAgICAgICAgY29uc3QgaGFzVmFsdWUgPSAhW3VuZGVmaW5lZCwgbnVsbF0uaW5jbHVkZXMobmV3VmFsdWUpO1xuICAgICAgICBpZiAobmFtZSA9PT0gJ3NoYXBlJykge1xuICAgICAgICAgIGhhc1ZhbHVlID8gdGhpcy5fc2V0U2hhcGUoKSA6IHRoaXMuX3JlbW92ZVNoYXBlKCk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgX3NldFNoYXBlKCkge1xuICAgICAgICBjb25zdCBwYXRoID0gdGhpcy5jaGlsZHJlblRyZWUucXVlcnlTZWxlY3Rvcignc3ZnIGcgcGF0aCcpO1xuICAgICAgICBwYXRoLnNldEF0dHJpYnV0ZSgnZCcsIHRoaXMuc2hhcGUpO1xuICAgICAgfVxuXG4gICAgICBfcmVtb3ZlU2hhcGUoKSB7XG4gICAgICAgIGNvbnN0IHBhdGggPSB0aGlzLmNoaWxkcmVuVHJlZS5xdWVyeVNlbGVjdG9yKCdzdmcgZyBwYXRoJyk7XG4gICAgICAgIHBhdGguc2V0QXR0cmlidXRlKCdkJywgJycpO1xuICAgICAgfVxuXG4gICAgfVxuXG4gICAgcmV0dXJuIFJlZ2lzdGVyYWJsZShcbiAgICAgIGRlZmluZUNvbW1vblN0YXRpY01ldGhvZHMoXG4gICAgICAgIERCVUlXZWJDb21wb25lbnRJY29uXG4gICAgICApXG4gICAgKTtcblxuICB9KTtcbn1cblxuZ2V0REJVSVdlYkNvbXBvbmVudEljb24ucmVnaXN0cmF0aW9uTmFtZSA9IHJlZ2lzdHJhdGlvbk5hbWU7XG5cbiIsImltcG9ydCBhcHBlbmRTdHlsZXMgZnJvbSAnLi4vLi4vaW50ZXJuYWxzL2FwcGVuZFN0eWxlcyc7XG5cbi8qKlxuKiBAcGFyYW0gY29tcG9uZW50cyBBcnJheTxPYmplY3Q+IFt7XG4qICByZWdpc3RyYXRpb25OYW1lLFxuKiAgY29tcG9uZW50U3R5bGUsXG4qICAuLi5cbiogfV1cbiogQHJldHVybnMgY29tcG9uZW50cyBBcnJheTxPYmplY3Q+XG4qL1xuY29uc3QgZGJ1aVdlYkNvbXBvbmVudHNTZXRVcCA9ICh3aW4pID0+IChjb21wb25lbnRzKSA9PiB7XG4gIHJldHVybiBhcHBlbmRTdHlsZXMod2luKShjb21wb25lbnRzKTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGRidWlXZWJDb21wb25lbnRzU2V0VXA7XG4iLCJcbi8vIEhlbHBlcnNcbmltcG9ydCBkYnVpV2ViQ29tcG9uZW50c1NldFVwIGZyb20gJy4vd2ViLWNvbXBvbmVudHMvaGVscGVycy9kYnVpV2ViQ29tcG9uZW50c1NldHVwJztcblxuLy8gSW50ZXJuYWxzXG5pbXBvcnQgZW5zdXJlU2luZ2xlUmVnaXN0cmF0aW9uIGZyb20gJy4vaW50ZXJuYWxzL2Vuc3VyZVNpbmdsZVJlZ2lzdHJhdGlvbic7XG5cbi8vIENvbXBvbmVudEJhc2VcbmltcG9ydCBnZXREQlVJV2ViQ29tcG9uZW50Q29yZSBmcm9tICcuL3dlYi1jb21wb25lbnRzL2NvbXBvbmVudHMvREJVSVdlYkNvbXBvbmVudENvcmUvREJVSVdlYkNvbXBvbmVudENvcmUnO1xuXG4vLyBCZWhhdmlvdXJzXG5pbXBvcnQgRm9jdXNhYmxlIGZyb20gJy4vd2ViLWNvbXBvbmVudHMvYmVoYXZpb3Vycy9Gb2N1c2FibGUnO1xuXG4vLyBTZXJ2aWNlc1xuaW1wb3J0IGdldERCVUlMb2NhbGVTZXJ2aWNlIGZyb20gJy4vc2VydmljZXMvREJVSUxvY2FsZVNlcnZpY2UnO1xuaW1wb3J0IGdldERCVUlJMThuU2VydmljZSBmcm9tICcuL3NlcnZpY2VzL0RCVUlJMThuU2VydmljZSc7XG5cbi8vIFV0aWxzXG5pbXBvcnQgZm9ybWF0dGVycyBmcm9tICcuL3V0aWxzL2Zvcm1hdHRlcnMnO1xuaW1wb3J0IHRyYWl0cyBmcm9tICcuL3V0aWxzL3RyYWl0cyc7XG5pbXBvcnQgdGVtcGxhdGUgZnJvbSAnLi91dGlscy90ZW1wbGF0ZSc7XG5pbXBvcnQgb25TY3JlZW5Db25zb2xlIGZyb20gJy4vdXRpbHMvb25TY3JlZW5Db25zb2xlJztcblxuLy8gQ29tcG9uZW50c1xuaW1wb3J0IGdldERCVUlXZWJDb21wb25lbnREdW1teSBmcm9tICcuL3dlYi1jb21wb25lbnRzL2NvbXBvbmVudHMvREJVSVdlYkNvbXBvbmVudER1bW15L0RCVUlXZWJDb21wb25lbnREdW1teSc7XG5pbXBvcnQgZ2V0REJVSVdlYkNvbXBvbmVudER1bW15UGFyZW50IGZyb20gJy4vd2ViLWNvbXBvbmVudHMvY29tcG9uZW50cy9EQlVJV2ViQ29tcG9uZW50RHVtbXlQYXJlbnQvREJVSVdlYkNvbXBvbmVudER1bW15UGFyZW50JztcbmltcG9ydCBnZXREQlVJV2ViQ29tcG9uZW50Rm9ybUlucHV0VGV4dCBmcm9tICcuL3dlYi1jb21wb25lbnRzL2NvbXBvbmVudHMvREJVSVdlYkNvbXBvbmVudEZvcm1JbnB1dFRleHQvREJVSVdlYkNvbXBvbmVudEZvcm1JbnB1dFRleHQnO1xuaW1wb3J0IGdldERCVUlXZWJDb21wb25lbnRJY29uIGZyb20gJy4vd2ViLWNvbXBvbmVudHMvY29tcG9uZW50cy9EQlVJV2ViQ29tcG9uZW50SWNvbi9EQlVJV2ViQ29tcG9uZW50SWNvbic7XG5cbmNvbnN0IHJlZ2lzdHJhdGlvbnMgPSB7XG4gIFtnZXREQlVJV2ViQ29tcG9uZW50RHVtbXkucmVnaXN0cmF0aW9uTmFtZV06XG4gICAgZ2V0REJVSVdlYkNvbXBvbmVudER1bW15LFxuICBbZ2V0REJVSVdlYkNvbXBvbmVudER1bW15UGFyZW50LnJlZ2lzdHJhdGlvbk5hbWVdOlxuICAgIGdldERCVUlXZWJDb21wb25lbnREdW1teVBhcmVudCxcbiAgW2dldERCVUlXZWJDb21wb25lbnRGb3JtSW5wdXRUZXh0LnJlZ2lzdHJhdGlvbk5hbWVdOlxuICAgIGdldERCVUlXZWJDb21wb25lbnRGb3JtSW5wdXRUZXh0LFxuICBbZ2V0REJVSVdlYkNvbXBvbmVudEljb24ucmVnaXN0cmF0aW9uTmFtZV06XG4gICAgZ2V0REJVSVdlYkNvbXBvbmVudEljb25cbn07XG5cbi8qXG5UaGlzIGhlbHBlciBmdW5jdGlvbiBpcyBqdXN0IGZvciBjb252ZW5pZW5jZS5cblVzaW5nIGl0IGltcGxpZXMgdGhhdCBlbnRpcmUgREJVSVdlYkNvbXBvbmVudHMgbGlicmFyeSBpcyBhbHJlYWR5IGxvYWRlZC5cbkl0IGlzIHVzZWZ1bCBlc3BlY2lhbGx5IHdoZW4gd29ya2luZyB3aXRoIGRpc3RyaWJ1dGlvbiBidWlsZC5cbklmIG9uZSB3YW50cyB0byBsb2FkIGp1c3Qgb25lIHdlYi1jb21wb25lbnQgb3IgYSBzdWJzZXQgb2YgY29yZVxudGhleSBzaG91bGQgYmUgbG9hZGVkIGZyb20gbm9kZV9tb2R1bGVzL2Rldi1ib3gtdWkvY29yZSBieSB0aGVpciBwYXRoXG5leDpcbmltcG9ydCBTb21lQ29tcG9uZW50TG9hZGVyIGZyb20gbm9kZV9tb2R1bGVzL2Rldi1ib3gtdWkvY29yZS9wYXRoL3RvL1NvbWVDb21wb25lbnQ7XG4qL1xuZnVuY3Rpb24gcXVpY2tTZXR1cEFuZExvYWQod2luID0gd2luZG93KSB7XG4gIC8qKlxuICAgKiBAcGFyYW0gY29tcG9uZW50cyBPYmplY3Qge1xuICAgKiAgcmVnaXN0cmF0aW9uTmFtZSxcbiAgICogIGNvbXBvbmVudFN0eWxlXG4gICAqIH1cbiAgICogQHJldHVybiBPYmplY3QgeyA8cmVnaXN0cmF0aW9uTmFtZT4sIDxjb21wb25lbnRDbGFzcz4gfVxuICAgKi9cbiAgcmV0dXJuIGZ1bmN0aW9uIChjb21wb25lbnRzKSB7XG4gICAgcmV0dXJuIGRidWlXZWJDb21wb25lbnRzU2V0VXAod2luKShjb21wb25lbnRzKVxuICAgICAgLnJlZHVjZSgoYWNjLCB7IHJlZ2lzdHJhdGlvbk5hbWUgfSkgPT4ge1xuICAgICAgICBjb25zdCBjb21wb25lbnRDbGFzcyA9IHJlZ2lzdHJhdGlvbnNbcmVnaXN0cmF0aW9uTmFtZV0od2luZG93KTtcbiAgICAgICAgY29tcG9uZW50Q2xhc3MucmVnaXN0ZXJTZWxmKCk7XG4gICAgICAgIGFjY1tyZWdpc3RyYXRpb25OYW1lXSA9IGNvbXBvbmVudENsYXNzO1xuICAgICAgICByZXR1cm4gYWNjO1xuICAgICAgfSwge30pO1xuICB9O1xufVxuXG5leHBvcnQge1xuICByZWdpc3RyYXRpb25zLFxuXG4gIC8vIEhlbHBlcnNcbiAgcXVpY2tTZXR1cEFuZExvYWQsXG4gIGRidWlXZWJDb21wb25lbnRzU2V0VXAsXG5cbiAgLy8gSW50ZXJuYWxzXG4gIGVuc3VyZVNpbmdsZVJlZ2lzdHJhdGlvbixcblxuICAvLyBDb21wb25lbnRDb3JlXG4gIGdldERCVUlXZWJDb21wb25lbnRDb3JlLFxuXG4gIC8vIEJlaGF2aW91cnNcbiAgRm9jdXNhYmxlLFxuXG4gIC8vIFNlcnZpY2VzXG4gIGdldERCVUlMb2NhbGVTZXJ2aWNlLFxuICBnZXREQlVJSTE4blNlcnZpY2UsXG5cbiAgLy8gVXRpbHNcbiAgZm9ybWF0dGVycyxcbiAgdHJhaXRzLFxuICB0ZW1wbGF0ZSxcbiAgb25TY3JlZW5Db25zb2xlLFxuXG4gIC8vIENvbXBvbmVudHNcbiAgZ2V0REJVSVdlYkNvbXBvbmVudER1bW15LFxuICBnZXREQlVJV2ViQ29tcG9uZW50RHVtbXlQYXJlbnQsXG4gIGdldERCVUlXZWJDb21wb25lbnRGb3JtSW5wdXRUZXh0LFxuICBnZXREQlVJV2ViQ29tcG9uZW50SWNvblxufTtcblxuLyogZXNsaW50IG5vLWNvbnNvbGU6IDAgKi9cblxubGV0IGJ1aWxkID0gJ3Byb2R1Y3Rpb24nO1xuXG5pZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICBidWlsZCA9ICdkZXZlbG9wJztcbn1cblxuY29uc29sZS5sb2coYFVzaW5nIERCVUlXZWJDb21wb25lbnRzRGlzdExpYiAke2J1aWxkfSBidWlsZC5gKTtcblxuIl19
