import ensureSingleRegistration from '../internals/ensureSingleRegistration';

const emptyObj = {};

const registrationName = 'DBUII18nService';

export default function getDBUII18nService(win) {
  return ensureSingleRegistration(win, registrationName, () => {
    class DBUII18nService {
      constructor() {
        this._translations = {};
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
