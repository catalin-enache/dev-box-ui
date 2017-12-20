import HelloScreen from './HelloScreen';
import ListScreen from './ListScreen';
import FormInputScreen from './FormInputScreen';
import FormInputNumberScreen from './FormInputNumberScreen';
import Draggable from './DraggableScreen';
import DBUWebComponentDummyScreen from './DBUWebComponentDummyScreen';
import UsingDevBoxUIScreen from './UsingDevBoxUIScreen';


const screens = {
  // General
  UsingDevBoxUIScreen,

  // Components
  HelloScreen,
  ListScreen,
  FormInputScreen,
  FormInputNumberScreen,
  Draggable,
  DBUWebComponentDummyScreen,
  'DBUWebComponentDummyScreen.html': null,
  'DBUWebComponentDummyParentScreen.html': null
};

const screenLinksGen = [
  {
    title: 'General',
    links: [
      { path: 'UsingDevBoxUIScreen', title: 'Using Dev Box UI' }
    ]
  },
  {
    title: 'Components',
    links: [
      { path: 'HelloScreen', title: 'Hello - React' },
      { path: 'ListScreen', title: 'List - React' },
      { path: 'FormInputScreen', title: 'Form Input - React' },
      { path: 'FormInputNumberScreen', title: 'Form Input Number - React' },
      { path: 'Draggable', title: 'Draggable - React' },
      { path: 'DBUWebComponentDummyScreen', title: 'Dummy - React' },
      { path: 'DBUWebComponentDummyScreen.html', title: 'Dummy - Web Component' },
      { path: 'DBUWebComponentDummyParentScreen.html', title: 'Dummy Parent - Web Component' },
    ]
  }
];

export {
  screens,
  screenLinksGen
};
