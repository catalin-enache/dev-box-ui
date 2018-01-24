
const findings = {};

const processData = (data) => {
  const found = (data.split('node_modules/')[1] || '').split('/')[0];
  // if (found === 'dev-box-ui') { console.log(data); }
  if (found) {
    findings[found] !== undefined ? findings[found] += 1 : findings[found] = 1;
  }
};

process.stdin.on('data', (data) => {
  data.toString('utf8').split('\n').forEach((entry) => {
    entry && processData(entry);
  });
});

process.stdin.on('end', () => {
  const currentFindings = Object.keys(findings);
  console.log(`Found ${currentFindings.length} dependencies.`);
  currentFindings.sort().forEach((finding) => {
    console.log(` - ${finding} [${findings[finding]}]`);
  });
});
