import { expect } from 'chai';
import i18nService from './I18nService';
import localeService from './LocaleService';

const lang1 = 'xy';
const lang2 = 'yz';

const lang1Translations1 = {
  [lang1]: {
    one: '__one'
  },
};
const lang1Translations2 = {
  [lang1]: {
    two: '__two'
  },
};
const lang2Translations1 = {
  [lang2]: {
    one: 'one__'
  },
};

describe('i18nService', () => {
  it('registers new translations', () => {
    i18nService.clearTranslations(lang1);
    expect(i18nService.translations[lang1]).to.equal(undefined);
    i18nService.registerTranslations(lang1Translations1);
    expect(i18nService.translations[lang1]).to.deep.equal({
      ...lang1Translations1[lang1]
    });
    i18nService.registerTranslations(lang1Translations2);
    expect(i18nService.translations[lang1]).to.deep.equal({
      ...lang1Translations1[lang1],
      ...lang1Translations2[lang1]
    });
    i18nService.clearTranslations(lang1);
    expect(i18nService.translations[lang1]).to.equal(undefined);
  });

  it('is locale aware, it reacts to locale changes', (done) => {
    i18nService.clearTranslations(lang1);
    i18nService.clearTranslations(lang2);

    i18nService.registerTranslations({
      ...lang1Translations1,
      ...lang2Translations1
    });

    localeService.locale = { lang: lang1 };
    setTimeout(() => {
      expect(i18nService.currentLangTranslations).to.deep.equal(lang1Translations1[lang1]);
      expect(i18nService.translate('one')).to.equal(lang1Translations1[lang1].one);

      localeService.locale = { lang: lang2 };
      setTimeout(() => {
        expect(i18nService.currentLangTranslations).to.deep.equal(lang2Translations1[lang2]);
        expect(i18nService.translate('one')).to.equal(lang2Translations1[lang2].one);

        localeService.locale = { lang: 'en' };
        setTimeout(() => {
          done();
        }, 0);
      }, 0);
    }, 0);
  });
});
