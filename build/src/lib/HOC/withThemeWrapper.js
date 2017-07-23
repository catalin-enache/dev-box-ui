'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = withThemeWrapper;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactJss = require('react-jss');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function withThemeWrapper(theme) {
    return function (Component) {
        return class extends _react2.default.Component {
            render() {
                return _react2.default.createElement(
                    _reactJss.ThemeProvider,
                    { theme: theme },
                    _react2.default.createElement(Component, this.props)
                );
            }
        };
    };
}