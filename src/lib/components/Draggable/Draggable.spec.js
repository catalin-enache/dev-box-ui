import React from 'react';
import ReactDOM from 'react-dom';
import ReactTestUtils from 'react-dom/test-utils';
import { describe, it } from 'mocha';
import { expect } from 'chai';

import Draggable from './Draggable';

/* eslint react/no-find-dom-node: 0 */

import { sendTouchEvent } from '../../../../testUtils/simulateEvents';


describe('Draggable', () => {
  it(`On mousedown it registers mousemove and mouseup events.
  On mousemove it follows mouse coordinates.`,
    (done) => {
      function test(node) {
        if (!node) return;

        const htmlNodeFound1 = ReactDOM.findDOMNode(node);
        const htmlNodeFound2 = ReactTestUtils.findRenderedDOMComponentWithClass(node, 'dbu-draggable');
        const reactElementFound1 = ReactTestUtils.findRenderedComponentWithType(node, Draggable);

        expect(node).to.equal(reactElementFound1);
        expect(htmlNodeFound1).to.equal(htmlNodeFound2);
        expect(htmlNodeFound1.getAttribute('class')).to.equal(
          'dbu-draggable'
        );

        setTimeout(() => {
          const { top: top1, left: left1 } = htmlNodeFound1.getBoundingClientRect();
          const [distanceX, distanceY] = [20, 20];

          const mouseDown = new MouseEvent('mousedown', { clientX: 0, clientY: 0, bubbles: true });
          htmlNodeFound1.dispatchEvent(mouseDown);
          const mouseMove = new MouseEvent('mousemove', { clientX: distanceX, clientY: distanceY, bubbles: true });
          document.dispatchEvent(mouseMove);
          const mouseUp = new MouseEvent('mouseup');
          document.dispatchEvent(mouseUp);

          requestAnimationFrame(() => {
            const { top: top2, left: left2 } = htmlNodeFound1.getBoundingClientRect();
            expect(top2).to.equal(top1 + distanceY);
            expect(left2).to.equal(left1 + distanceX);
            done();
          });

        }, 0);
      }

      ReactDOM.render(
        <Draggable ref={test}>
          <div>
            <p>content</p>
          </div>
        </Draggable>
        , document.querySelector('#testing')
      );
    });

  it(`On touchstart it registers touchmove, touchend and touchcancel events.
  On touchmove it follows pointer coordinates.`,
    (done) => {
      function test(node) {
        if (!node) return;

        const htmlNodeFound1 = ReactDOM.findDOMNode(node);
        const htmlNodeFound2 = ReactTestUtils.findRenderedDOMComponentWithClass(node, 'dbu-draggable');
        const reactElementFound1 = ReactTestUtils.findRenderedComponentWithType(node, Draggable);

        expect(node).to.equal(reactElementFound1);
        expect(htmlNodeFound1).to.equal(htmlNodeFound2);
        expect(htmlNodeFound1.getAttribute('class')).to.equal(
          'dbu-draggable'
        );

        setTimeout(() => {
          const { top: top1, left: left1 } = htmlNodeFound1.getBoundingClientRect();
          const [distanceX, distanceY] = [20, 20];

          sendTouchEvent(0, 0, htmlNodeFound1, 'touchstart');
          sendTouchEvent(distanceX, distanceY, document, 'touchmove');
          sendTouchEvent(0, 0, document, 'touchend');

          requestAnimationFrame(() => {
            const { top: top2, left: left2 } = htmlNodeFound1.getBoundingClientRect();
            expect(top2).to.equal(top1 + distanceY);
            expect(left2).to.equal(left1 + distanceX);
            done();
          });

        }, 0);
      }

      ReactDOM.render(
        <Draggable ref={test}>
          <div>
            <p>content</p>
          </div>
        </Draggable>
        , document.querySelector('#testing')
      );
    });

  it('sets _dragRunning to false when unmounted',
    (done) => {
      function test(node) {
        if (!node) return;

        const htmlNodeFound1 = ReactDOM.findDOMNode(node);
        const htmlNodeFound2 = ReactTestUtils.findRenderedDOMComponentWithClass(node, 'dbu-draggable');
        const reactElementFound1 = ReactTestUtils.findRenderedComponentWithType(node, Draggable);

        expect(node).to.equal(reactElementFound1);
        expect(htmlNodeFound1).to.equal(htmlNodeFound2);
        expect(htmlNodeFound1.getAttribute('class')).to.equal(
          'dbu-draggable'
        );

        setTimeout(() => {
          const { top: top1, left: left1 } = htmlNodeFound1.getBoundingClientRect();
          const [distanceX, distanceY] = [20, 20];

          sendTouchEvent(0, 0, htmlNodeFound1, 'touchstart');
          sendTouchEvent(distanceX, distanceY, document, 'touchmove');

          requestAnimationFrame(() => {
            const { top: top2, left: left2 } = htmlNodeFound1.getBoundingClientRect();
            expect(top2).to.equal(top1 + distanceY);
            expect(left2).to.equal(left1 + distanceX);

            sendTouchEvent(distanceX, distanceY, document, 'touchmove');
            expect(node._dragRunning).to.equal(true);
            expect(!!node.node).to.equal(true);
            ReactDOM.unmountComponentAtNode(document.querySelector('#testing'));
            expect(node._dragRunning).to.equal(true);
            expect(node.node).to.equal(null);

            requestAnimationFrame(() => {
              expect(node._dragRunning).to.equal(false);
              expect(node.node).to.equal(null);
              const { top: top2, left: left2 } = htmlNodeFound1.getBoundingClientRect();
              expect(top2).to.equal(0);
              expect(left2).to.equal(0);
              done();
            });
          });

        }, 0);
      }

      ReactDOM.render(
        <Draggable ref={test}>
          <div>
            <p>content</p>
          </div>
        </Draggable>
        , document.querySelector('#testing')
      );
    });
});
