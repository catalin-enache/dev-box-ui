window.generateComponentPropertiesTable = function (data, selector = '.properties') {
  const propertiesContainer = document.querySelector(selector);
  const names = Object.keys(data);
  const table = `
<h3 class="section">Properties</h3>
<table>
<thead>
  <th class="prop-name">Name</th>
  <th class="prop-type">Type</th>
  <th class="prop-default">Default</th>
  <th class="prop-description">Description</th>
</thead>
<tbody>${
  names.map((name) => {
    return `<tr>
              <td class="prop-name">${name}</td>
              <td class="prop-type">${data[name].type}</td>
              <td class="prop-default"><pre>${data[name].default}</pre></td>
              <td class="prop-description">${data[name].description}</td>
            </tr>`;
  }).join('')
}</tbody>
</table>
    `;

  propertiesContainer.innerHTML = table;
};

window.highlightBlocks = function () {
  document.querySelectorAll('pre code.html').forEach((block) => {
    // if not already escaped (in which case contains '&lt;') (React string scenario)
    if (!block.innerHTML.includes('&lt;')) {
      block.innerHTML =
      block.innerHTML
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    }
  });
  document.querySelectorAll('pre code').forEach((block) => {
    window.hljs && window.hljs.highlightBlock(block);
  });
};

