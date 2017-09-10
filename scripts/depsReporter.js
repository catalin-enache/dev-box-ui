
const findings = new Set();

const processData = (data) => {
  const found = (data.split('node_modules/')[1] || '').split('/')[0];
  found && findings.add(found);
};

process.stdin.on('data', (data) => {
  data.toString('utf8').split('\n').forEach((entry) => {
    entry && processData(entry);
  });
});

process.stdin.on('end', () => {
  const currentFindings = Array.from(findings);
  console.log(`Found ${currentFindings.length} dependencies.`);
  currentFindings.sort().forEach((finding) => {
    console.log(` - ${finding}`);
  });
});
