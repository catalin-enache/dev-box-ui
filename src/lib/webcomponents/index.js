
// helpers
import dbuiWebComponentsSetUp from './DBUIWebComponentsSetup/DBUIWebComponentsSetup';

// internals
import ensureSingleRegistration from './internals/ensureSingleRegistration';
import getDBUIWebComponentBase from './DBUIWebComponentBase/DBUIWebComponentBase';

// behaviours
import Focusable from './behaviours/Focusable';

// components
import getDBUIWebComponentDummy from './DBUIWebComponentDummy/DBUIWebComponentDummy';
import getDBUIWebComponentDummyParent from './DBUIWebComponentDummyParent/DBUIWebComponentDummyParent';
import getDBUIWebComponentFormInputText from './DBUIWebComponentFormInputText/DBUIWebComponentFormInputText';

const registrations = {
  [getDBUIWebComponentDummy.registrationName]:
    getDBUIWebComponentDummy,
  [getDBUIWebComponentDummyParent.registrationName]:
    getDBUIWebComponentDummyParent,
  [getDBUIWebComponentFormInputText.registrationName]:
    getDBUIWebComponentFormInputText,
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

  // helpers
  quickSetupAndLoad,
  dbuiWebComponentsSetUp,

  // internals
  ensureSingleRegistration,
  getDBUIWebComponentBase,

  // behaviours
  Focusable,

  // components
  getDBUIWebComponentDummy,
  getDBUIWebComponentDummyParent,
  getDBUIWebComponentFormInputText
};
