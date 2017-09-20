(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*!
  Copyright (c) 2016 Jed Watson.
  Licensed under the MIT License (MIT), see
  http://jedwatson.github.io/classnames
*/
/* global define */

(function () {
	'use strict';

	var hasOwn = {}.hasOwnProperty;

	function classNames () {
		var classes = [];

		for (var i = 0; i < arguments.length; i++) {
			var arg = arguments[i];
			if (!arg) continue;

			var argType = typeof arg;

			if (argType === 'string' || argType === 'number') {
				classes.push(arg);
			} else if (Array.isArray(arg)) {
				classes.push(classNames.apply(null, arg));
			} else if (argType === 'object') {
				for (var key in arg) {
					if (hasOwn.call(arg, key) && arg[key]) {
						classes.push(key);
					}
				}
			}
		}

		return classes.join(' ');
	}

	if (typeof module !== 'undefined' && module.exports) {
		module.exports = classNames;
	} else if (typeof define === 'function' && typeof define.amd === 'object' && define.amd) {
		// register as 'classnames', consistent with npm package name
		define('classnames', [], function () {
			return classNames;
		});
	} else {
		window.classNames = classNames;
	}
}());

},{}],2:[function(require,module,exports){
/**
 * Copyright 2015, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */
'use strict';

var REACT_STATICS = {
    childContextTypes: true,
    contextTypes: true,
    defaultProps: true,
    displayName: true,
    getDefaultProps: true,
    mixins: true,
    propTypes: true,
    type: true
};

var KNOWN_STATICS = {
  name: true,
  length: true,
  prototype: true,
  caller: true,
  callee: true,
  arguments: true,
  arity: true
};

var getOwnPropertySymbols = Object.getOwnPropertySymbols;
var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;
var getPrototypeOf = Object.getPrototypeOf;
var objectPrototype = getPrototypeOf && getPrototypeOf(Object);
var getOwnPropertyNames = Object.getOwnPropertyNames;

module.exports = function hoistNonReactStatics(targetComponent, sourceComponent, blacklist) {
    if (typeof sourceComponent !== 'string') { // don't hoist over string (html) components

        if (objectPrototype) {
            var inheritedComponent = getPrototypeOf(sourceComponent);
            if (inheritedComponent && inheritedComponent !== objectPrototype) {
                hoistNonReactStatics(targetComponent, inheritedComponent, blacklist);
            }
        }

        var keys = getOwnPropertyNames(sourceComponent);

        if (getOwnPropertySymbols) {
            keys = keys.concat(getOwnPropertySymbols(sourceComponent));
        }

        for (var i = 0; i < keys.length; ++i) {
            var key = keys[i];
            if (!REACT_STATICS[key] && !KNOWN_STATICS[key] && (!blacklist || !blacklist[key])) {
                // Only hoist enumerables and non-enumerable functions
                if(propIsEnumerable.call(sourceComponent, key) || typeof sourceComponent[key] === 'function') {
                    try { // Avoid failures from read-only properties
                        targetComponent[key] = sourceComponent[key];
                    } catch (e) {}
                }
            }
        }

        return targetComponent;
    }

    return targetComponent;
};

},{}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = themeAware;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactJss = require('react-jss');

var _reactJss2 = _interopRequireDefault(_reactJss);

var _hoistNonReactStatics = require('hoist-non-react-statics');

var _hoistNonReactStatics2 = _interopRequireDefault(_hoistNonReactStatics);

var _theming = require('../theming/theming');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const { ThemeProvider } = _theming.theming;

function themeAware({ theme, style }) {
  return function themeAwareInner(Component) {
    const ToRender = style ? (0, _reactJss2.default)(style, { theming: _theming.theming })(Component) : Component;

    class ThemeAware extends _react2.default.Component {
      render() {
        return theme ? _react2.default.createElement(
          ThemeProvider,
          { theme: theme },
          _react2.default.createElement(ToRender, this.props)
        ) : _react2.default.createElement(ToRender, this.props);
      }
    }

    ThemeAware.displayName = `ThemeAware(${Component.displayName || Component.name || 'Component'})`;

    return (0, _hoistNonReactStatics2.default)(ThemeAware, Component);
  };
}

},{"../theming/theming":4,"hoist-non-react-statics":2,"react":"react","react-jss":"react-jss"}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.theming = exports.createTheming = undefined;

