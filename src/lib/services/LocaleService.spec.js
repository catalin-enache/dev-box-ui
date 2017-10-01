import { expect } from 'chai';
import localeService from './LocaleService';

describe('LocaleService', () => {
  it('can set locale dir and lang', () => {
    const rootElement = window.document.documentElement;

    expect(rootElement.getAttribute('dir')).to.equal('ltr');
    expect(rootElement.getAttribute('lang')).to.equal('en');

    localeService.locale = { dir: 'rtl' };
    expect(rootElement.getAttribute('dir')).to.equal('rtl');
    expect(rootElement.getAttribute('lang')).to.equal('en');

    localeService.locale = { lang: 'sp' };
    expect(rootElement.getAttribute('lang')).to.equal('sp');
    expect(rootElement.getAttribute('dir')).to.equal('rtl');

    localeService.locale = { dir: 'ltr', lang: 'en' };
    expect(rootElement.getAttribute('dir')).to.equal('ltr');
    expect(rootElement.getAttribute('lang')).to.equal('en');
  });

  it('set/get locale are not synchronous', (done) => {
    const rootElement = window.document.documentElement;

    expect(localeService.locale).to.deep.equal({ dir: 'ltr', lang: 'en' });
    localeService.locale = { dir: 'rtl', lang: 'sp' };
    // not changed yet as Mutation Observer is async
    expect(localeService.locale).to.deep.equal({ dir: 'ltr', lang: 'en' });
    expect(rootElement.getAttribute('dir')).to.equal('rtl'); // changed
    expect(rootElement.getAttribute('lang')).to.equal('sp'); // changed

    setTimeout(() => {
      // changed in next frame
      expect(localeService.locale).to.deep.equal({ dir: 'rtl', lang: 'sp' });
      localeService.locale = { dir: 'ltr', lang: 'en' };
      // not changed yet as Mutation Observer is async
      expect(localeService.locale).to.deep.equal({ dir: 'rtl', lang: 'sp' });
      expect(rootElement.getAttribute('dir')).to.equal('ltr'); // changed
      expect(rootElement.getAttribute('lang')).to.equal('en'); // changed
      setTimeout(() => {
        // changed in next frame
        expect(localeService.locale).to.deep.equal({ dir: 'ltr', lang: 'en' });
        done();
      }, 0);
    }, 0);
  });

  it('notifies current locale at subscription time and observes locale mutations', (done) => {
    const rootElement = window.document.documentElement;
    let currentLocale = null;
    const handleLocaleChange = (locale) => {
      currentLocale = locale;
    };
    const unregister = localeService.onLocaleChange(handleLocaleChange);

    expect(currentLocale).to.deep.equal({ dir: 'ltr', lang: 'en' });

    rootElement.setAttribute('dir', 'rtl');
    setTimeout(() => {
      expect(currentLocale).to.deep.equal({ dir: 'rtl', lang: 'en' });

      rootElement.setAttribute('lang', 'sp');
      setTimeout(() => {
        expect(currentLocale).to.deep.equal({ dir: 'rtl', lang: 'sp' });

        rootElement.setAttribute('lang', 'en');
        rootElement.setAttribute('dir', 'ltr');
        setTimeout(() => {
          expect(currentLocale).to.deep.equal({ dir: 'ltr', lang: 'en' });
          unregister();
          done();
        }, 0);
      }, 0);
    }, 0);
  });

  it('removes the handler when unsubscribing', () => {
    const localeSubscribersLength = localeService._callbacks.length;
    const unregister1 = localeService.onLocaleChange(() => {});
    const unregister2 = localeService.onLocaleChange(() => {});

    expect(localeService._callbacks.length).to.equal(localeSubscribersLength + 2);
    unregister1();
    expect(localeService._callbacks.length).to.equal(localeSubscribersLength + 1);
    unregister2();
    expect(localeService._callbacks.length).to.equal(localeSubscribersLength);
  });
});
