import { expect } from 'chai';
// import onScreenConsole from '../../../utils/onScreenConsole';
import inIframe from '../../../../../../testUtils/inIframe';
import getDBUIDraggable, {
  extractSingleEvent, getElementBeingDragged
} from './DBUIDraggable';
import getDBUIResizeSensor from '../DBUIResizeSensor/DBUIResizeSensor';
import {
  sendTapEvent,
  sendTouchEvent,
  sendMouseEvent
} from '../../../../../../testUtils/simulateEvents';
import getDBUIWebComponentCore from '../DBUIWebComponentCore/DBUIWebComponentCore';
import ensureSingleRegistration from '../../../internals/ensureSingleRegistration';

const dummyDraggableCompRegistrationName = 'dummy-draggable-comp';
function getDummyDraggableComp(win) {
  return ensureSingleRegistration(win, dummyDraggableCompRegistrationName, () => {
    const {
      DBUIWebComponentBase,
      defineCommonStaticMethods,
      Registerable
    } = getDBUIWebComponentCore(win);

    const DBUIDraggable = getDBUIDraggable(win);

    class DummyDraggableComp extends DBUIWebComponentBase {

      static get registrationName() {
        return dummyDraggableCompRegistrationName;
      }

      static get dependencies() {
        return [...super.dependencies, DBUIDraggable];
      }

      static get templateInnerHTML() {
        return `
          <style></style>
          <div id="container">
            <div id="one">draggable</div>
            <div id="two"></div>
            <dbui-draggable id="dbui-draggable" drag-target="#one">
              <p>dragger</p>
            </dbui-draggable>
          </div>
        `;
      }
    }

    return Registerable(
      defineCommonStaticMethods(
        DummyDraggableComp
      )
    );
  });
}
getDummyDraggableComp.registrationName = dummyDraggableCompRegistrationName;

const dummyDraggableInnerRegistrationName = 'dummy-draggable-inner';
function getDummyDraggableInner(win) {
  return ensureSingleRegistration(win, dummyDraggableInnerRegistrationName, () => {
    const {
      DBUIWebComponentBase,
      defineCommonStaticMethods,
      Registerable
    } = getDBUIWebComponentCore(win);

    const DBUIDraggable = getDBUIDraggable(win);

    class DummyDraggableInner extends DBUIWebComponentBase {

      static get registrationName() {
        return dummyDraggableInnerRegistrationName;
      }

      static get dependencies() {
        return [...super.dependencies, DBUIDraggable];
      }

      static get templateInnerHTML() {
        return `
          <style>
            #container-inner {
              width: 400px;
              height: 100px;
            }
            #draggable-inner-1 {
              width: 200px;
              height: 50px;
              background-color: rgba(255, 0, 0, 0.2);
            }
            #draggable-inner-2 {
              width: 200px;
              height: 50px;
              background-color: rgba(0, 255, 0, 0.2);
            }
          </style>
          <div id="container-inner">
            <dbui-draggable id="draggable-inner-1"
            constraint-type="boundingClientRectOf"
            constraint-selector="parent"
            >
              <p id="content-1">draggable-inner-1</p>
            </dbui-draggable>
            <dbui-draggable id="draggable-inner-2"
            constraint-type="boundingClientRectOf"
            constraint-selector="parent"
            >
              <p id="content-2">draggable-inner-2</p>
            </dbui-draggable>
          </div>
        `;
      }
    }

    return Registerable(
      defineCommonStaticMethods(
        DummyDraggableInner
      )
    );
  });
}
getDummyDraggableInner.registrationName = dummyDraggableInnerRegistrationName;

const dummyDraggableMiddleRegistrationName = 'dummy-draggable-middle';
function getDummyDraggableMiddle(win) {
  return ensureSingleRegistration(win, dummyDraggableMiddleRegistrationName, () => {
    const {
      DBUIWebComponentBase,
      defineCommonStaticMethods,
      Registerable
    } = getDBUIWebComponentCore(win);

    const DummyDraggableInner = getDummyDraggableInner(win);

    class DummyDraggableMiddle extends DBUIWebComponentBase {

      static get registrationName() {
        return dummyDraggableMiddleRegistrationName;
      }

      static get dependencies() {
        return [...super.dependencies, DummyDraggableInner];
      }

      static get templateInnerHTML() {
        return `
          <style>
            #container-middle {
              width: 800px;
              height: 150px;
              background-color: rgba(0, 0, 255, 0.2);
            }
            #draggable-middle-1 {
              display: inline-block;
              width: 400px;
              height: 100px;
              background-color: rgba(255, 0, 0, 0.2);
            }
            #draggable-middle-2 {
              display: inline-block;
              width: 400px;
              height: 100px;
              background-color: rgba(0, 255, 0, 0.2);
            }
          </style>
          <div id="container-middle">
            <dbui-draggable id="draggable-middle-1"
            constraint-type="boundingClientRectOf"
            constraint-selector="parent"
            >
              <dummy-draggable-inner id="dummy-draggable-inner-1"></dummy-draggable-inner>
            </dbui-draggable><dbui-draggable id="draggable-middle-2"
            constraint-type="boundingClientRectOf"
            constraint-selector="parent"
            >
              <dummy-draggable-inner id="dummy-draggable-inner-2"></dummy-draggable-inner>
            </dbui-draggable>
          </div>
        `;
      }
    }

    return Registerable(
      defineCommonStaticMethods(
        DummyDraggableMiddle
      )
    );
  });
}
getDummyDraggableMiddle.registrationName = dummyDraggableMiddleRegistrationName;

