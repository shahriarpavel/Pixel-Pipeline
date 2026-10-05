# PixelPipeline

> Turn game progress into publish-ready content.

PixelPipeline is a live browser app for indie game developers who want to share progress without stopping development to write marketing content. Add a commit, changelog, or gameplay attachment and PixelPipeline creates platform-ready update ideas for Discord, X/Twitter, and Steam.

The project is built as a single-page React experience with a dark cyberpunk visual style, animated terminal output, glassmorphism cards, a scrolling grid, scanlines, reveal-on-scroll effects, and a custom cursor trail.

## Working features

- Enter a game name and latest commit message.
- Use manual commit text without connecting any code host.
- Import the five latest commits from a public GitHub, GitLab, or Bitbucket repository and select one as the input.
- Load a local changelog or `git log` text file.
- Attach a gameplay image or video to the generated clip plan.
- Select Discord, X/Twitter, and Steam as target platforms.
- Generate a social caption, devlog draft, and 15-second clip direction.
- Copy the generated caption to the clipboard.
- Schedule generated updates into a browser-local queue.
- Persist the scheduled queue with `localStorage`.
- Export a generated content pack as a JSON file.
- View the existing animated landing-page sections and integration showcase.

The Pipeline Studio works fully in the browser without an account or API key. Public repository commits are read through the selected provider's public API; private repositories, real webhook ingestion, AI generation, GIF rendering, and publishing to external platforms still require a backend integration.

## Live demo

[Open PixelPipeline on GitHub Pages](https://shahriarpavel.github.io/Pixel-Pipeline/)

The live site is deployed automatically from the `main` branch through GitHub Actions. Visitors can use the manual workflow without signing in or configuring a server. Public Git provider imports require the provider's public API to be reachable from the browser.

Repository: [shahriarpavel/Pixel-Pipeline](https://github.com/shahriarpavel/Pixel-Pipeline)

## Tech stack

- React 19
- TypeScript
- Vite
- CSS
- ESLint
- Google Fonts: Inter and Space Mono

## Getting started

### Requirements

- Node.js 18 or newer
- npm

### Install dependencies

```bash
npm install
```

### Start the development server

```bash
npm run dev
```

Vite will print the local URL in the terminal, usually `http://localhost:5173`.

### Create a production build

```bash
npm run build
```

### Preview the production build

```bash
npm run preview
```

### Run linting

```bash
npm run lint
```

## Production build

The production build is generated in `dist/`:

```bash
npm run build
```

Only static front-end assets are produced. No secret API keys should be placed in this repository or in client-side code.

## Project structure

```text
.
├── index.html              # HTML entry point and page metadata
├── package.json            # Dependencies and npm scripts
├── vite.config.ts          # Vite configuration
├── eslint.config.js        # ESLint configuration
└── src/
    ├── App.tsx             # Main page composition
    ├── main.tsx            # React application entry point
    ├── index.css           # Theme, layout, component styles, and animations
    ├── assets/              # Pixel-art images used by the page
    ├── components/
    │   ├── Navbar.tsx
    │   ├── Hero.tsx
    │   ├── PipelineStudio.tsx # Interactive commit-to-content workflow
    │   ├── FeatureGrid.tsx
    │   ├── TechTerminal.tsx
    │   ├── IntegrationLogos.tsx
    │   ├── Footer.tsx
    │   └── CursorTrail.tsx
    └── hooks/
        └── useReveal.ts     # Scroll-based reveal animation hook
```

## How it works

`App.tsx` assembles the page sections and initializes the global reveal animation hook. `Hero.tsx` types a simulated diff log when the page loads. `PipelineStudio.tsx` owns the interactive workflow: it generates deterministic content from the entered commit, stores scheduled drafts in browser `localStorage`, copies captions, and downloads JSON exports. `TechTerminal.tsx` uses an `IntersectionObserver` so its terminal output appears as the visitor reaches that section.

## Connecting production services

The current Studio is intentionally backend-free. To make it production-ready, connect the generated payload to:

1. A Git provider webhook for receiving new commits.
2. An AI or template service for richer captions and devlogs.
3. A media worker for rendering gameplay clips or GIFs.
4. Discord, X/Twitter, Steam, or another publishing API.
5. A database and authenticated job queue for durable scheduling across devices.

## Customization

- Update the page title and metadata in `index.html`.
- Change colors, typography, spacing, and responsive behavior in `src/index.css`.
- Edit marketing copy and integration names inside the relevant component files.
- Replace the images in `src/assets/` to use a different pixel-art direction.
- Extend `PipelineStudio.tsx` when adding new platforms or content formats.

## License

No license has been specified for this project yet.