var _reactJss = require('react-jss');

const theming = (0, _reactJss.createTheming)('__DBU_THEMING__');

exports.createTheming = _reactJss.createTheming;
exports.theming = theming;

},{"react-jss":"react-jss"}],5:[function(require,module,exports){
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

var _themeAware = require('../src/lib/HOC/themeAware');

var _themeAware2 = _interopRequireDefault(_themeAware);

var _screens = require('./screens');

var _screens2 = _interopRequireDefault(_screens);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const style = ({ vars }) => {
  return {
    sectionLinks: {
      float: 'left'
    },
    sectionScreen: {
      float: 'left'
    }
  };
};

class App extends _react2.default.Component {
  componentDidMount() {
    window.addEventListener('hashchange', this.onHashChange.bind(this));
  }

  onHashChange() {
    this.forceUpdate();
  }

  render() {
    const screensKeys = Object.keys(_screens2.default);
    const links = screensKeys.map((screen, idx) => _react2.default.createElement(
      'a',
      { key: idx, href: `#${screen}` },
      screen
    ));
    const Screen = _screens2.default[(window.location.hash || `#${screensKeys[0]}`).replace('#', '')];
    const {
      classes: {
        sectionLinks, sectionScreen
      },
      theme: {
        common: {
          row, col, m3, m9, l6, xl3, xl9, xs3, xs9, s6
        }
      } } = this.props;

    if (!Screen) {
      return null;
    }

    return _react2.default.createElement(
      'div',
      { className: (0, _classnames2.default)({
          [row]: true
        }) },
      _react2.default.createElement(
        'div',
        { className: (0, _classnames2.default)({
            [col]: true,
            [m3]: true,
            [l6]: true,
            [xl9]: true,
            [xs9]: true,
            [s6]: true
          }) },
        links
      ),
      _react2.default.createElement(
        'div',
        { className: (0, _classnames2.default)({
            [col]: true,
            [m9]: true,
            [l6]: true,
            [xl3]: true,
            [xs3]: true,
            [s6]: true
          }) },
        _react2.default.createElement(Screen, null)
      )
    );
  }
}

App.propTypes = {
  classes: _propTypes2.default.object,
  theme: _propTypes2.default.object
};

exports.default = (0, _themeAware2.default)({ style })(App);

},{"../src/lib/HOC/themeAware":3,"./screens":9,"classnames":1,"prop-types":"prop-types","react":"react"}],6:[function(require,module,exports){
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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// onScreenConsole({ buttonStyle: { }, consoleStyle: { }, options: { rtl: false } });
// for (let i = 0; i < 100; i += 1) {
//   console.log('foo', 'bar', 5, null, undefined, new Map([[2, 7]]), new Set([4, 5]), [8,9,10],  function(){console.log('bla')}, { a: { b: { c: [1, function(){console.log('inline')}] } } });
// }
// console.warn('warning');
// console.error('error');

const { ThemeProvider } = _devBoxUi.theming;

// const customTheme = {
//   ...defaultTheme,
//   ltr: {
//     ...defaultTheme.ltr,
//     vars: {
//       ...defaultTheme.ltr.vars,
//       colors: {
//         primaryTextColor: 'brown',
//         secondaryTextColor: 'green',
//       }
//     }
//   },
//   rtl: {
//     ...defaultTheme.rtl,
//     vars: {
//       ...defaultTheme.ltr.vars,
//       colors: {
//         primaryTextColor: 'brown',
//         secondaryTextColor: 'green',
//       }
//     }
//   }
// };

let Demo = class Demo extends _react2.default.Component {
  render() {
    const { locale: { dir } } = this.props;
    return _react2.default.createElement(
      ThemeProvider,
      { theme: _devBoxUi.defaultTheme[dir] },
      _react2.default.createElement(_app2.default, null)
    );
  }
};

Demo.propTypes = {
  locale: _propTypes2.default.object
};

Demo = (0, _devBoxUi.localeAware)(Demo);

_reactDom2.default.render(_react2.default.createElement(Demo, null), document.getElementById('demo'));

},{"./app":5,"dev-box-ui":"dev-box-ui","prop-types":"prop-types","react":"react","react-dom":"react-dom"}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _devBoxUi = require('dev-box-ui');

var _themeAware = require('../../src/lib/HOC/themeAware');

var _themeAware2 = _interopRequireDefault(_themeAware);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const style = ({ vars }) => {
  return {
    screen: {
      color: vars.colors.primaryTextColor || 'orange'
    }
  };
};

class HelloScreen extends _react2.default.Component {
  render() {
    return _react2.default.createElement(
      'div',
      null,
      _react2.default.createElement(_devBoxUi.Hello, null),
      _react2.default.createElement(_devBoxUi.Hello, null),
      _react2.default.createElement(_devBoxUi.Hello, null)
    );
  }
}

exports.default = (0, _themeAware2.default)({ style })(HelloScreen);

},{"../../src/lib/HOC/themeAware":3,"dev-box-ui":"dev-box-ui","react":"react"}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _devBoxUi = require('dev-box-ui');

