'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDBUIWebComponentIcon = exports.getDBUIWebComponentFormInputText = exports.getDBUIWebComponentDummyParent = exports.getDBUIWebComponentDummy = exports.onScreenConsole = exports.template = exports.traits = exports.formatters = exports.getDBUII18nService = exports.getDBUILocaleService = exports.Focusable = exports.getDBUIWebComponentBase = exports.ensureSingleRegistration = exports.dbuiWebComponentsSetUp = exports.quickSetupAndLoad = exports.registrations = undefined;

var _dbuiWebComponentsSetup = require('./web-components/helpers/dbuiWebComponentsSetup');

var _dbuiWebComponentsSetup2 = _interopRequireDefault(_dbuiWebComponentsSetup);

var _ensureSingleRegistration = require('./internals/ensureSingleRegistration');

var _ensureSingleRegistration2 = _interopRequireDefault(_ensureSingleRegistration);

var _DBUIWebComponentBase = require('./web-components/components/DBUIWebComponentBase/DBUIWebComponentBase');

var _DBUIWebComponentBase2 = _interopRequireDefault(_DBUIWebComponentBase);

var _Focusable = require('./web-components/behaviours/Focusable');

var _Focusable2 = _interopRequireDefault(_Focusable);

var _DBUILocaleService = require('./services/DBUILocaleService');

var _DBUILocaleService2 = _interopRequireDefault(_DBUILocaleService);

var _DBUII18nService = require('./services/DBUII18nService');

var _DBUII18nService2 = _interopRequireDefault(_DBUII18nService);

var _formatters = require('./utils/formatters');

var _formatters2 = _interopRequireDefault(_formatters);

var _traits = require('./utils/traits');

var _traits2 = _interopRequireDefault(_traits);

var _template = require('./utils/template');

var _template2 = _interopRequireDefault(_template);

var _onScreenConsole = require('./utils/onScreenConsole');

var _onScreenConsole2 = _interopRequireDefault(_onScreenConsole);

var _DBUIWebComponentDummy = require('./web-components/components/DBUIWebComponentDummy/DBUIWebComponentDummy');

var _DBUIWebComponentDummy2 = _interopRequireDefault(_DBUIWebComponentDummy);

var _DBUIWebComponentDummyParent = require('./web-components/components/DBUIWebComponentDummyParent/DBUIWebComponentDummyParent');

var _DBUIWebComponentDummyParent2 = _interopRequireDefault(_DBUIWebComponentDummyParent);

var _DBUIWebComponentFormInputText = require('./web-components/components/DBUIWebComponentFormInputText/DBUIWebComponentFormInputText');

var _DBUIWebComponentFormInputText2 = _interopRequireDefault(_DBUIWebComponentFormInputText);

var _DBUIWebComponentIcon = require('./web-components/components/DBUIWebComponentIcon/DBUIWebComponentIcon');

var _DBUIWebComponentIcon2 = _interopRequireDefault(_DBUIWebComponentIcon);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Components


// Utils


// Services


// ComponentBase

// Helpers
const registrations = {
  [_DBUIWebComponentDummy2.default.registrationName]: _DBUIWebComponentDummy2.default,
  [_DBUIWebComponentDummyParent2.default.registrationName]: _DBUIWebComponentDummyParent2.default,
  [_DBUIWebComponentFormInputText2.default.registrationName]: _DBUIWebComponentFormInputText2.default,
  [_DBUIWebComponentIcon2.default.registrationName]: _DBUIWebComponentIcon2.default
};

/*
This helper function is just for convenience.
Using it implies that entire DBUIWebComponents library is already loaded.
It is useful especially when working with distribution build.
If one wants to load just one web-component or a subset of core
they should be loaded from node_modules/dev-box-ui/core by their path
ex:
import SomeComponentLoader from node_modules/dev-box-ui/core/path/to/SomeComponent;
*/


// Behaviours


// Internals
function quickSetupAndLoad(win = window) {
  /**
   * @param components Object {
   *  registrationName,
   *  componentStyle
   * }
   * @return Object { <registrationName>, <componentClass> }
   */
  return function (components) {
    return (0, _dbuiWebComponentsSetup2.default)(win)(components).reduce((acc, { registrationName }) => {
      const componentClass = registrations[registrationName](window);
      componentClass.registerSelf();
      acc[registrationName] = componentClass;
      return acc;
    }, {});
  };
}

exports.registrations = registrations;
exports.quickSetupAndLoad = quickSetupAndLoad;
exports.dbuiWebComponentsSetUp = _dbuiWebComponentsSetup2.default;
exports.ensureSingleRegistration = _ensureSingleRegistration2.default;
exports.getDBUIWebComponentBase = _DBUIWebComponentBase2.default;
exports.Focusable = _Focusable2.default;
exports.getDBUILocaleService = _DBUILocaleService2.default;
exports.getDBUII18nService = _DBUII18nService2.default;
exports.formatters = _formatters2.default;
exports.traits = _traits2.default;
exports.template = _template2.default;
exports.onScreenConsole = _onScreenConsole2.default;
exports.getDBUIWebComponentDummy = _DBUIWebComponentDummy2.default;
exports.getDBUIWebComponentDummyParent = _DBUIWebComponentDummyParent2.default;
exports.getDBUIWebComponentFormInputText = _DBUIWebComponentFormInputText2.default;
exports.getDBUIWebComponentIcon = _DBUIWebComponentIcon2.default;

/* eslint no-console: 0 */

let build = 'production';

if (process.env.NODE_ENV !== 'production') {
  build = 'develop';
}

console.log(`Using DBUIWebComponentsDistLib ${build} build.`);