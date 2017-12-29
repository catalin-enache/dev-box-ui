// General
import LoadingDevBoxUIWebComponents from './General/LoadingDevBoxUIWebComponents';

// Services
import LocaleServiceScreen from './Services/LocaleServiceScreen';

// React Components
import HelloScreen from './ReactComponents/HelloScreen';
import ListScreen from './ReactComponents/ListScreen';
import FormInputScreen from './ReactComponents/FormInputScreen';
import FormInputNumberScreen from './ReactComponents/FormInputNumberScreen';
import DraggableScreen from './ReactComponents/DraggableScreen';
import DBUIWebComponentDummyScreen from './ReactComponents/DBUIWebComponentDummyScreen';

// Debug
import OnScreenConsoleScreen from './Debug/OnScreenConsoleScreen';

const screens = {
  // General
  LoadingDevBoxUIWebComponents,

  // Services
  LocaleServiceScreen,

  // Components
  HelloScreen,
  ListScreen,
  FormInputScreen,
  FormInputNumberScreen,
  DraggableScreen,
  DBUIWebComponentDummyScreen,

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
      { path: 'LoadingDevBoxUIWebComponents', title: 'Loading Web Components' }
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
      { path: 'WebComponentsScreens/DBUIWebComponentDummyScreen.html', title: 'Dummy' },
      { path: 'WebComponentsScreens/DBUIWebComponentDummyParentScreen.html', title: 'Dummy Parent' },
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
      { path: 'DBUIWebComponentDummyScreen', title: 'Dummy' },
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
