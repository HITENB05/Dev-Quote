# Contributing to DevQuote

Thank you for your interest in contributing to DevQuote. DevQuote is an open-source developer cheat sheet wall engineered for high signal-to-noise ratio, instant command recall, and clean technical aesthetics.

All contributions to DevQuote are made directly via code and GitHub Pull Requests.

---

## Code of Guidelines & Standards

1. **Zero-Emoji Policy**: Emojis are strictly prohibited in code, titles, explanations, caveats, and pull requests. Maintain a clean, professional engineering tone.
2. **High Signal Value**: Avoid trivial commands (e.g. `ls`, `cd`). Focus on time-saving one-liners, non-obvious flags, disaster recovery recipes, or modern standard replacements for deprecated workflows.
3. **Safety & Caveats**: If a command rewrites history, purges disk space, kills processes, or incurs breaking changes, a clear `caveat` explanation is mandatory.
4. **Author Credit**: Add your GitHub username in the author block so you are credited on the back of the card.

---

## How to Add a Snippet (Step-by-Step)

### 1. Fork & Clone Repository

```bash
git clone https://github.com/<your-username>/DevQuote.git
cd DevQuote
npm install
```

### 2. Create a Feature Branch

```bash
git checkout -b snippet/<category>-<brief-slug>
# Example: git checkout -b snippet/git-clean-branches
```

### 3. Add Snippet JSON File

Create a new file in `data/snippets/` named `<id>.json`. The filename must match the `id` field exactly:

```
data/snippets/git-squash-commits.json
```

### 4. JSON Schema Specification

Every snippet file must adhere to this JSON format:

```json
{
  "id": "git-squash-commits",
  "title": "Interactive Squash of Last N Commits",
  "category": "Git",
  "tags": ["git", "rebase", "squash", "clean-history", "pr"],
  "code": "git rebase -i HEAD~4",
  "language": "bash",
  "explanation": "Opens an interactive editor allowing you to combine the last 4 commits into a single cohesive commit. Replace 'pick' with 'squash' (or 's') on secondary commits to merge them into the previous commit.",
  "caveat": "Never rebase commits that have already been pushed to a shared production or protected branch, as this rewrites public Git commit hashes.",
  "variations": [
    { "label": "Auto-squash fixups", "code": "git rebase -i --autosquash HEAD~4" },
    { "label": "Abort in-progress rebase", "code": "git rebase --abort" }
  ],
  "author": {
    "name": "Your Name",
    "github": "your-github-handle"
  }
}
```

#### Field Reference:
- `id` *(string, required)*: Unique kebab-case identifier matching filename.
- `title` *(string, required)*: Concise, clear summary of what the snippet accomplishes.
- `category` *(string, required)*: One of `Git`, `Docker`, `Linux`, `JavaScript`, `CSS`, `SQL`, or `Regex`.
- `tags` *(array of strings, required)*: 3–6 lowercase search tags.
- `code` *(string, required)*: The exact executable command or code block.
- `language` *(string, required)*: `bash`, `javascript`, `typescript`, `css`, `sql`, or `regex`.
- `explanation` *(string, required)*: 1–3 sentences explaining how it works and when to use it.
- `caveat` *(string, optional/recommended)*: Crucial warnings, destructive behavior notes, or browser compatibility nuances.
- `variations` *(array of objects, optional)*: Related flags, dry-run variations, or platform-specific equivalents.
- `author` *(object, optional)*: `{ "name": "Name", "github": "username" }`.

---

## 5. Compile and Validate Registry

After adding or modifying snippet files, run the build script to compile the master registry:

```bash
# Compile data/snippets.json
npm run build:data

# Validate schema and ensure zero emojis
npm run test:snippets
```

---

## 6. Submit Pull Request

1. Commit your changes:
   ```bash
   git add data/snippets/your-snippet-id.json data/snippets.json
   git commit -m "feat(snippets): add <snippet-title>"
   ```
2. Push to your fork:
   ```bash
   git push origin snippet/<category>-<brief-slug>
   ```
3. Open a Pull Request against the `main` branch. Provide a brief description of why the snippet is valuable to developers.
