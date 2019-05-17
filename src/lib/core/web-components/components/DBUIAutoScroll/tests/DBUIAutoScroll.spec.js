import { expect } from 'chai';
import inIframe from '../../../../../../../testUtils/inIframe';
import getDBUIAutoScroll from '../DBUIAutoScroll';
import getDBUIDraggable from '../../DBUIDraggable/DBUIDraggable';
import dbuiWebComponentsSetUp from '../../../helpers/dbuiWebComponentsSetup';
// import onScreenConsole from '../../../../utils/onScreenConsole';
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

// eslint-disable-next-line
const HTMLContent = `
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

// eslint-disable-next-line
const editableContent = `kkkkkkkkkkkkkkkkkkkkkkkk
        
        
        
        
        
        
        
        
        `;

function testSetup({
  dir = 'ltr',
  hScroll, vScroll, overflow, scrollbars, percentPrecision, native, hWheel,

  dbuiAutoScrollWidth = '200px', dbuiAutoScrollHeight = '200px',
  dbuiAutoScrollBorderColor, dbuiAutoScrollBorderStyle,
  dbuiAutoScrollBorderTopWidth, dbuiAutoScrollBorderRightWidth,
  dbuiAutoScrollBorderBottomWidth, dbuiAutoScrollBorderLeftWidth,
  dbuiAutoScrollPadding,
  dbuiAutoScrollCustomSliderThickness,

  scrollableContentMinWidth = '300px',
  scrollableContentMinHeight = '300px',
  scrollableContentBorder,
  scrollableContentPadding,
  scrollableContentContent = '',
  scrollableContentEditableContent = '',

  onReady,
}) {
  return inIframe({
    headStyle: `
      body {
        background-color: bisque;
        _background-image: url(https://images.pexels.com/photos/68147/waterfall-thac-dray-nur-buon-me-thuot-daklak-68147.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500);
      }
      
      #dbui-auto-scroll {
        width: ${dbuiAutoScrollWidth};
        height: ${dbuiAutoScrollHeight};
        ${dbuiAutoScrollBorderColor ? `border-color: ${dbuiAutoScrollBorderColor};` : ''}
        ${dbuiAutoScrollBorderStyle ? `border-style: ${dbuiAutoScrollBorderStyle};` : ''}
        ${dbuiAutoScrollBorderTopWidth ? `border-top-width: ${dbuiAutoScrollBorderTopWidth};` : ''}
        ${dbuiAutoScrollBorderRightWidth ? `border-right-width: ${dbuiAutoScrollBorderRightWidth};` : ''}
        ${dbuiAutoScrollBorderBottomWidth ? `border-bottom-width: ${dbuiAutoScrollBorderBottomWidth};` : ''}
        ${dbuiAutoScrollBorderLeftWidth ? `border-left-width: ${dbuiAutoScrollBorderLeftWidth};` : ''}
        ${dbuiAutoScrollPadding ? `padding: ${dbuiAutoScrollPadding};` : ''}
        ${dbuiAutoScrollCustomSliderThickness ? `--dbui-auto-scroll-custom-slider-thickness: ${dbuiAutoScrollCustomSliderThickness};` : ''}
      }
      
      #scrollable-content {
        background-color: rgba(0, 0, 255, 0.2);
        min-width: ${scrollableContentMinWidth};
        min-height: ${scrollableContentMinHeight};
        ${scrollableContentBorder ? `border: ${scrollableContentBorder};` : ''}
        ${scrollableContentPadding ? `padding: ${scrollableContentPadding};` : ''}
        margin: 0; padding: 0;
      }
      
      #scrollable-content-editable-content {
        min-height: 0px;
        background-color: rgba(0, 0, 0, .2);
        /* border: 1px solid red; */
        line-height: 18px;
        font-size: 18px;
        outline: none;
        padding: 0px;
        margin: 0px;
      }
  `,
    bodyHTML: `
      <dbui-web-component-root>
        <div id="container">
          <div id="locale-provider" dir="${dir}"></div>
          <div id="wrapper-auto-scroll">
            <dbui-dummy-one id="dummy-one" sync-locale-with="#locale-provider">
            <dbui-draggable id="dbui-draggable" style="position: absolute; z-index: 1;">drag</dbui-draggable>
            <dbui-auto-scroll
            sync-locale-with="#locale-provider"
            id="dbui-auto-scroll"
            ${hScroll ? `h-scroll="${hScroll}"` : ''}
            ${vScroll ? `v-scroll="${vScroll}"` : ''}
            ${overflow ? `overflow="${overflow}"` : ''}
            ${scrollbars ? `scrollbars="${scrollbars}"` : ''}
            ${percentPrecision ? `percent-precision="${percentPrecision}"` : ''}
            ${native ? 'native' : ''}
            ${hWheel ? 'h-wheel' : ''}
            debug-show-value
            >
              <div id="scrollable-content">
                ${scrollableContentContent ? `<div id="scrollable-content-content">${scrollableContentContent}</div>` : ''}
                ${scrollableContentEditableContent ? `<pre id="scrollable-content-editable-content" contentEditable="true">${scrollableContentEditableContent}</pre>` : ''}
              </div>
            </dbui-auto-scroll>
          </div>
        </div>
      </dbui-web-component-root>
  `,
    onLoad: ({ contentWindow, iframe }) => {
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
        DBUIWebComponentRoot.registrationName,
      ].map((localName) => contentWindow.customElements.whenDefined(localName)
      )).then(() => {

        const draggable = contentWindow.document.querySelector('#dbui-draggable');
        const autoScroll = contentWindow.document.querySelector('#dbui-auto-scroll');
        const autoScrollNative = autoScroll.shadowRoot.querySelector('dbui-auto-scroll-native');
        const resizeSensorOuter = autoScrollNative.shadowRoot.querySelector('#resize-sensor-outer');
        const scrollableContent = contentWindow.document.querySelector('#scrollable-content');

        draggable.addEventListener('dbui-event-dragmove', (evt) => {
          autoScroll.style.width = `${200 + evt.detail.targetTranslateX}px`;
          autoScroll.style.height = `${200 + evt.detail.targetTranslateY}px`;
        });

        onReady({
          contentWindow, iframe,
          autoScroll, autoScrollNative, resizeSensorOuter, scrollableContent
        });

      });

      DummyOne.registerSelf();
      DBUIDraggable.registerSelf();
      DBUIAutoScroll.registerSelf();
      DBUIWebComponentRoot.registerSelf();
    }
  });
}

describe('DBUIAutoScroll', () => {
  xit('behaves as expected - live testing', (done) => {
    testSetup({
      dir: 'rtl',
      hScroll: 0.05, vScroll: 0.05,
      overflow: 'auto', scrollbars: 'auto', percentPrecision: null,
      native: false, hWheel: false,

      // scrollableContentBorder: '1px solid yellow',
      scrollableContentContent: 'content',
      // scrollableContentEditableContent: editableContent,
      // scrollableContentMinWidth: '0px',
      // scrollableContentMinHeight: '0px',
      onReady: ({
        iframe,
        autoScroll, scrollableContent
      }) => {
        autoScroll.addEventListener('dbui-event-scroll', (evt) => {
          console.log('test dbui-event-scroll', {
            hScroll: evt.target.hScroll,
            vScroll: evt.target.vScroll
          });
        });

        autoScroll.addEventListener('dbui-event-resize', (evt) => {
          console.log('test dbui-event-resize', {
            vScroll: evt.target.vScroll
          });
        });

        setTimeout(() => {
          scrollableContent.style.minHeight = '200px';
          scrollableContent.style.minWidth = '200px';
          // autoScroll.native = true;
          // autoScroll.hScroll = 0.5;
          // autoScroll.dir = 'ltr';
          // autoScroll.overflow = 'scroll';
          // autoScroll.hWheel = true;
          setTimeout(() => {
            // scrollableContent.style.removeProperty('min-height');
            // scrollableContent.style.minHeight = '300px';
            // autoScroll.hScroll = 0.6;
            // autoScroll.native = false;
            // autoScroll.dir = 'rtl';
            // autoScroll.overflow = 'auto';
            // autoScroll.hWheel = false;
            setTimeout(() => {
              setTimeout(() => {
                iframe.remove();
                done();
              }, 55000);
            }, 0);
          }, 1000);
        }, 1000);
      }
    });
  });

  describe('native scroll behavior', () => {
    it.only('adjusts custom sliders position', (done) => {
      testSetup({
        dir: 'rtl',
        hScroll: 0.05, vScroll: 0.05,
        overflow: 'auto', scrollbars: 'auto', percentPrecision: null,
        native: false, hWheel: false,
        onReady: ({
          iframe,
          autoScroll, resizeSensorOuter
        }) => {
          autoScroll.addEventListener('dbui-event-ready', (evt) => {
            const scrollableWidth = resizeSensorOuter.scrollWidth - resizeSensorOuter.clientWidth;
            console.log('test dbui-event-ready', scrollableWidth);
            // resizeSensorOuter.scrollTop = 10;
            resizeSensorOuter.scrollLeft = resizeSensorOuter.hasNegativeRTLScroll ? -10 : scrollableWidth - 10;
            // autoScroll.vScroll = 0.9;
          });

          // scroll is not triggered always in mozilla/safari
          autoScroll.addEventListener('dbui-event-scroll', (evt) => {
            console.log('test dbui-event-scroll', {
              hScroll: evt.target.hScroll,
              vScroll: evt.target.vScroll
            });
          });

          setTimeout(() => {
            iframe.remove();
            done();
          }, 55000);
        }
      });
    });
  });
});
