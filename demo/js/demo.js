(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{}],3:[function(require,module,exports){
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
        const registrationName = klass.registrationName;
        const dependencies = klass.dependencies;
        // Make sure our dependencies are registered before we register self
        dependencies.forEach(dependency => dependency.registerSelf());
        // Don't try to register self if already registered
        if (customElements.get(registrationName)) return registrationName;
        // Give a chance to override web-component style if provided before being registered.
        const componentStyle = ((win.DBUWebComponents || {})[registrationName] || {}).componentStyle;
        if (componentStyle) {
          klass.componentStyle += componentStyle;
        }
        // Do registration
        customElements.define(registrationName, klass);
        return registrationName;
      };
    }

    return {
      DBUWebComponentBase,
      defineCommonStaticMethods
    };
  });
}

},{"../../services/LocaleService":2,"../internals/ensureSingleRegistration":7}],4:[function(require,module,exports){
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
      static get registrationName() {
        return registrationName;
      }

      static get template() {
        return template;
      }

      onLocaleChange(locale) {
        // console.log('onLocaleChange', locale);
      }
    }

    defineCommonStaticMethods(DBUWebComponentDummy);

    return DBUWebComponentDummy;
  });
}

getDBUWebComponentDummy.registrationName = registrationName;

},{"../DBUWebComponentBase/DBUWebComponentBase":3,"../internals/ensureSingleRegistration":7}],5:[function(require,module,exports){
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
      static get registrationName() {
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

getDBUWebComponentDummyParent.registrationName = registrationName;

},{"../DBUWebComponentBase/DBUWebComponentBase":3,"../DBUWebComponentDummy/DBUWebComponentDummy":4,"../internals/ensureSingleRegistration":7}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = dbuWebComponentsSetUp;

/*
DBUWebComponentBase (from which all web-components inherit)
will read componentStyle from win.DBUWebComponents
when klass.registerSelf() is called giving a chance to override default web-component style
just before it is registered.
*/
const appendStyle = win => (registrationName, componentStyle) => {
  if (!win.DBUWebComponents) {
    win.DBUWebComponents = {};
  }
  win.DBUWebComponents = Object.assign({}, win.DBUWebComponents, {
    [registrationName]: Object.assign({}, win.DBUWebComponents[registrationName], {
      componentStyle
    })
  });
};

function dbuWebComponentsSetUp(win) {
  return {
    appendStyle: appendStyle(win)
  };
}

},{}],7:[function(require,module,exports){
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

},{}],8:[function(require,module,exports){
(function (process){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _screens = require('./screens');

var _screens2 = _interopRequireDefault(_screens);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class IFrameScreen extends _react2.default.Component {
  render() {
    const isProd = window.location.pathname.includes('.prod.');
    const windowLocationHash = window.location.hash.replace('#', '');
    return _react2.default.createElement('iframe', {
      onLoad: evt => console.log('iframe loaded'),
      src: `srcDemo/screensWebComponents/${windowLocationHash}?production=${isProd ? '1' : '0'}` });
  }
}

class App extends _react2.default.Component {
  componentDidMount() {
    window.addEventListener('hashchange', this.onHashChange.bind(this));
  }

  onHashChange() {
    this.forceUpdate();
  }

  render() {
    if (process.env.NODE_ENV !== 'production') {
      /* eslint no-console: 0 */
      // console.log('rendering App component');
    }
    const screensKeys = Object.keys(_screens2.default);
    const links = _react2.default.createElement(
      'ul',
      null,
      screensKeys.map((screen, idx) => _react2.default.createElement(
        'li',
        { key: idx },
        _react2.default.createElement(
          'a',
          { key: idx, href: `#${screen}` },
          screen
        )
      ))
    );

    const windowLocationHash = (window.location.hash || `#${screensKeys[0]}`).replace('#', '');
    const Screen = windowLocationHash.endsWith('.html') ? IFrameScreen : _screens2.default[windowLocationHash];

    if (!Screen) {
      return null;
    }

    return _react2.default.createElement(
      'div',
      { className: 'demo-wrapper' },
      _react2.default.createElement(
        'div',
        { className: 'demo-links' },
        links
      ),
      _react2.default.createElement(
        'div',
        { className: 'demo-area' },
        _react2.default.createElement(Screen, null)
      )
    );
  }
}

App.propTypes = {
  classes: _propTypes2.default.object,
  theme: _propTypes2.default.object
};

exports.default = App;

}).call(this,require('_process'))

},{"./screens":16,"_process":1,"prop-types":"prop-types","react":"react"}],9:[function(require,module,exports){
(function (process){
'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _devBoxUi = require('dev-box-ui');

var _app = require('./app');

var _app2 = _interopRequireDefault(_app);

var _DBUWebComponentsSetup = require('../src/lib/webcomponents/DBUWebComponentsSetup/DBUWebComponentsSetup');

var _DBUWebComponentsSetup2 = _interopRequireDefault(_DBUWebComponentsSetup);

var _DBUWebComponentDummy = require('../src/lib/webcomponents/DBUWebComponentDummy/DBUWebComponentDummy');

var _DBUWebComponentDummy2 = _interopRequireDefault(_DBUWebComponentDummy);

var _DBUWebComponentDummyParent = require('../src/lib/webcomponents/DBUWebComponentDummyParent/DBUWebComponentDummyParent');

var _DBUWebComponentDummyParent2 = _interopRequireDefault(_DBUWebComponentDummyParent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _DBUWebComponentsSetup2.default)(window).appendStyle('dbu-web-component-dummy', `
  b {
    color: deepskyblue;
    font-style: oblique;
  }
`);

// import getDBUWebComponentDummy from '../build/src/lib/webcomponents/DBUWebComponentDummy/DBUWebComponentDummy';
// import getDBUWebComponentDummyParent from '../build/src/lib/webcomponents/DBUWebComponentDummyParent/DBUWebComponentDummyParent';


const DBUWebComponentDummy = (0, _DBUWebComponentDummy2.default)(window);
const DBUWebComponentDummyParent = (0, _DBUWebComponentDummyParent2.default)(window);

setTimeout(() => {
  DBUWebComponentDummy.registerSelf();
  DBUWebComponentDummyParent.registerSelf();
}, 2000);

const iframe = document.createElement('iframe');

window.onmessage = function (msg) {
  console.log('msg from iframe', msg);
};
iframe.onload = function (evt) {
  const target = evt.target;

  target.contentWindow.document.write(`
    <html>
    <body>
      <dbu-web-component-dummy
        style="color: blue"
      >
        <span>hello world 3</span>
      </dbu-web-component-dummy>
      <dbu-web-component-dummy-parent></dbu-web-component-dummy-parent>
    </body>
    <script>
      window.onmessage = function (msg) {
        console.log('msg from window', msg);
        window.top.postMessage('world', '*');
      };
    </script>
    </html>
  `);
  target.contentWindow.postMessage('hello', '*');

  (0, _DBUWebComponentsSetup2.default)(target.contentWindow).appendStyle('dbu-web-component-dummy', `
    b {
      font-style: oblique;
      opacity: 0.5;
    }
  `);
  const DBUWebComponentDummy2 = (0, _DBUWebComponentDummy2.default)(target.contentWindow);
  const DBUWebComponentDummyParent2 = (0, _DBUWebComponentDummyParent2.default)(target.contentWindow);
  setTimeout(() => {
    DBUWebComponentDummy2.registerSelf();
    DBUWebComponentDummyParent2.registerSelf();

    setTimeout(() => {
      // target.remove();
    }, 2000);
  }, 2000);
};

// document.body.appendChild(iframe);


// onScreenConsole({ options: { showLastOnly: false } });

let Demo = class Demo extends _react2.default.Component {
  render() {
    if (process.env.NODE_ENV !== 'production') {
      /* eslint no-console: 0 */
      // console.log('rendering Demo component');
    }
    const { locale: { dir } } = this.props;
    return _react2.default.createElement(_app2.default, null);
  }
};

Demo.propTypes = {
  locale: _propTypes2.default.object
};

Demo = (0, _devBoxUi.localeAware)(Demo);

_reactDom2.default.render(_react2.default.createElement(Demo, null), document.getElementById('demo'));

}).call(this,require('_process'))

},{"../src/lib/webcomponents/DBUWebComponentDummy/DBUWebComponentDummy":4,"../src/lib/webcomponents/DBUWebComponentDummyParent/DBUWebComponentDummyParent":5,"../src/lib/webcomponents/DBUWebComponentsSetup/DBUWebComponentsSetup":6,"./app":8,"_process":1,"dev-box-ui":"dev-box-ui","prop-types":"prop-types","react":"react","react-dom":"react-dom"}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class DBUWebComponentDummyScreen extends _react2.default.Component {
  render() {
    return _react2.default.createElement(
      'div',
      null,
      _react2.default.createElement(
        'dbu-web-component-dummy',
        {
          style: { color: 'blue' }
        },
        _react2.default.createElement(
          'span',
          null,
          'hello world 1'
        )
      ),
      _react2.default.createElement(
        'dbu-web-component-dummy',
        {
          style: { color: 'blue' }
        },
        _react2.default.createElement(
          'span',
          null,
          'hello world 2'
        )
      ),
      _react2.default.createElement('dbu-web-component-dummy-parent', null)
    );
  }
}

exports.default = DBUWebComponentDummyScreen;

},{"react":"react"}],11:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _devBoxUi = require('dev-box-ui');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class ToRender extends _react2.default.Component {
  render() {
    // console.log('ToRender#render');
    return _react2.default.createElement(
      'div',
      {
        style: { width: 300, height: 300 },
        onMouseDown: this.props.onMouseDown,
        onMouseUp: this.props.onMouseUp,
        onClick: this.props.onClick,
        onTouchStart: this.props.onTouchStart,
        onTouchEnd: this.props.onTouchEnd
      },
      _react2.default.createElement(
        'p',
        null,
        'draggable p ',
        this.props.counter,
        ' ',
        _react2.default.createElement(
          'a',
          { href: 'http://google.com', target: '_blank' },
          'link'
        )
      )
    );
  }
}

class DraggableScreen extends _react2.default.Component {
  constructor(props) {
    super(props);
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleTouchStart = this.handleTouchStart.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.handleTouchEnd = this.handleTouchEnd.bind(this);
    this.handleClick = this.handleClick.bind(this);

    this.counter = 1;
    this.state = {
      draggableContent: this.draggableContent
    };
  }

  get draggableContent() {
    return _react2.default.createElement(ToRender, {
      onMouseDown: this.handleMouseDown,
      onMouseUp: this.handleMouseUp,
      onTouchStart: this.handleTouchStart,
      onTouchEnd: this.handleTouchEnd,
      onClick: this.handleClick,
      counter: this.counter
    });
  }

  handleMouseDown(evt) {
    console.log('DraggableScreen#handleMouseDown');
  }
  handleMouseUp(evt) {
    console.log('DraggableScreen#handleMouseUp');
  }
  handleTouchStart(evt) {
    console.log('DraggableScreen#handleTouchStart');
  }
  handleTouchEnd(evt) {
    console.log('DraggableScreen#handleTouchEnd');
  }
  handleClick(evt) {
    console.log('DraggableScreen#handleClick');
    // this.counter = this.counter + 1;
    // this.setState({
    //   draggableContent: this.draggableContent
    // });
  }

