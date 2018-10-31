import { expect } from 'chai';
import inIframe from '../../../../../../testUtils/inIframe';
import getDBUIDraggable, {
  extractSingleEvent, getElementBeingDragged
} from './DBUIDraggable';
import {
  sendTapEvent,
  sendTouchEvent,
  sendMouseEvent
} from '../../../../../../testUtils/simulateEvents';
import getDBUIWebComponentCore from '../DBUIWebComponentCore/DBUIWebComponentCore';
import ensureSingleRegistration from '../../../internals/ensureSingleRegistration';

const dummyCompRegistrationName = 'dummy-comp';
function getDummyComp(win) {
  return ensureSingleRegistration(win, dummyCompRegistrationName, () => {
    const {
      DBUIWebComponentBase,
      defineCommonStaticMethods,
      Registerable
    } = getDBUIWebComponentCore(win);

    const DBUIDraggable = getDBUIDraggable(win);

    class DummyComp extends DBUIWebComponentBase {

      static get registrationName() {
        return dummyCompRegistrationName;
      }

      static get dependencies() {
        return [...super.dependencies, DBUIDraggable];
      }

      static get templateInnerHTML() {
        return `
          <style></style>
          <div>
            <div id="one">draggable</div>
            <dbui-draggable drag-target="#one">
              <p>dragger</p>
            </dbui-draggable>
          </div>
        `;
      }
    }

    return Registerable(
      defineCommonStaticMethods(
        DummyComp
      )
    );
  });
}
getDummyComp.registrationName = dummyCompRegistrationName;

