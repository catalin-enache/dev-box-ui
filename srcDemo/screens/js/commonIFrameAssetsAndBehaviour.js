
// Asset loader helper
function loadAsset(type, path, callback = () => {}) {
  const head = document.querySelector('head');
  const asset = document.createElement(type);
  if (type === 'link') {
    asset.href = path;
    asset.type = 'text/css';
    asset.rel = 'stylesheet';
  } else {
    asset.src = path;
  }
  asset.onload = () => {
    console.log('loaded asset', path);
    callback();
  };
  head.appendChild(asset);
}
window.loadAsset = loadAsset;

// Define common meta
document.querySelector('head').innerHTML += `
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
`;

// Load fonts.
loadAsset('link', 'https://fonts.googleapis.com/css?family=Roboto:400,100,‌​100italic,300,300ita‌​lic,400italic,500,50‌​0italic,700,700itali‌​c,900italic,900');
// Load our assets.
loadAsset('link', '../../styleForScreens/styleForScreens.css');
loadAsset('script', '../js/onWindowDefinedHelpers.js');
// Load highlight code lib.
loadAsset('link', '../../../srcDemo/vendors/highlight/styles/atelier-heath-light.css');
loadAsset('script', '../../../srcDemo/vendors/highlight/highlight.pack.js');

// Load web-components and trigger some hooks.
// The definition itself (along with style overriding) is controlled inside the page.
const isProd = window.location.search.includes('production=1');
loadAsset('script', `../../../build/dist/js/dev-box-ui-webcomponents${isProd ? '.min' : ''}.js`, () => {
  // Must be defined by user.
  window.onDBUWebComponentsDistLibLoaded && window.onDBUWebComponentsDistLibLoaded();
});

/* eslint wrap-iife: 0 */
(async function (callback) {
  const undefinedElements =
    [...document.querySelectorAll(':not(:defined)')]
      .map((element) => (element.localName));
  console.log(':not(:defined) web-components so far', undefinedElements);
  const promises = [...undefinedElements].map(elementLocalName => customElements.whenDefined(elementLocalName));
  await Promise.all(promises);
  callback();
})(() => {
  // Must be defined by user.
  window.onDBUWebComponentsDefined && window.onDBUWebComponentsDefined();
  console.log('all web-components defined');
});

// Stuff to do when everything is settled.
window.addEventListener('load', () => {
  window.makeTabs();
  window.highlightBlocks();
  // Hide loader and show page.
  setTimeout(() => {
    document.querySelector('.demo-screen-loading').style.display = 'none';
    document.querySelector('.demo-screen').style.display = 'block';
  }, 500);
});

// Handle main app messages.
window.onmessage = (msg) => {
  const [message, value] = msg.data.split(' ');
  if (message === 'changeDir') {
    const dir = value;
    window.document.documentElement.setAttribute('dir', dir);
  }
};

