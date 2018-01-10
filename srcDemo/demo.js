
'use strict';

/* eslint strict: 0 */

// ================================== constants ==============================

const screenLinksGen = [
  {
    title: 'General',
    links: [
      { path: 'General/LoadingDevBoxUIWebComponentsScreen.html', title: 'Loading DevBoxUI Web Components' },
    ]
  },
  {
    title: 'Web Components',
    links: [
      { path: 'WebComponents/DummyScreen.html', title: 'Dummy' },
      { path: 'WebComponents/DummyParentScreen.html', title: 'Dummy Parent' },
      { path: 'WebComponents/FormInputTextScreen.html', title: 'Form Input Text' },
    ]
  },
  {
    title: 'React Components',
    links: [
      { path: 'ReactComponents/DraggableScreen.html', title: 'Draggable' },
      { path: 'ReactComponents/FormInputNumberScreen.html', title: 'Form Input Number' },
      { path: 'ReactComponents/FormInputScreen.html', title: 'Form Input' },
      { path: 'ReactComponents/HelloScreen.html', title: 'Hello' },
      { path: 'ReactComponents/ListScreen.html', title: 'List' },
    ]
  },
  {
    title: 'Services',
    links: [
      { path: 'Services/LocaleServiceScreen.html', title: 'Locale Service' },
    ]
  },
  {
    title: 'Miscellaneous',
    links: [
      { path: 'Miscellaneous/WebComponentInReactScreen.html', title: 'Web Component in React' },
      { path: 'Miscellaneous/WebComponentInIframeScreen.html', title: 'Web Component in Iframe' },
    ]
  },
  {
    title: 'Debug',
    links: [
      { path: 'Debug/OnScreenConsoleScreen.html', title: 'On Screen Console' },
    ]
  },
];

const demoIFrame = document.querySelector('.demo-area iframe');
const demoLinks = document.querySelector('.demo-links');

// ================================== functions ==============================

function getWindowLocationHash() {
  return (
    window.location.hash ||
    screenLinksGen[0].links[0].path
  ).replace('#', '');
}

function hideScreenLinks() {
  document.querySelector('#links-toggle').checked = false;
}

function insertDemoLinks() {
  const windowLocationHash = getWindowLocationHash();
  const links = screenLinksGen.map((section) => {
    return `
<div>
  <div class="links-section-group">${section.title}</div>
  <ul>${
  section.links.map((link) => {
    const isActive = link.path === windowLocationHash ? 'x-active' : '';
    return `
    <li ${isActive}>
      <a href="${`#${link.path}`}">${link.title}</a>
    </li>
    `;
  }).join('\n')}
  </ul>
</div>`;
  }).join('\n');
  demoLinks.innerHTML += links;
}

function loadDemoScreen() {
  const isProd = !window.location.pathname.includes('.dev.');
  const windowLocationHash = getWindowLocationHash();
  const src = `srcDemo/screens/${windowLocationHash}?production=${isProd ? '1' : '0'}`;
  demoIFrame.src = src;
  demoIFrame.addEventListener('load', () => {
    hideScreenLinks();
  });

  const currentActiveLink = document.querySelector('.demo-links li[x-active]');
  currentActiveLink.removeAttribute('x-active');

  const nextActiveLink = document.querySelector(`.demo-links a[href="#${windowLocationHash}"]`);
  nextActiveLink.parentNode.setAttribute('x-active', '');
}

function toggleAppDir(evt) {
  evt.preventDefault();
  const documentElement = window.document.documentElement;
  const currentDir = documentElement.getAttribute('dir');
  const nextDir = currentDir === 'ltr' ? 'rtl' : 'ltr';
  documentElement.setAttribute('dir', nextDir);
  demoIFrame.contentWindow.postMessage(`changeDir ${nextDir}`, '*');
  hideScreenLinks();
}

// ================================== main ===============================

insertDemoLinks();
loadDemoScreen();

window.addEventListener('hashchange', loadDemoScreen);

document.querySelector('.locale-dir-switch a').addEventListener('click', toggleAppDir);
