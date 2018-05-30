
import getDBUIWebComponentCore from '../DBUIWebComponentCore/DBUIWebComponentCore';
import ensureSingleRegistration from '../../../internals/ensureSingleRegistration';
import getDBUII18nService from '../../../services/DBUII18nService';

const INTERPOLATION_ATTR_PREFIX = 'message-';

const registrationName = 'dbui-translated';

export default function getDBUIWebComponentTranslated(win) {
  return ensureSingleRegistration(win, registrationName, () => {
    const {
      DBUIWebComponentBase,
      defineCommonStaticMethods,
      Registerable
    } = getDBUIWebComponentCore(win);

    const i18nService = getDBUII18nService(win);

    class DBUIWebComponentTranslated extends DBUIWebComponentBase {

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
        return Array.from(this.attributes)
          .filter((attr) => attr.name.startsWith(INTERPOLATION_ATTR_PREFIX));
      }

      get _interpolationAttributesNames() {
        return this._interpolationAttributes.map((attr) => attr.name);
      }

      get _interpolations() {
        // noinspection JSCheckFunctionSignatures
        return this._interpolationAttributes
          .reduce((acc, attr) => {
            acc[attr.name.slice(INTERPOLATION_ATTR_PREFIX.length)] = attr.value;
            return acc;
          }, {});
      }


      _updateTranslation() {
        const interpolations = this._interpolations;
        const args = [];
        const kwargs = {};

        Object.keys(interpolations).forEach((key) => {
          Number.isInteger(Number(key)) ?
            args.push(interpolations[key]) :
            (kwargs[key] = interpolations[key]);
        });

        this.shadowRoot.querySelector('span').innerHTML =
          this._template(...args, kwargs);
      }

      onConnectedCallback() {
        this._updateTranslation();
      }

      onAttributeChangedCallback() {
        this._updateTranslation();
      }

    }

    return Registerable(
      defineCommonStaticMethods(
        DBUIWebComponentTranslated
      )
    );
  });
}

getDBUIWebComponentTranslated.registrationName = registrationName;

