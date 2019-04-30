import { expect } from 'chai';
import inIframe from '../../../../../../../testUtils/inIframe';
import getDBUIAutoScroll from '../DBUIAutoScroll';
import getDBUIDraggable from '../../DBUIDraggable/DBUIDraggable';
import getDBUISlider from '../../DBUISlider/DBUISlider';
import dbuiWebComponentsSetUp from '../../../helpers/dbuiWebComponentsSetup';
import onScreenConsole from '../../../../utils/onScreenConsole';
import {
  sendTapEvent,
  sendTouchEvent,
  sendMouseEvent
} from '../../../../../../../testUtils/simulateEvents';
import getDBUIWebComponentCore from '../../DBUIWebComponentCore/DBUIWebComponentCore';
import getDBUIWebComponentRoot from '../../DBUIWebComponentRoot/DBUIWebComponentRoot';
import ensureSingleRegistration from '../../../../internals/ensureSingleRegistration';

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
              <_dbui-auto-scroll id="dbui-auto-scroll-shadow"
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
              </_dbui-auto-scroll>
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
  it.only('behaves as expected - live testing', (done) => {
    inIframe({
      headStyle: `
      body {
        background-color: bisque;
        _background-image: url(https://images.pexels.com/photos/68147/waterfall-thac-dray-nur-buon-me-thuot-daklak-68147.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500);
      }
      
      #dummy-one {
        margin-left: 100px;
        margin-bottom: 100px;
      }

      #dbui-auto-scroll {
        width: 200px;
        height: 200px;
        background-color: rgba(0, 0, 255, 0.2);
        border-color: black;
        border-style: solid;
        border-top-width: 0px;
        border-right-width: 0px;
        border-bottom-width: 0px;
        border-left-width: 0px;
        padding: 40px; /* padding is ignored overwritten with 0 internally */
        /*box-sizing: border-box;*/
        /*--dbui-auto-scroll-custom-slider-thickness: 25px;*/
      }
      
      #scrollable-content {
        border: 0px solid yellow;
        padding: 0px;
        box-sizing: border-box;
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
          <dbui-draggable id="dbui-draggable" style="position: absolute; z-index: 1;">drag</dbui-draggable>
          <dbui-auto-scroll
          id="dbui-auto-scroll"
          h-scroll="1"
          v-scroll="1"
          _native
          debug-show-value
          percent-precision=""
          >
            <div id="scrollable-content">${'content'}</div>
            <!--<input type="text" />-->
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
          const autoScrollNative = autoScroll.shadowRoot.querySelector('dbui-auto-scroll-native');
          const draggable = contentWindow.document.querySelector('#dbui-draggable');

          draggable.addEventListener('dbui-event-dragmove', (evt) => {
            autoScroll.style.width = `${200 + evt.detail.targetTranslateX}px`;
            autoScroll.style.height = `${200 + evt.detail.targetTranslateY}px`;
          });

          autoScroll.addEventListener('dbui-event-scroll', (evt) => {
            // console.log('test dbui-event-scroll', {
            //   hScroll: evt.target.hScroll,
            //   vScroll: evt.target.vScroll
            // });
          });

          const scrollableContent = contentWindow.document.querySelector('#scrollable-content');
          const dynamicContent = contentWindow.document.createElement('div');
          dynamicContent.style.cssText = `
          /*width: 201px;
          height: 201px;*/
          background-color: gray;
          /*border: 1px solid red;*/
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
            // autoScroll.style.height = '350px';
            // autoScroll.style.width = '150px';
            // autoScroll.native = true;
            // autoScroll.hScroll = 0.5;
            // autoScroll.native = true;
            // autoScroll.dir = 'ltr';
            setTimeout(() => {
              // autoScroll.style.height = '200px';
              // dynamicContent.remove();
              // autoScroll.native = false;
              // autoScroll.hScroll = 0.6;
              // autoScroll.native = false;
              // autoScroll.dir = 'rtl';
              setTimeout(() => {
                setTimeout(() => {
                  iframe.remove();
                  done();
                }, 55000);
              }, 0);
            }, 3000);
          }, 1000);
        });

        DBUIDraggable.registerSelf();
        DBUIAutoScroll.registerSelf();
        DummyOne.registerSelf();
        DBUIWebComponentRoot.registerSelf();
      }
    });
  });
});
