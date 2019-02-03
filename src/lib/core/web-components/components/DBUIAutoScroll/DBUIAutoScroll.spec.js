import { expect } from 'chai';
import inIframe from '../../../../../../testUtils/inIframe';
import getDBUIAutoScroll from './DBUIAutoScroll';
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

describe('DBUIAutoScroll', () => {
  it.only('behaves as expected - live testing', (done) => {
    inIframe({
      headStyle: `
      body {
        background-color: bisque;
      }

      #dbui-auto-scroll {
        width: 200px;
        height: 200px;
        background-color: rgba(0, 0, 255, 0.2);
        border: 2px solid black;
        /*box-sizing: border-box;*/
        /*--dbui-auto-scroll-custom-slider-thickness: 25px;*/
      }
      
      #scrollable-content {
        border: 2px solid orange;
      }
      
      input {
        width: 150px;
        height: 20px;
        border: none;
      }

      `,
      bodyHTML: `
      <div id="container">
        <div id="locale-provider" dir="ltr"></div>
        <div id="wrapper-auto-scroll">
          <dbui-auto-scroll id="dbui-auto-scroll" sync-locale-with="#locale-provider" h-scroll="0.20">
            <div id="scrollable-content" dir="ltr">${'content'}</div>
            <input type="text" />
          </dbui-auto-scroll>
        </div>
      </div>

      `,

      onLoad: ({ contentWindow, iframe }) => {
        const DBUIAutoScroll = getDBUIAutoScroll(contentWindow);
        dbuiWebComponentsSetUp(contentWindow)([{
          registrationName: DBUIAutoScroll.registrationName,
          componentStyle: `
          `
        }]);

        Promise.all([
          DBUIAutoScroll.registrationName,
        ].map((localName) => contentWindow.customElements.whenDefined(localName)
        )).then(() => {
          const wrapperAutoScroll = contentWindow.document.querySelector('#wrapper-auto-scroll');
          const autoScroll = contentWindow.document.querySelector('#dbui-auto-scroll');
          const scrollableContent = contentWindow.document.querySelector('#scrollable-content');
          const dynamicContent = contentWindow.document.createElement('div');
          dynamicContent.style.cssText = `
          /*width: 201px;
          height: 201px;*/
          background-color: gray;
          border: 1px solid red;
          line-height: 18px;
          font-size: 18px;
          `;
          dynamicContent.innerText = `kkkkkkkkkkkkkkkkkkkkkkkk
          
          
          
          
          
          
          
          
          `;
          // dynamicContent.tabIndex = 0;
          dynamicContent.setAttribute('contenteditable', 'true');

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

        DBUIAutoScroll.registerSelf();
      }
    });
  });
});