  componentDidMount() {
    setTimeout(() => {
      this.counter = this.counter + 1;
      this.setState({
        draggableContent: this.draggableContent
      });
    }, 3000);
  }

  render() {
    return _react2.default.createElement(
      'div',
      null,
      _react2.default.createElement(
        _devBoxUi.Draggable,
        { style: { border: '1px solid blue', width: 200, height: 200, overflowX: 'scroll', overflowY: 'scroll' } },
        this.state.draggableContent
      ),
      _react2.default.createElement(
        _devBoxUi.DisableSelection,
        null,
        _react2.default.createElement(
          'p',
          null,
          'disabled selection'
        )
      ),
      Array.from({ length: 10 }).map((el, i) => _react2.default.createElement(
        'p',
        { key: i },
        i,
        ' ---------------------------------'
      ))
    );
  }
}

exports.default = DraggableScreen;

},{"dev-box-ui":"dev-box-ui","react":"react"}],12:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _devBoxUi = require('dev-box-ui');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class FormInputNumberScreen extends _react2.default.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputValue: -7.08
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(inputValue) {
    const valueToSendBack = Number(inputValue.toPrecision(16));
    this.setState({
      inputValue: valueToSendBack
    });
  }

  render() {
    return _react2.default.createElement(
      'div',
      null,
      _react2.default.createElement(_devBoxUi.FormInputNumber, {
        value: this.state.inputValue,
        onChange: this.handleChange,
        defaultDecPoint: ',',
        defaultThousandsSeparator: '.'
      }),
      _react2.default.createElement(_devBoxUi.FormInputNumber, {
        value: this.state.inputValue,
        onChange: this.handleChange
      }),
      _react2.default.createElement(
        'p',
        null,
        this.state.inputValue,
        '\u00A0'
      )
    );
  }
}

exports.default = FormInputNumberScreen;

},{"dev-box-ui":"dev-box-ui","react":"react"}],13:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _devBoxUi = require('dev-box-ui');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class FormInputScreen extends _react2.default.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputValue: 6
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(inputValue) {
    this.setState({
      inputValue
    });
  }

  render() {
    return _react2.default.createElement(
      'div',
      null,
      _react2.default.createElement(_devBoxUi.FormInput, {
        value: this.state.inputValue,
        onChange: this.handleChange,
        hasWarning: false,
        hasError: false,
        disabled: false
      }),
      _react2.default.createElement(
        'p',
        null,
        this.state.inputValue,
        '\u00A0'
      )
    );
  }
}

exports.default = FormInputScreen;

},{"dev-box-ui":"dev-box-ui","react":"react"}],14:[function(require,module,exports){
(function (process){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _devBoxUi = require('dev-box-ui');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class HelloScreen extends _react2.default.Component {
  render() {
    if (process.env.NODE_ENV !== 'production') {
      /* eslint no-console: 0 */
      // console.log('rendering HelloScreen component');
    }
    return _react2.default.createElement(
      'div',
      null,
      _react2.default.createElement(_devBoxUi.Hello, null)
    );
  }
}

exports.default = HelloScreen;

}).call(this,require('_process'))

},{"_process":1,"dev-box-ui":"dev-box-ui","react":"react"}],15:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _devBoxUi = require('dev-box-ui');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class ListScreen extends _react2.default.Component {
  render() {
    return _react2.default.createElement(
      'div',
      null,
      _react2.default.createElement(_devBoxUi.List, { items: ['three', 'four'] }),
      _react2.default.createElement(_devBoxUi.List, { items: ['three', 'four'] })
    );
  }
}

exports.default = ListScreen;

},{"dev-box-ui":"dev-box-ui","react":"react"}],16:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _HelloScreen = require('./HelloScreen');

var _HelloScreen2 = _interopRequireDefault(_HelloScreen);

var _ListScreen = require('./ListScreen');

var _ListScreen2 = _interopRequireDefault(_ListScreen);

var _FormInputScreen = require('./FormInputScreen');

var _FormInputScreen2 = _interopRequireDefault(_FormInputScreen);

var _FormInputNumberScreen = require('./FormInputNumberScreen');

var _FormInputNumberScreen2 = _interopRequireDefault(_FormInputNumberScreen);

var _DraggableScreen = require('./DraggableScreen');

var _DraggableScreen2 = _interopRequireDefault(_DraggableScreen);

var _DBUWebComponentDummyScreen = require('./DBUWebComponentDummyScreen');

