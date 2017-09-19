'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.theming = exports.createTheming = undefined;

var _reactJss = require('react-jss');

const theming = (0, _reactJss.createTheming)('__DBU_THEMING__');

exports.createTheming = _reactJss.createTheming;
exports.theming = theming;