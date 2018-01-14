
'use strict';

/* eslint strict: 0 */

// ================================== constants ==============================

const demoIFrame = document.querySelector('.demo-area iframe');
const demoLinksContainer = document.querySelector('.demo-links');
const rootUrl = 'srcDemo/screens/';
const originSubPath =
  window.location.origin.includes('catalin-enache.github.io') ?
    '/dev-box-ui' :
    '';

// ================================== functions ==============================

// used in detecting active link and in loading current screen
function getCurrentScreen() {
  const currentScreen = window.location.search.replace('?screen=', '');
  return decodeURIComponent(currentScreen);
}

// used by history.pushState and location.replace
function getNextScreen(href) {
  const cleanHref = href.substr(href.indexOf(rootUrl) + rootUrl.length);
  const baseUrl = window.location.origin + window.location.pathname;
  const nextLocation = `${baseUrl}?screen=${cleanHref}`;
  return nextLocation;
}

function hideScreenLinks() {
  document.querySelector('#links-toggle').checked = false;
}

function upgradeDemoLinks() {
  const currentScreen = getCurrentScreen();
  const links = demoLinksContainer.querySelectorAll('a');

  links.forEach((link) => {
    link.addEventListener('click', (evt) => {
      evt.preventDefault();
      const nextScreen = getNextScreen(evt.target.href);

      window.history.pushState({}, '', nextScreen);
      loadDemoScreen();
    });
  });

  console.log('upgradeDemoLinks', { currentScreen });

  const nextActiveLink = demoLinksContainer.querySelector(`a[href="${rootUrl}${currentScreen}"]`);
  nextActiveLink && nextActiveLink.parentNode.setAttribute('x-active', '');

}

function loadDemoScreen() {
  const isProd = !window.location.pathname.includes('.dev.');
  const currentScreen = getCurrentScreen();
  const src = `${window.location.origin}${originSubPath}/${rootUrl}${currentScreen}?production=${isProd ? '1' : '0'}`;

  console.log('loadDemoScreen', { src });
  demoIFrame.contentWindow.location.replace(src);

  const currentActiveLink = demoLinksContainer.querySelector('li[x-active]');
  currentActiveLink && currentActiveLink.removeAttribute('x-active');

  const nextActiveLink = demoLinksContainer.querySelector(`a[href="${rootUrl}${currentScreen}"]`);
  nextActiveLink && nextActiveLink.parentNode.setAttribute('x-active', '');
}

// ================================== main ===============================

function main() {
  if (!getCurrentScreen()) {
    const firstAvailableHref = demoLinksContainer.querySelector('a').href;
    const nextScreen = getNextScreen(firstAvailableHref);
    window.location.replace(nextScreen);
  }

  demoIFrame.addEventListener('load', hideScreenLinks);
  window.addEventListener('popstate', loadDemoScreen);

  upgradeDemoLinks();
  loadDemoScreen();
}

main();
