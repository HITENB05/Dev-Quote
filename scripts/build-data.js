import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const snippetsDir = path.resolve(__dirname, '../data/snippets');
const outputFile = path.resolve(__dirname, '../data/snippets.json');

function buildRegistry() {
  if (!fs.existsSync(snippetsDir)) {
    console.error(`Directory not found: ${snippetsDir}`);
    process.exit(1);
  }

  const files = fs.readdirSync(snippetsDir).filter(file => file.endsWith('.json'));
  const snippets = [];

  for (const file of files) {
    const filePath = path.join(snippetsDir, file);
    try {
      const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      if (!content.id || !content.title || !content.code) {
        console.warn(`Skipping invalid snippet: ${file}`);
        continue;
      }
      snippets.push(content);
    } catch (err) {
      console.error(`Error reading ${file}:`, err.message);
    }
  }

  // Sort alphabetically by category, then title
  snippets.sort((a, b) => {
    if (a.category === b.category) {
      return a.title.localeCompare(b.title);
    }
    return a.category.localeCompare(b.category);
  });

  // Write to data/snippets.json
  fs.writeFileSync(outputFile, JSON.stringify(snippets, null, 2), 'utf-8');

  // Also write to public/data/snippets.json so Vite static copy includes it in dist/
  const publicDataDir = path.resolve(__dirname, '../public/data');
  if (!fs.existsSync(publicDataDir)) {
    fs.mkdirSync(publicDataDir, { recursive: true });
  }
  const publicOutputFile = path.join(publicDataDir, 'snippets.json');
  fs.writeFileSync(publicOutputFile, JSON.stringify(snippets, null, 2), 'utf-8');

  console.log(`Successfully compiled ${snippets.length} snippets into ${outputFile} and ${publicOutputFile}`);
}

buildRegistry();
