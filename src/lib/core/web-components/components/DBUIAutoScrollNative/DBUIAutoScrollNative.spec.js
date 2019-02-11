import { expect } from 'chai';
import inIframe from '../../../../../../testUtils/inIframe';
import getDBUIAutoScrollNative from './DBUIAutoScrollNative';
import dbuiWebComponentsSetUp from '../../helpers/dbuiWebComponentsSetup';

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
            <div id="scrollable-content">${content}</div>
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
          // const wrapperAutoScrollNative = contentWindow.document.querySelector('#wrapper-auto-scroll-native');
          // const autoScrollNative = contentWindow.document.querySelector('#dbui-auto-scroll-native');
          const localeProvider = contentWindow.document.querySelector('#locale-provider');
          const scrollableContent = contentWindow.document.querySelector('#scrollable-content');
          const dynamicContent = contentWindow.document.createElement('div');
          dynamicContent.style.cssText = `
          /*width: 201px;
          height: 201px;*/
          background-color: gray;
          border: 1px solid red;
          `;
          dynamicContent.innerText = `LkkkkkkkkkkkkkkkkkkkkkkR
          
          
          
          
          
          
          
          
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
            localeProvider.dir = 'rtl';
            setTimeout(() => {
              localeProvider.dir = 'ltr';
              // dynamicContent.remove();
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
          <div id="container">
            <dbui-auto-scroll-native
            id="dbui-auto-scroll-native"
            overflow="auto" 
            ></dbui-auto-scroll-native>
          </div>
      `,
      onLoad: ({ contentWindow, iframe }) => {
        const DBUIAutoScrollNative = getDBUIAutoScrollNative(contentWindow);
        const autoScrollNative = contentWindow.document.querySelector('#dbui-auto-scroll-native');
        Promise.all([
          DBUIAutoScrollNative.registrationName,
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
      }
    });
  });

  describe('vNativeSliderThickness, hNativeSliderThickness', () => {
    it('returns the thickness of native h/v scrolls', (done) => {
      inIframe({
        headStyle: `
        `,
        bodyHTML: `
            <dbui-auto-scroll-native
            id="dbui-auto-scroll-native"
            overflow="scroll" 
            ></dbui-auto-scroll-native>
        </div>
        `,
        onLoad: ({ contentWindow, iframe }) => {
          const DBUIAutoScrollNative = getDBUIAutoScrollNative(contentWindow);
          const autoScrollNative = contentWindow.document.querySelector('#dbui-auto-scroll-native');
          Promise.all([
            DBUIAutoScrollNative.registrationName,
          ].map((localName) => contentWindow.customElements.whenDefined(localName)
          )).then(() => {
            expect(autoScrollNative.vNativeSliderThickness).to.equal(autoScrollNative.hNativeSliderThickness);
            expect(autoScrollNative.vNativeSliderThickness).to.be.within(0, 25);

            setTimeout(() => {
              iframe.remove();
              done();
            }, 0);
          });

          DBUIAutoScrollNative.registerSelf();
        }
      });
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
          <div id="wrapper-auto-scroll-native">
            <dbui-auto-scroll-native id="dbui-auto-scroll-native" style="_overflow: hidden;">
              <div id="scrollable-content"></div>
            </dbui-auto-scroll-native>
          </div>
        `,
        onLoad: ({ contentWindow, iframe }) => {
          const DBUIAutoScrollNative = getDBUIAutoScrollNative(contentWindow);
          const wrapperAutoScrollNative = contentWindow.document.querySelector('#wrapper-auto-scroll-native');
          const autoScrollNative = contentWindow.document.querySelector('#dbui-auto-scroll-native');
          const scrollableContent = contentWindow.document.querySelector('#scrollable-content');
          Promise.all([
            DBUIAutoScrollNative.registrationName,
          ].map((localName) => contentWindow.customElements.whenDefined(localName)
          )).then(() => {

            // Setting style.overflow at runtime does not work well in mozilla.
            // It makes DBUIAutoScrollNative#resize-sensor-content "resize" event to NOT fire.
            // To work with mozilla overflow must be set in html style.
            // autoScrollNative.style.overflow = 'scroll'; // do not use

            function onAutoScrollExpand(evt) {
              const { width, height, contentWidth, contentHeight } = evt.detail;
              expect(width).to.equal(200);
              expect(height).to.equal(199);
              expect(contentWidth).to.equal(50);
              expect(contentHeight).to.equal(50);
              autoScrollNative.removeEventListener('resize', onAutoScrollExpand);
              // AutoScrollShrink
              setTimeout(() => {
                autoScrollNative.addEventListener('resize', onAutoScrollShrink);
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
              autoScrollNative.removeEventListener('resize', onAutoScrollShrink);
              // ContentExpand
              setTimeout(() => {
                autoScrollNative.addEventListener('resize', onContentExpand);
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
              autoScrollNative.removeEventListener('resize', onContentExpand);
              // ContentShrink
              setTimeout(() => {
                autoScrollNative.addEventListener('resize', onContentShrink);
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
              autoScrollNative.removeEventListener('resize', onContentShrink);
              setTimeout(() => {
                autoScrollNative.remove();
                iframe.remove();
                done();
              }, 0);
            }

            // AutoScrollExpand
            autoScrollNative.addEventListener('resize', onAutoScrollExpand);

            setTimeout(() => {
              wrapperAutoScrollNative.style.width = '200px';
              wrapperAutoScrollNative.style.height = '199px';
            }, 0);
          });

          DBUIAutoScrollNative.registerSelf();
        }
      });
    });
  });
});
