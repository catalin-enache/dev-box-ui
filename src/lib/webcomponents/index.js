
import dbuWebComponentsSetUp from './DBUWebComponentsSetup/DBUWebComponentsSetup';
import getDBUWebComponentDummy from './DBUWebComponentDummy/DBUWebComponentDummy';
import getDBUWebComponentDummyParent from './DBUWebComponentDummyParent/DBUWebComponentDummyParent';

const registrations = {
  [getDBUWebComponentDummy.registrationName]: getDBUWebComponentDummy,
  [getDBUWebComponentDummyParent.registrationName]: getDBUWebComponentDummyParent,
};

function quickSetupAndLoad(win = window) {
  return function (components) {
    const ret = {};
    components.forEach(({ registrationName, componentStyle }) => {
      dbuWebComponentsSetUp(win).appendStyle(registrationName, componentStyle);
      const componentClass = registrations[registrationName](window);
      componentClass.registerSelf();
      ret[registrationName] = componentClass;
    });
    return ret;
  };
}

export {
  quickSetupAndLoad,
  dbuWebComponentsSetUp,
  getDBUWebComponentDummy,
  getDBUWebComponentDummyParent
};