var _DBUWebComponentDummyScreen2 = _interopRequireDefault(_DBUWebComponentDummyScreen);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  HelloScreen: _HelloScreen2.default,
  ListScreen: _ListScreen2.default,
  FormInputScreen: _FormInputScreen2.default,
  FormInputNumberScreen: _FormInputNumberScreen2.default,
  Draggable: _DraggableScreen2.default,
  DBUWebComponentDummyScreen: _DBUWebComponentDummyScreen2.default,
  'DBUWebComponentDummyScreen.html': null,
  'DBUWebComponentDummyParentScreen.html': null
};

},{"./DBUWebComponentDummyScreen":10,"./DraggableScreen":11,"./FormInputNumberScreen":12,"./FormInputScreen":13,"./HelloScreen":14,"./ListScreen":15}]},{},[9])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvcHJvY2Vzcy9icm93c2VyLmpzIiwic3JjL2xpYi9zZXJ2aWNlcy9Mb2NhbGVTZXJ2aWNlLmpzIiwic3JjL2xpYi93ZWJjb21wb25lbnRzL0RCVVdlYkNvbXBvbmVudEJhc2UvREJVV2ViQ29tcG9uZW50QmFzZS5qcyIsInNyYy9saWIvd2ViY29tcG9uZW50cy9EQlVXZWJDb21wb25lbnREdW1teS9EQlVXZWJDb21wb25lbnREdW1teS5qcyIsInNyYy9saWIvd2ViY29tcG9uZW50cy9EQlVXZWJDb21wb25lbnREdW1teVBhcmVudC9EQlVXZWJDb21wb25lbnREdW1teVBhcmVudC5qcyIsInNyYy9saWIvd2ViY29tcG9uZW50cy9EQlVXZWJDb21wb25lbnRzU2V0dXAvREJVV2ViQ29tcG9uZW50c1NldHVwLmpzIiwic3JjL2xpYi93ZWJjb21wb25lbnRzL2ludGVybmFscy9lbnN1cmVTaW5nbGVSZWdpc3RyYXRpb24uanMiLCJzcmNEZW1vL2FwcC5qcyIsInNyY0RlbW8vZGVtby5qcyIsInNyY0RlbW8vc2NyZWVucy9EQlVXZWJDb21wb25lbnREdW1teVNjcmVlbi5qcyIsInNyY0RlbW8vc2NyZWVucy9EcmFnZ2FibGVTY3JlZW4uanMiLCJzcmNEZW1vL3NjcmVlbnMvRm9ybUlucHV0TnVtYmVyU2NyZWVuLmpzIiwic3JjRGVtby9zY3JlZW5zL0Zvcm1JbnB1dFNjcmVlbi5qcyIsInNyY0RlbW8vc2NyZWVucy9IZWxsb1NjcmVlbi5qcyIsInNyY0RlbW8vc2NyZWVucy9MaXN0U2NyZWVuLmpzIiwic3JjRGVtby9zY3JlZW5zL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7QUN2TEEsTUFBTSxnQkFBZ0I7QUFDcEIsT0FBSyxLQURlO0FBRXBCLFFBQU07QUFGYyxDQUF0Qjs7QUFLQSxN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O0FBWUQ7QUE1QjJDOztrQkErQi9CLGU7Ozs7Ozs7Ozs7QUNyQ2Y7Ozs7QUFDQTs7OztBQUlBLE1BQU0sV0FBTixTQUEwQixnQkFBTSxTQUFoQyxDQUEwQztBQUN4QyxXQUFTO0FBQ1AsUUFBSSxRQUFRLEdBQVIsQ0FBWSxRQUFaLEtBQXlCLFlBQTdCLEVBQTJDO0FBQ3pDO0FBQ0E7QUFDRDtBQUNELFdBQ0U7QUFBQTtBQUFBO0FBQ0U7QUFERixLQURGO0FBS0Q7QUFYdUM7O2tCQWMzQixXOzs7Ozs7Ozs7OztBQ25CZjs7OztBQUNBOzs7O0FBSUEsTUFBTSxVQUFOLFNBQXlCLGdCQUFNLFNBQS9CLENBQXlDO0FBQ3ZDLFdBQVM7QUFDUCxXQUNFO0FBQUE7QUFBQTtBQUNFLHNEQUFNLE9BQU8sQ0FBQyxPQUFELEVBQVUsTUFBVixDQUFiLEdBREY7QUFFRSxzREFBTSxPQUFPLENBQUMsT0FBRCxFQUFVLE1BQVYsQ0FBYjtBQUZGLEtBREY7QUFNRDtBQVJzQzs7a0JBVzFCLFU7Ozs7Ozs7OztBQ2hCZjs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7OztrQkFFZTtBQUNiLG9DQURhO0FBRWIsa0NBRmE7QUFHYiw0Q0FIYTtBQUliLHdEQUphO0FBS2Isc0NBTGE7QUFNYixrRUFOYTtBQU9iLHFDQUFtQyxJQVB0QjtBQVFiLDJDQUF5QztBQVI1QixDIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8vIHNoaW0gZm9yIHVzaW5nIHByb2Nlc3MgaW4gYnJvd3NlclxudmFyIHByb2Nlc3MgPSBtb2R1bGUuZXhwb3J0cyA9IHt9O1xuXG4vLyBjYWNoZWQgZnJvbSB3aGF0ZXZlciBnbG9iYWwgaXMgcHJlc2VudCBzbyB0aGF0IHRlc3QgcnVubmVycyB0aGF0IHN0dWIgaXRcbi8vIGRvbid0IGJyZWFrIHRoaW5ncy4gIEJ1dCB3ZSBuZWVkIHRvIHdyYXAgaXQgaW4gYSB0cnkgY2F0Y2ggaW4gY2FzZSBpdCBpc1xuLy8gd3JhcHBlZCBpbiBzdHJpY3QgbW9kZSBjb2RlIHdoaWNoIGRvZXNuJ3QgZGVmaW5lIGFueSBnbG9iYWxzLiAgSXQncyBpbnNpZGUgYVxuLy8gZnVuY3Rpb24gYmVjYXVzZSB0cnkvY2F0Y2hlcyBkZW9wdGltaXplIGluIGNlcnRhaW4gZW5naW5lcy5cblxudmFyIGNhY2hlZFNldFRpbWVvdXQ7XG52YXIgY2FjaGVkQ2xlYXJUaW1lb3V0O1xuXG5mdW5jdGlvbiBkZWZhdWx0U2V0VGltb3V0KCkge1xuICAgIHRocm93IG5ldyBFcnJvcignc2V0VGltZW91dCBoYXMgbm90IGJlZW4gZGVmaW5lZCcpO1xufVxuZnVuY3Rpb24gZGVmYXVsdENsZWFyVGltZW91dCAoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdjbGVhclRpbWVvdXQgaGFzIG5vdCBiZWVuIGRlZmluZWQnKTtcbn1cbihmdW5jdGlvbiAoKSB7XG4gICAgdHJ5IHtcbiAgICAgICAgaWYgKHR5cGVvZiBzZXRUaW1lb3V0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gc2V0VGltZW91dDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBkZWZhdWx0U2V0VGltb3V0O1xuICAgICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gZGVmYXVsdFNldFRpbW91dDtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgaWYgKHR5cGVvZiBjbGVhclRpbWVvdXQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGNsZWFyVGltZW91dDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGRlZmF1bHRDbGVhclRpbWVvdXQ7XG4gICAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGRlZmF1bHRDbGVhclRpbWVvdXQ7XG4gICAgfVxufSAoKSlcbmZ1bmN0aW9uIHJ1blRpbWVvdXQoZnVuKSB7XG4gICAgaWYgKGNhY2hlZFNldFRpbWVvdXQgPT09IHNldFRpbWVvdXQpIHtcbiAgICAgICAgLy9ub3JtYWwgZW52aXJvbWVudHMgaW4gc2FuZSBzaXR1YXRpb25zXG4gICAgICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfVxuICAgIC8vIGlmIHNldFRpbWVvdXQgd2Fzbid0IGF2YWlsYWJsZSBidXQgd2FzIGxhdHRlciBkZWZpbmVkXG4gICAgaWYgKChjYWNoZWRTZXRUaW1lb3V0ID09PSBkZWZhdWx0U2V0VGltb3V0IHx8ICFjYWNoZWRTZXRUaW1lb3V0KSAmJiBzZXRUaW1lb3V0KSB7XG4gICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBzZXRUaW1lb3V0O1xuICAgICAgICByZXR1cm4gc2V0VGltZW91dChmdW4sIDApO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICAvLyB3aGVuIHdoZW4gc29tZWJvZHkgaGFzIHNjcmV3ZWQgd2l0aCBzZXRUaW1lb3V0IGJ1dCBubyBJLkUuIG1hZGRuZXNzXG4gICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfSBjYXRjaChlKXtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIC8vIFdoZW4gd2UgYXJlIGluIEkuRS4gYnV0IHRoZSBzY3JpcHQgaGFzIGJlZW4gZXZhbGVkIHNvIEkuRS4gZG9lc24ndCB0cnVzdCB0aGUgZ2xvYmFsIG9iamVjdCB3aGVuIGNhbGxlZCBub3JtYWxseVxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQuY2FsbChudWxsLCBmdW4sIDApO1xuICAgICAgICB9IGNhdGNoKGUpe1xuICAgICAgICAgICAgLy8gc2FtZSBhcyBhYm92ZSBidXQgd2hlbiBpdCdzIGEgdmVyc2lvbiBvZiBJLkUuIHRoYXQgbXVzdCBoYXZlIHRoZSBnbG9iYWwgb2JqZWN0IGZvciAndGhpcycsIGhvcGZ1bGx5IG91ciBjb250ZXh0IGNvcnJlY3Qgb3RoZXJ3aXNlIGl0IHdpbGwgdGhyb3cgYSBnbG9iYWwgZXJyb3JcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0LmNhbGwodGhpcywgZnVuLCAwKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG59XG5mdW5jdGlvbiBydW5DbGVhclRpbWVvdXQobWFya2VyKSB7XG4gICAgaWYgKGNhY2hlZENsZWFyVGltZW91dCA9PT0gY2xlYXJUaW1lb3V0KSB7XG4gICAgICAgIC8vbm9ybWFsIGVudmlyb21lbnRzIGluIHNhbmUgc2l0dWF0aW9uc1xuICAgICAgICByZXR1cm4gY2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfVxuICAgIC8vIGlmIGNsZWFyVGltZW91dCB3YXNuJ3QgYXZhaWxhYmxlIGJ1dCB3YXMgbGF0dGVyIGRlZmluZWRcbiAgICBpZiAoKGNhY2hlZENsZWFyVGltZW91dCA9PT0gZGVmYXVsdENsZWFyVGltZW91dCB8fCAhY2FjaGVkQ2xlYXJUaW1lb3V0KSAmJiBjbGVhclRpbWVvdXQpIHtcbiAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gY2xlYXJUaW1lb3V0O1xuICAgICAgICByZXR1cm4gY2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIC8vIHdoZW4gd2hlbiBzb21lYm9keSBoYXMgc2NyZXdlZCB3aXRoIHNldFRpbWVvdXQgYnV0IG5vIEkuRS4gbWFkZG5lc3NcbiAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH0gY2F0Y2ggKGUpe1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgLy8gV2hlbiB3ZSBhcmUgaW4gSS5FLiBidXQgdGhlIHNjcmlwdCBoYXMgYmVlbiBldmFsZWQgc28gSS5FLiBkb2Vzbid0ICB0cnVzdCB0aGUgZ2xvYmFsIG9iamVjdCB3aGVuIGNhbGxlZCBub3JtYWxseVxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dC5jYWxsKG51bGwsIG1hcmtlcik7XG4gICAgICAgIH0gY2F0Y2ggKGUpe1xuICAgICAgICAgICAgLy8gc2FtZSBhcyBhYm92ZSBidXQgd2hlbiBpdCdzIGEgdmVyc2lvbiBvZiBJLkUuIHRoYXQgbXVzdCBoYXZlIHRoZSBnbG9iYWwgb2JqZWN0IGZvciAndGhpcycsIGhvcGZ1bGx5IG91ciBjb250ZXh0IGNvcnJlY3Qgb3RoZXJ3aXNlIGl0IHdpbGwgdGhyb3cgYSBnbG9iYWwgZXJyb3IuXG4gICAgICAgICAgICAvLyBTb21lIHZlcnNpb25zIG9mIEkuRS4gaGF2ZSBkaWZmZXJlbnQgcnVsZXMgZm9yIGNsZWFyVGltZW91dCB2cyBzZXRUaW1lb3V0XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0LmNhbGwodGhpcywgbWFya2VyKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG5cbn1cbnZhciBxdWV1ZSA9IFtdO1xudmFyIGRyYWluaW5nID0gZmFsc2U7XG52YXIgY3VycmVudFF1ZXVlO1xudmFyIHF1ZXVlSW5kZXggPSAtMTtcblxuZnVuY3Rpb24gY2xlYW5VcE5leHRUaWNrKCkge1xuICAgIGlmICghZHJhaW5pbmcgfHwgIWN1cnJlbnRRdWV1ZSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGRyYWluaW5nID0gZmFsc2U7XG4gICAgaWYgKGN1cnJlbnRRdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgcXVldWUgPSBjdXJyZW50UXVldWUuY29uY2F0KHF1ZXVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBxdWV1ZUluZGV4ID0gLTE7XG4gICAgfVxuICAgIGlmIChxdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgZHJhaW5RdWV1ZSgpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gZHJhaW5RdWV1ZSgpIHtcbiAgICBpZiAoZHJhaW5pbmcpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB2YXIgdGltZW91dCA9IHJ1blRpbWVvdXQoY2xlYW5VcE5leHRUaWNrKTtcbiAgICBkcmFpbmluZyA9IHRydWU7XG5cbiAgICB2YXIgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIHdoaWxlKGxlbikge1xuICAgICAgICBjdXJyZW50UXVldWUgPSBxdWV1ZTtcbiAgICAgICAgcXVldWUgPSBbXTtcbiAgICAgICAgd2hpbGUgKCsrcXVldWVJbmRleCA8IGxlbikge1xuICAgICAgICAgICAgaWYgKGN1cnJlbnRRdWV1ZSkge1xuICAgICAgICAgICAgICAgIGN1cnJlbnRRdWV1ZVtxdWV1ZUluZGV4XS5ydW4oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBxdWV1ZUluZGV4ID0gLTE7XG4gICAgICAgIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB9XG4gICAgY3VycmVudFF1ZXVlID0gbnVsbDtcbiAgICBkcmFpbmluZyA9IGZhbHNlO1xuICAgIHJ1bkNsZWFyVGltZW91dCh0aW1lb3V0KTtcbn1cblxucHJvY2Vzcy5uZXh0VGljayA9IGZ1bmN0aW9uIChmdW4pIHtcbiAgICB2YXIgYXJncyA9IG5ldyBBcnJheShhcmd1bWVudHMubGVuZ3RoIC0gMSk7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBhcmdzW2kgLSAxXSA9IGFyZ3VtZW50c1tpXTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBxdWV1ZS5wdXNoKG5ldyBJdGVtKGZ1biwgYXJncykpO1xuICAgIGlmIChxdWV1ZS5sZW5ndGggPT09IDEgJiYgIWRyYWluaW5nKSB7XG4gICAgICAgIHJ1blRpbWVvdXQoZHJhaW5RdWV1ZSk7XG4gICAgfVxufTtcblxuLy8gdjggbGlrZXMgcHJlZGljdGlibGUgb2JqZWN0c1xuZnVuY3Rpb24gSXRlbShmdW4sIGFycmF5KSB7XG4gICAgdGhpcy5mdW4gPSBmdW47XG4gICAgdGhpcy5hcnJheSA9IGFycmF5O1xufVxuSXRlbS5wcm90b3R5cGUucnVuID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuZnVuLmFwcGx5KG51bGwsIHRoaXMuYXJyYXkpO1xufTtcbnByb2Nlc3MudGl0bGUgPSAnYnJvd3Nlcic7XG5wcm9jZXNzLmJyb3dzZXIgPSB0cnVlO1xucHJvY2Vzcy5lbnYgPSB7fTtcbnByb2Nlc3MuYXJndiA9IFtdO1xucHJvY2Vzcy52ZXJzaW9uID0gJyc7IC8vIGVtcHR5IHN0cmluZyB0byBhdm9pZCByZWdleHAgaXNzdWVzXG5wcm9jZXNzLnZlcnNpb25zID0ge307XG5cbmZ1bmN0aW9uIG5vb3AoKSB7fVxuXG5wcm9jZXNzLm9uID0gbm9vcDtcbnByb2Nlc3MuYWRkTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5vbmNlID0gbm9vcDtcbnByb2Nlc3Mub2ZmID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVBbGxMaXN0ZW5lcnMgPSBub29wO1xucHJvY2Vzcy5lbWl0ID0gbm9vcDtcbnByb2Nlc3MucHJlcGVuZExpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3MucHJlcGVuZE9uY2VMaXN0ZW5lciA9IG5vb3A7XG5cbnByb2Nlc3MubGlzdGVuZXJzID0gZnVuY3Rpb24gKG5hbWUpIHsgcmV0dXJuIFtdIH1cblxucHJvY2Vzcy5iaW5kaW5nID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuYmluZGluZyBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xuXG5wcm9jZXNzLmN3ZCA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuICcvJyB9O1xucHJvY2Vzcy5jaGRpciA9IGZ1bmN0aW9uIChkaXIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuY2hkaXIgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcbnByb2Nlc3MudW1hc2sgPSBmdW5jdGlvbigpIHsgcmV0dXJuIDA7IH07XG4iLCJcbmNvbnN0IGRlZmF1bHRMb2NhbGUgPSB7XG4gIGRpcjogJ2x0cicsXG4gIGxhbmc6ICdlbidcbn07XG5cbmNsYXNzIExvY2FsZVNlcnZpY2Uge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLl9jYWxsYmFja3MgPSBbXTtcbiAgICB0aGlzLl9sb2NhbGVBdHRycyA9IE9iamVjdC5rZXlzKGRlZmF1bHRMb2NhbGUpO1xuICAgIHRoaXMuX3Jvb3RFbGVtZW50ID0gd2luZG93LmRvY3VtZW50LmRvY3VtZW50RWxlbWVudDtcbiAgICB0aGlzLl9sb2NhbGVBdHRycy5mb3JFYWNoKChhdHRyKSA9PiB7XG4gICAgICBpZiAoIXRoaXMuX3Jvb3RFbGVtZW50LmdldEF0dHJpYnV0ZShhdHRyKSkge1xuICAgICAgICB0aGlzLl9yb290RWxlbWVudC5zZXRBdHRyaWJ1dGUoYXR0ciwgZGVmYXVsdExvY2FsZVthdHRyXSk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgdGhpcy5fbG9jYWxlID0gdGhpcy5fbG9jYWxlQXR0cnMucmVkdWNlKChhY2MsIGF0dHIpID0+IHtcbiAgICAgIGFjY1thdHRyXSA9IHRoaXMuX3Jvb3RFbGVtZW50LmdldEF0dHJpYnV0ZShhdHRyKTtcbiAgICAgIHJldHVybiBhY2M7XG4gICAgfSwge30pO1xuICAgIHRoaXMuX29ic2VydmVyID0gbmV3IE11dGF0aW9uT2JzZXJ2ZXIodGhpcy5faGFuZGxlTXV0YXRpb25zLmJpbmQodGhpcykpO1xuICAgIHRoaXMuX29ic2VydmVyLm9ic2VydmUodGhpcy5fcm9vdEVsZW1lbnQsIHtcbiAgICAgIGF0dHJpYnV0ZXM6IHRydWVcbiAgICB9KTtcbiAgfVxuXG4gIF9oYW5kbGVNdXRhdGlvbnMobXV0YXRpb25zKSB7XG4gICAgbXV0YXRpb25zLmZvckVhY2goKG11dGF0aW9uKSA9PiB7XG4gICAgICBjb25zdCBtdXRhdGlvbkF0dHJpYnV0ZU5hbWUgPSBtdXRhdGlvbi5hdHRyaWJ1dGVOYW1lO1xuICAgICAgaWYgKHRoaXMuX2xvY2FsZUF0dHJzLmluY2x1ZGVzKG11dGF0aW9uQXR0cmlidXRlTmFtZSkpIHtcbiAgICAgICAgdGhpcy5fbG9jYWxlID0ge1xuICAgICAgICAgIC4uLnRoaXMuX2xvY2FsZSxcbiAgICAgICAgICBbbXV0YXRpb25BdHRyaWJ1dGVOYW1lXTogdGhpcy5fcm9vdEVsZW1lbnQuZ2V0QXR0cmlidXRlKG11dGF0aW9uQXR0cmlidXRlTmFtZSlcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5fY2FsbGJhY2tzLmZvckVhY2goY2FsbGJhY2sgPT4gY2FsbGJhY2sodGhpcy5fbG9jYWxlKSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBzZXQgbG9jYWxlKGxvY2FsZU9iaikge1xuICAgIE9iamVjdC5rZXlzKGxvY2FsZU9iaikuZm9yRWFjaCgoa2V5KSA9PiB7XG4gICAgICB0aGlzLl9yb290RWxlbWVudC5zZXRBdHRyaWJ1dGUoa2V5LCBsb2NhbGVPYmpba2V5XSk7XG4gICAgfSk7XG4gIH1cblxuICBnZXQgbG9jYWxlKCkge1xuICAgIHJldHVybiB0aGlzLl9sb2NhbGU7XG4gIH1cblxuICBvbkxvY2FsZUNoYW5nZShjYWxsYmFjaykge1xuICAgIHRoaXMuX2NhbGxiYWNrcy5wdXNoKGNhbGxiYWNrKTtcbiAgICBjYWxsYmFjayh0aGlzLmxvY2FsZSk7XG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgIHRoaXMuX2NhbGxiYWNrcyA9IHRoaXMuX2NhbGxiYWNrcy5maWx0ZXIoY2IgPT4gY2IgIT09IGNhbGxiYWNrKTtcbiAgICB9O1xuICB9XG59XG5cbmNvbnN0IGxvY2FsZVNlcnZpY2UgPSBuZXcgTG9jYWxlU2VydmljZSgpO1xuZXhwb3J0IGRlZmF1bHQgbG9jYWxlU2VydmljZTtcbiIsIlxuaW1wb3J0IExvY2FsZVNlcnZpY2UgZnJvbSAnLi4vLi4vc2VydmljZXMvTG9jYWxlU2VydmljZSc7XG5pbXBvcnQgZW5zdXJlU2luZ2xlUmVnaXN0cmF0aW9uIGZyb20gJy4uL2ludGVybmFscy9lbnN1cmVTaW5nbGVSZWdpc3RyYXRpb24nO1xuXG5jb25zdCByZWdpc3RyYXRpb25OYW1lID0gJ0RCVVdlYkNvbXBvbmVudEJhc2UnO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBnZXREQlVXZWJDb21wb25lbnRCYXNlKHdpbikge1xuICByZXR1cm4gZW5zdXJlU2luZ2xlUmVnaXN0cmF0aW9uKHdpbiwgcmVnaXN0cmF0aW9uTmFtZSwgKCkgPT4ge1xuICAgIGNvbnN0IHsgZG9jdW1lbnQsIEhUTUxFbGVtZW50LCBjdXN0b21FbGVtZW50cyB9ID0gd2luO1xuXG4gICAgY29uc3QgdGVtcGxhdGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZW1wbGF0ZScpO1xuICAgIHRlbXBsYXRlLmlubmVySFRNTCA9ICc8c3R5bGU+PC9zdHlsZT48c2xvdD48L3Nsb3Q+JztcblxuICAgIGNsYXNzIERCVVdlYkNvbXBvbmVudEJhc2UgZXh0ZW5kcyBIVE1MRWxlbWVudCB7XG5cbiAgICAgIHN0YXRpYyBnZXQgdGVtcGxhdGUoKSB7XG4gICAgICAgIHJldHVybiB0ZW1wbGF0ZTtcbiAgICAgIH1cblxuICAgICAgc3RhdGljIGdldCBkZXBlbmRlbmNpZXMoKSB7XG4gICAgICAgIHJldHVybiBbXTtcbiAgICAgIH1cblxuICAgICAgc3RhdGljIGdldCB1c2VTaGFkb3coKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuXG4gICAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgY29uc3QgeyB1c2VTaGFkb3cgfSA9IHRoaXMuY29uc3RydWN0b3I7XG4gICAgICAgIGlmICh1c2VTaGFkb3cpIHtcbiAgICAgICAgICB0aGlzLmF0dGFjaFNoYWRvdyh7IG1vZGU6ICdvcGVuJyB9KTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9pbnNlcnRUZW1wbGF0ZSgpO1xuXG4gICAgICAgIHRoaXMuY29ubmVjdGVkQ2FsbGJhY2sgPSB0aGlzLmNvbm5lY3RlZENhbGxiYWNrLmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMuZGlzY29ubmVjdGVkQ2FsbGJhY2sgPSB0aGlzLmRpc2Nvbm5lY3RlZENhbGxiYWNrLmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMuX2hhbmRsZUxvY2FsZUNoYW5nZSA9IHRoaXMuX2hhbmRsZUxvY2FsZUNoYW5nZS5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzLm9uTG9jYWxlQ2hhbmdlICYmICh0aGlzLm9uTG9jYWxlQ2hhbmdlID0gdGhpcy5vbkxvY2FsZUNoYW5nZS5iaW5kKHRoaXMpKTtcbiAgICAgICAgdGhpcy51bnJlZ2lzdGVyTG9jYWxlQ2hhbmdlID0gbnVsbDtcbiAgICAgIH1cblxuICAgICAgY29ubmVjdGVkQ2FsbGJhY2soKSB7XG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdiZWZvcmV1bmxvYWQnLCB0aGlzLmRpc2Nvbm5lY3RlZENhbGxiYWNrLCBmYWxzZSk7XG5cbiAgICAgICAgdGhpcy51bnJlZ2lzdGVyTG9jYWxlQ2hhbmdlID1cbiAgICAgICAgICBMb2NhbGVTZXJ2aWNlLm9uTG9jYWxlQ2hhbmdlKHRoaXMuX2hhbmRsZUxvY2FsZUNoYW5nZSk7XG4gICAgICB9XG5cbiAgICAgIGRpc2Nvbm5lY3RlZENhbGxiYWNrKCkge1xuICAgICAgICB0aGlzLnVucmVnaXN0ZXJMb2NhbGVDaGFuZ2UoKTtcbiAgICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2JlZm9yZXVubG9hZCcsIHRoaXMuZGlzY29ubmVjdGVkQ2FsbGJhY2ssIGZhbHNlKTtcbiAgICAgIH1cblxuICAgICAgZ2V0IGNoaWxkcmVuVHJlZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29uc3RydWN0b3IudXNlU2hhZG93ID8gdGhpcy5zaGFkb3dSb290IDogdGhpcztcbiAgICAgIH1cblxuICAgICAgX2luc2VydFRlbXBsYXRlKCkge1xuICAgICAgICBjb25zdCB7IHRlbXBsYXRlIH0gPSB0aGlzLmNvbnN0cnVjdG9yO1xuXG4gICAgICAgIGlmICh0ZW1wbGF0ZSkge1xuICAgICAgICAgIHRoaXMuY2hpbGRyZW5UcmVlLmFwcGVuZENoaWxkKHRlbXBsYXRlLmNvbnRlbnQuY2xvbmVOb2RlKHRydWUpKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBfaGFuZGxlTG9jYWxlQ2hhbmdlKGxvY2FsZSkge1xuICAgICAgICB0aGlzLmNoaWxkcmVuVHJlZS5pbm5lckhUTUwgPSAnJztcbiAgICAgICAgdGhpcy5faW5zZXJ0VGVtcGxhdGUoKTtcbiAgICAgICAgdGhpcy5zZXRBdHRyaWJ1dGUoJ2RpcicsIGxvY2FsZS5kaXIpO1xuICAgICAgICB0aGlzLnNldEF0dHJpYnV0ZSgnbGFuZycsIGxvY2FsZS5sYW5nKTtcbiAgICAgICAgdGhpcy5vbkxvY2FsZUNoYW5nZSAmJiB0aGlzLm9uTG9jYWxlQ2hhbmdlKGxvY2FsZSk7XG4gICAgICB9XG5cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBkZWZpbmVDb21tb25TdGF0aWNNZXRob2RzKGtsYXNzKSB7XG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoa2xhc3MsICdjb21wb25lbnRTdHlsZScsIHtcbiAgICAgICAgZ2V0KCkge1xuICAgICAgICAgIHJldHVybiBrbGFzcy50ZW1wbGF0ZS5jb250ZW50LnF1ZXJ5U2VsZWN0b3IoJ3N0eWxlJykuaW5uZXJIVE1MO1xuICAgICAgICB9LFxuICAgICAgICBzZXQodmFsdWUpIHtcbiAgICAgICAgICBrbGFzcy50ZW1wbGF0ZS5jb250ZW50LnF1ZXJ5U2VsZWN0b3IoJ3N0eWxlJykuaW5uZXJIVE1MID0gdmFsdWU7XG4gICAgICAgIH0sXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgICAgfSk7XG5cbiAgICAgIGtsYXNzLnJlZ2lzdGVyU2VsZiA9ICgpID0+IHtcbiAgICAgICAgY29uc3QgcmVnaXN0cmF0aW9uTmFtZSA9IGtsYXNzLnJlZ2lzdHJhdGlvbk5hbWU7XG4gICAgICAgIGNvbnN0IGRlcGVuZGVuY2llcyA9IGtsYXNzLmRlcGVuZGVuY2llcztcbiAgICAgICAgLy8gTWFrZSBzdXJlIG91ciBkZXBlbmRlbmNpZXMgYXJlIHJlZ2lzdGVyZWQgYmVmb3JlIHdlIHJlZ2lzdGVyIHNlbGZcbiAgICAgICAgZGVwZW5kZW5jaWVzLmZvckVhY2goKGRlcGVuZGVuY3kpID0+IGRlcGVuZGVuY3kucmVnaXN0ZXJTZWxmKCkpO1xuICAgICAgICAvLyBEb24ndCB0cnkgdG8gcmVnaXN0ZXIgc2VsZiBpZiBhbHJlYWR5IHJlZ2lzdGVyZWRcbiAgICAgICAgaWYgKGN1c3RvbUVsZW1lbnRzLmdldChyZWdpc3RyYXRpb25OYW1lKSkgcmV0dXJuIHJlZ2lzdHJhdGlvbk5hbWU7XG4gICAgICAgIC8vIEdpdmUgYSBjaGFuY2UgdG8gb3ZlcnJpZGUgd2ViLWNvbXBvbmVudCBzdHlsZSBpZiBwcm92aWRlZCBiZWZvcmUgYmVpbmcgcmVnaXN0ZXJlZC5cbiAgICAgICAgY29uc3QgY29tcG9uZW50U3R5bGUgPSAoKHdpbi5EQlVXZWJDb21wb25lbnRzIHx8IHt9KVtyZWdpc3RyYXRpb25OYW1lXSB8fCB7fSkuY29tcG9uZW50U3R5bGU7XG4gICAgICAgIGlmIChjb21wb25lbnRTdHlsZSkge1xuICAgICAgICAgIGtsYXNzLmNvbXBvbmVudFN0eWxlICs9IGNvbXBvbmVudFN0eWxlO1xuICAgICAgICB9XG4gICAgICAgIC8vIERvIHJlZ2lzdHJhdGlvblxuICAgICAgICBjdXN0b21FbGVtZW50cy5kZWZpbmUocmVnaXN0cmF0aW9uTmFtZSwga2xhc3MpO1xuICAgICAgICByZXR1cm4gcmVnaXN0cmF0aW9uTmFtZTtcbiAgICAgIH07XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIERCVVdlYkNvbXBvbmVudEJhc2UsXG4gICAgICBkZWZpbmVDb21tb25TdGF0aWNNZXRob2RzXG4gICAgfTtcbiAgfSk7XG59XG4iLCJcbmltcG9ydCBnZXREQlVXZWJDb21wb25lbnRCYXNlIGZyb20gJy4uL0RCVVdlYkNvbXBvbmVudEJhc2UvREJVV2ViQ29tcG9uZW50QmFzZSc7XG5pbXBvcnQgZW5zdXJlU2luZ2xlUmVnaXN0cmF0aW9uIGZyb20gJy4uL2ludGVybmFscy9lbnN1cmVTaW5nbGVSZWdpc3RyYXRpb24nO1xuXG5jb25zdCByZWdpc3RyYXRpb25OYW1lID0gJ2RidS13ZWItY29tcG9uZW50LWR1bW15JztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZ2V0REJVV2ViQ29tcG9uZW50RHVtbXkod2luKSB7XG4gIHJldHVybiBlbnN1cmVTaW5nbGVSZWdpc3RyYXRpb24od2luLCByZWdpc3RyYXRpb25OYW1lLCAoKSA9PiB7XG4gICAgY29uc3QgeyBEQlVXZWJDb21wb25lbnRCYXNlLCBkZWZpbmVDb21tb25TdGF0aWNNZXRob2RzIH0gPSBnZXREQlVXZWJDb21wb25lbnRCYXNlKHdpbik7XG4gICAgY29uc3QgeyBkb2N1bWVudCB9ID0gd2luO1xuXG4gICAgY29uc3QgdGVtcGxhdGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZW1wbGF0ZScpO1xuICAgIHRlbXBsYXRlLmlubmVySFRNTCA9IGBcbiAgICAgIDxzdHlsZT5cbiAgICAgIDpob3N0IHtcbiAgICAgICAgZGlzcGxheTogYmxvY2s7XG4gICAgICAgIGNvbG9yOiBtYXJvb247XG4gICAgICB9XG4gICAgICBcbiAgICAgIDpob3N0IGIge1xuICAgICAgICB0ZXh0LXNoYWRvdzogdmFyKC0tYi10ZXh0LXNoYWRvdywgbm9uZSk7XG4gICAgICB9XG4gICAgICBcbiAgICAgIDpob3N0KFtkaXI9cnRsXSkgYiB7XG4gICAgICAgIHRleHQtZGVjb3JhdGlvbjogdW5kZXJsaW5lO1xuICAgICAgICBwYWRkaW5nOiA1cHg7XG4gICAgICAgIGJvcmRlcjogMXB4IHNvbGlkIHJlZDtcbiAgICAgIH1cbiAgICAgIDpob3N0KFtkaXI9bHRyXSkgYiB7XG4gICAgICAgIHRleHQtZGVjb3JhdGlvbjogb3ZlcmxpbmU7XG4gICAgICAgIHBhZGRpbmc6IDVweDtcbiAgICAgICAgYm9yZGVyOiAxcHggc29saWQgZ3JlZW47XG4gICAgICB9XG4gICAgICBcbiAgICAgIDpob3N0KFtkaXI9cnRsXSkgc3Bhblt4LWhhcy1zbG90XSB7XG4gICAgICAgIGZsb2F0OiBsZWZ0O1xuICAgICAgfVxuICAgICAgXG4gICAgICA6aG9zdChbZGlyPWx0cl0pIHNwYW5beC1oYXMtc2xvdF0ge1xuICAgICAgICBmbG9hdDogcmlnaHQ7XG4gICAgICB9XG4gICAgICBcbiAgICAgIDpob3N0KFtkaXI9bHRyXSkgKltkaXI9cnRsXSB7XG4gICAgICAgIGRpc3BsYXk6IG5vbmU7XG4gICAgICB9XG4gICAgICA6aG9zdChbZGlyPXJ0bF0pICpbZGlyPWx0cl0ge1xuICAgICAgICBkaXNwbGF5OiBub25lO1xuICAgICAgfVxuICAgICAgXG4gICAgICA8L3N0eWxlPlxuICAgICAgXG4gICAgICA8YiBkaXI9XCJsdHJcIj5JJ20gaW4gc2hhZG93IGRvbSEgbHRyIChEQlVXZWJDb21wb25lbnREdW1teSk8L2I+XG4gICAgICA8c3BhbiB4LWhhcy1zbG90PjxzcGFuPls8L3NwYW4+PHNsb3Q+PC9zbG90PjxzcGFuPl08L3NwYW4+PC9zcGFuPlxuICAgICAgPGIgZGlyPVwicnRsXCI+SSdtIGluIHNoYWRvdyBkb20hIHJ0bCAoREJVV2ViQ29tcG9uZW50RHVtbXkpPC9iPlxuICAgIGA7XG5cbiAgICBjbGFzcyBEQlVXZWJDb21wb25lbnREdW1teSBleHRlbmRzIERCVVdlYkNvbXBvbmVudEJhc2Uge1xuICAgICAgc3RhdGljIGdldCByZWdpc3RyYXRpb25OYW1lKCkge1xuICAgICAgICByZXR1cm4gcmVnaXN0cmF0aW9uTmFtZTtcbiAgICAgIH1cblxuICAgICAgc3RhdGljIGdldCB0ZW1wbGF0ZSgpIHtcbiAgICAgICAgcmV0dXJuIHRlbXBsYXRlO1xuICAgICAgfVxuXG4gICAgICBvbkxvY2FsZUNoYW5nZShsb2NhbGUpIHtcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ29uTG9jYWxlQ2hhbmdlJywgbG9jYWxlKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBkZWZpbmVDb21tb25TdGF0aWNNZXRob2RzKERCVVdlYkNvbXBvbmVudER1bW15KTtcblxuICAgIHJldHVybiBEQlVXZWJDb21wb25lbnREdW1teTtcbiAgfSk7XG59XG5cbmdldERCVVdlYkNvbXBvbmVudER1bW15LnJlZ2lzdHJhdGlvbk5hbWUgPSByZWdpc3RyYXRpb25OYW1lO1xuXG4iLCJcblxuaW1wb3J0IGdldERCVVdlYkNvbXBvbmVudEJhc2UgZnJvbSAnLi4vREJVV2ViQ29tcG9uZW50QmFzZS9EQlVXZWJDb21wb25lbnRCYXNlJztcbmltcG9ydCBnZXREQlVXZWJDb21wb25lbnREdW1teSBmcm9tICcuLi9EQlVXZWJDb21wb25lbnREdW1teS9EQlVXZWJDb21wb25lbnREdW1teSc7XG5pbXBvcnQgZW5zdXJlU2luZ2xlUmVnaXN0cmF0aW9uIGZyb20gJy4uL2ludGVybmFscy9lbnN1cmVTaW5nbGVSZWdpc3RyYXRpb24nO1xuXG5jb25zdCByZWdpc3RyYXRpb25OYW1lID0gJ2RidS13ZWItY29tcG9uZW50LWR1bW15LXBhcmVudCc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGdldERCVVdlYkNvbXBvbmVudER1bW15UGFyZW50KHdpbikge1xuICByZXR1cm4gZW5zdXJlU2luZ2xlUmVnaXN0cmF0aW9uKHdpbiwgcmVnaXN0cmF0aW9uTmFtZSwgKCkgPT4ge1xuICAgIGNvbnN0IHsgREJVV2ViQ29tcG9uZW50QmFzZSwgZGVmaW5lQ29tbW9uU3RhdGljTWV0aG9kcyB9ID0gZ2V0REJVV2ViQ29tcG9uZW50QmFzZSh3aW4pO1xuICAgIGNvbnN0IERCVVdlYkNvbXBvbmVudER1bW15ID0gZ2V0REJVV2ViQ29tcG9uZW50RHVtbXkod2luKTtcblxuICAgIGNvbnN0IHsgZG9jdW1lbnQgfSA9IHdpbjtcblxuICAgIGNvbnN0IHRlbXBsYXRlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGVtcGxhdGUnKTtcbiAgICB0ZW1wbGF0ZS5pbm5lckhUTUwgPSBgXG4gICAgICA8c3R5bGU+XG4gICAgICA6aG9zdCB7ZGlzcGxheTogYmxvY2s7fVxuICAgICAgPC9zdHlsZT5cbiAgICAgIDxiPkknbSBpbiBzaGFkb3cgZG9tISAoREJVV2ViQ29tcG9uZW50RHVtbXlQYXJlbnQpPC9iPlxuICAgICAgPGRidS13ZWItY29tcG9uZW50LWR1bW15PjxzbG90Pjwvc2xvdD48L2RidS13ZWItY29tcG9uZW50LWR1bW15PlxuICAgIGA7XG5cbiAgICBjbGFzcyBEQlVXZWJDb21wb25lbnREdW1teVBhcmVudCBleHRlbmRzIERCVVdlYkNvbXBvbmVudEJhc2Uge1xuICAgICAgc3RhdGljIGdldCByZWdpc3RyYXRpb25OYW1lKCkge1xuICAgICAgICByZXR1cm4gcmVnaXN0cmF0aW9uTmFtZTtcbiAgICAgIH1cblxuICAgICAgc3RhdGljIGdldCB0ZW1wbGF0ZSgpIHtcbiAgICAgICAgcmV0dXJuIHRlbXBsYXRlO1xuICAgICAgfVxuXG4gICAgICBzdGF0aWMgZ2V0IGRlcGVuZGVuY2llcygpIHtcbiAgICAgICAgcmV0dXJuIFtEQlVXZWJDb21wb25lbnREdW1teV07XG4gICAgICB9XG5cbiAgICB9XG5cbiAgICBkZWZpbmVDb21tb25TdGF0aWNNZXRob2RzKERCVVdlYkNvbXBvbmVudER1bW15UGFyZW50KTtcblxuICAgIHJldHVybiBEQlVXZWJDb21wb25lbnREdW1teVBhcmVudDtcbiAgfSk7XG59XG5cbmdldERCVVdlYkNvbXBvbmVudER1bW15UGFyZW50LnJlZ2lzdHJhdGlvbk5hbWUgPSByZWdpc3RyYXRpb25OYW1lO1xuXG4iLCJcbi8qXG5EQlVXZWJDb21wb25lbnRCYXNlIChmcm9tIHdoaWNoIGFsbCB3ZWItY29tcG9uZW50cyBpbmhlcml0KVxud2lsbCByZWFkIGNvbXBvbmVudFN0eWxlIGZyb20gd2luLkRCVVdlYkNvbXBvbmVudHNcbndoZW4ga2xhc3MucmVnaXN0ZXJTZWxmKCkgaXMgY2FsbGVkIGdpdmluZyBhIGNoYW5jZSB0byBvdmVycmlkZSBkZWZhdWx0IHdlYi1jb21wb25lbnQgc3R5bGVcbmp1c3QgYmVmb3JlIGl0IGlzIHJlZ2lzdGVyZWQuXG4qL1xuY29uc3QgYXBwZW5kU3R5bGUgPSAod2luKSA9PiAocmVnaXN0cmF0aW9uTmFtZSwgY29tcG9uZW50U3R5bGUpID0+IHtcbiAgaWYgKCF3aW4uREJVV2ViQ29tcG9uZW50cykge1xuICAgIHdpbi5EQlVXZWJDb21wb25lbnRzID0ge307XG4gIH1cbiAgd2luLkRCVVdlYkNvbXBvbmVudHMgPSB7XG4gICAgLi4ud2luLkRCVVdlYkNvbXBvbmVudHMsXG4gICAgW3JlZ2lzdHJhdGlvbk5hbWVdOiB7XG4gICAgICAuLi53aW4uREJVV2ViQ29tcG9uZW50c1tyZWdpc3RyYXRpb25OYW1lXSxcbiAgICAgIGNvbXBvbmVudFN0eWxlXG4gICAgfVxuICB9O1xufTtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZGJ1V2ViQ29tcG9uZW50c1NldFVwKHdpbikge1xuICByZXR1cm4ge1xuICAgIGFwcGVuZFN0eWxlOiBhcHBlbmRTdHlsZSh3aW4pXG4gIH07XG59XG4iLCJcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZW5zdXJlU2luZ2xlUmVnaXN0cmF0aW9uKHdpbiwgbmFtZSwgY2FsbGJhY2spIHtcbiAgaWYgKCF3aW4uREJVV2ViQ29tcG9uZW50cykge1xuICAgIHdpbi5EQlVXZWJDb21wb25lbnRzID0geyByZWdpc3RyYXRpb25zOiB7fSB9O1xuICB9IGVsc2UgaWYgKCF3aW4uREJVV2ViQ29tcG9uZW50cy5yZWdpc3RyYXRpb25zKSB7XG4gICAgd2luLkRCVVdlYkNvbXBvbmVudHMucmVnaXN0cmF0aW9ucyA9IHt9O1xuICB9XG5cbiAgbGV0IHJlZ2lzdHJhdGlvbiA9IHdpbi5EQlVXZWJDb21wb25lbnRzLnJlZ2lzdHJhdGlvbnNbbmFtZV07XG5cbiAgaWYgKHJlZ2lzdHJhdGlvbikgcmV0dXJuIHJlZ2lzdHJhdGlvbjtcblxuICByZWdpc3RyYXRpb24gPSBjYWxsYmFjaygpO1xuICB3aW4uREJVV2ViQ29tcG9uZW50cy5yZWdpc3RyYXRpb25zW25hbWVdID0gcmVnaXN0cmF0aW9uO1xuXG4gIHJldHVybiB3aW4uREJVV2ViQ29tcG9uZW50cy5yZWdpc3RyYXRpb25zW25hbWVdO1xufVxuXG4iLCJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCBzY3JlZW5zIGZyb20gJy4vc2NyZWVucyc7XG5cbmNsYXNzIElGcmFtZVNjcmVlbiBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCBpc1Byb2QgPSB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUuaW5jbHVkZXMoJy5wcm9kLicpO1xuICAgIGNvbnN0IHdpbmRvd0xvY2F0aW9uSGFzaCA9IHdpbmRvdy5sb2NhdGlvbi5oYXNoLnJlcGxhY2UoJyMnLCAnJyk7XG4gICAgcmV0dXJuIChcbiAgICAgIDxpZnJhbWVcbiAgICAgICAgb25Mb2FkPXsoZXZ0KSA9PiBjb25zb2xlLmxvZygnaWZyYW1lIGxvYWRlZCcpfVxuICAgICAgICBzcmM9e2BzcmNEZW1vL3NjcmVlbnNXZWJDb21wb25lbnRzLyR7d2luZG93TG9jYXRpb25IYXNofT9wcm9kdWN0aW9uPSR7aXNQcm9kID8gJzEnIDogJzAnfWB9IC8+XG4gICAgKTtcbiAgfVxufVxuXG5jbGFzcyBBcHAgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignaGFzaGNoYW5nZScsIHRoaXMub25IYXNoQ2hhbmdlLmJpbmQodGhpcykpO1xuICB9XG5cbiAgb25IYXNoQ2hhbmdlKCkge1xuICAgIHRoaXMuZm9yY2VVcGRhdGUoKTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgICAgLyogZXNsaW50IG5vLWNvbnNvbGU6IDAgKi9cbiAgICAgIC8vIGNvbnNvbGUubG9nKCdyZW5kZXJpbmcgQXBwIGNvbXBvbmVudCcpO1xuICAgIH1cbiAgICBjb25zdCBzY3JlZW5zS2V5cyA9IE9iamVjdC5rZXlzKHNjcmVlbnMpO1xuICAgIGNvbnN0IGxpbmtzID0gPHVsPlxuICAgICAge1xuICAgICAgICBzY3JlZW5zS2V5cy5tYXAoKHNjcmVlbiwgaWR4KSA9PiAoXG4gICAgICAgICAgPGxpIGtleT17aWR4fT5cbiAgICAgICAgICAgIDxhIGtleT17aWR4fSBocmVmPXtgIyR7c2NyZWVufWB9PntzY3JlZW59PC9hPlxuICAgICAgICAgIDwvbGk+XG4gICAgICAgICkpXG4gICAgICB9XG4gICAgPC91bD47XG5cbiAgICBjb25zdCB3aW5kb3dMb2NhdGlvbkhhc2ggPSAod2luZG93LmxvY2F0aW9uLmhhc2ggfHwgYCMke3NjcmVlbnNLZXlzWzBdfWApLnJlcGxhY2UoJyMnLCAnJyk7XG4gICAgY29uc3QgU2NyZWVuID0gd2luZG93TG9jYXRpb25IYXNoLmVuZHNXaXRoKCcuaHRtbCcpID8gSUZyYW1lU2NyZWVuIDogc2NyZWVuc1t3aW5kb3dMb2NhdGlvbkhhc2hdO1xuXG4gICAgaWYgKCFTY3JlZW4pIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImRlbW8td3JhcHBlclwiPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImRlbW8tbGlua3NcIj5cbiAgICAgICAgICB7bGlua3N9XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImRlbW8tYXJlYVwiPlxuICAgICAgICAgIDxTY3JlZW4vPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn1cblxuQXBwLnByb3BUeXBlcyA9IHtcbiAgY2xhc3NlczogUHJvcFR5cGVzLm9iamVjdCxcbiAgdGhlbWU6IFByb3BUeXBlcy5vYmplY3Rcbn07XG5cbmV4cG9ydCBkZWZhdWx0IEFwcDtcbiIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUmVhY3RET00gZnJvbSAncmVhY3QtZG9tJztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQge1xuICAvLyBvblNjcmVlbkNvbnNvbGUsXG4gIGxvY2FsZUF3YXJlXG59IGZyb20gJ2Rldi1ib3gtdWknO1xuaW1wb3J0IEFwcCBmcm9tICcuL2FwcCc7XG5cbi8vIGltcG9ydCBnZXREQlVXZWJDb21wb25lbnREdW1teSBmcm9tICcuLi9idWlsZC9zcmMvbGliL3dlYmNvbXBvbmVudHMvREJVV2ViQ29tcG9uZW50RHVtbXkvREJVV2ViQ29tcG9uZW50RHVtbXknO1xuLy8gaW1wb3J0IGdldERCVVdlYkNvbXBvbmVudER1bW15UGFyZW50IGZyb20gJy4uL2J1aWxkL3NyYy9saWIvd2ViY29tcG9uZW50cy9EQlVXZWJDb21wb25lbnREdW1teVBhcmVudC9EQlVXZWJDb21wb25lbnREdW1teVBhcmVudCc7XG5pbXBvcnQgZGJ1V2ViQ29tcG9uZW50c1NldFVwIGZyb20gJy4uL3NyYy9saWIvd2ViY29tcG9uZW50cy9EQlVXZWJDb21wb25lbnRzU2V0dXAvREJVV2ViQ29tcG9uZW50c1NldHVwJztcbmltcG9ydCBnZXREQlVXZWJDb21wb25lbnREdW1teSBmcm9tICcuLi9zcmMvbGliL3dlYmNvbXBvbmVudHMvREJVV2ViQ29tcG9uZW50RHVtbXkvREJVV2ViQ29tcG9uZW50RHVtbXknO1xuaW1wb3J0IGdldERCVVdlYkNvbXBvbmVudER1bW15UGFyZW50IGZyb20gJy4uL3NyYy9saWIvd2ViY29tcG9uZW50cy9EQlVXZWJDb21wb25lbnREdW1teVBhcmVudC9EQlVXZWJDb21wb25lbnREdW1teVBhcmVudCc7XG5cbmRidVdlYkNvbXBvbmVudHNTZXRVcCh3aW5kb3cpLmFwcGVuZFN0eWxlKCdkYnUtd2ViLWNvbXBvbmVudC1kdW1teScsIGBcbiAgYiB7XG4gICAgY29sb3I6IGRlZXBza3libHVlO1xuICAgIGZvbnQtc3R5bGU6IG9ibGlxdWU7XG4gIH1cbmApO1xuXG5jb25zdCBEQlVXZWJDb21wb25lbnREdW1teSA9IGdldERCVVdlYkNvbXBvbmVudER1bW15KHdpbmRvdyk7XG5jb25zdCBEQlVXZWJDb21wb25lbnREdW1teVBhcmVudCA9IGdldERCVVdlYkNvbXBvbmVudER1bW15UGFyZW50KHdpbmRvdyk7XG5cblxuc2V0VGltZW91dCgoKSA9PiB7XG4gIERCVVdlYkNvbXBvbmVudER1bW15LnJlZ2lzdGVyU2VsZigpO1xuICBEQlVXZWJDb21wb25lbnREdW1teVBhcmVudC5yZWdpc3RlclNlbGYoKTtcbn0sIDIwMDApO1xuXG5jb25zdCBpZnJhbWUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpZnJhbWUnKTtcblxud2luZG93Lm9ubWVzc2FnZSA9IGZ1bmN0aW9uIChtc2cpIHsgY29uc29sZS5sb2coJ21zZyBmcm9tIGlmcmFtZScsIG1zZyk7IH07XG5pZnJhbWUub25sb2FkID0gZnVuY3Rpb24gKGV2dCkge1xuICBjb25zdCB0YXJnZXQgPSBldnQudGFyZ2V0O1xuXG4gIHRhcmdldC5jb250ZW50V2luZG93LmRvY3VtZW50LndyaXRlKGBcbiAgICA8aHRtbD5cbiAgICA8Ym9keT5cbiAgICAgIDxkYnUtd2ViLWNvbXBvbmVudC1kdW1teVxuICAgICAgICBzdHlsZT1cImNvbG9yOiBibHVlXCJcbiAgICAgID5cbiAgICAgICAgPHNwYW4+aGVsbG8gd29ybGQgMzwvc3Bhbj5cbiAgICAgIDwvZGJ1LXdlYi1jb21wb25lbnQtZHVtbXk+XG4gICAgICA8ZGJ1LXdlYi1jb21wb25lbnQtZHVtbXktcGFyZW50PjwvZGJ1LXdlYi1jb21wb25lbnQtZHVtbXktcGFyZW50PlxuICAgIDwvYm9keT5cbiAgICA8c2NyaXB0PlxuICAgICAgd2luZG93Lm9ubWVzc2FnZSA9IGZ1bmN0aW9uIChtc2cpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ21zZyBmcm9tIHdpbmRvdycsIG1zZyk7XG4gICAgICAgIHdpbmRvdy50b3AucG9zdE1lc3NhZ2UoJ3dvcmxkJywgJyonKTtcbiAgICAgIH07XG4gICAgPC9zY3JpcHQ+XG4gICAgPC9odG1sPlxuICBgKTtcbiAgdGFyZ2V0LmNvbnRlbnRXaW5kb3cucG9zdE1lc3NhZ2UoJ2hlbGxvJywgJyonKTtcblxuICBkYnVXZWJDb21wb25lbnRzU2V0VXAodGFyZ2V0LmNvbnRlbnRXaW5kb3cpLmFwcGVuZFN0eWxlKCdkYnUtd2ViLWNvbXBvbmVudC1kdW1teScsIGBcbiAgICBiIHtcbiAgICAgIGZvbnQtc3R5bGU6IG9ibGlxdWU7XG4gICAgICBvcGFjaXR5OiAwLjU7XG4gICAgfVxuICBgKTtcbiAgY29uc3QgREJVV2ViQ29tcG9uZW50RHVtbXkyID0gZ2V0REJVV2ViQ29tcG9uZW50RHVtbXkodGFyZ2V0LmNvbnRlbnRXaW5kb3cpO1xuICBjb25zdCBEQlVXZWJDb21wb25lbnREdW1teVBhcmVudDIgPSBnZXREQlVXZWJDb21wb25lbnREdW1teVBhcmVudCh0YXJnZXQuY29udGVudFdpbmRvdyk7XG4gIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgIERCVVdlYkNvbXBvbmVudER1bW15Mi5yZWdpc3RlclNlbGYoKTtcbiAgICBEQlVXZWJDb21wb25lbnREdW1teVBhcmVudDIucmVnaXN0ZXJTZWxmKCk7XG5cbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIC8vIHRhcmdldC5yZW1vdmUoKTtcbiAgICB9LCAyMDAwKTtcbiAgfSwgMjAwMCk7XG59O1xuXG4vLyBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGlmcmFtZSk7XG5cblxuLy8gb25TY3JlZW5Db25zb2xlKHsgb3B0aW9uczogeyBzaG93TGFzdE9ubHk6IGZhbHNlIH0gfSk7XG5cbmxldCBEZW1vID0gY2xhc3MgRGVtbyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHJlbmRlcigpIHtcbiAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgICAgLyogZXNsaW50IG5vLWNvbnNvbGU6IDAgKi9cbiAgICAgIC8vIGNvbnNvbGUubG9nKCdyZW5kZXJpbmcgRGVtbyBjb21wb25lbnQnKTtcbiAgICB9XG4gICAgY29uc3QgeyBsb2NhbGU6IHsgZGlyIH0gfSA9IHRoaXMucHJvcHM7XG4gICAgcmV0dXJuIChcbiAgICAgIDxBcHAgLz5cbiAgICApO1xuICB9XG59O1xuXG5EZW1vLnByb3BUeXBlcyA9IHtcbiAgbG9jYWxlOiBQcm9wVHlwZXMub2JqZWN0XG59O1xuXG5EZW1vID0gbG9jYWxlQXdhcmUoRGVtbyk7XG5cblJlYWN0RE9NLnJlbmRlcigoXG4gIDxEZW1vLz5cbiksIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdkZW1vJykpO1xuIiwiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcblxuY2xhc3MgREJVV2ViQ29tcG9uZW50RHVtbXlTY3JlZW4gZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXY+XG5cbiAgICAgICAgPGRidS13ZWItY29tcG9uZW50LWR1bW15XG4gICAgICAgICAgc3R5bGU9e3sgY29sb3I6ICdibHVlJyB9fVxuICAgICAgICA+XG4gICAgICAgICAgPHNwYW4+aGVsbG8gd29ybGQgMTwvc3Bhbj5cbiAgICAgICAgPC9kYnUtd2ViLWNvbXBvbmVudC1kdW1teT5cblxuICAgICAgICA8ZGJ1LXdlYi1jb21wb25lbnQtZHVtbXlcbiAgICAgICAgICBzdHlsZT17eyBjb2xvcjogJ2JsdWUnIH19XG4gICAgICAgID5cbiAgICAgICAgICA8c3Bhbj5oZWxsbyB3b3JsZCAyPC9zcGFuPlxuICAgICAgICA8L2RidS13ZWItY29tcG9uZW50LWR1bW15PlxuICAgICAgICA8ZGJ1LXdlYi1jb21wb25lbnQtZHVtbXktcGFyZW50PjwvZGJ1LXdlYi1jb21wb25lbnQtZHVtbXktcGFyZW50PlxuXG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IERCVVdlYkNvbXBvbmVudER1bW15U2NyZWVuO1xuIiwiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7XG4gIERyYWdnYWJsZSwgRGlzYWJsZVNlbGVjdGlvblxufSBmcm9tICdkZXYtYm94LXVpJztcblxuY2xhc3MgVG9SZW5kZXIgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICByZW5kZXIoKSB7XG4gICAgLy8gY29uc29sZS5sb2coJ1RvUmVuZGVyI3JlbmRlcicpO1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2XG4gICAgICAgIHN0eWxlPXt7IHdpZHRoOiAzMDAsIGhlaWdodDogMzAwIH19XG4gICAgICAgIG9uTW91c2VEb3duPXt0aGlzLnByb3BzLm9uTW91c2VEb3dufVxuICAgICAgICBvbk1vdXNlVXA9e3RoaXMucHJvcHMub25Nb3VzZVVwfVxuICAgICAgICBvbkNsaWNrPXt0aGlzLnByb3BzLm9uQ2xpY2t9XG4gICAgICAgIG9uVG91Y2hTdGFydD17dGhpcy5wcm9wcy5vblRvdWNoU3RhcnR9XG4gICAgICAgIG9uVG91Y2hFbmQ9e3RoaXMucHJvcHMub25Ub3VjaEVuZH1cbiAgICAgID5cbiAgICAgICAgPHA+ZHJhZ2dhYmxlIHAge3RoaXMucHJvcHMuY291bnRlcn0gPGEgaHJlZj1cImh0dHA6Ly9nb29nbGUuY29tXCIgdGFyZ2V0PVwiX2JsYW5rXCI+bGluazwvYT48L3A+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG59XG5cbmNsYXNzIERyYWdnYWJsZVNjcmVlbiBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuICAgIHRoaXMuaGFuZGxlTW91c2VEb3duID0gdGhpcy5oYW5kbGVNb3VzZURvd24uYmluZCh0aGlzKTtcbiAgICB0aGlzLmhhbmRsZVRvdWNoU3RhcnQgPSB0aGlzLmhhbmRsZVRvdWNoU3RhcnQuYmluZCh0aGlzKTtcbiAgICB0aGlzLmhhbmRsZU1vdXNlVXAgPSB0aGlzLmhhbmRsZU1vdXNlVXAuYmluZCh0aGlzKTtcbiAgICB0aGlzLmhhbmRsZVRvdWNoRW5kID0gdGhpcy5oYW5kbGVUb3VjaEVuZC5iaW5kKHRoaXMpO1xuICAgIHRoaXMuaGFuZGxlQ2xpY2sgPSB0aGlzLmhhbmRsZUNsaWNrLmJpbmQodGhpcyk7XG5cbiAgICB0aGlzLmNvdW50ZXIgPSAxO1xuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICBkcmFnZ2FibGVDb250ZW50OiB0aGlzLmRyYWdnYWJsZUNvbnRlbnRcbiAgICB9O1xuICB9XG5cbiAgZ2V0IGRyYWdnYWJsZUNvbnRlbnQoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxUb1JlbmRlclxuICAgICAgICBvbk1vdXNlRG93bj17dGhpcy5oYW5kbGVNb3VzZURvd259XG4gICAgICAgIG9uTW91c2VVcD17dGhpcy5oYW5kbGVNb3VzZVVwfVxuICAgICAgICBvblRvdWNoU3RhcnQ9e3RoaXMuaGFuZGxlVG91Y2hTdGFydH1cbiAgICAgICAgb25Ub3VjaEVuZD17dGhpcy5oYW5kbGVUb3VjaEVuZH1cbiAgICAgICAgb25DbGljaz17dGhpcy5oYW5kbGVDbGlja31cbiAgICAgICAgY291bnRlcj17dGhpcy5jb3VudGVyfVxuICAgICAgLz5cbiAgICApO1xuICB9XG5cbiAgaGFuZGxlTW91c2VEb3duKGV2dCkge1xuICAgIGNvbnNvbGUubG9nKCdEcmFnZ2FibGVTY3JlZW4jaGFuZGxlTW91c2VEb3duJyk7XG4gIH1cbiAgaGFuZGxlTW91c2VVcChldnQpIHtcbiAgICBjb25zb2xlLmxvZygnRHJhZ2dhYmxlU2NyZWVuI2hhbmRsZU1vdXNlVXAnKTtcbiAgfVxuICBoYW5kbGVUb3VjaFN0YXJ0KGV2dCkge1xuICAgIGNvbnNvbGUubG9nKCdEcmFnZ2FibGVTY3JlZW4jaGFuZGxlVG91Y2hTdGFydCcpO1xuICB9XG4gIGhhbmRsZVRvdWNoRW5kKGV2dCkge1xuICAgIGNvbnNvbGUubG9nKCdEcmFnZ2FibGVTY3JlZW4jaGFuZGxlVG91Y2hFbmQnKTtcbiAgfVxuICBoYW5kbGVDbGljayhldnQpIHtcbiAgICBjb25zb2xlLmxvZygnRHJhZ2dhYmxlU2NyZWVuI2hhbmRsZUNsaWNrJyk7XG4gICAgLy8gdGhpcy5jb3VudGVyID0gdGhpcy5jb3VudGVyICsgMTtcbiAgICAvLyB0aGlzLnNldFN0YXRlKHtcbiAgICAvLyAgIGRyYWdnYWJsZUNvbnRlbnQ6IHRoaXMuZHJhZ2dhYmxlQ29udGVudFxuICAgIC8vIH0pO1xuICB9XG5cbiAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICB0aGlzLmNvdW50ZXIgPSB0aGlzLmNvdW50ZXIgKyAxO1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIGRyYWdnYWJsZUNvbnRlbnQ6IHRoaXMuZHJhZ2dhYmxlQ29udGVudFxuICAgICAgfSk7XG4gICAgfSwgMzAwMCk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXY+XG4gICAgICAgIDxEcmFnZ2FibGUgc3R5bGU9e3sgYm9yZGVyOiAnMXB4IHNvbGlkIGJsdWUnLCB3aWR0aDogMjAwLCBoZWlnaHQ6IDIwMCwgb3ZlcmZsb3dYOiAnc2Nyb2xsJywgb3ZlcmZsb3dZOiAnc2Nyb2xsJyB9fT5cbiAgICAgICAgICB7dGhpcy5zdGF0ZS5kcmFnZ2FibGVDb250ZW50fVxuICAgICAgICA8L0RyYWdnYWJsZT5cbiAgICAgICAgPERpc2FibGVTZWxlY3Rpb24+XG4gICAgICAgICAgPHA+ZGlzYWJsZWQgc2VsZWN0aW9uPC9wPlxuICAgICAgICA8L0Rpc2FibGVTZWxlY3Rpb24+XG4gICAgICAgIHtBcnJheS5mcm9tKHsgbGVuZ3RoOiAxMCB9KS5tYXAoKGVsLCBpKSA9PiA8cCBrZXk9e2l9PntpfSAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS08L3A+KX1cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgRHJhZ2dhYmxlU2NyZWVuO1xuIiwiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7XG4gIEZvcm1JbnB1dE51bWJlclxufSBmcm9tICdkZXYtYm94LXVpJztcblxuXG5jbGFzcyBGb3JtSW5wdXROdW1iZXJTY3JlZW4gZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgaW5wdXRWYWx1ZTogLTcuMDhcbiAgICB9O1xuICAgIHRoaXMuaGFuZGxlQ2hhbmdlID0gdGhpcy5oYW5kbGVDaGFuZ2UuYmluZCh0aGlzKTtcbiAgfVxuXG4gIGhhbmRsZUNoYW5nZShpbnB1dFZhbHVlKSB7XG4gICAgY29uc3QgdmFsdWVUb1NlbmRCYWNrID0gTnVtYmVyKGlucHV0VmFsdWUudG9QcmVjaXNpb24oMTYpKTtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIGlucHV0VmFsdWU6IHZhbHVlVG9TZW5kQmFja1xuICAgIH0pO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2PlxuICAgICAgICA8Rm9ybUlucHV0TnVtYmVyXG4gICAgICAgICAgdmFsdWU9e3RoaXMuc3RhdGUuaW5wdXRWYWx1ZX1cbiAgICAgICAgICBvbkNoYW5nZT17dGhpcy5oYW5kbGVDaGFuZ2V9XG4gICAgICAgICAgZGVmYXVsdERlY1BvaW50PVwiLFwiXG4gICAgICAgICAgZGVmYXVsdFRob3VzYW5kc1NlcGFyYXRvcj1cIi5cIlxuICAgICAgICAvPlxuICAgICAgICA8Rm9ybUlucHV0TnVtYmVyXG4gICAgICAgICAgdmFsdWU9e3RoaXMuc3RhdGUuaW5wdXRWYWx1ZX1cbiAgICAgICAgICBvbkNoYW5nZT17dGhpcy5oYW5kbGVDaGFuZ2V9XG4gICAgICAgIC8+XG4gICAgICAgIDxwPnt0aGlzLnN0YXRlLmlucHV0VmFsdWV9eydcXHUwMEEwJ308L3A+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEZvcm1JbnB1dE51bWJlclNjcmVlbjtcbiIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQge1xuICBGb3JtSW5wdXRcbn0gZnJvbSAnZGV2LWJveC11aSc7XG5cblxuY2xhc3MgRm9ybUlucHV0U2NyZWVuIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIGlucHV0VmFsdWU6IDZcbiAgICB9O1xuICAgIHRoaXMuaGFuZGxlQ2hhbmdlID0gdGhpcy5oYW5kbGVDaGFuZ2UuYmluZCh0aGlzKTtcbiAgfVxuXG4gIGhhbmRsZUNoYW5nZShpbnB1dFZhbHVlKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBpbnB1dFZhbHVlXG4gICAgfSk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXY+XG4gICAgICAgIDxGb3JtSW5wdXRcbiAgICAgICAgICB2YWx1ZT17dGhpcy5zdGF0ZS5pbnB1dFZhbHVlfVxuICAgICAgICAgIG9uQ2hhbmdlPXt0aGlzLmhhbmRsZUNoYW5nZX1cbiAgICAgICAgICBoYXNXYXJuaW5nPXtmYWxzZX1cbiAgICAgICAgICBoYXNFcnJvcj17ZmFsc2V9XG4gICAgICAgICAgZGlzYWJsZWQ9e2ZhbHNlfVxuICAgICAgICAvPlxuICAgICAgICA8cD57dGhpcy5zdGF0ZS5pbnB1dFZhbHVlfXsnXFx1MDBBMCd9PC9wPlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBGb3JtSW5wdXRTY3JlZW47XG4iLCJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IHtcbiAgSGVsbG9cbn0gZnJvbSAnZGV2LWJveC11aSc7XG5cbmNsYXNzIEhlbGxvU2NyZWVuIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgcmVuZGVyKCkge1xuICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgICAvKiBlc2xpbnQgbm8tY29uc29sZTogMCAqL1xuICAgICAgLy8gY29uc29sZS5sb2coJ3JlbmRlcmluZyBIZWxsb1NjcmVlbiBjb21wb25lbnQnKTtcbiAgICB9XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXY+XG4gICAgICAgIDxIZWxsbyAvPlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBIZWxsb1NjcmVlbjtcbiIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQge1xuICBMaXN0XG59IGZyb20gJ2Rldi1ib3gtdWknO1xuXG5jbGFzcyBMaXN0U2NyZWVuIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2PlxuICAgICAgICA8TGlzdCBpdGVtcz17Wyd0aHJlZScsICdmb3VyJ119Lz5cbiAgICAgICAgPExpc3QgaXRlbXM9e1sndGhyZWUnLCAnZm91ciddfS8+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IExpc3RTY3JlZW47XG4iLCJpbXBvcnQgSGVsbG9TY3JlZW4gZnJvbSAnLi9IZWxsb1NjcmVlbic7XG5pbXBvcnQgTGlzdFNjcmVlbiBmcm9tICcuL0xpc3RTY3JlZW4nO1xuaW1wb3J0IEZvcm1JbnB1dFNjcmVlbiBmcm9tICcuL0Zvcm1JbnB1dFNjcmVlbic7XG5pbXBvcnQgRm9ybUlucHV0TnVtYmVyU2NyZWVuIGZyb20gJy4vRm9ybUlucHV0TnVtYmVyU2NyZWVuJztcbmltcG9ydCBEcmFnZ2FibGUgZnJvbSAnLi9EcmFnZ2FibGVTY3JlZW4nO1xuaW1wb3J0IERCVVdlYkNvbXBvbmVudER1bW15U2NyZWVuIGZyb20gJy4vREJVV2ViQ29tcG9uZW50RHVtbXlTY3JlZW4nO1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIEhlbGxvU2NyZWVuLFxuICBMaXN0U2NyZWVuLFxuICBGb3JtSW5wdXRTY3JlZW4sXG4gIEZvcm1JbnB1dE51bWJlclNjcmVlbixcbiAgRHJhZ2dhYmxlLFxuICBEQlVXZWJDb21wb25lbnREdW1teVNjcmVlbixcbiAgJ0RCVVdlYkNvbXBvbmVudER1bW15U2NyZWVuLmh0bWwnOiBudWxsLFxuICAnREJVV2ViQ29tcG9uZW50RHVtbXlQYXJlbnRTY3JlZW4uaHRtbCc6IG51bGxcbn07XG4iXX0=
