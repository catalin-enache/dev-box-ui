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
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var IconBase = function IconBase(_ref, _ref2) {
  var children = _ref.children;
  var color = _ref.color;
  var size = _ref.size;
  var style = _ref.style;
  var width = _ref.width;
  var height = _ref.height;

  var props = _objectWithoutProperties(_ref, ['children', 'color', 'size', 'style', 'width', 'height']);

  var _ref2$reactIconBase = _ref2.reactIconBase;
  var reactIconBase = _ref2$reactIconBase === undefined ? {} : _ref2$reactIconBase;

  var computedSize = size || reactIconBase.size || '1em';
  return _react2.default.createElement('svg', _extends({
    children: children,
    fill: 'currentColor',
    preserveAspectRatio: 'xMidYMid meet',
    height: height || computedSize,
    width: width || computedSize
  }, reactIconBase, props, {
    style: _extends({
      verticalAlign: 'middle',
      color: color || reactIconBase.color
    }, reactIconBase.style || {}, style)
  }));
};

IconBase.propTypes = {
  color: _propTypes2.default.string,
  size: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.number]),
  width: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.number]),
  height: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.number]),
  style: _propTypes2.default.object
};

IconBase.contextTypes = {
  reactIconBase: _propTypes2.default.shape(IconBase.propTypes)
};

exports.default = IconBase;
module.exports = exports['default'];
},{"prop-types":"prop-types","react":"react"}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactIconBase = require('react-icon-base');

var _reactIconBase2 = _interopRequireDefault(_reactIconBase);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var FaSpinner = function FaSpinner(props) {
    return _react2.default.createElement(
        _reactIconBase2.default,
        _extends({ viewBox: '0 0 40 40' }, props),
        _react2.default.createElement(
            'g',
            null,
            _react2.default.createElement('path', { d: 'm11.7 31.1q0 1.2-0.8 2t-2 0.9q-1.2 0-2-0.9t-0.9-2q0-1.2 0.9-2t2-0.8 2 0.8 0.8 2z m11.2 4.6q0 1.2-0.9 2t-2 0.9-2-0.9-0.9-2 0.9-2 2-0.8 2 0.8 0.9 2z m-15.8-15.7q0 1.2-0.8 2t-2 0.9-2-0.9-0.9-2 0.9-2 2-0.9 2 0.9 0.8 2z m26.9 11.1q0 1.2-0.9 2t-2 0.9q-1.2 0-2-0.9t-0.8-2 0.8-2 2-0.8 2 0.8 0.9 2z m-21.5-22.2q0 1.5-1.1 2.5t-2.5 1.1-2.5-1.1-1.1-2.5 1.1-2.5 2.5-1.1 2.5 1.1 1.1 2.5z m26.1 11.1q0 1.2-0.9 2t-2 0.9-2-0.9-0.8-2 0.8-2 2-0.9 2 0.9 0.9 2z m-14.3-15.7q0 1.8-1.3 3t-3 1.3-3-1.3-1.3-3 1.3-3.1 3-1.2 3 1.3 1.3 3z m11.8 4.6q0 2.1-1.5 3.5t-3.5 1.5q-2.1 0-3.5-1.5t-1.5-3.5q0-2.1 1.5-3.5t3.5-1.5q2.1 0 3.5 1.5t1.5 3.5z' })
        )
    );
};

exports.default = FaSpinner;
module.exports = exports['default'];
},{"react":"react","react-icon-base":2}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = localeAware;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _hoistNonReactStatics = require('hoist-non-react-statics');

var _hoistNonReactStatics2 = _interopRequireDefault(_hoistNonReactStatics);

var _DBUILocaleService = require('./../../web-components/services/DBUILocaleService');

var _DBUILocaleService2 = _interopRequireDefault(_DBUILocaleService);

var _DBUII18nService = require('./../../web-components/services/DBUII18nService');

var _DBUII18nService2 = _interopRequireDefault(_DBUII18nService);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const localeService = (0, _DBUILocaleService2.default)(window);
const i18nService = (0, _DBUII18nService2.default)(window);

function localeAware(Component) {
  class LocaleAware extends _react2.default.Component {
    constructor(props, context) {
      super(props, context);
      this.handleLocaleChange = this.handleLocaleChange.bind(this);
      this.unregisterLocaleChange = null;
      this.state = {
        locale: localeService.locale
      };
      this._mounted = false;
      this._component = null;
    }

    handleLocaleChange(locale) {
      this._mounted && this.state.locale !== locale && this.setState({
        locale
      });
    }

    componentDidMount() {
      this.unregisterLocaleChange = localeService.onLocaleChange(this.handleLocaleChange);
      this._mounted = true;
    }

    componentWillUnmount() {
      this._mounted = false;
      this.unregisterLocaleChange();
    }

    render() {
      const { locale } = this.state;
      return _react2.default.createElement(Component, _extends({}, this.props, {
        locale: locale,
        translations: i18nService.currentLangTranslations,
        ref: comp => this._component = comp
      }));
    }
  }

  LocaleAware.displayName = `LocaleAware(${Component.displayName || Component.name || 'Component'})`;

  return (0, _hoistNonReactStatics2.default)(LocaleAware, Component);
}

},{"./../../web-components/services/DBUII18nService":13,"./../../web-components/services/DBUILocaleService":14,"hoist-non-react-statics":"hoist-non-react-statics","react":"react"}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function clearCurrentSelection() {
  window.getSelection && window.getSelection().removeAllRanges();
}

class DisableSelection extends _react2.default.PureComponent {

  constructor(props) {
    super(props);

    this.disableSelection = this.disableSelection.bind(this);
    this.killSelection = this.killSelection.bind(this);
    this.enableSelection = this.enableSelection.bind(this);
  }

  get selectionEvent() {
    // selectstart || mousemove
    return document.onselectstart !== undefined ? 'selectstart' : 'mousemove';
  }

  killSelection(e) {
    switch (e.type) {
      case 'selectstart':
        e.preventDefault();
        break;
      case 'mousemove':
        clearCurrentSelection();
        break;
      default:
      // pass
    }
  }

  disableSelection() {
    // first clear any current selection
    clearCurrentSelection();

    // then disable further selection

    // 1. by style
    document.body.style.MozUserSelect = 'none';
    document.body.style.WebkitUserSelect = 'none';
    document.body.style.userSelect = 'none';

    // 2. by adding event listeners
    const evt = this.selectionEvent;
    document.addEventListener(evt, this.killSelection, false);
    document.addEventListener('mouseup', this.enableSelection, false);
    document.addEventListener('touchend', this.enableSelection, false);
  }

  enableSelection() {
    // 1. by style
    document.body.style.MozUserSelect = null;
    document.body.style.WebkitUserSelect = null;
    document.body.style.userSelect = null;

    // 2. by removing event listeners
    const evt = this.selectionEvent;
    document.removeEventListener(evt, this.killSelection, false);
    document.removeEventListener('mouseup', this.enableSelection, false);
    document.removeEventListener('touchend', this.enableSelection, false);
  }

  render() {
    return _react2.default.createElement(
      'div',
      {
        onMouseDown: this.disableSelection,
        onTouchStart: this.disableSelection
      },
      this.props.children
    );
  }

}

exports.default = DisableSelection;
DisableSelection.propTypes = {
  children: _propTypes2.default.element
};

},{"prop-types":"prop-types","react":"react"}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _DisableSelection = require('../../components/DisableSelection/DisableSelection');

var _DisableSelection2 = _interopRequireDefault(_DisableSelection);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getMeasurements(node, evt) {
  const nodeComputedStyle = getComputedStyle(node, null);
  const { clientX: startX, clientY: startY } = evt;
  const matrix = nodeComputedStyle.transform.match(/-?\d*\.?\d+/g).map(Number);
  const [transformX, transformY] = [matrix[4], matrix[5]];
  const ret = {
    startX, startY, transformX, transformY
  };
  return ret;
}

class Draggable extends _react2.default.PureComponent {
  constructor(props) {
    super(props);

    this.node = null;
    this.measurements = null;
    this.transformX = 0;
    this.transformY = 0;

    this.captureNode = this.captureNode.bind(this);
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleTouchStart = this.handleTouchStart.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.handleTouchEnd = this.handleTouchEnd.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleTouchMove = this.handleTouchMove.bind(this);
    this.doMove = this.doMove.bind(this);

    this.events = {
      mouse: {
        mousemove: this.handleMouseMove,
        mouseup: this.handleMouseUp
      },
      touch: {
        touchmove: this.handleTouchMove,
        touchend: this.handleTouchEnd,
        touchcancel: this.handleTouchEnd
      }
    };
  }

  captureNode(node) {
    this.node = node;
  }

  registerEvents(type) {
    Object.keys(this.events[type]).forEach(event => {
      document.addEventListener(event, this.events[type][event], true);
    });
  }

  unregisterEvents(type) {
    Object.keys(this.events[type]).forEach(event => {
      document.removeEventListener(event, this.events[type][event], true);
    });
  }

  handleMouseDown(evt) {
    this.measurements = getMeasurements(this.node, evt);
    this.registerEvents('mouse');
  }

  handleTouchStart(evt) {
    this.measurements = getMeasurements(this.node, evt.touches[0]);
    this.registerEvents('touch');
  }

  handleMouseUp() {
    this.unregisterEvents('mouse');
  }

  handleTouchEnd() {
    this.unregisterEvents('touch');
  }

  handleMouseMove(evt) {
    evt.preventDefault(); // prevent selection and scrolling inside node
    this.doMove(evt);
  }

  handleTouchMove(evt) {
    evt.preventDefault(); // prevent page scroll
    this.doMove(evt.touches[0]);
  }

  doMove(evt) {
    if (this._dragRunning) {
      return;
    }
    this._dragRunning = true;
    requestAnimationFrame(() => {
      if (!this.node) {
        // might be unmounted meanwhile
        this._dragRunning = false;
        return;
      }

      const {
        startX, startY, transformX, transformY
      } = this.measurements;
      const [distanceX, distanceY] = [evt.clientX - startX, evt.clientY - startY];

      const nextTransformX = transformX + distanceX;
      const nextTransformY = transformY + distanceY;

      this.transformX = nextTransformX;
      this.transformY = nextTransformY;
      this.forceUpdate();
      this._dragRunning = false;
    });
  }

  componentWillUnmount() {
    this.unregisterEvents('mouse');
    this.unregisterEvents('touch');
  }

  render() {
    const { style } = this.props;
    const draggableClassNames = (0, _classnames2.default)({
      'dbui-draggable': true
    });

    return _react2.default.createElement(
      'div',
      {
        ref: this.captureNode,
        'data-component-id': 'Draggable',
        className: draggableClassNames,
        onMouseDownCapture: this.handleMouseDown,
        onTouchStartCapture: this.handleTouchStart,
        style: Object.assign({
          cursor: 'pointer',
          touchAction: 'none',
          transform: `translate(${this.transformX}px,${this.transformY}px)`
        }, style)
      },
      _react2.default.createElement(
        _DisableSelection2.default,
        null,
        this.props.children
      )
    );
  }
}

Draggable.defaultProps = {};

Draggable.propTypes = {
  children: _propTypes2.default.element,
  style: _propTypes2.default.object
};

exports.default = Draggable;

},{"../../components/DisableSelection/DisableSelection":5,"classnames":"classnames","prop-types":"prop-types","react":"react"}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

class FormInput extends _react2.default.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      value: props.value.toString()
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      value: (nextProps.value || '').toString()
    });
  }

  handleChange(evt) {
    const { value } = evt.target;
    this.setState({
      value
    }, () => {
      this.props.onChange(value);
    });
  }

  handleFocus() {
    this.props.onFocus(this.state.value);
  }

  handleBlur() {
    this.props.onBlur(this.state.value);
  }

  render() {
    const _props = this.props,
          { hasWarning, hasError } = _props,
          rest = _objectWithoutProperties(_props, ['hasWarning', 'hasError']);
    const inputClassNames = (0, _classnames2.default)({
      'dbui-form-input': true,
      'dbui-warning': hasWarning,
      'dbui-error': hasError,
      'dbui-theme': true,
      'dbui-patch': true
    });
    return _react2.default.createElement('input', _extends({
      'data-component-id': 'FormInput',
      className: inputClassNames
    }, rest, {
      value: this.state.value,
      onChange: this.handleChange,
      onFocus: this.handleFocus,
      onBlur: this.handleBlur
    }));
  }
}

FormInput.defaultProps = {
  type: 'text',
  value: '',
  onChange: () => {},
  onFocus: () => {},
  onBlur: () => {}
};

FormInput.propTypes = {
  type: _propTypes2.default.string,
  value: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.number]),
  onChange: _propTypes2.default.func,
  onFocus: _propTypes2.default.func,
  onBlur: _propTypes2.default.func,
  hasWarning: _propTypes2.default.bool,
  hasError: _propTypes2.default.bool
};

exports.default = FormInput;

},{"classnames":"classnames","prop-types":"prop-types","react":"react"}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _FormInput = require('../FormInput/FormInput');

var _FormInput2 = _interopRequireDefault(_FormInput);

var _formatters = require('../../../web-components/utils/formatters');

var _formatters2 = _interopRequireDefault(_formatters);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

class FormInputNumber extends _react2.default.PureComponent {
  constructor(props) {
    super(props);
    const { value, defaultDecPoint, defaultThousandsSeparator } = props;
    this.state = {
      value: value.toString()
    };

    this.defaultDecPoint = defaultDecPoint;
    this.defaultThousandsSeparator = defaultThousandsSeparator;
    this.numberFormatter = _formatters2.default.numberFormatter({
      decPoint: defaultDecPoint,
      thousandsSeparator: defaultThousandsSeparator
    });
    this.forceFloat = _formatters2.default.forceFloat({
      decPoint: defaultDecPoint
    });

    this.handleChange = this.handleChange.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const receivedValue = nextProps.value.toString();
    const internalValue = this.state.value;
    const internalValueNumber = internalValue.replace(this.defaultDecPoint, '.');
    let valueToStore = Number(internalValueNumber) === Number(receivedValue) ? internalValue : receivedValue;

    if (['-', '+'].includes(internalValue) && receivedValue === '0') {
      valueToStore = internalValue;
    }

    this.setState({
      value: valueToStore
    });
  }

  handleChange(value) {
    const valueToUse = this.forceFloat(value);

    this.setState({
      value: valueToUse
    }, () => {
      this.forceUpdate(); // reason: 123.4 => 1234 / 12.3.4 => 1234(no re-render)

      const usedValue = this.state.value;
      let valueToReport = usedValue.replace(this.defaultDecPoint, '.');

      if (['-', '+'].includes(valueToReport)) {
        valueToReport = '0';
      }

      const valueAsNumber = Number(valueToReport);

      this.props.onChange(valueAsNumber);
    });
  }

  get value() {
    return this.numberFormatter(this.state.value);
  }

  render() {
    const _props = this.props,
          { defaultDecPoint, defaultThousandsSeparator } = _props,
          rest = _objectWithoutProperties(_props, ['defaultDecPoint', 'defaultThousandsSeparator']);
    return _react2.default.createElement(_FormInput2.default, _extends({}, rest, {
      'data-component-id': 'FormInputNumber',
      type: 'text',
      value: this.value,
      onChange: this.handleChange
    }));
  }
}

FormInputNumber.defaultProps = {
  value: 0,
  onChange: () => {},
  defaultDecPoint: '.',
  defaultThousandsSeparator: ''
};

FormInputNumber.propTypes = {
  value: _propTypes2.default.number,
  onChange: _propTypes2.default.func,
  defaultDecPoint: _propTypes2.default.string,
  defaultThousandsSeparator: _propTypes2.default.string
};

