const fs = require('fs');
const appJs = fs.readFileSync('app.js', 'utf8');

// I will just use regex or extract the template strings from appJs
// However, the best way is to write the component by hand so I can wire up the React state correctly.
