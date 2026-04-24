const fs = require('fs');
const path = require('path');

function walk(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    if (fs.statSync(dirPath).isDirectory()) {
      if (f !== 'node_modules' && f !== '.next' && f !== 'dist') {
        walk(dirPath, callback);
      }
    } else {
      callback(path.join(dir, f));
    }
  });
}

const badFiles = [];

walk('src', (filePath) => {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
    const content = fs.readFileSync(filePath, 'utf8');
    const usageMatch = content.match(/<MapPin/);
    if (usageMatch) {
      const importMatch = content.match(/import\s+{[^}]*MapPin[^}]*}\s+from\s+['"]lucide-react['"]/s);
      if (!importMatch) {
        badFiles.push(filePath);
      }
    }
  }
});

if (badFiles.length > 0) {
  console.log('BAD FILES FOUND:');
  badFiles.forEach(f => console.log(f));
} else {
  console.log('ALL FILES OK');
}
