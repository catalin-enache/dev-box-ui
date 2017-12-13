const isProd = window.location.search.includes('production=1');
const script = document.createElement('script');

script.onload = function () {
  window.onDBUWebComponentsDistLibLoaded();
};

script.src = `../../build/dist/js/dev-box-ui-webcomponents${isProd ? '.min' : ''}.js`;
document.querySelector('head').appendChild(script);

/* eslint wrap-iife: 0 */
(async function (callback) {
  const undefinedElements =
    [...document.querySelectorAll(':not(:defined)')]
      .map((element) => (element.localName));
  console.log(':not(:defined) elements so far', undefinedElements);
  const promises = [...undefinedElements].map(elementLocalName => customElements.whenDefined(elementLocalName));
  await Promise.all(promises);
  callback();
})(() => {
  window.onDBUWebComponentsDefined();
});

window.onmessage = function (msg) {
  const [message, value] = msg.data.split(' ');
  if (message === 'changeDir') {
    const dir = value;
    window.document.documentElement.setAttribute('dir', dir);
  }
};
