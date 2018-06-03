'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDBUITranslated = exports.getDBUIIcon = exports.getDBUIFormInputText = exports.getDBUIDummyParent = exports.getDBUIDummy = exports.onScreenConsole = exports.template = exports.toggleSelectable = exports.formatters = exports.getDBUII18nService = exports.getDBUILocaleService = exports.Focusable = exports.getDBUIWebComponentCore = exports.ensureSingleRegistration = exports.dbuiWebComponentsSetUp = exports.quickSetupAndLoad = exports.registrations = undefined;

var _dbuiWebComponentsSetup = require('./web-components/helpers/dbuiWebComponentsSetup');

var _dbuiWebComponentsSetup2 = _interopRequireDefault(_dbuiWebComponentsSetup);

var _ensureSingleRegistration = require('./internals/ensureSingleRegistration');

var _ensureSingleRegistration2 = _interopRequireDefault(_ensureSingleRegistration);

var _DBUIWebComponentCore = require('./web-components/components/DBUIWebComponentCore/DBUIWebComponentCore');

var _DBUIWebComponentCore2 = _interopRequireDefault(_DBUIWebComponentCore);

var _Focusable = require('./web-components/decorators/Focusable');

var _Focusable2 = _interopRequireDefault(_Focusable);

var _DBUILocaleService = require('./services/DBUILocaleService');

var _DBUILocaleService2 = _interopRequireDefault(_DBUILocaleService);

var _DBUII18nService = require('./services/DBUII18nService');

var _DBUII18nService2 = _interopRequireDefault(_DBUII18nService);

var _formatters = require('./utils/formatters');

var _formatters2 = _interopRequireDefault(_formatters);

var _toggleSelectable = require('./utils/toggleSelectable');

var _toggleSelectable2 = _interopRequireDefault(_toggleSelectable);

var _template = require('./utils/template');

var _template2 = _interopRequireDefault(_template);

var _onScreenConsole = require('./utils/onScreenConsole');

var _onScreenConsole2 = _interopRequireDefault(_onScreenConsole);

var _DBUIDummy = require('./web-components/components/DBUIDummy/DBUIDummy');

var _DBUIDummy2 = _interopRequireDefault(_DBUIDummy);

var _DBUIDummyParent = require('./web-components/components/DBUIDummyParent/DBUIDummyParent');

var _DBUIDummyParent2 = _interopRequireDefault(_DBUIDummyParent);

var _DBUIFormInputText = require('./web-components/components/DBUIFormInputText/DBUIFormInputText');

var _DBUIFormInputText2 = _interopRequireDefault(_DBUIFormInputText);

var _DBUIIcon = require('./web-components/components/DBUIIcon/DBUIIcon');

var _DBUIIcon2 = _interopRequireDefault(_DBUIIcon);

var _DBUITranslated = require('./web-components/components/DBUITranslated/DBUITranslated');

var _DBUITranslated2 = _interopRequireDefault(_DBUITranslated);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Decorators


// Internals
const registrations = {
  [_DBUIDummy2.default.registrationName]: _DBUIDummy2.default,
  [_DBUIDummyParent2.default.registrationName]: _DBUIDummyParent2.default,
  [_DBUIFormInputText2.default.registrationName]: _DBUIFormInputText2.default,
  [_DBUIIcon2.default.registrationName]: _DBUIIcon2.default,
  [_DBUITranslated2.default.registrationName]: _DBUITranslated2.default
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


// Components


// Utils


// Services


// ComponentBase
/* eslint max-len: 0 */
// Helpers
function quickSetupAndLoad(win = window) {
  /**
   * @param components Object {
   *  registrationName,
   *  componentStyle
   * }
   * @return Object { <registrationName>, <componentClass> }
   */
  return components => {
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
exports.getDBUIWebComponentCore = _DBUIWebComponentCore2.default;
exports.Focusable = _Focusable2.default;
exports.getDBUILocaleService = _DBUILocaleService2.default;
exports.getDBUII18nService = _DBUII18nService2.default;
exports.formatters = _formatters2.default;
exports.toggleSelectable = _toggleSelectable2.default;
exports.template = _template2.default;
exports.onScreenConsole = _onScreenConsole2.default;
exports.getDBUIDummy = _DBUIDummy2.default;
exports.getDBUIDummyParent = _DBUIDummyParent2.default;
exports.getDBUIFormInputText = _DBUIFormInputText2.default;
exports.getDBUIIcon = _DBUIIcon2.default;
exports.getDBUITranslated = _DBUITranslated2.default;

/* eslint no-console: 0 */

let build = 'production';

if (process.env.NODE_ENV !== 'production') {
  build = 'develop';
}

console.log(`Using DBUIWebComponentsDistLib ${build} build.`);