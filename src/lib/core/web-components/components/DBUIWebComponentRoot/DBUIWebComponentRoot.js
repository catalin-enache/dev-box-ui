
import getDBUIWebComponentCore from '../DBUIWebComponentCore/DBUIWebComponentCore';
import ensureSingleRegistration from '../../../internals/ensureSingleRegistration';

const registrationName = 'dbui-web-component-root';

/**
 * This component is required and must be registered last.
 * It must wrap all dbui web-components in a page.
 */
export default function getDBUIWebComponentRoot(win) {
  return ensureSingleRegistration(win, registrationName, () => {
    const {
      DBUIWebComponentBase,
      defineCommonStaticMethods,
      Registerable
    } = getDBUIWebComponentCore(win);

    class DBUIWebComponentRoot extends DBUIWebComponentBase {

      static get registrationName() {
        return registrationName;
      }

      get isDBUIRootNode() {
        return true;
      }

      static get templateInnerHTML() {
        return `
          <style>
          :host { display: block; }
          </style>
          <slot></slot>
        `;
      }

      _onConnectedCallback() {
        // delivery management
        // light DOM descendants that will be connected
        this._descendantsQueueLightDom = [];
        // _descendantsQueueLightDom nodes that did not entered _runtimeSetUpForLightDomMutations
        // due to their time had not come yet.
        // When _descendantsQueueLightDom is defined _pendingLightDomConnections is the same.
        this._pendingLightDomConnections = new Set();
        // _descendantsQueueLightDom nodes that were about to enter _runtimeSetUpForLightDomMutations
        // but were prevented due to their parent did not entered _runtimeSetUpForLightDomMutations.
        // This happens when parent was prevented to _doLightDomSetup due to its shadow DOM was not connected.
        this._pendingRuntimeSetupForLightDom = new Set();
        // When replacing a light node, due to connects being interleaved with disconnects by some browsers
        // we want first to do disconnect everything under the node being disconnected and then do all re-connects.
        // Here are kept intended connections that were discarded due to being interleaved.
        this._pendingConnectionsDuringDisconnectFlow = [];
        // Marker that says that disconnecting flow started, helping in preventing interleaved connections.
        this._disconnectChainStartedWith = null;
        // delivery flags
        win.DBUIWebComponents.dbuiRootNodeUpgraded = false;
        if (win.document.querySelectorAll('dbui-web-component-root').length > 1) {
          throw new win.Error('only one instance of dbui-web-component-root is allowed');
        }
        super._onConnectedCallback();
      }

    }

    return Registerable(
      defineCommonStaticMethods(
        DBUIWebComponentRoot
      )
    );
  });
}

getDBUIWebComponentRoot.registrationName = registrationName;

