/* eslint max-len: 0 */
// Helpers
import dbuiWebComponentsSetUp from './web-components/helpers/dbuiWebComponentsSetup';

// Internals
import ensureSingleRegistration from './internals/ensureSingleRegistration';

// ComponentBase
import getDBUIWebComponentCore from './web-components/components/DBUIWebComponentCore/DBUIWebComponentCore';

// Decorators
import Focusable from './web-components/decorators/Focusable';

// Services
import getDBUILocaleService from './services/DBUILocaleService';
import getDBUII18nService from './services/DBUII18nService';

// Utils
import formatters from './utils/formatters';
import toggleSelectable from './utils/toggleSelectable';
import template from './utils/template';
import onScreenConsole from './utils/onScreenConsole';

// Components
import getDBUIWebComponentDummy from './web-components/components/DBUIWebComponentDummy/DBUIWebComponentDummy';
import getDBUIWebComponentDummyParent from './web-components/components/DBUIWebComponentDummyParent/DBUIWebComponentDummyParent';
import getDBUIWebComponentFormInputText from './web-components/components/DBUIWebComponentFormInputText/DBUIWebComponentFormInputText';
import getDBUIWebComponentIcon from './web-components/components/DBUIWebComponentIcon/DBUIWebComponentIcon';

const registrations = {
  [getDBUIWebComponentDummy.registrationName]:
    getDBUIWebComponentDummy,
  [getDBUIWebComponentDummyParent.registrationName]:
    getDBUIWebComponentDummyParent,
  [getDBUIWebComponentFormInputText.registrationName]:
    getDBUIWebComponentFormInputText,
  [getDBUIWebComponentIcon.registrationName]:
    getDBUIWebComponentIcon
};

/*
This helper function is just for convenience.
Using it implies that entire DBUIWebComponents library is already loaded.
It is useful especially when working with distribution build.
If one wants to load just one web-component or a subset of core
they should be loaded from node_modules/dev-box-ui/core by their path
ex:
import SomeComponentLoader from node_modules/dev-box-ui/core/path/to/SomeComponent;
*/
function quickSetupAndLoad(win = window) {
  /**
   * @param components Object {
   *  registrationName,
   *  componentStyle
   * }
   * @return Object { <registrationName>, <componentClass> }
   */
  return (components) => {
    return dbuiWebComponentsSetUp(win)(components)
      .reduce((acc, { registrationName }) => {
        const componentClass = registrations[registrationName](window);
        componentClass.registerSelf();
        acc[registrationName] = componentClass;
        return acc;
      }, {});
  };
}

export {
  registrations,

  // Helpers
  quickSetupAndLoad,
  dbuiWebComponentsSetUp,

  // Internals
  ensureSingleRegistration,

  // ComponentCore
  getDBUIWebComponentCore,

  // Decorators
  Focusable,

  // Services
  getDBUILocaleService,
  getDBUII18nService,

  // Utils
  formatters,
  toggleSelectable,
  template,
  onScreenConsole,

  // Components
  getDBUIWebComponentDummy,
  getDBUIWebComponentDummyParent,
  getDBUIWebComponentFormInputText,
  getDBUIWebComponentIcon
};

/* eslint no-console: 0 */

let build = 'production';

if (process.env.NODE_ENV !== 'production') {
  build = 'develop';
}

console.log(`Using DBUIWebComponentsDistLib ${build} build.`);

