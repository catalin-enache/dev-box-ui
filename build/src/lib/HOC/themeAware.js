'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = themeAware;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactJss = require('react-jss');

var _reactJss2 = _interopRequireDefault(_reactJss);

var _theming = require('../theming/theming');

var _hoistNonReactStatics = require('hoist-non-react-statics');

var _hoistNonReactStatics2 = _interopRequireDefault(_hoistNonReactStatics);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function themeAware({ theme, style }) {

    return function themeAwareInner(Component) {

        const ToRender = style ? (0, _reactJss2.default)(style)(Component) : Component;

        class ThemeAware extends _react2.default.Component {
            render() {
                return !!theme ? _react2.default.createElement(
                    _theming.ThemeProvider,
                    { theme: theme },
                    _react2.default.createElement(ToRender, this.props)
                ) : _react2.default.createElement(ToRender, this.props);
            }
        }

        ThemeAware.displayName = `ThemeAware(${Component.displayName || Component.name || 'Component'})`;

        return (0, _hoistNonReactStatics2.default)(ThemeAware, Component);
    };
}