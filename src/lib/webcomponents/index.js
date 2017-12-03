
import getDBUWebComponentDummy from './DBUWebComponentDummy/DBUWebComponentDummy';
import getDBUWebComponentDummyParent from './DBUWebComponentDummyParent/DBUWebComponentDummyParent';

const DBUWebComponents = {
  DBUWebComponentDummy: getDBUWebComponentDummy(window),
  DBUWebComponentDummyParent: getDBUWebComponentDummyParent(window)
};

window.DBUWebComponents = DBUWebComponents;

Object.keys(DBUWebComponents).forEach((component) => component.registerSelf());
