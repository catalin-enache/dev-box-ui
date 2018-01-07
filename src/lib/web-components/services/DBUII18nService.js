import getDBUIlocaleService from './DBUILocaleService';
import ensureSingleRegistration from '../internals/ensureSingleRegistration';

const emptyObj = {};

const registrationName = 'DBUII18nService';

export default function getDBUII18nService(win) {
  const localeService = getDBUIlocaleService(win);
  return ensureSingleRegistration(win, registrationName, () => {
    class I18nService {
      constructor() {
        localeService.onLocaleChange(this._handleLocaleChange.bind(this));
        this._locale = localeService.locale;
        this._translations = {};
      }

      _handleLocaleChange(locale) {
        this._locale = locale;
      }

      clearTranslations(lang) {
        delete this._translations[lang];
      }

      registerTranslations(translations) {
        this._translations = Object.keys(translations).reduce((acc, lang) => {
          acc[lang] = {
            ...this._translations[lang],
            ...translations[lang]
          };
          return acc;
        }, this._translations);
      }

      translate(msg) {
        return this.currentLangTranslations[msg];
      }

      get translations() {
        return this._translations;
      }

      get currentLangTranslations() {
        return this._translations[this._locale.lang] || emptyObj;
      }
    }

    const i18nService = new I18nService();
    return i18nService;
  });
}
