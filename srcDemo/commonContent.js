
// ===================== Main  nav =============================

const mainNav = document.querySelector('.main-nav');
mainNav.innerHTML = `
<ul>
  <li>
    <a href="index.dev.html">index.dev.html</a>
  </li>
  <li>
    <a href="index.prod.html">index.prod.html</a>
  </li>
  <li>
    <a href="index.webcomponents.dev.html">index.webcomponents.dev.html</a>
  </li>
  <li>
    <a href="index.webcomponents.prod.html">index.webcomponents.prod.html</a>
  </li>
</ul>
`;

// ===================== WebComponents  links =============================

const isWebComponentScreen = window.location.pathname.includes('.webcomponents.');
if (isWebComponentScreen) {
  const isProd = window.location.pathname.includes('.prod.');
  const webcomponentsLinks = document.querySelector('.demo-links');
  const webcomponentsLinksData = {
    DBUWebComponentDummyParentScreen: 'dbu-web-component-dummy-parent',
    DBUWebComponentDummyScreen: 'dbu-web-component-dummy'
  };
  webcomponentsLinks.innerHTML = `
  <ul>${Object.keys(webcomponentsLinksData).map((entry) => {
    return `
    <li>
      <a href="srcDemo/screensWebComponents/${entry}.html?production=${isProd ? '1' : '0'}"
      target="iframe_demo">
        ${webcomponentsLinksData[entry]}
      </a>
    </li>
    `;
  }).join('\n')}
  </ul>`;
}

