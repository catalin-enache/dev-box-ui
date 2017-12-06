'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDBUWebComponentDummyParent = exports.getDBUWebComponentDummy = exports.dbuWebComponentsSetUp = exports.quickSetupAndLoad = undefined;

var _DBUWebComponentsSetup = require('./DBUWebComponentsSetup/DBUWebComponentsSetup');

var _DBUWebComponentsSetup2 = _interopRequireDefault(_DBUWebComponentsSetup);

var _DBUWebComponentDummy = require('./DBUWebComponentDummy/DBUWebComponentDummy');

var _DBUWebComponentDummy2 = _interopRequireDefault(_DBUWebComponentDummy);

var _DBUWebComponentDummyParent = require('./DBUWebComponentDummyParent/DBUWebComponentDummyParent');

var _DBUWebComponentDummyParent2 = _interopRequireDefault(_DBUWebComponentDummyParent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const registrations = {
  [_DBUWebComponentDummy2.default.registrationName]: _DBUWebComponentDummy2.default,
  [_DBUWebComponentDummyParent2.default.registrationName]: _DBUWebComponentDummyParent2.default
};

function quickSetupAndLoad(win = window) {
  return function (components) {
    const ret = {};
    components.forEach(({ registrationName, componentStyle }) => {
      (0, _DBUWebComponentsSetup2.default)(win).appendStyle(registrationName, componentStyle);
      const componentClass = registrations[registrationName](window);
      componentClass.registerSelf();
      ret[registrationName] = componentClass;
    });
    return ret;
  };
}

exports.quickSetupAndLoad = quickSetupAndLoad;
exports.dbuWebComponentsSetUp = _DBUWebComponentsSetup2.default;
exports.getDBUWebComponentDummy = _DBUWebComponentDummy2.default;
exports.getDBUWebComponentDummyParent = _DBUWebComponentDummyParent2.default;