
const isProd = window.location.search.includes('production=1');

window.loadAsset('script', `../../build/dist/js/dev-box-ui-webcomponents${isProd ? '.min' : ''}.js`, () => {
  // must be defined by user
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
  // must be defined by user
  window.onDBUWebComponentsDefined && window.onDBUWebComponentsDefined();
  console.log('all web-components defined');
});

window.onmessage = function (msg) {
  const [message, value] = msg.data.split(' ');
  if (message === 'changeDir') {
    const dir = value;
    window.document.documentElement.setAttribute('dir', dir);
  }
};

