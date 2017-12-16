function highlightBlock() {
  [...document.querySelectorAll('pre code')].forEach((block) => {
    window.hljs && window.hljs.highlightBlock(block);
  });
}

function toggleAppDir(evt) {
  evt.preventDefault();
  const documentElement = window.document.documentElement;
  const currentDir = documentElement.getAttribute('dir');
  const nextDir = currentDir === 'ltr' ? 'rtl' : 'ltr';
  documentElement.setAttribute('dir', nextDir);
}

export {
  highlightBlock,
  toggleAppDir
};
