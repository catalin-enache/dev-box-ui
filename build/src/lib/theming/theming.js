'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.themeListener = exports.ThemeProvider = exports.withTheme = exports.channel = undefined;

var _theming = require('theming');

exports.channel = _theming.channel;
exports.withTheme = _theming.withTheme;
exports.ThemeProvider = _theming.ThemeProvider;
exports.themeListener = _theming.themeListener; // import { createTheming } from 'theming';
// const theming = createTheming('__DBU_THEMING__');
// const { channel, withTheme, ThemeProvider, themeListener } = theming;