'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _reactJss = require('react-jss');

var _commonAnimations = require('./commonAnimations');

var _commonAnimations2 = _interopRequireDefault(_commonAnimations);

var _commonVars = require('./commonVars');

var _commonVars2 = _interopRequireDefault(_commonVars);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const animations = _reactJss.jss.createStyleSheet(_commonAnimations2.default, {
  meta: 'commonAnimations'
}).attach();

const defaultTheme = {
  vars: _commonVars2.default,
  animations: animations.classes
};

exports.default = defaultTheme;