exports.default = FormInputNumber;

},{"../../../web-components/utils/formatters":15,"../FormInput/FormInput":7,"prop-types":"prop-types","react":"react"}],9:[function(require,module,exports){
(function (process){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _spinner = require('react-icons/lib/fa/spinner');

var _spinner2 = _interopRequireDefault(_spinner);

var _List = require('../List/List');

var _List2 = _interopRequireDefault(_List);

var _World = require('../World/World');

var _World2 = _interopRequireDefault(_World);

var _localeAware = require('../../behaviours/localeAware');

var _localeAware2 = _interopRequireDefault(_localeAware);

var _DBUII18nService = require('./../../../web-components/services/DBUII18nService');

var _DBUII18nService2 = _interopRequireDefault(_DBUII18nService);

var _template = require('../../../web-components/utils/template');

var _template2 = _interopRequireDefault(_template);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const i18nService = (0, _DBUII18nService2.default)(window);

i18nService.registerTranslations({
  en: {
    Hello: _template2.default`Hello ${'age'} ${'name'}`
  },
  sp: {
    Hello: _template2.default`Hola ${'age'} ${'name'}`
  }
});

const listItems = ['one', 'two'];

class Hello extends _react2.default.PureComponent {
  render() {
    const { translations } = this.props;
    if (process.env.NODE_ENV !== 'production') {
      /* eslint no-console: 0 */
      // console.log('rendering Hello component');
    }
    return _react2.default.createElement(
      'div',
      null,
      translations.Hello({ age: 22, name: this.props.name || 'Nobody' }),
      _react2.default.createElement(_spinner2.default, null),
      _react2.default.createElement(_List2.default, { items: listItems }),
      _react2.default.createElement(_List2.default, { items: listItems }),
      _react2.default.createElement(_World2.default, null),
      _react2.default.createElement(_World2.default, null)
    );
  }
}

Hello.propTypes = {
  translations: _propTypes2.default.object,
  name: _propTypes2.default.string.isRequired
};

exports.default = (0, _localeAware2.default)(Hello);

}).call(this,require('_process'))

},{"../../../web-components/utils/template":16,"../../behaviours/localeAware":4,"../List/List":10,"../World/World":11,"./../../../web-components/services/DBUII18nService":13,"_process":1,"prop-types":"prop-types","react":"react","react-icons/lib/fa/spinner":3}],10:[function(require,module,exports){
(function (process){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _localeAware = require('../../behaviours/localeAware');

var _localeAware2 = _interopRequireDefault(_localeAware);

var _DBUII18nService = require('./../../../web-components/services/DBUII18nService');

var _DBUII18nService2 = _interopRequireDefault(_DBUII18nService);

var _template = require('../../../web-components/utils/template');

var _template2 = _interopRequireDefault(_template);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const i18nService = (0, _DBUII18nService2.default)(window);

i18nService.registerTranslations({
  en: {
    list: _template2.default`list`
  },
  sp: {
    list: _template2.default`lista`
  }
});

class List extends _react2.default.PureComponent {
  render() {
    if (process.env.NODE_ENV !== 'production') {
      /* eslint no-console: 0 */
      // console.log('rendering List component');
    }
    return _react2.default.createElement(
      'div',
      null,
      this.props.translations.list(),
      _react2.default.createElement(
        'ul',
        null,
        this.props.items.map(item => _react2.default.createElement(
          'li',
          { key: item },
          item
        ))
      )
    );
  }
}

List.defaultProps = {
  items: []
};

List.propTypes = {
  items: _propTypes2.default.array,
  translations: _propTypes2.default.object
};

exports.default = (0, _localeAware2.default)(List);

}).call(this,require('_process'))

},{"../../../web-components/utils/template":16,"../../behaviours/localeAware":4,"./../../../web-components/services/DBUII18nService":13,"_process":1,"prop-types":"prop-types","react":"react"}],11:[function(require,module,exports){
(function (process){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _List = require('../List/List');

var _List2 = _interopRequireDefault(_List);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class World extends _react2.default.PureComponent {
  render() {
    if (process.env.NODE_ENV !== 'production') {
      /* eslint no-console: 0 */
      // console.log('rendering Hello component');
    }
    return _react2.default.createElement(
      'div',
      null,
      'World ------------',
      _react2.default.createElement(_List2.default, { items: ['five', 'six'] }),
      _react2.default.createElement(_List2.default, { items: ['five', 'six'] }),
      '------------------'
    );
  }
}
// import PropTypes from 'prop-types';


World.propTypes = {};

exports.default = World;

}).call(this,require('_process'))

},{"../List/List":10,"_process":1,"react":"react"}],12:[function(require,module,exports){
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

},{}],13:[function(require,module,exports){
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

},{"../internals/ensureSingleRegistration":12,"./DBUILocaleService":14}],14:[function(require,module,exports){
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
    return localeService;
  });
}

},{"../internals/ensureSingleRegistration":12}],15:[function(require,module,exports){
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

},{}],16:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = template;
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

},{}],"dev-box-ui-react-components":[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DisableSelection = exports.Draggable = exports.FormInputNumber = exports.FormInput = exports.List = exports.Hello = exports.localeAware = undefined;

var _localeAware = require('./behaviours/localeAware');

var _localeAware2 = _interopRequireDefault(_localeAware);

var _Hello = require('./components/Hello/Hello');

var _Hello2 = _interopRequireDefault(_Hello);

var _List = require('./components/List/List');

var _List2 = _interopRequireDefault(_List);

var _FormInput = require('./components/FormInput/FormInput');

var _FormInput2 = _interopRequireDefault(_FormInput);

var _FormInputNumber = require('./components/FormInputNumber/FormInputNumber');

var _FormInputNumber2 = _interopRequireDefault(_FormInputNumber);

var _Draggable = require('./components/Draggable/Draggable');

var _Draggable2 = _interopRequireDefault(_Draggable);

var _DisableSelection = require('./components/DisableSelection/DisableSelection');

var _DisableSelection2 = _interopRequireDefault(_DisableSelection);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Components
exports.localeAware = _localeAware2.default;
exports.Hello = _Hello2.default;
exports.List = _List2.default;
exports.FormInput = _FormInput2.default;
exports.FormInputNumber = _FormInputNumber2.default;
exports.Draggable = _Draggable2.default;
exports.DisableSelection = _DisableSelection2.default;
// Behaviours

},{"./behaviours/localeAware":4,"./components/DisableSelection/DisableSelection":5,"./components/Draggable/Draggable":6,"./components/FormInput/FormInput":7,"./components/FormInputNumber/FormInputNumber":8,"./components/Hello/Hello":9,"./components/List/List":10}]},{},[])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvcHJvY2Vzcy9icm93c2VyLmpzIiwibm9kZV9tb2R1bGVzL3JlYWN0LWljb24tYmFzZS9saWIvaW5kZXguanMiLCJub2RlX21vZHVsZXMvcmVhY3QtaWNvbnMvbGliL2ZhL3NwaW5uZXIuanMiLCJzcmMvbGliL3JlYWN0LWNvbXBvbmVudHMvYmVoYXZpb3Vycy9sb2NhbGVBd2FyZS5qcyIsInNyYy9saWIvcmVhY3QtY29tcG9uZW50cy9jb21wb25lbnRzL0Rpc2FibGVTZWxlY3Rpb24vRGlzYWJsZVNlbGVjdGlvbi5qcyIsInNyYy9saWIvcmVhY3QtY29tcG9uZW50cy9jb21wb25lbnRzL0RyYWdnYWJsZS9EcmFnZ2FibGUuanMiLCJzcmMvbGliL3JlYWN0LWNvbXBvbmVudHMvY29tcG9uZW50cy9Gb3JtSW5wdXQvRm9ybUlucHV0LmpzIiwic3JjL2xpYi9yZWFjdC1jb21wb25lbnRzL2NvbXBvbmVudHMvRm9ybUlucHV0TnVtYmVyL0Zvcm1JbnB1dE51bWJlci5qcyIsInNyYy9saWIvcmVhY3QtY29tcG9uZW50cy9jb21wb25lbnRzL0hlbGxvL0hlbGxvLmpzIiwic3JjL2xpYi9yZWFjdC1jb21wb25lbnRzL2NvbXBvbmVudHMvTGlzdC9MaXN0LmpzIiwic3JjL2xpYi9yZWFjdC1jb21wb25lbnRzL2NvbXBvbmVudHMvV29ybGQvV29ybGQuanMiLCJzcmMvbGliL3dlYi1jb21wb25lbnRzL2ludGVybmFscy9lbnN1cmVTaW5nbGVSZWdpc3RyYXRpb24uanMiLCJzcmMvbGliL3dlYi1jb21wb25lbnRzL3NlcnZpY2VzL0RCVUlJMThuU2VydmljZS5qcyIsInNyYy9saWIvd2ViLWNvbXBvbmVudHMvc2VydmljZXMvREJVSUxvY2FsZVNlcnZpY2UuanMiLCJzcmMvbGliL3dlYi1jb21wb25lbnRzL3V0aWxzL2Zvcm1hdHRlcnMuanMiLCJzcmMvbGliL3dlYi1jb21wb25lbnRzL3V0aWxzL3RlbXBsYXRlLmpzIiwic3JjL2xpYi9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeExBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7a0JDdkJ3QixXOztBQVJ4Qjs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7O0FBRUEsTUFBTSxnQkFBZ0IsaUNBQXFCLE1BQXJCLENBQXRCO0FBQ0EsTUFBTSxjQUFjLCtCQUFtQixNQUFuQixDQUFwQjs7QUFFZSxTQUFTLFdBQVQsQ0FBcUIsU0FBckIsRUFBZ0M7QUFDN0MsUUFBTSxXQUFOLFNBQTBCLGdCQUFNLFNBQWhDLENBQTBDO0FBQ3hDLGdCQUFZLEtBQVosRUFBbUIsT0FBbkIsRUFBNEI7QUFDMUIsWUFBTSxLQUFOLEVBQWEsT0FBYjtBQUNBLFdBQUssa0JBQUwsR0FBMEIsS0FBSyxrQkFBTCxDQUF3QixJQUF4QixDQUE2QixJQUE3QixDQUExQjtBQUNBLFdBQUssc0JBQUwsR0FBOEIsSUFBOUI7QUFDQSxXQUFLLEtBQUwsR0FBYTtBQUNYLGdCQUFRLGNBQWM7QUFEWCxPQUFiO0FBR0EsV0FBSyxRQUFMLEdBQWdCLEtBQWhCO0FBQ0EsV0FBSyxVQUFMLEdBQWtCLElBQWxCO0FBQ0Q7O0FBRUQsdUJBQW1CLE1BQW5CLEVBQTJCO0FBQ3pCLFdBQUssUUFBTCxJQUFpQixLQUFLLEtBQUwsQ0FBVyxNQUFYLEtBQXNCLE1BQXZDLElBQWlELEtBQUssUUFBTCxDQUFjO0FBQzdEO0FBRDZELE9BQWQsQ0FBakQ7QUFHRDs7QUFFRCx3QkFBb0I7QUFDbEIsV0FBSyxzQkFBTCxHQUE4QixjQUFjLGNBQWQsQ0FBNkIsS0FBSyxrQkFBbEMsQ0FBOUI7QUFDQSxXQUFLLFFBQUwsR0FBZ0IsSUFBaEI7QUFDRDs7QUFFRCwyQkFBdUI7QUFDckIsV0FBSyxRQUFMLEdBQWdCLEtBQWhCO0FBQ0EsV0FBSyxzQkFBTDtBQUNEOztBQUVELGFBQVM7QUFDUCxZQUFNLEVBQUUsTUFBRixLQUFhLEtBQUssS0FBeEI7QUFDQSxhQUNFLDhCQUFDLFNBQUQsZUFBZ0IsS0FBSyxLQUFyQjtBQUNFLGdCQUFTLE1BRFg7QUFFRSxzQkFBZSxZQUFZLHVCQUY3QjtBQUdFLGFBQU0sUUFBUSxLQUFLLFVBQUwsR0FBa0I7QUFIbEMsU0FERjtBQU9EO0FBckN1Qzs7QUF3QzFDLGNBQVksV0FBWixHQUEyQixlQUN6QixVQUFVLFdBQVYsSUFDQSxVQUFVLElBRFYsSUFFQSxXQUNELEdBSkQ7O0FBTUEsU0FBTyxvQ0FBcUIsV0FBckIsRUFBa0MsU0FBbEMsQ0FBUDtBQUNEOzs7Ozs7Ozs7QUN4REQ7Ozs7QUFDQTs7Ozs7O0FBRUEsU0FBUyxxQkFBVCxHQUFpQztBQUMvQixTQUFPLFlBQVAsSUFBdUIsT0FBTyxZQUFQLEdBQXNCLGVBQXRCLEVBQXZCO0FBQ0Q7O0FBRWMsTUFBTSxnQkFBTixTQUErQixnQkFBTSxhQUFyQyxDQUFtRDs7QUFFaEUsY0FBWSxLQUFaLEVBQW1CO0FBQ2pCLFVBQU0sS0FBTjs7QUFFQSxTQUFLLGdCQUFMLEdBQXdCLEtBQUssZ0JBQUwsQ0FBc0IsSUFBdEIsQ0FBMkIsSUFBM0IsQ0FBeEI7QUFDQSxTQUFLLGFBQUwsR0FBcUIsS0FBSyxhQUFMLENBQW1CLElBQW5CLENBQXdCLElBQXhCLENBQXJCO0FBQ0EsU0FBSyxlQUFMLEdBQXVCLEtBQUssZUFBTCxDQUFxQixJQUFyQixDQUEwQixJQUExQixDQUF2QjtBQUNEOztBQUVELE1BQUksY0FBSixHQUFxQjtBQUNuQjtBQUNBLFdBQU8sU0FBUyxhQUFULEtBQTJCLFNBQTNCLEdBQXVDLGFBQXZDLEdBQXVELFdBQTlEO0FBQ0Q7O0FBRUQsZ0JBQWMsQ0FBZCxFQUFpQjtBQUNmLFlBQVEsRUFBRSxJQUFWO0FBQ0UsV0FBSyxhQUFMO0FBQ0UsVUFBRSxjQUFGO0FBQ0E7QUFDRixXQUFLLFdBQUw7QUFDRTtBQUNBO0FBQ0Y7QUFDRTtBQVJKO0FBVUQ7O0FBRUQscUJBQW1CO0FBQ2pCO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQSxhQUFTLElBQVQsQ0FBYyxLQUFkLENBQW9CLGFBQXBCLEdBQW9DLE1BQXBDO0FBQ0EsYUFBUyxJQUFULENBQWMsS0FBZCxDQUFvQixnQkFBcEIsR0FBdUMsTUFBdkM7QUFDQSxhQUFTLElBQVQsQ0FBYyxLQUFkLENBQW9CLFVBQXBCLEdBQWlDLE1BQWpDOztBQUVBO0FBQ0EsVUFBTSxNQUFNLEtBQUssY0FBakI7QUFDQSxhQUFTLGdCQUFULENBQTBCLEdBQTFCLEVBQStCLEtBQUssYUFBcEMsRUFBbUQsS0FBbkQ7QUFDQSxhQUFTLGdCQUFULENBQTBCLFNBQTFCLEVBQXFDLEtBQUssZUFBMUMsRUFBMkQsS0FBM0Q7QUFDQSxhQUFTLGdCQUFULENBQTBCLFVBQTFCLEVBQXNDLEtBQUssZUFBM0MsRUFBNEQsS0FBNUQ7QUFDRDs7QUFFRCxvQkFBa0I7QUFDaEI7QUFDQSxhQUFTLElBQVQsQ0FBYyxLQUFkLENBQW9CLGFBQXBCLEdBQW9DLElBQXBDO0FBQ0EsYUFBUyxJQUFULENBQWMsS0FBZCxDQUFvQixnQkFBcEIsR0FBdUMsSUFBdkM7QUFDQSxhQUFTLElBQVQsQ0FBYyxLQUFkLENBQW9CLFVBQXBCLEdBQWlDLElBQWpDOztBQUVBO0FBQ0EsVUFBTSxNQUFNLEtBQUssY0FBakI7QUFDQSxhQUFTLG1CQUFULENBQTZCLEdBQTdCLEVBQWtDLEtBQUssYUFBdkMsRUFBc0QsS0FBdEQ7QUFDQSxhQUFTLG1CQUFULENBQTZCLFNBQTdCLEVBQXdDLEtBQUssZUFBN0MsRUFBOEQsS0FBOUQ7QUFDQSxhQUFTLG1CQUFULENBQTZCLFVBQTdCLEVBQXlDLEtBQUssZUFBOUMsRUFBK0QsS0FBL0Q7QUFDRDs7QUFFRCxXQUFTO0FBQ1AsV0FDRTtBQUFBO0FBQUE7QUFDRSxxQkFBYSxLQUFLLGdCQURwQjtBQUVFLHNCQUFjLEtBQUs7QUFGckI7QUFHRSxXQUFLLEtBQUwsQ0FBVztBQUhiLEtBREY7QUFNRDs7QUFsRStEOztrQkFBN0MsZ0I7QUFzRXJCLGlCQUFpQixTQUFqQixHQUE2QjtBQUMzQixZQUFVLG9CQUFVO0FBRE8sQ0FBN0I7Ozs7Ozs7OztBQzdFQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7O0FBRUEsU0FBUyxlQUFULENBQXlCLElBQXpCLEVBQStCLEdBQS9CLEVBQW9DO0FBQ2xDLFFBQU0sb0JBQW9CLGlCQUFpQixJQUFqQixFQUF1QixJQUF2QixDQUExQjtBQUNBLFFBQU0sRUFBRSxTQUFTLE1BQVgsRUFBbUIsU0FBUyxNQUE1QixLQUF1QyxHQUE3QztBQUNBLFFBQU0sU0FBUyxrQkFBa0IsU0FBbEIsQ0FBNEIsS0FBNUIsQ0FBa0MsY0FBbEMsRUFBa0QsR0FBbEQsQ0FBc0QsTUFBdEQsQ0FBZjtBQUNBLFFBQU0sQ0FBQyxVQUFELEVBQWEsVUFBYixJQUEyQixDQUFDLE9BQU8sQ0FBUCxDQUFELEVBQVksT0FBTyxDQUFQLENBQVosQ0FBakM7QUFDQSxRQUFNLE1BQU07QUFDVixVQURVLEVBQ0YsTUFERSxFQUNNLFVBRE4sRUFDa0I7QUFEbEIsR0FBWjtBQUdBLFNBQU8sR0FBUDtBQUNEOztBQUVELE1BQU0sU0FBTixTQUF3QixnQkFBTSxhQUE5QixDQUE0QztBQUMxQyxjQUFZLEtBQVosRUFBbUI7QUFDakIsVUFBTSxLQUFOOztBQUVBLFNBQUssSUFBTCxHQUFZLElBQVo7QUFDQSxTQUFLLFlBQUwsR0FBb0IsSUFBcEI7QUFDQSxTQUFLLFVBQUwsR0FBa0IsQ0FBbEI7QUFDQSxTQUFLLFVBQUwsR0FBa0IsQ0FBbEI7O0FBRUEsU0FBSyxXQUFMLEdBQW1CLEtBQUssV0FBTCxDQUFpQixJQUFqQixDQUFzQixJQUF0QixDQUFuQjtBQUNBLFNBQUssZUFBTCxHQUF1QixLQUFLLGVBQUwsQ0FBcUIsSUFBckIsQ0FBMEIsSUFBMUIsQ0FBdkI7QUFDQSxTQUFLLGdCQUFMLEdBQXdCLEtBQUssZ0JBQUwsQ0FBc0IsSUFBdEIsQ0FBMkIsSUFBM0IsQ0FBeEI7QUFDQSxTQUFLLGFBQUwsR0FBcUIsS0FBSyxhQUFMLENBQW1CLElBQW5CLENBQXdCLElBQXhCLENBQXJCO0FBQ0EsU0FBSyxjQUFMLEdBQXNCLEtBQUssY0FBTCxDQUFvQixJQUFwQixDQUF5QixJQUF6QixDQUF0QjtBQUNBLFNBQUssZUFBTCxHQUF1QixLQUFLLGVBQUwsQ0FBcUIsSUFBckIsQ0FBMEIsSUFBMUIsQ0FBdkI7QUFDQSxTQUFLLGVBQUwsR0FBdUIsS0FBSyxlQUFMLENBQXFCLElBQXJCLENBQTBCLElBQTFCLENBQXZCO0FBQ0EsU0FBSyxNQUFMLEdBQWMsS0FBSyxNQUFMLENBQVksSUFBWixDQUFpQixJQUFqQixDQUFkOztBQUVBLFNBQUssTUFBTCxHQUFjO0FBQ1osYUFBTztBQUNMLG1CQUFXLEtBQUssZUFEWDtBQUVMLGlCQUFTLEtBQUs7QUFGVCxPQURLO0FBS1osYUFBTztBQUNMLG1CQUFXLEtBQUssZUFEWDtBQUVMLGtCQUFVLEtBQUssY0FGVjtBQUdMLHFCQUFhLEtBQUs7QUFIYjtBQUxLLEtBQWQ7QUFXRDs7QUFFRCxjQUFZLElBQVosRUFBa0I7QUFDaEIsU0FBSyxJQUFMLEdBQVksSUFBWjtBQUNEOztBQUVELGlCQUFlLElBQWYsRUFBcUI7QUFDbkIsV0FBTyxJQUFQLENBQVksS0FBSyxNQUFMLENBQVksSUFBWixDQUFaLEVBQStCLE9BQS9CLENBQXdDLEtBQUQsSUFBVztBQUNoRCxlQUFTLGdCQUFULENBQTBCLEtBQTFCLEVBQWlDLEtBQUssTUFBTCxDQUFZLElBQVosRUFBa0IsS0FBbEIsQ0FBakMsRUFBMkQsSUFBM0Q7QUFDRCxLQUZEO0FBR0Q7O0FBRUQsbUJBQWlCLElBQWpCLEVBQXVCO0FBQ3JCLFdBQU8sSUFBUCxDQUFZLEtBQUssTUFBTCxDQUFZLElBQVosQ0FBWixFQUErQixPQUEvQixDQUF3QyxLQUFELElBQVc7QUFDaEQsZUFBUyxtQkFBVCxDQUE2QixLQUE3QixFQUFvQyxLQUFLLE1BQUwsQ0FBWSxJQUFaLEVBQWtCLEtBQWxCLENBQXBDLEVBQThELElBQTlEO0FBQ0QsS0FGRDtBQUdEOztBQUVELGtCQUFnQixHQUFoQixFQUFxQjtBQUNuQixTQUFLLFlBQUwsR0FBb0IsZ0JBQWdCLEtBQUssSUFBckIsRUFBMkIsR0FBM0IsQ0FBcEI7QUFDQSxTQUFLLGNBQUwsQ0FBb0IsT0FBcEI7QUFDRDs7QUFFRCxtQkFBaUIsR0FBakIsRUFBc0I7QUFDcEIsU0FBSyxZQUFMLEdBQW9CLGdCQUFnQixLQUFLLElBQXJCLEVBQTJCLElBQUksT0FBSixDQUFZLENBQVosQ0FBM0IsQ0FBcEI7QUFDQSxTQUFLLGNBQUwsQ0FBb0IsT0FBcEI7QUFDRDs7QUFFRCxrQkFBZ0I7QUFDZCxTQUFLLGdCQUFMLENBQXNCLE9BQXRCO0FBQ0Q7O0FBRUQsbUJBQWlCO0FBQ2YsU0FBSyxnQkFBTCxDQUFzQixPQUF0QjtBQUNEOztBQUVELGtCQUFnQixHQUFoQixFQUFxQjtBQUNuQixRQUFJLGNBQUosR0FEbUIsQ0FDRztBQUN0QixTQUFLLE1BQUwsQ0FBWSxHQUFaO0FBQ0Q7O0FBRUQsa0JBQWdCLEdBQWhCLEVBQXFCO0FBQ25CLFFBQUksY0FBSixHQURtQixDQUNHO0FBQ3RCLFNBQUssTUFBTCxDQUFZLElBQUksT0FBSixDQUFZLENBQVosQ0FBWjtBQUNEOztBQUVELFNBQU8sR0FBUCxFQUFZO0FBQ1YsUUFBSSxLQUFLLFlBQVQsRUFBdUI7QUFBRTtBQUFTO0FBQ2xDLFNBQUssWUFBTCxHQUFvQixJQUFwQjtBQUNBLDBCQUFzQixNQUFNO0FBQzFCLFVBQUksQ0FBQyxLQUFLLElBQVYsRUFBZ0I7QUFBRTtBQUNoQixhQUFLLFlBQUwsR0FBb0IsS0FBcEI7QUFDQTtBQUNEOztBQUVELFlBQU07QUFDSixjQURJLEVBQ0ksTUFESixFQUNZLFVBRFosRUFDd0I7QUFEeEIsVUFFRixLQUFLLFlBRlQ7QUFHQSxZQUFNLENBQUMsU0FBRCxFQUFZLFNBQVosSUFBeUIsQ0FBQyxJQUFJLE9BQUosR0FBYyxNQUFmLEVBQXVCLElBQUksT0FBSixHQUFjLE1BQXJDLENBQS9COztBQUVBLFlBQU0saUJBQWlCLGFBQWEsU0FBcEM7QUFDQSxZQUFNLGlCQUFpQixhQUFhLFNBQXBDOztBQUVBLFdBQUssVUFBTCxHQUFrQixjQUFsQjtBQUNBLFdBQUssVUFBTCxHQUFrQixjQUFsQjtBQUNBLFdBQUssV0FBTDtBQUNBLFdBQUssWUFBTCxHQUFvQixLQUFwQjtBQUNELEtBbEJEO0FBbUJEOztBQUVELHlCQUF1QjtBQUNyQixTQUFLLGdCQUFMLENBQXNCLE9BQXRCO0FBQ0EsU0FBSyxnQkFBTCxDQUFzQixPQUF0QjtBQUNEOztBQUVELFdBQVM7QUFDUCxVQUFNLEVBQUUsS0FBRixLQUFZLEtBQUssS0FBdkI7QUFDQSxVQUFNLHNCQUFzQiwwQkFBRztBQUM3Qix3QkFBa0I7QUFEVyxLQUFILENBQTVCOztBQUlBLFdBQ0U7QUFBQTtBQUFBO0FBQ0UsYUFBSyxLQUFLLFdBRFo7QUFFRSw2QkFBa0IsV0FGcEI7QUFHRSxtQkFBVyxtQkFIYjtBQUlFLDRCQUFvQixLQUFLLGVBSjNCO0FBS0UsNkJBQXFCLEtBQUssZ0JBTDVCO0FBTUU7QUFDRSxrQkFBUSxTQURWO0FBRUUsdUJBQWEsTUFGZjtBQUdFLHFCQUFZLGFBQVksS0FBSyxVQUFXLE1BQUssS0FBSyxVQUFXO0FBSC9ELFdBSUssS0FKTDtBQU5GO0FBWUM7QUFBQTtBQUFBO0FBQW1CLGFBQUssS0FBTCxDQUFXO0FBQTlCO0FBWkQsS0FERjtBQWVEO0FBN0h5Qzs7QUFnSTVDLFVBQVUsWUFBVixHQUF5QixFQUF6Qjs7QUFHQSxVQUFVLFNBQVYsR0FBc0I7QUFDcEIsWUFBVSxvQkFBVSxPQURBO0FBRXBCLFNBQU8sb0JBQVU7QUFGRyxDQUF0Qjs7a0JBS2UsUzs7Ozs7Ozs7Ozs7QUN4SmY7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7OztBQUVBLE1BQU0sU0FBTixTQUF3QixnQkFBTSxhQUE5QixDQUE0QztBQUMxQyxjQUFZLEtBQVosRUFBbUI7QUFDakIsVUFBTSxLQUFOO0FBQ0EsU0FBSyxLQUFMLEdBQWE7QUFDWCxhQUFPLE1BQU0sS0FBTixDQUFZLFFBQVo7QUFESSxLQUFiO0FBR0EsU0FBSyxZQUFMLEdBQW9CLEtBQUssWUFBTCxDQUFrQixJQUFsQixDQUF1QixJQUF2QixDQUFwQjtBQUNBLFNBQUssV0FBTCxHQUFtQixLQUFLLFdBQUwsQ0FBaUIsSUFBakIsQ0FBc0IsSUFBdEIsQ0FBbkI7QUFDQSxTQUFLLFVBQUwsR0FBa0IsS0FBSyxVQUFMLENBQWdCLElBQWhCLENBQXFCLElBQXJCLENBQWxCO0FBQ0Q7O0FBRUQsNEJBQTBCLFNBQTFCLEVBQXFDO0FBQ25DLFNBQUssUUFBTCxDQUFjO0FBQ1osYUFBTyxDQUFDLFVBQVUsS0FBVixJQUFtQixFQUFwQixFQUF3QixRQUF4QjtBQURLLEtBQWQ7QUFHRDs7QUFFRCxlQUFhLEdBQWIsRUFBa0I7QUFDaEIsVUFBTSxFQUFFLEtBQUYsS0FBWSxJQUFJLE1BQXRCO0FBQ0EsU0FBSyxRQUFMLENBQWM7QUFDWjtBQURZLEtBQWQsRUFFRyxNQUFNO0FBQ1AsV0FBSyxLQUFMLENBQVcsUUFBWCxDQUFvQixLQUFwQjtBQUNELEtBSkQ7QUFLRDs7QUFFRCxnQkFBYztBQUNaLFNBQUssS0FBTCxDQUFXLE9BQVgsQ0FBbUIsS0FBSyxLQUFMLENBQVcsS0FBOUI7QUFDRDs7QUFFRCxlQUFhO0FBQ1gsU0FBSyxLQUFMLENBQVcsTUFBWCxDQUFrQixLQUFLLEtBQUwsQ0FBVyxLQUE3QjtBQUNEOztBQUVELFdBQVM7QUFDUCxtQkFBMEMsS0FBSyxLQUEvQztBQUFBLFVBQU0sRUFBRSxVQUFGLEVBQWMsUUFBZCxFQUFOO0FBQUEsVUFBaUMsSUFBakM7QUFDQSxVQUFNLGtCQUFrQiwwQkFBRztBQUN6Qix5QkFBbUIsSUFETTtBQUV6QixzQkFBZ0IsVUFGUztBQUd6QixvQkFBYyxRQUhXO0FBSXpCLG9CQUFjLElBSlc7QUFLekIsb0JBQWM7QUFMVyxLQUFILENBQXhCO0FBT0EsV0FDRTtBQUNFLDJCQUFrQixXQURwQjtBQUVFLGlCQUFXO0FBRmIsT0FHTSxJQUhOO0FBSUUsYUFBTyxLQUFLLEtBQUwsQ0FBVyxLQUpwQjtBQUtFLGdCQUFVLEtBQUssWUFMakI7QUFNRSxlQUFTLEtBQUssV0FOaEI7QUFPRSxjQUFRLEtBQUs7QUFQZixPQURGO0FBV0Q7QUF0RHlDOztBQXlENUMsVUFBVSxZQUFWLEdBQXlCO0FBQ3ZCLFFBQU0sTUFEaUI7QUFFdkIsU0FBTyxFQUZnQjtBQUd2QixZQUFVLE1BQU0sQ0FBRSxDQUhLO0FBSXZCLFdBQVMsTUFBTSxDQUFFLENBSk07QUFLdkIsVUFBUSxNQUFNLENBQUU7QUFMTyxDQUF6Qjs7QUFRQSxVQUFVLFNBQVYsR0FBc0I7QUFDcEIsUUFBTSxvQkFBVSxNQURJO0FBRXBCLFNBQU8sb0JBQVUsU0FBVixDQUFvQixDQUN6QixvQkFBVSxNQURlLEVBRXpCLG9CQUFVLE1BRmUsQ0FBcEIsQ0FGYTtBQU1wQixZQUFVLG9CQUFVLElBTkE7QUFPcEIsV0FBUyxvQkFBVSxJQVBDO0FBUXBCLFVBQVEsb0JBQVUsSUFSRTtBQVNwQixjQUFZLG9CQUFVLElBVEY7QUFVcEIsWUFBVSxvQkFBVTtBQVZBLENBQXRCOztrQkFhZSxTOzs7Ozs7Ozs7OztBQ2xGZjs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7Ozs7QUFFQSxNQUFNLGVBQU4sU0FBOEIsZ0JBQU0sYUFBcEMsQ0FBa0Q7QUFDaEQsY0FBWSxLQUFaLEVBQW1CO0FBQ2pCLFVBQU0sS0FBTjtBQUNBLFVBQU0sRUFBRSxLQUFGLEVBQVMsZUFBVCxFQUEwQix5QkFBMUIsS0FBd0QsS0FBOUQ7QUFDQSxTQUFLLEtBQUwsR0FBYTtBQUNYLGFBQU8sTUFBTSxRQUFOO0FBREksS0FBYjs7QUFJQSxTQUFLLGVBQUwsR0FBdUIsZUFBdkI7QUFDQSxTQUFLLHlCQUFMLEdBQWlDLHlCQUFqQztBQUNBLFNBQUssZUFBTCxHQUF1QixxQkFBVyxlQUFYLENBQTJCO0FBQ2hELGdCQUFVLGVBRHNDO0FBRWhELDBCQUFvQjtBQUY0QixLQUEzQixDQUF2QjtBQUlBLFNBQUssVUFBTCxHQUFrQixxQkFBVyxVQUFYLENBQXNCO0FBQ3RDLGdCQUFVO0FBRDRCLEtBQXRCLENBQWxCOztBQUlBLFNBQUssWUFBTCxHQUFvQixLQUFLLFlBQUwsQ0FBa0IsSUFBbEIsQ0FBdUIsSUFBdkIsQ0FBcEI7QUFDRDs7QUFFRCw0QkFBMEIsU0FBMUIsRUFBcUM7QUFDbkMsVUFBTSxnQkFBZ0IsVUFBVSxLQUFWLENBQWdCLFFBQWhCLEVBQXRCO0FBQ0EsVUFBTSxnQkFBZ0IsS0FBSyxLQUFMLENBQVcsS0FBakM7QUFDQSxVQUFNLHNCQUFzQixjQUFjLE9BQWQsQ0FBc0IsS0FBSyxlQUEzQixFQUE0QyxHQUE1QyxDQUE1QjtBQUNBLFFBQUksZUFBZSxPQUFPLG1CQUFQLE1BQWdDLE9BQU8sYUFBUCxDQUFoQyxHQUF3RCxhQUF4RCxHQUF3RSxhQUEzRjs7QUFFQSxRQUFJLENBQUMsR0FBRCxFQUFNLEdBQU4sRUFBVyxRQUFYLENBQW9CLGFBQXBCLEtBQXNDLGtCQUFrQixHQUE1RCxFQUFpRTtBQUMvRCxxQkFBZSxhQUFmO0FBQ0Q7O0FBRUQsU0FBSyxRQUFMLENBQWM7QUFDWixhQUFPO0FBREssS0FBZDtBQUdEOztBQUVELGVBQWEsS0FBYixFQUFvQjtBQUNsQixVQUFNLGFBQWEsS0FBSyxVQUFMLENBQWdCLEtBQWhCLENBQW5COztBQUVBLFNBQUssUUFBTCxDQUFjO0FBQ1osYUFBTztBQURLLEtBQWQsRUFFRyxNQUFNO0FBQ1AsV0FBSyxXQUFMLEdBRE8sQ0FDYTs7QUFFcEIsWUFBTSxZQUFZLEtBQUssS0FBTCxDQUFXLEtBQTdCO0FBQ0EsVUFBSSxnQkFBZ0IsVUFBVSxPQUFWLENBQWtCLEtBQUssZUFBdkIsRUFBd0MsR0FBeEMsQ0FBcEI7O0FBRUEsVUFBSSxDQUFDLEdBQUQsRUFBTSxHQUFOLEVBQVcsUUFBWCxDQUFvQixhQUFwQixDQUFKLEVBQXdDO0FBQ3RDLHdCQUFnQixHQUFoQjtBQUNEOztBQUVELFlBQU0sZ0JBQWdCLE9BQU8sYUFBUCxDQUF0Qjs7QUFFQSxXQUFLLEtBQUwsQ0FBVyxRQUFYLENBQW9CLGFBQXBCO0FBQ0QsS0FmRDtBQWdCRDs7QUFFRCxNQUFJLEtBQUosR0FBWTtBQUNWLFdBQU8sS0FBSyxlQUFMLENBQXFCLEtBQUssS0FBTCxDQUFXLEtBQWhDLENBQVA7QUFDRDs7QUFFRCxXQUFTO0FBQ1AsbUJBQWdFLEtBQUssS0FBckU7QUFBQSxVQUFNLEVBQUUsZUFBRixFQUFtQix5QkFBbkIsRUFBTjtBQUFBLFVBQXVELElBQXZEO0FBQ0EsV0FDRSxnRUFDTSxJQUROO0FBRUUsMkJBQWtCLGlCQUZwQjtBQUdFLFlBQUssTUFIUDtBQUlFLGFBQU8sS0FBSyxLQUpkO0FBS0UsZ0JBQVUsS0FBSztBQUxqQixPQURGO0FBU0Q7QUF4RStDOztBQTJFbEQsZ0JBQWdCLFlBQWhCLEdBQStCO0FBQzdCLFNBQU8sQ0FEc0I7QUFFN0IsWUFBVSxNQUFNLENBQUUsQ0FGVztBQUc3QixtQkFBaUIsR0FIWTtBQUk3Qiw2QkFBMkI7QUFKRSxDQUEvQjs7QUFPQSxnQkFBZ0IsU0FBaEIsR0FBNEI7QUFDMUIsU0FBTyxvQkFBVSxNQURTO0FBRTFCLFlBQVUsb0JBQVUsSUFGTTtBQUcxQixtQkFBaUIsb0JBQVUsTUFIRDtBQUkxQiw2QkFBMkIsb0JBQVU7QUFKWCxDQUE1Qjs7a0JBT2UsZTs7Ozs7Ozs7OztBQzlGZjs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7QUFFQSxNQUFNLGNBQWMsK0JBQW1CLE1BQW5CLENBQXBCOztBQUVBLFlBQVksb0JBQVosQ0FBaUM7QUFDL0IsTUFBSTtBQUNGLFdBQU8sa0JBQVMsU0FBUSxLQUFNLElBQUcsTUFBTztBQUR0QyxHQUQyQjtBQUkvQixNQUFJO0FBQ0YsV0FBTyxrQkFBUyxRQUFPLEtBQU0sSUFBRyxNQUFPO0FBRHJDO0FBSjJCLENBQWpDOztBQVNBLE1BQU0sWUFBWSxDQUFDLEtBQUQsRUFBUSxLQUFSLENBQWxCOztBQUdBLE1BQU0sS0FBTixTQUFvQixnQkFBTSxhQUExQixDQUF3QztBQUN0QyxXQUFTO0FBQ1AsVUFBTSxFQUFFLFlBQUYsS0FBbUIsS0FBSyxLQUE5QjtBQUNBLFFBQUksUUFBUSxHQUFSLENBQVksUUFBWixLQUF5QixZQUE3QixFQUEyQztBQUN6QztBQUNBO0FBQ0Q7QUFDRCxXQUNFO0FBQUE7QUFBQTtBQUNHLG1CQUFhLEtBQWIsQ0FBbUIsRUFBRSxLQUFLLEVBQVAsRUFBVyxNQUFNLEtBQUssS0FBTCxDQUFXLElBQVgsSUFBbUIsUUFBcEMsRUFBbkIsQ0FESDtBQUVFLDREQUZGO0FBR0Usc0RBQU0sT0FBUSxTQUFkLEdBSEY7QUFJRSxzREFBTSxPQUFRLFNBQWQsR0FKRjtBQUtFLDBEQUxGO0FBTUU7QUFORixLQURGO0FBVUQ7QUFqQnFDOztBQW9CeEMsTUFBTSxTQUFOLEdBQWtCO0FBQ2hCLGdCQUFjLG9CQUFVLE1BRFI7QUFFaEIsUUFBTSxvQkFBVSxNQUFWLENBQWlCO0FBRlAsQ0FBbEI7O2tCQUtlLDJCQUFZLEtBQVosQzs7Ozs7Ozs7Ozs7O0FDaERmOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7OztBQUVBLE1BQU0sY0FBYywrQkFBbUIsTUFBbkIsQ0FBcEI7O0FBRUEsWUFBWSxvQkFBWixDQUFpQztBQUMvQixNQUFJO0FBQ0YsVUFBTSxrQkFBUztBQURiLEdBRDJCO0FBSS9CLE1BQUk7QUFDRixVQUFNLGtCQUFTO0FBRGI7QUFKMkIsQ0FBakM7O0FBU0EsTUFBTSxJQUFOLFNBQW1CLGdCQUFNLGFBQXpCLENBQXVDO0FBQ3JDLFdBQVM7QUFDUCxRQUFJLFFBQVEsR0FBUixDQUFZLFFBQVosS0FBeUIsWUFBN0IsRUFBMkM7QUFDekM7QUFDQTtBQUNEO0FBQ0QsV0FDRTtBQUFBO0FBQUE7QUFDRyxXQUFLLEtBQUwsQ0FBVyxZQUFYLENBQXdCLElBQXhCLEVBREg7QUFFRTtBQUFBO0FBQUE7QUFDRyxhQUFLLEtBQUwsQ0FBVyxLQUFYLENBQWlCLEdBQWpCLENBQXFCLFFBQVE7QUFBQTtBQUFBLFlBQUksS0FBSyxJQUFUO0FBQWdCO0FBQWhCLFNBQTdCO0FBREg7QUFGRixLQURGO0FBUUQ7QUFkb0M7O0FBaUJ2QyxLQUFLLFlBQUwsR0FBb0I7QUFDbEIsU0FBTztBQURXLENBQXBCOztBQUlBLEtBQUssU0FBTCxHQUFpQjtBQUNmLFNBQU8sb0JBQVUsS0FERjtBQUVmLGdCQUFjLG9CQUFVO0FBRlQsQ0FBakI7O2tCQUtlLDJCQUFZLElBQVosQzs7Ozs7Ozs7Ozs7O0FDM0NmOzs7O0FBRUE7Ozs7OztBQUVBLE1BQU0sS0FBTixTQUFvQixnQkFBTSxhQUExQixDQUF3QztBQUN0QyxXQUFTO0FBQ1AsUUFBSSxRQUFRLEdBQVIsQ0FBWSxRQUFaLEtBQXlCLFlBQTdCLEVBQTJDO0FBQ3pDO0FBQ0E7QUFDRDtBQUNELFdBQ0U7QUFBQTtBQUFBO0FBQUE7QUFFRSxzREFBTSxPQUFPLENBQUMsTUFBRCxFQUFTLEtBQVQsQ0FBYixHQUZGO0FBR0Usc0RBQU0sT0FBTyxDQUFDLE1BQUQsRUFBUyxLQUFULENBQWIsR0FIRjtBQUFBO0FBQUEsS0FERjtBQVFEO0FBZHFDO0FBSHhDOzs7QUFvQkEsTUFBTSxTQUFOLEdBQWtCLEVBQWxCOztrQkFHZSxLOzs7Ozs7Ozs7O2tCQ3RCUyx3QjtBQUFULFNBQVMsd0JBQVQsQ0FBa0MsR0FBbEMsRUFBdUMsSUFBdkMsRUFBNkMsUUFBN0MsRUFBdUQ7QUFDcEUsTUFBSSxDQUFDLElBQUksaUJBQVQsRUFBNEI7QUFDMUIsUUFBSSxpQkFBSixHQUF3QixFQUFFLGVBQWUsRUFBakIsRUFBeEI7QUFDRCxHQUZELE1BRU8sSUFBSSxDQUFDLElBQUksaUJBQUosQ0FBc0IsYUFBM0IsRUFBMEM7QUFDL0MsUUFBSSxpQkFBSixDQUFzQixhQUF0QixHQUFzQyxFQUF0QztBQUNEOztBQUVELE1BQUksZUFBZSxJQUFJLGlCQUFKLENBQXNCLGFBQXRCLENBQW9DLElBQXBDLENBQW5COztBQUVBLE1BQUksWUFBSixFQUFrQixPQUFPLFlBQVA7O0FBRWxCLGlCQUFlLFVBQWY7QUFDQSxNQUFJLGlCQUFKLENBQXNCLGFBQXRCLENBQW9DLElBQXBDLElBQTRDLFlBQTVDOztBQUVBLFNBQU8sSUFBSSxpQkFBSixDQUFzQixhQUF0QixDQUFvQyxJQUFwQyxDQUFQO0FBQ0Q7Ozs7Ozs7O2tCQ1Z1QixrQjs7QUFQeEI7Ozs7QUFDQTs7Ozs7O0FBRUEsTUFBTSxXQUFXLEVBQWpCOztBQUVBLE1BQU0sbUJBQW1CLGlCQUF6Qjs7QUFFZSxTQUFTLGtCQUFULENBQTRCLEdBQTVCLEVBQWlDO0FBQzlDLFFBQU0sZ0JBQWdCLGlDQUFxQixHQUFyQixDQUF0QjtBQUNBLFNBQU8sd0NBQXlCLEdBQXpCLEVBQThCLGdCQUE5QixFQUFnRCxNQUFNO0FBQzNELFVBQU0sV0FBTixDQUFrQjtBQUNoQixvQkFBYztBQUNaLHNCQUFjLGNBQWQsQ0FBNkIsS0FBSyxtQkFBTCxDQUF5QixJQUF6QixDQUE4QixJQUE5QixDQUE3QjtBQUNBLGFBQUssT0FBTCxHQUFlLGNBQWMsTUFBN0I7QUFDQSxhQUFLLGFBQUwsR0FBcUIsRUFBckI7QUFDRDs7QUFFRCwwQkFBb0IsTUFBcEIsRUFBNEI7QUFDMUIsYUFBSyxPQUFMLEdBQWUsTUFBZjtBQUNEOztBQUVELHdCQUFrQixJQUFsQixFQUF3QjtBQUN0QixlQUFPLEtBQUssYUFBTCxDQUFtQixJQUFuQixDQUFQO0FBQ0Q7O0FBRUQsMkJBQXFCLFlBQXJCLEVBQW1DO0FBQ2pDLGFBQUssYUFBTCxHQUFxQixPQUFPLElBQVAsQ0FBWSxZQUFaLEVBQTBCLE1BQTFCLENBQWlDLENBQUMsR0FBRCxFQUFNLElBQU4sS0FBZTtBQUNuRSxjQUFJLElBQUosc0JBQ0ssS0FBSyxhQUFMLENBQW1CLElBQW5CLENBREwsRUFFSyxhQUFhLElBQWIsQ0FGTDtBQUlBLGlCQUFPLEdBQVA7QUFDRCxTQU5vQixFQU1sQixLQUFLLGFBTmEsQ0FBckI7QUFPRDs7QUFFRCxnQkFBVSxHQUFWLEVBQWU7QUFDYixlQUFPLEtBQUssdUJBQUwsQ0FBNkIsR0FBN0IsQ0FBUDtBQUNEOztBQUVELFVBQUksWUFBSixHQUFtQjtBQUNqQixlQUFPLEtBQUssYUFBWjtBQUNEOztBQUVELFVBQUksdUJBQUosR0FBOEI7QUFDNUIsZUFBTyxLQUFLLGFBQUwsQ0FBbUIsS0FBSyxPQUFMLENBQWEsSUFBaEMsS0FBeUMsUUFBaEQ7QUFDRDtBQW5DZTs7QUFzQ2xCLFVBQU0sY0FBYyxJQUFJLFdBQUosRUFBcEI7QUFDQSxXQUFPLFdBQVA7QUFDRCxHQXpDTSxDQUFQO0FBMENEOzs7Ozs7OztrQkN6Q3VCLG9COztBQVR4Qjs7Ozs7O0FBRUEsTUFBTSxnQkFBZ0I7QUFDcEIsT0FBSyxLQURlO0FBRXBCLFFBQU07QUFGYyxDQUF0Qjs7QUFLQSxNQUFNLG1CQUFtQixtQkFBekI7O0FBRWUsU0FBUyxvQkFBVCxDQUE4QixHQUE5QixFQUFtQztBQUNoRCxTQUFPLHdDQUF5QixHQUF6QixFQUE4QixnQkFBOUIsRUFBZ0QsTUFBTTtBQUMzRCxVQUFNLGFBQU4sQ0FBb0I7QUFDbEIsb0JBQWM7QUFDWixhQUFLLFVBQUwsR0FBa0IsRUFBbEI7QUFDQSxhQUFLLFlBQUwsR0FBb0IsT0FBTyxJQUFQLENBQVksYUFBWixDQUFwQjtBQUNBLGFBQUssWUFBTCxHQUFvQixPQUFPLFFBQVAsQ0FBZ0IsZUFBcEM7QUFDQSxhQUFLLFlBQUwsQ0FBa0IsT0FBbEIsQ0FBMkIsSUFBRCxJQUFVO0FBQ2xDLGNBQUksQ0FBQyxLQUFLLFlBQUwsQ0FBa0IsWUFBbEIsQ0FBK0IsSUFBL0IsQ0FBTCxFQUEyQztBQUN6QyxpQkFBSyxZQUFMLENBQWtCLFlBQWxCLENBQStCLElBQS9CLEVBQXFDLGNBQWMsSUFBZCxDQUFyQztBQUNEO0FBQ0YsU0FKRDtBQUtBLGFBQUssT0FBTCxHQUFlLEtBQUssWUFBTCxDQUFrQixNQUFsQixDQUF5QixDQUFDLEdBQUQsRUFBTSxJQUFOLEtBQWU7QUFDckQsY0FBSSxJQUFKLElBQVksS0FBSyxZQUFMLENBQWtCLFlBQWxCLENBQStCLElBQS9CLENBQVo7QUFDQSxpQkFBTyxHQUFQO0FBQ0QsU0FIYyxFQUdaLEVBSFksQ0FBZjtBQUlBLGFBQUssU0FBTCxHQUFpQixJQUFJLGdCQUFKLENBQXFCLEtBQUssZ0JBQUwsQ0FBc0IsSUFBdEIsQ0FBMkIsSUFBM0IsQ0FBckIsQ0FBakI7QUFDQSxhQUFLLFNBQUwsQ0FBZSxPQUFmLENBQXVCLEtBQUssWUFBNUIsRUFBMEM7QUFDeEMsc0JBQVk7QUFENEIsU0FBMUM7QUFHRDs7QUFFRCx1QkFBaUIsU0FBakIsRUFBNEI7QUFDMUIsa0JBQVUsT0FBVixDQUFtQixRQUFELElBQWM7QUFDOUIsZ0JBQU0sd0JBQXdCLFNBQVMsYUFBdkM7QUFDQSxjQUFJLEtBQUssWUFBTCxDQUFrQixRQUFsQixDQUEyQixxQkFBM0IsQ0FBSixFQUF1RDtBQUNyRCxpQkFBSyxPQUFMLHFCQUNLLEtBQUssT0FEVjtBQUVFLGVBQUMscUJBQUQsR0FBeUIsS0FBSyxZQUFMLENBQWtCLFlBQWxCLENBQStCLHFCQUEvQjtBQUYzQjtBQUlBLGlCQUFLLFVBQUwsQ0FBZ0IsT0FBaEIsQ0FBd0IsWUFBWSxTQUFTLEtBQUssT0FBZCxDQUFwQztBQUNEO0FBQ0YsU0FURDtBQVVEOztBQUVELFVBQUksTUFBSixDQUFXLFNBQVgsRUFBc0I7QUFDcEIsZUFBTyxJQUFQLENBQVksU0FBWixFQUF1QixPQUF2QixDQUFnQyxHQUFELElBQVM7QUFDdEMsZUFBSyxZQUFMLENBQWtCLFlBQWxCLENBQStCLEdBQS9CLEVBQW9DLFVBQVUsR0FBVixDQUFwQztBQUNELFNBRkQ7QUFHRDs7QUFFRCxVQUFJLE1BQUosR0FBYTtBQUNYLGVBQU8sS0FBSyxPQUFaO0FBQ0Q7O0FBRUQscUJBQWUsUUFBZixFQUF5QjtBQUN2QixhQUFLLFVBQUwsQ0FBZ0IsSUFBaEIsQ0FBcUIsUUFBckI7QUFDQSxpQkFBUyxLQUFLLE1BQWQ7QUFDQSxlQUFPLE1BQU07QUFDWCxlQUFLLFVBQUwsR0FBa0IsS0FBSyxVQUFMLENBQWdCLE1BQWhCLENBQXVCLE1BQU0sT0FBTyxRQUFwQyxDQUFsQjtBQUNELFNBRkQ7QUFHRDtBQWpEaUI7O0FBb0RwQixVQUFNLGdCQUFnQixJQUFJLGFBQUosRUFBdEI7QUFDQSxXQUFPLGFBQVA7QUFDRCxHQXZETSxDQUFQO0FBd0REOzs7Ozs7OztBQ25FRDs7QUFFQTs7Ozs7QUFLQSxNQUFNLGFBQWEsQ0FBQyxFQUFFLFdBQVcsR0FBYixLQUFxQixFQUF0QixLQUE4QixLQUFELElBQVc7QUFDekQsUUFBTSxtQkFBbUIsSUFBSSxNQUFKLENBQVksS0FBSSxRQUFTLEVBQXpCLEVBQTRCLEdBQTVCLENBQXpCO0FBQ0EsUUFBTSxpQ0FBaUMsSUFBSSxNQUFKLENBQVksUUFBTyxRQUFTLEdBQTVCLEVBQWdDLEdBQWhDLENBQXZDO0FBQ0EsUUFBTSwrQkFBK0IsSUFBSSxNQUFKLENBQVksT0FBTSxRQUFTLE9BQTNCLEVBQW1DLEVBQW5DLENBQXJDO0FBQ0EsUUFBTSxpQkFBaUIsSUFBSSxNQUFKLENBQVcsU0FBWCxFQUFzQixFQUF0QixDQUF2QjtBQUNBLFFBQU0sT0FBTyxJQUFJLE1BQUosQ0FBVyxNQUFYLEVBQW1CLEVBQW5CLENBQWI7QUFDQSxRQUFNLFdBQVcsSUFBSSxNQUFKLENBQVcsUUFBWCxFQUFxQixFQUFyQixDQUFqQjtBQUNBLFFBQU0scUJBQXFCLElBQUksTUFBSixDQUFXLE1BQVgsRUFBbUIsRUFBbkIsQ0FBM0I7O0FBRUEsTUFBSSxhQUFhLEtBQWpCO0FBQ0EsUUFBTSxlQUFlLFdBQVcsT0FBWCxDQUFtQixRQUFuQixDQUFyQjtBQUNBLFFBQU0sbUJBQW1CLFdBQVcsV0FBWCxDQUF1QixRQUF2QixDQUF6QjtBQUNBLFFBQU0sc0JBQXNCLGlCQUFpQixnQkFBN0M7O0FBRUEsTUFBSSxtQkFBSixFQUF5QjtBQUN2QixpQkFBYyxHQUFFLFdBQVcsT0FBWCxDQUFtQixnQkFBbkIsRUFBcUMsRUFBckMsQ0FBeUMsR0FBRSxRQUFTLEVBQXBFO0FBQ0Q7O0FBRUQsTUFBSSxZQUFZLFdBQVcsQ0FBWCxLQUFpQixFQUFqQztBQUNBLE1BQUksV0FBVyxDQUFDLFdBQVcsTUFBWCxHQUFvQixDQUFwQixHQUF3QixXQUFXLFdBQVcsTUFBWCxHQUFvQixDQUEvQixDQUF4QixHQUE0RCxFQUE3RCxLQUFvRSxFQUFuRjtBQUNBLE1BQUksY0FBYyxXQUFXLE1BQVgsQ0FBa0IsQ0FBbEIsRUFBcUIsV0FBVyxNQUFYLEdBQW9CLENBQXpDLEtBQStDLEVBQWpFOztBQUVBLE1BQUksQ0FBQyxVQUFVLEtBQVYsQ0FBZ0IsY0FBaEIsQ0FBTCxFQUFzQztBQUNwQyxnQkFBWSxFQUFaO0FBQ0Q7O0FBRUQsZ0JBQWMsWUFBWSxPQUFaLENBQW9CLDhCQUFwQixFQUFvRCxFQUFwRCxDQUFkOztBQUVBLE1BQUksQ0FBQyxTQUFTLEtBQVQsQ0FBZSw0QkFBZixDQUFMLEVBQW1EO0FBQ2pELGVBQVcsRUFBWDtBQUNELEdBRkQsTUFFTyxJQUFJLFNBQVMsS0FBVCxDQUFlLFFBQWYsQ0FBSixFQUE4QjtBQUNuQyxRQUFJLGdCQUFnQixRQUFwQixFQUE4QjtBQUM1QixvQkFBYyxFQUFkO0FBQ0QsS0FGRCxNQUVPLElBQUksZ0JBQWdCLEVBQWhCLElBQXNCLFVBQVUsS0FBVixDQUFnQixJQUFoQixDQUExQixFQUFpRDtBQUN0RCxpQkFBVyxFQUFYO0FBQ0Q7QUFDRixHQU5NLE1BTUEsSUFBSSxhQUFhLFFBQWIsSUFBeUIsZ0JBQWdCLEVBQXpDLElBQStDLFVBQVUsS0FBVixDQUFnQixJQUFoQixDQUFuRCxFQUEwRTtBQUMvRSxlQUFXLEVBQVg7QUFDRDs7QUFFRCxlQUFhLENBQUMsU0FBRCxFQUFZLFdBQVosRUFBeUIsUUFBekIsRUFBbUMsSUFBbkMsQ0FBd0MsRUFBeEMsQ0FBYjs7QUFFQSxNQUFJLFNBQVMsS0FBVCxDQUFlLFFBQWYsQ0FBSixFQUE4QjtBQUM1QixpQkFBYSxDQUNYLE9BQVEsR0FBRSxTQUFVLEdBQUUsV0FBWSxFQUEzQixDQUE2QixPQUE3QixDQUFxQyxRQUFyQyxFQUErQyxHQUEvQyxDQUFQLEtBQ0MsU0FBUyxLQUFULENBQWUsa0JBQWYsSUFBcUMsSUFBckMsR0FBNEMsT0FEN0MsQ0FEVyxFQUdYLFFBSFcsR0FHQSxPQUhBLENBR1EsR0FIUixFQUdhLFFBSGIsQ0FBYjtBQUlEOztBQUVELFNBQU8sVUFBUDtBQUNELENBbEREOztBQW9EQTs7Ozs7QUFLQSxNQUFNLGtCQUFrQixDQUFDLEVBQUUsV0FBVyxHQUFiLEVBQWtCLHFCQUFxQixHQUF2QyxLQUErQyxFQUFoRCxLQUF1RCxTQUFTO0FBQ3RGLFVBQVEsTUFBTSxPQUFOLENBQWMsR0FBZCxFQUFtQixRQUFuQixDQUFSO0FBQ0EsTUFBSSxZQUFZLE1BQU0sQ0FBTixLQUFZLEVBQTVCO0FBQ0EsY0FBWSxDQUFDLEdBQUQsRUFBTSxHQUFOLEVBQVcsUUFBWCxDQUFvQixTQUFwQixJQUFpQyxTQUFqQyxHQUE2QyxFQUF6RDtBQUNBLFFBQU0sa0JBQWtCLE1BQU0sT0FBTixDQUFjLFFBQWQsTUFBNEIsQ0FBQyxDQUFyRDtBQUNBLE1BQUksQ0FBQyxjQUFjLEVBQWYsRUFBbUIsV0FBVyxFQUE5QixJQUFvQyxNQUFNLEtBQU4sQ0FBWSxRQUFaLENBQXhDO0FBQ0EsZ0JBQWMsWUFBWSxPQUFaLENBQW9CLE9BQXBCLEVBQTZCLEVBQTdCLENBQWQ7QUFDQSxnQkFBYyxZQUFZLE9BQVosQ0FBb0IsdUJBQXBCLEVBQTZDLGtCQUE3QyxDQUFkO0FBQ0EsUUFBTSxNQUFPLEdBQUUsU0FBVSxHQUFFLFdBQVksR0FBRSxrQkFBa0IsUUFBbEIsR0FBNkIsRUFBRyxHQUFFLFFBQVMsRUFBcEY7QUFDQSxTQUFPLEdBQVA7QUFDRCxDQVZEOztrQkFZZTtBQUNiLFlBRGE7QUFFYjtBQUZhLEM7Ozs7Ozs7O2tCQzNFUyxRO0FBQVQsU0FBUyxRQUFULENBQWtCLE9BQWxCLEVBQTJCLEdBQUcsSUFBOUIsRUFBb0M7QUFDakQsU0FBUSxDQUFDLEdBQUcsTUFBSixLQUFlO0FBQ3JCLFVBQU0sT0FBTyxPQUFPLE9BQU8sTUFBUCxHQUFnQixDQUF2QixLQUE2QixFQUExQztBQUNBLFVBQU0sU0FBUyxDQUFDLFFBQVEsQ0FBUixDQUFELENBQWY7QUFDQSxTQUFLLE9BQUwsQ0FBYSxDQUFDLEdBQUQsRUFBTSxDQUFOLEtBQVk7QUFDdkIsWUFBTSxRQUFRLE9BQU8sU0FBUCxDQUFpQixHQUFqQixJQUF3QixPQUFPLEdBQVAsQ0FBeEIsR0FBc0MsS0FBSyxHQUFMLENBQXBEO0FBQ0EsYUFBTyxJQUFQLENBQVksS0FBWixFQUFtQixRQUFRLElBQUksQ0FBWixDQUFuQjtBQUNELEtBSEQ7QUFJQSxXQUFPLE9BQU8sSUFBUCxDQUFZLEVBQVosQ0FBUDtBQUNELEdBUkQ7QUFTRDs7Ozs7Ozs7OztBQ1REOzs7O0FBR0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7QUFOQTtRQVdFLFc7UUFHQSxLO1FBQ0EsSTtRQUNBLFM7UUFDQSxlO1FBQ0EsUztRQUNBLGdCO0FBdEJGIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8vIHNoaW0gZm9yIHVzaW5nIHByb2Nlc3MgaW4gYnJvd3NlclxudmFyIHByb2Nlc3MgPSBtb2R1bGUuZXhwb3J0cyA9IHt9O1xuXG4vLyBjYWNoZWQgZnJvbSB3aGF0ZXZlciBnbG9iYWwgaXMgcHJlc2VudCBzbyB0aGF0IHRlc3QgcnVubmVycyB0aGF0IHN0dWIgaXRcbi8vIGRvbid0IGJyZWFrIHRoaW5ncy4gIEJ1dCB3ZSBuZWVkIHRvIHdyYXAgaXQgaW4gYSB0cnkgY2F0Y2ggaW4gY2FzZSBpdCBpc1xuLy8gd3JhcHBlZCBpbiBzdHJpY3QgbW9kZSBjb2RlIHdoaWNoIGRvZXNuJ3QgZGVmaW5lIGFueSBnbG9iYWxzLiAgSXQncyBpbnNpZGUgYVxuLy8gZnVuY3Rpb24gYmVjYXVzZSB0cnkvY2F0Y2hlcyBkZW9wdGltaXplIGluIGNlcnRhaW4gZW5naW5lcy5cblxudmFyIGNhY2hlZFNldFRpbWVvdXQ7XG52YXIgY2FjaGVkQ2xlYXJUaW1lb3V0O1xuXG5mdW5jdGlvbiBkZWZhdWx0U2V0VGltb3V0KCkge1xuICAgIHRocm93IG5ldyBFcnJvcignc2V0VGltZW91dCBoYXMgbm90IGJlZW4gZGVmaW5lZCcpO1xufVxuZnVuY3Rpb24gZGVmYXVsdENsZWFyVGltZW91dCAoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdjbGVhclRpbWVvdXQgaGFzIG5vdCBiZWVuIGRlZmluZWQnKTtcbn1cbihmdW5jdGlvbiAoKSB7XG4gICAgdHJ5IHtcbiAgICAgICAgaWYgKHR5cGVvZiBzZXRUaW1lb3V0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gc2V0VGltZW91dDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBkZWZhdWx0U2V0VGltb3V0O1xuICAgICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gZGVmYXVsdFNldFRpbW91dDtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgaWYgKHR5cGVvZiBjbGVhclRpbWVvdXQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGNsZWFyVGltZW91dDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGRlZmF1bHRDbGVhclRpbWVvdXQ7XG4gICAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGRlZmF1bHRDbGVhclRpbWVvdXQ7XG4gICAgfVxufSAoKSlcbmZ1bmN0aW9uIHJ1blRpbWVvdXQoZnVuKSB7XG4gICAgaWYgKGNhY2hlZFNldFRpbWVvdXQgPT09IHNldFRpbWVvdXQpIHtcbiAgICAgICAgLy9ub3JtYWwgZW52aXJvbWVudHMgaW4gc2FuZSBzaXR1YXRpb25zXG4gICAgICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfVxuICAgIC8vIGlmIHNldFRpbWVvdXQgd2Fzbid0IGF2YWlsYWJsZSBidXQgd2FzIGxhdHRlciBkZWZpbmVkXG4gICAgaWYgKChjYWNoZWRTZXRUaW1lb3V0ID09PSBkZWZhdWx0U2V0VGltb3V0IHx8ICFjYWNoZWRTZXRUaW1lb3V0KSAmJiBzZXRUaW1lb3V0KSB7XG4gICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBzZXRUaW1lb3V0O1xuICAgICAgICByZXR1cm4gc2V0VGltZW91dChmdW4sIDApO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICAvLyB3aGVuIHdoZW4gc29tZWJvZHkgaGFzIHNjcmV3ZWQgd2l0aCBzZXRUaW1lb3V0IGJ1dCBubyBJLkUuIG1hZGRuZXNzXG4gICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfSBjYXRjaChlKXtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIC8vIFdoZW4gd2UgYXJlIGluIEkuRS4gYnV0IHRoZSBzY3JpcHQgaGFzIGJlZW4gZXZhbGVkIHNvIEkuRS4gZG9lc24ndCB0cnVzdCB0aGUgZ2xvYmFsIG9iamVjdCB3aGVuIGNhbGxlZCBub3JtYWxseVxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQuY2FsbChudWxsLCBmdW4sIDApO1xuICAgICAgICB9IGNhdGNoKGUpe1xuICAgICAgICAgICAgLy8gc2FtZSBhcyBhYm92ZSBidXQgd2hlbiBpdCdzIGEgdmVyc2lvbiBvZiBJLkUuIHRoYXQgbXVzdCBoYXZlIHRoZSBnbG9iYWwgb2JqZWN0IGZvciAndGhpcycsIGhvcGZ1bGx5IG91ciBjb250ZXh0IGNvcnJlY3Qgb3RoZXJ3aXNlIGl0IHdpbGwgdGhyb3cgYSBnbG9iYWwgZXJyb3JcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0LmNhbGwodGhpcywgZnVuLCAwKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG59XG5mdW5jdGlvbiBydW5DbGVhclRpbWVvdXQobWFya2VyKSB7XG4gICAgaWYgKGNhY2hlZENsZWFyVGltZW91dCA9PT0gY2xlYXJUaW1lb3V0KSB7XG4gICAgICAgIC8vbm9ybWFsIGVudmlyb21lbnRzIGluIHNhbmUgc2l0dWF0aW9uc1xuICAgICAgICByZXR1cm4gY2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfVxuICAgIC8vIGlmIGNsZWFyVGltZW91dCB3YXNuJ3QgYXZhaWxhYmxlIGJ1dCB3YXMgbGF0dGVyIGRlZmluZWRcbiAgICBpZiAoKGNhY2hlZENsZWFyVGltZW91dCA9PT0gZGVmYXVsdENsZWFyVGltZW91dCB8fCAhY2FjaGVkQ2xlYXJUaW1lb3V0KSAmJiBjbGVhclRpbWVvdXQpIHtcbiAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gY2xlYXJUaW1lb3V0O1xuICAgICAgICByZXR1cm4gY2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIC8vIHdoZW4gd2hlbiBzb21lYm9keSBoYXMgc2NyZXdlZCB3aXRoIHNldFRpbWVvdXQgYnV0IG5vIEkuRS4gbWFkZG5lc3NcbiAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH0gY2F0Y2ggKGUpe1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgLy8gV2hlbiB3ZSBhcmUgaW4gSS5FLiBidXQgdGhlIHNjcmlwdCBoYXMgYmVlbiBldmFsZWQgc28gSS5FLiBkb2Vzbid0ICB0cnVzdCB0aGUgZ2xvYmFsIG9iamVjdCB3aGVuIGNhbGxlZCBub3JtYWxseVxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dC5jYWxsKG51bGwsIG1hcmtlcik7XG4gICAgICAgIH0gY2F0Y2ggKGUpe1xuICAgICAgICAgICAgLy8gc2FtZSBhcyBhYm92ZSBidXQgd2hlbiBpdCdzIGEgdmVyc2lvbiBvZiBJLkUuIHRoYXQgbXVzdCBoYXZlIHRoZSBnbG9iYWwgb2JqZWN0IGZvciAndGhpcycsIGhvcGZ1bGx5IG91ciBjb250ZXh0IGNvcnJlY3Qgb3RoZXJ3aXNlIGl0IHdpbGwgdGhyb3cgYSBnbG9iYWwgZXJyb3IuXG4gICAgICAgICAgICAvLyBTb21lIHZlcnNpb25zIG9mIEkuRS4gaGF2ZSBkaWZmZXJlbnQgcnVsZXMgZm9yIGNsZWFyVGltZW91dCB2cyBzZXRUaW1lb3V0XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0LmNhbGwodGhpcywgbWFya2VyKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG5cbn1cbnZhciBxdWV1ZSA9IFtdO1xudmFyIGRyYWluaW5nID0gZmFsc2U7XG52YXIgY3VycmVudFF1ZXVlO1xudmFyIHF1ZXVlSW5kZXggPSAtMTtcblxuZnVuY3Rpb24gY2xlYW5VcE5leHRUaWNrKCkge1xuICAgIGlmICghZHJhaW5pbmcgfHwgIWN1cnJlbnRRdWV1ZSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGRyYWluaW5nID0gZmFsc2U7XG4gICAgaWYgKGN1cnJlbnRRdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgcXVldWUgPSBjdXJyZW50UXVldWUuY29uY2F0KHF1ZXVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBxdWV1ZUluZGV4ID0gLTE7XG4gICAgfVxuICAgIGlmIChxdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgZHJhaW5RdWV1ZSgpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gZHJhaW5RdWV1ZSgpIHtcbiAgICBpZiAoZHJhaW5pbmcpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB2YXIgdGltZW91dCA9IHJ1blRpbWVvdXQoY2xlYW5VcE5leHRUaWNrKTtcbiAgICBkcmFpbmluZyA9IHRydWU7XG5cbiAgICB2YXIgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIHdoaWxlKGxlbikge1xuICAgICAgICBjdXJyZW50UXVldWUgPSBxdWV1ZTtcbiAgICAgICAgcXVldWUgPSBbXTtcbiAgICAgICAgd2hpbGUgKCsrcXVldWVJbmRleCA8IGxlbikge1xuICAgICAgICAgICAgaWYgKGN1cnJlbnRRdWV1ZSkge1xuICAgICAgICAgICAgICAgIGN1cnJlbnRRdWV1ZVtxdWV1ZUluZGV4XS5ydW4oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBxdWV1ZUluZGV4ID0gLTE7XG4gICAgICAgIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB9XG4gICAgY3VycmVudFF1ZXVlID0gbnVsbDtcbiAgICBkcmFpbmluZyA9IGZhbHNlO1xuICAgIHJ1bkNsZWFyVGltZW91dCh0aW1lb3V0KTtcbn1cblxucHJvY2Vzcy5uZXh0VGljayA9IGZ1bmN0aW9uIChmdW4pIHtcbiAgICB2YXIgYXJncyA9IG5ldyBBcnJheShhcmd1bWVudHMubGVuZ3RoIC0gMSk7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBhcmdzW2kgLSAxXSA9IGFyZ3VtZW50c1tpXTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBxdWV1ZS5wdXNoKG5ldyBJdGVtKGZ1biwgYXJncykpO1xuICAgIGlmIChxdWV1ZS5sZW5ndGggPT09IDEgJiYgIWRyYWluaW5nKSB7XG4gICAgICAgIHJ1blRpbWVvdXQoZHJhaW5RdWV1ZSk7XG4gICAgfVxufTtcblxuLy8gdjggbGlrZXMgcHJlZGljdGlibGUgb2JqZWN0c1xuZnVuY3Rpb24gSXRlbShmdW4sIGFycmF5KSB7XG4gICAgdGhpcy5mdW4gPSBmdW47XG4gICAgdGhpcy5hcnJheSA9IGFycmF5O1xufVxuSXRlbS5wcm90b3R5cGUucnVuID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuZnVuLmFwcGx5KG51bGwsIHRoaXMuYXJyYXkpO1xufTtcbnByb2Nlc3MudGl0bGUgPSAnYnJvd3Nlcic7XG5wcm9jZXNzLmJyb3dzZXIgPSB0cnVlO1xucHJvY2Vzcy5lbnYgPSB7fTtcbnByb2Nlc3MuYXJndiA9IFtdO1xucHJvY2Vzcy52ZXJzaW9uID0gJyc7IC8vIGVtcHR5IHN0cmluZyB0byBhdm9pZCByZWdleHAgaXNzdWVzXG5wcm9jZXNzLnZlcnNpb25zID0ge307XG5cbmZ1bmN0aW9uIG5vb3AoKSB7fVxuXG5wcm9jZXNzLm9uID0gbm9vcDtcbnByb2Nlc3MuYWRkTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5vbmNlID0gbm9vcDtcbnByb2Nlc3Mub2ZmID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVBbGxMaXN0ZW5lcnMgPSBub29wO1xucHJvY2Vzcy5lbWl0ID0gbm9vcDtcbnByb2Nlc3MucHJlcGVuZExpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3MucHJlcGVuZE9uY2VMaXN0ZW5lciA9IG5vb3A7XG5cbnByb2Nlc3MubGlzdGVuZXJzID0gZnVuY3Rpb24gKG5hbWUpIHsgcmV0dXJuIFtdIH1cblxucHJvY2Vzcy5iaW5kaW5nID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuYmluZGluZyBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xuXG5wcm9jZXNzLmN3ZCA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuICcvJyB9O1xucHJvY2Vzcy5jaGRpciA9IGZ1bmN0aW9uIChkaXIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuY2hkaXIgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcbnByb2Nlc3MudW1hc2sgPSBmdW5jdGlvbigpIHsgcmV0dXJuIDA7IH07XG4iLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5cbnZhciBfZXh0ZW5kcyA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24gKHRhcmdldCkgeyBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykgeyB2YXIgc291cmNlID0gYXJndW1lbnRzW2ldOyBmb3IgKHZhciBrZXkgaW4gc291cmNlKSB7IGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoc291cmNlLCBrZXkpKSB7IHRhcmdldFtrZXldID0gc291cmNlW2tleV07IH0gfSB9IHJldHVybiB0YXJnZXQ7IH07XG5cbnZhciBfcmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xuXG52YXIgX3JlYWN0MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3JlYWN0KTtcblxudmFyIF9wcm9wVHlwZXMgPSByZXF1aXJlKCdwcm9wLXR5cGVzJyk7XG5cbnZhciBfcHJvcFR5cGVzMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3Byb3BUeXBlcyk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbmZ1bmN0aW9uIF9vYmplY3RXaXRob3V0UHJvcGVydGllcyhvYmosIGtleXMpIHsgdmFyIHRhcmdldCA9IHt9OyBmb3IgKHZhciBpIGluIG9iaikgeyBpZiAoa2V5cy5pbmRleE9mKGkpID49IDApIGNvbnRpbnVlOyBpZiAoIU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIGkpKSBjb250aW51ZTsgdGFyZ2V0W2ldID0gb2JqW2ldOyB9IHJldHVybiB0YXJnZXQ7IH1cblxudmFyIEljb25CYXNlID0gZnVuY3Rpb24gSWNvbkJhc2UoX3JlZiwgX3JlZjIpIHtcbiAgdmFyIGNoaWxkcmVuID0gX3JlZi5jaGlsZHJlbjtcbiAgdmFyIGNvbG9yID0gX3JlZi5jb2xvcjtcbiAgdmFyIHNpemUgPSBfcmVmLnNpemU7XG4gIHZhciBzdHlsZSA9IF9yZWYuc3R5bGU7XG4gIHZhciB3aWR0aCA9IF9yZWYud2lkdGg7XG4gIHZhciBoZWlnaHQgPSBfcmVmLmhlaWdodDtcblxuICB2YXIgcHJvcHMgPSBfb2JqZWN0V2l0aG91dFByb3BlcnRpZXMoX3JlZiwgWydjaGlsZHJlbicsICdjb2xvcicsICdzaXplJywgJ3N0eWxlJywgJ3dpZHRoJywgJ2hlaWdodCddKTtcblxuICB2YXIgX3JlZjIkcmVhY3RJY29uQmFzZSA9IF9yZWYyLnJlYWN0SWNvbkJhc2U7XG4gIHZhciByZWFjdEljb25CYXNlID0gX3JlZjIkcmVhY3RJY29uQmFzZSA9PT0gdW5kZWZpbmVkID8ge30gOiBfcmVmMiRyZWFjdEljb25CYXNlO1xuXG4gIHZhciBjb21wdXRlZFNpemUgPSBzaXplIHx8IHJlYWN0SWNvbkJhc2Uuc2l6ZSB8fCAnMWVtJztcbiAgcmV0dXJuIF9yZWFjdDIuZGVmYXVsdC5jcmVhdGVFbGVtZW50KCdzdmcnLCBfZXh0ZW5kcyh7XG4gICAgY2hpbGRyZW46IGNoaWxkcmVuLFxuICAgIGZpbGw6ICdjdXJyZW50Q29sb3InLFxuICAgIHByZXNlcnZlQXNwZWN0UmF0aW86ICd4TWlkWU1pZCBtZWV0JyxcbiAgICBoZWlnaHQ6IGhlaWdodCB8fCBjb21wdXRlZFNpemUsXG4gICAgd2lkdGg6IHdpZHRoIHx8IGNvbXB1dGVkU2l6ZVxuICB9LCByZWFjdEljb25CYXNlLCBwcm9wcywge1xuICAgIHN0eWxlOiBfZXh0ZW5kcyh7XG4gICAgICB2ZXJ0aWNhbEFsaWduOiAnbWlkZGxlJyxcbiAgICAgIGNvbG9yOiBjb2xvciB8fCByZWFjdEljb25CYXNlLmNvbG9yXG4gICAgfSwgcmVhY3RJY29uQmFzZS5zdHlsZSB8fCB7fSwgc3R5bGUpXG4gIH0pKTtcbn07XG5cbkljb25CYXNlLnByb3BUeXBlcyA9IHtcbiAgY29sb3I6IF9wcm9wVHlwZXMyLmRlZmF1bHQuc3RyaW5nLFxuICBzaXplOiBfcHJvcFR5cGVzMi5kZWZhdWx0Lm9uZU9mVHlwZShbX3Byb3BUeXBlczIuZGVmYXVsdC5zdHJpbmcsIF9wcm9wVHlwZXMyLmRlZmF1bHQubnVtYmVyXSksXG4gIHdpZHRoOiBfcHJvcFR5cGVzMi5kZWZhdWx0Lm9uZU9mVHlwZShbX3Byb3BUeXBlczIuZGVmYXVsdC5zdHJpbmcsIF9wcm9wVHlwZXMyLmRlZmF1bHQubnVtYmVyXSksXG4gIGhlaWdodDogX3Byb3BUeXBlczIuZGVmYXVsdC5vbmVPZlR5cGUoW19wcm9wVHlwZXMyLmRlZmF1bHQuc3RyaW5nLCBfcHJvcFR5cGVzMi5kZWZhdWx0Lm51bWJlcl0pLFxuICBzdHlsZTogX3Byb3BUeXBlczIuZGVmYXVsdC5vYmplY3Rcbn07XG5cbkljb25CYXNlLmNvbnRleHRUeXBlcyA9IHtcbiAgcmVhY3RJY29uQmFzZTogX3Byb3BUeXBlczIuZGVmYXVsdC5zaGFwZShJY29uQmFzZS5wcm9wVHlwZXMpXG59O1xuXG5leHBvcnRzLmRlZmF1bHQgPSBJY29uQmFzZTtcbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddOyIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gICAgdmFsdWU6IHRydWVcbn0pO1xuXG52YXIgX2V4dGVuZHMgPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uICh0YXJnZXQpIHsgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHsgdmFyIHNvdXJjZSA9IGFyZ3VtZW50c1tpXTsgZm9yICh2YXIga2V5IGluIHNvdXJjZSkgeyBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHNvdXJjZSwga2V5KSkgeyB0YXJnZXRba2V5XSA9IHNvdXJjZVtrZXldOyB9IH0gfSByZXR1cm4gdGFyZ2V0OyB9O1xuXG52YXIgX3JlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcblxudmFyIF9yZWFjdDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9yZWFjdCk7XG5cbnZhciBfcmVhY3RJY29uQmFzZSA9IHJlcXVpcmUoJ3JlYWN0LWljb24tYmFzZScpO1xuXG52YXIgX3JlYWN0SWNvbkJhc2UyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfcmVhY3RJY29uQmFzZSk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbnZhciBGYVNwaW5uZXIgPSBmdW5jdGlvbiBGYVNwaW5uZXIocHJvcHMpIHtcbiAgICByZXR1cm4gX3JlYWN0Mi5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgIF9yZWFjdEljb25CYXNlMi5kZWZhdWx0LFxuICAgICAgICBfZXh0ZW5kcyh7IHZpZXdCb3g6ICcwIDAgNDAgNDAnIH0sIHByb3BzKSxcbiAgICAgICAgX3JlYWN0Mi5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAnZycsXG4gICAgICAgICAgICBudWxsLFxuICAgICAgICAgICAgX3JlYWN0Mi5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoJ3BhdGgnLCB7IGQ6ICdtMTEuNyAzMS4xcTAgMS4yLTAuOCAydC0yIDAuOXEtMS4yIDAtMi0wLjl0LTAuOS0ycTAtMS4yIDAuOS0ydDItMC44IDIgMC44IDAuOCAyeiBtMTEuMiA0LjZxMCAxLjItMC45IDJ0LTIgMC45LTItMC45LTAuOS0yIDAuOS0yIDItMC44IDIgMC44IDAuOSAyeiBtLTE1LjgtMTUuN3EwIDEuMi0wLjggMnQtMiAwLjktMi0wLjktMC45LTIgMC45LTIgMi0wLjkgMiAwLjkgMC44IDJ6IG0yNi45IDExLjFxMCAxLjItMC45IDJ0LTIgMC45cS0xLjIgMC0yLTAuOXQtMC44LTIgMC44LTIgMi0wLjggMiAwLjggMC45IDJ6IG0tMjEuNS0yMi4ycTAgMS41LTEuMSAyLjV0LTIuNSAxLjEtMi41LTEuMS0xLjEtMi41IDEuMS0yLjUgMi41LTEuMSAyLjUgMS4xIDEuMSAyLjV6IG0yNi4xIDExLjFxMCAxLjItMC45IDJ0LTIgMC45LTItMC45LTAuOC0yIDAuOC0yIDItMC45IDIgMC45IDAuOSAyeiBtLTE0LjMtMTUuN3EwIDEuOC0xLjMgM3QtMyAxLjMtMy0xLjMtMS4zLTMgMS4zLTMuMSAzLTEuMiAzIDEuMyAxLjMgM3ogbTExLjggNC42cTAgMi4xLTEuNSAzLjV0LTMuNSAxLjVxLTIuMSAwLTMuNS0xLjV0LTEuNS0zLjVxMC0yLjEgMS41LTMuNXQzLjUtMS41cTIuMSAwIDMuNSAxLjV0MS41IDMuNXonIH0pXG4gICAgICAgIClcbiAgICApO1xufTtcblxuZXhwb3J0cy5kZWZhdWx0ID0gRmFTcGlubmVyO1xubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzWydkZWZhdWx0J107IiwiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBob2lzdE5vblJlYWN0U3RhdGljcyBmcm9tICdob2lzdC1ub24tcmVhY3Qtc3RhdGljcyc7XG5pbXBvcnQgZ2V0REJVSUxvY2FsZVNlcnZpY2UgZnJvbSAnLi8uLi8uLi93ZWItY29tcG9uZW50cy9zZXJ2aWNlcy9EQlVJTG9jYWxlU2VydmljZSc7XG5pbXBvcnQgZ2V0REJVSUkxOG5TZXJ2aWNlIGZyb20gJy4vLi4vLi4vd2ViLWNvbXBvbmVudHMvc2VydmljZXMvREJVSUkxOG5TZXJ2aWNlJztcblxuY29uc3QgbG9jYWxlU2VydmljZSA9IGdldERCVUlMb2NhbGVTZXJ2aWNlKHdpbmRvdyk7XG5jb25zdCBpMThuU2VydmljZSA9IGdldERCVUlJMThuU2VydmljZSh3aW5kb3cpO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBsb2NhbGVBd2FyZShDb21wb25lbnQpIHtcbiAgY2xhc3MgTG9jYWxlQXdhcmUgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICAgIGNvbnN0cnVjdG9yKHByb3BzLCBjb250ZXh0KSB7XG4gICAgICBzdXBlcihwcm9wcywgY29udGV4dCk7XG4gICAgICB0aGlzLmhhbmRsZUxvY2FsZUNoYW5nZSA9IHRoaXMuaGFuZGxlTG9jYWxlQ2hhbmdlLmJpbmQodGhpcyk7XG4gICAgICB0aGlzLnVucmVnaXN0ZXJMb2NhbGVDaGFuZ2UgPSBudWxsO1xuICAgICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgICAgbG9jYWxlOiBsb2NhbGVTZXJ2aWNlLmxvY2FsZVxuICAgICAgfTtcbiAgICAgIHRoaXMuX21vdW50ZWQgPSBmYWxzZTtcbiAgICAgIHRoaXMuX2NvbXBvbmVudCA9IG51bGw7XG4gICAgfVxuXG4gICAgaGFuZGxlTG9jYWxlQ2hhbmdlKGxvY2FsZSkge1xuICAgICAgdGhpcy5fbW91bnRlZCAmJiB0aGlzLnN0YXRlLmxvY2FsZSAhPT0gbG9jYWxlICYmIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICBsb2NhbGVcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgICAgdGhpcy51bnJlZ2lzdGVyTG9jYWxlQ2hhbmdlID0gbG9jYWxlU2VydmljZS5vbkxvY2FsZUNoYW5nZSh0aGlzLmhhbmRsZUxvY2FsZUNoYW5nZSk7XG4gICAgICB0aGlzLl9tb3VudGVkID0gdHJ1ZTtcbiAgICB9XG5cbiAgICBjb21wb25lbnRXaWxsVW5tb3VudCgpIHtcbiAgICAgIHRoaXMuX21vdW50ZWQgPSBmYWxzZTtcbiAgICAgIHRoaXMudW5yZWdpc3RlckxvY2FsZUNoYW5nZSgpO1xuICAgIH1cblxuICAgIHJlbmRlcigpIHtcbiAgICAgIGNvbnN0IHsgbG9jYWxlIH0gPSB0aGlzLnN0YXRlO1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPENvbXBvbmVudCB7IC4uLnRoaXMucHJvcHMgfVxuICAgICAgICAgIGxvY2FsZT17IGxvY2FsZSB9XG4gICAgICAgICAgdHJhbnNsYXRpb25zPXsgaTE4blNlcnZpY2UuY3VycmVudExhbmdUcmFuc2xhdGlvbnMgfVxuICAgICAgICAgIHJlZj17IGNvbXAgPT4gdGhpcy5fY29tcG9uZW50ID0gY29tcCB9XG4gICAgICAgIC8+XG4gICAgICApO1xuICAgIH1cbiAgfVxuXG4gIExvY2FsZUF3YXJlLmRpc3BsYXlOYW1lID0gYExvY2FsZUF3YXJlKCR7XG4gICAgQ29tcG9uZW50LmRpc3BsYXlOYW1lIHx8XG4gICAgQ29tcG9uZW50Lm5hbWUgfHxcbiAgICAnQ29tcG9uZW50J1xuICB9KWA7XG5cbiAgcmV0dXJuIGhvaXN0Tm9uUmVhY3RTdGF0aWNzKExvY2FsZUF3YXJlLCBDb21wb25lbnQpO1xufVxuIiwiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5cbmZ1bmN0aW9uIGNsZWFyQ3VycmVudFNlbGVjdGlvbigpIHtcbiAgd2luZG93LmdldFNlbGVjdGlvbiAmJiB3aW5kb3cuZ2V0U2VsZWN0aW9uKCkucmVtb3ZlQWxsUmFuZ2VzKCk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIERpc2FibGVTZWxlY3Rpb24gZXh0ZW5kcyBSZWFjdC5QdXJlQ29tcG9uZW50IHtcblxuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcblxuICAgIHRoaXMuZGlzYWJsZVNlbGVjdGlvbiA9IHRoaXMuZGlzYWJsZVNlbGVjdGlvbi5iaW5kKHRoaXMpO1xuICAgIHRoaXMua2lsbFNlbGVjdGlvbiA9IHRoaXMua2lsbFNlbGVjdGlvbi5iaW5kKHRoaXMpO1xuICAgIHRoaXMuZW5hYmxlU2VsZWN0aW9uID0gdGhpcy5lbmFibGVTZWxlY3Rpb24uYmluZCh0aGlzKTtcbiAgfVxuXG4gIGdldCBzZWxlY3Rpb25FdmVudCgpIHtcbiAgICAvLyBzZWxlY3RzdGFydCB8fCBtb3VzZW1vdmVcbiAgICByZXR1cm4gZG9jdW1lbnQub25zZWxlY3RzdGFydCAhPT0gdW5kZWZpbmVkID8gJ3NlbGVjdHN0YXJ0JyA6ICdtb3VzZW1vdmUnO1xuICB9XG5cbiAga2lsbFNlbGVjdGlvbihlKSB7XG4gICAgc3dpdGNoIChlLnR5cGUpIHtcbiAgICAgIGNhc2UgJ3NlbGVjdHN0YXJ0JzpcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ21vdXNlbW92ZSc6XG4gICAgICAgIGNsZWFyQ3VycmVudFNlbGVjdGlvbigpO1xuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIC8vIHBhc3NcbiAgICB9XG4gIH1cblxuICBkaXNhYmxlU2VsZWN0aW9uKCkge1xuICAgIC8vIGZpcnN0IGNsZWFyIGFueSBjdXJyZW50IHNlbGVjdGlvblxuICAgIGNsZWFyQ3VycmVudFNlbGVjdGlvbigpO1xuXG4gICAgLy8gdGhlbiBkaXNhYmxlIGZ1cnRoZXIgc2VsZWN0aW9uXG5cbiAgICAvLyAxLiBieSBzdHlsZVxuICAgIGRvY3VtZW50LmJvZHkuc3R5bGUuTW96VXNlclNlbGVjdCA9ICdub25lJztcbiAgICBkb2N1bWVudC5ib2R5LnN0eWxlLldlYmtpdFVzZXJTZWxlY3QgPSAnbm9uZSc7XG4gICAgZG9jdW1lbnQuYm9keS5zdHlsZS51c2VyU2VsZWN0ID0gJ25vbmUnO1xuXG4gICAgLy8gMi4gYnkgYWRkaW5nIGV2ZW50IGxpc3RlbmVyc1xuICAgIGNvbnN0IGV2dCA9IHRoaXMuc2VsZWN0aW9uRXZlbnQ7XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihldnQsIHRoaXMua2lsbFNlbGVjdGlvbiwgZmFsc2UpO1xuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCB0aGlzLmVuYWJsZVNlbGVjdGlvbiwgZmFsc2UpO1xuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoZW5kJywgdGhpcy5lbmFibGVTZWxlY3Rpb24sIGZhbHNlKTtcbiAgfVxuXG4gIGVuYWJsZVNlbGVjdGlvbigpIHtcbiAgICAvLyAxLiBieSBzdHlsZVxuICAgIGRvY3VtZW50LmJvZHkuc3R5bGUuTW96VXNlclNlbGVjdCA9IG51bGw7XG4gICAgZG9jdW1lbnQuYm9keS5zdHlsZS5XZWJraXRVc2VyU2VsZWN0ID0gbnVsbDtcbiAgICBkb2N1bWVudC5ib2R5LnN0eWxlLnVzZXJTZWxlY3QgPSBudWxsO1xuXG4gICAgLy8gMi4gYnkgcmVtb3ZpbmcgZXZlbnQgbGlzdGVuZXJzXG4gICAgY29uc3QgZXZ0ID0gdGhpcy5zZWxlY3Rpb25FdmVudDtcbiAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKGV2dCwgdGhpcy5raWxsU2VsZWN0aW9uLCBmYWxzZSk7XG4gICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIHRoaXMuZW5hYmxlU2VsZWN0aW9uLCBmYWxzZSk7XG4gICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigndG91Y2hlbmQnLCB0aGlzLmVuYWJsZVNlbGVjdGlvbiwgZmFsc2UpO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2XG4gICAgICAgIG9uTW91c2VEb3duPXt0aGlzLmRpc2FibGVTZWxlY3Rpb259XG4gICAgICAgIG9uVG91Y2hTdGFydD17dGhpcy5kaXNhYmxlU2VsZWN0aW9ufVxuICAgICAgPnt0aGlzLnByb3BzLmNoaWxkcmVufTwvZGl2PlxuICAgICk7XG4gIH1cblxufVxuXG5EaXNhYmxlU2VsZWN0aW9uLnByb3BUeXBlcyA9IHtcbiAgY2hpbGRyZW46IFByb3BUeXBlcy5lbGVtZW50XG59O1xuXG4iLCJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCBjbiBmcm9tICdjbGFzc25hbWVzJztcbmltcG9ydCBEaXNhYmxlU2VsZWN0aW9uIGZyb20gJy4uLy4uL2NvbXBvbmVudHMvRGlzYWJsZVNlbGVjdGlvbi9EaXNhYmxlU2VsZWN0aW9uJztcblxuZnVuY3Rpb24gZ2V0TWVhc3VyZW1lbnRzKG5vZGUsIGV2dCkge1xuICBjb25zdCBub2RlQ29tcHV0ZWRTdHlsZSA9IGdldENvbXB1dGVkU3R5bGUobm9kZSwgbnVsbCk7XG4gIGNvbnN0IHsgY2xpZW50WDogc3RhcnRYLCBjbGllbnRZOiBzdGFydFkgfSA9IGV2dDtcbiAgY29uc3QgbWF0cml4ID0gbm9kZUNvbXB1dGVkU3R5bGUudHJhbnNmb3JtLm1hdGNoKC8tP1xcZCpcXC4/XFxkKy9nKS5tYXAoTnVtYmVyKTtcbiAgY29uc3QgW3RyYW5zZm9ybVgsIHRyYW5zZm9ybVldID0gW21hdHJpeFs0XSwgbWF0cml4WzVdXTtcbiAgY29uc3QgcmV0ID0ge1xuICAgIHN0YXJ0WCwgc3RhcnRZLCB0cmFuc2Zvcm1YLCB0cmFuc2Zvcm1ZXG4gIH07XG4gIHJldHVybiByZXQ7XG59XG5cbmNsYXNzIERyYWdnYWJsZSBleHRlbmRzIFJlYWN0LlB1cmVDb21wb25lbnQge1xuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcblxuICAgIHRoaXMubm9kZSA9IG51bGw7XG4gICAgdGhpcy5tZWFzdXJlbWVudHMgPSBudWxsO1xuICAgIHRoaXMudHJhbnNmb3JtWCA9IDA7XG4gICAgdGhpcy50cmFuc2Zvcm1ZID0gMDtcblxuICAgIHRoaXMuY2FwdHVyZU5vZGUgPSB0aGlzLmNhcHR1cmVOb2RlLmJpbmQodGhpcyk7XG4gICAgdGhpcy5oYW5kbGVNb3VzZURvd24gPSB0aGlzLmhhbmRsZU1vdXNlRG93bi5iaW5kKHRoaXMpO1xuICAgIHRoaXMuaGFuZGxlVG91Y2hTdGFydCA9IHRoaXMuaGFuZGxlVG91Y2hTdGFydC5iaW5kKHRoaXMpO1xuICAgIHRoaXMuaGFuZGxlTW91c2VVcCA9IHRoaXMuaGFuZGxlTW91c2VVcC5iaW5kKHRoaXMpO1xuICAgIHRoaXMuaGFuZGxlVG91Y2hFbmQgPSB0aGlzLmhhbmRsZVRvdWNoRW5kLmJpbmQodGhpcyk7XG4gICAgdGhpcy5oYW5kbGVNb3VzZU1vdmUgPSB0aGlzLmhhbmRsZU1vdXNlTW92ZS5iaW5kKHRoaXMpO1xuICAgIHRoaXMuaGFuZGxlVG91Y2hNb3ZlID0gdGhpcy5oYW5kbGVUb3VjaE1vdmUuYmluZCh0aGlzKTtcbiAgICB0aGlzLmRvTW92ZSA9IHRoaXMuZG9Nb3ZlLmJpbmQodGhpcyk7XG5cbiAgICB0aGlzLmV2ZW50cyA9IHtcbiAgICAgIG1vdXNlOiB7XG4gICAgICAgIG1vdXNlbW92ZTogdGhpcy5oYW5kbGVNb3VzZU1vdmUsXG4gICAgICAgIG1vdXNldXA6IHRoaXMuaGFuZGxlTW91c2VVcFxuICAgICAgfSxcbiAgICAgIHRvdWNoOiB7XG4gICAgICAgIHRvdWNobW92ZTogdGhpcy5oYW5kbGVUb3VjaE1vdmUsXG4gICAgICAgIHRvdWNoZW5kOiB0aGlzLmhhbmRsZVRvdWNoRW5kLFxuICAgICAgICB0b3VjaGNhbmNlbDogdGhpcy5oYW5kbGVUb3VjaEVuZFxuICAgICAgfVxuICAgIH07XG4gIH1cblxuICBjYXB0dXJlTm9kZShub2RlKSB7XG4gICAgdGhpcy5ub2RlID0gbm9kZTtcbiAgfVxuXG4gIHJlZ2lzdGVyRXZlbnRzKHR5cGUpIHtcbiAgICBPYmplY3Qua2V5cyh0aGlzLmV2ZW50c1t0eXBlXSkuZm9yRWFjaCgoZXZlbnQpID0+IHtcbiAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoZXZlbnQsIHRoaXMuZXZlbnRzW3R5cGVdW2V2ZW50XSwgdHJ1ZSk7XG4gICAgfSk7XG4gIH1cblxuICB1bnJlZ2lzdGVyRXZlbnRzKHR5cGUpIHtcbiAgICBPYmplY3Qua2V5cyh0aGlzLmV2ZW50c1t0eXBlXSkuZm9yRWFjaCgoZXZlbnQpID0+IHtcbiAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZlbnQsIHRoaXMuZXZlbnRzW3R5cGVdW2V2ZW50XSwgdHJ1ZSk7XG4gICAgfSk7XG4gIH1cblxuICBoYW5kbGVNb3VzZURvd24oZXZ0KSB7XG4gICAgdGhpcy5tZWFzdXJlbWVudHMgPSBnZXRNZWFzdXJlbWVudHModGhpcy5ub2RlLCBldnQpO1xuICAgIHRoaXMucmVnaXN0ZXJFdmVudHMoJ21vdXNlJyk7XG4gIH1cblxuICBoYW5kbGVUb3VjaFN0YXJ0KGV2dCkge1xuICAgIHRoaXMubWVhc3VyZW1lbnRzID0gZ2V0TWVhc3VyZW1lbnRzKHRoaXMubm9kZSwgZXZ0LnRvdWNoZXNbMF0pO1xuICAgIHRoaXMucmVnaXN0ZXJFdmVudHMoJ3RvdWNoJyk7XG4gIH1cblxuICBoYW5kbGVNb3VzZVVwKCkge1xuICAgIHRoaXMudW5yZWdpc3RlckV2ZW50cygnbW91c2UnKTtcbiAgfVxuXG4gIGhhbmRsZVRvdWNoRW5kKCkge1xuICAgIHRoaXMudW5yZWdpc3RlckV2ZW50cygndG91Y2gnKTtcbiAgfVxuXG4gIGhhbmRsZU1vdXNlTW92ZShldnQpIHtcbiAgICBldnQucHJldmVudERlZmF1bHQoKTsgLy8gcHJldmVudCBzZWxlY3Rpb24gYW5kIHNjcm9sbGluZyBpbnNpZGUgbm9kZVxuICAgIHRoaXMuZG9Nb3ZlKGV2dCk7XG4gIH1cblxuICBoYW5kbGVUb3VjaE1vdmUoZXZ0KSB7XG4gICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7IC8vIHByZXZlbnQgcGFnZSBzY3JvbGxcbiAgICB0aGlzLmRvTW92ZShldnQudG91Y2hlc1swXSk7XG4gIH1cblxuICBkb01vdmUoZXZ0KSB7XG4gICAgaWYgKHRoaXMuX2RyYWdSdW5uaW5nKSB7IHJldHVybjsgfVxuICAgIHRoaXMuX2RyYWdSdW5uaW5nID0gdHJ1ZTtcbiAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xuICAgICAgaWYgKCF0aGlzLm5vZGUpIHsgLy8gbWlnaHQgYmUgdW5tb3VudGVkIG1lYW53aGlsZVxuICAgICAgICB0aGlzLl9kcmFnUnVubmluZyA9IGZhbHNlO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHtcbiAgICAgICAgc3RhcnRYLCBzdGFydFksIHRyYW5zZm9ybVgsIHRyYW5zZm9ybVlcbiAgICAgIH0gPSB0aGlzLm1lYXN1cmVtZW50cztcbiAgICAgIGNvbnN0IFtkaXN0YW5jZVgsIGRpc3RhbmNlWV0gPSBbZXZ0LmNsaWVudFggLSBzdGFydFgsIGV2dC5jbGllbnRZIC0gc3RhcnRZXTtcblxuICAgICAgY29uc3QgbmV4dFRyYW5zZm9ybVggPSB0cmFuc2Zvcm1YICsgZGlzdGFuY2VYO1xuICAgICAgY29uc3QgbmV4dFRyYW5zZm9ybVkgPSB0cmFuc2Zvcm1ZICsgZGlzdGFuY2VZO1xuXG4gICAgICB0aGlzLnRyYW5zZm9ybVggPSBuZXh0VHJhbnNmb3JtWDtcbiAgICAgIHRoaXMudHJhbnNmb3JtWSA9IG5leHRUcmFuc2Zvcm1ZO1xuICAgICAgdGhpcy5mb3JjZVVwZGF0ZSgpO1xuICAgICAgdGhpcy5fZHJhZ1J1bm5pbmcgPSBmYWxzZTtcbiAgICB9KTtcbiAgfVxuXG4gIGNvbXBvbmVudFdpbGxVbm1vdW50KCkge1xuICAgIHRoaXMudW5yZWdpc3RlckV2ZW50cygnbW91c2UnKTtcbiAgICB0aGlzLnVucmVnaXN0ZXJFdmVudHMoJ3RvdWNoJyk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgY29uc3QgeyBzdHlsZSB9ID0gdGhpcy5wcm9wcztcbiAgICBjb25zdCBkcmFnZ2FibGVDbGFzc05hbWVzID0gY24oe1xuICAgICAgJ2RidWktZHJhZ2dhYmxlJzogdHJ1ZVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXZcbiAgICAgICAgcmVmPXt0aGlzLmNhcHR1cmVOb2RlfVxuICAgICAgICBkYXRhLWNvbXBvbmVudC1pZD1cIkRyYWdnYWJsZVwiXG4gICAgICAgIGNsYXNzTmFtZT17ZHJhZ2dhYmxlQ2xhc3NOYW1lc31cbiAgICAgICAgb25Nb3VzZURvd25DYXB0dXJlPXt0aGlzLmhhbmRsZU1vdXNlRG93bn1cbiAgICAgICAgb25Ub3VjaFN0YXJ0Q2FwdHVyZT17dGhpcy5oYW5kbGVUb3VjaFN0YXJ0fVxuICAgICAgICBzdHlsZT17e1xuICAgICAgICAgIGN1cnNvcjogJ3BvaW50ZXInLFxuICAgICAgICAgIHRvdWNoQWN0aW9uOiAnbm9uZScsXG4gICAgICAgICAgdHJhbnNmb3JtOiBgdHJhbnNsYXRlKCR7dGhpcy50cmFuc2Zvcm1YfXB4LCR7dGhpcy50cmFuc2Zvcm1ZfXB4KWAsXG4gICAgICAgICAgLi4uc3R5bGUsXG4gICAgICAgIH19XG4gICAgICA+PERpc2FibGVTZWxlY3Rpb24+e3RoaXMucHJvcHMuY2hpbGRyZW59PC9EaXNhYmxlU2VsZWN0aW9uPjwvZGl2PlxuICAgICk7XG4gIH1cbn1cblxuRHJhZ2dhYmxlLmRlZmF1bHRQcm9wcyA9IHtcbn07XG5cbkRyYWdnYWJsZS5wcm9wVHlwZXMgPSB7XG4gIGNoaWxkcmVuOiBQcm9wVHlwZXMuZWxlbWVudCxcbiAgc3R5bGU6IFByb3BUeXBlcy5vYmplY3Rcbn07XG5cbmV4cG9ydCBkZWZhdWx0IERyYWdnYWJsZTtcblxuIiwiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQgY24gZnJvbSAnY2xhc3NuYW1lcyc7XG5cbmNsYXNzIEZvcm1JbnB1dCBleHRlbmRzIFJlYWN0LlB1cmVDb21wb25lbnQge1xuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgdmFsdWU6IHByb3BzLnZhbHVlLnRvU3RyaW5nKClcbiAgICB9O1xuICAgIHRoaXMuaGFuZGxlQ2hhbmdlID0gdGhpcy5oYW5kbGVDaGFuZ2UuYmluZCh0aGlzKTtcbiAgICB0aGlzLmhhbmRsZUZvY3VzID0gdGhpcy5oYW5kbGVGb2N1cy5iaW5kKHRoaXMpO1xuICAgIHRoaXMuaGFuZGxlQmx1ciA9IHRoaXMuaGFuZGxlQmx1ci5iaW5kKHRoaXMpO1xuICB9XG5cbiAgY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyhuZXh0UHJvcHMpIHtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIHZhbHVlOiAobmV4dFByb3BzLnZhbHVlIHx8ICcnKS50b1N0cmluZygpXG4gICAgfSk7XG4gIH1cblxuICBoYW5kbGVDaGFuZ2UoZXZ0KSB7XG4gICAgY29uc3QgeyB2YWx1ZSB9ID0gZXZ0LnRhcmdldDtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIHZhbHVlXG4gICAgfSwgKCkgPT4ge1xuICAgICAgdGhpcy5wcm9wcy5vbkNoYW5nZSh2YWx1ZSk7XG4gICAgfSk7XG4gIH1cblxuICBoYW5kbGVGb2N1cygpIHtcbiAgICB0aGlzLnByb3BzLm9uRm9jdXModGhpcy5zdGF0ZS52YWx1ZSk7XG4gIH1cblxuICBoYW5kbGVCbHVyKCkge1xuICAgIHRoaXMucHJvcHMub25CbHVyKHRoaXMuc3RhdGUudmFsdWUpO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHsgaGFzV2FybmluZywgaGFzRXJyb3IsIC4uLnJlc3QgfSA9IHRoaXMucHJvcHM7XG4gICAgY29uc3QgaW5wdXRDbGFzc05hbWVzID0gY24oe1xuICAgICAgJ2RidWktZm9ybS1pbnB1dCc6IHRydWUsXG4gICAgICAnZGJ1aS13YXJuaW5nJzogaGFzV2FybmluZyxcbiAgICAgICdkYnVpLWVycm9yJzogaGFzRXJyb3IsXG4gICAgICAnZGJ1aS10aGVtZSc6IHRydWUsXG4gICAgICAnZGJ1aS1wYXRjaCc6IHRydWVcbiAgICB9KTtcbiAgICByZXR1cm4gKFxuICAgICAgPGlucHV0XG4gICAgICAgIGRhdGEtY29tcG9uZW50LWlkPVwiRm9ybUlucHV0XCJcbiAgICAgICAgY2xhc3NOYW1lPXtpbnB1dENsYXNzTmFtZXN9XG4gICAgICAgIHsuLi5yZXN0fVxuICAgICAgICB2YWx1ZT17dGhpcy5zdGF0ZS52YWx1ZX1cbiAgICAgICAgb25DaGFuZ2U9e3RoaXMuaGFuZGxlQ2hhbmdlfVxuICAgICAgICBvbkZvY3VzPXt0aGlzLmhhbmRsZUZvY3VzfVxuICAgICAgICBvbkJsdXI9e3RoaXMuaGFuZGxlQmx1cn1cbiAgICAgIC8+XG4gICAgKTtcbiAgfVxufVxuXG5Gb3JtSW5wdXQuZGVmYXVsdFByb3BzID0ge1xuICB0eXBlOiAndGV4dCcsXG4gIHZhbHVlOiAnJyxcbiAgb25DaGFuZ2U6ICgpID0+IHt9LFxuICBvbkZvY3VzOiAoKSA9PiB7fSxcbiAgb25CbHVyOiAoKSA9PiB7fSxcbn07XG5cbkZvcm1JbnB1dC5wcm9wVHlwZXMgPSB7XG4gIHR5cGU6IFByb3BUeXBlcy5zdHJpbmcsXG4gIHZhbHVlOiBQcm9wVHlwZXMub25lT2ZUeXBlKFtcbiAgICBQcm9wVHlwZXMuc3RyaW5nLFxuICAgIFByb3BUeXBlcy5udW1iZXJcbiAgXSksXG4gIG9uQ2hhbmdlOiBQcm9wVHlwZXMuZnVuYyxcbiAgb25Gb2N1czogUHJvcFR5cGVzLmZ1bmMsXG4gIG9uQmx1cjogUHJvcFR5cGVzLmZ1bmMsXG4gIGhhc1dhcm5pbmc6IFByb3BUeXBlcy5ib29sLFxuICBoYXNFcnJvcjogUHJvcFR5cGVzLmJvb2wsXG59O1xuXG5leHBvcnQgZGVmYXVsdCBGb3JtSW5wdXQ7XG5cbiIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IEZvcm1JbnB1dCBmcm9tICcuLi9Gb3JtSW5wdXQvRm9ybUlucHV0JztcbmltcG9ydCBmb3JtYXR0ZXJzIGZyb20gJy4uLy4uLy4uL3dlYi1jb21wb25lbnRzL3V0aWxzL2Zvcm1hdHRlcnMnO1xuXG5jbGFzcyBGb3JtSW5wdXROdW1iZXIgZXh0ZW5kcyBSZWFjdC5QdXJlQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG4gICAgY29uc3QgeyB2YWx1ZSwgZGVmYXVsdERlY1BvaW50LCBkZWZhdWx0VGhvdXNhbmRzU2VwYXJhdG9yIH0gPSBwcm9wcztcbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgdmFsdWU6IHZhbHVlLnRvU3RyaW5nKClcbiAgICB9O1xuXG4gICAgdGhpcy5kZWZhdWx0RGVjUG9pbnQgPSBkZWZhdWx0RGVjUG9pbnQ7XG4gICAgdGhpcy5kZWZhdWx0VGhvdXNhbmRzU2VwYXJhdG9yID0gZGVmYXVsdFRob3VzYW5kc1NlcGFyYXRvcjtcbiAgICB0aGlzLm51bWJlckZvcm1hdHRlciA9IGZvcm1hdHRlcnMubnVtYmVyRm9ybWF0dGVyKHtcbiAgICAgIGRlY1BvaW50OiBkZWZhdWx0RGVjUG9pbnQsXG4gICAgICB0aG91c2FuZHNTZXBhcmF0b3I6IGRlZmF1bHRUaG91c2FuZHNTZXBhcmF0b3JcbiAgICB9KTtcbiAgICB0aGlzLmZvcmNlRmxvYXQgPSBmb3JtYXR0ZXJzLmZvcmNlRmxvYXQoe1xuICAgICAgZGVjUG9pbnQ6IGRlZmF1bHREZWNQb2ludFxuICAgIH0pO1xuXG4gICAgdGhpcy5oYW5kbGVDaGFuZ2UgPSB0aGlzLmhhbmRsZUNoYW5nZS5iaW5kKHRoaXMpO1xuICB9XG5cbiAgY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyhuZXh0UHJvcHMpIHtcbiAgICBjb25zdCByZWNlaXZlZFZhbHVlID0gbmV4dFByb3BzLnZhbHVlLnRvU3RyaW5nKCk7XG4gICAgY29uc3QgaW50ZXJuYWxWYWx1ZSA9IHRoaXMuc3RhdGUudmFsdWU7XG4gICAgY29uc3QgaW50ZXJuYWxWYWx1ZU51bWJlciA9IGludGVybmFsVmFsdWUucmVwbGFjZSh0aGlzLmRlZmF1bHREZWNQb2ludCwgJy4nKTtcbiAgICBsZXQgdmFsdWVUb1N0b3JlID0gTnVtYmVyKGludGVybmFsVmFsdWVOdW1iZXIpID09PSBOdW1iZXIocmVjZWl2ZWRWYWx1ZSkgPyBpbnRlcm5hbFZhbHVlIDogcmVjZWl2ZWRWYWx1ZTtcblxuICAgIGlmIChbJy0nLCAnKyddLmluY2x1ZGVzKGludGVybmFsVmFsdWUpICYmIHJlY2VpdmVkVmFsdWUgPT09ICcwJykge1xuICAgICAgdmFsdWVUb1N0b3JlID0gaW50ZXJuYWxWYWx1ZTtcbiAgICB9XG5cbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIHZhbHVlOiB2YWx1ZVRvU3RvcmVcbiAgICB9KTtcbiAgfVxuXG4gIGhhbmRsZUNoYW5nZSh2YWx1ZSkge1xuICAgIGNvbnN0IHZhbHVlVG9Vc2UgPSB0aGlzLmZvcmNlRmxvYXQodmFsdWUpO1xuXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICB2YWx1ZTogdmFsdWVUb1VzZVxuICAgIH0sICgpID0+IHtcbiAgICAgIHRoaXMuZm9yY2VVcGRhdGUoKTsgLy8gcmVhc29uOiAxMjMuNCA9PiAxMjM0IC8gMTIuMy40ID0+IDEyMzQobm8gcmUtcmVuZGVyKVxuXG4gICAgICBjb25zdCB1c2VkVmFsdWUgPSB0aGlzLnN0YXRlLnZhbHVlO1xuICAgICAgbGV0IHZhbHVlVG9SZXBvcnQgPSB1c2VkVmFsdWUucmVwbGFjZSh0aGlzLmRlZmF1bHREZWNQb2ludCwgJy4nKTtcblxuICAgICAgaWYgKFsnLScsICcrJ10uaW5jbHVkZXModmFsdWVUb1JlcG9ydCkpIHtcbiAgICAgICAgdmFsdWVUb1JlcG9ydCA9ICcwJztcbiAgICAgIH1cblxuICAgICAgY29uc3QgdmFsdWVBc051bWJlciA9IE51bWJlcih2YWx1ZVRvUmVwb3J0KTtcblxuICAgICAgdGhpcy5wcm9wcy5vbkNoYW5nZSh2YWx1ZUFzTnVtYmVyKTtcbiAgICB9KTtcbiAgfVxuXG4gIGdldCB2YWx1ZSgpIHtcbiAgICByZXR1cm4gdGhpcy5udW1iZXJGb3JtYXR0ZXIodGhpcy5zdGF0ZS52YWx1ZSk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgY29uc3QgeyBkZWZhdWx0RGVjUG9pbnQsIGRlZmF1bHRUaG91c2FuZHNTZXBhcmF0b3IsIC4uLnJlc3QgfSA9IHRoaXMucHJvcHM7XG4gICAgcmV0dXJuIChcbiAgICAgIDxGb3JtSW5wdXRcbiAgICAgICAgey4uLnJlc3R9XG4gICAgICAgIGRhdGEtY29tcG9uZW50LWlkPVwiRm9ybUlucHV0TnVtYmVyXCJcbiAgICAgICAgdHlwZT1cInRleHRcIlxuICAgICAgICB2YWx1ZT17dGhpcy52YWx1ZX1cbiAgICAgICAgb25DaGFuZ2U9e3RoaXMuaGFuZGxlQ2hhbmdlfVxuICAgICAgLz5cbiAgICApO1xuICB9XG59XG5cbkZvcm1JbnB1dE51bWJlci5kZWZhdWx0UHJvcHMgPSB7XG4gIHZhbHVlOiAwLFxuICBvbkNoYW5nZTogKCkgPT4ge30sXG4gIGRlZmF1bHREZWNQb2ludDogJy4nLFxuICBkZWZhdWx0VGhvdXNhbmRzU2VwYXJhdG9yOiAnJ1xufTtcblxuRm9ybUlucHV0TnVtYmVyLnByb3BUeXBlcyA9IHtcbiAgdmFsdWU6IFByb3BUeXBlcy5udW1iZXIsXG4gIG9uQ2hhbmdlOiBQcm9wVHlwZXMuZnVuYyxcbiAgZGVmYXVsdERlY1BvaW50OiBQcm9wVHlwZXMuc3RyaW5nLFxuICBkZWZhdWx0VGhvdXNhbmRzU2VwYXJhdG9yOiBQcm9wVHlwZXMuc3RyaW5nXG59O1xuXG5leHBvcnQgZGVmYXVsdCBGb3JtSW5wdXROdW1iZXI7XG5cbiIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IEZhU3Bpbm5lciBmcm9tICdyZWFjdC1pY29ucy9saWIvZmEvc3Bpbm5lcic7XG5pbXBvcnQgTGlzdCBmcm9tICcuLi9MaXN0L0xpc3QnO1xuaW1wb3J0IFdvcmxkIGZyb20gJy4uL1dvcmxkL1dvcmxkJztcbmltcG9ydCBsb2NhbGVBd2FyZSBmcm9tICcuLi8uLi9iZWhhdmlvdXJzL2xvY2FsZUF3YXJlJztcbmltcG9ydCBnZXREQlVJSTE4blNlcnZpY2UgZnJvbSAnLi8uLi8uLi8uLi93ZWItY29tcG9uZW50cy9zZXJ2aWNlcy9EQlVJSTE4blNlcnZpY2UnO1xuaW1wb3J0IHRlbXBsYXRlIGZyb20gJy4uLy4uLy4uL3dlYi1jb21wb25lbnRzL3V0aWxzL3RlbXBsYXRlJztcblxuY29uc3QgaTE4blNlcnZpY2UgPSBnZXREQlVJSTE4blNlcnZpY2Uod2luZG93KTtcblxuaTE4blNlcnZpY2UucmVnaXN0ZXJUcmFuc2xhdGlvbnMoe1xuICBlbjoge1xuICAgIEhlbGxvOiB0ZW1wbGF0ZWBIZWxsbyAkeydhZ2UnfSAkeyduYW1lJ31gXG4gIH0sXG4gIHNwOiB7XG4gICAgSGVsbG86IHRlbXBsYXRlYEhvbGEgJHsnYWdlJ30gJHsnbmFtZSd9YFxuICB9XG59KTtcblxuY29uc3QgbGlzdEl0ZW1zID0gWydvbmUnLCAndHdvJ107XG5cblxuY2xhc3MgSGVsbG8gZXh0ZW5kcyBSZWFjdC5QdXJlQ29tcG9uZW50IHtcbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHsgdHJhbnNsYXRpb25zIH0gPSB0aGlzLnByb3BzO1xuICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgICAvKiBlc2xpbnQgbm8tY29uc29sZTogMCAqL1xuICAgICAgLy8gY29uc29sZS5sb2coJ3JlbmRlcmluZyBIZWxsbyBjb21wb25lbnQnKTtcbiAgICB9XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXY+XG4gICAgICAgIHt0cmFuc2xhdGlvbnMuSGVsbG8oeyBhZ2U6IDIyLCBuYW1lOiB0aGlzLnByb3BzLm5hbWUgfHwgJ05vYm9keScgfSl9XG4gICAgICAgIDxGYVNwaW5uZXIgLz5cbiAgICAgICAgPExpc3QgaXRlbXM9eyBsaXN0SXRlbXMgfS8+XG4gICAgICAgIDxMaXN0IGl0ZW1zPXsgbGlzdEl0ZW1zIH0vPlxuICAgICAgICA8V29ybGQgLz5cbiAgICAgICAgPFdvcmxkIC8+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG59XG5cbkhlbGxvLnByb3BUeXBlcyA9IHtcbiAgdHJhbnNsYXRpb25zOiBQcm9wVHlwZXMub2JqZWN0LFxuICBuYW1lOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWRcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGxvY2FsZUF3YXJlKEhlbGxvKTtcblxuIiwiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQgbG9jYWxlQXdhcmUgZnJvbSAnLi4vLi4vYmVoYXZpb3Vycy9sb2NhbGVBd2FyZSc7XG5pbXBvcnQgZ2V0REJVSUkxOG5TZXJ2aWNlIGZyb20gJy4vLi4vLi4vLi4vd2ViLWNvbXBvbmVudHMvc2VydmljZXMvREJVSUkxOG5TZXJ2aWNlJztcbmltcG9ydCB0ZW1wbGF0ZSBmcm9tICcuLi8uLi8uLi93ZWItY29tcG9uZW50cy91dGlscy90ZW1wbGF0ZSc7XG5cbmNvbnN0IGkxOG5TZXJ2aWNlID0gZ2V0REJVSUkxOG5TZXJ2aWNlKHdpbmRvdyk7XG5cbmkxOG5TZXJ2aWNlLnJlZ2lzdGVyVHJhbnNsYXRpb25zKHtcbiAgZW46IHtcbiAgICBsaXN0OiB0ZW1wbGF0ZWBsaXN0YFxuICB9LFxuICBzcDoge1xuICAgIGxpc3Q6IHRlbXBsYXRlYGxpc3RhYFxuICB9XG59KTtcblxuY2xhc3MgTGlzdCBleHRlbmRzIFJlYWN0LlB1cmVDb21wb25lbnQge1xuICByZW5kZXIoKSB7XG4gICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgICAgIC8qIGVzbGludCBuby1jb25zb2xlOiAwICovXG4gICAgICAvLyBjb25zb2xlLmxvZygncmVuZGVyaW5nIExpc3QgY29tcG9uZW50Jyk7XG4gICAgfVxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2PlxuICAgICAgICB7dGhpcy5wcm9wcy50cmFuc2xhdGlvbnMubGlzdCgpfVxuICAgICAgICA8dWw+XG4gICAgICAgICAge3RoaXMucHJvcHMuaXRlbXMubWFwKGl0ZW0gPT4gPGxpIGtleT17aXRlbX0+e2l0ZW19PC9saT4pfVxuICAgICAgICA8L3VsPlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufVxuXG5MaXN0LmRlZmF1bHRQcm9wcyA9IHtcbiAgaXRlbXM6IFtdXG59O1xuXG5MaXN0LnByb3BUeXBlcyA9IHtcbiAgaXRlbXM6IFByb3BUeXBlcy5hcnJheSxcbiAgdHJhbnNsYXRpb25zOiBQcm9wVHlwZXMub2JqZWN0XG59O1xuXG5leHBvcnQgZGVmYXVsdCBsb2NhbGVBd2FyZShMaXN0KTtcbiIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG4vLyBpbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IExpc3QgZnJvbSAnLi4vTGlzdC9MaXN0JztcblxuY2xhc3MgV29ybGQgZXh0ZW5kcyBSZWFjdC5QdXJlQ29tcG9uZW50IHtcbiAgcmVuZGVyKCkge1xuICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgICAvKiBlc2xpbnQgbm8tY29uc29sZTogMCAqL1xuICAgICAgLy8gY29uc29sZS5sb2coJ3JlbmRlcmluZyBIZWxsbyBjb21wb25lbnQnKTtcbiAgICB9XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXY+XG4gICAgICAgIFdvcmxkIC0tLS0tLS0tLS0tLVxuICAgICAgICA8TGlzdCBpdGVtcz17WydmaXZlJywgJ3NpeCddfS8+XG4gICAgICAgIDxMaXN0IGl0ZW1zPXtbJ2ZpdmUnLCAnc2l4J119Lz5cbiAgICAgICAgLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG59XG5cbldvcmxkLnByb3BUeXBlcyA9IHtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IFdvcmxkO1xuXG4iLCJcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZW5zdXJlU2luZ2xlUmVnaXN0cmF0aW9uKHdpbiwgbmFtZSwgY2FsbGJhY2spIHtcbiAgaWYgKCF3aW4uREJVSVdlYkNvbXBvbmVudHMpIHtcbiAgICB3aW4uREJVSVdlYkNvbXBvbmVudHMgPSB7IHJlZ2lzdHJhdGlvbnM6IHt9IH07XG4gIH0gZWxzZSBpZiAoIXdpbi5EQlVJV2ViQ29tcG9uZW50cy5yZWdpc3RyYXRpb25zKSB7XG4gICAgd2luLkRCVUlXZWJDb21wb25lbnRzLnJlZ2lzdHJhdGlvbnMgPSB7fTtcbiAgfVxuXG4gIGxldCByZWdpc3RyYXRpb24gPSB3aW4uREJVSVdlYkNvbXBvbmVudHMucmVnaXN0cmF0aW9uc1tuYW1lXTtcblxuICBpZiAocmVnaXN0cmF0aW9uKSByZXR1cm4gcmVnaXN0cmF0aW9uO1xuXG4gIHJlZ2lzdHJhdGlvbiA9IGNhbGxiYWNrKCk7XG4gIHdpbi5EQlVJV2ViQ29tcG9uZW50cy5yZWdpc3RyYXRpb25zW25hbWVdID0gcmVnaXN0cmF0aW9uO1xuXG4gIHJldHVybiB3aW4uREJVSVdlYkNvbXBvbmVudHMucmVnaXN0cmF0aW9uc1tuYW1lXTtcbn1cblxuIiwiaW1wb3J0IGdldERCVUlsb2NhbGVTZXJ2aWNlIGZyb20gJy4vREJVSUxvY2FsZVNlcnZpY2UnO1xuaW1wb3J0IGVuc3VyZVNpbmdsZVJlZ2lzdHJhdGlvbiBmcm9tICcuLi9pbnRlcm5hbHMvZW5zdXJlU2luZ2xlUmVnaXN0cmF0aW9uJztcblxuY29uc3QgZW1wdHlPYmogPSB7fTtcblxuY29uc3QgcmVnaXN0cmF0aW9uTmFtZSA9ICdEQlVJSTE4blNlcnZpY2UnO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBnZXREQlVJSTE4blNlcnZpY2Uod2luKSB7XG4gIGNvbnN0IGxvY2FsZVNlcnZpY2UgPSBnZXREQlVJbG9jYWxlU2VydmljZSh3aW4pO1xuICByZXR1cm4gZW5zdXJlU2luZ2xlUmVnaXN0cmF0aW9uKHdpbiwgcmVnaXN0cmF0aW9uTmFtZSwgKCkgPT4ge1xuICAgIGNsYXNzIEkxOG5TZXJ2aWNlIHtcbiAgICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBsb2NhbGVTZXJ2aWNlLm9uTG9jYWxlQ2hhbmdlKHRoaXMuX2hhbmRsZUxvY2FsZUNoYW5nZS5iaW5kKHRoaXMpKTtcbiAgICAgICAgdGhpcy5fbG9jYWxlID0gbG9jYWxlU2VydmljZS5sb2NhbGU7XG4gICAgICAgIHRoaXMuX3RyYW5zbGF0aW9ucyA9IHt9O1xuICAgICAgfVxuXG4gICAgICBfaGFuZGxlTG9jYWxlQ2hhbmdlKGxvY2FsZSkge1xuICAgICAgICB0aGlzLl9sb2NhbGUgPSBsb2NhbGU7XG4gICAgICB9XG5cbiAgICAgIGNsZWFyVHJhbnNsYXRpb25zKGxhbmcpIHtcbiAgICAgICAgZGVsZXRlIHRoaXMuX3RyYW5zbGF0aW9uc1tsYW5nXTtcbiAgICAgIH1cblxuICAgICAgcmVnaXN0ZXJUcmFuc2xhdGlvbnModHJhbnNsYXRpb25zKSB7XG4gICAgICAgIHRoaXMuX3RyYW5zbGF0aW9ucyA9IE9iamVjdC5rZXlzKHRyYW5zbGF0aW9ucykucmVkdWNlKChhY2MsIGxhbmcpID0+IHtcbiAgICAgICAgICBhY2NbbGFuZ10gPSB7XG4gICAgICAgICAgICAuLi50aGlzLl90cmFuc2xhdGlvbnNbbGFuZ10sXG4gICAgICAgICAgICAuLi50cmFuc2xhdGlvbnNbbGFuZ11cbiAgICAgICAgICB9O1xuICAgICAgICAgIHJldHVybiBhY2M7XG4gICAgICAgIH0sIHRoaXMuX3RyYW5zbGF0aW9ucyk7XG4gICAgICB9XG5cbiAgICAgIHRyYW5zbGF0ZShtc2cpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY3VycmVudExhbmdUcmFuc2xhdGlvbnNbbXNnXTtcbiAgICAgIH1cblxuICAgICAgZ2V0IHRyYW5zbGF0aW9ucygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3RyYW5zbGF0aW9ucztcbiAgICAgIH1cblxuICAgICAgZ2V0IGN1cnJlbnRMYW5nVHJhbnNsYXRpb25zKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fdHJhbnNsYXRpb25zW3RoaXMuX2xvY2FsZS5sYW5nXSB8fCBlbXB0eU9iajtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBpMThuU2VydmljZSA9IG5ldyBJMThuU2VydmljZSgpO1xuICAgIHJldHVybiBpMThuU2VydmljZTtcbiAgfSk7XG59XG4iLCJcbmltcG9ydCBlbnN1cmVTaW5nbGVSZWdpc3RyYXRpb24gZnJvbSAnLi4vaW50ZXJuYWxzL2Vuc3VyZVNpbmdsZVJlZ2lzdHJhdGlvbic7XG5cbmNvbnN0IGRlZmF1bHRMb2NhbGUgPSB7XG4gIGRpcjogJ2x0cicsXG4gIGxhbmc6ICdlbidcbn07XG5cbmNvbnN0IHJlZ2lzdHJhdGlvbk5hbWUgPSAnREJVSUxvY2FsZVNlcnZpY2UnO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBnZXREQlVJTG9jYWxlU2VydmljZSh3aW4pIHtcbiAgcmV0dXJuIGVuc3VyZVNpbmdsZVJlZ2lzdHJhdGlvbih3aW4sIHJlZ2lzdHJhdGlvbk5hbWUsICgpID0+IHtcbiAgICBjbGFzcyBMb2NhbGVTZXJ2aWNlIHtcbiAgICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLl9jYWxsYmFja3MgPSBbXTtcbiAgICAgICAgdGhpcy5fbG9jYWxlQXR0cnMgPSBPYmplY3Qua2V5cyhkZWZhdWx0TG9jYWxlKTtcbiAgICAgICAgdGhpcy5fcm9vdEVsZW1lbnQgPSB3aW5kb3cuZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50O1xuICAgICAgICB0aGlzLl9sb2NhbGVBdHRycy5mb3JFYWNoKChhdHRyKSA9PiB7XG4gICAgICAgICAgaWYgKCF0aGlzLl9yb290RWxlbWVudC5nZXRBdHRyaWJ1dGUoYXR0cikpIHtcbiAgICAgICAgICAgIHRoaXMuX3Jvb3RFbGVtZW50LnNldEF0dHJpYnV0ZShhdHRyLCBkZWZhdWx0TG9jYWxlW2F0dHJdKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLl9sb2NhbGUgPSB0aGlzLl9sb2NhbGVBdHRycy5yZWR1Y2UoKGFjYywgYXR0cikgPT4ge1xuICAgICAgICAgIGFjY1thdHRyXSA9IHRoaXMuX3Jvb3RFbGVtZW50LmdldEF0dHJpYnV0ZShhdHRyKTtcbiAgICAgICAgICByZXR1cm4gYWNjO1xuICAgICAgICB9LCB7fSk7XG4gICAgICAgIHRoaXMuX29ic2VydmVyID0gbmV3IE11dGF0aW9uT2JzZXJ2ZXIodGhpcy5faGFuZGxlTXV0YXRpb25zLmJpbmQodGhpcykpO1xuICAgICAgICB0aGlzLl9vYnNlcnZlci5vYnNlcnZlKHRoaXMuX3Jvb3RFbGVtZW50LCB7XG4gICAgICAgICAgYXR0cmlidXRlczogdHJ1ZVxuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgX2hhbmRsZU11dGF0aW9ucyhtdXRhdGlvbnMpIHtcbiAgICAgICAgbXV0YXRpb25zLmZvckVhY2goKG11dGF0aW9uKSA9PiB7XG4gICAgICAgICAgY29uc3QgbXV0YXRpb25BdHRyaWJ1dGVOYW1lID0gbXV0YXRpb24uYXR0cmlidXRlTmFtZTtcbiAgICAgICAgICBpZiAodGhpcy5fbG9jYWxlQXR0cnMuaW5jbHVkZXMobXV0YXRpb25BdHRyaWJ1dGVOYW1lKSkge1xuICAgICAgICAgICAgdGhpcy5fbG9jYWxlID0ge1xuICAgICAgICAgICAgICAuLi50aGlzLl9sb2NhbGUsXG4gICAgICAgICAgICAgIFttdXRhdGlvbkF0dHJpYnV0ZU5hbWVdOiB0aGlzLl9yb290RWxlbWVudC5nZXRBdHRyaWJ1dGUobXV0YXRpb25BdHRyaWJ1dGVOYW1lKVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHRoaXMuX2NhbGxiYWNrcy5mb3JFYWNoKGNhbGxiYWNrID0+IGNhbGxiYWNrKHRoaXMuX2xvY2FsZSkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIHNldCBsb2NhbGUobG9jYWxlT2JqKSB7XG4gICAgICAgIE9iamVjdC5rZXlzKGxvY2FsZU9iaikuZm9yRWFjaCgoa2V5KSA9PiB7XG4gICAgICAgICAgdGhpcy5fcm9vdEVsZW1lbnQuc2V0QXR0cmlidXRlKGtleSwgbG9jYWxlT2JqW2tleV0pO1xuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgZ2V0IGxvY2FsZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2xvY2FsZTtcbiAgICAgIH1cblxuICAgICAgb25Mb2NhbGVDaGFuZ2UoY2FsbGJhY2spIHtcbiAgICAgICAgdGhpcy5fY2FsbGJhY2tzLnB1c2goY2FsbGJhY2spO1xuICAgICAgICBjYWxsYmFjayh0aGlzLmxvY2FsZSk7XG4gICAgICAgIHJldHVybiAoKSA9PiB7XG4gICAgICAgICAgdGhpcy5fY2FsbGJhY2tzID0gdGhpcy5fY2FsbGJhY2tzLmZpbHRlcihjYiA9PiBjYiAhPT0gY2FsbGJhY2spO1xuICAgICAgICB9O1xuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IGxvY2FsZVNlcnZpY2UgPSBuZXcgTG9jYWxlU2VydmljZSgpO1xuICAgIHJldHVybiBsb2NhbGVTZXJ2aWNlO1xuICB9KTtcbn1cbiIsIi8qIGVzbGludCBwcmVmZXItY29uc3Q6IDAgKi9cblxuLyoqXG4gKlxuICogQHBhcmFtIG9wdGlvbnMgT2JqZWN0XG4gKiBAcmV0dXJucyBmdW5jdGlvbihTdHJpbmcpOiBTdHJpbmdcbiAqL1xuY29uc3QgZm9yY2VGbG9hdCA9ICh7IGRlY1BvaW50ID0gJy4nIH0gPSB7fSkgPT4gKHZhbHVlKSA9PiB7XG4gIGNvbnN0IEdMT0JBTF9ERUNfUE9JTlQgPSBuZXcgUmVnRXhwKGBcXFxcJHtkZWNQb2ludH1gLCAnZycpO1xuICBjb25zdCBHTE9CQUxfTk9OX05VTUJFUl9PUl9ERUNfUE9JTlQgPSBuZXcgUmVnRXhwKGBbXlxcXFxkJHtkZWNQb2ludH1dYCwgJ2cnKTtcbiAgY29uc3QgTlVNQkVSX0RFQ19QT0lOVF9PUl9TSE9SVENVVCA9IG5ldyBSZWdFeHAoYFtcXFxcZCR7ZGVjUG9pbnR9S2tNbV1gLCAnJyk7XG4gIGNvbnN0IE5VTUJFUl9PUl9TSUdOID0gbmV3IFJlZ0V4cCgnW1xcXFxkKy1dJywgJycpO1xuICBjb25zdCBTSUdOID0gbmV3IFJlZ0V4cCgnWystXScsICcnKTtcbiAgY29uc3QgU0hPUlRDVVQgPSBuZXcgUmVnRXhwKCdbS2tNbV0nLCAnJyk7XG4gIGNvbnN0IFNIT1JUQ1VUX1RIT1VTQU5EUyA9IG5ldyBSZWdFeHAoJ1tLa10nLCAnJyk7XG5cbiAgbGV0IHZhbHVlVG9Vc2UgPSB2YWx1ZTtcbiAgY29uc3QgaW5kZXhPZlBvaW50ID0gdmFsdWVUb1VzZS5pbmRleE9mKGRlY1BvaW50KTtcbiAgY29uc3QgbGFzdEluZGV4T2ZQb2ludCA9IHZhbHVlVG9Vc2UubGFzdEluZGV4T2YoZGVjUG9pbnQpO1xuICBjb25zdCBoYXNNb3JlVGhhbk9uZVBvaW50ID0gaW5kZXhPZlBvaW50ICE9PSBsYXN0SW5kZXhPZlBvaW50O1xuXG4gIGlmIChoYXNNb3JlVGhhbk9uZVBvaW50KSB7XG4gICAgdmFsdWVUb1VzZSA9IGAke3ZhbHVlVG9Vc2UucmVwbGFjZShHTE9CQUxfREVDX1BPSU5ULCAnJyl9JHtkZWNQb2ludH1gO1xuICB9XG5cbiAgbGV0IGZpcnN0Q2hhciA9IHZhbHVlVG9Vc2VbMF0gfHwgJyc7XG4gIGxldCBsYXN0Q2hhciA9ICh2YWx1ZVRvVXNlLmxlbmd0aCA+IDEgPyB2YWx1ZVRvVXNlW3ZhbHVlVG9Vc2UubGVuZ3RoIC0gMV0gOiAnJykgfHwgJyc7XG4gIGxldCBtaWRkbGVDaGFycyA9IHZhbHVlVG9Vc2Uuc3Vic3RyKDEsIHZhbHVlVG9Vc2UubGVuZ3RoIC0gMikgfHwgJyc7XG5cbiAgaWYgKCFmaXJzdENoYXIubWF0Y2goTlVNQkVSX09SX1NJR04pKSB7XG4gICAgZmlyc3RDaGFyID0gJyc7XG4gIH1cblxuICBtaWRkbGVDaGFycyA9IG1pZGRsZUNoYXJzLnJlcGxhY2UoR0xPQkFMX05PTl9OVU1CRVJfT1JfREVDX1BPSU5ULCAnJyk7XG5cbiAgaWYgKCFsYXN0Q2hhci5tYXRjaChOVU1CRVJfREVDX1BPSU5UX09SX1NIT1JUQ1VUKSkge1xuICAgIGxhc3RDaGFyID0gJyc7XG4gIH0gZWxzZSBpZiAobGFzdENoYXIubWF0Y2goU0hPUlRDVVQpKSB7XG4gICAgaWYgKG1pZGRsZUNoYXJzID09PSBkZWNQb2ludCkge1xuICAgICAgbWlkZGxlQ2hhcnMgPSAnJztcbiAgICB9IGVsc2UgaWYgKG1pZGRsZUNoYXJzID09PSAnJyAmJiBmaXJzdENoYXIubWF0Y2goU0lHTikpIHtcbiAgICAgIGxhc3RDaGFyID0gJyc7XG4gICAgfVxuICB9IGVsc2UgaWYgKGxhc3RDaGFyID09PSBkZWNQb2ludCAmJiBtaWRkbGVDaGFycyA9PT0gJycgJiYgZmlyc3RDaGFyLm1hdGNoKFNJR04pKSB7XG4gICAgbGFzdENoYXIgPSAnJztcbiAgfVxuXG4gIHZhbHVlVG9Vc2UgPSBbZmlyc3RDaGFyLCBtaWRkbGVDaGFycywgbGFzdENoYXJdLmpvaW4oJycpO1xuXG4gIGlmIChsYXN0Q2hhci5tYXRjaChTSE9SVENVVCkpIHtcbiAgICB2YWx1ZVRvVXNlID0gKFxuICAgICAgTnVtYmVyKGAke2ZpcnN0Q2hhcn0ke21pZGRsZUNoYXJzfWAucmVwbGFjZShkZWNQb2ludCwgJy4nKSkgKlxuICAgICAgKGxhc3RDaGFyLm1hdGNoKFNIT1JUQ1VUX1RIT1VTQU5EUykgPyAxMDAwIDogMTAwMDAwMClcbiAgICApLnRvU3RyaW5nKCkucmVwbGFjZSgnLicsIGRlY1BvaW50KTtcbiAgfVxuXG4gIHJldHVybiB2YWx1ZVRvVXNlO1xufTtcblxuLyoqXG4gKlxuICogQHBhcmFtIG9wdGlvbnMgT2JqZWN0XG4gKiBAcmV0dXJucyBmdW5jdGlvbihTdHJpbmcpOiBTdHJpbmdcbiAqL1xuY29uc3QgbnVtYmVyRm9ybWF0dGVyID0gKHsgZGVjUG9pbnQgPSAnLicsIHRob3VzYW5kc1NlcGFyYXRvciA9ICcsJyB9ID0ge30pID0+IHZhbHVlID0+IHtcbiAgdmFsdWUgPSB2YWx1ZS5yZXBsYWNlKCcuJywgZGVjUG9pbnQpO1xuICBsZXQgZmlyc3RDaGFyID0gdmFsdWVbMF0gfHwgJyc7XG4gIGZpcnN0Q2hhciA9IFsnKycsICctJ10uaW5jbHVkZXMoZmlyc3RDaGFyKSA/IGZpcnN0Q2hhciA6ICcnO1xuICBjb25zdCBpc0Zsb2F0aW5nUG9pbnQgPSB2YWx1ZS5pbmRleE9mKGRlY1BvaW50KSAhPT0gLTE7XG4gIGxldCBbaW50ZWdlclBhcnQgPSAnJywgZGVjaW1hbHMgPSAnJ10gPSB2YWx1ZS5zcGxpdChkZWNQb2ludCk7XG4gIGludGVnZXJQYXJ0ID0gaW50ZWdlclBhcnQucmVwbGFjZSgvWystXS9nLCAnJyk7XG4gIGludGVnZXJQYXJ0ID0gaW50ZWdlclBhcnQucmVwbGFjZSgvXFxCKD89KFxcZHszfSkrKD8hXFxkKSkvZywgdGhvdXNhbmRzU2VwYXJhdG9yKTtcbiAgY29uc3QgcmV0ID0gYCR7Zmlyc3RDaGFyfSR7aW50ZWdlclBhcnR9JHtpc0Zsb2F0aW5nUG9pbnQgPyBkZWNQb2ludCA6ICcnfSR7ZGVjaW1hbHN9YDtcbiAgcmV0dXJuIHJldDtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgZm9yY2VGbG9hdCxcbiAgbnVtYmVyRm9ybWF0dGVyXG59O1xuXG4iLCJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHRlbXBsYXRlKHN0cmluZ3MsIC4uLmtleXMpIHtcbiAgcmV0dXJuICgoLi4udmFsdWVzKSA9PiB7XG4gICAgY29uc3QgZGljdCA9IHZhbHVlc1t2YWx1ZXMubGVuZ3RoIC0gMV0gfHwge307XG4gICAgY29uc3QgcmVzdWx0ID0gW3N0cmluZ3NbMF1dO1xuICAgIGtleXMuZm9yRWFjaCgoa2V5LCBpKSA9PiB7XG4gICAgICBjb25zdCB2YWx1ZSA9IE51bWJlci5pc0ludGVnZXIoa2V5KSA/IHZhbHVlc1trZXldIDogZGljdFtrZXldO1xuICAgICAgcmVzdWx0LnB1c2godmFsdWUsIHN0cmluZ3NbaSArIDFdKTtcbiAgICB9KTtcbiAgICByZXR1cm4gcmVzdWx0LmpvaW4oJycpO1xuICB9KTtcbn1cbiIsIlxuLy8gQmVoYXZpb3Vyc1xuaW1wb3J0IGxvY2FsZUF3YXJlIGZyb20gJy4vYmVoYXZpb3Vycy9sb2NhbGVBd2FyZSc7XG5cbi8vIENvbXBvbmVudHNcbmltcG9ydCBIZWxsbyBmcm9tICcuL2NvbXBvbmVudHMvSGVsbG8vSGVsbG8nO1xuaW1wb3J0IExpc3QgZnJvbSAnLi9jb21wb25lbnRzL0xpc3QvTGlzdCc7XG5pbXBvcnQgRm9ybUlucHV0IGZyb20gJy4vY29tcG9uZW50cy9Gb3JtSW5wdXQvRm9ybUlucHV0JztcbmltcG9ydCBGb3JtSW5wdXROdW1iZXIgZnJvbSAnLi9jb21wb25lbnRzL0Zvcm1JbnB1dE51bWJlci9Gb3JtSW5wdXROdW1iZXInO1xuaW1wb3J0IERyYWdnYWJsZSBmcm9tICcuL2NvbXBvbmVudHMvRHJhZ2dhYmxlL0RyYWdnYWJsZSc7XG5pbXBvcnQgRGlzYWJsZVNlbGVjdGlvbiBmcm9tICcuL2NvbXBvbmVudHMvRGlzYWJsZVNlbGVjdGlvbi9EaXNhYmxlU2VsZWN0aW9uJztcblxuXG5leHBvcnQge1xuICAvLyBCZWhhdmlvdXJzXG4gIGxvY2FsZUF3YXJlLFxuXG4gIC8vIENvbXBvbmVudHNcbiAgSGVsbG8sXG4gIExpc3QsXG4gIEZvcm1JbnB1dCxcbiAgRm9ybUlucHV0TnVtYmVyLFxuICBEcmFnZ2FibGUsXG4gIERpc2FibGVTZWxlY3Rpb25cbn07XG4iXX0=
