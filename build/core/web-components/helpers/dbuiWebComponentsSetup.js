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