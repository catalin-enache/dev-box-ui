'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getDBUITranslated;

var _DBUIWebComponentCore = require('../DBUIWebComponentCore/DBUIWebComponentCore');

var _DBUIWebComponentCore2 = _interopRequireDefault(_DBUIWebComponentCore);

var _ensureSingleRegistration = require('../../../internals/ensureSingleRegistration');

var _ensureSingleRegistration2 = _interopRequireDefault(_ensureSingleRegistration);

var _DBUII18nService = require('../../../services/DBUII18nService');

var _DBUII18nService2 = _interopRequireDefault(_DBUII18nService);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const INTERPOLATION_ATTR_PREFIX = 'message-';

const registrationName = 'dbui-translated';

function getDBUITranslated(win) {
  return (0, _ensureSingleRegistration2.default)(win, registrationName, () => {
    const {
      DBUIWebComponentBase,
      defineCommonStaticMethods,
      Registerable
    } = (0, _DBUIWebComponentCore2.default)(win);

    const i18nService = (0, _DBUII18nService2.default)(win);

    class DBUITranslated extends DBUIWebComponentBase {

      static get registrationName() {
        return registrationName;
      }

      static get templateInnerHTML() {
        return `
          <style>
          :host {
            display: inline;
          }
          </style>
          <span></span>
        `;
      }

      static get observedAttributes() {
        return [...super.observedAttributes, 'message', 'dbui-lang'];
      }

      get observedDynamicAttributes() {
        return [...super.observedDynamicAttributes, ...this._interpolationAttributesNames];
      }

      get hasDynamicAttributes() {
        return true;
      }

      get _message() {
        return this.getAttribute('message');
      }

      get _currentLang() {
        return this.getAttribute('dbui-lang');
      }

      get _currentLangTranslations() {
        return i18nService.translations[this._currentLang] || {};
      }

      get _template() {
        return this._currentLangTranslations[this._message] || (() => '[Translated]');
      }

      get _interpolationAttributes() {
        // noinspection JSCheckFunctionSignatures
        return Array.from(this.attributes).filter(attr => attr.name.startsWith(INTERPOLATION_ATTR_PREFIX));
      }

      get _interpolationAttributesNames() {
        return this._interpolationAttributes.map(attr => attr.name);
      }

      get _interpolations() {
        // noinspection JSCheckFunctionSignatures
        return this._interpolationAttributes.reduce((acc, attr) => {
          acc[attr.name.slice(INTERPOLATION_ATTR_PREFIX.length)] = attr.value;
          return acc;
        }, {});
      }

      _updateTranslation() {
        const interpolations = this._interpolations;
        const args = [];
        const kwargs = {};

        Object.keys(interpolations).forEach(key => {
          Number.isInteger(Number(key)) ? args.push(interpolations[key]) : kwargs[key] = interpolations[key];
        });

        this.shadowRoot.querySelector('span').innerHTML = this._template(...args, kwargs);
      }

      onConnectedCallback() {
        this._updateTranslation();
      }

      onAttributeChangedCallback() {
        this._updateTranslation();
      }

    }

    return Registerable(defineCommonStaticMethods(DBUITranslated));
  });
}

getDBUITranslated.registrationName = registrationName;