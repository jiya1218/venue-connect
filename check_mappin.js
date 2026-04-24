const fs = require('fs');
const path = require('path');

function walk(dir) {
    let files = [];
    fs.readdirSync(dir).forEach(file => {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            files = files.concat(walk(fullPath));
        } else {
            files.push(fullPath);
        }
    });
    return files;
}

const srcFiles = walk('src').filter(f => f.endsWith('.tsx') || f.endsWith('.ts'));

srcFiles.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    if (content.includes('MapPin') && !content.includes('import') && !content.includes('MapPin =')) {
        // This is a rough check, let's refine
    }
    
    // Check if MapPin is used in JSX or as a variable
    const usesMapPin = /<MapPin\b/.test(content) || /\bMapPin\./.test(content) || /\bMapPin\s*,/.test(content) || /,\s*MapPin\b/.test(content);
    const importsMapPin = /import.*\{.*MapPin.*\}.*from.*['"]lucide-react['"]/.test(content.replace(/\n/g, ' '));
    
    if (usesMapPin && !importsMapPin) {
        console.log(`Potential issue in ${file}: uses MapPin but might be missing import`);
    }
});
