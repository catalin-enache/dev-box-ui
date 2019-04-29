import { expect } from 'chai';
import inIframe from '../../../../../../../testUtils/inIframe';
import getDBUIWebComponentRoot from '../../DBUIWebComponentRoot/DBUIWebComponentRoot';
import getDBUIAutoScrollNative from '../DBUIAutoScrollNative';
import dbuiWebComponentsSetUp from '../../../helpers/dbuiWebComponentsSetup';
// import onScreenConsole from '../../../../utils/onScreenConsole';

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
      <dbui-web-component-root id="dbui-web-component-root">
        <div id="container">
          <div id="locale-provider" dir="rtl"></div>
          <div id="wrapper-auto-scroll-native">
            <dbui-auto-scroll-native id="dbui-auto-scroll-native" overflow="auto" sync-locale-with="#locale-provider" h-scroll="1" v-scroll="1">
              <!--<div id="scrollable-content">${content}</div>-->
              <div id="scrollable-content">
                <dbui-auto-scroll-native id="inner-scroll">
                  <div style="width: 500px; height: 500px; background-color: #0C9A9A;"></div>
                </dbui-auto-scroll-native>
              </div>
              <input type="text" />
            </dbui-auto-scroll-native>
          </div>
        </div>
      </dbui-web-component-root>
      `,

      onLoad: ({ contentWindow, iframe }) => {
        const DBUIRoot = getDBUIWebComponentRoot(contentWindow);
        const DBUIAutoScrollNative = getDBUIAutoScrollNative(contentWindow);
        dbuiWebComponentsSetUp(contentWindow)([{
          registrationName: DBUIAutoScrollNative.registrationName,
          componentStyle: `
          `
        }]);

        Promise.all([
          DBUIRoot.registrationName,
        ].map((localName) => contentWindow.customElements.whenDefined(localName)
        )).then(() => {
          // const wrapperAutoScrollNative = contentWindow.document.querySelector('#wrapper-auto-scroll-native');
          const autoScrollNative = contentWindow.document.querySelector('#dbui-auto-scroll-native');
          // const localeProvider = contentWindow.document.querySelector('#locale-provider');
          const scrollableContent = contentWindow.document.querySelector('#scrollable-content');

          autoScrollNative.addEventListener('dbui-event-scroll', (evt) => {
            console.log('test autoScrollNative scroll', {
              hScroll: evt.target.hScroll,
              vScroll: evt.target.vScroll
            });
          });

          const dynamicContent = contentWindow.document.createElement('div');
          dynamicContent.style.cssText = `
          /*width: 201px;
          height: 201px;*/
          background-color: gray;
          border: 1px solid red;
          `;
          dynamicContent.innerText = `LkkkkkkkkkkkkkkkkkkkkkkR
          
          
          
          
          
          
          
          
          `;
          dynamicContent.setAttribute('contenteditable', 'true');
          scrollableContent.appendChild(dynamicContent);
          // autoScrollNative.remove();

          setTimeout(() => {
            // wrapperAutoScrollNative.appendChild(autoScrollNative);
            // autoScrollNative.style.width = '350px';
            // localeProvider.dir = 'ltr';
            // autoScrollNative.hScroll = 0.6;
            // autoScrollNative.vScroll = 0.6;
            setTimeout(() => {
              // autoScrollNative.style.width = '200px';
              // localeProvider.dir = 'rtl';
              // dynamicContent.remove();
              // autoScrollNative.hScroll = 0.6;
              // autoScrollNative.vScroll = 0.6;
              setTimeout(() => {
                setTimeout(() => {
                  iframe.remove();
                  done();
                }, 55000);
              }, 0);
            }, 3000);
          }, 3000);
        });

        DBUIAutoScrollNative.registerSelf();
        DBUIRoot.registerSelf();
      }
    });
  });

  it('has default overflow', (done) => {
    inIframe({
      headStyle: `
      `,
      bodyHTML: `
      <dbui-web-component-root id="dbui-web-component-root">
        <dbui-auto-scroll-native
        id="dbui-auto-scroll-native" 
        ></dbui-auto-scroll-native>
      </dbui-web-component-root>
      `,
      onLoad: ({ contentWindow, iframe }) => {
        const DBUIRoot = getDBUIWebComponentRoot(contentWindow);
        const DBUIAutoScrollNative = getDBUIAutoScrollNative(contentWindow);
        Promise.all([
          DBUIRoot.registrationName,
        ].map((localName) => contentWindow.customElements.whenDefined(localName)
        )).then(() => {
          const autoScrollNative = contentWindow.document.querySelector('#dbui-auto-scroll-native');
          expect(autoScrollNative.overflow).to.equal('scroll');

          setTimeout(() => {
            iframe.remove();
            done();
          }, 0);
        });

        DBUIAutoScrollNative.registerSelf();
        DBUIRoot.registerSelf();
      }
    });
  });

  it('can set overflow from attribute or property', (done) => {
    inIframe({
      headStyle: `
      `,
      bodyHTML: `
      <dbui-web-component-root id="dbui-web-component-root">
        <dbui-auto-scroll-native
        id="dbui-auto-scroll-native"
        overflow="auto" 
        ></dbui-auto-scroll-native>
      </dbui-web-component-root>
      `,
      onLoad: ({ contentWindow, iframe }) => {
        const DBUIRoot = getDBUIWebComponentRoot(contentWindow);
        const DBUIAutoScrollNative = getDBUIAutoScrollNative(contentWindow);
        const autoScrollNative = contentWindow.document.querySelector('#dbui-auto-scroll-native');
        Promise.all([
          DBUIRoot.registrationName,
        ].map((localName) => contentWindow.customElements.whenDefined(localName)
        )).then(() => {
          expect(autoScrollNative.overflow).to.equal('auto');
          // Setting unsupported value will set empty string value
          // which when being read will return the default.
          autoScrollNative.overflow = 'whatever';
          expect(autoScrollNative.overflow).to.equal('scroll');
          autoScrollNative.overflow = 'auto';
          expect(autoScrollNative.overflow).to.equal('auto');

          setTimeout(() => {
            iframe.remove();
            done();
          }, 0);
        });

        DBUIAutoScrollNative.registerSelf();
        DBUIRoot.registerSelf();
      }
    });
  });

  it('can set h-scroll, v-scroll from attribute or property', (done) => {
    inIframe({
      headStyle: `
      #dbui-auto-scroll-native {
        width: 100px;
        height: 100px;
      }
      #content {
        width: 200px;
        height: 200px;
      }
      `,
      bodyHTML: `
      <dbui-web-component-root id="dbui-web-component-root">
        <dbui-auto-scroll-native
        id="dbui-auto-scroll-native"
        h-scroll="1"
        >
        <div id="content"></div>
        </dbui-auto-scroll-native>
      </dbui-web-component-root>
      `,
      onLoad: ({ contentWindow, iframe }) => {
        // onScreenConsole();
        const DBUIRoot = getDBUIWebComponentRoot(contentWindow);
        const DBUIAutoScrollNative = getDBUIAutoScrollNative(contentWindow);
        const autoScrollNative = contentWindow.document.querySelector('#dbui-auto-scroll-native');
        autoScrollNative.vScroll = '1';

        function scrollOccurred() {
          autoScrollNative.removeEventListener('dbui-event-scroll-occurred', scrollOccurred);

          // const resizeOuter = autoScrollNative.shadowRoot.querySelector('#resize-sensor-outer');
          // on Chrome on Android scrollTop, scrollLeft is a decimal number: 99.98...
          // even is explicitly set to integer 100

          expect(autoScrollNative.scrollTop).to.equal(100 + autoScrollNative.vNativeScrollbarThickness);
          expect(autoScrollNative.scrollLeft).to.equal(100 + autoScrollNative.hNativeScrollbarThickness);

          autoScrollNative.hScroll = 0;
          autoScrollNative.vScroll = 0;

          expect(autoScrollNative.scrollTop).to.equal(0);
          expect(autoScrollNative.scrollLeft).to.equal(0);

          setTimeout(() => {
            iframe.remove();
            done();
          }, 0);
        }
        autoScrollNative.addEventListener('dbui-event-scroll-occurred', scrollOccurred);

        Promise.all([
          DBUIRoot.registrationName,
        ].map((localName) => contentWindow.customElements.whenDefined(localName)
        )).then(() => {
          // pass
        });

        DBUIAutoScrollNative.registerSelf();
        DBUIRoot.registerSelf();
      }
    });
  });

  it('dispatches scroll event on scroll', (done) => {
    inIframe({
      headStyle: `
      #dbui-auto-scroll-native {
        width: 100px;
        height: 100px;
      }
      #content {
        width: 200px;
        height: 200px;
      }
      `,
      bodyHTML: `
      <dbui-web-component-root id="dbui-web-component-root">
        <dbui-auto-scroll-native
        id="dbui-auto-scroll-native"
        h-scroll="1" 
        v-scroll="1" 
        >
        <div id="content"></div>
        </dbui-auto-scroll-native>
      </dbui-web-component-root>
      `,
      onLoad: ({ contentWindow, iframe }) => {
        const DBUIRoot = getDBUIWebComponentRoot(contentWindow);
        const DBUIAutoScrollNative = getDBUIAutoScrollNative(contentWindow);
        const autoScrollNative = contentWindow.document.querySelector('#dbui-auto-scroll-native');
        Promise.all([
          DBUIRoot.registrationName,
        ].map((localName) => contentWindow.customElements.whenDefined(localName)
        )).then(() => {

          // const resizeOuter = autoScrollNative.shadowRoot.querySelector('#resize-sensor-outer');

          setTimeout(() => {
            autoScrollNative.addEventListener('dbui-event-scroll', () => {
              expect(autoScrollNative.scrollTop).to.equal(100 + autoScrollNative.vNativeScrollbarThickness);
              expect(autoScrollNative.scrollLeft).to.equal(100 + autoScrollNative.hNativeScrollbarThickness);
              iframe.remove();
              done();
            });
            autoScrollNative._onScroll();

          }, 0);
        });

        DBUIAutoScrollNative.registerSelf();
        DBUIRoot.registerSelf();
      }
    });
  });

  it('is locale aware', (done) => {
    inIframe({
      headStyle: `
      #dbui-auto-scroll-native {
        width: 100px;
        height: 100px;
      }
      #content {
        width: 200px;
        height: 200px;
      }
      `,
      bodyHTML: `
      <dbui-web-component-root id="dbui-web-component-root">
        <dbui-auto-scroll-native
        id="dbui-auto-scroll-native"
        h-scroll="1" 
        v-scroll="1"
        dir="rtl"
        >
        <div id="content"></div>
        </dbui-auto-scroll-native>
      </dbui-web-component-root>
      `,
      onLoad: ({ contentWindow, iframe }) => {
        const DBUIRoot = getDBUIWebComponentRoot(contentWindow);
        const DBUIAutoScrollNative = getDBUIAutoScrollNative(contentWindow);
        const autoScrollNative = contentWindow.document.querySelector('#dbui-auto-scroll-native');
        Promise.all([
          DBUIRoot.registrationName,
        ].map((localName) => contentWindow.customElements.whenDefined(localName)
        )).then(() => {

          const resizeOuter = autoScrollNative.shadowRoot.querySelector('#resize-sensor-outer');

          setTimeout(() => {
            autoScrollNative.addEventListener('dbui-event-scroll', () => {
              if (autoScrollNative.hasNegativeRTLScroll) {
                expect(Math.round(resizeOuter.scrollLeft)).to.equal(-(100 + autoScrollNative.hNativeScrollbarThickness));
                expect(autoScrollNative.scrollLeft).to.equal((100 + autoScrollNative.hNativeScrollbarThickness));
              } else {
                expect(Math.round(resizeOuter.scrollLeft)).to.equal(0);
                expect(autoScrollNative.scrollLeft).to.equal((100 + autoScrollNative.hNativeScrollbarThickness));
              }
              autoScrollNative.dir = 'ltr';
              expect(Math.round(resizeOuter.scrollLeft)).to.equal(100 + autoScrollNative.hNativeScrollbarThickness);
              expect(autoScrollNative.scrollLeft).to.equal(100 + autoScrollNative.hNativeScrollbarThickness);

              iframe.remove();
              done();
            });
            autoScrollNative._onScroll();
          }, 0);
        });

        DBUIAutoScrollNative.registerSelf();
        DBUIRoot.registerSelf();
      }
    });
  });

  it('expands by default to fill the parent node', (done) => {
    inIframe({
      headStyle: `
      #container {
        width: 200px;
        height: 150px;
      }
      `,
      bodyHTML: `
      <dbui-web-component-root id="dbui-web-component-root">
        <div id="container">
          <dbui-auto-scroll-native
          id="dbui-auto-scroll-native"
          overflow="auto" 
          ></dbui-auto-scroll-native>
        </div>
      </dbui-web-component-root>
      `,
      onLoad: ({ contentWindow, iframe }) => {
        const DBUIRoot = getDBUIWebComponentRoot(contentWindow);
        const DBUIAutoScrollNative = getDBUIAutoScrollNative(contentWindow);
        const autoScrollNative = contentWindow.document.querySelector('#dbui-auto-scroll-native');
        Promise.all([
          DBUIRoot.registrationName,
        ].map((localName) => contentWindow.customElements.whenDefined(localName)
        )).then(() => {
          expect(autoScrollNative.scrollWidth).to.equal(200);
          expect(autoScrollNative.scrollHeight).to.equal(150);

          setTimeout(() => {
            iframe.remove();
            done();
          }, 0);
        });

        DBUIAutoScrollNative.registerSelf();
        DBUIRoot.registerSelf();
      }
    });
  });

  describe('onResize - either auto-scroll or inner content', () => {
    it('dispatches resize event', (done) => {
      inIframe({
        headStyle: `
        body {
          background-color: rgba(0, 255, 0, 0.2);
        }
        
        #wrapper-auto-scroll-native {
          width: 100px;
          height: 100px;
          outline: 1px solid maroon;
        }
        
        #scrollable-content {
          width: 50px;
          height: 50px;
          outline: 1px solid green;
        }
        `,
        bodyHTML: `
        <dbui-web-component-root id="dbui-web-component-root">
          <div id="wrapper-auto-scroll-native">
            <dbui-auto-scroll-native id="dbui-auto-scroll-native" style="_overflow: hidden;">
              <div id="scrollable-content"></div>
            </dbui-auto-scroll-native>
          </div>
        </dbui-web-component-root>
        `,
        onLoad: ({ contentWindow, iframe }) => {
          const DBUIRoot = getDBUIWebComponentRoot(contentWindow);
          const DBUIAutoScrollNative = getDBUIAutoScrollNative(contentWindow);
          const wrapperAutoScrollNative = contentWindow.document.querySelector('#wrapper-auto-scroll-native');
          const autoScrollNative = contentWindow.document.querySelector('#dbui-auto-scroll-native');
          const scrollableContent = contentWindow.document.querySelector('#scrollable-content');
          Promise.all([
            DBUIRoot.registrationName,
          ].map((localName) => contentWindow.customElements.whenDefined(localName)
          )).then(() => {

            function onAutoScrollExpand(evt) {
              const { width, height, contentWidth, contentHeight } = evt.detail;
              expect(width).to.equal(200);
              expect(height).to.equal(199);
              expect(contentWidth).to.equal(50);
              expect(contentHeight).to.equal(50);
              autoScrollNative.removeEventListener('dbui-event-resize', onAutoScrollExpand);
              // AutoScrollShrink
              setTimeout(() => {
                autoScrollNative.addEventListener('dbui-event-resize', onAutoScrollShrink);
                wrapperAutoScrollNative.style.width = '95px';
                wrapperAutoScrollNative.style.height = '94px';
              }, 0);
            }

            function onAutoScrollShrink(evt) {
              const { width, height, contentWidth, contentHeight } = evt.detail;
              expect(width).to.equal(95);
              expect(height).to.equal(94);
              expect(contentWidth).to.equal(50);
              expect(contentHeight).to.equal(50);
              autoScrollNative.removeEventListener('dbui-event-resize', onAutoScrollShrink);
              // ContentExpand
              setTimeout(() => {
                autoScrollNative.addEventListener('dbui-event-resize', onContentExpand);
                scrollableContent.style.width = '102px';
                scrollableContent.style.height = '101px';
              }, 0);
            }

            function onContentExpand(evt) {
              const { width, height, contentWidth, contentHeight } = evt.detail;
              expect(width).to.equal(95);
              expect(height).to.equal(94);
              expect(contentWidth).to.equal(102);
              expect(contentHeight).to.equal(101);
              autoScrollNative.removeEventListener('dbui-event-resize', onContentExpand);
              // ContentShrink
              setTimeout(() => {
                autoScrollNative.addEventListener('dbui-event-resize', onContentShrink);
                scrollableContent.style.width = '50px';
                scrollableContent.style.height = '49px';
              }, 0);
            }

            function onContentShrink(evt) {
              const { width, height, contentWidth, contentHeight } = evt.detail;
              expect(width).to.equal(95);
              expect(height).to.equal(94);
              expect(contentWidth).to.equal(50);
              expect(contentHeight).to.equal(49);
              autoScrollNative.removeEventListener('dbui-event-resize', onContentShrink);
              setTimeout(() => {
                autoScrollNative.remove();
                iframe.remove();
                done();
              }, 0);
            }

            // AutoScrollExpand
            autoScrollNative.addEventListener('dbui-event-resize', onAutoScrollExpand);

            setTimeout(() => {
              wrapperAutoScrollNative.style.width = '200px';
              wrapperAutoScrollNative.style.height = '199px';
            }, 0);
          });

          DBUIAutoScrollNative.registerSelf();
          DBUIRoot.registerSelf();
        }
      });
    });
  });
});
