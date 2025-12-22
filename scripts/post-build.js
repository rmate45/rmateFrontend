import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distPath = path.resolve(__dirname, '../dist');
const indexPath = path.join(distPath, 'index.html');
const templatePath = path.join(distPath, '_index.html');

// Rename index.html to _index.html so Vercel doesn't serve it directly
if (fs.existsSync(indexPath)) {
  fs.renameSync(indexPath, templatePath);
  console.log('✓ Renamed index.html to _index.html for prerendering');
}
