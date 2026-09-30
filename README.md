# DevQuote

A curated, high-performance developer cheat sheet wall featuring interactive 3D flippable reference cards for Git, Docker, Linux, JavaScript, CSS, SQL, and Regex snippets.

Built with an **obsidian dark theme**, **zero emojis**, and **developer-focused ergonomics**.

---

## Overview

DevQuote is designed for quick syntax recall and deep technical comprehension. Rather than endlessly browsing forum threads or bloated documentation pages, developers can search, copy, and inspect battle-tested one-liners and utility patterns in seconds.

### Key Capabilities

- **3D Perspective Flippable Cards**:
  - **Front Face**: Domain badge, clean title, syntax box with prompt prefix, tag pills, and 1-click copy button.
  - **Back Face**: Technical explanation, "Caution" best practices callout box, alternative flags and variation syntax table, and contributor credit.
- **Strict Zero-Emoji Aesthetics**: Clean, professional UI using minimalist geometric SVG icons and high-legibility typography (Inter and JetBrains Mono).
- **Instant Search & Filtering**:
  - Global shortcut (`Ctrl+K` / `Cmd+K` or `/`) indexing commands, titles, explanations, and tags.
  - Category tabs with real-time snippet counters.
  - Popular tag filter pills with multi-selection support.
  - Sorting by Featured, Title (A-Z), and Category.
- **Local Bookmarking**: Star your frequently accessed commands; bookmarks persist in `localStorage`.
- **Modular Contribution Engine**: Each snippet lives as an independent, validated JSON file in `data/snippets/`. Contributions are made directly through code via GitHub Pull Requests.

---

## Tech Stack

- **Core**: Vanilla HTML5, Modern CSS3 (CSS Variables, Grid, 3D Transforms), ES6 JavaScript Modules
- **Development Tooling**: Vite 8.x
- **Build Utilities**: Node.js snippet compiler (`scripts/build-data.js`) and schema validator (`scripts/validate-snippets.js`)

---

## Quickstart

### Prerequisites

- Node.js 18.0 or higher
- npm 9.0 or higher

### Installation & Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/<your-username>/DevQuote.git
   cd DevQuote
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the local development server:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173/` in your browser.

---

## Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts local Vite development server with hot module reload |
| `npm run build` | Compiles optimized static assets into `dist/` |
| `npm run preview` | Previews production build locally |
| `npm run build:data` | Aggregates individual JSON files from `data/snippets/` into `data/snippets.json` |
| `npm run test:snippets` | Validates all snippet JSON files against schema rules and zero-emoji compliance |

---

## Repository Structure

```
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

---

## Contributing via Code

We welcome contributions from the developer community. Because DevQuote is maintained via version control, all contributions must be submitted as code via GitHub Pull Requests (direct web submissions are not used).

Please read [CONTRIBUTING.md](./CONTRIBUTING.md) for the JSON schema specification, validation requirements, and PR workflow.

---

## License

This project is licensed under the [MIT License](./LICENSE) - see the LICENSE file for details.