const dummyDraggableOuterRegistrationName = 'dummy-draggable-outer';
function getDummyDraggableOuter(win) {
  return ensureSingleRegistration(win, dummyDraggableOuterRegistrationName, () => {
    const {
      DBUIWebComponentBase,
      defineCommonStaticMethods,
      Registerable
    } = getDBUIWebComponentCore(win);

    const DummyDraggableMiddle = getDummyDraggableMiddle(win);

    class DummyDraggableOuter extends DBUIWebComponentBase {

      static get registrationName() {
        return dummyDraggableOuterRegistrationName;
      }

      static get dependencies() {
        return [...super.dependencies, DummyDraggableMiddle];
      }

      static get templateInnerHTML() {
        return `
          <style>
            #container-outer {
              width: 800px;
              height: 350px;
              background-color: rgba(0, 0, 255, 0.2);
            }
            #draggable-outer-1 {
              width: 800px;
              height: 150px;
              background-color: rgba(255, 0, 0, 0.2);
            }
            #draggable-outer-2 {
              width: 800px;
              height: 150px;
              background-color: rgba(0, 255, 0, 0.2);
            }
          </style>
          <div id="container-outer">
            <dbui-draggable id="draggable-outer-1"
            constraint-type="boundingClientRectOf"
            constraint-selector="parent"
            >
              <dummy-draggable-middle id="dummy-draggable-middle-1"></dummy-draggable-middle>
            </dbui-draggable>
            <dbui-draggable id="draggable-outer-2"
            constraint-type="boundingClientRectOf"
            constraint-selector="parent"
            >
              <dummy-draggable-middle id="dummy-draggable-middle-2"></dummy-draggable-middle>
            </dbui-draggable>
          </div>
        `;
      }
    }

    return Registerable(
      defineCommonStaticMethods(
        DummyDraggableOuter
      )
    );
  });
}
getDummyDraggableOuter.registrationName = dummyDraggableOuterRegistrationName;

/* eslint camelcase: 0 */

const style_1 = `
body, html { padding: 0px; margin: 0px; }
p {
  width: 300px;
  height: 100px;
}

#container {
  position: relative;
  border: 1px solid green;
  width: 90%;
  height: 300px;
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
`;

const html_1 = `
<span id="locale-provider" dir="rtl"></span>
<div id="container">

  <div id="wrapper-draggable-one" dir="rtl">
    <dbui-draggable
      id="draggable-one"
      drag-target="parent"
      constraint-type="boundingClientRectOf"
      constraint-selector="parent"
      target-translate-x="10"
      target-translate-y="10"
    >
      <p id="draggable-two-content">draggable content 1</p>
    </dbui-draggable>
  </div>
  
  <div id="wrapper-draggable-two">
    <dbui-draggable
    id="draggable-two"
    sync-locale-with="#locale-provider"
    constraint-type="boundingClientRectOf"
    constraint-selector="#wrapper-draggable-one"
    constraint-steps-x="3" target-step-x="1"
    constraint-steps-y="3" target-step-y="1">
      <p id="draggable-two-content">draggable content 2</p>
    </dbui-draggable>
  </div>
  
  <div id="wrapper-draggable-three">
    <dbui-draggable id="draggable-three" dir="rtl">
      <p id="draggable-three-content">draggable content 3</p>
    </dbui-draggable>
  </div>
  
  <div id="wrapper-draggable-four">
    <dbui-draggable id="draggable-four"
    constraint-type="circle"
    constraint-cx="190"
    constraint-cy="790"
    constraint-radius="175"
    constraint-steps="12"
    >
      <p>4</p>
    </dbui-draggable>
    <div class="center"></div>
  </div>
  
  <div style="height: 300px; position: absolute; top: 700px; border: 1px solid black;"></div>

</div>
`;

const style_2 = `
body, html { padding: 0px; margin: 0px; }
.draggable-inner {
  width: 200px;
  height: 50px;
  background-color: rgba(255, 0, 0, 0.2);
}
.draggable-middle {
  width: 400px;
  height: 100px;
  background-color: rgba(0, 0, 255, 0.2);
  display: inline-block;
}
.draggable-outer {
  width: 800px;
  height: 150px;
  background-color: rgba(0, 0, 255, 0.2);
}
.container {
  width: 800px;
  height: 350px;
  background-color: rgba(0, 255, 255, 0.2);
}
`;

const html_2 = `
<div class="container">
  <dbui-draggable class="draggable-outer" id="draggable-outer-1"
  constraint-type="boundingClientRectOf"
  constraint-selector="parent"
  >
    <dbui-draggable class="draggable-middle" id="draggable-middle-1"
    constraint-type="boundingClientRectOf"
    constraint-selector="parent"
    >
      <dbui-draggable class="draggable-inner" id="draggable-inner-1"
      constraint-type="boundingClientRectOf"
      constraint-selector="parent"
      >
        <p class="content" id="content-1">content 1</p>
      </dbui-draggable>
      <dbui-draggable class="draggable-inner" id="draggable-inner-2"
      constraint-type="boundingClientRectOf"
      constraint-selector="parent"
      >
        <p class="content" id="content-2">content 2</p>
      </dbui-draggable>
    </dbui-draggable><dbui-draggable class="draggable-middle"
    constraint-type="boundingClientRectOf"
    constraint-selector="parent"
    >
      <dbui-draggable class="draggable-inner"
      constraint-type="boundingClientRectOf"
      constraint-selector="parent"
      >
        <p class="content">content 1</p>
      </dbui-draggable>
      <dbui-draggable class="draggable-inner"
      constraint-type="boundingClientRectOf"
      constraint-selector="parent"
      >
        <p class="content">content 2</p>
      </dbui-draggable>
    </dbui-draggable>
  </dbui-draggable>  
  <dbui-draggable class="draggable-outer"
  constraint-type="boundingClientRectOf"
  constraint-selector="parent"
  >
    <dbui-draggable class="draggable-middle"
    constraint-type="boundingClientRectOf"
    constraint-selector="parent"
    >
      <dbui-draggable class="draggable-inner"
      constraint-type="boundingClientRectOf"
      constraint-selector="parent"
      >
        <p class="content">content 1</p>
      </dbui-draggable>
      <dbui-draggable class="draggable-inner"
      constraint-type="boundingClientRectOf"
      constraint-selector="parent"
      >
        <p class="content">content 2</p>
      </dbui-draggable>
    </dbui-draggable><dbui-draggable class="draggable-middle"
    constraint-type="boundingClientRectOf"
    constraint-selector="parent"
    >
      <dbui-draggable class="draggable-inner"
      constraint-type="boundingClientRectOf"
      constraint-selector="parent"
      >
        <p class="content">content 1</p>
      </dbui-draggable>
      <dbui-draggable class="draggable-inner"
      constraint-type="boundingClientRectOf"
      constraint-selector="parent"
      >
        <p class="content">content 2</p>
      </dbui-draggable>
    </dbui-draggable>
  </dbui-draggable>  
</div>
`;

