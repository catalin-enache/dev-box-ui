import { expect } from 'chai';
import I18nService from './I18nService';
import LocaleService from './LocaleService';

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

describe('I18nService', () => {
  it('registers new translations', () => {
    I18nService.clearTranslations(lang1);
    expect(I18nService.translations[lang1]).to.equal(undefined);
    I18nService.registerTranslations(lang1Translations1);
    expect(I18nService.translations[lang1]).to.deep.equal({
      ...lang1Translations1[lang1]
    });
    I18nService.registerTranslations(lang1Translations2);
    expect(I18nService.translations[lang1]).to.deep.equal({
      ...lang1Translations1[lang1],
      ...lang1Translations2[lang1]
    });
    I18nService.clearTranslations(lang1);
    expect(I18nService.translations[lang1]).to.equal(undefined);
  });

  it('is locale aware, it reacts to locale changes', (done) => {
    I18nService.clearTranslations(lang1);
    I18nService.clearTranslations(lang2);

    I18nService.registerTranslations({
      ...lang1Translations1,
      ...lang2Translations1
    });

    LocaleService.locale = { lang: lang1 };
    setTimeout(() => {
      expect(I18nService.currentLangTranslations).to.deep.equal(lang1Translations1[lang1]);
      expect(I18nService.translate('one')).to.equal(lang1Translations1[lang1].one);

      LocaleService.locale = { lang: lang2 };
      setTimeout(() => {
        expect(I18nService.currentLangTranslations).to.deep.equal(lang2Translations1[lang2]);
        expect(I18nService.translate('one')).to.equal(lang2Translations1[lang2].one);

        LocaleService.locale = { lang: 'en' };
        setTimeout(() => {
          done();
        }, 0);
      }, 0);
    }, 0);
  });
});
