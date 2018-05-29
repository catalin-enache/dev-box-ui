// import { expect } from 'chai';
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
  xit('test', (done) => {
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

          setTimeout(() => {
            one.setAttribute('message-name', 'Will');
            one.setAttribute('message-age', '32');

            setTimeout(() => {
              container.lang = 'sp';

              setTimeout(() => {
                one.setAttribute('message', 'Bye');
                one.setAttribute('message-name', 'Wick');
                one.setAttribute('message-interval', '24h');

                setTimeout(() => {
                  container.lang = 'en';
                }, 1000);
              }, 1000);
            }, 1000);

          }, 1000);

          setTimeout(() => {
            iframe.remove();
            done();
          }, 55000);

        });

        Translated.registerSelf();
      }
    });
  });
});
