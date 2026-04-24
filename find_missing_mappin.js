const fs = require('fs');
const path = require('path');

function walk(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ?
      walk(dirPath, callback) : callback(path.join(dir, f));
  });
};

const results = [];

walk('src', (filePath) => {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
    const content = fs.readFileSync(filePath, 'utf8');
    const hasUsage = content.includes('<MapPin');
    const hasImport = content.includes('import {') && content.includes('MapPin');
    const hasMultiLineImport = content.includes('MapPin') && /import\s+{[^}]*MapPin[^}]*}\s+from\s+['"]lucide-react['"]/s.test(content);
    
    if (hasUsage && !hasImport && !hasMultiLineImport) {
      results.push(filePath);
    }
  }
});

if (results.length > 0) {
  console.log('Files with MapPin usage but no import:');
  results.forEach(f => console.log(f));
} else {
  console.log('No files found with missing MapPin imports.');
}
