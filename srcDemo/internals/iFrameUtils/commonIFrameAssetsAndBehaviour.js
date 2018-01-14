
// expose React used in iFrame to React Developer Tools
// https://github.com/facebook/react-devtools/issues/57
window.__REACT_DEVTOOLS_GLOBAL_HOOK__ = window.parent.__REACT_DEVTOOLS_GLOBAL_HOOK__;

(function () {
  const isEmbeded = (window.top !== window);
  const href = decodeURIComponent(window.location.href);
  const rootUrl = 'srcDemo/screens/';
  const originSubPath =
    window.location.origin.includes('catalin-enache.github.io') ?
      '/dev-box-ui' :
      '';
  if (!isEmbeded) {
    const screen = href.split('?')[0].substr(href.indexOf(rootUrl) + rootUrl.length);
    window.location.replace(`${window.location.origin}${originSubPath}?screen=${screen}`);
  }
})();


function toggleAppDir(evt) {
  evt.preventDefault();
  const documentElement = window.document.documentElement;
  const currentDir = documentElement.getAttribute('dir');
  const nextDir = currentDir === 'ltr' ? 'rtl' : 'ltr';
  documentElement.setAttribute('dir', nextDir);
}

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
loadAsset('script', '../../internals/iFrameUtils/onWindowDefinedHelpers.js');
// Load highlight code lib.
// https://highlightjs.org/static/demo/
loadAsset('link', '../../vendors/highlight/styles/atelier-heath-light.css');
loadAsset('script', '../../vendors/highlight/highlight.pack.js');

// Load web-components and trigger some hooks.
// The definition itself (along with style overriding) is controlled inside the page.
const isProd = window.location.search.includes('production=1');
loadAsset('script', `../../../build/dist/js/dev-box-ui-web-components${isProd ? '.min' : ''}.js`, () => {
  // Must be defined by user.
  window.onDBUIWebComponentsDistLibLoaded && window.onDBUIWebComponentsDistLibLoaded();

  // load vendors, react components, babel and execute babel scripts (ex: demoing react components)
  // https://raw.githubusercontent.com/reactjs/reactjs.org/master/static/html/single-file-example.html
  loadAsset('script', `../../../vendors/js/vendors-react${isProd ? '.min' : ''}.js`, () => {
    loadAsset('script', `../../../build/dist/js/dev-box-ui-react-components-no-deps${isProd ? '.min' : ''}.js`, () => {
      // https://unpkg.com/babel-standalone@6.26.0/babel.min.js
      loadAsset('script', '../../vendors/babel-standalone.6.26.0.min.js', () => {
        const babelScripts = document.querySelectorAll('script[type="text/babel"]');
        babelScripts.forEach((babelScript) => {
          const output = window.Babel.transform(babelScript.innerHTML, { presets: ['react'] }).code;
          const script = document.createElement('script');
          script.type = 'text/javascript';
          script.innerHTML = output;
          document.querySelector('head').appendChild(script);
        });
        console.log('executed babel scripts');
        // window.dispatchEvent(new Event('runBabel'));
      });
    });
  });
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
  window.onDBUIWebComponentsDefined && window.onDBUIWebComponentsDefined();
  console.log('all web-components defined');
});

// Stuff to do when everything is settled.
window.addEventListener('load', () => {
  window.makeTabs();
  window.highlightBlocks();
  // Hide loader and show page.
  setTimeout(() => {
    document.querySelector('.locale-dir-switch a').addEventListener('click', toggleAppDir);
    document.querySelector('.demo-screen-loading').style.display = 'none';
    document.querySelector('.demo-screen').style.display = 'block';
    console.log('revealing body');
  }, 0);
});
