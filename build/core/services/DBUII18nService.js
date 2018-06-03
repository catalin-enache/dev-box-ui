'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getDBUII18nService;

var _ensureSingleRegistration = require('../internals/ensureSingleRegistration');

var _ensureSingleRegistration2 = _interopRequireDefault(_ensureSingleRegistration);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const emptyObj = {};

const registrationName = 'DBUII18nService';

function getDBUII18nService(win) {
  return (0, _ensureSingleRegistration2.default)(win, registrationName, () => {
    class DBUII18nService {
      constructor() {
        this._translations = {};
      }

      clearTranslations(lang) {
        delete this._translations[lang];
      }

      registerTranslations(translations) {
        this._translations = Object.keys(translations).reduce((acc, lang) => {
          acc[lang] = Object.assign({}, this._translations[lang], translations[lang]);
          return acc;
        }, this._translations);
      }

      translate(msg, lang) {
        return (this.translations[lang] || emptyObj)[msg];
      }

      get translations() {
        return this._translations;
      }
    }

    const dbuiI18nService = new DBUII18nService();
    return dbuiI18nService;
  });
}