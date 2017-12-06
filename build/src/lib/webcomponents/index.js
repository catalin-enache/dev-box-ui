'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDBUWebComponentDummyParent = exports.getDBUWebComponentDummy = exports.dbuWebComponentsSetUp = undefined;

var _DBUWebComponentsSetup = require('./DBUWebComponentsSetup/DBUWebComponentsSetup');

var _DBUWebComponentsSetup2 = _interopRequireDefault(_DBUWebComponentsSetup);

var _DBUWebComponentDummy = require('./DBUWebComponentDummy/DBUWebComponentDummy');

var _DBUWebComponentDummy2 = _interopRequireDefault(_DBUWebComponentDummy);

var _DBUWebComponentDummyParent = require('./DBUWebComponentDummyParent/DBUWebComponentDummyParent');

var _DBUWebComponentDummyParent2 = _interopRequireDefault(_DBUWebComponentDummyParent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.dbuWebComponentsSetUp = _DBUWebComponentsSetup2.default;
exports.getDBUWebComponentDummy = _DBUWebComponentDummy2.default;
exports.getDBUWebComponentDummyParent = _DBUWebComponentDummyParent2.default;