
// Helpers
import dbuiWebComponentsSetUp from './helpers/dbuiWebComponentsSetup';

// Internals
import ensureSingleRegistration from './internals/ensureSingleRegistration';

// ComponentBase
import getDBUIWebComponentBase from './components/DBUIWebComponentBase/DBUIWebComponentBase';

// Behaviours
import Focusable from './behaviours/Focusable';

// Services
import getDBUILocaleService from './services/DBUILocaleService';
import getDBUII18nService from './services/DBUII18nService';

// Utils
import formatters from './utils/formatters';
import traits from './utils/traits';
import template from './utils/template';
import onScreenConsole from './utils/onScreenConsole';

// Components
import getDBUIWebComponentDummy from './components/DBUIWebComponentDummy/DBUIWebComponentDummy';
import getDBUIWebComponentDummyParent from './components/DBUIWebComponentDummyParent/DBUIWebComponentDummyParent';
import getDBUIWebComponentFormInputText from './components/DBUIWebComponentFormInputText/DBUIWebComponentFormInputText';
import getDBUIWebComponentIcon from './components/DBUIWebComponentIcon/DBUIWebComponentIcon';

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
If one wants to load just one web-component or a subset of web-components
they should be loaded from node_modules/dev-box-ui/web-components by their path
ex:
import SomeComponentLoader from node_modules/dev-box-ui/web-components/path/to/SomeComponent;
*/
function quickSetupAndLoad(win = window) {
  /**
   * @param components Object {
   *  registrationName,
   *  componentStyle
   * }
   * @return Object { <registrationName>, <componentClass> }
   */
  return function (components) {
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

  // ComponentBase
  getDBUIWebComponentBase,

  // Behaviours
  Focusable,

  // Services
  getDBUILocaleService,
  getDBUII18nService,

  // Utils
  formatters,
  traits,
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

