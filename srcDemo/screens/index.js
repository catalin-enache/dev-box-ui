// General
import UsingDevBoxUIScreen from './General/UsingDevBoxUIScreen';

// Services
import LocaleServiceScreen from './Services/LocaleServiceScreen';

// React Components
import HelloScreen from './ReactComponents/HelloScreen';
import ListScreen from './ReactComponents/ListScreen';
import FormInputScreen from './ReactComponents/FormInputScreen';
import FormInputNumberScreen from './ReactComponents/FormInputNumberScreen';
import Draggable from './ReactComponents/DraggableScreen';
import DBUWebComponentDummyScreen from './ReactComponents/DBUWebComponentDummyScreen';

// Debug
import OnScreenConsoleScreen from './Debug/OnScreenConsoleScreen';

const screens = {
  // General
  UsingDevBoxUIScreen,

  // Services
  LocaleServiceScreen,

  // Components
  HelloScreen,
  ListScreen,
  FormInputScreen,
  FormInputNumberScreen,
  Draggable,
  DBUWebComponentDummyScreen,

  // Debug
  OnScreenConsoleScreen
};

/*
The real path matters only for .html screens as they are loaded into an iFrame.
React screens path needs to be the same as imported react component.
*/
const screenLinksGen = [
  {
    title: 'General',
    links: [
      { path: 'UsingDevBoxUIScreen', title: 'Using Dev Box UI' }
    ]
  },
  {
    title: 'Services',
    links: [
      { path: 'LocaleServiceScreen', title: 'Locale Service' }
    ]
  },
  {
    title: 'Web Components',
    links: [
      { path: 'WebComponentsScreens/DBUWebComponentDummyScreen.html', title: 'Dummy - Web Component' },
      { path: 'WebComponentsScreens/DBUWebComponentDummyParentScreen.html', title: 'Dummy Parent - Web Component' },
    ]
  },
  {
    title: 'React Components',
    links: [
      { path: 'HelloScreen', title: 'Hello - React' },
      { path: 'ListScreen', title: 'List - React' },
      { path: 'FormInputScreen', title: 'Form Input - React' },
      { path: 'FormInputNumberScreen', title: 'Form Input Number - React' },
      { path: 'Draggable', title: 'Draggable - React' },
      { path: 'DBUWebComponentDummyScreen', title: 'Dummy - React' },
    ]
  },
  {
    title: 'Debug',
    links: [
      { path: 'OnScreenConsoleScreen', title: 'On Screen Console' },
    ]
  }
];

export {
  screens,
  screenLinksGen
};
