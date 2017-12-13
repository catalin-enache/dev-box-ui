import HelloScreen from './HelloScreen';
import ListScreen from './ListScreen';
import FormInputScreen from './FormInputScreen';
import FormInputNumberScreen from './FormInputNumberScreen';
import Draggable from './DraggableScreen';
import DBUWebComponentDummyScreen from './DBUWebComponentDummyScreen';


const screens = {
  HelloScreen,
  ListScreen,
  FormInputScreen,
  FormInputNumberScreen,
  Draggable,
  DBUWebComponentDummyScreen,
  'DBUWebComponentDummyScreen.html': null,
  'DBUWebComponentDummyParentScreen.html': null
};

const screenLinkNames = {
  HelloScreen: 'Hello - React',
  ListScreen: 'List - React',
  FormInputScreen: 'Form Input - React',
  FormInputNumberScreen: 'Form Input Number - React',
  Draggable: 'Draggable - React',
  DBUWebComponentDummyScreen: 'Dummy - React',
  'DBUWebComponentDummyScreen.html': 'Dummy - Web Component',
  'DBUWebComponentDummyParentScreen.html': 'Dummy Parent - Web Component'
};

export {
  screens,
  screenLinkNames
};
