require=(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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
const _appendStyle = exports._appendStyle = win => (registrationName, componentStyle) => {
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
    _appendStyle(win)(registrationName, componentStyle);
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

/**
 *
 * @param win Window
 * @param name String
 * @param callback Function
 * @return *
 */
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

var _ensureSingleRegistration = require('../internals/ensureSingleRegistration');

var _ensureSingleRegistration2 = _interopRequireDefault(_ensureSingleRegistration);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const emptyObj = {};

const registrationName = 'DBUII18nService';

function getDBUII18nService(win) {
  return (0, _ensureSingleRegistration2.default)(win, registrationName, () => {
    class DBUII18nService {
      constructor() {
        this._translations = {};
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

      translate(msg, lang) {
        return (this.translations[lang] || emptyObj)[msg];
      }

      get translations() {
        return this._translations;
      }
    }

    const dbuiI18nService = new DBUII18nService();
    return dbuiI18nService;
  });
}

},{"../internals/ensureSingleRegistration":3}],5:[function(require,module,exports){
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
    class DBUILocaleService {
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

    const dbuiLocaleService = new DBUILocaleService();
    return dbuiLocaleService;
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
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

// import onScreenConsole from '../utils/onScreenConsole';

const _cssDisableSelection = node => {
  node.style.cursor = 'default';
  node.style.MozUserSelect = 'none';
  node.style.WebkitUserSelect = 'none';
  node.style.MsUserSelect = 'none';
  node.style.userSelect = 'none';
};

const _cssEnableSelection = node => {
  node.style.cursor = 'auto';
  node.style.MozUserSelect = null;
  node.style.WebkitUserSelect = null;
  node.style.MsUserSelect = null;
  node.style.userSelect = null;
};

const _jsDisableSelection = node => {
  node.addEventListener('mousemove', _killSelection);
  node.addEventListener('touchmove', _killSelection);
  node.addEventListener('mouseup', _enableSelection);
  node.addEventListener('touchend', _enableSelection);
  node.addEventListener('touchcancel', _enableSelection);
};

const _jsEnableSelection = node => {
  node.removeEventListener('mousemove', _killSelection);
  node.removeEventListener('touchmove', _killSelection);
  node.removeEventListener('mouseup', _enableSelection);
  node.removeEventListener('touchend', _enableSelection);
  node.removeEventListener('touchcancel', _enableSelection);
};

const _killSelection = e => {
  const node = e.target;
  const doc = node.ownerDocument;
  const win = doc.defaultView;
  switch (e.type) {
    case 'mousemove':
    case 'touchmove':
      win.getSelection && win.getSelection().removeAllRanges();
      break;
    default:
    // pass
  }
};

const _disableSelection = e => {
  const node = e.target;
  const doc = node.ownerDocument;
  const win = doc.defaultView;
  // first clear any current selection
  win.getSelection && win.getSelection().removeAllRanges();
  // then disable further selection
  // 1. by style
  _cssDisableSelection(doc.body);
  // 2. by adding event listeners
  _jsDisableSelection(doc);
};

const _enableSelection = e => {
  const node = e.target;
  const doc = node.ownerDocument;
  // enable further selection
  // 1. by style
  _cssEnableSelection(doc.body);
  // 2. by removing event listeners
  _jsEnableSelection(doc);
};

const _handleTapStart = e => {
  // on tablet e.preventDefault() prevents
  // - selection,
  // - tap-highlight,
  // - triggering/doubling corresponding mouse events.
  e.preventDefault(); // css doubled: -webkit-tap-highlight-color:rgba(0,0,0,0);
  _disableSelection(e);
};

const disableSelection = node => {
  // onScreenConsole();
  _cssDisableSelection(node);
  node.addEventListener('touchstart', _handleTapStart);
  node.addEventListener('mousedown', _handleTapStart);
};

const enableSelection = node => {
  _cssEnableSelection(node);
  node.removeEventListener('touchstart', _handleTapStart);
  node.removeEventListener('mousedown', _handleTapStart);
};

exports.default = {
  disableSelection,
  enableSelection
};

},{}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getDBUIDummy;

var _DBUIWebComponentCore = require('../DBUIWebComponentCore/DBUIWebComponentCore');

var _DBUIWebComponentCore2 = _interopRequireDefault(_DBUIWebComponentCore);

var _ensureSingleRegistration = require('../../../internals/ensureSingleRegistration');

var _ensureSingleRegistration2 = _interopRequireDefault(_ensureSingleRegistration);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const registrationName = 'dbui-dummy';

function getDBUIDummy(win) {
  return (0, _ensureSingleRegistration2.default)(win, registrationName, () => {
    const {
      DBUIWebComponentBase,
      defineCommonStaticMethods,
      Registerable
    } = (0, _DBUIWebComponentCore2.default)(win);

    class DBUIDummy extends DBUIWebComponentBase {

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
    }

    return Registerable(defineCommonStaticMethods(DBUIDummy));
  });
}

getDBUIDummy.registrationName = registrationName;

},{"../../../internals/ensureSingleRegistration":3,"../DBUIWebComponentCore/DBUIWebComponentCore":16}],11:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getDBUIDummyParent;

var _DBUIWebComponentCore = require('../DBUIWebComponentCore/DBUIWebComponentCore');

var _DBUIWebComponentCore2 = _interopRequireDefault(_DBUIWebComponentCore);

var _DBUIDummy = require('../DBUIDummy/DBUIDummy');

var _DBUIDummy2 = _interopRequireDefault(_DBUIDummy);

var _ensureSingleRegistration = require('../../../internals/ensureSingleRegistration');

var _ensureSingleRegistration2 = _interopRequireDefault(_ensureSingleRegistration);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const registrationName = 'dbui-dummy-parent';

function getDBUIDummyParent(win) {
  return (0, _ensureSingleRegistration2.default)(win, registrationName, () => {
    const {
      DBUIWebComponentBase,
      defineCommonStaticMethods,
      Registerable
    } = (0, _DBUIWebComponentCore2.default)(win);
    const DBUIDummy = (0, _DBUIDummy2.default)(win);

    class DBUIDummyParent extends DBUIWebComponentBase {

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
              <dbui-dummy><slot></slot></dbui-dummy>
            </div>
          </div>
        `;
      }

      static get dependencies() {
        return [DBUIDummy];
      }

    }

    return Registerable(defineCommonStaticMethods(DBUIDummyParent));
  });
}

getDBUIDummyParent.registrationName = registrationName;

},{"../../../internals/ensureSingleRegistration":3,"../DBUIDummy/DBUIDummy":10,"../DBUIWebComponentCore/DBUIWebComponentCore":16}],12:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getDBUIFormInputText;

var _DBUIWebComponentCore = require('../DBUIWebComponentCore/DBUIWebComponentCore');

var _DBUIWebComponentCore2 = _interopRequireDefault(_DBUIWebComponentCore);

var _ensureSingleRegistration = require('../../../internals/ensureSingleRegistration');

var _ensureSingleRegistration2 = _interopRequireDefault(_ensureSingleRegistration);

var _Focusable = require('../../decorators/Focusable');

var _Focusable2 = _interopRequireDefault(_Focusable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const registrationName = 'dbui-form-input-text';
/* eslint max-len: 0 */

function getDBUIFormInputText(win) {
  return (0, _ensureSingleRegistration2.default)(win, registrationName, () => {
    const {
      DBUIWebComponentBase,
      defineCommonStaticMethods,
      Registerable
    } = (0, _DBUIWebComponentCore2.default)(win);

    class DBUIFormInputText extends DBUIWebComponentBase {

      static get registrationName() {
        return registrationName;
      }

      static get templateInnerHTML() {
        // noinspection CssUnresolvedCustomProperty
        return `
          <style>
          :host {
            all: initial; 
            display: inline-block;
            width: 100%;
            /*height: var(--dbui-form-input-height);*/
            /*line-height: var(--dbui-form-input-height);*/
            height: 300px;
            padding: 0px;
            font-size: 18px;
            color: var(--dbui-form-input-color);
            /*background-color: var(--dbui-form-input-background-color);*/
            background-color: rgba(255, 100, 0, 0.1);
            unicode-bidi: bidi-override;
            box-sizing: border-box;
            border: none;
            border-bottom: var(--dbui-form-input-border-width) var(--dbui-form-input-border-style) var(--dbui-form-input-border-color);
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
          <p>DBUIFormInputText</p>
          <div contenteditable="true" tabindex="0"></div>
          <div contenteditable="true" tabindex="0"></div>
          <input type="text" tabindex="0" />
          <input type="text" tabindex="0" />
        `;
      }

      static get attributesToDefine() {
        return {
          role: 'form-input'
        };
      }

    }

    return Registerable((0, _Focusable2.default)(defineCommonStaticMethods(DBUIFormInputText)));
  });
}

getDBUIFormInputText.registrationName = registrationName;

},{"../../../internals/ensureSingleRegistration":3,"../../decorators/Focusable":17,"../DBUIWebComponentCore/DBUIWebComponentCore":16}],13:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getDBUIIcon;

var _DBUIWebComponentCore = require('../DBUIWebComponentCore/DBUIWebComponentCore');

var _DBUIWebComponentCore2 = _interopRequireDefault(_DBUIWebComponentCore);

var _ensureSingleRegistration = require('../../../internals/ensureSingleRegistration');

var _ensureSingleRegistration2 = _interopRequireDefault(_ensureSingleRegistration);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const registrationName = 'dbui-icon';

// https://github.com/gorangajic/react-icon-base/blob/master/index.js
// https://raw.githubusercontent.com/gorangajic/react-icons/master/icons/go/mark-github.svg
// https://github.com/gorangajic/react-icons
// https://github.com/gorangajic/react-icons/blob/master/go/mark-github.js
// https://gorangajic.github.io/react-icons/go.html

function getDBUIIcon(win) {
  return (0, _ensureSingleRegistration2.default)(win, registrationName, () => {
    const {
      DBUIWebComponentBase,
      defineCommonStaticMethods,
      Registerable
    } = (0, _DBUIWebComponentCore2.default)(win);

    class DBUIIcon extends DBUIWebComponentBase {

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

    return Registerable(defineCommonStaticMethods(DBUIIcon));
  });
}

getDBUIIcon.registrationName = registrationName;

},{"../../../internals/ensureSingleRegistration":3,"../DBUIWebComponentCore/DBUIWebComponentCore":16}],14:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getDBUITranslated;

var _DBUIWebComponentCore = require('../DBUIWebComponentCore/DBUIWebComponentCore');

var _DBUIWebComponentCore2 = _interopRequireDefault(_DBUIWebComponentCore);

var _ensureSingleRegistration = require('../../../internals/ensureSingleRegistration');

var _ensureSingleRegistration2 = _interopRequireDefault(_ensureSingleRegistration);

var _DBUII18nService = require('../../../services/DBUII18nService');

var _DBUII18nService2 = _interopRequireDefault(_DBUII18nService);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const INTERPOLATION_ATTR_PREFIX = 'message-';

const registrationName = 'dbui-translated';

function getDBUITranslated(win) {
  return (0, _ensureSingleRegistration2.default)(win, registrationName, () => {
    const {
      DBUIWebComponentBase,
      defineCommonStaticMethods,
      Registerable
    } = (0, _DBUIWebComponentCore2.default)(win);

    const i18nService = (0, _DBUII18nService2.default)(win);

    class DBUITranslated extends DBUIWebComponentBase {

      static get registrationName() {
        return registrationName;
      }

      static get templateInnerHTML() {
        return `
          <style>
          :host {
            display: inline;
          }
          </style>
          <span></span>
        `;
      }

      static get observedAttributes() {
        return [...super.observedAttributes, 'message', 'dbui-lang'];
      }

      get observedDynamicAttributes() {
        return [...super.observedDynamicAttributes, ...this._interpolationAttributesNames];
      }

      get hasDynamicAttributes() {
        return true;
      }

      get _message() {
        return this.getAttribute('message');
      }

      get _currentLang() {
        return this.getAttribute('dbui-lang');
      }

      get _currentLangTranslations() {
        return i18nService.translations[this._currentLang] || {};
      }

      get _template() {
        return this._currentLangTranslations[this._message] || (() => '[Translated]');
      }

      get _interpolationAttributes() {
        // noinspection JSCheckFunctionSignatures
        return Array.from(this.attributes).filter(attr => attr.name.startsWith(INTERPOLATION_ATTR_PREFIX));
      }

      get _interpolationAttributesNames() {
        return this._interpolationAttributes.map(attr => attr.name);
      }

      get _interpolations() {
        // noinspection JSCheckFunctionSignatures
        return this._interpolationAttributes.reduce((acc, attr) => {
          acc[attr.name.slice(INTERPOLATION_ATTR_PREFIX.length)] = attr.value;
          return acc;
        }, {});
      }

      _updateTranslation() {
        const interpolations = this._interpolations;
        const args = [];
        const kwargs = {};

        Object.keys(interpolations).forEach(key => {
          Number.isInteger(Number(key)) ? args.push(interpolations[key]) : kwargs[key] = interpolations[key];
        });

        this.shadowRoot.querySelector('span').innerHTML = this._template(...args, kwargs);
      }

      onConnectedCallback() {
        this._updateTranslation();
      }

      onAttributeChangedCallback() {
        this._updateTranslation();
      }

    }

    return Registerable(defineCommonStaticMethods(DBUITranslated));
  });
}

getDBUITranslated.registrationName = registrationName;

},{"../../../internals/ensureSingleRegistration":3,"../../../services/DBUII18nService":4,"../DBUIWebComponentCore/DBUIWebComponentCore":16}],15:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

const DBUICommonCssVars = `
  :root {
    --dbui-global-border-radius: 5px;
    --dbui-form-input-height: 30px;
    --dbui-form-input-color: #000;
    --dbui-form-input-background-color: transparent;
    --dbui-form-input-border-color: #ccc;
    --dbui-form-input-border-style: solid;
    --dbui-form-input-border-width: 1px;
  }
  `;

exports.default = DBUICommonCssVars;

},{}],16:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getDBUIWebComponentCore;

var _ensureSingleRegistration = require('../../../internals/ensureSingleRegistration');

var _ensureSingleRegistration2 = _interopRequireDefault(_ensureSingleRegistration);

var _DBUICommonCssVars = require('./DBUICommonCssVars');

var _DBUICommonCssVars2 = _interopRequireDefault(_DBUICommonCssVars);

var _toggleSelectable = require('../../../utils/toggleSelectable');

var _toggleSelectable2 = _interopRequireDefault(_toggleSelectable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const {
  disableSelection,
  enableSelection
} = _toggleSelectable2.default;

const registrationName = 'DBUIWebComponentBase';

function defineCommonCSSVars(win) {
  const { document } = win;
  const commonStyle = document.createElement('style');
  commonStyle.setAttribute('dbui-common-css-vars', '');
  commonStyle.innerHTML = _DBUICommonCssVars2.default;
  document.querySelector('head').appendChild(commonStyle);
}

/*
Accessing parents and children:
If parent is accessed in connectedCallback it exists (if it should exist), however,
the parent might not be itself connected yet.
If children are accessed in connectedCallback they might not be complete yet at that time.
*/

// https://www.kirupa.com/html5/handling_events_for_many_elements.htm
/**
 *
 * @param win Window
 * @return {
 *   DBUIWebComponentBase,
 *   defineCommonStaticMethods,
 *   Registerable
 * }
 */
function getDBUIWebComponentCore(win) {
  return (0, _ensureSingleRegistration2.default)(win, registrationName, () => {
    defineCommonCSSVars(win);

    const { document, HTMLElement, customElements } = win;

    class DBUIWebComponentBase extends HTMLElement {

      /**
       *
       * @return String
       */
      static get registrationName() {
        throw new Error('registrationName must be defined in derived classes');
      }

      /**
       *
       * @return String HTML
       */
      static get templateInnerHTML() {
        return '<style></style><slot></slot>';
      }

      /**
       *
       * @return Array<DBUIWebComponent>
       */
      static get dependencies() {
        return [];
      }

      /**
       *
       * @return Array<String>
       */
      static get propertiesToUpgrade() {
        return ['unselectable'];
      }

      /**
       *
       * @return Object { String, String }
       */
      static get attributesToDefine() {
        return { 'dbui-web-component': '' };
      }

      /**
       *
       * @return Array<String>
       */
      static get observedAttributes() {
        // web components standard API
        return ['dir', 'lang', 'sync-locale-with', 'unselectable'];
      }

      /**
       *
       * @return Array<String>
       */
      get observedDynamicAttributes() {
        return [];
      }

      /**
       *
       * @return Boolean
       */
      get hasDynamicAttributes() {
        return false;
      }

      /**
       *
       * @return Boolean
       */
      get isMounted() {
        return this._isMounted;
      }

      /**
       *
       * @return Boolean
       */
      get isDisconnected() {
        // We need isDisconnected info when DOM tree is constructed
        // - after constructor() and before connectedCallback() -
        // when closestDbuiParent should not return null.
        return this._isDisconnected;
      }

      constructor() {
        super();

        this.attachShadow({
          mode: 'open'
          // delegatesFocus: true
          // Not working on IPad so we do an workaround
          // by setting "focused" attribute when needed.
        });

        this._propagatingContext = false;
        this._providingContext = {};
        this._lastReceivedContext = {};
        this._closestDbuiParent = null;
        this._closestDbuiChildren = [];
        this._isMounted = false;
        this._isDisconnected = false;
        this._localeObserver = null;
        this._dynamicAttributesObserver = null;
        this._previouslyObservedDynamicAttributes = {};
        this._insertTemplate();

        this.connectedCallback = this.connectedCallback.bind(this);
        this.disconnectedCallback = this.disconnectedCallback.bind(this);
        this.attributeChangedCallback = this.attributeChangedCallback.bind(this);
        this.adoptedCallback = this.adoptedCallback.bind(this);
      }

      // ============================ [Observe Dynamic Attributes] >> =============================================

      _initializeDynamicAttributesObserver() {
        if (!this.hasDynamicAttributes) return;

        this._dynamicAttributesObserver = new win.MutationObserver(mutations => {
          mutations.forEach(mutation => {
            const { oldValue, attributeName } = mutation;
            const newValue = this.getAttribute(attributeName);
            const currentlyObservedDynamicAttributesKeys = this.observedDynamicAttributes;
            const previouslyObservedDynamicAttributes = this._previouslyObservedDynamicAttributes;
            const previouslyObservedDynamicAttributesKeys = Object.keys(previouslyObservedDynamicAttributes);
            const isInCurrentlyObservedDynamicAttributes = currentlyObservedDynamicAttributesKeys.includes(attributeName);
            const isInPreviouslyObservedDynamicAttributes = previouslyObservedDynamicAttributesKeys.includes(attributeName);

            if (isInCurrentlyObservedDynamicAttributes) {
              this._previouslyObservedDynamicAttributes[attributeName] = newValue;
              this.attributeChangedCallback(attributeName, oldValue, newValue);
            } else if (isInPreviouslyObservedDynamicAttributes) {
              const oldValue = this._previouslyObservedDynamicAttributes[attributeName];
              delete this._previouslyObservedDynamicAttributes[attributeName];
              this.attributeChangedCallback(attributeName, oldValue, null);
            }
          });
        });

        this._dynamicAttributesObserver.observe(this, {
          attributes: true,
          attributeOldValue: true
        });
      }

      _dismissDynamicAttributesObserver() {
        if (!this._dynamicAttributesObserver) return;

        this._dynamicAttributesObserver.disconnect();
        this._dynamicAttributesObserver = null;
      }

      // ============================ << [Observe Dynamic Attributes] =============================================

      // ============================ [Locale] >> =============================================

      /**
       *
       * @return HTMLElement
       * @private
       */
      get _localeTarget() {
        const target = document.querySelector(this.getAttribute('sync-locale-with'));
        const defaultTarget = document.querySelector('html');
        return target || defaultTarget;
      }

      /**
       *
       * @return Object { dir, lang }
       * @private
       */
      get _targetedLocale() {
        // Return locale from target
        const target = this._localeTarget;
        return {
          dir: target.getAttribute('dir') || 'ltr',
          lang: target.getAttribute('lang') || 'en'
        };
      }

      _resetProvidedLocale() {
        // Called onDisconnectedCallback.
        //
        // dbuiDir/Lang dbui-dir/lang can be set
        // as a result of attributeChangedCallback
        // or as a result of syncing with (or monitoring) locale target (_syncLocaleAndMonitorChanges).
        // We can remove them if they were set
        // as a result of _syncLocaleAndMonitorChanges
        // because when this node will be re-inserted
        // the syncing will happen again and dbui-dir/lang attrs and dbuiDir/Lang provided context will be set again.
        // But we can't delete them if they were set onAttributeChangedCallback
        // because that will not be fired again when node is moved in other part of the DOM.
        if (!this.getAttribute('dir')) {
          // We know that locale props/attrs were set
          // as a result of locale syncing
          // and we can reset locale from _providingContext.
          delete this._providingContext.dbuiDir; // affects context providers / no effect on context receivers
          this.removeAttribute('dbui-dir'); // affects providers and receivers
        }

        if (!this.getAttribute('lang')) {
          delete this._providingContext.dbuiLang;
          this.removeAttribute('dbui-lang');
        }

        if (this._localeObserver) {
          this._localeObserver.disconnect();
          this._localeObserver = null;
        }
      }

      /**
       *
       * @param newContext Object
       * @param prevContext Object
       * @private
       */
      // eslint-disable-next-line
      _onLocaleContextChanged(newContext, prevContext) {
        // If we are monitoring locale from elsewhere discard this notification.
        if (this._localeObserver) return;
        const {
          dbuiDir, dbuiLang
        } = newContext;
        // changes done by attributeChangedCallback(dir/lang) takes precedence over onContextChanged
        !this.getAttribute('dir') && this.setAttribute('dbui-dir', dbuiDir);
        !this.getAttribute('lang') && this.setAttribute('dbui-lang', dbuiLang);
      }

      /**
       *
       * @param name String
       * @param oldValue String
       * @param newValue String
       * @private
       */
      _onLocaleAttributeChangedCallback(name, oldValue, newValue) {
        // If locale value is truthy, set it (on context too)
        // else read value from _targetedLocale
        // or from closestDbuiParent context.

        if (name === 'sync-locale-with') {
          // stop monitoring old target and start monitoring new target
          this._syncLocaleAndMonitorChanges();
          return;
        }

        const contextKey = name === 'dir' ? 'dbuiDir' : 'dbuiLang';
        const hasLocaleSync = !!this.hasAttribute('sync-locale-with');
        const closestDbuiParent = this.closestDbuiParent;
        const isTopDbuiAncestor = !closestDbuiParent;
        const targetedLocale = hasLocaleSync || isTopDbuiAncestor ? this._targetedLocale : null;
        const valueToSet = newValue || targetedLocale && targetedLocale[name] || closestDbuiParent._getContext([contextKey])[contextKey];

        if (newValue || targetedLocale) {
          this.setAttribute(`dbui-${name}`, valueToSet);
          this.setContext({
            [contextKey]: valueToSet
          });
          targetedLocale && this._watchLocaleChanges();
        } else {
          this._resetProvidedLocale();
          this._unsetAndRelinkContext(contextKey);
        }
      }

      _syncLocaleAndMonitorChanges() {
        // Called onConnectedCallback and _onLocaleAttributeChangedCallback (only for sync-locale-with).
        //
        // If being top most dbui ancestor or having attr "sync-locale-with" defined,
        // read locale from target, set values on context
        // then watch for locale changes on target.
        const isDescendantDbui = !!this.closestDbuiParent;
        const hasLocaleSync = !!this.hasAttribute('sync-locale-with');
        if (isDescendantDbui && !hasLocaleSync) return;

        const { dir: targetedDir, lang: targetedLang } = this._targetedLocale;
        const selfDir = this.getAttribute('dir');
        const selfLang = this.getAttribute('lang');
        const newDir = selfDir || targetedDir;
        const newLang = selfLang || targetedLang;

        this.setAttribute('dbui-dir', newDir);
        this.setAttribute('dbui-lang', newLang);

        this.setContext({
          dbuiDir: newDir,
          dbuiLang: newLang
        });

        this._watchLocaleChanges();
      }

      _watchLocaleChanges() {
        // Called from _syncLocaleAndMonitorChanges and _onLocaleAttributeChangedCallback (only for dir/lang).
        if (this._localeObserver) {
          this._localeObserver.disconnect();
        }

        const localeTarget = this._localeTarget;

        this._localeObserver = new win.MutationObserver(mutations => {
          mutations.forEach(mutation => {
            const attr = mutation.attributeName;
            const value = this._targetedLocale[attr];
            const attrKey = `dbui-${attr}`;
            const contextKey = `dbui${attr.charAt(0).toUpperCase() + attr.slice(1)}`;

            this.setAttribute(attrKey, value);
            this.setContext({
              [contextKey]: value
            });
          });
        });

        this._localeObserver.observe(localeTarget, {
          attributes: true,
          attributeFilter: ['dir', 'lang']
        });
      }

      // ============================ << [Locale]  =============================================

      // ============================ [Context] >> =============================================

      /**
       *
       * @return Array<String>
       */
      static get contextProvide() {
        return ['dbuiDir', 'dbuiLang'];
      }

      /**
       *
       * @return Array<String>
       */
      static get contextSubscribe() {
        return ['dbuiDir', 'dbuiLang'];
      }

      /**
       *
       * @param key String
       * @return Boolean
       * @private
       */
      _providesContextFor(key) {
        return this.constructor.contextProvide.some(_key => _key === key);
      }

      /**
       *
       * @param key String
       * @return Boolean
       * @private
       */
      _hasValueForContext(key) {
        return this._providingContext[key] !== undefined;
      }

      /**
       *
       * @param key String
       * @return Boolean
       * @private
       */
      _subscribesForContext(key) {
        return this.constructor.contextSubscribe.some(_key => _key === key);
      }

      /**
       *
       * @param contextObj Object
       */
      setContext(contextObj) {
        const newKeys = Object.keys(contextObj).filter(key => {
          return this._providesContextFor(key);
        });

        const contextToSet = newKeys.reduce((acc, key) => {
          acc[key] = contextObj[key];
          return acc;
        }, {});

        const newProvidingContext = Object.assign({}, this._providingContext, contextToSet);

        this._providingContext = newProvidingContext;

        if (this._propagatingContext) return;

        this._propagateContextChanged(this._providingContext);
      }

      /**
       *
       * @param newContext Object
       */
      _propagateContextChanged(newContext) {
        this._propagatingContext = true;
        const newContextKeys = Object.keys(newContext);

        // if context is received from ancestors
        if (newContext !== this._providingContext) {
          // makes self aware
          const keysSubscribedFor = newContextKeys.reduce((acc, key) => {
            this._subscribesForContext(key) && acc.push(key);
            return acc;
          }, []);

          if (keysSubscribedFor.length) {
            const contextSubscribedFor = keysSubscribedFor.reduce((acc, key) => {
              acc[key] = newContext[key];
              return acc;
            }, {});
            this._onContextChanged(contextSubscribedFor);
            // At this point user might have call setContext inside onContextChanged
            // in which case _providingContext is updated with latest values.
          }
        }

        // propagate with overrides
        // If user called setContext() from within onContextChanged() then
        // this._providingContext has the newest values to be propagated
        const overriddenContext = this.constructor.contextProvide.reduce((acc, key) => {
          if (this._hasValueForContext(key)) {
            acc[key] = this._providingContext[key];
          }
          return acc;
        }, {});

        const contextToPropagate = Object.assign({}, newContext, overriddenContext);

        // children that will mount later will ask for context (_checkContext)
        this.closestDbuiChildren.forEach(child => {
          child._propagateContextChanged(contextToPropagate);
        });
        this._propagatingContext = false;
      }

      /**
       * Resets _lastReceivedContext and _providingContext,
       * looks up for new value on closestDbuiParent context
       * and propagates that to self and ancestors.
       *
       * @param contextKey String | Array<String>
       * @private
       */
      _unsetAndRelinkContext(contextKey) {
        const contextKeys = Array.isArray(contextKey) ? contextKey : [contextKey];

        contextKeys.forEach(key => {
          delete this._lastReceivedContext[key];
          delete this._providingContext[key];
        });

        const closestDbuiParent = this.closestDbuiParent;
        const valuesToSet = !closestDbuiParent ? undefined : closestDbuiParent._getContext(contextKeys);

        const newContext = contextKeys.reduce((acc, key) => {
          acc[key] = (valuesToSet || {})[key];
          return acc;
        }, {});

        this._propagateContextChanged(newContext);
      }

      /**
       *
       * @param keys Array<String>
       * @return Object
       * @private
       */
      _getContext(keys) {
        // This must run always in the parent of the node asking for context
        // and not in the node itself.
        const ownedKeys = [];
        const keysToAskFor = [];
        keys.forEach(key => {
          if (this._hasValueForContext(key)) {
            ownedKeys.push(key);
          } else {
            keysToAskFor.push(key);
          }
        });
        const closestDbuiParent = this.closestDbuiParent;
        return Object.assign({}, ownedKeys.reduce((acc, key) => {
          acc[key] = this._providingContext[key];
          return acc;
        }, {}), closestDbuiParent ? closestDbuiParent._getContext(keysToAskFor) : {});
      }

      /**
       *
       * @param newContext Object
       * @param options { reset = false }
       * @private
       */
      _onContextChanged(newContext, { reset = false } = {}) {
        // Might be fired more than once until DOM tree settles down.
        // ex: first call is the result of _checkContext which might get the top most existing context.
        // The next ones can be the result of middle ancestors firing attributeChangeCallback
        // which might set their context and propagate it down.
        const lastReceivedContext = this._lastReceivedContext;
        const newContextFilteredKeys = Object.keys(newContext || {}).filter(key => {
          return newContext[key] !== lastReceivedContext[key];
        });
        // Prevents triggering onContextChanged against a context found on some ancestor
        // which did not managed yet to setup its context
        // due to for example attributeChangedCallback did not fired on that ancestor yet.
        if (!newContextFilteredKeys.length && !reset) return;
        const newContextFiltered = newContextFilteredKeys.reduce((acc, key) => {
          acc[key] = newContext[key];
          return acc;
        }, {});
        const contextToSet = reset ? {} : Object.assign({}, lastReceivedContext, newContextFiltered);
        this._lastReceivedContext = contextToSet;
        const [_newContext, _prevContext] = [this._lastReceivedContext, lastReceivedContext];
        this._onLocaleContextChanged(_newContext, _prevContext);
        this.onContextChanged(_newContext, _prevContext);
      }

      /**
       * Public hook.
       *
       * @param newContext Object
       * @param prevContext Object
       */
      // eslint-disable-next-line
      onContextChanged(newContext, prevContext) {
        // pass
      }

      _checkContext() {
        // _checkContext can propagate recursively to the very top even if ancestors are not connected.
        // If there is context defined somewhere upstream then it will be reached by descendants.
        const closestDbuiParent = this.closestDbuiParent;
        // no need to check context if is top most dbui ancestor
        if (!closestDbuiParent) return;

        const newContext = closestDbuiParent._getContext(this.constructor.contextSubscribe);
        this._onContextChanged(newContext);
        // No need to propagate to the children because they can search upward for context
        // until top of the tree is reached, even if ancestors are not connected yet.
        // If some middle ancestor has context to provide and did not managed to provide it yet
        // (ex: attributeChangedCallback not fired before descendants looked for upstream context)
        // then descendants will receive first context from upstream then from middle ancestor.
        // This was verified!
      }

      _resetContext() {
        // this._providingContext is NOT reset from component providing context
        // because if context is dependent on attributeChangedCallback
        // that will not fire when component is moved from one place to another place in DOM tree.
        const closestDbuiParent = this.closestDbuiParent;
        // Checking closestDbuiParent to be symmetric with _checkContext
        // or we'll end up with empty context object after reset,
        // when it initially was undefined.
        if (closestDbuiParent) {
          this._onContextChanged(null, { reset: true });
        }
      }

      // ============================ << [Context] =============================================

      // ============================ [Descendants/Ancestors and registrations] >> =============================================

      /**
       *
       * @param callback Function
       * @return HTMLElement
       */
      getClosestAncestorMatchingCondition(callback) {
        let closestAncestor = this.parentElement;
        while (closestAncestor && !callback(closestAncestor)) {
          closestAncestor = closestAncestor.parentElement;
        }
        return closestAncestor;
      }

      /**
       *
       * @return Array<DBUIWebComponent>
       */
      get shadowDomDbuiChildren() {
        // children in slots are NOT included here
        return [...this.shadowRoot.querySelectorAll('[dbui-web-component]')];
      }

      /**
       *
       * @return DBUIWebComponent | null
       */
      get shadowDomDbuiParent() {
        return this.getRootNode().host || null;
      }

      /**
       *
       * @return DBUIWebComponent | null
       */
      get lightDomDbuiParent() {
        // can return a parent which is in shadow DOM of the grand-parent
        let parent = this.parentElement;
        while (parent && !parent.hasAttribute('dbui-web-component')) {
          parent = parent.parentElement;
        }
        return parent || null;
      }

      /**
       *
       * @return Array<DBUIWebComponent>
       */
      get lightDomDbuiChildren() {
        // children in slots ARE included here
        return [...this.querySelectorAll('[dbui-web-component]')];
      }

      /**
       *
       * @return DBUIWebComponent | null
       */
      get closestDbuiParentLiveQuery() {
        let closestParent = this.parentElement;
        // might be null if disconnected from dom
        if (closestParent === null) {
          return null;
        }
        closestParent = closestParent.closest('[dbui-web-component]');
        return closestParent || this.shadowDomDbuiParent;
      }

      /**
       *
       * @return DBUIWebComponent | null
       */
      get closestDbuiParent() {
        // cached
        // Reason for cache is to allow a child to unregister from its parent when unmounted
        // because when browser calls disconnectedCallback the parent is not reachable anymore.
        // If parent could not be reachable it could not unregister its closest children
        // thus leading to memory leak.
        if (this._closestDbuiParent) {
          return this._closestDbuiParent;
        }
        if (this.isDisconnected) return null;
        this._closestDbuiParent = this.closestDbuiParentLiveQuery;
        return this._closestDbuiParent;
      }

      /**
       *
       * @return DBUIWebComponent | null
       */
      // might be useful in some scenarios
      get topDbuiAncestor() {
        let closestDbuiParent = this.closestDbuiParent;
        while (closestDbuiParent) {
          const _closestDbuiParent = closestDbuiParent.closestDbuiParent;
          if (!_closestDbuiParent) {
            return closestDbuiParent;
          }
          closestDbuiParent = _closestDbuiParent;
        }
        return closestDbuiParent; // this is null
      }

      /**
       *
       * @return Array<DBUIWebComponent>
       */
      // might be useful in some scenarios
      get closestDbuiChildrenLiveQuery() {
        const dbuiChildren = [...this.lightDomDbuiChildren, ...this.shadowDomDbuiChildren];
        const closestDbuiChildren = dbuiChildren.filter(child => child.closestDbuiParentLiveQuery === this);
        return closestDbuiChildren;
      }

      /**
       *
       * @return Array<DBUIWebComponent>
       */
      get closestDbuiChildren() {
        return this._closestDbuiChildren;
      }

      _registerSelfToClosestDbuiParent() {
        const closestDbuiParent = this.closestDbuiParent;
        if (!closestDbuiParent) return;
        closestDbuiParent._registerChild(this);
      }

      _unregisterSelfFromClosestDbuiParent() {
        const closestDbuiParent = this.closestDbuiParent;
        if (!closestDbuiParent) return;
        closestDbuiParent._unregisterChild(this);
      }

      /**
       *
       * @param child DBUIWebComponent
       * @private
       */
      _registerChild(child) {
        this._closestDbuiChildren.push(child);
      }

      /**
       *
       * @param child DBUIWebComponent
       * @private
       */
      _unregisterChild(child) {
        this._closestDbuiChildren = this._closestDbuiChildren.filter(_child => _child !== child);
      }

      // ============================ << [Descendants/Ancestors and registrations] =============================================


      // ============================ [unselectable] >> =============================================

      _onUnselectableAttributeChanged() {
        const unselectable = this.unselectable;

        if (unselectable) {
          disableSelection(this);
        } else {
          enableSelection(this);
        }
      }

      get unselectable() {
        return this.hasAttribute('unselectable');
      }

      set unselectable(value) {
        const hasValue = Boolean(value);
        if (hasValue) {
          this.setAttribute('unselectable', '');
        } else {
          this.removeAttribute('unselectable');
        }
      }

      // ============================ << [unselectable] =============================================

      /**
       *
       * @param prop String
       * @private
       */
      _upgradeProperty(prop) {
        // https://developers.google.com/web/fundamentals/web-components/best-practices#lazy-properties
        // https://developers.google.com/web/fundamentals/web-components/examples/howto-checkbox
        /* eslint no-prototype-builtins: 0 */
        if (this.hasOwnProperty(prop)) {
          const value = this[prop];
          // get rid of the property that might shadow a setter/getter
          delete this[prop];
          // this time if a setter was defined it will be properly called
          this[prop] = value;
          // if a getter was defined, it will be called from now on
        }
      }

      /**
       *
       * @param key String
       * @param value String
       * @private
       */
      _defineAttribute(key, value) {
        // don't override user defined attribute
        if (!this.hasAttribute(key)) {
          this.setAttribute(key, value);
        }
      }

      _insertTemplate() {
        const { template } = this.constructor;
        template && this.shadowRoot.appendChild(template.content.cloneNode(true));
      }

      /**
       *
       * @param oldDocument HTMLDocument
       * @param newDocument HTMLDocument
       */
      adoptedCallback(oldDocument, newDocument) {
        // web components standard API
        // callbacks order:
        // disconnectedCallback => adoptedCallback => connectedCallback
        this._onAdoptedCallback(oldDocument, newDocument);
      }

      /**
       *
       * @param oldDocument HTMLDocument
       * @param newDocument HTMLDocument
       * @private
       */
      _onAdoptedCallback(oldDocument, newDocument) {
        // Call public hook.
        this.onAdoptedCallback(oldDocument, newDocument);
      }

      /**
       * Public hook.
       *
       * @param oldDocument HTMLDocument
       * @param newDocument HTMLDocument
       */
      // eslint-disable-next-line
      onAdoptedCallback(oldDocument, newDocument) {}
      // pass


      /*
      * web components standard API
      * connectedCallback is fired from children to parent in shadow DOM
      * but the order is less predictable in light DOM.
      * Should not read light/shadowDomDbuiChildren here.
      * Is called after attributeChangedCallback.
      * */
      connectedCallback() {
        // Using this pattern as it seems that the component
        // is immune to overriding connectedCallback at runtime.
        // Most probably the browser keeps a reference to connectedCallback
        // existing/defined at the time of upgrading and calls that one instead of the
        // latest (monkey patched / runtime evaluated) one.
        // Now, we can monkey patch onConnectedCallback if we want.
        this._onConnectedCallback();
      }

      /**
       * @private
       */
      _onConnectedCallback() {
        this._isMounted = true;
        this._isDisconnected = false;
        win.addEventListener('beforeunload', this.disconnectedCallback, false);
        const { propertiesToUpgrade, attributesToDefine } = this.constructor;
        propertiesToUpgrade.forEach(property => {
          this._upgradeProperty(property);
        });
        Object.keys(attributesToDefine).forEach(property => {
          this._defineAttribute(property, attributesToDefine[property]);
        });
        // We can safely register to closestDbuiParent because it exists at this time
        // but we must not assume it was connected.
        // NOTE: even if closestDbuiParent (or any ancestor) is not connected
        // the top of the tree (topDbuiAncestor) can be reached if needed
        this._registerSelfToClosestDbuiParent();
        this._checkContext(); // is ignored by top most dbui ancestors
        // makes top most ancestors or dbui components having localeTarget specified
        // to set dbuiDir/Locale on context
        this._syncLocaleAndMonitorChanges();
        this._initializeDynamicAttributesObserver();
        // Call public hook.
        this.onConnectedCallback();
      }

      /**
       * Public hook.
       */
      onConnectedCallback() {}
      // pass


      // web components standard API
      disconnectedCallback() {
        this._onDisconnectedCallback();
      }

      /**
       * @private
       */
      _onDisconnectedCallback() {
        this._resetContext();
        this._resetProvidedLocale();
        this._unregisterSelfFromClosestDbuiParent();
        win.removeEventListener('beforeunload', this.disconnectedCallback, false);
        this._isMounted = false;
        this._isDisconnected = true;
        this._closestDbuiParent = null;
        this._dismissDynamicAttributesObserver();
        // Call public hook.
        this.onDisconnectedCallback();
      }

      /**
       * Public hook.
       */
      onDisconnectedCallback() {
        // pass
      }

      cloneNodeDeep({ idPrefix = '', idSuffix = '' }) {
        const clone = super.cloneNode(true);
        if (!idPrefix && !idSuffix) return clone;
        if (clone.hasAttribute('id')) {
          clone.setAttribute('id', `${idPrefix}${clone.getAttribute('id')}${idSuffix}`);
        }
        clone.querySelectorAll('[dbui-web-component]').forEach(child => {
          if (child.hasAttribute('id')) {
            child.setAttribute('id', `${idPrefix}${child.getAttribute('id')}${idSuffix}`);
          }
        });
        return clone;
      }

      /**
       *
       * @param name String
       * @param oldValue String
       * @param newValue String
       */
      attributeChangedCallback(name, oldValue, newValue) {
        // web components standard API
        // Scenario 1: component was created in detached tree BEFORE being defined.
        // attributeChangedCallback will not be called when being defined but when inserted into DOM.
        // (this implies component is upgraded after being inserted into DOM).
        // Scenario 2: component is created in detached tree AFTER being defined.
        // attributeChangedCallback will be called right away
        // (this implies component is upgraded before being inserted into DOM).
        // When inserted in DOM then connectedCallback will be called.
        // In any case attributeChangedCallback is called before connectedCallback.
        // Things changed as a result of attributeChangedCallback should be preserved
        // when disconnectedCallback because these attribute changes will not be fired again
        // when node is removed then re-inserted back in the DOM tree.
        if (this.getAttribute(name) === oldValue) return;
        this._onAttributeChangedCallback(name, oldValue, newValue);
      }

      /**
       *
       * @param name String
       * @param oldValue String
       * @param newValue String
       * @private
       */
      _onAttributeChangedCallback(name, oldValue, newValue) {
        ['dir', 'lang', 'sync-locale-with'].includes(name) && this._onLocaleAttributeChangedCallback(name, oldValue, newValue);
        name === 'unselectable' && this._onUnselectableAttributeChanged();
        // Call public hook.
        this.onAttributeChangedCallback(name, oldValue, newValue);
      }

      /**
       * Public hook.
       *
       * @param name String
       * @param oldValue String
       * @param newValue String
       */
      // eslint-disable-next-line
      onAttributeChangedCallback(name, oldValue, newValue) {
        // pass
      }
    }

    /**
     * @param klass Class
     */
    function defineCommonStaticMethods(klass) {
      const templateInnerHTML = klass.templateInnerHTML;
      const template = document.createElement('template');
      template.innerHTML = templateInnerHTML;

      /**
       * @property template (getter) template element
       */
      Object.defineProperty(klass, 'template', {
        get() {
          return template;
        },
        enumerable: false,
        configurable: true
      });

      /**
       * @property componentStyle (getter/setter) String
       */
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
        // https://html.spec.whatwg.org/multipage/custom-elements.html#concept-upgrade-an-element
        customElements.define(registrationName, klass);
        return registrationName;
      };

      /**
       * @property prototypeChainInfo (getter) Array<Prototype>
       */
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

},{"../../../internals/ensureSingleRegistration":3,"../../../utils/toggleSelectable":9,"./DBUICommonCssVars":15}],17:[function(require,module,exports){
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

  // https://developer.mozilla.org/en-US/docs/Web/CSS/:focus-within

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
      this._sideEffectsAppliedFor = null;
      this._onInnerFocusableFocused = this._onInnerFocusableFocused.bind(this);
      this._onFocus = this._onFocus.bind(this);
      this._onBlur = this._onBlur.bind(this);
      this._onDocumentTap = this._onDocumentTap.bind(this);
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
          // eslint-disable-next-line
          console.warn(ERROR_MESSAGES[readOnlyProperty]);
        }
      });

      if (this.disabled) {
        this._applyDisabledSideEffects();
      } else {
        this._applyEnabledSideEffects();
      }

      // when component focused/blurred
      this.addEventListener('focus', this._onFocus);
      this.addEventListener('blur', this._onBlur);
      this.ownerDocument.addEventListener('mousedown', this._onDocumentTap);
      this.ownerDocument.addEventListener('touchstart', this._onDocumentTap);

      this._innerFocusables.forEach(focusable => {
        // when inner focusable focused
        focusable.addEventListener('focus', this._onInnerFocusableFocused);
      });
    }

    disconnectedCallback() {
      super.disconnectedCallback();

      this.removeEventListener('focus', this._onFocus);
      this.removeEventListener('blur', this._onBlur);
      this.ownerDocument.removeEventListener('mousedown', this._onDocumentTap);
      this.ownerDocument.removeEventListener('touchstart', this._onDocumentTap);

      this._innerFocusables.forEach(focusable => {
        focusable.removeEventListener('focus', this._onInnerFocusableFocused);
      });
    }

    /**
     * Read only.
     * @return Boolean
     */
    get focused() {
      return this.hasAttribute('focused');
    }

    set focused(_) {
      // eslint-disable-next-line
      console.warn(ERROR_MESSAGES.focused);
    }

    /**
     *
     * @return Boolean
     */
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

    /**
     *
     * @return Array<HTMLElement>
     * @private
     */
    get _innerFocusables() {
      return this.shadowRoot.querySelectorAll('[tabindex]') || [];
    }

    /**
     *
     * @return HTMLElement || null
     * @private
     */
    get _firstInnerFocusable() {
      return this.shadowRoot.querySelector('[tabindex]');
    }

    /**
     *
     * @param evt Event (mousedown/touchstart)
     * @private
     */
    _onDocumentTap(evt) {
      if (evt.target !== this) {
        this.blur();
      }
    }

    /**
     *
     * @param evt Event (FocusEvent)
     * @private
     */
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
      if (this._sideEffectsAppliedFor === 'disabled') return;
      this._lastTabIndexValue = this.getAttribute('tabindex');
      this.removeAttribute('tabindex');
      this._innerFocusables.forEach(innerFocusable => {
        innerFocusable.setAttribute('tabindex', '-1');
        innerFocusable.setAttribute('disabled', 'disabled');
        if (innerFocusable.hasAttribute('contenteditable')) {
          innerFocusable.setAttribute('contenteditable', 'false');
        }
      });
      this.blur();
      this._sideEffectsAppliedFor = 'disabled';
    }

    _applyEnabledSideEffects() {
      if (this._sideEffectsAppliedFor === 'enabled') return;
      !this.getAttribute('tabindex') && this.setAttribute('tabindex', this._lastTabIndexValue || 0);
      this._innerFocusables.forEach(innerFocusable => {
        innerFocusable.setAttribute('tabindex', '0');
        innerFocusable.removeAttribute('disabled');
        if (innerFocusable.hasAttribute('contenteditable')) {
          innerFocusable.setAttribute('contenteditable', 'true');
        }
      });
      this._sideEffectsAppliedFor = 'enabled';
    }
  }

  return Focusable;
}

},{}],18:[function(require,module,exports){
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
exports.getDBUITranslated = exports.getDBUIIcon = exports.getDBUIFormInputText = exports.getDBUIDummyParent = exports.getDBUIDummy = exports.onScreenConsole = exports.template = exports.toggleSelectable = exports.formatters = exports.getDBUII18nService = exports.getDBUILocaleService = exports.Focusable = exports.getDBUIWebComponentCore = exports.ensureSingleRegistration = exports.dbuiWebComponentsSetUp = exports.quickSetupAndLoad = exports.registrations = undefined;

var _dbuiWebComponentsSetup = require('./web-components/helpers/dbuiWebComponentsSetup');

var _dbuiWebComponentsSetup2 = _interopRequireDefault(_dbuiWebComponentsSetup);

var _ensureSingleRegistration = require('./internals/ensureSingleRegistration');

var _ensureSingleRegistration2 = _interopRequireDefault(_ensureSingleRegistration);

var _DBUIWebComponentCore = require('./web-components/components/DBUIWebComponentCore/DBUIWebComponentCore');

var _DBUIWebComponentCore2 = _interopRequireDefault(_DBUIWebComponentCore);

var _Focusable = require('./web-components/decorators/Focusable');

var _Focusable2 = _interopRequireDefault(_Focusable);

var _DBUILocaleService = require('./services/DBUILocaleService');

var _DBUILocaleService2 = _interopRequireDefault(_DBUILocaleService);

var _DBUII18nService = require('./services/DBUII18nService');

var _DBUII18nService2 = _interopRequireDefault(_DBUII18nService);

var _formatters = require('./utils/formatters');

var _formatters2 = _interopRequireDefault(_formatters);

var _toggleSelectable = require('./utils/toggleSelectable');

var _toggleSelectable2 = _interopRequireDefault(_toggleSelectable);

var _template = require('./utils/template');

var _template2 = _interopRequireDefault(_template);

var _onScreenConsole = require('./utils/onScreenConsole');

var _onScreenConsole2 = _interopRequireDefault(_onScreenConsole);

var _DBUIDummy = require('./web-components/components/DBUIDummy/DBUIDummy');

var _DBUIDummy2 = _interopRequireDefault(_DBUIDummy);

var _DBUIDummyParent = require('./web-components/components/DBUIDummyParent/DBUIDummyParent');

var _DBUIDummyParent2 = _interopRequireDefault(_DBUIDummyParent);

var _DBUIFormInputText = require('./web-components/components/DBUIFormInputText/DBUIFormInputText');

var _DBUIFormInputText2 = _interopRequireDefault(_DBUIFormInputText);

var _DBUIIcon = require('./web-components/components/DBUIIcon/DBUIIcon');

var _DBUIIcon2 = _interopRequireDefault(_DBUIIcon);

var _DBUITranslated = require('./web-components/components/DBUITranslated/DBUITranslated');

var _DBUITranslated2 = _interopRequireDefault(_DBUITranslated);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Decorators


// Internals
const registrations = {
  [_DBUIDummy2.default.registrationName]: _DBUIDummy2.default,
  [_DBUIDummyParent2.default.registrationName]: _DBUIDummyParent2.default,
  [_DBUIFormInputText2.default.registrationName]: _DBUIFormInputText2.default,
  [_DBUIIcon2.default.registrationName]: _DBUIIcon2.default,
  [_DBUITranslated2.default.registrationName]: _DBUITranslated2.default
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


// Components


// Utils


// Services


// ComponentBase
/* eslint max-len: 0 */
// Helpers
function quickSetupAndLoad(win = window) {
  /**
   * @param components Object {
   *  registrationName,
   *  componentStyle
   * }
   * @return Object { <registrationName>, <componentClass> }
   */
  return components => {
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
exports.toggleSelectable = _toggleSelectable2.default;
exports.template = _template2.default;
exports.onScreenConsole = _onScreenConsole2.default;
exports.getDBUIDummy = _DBUIDummy2.default;
exports.getDBUIDummyParent = _DBUIDummyParent2.default;
exports.getDBUIFormInputText = _DBUIFormInputText2.default;
exports.getDBUIIcon = _DBUIIcon2.default;
exports.getDBUITranslated = _DBUITranslated2.default;

/* eslint no-console: 0 */

let build = 'production';

if (process.env.NODE_ENV !== 'production') {
  build = 'develop';
}

console.log(`Using DBUIWebComponentsDistLib ${build} build.`);

}).call(this,require('_process'))

},{"./internals/ensureSingleRegistration":3,"./services/DBUII18nService":4,"./services/DBUILocaleService":5,"./utils/formatters":6,"./utils/onScreenConsole":7,"./utils/template":8,"./utils/toggleSelectable":9,"./web-components/components/DBUIDummy/DBUIDummy":10,"./web-components/components/DBUIDummyParent/DBUIDummyParent":11,"./web-components/components/DBUIFormInputText/DBUIFormInputText":12,"./web-components/components/DBUIIcon/DBUIIcon":13,"./web-components/components/DBUITranslated/DBUITranslated":14,"./web-components/components/DBUIWebComponentCore/DBUIWebComponentCore":16,"./web-components/decorators/Focusable":17,"./web-components/helpers/dbuiWebComponentsSetup":18,"_process":1}]},{},[])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvcHJvY2Vzcy9icm93c2VyLmpzIiwic3JjL2xpYi9jb3JlL2ludGVybmFscy9hcHBlbmRTdHlsZXMuanMiLCJzcmMvbGliL2NvcmUvaW50ZXJuYWxzL2Vuc3VyZVNpbmdsZVJlZ2lzdHJhdGlvbi5qcyIsInNyYy9saWIvY29yZS9zZXJ2aWNlcy9EQlVJSTE4blNlcnZpY2UuanMiLCJzcmMvbGliL2NvcmUvc2VydmljZXMvREJVSUxvY2FsZVNlcnZpY2UuanMiLCJzcmMvbGliL2NvcmUvdXRpbHMvZm9ybWF0dGVycy5qcyIsInNyYy9saWIvY29yZS91dGlscy9vblNjcmVlbkNvbnNvbGUuanMiLCJzcmMvbGliL2NvcmUvdXRpbHMvdGVtcGxhdGUuanMiLCJzcmMvbGliL2NvcmUvdXRpbHMvdG9nZ2xlU2VsZWN0YWJsZS5qcyIsInNyYy9saWIvY29yZS93ZWItY29tcG9uZW50cy9jb21wb25lbnRzL0RCVUlEdW1teS9EQlVJRHVtbXkuanMiLCJzcmMvbGliL2NvcmUvd2ViLWNvbXBvbmVudHMvY29tcG9uZW50cy9EQlVJRHVtbXlQYXJlbnQvREJVSUR1bW15UGFyZW50LmpzIiwic3JjL2xpYi9jb3JlL3dlYi1jb21wb25lbnRzL2NvbXBvbmVudHMvREJVSUZvcm1JbnB1dFRleHQvREJVSUZvcm1JbnB1dFRleHQuanMiLCJzcmMvbGliL2NvcmUvd2ViLWNvbXBvbmVudHMvY29tcG9uZW50cy9EQlVJSWNvbi9EQlVJSWNvbi5qcyIsInNyYy9saWIvY29yZS93ZWItY29tcG9uZW50cy9jb21wb25lbnRzL0RCVUlUcmFuc2xhdGVkL0RCVUlUcmFuc2xhdGVkLmpzIiwic3JjL2xpYi9jb3JlL3dlYi1jb21wb25lbnRzL2NvbXBvbmVudHMvREJVSVdlYkNvbXBvbmVudENvcmUvREJVSUNvbW1vbkNzc1ZhcnMuanMiLCJzcmMvbGliL2NvcmUvd2ViLWNvbXBvbmVudHMvY29tcG9uZW50cy9EQlVJV2ViQ29tcG9uZW50Q29yZS9EQlVJV2ViQ29tcG9uZW50Q29yZS5qcyIsInNyYy9saWIvY29yZS93ZWItY29tcG9uZW50cy9kZWNvcmF0b3JzL0ZvY3VzYWJsZS5qcyIsInNyYy9saWIvY29yZS93ZWItY29tcG9uZW50cy9oZWxwZXJzL2RidWlXZWJDb21wb25lbnRzU2V0dXAuanMiLCJzcmMvbGliL3NyYy9saWIvY29yZS9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7QUN4TEE7Ozs7OztBQU1PLE1BQU0sc0NBQWdCLEdBQUQsSUFBUyxDQUFDLGdCQUFELEVBQW1CLGNBQW5CLEtBQXNDO0FBQ3pFLE1BQUksQ0FBQyxJQUFJLGlCQUFULEVBQTRCO0FBQzFCLFFBQUksaUJBQUosR0FBd0IsRUFBeEI7QUFDRDtBQUNELE1BQUksaUJBQUoscUJBQ0ssSUFBSSxpQkFEVDtBQUVFLEtBQUMsZ0JBQUQscUJBQ0ssSUFBSSxpQkFBSixDQUFzQixnQkFBdEIsQ0FETDtBQUVFO0FBRkY7QUFGRjtBQU9ELENBWE07O0FBYVAsTUFBTSxlQUFnQixHQUFELElBQVUsVUFBRCxJQUFnQjtBQUM1QyxhQUFXLE9BQVgsQ0FBbUIsQ0FBQyxFQUFFLGdCQUFGLEVBQW9CLGNBQXBCLEVBQUQsS0FBMEM7QUFDM0QsaUJBQWEsR0FBYixFQUFrQixnQkFBbEIsRUFBb0MsY0FBcEM7QUFDRCxHQUZEO0FBR0EsU0FBTyxVQUFQO0FBQ0QsQ0FMRDs7a0JBT2UsWTs7Ozs7Ozs7a0JDbEJTLHdCOztBQVB4Qjs7Ozs7OztBQU9lLFNBQVMsd0JBQVQsQ0FBa0MsR0FBbEMsRUFBdUMsSUFBdkMsRUFBNkMsUUFBN0MsRUFBdUQ7QUFDcEUsTUFBSSxDQUFDLElBQUksaUJBQVQsRUFBNEI7QUFDMUIsUUFBSSxpQkFBSixHQUF3QixFQUFFLGVBQWUsRUFBakIsRUFBeEI7QUFDRCxHQUZELE1BRU8sSUFBSSxDQUFDLElBQUksaUJBQUosQ0FBc0IsYUFBM0IsRUFBMEM7QUFDL0MsUUFBSSxpQkFBSixDQUFzQixhQUF0QixHQUFzQyxFQUF0QztBQUNEOztBQUVELE1BQUksZUFBZSxJQUFJLGlCQUFKLENBQXNCLGFBQXRCLENBQW9DLElBQXBDLENBQW5COztBQUVBLE1BQUksWUFBSixFQUFrQixPQUFPLFlBQVA7O0FBRWxCLGlCQUFlLFVBQWY7QUFDQSxNQUFJLGlCQUFKLENBQXNCLGFBQXRCLENBQW9DLElBQXBDLElBQTRDLFlBQTVDOztBQUVBLFNBQU8sSUFBSSxpQkFBSixDQUFzQixhQUF0QixDQUFvQyxJQUFwQyxDQUFQO0FBQ0Q7Ozs7Ozs7O2tCQ2pCdUIsa0I7O0FBTnhCOzs7Ozs7QUFFQSxNQUFNLFdBQVcsRUFBakI7O0FBRUEsTUFBTSxtQkFBbUIsaUJBQXpCOztBQUVlLFNBQVMsa0JBQVQsQ0FBNEIsR0FBNUIsRUFBaUM7QUFDOUMsU0FBTyx3Q0FBeUIsR0FBekIsRUFBOEIsZ0JBQTlCLEVBQWdELE1BQU07QUFDM0QsVUFBTSxlQUFOLENBQXNCO0FBQ3BCLG9CQUFjO0FBQ1osYUFBSyxhQUFMLEdBQXFCLEVBQXJCO0FBQ0Q7O0FBRUQsd0JBQWtCLElBQWxCLEVBQXdCO0FBQ3RCLGVBQU8sS0FBSyxhQUFMLENBQW1CLElBQW5CLENBQVA7QUFDRDs7QUFFRCwyQkFBcUIsWUFBckIsRUFBbUM7QUFDakMsYUFBSyxhQUFMLEdBQXFCLE9BQU8sSUFBUCxDQUFZLFlBQVosRUFBMEIsTUFBMUIsQ0FBaUMsQ0FBQyxHQUFELEVBQU0sSUFBTixLQUFlO0FBQ25FLGNBQUksSUFBSixzQkFDSyxLQUFLLGFBQUwsQ0FBbUIsSUFBbkIsQ0FETCxFQUVLLGFBQWEsSUFBYixDQUZMO0FBSUEsaUJBQU8sR0FBUDtBQUNELFNBTm9CLEVBTWxCLEtBQUssYUFOYSxDQUFyQjtBQU9EOztBQUVELGdCQUFVLEdBQVYsRUFBZSxJQUFmLEVBQXFCO0FBQ25CLGVBQU8sQ0FBQyxLQUFLLFlBQUwsQ0FBa0IsSUFBbEIsS0FBMkIsUUFBNUIsRUFBc0MsR0FBdEMsQ0FBUDtBQUNEOztBQUVELFVBQUksWUFBSixHQUFtQjtBQUNqQixlQUFPLEtBQUssYUFBWjtBQUNEO0FBekJtQjs7QUE0QnRCLFVBQU0sa0JBQWtCLElBQUksZUFBSixFQUF4QjtBQUNBLFdBQU8sZUFBUDtBQUNELEdBL0JNLENBQVA7QUFnQ0Q7Ozs7Ozs7O2tCQzdCdUIsb0I7O0FBVHhCOzs7Ozs7QUFFQSxNQUFNLGdCQUFnQjtBQUNwQixPQUFLLEtBRGU7QUFFcEIsUUFBTTtBQUZjLENBQXRCOztBQUtBLE1BQU0sbUJBQW1CLG1CQUF6Qjs7QUFFZSxTQUFTLG9CQUFULENBQThCLEdBQTlCLEVBQW1DO0FBQ2hELFNBQU8sd0NBQXlCLEdBQXpCLEVBQThCLGdCQUE5QixFQUFnRCxNQUFNO0FBQzNELFVBQU0saUJBQU4sQ0FBd0I7QUFDdEIsb0JBQWM7QUFDWixhQUFLLFVBQUwsR0FBa0IsRUFBbEI7QUFDQSxhQUFLLFlBQUwsR0FBb0IsT0FBTyxJQUFQLENBQVksYUFBWixDQUFwQjtBQUNBLGFBQUssWUFBTCxHQUFvQixJQUFJLFFBQUosQ0FBYSxhQUFiLENBQTJCLHNCQUEzQixLQUFzRCxJQUFJLFFBQUosQ0FBYSxlQUF2RjtBQUNBLGFBQUssWUFBTCxDQUFrQixPQUFsQixDQUEyQixJQUFELElBQVU7QUFDbEMsY0FBSSxDQUFDLEtBQUssWUFBTCxDQUFrQixZQUFsQixDQUErQixJQUEvQixDQUFMLEVBQTJDO0FBQ3pDLGlCQUFLLFlBQUwsQ0FBa0IsWUFBbEIsQ0FBK0IsSUFBL0IsRUFBcUMsY0FBYyxJQUFkLENBQXJDO0FBQ0Q7QUFDRixTQUpEO0FBS0EsYUFBSyxPQUFMLEdBQWUsS0FBSyxZQUFMLENBQWtCLE1BQWxCLENBQXlCLENBQUMsR0FBRCxFQUFNLElBQU4sS0FBZTtBQUNyRCxjQUFJLElBQUosSUFBWSxLQUFLLFlBQUwsQ0FBa0IsWUFBbEIsQ0FBK0IsSUFBL0IsQ0FBWjtBQUNBLGlCQUFPLEdBQVA7QUFDRCxTQUhjLEVBR1osRUFIWSxDQUFmO0FBSUEsYUFBSyxTQUFMLEdBQWlCLElBQUksZ0JBQUosQ0FBcUIsS0FBSyxnQkFBTCxDQUFzQixJQUF0QixDQUEyQixJQUEzQixDQUFyQixDQUFqQjtBQUNBLGFBQUssU0FBTCxDQUFlLE9BQWYsQ0FBdUIsS0FBSyxZQUE1QixFQUEwQztBQUN4QyxzQkFBWTtBQUQ0QixTQUExQztBQUdEOztBQUVELHVCQUFpQixTQUFqQixFQUE0QjtBQUMxQixrQkFBVSxPQUFWLENBQW1CLFFBQUQsSUFBYztBQUM5QixnQkFBTSx3QkFBd0IsU0FBUyxhQUF2QztBQUNBLGNBQUksS0FBSyxZQUFMLENBQWtCLFFBQWxCLENBQTJCLHFCQUEzQixDQUFKLEVBQXVEO0FBQ3JELGlCQUFLLE9BQUwscUJBQ0ssS0FBSyxPQURWO0FBRUUsZUFBQyxxQkFBRCxHQUF5QixLQUFLLFlBQUwsQ0FBa0IsWUFBbEIsQ0FBK0IscUJBQS9CO0FBRjNCO0FBSUEsaUJBQUssVUFBTCxDQUFnQixPQUFoQixDQUF3QixZQUFZLFNBQVMsS0FBSyxPQUFkLENBQXBDO0FBQ0Q7QUFDRixTQVREO0FBVUQ7O0FBRUQsVUFBSSxNQUFKLENBQVcsU0FBWCxFQUFzQjtBQUNwQixlQUFPLElBQVAsQ0FBWSxTQUFaLEVBQXVCLE9BQXZCLENBQWdDLEdBQUQsSUFBUztBQUN0QyxlQUFLLFlBQUwsQ0FBa0IsWUFBbEIsQ0FBK0IsR0FBL0IsRUFBb0MsVUFBVSxHQUFWLENBQXBDO0FBQ0QsU0FGRDtBQUdEOztBQUVELFVBQUksTUFBSixHQUFhO0FBQ1gsZUFBTyxLQUFLLE9BQVo7QUFDRDs7QUFFRCxxQkFBZSxRQUFmLEVBQXlCO0FBQ3ZCLGFBQUssVUFBTCxDQUFnQixJQUFoQixDQUFxQixRQUFyQjtBQUNBLGlCQUFTLEtBQUssTUFBZDtBQUNBLGVBQU8sTUFBTTtBQUNYLGVBQUssVUFBTCxHQUFrQixLQUFLLFVBQUwsQ0FBZ0IsTUFBaEIsQ0FBdUIsTUFBTSxPQUFPLFFBQXBDLENBQWxCO0FBQ0QsU0FGRDtBQUdEO0FBakRxQjs7QUFvRHhCLFVBQU0sb0JBQW9CLElBQUksaUJBQUosRUFBMUI7QUFDQSxXQUFPLGlCQUFQO0FBQ0QsR0F2RE0sQ0FBUDtBQXdERDs7Ozs7Ozs7QUNuRUQ7O0FBRUE7Ozs7O0FBS0EsTUFBTSxhQUFhLENBQUMsRUFBRSxXQUFXLEdBQWIsS0FBcUIsRUFBdEIsS0FBOEIsS0FBRCxJQUFXO0FBQ3pELFFBQU0sbUJBQW1CLElBQUksTUFBSixDQUFZLEtBQUksUUFBUyxFQUF6QixFQUE0QixHQUE1QixDQUF6QjtBQUNBLFFBQU0saUNBQWlDLElBQUksTUFBSixDQUFZLFFBQU8sUUFBUyxHQUE1QixFQUFnQyxHQUFoQyxDQUF2QztBQUNBLFFBQU0sK0JBQStCLElBQUksTUFBSixDQUFZLE9BQU0sUUFBUyxPQUEzQixFQUFtQyxFQUFuQyxDQUFyQztBQUNBLFFBQU0saUJBQWlCLElBQUksTUFBSixDQUFXLFNBQVgsRUFBc0IsRUFBdEIsQ0FBdkI7QUFDQSxRQUFNLE9BQU8sSUFBSSxNQUFKLENBQVcsTUFBWCxFQUFtQixFQUFuQixDQUFiO0FBQ0EsUUFBTSxXQUFXLElBQUksTUFBSixDQUFXLFFBQVgsRUFBcUIsRUFBckIsQ0FBakI7QUFDQSxRQUFNLHFCQUFxQixJQUFJLE1BQUosQ0FBVyxNQUFYLEVBQW1CLEVBQW5CLENBQTNCOztBQUVBLE1BQUksYUFBYSxLQUFqQjtBQUNBLFFBQU0sZUFBZSxXQUFXLE9BQVgsQ0FBbUIsUUFBbkIsQ0FBckI7QUFDQSxRQUFNLG1CQUFtQixXQUFXLFdBQVgsQ0FBdUIsUUFBdkIsQ0FBekI7QUFDQSxRQUFNLHNCQUFzQixpQkFBaUIsZ0JBQTdDOztBQUVBLE1BQUksbUJBQUosRUFBeUI7QUFDdkIsaUJBQWMsR0FBRSxXQUFXLE9BQVgsQ0FBbUIsZ0JBQW5CLEVBQXFDLEVBQXJDLENBQXlDLEdBQUUsUUFBUyxFQUFwRTtBQUNEOztBQUVELE1BQUksWUFBWSxXQUFXLENBQVgsS0FBaUIsRUFBakM7QUFDQSxNQUFJLFdBQVcsQ0FBQyxXQUFXLE1BQVgsR0FBb0IsQ0FBcEIsR0FBd0IsV0FBVyxXQUFXLE1BQVgsR0FBb0IsQ0FBL0IsQ0FBeEIsR0FBNEQsRUFBN0QsS0FBb0UsRUFBbkY7QUFDQSxNQUFJLGNBQWMsV0FBVyxNQUFYLENBQWtCLENBQWxCLEVBQXFCLFdBQVcsTUFBWCxHQUFvQixDQUF6QyxLQUErQyxFQUFqRTs7QUFFQSxNQUFJLENBQUMsVUFBVSxLQUFWLENBQWdCLGNBQWhCLENBQUwsRUFBc0M7QUFDcEMsZ0JBQVksRUFBWjtBQUNEOztBQUVELGdCQUFjLFlBQVksT0FBWixDQUFvQiw4QkFBcEIsRUFBb0QsRUFBcEQsQ0FBZDs7QUFFQSxNQUFJLENBQUMsU0FBUyxLQUFULENBQWUsNEJBQWYsQ0FBTCxFQUFtRDtBQUNqRCxlQUFXLEVBQVg7QUFDRCxHQUZELE1BRU8sSUFBSSxTQUFTLEtBQVQsQ0FBZSxRQUFmLENBQUosRUFBOEI7QUFDbkMsUUFBSSxnQkFBZ0IsUUFBcEIsRUFBOEI7QUFDNUIsb0JBQWMsRUFBZDtBQUNELEtBRkQsTUFFTyxJQUFJLGdCQUFnQixFQUFoQixJQUFzQixVQUFVLEtBQVYsQ0FBZ0IsSUFBaEIsQ0FBMUIsRUFBaUQ7QUFDdEQsaUJBQVcsRUFBWDtBQUNEO0FBQ0YsR0FOTSxNQU1BLElBQUksYUFBYSxRQUFiLElBQXlCLGdCQUFnQixFQUF6QyxJQUErQyxVQUFVLEtBQVYsQ0FBZ0IsSUFBaEIsQ0FBbkQsRUFBMEU7QUFDL0UsZUFBVyxFQUFYO0FBQ0Q7O0FBRUQsZUFBYSxDQUFDLFNBQUQsRUFBWSxXQUFaLEVBQXlCLFFBQXpCLEVBQW1DLElBQW5DLENBQXdDLEVBQXhDLENBQWI7O0FBRUEsTUFBSSxTQUFTLEtBQVQsQ0FBZSxRQUFmLENBQUosRUFBOEI7QUFDNUIsaUJBQWEsQ0FDWCxPQUFRLEdBQUUsU0FBVSxHQUFFLFdBQVksRUFBM0IsQ0FBNkIsT0FBN0IsQ0FBcUMsUUFBckMsRUFBK0MsR0FBL0MsQ0FBUCxLQUNDLFNBQVMsS0FBVCxDQUFlLGtCQUFmLElBQXFDLElBQXJDLEdBQTRDLE9BRDdDLENBRFcsRUFHWCxRQUhXLEdBR0EsT0FIQSxDQUdRLEdBSFIsRUFHYSxRQUhiLENBQWI7QUFJRDs7QUFFRCxTQUFPLFVBQVA7QUFDRCxDQWxERDs7QUFvREE7Ozs7O0FBS0EsTUFBTSxrQkFBa0IsQ0FBQyxFQUFFLFdBQVcsR0FBYixFQUFrQixxQkFBcUIsR0FBdkMsS0FBK0MsRUFBaEQsS0FBdUQsU0FBUztBQUN0RixVQUFRLE1BQU0sT0FBTixDQUFjLEdBQWQsRUFBbUIsUUFBbkIsQ0FBUjtBQUNBLE1BQUksWUFBWSxNQUFNLENBQU4sS0FBWSxFQUE1QjtBQUNBLGNBQVksQ0FBQyxHQUFELEVBQU0sR0FBTixFQUFXLFFBQVgsQ0FBb0IsU0FBcEIsSUFBaUMsU0FBakMsR0FBNkMsRUFBekQ7QUFDQSxRQUFNLGtCQUFrQixNQUFNLE9BQU4sQ0FBYyxRQUFkLE1BQTRCLENBQUMsQ0FBckQ7QUFDQSxNQUFJLENBQUMsY0FBYyxFQUFmLEVBQW1CLFdBQVcsRUFBOUIsSUFBb0MsTUFBTSxLQUFOLENBQVksUUFBWixDQUF4QztBQUNBLGdCQUFjLFlBQVksT0FBWixDQUFvQixPQUFwQixFQUE2QixFQUE3QixDQUFkO0FBQ0EsZ0JBQWMsWUFBWSxPQUFaLENBQW9CLHVCQUFwQixFQUE2QyxrQkFBN0MsQ0FBZDtBQUNBLFFBQU0sTUFBTyxHQUFFLFNBQVUsR0FBRSxXQUFZLEdBQUUsa0JBQWtCLFFBQWxCLEdBQTZCLEVBQUcsR0FBRSxRQUFTLEVBQXBGO0FBQ0EsU0FBTyxHQUFQO0FBQ0QsQ0FWRDs7a0JBWWU7QUFDYixZQURhO0FBRWI7QUFGYSxDOzs7Ozs7OztrQkNnRFMsZTtBQTVIeEI7O0FBRUEsTUFBTSxlQUFlLE1BQXJCO0FBQ0EsTUFBTSxjQUFjLEtBQXBCO0FBQ0EsTUFBTSxZQUFZLEtBQWxCOztBQUVBLElBQUksa0JBQWtCLEVBQXRCO0FBQ0EsTUFBTSxhQUFhLFFBQVEsR0FBUixDQUFZLElBQVosQ0FBaUIsT0FBakIsQ0FBbkI7QUFDQSxNQUFNLGtCQUFrQixFQUF4Qjs7QUFFQSxTQUFTLGNBQVQsQ0FBd0IsVUFBeEIsRUFBb0MsT0FBcEMsRUFBNkM7QUFDM0MsUUFBTSxFQUFFLFNBQVMsQ0FBWCxFQUFjLGVBQWUsS0FBN0IsS0FBdUMsT0FBN0M7QUFDQSxRQUFNLFVBQVUsU0FBUyxPQUFULENBQWlCLE1BQWpCLEVBQXlCLEdBQUcsSUFBNUIsRUFBa0M7QUFDaEQsUUFBSSxZQUFKLEVBQWtCO0FBQ2hCLHdCQUFrQixDQUFDLEVBQUUsQ0FBQyxNQUFELEdBQVUsSUFBWixFQUFELENBQWxCO0FBQ0QsS0FGRCxNQUVPO0FBQ0wsc0JBQWdCLElBQWhCLENBQXFCLEVBQUUsQ0FBQyxNQUFELEdBQVUsSUFBWixFQUFyQjtBQUNEOztBQUVELGVBQVcsU0FBWCxHQUF1QixnQkFBZ0IsR0FBaEIsQ0FBcUIsS0FBRCxJQUFXO0FBQ3BELFlBQU0sU0FBUyxPQUFPLElBQVAsQ0FBWSxLQUFaLEVBQW1CLENBQW5CLENBQWY7QUFDQSxZQUFNLFNBQVMsTUFBTSxNQUFOLENBQWY7QUFDQSxZQUFNLFVBQVUsT0FBTyxHQUFQLENBQVksSUFBRCxJQUFVO0FBQ25DLGVBQ0UsQ0FBQyxTQUFELEVBQVksSUFBWixFQUFrQixRQUFsQixDQUEyQixJQUEzQixLQUNBLENBQUMsUUFBRCxFQUFXLFFBQVgsRUFBcUIsVUFBckIsRUFBaUMsUUFBakMsQ0FBMEMsT0FBTyxJQUFqRCxDQUZLLEdBSUwsSUFKSyxHQUtMLENBQUMsS0FBRCxFQUFRLEtBQVIsRUFBZSxRQUFmLENBQXdCLEtBQUssV0FBTCxDQUFpQixJQUF6QyxJQUNHLEdBQUUsS0FBSyxXQUFMLENBQWlCLElBQUssS0FBSSxLQUFLLFNBQUwsQ0FBZSxDQUFDLEdBQUcsSUFBSixDQUFmLENBQTBCLEdBRHpELEdBRUUsS0FBSyxTQUFMLENBQWUsSUFBZixFQUFxQixDQUFDLEdBQUQsRUFBTSxLQUFOLEtBQWdCO0FBQ25DLGNBQUssT0FBTyxLQUFSLEtBQW1CLFVBQXZCLEVBQW1DO0FBQ2pDLG1CQUFPLE1BQU0sUUFBTixFQUFQO0FBQ0Q7QUFDRCxpQkFBTyxLQUFQO0FBQ0QsU0FMRCxFQUtHLE1BTEgsQ0FQSjtBQWFELE9BZGUsRUFjYixJQWRhLENBY1IsSUFkUSxDQUFoQjs7QUFnQkEsWUFBTSxRQUFRO0FBQ1osYUFBSyxNQURPO0FBRVosY0FBTSxRQUZNO0FBR1osZUFBTztBQUhLLFFBSVosTUFKWSxDQUFkOztBQU1BLGFBQVEsc0JBQXFCLEtBQU0sS0FBSSxPQUFRLFFBQS9DO0FBQ0QsS0ExQnNCLEVBMEJwQixJQTFCb0IsQ0EwQmYsSUExQmUsQ0FBdkI7QUEyQkQsR0FsQ0Q7QUFtQ0EsR0FBQyxLQUFELEVBQVEsTUFBUixFQUFnQixPQUFoQixFQUF5QixPQUF6QixDQUFrQyxNQUFELElBQVk7QUFDM0Msb0JBQWdCLE1BQWhCLElBQTBCLFFBQVEsTUFBUixDQUExQjtBQUNBLFlBQVEsTUFBUixJQUFrQixRQUFRLElBQVIsQ0FBYSxPQUFiLEVBQXNCLE1BQXRCLENBQWxCO0FBQ0QsR0FIRDtBQUlBLFNBQU8sZ0JBQVAsQ0FBd0IsT0FBeEIsRUFBa0MsR0FBRCxJQUFTO0FBQ3hDO0FBQ0EsWUFBUSxLQUFSLENBQWUsSUFBRyxJQUFJLE9BQVEsVUFBUyxJQUFJLFFBQVMsSUFBRyxJQUFJLE1BQU8sRUFBbEU7QUFDQSxZQUFRLEtBQVIsQ0FBYyxHQUFkLEVBQW1CLElBQUksS0FBSixDQUFVLEtBQTdCO0FBQ0E7QUFDRCxHQUxEO0FBTUEsYUFBVyxrQkFBWDtBQUNBLFNBQU8sU0FBUyxjQUFULEdBQTBCO0FBQy9CLEtBQUMsS0FBRCxFQUFRLE1BQVIsRUFBZ0IsT0FBaEIsRUFBeUIsT0FBekIsQ0FBa0MsTUFBRCxJQUFZO0FBQzNDLGNBQVEsTUFBUixJQUFrQixnQkFBZ0IsTUFBaEIsQ0FBbEI7QUFDRCxLQUZEO0FBR0EsZUFBVyxrQkFBWDtBQUNELEdBTEQ7QUFNRDs7QUFFRCxTQUFTLGFBQVQsQ0FBdUI7QUFDckIsU0FEcUI7QUFFckIsZ0JBQWM7QUFDWixlQUFXLFdBREMsRUFDWSxZQUFZLFlBRHhCO0FBRVosWUFBUyxnQkFBZSxRQUFTLFVBRnJCLEVBRWdDLFNBQVMsT0FGekM7QUFHWixpQkFBYTtBQUhEO0FBRk8sQ0FBdkIsRUFPRztBQUNELFFBQU0sRUFBRSxNQUFNLEtBQVIsS0FBa0IsT0FBeEI7QUFDQSxRQUFNLFVBQVUsU0FBUyxhQUFULENBQXVCLEtBQXZCLENBQWhCO0FBQ0EsVUFBUSxFQUFSLEdBQWEscUJBQWI7QUFDQSxVQUFRLEtBQVIsQ0FBYyxPQUFkLEdBQXlCOzs7Ozs7YUFNZCxLQUFNO2NBQ0wsTUFBTztXQUNWLFNBQVU7TUFDZixNQUFNLE9BQU4sR0FBZ0IsTUFBTztrQkFDWCxVQUFXOzs7S0FWM0I7QUFjQSxTQUFPLE9BQVA7QUFDRDs7QUFFRCxTQUFTLFlBQVQsQ0FBc0I7QUFDcEIsU0FEb0I7QUFFcEIsZUFBYTtBQUNYLGVBQVcsT0FEQTtBQUVYLFlBQVEsTUFGRyxFQUVLLFNBQVMsWUFGZCxFQUU0QixNQUFNLFNBRmxDLEVBRTZDLFFBQVEsV0FGckQ7QUFHWCxpQkFBYTtBQUhGO0FBRk8sQ0FBdEIsRUFPRztBQUNELFFBQU0sRUFBRSxNQUFNLEtBQVIsS0FBa0IsT0FBeEI7QUFDQSxRQUFNLFNBQVMsU0FBUyxhQUFULENBQXVCLEtBQXZCLENBQWY7QUFDQSxTQUFPLEVBQVAsR0FBWSw0QkFBWjtBQUNBLFNBQU8sS0FBUCxDQUFhLE9BQWIsR0FBd0I7Z0JBQ1YsUUFBUzthQUNaLEtBQU07Y0FDTCxNQUFPO1dBQ1YsR0FBSTtNQUNULE1BQU0sT0FBTixHQUFnQixNQUFPLEtBQUksS0FBTTtrQkFDckIsVUFBVzs7S0FOM0I7QUFTQSxTQUFPLE1BQVA7QUFDRDs7QUFFRDs7Ozs7OztBQU9lLFNBQVMsZUFBVCxDQUF5QjtBQUN0QyxnQkFBYyxFQUR3QjtBQUV0QyxpQkFBZSxFQUZ1QjtBQUd0QyxZQUFVO0FBSDRCLElBSXBDLEVBSlcsRUFJUDtBQUNOLFFBQU0sU0FBUyxhQUFhO0FBQzFCLFdBRDBCO0FBRTFCO0FBRjBCLEdBQWIsQ0FBZjtBQUlBLFFBQU0sVUFBVSxjQUFjO0FBQzVCLG9DQUNLLFlBREw7QUFFRSxpQkFBVyxZQUFZLE1BRnpCO0FBR0UsZ0JBQVUsWUFBWTtBQUh4QixNQUQ0QjtBQU01QjtBQU40QixHQUFkLENBQWhCOztBQVNBLFVBQVEsZ0JBQVIsQ0FBeUIsT0FBekIsRUFBbUMsQ0FBRCxJQUFPO0FBQ3ZDLE1BQUUsZUFBRjtBQUNELEdBRkQ7O0FBSUEsU0FBTyxnQkFBUCxDQUF3QixPQUF4QixFQUFrQyxDQUFELElBQU87QUFDdEMsTUFBRSxlQUFGO0FBQ0EsUUFBSSxDQUFDLE9BQU8sUUFBUCxDQUFnQixPQUFoQixDQUFMLEVBQStCO0FBQzdCLGFBQU8sV0FBUCxDQUFtQixPQUFuQjtBQUNBLGNBQVEsU0FBUixHQUFvQixRQUFRLFlBQVIsR0FBdUIsUUFBUSxZQUFuRDtBQUNELEtBSEQsTUFHTztBQUNMLGFBQU8sV0FBUCxDQUFtQixPQUFuQjtBQUNEO0FBQ0YsR0FSRDs7QUFVQSxXQUFTLElBQVQsQ0FBYyxXQUFkLENBQTBCLE1BQTFCO0FBQ0EsUUFBTSxpQkFBaUIsZUFBZSxPQUFmLEVBQXdCLE9BQXhCLENBQXZCOztBQUVBLFNBQU8sU0FBUyxPQUFULEdBQW1CO0FBQ3hCLGFBQVMsSUFBVCxDQUFjLFdBQWQsQ0FBMEIsTUFBMUI7QUFDQTtBQUNELEdBSEQ7QUFJRDs7Ozs7Ozs7a0JDM0p1QixRO0FBUnhCOzs7Ozs7OztBQVFlLFNBQVMsUUFBVCxDQUFrQixPQUFsQixFQUEyQixHQUFHLElBQTlCLEVBQW9DO0FBQ2pELFNBQVEsQ0FBQyxHQUFHLE1BQUosS0FBZTtBQUNyQixVQUFNLE9BQU8sT0FBTyxPQUFPLE1BQVAsR0FBZ0IsQ0FBdkIsS0FBNkIsRUFBMUM7QUFDQSxVQUFNLFNBQVMsQ0FBQyxRQUFRLENBQVIsQ0FBRCxDQUFmO0FBQ0EsU0FBSyxPQUFMLENBQWEsQ0FBQyxHQUFELEVBQU0sQ0FBTixLQUFZO0FBQ3ZCLFlBQU0sUUFBUSxPQUFPLFNBQVAsQ0FBaUIsR0FBakIsSUFBd0IsT0FBTyxHQUFQLENBQXhCLEdBQXNDLEtBQUssR0FBTCxDQUFwRDtBQUNBLGFBQU8sSUFBUCxDQUFZLEtBQVosRUFBbUIsUUFBUSxJQUFJLENBQVosQ0FBbkI7QUFDRCxLQUhEO0FBSUEsV0FBTyxPQUFPLElBQVAsQ0FBWSxFQUFaLENBQVA7QUFDRCxHQVJEO0FBU0Q7Ozs7Ozs7OztBQ2pCRDs7QUFFQSxNQUFNLHVCQUF3QixJQUFELElBQVU7QUFDckMsT0FBSyxLQUFMLENBQVcsTUFBWCxHQUFvQixTQUFwQjtBQUNBLE9BQUssS0FBTCxDQUFXLGFBQVgsR0FBMkIsTUFBM0I7QUFDQSxPQUFLLEtBQUwsQ0FBVyxnQkFBWCxHQUE4QixNQUE5QjtBQUNBLE9BQUssS0FBTCxDQUFXLFlBQVgsR0FBMEIsTUFBMUI7QUFDQSxPQUFLLEtBQUwsQ0FBVyxVQUFYLEdBQXdCLE1BQXhCO0FBQ0QsQ0FORDs7QUFRQSxNQUFNLHNCQUF1QixJQUFELElBQVU7QUFDcEMsT0FBSyxLQUFMLENBQVcsTUFBWCxHQUFvQixNQUFwQjtBQUNBLE9BQUssS0FBTCxDQUFXLGFBQVgsR0FBMkIsSUFBM0I7QUFDQSxPQUFLLEtBQUwsQ0FBVyxnQkFBWCxHQUE4QixJQUE5QjtBQUNBLE9BQUssS0FBTCxDQUFXLFlBQVgsR0FBMEIsSUFBMUI7QUFDQSxPQUFLLEtBQUwsQ0FBVyxVQUFYLEdBQXdCLElBQXhCO0FBQ0QsQ0FORDs7QUFRQSxNQUFNLHNCQUF1QixJQUFELElBQVU7QUFDcEMsT0FBSyxnQkFBTCxDQUFzQixXQUF0QixFQUFtQyxjQUFuQztBQUNBLE9BQUssZ0JBQUwsQ0FBc0IsV0FBdEIsRUFBbUMsY0FBbkM7QUFDQSxPQUFLLGdCQUFMLENBQXNCLFNBQXRCLEVBQWlDLGdCQUFqQztBQUNBLE9BQUssZ0JBQUwsQ0FBc0IsVUFBdEIsRUFBa0MsZ0JBQWxDO0FBQ0EsT0FBSyxnQkFBTCxDQUFzQixhQUF0QixFQUFxQyxnQkFBckM7QUFDRCxDQU5EOztBQVFBLE1BQU0scUJBQXNCLElBQUQsSUFBVTtBQUNuQyxPQUFLLG1CQUFMLENBQXlCLFdBQXpCLEVBQXNDLGNBQXRDO0FBQ0EsT0FBSyxtQkFBTCxDQUF5QixXQUF6QixFQUFzQyxjQUF0QztBQUNBLE9BQUssbUJBQUwsQ0FBeUIsU0FBekIsRUFBb0MsZ0JBQXBDO0FBQ0EsT0FBSyxtQkFBTCxDQUF5QixVQUF6QixFQUFxQyxnQkFBckM7QUFDQSxPQUFLLG1CQUFMLENBQXlCLGFBQXpCLEVBQXdDLGdCQUF4QztBQUNELENBTkQ7O0FBUUEsTUFBTSxpQkFBa0IsQ0FBRCxJQUFPO0FBQzVCLFFBQU0sT0FBTyxFQUFFLE1BQWY7QUFDQSxRQUFNLE1BQU0sS0FBSyxhQUFqQjtBQUNBLFFBQU0sTUFBTSxJQUFJLFdBQWhCO0FBQ0EsVUFBUSxFQUFFLElBQVY7QUFDRSxTQUFLLFdBQUw7QUFDQSxTQUFLLFdBQUw7QUFDRSxVQUFJLFlBQUosSUFBb0IsSUFBSSxZQUFKLEdBQW1CLGVBQW5CLEVBQXBCO0FBQ0E7QUFDRjtBQUNFO0FBTko7QUFRRCxDQVpEOztBQWNBLE1BQU0sb0JBQXFCLENBQUQsSUFBTztBQUMvQixRQUFNLE9BQU8sRUFBRSxNQUFmO0FBQ0EsUUFBTSxNQUFNLEtBQUssYUFBakI7QUFDQSxRQUFNLE1BQU0sSUFBSSxXQUFoQjtBQUNBO0FBQ0EsTUFBSSxZQUFKLElBQW9CLElBQUksWUFBSixHQUFtQixlQUFuQixFQUFwQjtBQUNBO0FBQ0E7QUFDQSx1QkFBcUIsSUFBSSxJQUF6QjtBQUNBO0FBQ0Esc0JBQW9CLEdBQXBCO0FBQ0QsQ0FYRDs7QUFhQSxNQUFNLG1CQUFvQixDQUFELElBQU87QUFDOUIsUUFBTSxPQUFPLEVBQUUsTUFBZjtBQUNBLFFBQU0sTUFBTSxLQUFLLGFBQWpCO0FBQ0E7QUFDQTtBQUNBLHNCQUFvQixJQUFJLElBQXhCO0FBQ0E7QUFDQSxxQkFBbUIsR0FBbkI7QUFDRCxDQVJEOztBQVVBLE1BQU0sa0JBQW1CLENBQUQsSUFBTztBQUM3QjtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUUsY0FBRixHQUw2QixDQUtUO0FBQ3BCLG9CQUFrQixDQUFsQjtBQUNELENBUEQ7O0FBU0EsTUFBTSxtQkFBb0IsSUFBRCxJQUFVO0FBQ2pDO0FBQ0EsdUJBQXFCLElBQXJCO0FBQ0EsT0FBSyxnQkFBTCxDQUFzQixZQUF0QixFQUFvQyxlQUFwQztBQUNBLE9BQUssZ0JBQUwsQ0FBc0IsV0FBdEIsRUFBbUMsZUFBbkM7QUFDRCxDQUxEOztBQU9BLE1BQU0sa0JBQW1CLElBQUQsSUFBVTtBQUNoQyxzQkFBb0IsSUFBcEI7QUFDQSxPQUFLLG1CQUFMLENBQXlCLFlBQXpCLEVBQXVDLGVBQXZDO0FBQ0EsT0FBSyxtQkFBTCxDQUF5QixXQUF6QixFQUFzQyxlQUF0QztBQUNELENBSkQ7O2tCQU1lO0FBQ2Isa0JBRGE7QUFFYjtBQUZhLEM7Ozs7Ozs7O2tCQ3hGUyxZOztBQUx4Qjs7OztBQUNBOzs7Ozs7QUFFQSxNQUFNLG1CQUFtQixZQUF6Qjs7QUFFZSxTQUFTLFlBQVQsQ0FBc0IsR0FBdEIsRUFBMkI7QUFDeEMsU0FBTyx3Q0FBeUIsR0FBekIsRUFBOEIsZ0JBQTlCLEVBQWdELE1BQU07QUFDM0QsVUFBTTtBQUNKLDBCQURJO0FBRUosK0JBRkk7QUFHSjtBQUhJLFFBSUYsb0NBQXdCLEdBQXhCLENBSko7O0FBTUEsVUFBTSxTQUFOLFNBQXdCLG9CQUF4QixDQUE2Qzs7QUFFM0MsaUJBQVcsZ0JBQVgsR0FBOEI7QUFDNUIsZUFBTyxnQkFBUDtBQUNEOztBQUVELGlCQUFXLGlCQUFYLEdBQStCO0FBQzdCLGVBQVE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztTQUFSO0FBNEVEO0FBbkYwQzs7QUFzRjdDLFdBQU8sYUFDTCwwQkFDRSxTQURGLENBREssQ0FBUDtBQUtELEdBbEdNLENBQVA7QUFtR0Q7O0FBRUQsYUFBYSxnQkFBYixHQUFnQyxnQkFBaEM7Ozs7Ozs7O2tCQ3BHd0Isa0I7O0FBTnhCOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7O0FBRUEsTUFBTSxtQkFBbUIsbUJBQXpCOztBQUVlLFNBQVMsa0JBQVQsQ0FBNEIsR0FBNUIsRUFBaUM7QUFDOUMsU0FBTyx3Q0FBeUIsR0FBekIsRUFBOEIsZ0JBQTlCLEVBQWdELE1BQU07QUFDM0QsVUFBTTtBQUNKLDBCQURJO0FBRUosK0JBRkk7QUFHSjtBQUhJLFFBSUYsb0NBQXdCLEdBQXhCLENBSko7QUFLQSxVQUFNLFlBQVkseUJBQWEsR0FBYixDQUFsQjs7QUFFQSxVQUFNLGVBQU4sU0FBOEIsb0JBQTlCLENBQW1EOztBQUVqRCxpQkFBVyxnQkFBWCxHQUE4QjtBQUM1QixlQUFPLGdCQUFQO0FBQ0Q7O0FBRUQsaUJBQVcsaUJBQVgsR0FBK0I7QUFDN0IsZUFBUTs7Ozs7Ozs7Ozs7Ozs7OztTQUFSO0FBaUJEOztBQUVELGlCQUFXLFlBQVgsR0FBMEI7QUFDeEIsZUFBTyxDQUFDLFNBQUQsQ0FBUDtBQUNEOztBQTVCZ0Q7O0FBZ0NuRCxXQUFPLGFBQ0wsMEJBQ0UsZUFERixDQURLLENBQVA7QUFLRCxHQTdDTSxDQUFQO0FBOENEOztBQUVELG1CQUFtQixnQkFBbkIsR0FBc0MsZ0JBQXRDOzs7Ozs7OztrQkNoRHdCLG9COztBQU54Qjs7OztBQUNBOzs7O0FBQ0E7Ozs7OztBQUVBLE1BQU0sbUJBQW1CLHNCQUF6QjtBQU5BOztBQVFlLFNBQVMsb0JBQVQsQ0FBOEIsR0FBOUIsRUFBbUM7QUFDaEQsU0FBTyx3Q0FBeUIsR0FBekIsRUFBOEIsZ0JBQTlCLEVBQWdELE1BQU07QUFDM0QsVUFBTTtBQUNKLDBCQURJO0FBRUosK0JBRkk7QUFHSjtBQUhJLFFBSUYsb0NBQXdCLEdBQXhCLENBSko7O0FBTUEsVUFBTSxpQkFBTixTQUFnQyxvQkFBaEMsQ0FBcUQ7O0FBRW5ELGlCQUFXLGdCQUFYLEdBQThCO0FBQzVCLGVBQU8sZ0JBQVA7QUFDRDs7QUFFRCxpQkFBVyxpQkFBWCxHQUErQjtBQUM3QjtBQUNBLGVBQVE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztTQUFSO0FBZ0VEOztBQUVELGlCQUFXLGtCQUFYLEdBQWdDO0FBQzlCLGVBQU87QUFDTCxnQkFBTTtBQURELFNBQVA7QUFHRDs7QUE5RWtEOztBQWtGckQsV0FBTyxhQUNMLHlCQUNFLDBCQUNFLGlCQURGLENBREYsQ0FESyxDQUFQO0FBUUQsR0FqR00sQ0FBUDtBQWtHRDs7QUFFRCxxQkFBcUIsZ0JBQXJCLEdBQXdDLGdCQUF4Qzs7Ozs7Ozs7a0JDbEd3QixXOztBQVh4Qjs7OztBQUNBOzs7Ozs7QUFFQSxNQUFNLG1CQUFtQixXQUF6Qjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVlLFNBQVMsV0FBVCxDQUFxQixHQUFyQixFQUEwQjtBQUN2QyxTQUFPLHdDQUF5QixHQUF6QixFQUE4QixnQkFBOUIsRUFBZ0QsTUFBTTtBQUMzRCxVQUFNO0FBQ0osMEJBREk7QUFFSiwrQkFGSTtBQUdKO0FBSEksUUFJRixvQ0FBd0IsR0FBeEIsQ0FKSjs7QUFNQSxVQUFNLFFBQU4sU0FBdUIsb0JBQXZCLENBQTRDOztBQUUxQyxpQkFBVyxnQkFBWCxHQUE4QjtBQUM1QixlQUFPLGdCQUFQO0FBQ0Q7O0FBRUQsaUJBQVcsaUJBQVgsR0FBK0I7QUFDN0IsZUFBUTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztTQUFSO0FBdUJEOztBQUVELGlCQUFXLG1CQUFYLEdBQWlDO0FBQy9CLGNBQU0sK0JBQStCLE1BQU0sbUJBQU4sSUFBNkIsRUFBbEU7QUFDQSxlQUFPLENBQUMsR0FBRyw0QkFBSixFQUFrQyxPQUFsQyxDQUFQO0FBQ0Q7O0FBRUQsaUJBQVcsa0JBQVgsR0FBZ0M7QUFDOUIsY0FBTSw4QkFBOEIsTUFBTSxrQkFBTixJQUE0QixFQUFoRTtBQUNBLGVBQU8sQ0FBQyxHQUFHLDJCQUFKLEVBQWlDLE9BQWpDLENBQVA7QUFDRDs7QUFFRCxVQUFJLEtBQUosR0FBWTtBQUNWLGVBQU8sS0FBSyxZQUFMLENBQWtCLE9BQWxCLENBQVA7QUFDRDs7QUFFRCxVQUFJLEtBQUosQ0FBVSxLQUFWLEVBQWlCO0FBQ2YsY0FBTSxXQUFXLENBQUMsQ0FBQyxTQUFELEVBQVksSUFBWixFQUFrQixRQUFsQixDQUEyQixLQUEzQixDQUFsQjtBQUNBLGNBQU0sY0FBYyxPQUFPLEtBQVAsQ0FBcEI7QUFDQSxZQUFJLFFBQUosRUFBYztBQUNaLGVBQUssWUFBTCxDQUFrQixPQUFsQixFQUEyQixXQUEzQjtBQUNELFNBRkQsTUFFTztBQUNMLGVBQUssZUFBTCxDQUFxQixPQUFyQjtBQUNEO0FBQ0Y7O0FBRUQsK0JBQXlCLElBQXpCLEVBQStCLFFBQS9CLEVBQXlDLFFBQXpDLEVBQW1EO0FBQ2pELGNBQU0sd0JBQU4sSUFDRSxNQUFNLHdCQUFOLENBQStCLElBQS9CLEVBQXFDLFFBQXJDLEVBQStDLFFBQS9DLENBREY7O0FBR0EsY0FBTSxXQUFXLENBQUMsQ0FBQyxTQUFELEVBQVksSUFBWixFQUFrQixRQUFsQixDQUEyQixRQUEzQixDQUFsQjtBQUNBLFlBQUksU0FBUyxPQUFiLEVBQXNCO0FBQ3BCLHFCQUFXLEtBQUssU0FBTCxFQUFYLEdBQThCLEtBQUssWUFBTCxFQUE5QjtBQUNEO0FBQ0Y7O0FBRUQsa0JBQVk7QUFDVixjQUFNLE9BQU8sS0FBSyxVQUFMLENBQWdCLGFBQWhCLENBQThCLFlBQTlCLENBQWI7QUFDQSxhQUFLLFlBQUwsQ0FBa0IsR0FBbEIsRUFBdUIsS0FBSyxLQUE1QjtBQUNEOztBQUVELHFCQUFlO0FBQ2IsY0FBTSxPQUFPLEtBQUssVUFBTCxDQUFnQixhQUFoQixDQUE4QixZQUE5QixDQUFiO0FBQ0EsYUFBSyxZQUFMLENBQWtCLEdBQWxCLEVBQXVCLEVBQXZCO0FBQ0Q7O0FBMUV5Qzs7QUE4RTVDLFdBQU8sYUFDTCwwQkFDRSxRQURGLENBREssQ0FBUDtBQU1ELEdBM0ZNLENBQVA7QUE0RkQ7O0FBRUQsWUFBWSxnQkFBWixHQUErQixnQkFBL0I7Ozs7Ozs7O2tCQ2xHd0IsaUI7O0FBUnhCOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7O0FBRUEsTUFBTSw0QkFBNEIsVUFBbEM7O0FBRUEsTUFBTSxtQkFBbUIsaUJBQXpCOztBQUVlLFNBQVMsaUJBQVQsQ0FBMkIsR0FBM0IsRUFBZ0M7QUFDN0MsU0FBTyx3Q0FBeUIsR0FBekIsRUFBOEIsZ0JBQTlCLEVBQWdELE1BQU07QUFDM0QsVUFBTTtBQUNKLDBCQURJO0FBRUosK0JBRkk7QUFHSjtBQUhJLFFBSUYsb0NBQXdCLEdBQXhCLENBSko7O0FBTUEsVUFBTSxjQUFjLCtCQUFtQixHQUFuQixDQUFwQjs7QUFFQSxVQUFNLGNBQU4sU0FBNkIsb0JBQTdCLENBQWtEOztBQUVoRCxpQkFBVyxnQkFBWCxHQUE4QjtBQUM1QixlQUFPLGdCQUFQO0FBQ0Q7O0FBRUQsaUJBQVcsaUJBQVgsR0FBK0I7QUFDN0IsZUFBUTs7Ozs7OztTQUFSO0FBUUQ7O0FBRUQsaUJBQVcsa0JBQVgsR0FBZ0M7QUFDOUIsZUFBTyxDQUFDLEdBQUcsTUFBTSxrQkFBVixFQUE4QixTQUE5QixFQUF5QyxXQUF6QyxDQUFQO0FBQ0Q7O0FBRUQsVUFBSSx5QkFBSixHQUFnQztBQUM5QixlQUFPLENBQUMsR0FBRyxNQUFNLHlCQUFWLEVBQXFDLEdBQUcsS0FBSyw2QkFBN0MsQ0FBUDtBQUNEOztBQUVELFVBQUksb0JBQUosR0FBMkI7QUFDekIsZUFBTyxJQUFQO0FBQ0Q7O0FBRUQsVUFBSSxRQUFKLEdBQWU7QUFDYixlQUFPLEtBQUssWUFBTCxDQUFrQixTQUFsQixDQUFQO0FBQ0Q7O0FBRUQsVUFBSSxZQUFKLEdBQW1CO0FBQ2pCLGVBQU8sS0FBSyxZQUFMLENBQWtCLFdBQWxCLENBQVA7QUFDRDs7QUFFRCxVQUFJLHdCQUFKLEdBQStCO0FBQzdCLGVBQU8sWUFBWSxZQUFaLENBQXlCLEtBQUssWUFBOUIsS0FBK0MsRUFBdEQ7QUFDRDs7QUFFRCxVQUFJLFNBQUosR0FBZ0I7QUFDZCxlQUFPLEtBQUssd0JBQUwsQ0FBOEIsS0FBSyxRQUFuQyxNQUFpRCxNQUFNLGNBQXZELENBQVA7QUFDRDs7QUFFRCxVQUFJLHdCQUFKLEdBQStCO0FBQzdCO0FBQ0EsZUFBTyxNQUFNLElBQU4sQ0FBVyxLQUFLLFVBQWhCLEVBQ0osTUFESSxDQUNJLElBQUQsSUFBVSxLQUFLLElBQUwsQ0FBVSxVQUFWLENBQXFCLHlCQUFyQixDQURiLENBQVA7QUFFRDs7QUFFRCxVQUFJLDZCQUFKLEdBQW9DO0FBQ2xDLGVBQU8sS0FBSyx3QkFBTCxDQUE4QixHQUE5QixDQUFtQyxJQUFELElBQVUsS0FBSyxJQUFqRCxDQUFQO0FBQ0Q7O0FBRUQsVUFBSSxlQUFKLEdBQXNCO0FBQ3BCO0FBQ0EsZUFBTyxLQUFLLHdCQUFMLENBQ0osTUFESSxDQUNHLENBQUMsR0FBRCxFQUFNLElBQU4sS0FBZTtBQUNyQixjQUFJLEtBQUssSUFBTCxDQUFVLEtBQVYsQ0FBZ0IsMEJBQTBCLE1BQTFDLENBQUosSUFBeUQsS0FBSyxLQUE5RDtBQUNBLGlCQUFPLEdBQVA7QUFDRCxTQUpJLEVBSUYsRUFKRSxDQUFQO0FBS0Q7O0FBR0QsMkJBQXFCO0FBQ25CLGNBQU0saUJBQWlCLEtBQUssZUFBNUI7QUFDQSxjQUFNLE9BQU8sRUFBYjtBQUNBLGNBQU0sU0FBUyxFQUFmOztBQUVBLGVBQU8sSUFBUCxDQUFZLGNBQVosRUFBNEIsT0FBNUIsQ0FBcUMsR0FBRCxJQUFTO0FBQzNDLGlCQUFPLFNBQVAsQ0FBaUIsT0FBTyxHQUFQLENBQWpCLElBQ0UsS0FBSyxJQUFMLENBQVUsZUFBZSxHQUFmLENBQVYsQ0FERixHQUVHLE9BQU8sR0FBUCxJQUFjLGVBQWUsR0FBZixDQUZqQjtBQUdELFNBSkQ7O0FBTUEsYUFBSyxVQUFMLENBQWdCLGFBQWhCLENBQThCLE1BQTlCLEVBQXNDLFNBQXRDLEdBQ0UsS0FBSyxTQUFMLENBQWUsR0FBRyxJQUFsQixFQUF3QixNQUF4QixDQURGO0FBRUQ7O0FBRUQsNEJBQXNCO0FBQ3BCLGFBQUssa0JBQUw7QUFDRDs7QUFFRCxtQ0FBNkI7QUFDM0IsYUFBSyxrQkFBTDtBQUNEOztBQXRGK0M7O0FBMEZsRCxXQUFPLGFBQ0wsMEJBQ0UsY0FERixDQURLLENBQVA7QUFLRCxHQXhHTSxDQUFQO0FBeUdEOztBQUVELGtCQUFrQixnQkFBbEIsR0FBcUMsZ0JBQXJDOzs7Ozs7Ozs7QUNwSEEsTUFBTSxvQkFBcUI7Ozs7Ozs7Ozs7R0FBM0I7O2tCQVllLGlCOzs7Ozs7OztrQkN3QlMsdUI7O0FBcEN4Qjs7OztBQUNBOzs7O0FBQ0E7Ozs7OztBQUVBLE1BQU07QUFDSixrQkFESTtBQUVKO0FBRkksSUFHRiwwQkFISjs7QUFLQSxNQUFNLG1CQUFtQixzQkFBekI7O0FBRUEsU0FBUyxtQkFBVCxDQUE2QixHQUE3QixFQUFrQztBQUNoQyxRQUFNLEVBQUUsUUFBRixLQUFlLEdBQXJCO0FBQ0EsUUFBTSxjQUFjLFNBQVMsYUFBVCxDQUF1QixPQUF2QixDQUFwQjtBQUNBLGNBQVksWUFBWixDQUF5QixzQkFBekIsRUFBaUQsRUFBakQ7QUFDQSxjQUFZLFNBQVosR0FBd0IsMkJBQXhCO0FBQ0EsV0FBUyxhQUFULENBQXVCLE1BQXZCLEVBQStCLFdBQS9CLENBQTJDLFdBQTNDO0FBQ0Q7O0FBRUQ7Ozs7Ozs7QUFPQTtBQUNBOzs7Ozs7Ozs7QUFTZSxTQUFTLHVCQUFULENBQWlDLEdBQWpDLEVBQXNDO0FBQ25ELFNBQU8sd0NBQXlCLEdBQXpCLEVBQThCLGdCQUE5QixFQUFnRCxNQUFNO0FBQzNELHdCQUFvQixHQUFwQjs7QUFFQSxVQUFNLEVBQUUsUUFBRixFQUFZLFdBQVosRUFBeUIsY0FBekIsS0FBNEMsR0FBbEQ7O0FBRUEsVUFBTSxvQkFBTixTQUFtQyxXQUFuQyxDQUErQzs7QUFFN0M7Ozs7QUFJQSxpQkFBVyxnQkFBWCxHQUE4QjtBQUM1QixjQUFNLElBQUksS0FBSixDQUFVLHFEQUFWLENBQU47QUFDRDs7QUFFRDs7OztBQUlBLGlCQUFXLGlCQUFYLEdBQStCO0FBQzdCLGVBQU8sOEJBQVA7QUFDRDs7QUFFRDs7OztBQUlBLGlCQUFXLFlBQVgsR0FBMEI7QUFDeEIsZUFBTyxFQUFQO0FBQ0Q7O0FBRUQ7Ozs7QUFJQSxpQkFBVyxtQkFBWCxHQUFpQztBQUMvQixlQUFPLENBQUMsY0FBRCxDQUFQO0FBQ0Q7O0FBRUQ7Ozs7QUFJQSxpQkFBVyxrQkFBWCxHQUFnQztBQUM5QixlQUFPLEVBQUUsc0JBQXNCLEVBQXhCLEVBQVA7QUFDRDs7QUFFRDs7OztBQUlBLGlCQUFXLGtCQUFYLEdBQWdDO0FBQzlCO0FBQ0EsZUFBTyxDQUFDLEtBQUQsRUFBUSxNQUFSLEVBQWdCLGtCQUFoQixFQUFvQyxjQUFwQyxDQUFQO0FBQ0Q7O0FBRUQ7Ozs7QUFJQSxVQUFJLHlCQUFKLEdBQWdDO0FBQzlCLGVBQU8sRUFBUDtBQUNEOztBQUVEOzs7O0FBSUEsVUFBSSxvQkFBSixHQUEyQjtBQUN6QixlQUFPLEtBQVA7QUFDRDs7QUFFRDs7OztBQUlBLFVBQUksU0FBSixHQUFnQjtBQUNkLGVBQU8sS0FBSyxVQUFaO0FBQ0Q7O0FBRUQ7Ozs7QUFJQSxVQUFJLGNBQUosR0FBcUI7QUFDbkI7QUFDQTtBQUNBO0FBQ0EsZUFBTyxLQUFLLGVBQVo7QUFDRDs7QUFFRCxvQkFBYztBQUNaOztBQUVBLGFBQUssWUFBTCxDQUFrQjtBQUNoQixnQkFBTTtBQUNOO0FBQ0E7QUFDQTtBQUpnQixTQUFsQjs7QUFPQSxhQUFLLG1CQUFMLEdBQTJCLEtBQTNCO0FBQ0EsYUFBSyxpQkFBTCxHQUF5QixFQUF6QjtBQUNBLGFBQUssb0JBQUwsR0FBNEIsRUFBNUI7QUFDQSxhQUFLLGtCQUFMLEdBQTBCLElBQTFCO0FBQ0EsYUFBSyxvQkFBTCxHQUE0QixFQUE1QjtBQUNBLGFBQUssVUFBTCxHQUFrQixLQUFsQjtBQUNBLGFBQUssZUFBTCxHQUF1QixLQUF2QjtBQUNBLGFBQUssZUFBTCxHQUF1QixJQUF2QjtBQUNBLGFBQUssMEJBQUwsR0FBa0MsSUFBbEM7QUFDQSxhQUFLLG9DQUFMLEdBQTRDLEVBQTVDO0FBQ0EsYUFBSyxlQUFMOztBQUVBLGFBQUssaUJBQUwsR0FBeUIsS0FBSyxpQkFBTCxDQUF1QixJQUF2QixDQUE0QixJQUE1QixDQUF6QjtBQUNBLGFBQUssb0JBQUwsR0FBNEIsS0FBSyxvQkFBTCxDQUEwQixJQUExQixDQUErQixJQUEvQixDQUE1QjtBQUNBLGFBQUssd0JBQUwsR0FBZ0MsS0FBSyx3QkFBTCxDQUE4QixJQUE5QixDQUFtQyxJQUFuQyxDQUFoQztBQUNBLGFBQUssZUFBTCxHQUF1QixLQUFLLGVBQUwsQ0FBcUIsSUFBckIsQ0FBMEIsSUFBMUIsQ0FBdkI7QUFDRDs7QUFFRDs7QUFFQSw2Q0FBdUM7QUFDckMsWUFBSSxDQUFDLEtBQUssb0JBQVYsRUFBZ0M7O0FBRWhDLGFBQUssMEJBQUwsR0FBa0MsSUFBSSxJQUFJLGdCQUFSLENBQTBCLFNBQUQsSUFBZTtBQUN4RSxvQkFBVSxPQUFWLENBQW1CLFFBQUQsSUFBYztBQUM5QixrQkFBTSxFQUFFLFFBQUYsRUFBWSxhQUFaLEtBQThCLFFBQXBDO0FBQ0Esa0JBQU0sV0FBVyxLQUFLLFlBQUwsQ0FBa0IsYUFBbEIsQ0FBakI7QUFDQSxrQkFBTSx5Q0FBeUMsS0FBSyx5QkFBcEQ7QUFDQSxrQkFBTSxzQ0FBc0MsS0FBSyxvQ0FBakQ7QUFDQSxrQkFBTSwwQ0FBMEMsT0FBTyxJQUFQLENBQVksbUNBQVosQ0FBaEQ7QUFDQSxrQkFBTSx5Q0FDSix1Q0FBdUMsUUFBdkMsQ0FBZ0QsYUFBaEQsQ0FERjtBQUVBLGtCQUFNLDBDQUNKLHdDQUF3QyxRQUF4QyxDQUFpRCxhQUFqRCxDQURGOztBQUdBLGdCQUFJLHNDQUFKLEVBQTRDO0FBQzFDLG1CQUFLLG9DQUFMLENBQTBDLGFBQTFDLElBQTJELFFBQTNEO0FBQ0EsbUJBQUssd0JBQUwsQ0FDRSxhQURGLEVBQ2lCLFFBRGpCLEVBQzJCLFFBRDNCO0FBR0QsYUFMRCxNQUtPLElBQUksdUNBQUosRUFBNkM7QUFDbEQsb0JBQU0sV0FBVyxLQUFLLG9DQUFMLENBQTBDLGFBQTFDLENBQWpCO0FBQ0EscUJBQU8sS0FBSyxvQ0FBTCxDQUEwQyxhQUExQyxDQUFQO0FBQ0EsbUJBQUssd0JBQUwsQ0FDRSxhQURGLEVBQ2lCLFFBRGpCLEVBQzJCLElBRDNCO0FBR0Q7QUFFRixXQXhCRDtBQXlCRCxTQTFCaUMsQ0FBbEM7O0FBNEJBLGFBQUssMEJBQUwsQ0FBZ0MsT0FBaEMsQ0FBd0MsSUFBeEMsRUFBOEM7QUFDNUMsc0JBQVksSUFEZ0M7QUFFNUMsNkJBQW1CO0FBRnlCLFNBQTlDO0FBSUQ7O0FBRUQsMENBQW9DO0FBQ2xDLFlBQUksQ0FBQyxLQUFLLDBCQUFWLEVBQXNDOztBQUV0QyxhQUFLLDBCQUFMLENBQWdDLFVBQWhDO0FBQ0EsYUFBSywwQkFBTCxHQUFrQyxJQUFsQztBQUNEOztBQUVEOztBQUVBOztBQUVBOzs7OztBQUtBLFVBQUksYUFBSixHQUFvQjtBQUNsQixjQUFNLFNBQVMsU0FBUyxhQUFULENBQXVCLEtBQUssWUFBTCxDQUFrQixrQkFBbEIsQ0FBdkIsQ0FBZjtBQUNBLGNBQU0sZ0JBQWdCLFNBQVMsYUFBVCxDQUF1QixNQUF2QixDQUF0QjtBQUNBLGVBQU8sVUFBVSxhQUFqQjtBQUNEOztBQUVEOzs7OztBQUtBLFVBQUksZUFBSixHQUFzQjtBQUNwQjtBQUNBLGNBQU0sU0FBUyxLQUFLLGFBQXBCO0FBQ0EsZUFBTztBQUNMLGVBQUssT0FBTyxZQUFQLENBQW9CLEtBQXBCLEtBQThCLEtBRDlCO0FBRUwsZ0JBQU0sT0FBTyxZQUFQLENBQW9CLE1BQXBCLEtBQStCO0FBRmhDLFNBQVA7QUFJRDs7QUFFRCw2QkFBdUI7QUFDckI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQUksQ0FBQyxLQUFLLFlBQUwsQ0FBa0IsS0FBbEIsQ0FBTCxFQUErQjtBQUM3QjtBQUNBO0FBQ0E7QUFDQSxpQkFBTyxLQUFLLGlCQUFMLENBQXVCLE9BQTlCLENBSjZCLENBSVU7QUFDdkMsZUFBSyxlQUFMLENBQXFCLFVBQXJCLEVBTDZCLENBS0s7QUFDbkM7O0FBRUQsWUFBSSxDQUFDLEtBQUssWUFBTCxDQUFrQixNQUFsQixDQUFMLEVBQWdDO0FBQzlCLGlCQUFPLEtBQUssaUJBQUwsQ0FBdUIsUUFBOUI7QUFDQSxlQUFLLGVBQUwsQ0FBcUIsV0FBckI7QUFDRDs7QUFFRCxZQUFJLEtBQUssZUFBVCxFQUEwQjtBQUN4QixlQUFLLGVBQUwsQ0FBcUIsVUFBckI7QUFDQSxlQUFLLGVBQUwsR0FBdUIsSUFBdkI7QUFDRDtBQUNGOztBQUVEOzs7Ozs7QUFNQTtBQUNBLDhCQUF3QixVQUF4QixFQUFvQyxXQUFwQyxFQUFpRDtBQUMvQztBQUNBLFlBQUksS0FBSyxlQUFULEVBQTBCO0FBQzFCLGNBQU07QUFDSixpQkFESSxFQUNLO0FBREwsWUFFRixVQUZKO0FBR0E7QUFDQSxTQUFDLEtBQUssWUFBTCxDQUFrQixLQUFsQixDQUFELElBQTZCLEtBQUssWUFBTCxDQUFrQixVQUFsQixFQUE4QixPQUE5QixDQUE3QjtBQUNBLFNBQUMsS0FBSyxZQUFMLENBQWtCLE1BQWxCLENBQUQsSUFBOEIsS0FBSyxZQUFMLENBQWtCLFdBQWxCLEVBQStCLFFBQS9CLENBQTlCO0FBQ0Q7O0FBRUQ7Ozs7Ozs7QUFPQSx3Q0FBa0MsSUFBbEMsRUFBd0MsUUFBeEMsRUFBa0QsUUFBbEQsRUFBNEQ7QUFDMUQ7QUFDQTtBQUNBOztBQUVBLFlBQUksU0FBUyxrQkFBYixFQUFpQztBQUMvQjtBQUNBLGVBQUssNEJBQUw7QUFDQTtBQUNEOztBQUVELGNBQU0sYUFBYSxTQUFTLEtBQVQsR0FBaUIsU0FBakIsR0FBNkIsVUFBaEQ7QUFDQSxjQUFNLGdCQUFnQixDQUFDLENBQUMsS0FBSyxZQUFMLENBQWtCLGtCQUFsQixDQUF4QjtBQUNBLGNBQU0sb0JBQW9CLEtBQUssaUJBQS9CO0FBQ0EsY0FBTSxvQkFBb0IsQ0FBQyxpQkFBM0I7QUFDQSxjQUFNLGlCQUNILGlCQUFpQixpQkFBbEIsR0FBdUMsS0FBSyxlQUE1QyxHQUE4RCxJQURoRTtBQUVBLGNBQU0sYUFBYSxZQUNoQixrQkFBa0IsZUFBZSxJQUFmLENBREYsSUFFakIsa0JBQWtCLFdBQWxCLENBQThCLENBQUMsVUFBRCxDQUE5QixFQUE0QyxVQUE1QyxDQUZGOztBQUlBLFlBQUksWUFBWSxjQUFoQixFQUFnQztBQUM5QixlQUFLLFlBQUwsQ0FBbUIsUUFBTyxJQUFLLEVBQS9CLEVBQWtDLFVBQWxDO0FBQ0EsZUFBSyxVQUFMLENBQWdCO0FBQ2QsYUFBQyxVQUFELEdBQWM7QUFEQSxXQUFoQjtBQUdBLDRCQUFrQixLQUFLLG1CQUFMLEVBQWxCO0FBQ0QsU0FORCxNQU1PO0FBQ0wsZUFBSyxvQkFBTDtBQUNBLGVBQUssc0JBQUwsQ0FBNEIsVUFBNUI7QUFDRDtBQUNGOztBQUVELHFDQUErQjtBQUM3QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBTSxtQkFBbUIsQ0FBQyxDQUFDLEtBQUssaUJBQWhDO0FBQ0EsY0FBTSxnQkFBZ0IsQ0FBQyxDQUFDLEtBQUssWUFBTCxDQUFrQixrQkFBbEIsQ0FBeEI7QUFDQSxZQUFJLG9CQUFvQixDQUFDLGFBQXpCLEVBQXdDOztBQUV4QyxjQUFNLEVBQUUsS0FBSyxXQUFQLEVBQW9CLE1BQU0sWUFBMUIsS0FBMkMsS0FBSyxlQUF0RDtBQUNBLGNBQU0sVUFBVSxLQUFLLFlBQUwsQ0FBa0IsS0FBbEIsQ0FBaEI7QUFDQSxjQUFNLFdBQVcsS0FBSyxZQUFMLENBQWtCLE1BQWxCLENBQWpCO0FBQ0EsY0FBTSxTQUFTLFdBQVcsV0FBMUI7QUFDQSxjQUFNLFVBQVUsWUFBWSxZQUE1Qjs7QUFFQSxhQUFLLFlBQUwsQ0FBa0IsVUFBbEIsRUFBOEIsTUFBOUI7QUFDQSxhQUFLLFlBQUwsQ0FBa0IsV0FBbEIsRUFBK0IsT0FBL0I7O0FBRUEsYUFBSyxVQUFMLENBQWdCO0FBQ2QsbUJBQVMsTUFESztBQUVkLG9CQUFVO0FBRkksU0FBaEI7O0FBS0EsYUFBSyxtQkFBTDtBQUNEOztBQUVELDRCQUFzQjtBQUNwQjtBQUNBLFlBQUksS0FBSyxlQUFULEVBQTBCO0FBQ3hCLGVBQUssZUFBTCxDQUFxQixVQUFyQjtBQUNEOztBQUVELGNBQU0sZUFBZSxLQUFLLGFBQTFCOztBQUVBLGFBQUssZUFBTCxHQUF1QixJQUFJLElBQUksZ0JBQVIsQ0FBMEIsU0FBRCxJQUFlO0FBQzdELG9CQUFVLE9BQVYsQ0FBbUIsUUFBRCxJQUFjO0FBQzlCLGtCQUFNLE9BQU8sU0FBUyxhQUF0QjtBQUNBLGtCQUFNLFFBQVEsS0FBSyxlQUFMLENBQXFCLElBQXJCLENBQWQ7QUFDQSxrQkFBTSxVQUFXLFFBQU8sSUFBSyxFQUE3QjtBQUNBLGtCQUFNLGFBQWMsT0FBTSxLQUFLLE1BQUwsQ0FBWSxDQUFaLEVBQWUsV0FBZixLQUErQixLQUFLLEtBQUwsQ0FBVyxDQUFYLENBQWMsRUFBdkU7O0FBRUEsaUJBQUssWUFBTCxDQUFrQixPQUFsQixFQUEyQixLQUEzQjtBQUNBLGlCQUFLLFVBQUwsQ0FBZ0I7QUFDZCxlQUFDLFVBQUQsR0FBYztBQURBLGFBQWhCO0FBR0QsV0FWRDtBQVdELFNBWnNCLENBQXZCOztBQWNBLGFBQUssZUFBTCxDQUFxQixPQUFyQixDQUE2QixZQUE3QixFQUEyQztBQUN6QyxzQkFBWSxJQUQ2QjtBQUV6QywyQkFBaUIsQ0FBQyxLQUFELEVBQVEsTUFBUjtBQUZ3QixTQUEzQztBQUlEOztBQUVEOztBQUVBOztBQUVBOzs7O0FBSUEsaUJBQVcsY0FBWCxHQUE0QjtBQUMxQixlQUFPLENBQUMsU0FBRCxFQUFZLFVBQVosQ0FBUDtBQUNEOztBQUVEOzs7O0FBSUEsaUJBQVcsZ0JBQVgsR0FBOEI7QUFDNUIsZUFBTyxDQUFDLFNBQUQsRUFBWSxVQUFaLENBQVA7QUFDRDs7QUFFRDs7Ozs7O0FBTUEsMEJBQW9CLEdBQXBCLEVBQXlCO0FBQ3ZCLGVBQU8sS0FBSyxXQUFMLENBQWlCLGNBQWpCLENBQWdDLElBQWhDLENBQXNDLElBQUQsSUFBVSxTQUFTLEdBQXhELENBQVA7QUFDRDs7QUFFRDs7Ozs7O0FBTUEsMEJBQW9CLEdBQXBCLEVBQXlCO0FBQ3ZCLGVBQU8sS0FBSyxpQkFBTCxDQUF1QixHQUF2QixNQUFnQyxTQUF2QztBQUNEOztBQUVEOzs7Ozs7QUFNQSw0QkFBc0IsR0FBdEIsRUFBMkI7QUFDekIsZUFBTyxLQUFLLFdBQUwsQ0FBaUIsZ0JBQWpCLENBQWtDLElBQWxDLENBQXdDLElBQUQsSUFBVSxTQUFTLEdBQTFELENBQVA7QUFDRDs7QUFFRDs7OztBQUlBLGlCQUFXLFVBQVgsRUFBdUI7QUFDckIsY0FBTSxVQUFVLE9BQU8sSUFBUCxDQUFZLFVBQVosRUFBd0IsTUFBeEIsQ0FBZ0MsR0FBRCxJQUFTO0FBQ3RELGlCQUFPLEtBQUssbUJBQUwsQ0FBeUIsR0FBekIsQ0FBUDtBQUNELFNBRmUsQ0FBaEI7O0FBSUEsY0FBTSxlQUFlLFFBQVEsTUFBUixDQUFlLENBQUMsR0FBRCxFQUFNLEdBQU4sS0FBYztBQUNoRCxjQUFJLEdBQUosSUFBVyxXQUFXLEdBQVgsQ0FBWDtBQUNBLGlCQUFPLEdBQVA7QUFDRCxTQUhvQixFQUdsQixFQUhrQixDQUFyQjs7QUFLQSxjQUFNLHdDQUNELEtBQUssaUJBREosRUFFRCxZQUZDLENBQU47O0FBS0EsYUFBSyxpQkFBTCxHQUF5QixtQkFBekI7O0FBRUEsWUFBSSxLQUFLLG1CQUFULEVBQThCOztBQUU5QixhQUFLLHdCQUFMLENBQThCLEtBQUssaUJBQW5DO0FBQ0Q7O0FBRUQ7Ozs7QUFJQSwrQkFBeUIsVUFBekIsRUFBcUM7QUFDbkMsYUFBSyxtQkFBTCxHQUEyQixJQUEzQjtBQUNBLGNBQU0saUJBQWlCLE9BQU8sSUFBUCxDQUFZLFVBQVosQ0FBdkI7O0FBRUE7QUFDQSxZQUFJLGVBQWUsS0FBSyxpQkFBeEIsRUFBMkM7QUFDekM7QUFDQSxnQkFBTSxvQkFBb0IsZUFBZSxNQUFmLENBQXNCLENBQUMsR0FBRCxFQUFNLEdBQU4sS0FBYztBQUM1RCxpQkFBSyxxQkFBTCxDQUEyQixHQUEzQixLQUFtQyxJQUFJLElBQUosQ0FBUyxHQUFULENBQW5DO0FBQ0EsbUJBQU8sR0FBUDtBQUNELFdBSHlCLEVBR3ZCLEVBSHVCLENBQTFCOztBQUtBLGNBQUksa0JBQWtCLE1BQXRCLEVBQThCO0FBQzVCLGtCQUFNLHVCQUF1QixrQkFBa0IsTUFBbEIsQ0FBeUIsQ0FBQyxHQUFELEVBQU0sR0FBTixLQUFjO0FBQ2xFLGtCQUFJLEdBQUosSUFBVyxXQUFXLEdBQVgsQ0FBWDtBQUNBLHFCQUFPLEdBQVA7QUFDRCxhQUg0QixFQUcxQixFQUgwQixDQUE3QjtBQUlBLGlCQUFLLGlCQUFMLENBQXVCLG9CQUF2QjtBQUNBO0FBQ0E7QUFDRDtBQUNGOztBQUVEO0FBQ0E7QUFDQTtBQUNBLGNBQU0sb0JBQW9CLEtBQUssV0FBTCxDQUFpQixjQUFqQixDQUFnQyxNQUFoQyxDQUF1QyxDQUFDLEdBQUQsRUFBTSxHQUFOLEtBQWM7QUFDN0UsY0FBSSxLQUFLLG1CQUFMLENBQXlCLEdBQXpCLENBQUosRUFBbUM7QUFDakMsZ0JBQUksR0FBSixJQUFXLEtBQUssaUJBQUwsQ0FBdUIsR0FBdkIsQ0FBWDtBQUNEO0FBQ0QsaUJBQU8sR0FBUDtBQUNELFNBTHlCLEVBS3ZCLEVBTHVCLENBQTFCOztBQU9BLGNBQU0sdUNBQ0QsVUFEQyxFQUVELGlCQUZDLENBQU47O0FBS0E7QUFDQSxhQUFLLG1CQUFMLENBQXlCLE9BQXpCLENBQWtDLEtBQUQsSUFBVztBQUMxQyxnQkFBTSx3QkFBTixDQUErQixrQkFBL0I7QUFDRCxTQUZEO0FBR0EsYUFBSyxtQkFBTCxHQUEyQixLQUEzQjtBQUNEOztBQUVEOzs7Ozs7OztBQVFBLDZCQUF1QixVQUF2QixFQUFtQztBQUNqQyxjQUFNLGNBQWMsTUFBTSxPQUFOLENBQWMsVUFBZCxJQUE0QixVQUE1QixHQUF5QyxDQUFDLFVBQUQsQ0FBN0Q7O0FBRUEsb0JBQVksT0FBWixDQUFxQixHQUFELElBQVM7QUFDM0IsaUJBQU8sS0FBSyxvQkFBTCxDQUEwQixHQUExQixDQUFQO0FBQ0EsaUJBQU8sS0FBSyxpQkFBTCxDQUF1QixHQUF2QixDQUFQO0FBQ0QsU0FIRDs7QUFLQSxjQUFNLG9CQUFvQixLQUFLLGlCQUEvQjtBQUNBLGNBQU0sY0FDRixDQUFDLGlCQUFELEdBQ0UsU0FERixHQUVFLGtCQUFrQixXQUFsQixDQUE4QixXQUE5QixDQUhOOztBQUtBLGNBQU0sYUFBYSxZQUFZLE1BQVosQ0FBbUIsQ0FBQyxHQUFELEVBQU0sR0FBTixLQUFjO0FBQ2xELGNBQUksR0FBSixJQUFXLENBQUMsZUFBZSxFQUFoQixFQUFvQixHQUFwQixDQUFYO0FBQ0EsaUJBQU8sR0FBUDtBQUNELFNBSGtCLEVBR2hCLEVBSGdCLENBQW5COztBQUtBLGFBQUssd0JBQUwsQ0FBOEIsVUFBOUI7QUFDRDs7QUFFRDs7Ozs7O0FBTUEsa0JBQVksSUFBWixFQUFrQjtBQUNoQjtBQUNBO0FBQ0EsY0FBTSxZQUFZLEVBQWxCO0FBQ0EsY0FBTSxlQUFlLEVBQXJCO0FBQ0EsYUFBSyxPQUFMLENBQWMsR0FBRCxJQUFTO0FBQ3BCLGNBQUksS0FBSyxtQkFBTCxDQUF5QixHQUF6QixDQUFKLEVBQW1DO0FBQ2pDLHNCQUFVLElBQVYsQ0FBZSxHQUFmO0FBQ0QsV0FGRCxNQUVPO0FBQ0wseUJBQWEsSUFBYixDQUFrQixHQUFsQjtBQUNEO0FBQ0YsU0FORDtBQU9BLGNBQU0sb0JBQW9CLEtBQUssaUJBQS9CO0FBQ0EsaUNBQ0ssVUFBVSxNQUFWLENBQWlCLENBQUMsR0FBRCxFQUFNLEdBQU4sS0FBYztBQUNoQyxjQUFJLEdBQUosSUFBVyxLQUFLLGlCQUFMLENBQXVCLEdBQXZCLENBQVg7QUFDQSxpQkFBTyxHQUFQO0FBQ0QsU0FIRSxFQUdBLEVBSEEsQ0FETCxFQUtNLG9CQUFvQixrQkFBa0IsV0FBbEIsQ0FBOEIsWUFBOUIsQ0FBcEIsR0FBa0UsRUFMeEU7QUFPRDs7QUFFRDs7Ozs7O0FBTUEsd0JBQWtCLFVBQWxCLEVBQThCLEVBQUUsUUFBUSxLQUFWLEtBQW9CLEVBQWxELEVBQXNEO0FBQ3BEO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBTSxzQkFBc0IsS0FBSyxvQkFBakM7QUFDQSxjQUFNLHlCQUF5QixPQUFPLElBQVAsQ0FBWSxjQUFjLEVBQTFCLEVBQThCLE1BQTlCLENBQXNDLEdBQUQsSUFBUztBQUMzRSxpQkFBTyxXQUFXLEdBQVgsTUFBb0Isb0JBQW9CLEdBQXBCLENBQTNCO0FBQ0QsU0FGOEIsQ0FBL0I7QUFHQTtBQUNBO0FBQ0E7QUFDQSxZQUFJLENBQUMsdUJBQXVCLE1BQXhCLElBQWtDLENBQUMsS0FBdkMsRUFBOEM7QUFDOUMsY0FBTSxxQkFBcUIsdUJBQXVCLE1BQXZCLENBQThCLENBQUMsR0FBRCxFQUFNLEdBQU4sS0FBYztBQUNyRSxjQUFJLEdBQUosSUFBVyxXQUFXLEdBQVgsQ0FBWDtBQUNBLGlCQUFPLEdBQVA7QUFDRCxTQUgwQixFQUd4QixFQUh3QixDQUEzQjtBQUlBLGNBQU0sZUFBZSxRQUFRLEVBQVIscUJBQWtCLG1CQUFsQixFQUEwQyxrQkFBMUMsQ0FBckI7QUFDQSxhQUFLLG9CQUFMLEdBQTRCLFlBQTVCO0FBQ0EsY0FBTSxDQUFDLFdBQUQsRUFBYyxZQUFkLElBQThCLENBQUMsS0FBSyxvQkFBTixFQUE0QixtQkFBNUIsQ0FBcEM7QUFDQSxhQUFLLHVCQUFMLENBQTZCLFdBQTdCLEVBQTBDLFlBQTFDO0FBQ0EsYUFBSyxnQkFBTCxDQUFzQixXQUF0QixFQUFtQyxZQUFuQztBQUNEOztBQUdEOzs7Ozs7QUFNQTtBQUNBLHVCQUFpQixVQUFqQixFQUE2QixXQUE3QixFQUEwQztBQUN4QztBQUNEOztBQUVELHNCQUFnQjtBQUNkO0FBQ0E7QUFDQSxjQUFNLG9CQUFvQixLQUFLLGlCQUEvQjtBQUNBO0FBQ0EsWUFBSSxDQUFDLGlCQUFMLEVBQXdCOztBQUV4QixjQUFNLGFBQWEsa0JBQWtCLFdBQWxCLENBQ2pCLEtBQUssV0FBTCxDQUFpQixnQkFEQSxDQUFuQjtBQUdBLGFBQUssaUJBQUwsQ0FBdUIsVUFBdkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDRDs7QUFFRCxzQkFBZ0I7QUFDZDtBQUNBO0FBQ0E7QUFDQSxjQUFNLG9CQUFvQixLQUFLLGlCQUEvQjtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQUksaUJBQUosRUFBdUI7QUFDckIsZUFBSyxpQkFBTCxDQUF1QixJQUF2QixFQUE2QixFQUFFLE9BQU8sSUFBVCxFQUE3QjtBQUNEO0FBQ0Y7O0FBRUQ7O0FBRUE7O0FBRUE7Ozs7O0FBS0EsMENBQW9DLFFBQXBDLEVBQThDO0FBQzVDLFlBQUksa0JBQWtCLEtBQUssYUFBM0I7QUFDQSxlQUFPLG1CQUFtQixDQUFDLFNBQVMsZUFBVCxDQUEzQixFQUFzRDtBQUNwRCw0QkFBa0IsZ0JBQWdCLGFBQWxDO0FBQ0Q7QUFDRCxlQUFPLGVBQVA7QUFDRDs7QUFFRDs7OztBQUlBLFVBQUkscUJBQUosR0FBNEI7QUFDMUI7QUFDQSxlQUFPLENBQUMsR0FBRyxLQUFLLFVBQUwsQ0FBZ0IsZ0JBQWhCLENBQWlDLHNCQUFqQyxDQUFKLENBQVA7QUFDRDs7QUFFRDs7OztBQUlBLFVBQUksbUJBQUosR0FBMEI7QUFDeEIsZUFBTyxLQUFLLFdBQUwsR0FBbUIsSUFBbkIsSUFBMkIsSUFBbEM7QUFDRDs7QUFFRDs7OztBQUlBLFVBQUksa0JBQUosR0FBeUI7QUFDdkI7QUFDQSxZQUFJLFNBQVMsS0FBSyxhQUFsQjtBQUNBLGVBQU8sVUFBVSxDQUFDLE9BQU8sWUFBUCxDQUFvQixvQkFBcEIsQ0FBbEIsRUFBNkQ7QUFDM0QsbUJBQVMsT0FBTyxhQUFoQjtBQUNEO0FBQ0QsZUFBTyxVQUFVLElBQWpCO0FBQ0Q7O0FBRUQ7Ozs7QUFJQSxVQUFJLG9CQUFKLEdBQTJCO0FBQ3pCO0FBQ0EsZUFBTyxDQUFDLEdBQUcsS0FBSyxnQkFBTCxDQUFzQixzQkFBdEIsQ0FBSixDQUFQO0FBQ0Q7O0FBRUQ7Ozs7QUFJQSxVQUFJLDBCQUFKLEdBQWlDO0FBQy9CLFlBQUksZ0JBQWdCLEtBQUssYUFBekI7QUFDQTtBQUNBLFlBQUksa0JBQWtCLElBQXRCLEVBQTRCO0FBQzFCLGlCQUFPLElBQVA7QUFDRDtBQUNELHdCQUFnQixjQUFjLE9BQWQsQ0FBc0Isc0JBQXRCLENBQWhCO0FBQ0EsZUFBTyxpQkFBaUIsS0FBSyxtQkFBN0I7QUFDRDs7QUFFRDs7OztBQUlBLFVBQUksaUJBQUosR0FBd0I7QUFDdEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQUksS0FBSyxrQkFBVCxFQUE2QjtBQUMzQixpQkFBTyxLQUFLLGtCQUFaO0FBQ0Q7QUFDRCxZQUFJLEtBQUssY0FBVCxFQUF5QixPQUFPLElBQVA7QUFDekIsYUFBSyxrQkFBTCxHQUEwQixLQUFLLDBCQUEvQjtBQUNBLGVBQU8sS0FBSyxrQkFBWjtBQUNEOztBQUVEOzs7O0FBSUE7QUFDQSxVQUFJLGVBQUosR0FBc0I7QUFDcEIsWUFBSSxvQkFBb0IsS0FBSyxpQkFBN0I7QUFDQSxlQUFPLGlCQUFQLEVBQTBCO0FBQ3hCLGdCQUFNLHFCQUFxQixrQkFBa0IsaUJBQTdDO0FBQ0EsY0FBSSxDQUFDLGtCQUFMLEVBQXlCO0FBQ3ZCLG1CQUFPLGlCQUFQO0FBQ0Q7QUFDRCw4QkFBb0Isa0JBQXBCO0FBQ0Q7QUFDRCxlQUFPLGlCQUFQLENBVG9CLENBU007QUFDM0I7O0FBRUQ7Ozs7QUFJQTtBQUNBLFVBQUksNEJBQUosR0FBbUM7QUFDakMsY0FBTSxlQUFlLENBQUMsR0FBRyxLQUFLLG9CQUFULEVBQStCLEdBQUcsS0FBSyxxQkFBdkMsQ0FBckI7QUFDQSxjQUFNLHNCQUFzQixhQUFhLE1BQWIsQ0FBcUIsS0FBRCxJQUFXLE1BQU0sMEJBQU4sS0FBcUMsSUFBcEUsQ0FBNUI7QUFDQSxlQUFPLG1CQUFQO0FBQ0Q7O0FBRUQ7Ozs7QUFJQSxVQUFJLG1CQUFKLEdBQTBCO0FBQ3hCLGVBQU8sS0FBSyxvQkFBWjtBQUNEOztBQUVELHlDQUFtQztBQUNqQyxjQUFNLG9CQUFvQixLQUFLLGlCQUEvQjtBQUNBLFlBQUksQ0FBQyxpQkFBTCxFQUF3QjtBQUN4QiwwQkFBa0IsY0FBbEIsQ0FBaUMsSUFBakM7QUFDRDs7QUFFRCw2Q0FBdUM7QUFDckMsY0FBTSxvQkFBb0IsS0FBSyxpQkFBL0I7QUFDQSxZQUFJLENBQUMsaUJBQUwsRUFBd0I7QUFDeEIsMEJBQWtCLGdCQUFsQixDQUFtQyxJQUFuQztBQUNEOztBQUVEOzs7OztBQUtBLHFCQUFlLEtBQWYsRUFBc0I7QUFDcEIsYUFBSyxvQkFBTCxDQUEwQixJQUExQixDQUErQixLQUEvQjtBQUNEOztBQUVEOzs7OztBQUtBLHVCQUFpQixLQUFqQixFQUF3QjtBQUN0QixhQUFLLG9CQUFMLEdBQ0UsS0FBSyxvQkFBTCxDQUEwQixNQUExQixDQUFrQyxNQUFELElBQVksV0FBVyxLQUF4RCxDQURGO0FBRUQ7O0FBRUQ7OztBQUdBOztBQUVBLHdDQUFrQztBQUNoQyxjQUFNLGVBQWUsS0FBSyxZQUExQjs7QUFFQSxZQUFJLFlBQUosRUFBa0I7QUFDaEIsMkJBQWlCLElBQWpCO0FBQ0QsU0FGRCxNQUVPO0FBQ0wsMEJBQWdCLElBQWhCO0FBQ0Q7QUFDRjs7QUFFRCxVQUFJLFlBQUosR0FBbUI7QUFDakIsZUFBTyxLQUFLLFlBQUwsQ0FBa0IsY0FBbEIsQ0FBUDtBQUNEOztBQUVELFVBQUksWUFBSixDQUFpQixLQUFqQixFQUF3QjtBQUN0QixjQUFNLFdBQVcsUUFBUSxLQUFSLENBQWpCO0FBQ0EsWUFBSSxRQUFKLEVBQWM7QUFDWixlQUFLLFlBQUwsQ0FBa0IsY0FBbEIsRUFBa0MsRUFBbEM7QUFDRCxTQUZELE1BRU87QUFDTCxlQUFLLGVBQUwsQ0FBcUIsY0FBckI7QUFDRDtBQUNGOztBQUVEOztBQUVBOzs7OztBQUtBLHVCQUFpQixJQUFqQixFQUF1QjtBQUNyQjtBQUNBO0FBQ0E7QUFDQSxZQUFJLEtBQUssY0FBTCxDQUFvQixJQUFwQixDQUFKLEVBQStCO0FBQzdCLGdCQUFNLFFBQVEsS0FBSyxJQUFMLENBQWQ7QUFDQTtBQUNBLGlCQUFPLEtBQUssSUFBTCxDQUFQO0FBQ0E7QUFDQSxlQUFLLElBQUwsSUFBYSxLQUFiO0FBQ0E7QUFDRDtBQUNGOztBQUVEOzs7Ozs7QUFNQSx1QkFBaUIsR0FBakIsRUFBc0IsS0FBdEIsRUFBNkI7QUFDM0I7QUFDQSxZQUFJLENBQUMsS0FBSyxZQUFMLENBQWtCLEdBQWxCLENBQUwsRUFBNkI7QUFDM0IsZUFBSyxZQUFMLENBQWtCLEdBQWxCLEVBQXVCLEtBQXZCO0FBQ0Q7QUFDRjs7QUFFRCx3QkFBa0I7QUFDaEIsY0FBTSxFQUFFLFFBQUYsS0FBZSxLQUFLLFdBQTFCO0FBQ0Esb0JBQ0EsS0FBSyxVQUFMLENBQWdCLFdBQWhCLENBQTRCLFNBQVMsT0FBVCxDQUFpQixTQUFqQixDQUEyQixJQUEzQixDQUE1QixDQURBO0FBRUQ7O0FBRUQ7Ozs7O0FBS0Esc0JBQWdCLFdBQWhCLEVBQTZCLFdBQTdCLEVBQTBDO0FBQ3hDO0FBQ0E7QUFDQTtBQUNBLGFBQUssa0JBQUwsQ0FBd0IsV0FBeEIsRUFBcUMsV0FBckM7QUFDRDs7QUFFRDs7Ozs7O0FBTUEseUJBQW1CLFdBQW5CLEVBQWdDLFdBQWhDLEVBQTZDO0FBQzNDO0FBQ0EsYUFBSyxpQkFBTCxDQUF1QixXQUF2QixFQUFvQyxXQUFwQztBQUNEOztBQUVEOzs7Ozs7QUFNQTtBQUNBLHdCQUFrQixXQUFsQixFQUErQixXQUEvQixFQUE0QyxDQUUzQztBQURDOzs7QUFHRjs7Ozs7OztBQU9BLDBCQUFvQjtBQUNsQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFLLG9CQUFMO0FBQ0Q7O0FBRUQ7OztBQUdBLDZCQUF1QjtBQUNyQixhQUFLLFVBQUwsR0FBa0IsSUFBbEI7QUFDQSxhQUFLLGVBQUwsR0FBdUIsS0FBdkI7QUFDQSxZQUFJLGdCQUFKLENBQXFCLGNBQXJCLEVBQXFDLEtBQUssb0JBQTFDLEVBQWdFLEtBQWhFO0FBQ0EsY0FBTSxFQUFFLG1CQUFGLEVBQXVCLGtCQUF2QixLQUE4QyxLQUFLLFdBQXpEO0FBQ0EsNEJBQW9CLE9BQXBCLENBQTZCLFFBQUQsSUFBYztBQUN4QyxlQUFLLGdCQUFMLENBQXNCLFFBQXRCO0FBQ0QsU0FGRDtBQUdBLGVBQU8sSUFBUCxDQUFZLGtCQUFaLEVBQWdDLE9BQWhDLENBQXlDLFFBQUQsSUFBYztBQUNwRCxlQUFLLGdCQUFMLENBQXNCLFFBQXRCLEVBQWdDLG1CQUFtQixRQUFuQixDQUFoQztBQUNELFNBRkQ7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQUssZ0NBQUw7QUFDQSxhQUFLLGFBQUwsR0FoQnFCLENBZ0JDO0FBQ3RCO0FBQ0E7QUFDQSxhQUFLLDRCQUFMO0FBQ0EsYUFBSyxvQ0FBTDtBQUNBO0FBQ0EsYUFBSyxtQkFBTDtBQUNEOztBQUVEOzs7QUFHQSw0QkFBc0IsQ0FFckI7QUFEQzs7O0FBR0Y7QUFDQSw2QkFBdUI7QUFDckIsYUFBSyx1QkFBTDtBQUNEOztBQUVEOzs7QUFHQSxnQ0FBMEI7QUFDeEIsYUFBSyxhQUFMO0FBQ0EsYUFBSyxvQkFBTDtBQUNBLGFBQUssb0NBQUw7QUFDQSxZQUFJLG1CQUFKLENBQXdCLGNBQXhCLEVBQXdDLEtBQUssb0JBQTdDLEVBQW1FLEtBQW5FO0FBQ0EsYUFBSyxVQUFMLEdBQWtCLEtBQWxCO0FBQ0EsYUFBSyxlQUFMLEdBQXVCLElBQXZCO0FBQ0EsYUFBSyxrQkFBTCxHQUEwQixJQUExQjtBQUNBLGFBQUssaUNBQUw7QUFDQTtBQUNBLGFBQUssc0JBQUw7QUFDRDs7QUFFRDs7O0FBR0EsK0JBQXlCO0FBQ3ZCO0FBQ0Q7O0FBRUQsb0JBQWMsRUFBRSxXQUFXLEVBQWIsRUFBaUIsV0FBVyxFQUE1QixFQUFkLEVBQWdEO0FBQzlDLGNBQU0sUUFBUSxNQUFNLFNBQU4sQ0FBZ0IsSUFBaEIsQ0FBZDtBQUNBLFlBQUksQ0FBQyxRQUFELElBQWEsQ0FBQyxRQUFsQixFQUE0QixPQUFPLEtBQVA7QUFDNUIsWUFBSSxNQUFNLFlBQU4sQ0FBbUIsSUFBbkIsQ0FBSixFQUE4QjtBQUM1QixnQkFBTSxZQUFOLENBQW1CLElBQW5CLEVBQTBCLEdBQUUsUUFBUyxHQUFFLE1BQU0sWUFBTixDQUFtQixJQUFuQixDQUF5QixHQUFFLFFBQVMsRUFBM0U7QUFDRDtBQUNELGNBQU0sZ0JBQU4sQ0FBdUIsc0JBQXZCLEVBQStDLE9BQS9DLENBQXdELEtBQUQsSUFBVztBQUNoRSxjQUFJLE1BQU0sWUFBTixDQUFtQixJQUFuQixDQUFKLEVBQThCO0FBQzVCLGtCQUFNLFlBQU4sQ0FBbUIsSUFBbkIsRUFBMEIsR0FBRSxRQUFTLEdBQUUsTUFBTSxZQUFOLENBQW1CLElBQW5CLENBQXlCLEdBQUUsUUFBUyxFQUEzRTtBQUNEO0FBQ0YsU0FKRDtBQUtBLGVBQU8sS0FBUDtBQUNEOztBQUdEOzs7Ozs7QUFNQSwrQkFBeUIsSUFBekIsRUFBK0IsUUFBL0IsRUFBeUMsUUFBekMsRUFBbUQ7QUFDakQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBSSxLQUFLLFlBQUwsQ0FBa0IsSUFBbEIsTUFBNEIsUUFBaEMsRUFBMEM7QUFDMUMsYUFBSywyQkFBTCxDQUFpQyxJQUFqQyxFQUF1QyxRQUF2QyxFQUFpRCxRQUFqRDtBQUNEOztBQUVEOzs7Ozs7O0FBT0Esa0NBQTRCLElBQTVCLEVBQWtDLFFBQWxDLEVBQTRDLFFBQTVDLEVBQXNEO0FBQ3BELFNBQUMsS0FBRCxFQUFRLE1BQVIsRUFBZ0Isa0JBQWhCLEVBQW9DLFFBQXBDLENBQTZDLElBQTdDLEtBQ0UsS0FBSyxpQ0FBTCxDQUF1QyxJQUF2QyxFQUE2QyxRQUE3QyxFQUF1RCxRQUF2RCxDQURGO0FBRUEsaUJBQVMsY0FBVCxJQUNFLEtBQUssK0JBQUwsRUFERjtBQUVBO0FBQ0EsYUFBSywwQkFBTCxDQUFnQyxJQUFoQyxFQUFzQyxRQUF0QyxFQUFnRCxRQUFoRDtBQUNEOztBQUVEOzs7Ozs7O0FBT0E7QUFDQSxpQ0FBMkIsSUFBM0IsRUFBaUMsUUFBakMsRUFBMkMsUUFBM0MsRUFBcUQ7QUFDbkQ7QUFDRDtBQS85QjRDOztBQWsrQi9DOzs7QUFHQSxhQUFTLHlCQUFULENBQW1DLEtBQW5DLEVBQTBDO0FBQ3hDLFlBQU0sb0JBQW9CLE1BQU0saUJBQWhDO0FBQ0EsWUFBTSxXQUFXLFNBQVMsYUFBVCxDQUF1QixVQUF2QixDQUFqQjtBQUNBLGVBQVMsU0FBVCxHQUFxQixpQkFBckI7O0FBRUE7OztBQUdBLGFBQU8sY0FBUCxDQUFzQixLQUF0QixFQUE2QixVQUE3QixFQUF5QztBQUN2QyxjQUFNO0FBQUUsaUJBQU8sUUFBUDtBQUFrQixTQURhO0FBRXZDLG9CQUFZLEtBRjJCO0FBR3ZDLHNCQUFjO0FBSHlCLE9BQXpDOztBQU1BOzs7QUFHQSxhQUFPLGNBQVAsQ0FBc0IsS0FBdEIsRUFBNkIsZ0JBQTdCLEVBQStDO0FBQzdDLGNBQU07QUFDSixpQkFBTyxNQUFNLFFBQU4sQ0FBZSxPQUFmLENBQXVCLGFBQXZCLENBQXFDLE9BQXJDLEVBQThDLFNBQXJEO0FBQ0QsU0FINEM7QUFJN0MsWUFBSSxLQUFKLEVBQVc7QUFDVCxnQkFBTSxRQUFOLENBQWUsT0FBZixDQUF1QixhQUF2QixDQUFxQyxPQUFyQyxFQUE4QyxTQUE5QyxHQUEwRCxLQUExRDtBQUNELFNBTjRDO0FBTzdDLG9CQUFZLEtBUGlDO0FBUTdDLHNCQUFjO0FBUitCLE9BQS9DOztBQVdBLGFBQU8sS0FBUDtBQUNEOztBQUVELGFBQVMsWUFBVCxDQUFzQixLQUF0QixFQUE2QjtBQUMzQixZQUFNLFlBQU4sR0FBcUIsTUFBTTtBQUN6QixjQUFNLG1CQUFtQixNQUFNLGdCQUEvQjtBQUNBLGNBQU0sZUFBZSxNQUFNLFlBQTNCO0FBQ0E7QUFDQSxxQkFBYSxPQUFiLENBQXNCLFVBQUQsSUFBZ0IsV0FBVyxZQUFYLEVBQXJDO0FBQ0E7QUFDQSxZQUFJLGVBQWUsR0FBZixDQUFtQixnQkFBbkIsQ0FBSixFQUEwQyxPQUFPLGdCQUFQO0FBQzFDO0FBQ0EsY0FBTSxpQkFBaUIsQ0FBQyxDQUFDLElBQUksaUJBQUosSUFBeUIsRUFBMUIsRUFBOEIsZ0JBQTlCLEtBQW1ELEVBQXBELEVBQXdELGNBQS9FO0FBQ0EsWUFBSSxjQUFKLEVBQW9CO0FBQ2xCLGdCQUFNLGNBQU4sSUFBd0IsbUNBQXhCO0FBQ0EsZ0JBQU0sY0FBTixJQUF3QixjQUF4QjtBQUNEO0FBQ0Q7QUFDQTtBQUNBLHVCQUFlLE1BQWYsQ0FBc0IsZ0JBQXRCLEVBQXdDLEtBQXhDO0FBQ0EsZUFBTyxnQkFBUDtBQUNELE9BakJEOztBQW1CQTs7O0FBR0EsYUFBTyxjQUFQLENBQXNCLEtBQXRCLEVBQTZCLG9CQUE3QixFQUFtRDtBQUNqRCxjQUFNO0FBQ0osZ0JBQU0sUUFBUSxDQUFDLEtBQUQsQ0FBZDtBQUNBLGNBQUksY0FBYyxPQUFPLGNBQVAsQ0FBc0IsS0FBdEIsQ0FBbEI7QUFDQSxpQkFBTyxnQkFBZ0IsV0FBdkIsRUFBb0M7QUFDbEMsa0JBQU0sSUFBTixDQUFXLFdBQVg7QUFDQSwwQkFBYyxPQUFPLGNBQVAsQ0FBc0IsV0FBdEIsQ0FBZDtBQUNEO0FBQ0QsZ0JBQU0sSUFBTixDQUFXLFdBQVg7QUFDQSxpQkFBTyxLQUFQO0FBQ0QsU0FWZ0Q7QUFXakQsb0JBQVksS0FYcUM7QUFZakQsc0JBQWM7QUFabUMsT0FBbkQ7O0FBZUEsYUFBTyxLQUFQO0FBQ0Q7O0FBRUQsV0FBTztBQUNMLDBCQURLO0FBRUwsK0JBRks7QUFHTDtBQUhLLEtBQVA7QUFLRCxHQXZqQ00sQ0FBUDtBQXdqQ0Q7Ozs7Ozs7O2tCQzNrQ3VCLFM7O0FBbEJ4QixNQUFNLHFCQUFxQixDQUFDLFNBQUQsQ0FBM0I7O0FBRUEsTUFBTSxpQkFBaUI7QUFDckIsV0FBVTs7O0FBRFcsQ0FBdkI7O0FBTUE7Ozs7Ozs7Ozs7QUFVZSxTQUFTLFNBQVQsQ0FBbUIsS0FBbkIsRUFBMEI7O0FBRXZDLFFBQU0sY0FBTixJQUF5Qjs7Ozs7Ozs7Ozs7Ozs7OztHQUF6Qjs7QUFrQkE7O0FBRUEsUUFBTSxTQUFOLFNBQXdCLEtBQXhCLENBQThCOztBQUU1QixlQUFXLElBQVgsR0FBa0I7QUFDaEIsYUFBTyxNQUFNLElBQWI7QUFDRDs7QUFFRCxlQUFXLG1CQUFYLEdBQWlDO0FBQy9CO0FBQ0E7QUFDQTtBQUNBLGFBQU8sQ0FBQyxHQUFHLE1BQU0sbUJBQVYsRUFBK0IsU0FBL0IsRUFBMEMsVUFBMUMsQ0FBUDtBQUNEOztBQUVELGVBQVcsa0JBQVgsR0FBZ0M7QUFDOUIsYUFBTyxDQUFDLEdBQUcsTUFBTSxrQkFBVixFQUE4QixVQUE5QixDQUFQO0FBQ0Q7O0FBRUQsZ0JBQVksR0FBRyxJQUFmLEVBQXFCO0FBQ25CLFlBQU0sR0FBRyxJQUFUOztBQUVBLFdBQUssb0JBQUwsR0FBNEIsSUFBNUI7QUFDQSxXQUFLLHNCQUFMLEdBQThCLElBQTlCO0FBQ0EsV0FBSyx3QkFBTCxHQUFnQyxLQUFLLHdCQUFMLENBQThCLElBQTlCLENBQW1DLElBQW5DLENBQWhDO0FBQ0EsV0FBSyxRQUFMLEdBQWdCLEtBQUssUUFBTCxDQUFjLElBQWQsQ0FBbUIsSUFBbkIsQ0FBaEI7QUFDQSxXQUFLLE9BQUwsR0FBZSxLQUFLLE9BQUwsQ0FBYSxJQUFiLENBQWtCLElBQWxCLENBQWY7QUFDQSxXQUFLLGNBQUwsR0FBc0IsS0FBSyxjQUFMLENBQW9CLElBQXBCLENBQXlCLElBQXpCLENBQXRCO0FBQ0Q7O0FBRUQsNkJBQXlCLElBQXpCLEVBQStCLFFBQS9CLEVBQXlDLFFBQXpDLEVBQW1EO0FBQ2pELFlBQU0sd0JBQU4sQ0FBK0IsSUFBL0IsRUFBcUMsUUFBckMsRUFBK0MsUUFBL0M7O0FBRUEsWUFBTSxXQUFXLGFBQWEsSUFBOUI7QUFDQSxVQUFJLFNBQVMsVUFBYixFQUF5QjtBQUN2QixtQkFBVyxLQUFLLHlCQUFMLEVBQVgsR0FBOEMsS0FBSyx3QkFBTCxFQUE5QztBQUNEO0FBQ0Y7O0FBRUQsd0JBQW9CO0FBQ2xCLFlBQU0saUJBQU47O0FBRUEseUJBQW1CLE9BQW5CLENBQTRCLGdCQUFELElBQXNCO0FBQy9DLFlBQUksS0FBSyxZQUFMLENBQWtCLGdCQUFsQixDQUFKLEVBQXlDO0FBQ3ZDLGVBQUssZUFBTCxDQUFxQixnQkFBckI7QUFDQTtBQUNBLGtCQUFRLElBQVIsQ0FBYSxlQUFlLGdCQUFmLENBQWI7QUFDRDtBQUNGLE9BTkQ7O0FBUUEsVUFBSSxLQUFLLFFBQVQsRUFBbUI7QUFDakIsYUFBSyx5QkFBTDtBQUNELE9BRkQsTUFFTztBQUNMLGFBQUssd0JBQUw7QUFDRDs7QUFFRDtBQUNBLFdBQUssZ0JBQUwsQ0FBc0IsT0FBdEIsRUFBK0IsS0FBSyxRQUFwQztBQUNBLFdBQUssZ0JBQUwsQ0FBc0IsTUFBdEIsRUFBOEIsS0FBSyxPQUFuQztBQUNBLFdBQUssYUFBTCxDQUFtQixnQkFBbkIsQ0FBb0MsV0FBcEMsRUFBaUQsS0FBSyxjQUF0RDtBQUNBLFdBQUssYUFBTCxDQUFtQixnQkFBbkIsQ0FBb0MsWUFBcEMsRUFBa0QsS0FBSyxjQUF2RDs7QUFFQSxXQUFLLGdCQUFMLENBQXNCLE9BQXRCLENBQStCLFNBQUQsSUFBZTtBQUMzQztBQUNBLGtCQUFVLGdCQUFWLENBQTJCLE9BQTNCLEVBQW9DLEtBQUssd0JBQXpDO0FBQ0QsT0FIRDtBQUlEOztBQUVELDJCQUF1QjtBQUNyQixZQUFNLG9CQUFOOztBQUVBLFdBQUssbUJBQUwsQ0FBeUIsT0FBekIsRUFBa0MsS0FBSyxRQUF2QztBQUNBLFdBQUssbUJBQUwsQ0FBeUIsTUFBekIsRUFBaUMsS0FBSyxPQUF0QztBQUNBLFdBQUssYUFBTCxDQUFtQixtQkFBbkIsQ0FBdUMsV0FBdkMsRUFBb0QsS0FBSyxjQUF6RDtBQUNBLFdBQUssYUFBTCxDQUFtQixtQkFBbkIsQ0FBdUMsWUFBdkMsRUFBcUQsS0FBSyxjQUExRDs7QUFFQSxXQUFLLGdCQUFMLENBQXNCLE9BQXRCLENBQStCLFNBQUQsSUFBZTtBQUMzQyxrQkFBVSxtQkFBVixDQUE4QixPQUE5QixFQUF1QyxLQUFLLHdCQUE1QztBQUNELE9BRkQ7QUFHRDs7QUFFRDs7OztBQUlBLFFBQUksT0FBSixHQUFjO0FBQ1osYUFBTyxLQUFLLFlBQUwsQ0FBa0IsU0FBbEIsQ0FBUDtBQUNEOztBQUVELFFBQUksT0FBSixDQUFZLENBQVosRUFBZTtBQUNiO0FBQ0EsY0FBUSxJQUFSLENBQWEsZUFBZSxPQUE1QjtBQUNEOztBQUVEOzs7O0FBSUEsUUFBSSxRQUFKLEdBQWU7QUFDYixhQUFPLEtBQUssWUFBTCxDQUFrQixVQUFsQixDQUFQO0FBQ0Q7O0FBRUQsUUFBSSxRQUFKLENBQWEsS0FBYixFQUFvQjtBQUNsQixZQUFNLFdBQVcsUUFBUSxLQUFSLENBQWpCO0FBQ0EsVUFBSSxRQUFKLEVBQWM7QUFDWixhQUFLLFlBQUwsQ0FBa0IsVUFBbEIsRUFBOEIsRUFBOUI7QUFDRCxPQUZELE1BRU87QUFDTCxhQUFLLGVBQUwsQ0FBcUIsVUFBckI7QUFDRDtBQUNGOztBQUVEOzs7OztBQUtBLFFBQUksZ0JBQUosR0FBdUI7QUFDckIsYUFBTyxLQUFLLFVBQUwsQ0FBZ0IsZ0JBQWhCLENBQWlDLFlBQWpDLEtBQWtELEVBQXpEO0FBQ0Q7O0FBRUQ7Ozs7O0FBS0EsUUFBSSxvQkFBSixHQUEyQjtBQUN6QixhQUFPLEtBQUssVUFBTCxDQUFnQixhQUFoQixDQUE4QixZQUE5QixDQUFQO0FBQ0Q7O0FBRUQ7Ozs7O0FBS0EsbUJBQWUsR0FBZixFQUFvQjtBQUNsQixVQUFJLElBQUksTUFBSixLQUFlLElBQW5CLEVBQXlCO0FBQ3ZCLGFBQUssSUFBTDtBQUNEO0FBQ0Y7O0FBRUQ7Ozs7O0FBS0EsNkJBQXlCLEdBQXpCLEVBQThCO0FBQzVCLFdBQUssb0JBQUwsR0FBNEIsSUFBSSxNQUFoQztBQUNEOztBQUVELGVBQVc7QUFDVCxVQUFJLEtBQUssUUFBVCxFQUFtQjtBQUNuQjtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQUssWUFBTCxDQUFrQixTQUFsQixFQUE2QixFQUE3QjtBQUNBLFdBQUssc0JBQUw7QUFDRDs7QUFFRCxjQUFVO0FBQ1IsV0FBSyxlQUFMLENBQXFCLFNBQXJCO0FBQ0EsV0FBSyxxQkFBTDtBQUNEOztBQUVELDZCQUF5QjtBQUN2QixVQUFJLEtBQUssb0JBQVQsRUFBK0I7QUFDN0I7QUFDQTtBQUNBO0FBQ0Q7QUFDRCxXQUFLLHlCQUFMO0FBQ0Q7O0FBRUQsNEJBQXdCO0FBQ3RCLFVBQUksS0FBSyxvQkFBVCxFQUErQjtBQUM3QixhQUFLLG9CQUFMLENBQTBCLElBQTFCO0FBQ0EsYUFBSyxvQkFBTCxHQUE0QixJQUE1QjtBQUNEO0FBQ0Y7O0FBRUQsZ0NBQTRCO0FBQzFCLFlBQU0sc0JBQXNCLEtBQUssb0JBQWpDO0FBQ0EsVUFBSSxtQkFBSixFQUF5QjtBQUN2QixhQUFLLG9CQUFMLEdBQTRCLG1CQUE1QjtBQUNBLDRCQUFvQixLQUFwQjtBQUNEO0FBQ0Y7O0FBRUQsZ0NBQTRCO0FBQzFCLFVBQUksS0FBSyxzQkFBTCxLQUFnQyxVQUFwQyxFQUFnRDtBQUNoRCxXQUFLLGtCQUFMLEdBQTBCLEtBQUssWUFBTCxDQUFrQixVQUFsQixDQUExQjtBQUNBLFdBQUssZUFBTCxDQUFxQixVQUFyQjtBQUNBLFdBQUssZ0JBQUwsQ0FBc0IsT0FBdEIsQ0FBK0IsY0FBRCxJQUFvQjtBQUNoRCx1QkFBZSxZQUFmLENBQTRCLFVBQTVCLEVBQXdDLElBQXhDO0FBQ0EsdUJBQWUsWUFBZixDQUE0QixVQUE1QixFQUF3QyxVQUF4QztBQUNBLFlBQUksZUFBZSxZQUFmLENBQTRCLGlCQUE1QixDQUFKLEVBQW9EO0FBQ2xELHlCQUFlLFlBQWYsQ0FBNEIsaUJBQTVCLEVBQStDLE9BQS9DO0FBQ0Q7QUFDRixPQU5EO0FBT0EsV0FBSyxJQUFMO0FBQ0EsV0FBSyxzQkFBTCxHQUE4QixVQUE5QjtBQUNEOztBQUVELCtCQUEyQjtBQUN6QixVQUFJLEtBQUssc0JBQUwsS0FBZ0MsU0FBcEMsRUFBK0M7QUFDL0MsT0FBQyxLQUFLLFlBQUwsQ0FBa0IsVUFBbEIsQ0FBRCxJQUFrQyxLQUFLLFlBQUwsQ0FBa0IsVUFBbEIsRUFBOEIsS0FBSyxrQkFBTCxJQUEyQixDQUF6RCxDQUFsQztBQUNBLFdBQUssZ0JBQUwsQ0FBc0IsT0FBdEIsQ0FBK0IsY0FBRCxJQUFvQjtBQUNoRCx1QkFBZSxZQUFmLENBQTRCLFVBQTVCLEVBQXdDLEdBQXhDO0FBQ0EsdUJBQWUsZUFBZixDQUErQixVQUEvQjtBQUNBLFlBQUksZUFBZSxZQUFmLENBQTRCLGlCQUE1QixDQUFKLEVBQW9EO0FBQ2xELHlCQUFlLFlBQWYsQ0FBNEIsaUJBQTVCLEVBQStDLE1BQS9DO0FBQ0Q7QUFDRixPQU5EO0FBT0EsV0FBSyxzQkFBTCxHQUE4QixTQUE5QjtBQUNEO0FBcE4yQjs7QUF1TjlCLFNBQU8sU0FBUDtBQUNEOzs7Ozs7Ozs7QUNqUUQ7Ozs7OztBQUVBOzs7Ozs7OztBQVFBLE1BQU0seUJBQTBCLEdBQUQsSUFBVSxVQUFELElBQWdCO0FBQ3RELFNBQU8sNEJBQWEsR0FBYixFQUFrQixVQUFsQixDQUFQO0FBQ0QsQ0FGRDs7a0JBSWUsc0I7Ozs7Ozs7Ozs7O0FDWmY7Ozs7QUFHQTs7OztBQUdBOzs7O0FBR0E7Ozs7QUFHQTs7OztBQUNBOzs7O0FBR0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFHQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7QUFsQkE7OztBQU5BO0FBMEJBLE1BQU0sZ0JBQWdCO0FBQ3BCLEdBQUMsb0JBQWEsZ0JBQWQsR0FDRSxtQkFGa0I7QUFHcEIsR0FBQywwQkFBbUIsZ0JBQXBCLEdBQ0UseUJBSmtCO0FBS3BCLEdBQUMsNEJBQXFCLGdCQUF0QixHQUNFLDJCQU5rQjtBQU9wQixHQUFDLG1CQUFZLGdCQUFiLEdBQ0Usa0JBUmtCO0FBU3BCLEdBQUMseUJBQWtCLGdCQUFuQixHQUNFO0FBVmtCLENBQXRCOztBQWFBOzs7Ozs7Ozs7OztBQXBCQTs7O0FBTkE7OztBQUpBOzs7QUFOQTtBQVBBO0FBQ0E7QUFtREEsU0FBUyxpQkFBVCxDQUEyQixNQUFNLE1BQWpDLEVBQXlDO0FBQ3ZDOzs7Ozs7O0FBT0EsU0FBUSxVQUFELElBQWdCO0FBQ3JCLFdBQU8sc0NBQXVCLEdBQXZCLEVBQTRCLFVBQTVCLEVBQ0osTUFESSxDQUNHLENBQUMsR0FBRCxFQUFNLEVBQUUsZ0JBQUYsRUFBTixLQUErQjtBQUNyQyxZQUFNLGlCQUFpQixjQUFjLGdCQUFkLEVBQWdDLE1BQWhDLENBQXZCO0FBQ0EscUJBQWUsWUFBZjtBQUNBLFVBQUksZ0JBQUosSUFBd0IsY0FBeEI7QUFDQSxhQUFPLEdBQVA7QUFDRCxLQU5JLEVBTUYsRUFORSxDQUFQO0FBT0QsR0FSRDtBQVNEOztRQUdDLGEsR0FBQSxhO1FBR0EsaUIsR0FBQSxpQjtRQUNBLHNCLEdBQUEsZ0M7UUFHQSx3QixHQUFBLGtDO1FBR0EsdUIsR0FBQSw4QjtRQUdBLFMsR0FBQSxtQjtRQUdBLG9CLEdBQUEsMkI7UUFDQSxrQixHQUFBLHlCO1FBR0EsVSxHQUFBLG9CO1FBQ0EsZ0IsR0FBQSwwQjtRQUNBLFEsR0FBQSxrQjtRQUNBLGUsR0FBQSx5QjtRQUdBLFksR0FBQSxtQjtRQUNBLGtCLEdBQUEseUI7UUFDQSxvQixHQUFBLDJCO1FBQ0EsVyxHQUFBLGtCO1FBQ0EsaUIsR0FBQSx3Qjs7QUFHRjs7QUFFQSxJQUFJLFFBQVEsWUFBWjs7QUFFQSxJQUFJLFFBQVEsR0FBUixDQUFZLFFBQVosS0FBeUIsWUFBN0IsRUFBMkM7QUFDekMsVUFBUSxTQUFSO0FBQ0Q7O0FBRUQsUUFBUSxHQUFSLENBQWEsa0NBQWlDLEtBQU0sU0FBcEQiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCIvLyBzaGltIGZvciB1c2luZyBwcm9jZXNzIGluIGJyb3dzZXJcbnZhciBwcm9jZXNzID0gbW9kdWxlLmV4cG9ydHMgPSB7fTtcblxuLy8gY2FjaGVkIGZyb20gd2hhdGV2ZXIgZ2xvYmFsIGlzIHByZXNlbnQgc28gdGhhdCB0ZXN0IHJ1bm5lcnMgdGhhdCBzdHViIGl0XG4vLyBkb24ndCBicmVhayB0aGluZ3MuICBCdXQgd2UgbmVlZCB0byB3cmFwIGl0IGluIGEgdHJ5IGNhdGNoIGluIGNhc2UgaXQgaXNcbi8vIHdyYXBwZWQgaW4gc3RyaWN0IG1vZGUgY29kZSB3aGljaCBkb2Vzbid0IGRlZmluZSBhbnkgZ2xvYmFscy4gIEl0J3MgaW5zaWRlIGFcbi8vIGZ1bmN0aW9uIGJlY2F1c2UgdHJ5L2NhdGNoZXMgZGVvcHRpbWl6ZSBpbiBjZXJ0YWluIGVuZ2luZXMuXG5cbnZhciBjYWNoZWRTZXRUaW1lb3V0O1xudmFyIGNhY2hlZENsZWFyVGltZW91dDtcblxuZnVuY3Rpb24gZGVmYXVsdFNldFRpbW91dCgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3NldFRpbWVvdXQgaGFzIG5vdCBiZWVuIGRlZmluZWQnKTtcbn1cbmZ1bmN0aW9uIGRlZmF1bHRDbGVhclRpbWVvdXQgKCkge1xuICAgIHRocm93IG5ldyBFcnJvcignY2xlYXJUaW1lb3V0IGhhcyBub3QgYmVlbiBkZWZpbmVkJyk7XG59XG4oZnVuY3Rpb24gKCkge1xuICAgIHRyeSB7XG4gICAgICAgIGlmICh0eXBlb2Ygc2V0VGltZW91dCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IHNldFRpbWVvdXQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gZGVmYXVsdFNldFRpbW91dDtcbiAgICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IGRlZmF1bHRTZXRUaW1vdXQ7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIGlmICh0eXBlb2YgY2xlYXJUaW1lb3V0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBjbGVhclRpbWVvdXQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBkZWZhdWx0Q2xlYXJUaW1lb3V0O1xuICAgICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBkZWZhdWx0Q2xlYXJUaW1lb3V0O1xuICAgIH1cbn0gKCkpXG5mdW5jdGlvbiBydW5UaW1lb3V0KGZ1bikge1xuICAgIGlmIChjYWNoZWRTZXRUaW1lb3V0ID09PSBzZXRUaW1lb3V0KSB7XG4gICAgICAgIC8vbm9ybWFsIGVudmlyb21lbnRzIGluIHNhbmUgc2l0dWF0aW9uc1xuICAgICAgICByZXR1cm4gc2V0VGltZW91dChmdW4sIDApO1xuICAgIH1cbiAgICAvLyBpZiBzZXRUaW1lb3V0IHdhc24ndCBhdmFpbGFibGUgYnV0IHdhcyBsYXR0ZXIgZGVmaW5lZFxuICAgIGlmICgoY2FjaGVkU2V0VGltZW91dCA9PT0gZGVmYXVsdFNldFRpbW91dCB8fCAhY2FjaGVkU2V0VGltZW91dCkgJiYgc2V0VGltZW91dCkge1xuICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gc2V0VGltZW91dDtcbiAgICAgICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgLy8gd2hlbiB3aGVuIHNvbWVib2R5IGhhcyBzY3Jld2VkIHdpdGggc2V0VGltZW91dCBidXQgbm8gSS5FLiBtYWRkbmVzc1xuICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dChmdW4sIDApO1xuICAgIH0gY2F0Y2goZSl7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvLyBXaGVuIHdlIGFyZSBpbiBJLkUuIGJ1dCB0aGUgc2NyaXB0IGhhcyBiZWVuIGV2YWxlZCBzbyBJLkUuIGRvZXNuJ3QgdHJ1c3QgdGhlIGdsb2JhbCBvYmplY3Qgd2hlbiBjYWxsZWQgbm9ybWFsbHlcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0LmNhbGwobnVsbCwgZnVuLCAwKTtcbiAgICAgICAgfSBjYXRjaChlKXtcbiAgICAgICAgICAgIC8vIHNhbWUgYXMgYWJvdmUgYnV0IHdoZW4gaXQncyBhIHZlcnNpb24gb2YgSS5FLiB0aGF0IG11c3QgaGF2ZSB0aGUgZ2xvYmFsIG9iamVjdCBmb3IgJ3RoaXMnLCBob3BmdWxseSBvdXIgY29udGV4dCBjb3JyZWN0IG90aGVyd2lzZSBpdCB3aWxsIHRocm93IGEgZ2xvYmFsIGVycm9yXG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dC5jYWxsKHRoaXMsIGZ1biwgMCk7XG4gICAgICAgIH1cbiAgICB9XG5cblxufVxuZnVuY3Rpb24gcnVuQ2xlYXJUaW1lb3V0KG1hcmtlcikge1xuICAgIGlmIChjYWNoZWRDbGVhclRpbWVvdXQgPT09IGNsZWFyVGltZW91dCkge1xuICAgICAgICAvL25vcm1hbCBlbnZpcm9tZW50cyBpbiBzYW5lIHNpdHVhdGlvbnNcbiAgICAgICAgcmV0dXJuIGNsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH1cbiAgICAvLyBpZiBjbGVhclRpbWVvdXQgd2Fzbid0IGF2YWlsYWJsZSBidXQgd2FzIGxhdHRlciBkZWZpbmVkXG4gICAgaWYgKChjYWNoZWRDbGVhclRpbWVvdXQgPT09IGRlZmF1bHRDbGVhclRpbWVvdXQgfHwgIWNhY2hlZENsZWFyVGltZW91dCkgJiYgY2xlYXJUaW1lb3V0KSB7XG4gICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGNsZWFyVGltZW91dDtcbiAgICAgICAgcmV0dXJuIGNsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICAvLyB3aGVuIHdoZW4gc29tZWJvZHkgaGFzIHNjcmV3ZWQgd2l0aCBzZXRUaW1lb3V0IGJ1dCBubyBJLkUuIG1hZGRuZXNzXG4gICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9IGNhdGNoIChlKXtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIC8vIFdoZW4gd2UgYXJlIGluIEkuRS4gYnV0IHRoZSBzY3JpcHQgaGFzIGJlZW4gZXZhbGVkIHNvIEkuRS4gZG9lc24ndCAgdHJ1c3QgdGhlIGdsb2JhbCBvYmplY3Qgd2hlbiBjYWxsZWQgbm9ybWFsbHlcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQuY2FsbChudWxsLCBtYXJrZXIpO1xuICAgICAgICB9IGNhdGNoIChlKXtcbiAgICAgICAgICAgIC8vIHNhbWUgYXMgYWJvdmUgYnV0IHdoZW4gaXQncyBhIHZlcnNpb24gb2YgSS5FLiB0aGF0IG11c3QgaGF2ZSB0aGUgZ2xvYmFsIG9iamVjdCBmb3IgJ3RoaXMnLCBob3BmdWxseSBvdXIgY29udGV4dCBjb3JyZWN0IG90aGVyd2lzZSBpdCB3aWxsIHRocm93IGEgZ2xvYmFsIGVycm9yLlxuICAgICAgICAgICAgLy8gU29tZSB2ZXJzaW9ucyBvZiBJLkUuIGhhdmUgZGlmZmVyZW50IHJ1bGVzIGZvciBjbGVhclRpbWVvdXQgdnMgc2V0VGltZW91dFxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dC5jYWxsKHRoaXMsIG1hcmtlcik7XG4gICAgICAgIH1cbiAgICB9XG5cblxuXG59XG52YXIgcXVldWUgPSBbXTtcbnZhciBkcmFpbmluZyA9IGZhbHNlO1xudmFyIGN1cnJlbnRRdWV1ZTtcbnZhciBxdWV1ZUluZGV4ID0gLTE7XG5cbmZ1bmN0aW9uIGNsZWFuVXBOZXh0VGljaygpIHtcbiAgICBpZiAoIWRyYWluaW5nIHx8ICFjdXJyZW50UXVldWUpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBkcmFpbmluZyA9IGZhbHNlO1xuICAgIGlmIChjdXJyZW50UXVldWUubGVuZ3RoKSB7XG4gICAgICAgIHF1ZXVlID0gY3VycmVudFF1ZXVlLmNvbmNhdChxdWV1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcXVldWVJbmRleCA9IC0xO1xuICAgIH1cbiAgICBpZiAocXVldWUubGVuZ3RoKSB7XG4gICAgICAgIGRyYWluUXVldWUoKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGRyYWluUXVldWUoKSB7XG4gICAgaWYgKGRyYWluaW5nKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdmFyIHRpbWVvdXQgPSBydW5UaW1lb3V0KGNsZWFuVXBOZXh0VGljayk7XG4gICAgZHJhaW5pbmcgPSB0cnVlO1xuXG4gICAgdmFyIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB3aGlsZShsZW4pIHtcbiAgICAgICAgY3VycmVudFF1ZXVlID0gcXVldWU7XG4gICAgICAgIHF1ZXVlID0gW107XG4gICAgICAgIHdoaWxlICgrK3F1ZXVlSW5kZXggPCBsZW4pIHtcbiAgICAgICAgICAgIGlmIChjdXJyZW50UXVldWUpIHtcbiAgICAgICAgICAgICAgICBjdXJyZW50UXVldWVbcXVldWVJbmRleF0ucnVuKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcXVldWVJbmRleCA9IC0xO1xuICAgICAgICBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgfVxuICAgIGN1cnJlbnRRdWV1ZSA9IG51bGw7XG4gICAgZHJhaW5pbmcgPSBmYWxzZTtcbiAgICBydW5DbGVhclRpbWVvdXQodGltZW91dCk7XG59XG5cbnByb2Nlc3MubmV4dFRpY2sgPSBmdW5jdGlvbiAoZnVuKSB7XG4gICAgdmFyIGFyZ3MgPSBuZXcgQXJyYXkoYXJndW1lbnRzLmxlbmd0aCAtIDEpO1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSkge1xuICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgYXJnc1tpIC0gMV0gPSBhcmd1bWVudHNbaV07XG4gICAgICAgIH1cbiAgICB9XG4gICAgcXVldWUucHVzaChuZXcgSXRlbShmdW4sIGFyZ3MpKTtcbiAgICBpZiAocXVldWUubGVuZ3RoID09PSAxICYmICFkcmFpbmluZykge1xuICAgICAgICBydW5UaW1lb3V0KGRyYWluUXVldWUpO1xuICAgIH1cbn07XG5cbi8vIHY4IGxpa2VzIHByZWRpY3RpYmxlIG9iamVjdHNcbmZ1bmN0aW9uIEl0ZW0oZnVuLCBhcnJheSkge1xuICAgIHRoaXMuZnVuID0gZnVuO1xuICAgIHRoaXMuYXJyYXkgPSBhcnJheTtcbn1cbkl0ZW0ucHJvdG90eXBlLnJ1biA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmZ1bi5hcHBseShudWxsLCB0aGlzLmFycmF5KTtcbn07XG5wcm9jZXNzLnRpdGxlID0gJ2Jyb3dzZXInO1xucHJvY2Vzcy5icm93c2VyID0gdHJ1ZTtcbnByb2Nlc3MuZW52ID0ge307XG5wcm9jZXNzLmFyZ3YgPSBbXTtcbnByb2Nlc3MudmVyc2lvbiA9ICcnOyAvLyBlbXB0eSBzdHJpbmcgdG8gYXZvaWQgcmVnZXhwIGlzc3Vlc1xucHJvY2Vzcy52ZXJzaW9ucyA9IHt9O1xuXG5mdW5jdGlvbiBub29wKCkge31cblxucHJvY2Vzcy5vbiA9IG5vb3A7XG5wcm9jZXNzLmFkZExpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3Mub25jZSA9IG5vb3A7XG5wcm9jZXNzLm9mZiA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUxpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlQWxsTGlzdGVuZXJzID0gbm9vcDtcbnByb2Nlc3MuZW1pdCA9IG5vb3A7XG5wcm9jZXNzLnByZXBlbmRMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLnByZXBlbmRPbmNlTGlzdGVuZXIgPSBub29wO1xuXG5wcm9jZXNzLmxpc3RlbmVycyA9IGZ1bmN0aW9uIChuYW1lKSB7IHJldHVybiBbXSB9XG5cbnByb2Nlc3MuYmluZGluZyA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmJpbmRpbmcgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcblxucHJvY2Vzcy5jd2QgPSBmdW5jdGlvbiAoKSB7IHJldHVybiAnLycgfTtcbnByb2Nlc3MuY2hkaXIgPSBmdW5jdGlvbiAoZGlyKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmNoZGlyIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5wcm9jZXNzLnVtYXNrID0gZnVuY3Rpb24oKSB7IHJldHVybiAwOyB9O1xuIiwiLypcbkRCVUlXZWJDb21wb25lbnRCYXNlIChmcm9tIHdoaWNoIGFsbCB3ZWItY29tcG9uZW50cyBpbmhlcml0KVxud2lsbCByZWFkIGNvbXBvbmVudFN0eWxlIGZyb20gd2luLkRCVUlXZWJDb21wb25lbnRzXG53aGVuIGtsYXNzLnJlZ2lzdGVyU2VsZigpIGlzIGNhbGxlZCBnaXZpbmcgYSBjaGFuY2UgdG8gb3ZlcnJpZGUgZGVmYXVsdCB3ZWItY29tcG9uZW50IHN0eWxlXG5qdXN0IGJlZm9yZSBpdCBpcyByZWdpc3RlcmVkLlxuKi9cbmV4cG9ydCBjb25zdCBfYXBwZW5kU3R5bGUgPSAod2luKSA9PiAocmVnaXN0cmF0aW9uTmFtZSwgY29tcG9uZW50U3R5bGUpID0+IHtcbiAgaWYgKCF3aW4uREJVSVdlYkNvbXBvbmVudHMpIHtcbiAgICB3aW4uREJVSVdlYkNvbXBvbmVudHMgPSB7fTtcbiAgfVxuICB3aW4uREJVSVdlYkNvbXBvbmVudHMgPSB7XG4gICAgLi4ud2luLkRCVUlXZWJDb21wb25lbnRzLFxuICAgIFtyZWdpc3RyYXRpb25OYW1lXToge1xuICAgICAgLi4ud2luLkRCVUlXZWJDb21wb25lbnRzW3JlZ2lzdHJhdGlvbk5hbWVdLFxuICAgICAgY29tcG9uZW50U3R5bGVcbiAgICB9XG4gIH07XG59O1xuXG5jb25zdCBhcHBlbmRTdHlsZXMgPSAod2luKSA9PiAoY29tcG9uZW50cykgPT4ge1xuICBjb21wb25lbnRzLmZvckVhY2goKHsgcmVnaXN0cmF0aW9uTmFtZSwgY29tcG9uZW50U3R5bGUgfSkgPT4ge1xuICAgIF9hcHBlbmRTdHlsZSh3aW4pKHJlZ2lzdHJhdGlvbk5hbWUsIGNvbXBvbmVudFN0eWxlKTtcbiAgfSk7XG4gIHJldHVybiBjb21wb25lbnRzO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgYXBwZW5kU3R5bGVzO1xuIiwiXG4vKipcbiAqXG4gKiBAcGFyYW0gd2luIFdpbmRvd1xuICogQHBhcmFtIG5hbWUgU3RyaW5nXG4gKiBAcGFyYW0gY2FsbGJhY2sgRnVuY3Rpb25cbiAqIEByZXR1cm4gKlxuICovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBlbnN1cmVTaW5nbGVSZWdpc3RyYXRpb24od2luLCBuYW1lLCBjYWxsYmFjaykge1xuICBpZiAoIXdpbi5EQlVJV2ViQ29tcG9uZW50cykge1xuICAgIHdpbi5EQlVJV2ViQ29tcG9uZW50cyA9IHsgcmVnaXN0cmF0aW9uczoge30gfTtcbiAgfSBlbHNlIGlmICghd2luLkRCVUlXZWJDb21wb25lbnRzLnJlZ2lzdHJhdGlvbnMpIHtcbiAgICB3aW4uREJVSVdlYkNvbXBvbmVudHMucmVnaXN0cmF0aW9ucyA9IHt9O1xuICB9XG5cbiAgbGV0IHJlZ2lzdHJhdGlvbiA9IHdpbi5EQlVJV2ViQ29tcG9uZW50cy5yZWdpc3RyYXRpb25zW25hbWVdO1xuXG4gIGlmIChyZWdpc3RyYXRpb24pIHJldHVybiByZWdpc3RyYXRpb247XG5cbiAgcmVnaXN0cmF0aW9uID0gY2FsbGJhY2soKTtcbiAgd2luLkRCVUlXZWJDb21wb25lbnRzLnJlZ2lzdHJhdGlvbnNbbmFtZV0gPSByZWdpc3RyYXRpb247XG5cbiAgcmV0dXJuIHdpbi5EQlVJV2ViQ29tcG9uZW50cy5yZWdpc3RyYXRpb25zW25hbWVdO1xufVxuXG4iLCJpbXBvcnQgZW5zdXJlU2luZ2xlUmVnaXN0cmF0aW9uIGZyb20gJy4uL2ludGVybmFscy9lbnN1cmVTaW5nbGVSZWdpc3RyYXRpb24nO1xuXG5jb25zdCBlbXB0eU9iaiA9IHt9O1xuXG5jb25zdCByZWdpc3RyYXRpb25OYW1lID0gJ0RCVUlJMThuU2VydmljZSc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGdldERCVUlJMThuU2VydmljZSh3aW4pIHtcbiAgcmV0dXJuIGVuc3VyZVNpbmdsZVJlZ2lzdHJhdGlvbih3aW4sIHJlZ2lzdHJhdGlvbk5hbWUsICgpID0+IHtcbiAgICBjbGFzcyBEQlVJSTE4blNlcnZpY2Uge1xuICAgICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuX3RyYW5zbGF0aW9ucyA9IHt9O1xuICAgICAgfVxuXG4gICAgICBjbGVhclRyYW5zbGF0aW9ucyhsYW5nKSB7XG4gICAgICAgIGRlbGV0ZSB0aGlzLl90cmFuc2xhdGlvbnNbbGFuZ107XG4gICAgICB9XG5cbiAgICAgIHJlZ2lzdGVyVHJhbnNsYXRpb25zKHRyYW5zbGF0aW9ucykge1xuICAgICAgICB0aGlzLl90cmFuc2xhdGlvbnMgPSBPYmplY3Qua2V5cyh0cmFuc2xhdGlvbnMpLnJlZHVjZSgoYWNjLCBsYW5nKSA9PiB7XG4gICAgICAgICAgYWNjW2xhbmddID0ge1xuICAgICAgICAgICAgLi4udGhpcy5fdHJhbnNsYXRpb25zW2xhbmddLFxuICAgICAgICAgICAgLi4udHJhbnNsYXRpb25zW2xhbmddXG4gICAgICAgICAgfTtcbiAgICAgICAgICByZXR1cm4gYWNjO1xuICAgICAgICB9LCB0aGlzLl90cmFuc2xhdGlvbnMpO1xuICAgICAgfVxuXG4gICAgICB0cmFuc2xhdGUobXNnLCBsYW5nKSB7XG4gICAgICAgIHJldHVybiAodGhpcy50cmFuc2xhdGlvbnNbbGFuZ10gfHwgZW1wdHlPYmopW21zZ107XG4gICAgICB9XG5cbiAgICAgIGdldCB0cmFuc2xhdGlvbnMoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl90cmFuc2xhdGlvbnM7XG4gICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgZGJ1aUkxOG5TZXJ2aWNlID0gbmV3IERCVUlJMThuU2VydmljZSgpO1xuICAgIHJldHVybiBkYnVpSTE4blNlcnZpY2U7XG4gIH0pO1xufVxuIiwiXG5pbXBvcnQgZW5zdXJlU2luZ2xlUmVnaXN0cmF0aW9uIGZyb20gJy4uL2ludGVybmFscy9lbnN1cmVTaW5nbGVSZWdpc3RyYXRpb24nO1xuXG5jb25zdCBkZWZhdWx0TG9jYWxlID0ge1xuICBkaXI6ICdsdHInLFxuICBsYW5nOiAnZW4nXG59O1xuXG5jb25zdCByZWdpc3RyYXRpb25OYW1lID0gJ0RCVUlMb2NhbGVTZXJ2aWNlJztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZ2V0REJVSUxvY2FsZVNlcnZpY2Uod2luKSB7XG4gIHJldHVybiBlbnN1cmVTaW5nbGVSZWdpc3RyYXRpb24od2luLCByZWdpc3RyYXRpb25OYW1lLCAoKSA9PiB7XG4gICAgY2xhc3MgREJVSUxvY2FsZVNlcnZpY2Uge1xuICAgICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuX2NhbGxiYWNrcyA9IFtdO1xuICAgICAgICB0aGlzLl9sb2NhbGVBdHRycyA9IE9iamVjdC5rZXlzKGRlZmF1bHRMb2NhbGUpO1xuICAgICAgICB0aGlzLl9yb290RWxlbWVudCA9IHdpbi5kb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdbeC1kYnVpLWxvY2FsZS1yb290XScpIHx8IHdpbi5kb2N1bWVudC5kb2N1bWVudEVsZW1lbnQ7XG4gICAgICAgIHRoaXMuX2xvY2FsZUF0dHJzLmZvckVhY2goKGF0dHIpID0+IHtcbiAgICAgICAgICBpZiAoIXRoaXMuX3Jvb3RFbGVtZW50LmdldEF0dHJpYnV0ZShhdHRyKSkge1xuICAgICAgICAgICAgdGhpcy5fcm9vdEVsZW1lbnQuc2V0QXR0cmlidXRlKGF0dHIsIGRlZmF1bHRMb2NhbGVbYXR0cl0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuX2xvY2FsZSA9IHRoaXMuX2xvY2FsZUF0dHJzLnJlZHVjZSgoYWNjLCBhdHRyKSA9PiB7XG4gICAgICAgICAgYWNjW2F0dHJdID0gdGhpcy5fcm9vdEVsZW1lbnQuZ2V0QXR0cmlidXRlKGF0dHIpO1xuICAgICAgICAgIHJldHVybiBhY2M7XG4gICAgICAgIH0sIHt9KTtcbiAgICAgICAgdGhpcy5fb2JzZXJ2ZXIgPSBuZXcgTXV0YXRpb25PYnNlcnZlcih0aGlzLl9oYW5kbGVNdXRhdGlvbnMuYmluZCh0aGlzKSk7XG4gICAgICAgIHRoaXMuX29ic2VydmVyLm9ic2VydmUodGhpcy5fcm9vdEVsZW1lbnQsIHtcbiAgICAgICAgICBhdHRyaWJ1dGVzOiB0cnVlXG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICBfaGFuZGxlTXV0YXRpb25zKG11dGF0aW9ucykge1xuICAgICAgICBtdXRhdGlvbnMuZm9yRWFjaCgobXV0YXRpb24pID0+IHtcbiAgICAgICAgICBjb25zdCBtdXRhdGlvbkF0dHJpYnV0ZU5hbWUgPSBtdXRhdGlvbi5hdHRyaWJ1dGVOYW1lO1xuICAgICAgICAgIGlmICh0aGlzLl9sb2NhbGVBdHRycy5pbmNsdWRlcyhtdXRhdGlvbkF0dHJpYnV0ZU5hbWUpKSB7XG4gICAgICAgICAgICB0aGlzLl9sb2NhbGUgPSB7XG4gICAgICAgICAgICAgIC4uLnRoaXMuX2xvY2FsZSxcbiAgICAgICAgICAgICAgW211dGF0aW9uQXR0cmlidXRlTmFtZV06IHRoaXMuX3Jvb3RFbGVtZW50LmdldEF0dHJpYnV0ZShtdXRhdGlvbkF0dHJpYnV0ZU5hbWUpXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgdGhpcy5fY2FsbGJhY2tzLmZvckVhY2goY2FsbGJhY2sgPT4gY2FsbGJhY2sodGhpcy5fbG9jYWxlKSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgc2V0IGxvY2FsZShsb2NhbGVPYmopIHtcbiAgICAgICAgT2JqZWN0LmtleXMobG9jYWxlT2JqKS5mb3JFYWNoKChrZXkpID0+IHtcbiAgICAgICAgICB0aGlzLl9yb290RWxlbWVudC5zZXRBdHRyaWJ1dGUoa2V5LCBsb2NhbGVPYmpba2V5XSk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICBnZXQgbG9jYWxlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fbG9jYWxlO1xuICAgICAgfVxuXG4gICAgICBvbkxvY2FsZUNoYW5nZShjYWxsYmFjaykge1xuICAgICAgICB0aGlzLl9jYWxsYmFja3MucHVzaChjYWxsYmFjayk7XG4gICAgICAgIGNhbGxiYWNrKHRoaXMubG9jYWxlKTtcbiAgICAgICAgcmV0dXJuICgpID0+IHtcbiAgICAgICAgICB0aGlzLl9jYWxsYmFja3MgPSB0aGlzLl9jYWxsYmFja3MuZmlsdGVyKGNiID0+IGNiICE9PSBjYWxsYmFjayk7XG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgZGJ1aUxvY2FsZVNlcnZpY2UgPSBuZXcgREJVSUxvY2FsZVNlcnZpY2UoKTtcbiAgICByZXR1cm4gZGJ1aUxvY2FsZVNlcnZpY2U7XG4gIH0pO1xufVxuIiwiLyogZXNsaW50IHByZWZlci1jb25zdDogMCAqL1xuXG4vKipcbiAqXG4gKiBAcGFyYW0gb3B0aW9ucyBPYmplY3RcbiAqIEByZXR1cm5zIGZ1bmN0aW9uKFN0cmluZyk6IFN0cmluZ1xuICovXG5jb25zdCBmb3JjZUZsb2F0ID0gKHsgZGVjUG9pbnQgPSAnLicgfSA9IHt9KSA9PiAodmFsdWUpID0+IHtcbiAgY29uc3QgR0xPQkFMX0RFQ19QT0lOVCA9IG5ldyBSZWdFeHAoYFxcXFwke2RlY1BvaW50fWAsICdnJyk7XG4gIGNvbnN0IEdMT0JBTF9OT05fTlVNQkVSX09SX0RFQ19QT0lOVCA9IG5ldyBSZWdFeHAoYFteXFxcXGQke2RlY1BvaW50fV1gLCAnZycpO1xuICBjb25zdCBOVU1CRVJfREVDX1BPSU5UX09SX1NIT1JUQ1VUID0gbmV3IFJlZ0V4cChgW1xcXFxkJHtkZWNQb2ludH1La01tXWAsICcnKTtcbiAgY29uc3QgTlVNQkVSX09SX1NJR04gPSBuZXcgUmVnRXhwKCdbXFxcXGQrLV0nLCAnJyk7XG4gIGNvbnN0IFNJR04gPSBuZXcgUmVnRXhwKCdbKy1dJywgJycpO1xuICBjb25zdCBTSE9SVENVVCA9IG5ldyBSZWdFeHAoJ1tLa01tXScsICcnKTtcbiAgY29uc3QgU0hPUlRDVVRfVEhPVVNBTkRTID0gbmV3IFJlZ0V4cCgnW0trXScsICcnKTtcblxuICBsZXQgdmFsdWVUb1VzZSA9IHZhbHVlO1xuICBjb25zdCBpbmRleE9mUG9pbnQgPSB2YWx1ZVRvVXNlLmluZGV4T2YoZGVjUG9pbnQpO1xuICBjb25zdCBsYXN0SW5kZXhPZlBvaW50ID0gdmFsdWVUb1VzZS5sYXN0SW5kZXhPZihkZWNQb2ludCk7XG4gIGNvbnN0IGhhc01vcmVUaGFuT25lUG9pbnQgPSBpbmRleE9mUG9pbnQgIT09IGxhc3RJbmRleE9mUG9pbnQ7XG5cbiAgaWYgKGhhc01vcmVUaGFuT25lUG9pbnQpIHtcbiAgICB2YWx1ZVRvVXNlID0gYCR7dmFsdWVUb1VzZS5yZXBsYWNlKEdMT0JBTF9ERUNfUE9JTlQsICcnKX0ke2RlY1BvaW50fWA7XG4gIH1cblxuICBsZXQgZmlyc3RDaGFyID0gdmFsdWVUb1VzZVswXSB8fCAnJztcbiAgbGV0IGxhc3RDaGFyID0gKHZhbHVlVG9Vc2UubGVuZ3RoID4gMSA/IHZhbHVlVG9Vc2VbdmFsdWVUb1VzZS5sZW5ndGggLSAxXSA6ICcnKSB8fCAnJztcbiAgbGV0IG1pZGRsZUNoYXJzID0gdmFsdWVUb1VzZS5zdWJzdHIoMSwgdmFsdWVUb1VzZS5sZW5ndGggLSAyKSB8fCAnJztcblxuICBpZiAoIWZpcnN0Q2hhci5tYXRjaChOVU1CRVJfT1JfU0lHTikpIHtcbiAgICBmaXJzdENoYXIgPSAnJztcbiAgfVxuXG4gIG1pZGRsZUNoYXJzID0gbWlkZGxlQ2hhcnMucmVwbGFjZShHTE9CQUxfTk9OX05VTUJFUl9PUl9ERUNfUE9JTlQsICcnKTtcblxuICBpZiAoIWxhc3RDaGFyLm1hdGNoKE5VTUJFUl9ERUNfUE9JTlRfT1JfU0hPUlRDVVQpKSB7XG4gICAgbGFzdENoYXIgPSAnJztcbiAgfSBlbHNlIGlmIChsYXN0Q2hhci5tYXRjaChTSE9SVENVVCkpIHtcbiAgICBpZiAobWlkZGxlQ2hhcnMgPT09IGRlY1BvaW50KSB7XG4gICAgICBtaWRkbGVDaGFycyA9ICcnO1xuICAgIH0gZWxzZSBpZiAobWlkZGxlQ2hhcnMgPT09ICcnICYmIGZpcnN0Q2hhci5tYXRjaChTSUdOKSkge1xuICAgICAgbGFzdENoYXIgPSAnJztcbiAgICB9XG4gIH0gZWxzZSBpZiAobGFzdENoYXIgPT09IGRlY1BvaW50ICYmIG1pZGRsZUNoYXJzID09PSAnJyAmJiBmaXJzdENoYXIubWF0Y2goU0lHTikpIHtcbiAgICBsYXN0Q2hhciA9ICcnO1xuICB9XG5cbiAgdmFsdWVUb1VzZSA9IFtmaXJzdENoYXIsIG1pZGRsZUNoYXJzLCBsYXN0Q2hhcl0uam9pbignJyk7XG5cbiAgaWYgKGxhc3RDaGFyLm1hdGNoKFNIT1JUQ1VUKSkge1xuICAgIHZhbHVlVG9Vc2UgPSAoXG4gICAgICBOdW1iZXIoYCR7Zmlyc3RDaGFyfSR7bWlkZGxlQ2hhcnN9YC5yZXBsYWNlKGRlY1BvaW50LCAnLicpKSAqXG4gICAgICAobGFzdENoYXIubWF0Y2goU0hPUlRDVVRfVEhPVVNBTkRTKSA/IDEwMDAgOiAxMDAwMDAwKVxuICAgICkudG9TdHJpbmcoKS5yZXBsYWNlKCcuJywgZGVjUG9pbnQpO1xuICB9XG5cbiAgcmV0dXJuIHZhbHVlVG9Vc2U7XG59O1xuXG4vKipcbiAqXG4gKiBAcGFyYW0gb3B0aW9ucyBPYmplY3RcbiAqIEByZXR1cm5zIGZ1bmN0aW9uKFN0cmluZyk6IFN0cmluZ1xuICovXG5jb25zdCBudW1iZXJGb3JtYXR0ZXIgPSAoeyBkZWNQb2ludCA9ICcuJywgdGhvdXNhbmRzU2VwYXJhdG9yID0gJywnIH0gPSB7fSkgPT4gdmFsdWUgPT4ge1xuICB2YWx1ZSA9IHZhbHVlLnJlcGxhY2UoJy4nLCBkZWNQb2ludCk7XG4gIGxldCBmaXJzdENoYXIgPSB2YWx1ZVswXSB8fCAnJztcbiAgZmlyc3RDaGFyID0gWycrJywgJy0nXS5pbmNsdWRlcyhmaXJzdENoYXIpID8gZmlyc3RDaGFyIDogJyc7XG4gIGNvbnN0IGlzRmxvYXRpbmdQb2ludCA9IHZhbHVlLmluZGV4T2YoZGVjUG9pbnQpICE9PSAtMTtcbiAgbGV0IFtpbnRlZ2VyUGFydCA9ICcnLCBkZWNpbWFscyA9ICcnXSA9IHZhbHVlLnNwbGl0KGRlY1BvaW50KTtcbiAgaW50ZWdlclBhcnQgPSBpbnRlZ2VyUGFydC5yZXBsYWNlKC9bKy1dL2csICcnKTtcbiAgaW50ZWdlclBhcnQgPSBpbnRlZ2VyUGFydC5yZXBsYWNlKC9cXEIoPz0oXFxkezN9KSsoPyFcXGQpKS9nLCB0aG91c2FuZHNTZXBhcmF0b3IpO1xuICBjb25zdCByZXQgPSBgJHtmaXJzdENoYXJ9JHtpbnRlZ2VyUGFydH0ke2lzRmxvYXRpbmdQb2ludCA/IGRlY1BvaW50IDogJyd9JHtkZWNpbWFsc31gO1xuICByZXR1cm4gcmV0O1xufTtcblxuZXhwb3J0IGRlZmF1bHQge1xuICBmb3JjZUZsb2F0LFxuICBudW1iZXJGb3JtYXR0ZXJcbn07XG5cbiIsIi8qIGVzbGludCBuby1jb25zb2xlOiAwICovXG5cbmNvbnN0IGJ1dHRvbkhlaWdodCA9ICcyNXB4JztcbmNvbnN0IGJ1dHRvblN0YXJ0ID0gJzVweCc7XG5jb25zdCBidXR0b25Ub3AgPSAnNXB4JztcblxubGV0IGNvbnNvbGVNZXNzYWdlcyA9IFtdO1xuY29uc3QgY29uc29sZUxvZyA9IGNvbnNvbGUubG9nLmJpbmQoY29uc29sZSk7XG5jb25zdCBjb25zb2xlT3JpZ2luYWwgPSB7fTtcblxuZnVuY3Rpb24gY2FwdHVyZUNvbnNvbGUoY29uc29sZUVsbSwgb3B0aW9ucykge1xuICBjb25zdCB7IGluZGVudCA9IDIsIHNob3dMYXN0T25seSA9IGZhbHNlIH0gPSBvcHRpb25zO1xuICBjb25zdCBoYW5kbGVyID0gZnVuY3Rpb24gaGFuZGxlcihhY3Rpb24sIC4uLmFyZ3MpIHtcbiAgICBpZiAoc2hvd0xhc3RPbmx5KSB7XG4gICAgICBjb25zb2xlTWVzc2FnZXMgPSBbeyBbYWN0aW9uXTogYXJncyB9XTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZU1lc3NhZ2VzLnB1c2goeyBbYWN0aW9uXTogYXJncyB9KTtcbiAgICB9XG5cbiAgICBjb25zb2xlRWxtLmlubmVySFRNTCA9IGNvbnNvbGVNZXNzYWdlcy5tYXAoKGVudHJ5KSA9PiB7XG4gICAgICBjb25zdCBhY3Rpb24gPSBPYmplY3Qua2V5cyhlbnRyeSlbMF07XG4gICAgICBjb25zdCB2YWx1ZXMgPSBlbnRyeVthY3Rpb25dO1xuICAgICAgY29uc3QgbWVzc2FnZSA9IHZhbHVlcy5tYXAoKGl0ZW0pID0+IHtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICBbdW5kZWZpbmVkLCBudWxsXS5pbmNsdWRlcyhpdGVtKSB8fFxuICAgICAgICAgIFsnbnVtYmVyJywgJ3N0cmluZycsICdmdW5jdGlvbiddLmluY2x1ZGVzKHR5cGVvZiBpdGVtKVxuICAgICAgICApID9cbiAgICAgICAgICBpdGVtIDpcbiAgICAgICAgICBbJ01hcCcsICdTZXQnXS5pbmNsdWRlcyhpdGVtLmNvbnN0cnVjdG9yLm5hbWUpID9cbiAgICAgICAgICAgIGAke2l0ZW0uY29uc3RydWN0b3IubmFtZX0gKCR7SlNPTi5zdHJpbmdpZnkoWy4uLml0ZW1dKX0pYCA6XG4gICAgICAgICAgICBKU09OLnN0cmluZ2lmeShpdGVtLCAoa2V5LCB2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgICBpZiAoKHR5cGVvZiB2YWx1ZSkgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWUudG9TdHJpbmcoKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgICAgICB9LCBpbmRlbnQpO1xuICAgICAgfSkuam9pbignLCAnKTtcblxuICAgICAgY29uc3QgY29sb3IgPSB7XG4gICAgICAgIGxvZzogJyMwMDAnLFxuICAgICAgICB3YXJuOiAnb3JhbmdlJyxcbiAgICAgICAgZXJyb3I6ICdkYXJrcmVkJ1xuICAgICAgfVthY3Rpb25dO1xuXG4gICAgICByZXR1cm4gYDxwcmUgc3R5bGU9XCJjb2xvcjogJHtjb2xvcn1cIj4ke21lc3NhZ2V9PC9wcmU+YDtcbiAgICB9KS5qb2luKCdcXG4nKTtcbiAgfTtcbiAgWydsb2cnLCAnd2FybicsICdlcnJvciddLmZvckVhY2goKGFjdGlvbikgPT4ge1xuICAgIGNvbnNvbGVPcmlnaW5hbFthY3Rpb25dID0gY29uc29sZVthY3Rpb25dO1xuICAgIGNvbnNvbGVbYWN0aW9uXSA9IGhhbmRsZXIuYmluZChjb25zb2xlLCBhY3Rpb24pO1xuICB9KTtcbiAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2Vycm9yJywgKGV2dCkgPT4ge1xuICAgIC8vIGVzbGludCBuby1jb25zb2xlOiAwXG4gICAgY29uc29sZS5lcnJvcihgXCIke2V2dC5tZXNzYWdlfVwiIGZyb20gJHtldnQuZmlsZW5hbWV9OiR7ZXZ0LmxpbmVub31gKTtcbiAgICBjb25zb2xlLmVycm9yKGV2dCwgZXZ0LmVycm9yLnN0YWNrKTtcbiAgICAvLyBldnQucHJldmVudERlZmF1bHQoKTtcbiAgfSk7XG4gIGNvbnNvbGVMb2coJ2NvbnNvbGUgY2FwdHVyZWQnKTtcbiAgcmV0dXJuIGZ1bmN0aW9uIHJlbGVhc2VDb25zb2xlKCkge1xuICAgIFsnbG9nJywgJ3dhcm4nLCAnZXJyb3InXS5mb3JFYWNoKChhY3Rpb24pID0+IHtcbiAgICAgIGNvbnNvbGVbYWN0aW9uXSA9IGNvbnNvbGVPcmlnaW5hbFthY3Rpb25dO1xuICAgIH0pO1xuICAgIGNvbnNvbGVMb2coJ2NvbnNvbGUgcmVsZWFzZWQnKTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gY3JlYXRlQ29uc29sZSh7XG4gIG9wdGlvbnMsXG4gIGNvbnNvbGVTdHlsZToge1xuICAgIGJ0blN0YXJ0ID0gYnV0dG9uU3RhcnQsIGJ0bkhlaWdodCA9IGJ1dHRvbkhlaWdodCxcbiAgICB3aWR0aCA9IGBjYWxjKDEwMHZ3IC0gJHtidG5TdGFydH0gLSAzMHB4KWAsIGhlaWdodCA9ICc0MDBweCcsXG4gICAgYmFja2dyb3VuZCA9ICdyZ2JhKDAsIDAsIDAsIDAuNSknXG4gIH1cbn0pIHtcbiAgY29uc3QgeyBydGwgPSBmYWxzZSB9ID0gb3B0aW9ucztcbiAgY29uc3QgY29uc29sZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICBjb25zb2xlLmlkID0gJ0RCVUlvblNjcmVlbkNvbnNvbGUnO1xuICBjb25zb2xlLnN0eWxlLmNzc1RleHQgPSBgXG4gICAgZGlzcGxheTogYmxvY2s7XG4gICAgbWFyZ2luOiAwcHg7XG4gICAgcGFkZGluZzogNXB4O1xuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgICBvdmVyZmxvdzogYXV0bztcbiAgICB3aWR0aDogJHt3aWR0aH07XG4gICAgaGVpZ2h0OiAke2hlaWdodH07XG4gICAgdG9wOiAke2J0bkhlaWdodH07XG4gICAgJHtydGwgPyAncmlnaHQnIDogJ2xlZnQnfTogMHB4O1xuICAgIGJhY2tncm91bmQ6ICR7YmFja2dyb3VuZH07XG4gICAgei1pbmRleDogOTk5OTtcbiAgICAtd2Via2l0LW92ZXJmbG93LXNjcm9sbGluZzogdG91Y2hcbiAgICBgO1xuICByZXR1cm4gY29uc29sZTtcbn1cblxuZnVuY3Rpb24gY3JlYXRlQnV0dG9uKHtcbiAgb3B0aW9ucyxcbiAgYnV0dG9uU3R5bGU6IHtcbiAgICBwb3NpdGlvbiA9ICdmaXhlZCcsXG4gICAgd2lkdGggPSAnMjVweCcsIGhlaWdodCA9IGJ1dHRvbkhlaWdodCwgdG9wID0gYnV0dG9uVG9wLCBzdGFydCA9IGJ1dHRvblN0YXJ0LFxuICAgIGJhY2tncm91bmQgPSAncmdiYSgwLCAwLCAwLCAwLjUpJ1xuICB9XG59KSB7XG4gIGNvbnN0IHsgcnRsID0gZmFsc2UgfSA9IG9wdGlvbnM7XG4gIGNvbnN0IGJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICBidXR0b24uaWQgPSAnREJVSW9uU2NyZWVuQ29uc29sZVRvZ2dsZXInO1xuICBidXR0b24uc3R5bGUuY3NzVGV4dCA9IGBcbiAgICBwb3NpdGlvbjogJHtwb3NpdGlvbn07XG4gICAgd2lkdGg6ICR7d2lkdGh9O1xuICAgIGhlaWdodDogJHtoZWlnaHR9O1xuICAgIHRvcDogJHt0b3B9O1xuICAgICR7cnRsID8gJ3JpZ2h0JyA6ICdsZWZ0J306ICR7c3RhcnR9O1xuICAgIGJhY2tncm91bmQ6ICR7YmFja2dyb3VuZH07XG4gICAgei1pbmRleDogOTk5OTtcbiAgICBgO1xuICByZXR1cm4gYnV0dG9uO1xufVxuXG4vKipcbm9uU2NyZWVuQ29uc29sZSh7XG4gIGJ1dHRvblN0eWxlID0geyBwb3NpdGlvbiwgd2lkdGgsIGhlaWdodCwgdG9wLCBzdGFydCwgYmFja2dyb3VuZCB9LFxuICBjb25zb2xlU3R5bGUgPSB7IHdpZHRoLCBoZWlnaHQsIGJhY2tncm91bmQgfSxcbiAgb3B0aW9ucyA9IHsgcnRsOiBmYWxzZSwgaW5kZW50LCBzaG93TGFzdE9ubHkgfVxufSlcbiovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBvblNjcmVlbkNvbnNvbGUoe1xuICBidXR0b25TdHlsZSA9IHt9LFxuICBjb25zb2xlU3R5bGUgPSB7fSxcbiAgb3B0aW9ucyA9IHt9XG59ID0ge30pIHtcbiAgY29uc3QgYnV0dG9uID0gY3JlYXRlQnV0dG9uKHtcbiAgICBvcHRpb25zLFxuICAgIGJ1dHRvblN0eWxlXG4gIH0pO1xuICBjb25zdCBjb25zb2xlID0gY3JlYXRlQ29uc29sZSh7XG4gICAgY29uc29sZVN0eWxlOiB7XG4gICAgICAuLi5jb25zb2xlU3R5bGUsXG4gICAgICBidG5IZWlnaHQ6IGJ1dHRvblN0eWxlLmhlaWdodCxcbiAgICAgIGJ0blN0YXJ0OiBidXR0b25TdHlsZS5zdGFydFxuICAgIH0sXG4gICAgb3B0aW9uc1xuICB9KTtcblxuICBjb25zb2xlLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcbiAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICB9KTtcblxuICBidXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xuICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgaWYgKCFidXR0b24uY29udGFpbnMoY29uc29sZSkpIHtcbiAgICAgIGJ1dHRvbi5hcHBlbmRDaGlsZChjb25zb2xlKTtcbiAgICAgIGNvbnNvbGUuc2Nyb2xsVG9wID0gY29uc29sZS5zY3JvbGxIZWlnaHQgLSBjb25zb2xlLmNsaWVudEhlaWdodDtcbiAgICB9IGVsc2Uge1xuICAgICAgYnV0dG9uLnJlbW92ZUNoaWxkKGNvbnNvbGUpO1xuICAgIH1cbiAgfSk7XG5cbiAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChidXR0b24pO1xuICBjb25zdCByZWxlYXNlQ29uc29sZSA9IGNhcHR1cmVDb25zb2xlKGNvbnNvbGUsIG9wdGlvbnMpO1xuXG4gIHJldHVybiBmdW5jdGlvbiByZWxlYXNlKCkge1xuICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQoYnV0dG9uKTtcbiAgICByZWxlYXNlQ29uc29sZSgpO1xuICB9O1xufVxuIiwiLyoqXG4gKiBjb25zdCB0ID0gdGVtcGxhdGVgJHswfSAkezF9ICR7J3R3byd9ICR7J3RocmVlJ31gO1xuICogY29uc3QgdHIgPSB0KCdhJywgJ2InLCB7IHR3bzogJ2MnLCB0aHJlZTogJ2QnIH0pO1xuICogZXhwZWN0KHRyKS50by5lcXVhbCgnYSBiIGMgZCcpO1xuICogQHBhcmFtIHN0cmluZ3NcbiAqIEBwYXJhbSBrZXlzXG4gKiBAcmV0dXJuIHtmdW5jdGlvbiguLi5bKl0pfVxuICovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiB0ZW1wbGF0ZShzdHJpbmdzLCAuLi5rZXlzKSB7XG4gIHJldHVybiAoKC4uLnZhbHVlcykgPT4ge1xuICAgIGNvbnN0IGRpY3QgPSB2YWx1ZXNbdmFsdWVzLmxlbmd0aCAtIDFdIHx8IHt9O1xuICAgIGNvbnN0IHJlc3VsdCA9IFtzdHJpbmdzWzBdXTtcbiAgICBrZXlzLmZvckVhY2goKGtleSwgaSkgPT4ge1xuICAgICAgY29uc3QgdmFsdWUgPSBOdW1iZXIuaXNJbnRlZ2VyKGtleSkgPyB2YWx1ZXNba2V5XSA6IGRpY3Rba2V5XTtcbiAgICAgIHJlc3VsdC5wdXNoKHZhbHVlLCBzdHJpbmdzW2kgKyAxXSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHJlc3VsdC5qb2luKCcnKTtcbiAgfSk7XG59XG4iLCJcbi8vIGltcG9ydCBvblNjcmVlbkNvbnNvbGUgZnJvbSAnLi4vdXRpbHMvb25TY3JlZW5Db25zb2xlJztcblxuY29uc3QgX2Nzc0Rpc2FibGVTZWxlY3Rpb24gPSAobm9kZSkgPT4ge1xuICBub2RlLnN0eWxlLmN1cnNvciA9ICdkZWZhdWx0JztcbiAgbm9kZS5zdHlsZS5Nb3pVc2VyU2VsZWN0ID0gJ25vbmUnO1xuICBub2RlLnN0eWxlLldlYmtpdFVzZXJTZWxlY3QgPSAnbm9uZSc7XG4gIG5vZGUuc3R5bGUuTXNVc2VyU2VsZWN0ID0gJ25vbmUnO1xuICBub2RlLnN0eWxlLnVzZXJTZWxlY3QgPSAnbm9uZSc7XG59O1xuXG5jb25zdCBfY3NzRW5hYmxlU2VsZWN0aW9uID0gKG5vZGUpID0+IHtcbiAgbm9kZS5zdHlsZS5jdXJzb3IgPSAnYXV0byc7XG4gIG5vZGUuc3R5bGUuTW96VXNlclNlbGVjdCA9IG51bGw7XG4gIG5vZGUuc3R5bGUuV2Via2l0VXNlclNlbGVjdCA9IG51bGw7XG4gIG5vZGUuc3R5bGUuTXNVc2VyU2VsZWN0ID0gbnVsbDtcbiAgbm9kZS5zdHlsZS51c2VyU2VsZWN0ID0gbnVsbDtcbn07XG5cbmNvbnN0IF9qc0Rpc2FibGVTZWxlY3Rpb24gPSAobm9kZSkgPT4ge1xuICBub2RlLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIF9raWxsU2VsZWN0aW9uKTtcbiAgbm9kZS5hZGRFdmVudExpc3RlbmVyKCd0b3VjaG1vdmUnLCBfa2lsbFNlbGVjdGlvbik7XG4gIG5vZGUuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIF9lbmFibGVTZWxlY3Rpb24pO1xuICBub2RlLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoZW5kJywgX2VuYWJsZVNlbGVjdGlvbik7XG4gIG5vZGUuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hjYW5jZWwnLCBfZW5hYmxlU2VsZWN0aW9uKTtcbn07XG5cbmNvbnN0IF9qc0VuYWJsZVNlbGVjdGlvbiA9IChub2RlKSA9PiB7XG4gIG5vZGUucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgX2tpbGxTZWxlY3Rpb24pO1xuICBub2RlLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3RvdWNobW92ZScsIF9raWxsU2VsZWN0aW9uKTtcbiAgbm9kZS5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgX2VuYWJsZVNlbGVjdGlvbik7XG4gIG5vZGUucmVtb3ZlRXZlbnRMaXN0ZW5lcigndG91Y2hlbmQnLCBfZW5hYmxlU2VsZWN0aW9uKTtcbiAgbm9kZS5yZW1vdmVFdmVudExpc3RlbmVyKCd0b3VjaGNhbmNlbCcsIF9lbmFibGVTZWxlY3Rpb24pO1xufTtcblxuY29uc3QgX2tpbGxTZWxlY3Rpb24gPSAoZSkgPT4ge1xuICBjb25zdCBub2RlID0gZS50YXJnZXQ7XG4gIGNvbnN0IGRvYyA9IG5vZGUub3duZXJEb2N1bWVudDtcbiAgY29uc3Qgd2luID0gZG9jLmRlZmF1bHRWaWV3O1xuICBzd2l0Y2ggKGUudHlwZSkge1xuICAgIGNhc2UgJ21vdXNlbW92ZSc6XG4gICAgY2FzZSAndG91Y2htb3ZlJzpcbiAgICAgIHdpbi5nZXRTZWxlY3Rpb24gJiYgd2luLmdldFNlbGVjdGlvbigpLnJlbW92ZUFsbFJhbmdlcygpO1xuICAgICAgYnJlYWs7XG4gICAgZGVmYXVsdDpcbiAgICAgIC8vIHBhc3NcbiAgfVxufTtcblxuY29uc3QgX2Rpc2FibGVTZWxlY3Rpb24gPSAoZSkgPT4ge1xuICBjb25zdCBub2RlID0gZS50YXJnZXQ7XG4gIGNvbnN0IGRvYyA9IG5vZGUub3duZXJEb2N1bWVudDtcbiAgY29uc3Qgd2luID0gZG9jLmRlZmF1bHRWaWV3O1xuICAvLyBmaXJzdCBjbGVhciBhbnkgY3VycmVudCBzZWxlY3Rpb25cbiAgd2luLmdldFNlbGVjdGlvbiAmJiB3aW4uZ2V0U2VsZWN0aW9uKCkucmVtb3ZlQWxsUmFuZ2VzKCk7XG4gIC8vIHRoZW4gZGlzYWJsZSBmdXJ0aGVyIHNlbGVjdGlvblxuICAvLyAxLiBieSBzdHlsZVxuICBfY3NzRGlzYWJsZVNlbGVjdGlvbihkb2MuYm9keSk7XG4gIC8vIDIuIGJ5IGFkZGluZyBldmVudCBsaXN0ZW5lcnNcbiAgX2pzRGlzYWJsZVNlbGVjdGlvbihkb2MpO1xufTtcblxuY29uc3QgX2VuYWJsZVNlbGVjdGlvbiA9IChlKSA9PiB7XG4gIGNvbnN0IG5vZGUgPSBlLnRhcmdldDtcbiAgY29uc3QgZG9jID0gbm9kZS5vd25lckRvY3VtZW50O1xuICAvLyBlbmFibGUgZnVydGhlciBzZWxlY3Rpb25cbiAgLy8gMS4gYnkgc3R5bGVcbiAgX2Nzc0VuYWJsZVNlbGVjdGlvbihkb2MuYm9keSk7XG4gIC8vIDIuIGJ5IHJlbW92aW5nIGV2ZW50IGxpc3RlbmVyc1xuICBfanNFbmFibGVTZWxlY3Rpb24oZG9jKTtcbn07XG5cbmNvbnN0IF9oYW5kbGVUYXBTdGFydCA9IChlKSA9PiB7XG4gIC8vIG9uIHRhYmxldCBlLnByZXZlbnREZWZhdWx0KCkgcHJldmVudHNcbiAgLy8gLSBzZWxlY3Rpb24sXG4gIC8vIC0gdGFwLWhpZ2hsaWdodCxcbiAgLy8gLSB0cmlnZ2VyaW5nL2RvdWJsaW5nIGNvcnJlc3BvbmRpbmcgbW91c2UgZXZlbnRzLlxuICBlLnByZXZlbnREZWZhdWx0KCk7IC8vIGNzcyBkb3VibGVkOiAtd2Via2l0LXRhcC1oaWdobGlnaHQtY29sb3I6cmdiYSgwLDAsMCwwKTtcbiAgX2Rpc2FibGVTZWxlY3Rpb24oZSk7XG59O1xuXG5jb25zdCBkaXNhYmxlU2VsZWN0aW9uID0gKG5vZGUpID0+IHtcbiAgLy8gb25TY3JlZW5Db25zb2xlKCk7XG4gIF9jc3NEaXNhYmxlU2VsZWN0aW9uKG5vZGUpO1xuICBub2RlLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCBfaGFuZGxlVGFwU3RhcnQpO1xuICBub2RlLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIF9oYW5kbGVUYXBTdGFydCk7XG59O1xuXG5jb25zdCBlbmFibGVTZWxlY3Rpb24gPSAobm9kZSkgPT4ge1xuICBfY3NzRW5hYmxlU2VsZWN0aW9uKG5vZGUpO1xuICBub2RlLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCBfaGFuZGxlVGFwU3RhcnQpO1xuICBub2RlLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIF9oYW5kbGVUYXBTdGFydCk7XG59O1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIGRpc2FibGVTZWxlY3Rpb24sXG4gIGVuYWJsZVNlbGVjdGlvblxufTtcbiIsIlxuaW1wb3J0IGdldERCVUlXZWJDb21wb25lbnRDb3JlIGZyb20gJy4uL0RCVUlXZWJDb21wb25lbnRDb3JlL0RCVUlXZWJDb21wb25lbnRDb3JlJztcbmltcG9ydCBlbnN1cmVTaW5nbGVSZWdpc3RyYXRpb24gZnJvbSAnLi4vLi4vLi4vaW50ZXJuYWxzL2Vuc3VyZVNpbmdsZVJlZ2lzdHJhdGlvbic7XG5cbmNvbnN0IHJlZ2lzdHJhdGlvbk5hbWUgPSAnZGJ1aS1kdW1teSc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGdldERCVUlEdW1teSh3aW4pIHtcbiAgcmV0dXJuIGVuc3VyZVNpbmdsZVJlZ2lzdHJhdGlvbih3aW4sIHJlZ2lzdHJhdGlvbk5hbWUsICgpID0+IHtcbiAgICBjb25zdCB7XG4gICAgICBEQlVJV2ViQ29tcG9uZW50QmFzZSxcbiAgICAgIGRlZmluZUNvbW1vblN0YXRpY01ldGhvZHMsXG4gICAgICBSZWdpc3RlcmFibGVcbiAgICB9ID0gZ2V0REJVSVdlYkNvbXBvbmVudENvcmUod2luKTtcblxuICAgIGNsYXNzIERCVUlEdW1teSBleHRlbmRzIERCVUlXZWJDb21wb25lbnRCYXNlIHtcblxuICAgICAgc3RhdGljIGdldCByZWdpc3RyYXRpb25OYW1lKCkge1xuICAgICAgICByZXR1cm4gcmVnaXN0cmF0aW9uTmFtZTtcbiAgICAgIH1cblxuICAgICAgc3RhdGljIGdldCB0ZW1wbGF0ZUlubmVySFRNTCgpIHtcbiAgICAgICAgcmV0dXJuIGBcbiAgICAgICAgICA8c3R5bGU+XG4gICAgICAgICAgOmhvc3Qge1xuICAgICAgICAgICAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xuICAgICAgICAgICAgd2lkdGg6IDEwMCU7XG4gICAgICAgICAgICBtYXgtd2lkdGg6IDQwMHB4O1xuICAgICAgICAgICAgaGVpZ2h0OiB2YXIoLS1kYnVpLWlucHV0LWhlaWdodCwgNTBweCk7XG4gICAgICAgICAgICBjb2xvcjogbWFyb29uO1xuICAgICAgICAgICAgYm9yZGVyOiAxcHggc29saWQgZ3JheTtcbiAgICAgICAgICAgIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XG4gICAgICAgICAgfVxuICAgICAgICAgIFxuICAgICAgICAgIDpob3N0IGIsIDpob3N0IGRpdlt4LWhhcy1zbG90XSBzcGFuW3gtc2xvdC13cmFwcGVyXSB7XG4gICAgICAgICAgICB1bmljb2RlLWJpZGk6IGJpZGktb3ZlcnJpZGU7XG4gICAgICAgICAgICB0ZXh0LXNoYWRvdzogdmFyKC0tZHVtbXktYi10ZXh0LXNoYWRvdywgbm9uZSk7XG4gICAgICAgICAgfVxuICAgIFxuICAgICAgICAgIDpob3N0KFtkaXI9cnRsXSkgYiB7XG4gICAgICAgICAgICB0ZXh0LWRlY29yYXRpb246IHVuZGVybGluZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgXG4gICAgICAgICAgOmhvc3QoW2Rpcj1sdHJdKSBiIHtcbiAgICAgICAgICAgIHRleHQtZGVjb3JhdGlvbjogb3ZlcmxpbmU7XG4gICAgICAgICAgfVxuICAgIFxuICAgICAgICAgIDpob3N0KFtkaXI9bHRyXSkgI2NvbnRhaW5lciA+IGRpdltkaXI9cnRsXSxcbiAgICAgICAgICA6aG9zdChbZGlyPXJ0bF0pICNjb250YWluZXIgPiBkaXZbZGlyPWx0cl0ge1xuICAgICAgICAgICAgZGlzcGxheTogbm9uZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgXG4gICAgICAgICAgOmhvc3QgI2NvbnRhaW5lciA+IGRpdlt4LWhhcy1zbG90XSB7XG4gICAgICAgICAgICBtYXJnaW4tbGVmdDogMHB4O1xuICAgICAgICAgIH1cbiAgICAgICAgICBcbiAgICAgICAgICAjY29udGFpbmVyIHtcbiAgICAgICAgICAgIHdpZHRoOiAxMDAlO1xuICAgICAgICAgICAgaGVpZ2h0OiAxMDAlO1xuICAgICAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgICAgIGZsZXgtZmxvdzogcm93IG5vd3JhcDtcbiAgICAgICAgICAgIGFsaWduLWl0ZW1zOiBzdHJldGNoO1xuICAgICAgICAgIH1cbiAgICAgICAgICBcbiAgICAgICAgICAjY29udGFpbmVyID4gZGl2IHtcbiAgICAgICAgICAgIGJvcmRlcjogMXB4IHNvbGlkIGdyYXk7XG4gICAgICAgICAgICBib3JkZXItcmFkaXVzOiB2YXIoLS1kdW1teS1pbm5lci1zZWN0aW9ucy1ib3JkZXItcmFkaXVzLCAwcHgpO1xuICAgICAgICAgICAgZmxleDogMSAwIDAlO1xuICAgICAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgICAgIG1hcmdpbjogNXB4O1xuICAgICAgICAgIH1cbiAgICAgICAgICBcbiAgICAgICAgICAjY29udGFpbmVyID4gZGl2ID4gZGl2IHtcbiAgICAgICAgICAgIG1hcmdpbjogYXV0bztcbiAgICAgICAgICB9XG4gICAgICAgICAgXG4gICAgICAgICAgPC9zdHlsZT5cbiAgICAgICAgICBcbiAgICAgICAgICA8ZGl2IGlkPVwiY29udGFpbmVyXCI+XG4gICAgICAgICAgICA8ZGl2IGRpcj1cImx0clwiPlxuICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgIDxiPkR1bW15IHNoYWRvdzwvYj4gW0xUUl1cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgPGRpdiB4LWhhcy1zbG90PlxuICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgIDxzcGFuPls8L3NwYW4+PHNwYW4geC1zbG90LXdyYXBwZXI+PHNsb3Q+PC9zbG90Pjwvc3Bhbj48c3Bhbj5dPC9zcGFuPlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgXG4gICAgICAgICAgICA8ZGl2IGRpcj1cInJ0bFwiPlxuICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgIDxiPkR1bW15IHNoYWRvdzwvYj4gW1JUTF1cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgYDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gUmVnaXN0ZXJhYmxlKFxuICAgICAgZGVmaW5lQ29tbW9uU3RhdGljTWV0aG9kcyhcbiAgICAgICAgREJVSUR1bW15XG4gICAgICApXG4gICAgKTtcbiAgfSk7XG59XG5cbmdldERCVUlEdW1teS5yZWdpc3RyYXRpb25OYW1lID0gcmVnaXN0cmF0aW9uTmFtZTtcblxuIiwiXG5cbmltcG9ydCBnZXREQlVJV2ViQ29tcG9uZW50Q29yZSBmcm9tICcuLi9EQlVJV2ViQ29tcG9uZW50Q29yZS9EQlVJV2ViQ29tcG9uZW50Q29yZSc7XG5pbXBvcnQgZ2V0REJVSUR1bW15IGZyb20gJy4uL0RCVUlEdW1teS9EQlVJRHVtbXknO1xuaW1wb3J0IGVuc3VyZVNpbmdsZVJlZ2lzdHJhdGlvbiBmcm9tICcuLi8uLi8uLi9pbnRlcm5hbHMvZW5zdXJlU2luZ2xlUmVnaXN0cmF0aW9uJztcblxuY29uc3QgcmVnaXN0cmF0aW9uTmFtZSA9ICdkYnVpLWR1bW15LXBhcmVudCc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGdldERCVUlEdW1teVBhcmVudCh3aW4pIHtcbiAgcmV0dXJuIGVuc3VyZVNpbmdsZVJlZ2lzdHJhdGlvbih3aW4sIHJlZ2lzdHJhdGlvbk5hbWUsICgpID0+IHtcbiAgICBjb25zdCB7XG4gICAgICBEQlVJV2ViQ29tcG9uZW50QmFzZSxcbiAgICAgIGRlZmluZUNvbW1vblN0YXRpY01ldGhvZHMsXG4gICAgICBSZWdpc3RlcmFibGVcbiAgICB9ID0gZ2V0REJVSVdlYkNvbXBvbmVudENvcmUod2luKTtcbiAgICBjb25zdCBEQlVJRHVtbXkgPSBnZXREQlVJRHVtbXkod2luKTtcblxuICAgIGNsYXNzIERCVUlEdW1teVBhcmVudCBleHRlbmRzIERCVUlXZWJDb21wb25lbnRCYXNlIHtcblxuICAgICAgc3RhdGljIGdldCByZWdpc3RyYXRpb25OYW1lKCkge1xuICAgICAgICByZXR1cm4gcmVnaXN0cmF0aW9uTmFtZTtcbiAgICAgIH1cblxuICAgICAgc3RhdGljIGdldCB0ZW1wbGF0ZUlubmVySFRNTCgpIHtcbiAgICAgICAgcmV0dXJuIGBcbiAgICAgICAgICA8c3R5bGU+XG4gICAgICAgICAgOmhvc3Qge1xuICAgICAgICAgICAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xuICAgICAgICAgICAgd2lkdGg6IDEwMCU7XG4gICAgICAgICAgICBtYXgtd2lkdGg6IDQwMHB4O1xuICAgICAgICAgIH1cbiAgICAgICAgICA8L3N0eWxlPlxuICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICA8Yj5EdW1teSBQYXJlbnQgc2hhZG93PC9iPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICA8ZGJ1aS1kdW1teT48c2xvdD48L3Nsb3Q+PC9kYnVpLWR1bW15PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIGA7XG4gICAgICB9XG5cbiAgICAgIHN0YXRpYyBnZXQgZGVwZW5kZW5jaWVzKCkge1xuICAgICAgICByZXR1cm4gW0RCVUlEdW1teV07XG4gICAgICB9XG5cbiAgICB9XG5cbiAgICByZXR1cm4gUmVnaXN0ZXJhYmxlKFxuICAgICAgZGVmaW5lQ29tbW9uU3RhdGljTWV0aG9kcyhcbiAgICAgICAgREJVSUR1bW15UGFyZW50XG4gICAgICApXG4gICAgKTtcbiAgfSk7XG59XG5cbmdldERCVUlEdW1teVBhcmVudC5yZWdpc3RyYXRpb25OYW1lID0gcmVnaXN0cmF0aW9uTmFtZTtcblxuIiwiXG4vKiBlc2xpbnQgbWF4LWxlbjogMCAqL1xuXG5pbXBvcnQgZ2V0REJVSVdlYkNvbXBvbmVudENvcmUgZnJvbSAnLi4vREJVSVdlYkNvbXBvbmVudENvcmUvREJVSVdlYkNvbXBvbmVudENvcmUnO1xuaW1wb3J0IGVuc3VyZVNpbmdsZVJlZ2lzdHJhdGlvbiBmcm9tICcuLi8uLi8uLi9pbnRlcm5hbHMvZW5zdXJlU2luZ2xlUmVnaXN0cmF0aW9uJztcbmltcG9ydCBGb2N1c2FibGUgZnJvbSAnLi4vLi4vZGVjb3JhdG9ycy9Gb2N1c2FibGUnO1xuXG5jb25zdCByZWdpc3RyYXRpb25OYW1lID0gJ2RidWktZm9ybS1pbnB1dC10ZXh0JztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZ2V0REJVSUZvcm1JbnB1dFRleHQod2luKSB7XG4gIHJldHVybiBlbnN1cmVTaW5nbGVSZWdpc3RyYXRpb24od2luLCByZWdpc3RyYXRpb25OYW1lLCAoKSA9PiB7XG4gICAgY29uc3Qge1xuICAgICAgREJVSVdlYkNvbXBvbmVudEJhc2UsXG4gICAgICBkZWZpbmVDb21tb25TdGF0aWNNZXRob2RzLFxuICAgICAgUmVnaXN0ZXJhYmxlXG4gICAgfSA9IGdldERCVUlXZWJDb21wb25lbnRDb3JlKHdpbik7XG5cbiAgICBjbGFzcyBEQlVJRm9ybUlucHV0VGV4dCBleHRlbmRzIERCVUlXZWJDb21wb25lbnRCYXNlIHtcblxuICAgICAgc3RhdGljIGdldCByZWdpc3RyYXRpb25OYW1lKCkge1xuICAgICAgICByZXR1cm4gcmVnaXN0cmF0aW9uTmFtZTtcbiAgICAgIH1cblxuICAgICAgc3RhdGljIGdldCB0ZW1wbGF0ZUlubmVySFRNTCgpIHtcbiAgICAgICAgLy8gbm9pbnNwZWN0aW9uIENzc1VucmVzb2x2ZWRDdXN0b21Qcm9wZXJ0eVxuICAgICAgICByZXR1cm4gYFxuICAgICAgICAgIDxzdHlsZT5cbiAgICAgICAgICA6aG9zdCB7XG4gICAgICAgICAgICBhbGw6IGluaXRpYWw7IFxuICAgICAgICAgICAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xuICAgICAgICAgICAgd2lkdGg6IDEwMCU7XG4gICAgICAgICAgICAvKmhlaWdodDogdmFyKC0tZGJ1aS1mb3JtLWlucHV0LWhlaWdodCk7Ki9cbiAgICAgICAgICAgIC8qbGluZS1oZWlnaHQ6IHZhcigtLWRidWktZm9ybS1pbnB1dC1oZWlnaHQpOyovXG4gICAgICAgICAgICBoZWlnaHQ6IDMwMHB4O1xuICAgICAgICAgICAgcGFkZGluZzogMHB4O1xuICAgICAgICAgICAgZm9udC1zaXplOiAxOHB4O1xuICAgICAgICAgICAgY29sb3I6IHZhcigtLWRidWktZm9ybS1pbnB1dC1jb2xvcik7XG4gICAgICAgICAgICAvKmJhY2tncm91bmQtY29sb3I6IHZhcigtLWRidWktZm9ybS1pbnB1dC1iYWNrZ3JvdW5kLWNvbG9yKTsqL1xuICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgyNTUsIDEwMCwgMCwgMC4xKTtcbiAgICAgICAgICAgIHVuaWNvZGUtYmlkaTogYmlkaS1vdmVycmlkZTtcbiAgICAgICAgICAgIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XG4gICAgICAgICAgICBib3JkZXI6IG5vbmU7XG4gICAgICAgICAgICBib3JkZXItYm90dG9tOiB2YXIoLS1kYnVpLWZvcm0taW5wdXQtYm9yZGVyLXdpZHRoKSB2YXIoLS1kYnVpLWZvcm0taW5wdXQtYm9yZGVyLXN0eWxlKSB2YXIoLS1kYnVpLWZvcm0taW5wdXQtYm9yZGVyLWNvbG9yKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgXG4gICAgICAgICAgOmhvc3QgW3RhYmluZGV4XSB7XG4gICAgICAgICAgICB3aWR0aDogMTAwJTtcbiAgICAgICAgICAgIGhlaWdodDogNTBweDtcbiAgICAgICAgICAgIGxpbmUtaGVpZ2h0OiA1MHB4O1xuICAgICAgICAgICAgYm9yZGVyOiBub25lO1xuICAgICAgICAgICAgbWFyZ2luOiAwcHg7XG4gICAgICAgICAgICBwYWRkaW5nOiAwcHg7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiB0cmFuc3BhcmVudDtcbiAgICAgICAgICAgIGJvcmRlci1yYWRpdXM6IDBweDtcbiAgICAgICAgICAgIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XG4gICAgICAgICAgICB1bmljb2RlLWJpZGk6IGJpZGktb3ZlcnJpZGU7XG4gICAgICAgICAgfVxuICAgICAgICAgIFxuICAgICAgICAgIDpob3N0IFt0YWJpbmRleF06Zm9jdXMge1xuICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgyNTUsIDAsIDAsIC4zKTtcbiAgICAgICAgICAgIG91dGxpbmU6IG5vbmU7XG4gICAgICAgICAgfVxuICAgIFxuICAgICAgICAgIDpob3N0KFtmb2N1c2VkXSkge1xuICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgwLCAyNTUsIDAsIC4zKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgXG4gICAgICAgICAgLyo6aG9zdChbZGlzYWJsZWRdKSB7Ki9cbiAgICAgICAgICAgIC8qYmFja2dyb3VuZC1jb2xvcjogcmdiYSgwLCAwLCAwLCAuMyk7Ki9cbiAgICAgICAgICAvKn0qL1xuICAgIFxuICAgICAgICAgIDpob3N0KFtoaWRkZW5dKSB7XG4gICAgICAgICAgICBkaXNwbGF5OiBub25lO1xuICAgICAgICAgIH1cbiAgICBcbiAgICAgICAgICA6aG9zdChbZGlyPXJ0bF0pIHtcbiAgICAgICAgICBcbiAgICAgICAgICB9XG4gICAgICAgICAgXG4gICAgICAgICAgOmhvc3QoW2Rpcj1sdHJdKSB7XG4gICAgICAgICAgXG4gICAgICAgICAgfVxuICAgICAgICAgIDwvc3R5bGU+XG4gICAgICAgICAgPHA+REJVSUZvcm1JbnB1dFRleHQ8L3A+XG4gICAgICAgICAgPGRpdiBjb250ZW50ZWRpdGFibGU9XCJ0cnVlXCIgdGFiaW5kZXg9XCIwXCI+PC9kaXY+XG4gICAgICAgICAgPGRpdiBjb250ZW50ZWRpdGFibGU9XCJ0cnVlXCIgdGFiaW5kZXg9XCIwXCI+PC9kaXY+XG4gICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgdGFiaW5kZXg9XCIwXCIgLz5cbiAgICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiB0YWJpbmRleD1cIjBcIiAvPlxuICAgICAgICBgO1xuICAgICAgfVxuXG4gICAgICBzdGF0aWMgZ2V0IGF0dHJpYnV0ZXNUb0RlZmluZSgpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICByb2xlOiAnZm9ybS1pbnB1dCdcbiAgICAgICAgfTtcbiAgICAgIH1cblxuICAgIH1cblxuICAgIHJldHVybiBSZWdpc3RlcmFibGUoXG4gICAgICBGb2N1c2FibGUoXG4gICAgICAgIGRlZmluZUNvbW1vblN0YXRpY01ldGhvZHMoXG4gICAgICAgICAgREJVSUZvcm1JbnB1dFRleHRcbiAgICAgICAgKVxuICAgICAgKVxuICAgICk7XG5cbiAgfSk7XG59XG5cbmdldERCVUlGb3JtSW5wdXRUZXh0LnJlZ2lzdHJhdGlvbk5hbWUgPSByZWdpc3RyYXRpb25OYW1lO1xuXG4iLCJcbmltcG9ydCBnZXREQlVJV2ViQ29tcG9uZW50Q29yZSBmcm9tICcuLi9EQlVJV2ViQ29tcG9uZW50Q29yZS9EQlVJV2ViQ29tcG9uZW50Q29yZSc7XG5pbXBvcnQgZW5zdXJlU2luZ2xlUmVnaXN0cmF0aW9uIGZyb20gJy4uLy4uLy4uL2ludGVybmFscy9lbnN1cmVTaW5nbGVSZWdpc3RyYXRpb24nO1xuXG5jb25zdCByZWdpc3RyYXRpb25OYW1lID0gJ2RidWktaWNvbic7XG5cbi8vIGh0dHBzOi8vZ2l0aHViLmNvbS9nb3JhbmdhamljL3JlYWN0LWljb24tYmFzZS9ibG9iL21hc3Rlci9pbmRleC5qc1xuLy8gaHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tL2dvcmFuZ2FqaWMvcmVhY3QtaWNvbnMvbWFzdGVyL2ljb25zL2dvL21hcmstZ2l0aHViLnN2Z1xuLy8gaHR0cHM6Ly9naXRodWIuY29tL2dvcmFuZ2FqaWMvcmVhY3QtaWNvbnNcbi8vIGh0dHBzOi8vZ2l0aHViLmNvbS9nb3JhbmdhamljL3JlYWN0LWljb25zL2Jsb2IvbWFzdGVyL2dvL21hcmstZ2l0aHViLmpzXG4vLyBodHRwczovL2dvcmFuZ2FqaWMuZ2l0aHViLmlvL3JlYWN0LWljb25zL2dvLmh0bWxcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZ2V0REJVSUljb24od2luKSB7XG4gIHJldHVybiBlbnN1cmVTaW5nbGVSZWdpc3RyYXRpb24od2luLCByZWdpc3RyYXRpb25OYW1lLCAoKSA9PiB7XG4gICAgY29uc3Qge1xuICAgICAgREJVSVdlYkNvbXBvbmVudEJhc2UsXG4gICAgICBkZWZpbmVDb21tb25TdGF0aWNNZXRob2RzLFxuICAgICAgUmVnaXN0ZXJhYmxlXG4gICAgfSA9IGdldERCVUlXZWJDb21wb25lbnRDb3JlKHdpbik7XG5cbiAgICBjbGFzcyBEQlVJSWNvbiBleHRlbmRzIERCVUlXZWJDb21wb25lbnRCYXNlIHtcblxuICAgICAgc3RhdGljIGdldCByZWdpc3RyYXRpb25OYW1lKCkge1xuICAgICAgICByZXR1cm4gcmVnaXN0cmF0aW9uTmFtZTtcbiAgICAgIH1cblxuICAgICAgc3RhdGljIGdldCB0ZW1wbGF0ZUlubmVySFRNTCgpIHtcbiAgICAgICAgcmV0dXJuIGBcbiAgICAgICAgICA8c3R5bGU+XG4gICAgICAgICAgOmhvc3Qge1xuICAgICAgICAgICAgYWxsOiBpbml0aWFsO1xuICAgICAgICAgICAgZm9udC1zaXplOiBpbmhlcml0OyBcbiAgICAgICAgICAgIGRpc3BsYXk6IGlubGluZS1ibG9jaztcbiAgICAgICAgICAgIHdpZHRoOiAxZW07XG4gICAgICAgICAgICBoZWlnaHQ6IDFlbTtcbiAgICAgICAgICAgIHZlcnRpY2FsLWFsaWduOiBtaWRkbGU7XG4gICAgICAgICAgICBjb2xvcjogaW5oZXJpdDtcbiAgICAgICAgICB9XG4gICAgICAgICAgOmhvc3Qgc3ZnIHtcbiAgICAgICAgICAgIGRpc3BsYXk6IGlubGluZS1ibG9jaztcbiAgICAgICAgICAgIHdpZHRoOiAxZW07XG4gICAgICAgICAgICBoZWlnaHQ6IDFlbTtcbiAgICAgICAgICAgIHZlcnRpY2FsLWFsaWduOiB0b3A7XG4gICAgICAgICAgICBmaWxsOiBjdXJyZW50Q29sb3I7XG4gICAgICAgICAgfVxuICAgICAgICAgIDwvc3R5bGU+XG4gICAgICAgICAgPHN2ZyB2aWV3Qm94PVwiMCAwIDQwIDQwXCIgIHByZXNlcnZlQXNwZWN0UmF0aW89XCJ4TWlkWU1pZCBtZWV0XCIgPlxuICAgICAgICAgICAgPGc+PHBhdGggZD1cIlwiLz48L2c+XG4gICAgICAgICAgPC9zdmc+XG4gICAgICAgIGA7XG4gICAgICB9XG5cbiAgICAgIHN0YXRpYyBnZXQgcHJvcGVydGllc1RvVXBncmFkZSgpIHtcbiAgICAgICAgY29uc3QgaW5oZXJpdGVkUHJvcGVydGllc1RvVXBncmFkZSA9IHN1cGVyLnByb3BlcnRpZXNUb1VwZ3JhZGUgfHwgW107XG4gICAgICAgIHJldHVybiBbLi4uaW5oZXJpdGVkUHJvcGVydGllc1RvVXBncmFkZSwgJ3NoYXBlJ107XG4gICAgICB9XG5cbiAgICAgIHN0YXRpYyBnZXQgb2JzZXJ2ZWRBdHRyaWJ1dGVzKCkge1xuICAgICAgICBjb25zdCBpbmhlcml0ZWRPYnNlcnZlZEF0dHJpYnV0ZXMgPSBzdXBlci5vYnNlcnZlZEF0dHJpYnV0ZXMgfHwgW107XG4gICAgICAgIHJldHVybiBbLi4uaW5oZXJpdGVkT2JzZXJ2ZWRBdHRyaWJ1dGVzLCAnc2hhcGUnXTtcbiAgICAgIH1cblxuICAgICAgZ2V0IHNoYXBlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXRBdHRyaWJ1dGUoJ3NoYXBlJyk7XG4gICAgICB9XG5cbiAgICAgIHNldCBzaGFwZSh2YWx1ZSkge1xuICAgICAgICBjb25zdCBoYXNWYWx1ZSA9ICFbdW5kZWZpbmVkLCBudWxsXS5pbmNsdWRlcyh2YWx1ZSk7XG4gICAgICAgIGNvbnN0IHN0cmluZ1ZhbHVlID0gU3RyaW5nKHZhbHVlKTtcbiAgICAgICAgaWYgKGhhc1ZhbHVlKSB7XG4gICAgICAgICAgdGhpcy5zZXRBdHRyaWJ1dGUoJ3NoYXBlJywgc3RyaW5nVmFsdWUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMucmVtb3ZlQXR0cmlidXRlKCdzaGFwZScpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjayhuYW1lLCBvbGRWYWx1ZSwgbmV3VmFsdWUpIHtcbiAgICAgICAgc3VwZXIuYXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrICYmXG4gICAgICAgICAgc3VwZXIuYXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrKG5hbWUsIG9sZFZhbHVlLCBuZXdWYWx1ZSk7XG5cbiAgICAgICAgY29uc3QgaGFzVmFsdWUgPSAhW3VuZGVmaW5lZCwgbnVsbF0uaW5jbHVkZXMobmV3VmFsdWUpO1xuICAgICAgICBpZiAobmFtZSA9PT0gJ3NoYXBlJykge1xuICAgICAgICAgIGhhc1ZhbHVlID8gdGhpcy5fc2V0U2hhcGUoKSA6IHRoaXMuX3JlbW92ZVNoYXBlKCk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgX3NldFNoYXBlKCkge1xuICAgICAgICBjb25zdCBwYXRoID0gdGhpcy5zaGFkb3dSb290LnF1ZXJ5U2VsZWN0b3IoJ3N2ZyBnIHBhdGgnKTtcbiAgICAgICAgcGF0aC5zZXRBdHRyaWJ1dGUoJ2QnLCB0aGlzLnNoYXBlKTtcbiAgICAgIH1cblxuICAgICAgX3JlbW92ZVNoYXBlKCkge1xuICAgICAgICBjb25zdCBwYXRoID0gdGhpcy5zaGFkb3dSb290LnF1ZXJ5U2VsZWN0b3IoJ3N2ZyBnIHBhdGgnKTtcbiAgICAgICAgcGF0aC5zZXRBdHRyaWJ1dGUoJ2QnLCAnJyk7XG4gICAgICB9XG5cbiAgICB9XG5cbiAgICByZXR1cm4gUmVnaXN0ZXJhYmxlKFxuICAgICAgZGVmaW5lQ29tbW9uU3RhdGljTWV0aG9kcyhcbiAgICAgICAgREJVSUljb25cbiAgICAgIClcbiAgICApO1xuXG4gIH0pO1xufVxuXG5nZXREQlVJSWNvbi5yZWdpc3RyYXRpb25OYW1lID0gcmVnaXN0cmF0aW9uTmFtZTtcblxuIiwiXG5pbXBvcnQgZ2V0REJVSVdlYkNvbXBvbmVudENvcmUgZnJvbSAnLi4vREJVSVdlYkNvbXBvbmVudENvcmUvREJVSVdlYkNvbXBvbmVudENvcmUnO1xuaW1wb3J0IGVuc3VyZVNpbmdsZVJlZ2lzdHJhdGlvbiBmcm9tICcuLi8uLi8uLi9pbnRlcm5hbHMvZW5zdXJlU2luZ2xlUmVnaXN0cmF0aW9uJztcbmltcG9ydCBnZXREQlVJSTE4blNlcnZpY2UgZnJvbSAnLi4vLi4vLi4vc2VydmljZXMvREJVSUkxOG5TZXJ2aWNlJztcblxuY29uc3QgSU5URVJQT0xBVElPTl9BVFRSX1BSRUZJWCA9ICdtZXNzYWdlLSc7XG5cbmNvbnN0IHJlZ2lzdHJhdGlvbk5hbWUgPSAnZGJ1aS10cmFuc2xhdGVkJztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZ2V0REJVSVRyYW5zbGF0ZWQod2luKSB7XG4gIHJldHVybiBlbnN1cmVTaW5nbGVSZWdpc3RyYXRpb24od2luLCByZWdpc3RyYXRpb25OYW1lLCAoKSA9PiB7XG4gICAgY29uc3Qge1xuICAgICAgREJVSVdlYkNvbXBvbmVudEJhc2UsXG4gICAgICBkZWZpbmVDb21tb25TdGF0aWNNZXRob2RzLFxuICAgICAgUmVnaXN0ZXJhYmxlXG4gICAgfSA9IGdldERCVUlXZWJDb21wb25lbnRDb3JlKHdpbik7XG5cbiAgICBjb25zdCBpMThuU2VydmljZSA9IGdldERCVUlJMThuU2VydmljZSh3aW4pO1xuXG4gICAgY2xhc3MgREJVSVRyYW5zbGF0ZWQgZXh0ZW5kcyBEQlVJV2ViQ29tcG9uZW50QmFzZSB7XG5cbiAgICAgIHN0YXRpYyBnZXQgcmVnaXN0cmF0aW9uTmFtZSgpIHtcbiAgICAgICAgcmV0dXJuIHJlZ2lzdHJhdGlvbk5hbWU7XG4gICAgICB9XG5cbiAgICAgIHN0YXRpYyBnZXQgdGVtcGxhdGVJbm5lckhUTUwoKSB7XG4gICAgICAgIHJldHVybiBgXG4gICAgICAgICAgPHN0eWxlPlxuICAgICAgICAgIDpob3N0IHtcbiAgICAgICAgICAgIGRpc3BsYXk6IGlubGluZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgPC9zdHlsZT5cbiAgICAgICAgICA8c3Bhbj48L3NwYW4+XG4gICAgICAgIGA7XG4gICAgICB9XG5cbiAgICAgIHN0YXRpYyBnZXQgb2JzZXJ2ZWRBdHRyaWJ1dGVzKCkge1xuICAgICAgICByZXR1cm4gWy4uLnN1cGVyLm9ic2VydmVkQXR0cmlidXRlcywgJ21lc3NhZ2UnLCAnZGJ1aS1sYW5nJ107XG4gICAgICB9XG5cbiAgICAgIGdldCBvYnNlcnZlZER5bmFtaWNBdHRyaWJ1dGVzKCkge1xuICAgICAgICByZXR1cm4gWy4uLnN1cGVyLm9ic2VydmVkRHluYW1pY0F0dHJpYnV0ZXMsIC4uLnRoaXMuX2ludGVycG9sYXRpb25BdHRyaWJ1dGVzTmFtZXNdO1xuICAgICAgfVxuXG4gICAgICBnZXQgaGFzRHluYW1pY0F0dHJpYnV0ZXMoKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuXG4gICAgICBnZXQgX21lc3NhZ2UoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldEF0dHJpYnV0ZSgnbWVzc2FnZScpO1xuICAgICAgfVxuXG4gICAgICBnZXQgX2N1cnJlbnRMYW5nKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXRBdHRyaWJ1dGUoJ2RidWktbGFuZycpO1xuICAgICAgfVxuXG4gICAgICBnZXQgX2N1cnJlbnRMYW5nVHJhbnNsYXRpb25zKCkge1xuICAgICAgICByZXR1cm4gaTE4blNlcnZpY2UudHJhbnNsYXRpb25zW3RoaXMuX2N1cnJlbnRMYW5nXSB8fCB7fTtcbiAgICAgIH1cblxuICAgICAgZ2V0IF90ZW1wbGF0ZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2N1cnJlbnRMYW5nVHJhbnNsYXRpb25zW3RoaXMuX21lc3NhZ2VdIHx8ICgoKSA9PiAnW1RyYW5zbGF0ZWRdJyk7XG4gICAgICB9XG5cbiAgICAgIGdldCBfaW50ZXJwb2xhdGlvbkF0dHJpYnV0ZXMoKSB7XG4gICAgICAgIC8vIG5vaW5zcGVjdGlvbiBKU0NoZWNrRnVuY3Rpb25TaWduYXR1cmVzXG4gICAgICAgIHJldHVybiBBcnJheS5mcm9tKHRoaXMuYXR0cmlidXRlcylcbiAgICAgICAgICAuZmlsdGVyKChhdHRyKSA9PiBhdHRyLm5hbWUuc3RhcnRzV2l0aChJTlRFUlBPTEFUSU9OX0FUVFJfUFJFRklYKSk7XG4gICAgICB9XG5cbiAgICAgIGdldCBfaW50ZXJwb2xhdGlvbkF0dHJpYnV0ZXNOYW1lcygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2ludGVycG9sYXRpb25BdHRyaWJ1dGVzLm1hcCgoYXR0cikgPT4gYXR0ci5uYW1lKTtcbiAgICAgIH1cblxuICAgICAgZ2V0IF9pbnRlcnBvbGF0aW9ucygpIHtcbiAgICAgICAgLy8gbm9pbnNwZWN0aW9uIEpTQ2hlY2tGdW5jdGlvblNpZ25hdHVyZXNcbiAgICAgICAgcmV0dXJuIHRoaXMuX2ludGVycG9sYXRpb25BdHRyaWJ1dGVzXG4gICAgICAgICAgLnJlZHVjZSgoYWNjLCBhdHRyKSA9PiB7XG4gICAgICAgICAgICBhY2NbYXR0ci5uYW1lLnNsaWNlKElOVEVSUE9MQVRJT05fQVRUUl9QUkVGSVgubGVuZ3RoKV0gPSBhdHRyLnZhbHVlO1xuICAgICAgICAgICAgcmV0dXJuIGFjYztcbiAgICAgICAgICB9LCB7fSk7XG4gICAgICB9XG5cblxuICAgICAgX3VwZGF0ZVRyYW5zbGF0aW9uKCkge1xuICAgICAgICBjb25zdCBpbnRlcnBvbGF0aW9ucyA9IHRoaXMuX2ludGVycG9sYXRpb25zO1xuICAgICAgICBjb25zdCBhcmdzID0gW107XG4gICAgICAgIGNvbnN0IGt3YXJncyA9IHt9O1xuXG4gICAgICAgIE9iamVjdC5rZXlzKGludGVycG9sYXRpb25zKS5mb3JFYWNoKChrZXkpID0+IHtcbiAgICAgICAgICBOdW1iZXIuaXNJbnRlZ2VyKE51bWJlcihrZXkpKSA/XG4gICAgICAgICAgICBhcmdzLnB1c2goaW50ZXJwb2xhdGlvbnNba2V5XSkgOlxuICAgICAgICAgICAgKGt3YXJnc1trZXldID0gaW50ZXJwb2xhdGlvbnNba2V5XSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuc2hhZG93Um9vdC5xdWVyeVNlbGVjdG9yKCdzcGFuJykuaW5uZXJIVE1MID1cbiAgICAgICAgICB0aGlzLl90ZW1wbGF0ZSguLi5hcmdzLCBrd2FyZ3MpO1xuICAgICAgfVxuXG4gICAgICBvbkNvbm5lY3RlZENhbGxiYWNrKCkge1xuICAgICAgICB0aGlzLl91cGRhdGVUcmFuc2xhdGlvbigpO1xuICAgICAgfVxuXG4gICAgICBvbkF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjaygpIHtcbiAgICAgICAgdGhpcy5fdXBkYXRlVHJhbnNsYXRpb24oKTtcbiAgICAgIH1cblxuICAgIH1cblxuICAgIHJldHVybiBSZWdpc3RlcmFibGUoXG4gICAgICBkZWZpbmVDb21tb25TdGF0aWNNZXRob2RzKFxuICAgICAgICBEQlVJVHJhbnNsYXRlZFxuICAgICAgKVxuICAgICk7XG4gIH0pO1xufVxuXG5nZXREQlVJVHJhbnNsYXRlZC5yZWdpc3RyYXRpb25OYW1lID0gcmVnaXN0cmF0aW9uTmFtZTtcblxuIiwiXG5jb25zdCBEQlVJQ29tbW9uQ3NzVmFycyA9IGBcbiAgOnJvb3Qge1xuICAgIC0tZGJ1aS1nbG9iYWwtYm9yZGVyLXJhZGl1czogNXB4O1xuICAgIC0tZGJ1aS1mb3JtLWlucHV0LWhlaWdodDogMzBweDtcbiAgICAtLWRidWktZm9ybS1pbnB1dC1jb2xvcjogIzAwMDtcbiAgICAtLWRidWktZm9ybS1pbnB1dC1iYWNrZ3JvdW5kLWNvbG9yOiB0cmFuc3BhcmVudDtcbiAgICAtLWRidWktZm9ybS1pbnB1dC1ib3JkZXItY29sb3I6ICNjY2M7XG4gICAgLS1kYnVpLWZvcm0taW5wdXQtYm9yZGVyLXN0eWxlOiBzb2xpZDtcbiAgICAtLWRidWktZm9ybS1pbnB1dC1ib3JkZXItd2lkdGg6IDFweDtcbiAgfVxuICBgO1xuXG5leHBvcnQgZGVmYXVsdCBEQlVJQ29tbW9uQ3NzVmFycztcbiIsIlxuaW1wb3J0IGVuc3VyZVNpbmdsZVJlZ2lzdHJhdGlvbiBmcm9tICcuLi8uLi8uLi9pbnRlcm5hbHMvZW5zdXJlU2luZ2xlUmVnaXN0cmF0aW9uJztcbmltcG9ydCBEQlVJQ29tbW9uQ3NzVmFycyBmcm9tICcuL0RCVUlDb21tb25Dc3NWYXJzJztcbmltcG9ydCB0b2dnbGVTZWxlY3RhYmxlIGZyb20gJy4uLy4uLy4uL3V0aWxzL3RvZ2dsZVNlbGVjdGFibGUnO1xuXG5jb25zdCB7XG4gIGRpc2FibGVTZWxlY3Rpb24sXG4gIGVuYWJsZVNlbGVjdGlvblxufSA9IHRvZ2dsZVNlbGVjdGFibGU7XG5cbmNvbnN0IHJlZ2lzdHJhdGlvbk5hbWUgPSAnREJVSVdlYkNvbXBvbmVudEJhc2UnO1xuXG5mdW5jdGlvbiBkZWZpbmVDb21tb25DU1NWYXJzKHdpbikge1xuICBjb25zdCB7IGRvY3VtZW50IH0gPSB3aW47XG4gIGNvbnN0IGNvbW1vblN0eWxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3R5bGUnKTtcbiAgY29tbW9uU3R5bGUuc2V0QXR0cmlidXRlKCdkYnVpLWNvbW1vbi1jc3MtdmFycycsICcnKTtcbiAgY29tbW9uU3R5bGUuaW5uZXJIVE1MID0gREJVSUNvbW1vbkNzc1ZhcnM7XG4gIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2hlYWQnKS5hcHBlbmRDaGlsZChjb21tb25TdHlsZSk7XG59XG5cbi8qXG5BY2Nlc3NpbmcgcGFyZW50cyBhbmQgY2hpbGRyZW46XG5JZiBwYXJlbnQgaXMgYWNjZXNzZWQgaW4gY29ubmVjdGVkQ2FsbGJhY2sgaXQgZXhpc3RzIChpZiBpdCBzaG91bGQgZXhpc3QpLCBob3dldmVyLFxudGhlIHBhcmVudCBtaWdodCBub3QgYmUgaXRzZWxmIGNvbm5lY3RlZCB5ZXQuXG5JZiBjaGlsZHJlbiBhcmUgYWNjZXNzZWQgaW4gY29ubmVjdGVkQ2FsbGJhY2sgdGhleSBtaWdodCBub3QgYmUgY29tcGxldGUgeWV0IGF0IHRoYXQgdGltZS5cbiovXG5cbi8vIGh0dHBzOi8vd3d3LmtpcnVwYS5jb20vaHRtbDUvaGFuZGxpbmdfZXZlbnRzX2Zvcl9tYW55X2VsZW1lbnRzLmh0bVxuLyoqXG4gKlxuICogQHBhcmFtIHdpbiBXaW5kb3dcbiAqIEByZXR1cm4ge1xuICogICBEQlVJV2ViQ29tcG9uZW50QmFzZSxcbiAqICAgZGVmaW5lQ29tbW9uU3RhdGljTWV0aG9kcyxcbiAqICAgUmVnaXN0ZXJhYmxlXG4gKiB9XG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGdldERCVUlXZWJDb21wb25lbnRDb3JlKHdpbikge1xuICByZXR1cm4gZW5zdXJlU2luZ2xlUmVnaXN0cmF0aW9uKHdpbiwgcmVnaXN0cmF0aW9uTmFtZSwgKCkgPT4ge1xuICAgIGRlZmluZUNvbW1vbkNTU1ZhcnMod2luKTtcblxuICAgIGNvbnN0IHsgZG9jdW1lbnQsIEhUTUxFbGVtZW50LCBjdXN0b21FbGVtZW50cyB9ID0gd2luO1xuXG4gICAgY2xhc3MgREJVSVdlYkNvbXBvbmVudEJhc2UgZXh0ZW5kcyBIVE1MRWxlbWVudCB7XG5cbiAgICAgIC8qKlxuICAgICAgICpcbiAgICAgICAqIEByZXR1cm4gU3RyaW5nXG4gICAgICAgKi9cbiAgICAgIHN0YXRpYyBnZXQgcmVnaXN0cmF0aW9uTmFtZSgpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdyZWdpc3RyYXRpb25OYW1lIG11c3QgYmUgZGVmaW5lZCBpbiBkZXJpdmVkIGNsYXNzZXMnKTtcbiAgICAgIH1cblxuICAgICAgLyoqXG4gICAgICAgKlxuICAgICAgICogQHJldHVybiBTdHJpbmcgSFRNTFxuICAgICAgICovXG4gICAgICBzdGF0aWMgZ2V0IHRlbXBsYXRlSW5uZXJIVE1MKCkge1xuICAgICAgICByZXR1cm4gJzxzdHlsZT48L3N0eWxlPjxzbG90Pjwvc2xvdD4nO1xuICAgICAgfVxuXG4gICAgICAvKipcbiAgICAgICAqXG4gICAgICAgKiBAcmV0dXJuIEFycmF5PERCVUlXZWJDb21wb25lbnQ+XG4gICAgICAgKi9cbiAgICAgIHN0YXRpYyBnZXQgZGVwZW5kZW5jaWVzKCkge1xuICAgICAgICByZXR1cm4gW107XG4gICAgICB9XG5cbiAgICAgIC8qKlxuICAgICAgICpcbiAgICAgICAqIEByZXR1cm4gQXJyYXk8U3RyaW5nPlxuICAgICAgICovXG4gICAgICBzdGF0aWMgZ2V0IHByb3BlcnRpZXNUb1VwZ3JhZGUoKSB7XG4gICAgICAgIHJldHVybiBbJ3Vuc2VsZWN0YWJsZSddO1xuICAgICAgfVxuXG4gICAgICAvKipcbiAgICAgICAqXG4gICAgICAgKiBAcmV0dXJuIE9iamVjdCB7IFN0cmluZywgU3RyaW5nIH1cbiAgICAgICAqL1xuICAgICAgc3RhdGljIGdldCBhdHRyaWJ1dGVzVG9EZWZpbmUoKSB7XG4gICAgICAgIHJldHVybiB7ICdkYnVpLXdlYi1jb21wb25lbnQnOiAnJyB9O1xuICAgICAgfVxuXG4gICAgICAvKipcbiAgICAgICAqXG4gICAgICAgKiBAcmV0dXJuIEFycmF5PFN0cmluZz5cbiAgICAgICAqL1xuICAgICAgc3RhdGljIGdldCBvYnNlcnZlZEF0dHJpYnV0ZXMoKSB7XG4gICAgICAgIC8vIHdlYiBjb21wb25lbnRzIHN0YW5kYXJkIEFQSVxuICAgICAgICByZXR1cm4gWydkaXInLCAnbGFuZycsICdzeW5jLWxvY2FsZS13aXRoJywgJ3Vuc2VsZWN0YWJsZSddO1xuICAgICAgfVxuXG4gICAgICAvKipcbiAgICAgICAqXG4gICAgICAgKiBAcmV0dXJuIEFycmF5PFN0cmluZz5cbiAgICAgICAqL1xuICAgICAgZ2V0IG9ic2VydmVkRHluYW1pY0F0dHJpYnV0ZXMoKSB7XG4gICAgICAgIHJldHVybiBbXTtcbiAgICAgIH1cblxuICAgICAgLyoqXG4gICAgICAgKlxuICAgICAgICogQHJldHVybiBCb29sZWFuXG4gICAgICAgKi9cbiAgICAgIGdldCBoYXNEeW5hbWljQXR0cmlidXRlcygpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuXG4gICAgICAvKipcbiAgICAgICAqXG4gICAgICAgKiBAcmV0dXJuIEJvb2xlYW5cbiAgICAgICAqL1xuICAgICAgZ2V0IGlzTW91bnRlZCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2lzTW91bnRlZDtcbiAgICAgIH1cblxuICAgICAgLyoqXG4gICAgICAgKlxuICAgICAgICogQHJldHVybiBCb29sZWFuXG4gICAgICAgKi9cbiAgICAgIGdldCBpc0Rpc2Nvbm5lY3RlZCgpIHtcbiAgICAgICAgLy8gV2UgbmVlZCBpc0Rpc2Nvbm5lY3RlZCBpbmZvIHdoZW4gRE9NIHRyZWUgaXMgY29uc3RydWN0ZWRcbiAgICAgICAgLy8gLSBhZnRlciBjb25zdHJ1Y3RvcigpIGFuZCBiZWZvcmUgY29ubmVjdGVkQ2FsbGJhY2soKSAtXG4gICAgICAgIC8vIHdoZW4gY2xvc2VzdERidWlQYXJlbnQgc2hvdWxkIG5vdCByZXR1cm4gbnVsbC5cbiAgICAgICAgcmV0dXJuIHRoaXMuX2lzRGlzY29ubmVjdGVkO1xuICAgICAgfVxuXG4gICAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoKTtcblxuICAgICAgICB0aGlzLmF0dGFjaFNoYWRvdyh7XG4gICAgICAgICAgbW9kZTogJ29wZW4nLFxuICAgICAgICAgIC8vIGRlbGVnYXRlc0ZvY3VzOiB0cnVlXG4gICAgICAgICAgLy8gTm90IHdvcmtpbmcgb24gSVBhZCBzbyB3ZSBkbyBhbiB3b3JrYXJvdW5kXG4gICAgICAgICAgLy8gYnkgc2V0dGluZyBcImZvY3VzZWRcIiBhdHRyaWJ1dGUgd2hlbiBuZWVkZWQuXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuX3Byb3BhZ2F0aW5nQ29udGV4dCA9IGZhbHNlO1xuICAgICAgICB0aGlzLl9wcm92aWRpbmdDb250ZXh0ID0ge307XG4gICAgICAgIHRoaXMuX2xhc3RSZWNlaXZlZENvbnRleHQgPSB7fTtcbiAgICAgICAgdGhpcy5fY2xvc2VzdERidWlQYXJlbnQgPSBudWxsO1xuICAgICAgICB0aGlzLl9jbG9zZXN0RGJ1aUNoaWxkcmVuID0gW107XG4gICAgICAgIHRoaXMuX2lzTW91bnRlZCA9IGZhbHNlO1xuICAgICAgICB0aGlzLl9pc0Rpc2Nvbm5lY3RlZCA9IGZhbHNlO1xuICAgICAgICB0aGlzLl9sb2NhbGVPYnNlcnZlciA9IG51bGw7XG4gICAgICAgIHRoaXMuX2R5bmFtaWNBdHRyaWJ1dGVzT2JzZXJ2ZXIgPSBudWxsO1xuICAgICAgICB0aGlzLl9wcmV2aW91c2x5T2JzZXJ2ZWREeW5hbWljQXR0cmlidXRlcyA9IHt9O1xuICAgICAgICB0aGlzLl9pbnNlcnRUZW1wbGF0ZSgpO1xuXG4gICAgICAgIHRoaXMuY29ubmVjdGVkQ2FsbGJhY2sgPSB0aGlzLmNvbm5lY3RlZENhbGxiYWNrLmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMuZGlzY29ubmVjdGVkQ2FsbGJhY2sgPSB0aGlzLmRpc2Nvbm5lY3RlZENhbGxiYWNrLmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMuYXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrID0gdGhpcy5hdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2suYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy5hZG9wdGVkQ2FsbGJhY2sgPSB0aGlzLmFkb3B0ZWRDYWxsYmFjay5iaW5kKHRoaXMpO1xuICAgICAgfVxuXG4gICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09IFtPYnNlcnZlIER5bmFtaWMgQXR0cmlidXRlc10gPj4gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgICAgIF9pbml0aWFsaXplRHluYW1pY0F0dHJpYnV0ZXNPYnNlcnZlcigpIHtcbiAgICAgICAgaWYgKCF0aGlzLmhhc0R5bmFtaWNBdHRyaWJ1dGVzKSByZXR1cm47XG5cbiAgICAgICAgdGhpcy5fZHluYW1pY0F0dHJpYnV0ZXNPYnNlcnZlciA9IG5ldyB3aW4uTXV0YXRpb25PYnNlcnZlcigobXV0YXRpb25zKSA9PiB7XG4gICAgICAgICAgbXV0YXRpb25zLmZvckVhY2goKG11dGF0aW9uKSA9PiB7XG4gICAgICAgICAgICBjb25zdCB7IG9sZFZhbHVlLCBhdHRyaWJ1dGVOYW1lIH0gPSBtdXRhdGlvbjtcbiAgICAgICAgICAgIGNvbnN0IG5ld1ZhbHVlID0gdGhpcy5nZXRBdHRyaWJ1dGUoYXR0cmlidXRlTmFtZSk7XG4gICAgICAgICAgICBjb25zdCBjdXJyZW50bHlPYnNlcnZlZER5bmFtaWNBdHRyaWJ1dGVzS2V5cyA9IHRoaXMub2JzZXJ2ZWREeW5hbWljQXR0cmlidXRlcztcbiAgICAgICAgICAgIGNvbnN0IHByZXZpb3VzbHlPYnNlcnZlZER5bmFtaWNBdHRyaWJ1dGVzID0gdGhpcy5fcHJldmlvdXNseU9ic2VydmVkRHluYW1pY0F0dHJpYnV0ZXM7XG4gICAgICAgICAgICBjb25zdCBwcmV2aW91c2x5T2JzZXJ2ZWREeW5hbWljQXR0cmlidXRlc0tleXMgPSBPYmplY3Qua2V5cyhwcmV2aW91c2x5T2JzZXJ2ZWREeW5hbWljQXR0cmlidXRlcyk7XG4gICAgICAgICAgICBjb25zdCBpc0luQ3VycmVudGx5T2JzZXJ2ZWREeW5hbWljQXR0cmlidXRlcyA9XG4gICAgICAgICAgICAgIGN1cnJlbnRseU9ic2VydmVkRHluYW1pY0F0dHJpYnV0ZXNLZXlzLmluY2x1ZGVzKGF0dHJpYnV0ZU5hbWUpO1xuICAgICAgICAgICAgY29uc3QgaXNJblByZXZpb3VzbHlPYnNlcnZlZER5bmFtaWNBdHRyaWJ1dGVzID1cbiAgICAgICAgICAgICAgcHJldmlvdXNseU9ic2VydmVkRHluYW1pY0F0dHJpYnV0ZXNLZXlzLmluY2x1ZGVzKGF0dHJpYnV0ZU5hbWUpO1xuXG4gICAgICAgICAgICBpZiAoaXNJbkN1cnJlbnRseU9ic2VydmVkRHluYW1pY0F0dHJpYnV0ZXMpIHtcbiAgICAgICAgICAgICAgdGhpcy5fcHJldmlvdXNseU9ic2VydmVkRHluYW1pY0F0dHJpYnV0ZXNbYXR0cmlidXRlTmFtZV0gPSBuZXdWYWx1ZTtcbiAgICAgICAgICAgICAgdGhpcy5hdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2soXG4gICAgICAgICAgICAgICAgYXR0cmlidXRlTmFtZSwgb2xkVmFsdWUsIG5ld1ZhbHVlXG4gICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGlzSW5QcmV2aW91c2x5T2JzZXJ2ZWREeW5hbWljQXR0cmlidXRlcykge1xuICAgICAgICAgICAgICBjb25zdCBvbGRWYWx1ZSA9IHRoaXMuX3ByZXZpb3VzbHlPYnNlcnZlZER5bmFtaWNBdHRyaWJ1dGVzW2F0dHJpYnV0ZU5hbWVdO1xuICAgICAgICAgICAgICBkZWxldGUgdGhpcy5fcHJldmlvdXNseU9ic2VydmVkRHluYW1pY0F0dHJpYnV0ZXNbYXR0cmlidXRlTmFtZV07XG4gICAgICAgICAgICAgIHRoaXMuYXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrKFxuICAgICAgICAgICAgICAgIGF0dHJpYnV0ZU5hbWUsIG9sZFZhbHVlLCBudWxsXG4gICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5fZHluYW1pY0F0dHJpYnV0ZXNPYnNlcnZlci5vYnNlcnZlKHRoaXMsIHtcbiAgICAgICAgICBhdHRyaWJ1dGVzOiB0cnVlLFxuICAgICAgICAgIGF0dHJpYnV0ZU9sZFZhbHVlOiB0cnVlXG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICBfZGlzbWlzc0R5bmFtaWNBdHRyaWJ1dGVzT2JzZXJ2ZXIoKSB7XG4gICAgICAgIGlmICghdGhpcy5fZHluYW1pY0F0dHJpYnV0ZXNPYnNlcnZlcikgcmV0dXJuO1xuXG4gICAgICAgIHRoaXMuX2R5bmFtaWNBdHRyaWJ1dGVzT2JzZXJ2ZXIuZGlzY29ubmVjdCgpO1xuICAgICAgICB0aGlzLl9keW5hbWljQXR0cmlidXRlc09ic2VydmVyID0gbnVsbDtcbiAgICAgIH1cblxuICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PSA8PCBbT2JzZXJ2ZSBEeW5hbWljIEF0dHJpYnV0ZXNdID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09IFtMb2NhbGVdID4+ID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gICAgICAvKipcbiAgICAgICAqXG4gICAgICAgKiBAcmV0dXJuIEhUTUxFbGVtZW50XG4gICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICovXG4gICAgICBnZXQgX2xvY2FsZVRhcmdldCgpIHtcbiAgICAgICAgY29uc3QgdGFyZ2V0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcih0aGlzLmdldEF0dHJpYnV0ZSgnc3luYy1sb2NhbGUtd2l0aCcpKTtcbiAgICAgICAgY29uc3QgZGVmYXVsdFRhcmdldCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2h0bWwnKTtcbiAgICAgICAgcmV0dXJuIHRhcmdldCB8fCBkZWZhdWx0VGFyZ2V0O1xuICAgICAgfVxuXG4gICAgICAvKipcbiAgICAgICAqXG4gICAgICAgKiBAcmV0dXJuIE9iamVjdCB7IGRpciwgbGFuZyB9XG4gICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICovXG4gICAgICBnZXQgX3RhcmdldGVkTG9jYWxlKCkge1xuICAgICAgICAvLyBSZXR1cm4gbG9jYWxlIGZyb20gdGFyZ2V0XG4gICAgICAgIGNvbnN0IHRhcmdldCA9IHRoaXMuX2xvY2FsZVRhcmdldDtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBkaXI6IHRhcmdldC5nZXRBdHRyaWJ1dGUoJ2RpcicpIHx8ICdsdHInLFxuICAgICAgICAgIGxhbmc6IHRhcmdldC5nZXRBdHRyaWJ1dGUoJ2xhbmcnKSB8fCAnZW4nLFxuICAgICAgICB9O1xuICAgICAgfVxuXG4gICAgICBfcmVzZXRQcm92aWRlZExvY2FsZSgpIHtcbiAgICAgICAgLy8gQ2FsbGVkIG9uRGlzY29ubmVjdGVkQ2FsbGJhY2suXG4gICAgICAgIC8vXG4gICAgICAgIC8vIGRidWlEaXIvTGFuZyBkYnVpLWRpci9sYW5nIGNhbiBiZSBzZXRcbiAgICAgICAgLy8gYXMgYSByZXN1bHQgb2YgYXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrXG4gICAgICAgIC8vIG9yIGFzIGEgcmVzdWx0IG9mIHN5bmNpbmcgd2l0aCAob3IgbW9uaXRvcmluZykgbG9jYWxlIHRhcmdldCAoX3N5bmNMb2NhbGVBbmRNb25pdG9yQ2hhbmdlcykuXG4gICAgICAgIC8vIFdlIGNhbiByZW1vdmUgdGhlbSBpZiB0aGV5IHdlcmUgc2V0XG4gICAgICAgIC8vIGFzIGEgcmVzdWx0IG9mIF9zeW5jTG9jYWxlQW5kTW9uaXRvckNoYW5nZXNcbiAgICAgICAgLy8gYmVjYXVzZSB3aGVuIHRoaXMgbm9kZSB3aWxsIGJlIHJlLWluc2VydGVkXG4gICAgICAgIC8vIHRoZSBzeW5jaW5nIHdpbGwgaGFwcGVuIGFnYWluIGFuZCBkYnVpLWRpci9sYW5nIGF0dHJzIGFuZCBkYnVpRGlyL0xhbmcgcHJvdmlkZWQgY29udGV4dCB3aWxsIGJlIHNldCBhZ2Fpbi5cbiAgICAgICAgLy8gQnV0IHdlIGNhbid0IGRlbGV0ZSB0aGVtIGlmIHRoZXkgd2VyZSBzZXQgb25BdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2tcbiAgICAgICAgLy8gYmVjYXVzZSB0aGF0IHdpbGwgbm90IGJlIGZpcmVkIGFnYWluIHdoZW4gbm9kZSBpcyBtb3ZlZCBpbiBvdGhlciBwYXJ0IG9mIHRoZSBET00uXG4gICAgICAgIGlmICghdGhpcy5nZXRBdHRyaWJ1dGUoJ2RpcicpKSB7XG4gICAgICAgICAgLy8gV2Uga25vdyB0aGF0IGxvY2FsZSBwcm9wcy9hdHRycyB3ZXJlIHNldFxuICAgICAgICAgIC8vIGFzIGEgcmVzdWx0IG9mIGxvY2FsZSBzeW5jaW5nXG4gICAgICAgICAgLy8gYW5kIHdlIGNhbiByZXNldCBsb2NhbGUgZnJvbSBfcHJvdmlkaW5nQ29udGV4dC5cbiAgICAgICAgICBkZWxldGUgdGhpcy5fcHJvdmlkaW5nQ29udGV4dC5kYnVpRGlyOyAvLyBhZmZlY3RzIGNvbnRleHQgcHJvdmlkZXJzIC8gbm8gZWZmZWN0IG9uIGNvbnRleHQgcmVjZWl2ZXJzXG4gICAgICAgICAgdGhpcy5yZW1vdmVBdHRyaWJ1dGUoJ2RidWktZGlyJyk7IC8vIGFmZmVjdHMgcHJvdmlkZXJzIGFuZCByZWNlaXZlcnNcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghdGhpcy5nZXRBdHRyaWJ1dGUoJ2xhbmcnKSkge1xuICAgICAgICAgIGRlbGV0ZSB0aGlzLl9wcm92aWRpbmdDb250ZXh0LmRidWlMYW5nO1xuICAgICAgICAgIHRoaXMucmVtb3ZlQXR0cmlidXRlKCdkYnVpLWxhbmcnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLl9sb2NhbGVPYnNlcnZlcikge1xuICAgICAgICAgIHRoaXMuX2xvY2FsZU9ic2VydmVyLmRpc2Nvbm5lY3QoKTtcbiAgICAgICAgICB0aGlzLl9sb2NhbGVPYnNlcnZlciA9IG51bGw7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLyoqXG4gICAgICAgKlxuICAgICAgICogQHBhcmFtIG5ld0NvbnRleHQgT2JqZWN0XG4gICAgICAgKiBAcGFyYW0gcHJldkNvbnRleHQgT2JqZWN0XG4gICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICovXG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmVcbiAgICAgIF9vbkxvY2FsZUNvbnRleHRDaGFuZ2VkKG5ld0NvbnRleHQsIHByZXZDb250ZXh0KSB7XG4gICAgICAgIC8vIElmIHdlIGFyZSBtb25pdG9yaW5nIGxvY2FsZSBmcm9tIGVsc2V3aGVyZSBkaXNjYXJkIHRoaXMgbm90aWZpY2F0aW9uLlxuICAgICAgICBpZiAodGhpcy5fbG9jYWxlT2JzZXJ2ZXIpIHJldHVybjtcbiAgICAgICAgY29uc3Qge1xuICAgICAgICAgIGRidWlEaXIsIGRidWlMYW5nXG4gICAgICAgIH0gPSBuZXdDb250ZXh0O1xuICAgICAgICAvLyBjaGFuZ2VzIGRvbmUgYnkgYXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrKGRpci9sYW5nKSB0YWtlcyBwcmVjZWRlbmNlIG92ZXIgb25Db250ZXh0Q2hhbmdlZFxuICAgICAgICAhdGhpcy5nZXRBdHRyaWJ1dGUoJ2RpcicpICYmIHRoaXMuc2V0QXR0cmlidXRlKCdkYnVpLWRpcicsIGRidWlEaXIpO1xuICAgICAgICAhdGhpcy5nZXRBdHRyaWJ1dGUoJ2xhbmcnKSAmJiB0aGlzLnNldEF0dHJpYnV0ZSgnZGJ1aS1sYW5nJywgZGJ1aUxhbmcpO1xuICAgICAgfVxuXG4gICAgICAvKipcbiAgICAgICAqXG4gICAgICAgKiBAcGFyYW0gbmFtZSBTdHJpbmdcbiAgICAgICAqIEBwYXJhbSBvbGRWYWx1ZSBTdHJpbmdcbiAgICAgICAqIEBwYXJhbSBuZXdWYWx1ZSBTdHJpbmdcbiAgICAgICAqIEBwcml2YXRlXG4gICAgICAgKi9cbiAgICAgIF9vbkxvY2FsZUF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjayhuYW1lLCBvbGRWYWx1ZSwgbmV3VmFsdWUpIHtcbiAgICAgICAgLy8gSWYgbG9jYWxlIHZhbHVlIGlzIHRydXRoeSwgc2V0IGl0IChvbiBjb250ZXh0IHRvbylcbiAgICAgICAgLy8gZWxzZSByZWFkIHZhbHVlIGZyb20gX3RhcmdldGVkTG9jYWxlXG4gICAgICAgIC8vIG9yIGZyb20gY2xvc2VzdERidWlQYXJlbnQgY29udGV4dC5cblxuICAgICAgICBpZiAobmFtZSA9PT0gJ3N5bmMtbG9jYWxlLXdpdGgnKSB7XG4gICAgICAgICAgLy8gc3RvcCBtb25pdG9yaW5nIG9sZCB0YXJnZXQgYW5kIHN0YXJ0IG1vbml0b3JpbmcgbmV3IHRhcmdldFxuICAgICAgICAgIHRoaXMuX3N5bmNMb2NhbGVBbmRNb25pdG9yQ2hhbmdlcygpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGNvbnRleHRLZXkgPSBuYW1lID09PSAnZGlyJyA/ICdkYnVpRGlyJyA6ICdkYnVpTGFuZyc7XG4gICAgICAgIGNvbnN0IGhhc0xvY2FsZVN5bmMgPSAhIXRoaXMuaGFzQXR0cmlidXRlKCdzeW5jLWxvY2FsZS13aXRoJyk7XG4gICAgICAgIGNvbnN0IGNsb3Nlc3REYnVpUGFyZW50ID0gdGhpcy5jbG9zZXN0RGJ1aVBhcmVudDtcbiAgICAgICAgY29uc3QgaXNUb3BEYnVpQW5jZXN0b3IgPSAhY2xvc2VzdERidWlQYXJlbnQ7XG4gICAgICAgIGNvbnN0IHRhcmdldGVkTG9jYWxlID1cbiAgICAgICAgICAoaGFzTG9jYWxlU3luYyB8fCBpc1RvcERidWlBbmNlc3RvcikgPyB0aGlzLl90YXJnZXRlZExvY2FsZSA6IG51bGw7XG4gICAgICAgIGNvbnN0IHZhbHVlVG9TZXQgPSBuZXdWYWx1ZSB8fFxuICAgICAgICAgICh0YXJnZXRlZExvY2FsZSAmJiB0YXJnZXRlZExvY2FsZVtuYW1lXSkgfHxcbiAgICAgICAgICBjbG9zZXN0RGJ1aVBhcmVudC5fZ2V0Q29udGV4dChbY29udGV4dEtleV0pW2NvbnRleHRLZXldO1xuXG4gICAgICAgIGlmIChuZXdWYWx1ZSB8fCB0YXJnZXRlZExvY2FsZSkge1xuICAgICAgICAgIHRoaXMuc2V0QXR0cmlidXRlKGBkYnVpLSR7bmFtZX1gLCB2YWx1ZVRvU2V0KTtcbiAgICAgICAgICB0aGlzLnNldENvbnRleHQoe1xuICAgICAgICAgICAgW2NvbnRleHRLZXldOiB2YWx1ZVRvU2V0XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgdGFyZ2V0ZWRMb2NhbGUgJiYgdGhpcy5fd2F0Y2hMb2NhbGVDaGFuZ2VzKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5fcmVzZXRQcm92aWRlZExvY2FsZSgpO1xuICAgICAgICAgIHRoaXMuX3Vuc2V0QW5kUmVsaW5rQ29udGV4dChjb250ZXh0S2V5KTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBfc3luY0xvY2FsZUFuZE1vbml0b3JDaGFuZ2VzKCkge1xuICAgICAgICAvLyBDYWxsZWQgb25Db25uZWN0ZWRDYWxsYmFjayBhbmQgX29uTG9jYWxlQXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrIChvbmx5IGZvciBzeW5jLWxvY2FsZS13aXRoKS5cbiAgICAgICAgLy9cbiAgICAgICAgLy8gSWYgYmVpbmcgdG9wIG1vc3QgZGJ1aSBhbmNlc3RvciBvciBoYXZpbmcgYXR0ciBcInN5bmMtbG9jYWxlLXdpdGhcIiBkZWZpbmVkLFxuICAgICAgICAvLyByZWFkIGxvY2FsZSBmcm9tIHRhcmdldCwgc2V0IHZhbHVlcyBvbiBjb250ZXh0XG4gICAgICAgIC8vIHRoZW4gd2F0Y2ggZm9yIGxvY2FsZSBjaGFuZ2VzIG9uIHRhcmdldC5cbiAgICAgICAgY29uc3QgaXNEZXNjZW5kYW50RGJ1aSA9ICEhdGhpcy5jbG9zZXN0RGJ1aVBhcmVudDtcbiAgICAgICAgY29uc3QgaGFzTG9jYWxlU3luYyA9ICEhdGhpcy5oYXNBdHRyaWJ1dGUoJ3N5bmMtbG9jYWxlLXdpdGgnKTtcbiAgICAgICAgaWYgKGlzRGVzY2VuZGFudERidWkgJiYgIWhhc0xvY2FsZVN5bmMpIHJldHVybjtcblxuICAgICAgICBjb25zdCB7IGRpcjogdGFyZ2V0ZWREaXIsIGxhbmc6IHRhcmdldGVkTGFuZyB9ID0gdGhpcy5fdGFyZ2V0ZWRMb2NhbGU7XG4gICAgICAgIGNvbnN0IHNlbGZEaXIgPSB0aGlzLmdldEF0dHJpYnV0ZSgnZGlyJyk7XG4gICAgICAgIGNvbnN0IHNlbGZMYW5nID0gdGhpcy5nZXRBdHRyaWJ1dGUoJ2xhbmcnKTtcbiAgICAgICAgY29uc3QgbmV3RGlyID0gc2VsZkRpciB8fCB0YXJnZXRlZERpcjtcbiAgICAgICAgY29uc3QgbmV3TGFuZyA9IHNlbGZMYW5nIHx8IHRhcmdldGVkTGFuZztcblxuICAgICAgICB0aGlzLnNldEF0dHJpYnV0ZSgnZGJ1aS1kaXInLCBuZXdEaXIpO1xuICAgICAgICB0aGlzLnNldEF0dHJpYnV0ZSgnZGJ1aS1sYW5nJywgbmV3TGFuZyk7XG5cbiAgICAgICAgdGhpcy5zZXRDb250ZXh0KHtcbiAgICAgICAgICBkYnVpRGlyOiBuZXdEaXIsXG4gICAgICAgICAgZGJ1aUxhbmc6IG5ld0xhbmdcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5fd2F0Y2hMb2NhbGVDaGFuZ2VzKCk7XG4gICAgICB9XG5cbiAgICAgIF93YXRjaExvY2FsZUNoYW5nZXMoKSB7XG4gICAgICAgIC8vIENhbGxlZCBmcm9tIF9zeW5jTG9jYWxlQW5kTW9uaXRvckNoYW5nZXMgYW5kIF9vbkxvY2FsZUF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjayAob25seSBmb3IgZGlyL2xhbmcpLlxuICAgICAgICBpZiAodGhpcy5fbG9jYWxlT2JzZXJ2ZXIpIHtcbiAgICAgICAgICB0aGlzLl9sb2NhbGVPYnNlcnZlci5kaXNjb25uZWN0KCk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBsb2NhbGVUYXJnZXQgPSB0aGlzLl9sb2NhbGVUYXJnZXQ7XG5cbiAgICAgICAgdGhpcy5fbG9jYWxlT2JzZXJ2ZXIgPSBuZXcgd2luLk11dGF0aW9uT2JzZXJ2ZXIoKG11dGF0aW9ucykgPT4ge1xuICAgICAgICAgIG11dGF0aW9ucy5mb3JFYWNoKChtdXRhdGlvbikgPT4ge1xuICAgICAgICAgICAgY29uc3QgYXR0ciA9IG11dGF0aW9uLmF0dHJpYnV0ZU5hbWU7XG4gICAgICAgICAgICBjb25zdCB2YWx1ZSA9IHRoaXMuX3RhcmdldGVkTG9jYWxlW2F0dHJdO1xuICAgICAgICAgICAgY29uc3QgYXR0cktleSA9IGBkYnVpLSR7YXR0cn1gO1xuICAgICAgICAgICAgY29uc3QgY29udGV4dEtleSA9IGBkYnVpJHthdHRyLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgYXR0ci5zbGljZSgxKX1gO1xuXG4gICAgICAgICAgICB0aGlzLnNldEF0dHJpYnV0ZShhdHRyS2V5LCB2YWx1ZSk7XG4gICAgICAgICAgICB0aGlzLnNldENvbnRleHQoe1xuICAgICAgICAgICAgICBbY29udGV4dEtleV06IHZhbHVlXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5fbG9jYWxlT2JzZXJ2ZXIub2JzZXJ2ZShsb2NhbGVUYXJnZXQsIHtcbiAgICAgICAgICBhdHRyaWJ1dGVzOiB0cnVlLFxuICAgICAgICAgIGF0dHJpYnV0ZUZpbHRlcjogWydkaXInLCAnbGFuZyddXG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09IDw8IFtMb2NhbGVdICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PSBbQ29udGV4dF0gPj4gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgICAgIC8qKlxuICAgICAgICpcbiAgICAgICAqIEByZXR1cm4gQXJyYXk8U3RyaW5nPlxuICAgICAgICovXG4gICAgICBzdGF0aWMgZ2V0IGNvbnRleHRQcm92aWRlKCkge1xuICAgICAgICByZXR1cm4gWydkYnVpRGlyJywgJ2RidWlMYW5nJ107XG4gICAgICB9XG5cbiAgICAgIC8qKlxuICAgICAgICpcbiAgICAgICAqIEByZXR1cm4gQXJyYXk8U3RyaW5nPlxuICAgICAgICovXG4gICAgICBzdGF0aWMgZ2V0IGNvbnRleHRTdWJzY3JpYmUoKSB7XG4gICAgICAgIHJldHVybiBbJ2RidWlEaXInLCAnZGJ1aUxhbmcnXTtcbiAgICAgIH1cblxuICAgICAgLyoqXG4gICAgICAgKlxuICAgICAgICogQHBhcmFtIGtleSBTdHJpbmdcbiAgICAgICAqIEByZXR1cm4gQm9vbGVhblxuICAgICAgICogQHByaXZhdGVcbiAgICAgICAqL1xuICAgICAgX3Byb3ZpZGVzQ29udGV4dEZvcihrZXkpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29uc3RydWN0b3IuY29udGV4dFByb3ZpZGUuc29tZSgoX2tleSkgPT4gX2tleSA9PT0ga2V5KTtcbiAgICAgIH1cblxuICAgICAgLyoqXG4gICAgICAgKlxuICAgICAgICogQHBhcmFtIGtleSBTdHJpbmdcbiAgICAgICAqIEByZXR1cm4gQm9vbGVhblxuICAgICAgICogQHByaXZhdGVcbiAgICAgICAqL1xuICAgICAgX2hhc1ZhbHVlRm9yQ29udGV4dChrZXkpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3Byb3ZpZGluZ0NvbnRleHRba2V5XSAhPT0gdW5kZWZpbmVkO1xuICAgICAgfVxuXG4gICAgICAvKipcbiAgICAgICAqXG4gICAgICAgKiBAcGFyYW0ga2V5IFN0cmluZ1xuICAgICAgICogQHJldHVybiBCb29sZWFuXG4gICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICovXG4gICAgICBfc3Vic2NyaWJlc0ZvckNvbnRleHQoa2V5KSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbnN0cnVjdG9yLmNvbnRleHRTdWJzY3JpYmUuc29tZSgoX2tleSkgPT4gX2tleSA9PT0ga2V5KTtcbiAgICAgIH1cblxuICAgICAgLyoqXG4gICAgICAgKlxuICAgICAgICogQHBhcmFtIGNvbnRleHRPYmogT2JqZWN0XG4gICAgICAgKi9cbiAgICAgIHNldENvbnRleHQoY29udGV4dE9iaikge1xuICAgICAgICBjb25zdCBuZXdLZXlzID0gT2JqZWN0LmtleXMoY29udGV4dE9iaikuZmlsdGVyKChrZXkpID0+IHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5fcHJvdmlkZXNDb250ZXh0Rm9yKGtleSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGNvbnN0IGNvbnRleHRUb1NldCA9IG5ld0tleXMucmVkdWNlKChhY2MsIGtleSkgPT4ge1xuICAgICAgICAgIGFjY1trZXldID0gY29udGV4dE9ialtrZXldO1xuICAgICAgICAgIHJldHVybiBhY2M7XG4gICAgICAgIH0sIHt9KTtcblxuICAgICAgICBjb25zdCBuZXdQcm92aWRpbmdDb250ZXh0ID0ge1xuICAgICAgICAgIC4uLnRoaXMuX3Byb3ZpZGluZ0NvbnRleHQsXG4gICAgICAgICAgLi4uY29udGV4dFRvU2V0XG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy5fcHJvdmlkaW5nQ29udGV4dCA9IG5ld1Byb3ZpZGluZ0NvbnRleHQ7XG5cbiAgICAgICAgaWYgKHRoaXMuX3Byb3BhZ2F0aW5nQ29udGV4dCkgcmV0dXJuO1xuXG4gICAgICAgIHRoaXMuX3Byb3BhZ2F0ZUNvbnRleHRDaGFuZ2VkKHRoaXMuX3Byb3ZpZGluZ0NvbnRleHQpO1xuICAgICAgfVxuXG4gICAgICAvKipcbiAgICAgICAqXG4gICAgICAgKiBAcGFyYW0gbmV3Q29udGV4dCBPYmplY3RcbiAgICAgICAqL1xuICAgICAgX3Byb3BhZ2F0ZUNvbnRleHRDaGFuZ2VkKG5ld0NvbnRleHQpIHtcbiAgICAgICAgdGhpcy5fcHJvcGFnYXRpbmdDb250ZXh0ID0gdHJ1ZTtcbiAgICAgICAgY29uc3QgbmV3Q29udGV4dEtleXMgPSBPYmplY3Qua2V5cyhuZXdDb250ZXh0KTtcblxuICAgICAgICAvLyBpZiBjb250ZXh0IGlzIHJlY2VpdmVkIGZyb20gYW5jZXN0b3JzXG4gICAgICAgIGlmIChuZXdDb250ZXh0ICE9PSB0aGlzLl9wcm92aWRpbmdDb250ZXh0KSB7XG4gICAgICAgICAgLy8gbWFrZXMgc2VsZiBhd2FyZVxuICAgICAgICAgIGNvbnN0IGtleXNTdWJzY3JpYmVkRm9yID0gbmV3Q29udGV4dEtleXMucmVkdWNlKChhY2MsIGtleSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5fc3Vic2NyaWJlc0ZvckNvbnRleHQoa2V5KSAmJiBhY2MucHVzaChrZXkpO1xuICAgICAgICAgICAgcmV0dXJuIGFjYztcbiAgICAgICAgICB9LCBbXSk7XG5cbiAgICAgICAgICBpZiAoa2V5c1N1YnNjcmliZWRGb3IubGVuZ3RoKSB7XG4gICAgICAgICAgICBjb25zdCBjb250ZXh0U3Vic2NyaWJlZEZvciA9IGtleXNTdWJzY3JpYmVkRm9yLnJlZHVjZSgoYWNjLCBrZXkpID0+IHtcbiAgICAgICAgICAgICAgYWNjW2tleV0gPSBuZXdDb250ZXh0W2tleV07XG4gICAgICAgICAgICAgIHJldHVybiBhY2M7XG4gICAgICAgICAgICB9LCB7fSk7XG4gICAgICAgICAgICB0aGlzLl9vbkNvbnRleHRDaGFuZ2VkKGNvbnRleHRTdWJzY3JpYmVkRm9yKTtcbiAgICAgICAgICAgIC8vIEF0IHRoaXMgcG9pbnQgdXNlciBtaWdodCBoYXZlIGNhbGwgc2V0Q29udGV4dCBpbnNpZGUgb25Db250ZXh0Q2hhbmdlZFxuICAgICAgICAgICAgLy8gaW4gd2hpY2ggY2FzZSBfcHJvdmlkaW5nQ29udGV4dCBpcyB1cGRhdGVkIHdpdGggbGF0ZXN0IHZhbHVlcy5cbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBwcm9wYWdhdGUgd2l0aCBvdmVycmlkZXNcbiAgICAgICAgLy8gSWYgdXNlciBjYWxsZWQgc2V0Q29udGV4dCgpIGZyb20gd2l0aGluIG9uQ29udGV4dENoYW5nZWQoKSB0aGVuXG4gICAgICAgIC8vIHRoaXMuX3Byb3ZpZGluZ0NvbnRleHQgaGFzIHRoZSBuZXdlc3QgdmFsdWVzIHRvIGJlIHByb3BhZ2F0ZWRcbiAgICAgICAgY29uc3Qgb3ZlcnJpZGRlbkNvbnRleHQgPSB0aGlzLmNvbnN0cnVjdG9yLmNvbnRleHRQcm92aWRlLnJlZHVjZSgoYWNjLCBrZXkpID0+IHtcbiAgICAgICAgICBpZiAodGhpcy5faGFzVmFsdWVGb3JDb250ZXh0KGtleSkpIHtcbiAgICAgICAgICAgIGFjY1trZXldID0gdGhpcy5fcHJvdmlkaW5nQ29udGV4dFtrZXldO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gYWNjO1xuICAgICAgICB9LCB7fSk7XG5cbiAgICAgICAgY29uc3QgY29udGV4dFRvUHJvcGFnYXRlID0ge1xuICAgICAgICAgIC4uLm5ld0NvbnRleHQsXG4gICAgICAgICAgLi4ub3ZlcnJpZGRlbkNvbnRleHRcbiAgICAgICAgfTtcblxuICAgICAgICAvLyBjaGlsZHJlbiB0aGF0IHdpbGwgbW91bnQgbGF0ZXIgd2lsbCBhc2sgZm9yIGNvbnRleHQgKF9jaGVja0NvbnRleHQpXG4gICAgICAgIHRoaXMuY2xvc2VzdERidWlDaGlsZHJlbi5mb3JFYWNoKChjaGlsZCkgPT4ge1xuICAgICAgICAgIGNoaWxkLl9wcm9wYWdhdGVDb250ZXh0Q2hhbmdlZChjb250ZXh0VG9Qcm9wYWdhdGUpO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5fcHJvcGFnYXRpbmdDb250ZXh0ID0gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIC8qKlxuICAgICAgICogUmVzZXRzIF9sYXN0UmVjZWl2ZWRDb250ZXh0IGFuZCBfcHJvdmlkaW5nQ29udGV4dCxcbiAgICAgICAqIGxvb2tzIHVwIGZvciBuZXcgdmFsdWUgb24gY2xvc2VzdERidWlQYXJlbnQgY29udGV4dFxuICAgICAgICogYW5kIHByb3BhZ2F0ZXMgdGhhdCB0byBzZWxmIGFuZCBhbmNlc3RvcnMuXG4gICAgICAgKlxuICAgICAgICogQHBhcmFtIGNvbnRleHRLZXkgU3RyaW5nIHwgQXJyYXk8U3RyaW5nPlxuICAgICAgICogQHByaXZhdGVcbiAgICAgICAqL1xuICAgICAgX3Vuc2V0QW5kUmVsaW5rQ29udGV4dChjb250ZXh0S2V5KSB7XG4gICAgICAgIGNvbnN0IGNvbnRleHRLZXlzID0gQXJyYXkuaXNBcnJheShjb250ZXh0S2V5KSA/IGNvbnRleHRLZXkgOiBbY29udGV4dEtleV07XG5cbiAgICAgICAgY29udGV4dEtleXMuZm9yRWFjaCgoa2V5KSA9PiB7XG4gICAgICAgICAgZGVsZXRlIHRoaXMuX2xhc3RSZWNlaXZlZENvbnRleHRba2V5XTtcbiAgICAgICAgICBkZWxldGUgdGhpcy5fcHJvdmlkaW5nQ29udGV4dFtrZXldO1xuICAgICAgICB9KTtcblxuICAgICAgICBjb25zdCBjbG9zZXN0RGJ1aVBhcmVudCA9IHRoaXMuY2xvc2VzdERidWlQYXJlbnQ7XG4gICAgICAgIGNvbnN0IHZhbHVlc1RvU2V0ID1cbiAgICAgICAgICAgICFjbG9zZXN0RGJ1aVBhcmVudCA/XG4gICAgICAgICAgICAgIHVuZGVmaW5lZCA6XG4gICAgICAgICAgICAgIGNsb3Nlc3REYnVpUGFyZW50Ll9nZXRDb250ZXh0KGNvbnRleHRLZXlzKTtcblxuICAgICAgICBjb25zdCBuZXdDb250ZXh0ID0gY29udGV4dEtleXMucmVkdWNlKChhY2MsIGtleSkgPT4ge1xuICAgICAgICAgIGFjY1trZXldID0gKHZhbHVlc1RvU2V0IHx8IHt9KVtrZXldO1xuICAgICAgICAgIHJldHVybiBhY2M7XG4gICAgICAgIH0sIHt9KTtcblxuICAgICAgICB0aGlzLl9wcm9wYWdhdGVDb250ZXh0Q2hhbmdlZChuZXdDb250ZXh0KTtcbiAgICAgIH1cblxuICAgICAgLyoqXG4gICAgICAgKlxuICAgICAgICogQHBhcmFtIGtleXMgQXJyYXk8U3RyaW5nPlxuICAgICAgICogQHJldHVybiBPYmplY3RcbiAgICAgICAqIEBwcml2YXRlXG4gICAgICAgKi9cbiAgICAgIF9nZXRDb250ZXh0KGtleXMpIHtcbiAgICAgICAgLy8gVGhpcyBtdXN0IHJ1biBhbHdheXMgaW4gdGhlIHBhcmVudCBvZiB0aGUgbm9kZSBhc2tpbmcgZm9yIGNvbnRleHRcbiAgICAgICAgLy8gYW5kIG5vdCBpbiB0aGUgbm9kZSBpdHNlbGYuXG4gICAgICAgIGNvbnN0IG93bmVkS2V5cyA9IFtdO1xuICAgICAgICBjb25zdCBrZXlzVG9Bc2tGb3IgPSBbXTtcbiAgICAgICAga2V5cy5mb3JFYWNoKChrZXkpID0+IHtcbiAgICAgICAgICBpZiAodGhpcy5faGFzVmFsdWVGb3JDb250ZXh0KGtleSkpIHtcbiAgICAgICAgICAgIG93bmVkS2V5cy5wdXNoKGtleSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGtleXNUb0Fza0Zvci5wdXNoKGtleSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgY29uc3QgY2xvc2VzdERidWlQYXJlbnQgPSB0aGlzLmNsb3Nlc3REYnVpUGFyZW50O1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIC4uLm93bmVkS2V5cy5yZWR1Y2UoKGFjYywga2V5KSA9PiB7XG4gICAgICAgICAgICBhY2Nba2V5XSA9IHRoaXMuX3Byb3ZpZGluZ0NvbnRleHRba2V5XTtcbiAgICAgICAgICAgIHJldHVybiBhY2M7XG4gICAgICAgICAgfSwge30pLFxuICAgICAgICAgIC4uLihjbG9zZXN0RGJ1aVBhcmVudCA/IGNsb3Nlc3REYnVpUGFyZW50Ll9nZXRDb250ZXh0KGtleXNUb0Fza0ZvcikgOiB7fSlcbiAgICAgICAgfTtcbiAgICAgIH1cblxuICAgICAgLyoqXG4gICAgICAgKlxuICAgICAgICogQHBhcmFtIG5ld0NvbnRleHQgT2JqZWN0XG4gICAgICAgKiBAcGFyYW0gb3B0aW9ucyB7IHJlc2V0ID0gZmFsc2UgfVxuICAgICAgICogQHByaXZhdGVcbiAgICAgICAqL1xuICAgICAgX29uQ29udGV4dENoYW5nZWQobmV3Q29udGV4dCwgeyByZXNldCA9IGZhbHNlIH0gPSB7fSkge1xuICAgICAgICAvLyBNaWdodCBiZSBmaXJlZCBtb3JlIHRoYW4gb25jZSB1bnRpbCBET00gdHJlZSBzZXR0bGVzIGRvd24uXG4gICAgICAgIC8vIGV4OiBmaXJzdCBjYWxsIGlzIHRoZSByZXN1bHQgb2YgX2NoZWNrQ29udGV4dCB3aGljaCBtaWdodCBnZXQgdGhlIHRvcCBtb3N0IGV4aXN0aW5nIGNvbnRleHQuXG4gICAgICAgIC8vIFRoZSBuZXh0IG9uZXMgY2FuIGJlIHRoZSByZXN1bHQgb2YgbWlkZGxlIGFuY2VzdG9ycyBmaXJpbmcgYXR0cmlidXRlQ2hhbmdlQ2FsbGJhY2tcbiAgICAgICAgLy8gd2hpY2ggbWlnaHQgc2V0IHRoZWlyIGNvbnRleHQgYW5kIHByb3BhZ2F0ZSBpdCBkb3duLlxuICAgICAgICBjb25zdCBsYXN0UmVjZWl2ZWRDb250ZXh0ID0gdGhpcy5fbGFzdFJlY2VpdmVkQ29udGV4dDtcbiAgICAgICAgY29uc3QgbmV3Q29udGV4dEZpbHRlcmVkS2V5cyA9IE9iamVjdC5rZXlzKG5ld0NvbnRleHQgfHwge30pLmZpbHRlcigoa2V5KSA9PiB7XG4gICAgICAgICAgcmV0dXJuIG5ld0NvbnRleHRba2V5XSAhPT0gbGFzdFJlY2VpdmVkQ29udGV4dFtrZXldO1xuICAgICAgICB9KTtcbiAgICAgICAgLy8gUHJldmVudHMgdHJpZ2dlcmluZyBvbkNvbnRleHRDaGFuZ2VkIGFnYWluc3QgYSBjb250ZXh0IGZvdW5kIG9uIHNvbWUgYW5jZXN0b3JcbiAgICAgICAgLy8gd2hpY2ggZGlkIG5vdCBtYW5hZ2VkIHlldCB0byBzZXR1cCBpdHMgY29udGV4dFxuICAgICAgICAvLyBkdWUgdG8gZm9yIGV4YW1wbGUgYXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrIGRpZCBub3QgZmlyZWQgb24gdGhhdCBhbmNlc3RvciB5ZXQuXG4gICAgICAgIGlmICghbmV3Q29udGV4dEZpbHRlcmVkS2V5cy5sZW5ndGggJiYgIXJlc2V0KSByZXR1cm47XG4gICAgICAgIGNvbnN0IG5ld0NvbnRleHRGaWx0ZXJlZCA9IG5ld0NvbnRleHRGaWx0ZXJlZEtleXMucmVkdWNlKChhY2MsIGtleSkgPT4ge1xuICAgICAgICAgIGFjY1trZXldID0gbmV3Q29udGV4dFtrZXldO1xuICAgICAgICAgIHJldHVybiBhY2M7XG4gICAgICAgIH0sIHt9KTtcbiAgICAgICAgY29uc3QgY29udGV4dFRvU2V0ID0gcmVzZXQgPyB7fSA6IHsgLi4ubGFzdFJlY2VpdmVkQ29udGV4dCwgLi4ubmV3Q29udGV4dEZpbHRlcmVkIH07XG4gICAgICAgIHRoaXMuX2xhc3RSZWNlaXZlZENvbnRleHQgPSBjb250ZXh0VG9TZXQ7XG4gICAgICAgIGNvbnN0IFtfbmV3Q29udGV4dCwgX3ByZXZDb250ZXh0XSA9IFt0aGlzLl9sYXN0UmVjZWl2ZWRDb250ZXh0LCBsYXN0UmVjZWl2ZWRDb250ZXh0XTtcbiAgICAgICAgdGhpcy5fb25Mb2NhbGVDb250ZXh0Q2hhbmdlZChfbmV3Q29udGV4dCwgX3ByZXZDb250ZXh0KTtcbiAgICAgICAgdGhpcy5vbkNvbnRleHRDaGFuZ2VkKF9uZXdDb250ZXh0LCBfcHJldkNvbnRleHQpO1xuICAgICAgfVxuXG5cbiAgICAgIC8qKlxuICAgICAgICogUHVibGljIGhvb2suXG4gICAgICAgKlxuICAgICAgICogQHBhcmFtIG5ld0NvbnRleHQgT2JqZWN0XG4gICAgICAgKiBAcGFyYW0gcHJldkNvbnRleHQgT2JqZWN0XG4gICAgICAgKi9cbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZVxuICAgICAgb25Db250ZXh0Q2hhbmdlZChuZXdDb250ZXh0LCBwcmV2Q29udGV4dCkge1xuICAgICAgICAvLyBwYXNzXG4gICAgICB9XG5cbiAgICAgIF9jaGVja0NvbnRleHQoKSB7XG4gICAgICAgIC8vIF9jaGVja0NvbnRleHQgY2FuIHByb3BhZ2F0ZSByZWN1cnNpdmVseSB0byB0aGUgdmVyeSB0b3AgZXZlbiBpZiBhbmNlc3RvcnMgYXJlIG5vdCBjb25uZWN0ZWQuXG4gICAgICAgIC8vIElmIHRoZXJlIGlzIGNvbnRleHQgZGVmaW5lZCBzb21ld2hlcmUgdXBzdHJlYW0gdGhlbiBpdCB3aWxsIGJlIHJlYWNoZWQgYnkgZGVzY2VuZGFudHMuXG4gICAgICAgIGNvbnN0IGNsb3Nlc3REYnVpUGFyZW50ID0gdGhpcy5jbG9zZXN0RGJ1aVBhcmVudDtcbiAgICAgICAgLy8gbm8gbmVlZCB0byBjaGVjayBjb250ZXh0IGlmIGlzIHRvcCBtb3N0IGRidWkgYW5jZXN0b3JcbiAgICAgICAgaWYgKCFjbG9zZXN0RGJ1aVBhcmVudCkgcmV0dXJuO1xuXG4gICAgICAgIGNvbnN0IG5ld0NvbnRleHQgPSBjbG9zZXN0RGJ1aVBhcmVudC5fZ2V0Q29udGV4dChcbiAgICAgICAgICB0aGlzLmNvbnN0cnVjdG9yLmNvbnRleHRTdWJzY3JpYmVcbiAgICAgICAgKTtcbiAgICAgICAgdGhpcy5fb25Db250ZXh0Q2hhbmdlZChuZXdDb250ZXh0KTtcbiAgICAgICAgLy8gTm8gbmVlZCB0byBwcm9wYWdhdGUgdG8gdGhlIGNoaWxkcmVuIGJlY2F1c2UgdGhleSBjYW4gc2VhcmNoIHVwd2FyZCBmb3IgY29udGV4dFxuICAgICAgICAvLyB1bnRpbCB0b3Agb2YgdGhlIHRyZWUgaXMgcmVhY2hlZCwgZXZlbiBpZiBhbmNlc3RvcnMgYXJlIG5vdCBjb25uZWN0ZWQgeWV0LlxuICAgICAgICAvLyBJZiBzb21lIG1pZGRsZSBhbmNlc3RvciBoYXMgY29udGV4dCB0byBwcm92aWRlIGFuZCBkaWQgbm90IG1hbmFnZWQgdG8gcHJvdmlkZSBpdCB5ZXRcbiAgICAgICAgLy8gKGV4OiBhdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2sgbm90IGZpcmVkIGJlZm9yZSBkZXNjZW5kYW50cyBsb29rZWQgZm9yIHVwc3RyZWFtIGNvbnRleHQpXG4gICAgICAgIC8vIHRoZW4gZGVzY2VuZGFudHMgd2lsbCByZWNlaXZlIGZpcnN0IGNvbnRleHQgZnJvbSB1cHN0cmVhbSB0aGVuIGZyb20gbWlkZGxlIGFuY2VzdG9yLlxuICAgICAgICAvLyBUaGlzIHdhcyB2ZXJpZmllZCFcbiAgICAgIH1cblxuICAgICAgX3Jlc2V0Q29udGV4dCgpIHtcbiAgICAgICAgLy8gdGhpcy5fcHJvdmlkaW5nQ29udGV4dCBpcyBOT1QgcmVzZXQgZnJvbSBjb21wb25lbnQgcHJvdmlkaW5nIGNvbnRleHRcbiAgICAgICAgLy8gYmVjYXVzZSBpZiBjb250ZXh0IGlzIGRlcGVuZGVudCBvbiBhdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2tcbiAgICAgICAgLy8gdGhhdCB3aWxsIG5vdCBmaXJlIHdoZW4gY29tcG9uZW50IGlzIG1vdmVkIGZyb20gb25lIHBsYWNlIHRvIGFub3RoZXIgcGxhY2UgaW4gRE9NIHRyZWUuXG4gICAgICAgIGNvbnN0IGNsb3Nlc3REYnVpUGFyZW50ID0gdGhpcy5jbG9zZXN0RGJ1aVBhcmVudDtcbiAgICAgICAgLy8gQ2hlY2tpbmcgY2xvc2VzdERidWlQYXJlbnQgdG8gYmUgc3ltbWV0cmljIHdpdGggX2NoZWNrQ29udGV4dFxuICAgICAgICAvLyBvciB3ZSdsbCBlbmQgdXAgd2l0aCBlbXB0eSBjb250ZXh0IG9iamVjdCBhZnRlciByZXNldCxcbiAgICAgICAgLy8gd2hlbiBpdCBpbml0aWFsbHkgd2FzIHVuZGVmaW5lZC5cbiAgICAgICAgaWYgKGNsb3Nlc3REYnVpUGFyZW50KSB7XG4gICAgICAgICAgdGhpcy5fb25Db250ZXh0Q2hhbmdlZChudWxsLCB7IHJlc2V0OiB0cnVlIH0pO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT0gPDwgW0NvbnRleHRdID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09IFtEZXNjZW5kYW50cy9BbmNlc3RvcnMgYW5kIHJlZ2lzdHJhdGlvbnNdID4+ID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gICAgICAvKipcbiAgICAgICAqXG4gICAgICAgKiBAcGFyYW0gY2FsbGJhY2sgRnVuY3Rpb25cbiAgICAgICAqIEByZXR1cm4gSFRNTEVsZW1lbnRcbiAgICAgICAqL1xuICAgICAgZ2V0Q2xvc2VzdEFuY2VzdG9yTWF0Y2hpbmdDb25kaXRpb24oY2FsbGJhY2spIHtcbiAgICAgICAgbGV0IGNsb3Nlc3RBbmNlc3RvciA9IHRoaXMucGFyZW50RWxlbWVudDtcbiAgICAgICAgd2hpbGUgKGNsb3Nlc3RBbmNlc3RvciAmJiAhY2FsbGJhY2soY2xvc2VzdEFuY2VzdG9yKSkge1xuICAgICAgICAgIGNsb3Nlc3RBbmNlc3RvciA9IGNsb3Nlc3RBbmNlc3Rvci5wYXJlbnRFbGVtZW50O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjbG9zZXN0QW5jZXN0b3I7XG4gICAgICB9XG5cbiAgICAgIC8qKlxuICAgICAgICpcbiAgICAgICAqIEByZXR1cm4gQXJyYXk8REJVSVdlYkNvbXBvbmVudD5cbiAgICAgICAqL1xuICAgICAgZ2V0IHNoYWRvd0RvbURidWlDaGlsZHJlbigpIHtcbiAgICAgICAgLy8gY2hpbGRyZW4gaW4gc2xvdHMgYXJlIE5PVCBpbmNsdWRlZCBoZXJlXG4gICAgICAgIHJldHVybiBbLi4udGhpcy5zaGFkb3dSb290LnF1ZXJ5U2VsZWN0b3JBbGwoJ1tkYnVpLXdlYi1jb21wb25lbnRdJyldO1xuICAgICAgfVxuXG4gICAgICAvKipcbiAgICAgICAqXG4gICAgICAgKiBAcmV0dXJuIERCVUlXZWJDb21wb25lbnQgfCBudWxsXG4gICAgICAgKi9cbiAgICAgIGdldCBzaGFkb3dEb21EYnVpUGFyZW50KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXRSb290Tm9kZSgpLmhvc3QgfHwgbnVsbDtcbiAgICAgIH1cblxuICAgICAgLyoqXG4gICAgICAgKlxuICAgICAgICogQHJldHVybiBEQlVJV2ViQ29tcG9uZW50IHwgbnVsbFxuICAgICAgICovXG4gICAgICBnZXQgbGlnaHREb21EYnVpUGFyZW50KCkge1xuICAgICAgICAvLyBjYW4gcmV0dXJuIGEgcGFyZW50IHdoaWNoIGlzIGluIHNoYWRvdyBET00gb2YgdGhlIGdyYW5kLXBhcmVudFxuICAgICAgICBsZXQgcGFyZW50ID0gdGhpcy5wYXJlbnRFbGVtZW50O1xuICAgICAgICB3aGlsZSAocGFyZW50ICYmICFwYXJlbnQuaGFzQXR0cmlidXRlKCdkYnVpLXdlYi1jb21wb25lbnQnKSkge1xuICAgICAgICAgIHBhcmVudCA9IHBhcmVudC5wYXJlbnRFbGVtZW50O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBwYXJlbnQgfHwgbnVsbDtcbiAgICAgIH1cblxuICAgICAgLyoqXG4gICAgICAgKlxuICAgICAgICogQHJldHVybiBBcnJheTxEQlVJV2ViQ29tcG9uZW50PlxuICAgICAgICovXG4gICAgICBnZXQgbGlnaHREb21EYnVpQ2hpbGRyZW4oKSB7XG4gICAgICAgIC8vIGNoaWxkcmVuIGluIHNsb3RzIEFSRSBpbmNsdWRlZCBoZXJlXG4gICAgICAgIHJldHVybiBbLi4udGhpcy5xdWVyeVNlbGVjdG9yQWxsKCdbZGJ1aS13ZWItY29tcG9uZW50XScpXTtcbiAgICAgIH1cblxuICAgICAgLyoqXG4gICAgICAgKlxuICAgICAgICogQHJldHVybiBEQlVJV2ViQ29tcG9uZW50IHwgbnVsbFxuICAgICAgICovXG4gICAgICBnZXQgY2xvc2VzdERidWlQYXJlbnRMaXZlUXVlcnkoKSB7XG4gICAgICAgIGxldCBjbG9zZXN0UGFyZW50ID0gdGhpcy5wYXJlbnRFbGVtZW50O1xuICAgICAgICAvLyBtaWdodCBiZSBudWxsIGlmIGRpc2Nvbm5lY3RlZCBmcm9tIGRvbVxuICAgICAgICBpZiAoY2xvc2VzdFBhcmVudCA9PT0gbnVsbCkge1xuICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICAgIGNsb3Nlc3RQYXJlbnQgPSBjbG9zZXN0UGFyZW50LmNsb3Nlc3QoJ1tkYnVpLXdlYi1jb21wb25lbnRdJyk7XG4gICAgICAgIHJldHVybiBjbG9zZXN0UGFyZW50IHx8IHRoaXMuc2hhZG93RG9tRGJ1aVBhcmVudDtcbiAgICAgIH1cblxuICAgICAgLyoqXG4gICAgICAgKlxuICAgICAgICogQHJldHVybiBEQlVJV2ViQ29tcG9uZW50IHwgbnVsbFxuICAgICAgICovXG4gICAgICBnZXQgY2xvc2VzdERidWlQYXJlbnQoKSB7XG4gICAgICAgIC8vIGNhY2hlZFxuICAgICAgICAvLyBSZWFzb24gZm9yIGNhY2hlIGlzIHRvIGFsbG93IGEgY2hpbGQgdG8gdW5yZWdpc3RlciBmcm9tIGl0cyBwYXJlbnQgd2hlbiB1bm1vdW50ZWRcbiAgICAgICAgLy8gYmVjYXVzZSB3aGVuIGJyb3dzZXIgY2FsbHMgZGlzY29ubmVjdGVkQ2FsbGJhY2sgdGhlIHBhcmVudCBpcyBub3QgcmVhY2hhYmxlIGFueW1vcmUuXG4gICAgICAgIC8vIElmIHBhcmVudCBjb3VsZCBub3QgYmUgcmVhY2hhYmxlIGl0IGNvdWxkIG5vdCB1bnJlZ2lzdGVyIGl0cyBjbG9zZXN0IGNoaWxkcmVuXG4gICAgICAgIC8vIHRodXMgbGVhZGluZyB0byBtZW1vcnkgbGVhay5cbiAgICAgICAgaWYgKHRoaXMuX2Nsb3Nlc3REYnVpUGFyZW50KSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMuX2Nsb3Nlc3REYnVpUGFyZW50O1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmlzRGlzY29ubmVjdGVkKSByZXR1cm4gbnVsbDtcbiAgICAgICAgdGhpcy5fY2xvc2VzdERidWlQYXJlbnQgPSB0aGlzLmNsb3Nlc3REYnVpUGFyZW50TGl2ZVF1ZXJ5O1xuICAgICAgICByZXR1cm4gdGhpcy5fY2xvc2VzdERidWlQYXJlbnQ7XG4gICAgICB9XG5cbiAgICAgIC8qKlxuICAgICAgICpcbiAgICAgICAqIEByZXR1cm4gREJVSVdlYkNvbXBvbmVudCB8IG51bGxcbiAgICAgICAqL1xuICAgICAgLy8gbWlnaHQgYmUgdXNlZnVsIGluIHNvbWUgc2NlbmFyaW9zXG4gICAgICBnZXQgdG9wRGJ1aUFuY2VzdG9yKCkge1xuICAgICAgICBsZXQgY2xvc2VzdERidWlQYXJlbnQgPSB0aGlzLmNsb3Nlc3REYnVpUGFyZW50O1xuICAgICAgICB3aGlsZSAoY2xvc2VzdERidWlQYXJlbnQpIHtcbiAgICAgICAgICBjb25zdCBfY2xvc2VzdERidWlQYXJlbnQgPSBjbG9zZXN0RGJ1aVBhcmVudC5jbG9zZXN0RGJ1aVBhcmVudDtcbiAgICAgICAgICBpZiAoIV9jbG9zZXN0RGJ1aVBhcmVudCkge1xuICAgICAgICAgICAgcmV0dXJuIGNsb3Nlc3REYnVpUGFyZW50O1xuICAgICAgICAgIH1cbiAgICAgICAgICBjbG9zZXN0RGJ1aVBhcmVudCA9IF9jbG9zZXN0RGJ1aVBhcmVudDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY2xvc2VzdERidWlQYXJlbnQ7IC8vIHRoaXMgaXMgbnVsbFxuICAgICAgfVxuXG4gICAgICAvKipcbiAgICAgICAqXG4gICAgICAgKiBAcmV0dXJuIEFycmF5PERCVUlXZWJDb21wb25lbnQ+XG4gICAgICAgKi9cbiAgICAgIC8vIG1pZ2h0IGJlIHVzZWZ1bCBpbiBzb21lIHNjZW5hcmlvc1xuICAgICAgZ2V0IGNsb3Nlc3REYnVpQ2hpbGRyZW5MaXZlUXVlcnkoKSB7XG4gICAgICAgIGNvbnN0IGRidWlDaGlsZHJlbiA9IFsuLi50aGlzLmxpZ2h0RG9tRGJ1aUNoaWxkcmVuLCAuLi50aGlzLnNoYWRvd0RvbURidWlDaGlsZHJlbl07XG4gICAgICAgIGNvbnN0IGNsb3Nlc3REYnVpQ2hpbGRyZW4gPSBkYnVpQ2hpbGRyZW4uZmlsdGVyKChjaGlsZCkgPT4gY2hpbGQuY2xvc2VzdERidWlQYXJlbnRMaXZlUXVlcnkgPT09IHRoaXMpO1xuICAgICAgICByZXR1cm4gY2xvc2VzdERidWlDaGlsZHJlbjtcbiAgICAgIH1cblxuICAgICAgLyoqXG4gICAgICAgKlxuICAgICAgICogQHJldHVybiBBcnJheTxEQlVJV2ViQ29tcG9uZW50PlxuICAgICAgICovXG4gICAgICBnZXQgY2xvc2VzdERidWlDaGlsZHJlbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2Nsb3Nlc3REYnVpQ2hpbGRyZW47XG4gICAgICB9XG5cbiAgICAgIF9yZWdpc3RlclNlbGZUb0Nsb3Nlc3REYnVpUGFyZW50KCkge1xuICAgICAgICBjb25zdCBjbG9zZXN0RGJ1aVBhcmVudCA9IHRoaXMuY2xvc2VzdERidWlQYXJlbnQ7XG4gICAgICAgIGlmICghY2xvc2VzdERidWlQYXJlbnQpIHJldHVybjtcbiAgICAgICAgY2xvc2VzdERidWlQYXJlbnQuX3JlZ2lzdGVyQ2hpbGQodGhpcyk7XG4gICAgICB9XG5cbiAgICAgIF91bnJlZ2lzdGVyU2VsZkZyb21DbG9zZXN0RGJ1aVBhcmVudCgpIHtcbiAgICAgICAgY29uc3QgY2xvc2VzdERidWlQYXJlbnQgPSB0aGlzLmNsb3Nlc3REYnVpUGFyZW50O1xuICAgICAgICBpZiAoIWNsb3Nlc3REYnVpUGFyZW50KSByZXR1cm47XG4gICAgICAgIGNsb3Nlc3REYnVpUGFyZW50Ll91bnJlZ2lzdGVyQ2hpbGQodGhpcyk7XG4gICAgICB9XG5cbiAgICAgIC8qKlxuICAgICAgICpcbiAgICAgICAqIEBwYXJhbSBjaGlsZCBEQlVJV2ViQ29tcG9uZW50XG4gICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICovXG4gICAgICBfcmVnaXN0ZXJDaGlsZChjaGlsZCkge1xuICAgICAgICB0aGlzLl9jbG9zZXN0RGJ1aUNoaWxkcmVuLnB1c2goY2hpbGQpO1xuICAgICAgfVxuXG4gICAgICAvKipcbiAgICAgICAqXG4gICAgICAgKiBAcGFyYW0gY2hpbGQgREJVSVdlYkNvbXBvbmVudFxuICAgICAgICogQHByaXZhdGVcbiAgICAgICAqL1xuICAgICAgX3VucmVnaXN0ZXJDaGlsZChjaGlsZCkge1xuICAgICAgICB0aGlzLl9jbG9zZXN0RGJ1aUNoaWxkcmVuID1cbiAgICAgICAgICB0aGlzLl9jbG9zZXN0RGJ1aUNoaWxkcmVuLmZpbHRlcigoX2NoaWxkKSA9PiBfY2hpbGQgIT09IGNoaWxkKTtcbiAgICAgIH1cblxuICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PSA8PCBbRGVzY2VuZGFudHMvQW5jZXN0b3JzIGFuZCByZWdpc3RyYXRpb25zXSA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuXG4gICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09IFt1bnNlbGVjdGFibGVdID4+ID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gICAgICBfb25VbnNlbGVjdGFibGVBdHRyaWJ1dGVDaGFuZ2VkKCkge1xuICAgICAgICBjb25zdCB1bnNlbGVjdGFibGUgPSB0aGlzLnVuc2VsZWN0YWJsZTtcblxuICAgICAgICBpZiAodW5zZWxlY3RhYmxlKSB7XG4gICAgICAgICAgZGlzYWJsZVNlbGVjdGlvbih0aGlzKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBlbmFibGVTZWxlY3Rpb24odGhpcyk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgZ2V0IHVuc2VsZWN0YWJsZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaGFzQXR0cmlidXRlKCd1bnNlbGVjdGFibGUnKTtcbiAgICAgIH1cblxuICAgICAgc2V0IHVuc2VsZWN0YWJsZSh2YWx1ZSkge1xuICAgICAgICBjb25zdCBoYXNWYWx1ZSA9IEJvb2xlYW4odmFsdWUpO1xuICAgICAgICBpZiAoaGFzVmFsdWUpIHtcbiAgICAgICAgICB0aGlzLnNldEF0dHJpYnV0ZSgndW5zZWxlY3RhYmxlJywgJycpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMucmVtb3ZlQXR0cmlidXRlKCd1bnNlbGVjdGFibGUnKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09IDw8IFt1bnNlbGVjdGFibGVdID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gICAgICAvKipcbiAgICAgICAqXG4gICAgICAgKiBAcGFyYW0gcHJvcCBTdHJpbmdcbiAgICAgICAqIEBwcml2YXRlXG4gICAgICAgKi9cbiAgICAgIF91cGdyYWRlUHJvcGVydHkocHJvcCkge1xuICAgICAgICAvLyBodHRwczovL2RldmVsb3BlcnMuZ29vZ2xlLmNvbS93ZWIvZnVuZGFtZW50YWxzL3dlYi1jb21wb25lbnRzL2Jlc3QtcHJhY3RpY2VzI2xhenktcHJvcGVydGllc1xuICAgICAgICAvLyBodHRwczovL2RldmVsb3BlcnMuZ29vZ2xlLmNvbS93ZWIvZnVuZGFtZW50YWxzL3dlYi1jb21wb25lbnRzL2V4YW1wbGVzL2hvd3RvLWNoZWNrYm94XG4gICAgICAgIC8qIGVzbGludCBuby1wcm90b3R5cGUtYnVpbHRpbnM6IDAgKi9cbiAgICAgICAgaWYgKHRoaXMuaGFzT3duUHJvcGVydHkocHJvcCkpIHtcbiAgICAgICAgICBjb25zdCB2YWx1ZSA9IHRoaXNbcHJvcF07XG4gICAgICAgICAgLy8gZ2V0IHJpZCBvZiB0aGUgcHJvcGVydHkgdGhhdCBtaWdodCBzaGFkb3cgYSBzZXR0ZXIvZ2V0dGVyXG4gICAgICAgICAgZGVsZXRlIHRoaXNbcHJvcF07XG4gICAgICAgICAgLy8gdGhpcyB0aW1lIGlmIGEgc2V0dGVyIHdhcyBkZWZpbmVkIGl0IHdpbGwgYmUgcHJvcGVybHkgY2FsbGVkXG4gICAgICAgICAgdGhpc1twcm9wXSA9IHZhbHVlO1xuICAgICAgICAgIC8vIGlmIGEgZ2V0dGVyIHdhcyBkZWZpbmVkLCBpdCB3aWxsIGJlIGNhbGxlZCBmcm9tIG5vdyBvblxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8qKlxuICAgICAgICpcbiAgICAgICAqIEBwYXJhbSBrZXkgU3RyaW5nXG4gICAgICAgKiBAcGFyYW0gdmFsdWUgU3RyaW5nXG4gICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICovXG4gICAgICBfZGVmaW5lQXR0cmlidXRlKGtleSwgdmFsdWUpIHtcbiAgICAgICAgLy8gZG9uJ3Qgb3ZlcnJpZGUgdXNlciBkZWZpbmVkIGF0dHJpYnV0ZVxuICAgICAgICBpZiAoIXRoaXMuaGFzQXR0cmlidXRlKGtleSkpIHtcbiAgICAgICAgICB0aGlzLnNldEF0dHJpYnV0ZShrZXksIHZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBfaW5zZXJ0VGVtcGxhdGUoKSB7XG4gICAgICAgIGNvbnN0IHsgdGVtcGxhdGUgfSA9IHRoaXMuY29uc3RydWN0b3I7XG4gICAgICAgIHRlbXBsYXRlICYmXG4gICAgICAgIHRoaXMuc2hhZG93Um9vdC5hcHBlbmRDaGlsZCh0ZW1wbGF0ZS5jb250ZW50LmNsb25lTm9kZSh0cnVlKSk7XG4gICAgICB9XG5cbiAgICAgIC8qKlxuICAgICAgICpcbiAgICAgICAqIEBwYXJhbSBvbGREb2N1bWVudCBIVE1MRG9jdW1lbnRcbiAgICAgICAqIEBwYXJhbSBuZXdEb2N1bWVudCBIVE1MRG9jdW1lbnRcbiAgICAgICAqL1xuICAgICAgYWRvcHRlZENhbGxiYWNrKG9sZERvY3VtZW50LCBuZXdEb2N1bWVudCkge1xuICAgICAgICAvLyB3ZWIgY29tcG9uZW50cyBzdGFuZGFyZCBBUElcbiAgICAgICAgLy8gY2FsbGJhY2tzIG9yZGVyOlxuICAgICAgICAvLyBkaXNjb25uZWN0ZWRDYWxsYmFjayA9PiBhZG9wdGVkQ2FsbGJhY2sgPT4gY29ubmVjdGVkQ2FsbGJhY2tcbiAgICAgICAgdGhpcy5fb25BZG9wdGVkQ2FsbGJhY2sob2xkRG9jdW1lbnQsIG5ld0RvY3VtZW50KTtcbiAgICAgIH1cblxuICAgICAgLyoqXG4gICAgICAgKlxuICAgICAgICogQHBhcmFtIG9sZERvY3VtZW50IEhUTUxEb2N1bWVudFxuICAgICAgICogQHBhcmFtIG5ld0RvY3VtZW50IEhUTUxEb2N1bWVudFxuICAgICAgICogQHByaXZhdGVcbiAgICAgICAqL1xuICAgICAgX29uQWRvcHRlZENhbGxiYWNrKG9sZERvY3VtZW50LCBuZXdEb2N1bWVudCkge1xuICAgICAgICAvLyBDYWxsIHB1YmxpYyBob29rLlxuICAgICAgICB0aGlzLm9uQWRvcHRlZENhbGxiYWNrKG9sZERvY3VtZW50LCBuZXdEb2N1bWVudCk7XG4gICAgICB9XG5cbiAgICAgIC8qKlxuICAgICAgICogUHVibGljIGhvb2suXG4gICAgICAgKlxuICAgICAgICogQHBhcmFtIG9sZERvY3VtZW50IEhUTUxEb2N1bWVudFxuICAgICAgICogQHBhcmFtIG5ld0RvY3VtZW50IEhUTUxEb2N1bWVudFxuICAgICAgICovXG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmVcbiAgICAgIG9uQWRvcHRlZENhbGxiYWNrKG9sZERvY3VtZW50LCBuZXdEb2N1bWVudCkge1xuICAgICAgICAvLyBwYXNzXG4gICAgICB9XG5cbiAgICAgIC8qXG4gICAgICAqIHdlYiBjb21wb25lbnRzIHN0YW5kYXJkIEFQSVxuICAgICAgKiBjb25uZWN0ZWRDYWxsYmFjayBpcyBmaXJlZCBmcm9tIGNoaWxkcmVuIHRvIHBhcmVudCBpbiBzaGFkb3cgRE9NXG4gICAgICAqIGJ1dCB0aGUgb3JkZXIgaXMgbGVzcyBwcmVkaWN0YWJsZSBpbiBsaWdodCBET00uXG4gICAgICAqIFNob3VsZCBub3QgcmVhZCBsaWdodC9zaGFkb3dEb21EYnVpQ2hpbGRyZW4gaGVyZS5cbiAgICAgICogSXMgY2FsbGVkIGFmdGVyIGF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjay5cbiAgICAgICogKi9cbiAgICAgIGNvbm5lY3RlZENhbGxiYWNrKCkge1xuICAgICAgICAvLyBVc2luZyB0aGlzIHBhdHRlcm4gYXMgaXQgc2VlbXMgdGhhdCB0aGUgY29tcG9uZW50XG4gICAgICAgIC8vIGlzIGltbXVuZSB0byBvdmVycmlkaW5nIGNvbm5lY3RlZENhbGxiYWNrIGF0IHJ1bnRpbWUuXG4gICAgICAgIC8vIE1vc3QgcHJvYmFibHkgdGhlIGJyb3dzZXIga2VlcHMgYSByZWZlcmVuY2UgdG8gY29ubmVjdGVkQ2FsbGJhY2tcbiAgICAgICAgLy8gZXhpc3RpbmcvZGVmaW5lZCBhdCB0aGUgdGltZSBvZiB1cGdyYWRpbmcgYW5kIGNhbGxzIHRoYXQgb25lIGluc3RlYWQgb2YgdGhlXG4gICAgICAgIC8vIGxhdGVzdCAobW9ua2V5IHBhdGNoZWQgLyBydW50aW1lIGV2YWx1YXRlZCkgb25lLlxuICAgICAgICAvLyBOb3csIHdlIGNhbiBtb25rZXkgcGF0Y2ggb25Db25uZWN0ZWRDYWxsYmFjayBpZiB3ZSB3YW50LlxuICAgICAgICB0aGlzLl9vbkNvbm5lY3RlZENhbGxiYWNrKCk7XG4gICAgICB9XG5cbiAgICAgIC8qKlxuICAgICAgICogQHByaXZhdGVcbiAgICAgICAqL1xuICAgICAgX29uQ29ubmVjdGVkQ2FsbGJhY2soKSB7XG4gICAgICAgIHRoaXMuX2lzTW91bnRlZCA9IHRydWU7XG4gICAgICAgIHRoaXMuX2lzRGlzY29ubmVjdGVkID0gZmFsc2U7XG4gICAgICAgIHdpbi5hZGRFdmVudExpc3RlbmVyKCdiZWZvcmV1bmxvYWQnLCB0aGlzLmRpc2Nvbm5lY3RlZENhbGxiYWNrLCBmYWxzZSk7XG4gICAgICAgIGNvbnN0IHsgcHJvcGVydGllc1RvVXBncmFkZSwgYXR0cmlidXRlc1RvRGVmaW5lIH0gPSB0aGlzLmNvbnN0cnVjdG9yO1xuICAgICAgICBwcm9wZXJ0aWVzVG9VcGdyYWRlLmZvckVhY2goKHByb3BlcnR5KSA9PiB7XG4gICAgICAgICAgdGhpcy5fdXBncmFkZVByb3BlcnR5KHByb3BlcnR5KTtcbiAgICAgICAgfSk7XG4gICAgICAgIE9iamVjdC5rZXlzKGF0dHJpYnV0ZXNUb0RlZmluZSkuZm9yRWFjaCgocHJvcGVydHkpID0+IHtcbiAgICAgICAgICB0aGlzLl9kZWZpbmVBdHRyaWJ1dGUocHJvcGVydHksIGF0dHJpYnV0ZXNUb0RlZmluZVtwcm9wZXJ0eV0pO1xuICAgICAgICB9KTtcbiAgICAgICAgLy8gV2UgY2FuIHNhZmVseSByZWdpc3RlciB0byBjbG9zZXN0RGJ1aVBhcmVudCBiZWNhdXNlIGl0IGV4aXN0cyBhdCB0aGlzIHRpbWVcbiAgICAgICAgLy8gYnV0IHdlIG11c3Qgbm90IGFzc3VtZSBpdCB3YXMgY29ubmVjdGVkLlxuICAgICAgICAvLyBOT1RFOiBldmVuIGlmIGNsb3Nlc3REYnVpUGFyZW50IChvciBhbnkgYW5jZXN0b3IpIGlzIG5vdCBjb25uZWN0ZWRcbiAgICAgICAgLy8gdGhlIHRvcCBvZiB0aGUgdHJlZSAodG9wRGJ1aUFuY2VzdG9yKSBjYW4gYmUgcmVhY2hlZCBpZiBuZWVkZWRcbiAgICAgICAgdGhpcy5fcmVnaXN0ZXJTZWxmVG9DbG9zZXN0RGJ1aVBhcmVudCgpO1xuICAgICAgICB0aGlzLl9jaGVja0NvbnRleHQoKTsgLy8gaXMgaWdub3JlZCBieSB0b3AgbW9zdCBkYnVpIGFuY2VzdG9yc1xuICAgICAgICAvLyBtYWtlcyB0b3AgbW9zdCBhbmNlc3RvcnMgb3IgZGJ1aSBjb21wb25lbnRzIGhhdmluZyBsb2NhbGVUYXJnZXQgc3BlY2lmaWVkXG4gICAgICAgIC8vIHRvIHNldCBkYnVpRGlyL0xvY2FsZSBvbiBjb250ZXh0XG4gICAgICAgIHRoaXMuX3N5bmNMb2NhbGVBbmRNb25pdG9yQ2hhbmdlcygpO1xuICAgICAgICB0aGlzLl9pbml0aWFsaXplRHluYW1pY0F0dHJpYnV0ZXNPYnNlcnZlcigpO1xuICAgICAgICAvLyBDYWxsIHB1YmxpYyBob29rLlxuICAgICAgICB0aGlzLm9uQ29ubmVjdGVkQ2FsbGJhY2soKTtcbiAgICAgIH1cblxuICAgICAgLyoqXG4gICAgICAgKiBQdWJsaWMgaG9vay5cbiAgICAgICAqL1xuICAgICAgb25Db25uZWN0ZWRDYWxsYmFjaygpIHtcbiAgICAgICAgLy8gcGFzc1xuICAgICAgfVxuXG4gICAgICAvLyB3ZWIgY29tcG9uZW50cyBzdGFuZGFyZCBBUElcbiAgICAgIGRpc2Nvbm5lY3RlZENhbGxiYWNrKCkge1xuICAgICAgICB0aGlzLl9vbkRpc2Nvbm5lY3RlZENhbGxiYWNrKCk7XG4gICAgICB9XG5cbiAgICAgIC8qKlxuICAgICAgICogQHByaXZhdGVcbiAgICAgICAqL1xuICAgICAgX29uRGlzY29ubmVjdGVkQ2FsbGJhY2soKSB7XG4gICAgICAgIHRoaXMuX3Jlc2V0Q29udGV4dCgpO1xuICAgICAgICB0aGlzLl9yZXNldFByb3ZpZGVkTG9jYWxlKCk7XG4gICAgICAgIHRoaXMuX3VucmVnaXN0ZXJTZWxmRnJvbUNsb3Nlc3REYnVpUGFyZW50KCk7XG4gICAgICAgIHdpbi5yZW1vdmVFdmVudExpc3RlbmVyKCdiZWZvcmV1bmxvYWQnLCB0aGlzLmRpc2Nvbm5lY3RlZENhbGxiYWNrLCBmYWxzZSk7XG4gICAgICAgIHRoaXMuX2lzTW91bnRlZCA9IGZhbHNlO1xuICAgICAgICB0aGlzLl9pc0Rpc2Nvbm5lY3RlZCA9IHRydWU7XG4gICAgICAgIHRoaXMuX2Nsb3Nlc3REYnVpUGFyZW50ID0gbnVsbDtcbiAgICAgICAgdGhpcy5fZGlzbWlzc0R5bmFtaWNBdHRyaWJ1dGVzT2JzZXJ2ZXIoKTtcbiAgICAgICAgLy8gQ2FsbCBwdWJsaWMgaG9vay5cbiAgICAgICAgdGhpcy5vbkRpc2Nvbm5lY3RlZENhbGxiYWNrKCk7XG4gICAgICB9XG5cbiAgICAgIC8qKlxuICAgICAgICogUHVibGljIGhvb2suXG4gICAgICAgKi9cbiAgICAgIG9uRGlzY29ubmVjdGVkQ2FsbGJhY2soKSB7XG4gICAgICAgIC8vIHBhc3NcbiAgICAgIH1cblxuICAgICAgY2xvbmVOb2RlRGVlcCh7IGlkUHJlZml4ID0gJycsIGlkU3VmZml4ID0gJycgfSkge1xuICAgICAgICBjb25zdCBjbG9uZSA9IHN1cGVyLmNsb25lTm9kZSh0cnVlKTtcbiAgICAgICAgaWYgKCFpZFByZWZpeCAmJiAhaWRTdWZmaXgpIHJldHVybiBjbG9uZTtcbiAgICAgICAgaWYgKGNsb25lLmhhc0F0dHJpYnV0ZSgnaWQnKSkge1xuICAgICAgICAgIGNsb25lLnNldEF0dHJpYnV0ZSgnaWQnLCBgJHtpZFByZWZpeH0ke2Nsb25lLmdldEF0dHJpYnV0ZSgnaWQnKX0ke2lkU3VmZml4fWApO1xuICAgICAgICB9XG4gICAgICAgIGNsb25lLnF1ZXJ5U2VsZWN0b3JBbGwoJ1tkYnVpLXdlYi1jb21wb25lbnRdJykuZm9yRWFjaCgoY2hpbGQpID0+IHtcbiAgICAgICAgICBpZiAoY2hpbGQuaGFzQXR0cmlidXRlKCdpZCcpKSB7XG4gICAgICAgICAgICBjaGlsZC5zZXRBdHRyaWJ1dGUoJ2lkJywgYCR7aWRQcmVmaXh9JHtjaGlsZC5nZXRBdHRyaWJ1dGUoJ2lkJyl9JHtpZFN1ZmZpeH1gKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gY2xvbmU7XG4gICAgICB9XG5cblxuICAgICAgLyoqXG4gICAgICAgKlxuICAgICAgICogQHBhcmFtIG5hbWUgU3RyaW5nXG4gICAgICAgKiBAcGFyYW0gb2xkVmFsdWUgU3RyaW5nXG4gICAgICAgKiBAcGFyYW0gbmV3VmFsdWUgU3RyaW5nXG4gICAgICAgKi9cbiAgICAgIGF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjayhuYW1lLCBvbGRWYWx1ZSwgbmV3VmFsdWUpIHtcbiAgICAgICAgLy8gd2ViIGNvbXBvbmVudHMgc3RhbmRhcmQgQVBJXG4gICAgICAgIC8vIFNjZW5hcmlvIDE6IGNvbXBvbmVudCB3YXMgY3JlYXRlZCBpbiBkZXRhY2hlZCB0cmVlIEJFRk9SRSBiZWluZyBkZWZpbmVkLlxuICAgICAgICAvLyBhdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2sgd2lsbCBub3QgYmUgY2FsbGVkIHdoZW4gYmVpbmcgZGVmaW5lZCBidXQgd2hlbiBpbnNlcnRlZCBpbnRvIERPTS5cbiAgICAgICAgLy8gKHRoaXMgaW1wbGllcyBjb21wb25lbnQgaXMgdXBncmFkZWQgYWZ0ZXIgYmVpbmcgaW5zZXJ0ZWQgaW50byBET00pLlxuICAgICAgICAvLyBTY2VuYXJpbyAyOiBjb21wb25lbnQgaXMgY3JlYXRlZCBpbiBkZXRhY2hlZCB0cmVlIEFGVEVSIGJlaW5nIGRlZmluZWQuXG4gICAgICAgIC8vIGF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjayB3aWxsIGJlIGNhbGxlZCByaWdodCBhd2F5XG4gICAgICAgIC8vICh0aGlzIGltcGxpZXMgY29tcG9uZW50IGlzIHVwZ3JhZGVkIGJlZm9yZSBiZWluZyBpbnNlcnRlZCBpbnRvIERPTSkuXG4gICAgICAgIC8vIFdoZW4gaW5zZXJ0ZWQgaW4gRE9NIHRoZW4gY29ubmVjdGVkQ2FsbGJhY2sgd2lsbCBiZSBjYWxsZWQuXG4gICAgICAgIC8vIEluIGFueSBjYXNlIGF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjayBpcyBjYWxsZWQgYmVmb3JlIGNvbm5lY3RlZENhbGxiYWNrLlxuICAgICAgICAvLyBUaGluZ3MgY2hhbmdlZCBhcyBhIHJlc3VsdCBvZiBhdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2sgc2hvdWxkIGJlIHByZXNlcnZlZFxuICAgICAgICAvLyB3aGVuIGRpc2Nvbm5lY3RlZENhbGxiYWNrIGJlY2F1c2UgdGhlc2UgYXR0cmlidXRlIGNoYW5nZXMgd2lsbCBub3QgYmUgZmlyZWQgYWdhaW5cbiAgICAgICAgLy8gd2hlbiBub2RlIGlzIHJlbW92ZWQgdGhlbiByZS1pbnNlcnRlZCBiYWNrIGluIHRoZSBET00gdHJlZS5cbiAgICAgICAgaWYgKHRoaXMuZ2V0QXR0cmlidXRlKG5hbWUpID09PSBvbGRWYWx1ZSkgcmV0dXJuO1xuICAgICAgICB0aGlzLl9vbkF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjayhuYW1lLCBvbGRWYWx1ZSwgbmV3VmFsdWUpO1xuICAgICAgfVxuXG4gICAgICAvKipcbiAgICAgICAqXG4gICAgICAgKiBAcGFyYW0gbmFtZSBTdHJpbmdcbiAgICAgICAqIEBwYXJhbSBvbGRWYWx1ZSBTdHJpbmdcbiAgICAgICAqIEBwYXJhbSBuZXdWYWx1ZSBTdHJpbmdcbiAgICAgICAqIEBwcml2YXRlXG4gICAgICAgKi9cbiAgICAgIF9vbkF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjayhuYW1lLCBvbGRWYWx1ZSwgbmV3VmFsdWUpIHtcbiAgICAgICAgWydkaXInLCAnbGFuZycsICdzeW5jLWxvY2FsZS13aXRoJ10uaW5jbHVkZXMobmFtZSkgJiZcbiAgICAgICAgICB0aGlzLl9vbkxvY2FsZUF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjayhuYW1lLCBvbGRWYWx1ZSwgbmV3VmFsdWUpO1xuICAgICAgICBuYW1lID09PSAndW5zZWxlY3RhYmxlJyAmJlxuICAgICAgICAgIHRoaXMuX29uVW5zZWxlY3RhYmxlQXR0cmlidXRlQ2hhbmdlZCgpO1xuICAgICAgICAvLyBDYWxsIHB1YmxpYyBob29rLlxuICAgICAgICB0aGlzLm9uQXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrKG5hbWUsIG9sZFZhbHVlLCBuZXdWYWx1ZSk7XG4gICAgICB9XG5cbiAgICAgIC8qKlxuICAgICAgICogUHVibGljIGhvb2suXG4gICAgICAgKlxuICAgICAgICogQHBhcmFtIG5hbWUgU3RyaW5nXG4gICAgICAgKiBAcGFyYW0gb2xkVmFsdWUgU3RyaW5nXG4gICAgICAgKiBAcGFyYW0gbmV3VmFsdWUgU3RyaW5nXG4gICAgICAgKi9cbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZVxuICAgICAgb25BdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2sobmFtZSwgb2xkVmFsdWUsIG5ld1ZhbHVlKSB7XG4gICAgICAgIC8vIHBhc3NcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0ga2xhc3MgQ2xhc3NcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBkZWZpbmVDb21tb25TdGF0aWNNZXRob2RzKGtsYXNzKSB7XG4gICAgICBjb25zdCB0ZW1wbGF0ZUlubmVySFRNTCA9IGtsYXNzLnRlbXBsYXRlSW5uZXJIVE1MO1xuICAgICAgY29uc3QgdGVtcGxhdGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZW1wbGF0ZScpO1xuICAgICAgdGVtcGxhdGUuaW5uZXJIVE1MID0gdGVtcGxhdGVJbm5lckhUTUw7XG5cbiAgICAgIC8qKlxuICAgICAgICogQHByb3BlcnR5IHRlbXBsYXRlIChnZXR0ZXIpIHRlbXBsYXRlIGVsZW1lbnRcbiAgICAgICAqL1xuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGtsYXNzLCAndGVtcGxhdGUnLCB7XG4gICAgICAgIGdldCgpIHsgcmV0dXJuIHRlbXBsYXRlOyB9LFxuICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgICB9KTtcblxuICAgICAgLyoqXG4gICAgICAgKiBAcHJvcGVydHkgY29tcG9uZW50U3R5bGUgKGdldHRlci9zZXR0ZXIpIFN0cmluZ1xuICAgICAgICovXG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoa2xhc3MsICdjb21wb25lbnRTdHlsZScsIHtcbiAgICAgICAgZ2V0KCkge1xuICAgICAgICAgIHJldHVybiBrbGFzcy50ZW1wbGF0ZS5jb250ZW50LnF1ZXJ5U2VsZWN0b3IoJ3N0eWxlJykuaW5uZXJIVE1MO1xuICAgICAgICB9LFxuICAgICAgICBzZXQodmFsdWUpIHtcbiAgICAgICAgICBrbGFzcy50ZW1wbGF0ZS5jb250ZW50LnF1ZXJ5U2VsZWN0b3IoJ3N0eWxlJykuaW5uZXJIVE1MID0gdmFsdWU7XG4gICAgICAgIH0sXG4gICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICAgIH0pO1xuXG4gICAgICByZXR1cm4ga2xhc3M7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gUmVnaXN0ZXJhYmxlKGtsYXNzKSB7XG4gICAgICBrbGFzcy5yZWdpc3RlclNlbGYgPSAoKSA9PiB7XG4gICAgICAgIGNvbnN0IHJlZ2lzdHJhdGlvbk5hbWUgPSBrbGFzcy5yZWdpc3RyYXRpb25OYW1lO1xuICAgICAgICBjb25zdCBkZXBlbmRlbmNpZXMgPSBrbGFzcy5kZXBlbmRlbmNpZXM7XG4gICAgICAgIC8vIE1ha2Ugc3VyZSBvdXIgZGVwZW5kZW5jaWVzIGFyZSByZWdpc3RlcmVkIGJlZm9yZSB3ZSByZWdpc3RlciBzZWxmXG4gICAgICAgIGRlcGVuZGVuY2llcy5mb3JFYWNoKChkZXBlbmRlbmN5KSA9PiBkZXBlbmRlbmN5LnJlZ2lzdGVyU2VsZigpKTtcbiAgICAgICAgLy8gRG9uJ3QgdHJ5IHRvIHJlZ2lzdGVyIHNlbGYgaWYgYWxyZWFkeSByZWdpc3RlcmVkXG4gICAgICAgIGlmIChjdXN0b21FbGVtZW50cy5nZXQocmVnaXN0cmF0aW9uTmFtZSkpIHJldHVybiByZWdpc3RyYXRpb25OYW1lO1xuICAgICAgICAvLyBHaXZlIGEgY2hhbmNlIHRvIG92ZXJyaWRlIHdlYi1jb21wb25lbnQgc3R5bGUgaWYgcHJvdmlkZWQgYmVmb3JlIGJlaW5nIHJlZ2lzdGVyZWQuXG4gICAgICAgIGNvbnN0IGNvbXBvbmVudFN0eWxlID0gKCh3aW4uREJVSVdlYkNvbXBvbmVudHMgfHwge30pW3JlZ2lzdHJhdGlvbk5hbWVdIHx8IHt9KS5jb21wb25lbnRTdHlsZTtcbiAgICAgICAgaWYgKGNvbXBvbmVudFN0eWxlKSB7XG4gICAgICAgICAga2xhc3MuY29tcG9uZW50U3R5bGUgKz0gJ1xcblxcbi8qID09PT0gb3ZlcnJpZGVzID09PT0gKi9cXG5cXG4nO1xuICAgICAgICAgIGtsYXNzLmNvbXBvbmVudFN0eWxlICs9IGNvbXBvbmVudFN0eWxlO1xuICAgICAgICB9XG4gICAgICAgIC8vIERvIHJlZ2lzdHJhdGlvblxuICAgICAgICAvLyBodHRwczovL2h0bWwuc3BlYy53aGF0d2cub3JnL211bHRpcGFnZS9jdXN0b20tZWxlbWVudHMuaHRtbCNjb25jZXB0LXVwZ3JhZGUtYW4tZWxlbWVudFxuICAgICAgICBjdXN0b21FbGVtZW50cy5kZWZpbmUocmVnaXN0cmF0aW9uTmFtZSwga2xhc3MpO1xuICAgICAgICByZXR1cm4gcmVnaXN0cmF0aW9uTmFtZTtcbiAgICAgIH07XG5cbiAgICAgIC8qKlxuICAgICAgICogQHByb3BlcnR5IHByb3RvdHlwZUNoYWluSW5mbyAoZ2V0dGVyKSBBcnJheTxQcm90b3R5cGU+XG4gICAgICAgKi9cbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShrbGFzcywgJ3Byb3RvdHlwZUNoYWluSW5mbycsIHtcbiAgICAgICAgZ2V0KCkge1xuICAgICAgICAgIGNvbnN0IGNoYWluID0gW2tsYXNzXTtcbiAgICAgICAgICBsZXQgcGFyZW50UHJvdG8gPSBPYmplY3QuZ2V0UHJvdG90eXBlT2Yoa2xhc3MpO1xuICAgICAgICAgIHdoaWxlIChwYXJlbnRQcm90byAhPT0gSFRNTEVsZW1lbnQpIHtcbiAgICAgICAgICAgIGNoYWluLnB1c2gocGFyZW50UHJvdG8pO1xuICAgICAgICAgICAgcGFyZW50UHJvdG8gPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YocGFyZW50UHJvdG8pO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjaGFpbi5wdXNoKHBhcmVudFByb3RvKTtcbiAgICAgICAgICByZXR1cm4gY2hhaW47XG4gICAgICAgIH0sXG4gICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICAgIH0pO1xuXG4gICAgICByZXR1cm4ga2xhc3M7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIERCVUlXZWJDb21wb25lbnRCYXNlLFxuICAgICAgZGVmaW5lQ29tbW9uU3RhdGljTWV0aG9kcyxcbiAgICAgIFJlZ2lzdGVyYWJsZVxuICAgIH07XG4gIH0pO1xufVxuIiwiXG5jb25zdCByZWFkT25seVByb3BlcnRpZXMgPSBbJ2ZvY3VzZWQnXTtcblxuY29uc3QgRVJST1JfTUVTU0FHRVMgPSB7XG4gIGZvY3VzZWQ6IGAnZm9jdXNlZCcgcHJvcGVydHkgaXMgcmVhZC1vbmx5IGFzIGl0IGlzIGNvbnRyb2xsZWQgYnkgdGhlIGNvbXBvbmVudC5cbklmIHlvdSB3YW50IHRvIHNldCBmb2N1cyBwcm9ncmFtbWF0aWNhbGx5IGNhbGwgLmZvY3VzKCkgbWV0aG9kIG9uIGNvbXBvbmVudC5cbmBcbn07XG5cbi8qKlxuICogV2hlbiBhbiBpbm5lciBmb2N1c2FibGUgaXMgZm9jdXNlZCAoZXg6IHZpYSBjbGljaykgdGhlIGVudGlyZSBjb21wb25lbnQgZ2V0cyBmb2N1c2VkLlxuICogV2hlbiB0aGUgY29tcG9uZW50IGdldHMgZm9jdXNlZCAoZXg6IHZpYSB0YWIpIHRoZSBmaXJzdCBpbm5lciBmb2N1c2FibGUgZ2V0cyBmb2N1c2VkIHRvby5cbiAqIFdoZW4gdGhlIGNvbXBvbmVudCBnZXRzIGRpc2FibGVkIGl0IGdldHMgYmx1cnJlZCB0b28gYW5kIGFsbCBpbm5lciBmb2N1c2FibGVzIGdldCBkaXNhYmxlZCBhbmQgYmx1cnJlZC5cbiAqIFdoZW4gZGlzYWJsZWQgdGhlIGNvbXBvbmVudCBjYW5ub3QgYmUgZm9jdXNlZC5cbiAqIFdoZW4gZW5hYmxlZCB0aGUgY29tcG9uZW50IGNhbiBiZSBmb2N1c2VkLlxuICogQHBhcmFtIEtsYXNzXG4gKiBAcmV0dXJucyB7Rm9jdXNhYmxlfVxuICogQGNvbnN0cnVjdG9yXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEZvY3VzYWJsZShLbGFzcykge1xuXG4gIEtsYXNzLmNvbXBvbmVudFN0eWxlICs9IGBcbiAgOmhvc3QoW2Rpc2FibGVkXSkge1xuICAgIGN1cnNvcjogbm90LWFsbG93ZWQ7XG4gICAgb3BhY2l0eTogMC41O1xuICAgIFxuICAgIC13ZWJraXQtdG91Y2gtY2FsbG91dDogbm9uZTtcbiAgICAtd2Via2l0LXVzZXItc2VsZWN0OiBub25lO1xuICAgIC1raHRtbC11c2VyLXNlbGVjdDogbm9uZTtcbiAgICAtbW96LXVzZXItc2VsZWN0OiBub25lO1xuICAgIC1tcy11c2VyLXNlbGVjdDogbm9uZTtcbiAgICB1c2VyLXNlbGVjdDogbm9uZTtcbiAgfVxuICBcbiAgOmhvc3QoW2Rpc2FibGVkXSkgKiB7XG4gICAgcG9pbnRlci1ldmVudHM6IG5vbmU7XG4gIH1cbiAgYDtcblxuICAvLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9DU1MvOmZvY3VzLXdpdGhpblxuXG4gIGNsYXNzIEZvY3VzYWJsZSBleHRlbmRzIEtsYXNzIHtcblxuICAgIHN0YXRpYyBnZXQgbmFtZSgpIHtcbiAgICAgIHJldHVybiBzdXBlci5uYW1lO1xuICAgIH1cblxuICAgIHN0YXRpYyBnZXQgcHJvcGVydGllc1RvVXBncmFkZSgpIHtcbiAgICAgIC8vIFRoZSByZWFzb24gZm9yIHVwZ3JhZGluZyAnZm9jdXNlZCcgaXMgb25seSB0byBzaG93IGFuIHdhcm5pbmdcbiAgICAgIC8vIGlmIHRoZSBjb25zdW1lciBvZiB0aGUgY29tcG9uZW50IGF0dGVtcHRlZCB0byBzZXQgZm9jdXMgcHJvcGVydHlcbiAgICAgIC8vIHdoaWNoIGlzIHJlYWQtb25seS5cbiAgICAgIHJldHVybiBbLi4uc3VwZXIucHJvcGVydGllc1RvVXBncmFkZSwgJ2ZvY3VzZWQnLCAnZGlzYWJsZWQnXTtcbiAgICB9XG5cbiAgICBzdGF0aWMgZ2V0IG9ic2VydmVkQXR0cmlidXRlcygpIHtcbiAgICAgIHJldHVybiBbLi4uc3VwZXIub2JzZXJ2ZWRBdHRyaWJ1dGVzLCAnZGlzYWJsZWQnXTtcbiAgICB9XG5cbiAgICBjb25zdHJ1Y3RvciguLi5hcmdzKSB7XG4gICAgICBzdXBlciguLi5hcmdzKTtcblxuICAgICAgdGhpcy5fY3VycmVudElubmVyRm9jdXNlZCA9IG51bGw7XG4gICAgICB0aGlzLl9zaWRlRWZmZWN0c0FwcGxpZWRGb3IgPSBudWxsO1xuICAgICAgdGhpcy5fb25Jbm5lckZvY3VzYWJsZUZvY3VzZWQgPSB0aGlzLl9vbklubmVyRm9jdXNhYmxlRm9jdXNlZC5iaW5kKHRoaXMpO1xuICAgICAgdGhpcy5fb25Gb2N1cyA9IHRoaXMuX29uRm9jdXMuYmluZCh0aGlzKTtcbiAgICAgIHRoaXMuX29uQmx1ciA9IHRoaXMuX29uQmx1ci5iaW5kKHRoaXMpO1xuICAgICAgdGhpcy5fb25Eb2N1bWVudFRhcCA9IHRoaXMuX29uRG9jdW1lbnRUYXAuYmluZCh0aGlzKTtcbiAgICB9XG5cbiAgICBhdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2sobmFtZSwgb2xkVmFsdWUsIG5ld1ZhbHVlKSB7XG4gICAgICBzdXBlci5hdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2sobmFtZSwgb2xkVmFsdWUsIG5ld1ZhbHVlKTtcblxuICAgICAgY29uc3QgaGFzVmFsdWUgPSBuZXdWYWx1ZSAhPT0gbnVsbDtcbiAgICAgIGlmIChuYW1lID09PSAnZGlzYWJsZWQnKSB7XG4gICAgICAgIGhhc1ZhbHVlID8gdGhpcy5fYXBwbHlEaXNhYmxlZFNpZGVFZmZlY3RzKCkgOiB0aGlzLl9hcHBseUVuYWJsZWRTaWRlRWZmZWN0cygpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGNvbm5lY3RlZENhbGxiYWNrKCkge1xuICAgICAgc3VwZXIuY29ubmVjdGVkQ2FsbGJhY2soKTtcblxuICAgICAgcmVhZE9ubHlQcm9wZXJ0aWVzLmZvckVhY2goKHJlYWRPbmx5UHJvcGVydHkpID0+IHtcbiAgICAgICAgaWYgKHRoaXMuaGFzQXR0cmlidXRlKHJlYWRPbmx5UHJvcGVydHkpKSB7XG4gICAgICAgICAgdGhpcy5yZW1vdmVBdHRyaWJ1dGUocmVhZE9ubHlQcm9wZXJ0eSk7XG4gICAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lXG4gICAgICAgICAgY29uc29sZS53YXJuKEVSUk9SX01FU1NBR0VTW3JlYWRPbmx5UHJvcGVydHldKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIGlmICh0aGlzLmRpc2FibGVkKSB7XG4gICAgICAgIHRoaXMuX2FwcGx5RGlzYWJsZWRTaWRlRWZmZWN0cygpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fYXBwbHlFbmFibGVkU2lkZUVmZmVjdHMoKTtcbiAgICAgIH1cblxuICAgICAgLy8gd2hlbiBjb21wb25lbnQgZm9jdXNlZC9ibHVycmVkXG4gICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoJ2ZvY3VzJywgdGhpcy5fb25Gb2N1cyk7XG4gICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoJ2JsdXInLCB0aGlzLl9vbkJsdXIpO1xuICAgICAgdGhpcy5vd25lckRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIHRoaXMuX29uRG9jdW1lbnRUYXApO1xuICAgICAgdGhpcy5vd25lckRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCB0aGlzLl9vbkRvY3VtZW50VGFwKTtcblxuICAgICAgdGhpcy5faW5uZXJGb2N1c2FibGVzLmZvckVhY2goKGZvY3VzYWJsZSkgPT4ge1xuICAgICAgICAvLyB3aGVuIGlubmVyIGZvY3VzYWJsZSBmb2N1c2VkXG4gICAgICAgIGZvY3VzYWJsZS5hZGRFdmVudExpc3RlbmVyKCdmb2N1cycsIHRoaXMuX29uSW5uZXJGb2N1c2FibGVGb2N1c2VkKTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGRpc2Nvbm5lY3RlZENhbGxiYWNrKCkge1xuICAgICAgc3VwZXIuZGlzY29ubmVjdGVkQ2FsbGJhY2soKTtcblxuICAgICAgdGhpcy5yZW1vdmVFdmVudExpc3RlbmVyKCdmb2N1cycsIHRoaXMuX29uRm9jdXMpO1xuICAgICAgdGhpcy5yZW1vdmVFdmVudExpc3RlbmVyKCdibHVyJywgdGhpcy5fb25CbHVyKTtcbiAgICAgIHRoaXMub3duZXJEb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCB0aGlzLl9vbkRvY3VtZW50VGFwKTtcbiAgICAgIHRoaXMub3duZXJEb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCd0b3VjaHN0YXJ0JywgdGhpcy5fb25Eb2N1bWVudFRhcCk7XG5cbiAgICAgIHRoaXMuX2lubmVyRm9jdXNhYmxlcy5mb3JFYWNoKChmb2N1c2FibGUpID0+IHtcbiAgICAgICAgZm9jdXNhYmxlLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2ZvY3VzJywgdGhpcy5fb25Jbm5lckZvY3VzYWJsZUZvY3VzZWQpO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmVhZCBvbmx5LlxuICAgICAqIEByZXR1cm4gQm9vbGVhblxuICAgICAqL1xuICAgIGdldCBmb2N1c2VkKCkge1xuICAgICAgcmV0dXJuIHRoaXMuaGFzQXR0cmlidXRlKCdmb2N1c2VkJyk7XG4gICAgfVxuXG4gICAgc2V0IGZvY3VzZWQoXykge1xuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lXG4gICAgICBjb25zb2xlLndhcm4oRVJST1JfTUVTU0FHRVMuZm9jdXNlZCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIEJvb2xlYW5cbiAgICAgKi9cbiAgICBnZXQgZGlzYWJsZWQoKSB7XG4gICAgICByZXR1cm4gdGhpcy5oYXNBdHRyaWJ1dGUoJ2Rpc2FibGVkJyk7XG4gICAgfVxuXG4gICAgc2V0IGRpc2FibGVkKHZhbHVlKSB7XG4gICAgICBjb25zdCBoYXNWYWx1ZSA9IEJvb2xlYW4odmFsdWUpO1xuICAgICAgaWYgKGhhc1ZhbHVlKSB7XG4gICAgICAgIHRoaXMuc2V0QXR0cmlidXRlKCdkaXNhYmxlZCcsICcnKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMucmVtb3ZlQXR0cmlidXRlKCdkaXNhYmxlZCcpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqXG4gICAgICogQHJldHVybiBBcnJheTxIVE1MRWxlbWVudD5cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIGdldCBfaW5uZXJGb2N1c2FibGVzKCkge1xuICAgICAgcmV0dXJuIHRoaXMuc2hhZG93Um9vdC5xdWVyeVNlbGVjdG9yQWxsKCdbdGFiaW5kZXhdJykgfHwgW107XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIEhUTUxFbGVtZW50IHx8IG51bGxcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIGdldCBfZmlyc3RJbm5lckZvY3VzYWJsZSgpIHtcbiAgICAgIHJldHVybiB0aGlzLnNoYWRvd1Jvb3QucXVlcnlTZWxlY3RvcignW3RhYmluZGV4XScpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqXG4gICAgICogQHBhcmFtIGV2dCBFdmVudCAobW91c2Vkb3duL3RvdWNoc3RhcnQpXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBfb25Eb2N1bWVudFRhcChldnQpIHtcbiAgICAgIGlmIChldnQudGFyZ2V0ICE9PSB0aGlzKSB7XG4gICAgICAgIHRoaXMuYmx1cigpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqXG4gICAgICogQHBhcmFtIGV2dCBFdmVudCAoRm9jdXNFdmVudClcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIF9vbklubmVyRm9jdXNhYmxlRm9jdXNlZChldnQpIHtcbiAgICAgIHRoaXMuX2N1cnJlbnRJbm5lckZvY3VzZWQgPSBldnQudGFyZ2V0O1xuICAgIH1cblxuICAgIF9vbkZvY3VzKCkge1xuICAgICAgaWYgKHRoaXMuZGlzYWJsZWQpIHJldHVybjtcbiAgICAgIC8vIE9ubHkgZm9yIHN0eWxpbmcgcHVycG9zZS5cbiAgICAgIC8vIEZvY3VzZWQgcHJvcGVydHkgaXMgY29udHJvbGxlZCBmcm9tIGluc2lkZS5cbiAgICAgIC8vIEF0dGVtcHQgdG8gc2V0IHRoaXMgcHJvcGVydHkgZnJvbSBvdXRzaWRlIHdpbGwgdHJpZ2dlciBhIHdhcm5pbmdcbiAgICAgIC8vIGFuZCB3aWxsIGJlIGlnbm9yZWRcbiAgICAgIHRoaXMuc2V0QXR0cmlidXRlKCdmb2N1c2VkJywgJycpO1xuICAgICAgdGhpcy5fYXBwbHlGb2N1c1NpZGVFZmZlY3RzKCk7XG4gICAgfVxuXG4gICAgX29uQmx1cigpIHtcbiAgICAgIHRoaXMucmVtb3ZlQXR0cmlidXRlKCdmb2N1c2VkJyk7XG4gICAgICB0aGlzLl9hcHBseUJsdXJTaWRlRWZmZWN0cygpO1xuICAgIH1cblxuICAgIF9hcHBseUZvY3VzU2lkZUVmZmVjdHMoKSB7XG4gICAgICBpZiAodGhpcy5fY3VycmVudElubmVyRm9jdXNlZCkge1xuICAgICAgICAvLyBTb21lIGlubmVyIGNvbXBvbmVudCBpcyBhbHJlYWR5IGZvY3VzZWQuXG4gICAgICAgIC8vIE5vIG5lZWQgdG8gc2V0IGZvY3VzIG9uIGFueXRoaW5nLlxuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICB0aGlzLl9mb2N1c0ZpcnN0SW5uZXJGb2N1c2FibGUoKTtcbiAgICB9XG5cbiAgICBfYXBwbHlCbHVyU2lkZUVmZmVjdHMoKSB7XG4gICAgICBpZiAodGhpcy5fY3VycmVudElubmVyRm9jdXNlZCkge1xuICAgICAgICB0aGlzLl9jdXJyZW50SW5uZXJGb2N1c2VkLmJsdXIoKTtcbiAgICAgICAgdGhpcy5fY3VycmVudElubmVyRm9jdXNlZCA9IG51bGw7XG4gICAgICB9XG4gICAgfVxuXG4gICAgX2ZvY3VzRmlyc3RJbm5lckZvY3VzYWJsZSgpIHtcbiAgICAgIGNvbnN0IGZpcnN0SW5uZXJGb2N1c2FibGUgPSB0aGlzLl9maXJzdElubmVyRm9jdXNhYmxlO1xuICAgICAgaWYgKGZpcnN0SW5uZXJGb2N1c2FibGUpIHtcbiAgICAgICAgdGhpcy5fY3VycmVudElubmVyRm9jdXNlZCA9IGZpcnN0SW5uZXJGb2N1c2FibGU7XG4gICAgICAgIGZpcnN0SW5uZXJGb2N1c2FibGUuZm9jdXMoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBfYXBwbHlEaXNhYmxlZFNpZGVFZmZlY3RzKCkge1xuICAgICAgaWYgKHRoaXMuX3NpZGVFZmZlY3RzQXBwbGllZEZvciA9PT0gJ2Rpc2FibGVkJykgcmV0dXJuO1xuICAgICAgdGhpcy5fbGFzdFRhYkluZGV4VmFsdWUgPSB0aGlzLmdldEF0dHJpYnV0ZSgndGFiaW5kZXgnKTtcbiAgICAgIHRoaXMucmVtb3ZlQXR0cmlidXRlKCd0YWJpbmRleCcpO1xuICAgICAgdGhpcy5faW5uZXJGb2N1c2FibGVzLmZvckVhY2goKGlubmVyRm9jdXNhYmxlKSA9PiB7XG4gICAgICAgIGlubmVyRm9jdXNhYmxlLnNldEF0dHJpYnV0ZSgndGFiaW5kZXgnLCAnLTEnKTtcbiAgICAgICAgaW5uZXJGb2N1c2FibGUuc2V0QXR0cmlidXRlKCdkaXNhYmxlZCcsICdkaXNhYmxlZCcpO1xuICAgICAgICBpZiAoaW5uZXJGb2N1c2FibGUuaGFzQXR0cmlidXRlKCdjb250ZW50ZWRpdGFibGUnKSkge1xuICAgICAgICAgIGlubmVyRm9jdXNhYmxlLnNldEF0dHJpYnV0ZSgnY29udGVudGVkaXRhYmxlJywgJ2ZhbHNlJyk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgdGhpcy5ibHVyKCk7XG4gICAgICB0aGlzLl9zaWRlRWZmZWN0c0FwcGxpZWRGb3IgPSAnZGlzYWJsZWQnO1xuICAgIH1cblxuICAgIF9hcHBseUVuYWJsZWRTaWRlRWZmZWN0cygpIHtcbiAgICAgIGlmICh0aGlzLl9zaWRlRWZmZWN0c0FwcGxpZWRGb3IgPT09ICdlbmFibGVkJykgcmV0dXJuO1xuICAgICAgIXRoaXMuZ2V0QXR0cmlidXRlKCd0YWJpbmRleCcpICYmIHRoaXMuc2V0QXR0cmlidXRlKCd0YWJpbmRleCcsIHRoaXMuX2xhc3RUYWJJbmRleFZhbHVlIHx8IDApO1xuICAgICAgdGhpcy5faW5uZXJGb2N1c2FibGVzLmZvckVhY2goKGlubmVyRm9jdXNhYmxlKSA9PiB7XG4gICAgICAgIGlubmVyRm9jdXNhYmxlLnNldEF0dHJpYnV0ZSgndGFiaW5kZXgnLCAnMCcpO1xuICAgICAgICBpbm5lckZvY3VzYWJsZS5yZW1vdmVBdHRyaWJ1dGUoJ2Rpc2FibGVkJyk7XG4gICAgICAgIGlmIChpbm5lckZvY3VzYWJsZS5oYXNBdHRyaWJ1dGUoJ2NvbnRlbnRlZGl0YWJsZScpKSB7XG4gICAgICAgICAgaW5uZXJGb2N1c2FibGUuc2V0QXR0cmlidXRlKCdjb250ZW50ZWRpdGFibGUnLCAndHJ1ZScpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHRoaXMuX3NpZGVFZmZlY3RzQXBwbGllZEZvciA9ICdlbmFibGVkJztcbiAgICB9XG4gIH1cblxuICByZXR1cm4gRm9jdXNhYmxlO1xufVxuIiwiaW1wb3J0IGFwcGVuZFN0eWxlcyBmcm9tICcuLi8uLi9pbnRlcm5hbHMvYXBwZW5kU3R5bGVzJztcblxuLyoqXG4qIEBwYXJhbSBjb21wb25lbnRzIEFycmF5PE9iamVjdD4gW3tcbiogIHJlZ2lzdHJhdGlvbk5hbWUsXG4qICBjb21wb25lbnRTdHlsZSxcbiogIC4uLlxuKiB9XVxuKiBAcmV0dXJucyBjb21wb25lbnRzIEFycmF5PE9iamVjdD5cbiovXG5jb25zdCBkYnVpV2ViQ29tcG9uZW50c1NldFVwID0gKHdpbikgPT4gKGNvbXBvbmVudHMpID0+IHtcbiAgcmV0dXJuIGFwcGVuZFN0eWxlcyh3aW4pKGNvbXBvbmVudHMpO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgZGJ1aVdlYkNvbXBvbmVudHNTZXRVcDtcbiIsIi8qIGVzbGludCBtYXgtbGVuOiAwICovXG4vLyBIZWxwZXJzXG5pbXBvcnQgZGJ1aVdlYkNvbXBvbmVudHNTZXRVcCBmcm9tICcuL3dlYi1jb21wb25lbnRzL2hlbHBlcnMvZGJ1aVdlYkNvbXBvbmVudHNTZXR1cCc7XG5cbi8vIEludGVybmFsc1xuaW1wb3J0IGVuc3VyZVNpbmdsZVJlZ2lzdHJhdGlvbiBmcm9tICcuL2ludGVybmFscy9lbnN1cmVTaW5nbGVSZWdpc3RyYXRpb24nO1xuXG4vLyBDb21wb25lbnRCYXNlXG5pbXBvcnQgZ2V0REJVSVdlYkNvbXBvbmVudENvcmUgZnJvbSAnLi93ZWItY29tcG9uZW50cy9jb21wb25lbnRzL0RCVUlXZWJDb21wb25lbnRDb3JlL0RCVUlXZWJDb21wb25lbnRDb3JlJztcblxuLy8gRGVjb3JhdG9yc1xuaW1wb3J0IEZvY3VzYWJsZSBmcm9tICcuL3dlYi1jb21wb25lbnRzL2RlY29yYXRvcnMvRm9jdXNhYmxlJztcblxuLy8gU2VydmljZXNcbmltcG9ydCBnZXREQlVJTG9jYWxlU2VydmljZSBmcm9tICcuL3NlcnZpY2VzL0RCVUlMb2NhbGVTZXJ2aWNlJztcbmltcG9ydCBnZXREQlVJSTE4blNlcnZpY2UgZnJvbSAnLi9zZXJ2aWNlcy9EQlVJSTE4blNlcnZpY2UnO1xuXG4vLyBVdGlsc1xuaW1wb3J0IGZvcm1hdHRlcnMgZnJvbSAnLi91dGlscy9mb3JtYXR0ZXJzJztcbmltcG9ydCB0b2dnbGVTZWxlY3RhYmxlIGZyb20gJy4vdXRpbHMvdG9nZ2xlU2VsZWN0YWJsZSc7XG5pbXBvcnQgdGVtcGxhdGUgZnJvbSAnLi91dGlscy90ZW1wbGF0ZSc7XG5pbXBvcnQgb25TY3JlZW5Db25zb2xlIGZyb20gJy4vdXRpbHMvb25TY3JlZW5Db25zb2xlJztcblxuLy8gQ29tcG9uZW50c1xuaW1wb3J0IGdldERCVUlEdW1teSBmcm9tICcuL3dlYi1jb21wb25lbnRzL2NvbXBvbmVudHMvREJVSUR1bW15L0RCVUlEdW1teSc7XG5pbXBvcnQgZ2V0REJVSUR1bW15UGFyZW50IGZyb20gJy4vd2ViLWNvbXBvbmVudHMvY29tcG9uZW50cy9EQlVJRHVtbXlQYXJlbnQvREJVSUR1bW15UGFyZW50JztcbmltcG9ydCBnZXREQlVJRm9ybUlucHV0VGV4dCBmcm9tICcuL3dlYi1jb21wb25lbnRzL2NvbXBvbmVudHMvREJVSUZvcm1JbnB1dFRleHQvREJVSUZvcm1JbnB1dFRleHQnO1xuaW1wb3J0IGdldERCVUlJY29uIGZyb20gJy4vd2ViLWNvbXBvbmVudHMvY29tcG9uZW50cy9EQlVJSWNvbi9EQlVJSWNvbic7XG5pbXBvcnQgZ2V0REJVSVRyYW5zbGF0ZWQgZnJvbSAnLi93ZWItY29tcG9uZW50cy9jb21wb25lbnRzL0RCVUlUcmFuc2xhdGVkL0RCVUlUcmFuc2xhdGVkJztcblxuY29uc3QgcmVnaXN0cmF0aW9ucyA9IHtcbiAgW2dldERCVUlEdW1teS5yZWdpc3RyYXRpb25OYW1lXTpcbiAgICBnZXREQlVJRHVtbXksXG4gIFtnZXREQlVJRHVtbXlQYXJlbnQucmVnaXN0cmF0aW9uTmFtZV06XG4gICAgZ2V0REJVSUR1bW15UGFyZW50LFxuICBbZ2V0REJVSUZvcm1JbnB1dFRleHQucmVnaXN0cmF0aW9uTmFtZV06XG4gICAgZ2V0REJVSUZvcm1JbnB1dFRleHQsXG4gIFtnZXREQlVJSWNvbi5yZWdpc3RyYXRpb25OYW1lXTpcbiAgICBnZXREQlVJSWNvbixcbiAgW2dldERCVUlUcmFuc2xhdGVkLnJlZ2lzdHJhdGlvbk5hbWVdOlxuICAgIGdldERCVUlUcmFuc2xhdGVkXG59O1xuXG4vKlxuVGhpcyBoZWxwZXIgZnVuY3Rpb24gaXMganVzdCBmb3IgY29udmVuaWVuY2UuXG5Vc2luZyBpdCBpbXBsaWVzIHRoYXQgZW50aXJlIERCVUlXZWJDb21wb25lbnRzIGxpYnJhcnkgaXMgYWxyZWFkeSBsb2FkZWQuXG5JdCBpcyB1c2VmdWwgZXNwZWNpYWxseSB3aGVuIHdvcmtpbmcgd2l0aCBkaXN0cmlidXRpb24gYnVpbGQuXG5JZiBvbmUgd2FudHMgdG8gbG9hZCBqdXN0IG9uZSB3ZWItY29tcG9uZW50IG9yIGEgc3Vic2V0IG9mIGNvcmVcbnRoZXkgc2hvdWxkIGJlIGxvYWRlZCBmcm9tIG5vZGVfbW9kdWxlcy9kZXYtYm94LXVpL2NvcmUgYnkgdGhlaXIgcGF0aFxuZXg6XG5pbXBvcnQgU29tZUNvbXBvbmVudExvYWRlciBmcm9tIG5vZGVfbW9kdWxlcy9kZXYtYm94LXVpL2NvcmUvcGF0aC90by9Tb21lQ29tcG9uZW50O1xuKi9cbmZ1bmN0aW9uIHF1aWNrU2V0dXBBbmRMb2FkKHdpbiA9IHdpbmRvdykge1xuICAvKipcbiAgICogQHBhcmFtIGNvbXBvbmVudHMgT2JqZWN0IHtcbiAgICogIHJlZ2lzdHJhdGlvbk5hbWUsXG4gICAqICBjb21wb25lbnRTdHlsZVxuICAgKiB9XG4gICAqIEByZXR1cm4gT2JqZWN0IHsgPHJlZ2lzdHJhdGlvbk5hbWU+LCA8Y29tcG9uZW50Q2xhc3M+IH1cbiAgICovXG4gIHJldHVybiAoY29tcG9uZW50cykgPT4ge1xuICAgIHJldHVybiBkYnVpV2ViQ29tcG9uZW50c1NldFVwKHdpbikoY29tcG9uZW50cylcbiAgICAgIC5yZWR1Y2UoKGFjYywgeyByZWdpc3RyYXRpb25OYW1lIH0pID0+IHtcbiAgICAgICAgY29uc3QgY29tcG9uZW50Q2xhc3MgPSByZWdpc3RyYXRpb25zW3JlZ2lzdHJhdGlvbk5hbWVdKHdpbmRvdyk7XG4gICAgICAgIGNvbXBvbmVudENsYXNzLnJlZ2lzdGVyU2VsZigpO1xuICAgICAgICBhY2NbcmVnaXN0cmF0aW9uTmFtZV0gPSBjb21wb25lbnRDbGFzcztcbiAgICAgICAgcmV0dXJuIGFjYztcbiAgICAgIH0sIHt9KTtcbiAgfTtcbn1cblxuZXhwb3J0IHtcbiAgcmVnaXN0cmF0aW9ucyxcblxuICAvLyBIZWxwZXJzXG4gIHF1aWNrU2V0dXBBbmRMb2FkLFxuICBkYnVpV2ViQ29tcG9uZW50c1NldFVwLFxuXG4gIC8vIEludGVybmFsc1xuICBlbnN1cmVTaW5nbGVSZWdpc3RyYXRpb24sXG5cbiAgLy8gQ29tcG9uZW50Q29yZVxuICBnZXREQlVJV2ViQ29tcG9uZW50Q29yZSxcblxuICAvLyBEZWNvcmF0b3JzXG4gIEZvY3VzYWJsZSxcblxuICAvLyBTZXJ2aWNlc1xuICBnZXREQlVJTG9jYWxlU2VydmljZSxcbiAgZ2V0REJVSUkxOG5TZXJ2aWNlLFxuXG4gIC8vIFV0aWxzXG4gIGZvcm1hdHRlcnMsXG4gIHRvZ2dsZVNlbGVjdGFibGUsXG4gIHRlbXBsYXRlLFxuICBvblNjcmVlbkNvbnNvbGUsXG5cbiAgLy8gQ29tcG9uZW50c1xuICBnZXREQlVJRHVtbXksXG4gIGdldERCVUlEdW1teVBhcmVudCxcbiAgZ2V0REJVSUZvcm1JbnB1dFRleHQsXG4gIGdldERCVUlJY29uLFxuICBnZXREQlVJVHJhbnNsYXRlZFxufTtcblxuLyogZXNsaW50IG5vLWNvbnNvbGU6IDAgKi9cblxubGV0IGJ1aWxkID0gJ3Byb2R1Y3Rpb24nO1xuXG5pZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICBidWlsZCA9ICdkZXZlbG9wJztcbn1cblxuY29uc29sZS5sb2coYFVzaW5nIERCVUlXZWJDb21wb25lbnRzRGlzdExpYiAke2J1aWxkfSBidWlsZC5gKTtcblxuIl19
