
// ===================== Main  nav =============================

const mainNav = document.querySelector('.main-nav');
mainNav.innerHTML = `
<ul>
  <li>
    React Components (<a href="index.dev.html">Dev</a> | <a href="index.prod.html">Prod</a>)
  </li>
  <li>
    Web Components (<a href="index.webcomponents.dev.html">Dev</a> | <a href="index.webcomponents.prod.html">Prod</a>)
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

