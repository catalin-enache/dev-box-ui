import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { expect } from 'chai';
import localeAware from './localeAware';
import i18nService from '../services/I18nService';
import localeService from '../services/LocaleService';

const lang1 = 'xy';
const lang2 = 'yz';

const lang1Translations1 = {
  [lang1]: {
    one: '__one'
  },
};
const lang2Translations1 = {
  [lang2]: {
    one: 'one__'
  },
};

let TestComp = class TestComp extends React.Component {
  componentWillReceiveProps(nextProps) {
    this.props.compReceivedProps(nextProps);
  }
  render() {
    return <div>TestComp</div>;
  }
};

TestComp.propTypes = {
  compReceivedProps: PropTypes.func.isRequired
};

TestComp = localeAware(TestComp);


describe('localeAware', () => {
  beforeEach(() => {
    i18nService.registerTranslations(lang1Translations1);
    i18nService.registerTranslations(lang2Translations1);
    expect(i18nService.translations[lang1]).to.deep.equal({
      ...lang1Translations1[lang1]
    });
    expect(i18nService.translations[lang2]).to.deep.equal({
      ...lang2Translations1[lang2]
    });
  });

  afterEach(() => {
    i18nService.clearTranslations(lang1);
    i18nService.clearTranslations(lang2);
    expect(i18nService.translations[lang1]).to.equal(undefined);
    expect(i18nService.translations[lang2]).to.equal(undefined);
  });

  it('provides locale and translations to wrapped component', (done) => {
    const testing = document.querySelector('#testing');
    let finished = false;
    let compReceivedPropsCalls = 0;

    const compReceivedProps = (nextProps) => {
      compReceivedPropsCalls += 1;

      if (compReceivedPropsCalls === 1) {
        expect(localeService.locale.lang).to.equal(lang2);
      } else if (compReceivedPropsCalls === 2) {
        expect(localeService.locale.lang).to.equal('en');
      }

      if (localeService.locale.lang === lang2) {
        expect(nextProps.locale.lang).to.equal(lang2);
        expect(nextProps.translations.one).to.equal(lang2Translations1[lang2].one);
      } else if (localeService.locale.lang === 'en') {
        // lang switching circle finished
        setTimeout(() => {
          unsubscribe();
          ReactDOM.unmountComponentAtNode(testing);
          done();
        }, 0);
      }
    };

    const unsubscribe = localeService.onLocaleChange((locale) => {

      if (locale.lang === 'en' && !finished) {

        localeService.locale = { lang: lang1 };

      } else if (locale.lang === lang2) {

        finished = true;
        localeService.locale = { lang: 'en' };

      } else if (locale.lang === lang1) {

        const doTest = (testComp) => {
          if (!testComp) return;
          expect(testComp._component.props.locale.lang).to.equal(lang1);
          expect(testComp._component.props.translations.one).to.equal(lang1Translations1[lang1].one);
          localeService.locale = { lang: lang2 };
        };

        ReactDOM.render(
          <TestComp ref={doTest} compReceivedProps={compReceivedProps} />, testing
        );
      }
    });
  });
});

