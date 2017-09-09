const glob = require('glob');
const fs = require('fs');
const path = require('path');

glob(path.join(__dirname, '/../src/**/*.spec.js'), {}, (err, files) => {
  const data = files.reduce((acc, file) => {
    return `${acc}require('${file}');\n`;
  }, '');
  fs.writeFileSync(path.join(__dirname, '/tests.js'), data, { flag: 'w' });
});
