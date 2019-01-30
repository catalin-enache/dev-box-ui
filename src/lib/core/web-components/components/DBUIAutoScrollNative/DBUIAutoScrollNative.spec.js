import { expect } from 'chai';
import inIframe from '../../../../../../testUtils/inIframe';
import getDBUIAutoScrollNative from './DBUIAutoScrollNative';
import dbuiWebComponentsSetUp from '../../helpers/dbuiWebComponentsSetup';
import onScreenConsole from '../../../utils/onScreenConsole';
import {
  sendTapEvent,
  sendTouchEvent,
  sendMouseEvent
} from '../../../../../../testUtils/simulateEvents';
import getDBUIWebComponentCore from '../DBUIWebComponentCore/DBUIWebComponentCore';
import ensureSingleRegistration from '../../../internals/ensureSingleRegistration';

const content = `
<p>9aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa9</p>
<p>0aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa0</p>
<p>0aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa0</p>
<p>0aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa0</p>
<p>0aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa0</p>
<p>0aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa0</p>
<p>0aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa0</p>
<p>0aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa0</p>
<p>0aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa0</p>
<p>0aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa0</p>
<p>0aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa0</p>
<p>9aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa9</p>
`;

describe('DBUIAutoScrollNative', () => {
  xit('behaves as expected - live testing', (done) => {
    inIframe({
      headStyle: `
      body {
        background-color: bisque;
      }
      #dbui-auto-scroll-native {
        width: 200px;
        height: 200px;
        background-color: rgba(0, 0, 255, 0.2);
        border: 1px solid black;
        box-sizing: border-box;
      }
      
      #scrollable-content {
        border: 1px solid orange;
      }

      `,
      bodyHTML: `
      <div id="container">
        <div id="locale-provider" dir="ltr"></div>
        <div id="wrapper-auto-scroll-native">
          <dbui-auto-scroll-native id="dbui-auto-scroll-native" sync-locale-with="#locale-provider" h-scroll="0.20">
            <div id="scrollable-content" dir="ltr">${'content'}</div>
            <input type="text" />
          </dbui-auto-scroll-native>
        </div>
      </div>

      `,

      onLoad: ({ contentWindow, iframe }) => {
        const DBUIAutoScrollNative = getDBUIAutoScrollNative(contentWindow);
        dbuiWebComponentsSetUp(contentWindow)([{
          registrationName: DBUIAutoScrollNative.registrationName,
          componentStyle: `
          `
        }]);

        Promise.all([
          DBUIAutoScrollNative.registrationName,
        ].map((localName) => contentWindow.customElements.whenDefined(localName)
        )).then(() => {
          const wrapperAutoScrollNative = contentWindow.document.querySelector('#wrapper-auto-scroll-native');
          const autoScrollNative = contentWindow.document.querySelector('#dbui-auto-scroll-native');
          const scrollableContent = contentWindow.document.querySelector('#scrollable-content');
          const dynamicContent = contentWindow.document.createElement('div');
          dynamicContent.style.cssText = `
          /*width: 201px;
          height: 201px;*/
          background-color: gray;
          border: 1px solid red;
          `;
          dynamicContent.innerText = `kkkkkkkkkkkkkkkkkkkkkkkk
          
          
          
          
          
          
          
          
          `;
          // dynamicContent.tabIndex = 0;
          // dynamicContent.setAttribute('contenteditable', 'true');

          // scrollableOne.remove();
          // wrapperScrollableOne.appendChild(scrollableOne);
          // scrollableOne.remove();
          // wrapperScrollableOne.appendChild(scrollableOne);
          // scrollableOne.remove();
          // wrapperScrollableOne.appendChild(scrollableOne);

          // scrollableContent.innerHTML = content;
          scrollableContent.appendChild(dynamicContent);


          setTimeout(() => {
            // scrollableContent.appendChild(dynamicContent);
            // autoScrollNative.style.width = '350px';
            setTimeout(() => {
              // dynamicContent.remove();
              setTimeout(() => {
                setTimeout(() => {
                  iframe.remove();
                  done();
                }, 55000);
              }, 0);
            }, 3000);
          }, 1000);
        });

        DBUIAutoScrollNative.registerSelf();
      }
    });
  });
});
