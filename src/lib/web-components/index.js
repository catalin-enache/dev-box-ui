
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
Using this function implies entire DBUIWebComponents library
is already loaded.
It is useful especially when working with distribution build.
If you want to load just one web-component or a subset of web-components
load them from node_modules by their path
ex:
import SomeComponentLoader from node_modules/dev-box-ui/build/src/lib/webcomponents/SomeComponent;
*/
function quickSetupAndLoad(win = window) {
  return function (components) {
    const ret = {};
    components.forEach(({ registrationName, componentStyle }) => {
      dbuiWebComponentsSetUp(win).appendStyle(registrationName, componentStyle);
      const componentClass = registrations[registrationName](window);
      componentClass.registerSelf();
      ret[registrationName] = componentClass;
    });
    return ret;
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

if (process.env.NODE_ENV !== 'production') {
  console.log('Using DBUIWebComponentsDistLib develop build.');
} else {
  console.log('Using DBUIWebComponentsDistLib production build.');
}
