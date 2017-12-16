
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

document.querySelector('head').innerHTML += `
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
`;

loadAsset('link', 'https://fonts.googleapis.com/css?family=Roboto:400,100,‌​100italic,300,300ita‌​lic,400italic,500,50‌​0italic,700,700itali‌​c,900italic,900');
loadAsset('link', '../styleForScreens/styleForScreens.css');
loadAsset('script', 'js/iFrameHelpers.js');
loadAsset('link', '../../srcDemo/vendors/highlight/styles/atelier-heath-light.css');
loadAsset('script', '../../srcDemo/vendors/highlight/highlight.pack.js');

window.addEventListener('load', () => {
  // for highlight.js
  document.querySelectorAll('pre code.html').forEach((block) => {
    block.innerHTML =
      block.innerHTML
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
  });
  document.querySelectorAll('pre code').forEach((block) => {
    window.hljs && window.hljs.highlightBlock(block);
  });

  loadAsset('script', 'js/loadDBUWebComponentsDistLibAndDoCommonSetup.js');

  setTimeout(() => {
    document.querySelector('.demo-screen-loading').style.display = 'none';
    document.querySelector('.demo-screen').style.display = 'block';
  }, 500);
});
