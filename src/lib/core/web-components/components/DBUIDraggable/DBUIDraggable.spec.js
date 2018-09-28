import { expect } from 'chai';
import inIframe from '../../../../../../testUtils/inIframe';
import getDBUIDraggable from './DBUIDraggable';

describe('DBUIDraggable', () => {
  it.only('behaves as expected', (done) => {
    inIframe({
      headStyle: `
      p {
        width: 300px;
        height: 100px;
      }
      
      #container {
        position: relative;
      }
      
      #wrapper-draggable-one, #wrapper-draggable-two, #wrapper-draggable-three {
        position: absolute;
        width: 500px;
        height: 180px;
      }
      
      #wrapper-draggable-one {
        width: 450px;
        height: 160px;
      }
      
      #wrapper-draggable-one { top: 0px;}
      
      #wrapper-draggable-two { top: 200px;}
      
      #wrapper-draggable-three { top: 400px; }
      
      
      #wrapper-draggable-one, #wrapper-draggable-two, #wrapper-draggable-three {
        border: 5px solid green;
      }
      
      dbui-draggable {
        border: 5px solid #ddd;
      }
      
      #draggable-two {
        position: absolute;
        left: 5px;
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
        
      </div>
      
      `,
      onLoad: ({ contentWindow, iframe }) => {
        const DBUIDraggable = getDBUIDraggable(contentWindow);

        const container = contentWindow.document.querySelector('#container');

        const wrapperDraggableOne = contentWindow.document.querySelector('#wrapper-draggable-one');
        const wrapperDraggableTwo = contentWindow.document.querySelector('#wrapper-draggable-two');
        const wrapperDraggableThree = contentWindow.document.querySelector('#wrapper-draggable-three');

        const draggableOne = contentWindow.document.querySelector('#draggable-one');
        const draggableTwo = contentWindow.document.querySelector('#draggable-two');
        const draggableThree = contentWindow.document.querySelector('#draggable-three');

        // draggableOne.constraint = 'boundingClientRect(550, 250)';
        draggableOne.addEventListener('translate', (evt) => {
          const {
            targetTranslateX,
            targetTranslateY
          } = evt.detail;
          // wrapperDraggableTwo.style.transform = `translate(${targetTranslateX}px,${targetTranslateY}px)`;
        });
        // const computedStyle = contentWindow.getComputedStyle(wrapperDraggableTwo, null);
        // var { left: rectX, top: rectY, width: rectWidth, height: rectHeight } = computedStyle;
        // console.log('computedStyle', { rectX, rectY, rectWidth, rectHeight });

        // const boundingClientRect = wrapperDraggableTwo.getBoundingClientRect();
        // var { width: rectWidth, height: rectHeight } = boundingClientRect;
        // console.log('boundingClientRect', { rectX, rectY, rectWidth, rectHeight });

        // draggableTwo.constraint = `boundingClientRect(${rectWidth}, ${rectHeight})`;

        draggableTwo.constraint = 'boundingClientRectOf("#wrapper-draggable-one")';

        // draggableTwo.applyCorrection = ({ targetTranslateX, targetTranslateY, targetWidthOnStart, targetHeightOnStart }) => {
        //   const computedStyle = contentWindow.getComputedStyle(wrapperDraggableTwo, null);
        //   const maxX = parseInt(computedStyle.width, 10) - targetWidthOnStart;
        //   const maxY = parseInt(computedStyle.height, 10) - targetHeightOnStart;
        //   const revisedTranslateX = Math.max(0, Math.min(targetTranslateX, maxX));
        //   const revisedTranslateY = Math.max(0, Math.min(targetTranslateY, maxY));
        //   return { targetTranslateX: revisedTranslateX, targetTranslateY: revisedTranslateY };
        // };

        draggableTwo.addEventListener('translate', (evt) => {
          const {
            targetTranslateX,
            targetTranslateY
          } = evt.detail;
          // draggableThree.style.transform = `translate(${targetTranslateX}px,${targetTranslateY}px)`;
          // draggableThree.setAttribute('target-translate-x', targetTranslateX);
          // draggableThree.targetTranslateY = targetTranslateY;
          // draggableTwo._targetToDrag.style.transform = `translate(${-targetTranslateX}px,${-targetTranslateY}px)`;
        });

        draggableThree.addEventListener('translate', (evt) => {
          const {
            targetTranslateX,
            targetTranslateY
          } = evt.detail;
          // draggableThree.style.transform = `translate(${targetTranslateX}px,${targetTranslateY}px)`;
          // draggableThree.setAttribute('target-translate-x', targetTranslateX);
          // draggableThree.targetTranslateY = targetTranslateY;
        });

        Promise.all([
          DBUIDraggable.registrationName,
        ].map((localName) => contentWindow.customElements.whenDefined(localName)
        )).then(() => {

          setTimeout(() => {
            // draggableOne.remove();
            // draggableOne.dragTarget = '#wrapper-draggable-three';
          }, 2000);

          setTimeout(() => {
            iframe.remove();
            done();
          }, 55000);
        });

        DBUIDraggable.registerSelf();
      }
    });
  });
});