var _themeAware = require('../../src/lib/HOC/themeAware');

var _themeAware2 = _interopRequireDefault(_themeAware);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const style = ({ vars }) => {
  return {
    screen: {
      color: vars.colors.primaryTextColor || 'orange'
    }
  };
};

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

exports.default = (0, _themeAware2.default)({ style })(ListScreen);

},{"../../src/lib/HOC/themeAware":3,"dev-box-ui":"dev-box-ui","react":"react"}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _HelloScreen = require('./HelloScreen');

var _HelloScreen2 = _interopRequireDefault(_HelloScreen);

var _ListScreen = require('./ListScreen');

var _ListScreen2 = _interopRequireDefault(_ListScreen);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  HelloScreen: _HelloScreen2.default,
  ListScreen: _ListScreen2.default
};

},{"./HelloScreen":7,"./ListScreen":8}]},{},[6])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvY2xhc3NuYW1lcy9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9ob2lzdC1ub24tcmVhY3Qtc3RhdGljcy9pbmRleC5qcyIsInNyYy9saWIvSE9DL3RoZW1lQXdhcmUuanMiLCJzcmMvbGliL3RoZW1pbmcvdGhlbWluZy5qcyIsInNyY0RlbW8vYXBwLmpzIiwic3JjRGVtby9kZW1vLmpzIiwic3JjRGVtby9zY3JlZW5zL0hlbGxvU2NyZWVuLmpzIiwic3JjRGVtby9zY3JlZW5zL0xpc3RTY3JlZW4uanMiLCJzcmNEZW1vL3NjcmVlbnMvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFD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biBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLyohXG4gIENvcHlyaWdodCAoYykgMjAxNiBKZWQgV2F0c29uLlxuICBMaWNlbnNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2UgKE1JVCksIHNlZVxuICBodHRwOi8vamVkd2F0c29uLmdpdGh1Yi5pby9jbGFzc25hbWVzXG4qL1xuLyogZ2xvYmFsIGRlZmluZSAqL1xuXG4oZnVuY3Rpb24gKCkge1xuXHQndXNlIHN0cmljdCc7XG5cblx0dmFyIGhhc093biA9IHt9Lmhhc093blByb3BlcnR5O1xuXG5cdGZ1bmN0aW9uIGNsYXNzTmFtZXMgKCkge1xuXHRcdHZhciBjbGFzc2VzID0gW107XG5cblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuXHRcdFx0dmFyIGFyZyA9IGFyZ3VtZW50c1tpXTtcblx0XHRcdGlmICghYXJnKSBjb250aW51ZTtcblxuXHRcdFx0dmFyIGFyZ1R5cGUgPSB0eXBlb2YgYXJnO1xuXG5cdFx0XHRpZiAoYXJnVHlwZSA9PT0gJ3N0cmluZycgfHwgYXJnVHlwZSA9PT0gJ251bWJlcicpIHtcblx0XHRcdFx0Y2xhc3Nlcy5wdXNoKGFyZyk7XG5cdFx0XHR9IGVsc2UgaWYgKEFycmF5LmlzQXJyYXkoYXJnKSkge1xuXHRcdFx0XHRjbGFzc2VzLnB1c2goY2xhc3NOYW1lcy5hcHBseShudWxsLCBhcmcpKTtcblx0XHRcdH0gZWxzZSBpZiAoYXJnVHlwZSA9PT0gJ29iamVjdCcpIHtcblx0XHRcdFx0Zm9yICh2YXIga2V5IGluIGFyZykge1xuXHRcdFx0XHRcdGlmIChoYXNPd24uY2FsbChhcmcsIGtleSkgJiYgYXJnW2tleV0pIHtcblx0XHRcdFx0XHRcdGNsYXNzZXMucHVzaChrZXkpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJldHVybiBjbGFzc2VzLmpvaW4oJyAnKTtcblx0fVxuXG5cdGlmICh0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyAmJiBtb2R1bGUuZXhwb3J0cykge1xuXHRcdG1vZHVsZS5leHBvcnRzID0gY2xhc3NOYW1lcztcblx0fSBlbHNlIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIHR5cGVvZiBkZWZpbmUuYW1kID09PSAnb2JqZWN0JyAmJiBkZWZpbmUuYW1kKSB7XG5cdFx0Ly8gcmVnaXN0ZXIgYXMgJ2NsYXNzbmFtZXMnLCBjb25zaXN0ZW50IHdpdGggbnBtIHBhY2thZ2UgbmFtZVxuXHRcdGRlZmluZSgnY2xhc3NuYW1lcycsIFtdLCBmdW5jdGlvbiAoKSB7XG5cdFx0XHRyZXR1cm4gY2xhc3NOYW1lcztcblx0XHR9KTtcblx0fSBlbHNlIHtcblx0XHR3aW5kb3cuY2xhc3NOYW1lcyA9IGNsYXNzTmFtZXM7XG5cdH1cbn0oKSk7XG4iLCIvKipcbiAqIENvcHlyaWdodCAyMDE1LCBZYWhvbyEgSW5jLlxuICogQ29weXJpZ2h0cyBsaWNlbnNlZCB1bmRlciB0aGUgTmV3IEJTRCBMaWNlbnNlLiBTZWUgdGhlIGFjY29tcGFueWluZyBMSUNFTlNFIGZpbGUgZm9yIHRlcm1zLlxuICovXG4ndXNlIHN0cmljdCc7XG5cbnZhciBSRUFDVF9TVEFUSUNTID0ge1xuICAgIGNoaWxkQ29udGV4dFR5cGVzOiB0cnVlLFxuICAgIGNvbnRleHRUeXBlczogdHJ1ZSxcbiAgICBkZWZhdWx0UHJvcHM6IHRydWUsXG4gICAgZGlzcGxheU5hbWU6IHRydWUsXG4gICAgZ2V0RGVmYXVsdFByb3BzOiB0cnVlLFxuICAgIG1peGluczogdHJ1ZSxcbiAgICBwcm9wVHlwZXM6IHRydWUsXG4gICAgdHlwZTogdHJ1ZVxufTtcblxudmFyIEtOT1dOX1NUQVRJQ1MgPSB7XG4gIG5hbWU6IHRydWUsXG4gIGxlbmd0aDogdHJ1ZSxcbiAgcHJvdG90eXBlOiB0cnVlLFxuICBjYWxsZXI6IHRydWUsXG4gIGNhbGxlZTogdHJ1ZSxcbiAgYXJndW1lbnRzOiB0cnVlLFxuICBhcml0eTogdHJ1ZVxufTtcblxudmFyIGdldE93blByb3BlcnR5U3ltYm9scyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHM7XG52YXIgaGFzT3duUHJvcGVydHkgPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xudmFyIHByb3BJc0VudW1lcmFibGUgPSBPYmplY3QucHJvdG90eXBlLnByb3BlcnR5SXNFbnVtZXJhYmxlO1xudmFyIGdldFByb3RvdHlwZU9mID0gT2JqZWN0LmdldFByb3RvdHlwZU9mO1xudmFyIG9iamVjdFByb3RvdHlwZSA9IGdldFByb3RvdHlwZU9mICYmIGdldFByb3RvdHlwZU9mKE9iamVjdCk7XG52YXIgZ2V0T3duUHJvcGVydHlOYW1lcyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGhvaXN0Tm9uUmVhY3RTdGF0aWNzKHRhcmdldENvbXBvbmVudCwgc291cmNlQ29tcG9uZW50LCBibGFja2xpc3QpIHtcbiAgICBpZiAodHlwZW9mIHNvdXJjZUNvbXBvbmVudCAhPT0gJ3N0cmluZycpIHsgLy8gZG9uJ3QgaG9pc3Qgb3ZlciBzdHJpbmcgKGh0bWwpIGNvbXBvbmVudHNcblxuICAgICAgICBpZiAob2JqZWN0UHJvdG90eXBlKSB7XG4gICAgICAgICAgICB2YXIgaW5oZXJpdGVkQ29tcG9uZW50ID0gZ2V0UHJvdG90eXBlT2Yoc291cmNlQ29tcG9uZW50KTtcbiAgICAgICAgICAgIGlmIChpbmhlcml0ZWRDb21wb25lbnQgJiYgaW5oZXJpdGVkQ29tcG9uZW50ICE9PSBvYmplY3RQcm90b3R5cGUpIHtcbiAgICAgICAgICAgICAgICBob2lzdE5vblJlYWN0U3RhdGljcyh0YXJnZXRDb21wb25lbnQsIGluaGVyaXRlZENvbXBvbmVudCwgYmxhY2tsaXN0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBrZXlzID0gZ2V0T3duUHJvcGVydHlOYW1lcyhzb3VyY2VDb21wb25lbnQpO1xuXG4gICAgICAgIGlmIChnZXRPd25Qcm9wZXJ0eVN5bWJvbHMpIHtcbiAgICAgICAgICAgIGtleXMgPSBrZXlzLmNvbmNhdChnZXRPd25Qcm9wZXJ0eVN5bWJvbHMoc291cmNlQ29tcG9uZW50KSk7XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGtleXMubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICAgIHZhciBrZXkgPSBrZXlzW2ldO1xuICAgICAgICAgICAgaWYgKCFSRUFDVF9TVEFUSUNTW2tleV0gJiYgIUtOT1dOX1NUQVRJQ1Nba2V5XSAmJiAoIWJsYWNrbGlzdCB8fCAhYmxhY2tsaXN0W2tleV0pKSB7XG4gICAgICAgICAgICAgICAgLy8gT25seSBob2lzdCBlbnVtZXJhYmxlcyBhbmQgbm9uLWVudW1lcmFibGUgZnVuY3Rpb25zXG4gICAgICAgICAgICAgICAgaWYocHJvcElzRW51bWVyYWJsZS5jYWxsKHNvdXJjZUNvbXBvbmVudCwga2V5KSB8fCB0eXBlb2Ygc291cmNlQ29tcG9uZW50W2tleV0gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgICAgICAgdHJ5IHsgLy8gQXZvaWQgZmFpbHVyZXMgZnJvbSByZWFkLW9ubHkgcHJvcGVydGllc1xuICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0Q29tcG9uZW50W2tleV0gPSBzb3VyY2VDb21wb25lbnRba2V5XTtcbiAgICAgICAgICAgICAgICAgICAgfSBjYXRjaCAoZSkge31cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGFyZ2V0Q29tcG9uZW50O1xuICAgIH1cblxuICAgIHJldHVybiB0YXJnZXRDb21wb25lbnQ7XG59O1xuIiwiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBpbmplY3RTaGVldCBmcm9tICdyZWFjdC1qc3MnO1xuaW1wb3J0IGhvaXN0Tm9uUmVhY3RTdGF0aWNzIGZyb20gJ2hvaXN0LW5vbi1yZWFjdC1zdGF0aWNzJztcbmltcG9ydCB7IHRoZW1pbmcgfSBmcm9tICcuLi90aGVtaW5nL3RoZW1pbmcnO1xuXG5cbmNvbnN0IHsgVGhlbWVQcm92aWRlciB9ID0gdGhlbWluZztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gdGhlbWVBd2FyZSh7IHRoZW1lLCBzdHlsZSB9KSB7XG4gIHJldHVybiBmdW5jdGlvbiB0aGVtZUF3YXJlSW5uZXIoQ29tcG9uZW50KSB7XG4gICAgY29uc3QgVG9SZW5kZXIgPSBzdHlsZSA/IGluamVjdFNoZWV0KHN0eWxlLCB7IHRoZW1pbmcgfSkoQ29tcG9uZW50KSA6IENvbXBvbmVudDtcblxuICAgIGNsYXNzIFRoZW1lQXdhcmUgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICAgICAgcmVuZGVyKCkge1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgIHRoZW1lID9cbiAgICAgICAgICAgIDxUaGVtZVByb3ZpZGVyIHRoZW1lPXsgdGhlbWUgfT5cbiAgICAgICAgICAgICAgPFRvUmVuZGVyIHsgLi4udGhpcy5wcm9wcyB9IC8+XG4gICAgICAgICAgICA8L1RoZW1lUHJvdmlkZXI+IDpcbiAgICAgICAgICAgIDxUb1JlbmRlciB7IC4uLnRoaXMucHJvcHMgfSAvPlxuICAgICAgICApO1xuICAgICAgfVxuICAgIH1cblxuICAgIFRoZW1lQXdhcmUuZGlzcGxheU5hbWUgPSBgVGhlbWVBd2FyZSgke1xuICAgICAgQ29tcG9uZW50LmRpc3BsYXlOYW1lIHx8XG4gICAgICBDb21wb25lbnQubmFtZSB8fFxuICAgICAgJ0NvbXBvbmVudCdcbiAgICB9KWA7XG5cbiAgICByZXR1cm4gaG9pc3ROb25SZWFjdFN0YXRpY3MoVGhlbWVBd2FyZSwgQ29tcG9uZW50KTtcbiAgfTtcbn1cbiIsImltcG9ydCB7IGNyZWF0ZVRoZW1pbmcgfSBmcm9tICdyZWFjdC1qc3MnO1xuXG5jb25zdCB0aGVtaW5nID0gY3JlYXRlVGhlbWluZygnX19EQlVfVEhFTUlOR19fJyk7XG5cbmV4cG9ydCB7XG4gIGNyZWF0ZVRoZW1pbmcsXG4gIHRoZW1pbmdcbn07XG4iLCJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCBjbiBmcm9tICdjbGFzc25hbWVzJztcbmltcG9ydCB0aGVtZUF3YXJlIGZyb20gJy4uL3NyYy9saWIvSE9DL3RoZW1lQXdhcmUnO1xuaW1wb3J0IHNjcmVlbnMgZnJvbSAnLi9zY3JlZW5zJztcblxuY29uc3Qgc3R5bGUgPSAoeyB2YXJzIH0pID0+IHtcbiAgcmV0dXJuIHtcbiAgICBzZWN0aW9uTGlua3M6IHtcbiAgICAgIGZsb2F0OiAnbGVmdCdcbiAgICB9LFxuICAgIHNlY3Rpb25TY3JlZW46IHtcbiAgICAgIGZsb2F0OiAnbGVmdCdcbiAgICB9XG4gIH07XG59O1xuXG5jbGFzcyBBcHAgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignaGFzaGNoYW5nZScsIHRoaXMub25IYXNoQ2hhbmdlLmJpbmQodGhpcykpO1xuICB9XG5cbiAgb25IYXNoQ2hhbmdlKCkge1xuICAgIHRoaXMuZm9yY2VVcGRhdGUoKTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCBzY3JlZW5zS2V5cyA9IE9iamVjdC5rZXlzKHNjcmVlbnMpO1xuICAgIGNvbnN0IGxpbmtzID0gc2NyZWVuc0tleXNcbiAgICAgIC5tYXAoKHNjcmVlbiwgaWR4KSA9PiA8YSBrZXk9e2lkeH0gaHJlZj17YCMke3NjcmVlbn1gfT57c2NyZWVufTwvYT4pO1xuICAgIGNvbnN0IFNjcmVlbiA9IHNjcmVlbnNbKHdpbmRvdy5sb2NhdGlvbi5oYXNoIHx8IGAjJHtzY3JlZW5zS2V5c1swXX1gKS5yZXBsYWNlKCcjJywgJycpXTtcbiAgICBjb25zdCB7XG4gICAgICBjbGFzc2VzOiB7XG4gICAgICAgIHNlY3Rpb25MaW5rcywgc2VjdGlvblNjcmVlblxuICAgICAgfSxcbiAgICAgIHRoZW1lOiB7XG4gICAgICAgIGNvbW1vbjoge1xuICAgICAgICAgIHJvdywgY29sLCBtMywgbTksIGw2LCB4bDMsIHhsOSwgeHMzLCB4czksIHM2XG4gICAgICAgIH1cbiAgICAgIH0gfSA9IHRoaXMucHJvcHM7XG5cblxuICAgIGlmICghU2NyZWVuKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9e2NuKHtcbiAgICAgICAgW3Jvd106IHRydWVcbiAgICAgIH0pfT5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9e2NuKHtcbiAgICAgICAgICBbY29sXTogdHJ1ZSxcbiAgICAgICAgICBbbTNdOiB0cnVlLFxuICAgICAgICAgIFtsNl06IHRydWUsXG4gICAgICAgICAgW3hsOV06IHRydWUsXG4gICAgICAgICAgW3hzOV06IHRydWUsXG4gICAgICAgICAgW3M2XTogdHJ1ZSxcbiAgICAgICAgfSl9PlxuICAgICAgICAgIHtsaW5rc31cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPXtjbih7XG4gICAgICAgICAgW2NvbF06IHRydWUsXG4gICAgICAgICAgW205XTogdHJ1ZSxcbiAgICAgICAgICBbbDZdOiB0cnVlLFxuICAgICAgICAgIFt4bDNdOiB0cnVlLFxuICAgICAgICAgIFt4czNdOiB0cnVlLFxuICAgICAgICAgIFtzNl06IHRydWUsXG4gICAgICAgIH0pfT5cbiAgICAgICAgICA8U2NyZWVuLz5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG59XG5cbkFwcC5wcm9wVHlwZXMgPSB7XG4gIGNsYXNzZXM6IFByb3BUeXBlcy5vYmplY3QsXG4gIHRoZW1lOiBQcm9wVHlwZXMub2JqZWN0XG59O1xuXG5leHBvcnQgZGVmYXVsdCB0aGVtZUF3YXJlKHsgc3R5bGUgfSkoQXBwKTtcbiIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUmVhY3RET00gZnJvbSAncmVhY3QtZG9tJztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQge1xuICBvblNjcmVlbkNvbnNvbGUsXG4gIHJlZ2lzdGVyTG9jYWxlQ2hhbmdlLFxuICBsb2NhbGVBd2FyZSxcbiAgdGhlbWluZyxcbiAgZGVmYXVsdFRoZW1lXG59IGZyb20gJ2Rldi1ib3gtdWknO1xuaW1wb3J0IEFwcCBmcm9tICcuL2FwcCc7XG5cbi8vIG9uU2NyZWVuQ29uc29sZSh7IGJ1dHRvblN0eWxlOiB7IH0sIGNvbnNvbGVTdHlsZTogeyB9LCBvcHRpb25zOiB7IHJ0bDogZmFsc2UgfSB9KTtcbi8vIGZvciAobGV0IGkgPSAwOyBpIDwgMTAwOyBpICs9IDEpIHtcbi8vICAgY29uc29sZS5sb2coJ2ZvbycsICdiYXInLCA1LCBudWxsLCB1bmRlZmluZWQsIG5ldyBNYXAoW1syLCA3XV0pLCBuZXcgU2V0KFs0LCA1XSksIFs4LDksMTBdLCAgZnVuY3Rpb24oKXtjb25zb2xlLmxvZygnYmxhJyl9LCB7IGE6IHsgYjogeyBjOiBbMSwgZnVuY3Rpb24oKXtjb25zb2xlLmxvZygnaW5saW5lJyl9XSB9IH0gfSk7XG4vLyB9XG4vLyBjb25zb2xlLndhcm4oJ3dhcm5pbmcnKTtcbi8vIGNvbnNvbGUuZXJyb3IoJ2Vycm9yJyk7XG5cbmNvbnN0IHsgVGhlbWVQcm92aWRlciB9ID0gdGhlbWluZztcblxuXG4vLyBjb25zdCBjdXN0b21UaGVtZSA9IHtcbi8vICAgLi4uZGVmYXVsdFRoZW1lLFxuLy8gICBsdHI6IHtcbi8vICAgICAuLi5kZWZhdWx0VGhlbWUubHRyLFxuLy8gICAgIHZhcnM6IHtcbi8vICAgICAgIC4uLmRlZmF1bHRUaGVtZS5sdHIudmFycyxcbi8vICAgICAgIGNvbG9yczoge1xuLy8gICAgICAgICBwcmltYXJ5VGV4dENvbG9yOiAnYnJvd24nLFxuLy8gICAgICAgICBzZWNvbmRhcnlUZXh0Q29sb3I6ICdncmVlbicsXG4vLyAgICAgICB9XG4vLyAgICAgfVxuLy8gICB9LFxuLy8gICBydGw6IHtcbi8vICAgICAuLi5kZWZhdWx0VGhlbWUucnRsLFxuLy8gICAgIHZhcnM6IHtcbi8vICAgICAgIC4uLmRlZmF1bHRUaGVtZS5sdHIudmFycyxcbi8vICAgICAgIGNvbG9yczoge1xuLy8gICAgICAgICBwcmltYXJ5VGV4dENvbG9yOiAnYnJvd24nLFxuLy8gICAgICAgICBzZWNvbmRhcnlUZXh0Q29sb3I6ICdncmVlbicsXG4vLyAgICAgICB9XG4vLyAgICAgfVxuLy8gICB9XG4vLyB9O1xuXG5sZXQgRGVtbyA9IGNsYXNzIERlbW8gZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICByZW5kZXIoKSB7XG4gICAgY29uc3QgeyBsb2NhbGU6IHsgZGlyIH0gfSA9IHRoaXMucHJvcHM7XG4gICAgcmV0dXJuIChcbiAgICAgIDxUaGVtZVByb3ZpZGVyIHRoZW1lPXtkZWZhdWx0VGhlbWVbZGlyXX0+XG4gICAgICAgIDxBcHAgLz5cbiAgICAgIDwvVGhlbWVQcm92aWRlcj5cbiAgICApO1xuICB9XG59O1xuXG5EZW1vLnByb3BUeXBlcyA9IHtcbiAgbG9jYWxlOiBQcm9wVHlwZXMub2JqZWN0XG59O1xuXG5EZW1vID0gbG9jYWxlQXdhcmUoRGVtbyk7XG5cblJlYWN0RE9NLnJlbmRlcigoXG4gIDxEZW1vLz5cbiksIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdkZW1vJykpO1xuIiwiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7XG4gIEhlbGxvXG59IGZyb20gJ2Rldi1ib3gtdWknO1xuaW1wb3J0IHRoZW1lQXdhcmUgZnJvbSAnLi4vLi4vc3JjL2xpYi9IT0MvdGhlbWVBd2FyZSc7XG5cbmNvbnN0IHN0eWxlID0gKHsgdmFycyB9KSA9PiB7XG4gIHJldHVybiB7XG4gICAgc2NyZWVuOiB7XG4gICAgICBjb2xvcjogdmFycy5jb2xvcnMucHJpbWFyeVRleHRDb2xvciB8fCAnb3JhbmdlJ1xuICAgIH1cbiAgfTtcbn07XG5cbmNsYXNzIEhlbGxvU2NyZWVuIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2PlxuICAgICAgICA8SGVsbG8vPlxuICAgICAgICA8SGVsbG8vPlxuICAgICAgICA8SGVsbG8vPlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCB0aGVtZUF3YXJlKHsgc3R5bGUgfSkoSGVsbG9TY3JlZW4pO1xuIiwiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7XG4gIExpc3Rcbn0gZnJvbSAnZGV2LWJveC11aSc7XG5pbXBvcnQgdGhlbWVBd2FyZSBmcm9tICcuLi8uLi9zcmMvbGliL0hPQy90aGVtZUF3YXJlJztcblxuY29uc3Qgc3R5bGUgPSAoeyB2YXJzIH0pID0+IHtcbiAgcmV0dXJuIHtcbiAgICBzY3JlZW46IHtcbiAgICAgIGNvbG9yOiB2YXJzLmNvbG9ycy5wcmltYXJ5VGV4dENvbG9yIHx8ICdvcmFuZ2UnXG4gICAgfVxuICB9O1xufTtcblxuY2xhc3MgTGlzdFNjcmVlbiBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdj5cbiAgICAgICAgPExpc3QgaXRlbXM9e1sndGhyZWUnLCAnZm91ciddfS8+XG4gICAgICAgIDxMaXN0IGl0ZW1zPXtbJ3RocmVlJywgJ2ZvdXInXX0vPlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCB0aGVtZUF3YXJlKHsgc3R5bGUgfSkoTGlzdFNjcmVlbik7XG4iLCJpbXBvcnQgSGVsbG9TY3JlZW4gZnJvbSAnLi9IZWxsb1NjcmVlbic7XG5pbXBvcnQgTGlzdFNjcmVlbiBmcm9tICcuL0xpc3RTY3JlZW4nO1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIEhlbGxvU2NyZWVuLFxuICBMaXN0U2NyZWVuXG59O1xuIl19
