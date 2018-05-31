import { expect } from 'chai';
import inIframe from '../../../../../../testUtils/inIframe';
import getDBUIWebComponentTranslated from './DBUIWebComponentTranslated';
import getDBUII18nService from '../../../services/DBUII18nService';
import template from '../../../utils/template';

const translations = {
  en: {
    Hello: template`<span style="color: green; font-weight: bold;">Hello</span> ${'name'} ${'age'} ${0} ${1}`,
    Bye: template`Good bye ${'name'} - ${'interval'}`
  },
  sp: {
    Hello: template`<span style="color: blue; font-weight: bold;">Hola</span> ${'name'} ${'age'} ${1} ${0}`,
    Bye: template`Adios ${'name'} - ${'interval'}`
  }
};

describe('Translated', () => {
  it('behaves as expected', (done) => {
    inIframe({
      headStyle: '',
      bodyHTML: `
      <div id="container">
        <dbui-translated
          sync-locale-with="#container"
          id="one"
          message-0="zero"
          message-1="one"
          message="Hello"
          message-age="22"
          message-name="John"
        ></dbui-translated>
      </div>
      
      `,
      onLoad: ({ contentWindow, iframe }) => {
        const Translated = getDBUIWebComponentTranslated(contentWindow);
        const i18nService = getDBUII18nService(contentWindow);

        i18nService.registerTranslations(translations);

        const container = contentWindow.document.querySelector('#container');
        const one = contentWindow.document.querySelector('#one');

        Promise.all([
          Translated.registrationName,
        ].map((localName) => contentWindow.customElements.whenDefined(localName)
        )).then(() => {

          expect(one.shadowRoot.querySelector('span').innerHTML).to.equal(
            '<span style="color: green; font-weight: bold;">Hello</span> John 22 zero one'
          );

          setTimeout(() => {
            one.setAttribute('message-name', 'Will');
            one.setAttribute('message-age', '32');

            setTimeout(() => {
              expect(one.shadowRoot.querySelector('span').innerHTML).to.equal(
                '<span style="color: green; font-weight: bold;">Hello</span> Will 32 zero one'
              );

              container.lang = 'sp';

              setTimeout(() => {
                expect(one.shadowRoot.querySelector('span').innerHTML).to.equal(
                  '<span style="color: blue; font-weight: bold;">Hola</span> Will 32 one zero'
                );

                one.setAttribute('message', 'Bye');
                one.setAttribute('message-name', 'John Wick');
                one.setAttribute('message-interval', '24h');

                setTimeout(() => {
                  expect(one.shadowRoot.querySelector('span').innerHTML).to.equal(
                    'Adios John Wick - 24h'
                  );

                  container.lang = 'en';

                  setTimeout(() => {
                    expect(one.shadowRoot.querySelector('span').innerHTML).to.equal(
                      'Good bye John Wick - 24h'
                    );

                    one.remove();
                    container.appendChild(one);

                    setTimeout(() => {
                      expect(one.shadowRoot.querySelector('span').innerHTML).to.equal(
                        'Good bye John Wick - 24h'
                      );

                      one.remove();
                      container.lang = 'sp';
                      container.appendChild(one);

                      setTimeout(() => {
                        expect(one.shadowRoot.querySelector('span').innerHTML).to.equal(
                          'Adios John Wick - 24h'
                        );
                        iframe.remove();
                        done();
                      }, 0);
                    }, 0);
                  }, 0);
                }, 0);
              }, 0);
            }, 0);
          }, 0);
        });

        Translated.registerSelf();
      }
    });
  });
});
