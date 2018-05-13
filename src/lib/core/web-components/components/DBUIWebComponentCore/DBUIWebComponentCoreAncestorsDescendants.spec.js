import { expect } from 'chai';

import {
  inIframe,
  monkeyPatch
} from '../../../../../../testUtils';

import {
  getBase,
  getDummyA,
  getDummyB,
  getDummyC,
  getDummyD,
  getDummyE,
  treeOne,
  treeOneGetDbuiNodes,
  treeStyle
} from './DBUITestTreeSetup.forSpec';

function setupOnConnectedCallback(klass) {
  return monkeyPatch(klass).proto.set('onConnectedCallback', (getSuperDescriptor) => {
    return {
      writable: true,
      value() {
        getSuperDescriptor().value.call(this);
        // closestDbuiParent exists but might not be connected itself
        // the children CAN register nevertheless
        this.__testClosestDbuiParent = this.closestDbuiParent;
        this.__testShadowDomDbuiParent = this.shadowDomDbuiParent;
        this.__testLightDomDbuiParent = this.lightDomDbuiParent;
        // closestDbuiChildren might not be complete
        this.__testClosestDbuiChildren = [...this.closestDbuiChildren];
        this.__testShadowDomDbuiChildren = [...this.shadowDomDbuiChildren];
        this.__testLightDomDbuiChildren = [...this.lightDomDbuiChildren];
      }
    };
  });
}


/* eslint camelcase: 0 */

