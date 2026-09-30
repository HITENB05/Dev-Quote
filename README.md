<div align="center">

# DevQuote

**A curated, high-performance developer cheat sheet wall with interactive 3D flippable reference cards.**

Git, Docker, Linux, JavaScript, CSS, SQL, and Regex snippets. Searchable, copyable, and explained in seconds.

[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)
[![Node](https://img.shields.io/badge/node-%3E%3D18-339933.svg)](https://nodejs.org/)
[![Built with Vite](https://img.shields.io/badge/built%20with-Vite-646CFF.svg)](https://vitejs.dev/)
[![Open Source](https://img.shields.io/badge/open%20source-yes-orange.svg)](https://github.com/<your-username>/DevQuote)

[Live Demo](https://<your-username>.github.io/DevQuote) | [Report a Bug](https://github.com/<your-username>/DevQuote/issues/new?labels=bug) | [Request a Snippet](https://github.com/<your-username>/DevQuote/issues/new?labels=snippet-request) | [Contribute](CONTRIBUTING.md)

</div>

---

<!-- Add a screenshot or GIF of the card wall here -->
<!-- ![DevQuote screenshot](docs/screenshot.png) -->

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Quickstart](#quickstart)
- [Available Scripts](#available-scripts)
- [Repository Structure](#repository-structure)
- [Snippet Format](#snippet-format)
- [Contributing](#contributing)
- [Keyboard Shortcuts](#keyboard-shortcuts)
- [Roadmap](#roadmap)
- [License](#license)

## Overview

DevQuote is built for quick syntax recall and deep technical comprehension. Instead of endlessly browsing forum threads or bloated documentation pages, you can search, copy, and inspect battle-tested one-liners and utility patterns in seconds.

Design principles:

- **Fast.** No framework, no runtime overhead. Vanilla HTML, CSS, and ES modules.
- **Focused.** Every snippet answers three questions: what does it do, why does it work, and what can go wrong.
- **Clean.** An obsidian dark theme, strict zero-emoji policy, and developer-first ergonomics.
- **Open.** Every snippet is an independent, validated JSON file that anyone can improve through a pull request.

## Features

### 3D Flippable Cards

| Face | Contents |
| --- | --- |
| **Front** | Domain badge, clean title, syntax box with prompt prefix, tag pills, and a one-click copy button |
| **Back** | Technical explanation, a "Caution" best-practices callout, alternative flags and variations table, and contributor credit |

### Instant Search and Filtering

- Global shortcut (`Ctrl+K` / `Cmd+K` or `/`) that indexes commands, titles, explanations, and tags
- Category tabs with real-time snippet counters
- Popular tag filter pills with multi-selection support
- Sorting by Featured, Title (A-Z), and Category

### Local Bookmarking

Star frequently used commands. Bookmarks persist in `localStorage`, so no account or backend is needed.

### Strict Zero-Emoji Aesthetics

A clean, professional UI built with minimalist geometric SVG icons and high-legibility typography (Inter and JetBrains Mono). The validator enforces this rule on every snippet.

### Modular Contribution Engine

Each snippet lives as an independent JSON file in `data/snippets/`. A schema validator and a build script keep the registry consistent, so contributions are easy to review and hard to break.

## Tech Stack

| Layer | Technology |
| --- | --- |
| Core | Vanilla HTML5, modern CSS3 (variables, Grid, 3D transforms), ES6 modules |
| Tooling | [Vite](https://vitejs.dev/) 8.x |
| Build utilities | Node.js snippet compiler (`scripts/build-data.js`) and schema validator (`scripts/validate-snippets.js`) |
| Typography | Inter, JetBrains Mono |

## Quickstart

### Prerequisites

- Node.js 18.0 or higher
- npm 9.0 or higher

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/<your-username>/DevQuote.git
cd DevQuote

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Production Build

```bash
npm run build     # outputs optimized static assets to dist/
npm run preview   # serves the production build locally
```

The output in `dist/` is fully static and can be hosted anywhere: GitHub Pages, Netlify, Vercel, Cloudflare Pages, or any static file server.

## Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Starts the local Vite development server with hot module reload |
| `npm run build` | Compiles optimized static assets into `dist/` |
| `npm run preview` | Previews the production build locally |
| `npm run build:data` | Aggregates individual JSON files from `data/snippets/` into `data/snippets.json` |
| `npm run test:snippets` | Validates all snippet JSON files against schema rules and zero-emoji compliance |

## Repository Structure

```text
DevQuote/
├── index.html                   # Semantic markup and SEO metadata
├── package.json                 # Project configuration and build scripts
├── README.md                    # Project documentation
├── CONTRIBUTING.md              # Open source contributor instructions
├── contribution.md              # Contributor reference
├── scripts/
│   ├── build-data.js            # Compiles modular snippet files into data/snippets.json
│   └── validate-snippets.js     # Schema validation and zero-emoji verification
├── data/
│   ├── snippets.json            # Aggregated master snippet registry
│   └── snippets/                # Individual community-contributed JSON files
│       ├── git-undo-last-commit.json
│       ├── docker-prune-system.json
│       ├── linux-find-large-files.json
│       ├── js-deep-clone-native.json
│       ├── css-modern-fluid-clamp.json
│       ├── sql-upsert-record.json
│       └── regex-extract-https-urls.json
├── css/
│   ├── variables.css            # Design tokens and obsidian palette
│   ├── base.css                 # Base resets, typography, and scrollbars
│   ├── styles.css               # Central stylesheet entry point
│   └── components/
│       ├── header.css           # Navigation bar, brand badge, and status pill
│       ├── search.css           # Search input, category tabs, and tag bar
│       ├── card.css             # 3D flippable card architecture and syntax box
│       └── toast.css            # Minimal copy notification toast
└── js/
    ├── app.js                   # Application bootstrap and keyboard shortcuts
    ├── icons.js                 # Minimal geometric SVG icon library (zero emojis)
    ├── state.js                 # Filter, bookmarks, and card flip state
    ├── cardRenderer.js          # 3D card DOM renderer and flip handlers
    ├── searchFilter.js          # Multi-factor search and tag engine
    └── clipboard.js             # Clipboard copy with toast notification
```

## Snippet Format

Every snippet is a standalone JSON file in `data/snippets/`, named `<category>-<short-description>.json` (for example, `git-undo-last-commit.json`).

The example below is illustrative. The authoritative schema and validation rules live in [CONTRIBUTING.md](CONTRIBUTING.md).

```json
{
  "id": "git-undo-last-commit",
  "category": "Git",
  "title": "Undo the last commit, keep changes staged",
  "command": "git reset --soft HEAD~1",
  "tags": ["git", "undo", "commit"],
  "explanation": "Moves the branch pointer back one commit while leaving your working tree and index untouched.",
  "caution": "Do not rewrite history that has already been pushed to a shared branch.",
  "variations": [
    { "syntax": "git reset --mixed HEAD~1", "description": "Unstage the changes as well" },
    { "syntax": "git reset --hard HEAD~1", "description": "Discard the changes entirely" }
  ],
  "author": "your-github-handle"
}
```

## Contributing

DevQuote is open source and community driven. Because the project is maintained through version control, **all contributions are submitted as code via GitHub Pull Requests**. Direct web submissions are not used.

Quick contribution flow:

1. Fork the repository and create a branch: `git checkout -b snippet/docker-remove-dangling`
2. Add a new JSON file to `data/snippets/`
3. Validate it: `npm run test:snippets`
4. Rebuild the registry: `npm run build:data`
5. Commit, push, and open a Pull Request

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for the full JSON schema, validation requirements, and PR checklist.

### Good first contributions

- Add a snippet for a command you look up repeatedly
- Improve an existing explanation or add a missing "Caution" note
- Add alternative flags and variations to existing cards
- Fix typos or improve accessibility of the UI
- Add a new category (open an issue first to discuss)

### Contribution rules at a glance

- One snippet per file
- Snippets must pass `npm run test:snippets`
- No emojis anywhere in snippet content
- Commands should be correct, safe by default, and tested
- Explanations should be concise and technically accurate

## Keyboard Shortcuts

| Shortcut | Action |
| --- | --- |
| `Ctrl+K` / `Cmd+K` | Focus the global search |
| `/` | Focus the global search |
| `Esc` | Clear search and blur the input |

## Roadmap

- [ ] More categories (Python, Kubernetes, Bash, TypeScript)
- [ ] Shareable deep links to individual cards
- [ ] Export bookmarked snippets
- [ ] Light theme option
- [ ] Offline support via service worker
- [ ] Keyboard-only card navigation

Have an idea? [Open an issue](https://github.com/<your-username>/DevQuote/issues) and let's discuss it.

## Community

- **Questions and ideas:** use GitHub Issues or Discussions
- **Found a wrong or dangerous command?** Please open an issue right away
- **Enjoying DevQuote?** Give the repo a star and share it with a teammate

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

<div align="center">

Built by developers, for developers.

</div>
