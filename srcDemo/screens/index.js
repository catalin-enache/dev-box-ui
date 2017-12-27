// General
import UsingDevBoxUIScreen from './General/UsingDevBoxUIScreen';

// Services
import LocaleServiceScreen from './Services/LocaleServiceScreen';

// React Components
import HelloScreen from './ReactComponents/HelloScreen';
import ListScreen from './ReactComponents/ListScreen';
import FormInputScreen from './ReactComponents/FormInputScreen';
import FormInputNumberScreen from './ReactComponents/FormInputNumberScreen';
import DraggableScreen from './ReactComponents/DraggableScreen';
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
  DraggableScreen,
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
      { path: 'LocaleServiceScreen', title: 'Locale' }
    ]
  },
  {
    title: 'Web Components',
    links: [
      { path: 'WebComponentsScreens/DBUWebComponentDummyScreen.html', title: 'Dummy' },
      { path: 'WebComponentsScreens/DBUWebComponentDummyParentScreen.html', title: 'Dummy Parent' },
    ]
  },
  {
    title: 'React Components',
    links: [
      { path: 'HelloScreen', title: 'Hello' },
      { path: 'ListScreen', title: 'List' },
      { path: 'FormInputScreen', title: 'Form Input' },
      { path: 'FormInputNumberScreen', title: 'Form Input Number' },
      { path: 'DraggableScreen', title: 'Draggable' },
      { path: 'DBUWebComponentDummyScreen', title: 'Dummy' },
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