describe('DBUIDraggable', () => {
  xit('behaves as expected - light DOM - live testing', (done) => {
    inIframe({
      headStyle: style_1,
      bodyHTML: html_1,
      onLoad: ({ contentWindow, iframe }) => {
        const DBUIDraggable = getDBUIDraggable(contentWindow);

        // const draggableTwo = contentWindow.document.querySelector('#draggable-two');
        // const draggableFour = contentWindow.document.querySelector('#draggable-four');

        Promise.all([
          DBUIDraggable.registrationName,
        ].map((localName) => contentWindow.customElements.whenDefined(localName)
        )).then(() => {
          // onScreenConsole({ win: contentWindow });
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

  xit('behaves as expected - nested light DOM - live testing', (done) => {
    inIframe({
      headStyle: style_2,
      bodyHTML: html_2,
      onLoad: ({ contentWindow, iframe }) => {
        const DBUIDraggable = getDBUIDraggable(contentWindow);
        // onScreenConsole({ win: contentWindow });
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

  xit('behaves as expected - nested shadow DOMs - live testing', (done) => {
    inIframe({
      headStyle: `
      body, html { padding: 0px; margin: 0px; }
      `,
      bodyHTML: `
      <div id="container">
        <dummy-draggable-outer></dummy-draggable-outer>
      </div>
      
      `,
      onLoad: ({ contentWindow, iframe }) => {
        // onScreenConsole({ win: contentWindow });
        const DummyDraggableOuter = getDummyDraggableOuter(contentWindow);

        Promise.all([
          DummyDraggableOuter.registrationName,
        ].map((localName) => contentWindow.customElements.whenDefined(localName)
        )).then(() => {
          setTimeout(() => {
            setTimeout(() => {
              iframe.remove();
              done();
            }, 2000);
          }, 55000);
        });

        DummyDraggableOuter.registerSelf();
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
          draggableOne.addEventListener('dragmove', (evt) => {
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
          draggableOne.addEventListener('dragmove', (evt) => {
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
          draggableOne.addEventListener('dragmove', (evt) => {
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
          draggableOne.addEventListener('dragmove', (evt) => {
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
          draggableOne.addEventListener('dragmove', (evt) => {
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
          const constraintType = 'boundingClientRectOf';
          const constraintSelector = 'parent';
          const constraintStepsX = 2;
          const constraintStepsY = 2;
          const constraintSteps = 2;
          const constraintCX = 5;
          const constraintCY = 5;
          const constraintRadius = 5;

          draggableOne.applyCorrection = applyCorrection;
          draggableOne.targetTranslateX = targetTranslateX;
          draggableOne.targetTranslateY = targetTranslateY;
          draggableOne.dragTarget = dragTarget;
          draggableOne.constraintType = constraintType;
          draggableOne.constraintSelector = constraintSelector;
          draggableOne.constraintStepsX = constraintStepsX;
          draggableOne.constraintStepsY = constraintStepsY;
          draggableOne.constraintSteps = constraintSteps;
          draggableOne.constraintCX = constraintCX;
          draggableOne.constraintCY = constraintCY;
          draggableOne.constraintRadius = constraintRadius;

          Promise.all([
            DBUIDraggable.registrationName,
          ].map((localName) => contentWindow.customElements.whenDefined(localName)
          )).then(() => {

            expect(draggableOne.getAttribute('target-translate-x')).to.equal(`${targetTranslateX}`);
            expect(draggableOne.getAttribute('target-translate-y')).to.equal(`${targetTranslateY}`);
            expect(draggableOne.getAttribute('drag-target')).to.equal(`${dragTarget}`);
            expect(draggableOne.getAttribute('constraint-type')).to.equal(constraintType);
            expect(draggableOne.getAttribute('constraint-selector')).to.equal(constraintSelector);
            expect(draggableOne.getAttribute('constraint-steps-x')).to.equal(`${constraintStepsX}`);
            expect(draggableOne.getAttribute('constraint-steps-y')).to.equal(`${constraintStepsY}`);
            expect(draggableOne.getAttribute('constraint-steps')).to.equal(`${constraintSteps}`);
            expect(draggableOne.getAttribute('constraint-cx')).to.equal(`${constraintCX}`);
            expect(draggableOne.getAttribute('constraint-cy')).to.equal(`${constraintCY}`);
            expect(draggableOne.getAttribute('constraint-radius')).to.equal(`${constraintRadius}`);
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
          constraint-type="boundingClientRectOf"
          constraint-selector="parent"
          constraint-steps-x="3"
          constraint-steps-y="3"
          constraint-steps="3"
          constraint-cx="3"
          constraint-cy="4"
          constraint-radius="5"
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
          expect(draggableOne.constraintType).to.equal(undefined);
          expect(draggableOne.constraintSelector).to.equal(undefined);
          expect(draggableOne.constraintStepsX).to.equal(undefined);
          expect(draggableOne.constraintStepsY).to.equal(undefined);
          expect(draggableOne.constraintSteps).to.equal(undefined);
          expect(draggableOne.constraintCX).to.equal(undefined);
          expect(draggableOne.constraintCY).to.equal(undefined);
          expect(draggableOne.constraintRadius).to.equal(undefined);

          Promise.all([
            DBUIDraggable.registrationName,
          ].map((localName) => contentWindow.customElements.whenDefined(localName)
          )).then(() => {

            expect(draggableOne.targetTranslateX).to.equal(1);
            expect(draggableOne.targetTranslateY).to.equal(2);
            expect(draggableOne.dragTarget).to.equal('#one');
            expect(draggableOne.constraintType).to.equal('boundingClientRectOf');
            expect(draggableOne.constraintSelector).to.equal('parent');
            expect(draggableOne.constraintStepsX).to.equal(3);
            expect(draggableOne.constraintStepsY).to.equal(3);
            expect(draggableOne.constraintSteps).to.equal(3);
            expect(draggableOne.constraintCX).to.equal(3);
            expect(draggableOne.constraintCY).to.equal(4);
            expect(draggableOne.constraintRadius).to.equal(5);

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
          <div id="one">
            <dbui-draggable id="draggable-zero" drag-target="parent">
              <div id="draggable-zero-content">content</div>
            </dbui-draggable>
          </div>
          <dbui-draggable id="draggable-one" drag-target="#one">
            <div id="draggable-one-content">content</div>
          </dbui-draggable>
          `,
          onLoad: ({ contentWindow, iframe }) => {
            const DBUIDraggable = getDBUIDraggable(contentWindow);
            const one = contentWindow.document.querySelector('#one');
            const draggableZero = contentWindow.document.querySelector('#draggable-zero');
            const draggableOne = contentWindow.document.querySelector('#draggable-one');

            Promise.all([
              DBUIDraggable.registrationName,
            ].map((localName) => contentWindow.customElements.whenDefined(localName)
            )).then(() => {

              expect(draggableOne._targetToDrag).to.equal(one);
              expect(draggableZero._targetToDrag).to.equal(one);

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
          <dummy-draggable-comp></dummy-draggable-comp>
          `,
          onLoad: ({ contentWindow, iframe }) => {
            const DummyDraggableComp = getDummyDraggableComp(contentWindow);
            const dummyComp = contentWindow.document.querySelector('dummy-draggable-comp');

            Promise.all([
              DummyDraggableComp.registrationName,
            ].map((localName) => contentWindow.customElements.whenDefined(localName)
            )).then(() => {

              const shadowDBUIDraggable =
                dummyComp.shadowRoot.querySelector('dbui-draggable');
              const shadowContainer =
                dummyComp.shadowRoot.querySelector('#container');
              const shadowOne =
                dummyComp.shadowRoot.querySelector('#one');
              expect(shadowDBUIDraggable._targetToDrag).to.equal(shadowOne);
              shadowDBUIDraggable.dragTarget = 'parent';
              expect(shadowDBUIDraggable._targetToDrag).to.equal(shadowContainer);

              setTimeout(() => {
                iframe.remove();
                done();
              }, 0);
            });
            DummyDraggableComp.registerSelf();
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
    describe('boundingClientRectOf selector', () => {
      describe('when selector in light DOM', () => {
        it('returns element in light DOM', (done) => {
          inIframe({
            bodyHTML: `
            <div id="one"></div>
            <div id="two">
              <div id="three"></div>
              <dbui-draggable id="draggable-one" drag-target="#three">
              </dbui-draggable>
            </div>
            `,
            onLoad: ({ contentWindow, iframe }) => {
              const DBUIDraggable = getDBUIDraggable(contentWindow);
              const one = contentWindow.document.querySelector('#one');
              const two = contentWindow.document.querySelector('#two');
              const draggableOne = contentWindow.document.querySelector('#draggable-one');

              const oneGetBoundingClientRect = one.getBoundingClientRect.bind(one);
              let oneGetBoundingClientRectHasBeenCalled = false;
              one.getBoundingClientRect = () => {
                oneGetBoundingClientRectHasBeenCalled = true;
                return oneGetBoundingClientRect();
              };

              const twoGetBoundingClientRect = two.getBoundingClientRect.bind(two);
              let twoGetBoundingClientRectHasBeenCalled = false;
              two.getBoundingClientRect = () => {
                twoGetBoundingClientRectHasBeenCalled = true;
                return twoGetBoundingClientRect();
              };

              Promise.all([
                DBUIDraggable.registrationName,
              ].map((localName) => contentWindow.customElements.whenDefined(localName)
              )).then(() => {
                draggableOne.constraintType = 'boundingClientRectOf';
                draggableOne.constraintSelector = '#one';

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
                        sendTapEvent(draggableOne, 'end', {
                        });
                        contentWindow.requestAnimationFrame(() => {
                          // test selector was return by query
                          expect(oneGetBoundingClientRectHasBeenCalled).to.equal(true);
                          expect(twoGetBoundingClientRectHasBeenCalled).to.equal(false);

                          draggableOne.constraintType = 'boundingClientRectOf';
                          draggableOne.constraintSelector = 'parent';

                          setTimeout(() => {

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
                                    sendTapEvent(draggableOne, 'end', {
                                    });

                                    contentWindow.requestAnimationFrame(() => {
                                      setTimeout(() => {
                                        expect(oneGetBoundingClientRectHasBeenCalled).to.equal(true);
                                        // test selector was parentElement
                                        expect(twoGetBoundingClientRectHasBeenCalled).to.equal(true);
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
                  }, 0);
                });
              });
              DBUIDraggable.registerSelf();
            }
          });
        });
      });

      describe('when selector in shadow DOM', () => {
        it('returns element in shadow DOM', (done) => {
          inIframe({
            bodyHTML: `
              <dummy-draggable-comp></dummy-draggable-comp>
            `,
            onLoad: ({ contentWindow, iframe }) => {
              const DummyDraggableComp = getDummyDraggableComp(contentWindow);

              Promise.all([
                DummyDraggableComp.registrationName,
              ].map((localName) => contentWindow.customElements.whenDefined(localName)
              )).then(() => {
                const dummyDraggable = contentWindow.document.querySelector('dummy-draggable-comp');
                const dummyDraggableShadowDraggable = dummyDraggable.shadowRoot.querySelector('dbui-draggable');
                const dummyDraggableShadowContainer = dummyDraggable.shadowRoot.querySelector('#container');
                const dummyDraggableShadowTwo = dummyDraggable.shadowRoot.querySelector('#two');

                const twoGetBoundingClientRect = dummyDraggableShadowTwo.getBoundingClientRect.bind(dummyDraggableShadowTwo);
                let twoGetBoundingClientRectHasBeenCalled = false;
                dummyDraggableShadowTwo.getBoundingClientRect = () => {
                  twoGetBoundingClientRectHasBeenCalled = true;
                  return twoGetBoundingClientRect();
                };

                const containerGetBoundingClientRect = dummyDraggableShadowContainer.getBoundingClientRect.bind(dummyDraggableShadowContainer);
                let containerGetBoundingClientRectHasBeenCalled = false;
                dummyDraggableShadowContainer.getBoundingClientRect = () => {
                  containerGetBoundingClientRectHasBeenCalled = true;
                  return containerGetBoundingClientRect();
                };

                dummyDraggableShadowDraggable.constraintType = 'boundingClientRectOf';
                dummyDraggableShadowDraggable.constraintSelector = '#two';

                contentWindow.requestAnimationFrame(() => {
                  setTimeout(() => {
                    sendTapEvent(dummyDraggableShadowDraggable, 'start', {
                      clientX: 0, clientY: 150
                    });
                    contentWindow.requestAnimationFrame(() => {
                      setTimeout(() => {
                        sendTapEvent(dummyDraggableShadowDraggable, 'move', {
                          clientX: 200, clientY: 200
                        });
                        sendTapEvent(dummyDraggableShadowDraggable, 'end', {
                        });
                        contentWindow.requestAnimationFrame(() => {
                          // test selector was return by query
                          expect(twoGetBoundingClientRectHasBeenCalled).to.equal(true);
                          expect(containerGetBoundingClientRectHasBeenCalled).to.equal(false);

                          dummyDraggableShadowDraggable.constraintType = 'boundingClientRectOf';
                          dummyDraggableShadowDraggable.constraintSelector = 'parent';

                          setTimeout(() => {

                            contentWindow.requestAnimationFrame(() => {
                              setTimeout(() => {
                                sendTapEvent(dummyDraggableShadowDraggable, 'start', {
                                  clientX: 0, clientY: 150
                                });

                                contentWindow.requestAnimationFrame(() => {
                                  setTimeout(() => {
                                    sendTapEvent(dummyDraggableShadowDraggable, 'move', {
                                      clientX: 200, clientY: 200
                                    });
                                    sendTapEvent(dummyDraggableShadowDraggable, 'end', {
                                    });

                                    contentWindow.requestAnimationFrame(() => {
                                      setTimeout(() => {
                                        expect(twoGetBoundingClientRectHasBeenCalled).to.equal(true);
                                        // test selector was parentElement
                                        expect(containerGetBoundingClientRectHasBeenCalled).to.equal(true);
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
                  }, 0);
                });
              });
              DummyDraggableComp.registerSelf();
            }
          });
        });
      });
    });

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
          <dbui-draggable id="draggable-one"
          constraint-type="boundingClientRectOf"
          constraint-selector="#one"
          >
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

              draggableOne.addEventListener('dragmove', (evt) => {
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
          <dbui-draggable id="draggable-one"
          constraint-type="boundingClientRectOf"
          constraint-selector="#one"
          constraint-steps-x="3"
          constraint-steps-y="3"
          >
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

              draggableOne.addEventListener('dragmove', (evt) => {
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
          <dbui-draggable id="draggable-one"
          constraint-type="circle"
          constraint-cx="200"
          constraint-cy="200"
          constraint-radius="100"
          >
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

              draggableOne.addEventListener('dragmove', (evt) => {
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
          <dbui-draggable id="draggable-one"
          constraint-type="circle"
          constraint-cx="200"
          constraint-cy="200"
          constraint-radius="100"
          constraint-steps="4"
          >
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
                expect(evtDetails[0].targetStep).to.equal(1);
                expect(evtDetails[0].degreeStep).to.equal(90);
                expect(evtDetails[0].degrees.toFixed(2)).to.equal('89.42');
                expect(evtDetails[0].targetPercent).to.equal(0.25);

                expect(evtDetails[1].sin).to.equal(0);
                expect(evtDetails[1].cos).to.equal(-1);
                expect(evtDetails[1].targetX).to.equal(75);
                expect(evtDetails[1].targetY).to.equal(175);
                expect(evtDetails[1].targetStep).to.equal(2);
                expect(evtDetails[1].degreeStep).to.equal(180);
                expect(evtDetails[1].degrees.toFixed(2)).to.equal('180.58');
                expect(evtDetails[1].targetPercent).to.equal(0.5);

                expect(evtDetails[2].sin).to.equal(-1);
                expect(evtDetails[2].cos).to.equal(-0);
                expect(evtDetails[2].targetX).to.equal(175);
                expect(evtDetails[2].targetY).to.equal(275);
                expect(evtDetails[2].targetStep).to.equal(3);
                expect(evtDetails[2].degreeStep).to.equal(270);
                expect(evtDetails[2].degrees.toFixed(2)).to.equal('270.57');
                expect(evtDetails[2].targetPercent).to.equal(0.75);
              };

              draggableOne.addEventListener('dragmove', (evt) => {
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
          <dbui-draggable id="draggable-one"
          constraint-type="boundingClientRectOf"
          constraint-selector="none"
          >
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
          <dbui-draggable id="draggable-one">
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

  describe('registering, unregistering events', () => {
    describe('when mouse events', () => {
      describe('when light DOM', () => {
        it(`
        stores self on window on _dbuiCurrentElementBeingDragged,
        creates and handles win._dbuiDraggableRegisteredEvents
        `, (done) => {
          inIframe({
            headStyle: style_2,
            bodyHTML: html_2,
            onLoad: ({ contentWindow, iframe }) => {
              const DBUIDraggable = getDBUIDraggable(contentWindow);

              Promise.all([
                DBUIDraggable.registrationName,
              ].map((localName) => contentWindow.customElements.whenDefined(localName)
              )).then(() => {

                if (!contentWindow.MouseEvent) {
                  iframe.remove();
                  done();
                  return;
                }

                const doc = contentWindow.document;
                const draggableInner1Content1 = doc.querySelector('#content-1');
                const draggableInner1 = doc.querySelector('#draggable-inner-1');

                contentWindow.requestAnimationFrame(() => {
                  setTimeout(() => {
                    expect(contentWindow._dbuiCurrentElementBeingDragged).to.equal(undefined);
                    expect(contentWindow._dbuiDraggableRegisteredEvents).to.equal(undefined);

                    sendMouseEvent(draggableInner1Content1, 'mousedown', {
                      clientX: 0, clientY: 0
                    });

                    expect(contentWindow._dbuiCurrentElementBeingDragged).to.equal(draggableInner1);
                    expect(contentWindow._dbuiDraggableRegisteredEvents.size).to.equal(1);
                    expect(contentWindow._dbuiDraggableRegisteredEvents.get(draggableInner1).mousemove)
                      .to.be.an.instanceOf(Function);


                    contentWindow.requestAnimationFrame(() => {
                      setTimeout(() => {
                        sendMouseEvent(draggableInner1Content1, 'mousemove', {
                          clientX: 10, clientY: 10
                        });

                        contentWindow.requestAnimationFrame(() => {
                          setTimeout(() => {
                            sendMouseEvent(draggableInner1Content1, 'mouseup', {
                            });

                            expect(contentWindow._dbuiCurrentElementBeingDragged).to.equal(null);
                            expect(contentWindow._dbuiDraggableRegisteredEvents.size).to.equal(0);

                            contentWindow.requestAnimationFrame(() => {
                              setTimeout(() => {
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
      });

      describe('when shadow DOM', () => {
        it(`
        stores self on window on _dbuiCurrentElementBeingDragged,
        creates and handles win._dbuiDraggableRegisteredEvents
        `, (done) => {
          inIframe({
            headStyle: `
            body, html { padding: 0px; margin: 0px; }
            `,
            bodyHTML: `
            <div id="container">
              <dummy-draggable-outer></dummy-draggable-outer>
            </div>
            `,
            onLoad: ({ contentWindow, iframe }) => {
              const DummyDraggableOuter = getDummyDraggableOuter(contentWindow);

              Promise.all([
                DummyDraggableOuter.registrationName,
              ].map((localName) => contentWindow.customElements.whenDefined(localName)
              )).then(() => {

                if (!contentWindow.MouseEvent) {
                  iframe.remove();
                  done();
                  return;
                }

                const doc = contentWindow.document;
                const dummyDraggableOuter = doc.querySelector('dummy-draggable-outer');
                const dummyDraggableMiddle = dummyDraggableOuter.shadowRoot.querySelector('dummy-draggable-middle');
                const dummyDraggableInner = dummyDraggableMiddle.shadowRoot.querySelector('dummy-draggable-inner');
                const dummyDraggableInnerDbuiDraggable = dummyDraggableInner.shadowRoot.querySelector('dbui-draggable');
                const dummyDraggableInnerDbuiDraggablePContent = dummyDraggableInner.shadowRoot.querySelector('p');

                contentWindow.requestAnimationFrame(() => {
                  setTimeout(() => {
                    expect(contentWindow._dbuiCurrentElementBeingDragged).to.equal(undefined);
                    expect(contentWindow._dbuiDraggableRegisteredEvents).to.equal(undefined);

                    sendMouseEvent(dummyDraggableInnerDbuiDraggablePContent, 'mousedown', {
                      clientX: 0, clientY: 0
                    });

                    expect(contentWindow._dbuiCurrentElementBeingDragged).to.equal(dummyDraggableInnerDbuiDraggable);
                    expect(contentWindow._dbuiDraggableRegisteredEvents.size).to.equal(1);
                    expect(contentWindow._dbuiDraggableRegisteredEvents.get(dummyDraggableInnerDbuiDraggable).mousemove)
                      .to.be.an.instanceOf(Function);


                    contentWindow.requestAnimationFrame(() => {
                      setTimeout(() => {
                        sendMouseEvent(dummyDraggableInnerDbuiDraggablePContent, 'mousemove', {
                          clientX: 10, clientY: 10
                        });

                        contentWindow.requestAnimationFrame(() => {
                          setTimeout(() => {
                            sendMouseEvent(dummyDraggableInnerDbuiDraggablePContent, 'mouseup', {
                            });

                            expect(contentWindow._dbuiCurrentElementBeingDragged).to.equal(null);
                            expect(contentWindow._dbuiDraggableRegisteredEvents.size).to.equal(0);

                            contentWindow.requestAnimationFrame(() => {
                              setTimeout(() => {
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

              DummyDraggableOuter.registerSelf();
            }
          });
        });
      });
    });

    describe('when touch events', () => {
      describe('when light DOM', () => {
        it(`
        does NOT store self on window on _dbuiCurrentElementBeingDragged,
        creates and handles win._dbuiDraggableRegisteredEvents
        `, (done) => {
          inIframe({
            headStyle: style_2,
            bodyHTML: html_2,
            onLoad: ({ contentWindow, iframe }) => {
              // onScreenConsole({ win: contentWindow });
              const DBUIDraggable = getDBUIDraggable(contentWindow);

              Promise.all([
                DBUIDraggable.registrationName,
              ].map((localName) => contentWindow.customElements.whenDefined(localName)
              )).then(() => {

                if (!contentWindow.TouchEvent) {
                  iframe.remove();
                  done();
                  return;
                }

                const doc = contentWindow.document;
                const draggableInner1 = doc.querySelector('#draggable-inner-1');
                const draggableInner2 = doc.querySelector('#draggable-inner-2');
                const draggableInner1Content1 = doc.querySelector('#content-1');
                const draggableInner2Content2 = doc.querySelector('#content-2');

                const touchObj1 = new contentWindow.Touch({
                  identifier: new Date(),
                  target: draggableInner1,
                });
                const touchObj2 = new contentWindow.Touch({
                  identifier: new Date(),
                  target: draggableInner2,
                });

                contentWindow.requestAnimationFrame(() => {
                  setTimeout(() => {
                    expect(contentWindow._dbuiCurrentElementBeingDragged).to.equal(undefined);
                    expect(contentWindow._dbuiDraggableRegisteredEvents).to.equal(undefined);

                    sendTouchEvent(draggableInner1Content1, 'touchstart', {
                      clientX: 0, clientY: 0
                    });
                    sendTouchEvent(draggableInner1Content1, 'touchstart', {
                      clientX: 1, clientY: 1
                    });
                    sendTouchEvent(draggableInner2Content2, 'touchstart', {
                      clientX: 0, clientY: 0
                    });

                    expect(contentWindow._dbuiCurrentElementBeingDragged).to.equal(undefined);
                    expect(contentWindow._dbuiDraggableRegisteredEvents.size).to.equal(2);
                    expect(contentWindow._dbuiDraggableRegisteredEvents.get(draggableInner1).touchmove)
                      .to.be.an.instanceOf(Function);
                    expect(contentWindow._dbuiDraggableRegisteredEvents.get(draggableInner2).touchmove)
                      .to.be.an.instanceOf(Function);

                    contentWindow.requestAnimationFrame(() => {
                      setTimeout(() => {
                        sendTouchEvent(draggableInner1Content1, 'touchmove', {
                          clientX: 10, clientY: 10
                        });

                        contentWindow.requestAnimationFrame(() => {
                          setTimeout(() => {
                            sendTouchEvent(draggableInner1, 'touchend', {
                              touches: [touchObj1, touchObj2]
                            });
                            expect(contentWindow._dbuiDraggableRegisteredEvents.size).to.equal(2);
                            expect(contentWindow._dbuiDraggableRegisteredEvents.get(draggableInner1).touchmove)
                              .to.be.an.instanceOf(Function);
                            expect(contentWindow._dbuiDraggableRegisteredEvents.get(draggableInner2).touchmove)
                              .to.be.an.instanceOf(Function);

                            sendTouchEvent(draggableInner1, 'touchend', {
                              touches: [touchObj2]
                            });
                            expect(contentWindow._dbuiDraggableRegisteredEvents.size).to.equal(1);
                            expect(contentWindow._dbuiDraggableRegisteredEvents.get(draggableInner1))
                              .to.equal(undefined);
                            expect(contentWindow._dbuiDraggableRegisteredEvents.get(draggableInner2).touchmove)
                              .to.be.an.instanceOf(Function);

                            sendTouchEvent(draggableInner2, 'touchend', {
                              touches: []
                            });
                            expect(contentWindow._dbuiDraggableRegisteredEvents.size).to.equal(0);
                            expect(contentWindow._dbuiDraggableRegisteredEvents.get(draggableInner1))
                              .to.equal(undefined);
                            expect(contentWindow._dbuiDraggableRegisteredEvents.get(draggableInner2))
                              .to.equal(undefined);

                            contentWindow.requestAnimationFrame(() => {
                              setTimeout(() => {
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
      });

      describe('when shadow DOM', () => {
        it(`
        does NOT store self on window on _dbuiCurrentElementBeingDragged,
        creates and handles win._dbuiDraggableRegisteredEvents
        `, (done) => {
          inIframe({
            headStyle: `
            body, html { padding: 0px; margin: 0px; }
            `,
            bodyHTML: `
            <div id="container">
              <dummy-draggable-outer></dummy-draggable-outer>
            </div>
            `,
            onLoad: ({ contentWindow, iframe }) => {
              const DummyDraggableOuter = getDummyDraggableOuter(contentWindow);

              Promise.all([
                DummyDraggableOuter.registrationName,
              ].map((localName) => contentWindow.customElements.whenDefined(localName)
              )).then(() => {

                if (!contentWindow.TouchEvent) {
                  iframe.remove();
                  done();
                  return;
                }

                const doc = contentWindow.document;
                const dummyDraggableOuter = doc.querySelector('dummy-draggable-outer');
                const dummyDraggableMiddle = dummyDraggableOuter.shadowRoot.querySelector('dummy-draggable-middle');
                const dummyDraggableInner = dummyDraggableMiddle.shadowRoot.querySelector('dummy-draggable-inner');
                const dbuiDraggable1 = dummyDraggableInner.shadowRoot.querySelector('#draggable-inner-1');
                const dbuiDraggable2 = dummyDraggableInner.shadowRoot.querySelector('#draggable-inner-2');
                const dbuiDraggable1Content = dummyDraggableInner.shadowRoot.querySelector('#content-1');
                const dbuiDraggable2Content = dummyDraggableInner.shadowRoot.querySelector('#content-2');

                const touchObj1 = new contentWindow.Touch({
                  identifier: new Date(),
                  target: dbuiDraggable1,
                });
                const touchObj2 = new contentWindow.Touch({
                  identifier: new Date(),
                  target: dbuiDraggable2,
                });

                contentWindow.requestAnimationFrame(() => {
                  setTimeout(() => {
                    expect(contentWindow._dbuiCurrentElementBeingDragged).to.equal(undefined);
                    expect(contentWindow._dbuiDraggableRegisteredEvents).to.equal(undefined);

                    sendTouchEvent(dbuiDraggable1Content, 'touchstart', {
                      clientX: 0, clientY: 0
                    });
                    sendTouchEvent(dbuiDraggable1Content, 'touchstart', {
                      clientX: 1, clientY: 1
                    });
                    sendTouchEvent(dbuiDraggable2Content, 'touchstart', {
                      clientX: 0, clientY: 0
                    });

                    expect(contentWindow._dbuiCurrentElementBeingDragged).to.equal(undefined);
                    expect(contentWindow._dbuiDraggableRegisteredEvents.size).to.equal(2);
                    expect(contentWindow._dbuiDraggableRegisteredEvents.get(dbuiDraggable1).touchmove)
                      .to.be.an.instanceOf(Function);
                    expect(contentWindow._dbuiDraggableRegisteredEvents.get(dbuiDraggable2).touchmove)
                      .to.be.an.instanceOf(Function);

                    contentWindow.requestAnimationFrame(() => {
                      setTimeout(() => {
                        sendTouchEvent(dbuiDraggable2Content, 'touchmove', {
                          clientX: 10, clientY: 10
                        });

                        contentWindow.requestAnimationFrame(() => {
                          setTimeout(() => {
                            sendTouchEvent(dbuiDraggable1, 'touchend', {
                              touches: [touchObj1, touchObj2]
                            });
                            expect(contentWindow._dbuiDraggableRegisteredEvents.size).to.equal(2);
                            expect(contentWindow._dbuiDraggableRegisteredEvents.get(dbuiDraggable1).touchmove)
                              .to.be.an.instanceOf(Function);
                            expect(contentWindow._dbuiDraggableRegisteredEvents.get(dbuiDraggable2).touchmove)
                              .to.be.an.instanceOf(Function);

                            sendTouchEvent(dbuiDraggable1, 'touchend', {
                              touches: [touchObj2]
                            });
                            expect(contentWindow._dbuiDraggableRegisteredEvents.size).to.equal(1);
                            expect(contentWindow._dbuiDraggableRegisteredEvents.get(dbuiDraggable1))
                              .to.equal(undefined);
                            expect(contentWindow._dbuiDraggableRegisteredEvents.get(dbuiDraggable2).touchmove)
                              .to.be.an.instanceOf(Function);

                            sendTouchEvent(dbuiDraggable2, 'touchend', {
                              touches: []
                            });
                            expect(contentWindow._dbuiDraggableRegisteredEvents.size).to.equal(0);
                            expect(contentWindow._dbuiDraggableRegisteredEvents.get(dbuiDraggable1))
                              .to.equal(undefined);
                            expect(contentWindow._dbuiDraggableRegisteredEvents.get(dbuiDraggable2))
                              .to.equal(undefined);

                            contentWindow.requestAnimationFrame(() => {
                              setTimeout(() => {
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

              DummyDraggableOuter.registerSelf();
            }
          });
        });
      });
    });
  });

  describe('_onConstraintNodeResize', () => {
    it('reposition itself inside the boundaries', (done) => {
      inIframe({
        headStyle: `
        body, html { padding: 0px; margin: 0px; }
        #resize-sensor {
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
        <dbui-resize-sensor id="resize-sensor">
          <dbui-draggable id="draggable-one"
          constraint-type="boundingClientRectOf"
          constraint-selector="#resize-sensor"
          target-translate-x="100"
          target-translate-y="100"
          ></dbui-draggable>
        </dbui-resize-sensor>

        `,
        onLoad: ({ contentWindow, iframe }) => {
          const DBUIDraggable = getDBUIDraggable(contentWindow);
          const DBUIResizeSensor = getDBUIResizeSensor(contentWindow);
          const resizeSensor = contentWindow.document.querySelector('#resize-sensor');
          const draggableOne = contentWindow.document.querySelector('#draggable-one');

          Promise.all([
            DBUIDraggable.registrationName,
          ].map((localName) => contentWindow.customElements.whenDefined(localName)
          )).then(() => {

            draggableOne.addEventListener('mousedown', () => {
              draggableOne.style.backgroundColor = 'red';
            });

            draggableOne.addEventListener('touchstart', () => {
              draggableOne.style.backgroundColor = 'red';
            });

            draggableOne.addEventListener('mouseup', () => {
              draggableOne.style.backgroundColor = 'black';
            });

            draggableOne.addEventListener('touchend', () => {
              draggableOne.style.backgroundColor = 'black';
            });

            function dragMove1(evt) {
              expect(draggableOne.getBoundingClientRect().x).to.equal(50);
              expect(draggableOne.getBoundingClientRect().y).to.equal(50);
              expect(evt.detail.targetY).to.equal(50);
              expect(evt.detail.targetY).to.equal(50);
              draggableOne.removeEventListener('dragmove', dragMove1);
              draggableOne.addEventListener('dragmove', dragMove2);

              contentWindow.requestAnimationFrame(() => {
                setTimeout(() => {
                  sendTapEvent(draggableOne, 'end', {});
                  contentWindow.requestAnimationFrame(() => {
                    setTimeout(() => {
                      resizeSensor.style.width = '150px';
                      resizeSensor.style.height = '150px';
                      contentWindow.requestAnimationFrame(() => {
                        setTimeout(() => {
                          sendTapEvent(draggableOne, 'start', {
                            clientX: 50, clientY: 50
                          });
                          sendTapEvent(draggableOne, 'move', {
                            clientX: 100, clientY: 100
                          });
                        }, 0);
                      });
                    }, 0);
                  });
                }, 0);
              });
            }

            draggableOne.addEventListener('dragmove', dragMove1);

            function dragMove2(evt) {
              expect(draggableOne.getBoundingClientRect().x).to.equal(100);
              expect(draggableOne.getBoundingClientRect().y).to.equal(100);
              expect(evt.detail.targetX).to.equal(100);
              expect(evt.detail.targetY).to.equal(100);
              draggableOne.removeEventListener('dragmove', dragMove2);
              draggableOne.addEventListener('dragmove', dragMove3);
              contentWindow.requestAnimationFrame(() => {
                setTimeout(() => {
                  resizeSensor.style.width = '100px';
                  resizeSensor.style.height = '100px';
                }, 0);
              });

            }

            function dragMove3(evt) {
              expect(draggableOne.getBoundingClientRect().x).to.equal(50);
              expect(draggableOne.getBoundingClientRect().y).to.equal(50);
              expect(evt.detail.targetX).to.equal(50);
              expect(evt.detail.targetY).to.equal(50);
              contentWindow.requestAnimationFrame(() => {
                setTimeout(() => {
                  iframe.remove();
                  done();
                }, 0);
              });
            }

            contentWindow.requestAnimationFrame(() => {
              setTimeout(() => {
                sendTapEvent(draggableOne, 'start', {
                  clientX: 100, clientY: 100
                });
                contentWindow.requestAnimationFrame(() => {
                  expect(draggableOne.getBoundingClientRect().y).to.equal(100);
                  setTimeout(() => {
                    resizeSensor.style.width = '100px';
                    resizeSensor.style.height = '100px';
                  }, 0);
                });
              }, 0);
            });
          });
          DBUIResizeSensor.registerSelf();
          DBUIDraggable.registerSelf();
        }
      });
    });
  });
});
