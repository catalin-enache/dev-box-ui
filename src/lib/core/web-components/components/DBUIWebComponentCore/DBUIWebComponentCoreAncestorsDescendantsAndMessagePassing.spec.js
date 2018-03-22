import { expect, assert } from 'chai';
import sinon from 'sinon';
import getDBUIWebComponentCore from './DBUIWebComponentCore';
import DBUICommonCssVars from './DBUICommonCssVars';
import ensureSingleRegistration from '../../../internals/ensureSingleRegistration';
import getDBUILocaleService from '../../../services/DBUILocaleService';
import appendStyles from '../../../internals/appendStyles';
import inIframe from '../../../../../../testUtils/inIframe';
import DBUIWebComponentMessage from "./DBUIWebComponentMessage";

import {
  getDummyA,
  getDummyB,
  getDummyC,
  getDummyD,
  getDummyE,
  treeOne,
  treeOneGetDbuiNodes,
  treeStyle
} from './DBUITestTreeSetup';

/* eslint camelcase: 0 */

describe('DBUIWebComponentBase ancestors/descendants and message passing', () => {
  describe('closestDbuiParent/closestDbuiChildren', () => {
    it('onReady returns closest dbui parent/children', (done) => {
      inIframe({
        headStyle: treeStyle,
        bodyHTML: `
        <div id="container">
          ${treeOne}
        </div>
        `,
        onLoad: ({ contentWindow, iframe }) => {

          const DummyA = getDummyA(contentWindow);
          const DummyB = getDummyB(contentWindow);
          const DummyC = getDummyC(contentWindow);
          const DummyD = getDummyD(contentWindow);
          const DummyE = getDummyE(contentWindow);

          const container = contentWindow.document.querySelector('#container');

          const doTest = (node) => {
            const dbuiNodes = treeOneGetDbuiNodes(contentWindow);
            const {
              lightDummyDOneRoot,
              lightDummyDOneRoot_ShadowDummyB,
              lightDummyDOneRoot_ShadowDummyB_ShadowDummyA,

              lightDummyEInNamedSlot,
              lightDummyEInNamedSlot_ShadowDummyD,
              lightDummyEInNamedSlot_ShadowDummyD_ShadowDummyB,
              lightDummyEInNamedSlot_ShadowDummyD_ShadowDummyB_ShadowDummyA,
              lightDummyEInNamedSlot_ShadowDummyCInDefaultSlot,
              lightDummyEInNamedSlot_ShadowDummyCInDefaultSlot_ShadowDummyB,
              lightDummyEInNamedSlot_ShadowDummyCInDefaultSlot_ShadowDummyB_ShadowDummyA,

              lightDummyDTwoInDefaultSlot,
              lightDummyDTwoInDefaultSlot_ShadowDummyB,
              lightDummyDTwoInDefaultSlot_ShadowDummyB_ShadowDummyA,

              lightDummyDThreeInDefaultSlot,
              lightDummyDThreeInDefaultSlot_ShadowDummyB,
              lightDummyDThreeInDefaultSlot_ShadowDummyB_ShadowDummyA,

              lightDummyEInDefaultSlot,
              lightDummyEInDefaultSlot_ShadowDummyD,
              lightDummyEInDefaultSlot_ShadowDummyD_ShadowDummyB,
              lightDummyEInDefaultSlot_ShadowDummyD_ShadowDummyB_ShadowDummyA,
              lightDummyEInDefaultSlot_ShadowDummyCInDefaultSlot,
              lightDummyEInDefaultSlot_ShadowDummyCInDefaultSlot_ShadowDummyB,
              lightDummyEInDefaultSlot_ShadowDummyCInDefaultSlot_ShadowDummyB_ShadowDummyA
            } = dbuiNodes;

            Object.keys(dbuiNodes).forEach((key) => {
              const node = dbuiNodes[key];
              expect(node.getAttribute('context-color4')).to.equal('bisque');
            });

            // Test closestDbuiParent sync.
            // Also test that closestDbuiParent existed at the time of connectedCallback.
            // NOTE: even it existed it might not have been connected yet.
            expect(lightDummyDOneRoot.closestDbuiParent).to.equal(null);
            expect(lightDummyDOneRoot.closestDbuiParent).to.equal(lightDummyDOneRoot.__testClosestDbuiParent);
            expect(lightDummyDOneRoot_ShadowDummyB.closestDbuiParent).to.equal(lightDummyDOneRoot);
            expect(lightDummyDOneRoot_ShadowDummyB.closestDbuiParent).to.equal(lightDummyDOneRoot_ShadowDummyB.__testClosestDbuiParent);
            expect(lightDummyDOneRoot_ShadowDummyB_ShadowDummyA.closestDbuiParent).to.equal(lightDummyDOneRoot_ShadowDummyB);
            expect(lightDummyDOneRoot_ShadowDummyB_ShadowDummyA.closestDbuiParent).to.equal(lightDummyDOneRoot_ShadowDummyB_ShadowDummyA.__testClosestDbuiParent);

            expect(lightDummyEInNamedSlot.closestDbuiParent).to.equal(lightDummyDOneRoot);
            expect(lightDummyEInNamedSlot.closestDbuiParent).to.equal(lightDummyEInNamedSlot.__testClosestDbuiParent);
            expect(lightDummyEInNamedSlot_ShadowDummyD.closestDbuiParent).to.equal(lightDummyEInNamedSlot);
            expect(lightDummyEInNamedSlot_ShadowDummyD.closestDbuiParent).to.equal(lightDummyEInNamedSlot_ShadowDummyD.__testClosestDbuiParent);
            expect(lightDummyEInNamedSlot_ShadowDummyD_ShadowDummyB.closestDbuiParent).to.equal(lightDummyEInNamedSlot_ShadowDummyD);
            expect(lightDummyEInNamedSlot_ShadowDummyD_ShadowDummyB.closestDbuiParent).to.equal(lightDummyEInNamedSlot_ShadowDummyD_ShadowDummyB.__testClosestDbuiParent);
            expect(lightDummyEInNamedSlot_ShadowDummyD_ShadowDummyB_ShadowDummyA.closestDbuiParent).to.equal(lightDummyEInNamedSlot_ShadowDummyD_ShadowDummyB);
            expect(lightDummyEInNamedSlot_ShadowDummyD_ShadowDummyB_ShadowDummyA.closestDbuiParent).to.equal(lightDummyEInNamedSlot_ShadowDummyD_ShadowDummyB_ShadowDummyA.__testClosestDbuiParent);
            expect(lightDummyEInNamedSlot_ShadowDummyCInDefaultSlot.closestDbuiParent).to.equal(lightDummyEInNamedSlot_ShadowDummyD);
            expect(lightDummyEInNamedSlot_ShadowDummyCInDefaultSlot.closestDbuiParent).to.equal(lightDummyEInNamedSlot_ShadowDummyCInDefaultSlot.__testClosestDbuiParent);
            expect(lightDummyEInNamedSlot_ShadowDummyCInDefaultSlot_ShadowDummyB.closestDbuiParent).to.equal(lightDummyEInNamedSlot_ShadowDummyCInDefaultSlot);
            expect(lightDummyEInNamedSlot_ShadowDummyCInDefaultSlot_ShadowDummyB.closestDbuiParent).to.equal(lightDummyEInNamedSlot_ShadowDummyCInDefaultSlot_ShadowDummyB.__testClosestDbuiParent);
            expect(lightDummyEInNamedSlot_ShadowDummyCInDefaultSlot_ShadowDummyB_ShadowDummyA.closestDbuiParent).to.equal(lightDummyEInNamedSlot_ShadowDummyCInDefaultSlot_ShadowDummyB);
            expect(lightDummyEInNamedSlot_ShadowDummyCInDefaultSlot_ShadowDummyB_ShadowDummyA.closestDbuiParent).to.equal(lightDummyEInNamedSlot_ShadowDummyCInDefaultSlot_ShadowDummyB_ShadowDummyA.__testClosestDbuiParent);

            expect(lightDummyDTwoInDefaultSlot.closestDbuiParent).to.equal(lightDummyDOneRoot);
            expect(lightDummyDTwoInDefaultSlot.closestDbuiParent).to.equal(lightDummyDTwoInDefaultSlot.__testClosestDbuiParent);
            expect(lightDummyDTwoInDefaultSlot_ShadowDummyB.closestDbuiParent).to.equal(lightDummyDTwoInDefaultSlot);
            expect(lightDummyDTwoInDefaultSlot_ShadowDummyB.closestDbuiParent).to.equal(lightDummyDTwoInDefaultSlot_ShadowDummyB.__testClosestDbuiParent);
            expect(lightDummyDTwoInDefaultSlot_ShadowDummyB_ShadowDummyA.closestDbuiParent).to.equal(lightDummyDTwoInDefaultSlot_ShadowDummyB);
            expect(lightDummyDTwoInDefaultSlot_ShadowDummyB_ShadowDummyA.closestDbuiParent).to.equal(lightDummyDTwoInDefaultSlot_ShadowDummyB_ShadowDummyA.__testClosestDbuiParent);

            expect(lightDummyDThreeInDefaultSlot.closestDbuiParent).to.equal(lightDummyDTwoInDefaultSlot);
            expect(lightDummyDThreeInDefaultSlot.closestDbuiParent).to.equal(lightDummyDThreeInDefaultSlot.__testClosestDbuiParent);
            expect(lightDummyDThreeInDefaultSlot_ShadowDummyB.closestDbuiParent).to.equal(lightDummyDThreeInDefaultSlot);
            expect(lightDummyDThreeInDefaultSlot_ShadowDummyB.closestDbuiParent).to.equal(lightDummyDThreeInDefaultSlot_ShadowDummyB.__testClosestDbuiParent);
            expect(lightDummyDThreeInDefaultSlot_ShadowDummyB_ShadowDummyA.closestDbuiParent).to.equal(lightDummyDThreeInDefaultSlot_ShadowDummyB);
            expect(lightDummyDThreeInDefaultSlot_ShadowDummyB_ShadowDummyA.closestDbuiParent).to.equal(lightDummyDThreeInDefaultSlot_ShadowDummyB_ShadowDummyA.__testClosestDbuiParent);

            expect(lightDummyEInDefaultSlot.closestDbuiParent).to.equal(lightDummyDThreeInDefaultSlot);
            expect(lightDummyEInDefaultSlot.closestDbuiParent).to.equal(lightDummyEInDefaultSlot.__testClosestDbuiParent);
            expect(lightDummyEInDefaultSlot_ShadowDummyD.closestDbuiParent).to.equal(lightDummyEInDefaultSlot);
            expect(lightDummyEInDefaultSlot_ShadowDummyD.closestDbuiParent).to.equal(lightDummyEInDefaultSlot_ShadowDummyD.__testClosestDbuiParent);
            expect(lightDummyEInDefaultSlot_ShadowDummyD_ShadowDummyB.closestDbuiParent).to.equal(lightDummyEInDefaultSlot_ShadowDummyD);
            expect(lightDummyEInDefaultSlot_ShadowDummyD_ShadowDummyB.closestDbuiParent).to.equal(lightDummyEInDefaultSlot_ShadowDummyD_ShadowDummyB.__testClosestDbuiParent);
            expect(lightDummyEInDefaultSlot_ShadowDummyD_ShadowDummyB_ShadowDummyA.closestDbuiParent).to.equal(lightDummyEInDefaultSlot_ShadowDummyD_ShadowDummyB);
            expect(lightDummyEInDefaultSlot_ShadowDummyD_ShadowDummyB_ShadowDummyA.closestDbuiParent).to.equal(lightDummyEInDefaultSlot_ShadowDummyD_ShadowDummyB_ShadowDummyA.__testClosestDbuiParent);
            expect(lightDummyEInDefaultSlot_ShadowDummyCInDefaultSlot.closestDbuiParent).to.equal(lightDummyEInDefaultSlot_ShadowDummyD);
            expect(lightDummyEInDefaultSlot_ShadowDummyCInDefaultSlot.closestDbuiParent).to.equal(lightDummyEInDefaultSlot_ShadowDummyCInDefaultSlot.__testClosestDbuiParent);
            expect(lightDummyEInDefaultSlot_ShadowDummyCInDefaultSlot_ShadowDummyB.closestDbuiParent).to.equal(lightDummyEInDefaultSlot_ShadowDummyCInDefaultSlot);
            expect(lightDummyEInDefaultSlot_ShadowDummyCInDefaultSlot_ShadowDummyB.closestDbuiParent).to.equal(lightDummyEInDefaultSlot_ShadowDummyCInDefaultSlot_ShadowDummyB.__testClosestDbuiParent);
            expect(lightDummyEInDefaultSlot_ShadowDummyCInDefaultSlot_ShadowDummyB_ShadowDummyA.closestDbuiParent).to.equal(lightDummyEInDefaultSlot_ShadowDummyCInDefaultSlot_ShadowDummyB);
            expect(lightDummyEInDefaultSlot_ShadowDummyCInDefaultSlot_ShadowDummyB_ShadowDummyA.closestDbuiParent).to.equal(lightDummyEInDefaultSlot_ShadowDummyCInDefaultSlot_ShadowDummyB_ShadowDummyA.__testClosestDbuiParent);


            // Test closestDbuiChildren sync.
            // NOTE: we know that at the time of connectedCallback closestDbuiChildren might not have been complete.
            expect(lightDummyDOneRoot.closestDbuiChildren).to.have.members([lightDummyDOneRoot_ShadowDummyB, lightDummyEInNamedSlot, lightDummyDTwoInDefaultSlot]);
            expect(lightDummyDOneRoot_ShadowDummyB.closestDbuiChildren).to.have.members([lightDummyDOneRoot_ShadowDummyB_ShadowDummyA]);
            expect(lightDummyDOneRoot_ShadowDummyB_ShadowDummyA.closestDbuiChildren).to.have.members([]);

            expect(lightDummyEInNamedSlot.closestDbuiChildren).to.have.members([lightDummyEInNamedSlot_ShadowDummyD]);
            expect(lightDummyEInNamedSlot_ShadowDummyD.closestDbuiChildren).to.have.members([lightDummyEInNamedSlot_ShadowDummyD_ShadowDummyB, lightDummyEInNamedSlot_ShadowDummyCInDefaultSlot]);
            expect(lightDummyEInNamedSlot_ShadowDummyD_ShadowDummyB.closestDbuiChildren).to.have.members([lightDummyEInNamedSlot_ShadowDummyD_ShadowDummyB_ShadowDummyA]);
            expect(lightDummyEInNamedSlot_ShadowDummyD_ShadowDummyB_ShadowDummyA.closestDbuiChildren).to.have.members([]);
            expect(lightDummyEInNamedSlot_ShadowDummyCInDefaultSlot.closestDbuiChildren).to.have.members([lightDummyEInNamedSlot_ShadowDummyCInDefaultSlot_ShadowDummyB]);
            expect(lightDummyEInNamedSlot_ShadowDummyCInDefaultSlot_ShadowDummyB.closestDbuiChildren).to.have.members([lightDummyEInNamedSlot_ShadowDummyCInDefaultSlot_ShadowDummyB_ShadowDummyA]);
            expect(lightDummyEInNamedSlot_ShadowDummyCInDefaultSlot_ShadowDummyB_ShadowDummyA.closestDbuiChildren).to.have.members([]);

            expect(lightDummyDTwoInDefaultSlot.closestDbuiChildren).to.have.members([lightDummyDThreeInDefaultSlot, lightDummyDTwoInDefaultSlot_ShadowDummyB]);
            expect(lightDummyDTwoInDefaultSlot_ShadowDummyB.closestDbuiChildren).to.have.members([lightDummyDTwoInDefaultSlot_ShadowDummyB_ShadowDummyA]);
            expect(lightDummyDTwoInDefaultSlot_ShadowDummyB_ShadowDummyA.closestDbuiChildren).to.have.members([]);

            expect(lightDummyDThreeInDefaultSlot.closestDbuiChildren).to.have.members([lightDummyEInDefaultSlot, lightDummyDThreeInDefaultSlot_ShadowDummyB]);
            expect(lightDummyDThreeInDefaultSlot_ShadowDummyB.closestDbuiChildren).to.have.members([lightDummyDThreeInDefaultSlot_ShadowDummyB_ShadowDummyA]);
            expect(lightDummyDThreeInDefaultSlot_ShadowDummyB_ShadowDummyA.closestDbuiChildren).to.have.members([]);

            expect(lightDummyEInDefaultSlot.closestDbuiChildren).to.have.members([lightDummyEInDefaultSlot_ShadowDummyD]);
            expect(lightDummyEInDefaultSlot_ShadowDummyD.closestDbuiChildren).to.have.members([lightDummyEInDefaultSlot_ShadowDummyCInDefaultSlot, lightDummyEInDefaultSlot_ShadowDummyD_ShadowDummyB]);
            expect(lightDummyEInDefaultSlot_ShadowDummyD_ShadowDummyB.closestDbuiChildren).to.have.members([lightDummyEInDefaultSlot_ShadowDummyD_ShadowDummyB_ShadowDummyA]);
            expect(lightDummyEInDefaultSlot_ShadowDummyD_ShadowDummyB_ShadowDummyA.closestDbuiChildren).to.have.members([]);
            expect(lightDummyEInDefaultSlot_ShadowDummyCInDefaultSlot.closestDbuiChildren).to.have.members([lightDummyEInDefaultSlot_ShadowDummyCInDefaultSlot_ShadowDummyB]);
            expect(lightDummyEInDefaultSlot_ShadowDummyCInDefaultSlot_ShadowDummyB.closestDbuiChildren).to.have.members([lightDummyEInDefaultSlot_ShadowDummyCInDefaultSlot_ShadowDummyB_ShadowDummyA]);
            expect(lightDummyEInDefaultSlot_ShadowDummyCInDefaultSlot_ShadowDummyB_ShadowDummyA.closestDbuiChildren).to.have.members([]);


            return node.onReady.then(() => {
              // test closestDbuiParent async

              // expect(lightDummyDOneRoot.closestDbuiParent).to.equal(null);
              // expect(lightDummyDOneRoot_ShadowDummyB.closestDbuiParent).to.equal(lightDummyDOneRoot);
              // expect(lightDummyDOneRoot_ShadowDummyB_ShadowDummyA.closestDbuiParent).to.equal(lightDummyDOneRoot_ShadowDummyB);
              //
              // expect(lightDummyEInNamedSlot.closestDbuiParent).to.equal(lightDummyDOneRoot);
              // expect(lightDummyEInNamedSlot_ShadowDummyD.closestDbuiParent).to.equal(lightDummyEInNamedSlot);
              // expect(lightDummyEInNamedSlot_ShadowDummyD_ShadowDummyB.closestDbuiParent).to.equal(lightDummyEInNamedSlot_ShadowDummyD);
              // expect(lightDummyEInNamedSlot_ShadowDummyD_ShadowDummyB_ShadowDummyA.closestDbuiParent).to.equal(lightDummyEInNamedSlot_ShadowDummyD_ShadowDummyB);
              // expect(lightDummyEInNamedSlot_ShadowDummyCInDefaultSlot.closestDbuiParent).to.equal(lightDummyEInNamedSlot_ShadowDummyD);
              // expect(lightDummyEInNamedSlot_ShadowDummyCInDefaultSlot_ShadowDummyB.closestDbuiParent).to.equal(lightDummyEInNamedSlot_ShadowDummyCInDefaultSlot);
              // expect(lightDummyEInNamedSlot_ShadowDummyCInDefaultSlot_ShadowDummyB_ShadowDummyA.closestDbuiParent).to.equal(lightDummyEInNamedSlot_ShadowDummyCInDefaultSlot_ShadowDummyB);
              //
              // expect(lightDummyDTwoInDefaultSlot.closestDbuiParent).to.equal(lightDummyDOneRoot);
              // expect(lightDummyDTwoInDefaultSlot_ShadowDummyB.closestDbuiParent).to.equal(lightDummyDTwoInDefaultSlot);
              // expect(lightDummyDTwoInDefaultSlot_ShadowDummyB_ShadowDummyA.closestDbuiParent).to.equal(lightDummyDTwoInDefaultSlot_ShadowDummyB);
              //
              // expect(lightDummyDThreeInDefaultSlot.closestDbuiParent).to.equal(lightDummyDTwoInDefaultSlot);
              // expect(lightDummyDThreeInDefaultSlot_ShadowDummyB.closestDbuiParent).to.equal(lightDummyDThreeInDefaultSlot);
              // expect(lightDummyDThreeInDefaultSlot_ShadowDummyB_ShadowDummyA.closestDbuiParent).to.equal(lightDummyDThreeInDefaultSlot_ShadowDummyB);
              //
              // expect(lightDummyEInDefaultSlot.closestDbuiParent).to.equal(lightDummyDThreeInDefaultSlot);
              // expect(lightDummyEInDefaultSlot_ShadowDummyD.closestDbuiParent).to.equal(lightDummyEInDefaultSlot);
              // expect(lightDummyEInDefaultSlot_ShadowDummyD_ShadowDummyB.closestDbuiParent).to.equal(lightDummyEInDefaultSlot_ShadowDummyD);
              // expect(lightDummyEInDefaultSlot_ShadowDummyD_ShadowDummyB_ShadowDummyA.closestDbuiParent).to.equal(lightDummyEInDefaultSlot_ShadowDummyD_ShadowDummyB);
              // expect(lightDummyEInDefaultSlot_ShadowDummyCInDefaultSlot.closestDbuiParent).to.equal(lightDummyEInDefaultSlot_ShadowDummyD);
              // expect(lightDummyEInDefaultSlot_ShadowDummyCInDefaultSlot_ShadowDummyB.closestDbuiParent).to.equal(lightDummyEInDefaultSlot_ShadowDummyCInDefaultSlot);
              // expect(lightDummyEInDefaultSlot_ShadowDummyCInDefaultSlot_ShadowDummyB_ShadowDummyA.closestDbuiParent).to.equal(lightDummyEInDefaultSlot_ShadowDummyCInDefaultSlot_ShadowDummyB);


              // test closestDbuiChildren async

              // expect(lightDummyDOneRoot.closestDbuiChildren).to.have.members([lightDummyDOneRoot_ShadowDummyB, lightDummyEInNamedSlot, lightDummyDTwoInDefaultSlot]);
              // expect(lightDummyDOneRoot_ShadowDummyB.closestDbuiChildren).to.have.members([lightDummyDOneRoot_ShadowDummyB_ShadowDummyA]);
              // expect(lightDummyDOneRoot_ShadowDummyB_ShadowDummyA.closestDbuiChildren).to.have.members([]);
              //
              // expect(lightDummyEInNamedSlot.closestDbuiChildren).to.have.members([lightDummyEInNamedSlot_ShadowDummyD]);
              // expect(lightDummyEInNamedSlot_ShadowDummyD.closestDbuiChildren).to.have.members([lightDummyEInNamedSlot_ShadowDummyD_ShadowDummyB, lightDummyEInNamedSlot_ShadowDummyCInDefaultSlot]);
              // expect(lightDummyEInNamedSlot_ShadowDummyD_ShadowDummyB.closestDbuiChildren).to.have.members([lightDummyEInNamedSlot_ShadowDummyD_ShadowDummyB_ShadowDummyA]);
              // expect(lightDummyEInNamedSlot_ShadowDummyD_ShadowDummyB_ShadowDummyA.closestDbuiChildren).to.have.members([]);
              // expect(lightDummyEInNamedSlot_ShadowDummyCInDefaultSlot.closestDbuiChildren).to.have.members([lightDummyEInNamedSlot_ShadowDummyCInDefaultSlot_ShadowDummyB]);
              // expect(lightDummyEInNamedSlot_ShadowDummyCInDefaultSlot_ShadowDummyB.closestDbuiChildren).to.have.members([lightDummyEInNamedSlot_ShadowDummyCInDefaultSlot_ShadowDummyB_ShadowDummyA]);
              // expect(lightDummyEInNamedSlot_ShadowDummyCInDefaultSlot_ShadowDummyB_ShadowDummyA.closestDbuiChildren).to.have.members([]);
              //
              // expect(lightDummyDTwoInDefaultSlot.closestDbuiChildren).to.have.members([lightDummyDThreeInDefaultSlot, lightDummyDTwoInDefaultSlot_ShadowDummyB]);
              // expect(lightDummyDTwoInDefaultSlot_ShadowDummyB.closestDbuiChildren).to.have.members([lightDummyDTwoInDefaultSlot_ShadowDummyB_ShadowDummyA]);
              // expect(lightDummyDTwoInDefaultSlot_ShadowDummyB_ShadowDummyA.closestDbuiChildren).to.have.members([]);
              //
              // expect(lightDummyDThreeInDefaultSlot.closestDbuiChildren).to.have.members([lightDummyEInDefaultSlot, lightDummyDThreeInDefaultSlot_ShadowDummyB]);
              // expect(lightDummyDThreeInDefaultSlot_ShadowDummyB.closestDbuiChildren).to.have.members([lightDummyDThreeInDefaultSlot_ShadowDummyB_ShadowDummyA]);
              // expect(lightDummyDThreeInDefaultSlot_ShadowDummyB_ShadowDummyA.closestDbuiChildren).to.have.members([]);
              //
              // expect(lightDummyEInDefaultSlot.closestDbuiChildren).to.have.members([lightDummyEInDefaultSlot_ShadowDummyD]);
              // expect(lightDummyEInDefaultSlot_ShadowDummyD.closestDbuiChildren).to.have.members([lightDummyEInDefaultSlot_ShadowDummyCInDefaultSlot, lightDummyEInDefaultSlot_ShadowDummyD_ShadowDummyB]);
              // expect(lightDummyEInDefaultSlot_ShadowDummyD_ShadowDummyB.closestDbuiChildren).to.have.members([lightDummyEInDefaultSlot_ShadowDummyD_ShadowDummyB_ShadowDummyA]);
              // expect(lightDummyEInDefaultSlot_ShadowDummyD_ShadowDummyB_ShadowDummyA.closestDbuiChildren).to.have.members([]);
              // expect(lightDummyEInDefaultSlot_ShadowDummyCInDefaultSlot.closestDbuiChildren).to.have.members([lightDummyEInDefaultSlot_ShadowDummyCInDefaultSlot_ShadowDummyB]);
              // expect(lightDummyEInDefaultSlot_ShadowDummyCInDefaultSlot_ShadowDummyB.closestDbuiChildren).to.have.members([lightDummyEInDefaultSlot_ShadowDummyCInDefaultSlot_ShadowDummyB_ShadowDummyA]);
              // expect(lightDummyEInDefaultSlot_ShadowDummyCInDefaultSlot_ShadowDummyB_ShadowDummyA.closestDbuiChildren).to.have.members([]);

              return dbuiNodes;
            });
          };

          Promise.all([
            DummyA.registrationName,
            DummyB.registrationName,
            DummyC.registrationName,
            DummyD.registrationName,
            DummyE.registrationName,
          ].map((localName) => contentWindow.customElements.whenDefined(localName)
          )).then(() => {

            doTest(contentWindow.document.querySelector('#light-dummy-d-one-root')).then((dbuiNodes1) => {
              setTimeout(() => {
                // clear everything
                container.innerHTML = '';

                Object.keys(dbuiNodes1).forEach((key) => {
                  const node = dbuiNodes1[key];
                  // let err = null;
                  // try {
                  //   node.closestDbuiChildren;
                  // } catch (_err) {
                  //   err = _err;
                  // }
                  // expect(err.message).to.equal(`${node.localName} not ready yet`);
                  expect(node._closestDbuiChildren.length).to.equal(0);
                });
                //
                // Object.keys(dbuiNodes1).forEach((key) => {
                //   const node = dbuiNodes1[key];
                //   let err = null;
                //   try {
                //     node.closestDbuiParent;
                //   } catch (_err) {
                //     err = _err;
                //   }
                //   expect(err.message).to.equal(`${node.localName} not ready yet`);
                // });

                expect(contentWindow.document.querySelector('#light-dummy-d-one-root'))
                  .to.equal(null);

                setTimeout(() => {
                  // restart using innerHTML
                  container.innerHTML = treeOne;

                  // const comp = contentWindow.document.querySelector('#light-dummy-d-three-in-default-slot');
                  // console.log({
                  //   xxxxxxxxxxxxx: 'xxxxxxxxxxxxxxxxx',
                  //   lightDomChildren: comp.lightDomChildren.map((child) => child.id).join(', '),
                  //   lightDomParent: (comp.lightDomParent || {}).id || null,
                  //   shadowDomChildren: comp.shadowDomChildren.map((child) => child.id).join(', '),
                  //   shadowDomParent: (comp.shadowDomParent || {}).id || null,
                  //   closestDbuiParent: ((comp.closestDbuiParent) || {}).id || null,
                  //   closestDbuiChildren: comp.closestDbuiChildren.map((child) => child.id).join(', '),
                  //   closestDbuiChildrenLiveQuery: comp.closestDbuiChildrenLiveQuery.map((child) => child.id).join(', '),
                  //   closestDbuiParent2: (comp.parentElement && comp.parentElement.closest('[dbui-web-component]') || {}).id || null,
                  // });

                  const dbuiNodes = treeOneGetDbuiNodes(contentWindow);

                  Object.keys(dbuiNodes1).forEach((key) => {
                    const node = dbuiNodes[key];
                    const node1 = dbuiNodes1[key];
                    // expect NOT to be same instances as we used innerHTML
                    expect(node1).to.not.equal(node);
                  });

                  doTest(contentWindow.document.querySelector('#light-dummy-d-one-root'))
                    .then((dbuiNodes2) => {
                      // clear again everything
                      container.innerHTML = '';
                      expect(contentWindow.document.querySelector('#light-dummy-d-one-root'))
                        .to.equal(null);

                      setTimeout(() => {
                        // restart using appendChild
                        container.appendChild(dbuiNodes2.lightDummyDOneRoot);

                        const dbuiNodes = treeOneGetDbuiNodes(contentWindow);

                        Object.keys(dbuiNodes2).forEach((key) => {
                          const node = dbuiNodes[key];
                          const node2 = dbuiNodes2[key];
                          // expect to be same instances as we used appendChild
                          expect(node2).to.equal(node);
                        });

                        doTest(dbuiNodes2.lightDummyDOneRoot).then(() => {
                          iframe.remove();
                          done();
                        });
                      }, 0);
                    });
                }, 0);
              }, 0);
            });
          });

          DummyE.registerSelf();
        }
      });
    });
  });

  describe('when node is removed in light DOM', () => {
    it('unregisters self from closetDbuiParent', (done) => {
      inIframe({
        headStyle: treeStyle,
        bodyHTML: `
        <div id="container">
          ${treeOne}
        </div>
        `,
        onLoad: ({ contentWindow, iframe }) => {
          const DummyA = getDummyA(contentWindow);
          const DummyB = getDummyB(contentWindow);
          const DummyC = getDummyC(contentWindow);
          const DummyD = getDummyD(contentWindow);
          const DummyE = getDummyE(contentWindow);

          Promise.all([
            DummyA.registrationName,
            DummyB.registrationName,
            DummyC.registrationName,
            DummyD.registrationName,
            DummyE.registrationName,
          ].map((localName) => contentWindow.customElements.whenDefined(localName)
          )).then(() => {
            const dbuiNodes = treeOneGetDbuiNodes(contentWindow);
            const {
              lightDummyDOneRoot,
              lightDummyDOneRoot_ShadowDummyB,
              lightDummyDTwoInDefaultSlot,
              lightDummyEInNamedSlot
            } = dbuiNodes;

            lightDummyDOneRoot.onReady.then(() => {

              expect(lightDummyDOneRoot.closestDbuiChildren).to.have.members([
                lightDummyDOneRoot_ShadowDummyB,
                lightDummyDTwoInDefaultSlot,
                lightDummyEInNamedSlot
              ]);
              expect(lightDummyEInNamedSlot.closestDbuiParent).to.equal(lightDummyDOneRoot);
              expect(lightDummyDTwoInDefaultSlot.closestDbuiParent).to.equal(lightDummyDOneRoot);
              expect(lightDummyEInNamedSlot.closestDbuiChildren.length).to.equal(1);

              lightDummyDOneRoot.querySelector('#ul1-li1').removeChild(lightDummyEInNamedSlot);

              expect(lightDummyEInNamedSlot._closestDbuiChildren.length).to.equal(0);
              expect(lightDummyDOneRoot.closestDbuiChildren).to.have.members([
                lightDummyDOneRoot_ShadowDummyB,
                lightDummyDTwoInDefaultSlot
              ]);
              expect(lightDummyEInNamedSlot._closestDbuiParent).to.equal(null);
              expect(lightDummyDTwoInDefaultSlot.closestDbuiParent).to.equal(lightDummyDOneRoot);

              lightDummyDOneRoot.querySelector('#ul1-li1').appendChild(lightDummyEInNamedSlot);
              lightDummyEInNamedSlot.onReady.then(() => {
                expect(lightDummyDOneRoot.closestDbuiChildren).to.have.members([
                  lightDummyDOneRoot_ShadowDummyB,
                  lightDummyDTwoInDefaultSlot,
                  lightDummyEInNamedSlot
                ]);
                expect(lightDummyEInNamedSlot.closestDbuiParent).to.equal(lightDummyDOneRoot);
                expect(lightDummyDTwoInDefaultSlot.closestDbuiParent).to.equal(lightDummyDOneRoot);
                expect(lightDummyEInNamedSlot.closestDbuiChildren.length).to.equal(1);

                setTimeout(() => {
                  iframe.remove();
                  done();
                }, 0);
              });
            });
          });

          DummyE.registerSelf();
        }
      });
    });
  });

  describe('when node is replaced in light DOM', () => {
    it(`unregisters self from closetDbuiParent and registers to the new closetDbuiParent
    while keeping the same closest children`, (done) => {
        inIframe({
          headStyle: treeStyle,
          bodyHTML: `
          <div id="container">
            ${treeOne}
          </div>
          `,
          onLoad: ({ contentWindow, iframe }) => {
            const DummyA = getDummyA(contentWindow);
            const DummyB = getDummyB(contentWindow);
            const DummyC = getDummyC(contentWindow);
            const DummyD = getDummyD(contentWindow);
            const DummyE = getDummyE(contentWindow);

            Promise.all([
              DummyA.registrationName,
              DummyB.registrationName,
              DummyC.registrationName,
              DummyD.registrationName,
              DummyE.registrationName,
            ].map((localName) => contentWindow.customElements.whenDefined(localName)
            )).then(() => {
              const dbuiNodes = treeOneGetDbuiNodes(contentWindow);
              const {
                lightDummyDOneRoot,
                lightDummyDOneRoot_ShadowDummyB,
                lightDummyDTwoInDefaultSlot,
                lightDummyDThreeInDefaultSlot,
                lightDummyDThreeInDefaultSlot_ShadowDummyB,
                lightDummyEInNamedSlot,
                lightDummyEInDefaultSlot
              } = dbuiNodes;

              lightDummyDOneRoot.onReady.then(() => {

                const doTest = () => {
                  expect(lightDummyDOneRoot.closestDbuiChildren).to.have.members([
                    lightDummyDOneRoot_ShadowDummyB,
                    lightDummyDTwoInDefaultSlot,
                    lightDummyEInNamedSlot
                  ]);
                  expect(lightDummyEInNamedSlot.closestDbuiParent).to.equal(lightDummyDOneRoot);
                  expect(lightDummyDTwoInDefaultSlot.closestDbuiParent).to.equal(lightDummyDOneRoot);
                  expect(lightDummyDTwoInDefaultSlot.closestDbuiChildren).to.include(lightDummyDThreeInDefaultSlot);
                  expect(lightDummyDThreeInDefaultSlot.closestDbuiParent).to.equal(lightDummyDTwoInDefaultSlot);
                  expect(lightDummyDThreeInDefaultSlot.closestDbuiChildren).to.have.members([lightDummyEInDefaultSlot, lightDummyDThreeInDefaultSlot_ShadowDummyB]);
                  expect(lightDummyEInDefaultSlot.closestDbuiParent).to.equal(lightDummyDThreeInDefaultSlot);
                  expect(lightDummyDOneRoot.querySelector('#ul2-li1-ul1-li1').children.length).to.equal(1);
                };
                doTest();

                lightDummyDOneRoot.querySelector('#ul1-li1').replaceChild(lightDummyDThreeInDefaultSlot, lightDummyEInNamedSlot);

                // Replaced child did unregistered from its parent (synchronously)
                expect(lightDummyEInNamedSlot._closestDbuiParent).to.equal(null);
                expect(lightDummyEInNamedSlot._closestDbuiChildren.length).to.equal(0);
                // expect(lightDummyDOneRoot.closestDbuiChildren).to.have.members([
                //   lightDummyDOneRoot_ShadowDummyB,
                //   lightDummyDTwoInDefaultSlot,
                // ]);
                // Replacing child also did unregistered from its parent (synchronously)
                // but has not did registered yet to the new parent.
                expect(lightDummyDTwoInDefaultSlot.closestDbuiChildren).to.not.include(lightDummyDThreeInDefaultSlot);
                // expect(lightDummyDThreeInDefaultSlot._closestDbuiParent).to.equal(null);
                // expect(lightDummyDThreeInDefaultSlot._closestDbuiChildren.length).to.equal(0);

                lightDummyDThreeInDefaultSlot.onReady.then(() => {
                  expect(lightDummyDOneRoot.closestDbuiChildren).to.have.members([
                    lightDummyDOneRoot_ShadowDummyB,
                    lightDummyDTwoInDefaultSlot,
                    // replacing child
                    lightDummyDThreeInDefaultSlot
                  ]);
                  expect(lightDummyDTwoInDefaultSlot.closestDbuiChildren).to.not.include(lightDummyDThreeInDefaultSlot);
                  // replacing child
                  // has new closest parent
                  expect(lightDummyDThreeInDefaultSlot.closestDbuiParent).to.equal(lightDummyDOneRoot);
                  // has the same closest children
                  expect(lightDummyDThreeInDefaultSlot.closestDbuiChildren).to.have.members([lightDummyEInDefaultSlot, lightDummyDThreeInDefaultSlot_ShadowDummyB]);
                  expect(lightDummyEInDefaultSlot.closestDbuiParent).to.equal(lightDummyDThreeInDefaultSlot);
                  expect(lightDummyEInNamedSlot._closestDbuiParent).to.equal(null);
                  expect(lightDummyDOneRoot.querySelector('#ul2-li1-ul1-li1').children.length).to.equal(0);

                  // put nodes back as they were and redo initial test
                  lightDummyDOneRoot.querySelector('#ul1-li1').appendChild(lightDummyEInNamedSlot);
                  lightDummyEInNamedSlot.onReady.then(() => {
                    // intermediary test
                    expect(lightDummyEInNamedSlot.closestDbuiParent).to.equal(lightDummyDOneRoot);
                    expect(lightDummyDOneRoot.closestDbuiChildren).to.have.members([
                      lightDummyDOneRoot_ShadowDummyB,
                      lightDummyDTwoInDefaultSlot,
                      lightDummyEInNamedSlot,
                      lightDummyDThreeInDefaultSlot
                    ]);

                    lightDummyDOneRoot.querySelector('#ul2-li1-ul1-li1').appendChild(lightDummyDThreeInDefaultSlot);
                    lightDummyDThreeInDefaultSlot.onReady.then(() => {
                      doTest();
                      setTimeout(() => {
                        iframe.remove();
                        done();
                      }, 0);
                    });
                  });
                });
              });
            });
            DummyE.registerSelf();
          }
        });
      });
  });

  describe('when node is appended under a new parent while being removed from an old parent in light DOM', () => {
    xit('unregisters from old parent and registers to the new parent', () => {
      // newParent.appendChild(childFromAnotherParent);
    });
  });

  describe('when cloneNodeDeep in light DOM', () => {
    it('it starts unregistered then, when inserted into the DOM it registers self to closetDbuiParent', (done) => {
      inIframe({
        headStyle: treeStyle,
        bodyHTML: `
        <div id="container">
          ${treeOne}
        </div>
        `,
        onLoad: ({ contentWindow, iframe }) => {
          const DummyA = getDummyA(contentWindow);
          const DummyB = getDummyB(contentWindow);
          const DummyC = getDummyC(contentWindow);
          const DummyD = getDummyD(contentWindow);
          const DummyE = getDummyE(contentWindow);

          Promise.all([
            DummyA.registrationName,
            DummyB.registrationName,
            DummyC.registrationName,
            DummyD.registrationName,
            DummyE.registrationName,
          ].map((localName) => contentWindow.customElements.whenDefined(localName)
          )).then(() => {
            const dbuiNodes = treeOneGetDbuiNodes(contentWindow);
            const {
              lightDummyDOneRoot,
              lightDummyDOneRoot_ShadowDummyB,
              lightDummyDTwoInDefaultSlot,
              lightDummyDThreeInDefaultSlot,
              lightDummyDThreeInDefaultSlot_ShadowDummyB,
              lightDummyEInNamedSlot,
              lightDummyEInDefaultSlot
            } = dbuiNodes;

            lightDummyDOneRoot.onReady.then(() => {
              const lightDummyDThreeInDefaultSlotClone = lightDummyDThreeInDefaultSlot.cloneNodeDeep({ idSuffix: '_clone' });
              lightDummyDOneRoot.appendChild(lightDummyDThreeInDefaultSlotClone);
              expect(lightDummyDThreeInDefaultSlot.closestDbuiChildren).to.have.members([lightDummyDThreeInDefaultSlot_ShadowDummyB, lightDummyEInDefaultSlot]);

              // clone not registered yet
              // expect(lightDummyDThreeInDefaultSlotClone._closestDbuiParent).to.equal(null);
              // expect(lightDummyDThreeInDefaultSlotClone._closestDbuiChildren).to.have.members([]);
              // expect(lightDummyDOneRoot.closestDbuiChildren).to.have.members([
              //   lightDummyDOneRoot_ShadowDummyB,
              //   lightDummyDTwoInDefaultSlot,
              //   lightDummyEInNamedSlot
              // ]);
              lightDummyDThreeInDefaultSlotClone.onReady.then(() => {
                expect(lightDummyDThreeInDefaultSlotClone.closestDbuiParent).to.equal(lightDummyDOneRoot);
                expect(lightDummyDThreeInDefaultSlotClone.closestDbuiChildren).to.not.have.members([lightDummyDThreeInDefaultSlot_ShadowDummyB, lightDummyEInDefaultSlot]);
                expect(lightDummyDThreeInDefaultSlotClone.closestDbuiChildren.map((child) => child.id)).to.have.members(['shadow-dummy-b', 'light-dummy-e-in-default-slot_clone']);
                expect(lightDummyDOneRoot.closestDbuiChildren).to.have.members([
                  lightDummyDOneRoot_ShadowDummyB,
                  lightDummyDTwoInDefaultSlot,
                  lightDummyEInNamedSlot,
                  lightDummyDThreeInDefaultSlotClone
                ]);
                setTimeout(() => {
                  iframe.remove();
                  done();
                }, 0);
              });


            });
          });

          DummyE.registerSelf();
        }
      });
    });
  });

  describe('when node is adopted into a new document in light DOM', () => {
    // no need to check shadow DOM
    xit('unregisters from old parent and registers to the new parent', () => {

    });
  });

  describe('when node is removed in shadow DOM', () => {
    xit('unregisters self from closetDbuiParent', () => {

    });
  });

  describe('when node is replaced in shadow DOM', () => {
    xit(`unregisters self from closetDbuiParent and registers to the new closetDbuiParent
    while keeping the same closest children`, () => {

      });
  });

  describe('when node is appended under a new parent while being removed from an old parent in shadow DOM', () => {
    xit('unregisters from old parent and registers to the new parent', () => {

    });
  });

  describe('when cloneNodeDeep in shadow DOM', () => {
    xit('it starts unregistered then, when inserted into the DOM it registers self to closetDbuiParent', () => {

    });
  });
});
