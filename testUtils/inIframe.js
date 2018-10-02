
export default function inIframe({
  bodyHTML = '', headStyle = '', headScript = '', bodyScript = '', onLoad
}) {
  const iframe = document.createElement('iframe');
  iframe.style.width = '100%';
  iframe.style.height = '100%';
  iframe.scrolling = 'yes';
  iframe.src = ''; // !!! important for being able to tap on input elements
  iframe.addEventListener('load', (evt) => {
    const target = evt.target;
    target.contentWindow.document.write(`
      <html>
      <head>
        <style>
          ${headStyle}
        </style>
        <script>
          ${headScript}
        </script>
      </head>
      <body>
        ${bodyHTML}
      </body>
      <script>
        window.addEventListener('message', () => {
          // console.log('msg from window', msg);
          // window.parent.postMessage('world', '*');
        });
      </script>
      <script>
        ${bodyScript}
      </script>
      </html>
    `);
    onLoad({
      contentWindow: target.contentWindow,
      iframe
    });
  });
  document.querySelector('#testing').appendChild(iframe);
}
