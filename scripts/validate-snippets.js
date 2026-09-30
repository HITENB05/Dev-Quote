import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const snippetsDir = path.resolve(__dirname, '../data/snippets');
const allowedCategories = ['Git', 'Docker', 'Linux', 'JavaScript', 'CSS', 'SQL', 'Regex'];
const allowedLanguages = ['bash', 'javascript', 'typescript', 'css', 'sql', 'regex'];

// Regex matching common emojis
const emojiPattern = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;

function validate() {
  if (!fs.existsSync(snippetsDir)) {
    console.error(`Snippets directory not found: ${snippetsDir}`);
    process.exit(1);
  }

  const files = fs.readdirSync(snippetsDir).filter(f => f.endsWith('.json'));
  let hasErrors = false;

  console.log(`Validating ${files.length} snippet files...`);

  const seenIds = new Set();

  for (const file of files) {
    const fullPath = path.join(snippetsDir, file);
    let data;

    try {
      const raw = fs.readFileSync(fullPath, 'utf-8');
      
      // Strict Zero-Emoji Rule
      if (emojiPattern.test(raw)) {
        console.error(`[ERROR] ${file}: Contains emoji characters. Emojis are strictly prohibited in DevQuote.`);
        hasErrors = true;
      }

      data = JSON.parse(raw);
    } catch (err) {
      console.error(`[ERROR] ${file}: Invalid JSON syntax - ${err.message}`);
      hasErrors = true;
      continue;
    }

    // Required Fields
    const required = ['id', 'title', 'category', 'code', 'language', 'explanation'];
    for (const req of required) {
      if (!data[req] || typeof data[req] !== 'string' || data[req].trim() === '') {
        console.error(`[ERROR] ${file}: Missing or empty required field '${req}'`);
        hasErrors = true;
      }
    }

    // Check duplicate IDs
    if (data.id) {
      if (seenIds.has(data.id)) {
        console.error(`[ERROR] ${file}: Duplicate snippet ID '${data.id}'`);
        hasErrors = true;
      }
      seenIds.add(data.id);
    }

    // Filename should match ID
    const expectedFilename = `${data.id}.json`;
    if (file !== expectedFilename) {
      console.warn(`[WARN] ${file}: Filename should match id '${expectedFilename}'`);
    }

    // Category validation
    if (data.category && !allowedCategories.includes(data.category)) {
      console.error(`[ERROR] ${file}: Category '${data.category}' is not allowed. Allowed: ${allowedCategories.join(', ')}`);
      hasErrors = true;
    }

    // Language validation
    if (data.language && !allowedLanguages.includes(data.language.toLowerCase())) {
      console.error(`[ERROR] ${file}: Language '${data.language}' is not allowed. Allowed: ${allowedLanguages.join(', ')}`);
      hasErrors = true;
    }
  }

  if (hasErrors) {
    console.error('\nSnippet validation failed. Please fix the errors listed above.');
    process.exit(1);
  } else {
    console.log(`\nAll ${files.length} snippets passed validation successfully.`);
  }
}

validate();
