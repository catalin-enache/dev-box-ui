
import dbuiWebComponentsSetUp from './DBUIWebComponentsSetup/DBUIWebComponentsSetup';
import getDBUIWebComponentDummy from './DBUIWebComponentDummy/DBUIWebComponentDummy';
import getDBUIWebComponentDummyParent from './DBUIWebComponentDummyParent/DBUIWebComponentDummyParent';

const registrations = {
  [getDBUIWebComponentDummy.registrationName]: getDBUIWebComponentDummy,
  [getDBUIWebComponentDummyParent.registrationName]: getDBUIWebComponentDummyParent,
};

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
  quickSetupAndLoad,
  dbuiWebComponentsSetUp,
  getDBUIWebComponentDummy,
  getDBUIWebComponentDummyParent
};
