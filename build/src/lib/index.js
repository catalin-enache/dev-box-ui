'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.List = exports.Hello = exports.ThemeProvider = exports.setTheme = exports.getTheme = undefined;

var _Hello = require('./components/Hello/Hello');

var _Hello2 = _interopRequireDefault(_Hello);

var _List = require('./components/List/List');

var _List2 = _interopRequireDefault(_List);

var _theming = require('./theming/theming');

var _defaultTheme = require('./styles/defaultTheme');

var _defaultTheme2 = _interopRequireDefault(_defaultTheme);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let customTheme;

function getTheme() {
    return customTheme || _defaultTheme2.default;
}

function setTheme(theme) {
    customTheme = theme;
}

exports.getTheme = getTheme;
exports.setTheme = setTheme;
exports.ThemeProvider = _theming.ThemeProvider;
exports.Hello = _Hello2.default;
exports.List = _List2.default;