describe('DBUIDraggable', () => {
  xit('behaves as expected - live testing', (done) => {
    inIframe({
      headStyle: `
      body, html { padding: 0px; margin: 0px; }
      p {
        width: 300px;
        height: 100px;
      }
      
      #container {
        position: relative;
      }
      
      #wrapper-draggable-one, #wrapper-draggable-two, #wrapper-draggable-three, #wrapper-draggable-four {
        position: absolute;
        width: 500px;
        height: 180px;
        border: 5px solid green;
      }
      
      #wrapper-draggable-one {
        width: 450px;
        height: 160px;
      }
      
      #wrapper-draggable-one { top: 0px;}
      
      #wrapper-draggable-two { top: 200px;}
      
      #wrapper-draggable-three { top: 400px; }
      
      dbui-draggable {
        border: 5px solid #ddd;
      }
      
      #draggable-two {
        position: absolute;
        left: 5px;
      }
      
      #wrapper-draggable-four {
        position: relative;
        width: 350px;
        height: 350px;
        top: 600px;
        border-radius: 1000px;
      }
      #wrapper-draggable-four .center {
        border: 1px solid red;
        position: absolute;
        width: 2px;
        height: 2px;
        left: 174px;
        top: 174px;
      }
      
      #draggable-four {
        width: 100px;
        height: 100px;
        /* border-radius: 1000px; */
      }
      `,
      bodyHTML: `
      <span id="locale-provider" dir="rtl"></span>
      <div id="container">

        <div id="wrapper-draggable-one" dir="rtl">
          <dbui-draggable id="draggable-one" drag-target="#wrapper-draggable-one" target-translate-x="10" target-translate-y="10">
            <p id="draggable-two-content">draggable content 1</p>
          </dbui-draggable>
        </div>
        
        <div id="wrapper-draggable-two">
          <dbui-draggable id="draggable-two" sync-locale-with="#locale-provider">
            <p id="draggable-two-content">draggable content 2</p>
          </dbui-draggable>
        </div>
        
        <div id="wrapper-draggable-three">
          <dbui-draggable id="draggable-three" dir="rtl">
            <p id="draggable-three-content">draggable content 3</p>
          </dbui-draggable>
        </div>
        
        <div id="wrapper-draggable-four">
          <dbui-draggable id="draggable-four">
            <p>4</p>
          </dbui-draggable>
          <div class="center"></div>
        </div>
        
        <div style="height: 300px; position: absolute; top: 700px; border: 1px solid black;"></div>

      </div>
      
      `,
      onLoad: ({ contentWindow, iframe }) => {
        const DBUIDraggable = getDBUIDraggable(contentWindow);

        // const container = contentWindow.document.querySelector('#container');
        // const wrapperDraggableOne = contentWindow.document.querySelector('#wrapper-draggable-one');
        // const wrapperDraggableTwo = contentWindow.document.querySelector('#wrapper-draggable-two');
        // const wrapperDraggableThree = contentWindow.document.querySelector('#wrapper-draggable-three');
        // const wrapperDraggableFour = contentWindow.document.querySelector('#wrapper-draggable-four');

        // const draggableOne = contentWindow.document.querySelector('#draggable-one');
        const draggableTwo = contentWindow.document.querySelector('#draggable-two');
        // const draggableThree = contentWindow.document.querySelector('#draggable-three');
        const draggableFour = contentWindow.document.querySelector('#draggable-four');

        draggableTwo.constraint =
          'boundingClientRectOf({ "selector": "#wrapper-draggable-one", "stepsX": 3, "stepsY": 3})';

        draggableFour.constraint =
          'circle({ "cx": 190, "cy":790, "radius":175, "steps": 12 })';

        // draggableOne.addEventListener('translate', (evt) => {
        //   console.log(evt.detail);
        // });
        //
        // draggableTwo.addEventListener('translate', (evt) => {
        //   console.log(evt.detail);
        // });
        //
        // draggableThree.addEventListener('translate', (evt) => {
        //   console.log(evt.detail);
        // });
        //
        // draggableFour.addEventListener('translate', (evt) => {
        //   console.log(evt.detail);
        // });

        Promise.all([
          DBUIDraggable.registrationName,
        ].map((localName) => contentWindow.customElements.whenDefined(localName)
        )).then(() => {
          setTimeout(() => {
            setTimeout(() => {
              iframe.remove();
              done();
            }, 2000);
          }, 55000);
        });

        DBUIDraggable.registerSelf();
      }
    });
  });

  it('is dragged on pointer move (touch first)', (done) => {
    inIframe({
      headStyle: `
      body, html { padding: 0px; margin: 0px; }
      #container: { position: relative; }
      #wrapper-draggable-one {
        position: absolute;
        top: 5px;
        left: 5px;
        background: gray;
      }
      #draggable-one-content {
        background: indianred;
        width: 100px;
        height: 100px;
      }
      `,
      bodyHTML: `
      <div id="container">
        <div id="wrapper-draggable-one">
          <dbui-draggable id="draggable-one">
            <div id="draggable-one-content"></div>
          </dbui-draggable>
        </div>
      </div>
      `,
      onLoad: ({ contentWindow, iframe }) => {
        const DBUIDraggable = getDBUIDraggable(contentWindow);
        const draggableOne = contentWindow.document.querySelector('#draggable-one');
        Promise.all([
          DBUIDraggable.registrationName,
        ].map((localName) => contentWindow.customElements.whenDefined(localName)
        )).then(() => {

          const doTest = (evt) => {
            expect(evt.detail).to.eql({
              pointerX: 15,
              pointerXOnStart: 5,
              pointerY: 15,
              pointerYOnStart: 5,
              targetHeightOnStart: 100,
              targetOriginalX: 5,
              targetOriginalY: 5,
              targetTranslateX: 10,
              targetTranslateY: 10,
              targetTranslatedXOnStart: 0,
              targetTranslatedYOnStart: 0,
              targetWidthOnStart: 100,
              targetX: 15,
              targetXOnStart: 5,
              targetY: 15,
              targetYOnStart: 5
            });
          };

          let translateEvent = null;
          draggableOne.addEventListener('translate', (evt) => {
            translateEvent = evt;
          });

          contentWindow.requestAnimationFrame(() => {
            setTimeout(() => {
              contentWindow.TouchEvent ?
                sendTouchEvent(draggableOne, 'touchstart', {
                  clientX: 5, clientY: 5
                }) : sendMouseEvent(draggableOne, 'mousedown', {
                  clientX: 5, clientY: 5
                });
              contentWindow.requestAnimationFrame(() => {
                setTimeout(() => {
                  contentWindow.TouchEvent ?
                    sendTouchEvent(draggableOne.ownerDocument, 'touchmove', {
                      clientX: 15, clientY: 15, target: draggableOne
                    }) : sendMouseEvent(draggableOne, 'mousemove', {
                      clientX: 15, clientY: 15
                    });
                  contentWindow.requestAnimationFrame(() => {
                    setTimeout(() => {
                      contentWindow.TouchEvent ?
                        sendTouchEvent(draggableOne.ownerDocument, 'touchend', {
                          target: draggableOne
                        }) : sendMouseEvent(draggableOne, 'mouseup', {
                          target: draggableOne
                        });
                      contentWindow.requestAnimationFrame(() => {
                        setTimeout(() => {
                          doTest(translateEvent);
                          iframe.remove();
                          done();
                        }, 0);
                      });
                    }, 0);
                  });
                }, 0);
              });
            }, 0);
          });
        });

        DBUIDraggable.registerSelf();
      }
    });
  });

  it('is dragged on pointer move (mouse first)', (done) => {
    inIframe({
      headStyle: `
      body, html { padding: 0px; margin: 0px; }
      #container: { position: relative; }
      #wrapper-draggable-one {
        position: absolute;
        top: 5px;
        left: 5px;
        background: gray;
      }
      #draggable-one-content {
        background: indianred;
        width: 100px;
        height: 100px;
      }
      `,
      bodyHTML: `
      <div id="container">
        <div id="wrapper-draggable-one">
          <dbui-draggable id="draggable-one">
            <div id="draggable-one-content"></div>
          </dbui-draggable>
        </div>
      </div>
      `,
      onLoad: ({ contentWindow, iframe }) => {
        const DBUIDraggable = getDBUIDraggable(contentWindow);
        const draggableOne = contentWindow.document.querySelector('#draggable-one');
        Promise.all([
          DBUIDraggable.registrationName,
        ].map((localName) => contentWindow.customElements.whenDefined(localName)
        )).then(() => {

          const doTest = (evt) => {
            expect(evt.detail).to.eql({
              pointerX: 15,
              pointerXOnStart: 5,
              pointerY: 15,
              pointerYOnStart: 5,
              targetHeightOnStart: 100,
              targetOriginalX: 5,
              targetOriginalY: 5,
              targetTranslateX: 10,
              targetTranslateY: 10,
              targetTranslatedXOnStart: 0,
              targetTranslatedYOnStart: 0,
              targetWidthOnStart: 100,
              targetX: 15,
              targetXOnStart: 5,
              targetY: 15,
              targetYOnStart: 5
            });
          };

          let translateEvent = null;
          draggableOne.addEventListener('translate', (evt) => {
            translateEvent = evt;
          });

          contentWindow.requestAnimationFrame(() => {
            setTimeout(() => {
              contentWindow.MouseEvent ?
                sendMouseEvent(draggableOne, 'mousedown', {
                  clientX: 5, clientY: 5
                }) : sendTouchEvent(draggableOne, 'touchstart', {
                  clientX: 5, clientY: 5
                });
              contentWindow.requestAnimationFrame(() => {
                setTimeout(() => {
                  contentWindow.MouseEvent ?
                    sendMouseEvent(draggableOne.ownerDocument, 'mousemove', {
                      clientX: 15, clientY: 15, target: draggableOne
                    }) : sendTouchEvent(draggableOne, 'touchmove', {
                      clientX: 15, clientY: 15, target: draggableOne
                    });
                  contentWindow.requestAnimationFrame(() => {
                    setTimeout(() => {
                      contentWindow.MouseEvent ?
                        sendMouseEvent(draggableOne, 'mouseup', {
                          target: draggableOne
                        }) : sendTouchEvent(draggableOne.ownerDocument, 'touchend', {
                          target: draggableOne
                        });
                      contentWindow.requestAnimationFrame(() => {
                        setTimeout(() => {
                          doTest(translateEvent);
                          iframe.remove();
                          done();
                        }, 0);
                      });
                    }, 0);
                  });
                }, 0);
              });
            }, 0);
          });
        });

        DBUIDraggable.registerSelf();
      }
    });
  });

  it('is dragged on pointer move even move event comes from an inner child (touch first)', (done) => {
    inIframe({
      headStyle: `
      body, html { padding: 0px; margin: 0px; }
      #container: { position: relative; }
      #wrapper-draggable-one {
        position: absolute;
        top: 5px;
        left: 5px;
        background: gray;
      }
      #draggable-one-content {
        background: indianred;
        width: 100px;
        height: 100px;
      }
      `,
      bodyHTML: `
      <div id="container">
        <div id="wrapper-draggable-one">
          <dbui-draggable id="draggable-one">
            <div id="draggable-one-content">
              <span id="draggable-one-content-inner">
                content
              </span>
            </div>
          </dbui-draggable>
        </div>
      </div>
      `,
      onLoad: ({ contentWindow, iframe }) => {
        const DBUIDraggable = getDBUIDraggable(contentWindow);
        const draggableOne = contentWindow.document.querySelector('#draggable-one');
        const draggableOneContentInner = contentWindow.document.querySelector('#draggable-one-content-inner');
        Promise.all([
          DBUIDraggable.registrationName,
        ].map((localName) => contentWindow.customElements.whenDefined(localName)
        )).then(() => {

          const doTest = (evt) => {
            expect(evt.detail).to.eql({
              pointerX: 15,
              pointerXOnStart: 5,
              pointerY: 15,
              pointerYOnStart: 5,
              targetHeightOnStart: 100,
              targetOriginalX: 5,
              targetOriginalY: 5,
              targetTranslateX: 10,
              targetTranslateY: 10,
              targetTranslatedXOnStart: 0,
              targetTranslatedYOnStart: 0,
              targetWidthOnStart: 100,
              targetX: 15,
              targetXOnStart: 5,
              targetY: 15,
              targetYOnStart: 5
            });
          };

          let translateEvent = null;
          draggableOne.addEventListener('translate', (evt) => {
            translateEvent = evt;
          });

          contentWindow.requestAnimationFrame(() => {
            setTimeout(() => {
              contentWindow.TouchEvent ?
                sendTouchEvent(draggableOneContentInner, 'touchstart', {
                  clientX: 5, clientY: 5
                }) : sendMouseEvent(draggableOneContentInner, 'mousedown', {
                  clientX: 5, clientY: 5
                });
              contentWindow.requestAnimationFrame(() => {
                setTimeout(() => {
                  contentWindow.TouchEvent ?
                    sendTouchEvent(draggableOneContentInner.ownerDocument, 'touchmove', {
                      clientX: 15, clientY: 15, target: draggableOneContentInner
                    }) : sendMouseEvent(draggableOneContentInner.ownerDocument, 'mousemove', {
                      clientX: 15, clientY: 15, target: draggableOneContentInner
                    });
                  contentWindow.requestAnimationFrame(() => {
                    setTimeout(() => {
                      contentWindow.TouchEvent ?
                        sendTouchEvent(draggableOneContentInner.ownerDocument, 'touchend', {
                          target: draggableOneContentInner
                        }) : sendMouseEvent(draggableOneContentInner.ownerDocument, 'mouseup', {
                          target: draggableOneContentInner
                        });
                      contentWindow.requestAnimationFrame(() => {
                        setTimeout(() => {
                          doTest(translateEvent);
                          iframe.remove();
                          done();
                        }, 0);
                      });
                    }, 0);
                  });
                }, 0);
              });
            }, 0);
          });
        });

        DBUIDraggable.registerSelf();
      }
    });
  });

  it('is dragged on pointer move even move event comes from an inner child (mouse first)', (done) => {
    inIframe({
      headStyle: `
      body, html { padding: 0px; margin: 0px; }
      #container: { position: relative; }
      #wrapper-draggable-one {
        position: absolute;
        top: 5px;
        left: 5px;
        background: gray;
      }
      #draggable-one-content {
        background: indianred;
        width: 100px;
        height: 100px;
      }
      `,
      bodyHTML: `
      <div id="container">
        <div id="wrapper-draggable-one">
          <dbui-draggable id="draggable-one">
            <div id="draggable-one-content">
              <span id="draggable-one-content-inner">
                content
              </span>
            </div>
          </dbui-draggable>
        </div>
      </div>
      `,
      onLoad: ({ contentWindow, iframe }) => {
        const DBUIDraggable = getDBUIDraggable(contentWindow);
        const draggableOne = contentWindow.document.querySelector('#draggable-one');
        const draggableOneContentInner = contentWindow.document.querySelector('#draggable-one-content-inner');
        Promise.all([
          DBUIDraggable.registrationName,
        ].map((localName) => contentWindow.customElements.whenDefined(localName)
        )).then(() => {

          const doTest = (evt) => {
            expect(evt.detail).to.eql({
              pointerX: 15,
              pointerXOnStart: 5,
              pointerY: 15,
              pointerYOnStart: 5,
              targetHeightOnStart: 100,
              targetOriginalX: 5,
              targetOriginalY: 5,
              targetTranslateX: 10,
              targetTranslateY: 10,
              targetTranslatedXOnStart: 0,
              targetTranslatedYOnStart: 0,
              targetWidthOnStart: 100,
              targetX: 15,
              targetXOnStart: 5,
              targetY: 15,
              targetYOnStart: 5
            });
          };

          let translateEvent = null;
          draggableOne.addEventListener('translate', (evt) => {
            translateEvent = evt;
          });

          contentWindow.requestAnimationFrame(() => {
            setTimeout(() => {
              contentWindow.MouseEvent ?
                sendMouseEvent(draggableOneContentInner, 'mousedown', {
                  clientX: 5, clientY: 5
                }) : sendTouchEvent(draggableOneContentInner, 'touchstart', {
                  clientX: 5, clientY: 5
                });
              contentWindow.requestAnimationFrame(() => {
                setTimeout(() => {
                  contentWindow.MouseEvent ?
                    sendMouseEvent(draggableOneContentInner.ownerDocument, 'mousemove', {
                      clientX: 15, clientY: 15, target: draggableOneContentInner
                    }) : sendTouchEvent(draggableOneContentInner.ownerDocument, 'touchmove', {
                      clientX: 15, clientY: 15, target: draggableOneContentInner
                    });
                  contentWindow.requestAnimationFrame(() => {
                    setTimeout(() => {
                      contentWindow.MouseEvent ?
                        sendMouseEvent(draggableOneContentInner.ownerDocument, 'mouseup', {
                          target: draggableOneContentInner
                        }) : sendTouchEvent(draggableOneContentInner.ownerDocument, 'touchend', {
                          target: draggableOneContentInner
                        });
                      contentWindow.requestAnimationFrame(() => {
                        setTimeout(() => {
                          doTest(translateEvent);
                          iframe.remove();
                          done();
                        }, 0);
                      });
                    }, 0);
                  });
                }, 0);
              });
            }, 0);
          });
        });

        DBUIDraggable.registerSelf();
      }
    });
  });

  it('handles multi touches on target and window', (done) => {
    inIframe({
      headStyle: `
      body, html { padding: 0px; margin: 0px; }
      #container: { position: relative; }
      #wrapper-draggable-one {
        position: absolute;
        top: 5px;
        left: 5px;
        background: gray;
      }
      #draggable-one-content {
        background: indianred;
        width: 100px;
        height: 100px;
      }
      `,
      bodyHTML: `
      <div id="container">
        <div id="other-target"></div>
        <div id="wrapper-draggable-one">
          <dbui-draggable id="draggable-one">
            <div id="draggable-one-content">
              <span id="draggable-one-content-inner">
                content
              </span>
            </div>
          </dbui-draggable>
        </div>
      </div>
      `,
      onLoad: ({ contentWindow, iframe }) => {

        if (!contentWindow.TouchEvent) {
          iframe.remove();
          done();
          return;
        }

        const doc = contentWindow.document;
        let removedEvent = null;
        let eventHandlers = null;
        const docRemoveEventListener = doc.removeEventListener;
        doc.removeEventListener = (event, callback, options) => {
          docRemoveEventListener.call(doc, event, callback, options);
          if (eventHandlers.touchmove === callback) {
            removedEvent = event;
          }
        };

        const DBUIDraggable = getDBUIDraggable(contentWindow);
        const otherTarget = contentWindow.document.querySelector('#other-target');
        const draggableOne = contentWindow.document.querySelector('#draggable-one');
        const draggableOneContentInner = contentWindow.document.querySelector('#draggable-one-content-inner');
        Promise.all([
          DBUIDraggable.registrationName,
        ].map((localName) => contentWindow.customElements.whenDefined(localName)
        )).then(() => {

          const doTest = (evt) => {
            expect(evt.detail).to.eql({
              pointerX: 15,
              pointerXOnStart: 5,
              pointerY: 15,
              pointerYOnStart: 5,
              targetHeightOnStart: 100,
              targetOriginalX: 5,
              targetOriginalY: 5,
              targetTranslateX: 10,
              targetTranslateY: 10,
              targetTranslatedXOnStart: 0,
              targetTranslatedYOnStart: 0,
              targetWidthOnStart: 100,
              targetX: 15,
              targetXOnStart: 5,
              targetY: 15,
              targetYOnStart: 5
            });
          };

          let translateEvent = null;
          draggableOne.addEventListener('translate', (evt) => {
            translateEvent = evt;
          });

          contentWindow.requestAnimationFrame(() => {
            setTimeout(() => {
              sendTouchEvent(draggableOneContentInner, 'touchstart', {
                clientX: 5, clientY: 5
              });
              eventHandlers = contentWindow._dbuiDraggableRegisteredEvents.get(draggableOne);
              contentWindow.requestAnimationFrame(() => {
                setTimeout(() => {
                  sendTouchEvent(draggableOneContentInner.ownerDocument, 'touchmove', {
                    clientX: 15, clientY: 15, target: draggableOneContentInner
                  });
                  contentWindow.requestAnimationFrame(() => {
                    setTimeout(() => {
                      const touchObj1 = new contentWindow.Touch({
                        identifier: new Date(),
                        target: draggableOneContentInner,
                      });
                      const touchObj2 = new contentWindow.Touch({
                        identifier: new Date(),
                        target: otherTarget,
                      });
                      sendTouchEvent(draggableOneContentInner.ownerDocument, 'touchend', {
                        target: draggableOneContentInner, touches: [touchObj1, touchObj2]
                      });
                      // not unregistering listeners from doc since still one touch for draggable on screen
                      expect(removedEvent).to.equal(null);
                      sendTouchEvent(draggableOneContentInner.ownerDocument, 'touchend', {
                        target: draggableOneContentInner, touches: [touchObj2]
                      });
                      // unregistering listeners from doc since no touch for draggable on screen
                      expect(removedEvent).to.equal('touchmove');
                      contentWindow.requestAnimationFrame(() => {
                        setTimeout(() => {
                          doTest(translateEvent);
                          iframe.remove();
                          done();
                        }, 0);
                      });
                    }, 0);
                  });
                }, 0);
              });
            }, 0);
          });
        });

        DBUIDraggable.registerSelf();
      }
    });
  });

  it('is unselectable', (done) => {
    inIframe({
      headStyle: `
      `,
      bodyHTML: `
      <dbui-draggable id="draggable-one">
        <div id="draggable-one-content">content</div>
      </dbui-draggable>
      `,
      onLoad: ({ contentWindow, iframe }) => {
        const DBUIDraggable = getDBUIDraggable(contentWindow);
        const draggableOne = contentWindow.document.querySelector('#draggable-one');
        Promise.all([
          DBUIDraggable.registrationName,
        ].map((localName) => contentWindow.customElements.whenDefined(localName)
        )).then(() => {

          expect(draggableOne.getAttribute('unselectable')).to.equal('');
          draggableOne.remove();
          expect(draggableOne.getAttribute('unselectable')).to.equal(null);

          setTimeout(() => {
            iframe.remove();
            done();
          }, 0);
        });
        expect(draggableOne.getAttribute('unselectable')).to.equal(null);
        DBUIDraggable.registerSelf();
      }
    });
  });

  describe('propertiesToUpgrade', () => {
    it('are upgraded', (done) => {
      inIframe({
        headStyle: `
        `,
        bodyHTML: `
        <dbui-draggable id="draggable-one">
          <div id="draggable-one-content">content</div>
        </dbui-draggable>
        `,
        onLoad: ({ contentWindow, iframe }) => {
          const DBUIDraggable = getDBUIDraggable(contentWindow);
          const draggableOne = contentWindow.document.querySelector('#draggable-one');

          const applyCorrection = function () { return this; };
          const targetTranslateX = 5;
          const targetTranslateY = 6;
          const dragTarget = '#draggable-one';
          const constraint = 'boundingClientRectOf({ "selector": "body"})';

          draggableOne.applyCorrection = applyCorrection;
          draggableOne.targetTranslateX = targetTranslateX;
          draggableOne.targetTranslateY = targetTranslateY;
          draggableOne.dragTarget = dragTarget;
          draggableOne.constraint = constraint;

          Promise.all([
            DBUIDraggable.registrationName,
          ].map((localName) => contentWindow.customElements.whenDefined(localName)
          )).then(() => {

            expect(draggableOne.getAttribute('target-translate-x')).to.equal(`${targetTranslateX}`);
            expect(draggableOne.getAttribute('target-translate-y')).to.equal(`${targetTranslateY}`);
            expect(draggableOne.getAttribute('drag-target')).to.equal(dragTarget);
            expect(draggableOne.getAttribute('constraint')).to.equal(constraint);
            expect(draggableOne.applyCorrection.call(null)).to.equal(draggableOne);
            expect(draggableOne._applyCorrection).to.equal(draggableOne.applyCorrection);

            setTimeout(() => {
              iframe.remove();
              done();
            }, 0);
          });
          DBUIDraggable.registerSelf();
        }
      });
    });
  });

  describe('observedAttributes', () => {
    it('are kept in sync with instance getters', (done) => {
      inIframe({
        headStyle: `
        `,
        bodyHTML: `
        <div id="one"></div>
        <dbui-draggable
          id="draggable-one"
          target-translate-x="1"
          target-translate-y="2"
          drag-target="#one"
          constraint='boundingClientRectOf({ "selector": "body"})'
        >
          <div id="draggable-one-content">content</div>
        </dbui-draggable>
        `,
        onLoad: ({ contentWindow, iframe }) => {
          const DBUIDraggable = getDBUIDraggable(contentWindow);
          const draggableOne = contentWindow.document.querySelector('#draggable-one');

          expect(draggableOne.targetTranslateX).to.equal(undefined);
          expect(draggableOne.targetTranslateY).to.equal(undefined);
          expect(draggableOne.dragTarget).to.equal(undefined);
          expect(draggableOne.constraint).to.equal(undefined);

          Promise.all([
            DBUIDraggable.registrationName,
          ].map((localName) => contentWindow.customElements.whenDefined(localName)
          )).then(() => {

            expect(draggableOne.targetTranslateX).to.equal(1);
            expect(draggableOne.targetTranslateY).to.equal(2);
            expect(draggableOne.dragTarget).to.equal('#one');
            expect(draggableOne.constraint).to.equal('boundingClientRectOf({ "selector": "body"})');

            setTimeout(() => {
              iframe.remove();
              done();
            }, 0);
          });
          DBUIDraggable.registerSelf();
        }
      });
    });
  });

  describe('_targetToDrag', () => {
    it('is cached', (done) => {
      inIframe({
        headStyle: `
        `,
        bodyHTML: `
        <div id="container">
          <div id="one"></div>
        </div>
        `,
        onLoad: ({ contentWindow, iframe }) => {
          const DBUIDraggable = getDBUIDraggable(contentWindow);
          const one = contentWindow.document.querySelector('#one');
          const container = contentWindow.document.querySelector('#container');
          const draggableOne = contentWindow.document.createElement('dbui-draggable');
          draggableOne.id = 'draggable-one';
          draggableOne.dragTarget = '#one';
          draggableOne.innerHTML = `
          <div id="draggable-one-content">content</div>
          `;

          Promise.all([
            DBUIDraggable.registrationName,
          ].map((localName) => contentWindow.customElements.whenDefined(localName)
          )).then(() => {

            expect(draggableOne._cachedTargetToDrag).to.equal(undefined);
            container.appendChild(draggableOne);
            expect(draggableOne._cachedTargetToDrag).to.equal(one);
            draggableOne.remove();
            expect(draggableOne._cachedTargetToDrag).to.equal(null);

            setTimeout(() => {
              iframe.remove();
              done();
            }, 0);
          });
          DBUIDraggable.registerSelf();
        }
      });
    });

    describe('when dragTarget does not exist', () => {
      it('returns self', (done) => {
        inIframe({
          headStyle: `
          `,
          bodyHTML: `
          <dbui-draggable id="draggable-one">
            <div id="draggable-one-content">content</div>
          </dbui-draggable>
          `,
          onLoad: ({ contentWindow, iframe }) => {
            const DBUIDraggable = getDBUIDraggable(contentWindow);
            const draggableOne = contentWindow.document.querySelector('#draggable-one');

            Promise.all([
              DBUIDraggable.registrationName,
            ].map((localName) => contentWindow.customElements.whenDefined(localName)
            )).then(() => {

              expect(draggableOne._targetToDrag).to.equal(draggableOne);

              setTimeout(() => {
                iframe.remove();
                done();
              }, 0);
            });
            DBUIDraggable.registerSelf();
          }
        });
      });
    });

    describe('when DBUIDraggable is in light DOM', () => {
      it('returns element in light DOM', (done) => {
        inIframe({
          headStyle: `
          `,
          bodyHTML: `
          <div id="one"></div>
          <dbui-draggable id="draggable-one" drag-target="#one">
            <div id="draggable-one-content">content</div>
          </dbui-draggable>
          `,
          onLoad: ({ contentWindow, iframe }) => {
            const DBUIDraggable = getDBUIDraggable(contentWindow);
            const one = contentWindow.document.querySelector('#one');
            const draggableOne = contentWindow.document.querySelector('#draggable-one');

            Promise.all([
              DBUIDraggable.registrationName,
            ].map((localName) => contentWindow.customElements.whenDefined(localName)
            )).then(() => {

              expect(draggableOne._targetToDrag).to.equal(one);

              setTimeout(() => {
                iframe.remove();
                done();
              }, 0);
            });
            DBUIDraggable.registerSelf();
          }
        });
      });
    });

    describe('when DBUIDraggable is in shadow DOM', () => {
      it('returns element in shadow DOM', (done) => {
        inIframe({
          headStyle: `
          `,
          bodyHTML: `
          <dummy-comp></dummy-comp>
          `,
          onLoad: ({ contentWindow, iframe }) => {
            const DummyComp = getDummyComp(contentWindow);
            const dummyComp = contentWindow.document.querySelector('dummy-comp');

            Promise.all([
              DummyComp.registrationName,
            ].map((localName) => contentWindow.customElements.whenDefined(localName)
            )).then(() => {

              const shadowDBUIDraggable =
                dummyComp.shadowRoot.querySelector('dbui-draggable');
              const shadowOne =
                dummyComp.shadowRoot.querySelector('#one');
              const _targetToDrag =
                shadowDBUIDraggable._targetToDrag;
              expect(_targetToDrag).to.equal(shadowOne);

              setTimeout(() => {
                iframe.remove();
                done();
              }, 0);
            });
            DummyComp.registerSelf();
          }
        });
      });
    });
  });

  describe('_initializeTargetToDrag and _resetTargetToDrag', () => {
    it(`
     _initializeTargetToDrag adds dbui-draggable-target attribute on target
     and adjusts style.transform on target.
     _resetTargetToDrag removes dbui-draggable-target attribute from target
     and makes _cachedTargetToDrag null.
    `, (done) => {
      inIframe({
        headStyle: `
        `,
        bodyHTML: `
        <div id="container">
          <div id="one"></div>
        </div>
        `,
        onLoad: ({ contentWindow, iframe }) => {
          const DBUIDraggable = getDBUIDraggable(contentWindow);
          const one = contentWindow.document.querySelector('#one');
          const container = contentWindow.document.querySelector('#container');
          const draggableOne = contentWindow.document.createElement('dbui-draggable');
          draggableOne.id = 'draggable-one';
          draggableOne.dragTarget = '#one';
          draggableOne.innerHTML = `
          <div id="draggable-one-content">content</div>
          `;
          draggableOne.targetTranslateX = 1;

          Promise.all([
            DBUIDraggable.registrationName,
          ].map((localName) => contentWindow.customElements.whenDefined(localName)
          )).then(() => {

            expect(one.getAttribute('dbui-draggable-target')).to.equal(null);
            expect(one.style.transform).to.equal('');
            container.appendChild(draggableOne);
            expect(one.getAttribute('dbui-draggable-target')).to.equal('');
            expect(one.style.transform).to.equal('translate(1px, 0px)');
            draggableOne.remove();
            expect(one.getAttribute('dbui-draggable-target')).to.equal(null);

            setTimeout(() => {
              iframe.remove();
              done();
            }, 0);
          });
          DBUIDraggable.registerSelf();
        }
      });
    });
  });

  describe('targetTranslateX/Y getter/setter/attributes', () => {
    it(`
     adjusts style.transform on _targetToDrag.
     getters are kept in sync with attributes.
    `, (done) => {
      inIframe({
        headStyle: `
        `,
        bodyHTML: `
        <div id="container">
          <div id="one"></div>
        </div>
        `,
        onLoad: ({ contentWindow, iframe }) => {
          const DBUIDraggable = getDBUIDraggable(contentWindow);
          const one = contentWindow.document.querySelector('#one');
          const container = contentWindow.document.querySelector('#container');
          const draggableOne = contentWindow.document.createElement('dbui-draggable');
          draggableOne.id = 'draggable-one';
          draggableOne.dragTarget = '#one';
          draggableOne.innerHTML = `
          <div id="draggable-one-content">content</div>
          `;
          draggableOne.targetTranslateX = 1;
          draggableOne.setAttribute('target-translate-y', 1);

          Promise.all([
            DBUIDraggable.registrationName,
          ].map((localName) => contentWindow.customElements.whenDefined(localName)
          )).then(() => {

            container.appendChild(draggableOne);
            expect(one.getAttribute('dbui-draggable-target')).to.equal('');
            expect(one.style.transform).to.equal('translate(1px, 1px)');
            expect(draggableOne.getAttribute('target-translate-x')).to.equal('1');
            expect(draggableOne.targetTranslateY).to.equal(1);

            setTimeout(() => {
              iframe.remove();
              done();
            }, 0);
          });
          DBUIDraggable.registerSelf();
        }
      });
    });
  });

  describe('drag-target dragTarget', () => {
    it(`
    on change it resets old target
    and initializes new target
    `, (done) => {
      inIframe({
        headStyle: `
        `,
        bodyHTML: `
        <div id="one" style="transform: translate(-1px, -2px)"></div>
        <div id="two" style="transform: translate(-2px, -1px)"></div>
        <dbui-draggable id="draggable-one" drag-target="#one" target-translate-x="2">
          <div id="draggable-one-content">content</div>
        </dbui-draggable>
        `,
        onLoad: ({ contentWindow, iframe }) => {
          const DBUIDraggable = getDBUIDraggable(contentWindow);
          const one = contentWindow.document.querySelector('#one');
          const two = contentWindow.document.querySelector('#two');
          const draggableOne = contentWindow.document.querySelector('#draggable-one');

          Promise.all([
            DBUIDraggable.registrationName,
          ].map((localName) => contentWindow.customElements.whenDefined(localName)
          )).then(() => {

            expect(draggableOne._targetToDrag).to.equal(one);
            expect(one.getAttribute('dbui-draggable-target')).to.equal('');
            expect(two.getAttribute('dbui-draggable-target')).to.equal(null);
            expect(one.style.transform).to.equal('translate(2px, 0px)');
            expect(one.style.transformOrigin).to.have.string('center center');
            expect(two.style.transform).to.equal('translate(-2px, -1px)');
            expect(two.style.transformOrigin).to.equal('');

            draggableOne.dragTarget = '#two';
            expect(one.getAttribute('dbui-draggable-target')).to.equal(null);
            expect(two.getAttribute('dbui-draggable-target')).to.equal('');
            expect(one.style.transform).to.equal('translate(-1px, -2px)');
            expect(one.style.transformOrigin).to.equal('');
            expect(two.style.transform).to.equal('translate(2px, 0px)');
            expect(two.style.transformOrigin).to.have.string('center center');

            draggableOne.dragTarget = '#one';
            expect(one.getAttribute('dbui-draggable-target')).to.equal('');
            expect(two.getAttribute('dbui-draggable-target')).to.equal(null);
            expect(one.style.transform).to.equal('translate(2px, 0px)');
            expect(one.style.transformOrigin).to.have.string('center center');
            expect(two.style.transform).to.equal('translate(-2px, -1px)');
            expect(two.style.transformOrigin).to.equal('');

            setTimeout(() => {
              iframe.remove();
              done();
            }, 0);
          });
          DBUIDraggable.registerSelf();
        }
      });
    });
  });

  describe('constraint', () => {
    describe('boundingClientRectOf no steps', () => {
      it('applies moving constraints in the limits of boundingClientRectOf', (done) => {
        inIframe({
          headStyle: `
          body, html { padding: 0px; margin: 0px; }
          #one {
            width: 150px;
            height: 150px;
            background-color: orange;
          }
          #draggable-one {
            width: 50px;
            height: 50px;
            background-color: black;
          }
          `,
          bodyHTML: `
          <div id="one"></div>
          <dbui-draggable id="draggable-one" constraint='boundingClientRectOf({ "selector": "#one" })'>
          </dbui-draggable>
          `,
          onLoad: ({ contentWindow, iframe }) => {
            const DBUIDraggable = getDBUIDraggable(contentWindow);
            const draggableOne = contentWindow.document.querySelector('#draggable-one');

            Promise.all([
              DBUIDraggable.registrationName,
            ].map((localName) => contentWindow.customElements.whenDefined(localName)
            )).then(() => {
              let evtDetail = null;
              const doTest = () => {
                expect(evtDetail.targetTranslateX).to.equal(100);
                expect(evtDetail.targetTranslateY).to.equal(-50);
                expect(evtDetail.targetX).to.equal(100);
                expect(evtDetail.targetY).to.equal(100);
              };

              draggableOne.addEventListener('translate', (evt) => {
                evtDetail = evt.detail;
              });

              contentWindow.requestAnimationFrame(() => {
                setTimeout(() => {
                  sendTapEvent(draggableOne, 'start', {
                    clientX: 0, clientY: 150
                  });
                  contentWindow.requestAnimationFrame(() => {
                    setTimeout(() => {
                      sendTapEvent(draggableOne, 'move', {
                        clientX: 200, clientY: 200
                      });
                      contentWindow.requestAnimationFrame(() => {
                        setTimeout(() => {
                          doTest();
                          iframe.remove();
                          done();
                        }, 0);
                      });
                    }, 0);
                  });
                }, 0);
              });
            });
            DBUIDraggable.registerSelf();
          }
        });
      });
    });

    describe('boundingClientRectOf with steps', () => {
      it('applies moving constraints in the limits of boundingClientRectOf with steps', (done) => {
        inIframe({
          headStyle: `
          body, html { padding: 0px; margin: 0px; }
          #one {
            width: 150px;
            height: 150px;
            background-color: orange;
          }
          #draggable-one {
            width: 50px;
            height: 50px;
            background-color: black;
          }
          `,
          bodyHTML: `
          <div id="one"></div>
          <dbui-draggable id="draggable-one" constraint='boundingClientRectOf({ "selector": "#one", "stepsX": 3, "stepsY": 3 })'>
          </dbui-draggable>
          `,
          onLoad: ({ contentWindow, iframe }) => {
            const DBUIDraggable = getDBUIDraggable(contentWindow);
            const draggableOne = contentWindow.document.querySelector('#draggable-one');

            Promise.all([
              DBUIDraggable.registrationName,
            ].map((localName) => contentWindow.customElements.whenDefined(localName)
            )).then(() => {
              const evtDetails = [];
              const doTest = () => {
                expect(evtDetails[0].targetX).to.equal(0);
                expect(evtDetails[0].targetY).to.equal(0);
                expect(evtDetails[1].targetX).to.equal(50);
                expect(evtDetails[1].targetY).to.equal(50);
                expect(evtDetails[2].targetX).to.equal(100);
                expect(evtDetails[2].targetY).to.equal(100);
              };

              draggableOne.addEventListener('translate', (evt) => {
                evtDetails.push(evt.detail);
              });

              contentWindow.requestAnimationFrame(() => {
                setTimeout(() => {
                  sendTapEvent(draggableOne, 'start', {
                    clientX: 0, clientY: 150
                  });
                  contentWindow.requestAnimationFrame(() => {
                    setTimeout(() => {
                      sendTapEvent(draggableOne, 'move', {
                        clientX: 10, clientY: 10
                      });
                      contentWindow.requestAnimationFrame(() => {
                        setTimeout(() => {
                          sendTapEvent(draggableOne, 'move', {
                            clientX: 60, clientY: 60
                          });
                          contentWindow.requestAnimationFrame(() => {
                            setTimeout(() => {
                              sendTapEvent(draggableOne, 'move', {
                                clientX: 110, clientY: 110
                              });
                              contentWindow.requestAnimationFrame(() => {
                                setTimeout(() => {
                                  doTest();
                                  iframe.remove();
                                  done();
                                }, 0);
                              });
                            }, 0);
                          });
                        }, 0);
                      });
                    }, 0);
                  });
                }, 0);
              });
            });
            DBUIDraggable.registerSelf();
          }
        });
      });
    });

    describe('circle no steps', () => {
      it('applies moving constraints on circle perimeter', (done) => {
        inIframe({
          headStyle: `
          body, html { padding: 0px; margin: 0px; }
          #one {
            width: 200px;
            height: 200px;
            border: 1px solid orange;
            position: absolute;
            left: 100px;
            top: 100px;
            border-radius: 1000px;
          }
          #draggable-one {
            width: 50px;
            height: 50px;
            background-color: black;
          }
          `,
          bodyHTML: `
          <div id="one"></div>
          <dbui-draggable id="draggable-one" constraint='circle({ "cx": 200, "cy": 200, "radius": 100 })'>
          </dbui-draggable>
          `,
          onLoad: ({ contentWindow, iframe }) => {
            const DBUIDraggable = getDBUIDraggable(contentWindow);
            const draggableOne = contentWindow.document.querySelector('#draggable-one');

            Promise.all([
              DBUIDraggable.registrationName,
            ].map((localName) => contentWindow.customElements.whenDefined(localName)
            )).then(() => {
              let evtDetail = null;
              const doTest = () => {
                expect(evtDetail.sin).to.equal(1);
                expect(evtDetail.cos).to.equal(0);
                expect(evtDetail.targetX).to.equal(175);
                expect(evtDetail.targetY).to.equal(75);
              };

              draggableOne.addEventListener('translate', (evt) => {
                evtDetail = evt.detail;
              });

              contentWindow.requestAnimationFrame(() => {
                setTimeout(() => {
                  sendTapEvent(draggableOne, 'start', {
                    clientX: 0, clientY: 0
                  });
                  contentWindow.requestAnimationFrame(() => {
                    setTimeout(() => {
                      sendTapEvent(draggableOne, 'move', {
                        clientX: 200, clientY: 1
                      });
                      contentWindow.requestAnimationFrame(() => {
                        setTimeout(() => {
                          doTest();
                          iframe.remove();
                          done();
                        }, 0);
                      });
                    }, 0);
                  });
                }, 0);
              });
            });
            DBUIDraggable.registerSelf();
          }
        });
      });
    });

    describe('circle with steps', () => {
      it('applies moving constraints on circle perimeter with steps', (done) => {
        inIframe({
          headStyle: `
          body, html { padding: 0px; margin: 0px; }
          #one {
            width: 200px;
            height: 200px;
            border: 1px solid orange;
            position: absolute;
            left: 100px;
            top: 100px;
            border-radius: 1000px;
          }
          #draggable-one {
            width: 50px;
            height: 50px;
            background-color: black;
          }
          `,
          bodyHTML: `
          <div id="one"></div>
          <dbui-draggable id="draggable-one" constraint='circle({ "cx": 200, "cy": 200, "radius": 100, "steps": 4 })'>
          </dbui-draggable>
          `,
          onLoad: ({ contentWindow, iframe }) => {
            const DBUIDraggable = getDBUIDraggable(contentWindow);
            const draggableOne = contentWindow.document.querySelector('#draggable-one');

            Promise.all([
              DBUIDraggable.registrationName,
            ].map((localName) => contentWindow.customElements.whenDefined(localName)
            )).then(() => {
              const evtDetails = [];
              const doTest = () => {
                expect(evtDetails[0].sin).to.equal(1);
                expect(evtDetails[0].cos).to.equal(0);
                expect(evtDetails[0].targetX).to.equal(175);
                expect(evtDetails[0].targetY).to.equal(75);
                expect(evtDetails[0].stepIndex).to.equal(1);
                expect(evtDetails[0].degreeStep).to.equal(90);
                expect(evtDetails[0].degrees.toFixed(2)).to.equal('89.42');
                expect(evtDetails[0].percent).to.equal(0.25);

                expect(evtDetails[1].sin).to.equal(0);
                expect(evtDetails[1].cos).to.equal(-1);
                expect(evtDetails[1].targetX).to.equal(75);
                expect(evtDetails[1].targetY).to.equal(175);
                expect(evtDetails[1].stepIndex).to.equal(2);
                expect(evtDetails[1].degreeStep).to.equal(180);
                expect(evtDetails[1].degrees.toFixed(2)).to.equal('180.58');
                expect(evtDetails[1].percent).to.equal(0.5);

                expect(evtDetails[2].sin).to.equal(-1);
                expect(evtDetails[2].cos).to.equal(-0);
                expect(evtDetails[2].targetX).to.equal(175);
                expect(evtDetails[2].targetY).to.equal(275);
                expect(evtDetails[2].stepIndex).to.equal(3);
                expect(evtDetails[2].degreeStep).to.equal(270);
                expect(evtDetails[2].degrees.toFixed(2)).to.equal('270.57');
                expect(evtDetails[2].percent).to.equal(0.75);
              };

              draggableOne.addEventListener('translate', (evt) => {
                evtDetails.push(evt.detail);
              });

              contentWindow.requestAnimationFrame(() => {
                setTimeout(() => {
                  sendTapEvent(draggableOne, 'start', {
                    clientX: 0, clientY: 0
                  });
                  contentWindow.requestAnimationFrame(() => {
                    setTimeout(() => {
                      sendTapEvent(draggableOne, 'move', {
                        clientX: 200 + 2, clientY: 1
                      });
                      contentWindow.requestAnimationFrame(() => {
                        setTimeout(() => {
                          sendTapEvent(draggableOne, 'move', {
                            clientX: 1, clientY: 200 + 2
                          });
                          contentWindow.requestAnimationFrame(() => {
                            setTimeout(() => {
                              sendTapEvent(draggableOne, 'move', {
                                clientX: 200 + 2, clientY: 400
                              });
                              contentWindow.requestAnimationFrame(() => {
                                setTimeout(() => {
                                  doTest();
                                  iframe.remove();
                                  done();
                                }, 0);
                              });
                            }, 0);
                          });
                        }, 0);
                      });
                    }, 0);
                  });
                }, 0);
              });
            });
            DBUIDraggable.registerSelf();
          }
        });
      });
    });

    describe('when invalid constraint', () => {
      it('logs error', (done) => {
        inIframe({
          headStyle: `
          body, html { padding: 0px; margin: 0px; }
          #one {
            width: 200px;
            height: 200px;
            border: 1px solid orange;
            position: absolute;
            left: 100px;
            top: 100px;
            border-radius: 1000px;
          }
          #draggable-one {
            width: 50px;
            height: 50px;
            background-color: black;
          }
          `,
          bodyHTML: `
          <div id="one"></div>
          <dbui-draggable id="draggable-one" constraint='circle({ cx: 200, "cy": 200, "radius": 100, "steps": 4 })'>
          </dbui-draggable>
          `,
          onLoad: ({ contentWindow, iframe }) => {
            const DBUIDraggable = getDBUIDraggable(contentWindow);
            const draggableOne = contentWindow.document.querySelector('#draggable-one');
            const consoleError = contentWindow.console.error;
            let errMsg = null;

            Promise.all([
              DBUIDraggable.registrationName,
            ].map((localName) => contentWindow.customElements.whenDefined(localName)
            )).then(() => {
              contentWindow.requestAnimationFrame(() => {
                setTimeout(() => {
                  sendTapEvent(draggableOne, 'start', {
                    clientX: 0, clientY: 0
                  });
                  contentWindow.requestAnimationFrame(() => {
                    setTimeout(() => {
                      contentWindow.console.error = (msg) => {
                        errMsg = msg;
                      };

                      sendTapEvent(draggableOne, 'move', {
                        clientX: 200, clientY: 1
                      });

                      contentWindow.requestAnimationFrame(() => {
                        setTimeout(() => {
                          contentWindow.console.error = consoleError;
                          expect(errMsg.startsWith('Invalid constraint')).to.equal(true);
                          iframe.remove();
                          done();
                        }, 0);
                      });
                    }, 0);
                  });
                }, 0);
              });
            });
            DBUIDraggable.registerSelf();
          }
        });
      });
    });

    describe('when removed during animation', () => {
      it('sets self._dragRunning to false', (done) => {
        inIframe({
          headStyle: `
          body, html { padding: 0px; margin: 0px; }
          #one {
            width: 200px;
            height: 200px;
            border: 1px solid orange;
            position: absolute;
            left: 100px;
            top: 100px;
            border-radius: 1000px;
          }
          #draggable-one {
            width: 50px;
            height: 50px;
            background-color: black;
          }
          `,
          bodyHTML: `
          <div id="one"></div>
          <dbui-draggable id="draggable-one" constraint='circle({ "cx": 200, "cy": 200, "radius": 100, "steps": 4 })'>
          </dbui-draggable>
          `,
          onLoad: ({ contentWindow, iframe }) => {
            const DBUIDraggable = getDBUIDraggable(contentWindow);
            const draggableOne = contentWindow.document.querySelector('#draggable-one');

            Promise.all([
              DBUIDraggable.registrationName,
            ].map((localName) => contentWindow.customElements.whenDefined(localName)
            )).then(() => {
              contentWindow.requestAnimationFrame(() => {
                setTimeout(() => {
                  sendTapEvent(draggableOne, 'start', {
                    clientX: 0, clientY: 0
                  });
                  contentWindow.requestAnimationFrame(() => {
                    setTimeout(() => {
                      expect(draggableOne._dragRunning).to.equal(undefined);
                      sendTapEvent(draggableOne, 'move', {
                        clientX: 200, clientY: 1
                      });
                      expect(draggableOne._dragRunning).to.equal(true);
                      draggableOne.remove();

                      contentWindow.requestAnimationFrame(() => {
                        setTimeout(() => {
                          expect(draggableOne._dragRunning).to.equal(false);
                          iframe.remove();
                          done();
                        }, 0);
                      });
                    }, 0);
                  });
                }, 0);
              });
            });
            DBUIDraggable.registerSelf();
          }
        });
      });
    });
  });

  describe('extractSingleEvent', () => {
    describe('when TouchEvent and one Touch object has draggable as target', () => {
      it('returns the Touch object (having as target the draggable) from event.touches array', (done) => {
        inIframe({
          headStyle: `
          `,
          bodyHTML: `
          <div id="other"></div>
          <dbui-draggable id="draggable-one"></dbui-draggable>
          `,
          onLoad: ({ contentWindow, iframe }) => {
            if (!contentWindow.TouchEvent) {
              iframe.remove();
              done();
              return;
            }

            const DBUIDraggable = getDBUIDraggable(contentWindow);
            const other = contentWindow.document.querySelector('#other');
            const draggableOne = contentWindow.document.querySelector('#draggable-one');
            const touchObj1 = new contentWindow.Touch({
              identifier: new Date(),
              target: other,
            });
            const touchObj2 = new contentWindow.Touch({
              identifier: new Date(),
              target: draggableOne,
            });
            const event = new contentWindow.TouchEvent('touchmove', {
              touches: [touchObj1, touchObj2],
              targetTouches: [],
              changedTouches: [],
            });
            let dispatchedEvent = null;

            draggableOne.addEventListener('touchmove', (evt) => {
              dispatchedEvent = evt;
            });

            Promise.all([
              DBUIDraggable.registrationName,
            ].map((localName) => contentWindow.customElements.whenDefined(localName)
            )).then(() => {
              draggableOne.dispatchEvent(event);
              const extracted = extractSingleEvent(dispatchedEvent);
              expect(extracted.target).to.equal(touchObj2.target);
              expect(extracted).to.be.an.instanceOf(contentWindow.Touch);
              iframe.remove();
              done();
            });
            DBUIDraggable.registerSelf();
          }
        });
      });
    });

    describe('when TouchEvent and NO Touch object has draggable as target', () => {
      it('returns null', (done) => {
        inIframe({
          headStyle: `
          `,
          bodyHTML: `
          <div id="other"></div>
          <dbui-draggable id="draggable-one"></dbui-draggable>
          `,
          onLoad: ({ contentWindow, iframe }) => {
            if (!contentWindow.TouchEvent) {
              iframe.remove();
              done();
              return;
            }

            const DBUIDraggable = getDBUIDraggable(contentWindow);
            const other = contentWindow.document.querySelector('#other');
            const draggableOne = contentWindow.document.querySelector('#draggable-one');
            const touchObj1 = new contentWindow.Touch({
              identifier: new Date(),
              target: other,
            });
            const event = new contentWindow.TouchEvent('touchmove', {
              touches: [touchObj1],
              targetTouches: [],
              changedTouches: [],
            });
            let dispatchedEvent = null;

            draggableOne.addEventListener('touchmove', (evt) => {
              dispatchedEvent = evt;
            });

            Promise.all([
              DBUIDraggable.registrationName,
            ].map((localName) => contentWindow.customElements.whenDefined(localName)
            )).then(() => {
              draggableOne.dispatchEvent(event);
              const extracted = extractSingleEvent(dispatchedEvent);
              expect(extracted).to.equal(undefined);
              iframe.remove();
              done();
            });
            DBUIDraggable.registerSelf();
          }
        });
      });
    });

    describe('when MouseEvent', () => {
      it('returns the event itself', (done) => {
        inIframe({
          headStyle: `
          `,
          bodyHTML: `
          <div id="other"></div>
          <dbui-draggable id="draggable-one"></dbui-draggable>
          `,
          onLoad: ({ contentWindow, iframe }) => {
            if (!contentWindow.MouseEvent) {
              iframe.remove();
              done();
              return;
            }

            const DBUIDraggable = getDBUIDraggable(contentWindow);
            const draggableOne = contentWindow.document.querySelector('#draggable-one');
            const event = new contentWindow.MouseEvent('mousemove', {});
            let dispatchedEvent = null;

            draggableOne.addEventListener('mousemove', (evt) => {
              dispatchedEvent = evt;
            });

            Promise.all([
              DBUIDraggable.registrationName,
            ].map((localName) => contentWindow.customElements.whenDefined(localName)
            )).then(() => {
              draggableOne.dispatchEvent(event);
              const extracted = extractSingleEvent(dispatchedEvent);
              expect(extracted).to.equal(dispatchedEvent);
              expect(extracted).to.be.an.instanceOf(contentWindow.MouseEvent);
              iframe.remove();
              done();
            });
            DBUIDraggable.registerSelf();
          }
        });
      });
    });
  });

  describe('getElementBeingDragged', () => {
    describe('when MouseEvent', () => {
      it('returns win._dbuiCurrentElementBeingDragged', (done) => {
        inIframe({
          headStyle: `
          `,
          bodyHTML: `
          <div id="other"></div>
          <dbui-draggable id="draggable-one"></dbui-draggable>
          `,
          onLoad: ({ contentWindow, iframe }) => {
            if (!contentWindow.MouseEvent) {
              iframe.remove();
              done();
              return;
            }

            const DBUIDraggable = getDBUIDraggable(contentWindow);
            const draggableOne = contentWindow.document.querySelector('#draggable-one');
            const event = new contentWindow.MouseEvent('mousemove', {});
            const doc = contentWindow.document;
            let dispatchedEvent = null;
            contentWindow._dbuiCurrentElementBeingDragged = draggableOne;

            doc.addEventListener('mousemove', (evt) => {
              dispatchedEvent = evt;
            });

            Promise.all([
              DBUIDraggable.registrationName,
            ].map((localName) => contentWindow.customElements.whenDefined(localName)
            )).then(() => {
              doc.dispatchEvent(event);
              const elemBeingDragged = getElementBeingDragged(dispatchedEvent);
              expect(elemBeingDragged).to.equal(draggableOne);
              iframe.remove();
              done();
            });
            DBUIDraggable.registerSelf();
          }
        });
      });
    });

    describe('when TouchEvent and one Touch object has draggable as target', () => {
      it('returns draggable element', (done) => {
        inIframe({
          headStyle: `
          `,
          bodyHTML: `
          <div id="other"></div>
          <dbui-draggable id="draggable-one"></dbui-draggable>
          `,
          onLoad: ({ contentWindow, iframe }) => {
            if (!contentWindow.TouchEvent) {
              iframe.remove();
              done();
              return;
            }

            const DBUIDraggable = getDBUIDraggable(contentWindow);
            const draggableOne = contentWindow.document.querySelector('#draggable-one');
            const touchObj1 = new contentWindow.Touch({
              identifier: new Date(),
              target: draggableOne,
            });
            const event = new contentWindow.TouchEvent('touchmove', {
              touches: [touchObj1],
              targetTouches: [],
              changedTouches: [],
            });
            let dispatchedEvent = null;

            draggableOne.addEventListener('touchmove', (evt) => {
              dispatchedEvent = evt;
            });

            Promise.all([
              DBUIDraggable.registrationName,
            ].map((localName) => contentWindow.customElements.whenDefined(localName)
            )).then(() => {
              draggableOne.dispatchEvent(event);
              const extractedEvent = extractSingleEvent(dispatchedEvent);
              const elemBeingDragged = getElementBeingDragged(extractedEvent);
              expect(elemBeingDragged).to.equal(draggableOne);
              iframe.remove();
              done();
            });
            DBUIDraggable.registerSelf();
          }
        });
      });
    });

    describe('when TouchEvent and one Touch object has draggable descendant as target', () => {
      it('returns draggable element', (done) => {
        inIframe({
          headStyle: `
          `,
          bodyHTML: `
          <div id="other"></div>
          <dbui-draggable id="draggable-one">
            <div>
              <span id="draggable-ancestor"></span>
            </div>
          </dbui-draggable>
          `,
          onLoad: ({ contentWindow, iframe }) => {
            if (!contentWindow.TouchEvent) {
              iframe.remove();
              done();
              return;
            }

            const DBUIDraggable = getDBUIDraggable(contentWindow);
            const draggableAncestor = contentWindow.document.querySelector('#draggable-ancestor');
            const draggableOne = contentWindow.document.querySelector('#draggable-one');
            const touchObj1 = new contentWindow.Touch({
              identifier: new Date(),
              target: draggableAncestor,
            });
            const event = new contentWindow.TouchEvent('touchmove', {
              touches: [touchObj1],
              targetTouches: [],
              changedTouches: [],
            });
            let dispatchedEvent = null;

            draggableAncestor.addEventListener('touchmove', (evt) => {
              dispatchedEvent = evt;
            });

            Promise.all([
              DBUIDraggable.registrationName,
            ].map((localName) => contentWindow.customElements.whenDefined(localName)
            )).then(() => {
              draggableAncestor.dispatchEvent(event);
              const extractedEvent = extractSingleEvent(dispatchedEvent);
              const elemBeingDragged = getElementBeingDragged(extractedEvent);
              expect(elemBeingDragged).to.equal(draggableOne);
              iframe.remove();
              done();
            });
            DBUIDraggable.registerSelf();
          }
        });
      });
    });

    describe('when TouchEvent and NO Touch object has draggable or draggable descendant as target', () => {
      it('returns null', (done) => {
        inIframe({
          headStyle: `
          `,
          bodyHTML: `
          <div id="other"></div>
          <dbui-draggable id="draggable-one">
            <div>
              <span id="draggable-ancestor"></span>
            </div>
          </dbui-draggable>
          `,
          onLoad: ({ contentWindow, iframe }) => {
            if (!contentWindow.TouchEvent) {
              iframe.remove();
              done();
              return;
            }

            const DBUIDraggable = getDBUIDraggable(contentWindow);
            const other = contentWindow.document.querySelector('#other');
            const draggableOne = contentWindow.document.querySelector('#draggable-one');
            const touchObj1 = new contentWindow.Touch({
              identifier: new Date(),
              target: other,
            });
            const event = new contentWindow.TouchEvent('touchmove', {
              touches: [touchObj1],
              targetTouches: [],
              changedTouches: [],
            });
            let dispatchedEvent = null;

            draggableOne.addEventListener('touchmove', (evt) => {
              dispatchedEvent = evt;
            });

            Promise.all([
              DBUIDraggable.registrationName,
            ].map((localName) => contentWindow.customElements.whenDefined(localName)
            )).then(() => {
              draggableOne.dispatchEvent(event);
              const elemBeingDragged = getElementBeingDragged(dispatchedEvent.touches[0]);
              expect(elemBeingDragged).to.equal(null);
              iframe.remove();
              done();
            });
            DBUIDraggable.registerSelf();
          }
        });
      });
    });
  });
});