describe('DBUIWebComponentBase ancestors/descendants and registrations', () => {
  describe('closestDbuiParent/closestDbuiChildren/shadowDomDbuiParent/lightDomDbuiParent/shadowDomDbuiChildren/lightDomDbuiChildren', () => {
    it('return what is expected', (done) => {
      inIframe({
        headStyle: treeStyle,
        bodyHTML: `
        <div id="container">
          ${treeOne}
        </div>
        `,
        onLoad: ({ contentWindow, iframe }) => {

          const Base = getBase(contentWindow);
          const DummyA = getDummyA(contentWindow);
          const DummyB = getDummyB(contentWindow);
          const DummyC = getDummyC(contentWindow);
          const DummyD = getDummyD(contentWindow);
          const DummyE = getDummyE(contentWindow);

          setupOnConnectedCallback(Base);

          const container = contentWindow.document.querySelector('#container');

          const doTest = () => {
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

            // Test closestDbuiParent sync.
            // Also test that closestDbuiParent existed at the time of connectedCallback.
            // NOTE: even it existed it might not have been connected yet.
            expect(lightDummyDOneRoot.closestDbuiParent).to.equal(null);
            expect(lightDummyDOneRoot.closestDbuiParent).to.equal(lightDummyDOneRoot.__testClosestDbuiParent);
            expect(lightDummyDOneRoot.shadowDomDbuiParent).to.equal(null);
            expect(lightDummyDOneRoot.shadowDomDbuiParent).to.equal(lightDummyDOneRoot.__testShadowDomDbuiParent);
            expect(lightDummyDOneRoot.lightDomDbuiParent).to.equal(null);
            expect(lightDummyDOneRoot.lightDomDbuiParent).to.equal(lightDummyDOneRoot.__testLightDomDbuiParent);
            expect(lightDummyDOneRoot_ShadowDummyB.closestDbuiParent).to.equal(lightDummyDOneRoot);
            expect(lightDummyDOneRoot_ShadowDummyB.closestDbuiParent).to.equal(lightDummyDOneRoot_ShadowDummyB.__testClosestDbuiParent);
            expect(lightDummyDOneRoot_ShadowDummyB.shadowDomDbuiParent).to.equal(lightDummyDOneRoot);
            expect(lightDummyDOneRoot_ShadowDummyB.shadowDomDbuiParent).to.equal(lightDummyDOneRoot_ShadowDummyB.__testShadowDomDbuiParent);
            expect(lightDummyDOneRoot_ShadowDummyB.lightDomDbuiParent).to.equal(null);
            expect(lightDummyDOneRoot_ShadowDummyB.lightDomDbuiParent).to.equal(lightDummyDOneRoot_ShadowDummyB.__testLightDomDbuiParent);
            expect(lightDummyDOneRoot_ShadowDummyB_ShadowDummyA.closestDbuiParent).to.equal(lightDummyDOneRoot_ShadowDummyB);
            expect(lightDummyDOneRoot_ShadowDummyB_ShadowDummyA.closestDbuiParent).to.equal(lightDummyDOneRoot_ShadowDummyB_ShadowDummyA.__testClosestDbuiParent);
            expect(lightDummyDOneRoot_ShadowDummyB_ShadowDummyA.shadowDomDbuiParent).to.equal(lightDummyDOneRoot_ShadowDummyB);
            expect(lightDummyDOneRoot_ShadowDummyB_ShadowDummyA.shadowDomDbuiParent).to.equal(lightDummyDOneRoot_ShadowDummyB_ShadowDummyA.__testShadowDomDbuiParent);
            expect(lightDummyDOneRoot_ShadowDummyB_ShadowDummyA.lightDomDbuiParent).to.equal(null);
            expect(lightDummyDOneRoot_ShadowDummyB_ShadowDummyA.lightDomDbuiParent).to.equal(lightDummyDOneRoot_ShadowDummyB_ShadowDummyA.__testLightDomDbuiParent);

            expect(lightDummyEInNamedSlot.closestDbuiParent).to.equal(lightDummyDOneRoot);
            expect(lightDummyEInNamedSlot.closestDbuiParent).to.equal(lightDummyEInNamedSlot.__testClosestDbuiParent);
            expect(lightDummyEInNamedSlot.shadowDomDbuiParent).to.equal(null);
            expect(lightDummyEInNamedSlot.shadowDomDbuiParent).to.equal(lightDummyEInNamedSlot.__testShadowDomDbuiParent);
            expect(lightDummyEInNamedSlot.lightDomDbuiParent).to.equal(lightDummyDOneRoot);
            expect(lightDummyEInNamedSlot.lightDomDbuiParent).to.equal(lightDummyEInNamedSlot.__testLightDomDbuiParent);
            expect(lightDummyEInNamedSlot_ShadowDummyD.closestDbuiParent).to.equal(lightDummyEInNamedSlot);
            expect(lightDummyEInNamedSlot_ShadowDummyD.closestDbuiParent).to.equal(lightDummyEInNamedSlot_ShadowDummyD.__testClosestDbuiParent);
            expect(lightDummyEInNamedSlot_ShadowDummyD.shadowDomDbuiParent).to.equal(lightDummyEInNamedSlot);
            expect(lightDummyEInNamedSlot_ShadowDummyD.shadowDomDbuiParent).to.equal(lightDummyEInNamedSlot_ShadowDummyD.__testShadowDomDbuiParent);
            expect(lightDummyEInNamedSlot_ShadowDummyD.lightDomDbuiParent).to.equal(null);
            expect(lightDummyEInNamedSlot_ShadowDummyD.lightDomDbuiParent).to.equal(lightDummyEInNamedSlot_ShadowDummyD.__testLightDomDbuiParent);
            expect(lightDummyEInNamedSlot_ShadowDummyD_ShadowDummyB.closestDbuiParent).to.equal(lightDummyEInNamedSlot_ShadowDummyD);
            expect(lightDummyEInNamedSlot_ShadowDummyD_ShadowDummyB.closestDbuiParent).to.equal(lightDummyEInNamedSlot_ShadowDummyD_ShadowDummyB.__testClosestDbuiParent);
            expect(lightDummyEInNamedSlot_ShadowDummyD_ShadowDummyB.shadowDomDbuiParent).to.equal(lightDummyEInNamedSlot_ShadowDummyD);
            expect(lightDummyEInNamedSlot_ShadowDummyD_ShadowDummyB.shadowDomDbuiParent).to.equal(lightDummyEInNamedSlot_ShadowDummyD_ShadowDummyB.__testShadowDomDbuiParent);
            expect(lightDummyEInNamedSlot_ShadowDummyD_ShadowDummyB.lightDomDbuiParent).to.equal(null);
            expect(lightDummyEInNamedSlot_ShadowDummyD_ShadowDummyB.lightDomDbuiParent).to.equal(lightDummyEInNamedSlot_ShadowDummyD_ShadowDummyB.__testLightDomDbuiParent);
            expect(lightDummyEInNamedSlot_ShadowDummyD_ShadowDummyB_ShadowDummyA.closestDbuiParent).to.equal(lightDummyEInNamedSlot_ShadowDummyD_ShadowDummyB);
            expect(lightDummyEInNamedSlot_ShadowDummyD_ShadowDummyB_ShadowDummyA.closestDbuiParent).to.equal(lightDummyEInNamedSlot_ShadowDummyD_ShadowDummyB_ShadowDummyA.__testClosestDbuiParent);
            expect(lightDummyEInNamedSlot_ShadowDummyD_ShadowDummyB_ShadowDummyA.shadowDomDbuiParent).to.equal(lightDummyEInNamedSlot_ShadowDummyD_ShadowDummyB);
            expect(lightDummyEInNamedSlot_ShadowDummyD_ShadowDummyB_ShadowDummyA.shadowDomDbuiParent).to.equal(lightDummyEInNamedSlot_ShadowDummyD_ShadowDummyB_ShadowDummyA.__testShadowDomDbuiParent);
            expect(lightDummyEInNamedSlot_ShadowDummyD_ShadowDummyB_ShadowDummyA.lightDomDbuiParent).to.equal(null);
            expect(lightDummyEInNamedSlot_ShadowDummyD_ShadowDummyB_ShadowDummyA.lightDomDbuiParent).to.equal(lightDummyEInNamedSlot_ShadowDummyD_ShadowDummyB_ShadowDummyA.__testLightDomDbuiParent);
            expect(lightDummyEInNamedSlot_ShadowDummyCInDefaultSlot.closestDbuiParent).to.equal(lightDummyEInNamedSlot_ShadowDummyD);
            expect(lightDummyEInNamedSlot_ShadowDummyCInDefaultSlot.closestDbuiParent).to.equal(lightDummyEInNamedSlot_ShadowDummyCInDefaultSlot.__testClosestDbuiParent);
            // interesting
            expect(lightDummyEInNamedSlot_ShadowDummyCInDefaultSlot.shadowDomDbuiParent).to.equal(lightDummyEInNamedSlot);
            expect(lightDummyEInNamedSlot_ShadowDummyCInDefaultSlot.shadowDomDbuiParent).to.equal(lightDummyEInNamedSlot_ShadowDummyCInDefaultSlot.__testShadowDomDbuiParent);
            expect(lightDummyEInNamedSlot_ShadowDummyCInDefaultSlot.lightDomDbuiParent).to.equal(lightDummyEInNamedSlot_ShadowDummyD);
            expect(lightDummyEInNamedSlot_ShadowDummyCInDefaultSlot.lightDomDbuiParent).to.equal(lightDummyEInNamedSlot_ShadowDummyCInDefaultSlot.__testLightDomDbuiParent);
            expect(lightDummyEInNamedSlot_ShadowDummyCInDefaultSlot_ShadowDummyB.closestDbuiParent).to.equal(lightDummyEInNamedSlot_ShadowDummyCInDefaultSlot);
            expect(lightDummyEInNamedSlot_ShadowDummyCInDefaultSlot_ShadowDummyB.closestDbuiParent).to.equal(lightDummyEInNamedSlot_ShadowDummyCInDefaultSlot_ShadowDummyB.__testClosestDbuiParent);
            expect(lightDummyEInNamedSlot_ShadowDummyCInDefaultSlot_ShadowDummyB.shadowDomDbuiParent).to.equal(lightDummyEInNamedSlot_ShadowDummyCInDefaultSlot);
            expect(lightDummyEInNamedSlot_ShadowDummyCInDefaultSlot_ShadowDummyB.shadowDomDbuiParent).to.equal(lightDummyEInNamedSlot_ShadowDummyCInDefaultSlot_ShadowDummyB.__testShadowDomDbuiParent);
            expect(lightDummyEInNamedSlot_ShadowDummyCInDefaultSlot_ShadowDummyB.lightDomDbuiParent).to.equal(null);
            expect(lightDummyEInNamedSlot_ShadowDummyCInDefaultSlot_ShadowDummyB.lightDomDbuiParent).to.equal(lightDummyEInNamedSlot_ShadowDummyCInDefaultSlot_ShadowDummyB.__testLightDomDbuiParent);
            expect(lightDummyEInNamedSlot_ShadowDummyCInDefaultSlot_ShadowDummyB_ShadowDummyA.closestDbuiParent).to.equal(lightDummyEInNamedSlot_ShadowDummyCInDefaultSlot_ShadowDummyB);
            expect(lightDummyEInNamedSlot_ShadowDummyCInDefaultSlot_ShadowDummyB_ShadowDummyA.closestDbuiParent).to.equal(lightDummyEInNamedSlot_ShadowDummyCInDefaultSlot_ShadowDummyB_ShadowDummyA.__testClosestDbuiParent);
            expect(lightDummyEInNamedSlot_ShadowDummyCInDefaultSlot_ShadowDummyB_ShadowDummyA.shadowDomDbuiParent).to.equal(lightDummyEInNamedSlot_ShadowDummyCInDefaultSlot_ShadowDummyB);
            expect(lightDummyEInNamedSlot_ShadowDummyCInDefaultSlot_ShadowDummyB_ShadowDummyA.shadowDomDbuiParent).to.equal(lightDummyEInNamedSlot_ShadowDummyCInDefaultSlot_ShadowDummyB_ShadowDummyA.__testShadowDomDbuiParent);
            expect(lightDummyEInNamedSlot_ShadowDummyCInDefaultSlot_ShadowDummyB_ShadowDummyA.lightDomDbuiParent).to.equal(null);
            expect(lightDummyEInNamedSlot_ShadowDummyCInDefaultSlot_ShadowDummyB_ShadowDummyA.lightDomDbuiParent).to.equal(lightDummyEInNamedSlot_ShadowDummyCInDefaultSlot_ShadowDummyB_ShadowDummyA.__testLightDomDbuiParent);

            expect(lightDummyDTwoInDefaultSlot.closestDbuiParent).to.equal(lightDummyDOneRoot);
            expect(lightDummyDTwoInDefaultSlot.closestDbuiParent).to.equal(lightDummyDTwoInDefaultSlot.__testClosestDbuiParent);
            expect(lightDummyDTwoInDefaultSlot.shadowDomDbuiParent).to.equal(null);
            expect(lightDummyDTwoInDefaultSlot.shadowDomDbuiParent).to.equal(lightDummyDTwoInDefaultSlot.__testShadowDomDbuiParent);
            expect(lightDummyDTwoInDefaultSlot.lightDomDbuiParent).to.equal(lightDummyDOneRoot);
            expect(lightDummyDTwoInDefaultSlot.lightDomDbuiParent).to.equal(lightDummyDTwoInDefaultSlot.__testLightDomDbuiParent);
            expect(lightDummyDTwoInDefaultSlot_ShadowDummyB.closestDbuiParent).to.equal(lightDummyDTwoInDefaultSlot);
            expect(lightDummyDTwoInDefaultSlot_ShadowDummyB.closestDbuiParent).to.equal(lightDummyDTwoInDefaultSlot_ShadowDummyB.__testClosestDbuiParent);
            expect(lightDummyDTwoInDefaultSlot_ShadowDummyB.shadowDomDbuiParent).to.equal(lightDummyDTwoInDefaultSlot);
            expect(lightDummyDTwoInDefaultSlot_ShadowDummyB.shadowDomDbuiParent).to.equal(lightDummyDTwoInDefaultSlot_ShadowDummyB.__testShadowDomDbuiParent);
            expect(lightDummyDTwoInDefaultSlot_ShadowDummyB.lightDomDbuiParent).to.equal(null);
            expect(lightDummyDTwoInDefaultSlot_ShadowDummyB.lightDomDbuiParent).to.equal(lightDummyDTwoInDefaultSlot_ShadowDummyB.__testLightDomDbuiParent);
            expect(lightDummyDTwoInDefaultSlot_ShadowDummyB_ShadowDummyA.closestDbuiParent).to.equal(lightDummyDTwoInDefaultSlot_ShadowDummyB);
            expect(lightDummyDTwoInDefaultSlot_ShadowDummyB_ShadowDummyA.closestDbuiParent).to.equal(lightDummyDTwoInDefaultSlot_ShadowDummyB_ShadowDummyA.__testClosestDbuiParent);
            expect(lightDummyDTwoInDefaultSlot_ShadowDummyB_ShadowDummyA.shadowDomDbuiParent).to.equal(lightDummyDTwoInDefaultSlot_ShadowDummyB);
            expect(lightDummyDTwoInDefaultSlot_ShadowDummyB_ShadowDummyA.shadowDomDbuiParent).to.equal(lightDummyDTwoInDefaultSlot_ShadowDummyB_ShadowDummyA.__testShadowDomDbuiParent);
            expect(lightDummyDTwoInDefaultSlot_ShadowDummyB_ShadowDummyA.lightDomDbuiParent).to.equal(null);
            expect(lightDummyDTwoInDefaultSlot_ShadowDummyB_ShadowDummyA.lightDomDbuiParent).to.equal(lightDummyDTwoInDefaultSlot_ShadowDummyB_ShadowDummyA.__testLightDomDbuiParent);

            expect(lightDummyDThreeInDefaultSlot.closestDbuiParent).to.equal(lightDummyDTwoInDefaultSlot);
            expect(lightDummyDThreeInDefaultSlot.closestDbuiParent).to.equal(lightDummyDThreeInDefaultSlot.__testClosestDbuiParent);
            expect(lightDummyDThreeInDefaultSlot.shadowDomDbuiParent).to.equal(null);
            expect(lightDummyDThreeInDefaultSlot.shadowDomDbuiParent).to.equal(lightDummyDThreeInDefaultSlot.__testShadowDomDbuiParent);
            expect(lightDummyDThreeInDefaultSlot.lightDomDbuiParent).to.equal(lightDummyDTwoInDefaultSlot);
            expect(lightDummyDThreeInDefaultSlot.lightDomDbuiParent).to.equal(lightDummyDThreeInDefaultSlot.__testLightDomDbuiParent);
            expect(lightDummyDThreeInDefaultSlot_ShadowDummyB.closestDbuiParent).to.equal(lightDummyDThreeInDefaultSlot);
            expect(lightDummyDThreeInDefaultSlot_ShadowDummyB.closestDbuiParent).to.equal(lightDummyDThreeInDefaultSlot_ShadowDummyB.__testClosestDbuiParent);
            expect(lightDummyDThreeInDefaultSlot_ShadowDummyB.shadowDomDbuiParent).to.equal(lightDummyDThreeInDefaultSlot);
            expect(lightDummyDThreeInDefaultSlot_ShadowDummyB.shadowDomDbuiParent).to.equal(lightDummyDThreeInDefaultSlot_ShadowDummyB.__testShadowDomDbuiParent);
            expect(lightDummyDThreeInDefaultSlot_ShadowDummyB.lightDomDbuiParent).to.equal(null);
            expect(lightDummyDThreeInDefaultSlot_ShadowDummyB.lightDomDbuiParent).to.equal(lightDummyDThreeInDefaultSlot_ShadowDummyB.__testLightDomDbuiParent);
            expect(lightDummyDThreeInDefaultSlot_ShadowDummyB_ShadowDummyA.closestDbuiParent).to.equal(lightDummyDThreeInDefaultSlot_ShadowDummyB);
            expect(lightDummyDThreeInDefaultSlot_ShadowDummyB_ShadowDummyA.closestDbuiParent).to.equal(lightDummyDThreeInDefaultSlot_ShadowDummyB_ShadowDummyA.__testClosestDbuiParent);
            expect(lightDummyDThreeInDefaultSlot_ShadowDummyB_ShadowDummyA.shadowDomDbuiParent).to.equal(lightDummyDThreeInDefaultSlot_ShadowDummyB);
            expect(lightDummyDThreeInDefaultSlot_ShadowDummyB_ShadowDummyA.shadowDomDbuiParent).to.equal(lightDummyDThreeInDefaultSlot_ShadowDummyB_ShadowDummyA.__testShadowDomDbuiParent);
            expect(lightDummyDThreeInDefaultSlot_ShadowDummyB_ShadowDummyA.lightDomDbuiParent).to.equal(null);
            expect(lightDummyDThreeInDefaultSlot_ShadowDummyB_ShadowDummyA.lightDomDbuiParent).to.equal(lightDummyDThreeInDefaultSlot_ShadowDummyB_ShadowDummyA.__testLightDomDbuiParent);

            expect(lightDummyEInDefaultSlot.closestDbuiParent).to.equal(lightDummyDThreeInDefaultSlot);
            expect(lightDummyEInDefaultSlot.closestDbuiParent).to.equal(lightDummyEInDefaultSlot.__testClosestDbuiParent);
            expect(lightDummyEInDefaultSlot.shadowDomDbuiParent).to.equal(null);
            expect(lightDummyEInDefaultSlot.shadowDomDbuiParent).to.equal(lightDummyEInDefaultSlot.__testShadowDomDbuiParent);
            expect(lightDummyEInDefaultSlot.lightDomDbuiParent).to.equal(lightDummyDThreeInDefaultSlot);
            expect(lightDummyEInDefaultSlot.lightDomDbuiParent).to.equal(lightDummyEInDefaultSlot.__testLightDomDbuiParent);
            expect(lightDummyEInDefaultSlot_ShadowDummyD.closestDbuiParent).to.equal(lightDummyEInDefaultSlot);
            expect(lightDummyEInDefaultSlot_ShadowDummyD.closestDbuiParent).to.equal(lightDummyEInDefaultSlot_ShadowDummyD.__testClosestDbuiParent);
            expect(lightDummyEInDefaultSlot_ShadowDummyD.shadowDomDbuiParent).to.equal(lightDummyEInDefaultSlot);
            expect(lightDummyEInDefaultSlot_ShadowDummyD.shadowDomDbuiParent).to.equal(lightDummyEInDefaultSlot_ShadowDummyD.__testShadowDomDbuiParent);
            expect(lightDummyEInDefaultSlot_ShadowDummyD.lightDomDbuiParent).to.equal(null);
            expect(lightDummyEInDefaultSlot_ShadowDummyD.lightDomDbuiParent).to.equal(lightDummyEInDefaultSlot_ShadowDummyD.__testLightDomDbuiParent);
            expect(lightDummyEInDefaultSlot_ShadowDummyD_ShadowDummyB.closestDbuiParent).to.equal(lightDummyEInDefaultSlot_ShadowDummyD);
            expect(lightDummyEInDefaultSlot_ShadowDummyD_ShadowDummyB.closestDbuiParent).to.equal(lightDummyEInDefaultSlot_ShadowDummyD_ShadowDummyB.__testClosestDbuiParent);
            expect(lightDummyEInDefaultSlot_ShadowDummyD_ShadowDummyB.shadowDomDbuiParent).to.equal(lightDummyEInDefaultSlot_ShadowDummyD);
            expect(lightDummyEInDefaultSlot_ShadowDummyD_ShadowDummyB.shadowDomDbuiParent).to.equal(lightDummyEInDefaultSlot_ShadowDummyD_ShadowDummyB.__testShadowDomDbuiParent);
            expect(lightDummyEInDefaultSlot_ShadowDummyD_ShadowDummyB.lightDomDbuiParent).to.equal(null);
            expect(lightDummyEInDefaultSlot_ShadowDummyD_ShadowDummyB.lightDomDbuiParent).to.equal(lightDummyEInDefaultSlot_ShadowDummyD_ShadowDummyB.__testLightDomDbuiParent);
            expect(lightDummyEInDefaultSlot_ShadowDummyD_ShadowDummyB_ShadowDummyA.closestDbuiParent).to.equal(lightDummyEInDefaultSlot_ShadowDummyD_ShadowDummyB);
            expect(lightDummyEInDefaultSlot_ShadowDummyD_ShadowDummyB_ShadowDummyA.closestDbuiParent).to.equal(lightDummyEInDefaultSlot_ShadowDummyD_ShadowDummyB_ShadowDummyA.__testClosestDbuiParent);
            expect(lightDummyEInDefaultSlot_ShadowDummyD_ShadowDummyB_ShadowDummyA.shadowDomDbuiParent).to.equal(lightDummyEInDefaultSlot_ShadowDummyD_ShadowDummyB);
            expect(lightDummyEInDefaultSlot_ShadowDummyD_ShadowDummyB_ShadowDummyA.shadowDomDbuiParent).to.equal(lightDummyEInDefaultSlot_ShadowDummyD_ShadowDummyB_ShadowDummyA.__testShadowDomDbuiParent);
            expect(lightDummyEInDefaultSlot_ShadowDummyD_ShadowDummyB_ShadowDummyA.lightDomDbuiParent).to.equal(null);
            expect(lightDummyEInDefaultSlot_ShadowDummyD_ShadowDummyB_ShadowDummyA.lightDomDbuiParent).to.equal(lightDummyEInDefaultSlot_ShadowDummyD_ShadowDummyB_ShadowDummyA.__testLightDomDbuiParent);
            expect(lightDummyEInDefaultSlot_ShadowDummyCInDefaultSlot.closestDbuiParent).to.equal(lightDummyEInDefaultSlot_ShadowDummyD);
            expect(lightDummyEInDefaultSlot_ShadowDummyCInDefaultSlot.closestDbuiParent).to.equal(lightDummyEInDefaultSlot_ShadowDummyCInDefaultSlot.__testClosestDbuiParent);
            // interesting
            expect(lightDummyEInDefaultSlot_ShadowDummyCInDefaultSlot.shadowDomDbuiParent).to.equal(lightDummyEInDefaultSlot);
            expect(lightDummyEInDefaultSlot_ShadowDummyCInDefaultSlot.shadowDomDbuiParent).to.equal(lightDummyEInDefaultSlot_ShadowDummyCInDefaultSlot.__testShadowDomDbuiParent);
            expect(lightDummyEInDefaultSlot_ShadowDummyCInDefaultSlot.lightDomDbuiParent).to.equal(lightDummyEInDefaultSlot_ShadowDummyD);
            expect(lightDummyEInDefaultSlot_ShadowDummyCInDefaultSlot.lightDomDbuiParent).to.equal(lightDummyEInDefaultSlot_ShadowDummyCInDefaultSlot.__testLightDomDbuiParent);
            expect(lightDummyEInDefaultSlot_ShadowDummyCInDefaultSlot_ShadowDummyB.closestDbuiParent).to.equal(lightDummyEInDefaultSlot_ShadowDummyCInDefaultSlot);
            expect(lightDummyEInDefaultSlot_ShadowDummyCInDefaultSlot_ShadowDummyB.closestDbuiParent).to.equal(lightDummyEInDefaultSlot_ShadowDummyCInDefaultSlot_ShadowDummyB.__testClosestDbuiParent);
            expect(lightDummyEInDefaultSlot_ShadowDummyCInDefaultSlot_ShadowDummyB.shadowDomDbuiParent).to.equal(lightDummyEInDefaultSlot_ShadowDummyCInDefaultSlot);
            expect(lightDummyEInDefaultSlot_ShadowDummyCInDefaultSlot_ShadowDummyB.shadowDomDbuiParent).to.equal(lightDummyEInDefaultSlot_ShadowDummyCInDefaultSlot_ShadowDummyB.__testShadowDomDbuiParent);
            expect(lightDummyEInDefaultSlot_ShadowDummyCInDefaultSlot_ShadowDummyB.lightDomDbuiParent).to.equal(null);
            expect(lightDummyEInDefaultSlot_ShadowDummyCInDefaultSlot_ShadowDummyB.lightDomDbuiParent).to.equal(lightDummyEInDefaultSlot_ShadowDummyCInDefaultSlot_ShadowDummyB.__testLightDomDbuiParent);
            expect(lightDummyEInDefaultSlot_ShadowDummyCInDefaultSlot_ShadowDummyB_ShadowDummyA.closestDbuiParent).to.equal(lightDummyEInDefaultSlot_ShadowDummyCInDefaultSlot_ShadowDummyB);
            expect(lightDummyEInDefaultSlot_ShadowDummyCInDefaultSlot_ShadowDummyB_ShadowDummyA.closestDbuiParent).to.equal(lightDummyEInDefaultSlot_ShadowDummyCInDefaultSlot_ShadowDummyB_ShadowDummyA.__testClosestDbuiParent);
            expect(lightDummyEInDefaultSlot_ShadowDummyCInDefaultSlot_ShadowDummyB_ShadowDummyA.shadowDomDbuiParent).to.equal(lightDummyEInDefaultSlot_ShadowDummyCInDefaultSlot_ShadowDummyB);
            expect(lightDummyEInDefaultSlot_ShadowDummyCInDefaultSlot_ShadowDummyB_ShadowDummyA.shadowDomDbuiParent).to.equal(lightDummyEInDefaultSlot_ShadowDummyCInDefaultSlot_ShadowDummyB_ShadowDummyA.__testShadowDomDbuiParent);
            expect(lightDummyEInDefaultSlot_ShadowDummyCInDefaultSlot_ShadowDummyB_ShadowDummyA.lightDomDbuiParent).to.equal(null);
            expect(lightDummyEInDefaultSlot_ShadowDummyCInDefaultSlot_ShadowDummyB_ShadowDummyA.lightDomDbuiParent).to.equal(lightDummyEInDefaultSlot_ShadowDummyCInDefaultSlot_ShadowDummyB_ShadowDummyA.__testLightDomDbuiParent);


            // Test closestDbuiChildren sync.
            // NOTE: we know that at the time of connectedCallback closestDbuiChildren might not have been complete.
            expect(lightDummyDOneRoot.closestDbuiChildren).to.have.members([lightDummyDOneRoot_ShadowDummyB, lightDummyEInNamedSlot, lightDummyDTwoInDefaultSlot]);
            expect(lightDummyDOneRoot.closestDbuiChildren).to.have.members(lightDummyDOneRoot.closestDbuiChildrenLiveQuery);
            expect(lightDummyDOneRoot.shadowDomDbuiChildren).to.have.members([lightDummyDOneRoot_ShadowDummyB]);
            expect(lightDummyDOneRoot.lightDomDbuiChildren).to.have.members([lightDummyEInNamedSlot, lightDummyDTwoInDefaultSlot, lightDummyDThreeInDefaultSlot, lightDummyEInDefaultSlot]);
            expect(lightDummyDOneRoot_ShadowDummyB.closestDbuiChildren).to.have.members([lightDummyDOneRoot_ShadowDummyB_ShadowDummyA]);
            expect(lightDummyDOneRoot_ShadowDummyB.closestDbuiChildren).to.have.members(lightDummyDOneRoot_ShadowDummyB.closestDbuiChildrenLiveQuery);
            expect(lightDummyDOneRoot_ShadowDummyB.shadowDomDbuiChildren).to.have.members([lightDummyDOneRoot_ShadowDummyB_ShadowDummyA]);
            expect(lightDummyDOneRoot_ShadowDummyB.lightDomDbuiChildren).to.have.members([]);
            expect(lightDummyDOneRoot_ShadowDummyB_ShadowDummyA.closestDbuiChildren).to.have.members([]);
            expect(lightDummyDOneRoot_ShadowDummyB_ShadowDummyA.closestDbuiChildren).to.have.members(lightDummyDOneRoot_ShadowDummyB_ShadowDummyA.closestDbuiChildrenLiveQuery);
            expect(lightDummyDOneRoot_ShadowDummyB_ShadowDummyA.shadowDomDbuiChildren).to.have.members([]);
            expect(lightDummyDOneRoot_ShadowDummyB_ShadowDummyA.lightDomDbuiChildren).to.have.members([]);

            expect(lightDummyEInNamedSlot.closestDbuiChildren).to.have.members([lightDummyEInNamedSlot_ShadowDummyD]);
            expect(lightDummyEInNamedSlot.closestDbuiChildren).to.have.members(lightDummyEInNamedSlot.closestDbuiChildrenLiveQuery);
            expect(lightDummyEInNamedSlot.shadowDomDbuiChildren).to.have.members([lightDummyEInNamedSlot_ShadowDummyD, lightDummyEInNamedSlot_ShadowDummyCInDefaultSlot]);
            expect(lightDummyEInNamedSlot.lightDomDbuiChildren).to.have.members([]);
            expect(lightDummyEInNamedSlot_ShadowDummyD.closestDbuiChildren).to.have.members([lightDummyEInNamedSlot_ShadowDummyD_ShadowDummyB, lightDummyEInNamedSlot_ShadowDummyCInDefaultSlot]);
            expect(lightDummyEInNamedSlot_ShadowDummyD.closestDbuiChildren).to.have.members(lightDummyEInNamedSlot_ShadowDummyD.closestDbuiChildrenLiveQuery);
            expect(lightDummyEInNamedSlot_ShadowDummyD.shadowDomDbuiChildren).to.have.members([lightDummyEInNamedSlot_ShadowDummyD_ShadowDummyB]);
            expect(lightDummyEInNamedSlot_ShadowDummyD.lightDomDbuiChildren).to.have.members([lightDummyEInNamedSlot_ShadowDummyCInDefaultSlot]);
            expect(lightDummyEInNamedSlot_ShadowDummyD_ShadowDummyB.closestDbuiChildren).to.have.members([lightDummyEInNamedSlot_ShadowDummyD_ShadowDummyB_ShadowDummyA]);
            expect(lightDummyEInNamedSlot_ShadowDummyD_ShadowDummyB.shadowDomDbuiChildren).to.have.members([lightDummyEInNamedSlot_ShadowDummyD_ShadowDummyB_ShadowDummyA]);
            expect(lightDummyEInNamedSlot_ShadowDummyD_ShadowDummyB.lightDomDbuiChildren).to.have.members([]);
            expect(lightDummyEInNamedSlot_ShadowDummyD_ShadowDummyB_ShadowDummyA.closestDbuiChildren).to.have.members([]);
            expect(lightDummyEInNamedSlot_ShadowDummyD_ShadowDummyB_ShadowDummyA.shadowDomDbuiChildren).to.have.members([]);
            expect(lightDummyEInNamedSlot_ShadowDummyD_ShadowDummyB_ShadowDummyA.lightDomDbuiChildren).to.have.members([]);
            expect(lightDummyEInNamedSlot_ShadowDummyCInDefaultSlot.closestDbuiChildren).to.have.members([lightDummyEInNamedSlot_ShadowDummyCInDefaultSlot_ShadowDummyB]);
            expect(lightDummyEInNamedSlot_ShadowDummyCInDefaultSlot.shadowDomDbuiChildren).to.have.members([lightDummyEInNamedSlot_ShadowDummyCInDefaultSlot_ShadowDummyB]);
            expect(lightDummyEInNamedSlot_ShadowDummyCInDefaultSlot.lightDomDbuiChildren).to.have.members([]);
            expect(lightDummyEInNamedSlot_ShadowDummyCInDefaultSlot_ShadowDummyB.closestDbuiChildren).to.have.members([lightDummyEInNamedSlot_ShadowDummyCInDefaultSlot_ShadowDummyB_ShadowDummyA]);
            expect(lightDummyEInNamedSlot_ShadowDummyCInDefaultSlot_ShadowDummyB.shadowDomDbuiChildren).to.have.members([lightDummyEInNamedSlot_ShadowDummyCInDefaultSlot_ShadowDummyB_ShadowDummyA]);
            expect(lightDummyEInNamedSlot_ShadowDummyCInDefaultSlot_ShadowDummyB.lightDomDbuiChildren).to.have.members([]);
            expect(lightDummyEInNamedSlot_ShadowDummyCInDefaultSlot_ShadowDummyB_ShadowDummyA.closestDbuiChildren).to.have.members([]);
            expect(lightDummyEInNamedSlot_ShadowDummyCInDefaultSlot_ShadowDummyB_ShadowDummyA.shadowDomDbuiChildren).to.have.members([]);
            expect(lightDummyEInNamedSlot_ShadowDummyCInDefaultSlot_ShadowDummyB_ShadowDummyA.lightDomDbuiChildren).to.have.members([]);

            expect(lightDummyDTwoInDefaultSlot.closestDbuiChildren).to.have.members([lightDummyDThreeInDefaultSlot, lightDummyDTwoInDefaultSlot_ShadowDummyB]);
            expect(lightDummyDTwoInDefaultSlot.shadowDomDbuiChildren).to.have.members([lightDummyDTwoInDefaultSlot_ShadowDummyB]);
            expect(lightDummyDTwoInDefaultSlot.lightDomDbuiChildren).to.have.members([lightDummyDThreeInDefaultSlot, lightDummyEInDefaultSlot]);
            expect(lightDummyDTwoInDefaultSlot_ShadowDummyB.closestDbuiChildren).to.have.members([lightDummyDTwoInDefaultSlot_ShadowDummyB_ShadowDummyA]);
            expect(lightDummyDTwoInDefaultSlot_ShadowDummyB.shadowDomDbuiChildren).to.have.members([lightDummyDTwoInDefaultSlot_ShadowDummyB_ShadowDummyA]);
            expect(lightDummyDTwoInDefaultSlot_ShadowDummyB.lightDomDbuiChildren).to.have.members([]);
            expect(lightDummyDTwoInDefaultSlot_ShadowDummyB_ShadowDummyA.closestDbuiChildren).to.have.members([]);
            expect(lightDummyDTwoInDefaultSlot_ShadowDummyB_ShadowDummyA.shadowDomDbuiChildren).to.have.members([]);
            expect(lightDummyDTwoInDefaultSlot_ShadowDummyB_ShadowDummyA.lightDomDbuiChildren).to.have.members([]);

            expect(lightDummyDThreeInDefaultSlot.closestDbuiChildren).to.have.members([lightDummyEInDefaultSlot, lightDummyDThreeInDefaultSlot_ShadowDummyB]);
            expect(lightDummyDThreeInDefaultSlot.shadowDomDbuiChildren).to.have.members([lightDummyDThreeInDefaultSlot_ShadowDummyB]);
            expect(lightDummyDThreeInDefaultSlot.lightDomDbuiChildren).to.have.members([lightDummyEInDefaultSlot]);
            expect(lightDummyDThreeInDefaultSlot_ShadowDummyB.closestDbuiChildren).to.have.members([lightDummyDThreeInDefaultSlot_ShadowDummyB_ShadowDummyA]);
            expect(lightDummyDThreeInDefaultSlot_ShadowDummyB.shadowDomDbuiChildren).to.have.members([lightDummyDThreeInDefaultSlot_ShadowDummyB_ShadowDummyA]);
            expect(lightDummyDThreeInDefaultSlot_ShadowDummyB.lightDomDbuiChildren).to.have.members([]);
            expect(lightDummyDThreeInDefaultSlot_ShadowDummyB_ShadowDummyA.closestDbuiChildren).to.have.members([]);
            expect(lightDummyDThreeInDefaultSlot_ShadowDummyB_ShadowDummyA.shadowDomDbuiChildren).to.have.members([]);
            expect(lightDummyDThreeInDefaultSlot_ShadowDummyB_ShadowDummyA.lightDomDbuiChildren).to.have.members([]);

            expect(lightDummyEInDefaultSlot.closestDbuiChildren).to.have.members([lightDummyEInDefaultSlot_ShadowDummyD]);
            expect(lightDummyEInDefaultSlot.shadowDomDbuiChildren).to.have.members([lightDummyEInDefaultSlot_ShadowDummyD, lightDummyEInDefaultSlot_ShadowDummyCInDefaultSlot]);
            expect(lightDummyEInDefaultSlot.lightDomDbuiChildren).to.have.members([]);
            expect(lightDummyEInDefaultSlot_ShadowDummyD.closestDbuiChildren).to.have.members([lightDummyEInDefaultSlot_ShadowDummyCInDefaultSlot, lightDummyEInDefaultSlot_ShadowDummyD_ShadowDummyB]);
            expect(lightDummyEInDefaultSlot_ShadowDummyD.shadowDomDbuiChildren).to.have.members([lightDummyEInDefaultSlot_ShadowDummyD_ShadowDummyB]);
            expect(lightDummyEInDefaultSlot_ShadowDummyD.lightDomDbuiChildren).to.have.members([lightDummyEInDefaultSlot_ShadowDummyCInDefaultSlot]);
            expect(lightDummyEInDefaultSlot_ShadowDummyD_ShadowDummyB.closestDbuiChildren).to.have.members([lightDummyEInDefaultSlot_ShadowDummyD_ShadowDummyB_ShadowDummyA]);
            expect(lightDummyEInDefaultSlot_ShadowDummyD_ShadowDummyB.shadowDomDbuiChildren).to.have.members([lightDummyEInDefaultSlot_ShadowDummyD_ShadowDummyB_ShadowDummyA]);
            expect(lightDummyEInDefaultSlot_ShadowDummyD_ShadowDummyB.lightDomDbuiChildren).to.have.members([]);
            expect(lightDummyEInDefaultSlot_ShadowDummyD_ShadowDummyB_ShadowDummyA.closestDbuiChildren).to.have.members([]);
            expect(lightDummyEInDefaultSlot_ShadowDummyD_ShadowDummyB_ShadowDummyA.shadowDomDbuiChildren).to.have.members([]);
            expect(lightDummyEInDefaultSlot_ShadowDummyD_ShadowDummyB_ShadowDummyA.lightDomDbuiChildren).to.have.members([]);
            expect(lightDummyEInDefaultSlot_ShadowDummyCInDefaultSlot.closestDbuiChildren).to.have.members([lightDummyEInDefaultSlot_ShadowDummyCInDefaultSlot_ShadowDummyB]);
            expect(lightDummyEInDefaultSlot_ShadowDummyCInDefaultSlot.shadowDomDbuiChildren).to.have.members([lightDummyEInDefaultSlot_ShadowDummyCInDefaultSlot_ShadowDummyB]);
            expect(lightDummyEInDefaultSlot_ShadowDummyCInDefaultSlot.lightDomDbuiChildren).to.have.members([]);
            expect(lightDummyEInDefaultSlot_ShadowDummyCInDefaultSlot_ShadowDummyB.closestDbuiChildren).to.have.members([lightDummyEInDefaultSlot_ShadowDummyCInDefaultSlot_ShadowDummyB_ShadowDummyA]);
            expect(lightDummyEInDefaultSlot_ShadowDummyCInDefaultSlot_ShadowDummyB.shadowDomDbuiChildren).to.have.members([lightDummyEInDefaultSlot_ShadowDummyCInDefaultSlot_ShadowDummyB_ShadowDummyA]);
            expect(lightDummyEInDefaultSlot_ShadowDummyCInDefaultSlot_ShadowDummyB.lightDomDbuiChildren).to.have.members([]);
            expect(lightDummyEInDefaultSlot_ShadowDummyCInDefaultSlot_ShadowDummyB_ShadowDummyA.closestDbuiChildren).to.have.members([]);
            expect(lightDummyEInDefaultSlot_ShadowDummyCInDefaultSlot_ShadowDummyB_ShadowDummyA.shadowDomDbuiChildren).to.have.members([]);
            expect(lightDummyEInDefaultSlot_ShadowDummyCInDefaultSlot_ShadowDummyB_ShadowDummyA.lightDomDbuiChildren).to.have.members([]);
          };

          Promise.all([
            DummyA.registrationName,
            DummyB.registrationName,
            DummyC.registrationName,
            DummyD.registrationName,
            DummyE.registrationName,
          ].map((localName) => contentWindow.customElements.whenDefined(localName)
          )).then(() => {

            doTest();

            const dbuiNodes1 = treeOneGetDbuiNodes(contentWindow);
            setTimeout(() => {
              // clear everything
              container.innerHTML = '';

              Object.keys(dbuiNodes1).forEach((key) => {
                const node = dbuiNodes1[key];
                expect(node.closestDbuiChildren.length).to.equal(0);
                expect(node.closestDbuiParent).to.equal(null);
                expect(node.topDbuiAncestor).to.equal(null);
              });

              expect(contentWindow.document.querySelector('#light-dummy-d-one-root'))
                .to.equal(null);

              setTimeout(() => {
                // restart using innerHTML
                container.innerHTML = treeOne;

                const dbuiNodes = treeOneGetDbuiNodes(contentWindow);

                Object.keys(dbuiNodes1).forEach((key) => {
                  const node = dbuiNodes[key];
                  const node1 = dbuiNodes1[key];
                  // expect NOT to be same instances as we used innerHTML
                  expect(node1).to.not.equal(node);
                  if (node !== dbuiNodes.lightDummyDOneRoot) {
                    expect(node.topDbuiAncestor).to.equal(dbuiNodes.lightDummyDOneRoot);
                  }
                });

                doTest();

                const dbuiNodes2 = treeOneGetDbuiNodes(contentWindow);
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
                    if (node !== dbuiNodes.lightDummyDOneRoot) {
                      expect(node.topDbuiAncestor).to.equal(dbuiNodes.lightDummyDOneRoot);
                    }
                  });

                  doTest();

                  iframe.remove();
                  done();

                }, 0);
              }, 0);
            }, 0);
          });

          DummyE.registerSelf();
        }
      });
    });
  });

  describe('when node is removed in light DOM then re-appended', () => {
    it('unregisters self from closetDbuiParent then re-registers', (done) => {
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
              lightDummyEInNamedSlot,
              lightDummyEInNamedSlot_ShadowDummyD,
              lightDummyEInDefaultSlot
            } = dbuiNodes;


            expect(lightDummyDOneRoot.closestDbuiChildren).to.have.members([
              lightDummyDOneRoot_ShadowDummyB,
              lightDummyDTwoInDefaultSlot,
              lightDummyEInNamedSlot
            ]);
            expect(lightDummyDOneRoot.closestDbuiChildren).to.have.members(lightDummyDOneRoot.closestDbuiChildrenLiveQuery);
            expect(lightDummyDOneRoot.lightDomDbuiChildren).to.have.members([
              lightDummyDTwoInDefaultSlot,
              lightDummyEInNamedSlot,
              lightDummyDThreeInDefaultSlot,
              lightDummyEInDefaultSlot
            ]);
            expect(lightDummyEInNamedSlot.closestDbuiParent).to.equal(lightDummyDOneRoot);
            expect(lightDummyEInNamedSlot.lightDomDbuiParent).to.equal(lightDummyDOneRoot);
            expect(lightDummyDTwoInDefaultSlot.closestDbuiParent).to.equal(lightDummyDOneRoot);
            expect(lightDummyEInNamedSlot.closestDbuiChildren).to.have.members([lightDummyEInNamedSlot_ShadowDummyD]);
            expect(lightDummyEInNamedSlot.closestDbuiChildren).to.have.members(lightDummyEInNamedSlot.closestDbuiChildrenLiveQuery);
            expect(lightDummyEInNamedSlot.shadowDomDbuiChildren.length).to.equal(2);

            lightDummyDOneRoot.querySelector('#ul1-li1').removeChild(lightDummyEInNamedSlot);

            expect(lightDummyEInNamedSlot.closestDbuiChildren).to.have.members([]);
            // children are still there but not "closest" because they unregistered
            expect(lightDummyEInNamedSlot.closestDbuiChildrenLiveQuery).to.have.members([lightDummyEInNamedSlot_ShadowDummyD]);
            expect(lightDummyEInNamedSlot.shadowDomDbuiChildren.length).to.equal(2);
            expect(lightDummyDOneRoot.closestDbuiChildren).to.have.members([
              lightDummyDOneRoot_ShadowDummyB,
              lightDummyDTwoInDefaultSlot
            ]);
            expect(lightDummyDOneRoot.closestDbuiChildren).to.have.members(lightDummyDOneRoot.closestDbuiChildrenLiveQuery);
            expect(lightDummyDOneRoot.lightDomDbuiChildren).to.have.members([
              lightDummyDTwoInDefaultSlot,
              lightDummyDThreeInDefaultSlot,
              lightDummyEInDefaultSlot
            ]);
            expect(lightDummyEInNamedSlot.closestDbuiParent).to.equal(null);
            expect(lightDummyEInNamedSlot.lightDomDbuiParent).to.equal(null);
            expect(lightDummyDTwoInDefaultSlot.closestDbuiParent).to.equal(lightDummyDOneRoot);

            lightDummyDOneRoot.querySelector('#ul1-li1').appendChild(lightDummyEInNamedSlot);

            expect(lightDummyDOneRoot.closestDbuiChildren).to.have.members([
              lightDummyDOneRoot_ShadowDummyB,
              lightDummyDTwoInDefaultSlot,
              lightDummyEInNamedSlot
            ]);
            expect(lightDummyDOneRoot.closestDbuiChildren).to.have.members(lightDummyDOneRoot.closestDbuiChildrenLiveQuery);
            expect(lightDummyDOneRoot.lightDomDbuiChildren).to.have.members([
              lightDummyDTwoInDefaultSlot,
              lightDummyEInNamedSlot,
              lightDummyDThreeInDefaultSlot,
              lightDummyEInDefaultSlot
            ]);
            expect(lightDummyEInNamedSlot.closestDbuiParent).to.equal(lightDummyDOneRoot);
            expect(lightDummyEInNamedSlot.lightDomDbuiParent).to.equal(lightDummyDOneRoot);
            expect(lightDummyDTwoInDefaultSlot.closestDbuiParent).to.equal(lightDummyDOneRoot);
            expect(lightDummyEInNamedSlot.closestDbuiChildren).to.have.members([lightDummyEInNamedSlot_ShadowDummyD]);
            expect(lightDummyEInNamedSlot.shadowDomDbuiChildren.length).to.equal(2);

            setTimeout(() => {
              iframe.remove();
              done();
            }, 0);


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
              expect(lightDummyEInNamedSlot.closestDbuiParent).to.equal(null);
              expect(lightDummyEInNamedSlot.closestDbuiChildren.length).to.equal(0);

              // Replacing child also did unregistered from its parent (synchronously)
              // and has registered to the new parent.
              expect(lightDummyDTwoInDefaultSlot.closestDbuiChildren).to.not.include(lightDummyDThreeInDefaultSlot);
              expect(lightDummyDThreeInDefaultSlot.closestDbuiParent).to.equal(lightDummyDOneRoot);
              expect(lightDummyDThreeInDefaultSlot.closestDbuiChildren.length).to.equal(2);

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
              expect(lightDummyEInNamedSlot.closestDbuiParent).to.equal(null);
              expect(lightDummyDOneRoot.querySelector('#ul2-li1-ul1-li1').children.length).to.equal(0);

              // put nodes back as they were and redo initial test
              lightDummyDOneRoot.querySelector('#ul1-li1').appendChild(lightDummyEInNamedSlot);

              // intermediary test
              expect(lightDummyEInNamedSlot.closestDbuiParent).to.equal(lightDummyDOneRoot);
              expect(lightDummyDOneRoot.closestDbuiChildren).to.have.members([
                lightDummyDOneRoot_ShadowDummyB,
                lightDummyDTwoInDefaultSlot,
                lightDummyEInNamedSlot,
                lightDummyDThreeInDefaultSlot
              ]);

              lightDummyDOneRoot.querySelector('#ul2-li1-ul1-li1').appendChild(lightDummyDThreeInDefaultSlot);

              doTest();
              setTimeout(() => {
                iframe.remove();
                done();
              }, 0);
            });
            DummyE.registerSelf();
          }
        });
      });
  });

  describe('when node is appended under a new parent while being removed from an old parent in light DOM', () => {
    it('unregisters from old parent and registers to the new parent', (done) => {
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
              lightDummyDTwoInDefaultSlot_ShadowDummyB,
              lightDummyDThreeInDefaultSlot,
              lightDummyDThreeInDefaultSlot_ShadowDummyB,
              lightDummyEInNamedSlot,
              lightDummyEInDefaultSlot
            } = dbuiNodes;

            expect(lightDummyDOneRoot.closestDbuiChildren).to.have.members([lightDummyDOneRoot_ShadowDummyB, lightDummyEInNamedSlot, lightDummyDTwoInDefaultSlot]);
            expect(lightDummyDTwoInDefaultSlot.closestDbuiParent).to.equal(lightDummyDOneRoot);
            expect(lightDummyDTwoInDefaultSlot.closestDbuiChildren).to.have.members([lightDummyDTwoInDefaultSlot_ShadowDummyB, lightDummyDThreeInDefaultSlot]);
            expect(lightDummyDThreeInDefaultSlot.closestDbuiParent).to.equal(lightDummyDTwoInDefaultSlot);
            expect(lightDummyDThreeInDefaultSlot.closestDbuiChildren).to.have.members([lightDummyDThreeInDefaultSlot_ShadowDummyB, lightDummyEInDefaultSlot]);

            contentWindow.document.querySelector('#ul1').appendChild(
              contentWindow.document.querySelector('#ul2-li1-ul1-li1')
            );

            expect(lightDummyDOneRoot.closestDbuiChildren).to.have.members([lightDummyDOneRoot_ShadowDummyB, lightDummyEInNamedSlot, lightDummyDTwoInDefaultSlot, lightDummyDThreeInDefaultSlot]);
            expect(lightDummyDTwoInDefaultSlot.closestDbuiParent).to.equal(lightDummyDOneRoot);
            expect(lightDummyDTwoInDefaultSlot.closestDbuiChildren).to.have.members([lightDummyDTwoInDefaultSlot_ShadowDummyB]);
            expect(lightDummyDThreeInDefaultSlot.closestDbuiParent).to.equal(lightDummyDOneRoot);
            expect(lightDummyDThreeInDefaultSlot.closestDbuiChildren).to.have.members([lightDummyDThreeInDefaultSlot_ShadowDummyB, lightDummyEInDefaultSlot]);

            iframe.remove();
            done();
          });

          DummyE.registerSelf();
        }
      });
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

            const lightDummyDThreeInDefaultSlotClone = lightDummyDThreeInDefaultSlot.cloneNodeDeep({ idSuffix: '_clone' });

            // clone not registered yet
            expect(lightDummyDThreeInDefaultSlotClone.closestDbuiParent).to.equal(null);
            expect(lightDummyDThreeInDefaultSlotClone.closestDbuiChildren).to.have.members([]);
            expect(lightDummyDOneRoot.closestDbuiChildren).to.have.members([
              lightDummyDOneRoot_ShadowDummyB,
              lightDummyDTwoInDefaultSlot,
              lightDummyEInNamedSlot
            ]);

            lightDummyDOneRoot.appendChild(lightDummyDThreeInDefaultSlotClone);
            expect(lightDummyDThreeInDefaultSlot.closestDbuiChildren).to.have.members([lightDummyDThreeInDefaultSlot_ShadowDummyB, lightDummyEInDefaultSlot]);

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

          DummyE.registerSelf();
        }
      });
    });
  });

  describe('when node is adopted into a new document in light DOM', () => {
    // no need to check shadow DOM
    it('unregisters from old parent and registers to the new parent', (done) => {
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
              // lightDummyDTwoInDefaultSlot_ShadowDummyB,
              // lightDummyDThreeInDefaultSlot,
              // lightDummyDThreeInDefaultSlot_ShadowDummyB,
              lightDummyEInNamedSlot,
              // lightDummyEInDefaultSlot
            } = dbuiNodes;

            setTimeout(() => {

              inIframe({
                headStyle: treeStyle,
                bodyHTML: `
                <div id="container">
                  ${treeOne}
                </div>
                `,
                onLoad: ({ contentWindow: contentWindow2, iframe: iframe2 }) => {
                  const DummyA2 = getDummyA(contentWindow2);
                  const DummyB2 = getDummyB(contentWindow2);
                  const DummyC2 = getDummyC(contentWindow2);
                  const DummyD2 = getDummyD(contentWindow2);
                  const DummyE2 = getDummyE(contentWindow2);

                  Promise.all([
                    DummyA2.registrationName,
                    DummyB2.registrationName,
                    DummyC2.registrationName,
                    DummyD2.registrationName,
                    DummyE2.registrationName,
                  ].map((localName) => contentWindow2.customElements.whenDefined(localName)
                  )).then(() => {
                    const dbuiNodes2 = treeOneGetDbuiNodes(contentWindow2);
                    const {
                      lightDummyDOneRoot: lightDummyDOneRoot2,
                      // lightDummyDOneRoot_ShadowDummyB: lightDummyDOneRoot_ShadowDummyB2,
                      lightDummyDTwoInDefaultSlot: lightDummyDTwoInDefaultSlot2,
                      lightDummyDTwoInDefaultSlot_ShadowDummyB: lightDummyDTwoInDefaultSlot_ShadowDummyB2,
                      lightDummyDThreeInDefaultSlot: lightDummyDThreeInDefaultSlot2,
                      lightDummyDThreeInDefaultSlot_ShadowDummyB: lightDummyDThreeInDefaultSlot_ShadowDummyB2,
                      // lightDummyEInNamedSlot: lightDummyEInNamedSlot2,
                      lightDummyEInDefaultSlot: lightDummyEInDefaultSlot2
                    } = dbuiNodes2;

                    setTimeout(() => {

                      expect(lightDummyDOneRoot.closestDbuiChildren).to.have.members([lightDummyDOneRoot_ShadowDummyB, lightDummyEInNamedSlot, lightDummyDTwoInDefaultSlot]);
                      expect(lightDummyDTwoInDefaultSlot2.closestDbuiParent).to.equal(lightDummyDOneRoot2);
                      expect(lightDummyDTwoInDefaultSlot2.closestDbuiChildren).to.have.members([lightDummyDTwoInDefaultSlot_ShadowDummyB2, lightDummyDThreeInDefaultSlot2]);
                      expect(lightDummyDThreeInDefaultSlot2.closestDbuiParent).to.equal(lightDummyDTwoInDefaultSlot2);
                      expect(lightDummyDThreeInDefaultSlot2.closestDbuiChildren).to.have.members([lightDummyDThreeInDefaultSlot_ShadowDummyB2, lightDummyEInDefaultSlot2]);
                      expect(lightDummyDThreeInDefaultSlot2.ownerDocument).to.equal(contentWindow2.document);
                      expect(lightDummyDThreeInDefaultSlot2.ownerDocument.defaultView).to.equal(contentWindow2);

                      contentWindow.document.querySelector('#ul1').appendChild(
                        contentWindow2.document.querySelector('#ul2-li1-ul1-li1')
                      );

                      expect(lightDummyDOneRoot.closestDbuiChildren).to.have.members([lightDummyDOneRoot_ShadowDummyB, lightDummyEInNamedSlot, lightDummyDTwoInDefaultSlot, lightDummyDThreeInDefaultSlot2]);
                      expect(lightDummyDTwoInDefaultSlot2.closestDbuiParent).to.equal(lightDummyDOneRoot2);
                      expect(lightDummyDTwoInDefaultSlot2.closestDbuiChildren).to.have.members([lightDummyDTwoInDefaultSlot_ShadowDummyB2]);
                      expect(lightDummyDThreeInDefaultSlot2.closestDbuiParent).to.equal(lightDummyDOneRoot);
                      expect(lightDummyDThreeInDefaultSlot2.closestDbuiChildren).to.have.members([lightDummyDThreeInDefaultSlot_ShadowDummyB2, lightDummyEInDefaultSlot2]);
                      expect(lightDummyDThreeInDefaultSlot2.ownerDocument).to.equal(contentWindow.document);
                      expect(lightDummyDThreeInDefaultSlot2.ownerDocument.defaultView).to.equal(contentWindow);

                      setTimeout(() => {
                        iframe2.remove();
                        iframe.remove();
                        done();
                      }, 0);

                    }, 0);
                  });

                  DummyE2.registerSelf();
                }
              });

            }, 0);
          });

          DummyE.registerSelf();
        }
      });
    });
  });

  describe('when node is removed/appended in shadow DOM', () => {
    it('unregisters/re-registers self from/to closetDbuiParent', (done) => {
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
              lightDummyEInNamedSlot_ShadowDummyCInDefaultSlot
            } = dbuiNodes;

            const lightDummyEInNamedSlot_ShadowDummyCInDefaultSlot_shadowDummyB =
              lightDummyEInNamedSlot_ShadowDummyCInDefaultSlot.shadowRoot.querySelector('#shadow-dummy-b');
            const lightDummyEInNamedSlot_ShadowDummyCInDefaultSlot_shadowDummyB_parentElement =
              lightDummyEInNamedSlot_ShadowDummyCInDefaultSlot_shadowDummyB.parentElement;

            expect(lightDummyEInNamedSlot_ShadowDummyCInDefaultSlot_shadowDummyB.closestDbuiParent).to.equal(
              lightDummyEInNamedSlot_ShadowDummyCInDefaultSlot
            );
            expect(lightDummyEInNamedSlot_ShadowDummyCInDefaultSlot.closestDbuiChildren).to.include(
              lightDummyEInNamedSlot_ShadowDummyCInDefaultSlot_shadowDummyB
            );

            lightDummyEInNamedSlot_ShadowDummyCInDefaultSlot_shadowDummyB.remove();

            expect(lightDummyEInNamedSlot_ShadowDummyCInDefaultSlot_shadowDummyB.closestDbuiParent).to.equal(
              null
            );
            expect(lightDummyEInNamedSlot_ShadowDummyCInDefaultSlot.closestDbuiChildren).to.not.include(
              lightDummyEInNamedSlot_ShadowDummyCInDefaultSlot_shadowDummyB
            );

            lightDummyEInNamedSlot_ShadowDummyCInDefaultSlot_shadowDummyB_parentElement.appendChild(
              lightDummyEInNamedSlot_ShadowDummyCInDefaultSlot_shadowDummyB
            );

            expect(lightDummyEInNamedSlot_ShadowDummyCInDefaultSlot_shadowDummyB.closestDbuiParent).to.equal(
              lightDummyEInNamedSlot_ShadowDummyCInDefaultSlot
            );
            expect(lightDummyEInNamedSlot_ShadowDummyCInDefaultSlot.closestDbuiChildren).to.include(
              lightDummyEInNamedSlot_ShadowDummyCInDefaultSlot_shadowDummyB
            );

            iframe.remove();
            done();

          });

          DummyE.registerSelf();
        }
      });
    });
  });

  describe('when cloneNodeDeep in shadow DOM', () => {
    it('it starts unregistered then, when inserted into the shadow DOM it registers self to closetDbuiParent', (done) => {
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
              lightDummyEInNamedSlot_ShadowDummyCInDefaultSlot
            } = dbuiNodes;

            const lightDummyEInNamedSlot_ShadowDummyCInDefaultSlot_shadowDummyB =
              lightDummyEInNamedSlot_ShadowDummyCInDefaultSlot.shadowRoot.querySelector('#shadow-dummy-b');
            const lightDummyEInNamedSlot_ShadowDummyCInDefaultSlot_shadowDummyB_child =
              lightDummyEInNamedSlot_ShadowDummyCInDefaultSlot_shadowDummyB.closestDbuiChildren[0];
            const lightDummyEInNamedSlot_ShadowDummyCInDefaultSlot_shadowDummyB_parentElement =
              lightDummyEInNamedSlot_ShadowDummyCInDefaultSlot_shadowDummyB.parentElement;
            const lightDummyEInNamedSlot_ShadowDummyCInDefaultSlot_shadowDummyB_clone =
              lightDummyEInNamedSlot_ShadowDummyCInDefaultSlot_shadowDummyB.cloneNodeDeep({ idSuffix: '_clone' });

            expect(lightDummyEInNamedSlot_ShadowDummyCInDefaultSlot_shadowDummyB.closestDbuiChildren.length).to.equal(1);
            expect(lightDummyEInNamedSlot_ShadowDummyCInDefaultSlot_shadowDummyB_clone.id).to.equal('shadow-dummy-b_clone');

            // the clone has no parent no children yet
            expect(lightDummyEInNamedSlot_ShadowDummyCInDefaultSlot_shadowDummyB_clone.closestDbuiParent).to.equal(
              null
            );
            expect(lightDummyEInNamedSlot_ShadowDummyCInDefaultSlot_shadowDummyB_clone.closestDbuiChildren).to.have.members([]);

            // connecting the clone
            lightDummyEInNamedSlot_ShadowDummyCInDefaultSlot_shadowDummyB_parentElement.appendChild(
              lightDummyEInNamedSlot_ShadowDummyCInDefaultSlot_shadowDummyB_clone
            );

            // after connected the clone has parent and children
            expect(lightDummyEInNamedSlot_ShadowDummyCInDefaultSlot_shadowDummyB_clone.closestDbuiParent).to.equal(
              lightDummyEInNamedSlot_ShadowDummyCInDefaultSlot
            );
            expect(lightDummyEInNamedSlot_ShadowDummyCInDefaultSlot_shadowDummyB_clone.closestDbuiChildren.length).to.equal(1);
            expect(lightDummyEInNamedSlot_ShadowDummyCInDefaultSlot_shadowDummyB_clone.closestDbuiChildren[0].id).to.equal('shadow-dummy-a');
            expect(lightDummyEInNamedSlot_ShadowDummyCInDefaultSlot_shadowDummyB_clone.closestDbuiChildren[0]).to.not.equal(
              lightDummyEInNamedSlot_ShadowDummyCInDefaultSlot_shadowDummyB_child
            );

            iframe.remove();
            done();

          });

          DummyE.registerSelf();
        }
      });
    });
  });
});
