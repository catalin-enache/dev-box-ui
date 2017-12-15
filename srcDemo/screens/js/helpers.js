window.generateComponentPropertiesTable = function (data, selector = '.properties') {
  const propertiesContainer = document.querySelector(selector);
  const names = Object.keys(data);
  const table = `
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
              <td class="prop-default">${data[name].default}</td>
              <td class="prop-description">${data[name].description}</td>
            </tr>`;
  }).join('')
}</tbody>
</table>
    `;

  propertiesContainer.innerHTML = table;
};
