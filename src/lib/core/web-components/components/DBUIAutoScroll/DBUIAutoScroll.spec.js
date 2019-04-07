import { expect } from 'chai';
import inIframe from '../../../../../../testUtils/inIframe';
import getDBUIAutoScroll from './DBUIAutoScroll';
import getDBUIDraggable from '../DBUIDraggable/DBUIDraggable';
import getDBUISlider from '../DBUISlider/DBUISlider';
import dbuiWebComponentsSetUp from '../../helpers/dbuiWebComponentsSetup';
import onScreenConsole from '../../../utils/onScreenConsole';
import {
  sendTapEvent,
  sendTouchEvent,
  sendMouseEvent
} from '../../../../../../testUtils/simulateEvents';
import getDBUIWebComponentCore from '../DBUIWebComponentCore/DBUIWebComponentCore';
import getDBUIWebComponentRoot from '../DBUIWebComponentRoot/DBUIWebComponentRoot';
import ensureSingleRegistration from '../../../internals/ensureSingleRegistration';

const dummyOneRegistrationName = 'dbui-dummy-one';
function getDummyOne(win) {
  return ensureSingleRegistration(win, dummyOneRegistrationName, () => {
    const {
      DBUIWebComponentBase,
      defineCommonStaticMethods,
      Registerable
    } = getDBUIWebComponentCore(win);

    const DBUIAutoScroll = getDBUIAutoScroll(win);

    class DummyOne extends DBUIWebComponentBase {

      static get registrationName() {
        return dummyOneRegistrationName;
      }

      static get dependencies() {
        return [...super.dependencies, DBUIAutoScroll];
      }

      static get templateInnerHTML() {
        return `
          <style>
          :host {
            display: block;
            color: blue;
          }
          dbui-auto-scroll {
            width: 100px;
            height: 100px;
          }
          </style>
          <div>
            <p>Dummy One</p>
            <div>
              <dbui-auto-scroll id="dbui-auto-scroll-shadow"
              debug-show-value
              h-scroll="1"
              v-scroll="1"
              >
                <p>LppppppppppppR</p>
                <p>LaaaaaaaaaaaaR</p>
                <p>LssssssssssssR</p>
                <p>LccccccccccccR</p>
                <p>LssssssssssssR</p>
                <p>LaaaaaaaaaaaaR</p>
              </dbui-auto-scroll>
            </div>
            <br />
            <br />
            <br />
            <slot></slot>
          </div>
        `;
      }
    }

    return Registerable(
      defineCommonStaticMethods(
        DummyOne
      )
    );
  });
}
getDummyOne.registrationName = dummyOneRegistrationName;

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
  xit('behaves as expected - live testing', (done) => {
    inIframe({
      headStyle: `
      body {
        background-color: bisque;
      }

      #dbui-auto-scroll {
        width: 200px;
        height: 200px;
        background-color: rgba(0, 0, 255, 0.2);
        border: 1px solid black;
        /*padding: 10px;*/
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
      <dbui-web-component-root>
      <div id="container">
        <div id="locale-provider" dir="rtl"></div>
        <div id="wrapper-auto-scroll">
          <dbui-dummy-one id="dummy-one" sync-locale-with="#locale-provider">
          <dbui-auto-scroll
          id="dbui-auto-scroll"
          h-scroll="1"
          v-scroll="1"
          _native
          debug-show-value
          percent-precision=""
          >
            <div id="scrollable-content">${'content'}</div>
            <input type="text" />
          </dbui-auto-scroll>
          </dbui-dummy-one>
        </div>
      </div>
      </dbui-web-component-root>
      `,

      onLoad: ({ contentWindow, iframe }) => {
        // onScreenConsole();
        const DBUIWebComponentRoot = getDBUIWebComponentRoot(contentWindow);
        const DBUIAutoScroll = getDBUIAutoScroll(contentWindow);
        const DummyOne = getDummyOne(contentWindow);
        const DBUIDraggable = getDBUIDraggable(contentWindow);
        const DBUISlider = getDBUISlider(contentWindow);
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
          autoScroll.addEventListener('dbui-event-scroll', () => {
            // console.log('dbui-event-scroll', {
            //   hScroll: autoScroll.hScroll,
            //   vScroll: autoScroll.vScroll,
            // });
          });
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
            // autoScroll.style.width = '50px';
            // autoScroll.native = true;
            setTimeout(() => {
              // dynamicContent.remove();
              // autoScroll.native = false;
              setTimeout(() => {
                setTimeout(() => {
                  iframe.remove();
                  done();
                }, 55000);
              }, 0);
            }, 3000);
          }, 1000);
        });
        // DBUIDraggable.registerSelf();
        // DBUISlider.registerSelf();
        DBUIAutoScroll.registerSelf();
        DummyOne.registerSelf();
        DBUIWebComponentRoot.registerSelf();

        console.log('Registrations DONE!');
      }
    });
  });
});
