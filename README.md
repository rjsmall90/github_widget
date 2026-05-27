# GitHub Widget

An embeddable micro-frontend that renders a GitHub user's profile stats — pinned repositories, contribution heatmap, and language breakdown — as a self-contained React component consumable by any host application via Module Federation.

---

**Live demo:** [github-widget-one.vercel.app](https://github-widget-one.vercel.app/)

## Blog

> https://medium.com/@rjsmall90/2f1a7bc73591

---

## Architecture Overview

```
github_widget/
├── src/
│   ├── components/
│   │   ├── GithubWidget.tsx      # Root widget container
│   │   ├── PinnedRepos.tsx       # Pinned repository cards
│   │   ├── ContributionGraph.tsx # GitHub-style activity heatmap
│   │   ├── LanguageBar.tsx       # Stacked language distribution bar
│   │   └── StatBadge.tsx         # Reusable stat pill
│   ├── hooks/
│   │   └── useGithubData.ts      # Data fetching + in-memory cache
│   ├── services/
│   │   └── github.ts             # GitHub GraphQL API client
│   ├── types/
│   │   └── github.ts             # TypeScript interfaces
│   └── styles/
│       └── widget.css            # Namespaced CSS (gw- prefix)
├── vite.config.ts                # Module Federation configuration
└── vercel.json                   # Deployment configuration
```

### Data Flow

```
GithubWidget (username prop)
  └── useGithubData hook
        ├── checks in-memory cache (5-min TTL)
        └── fetchGithubData service
              └── GitHub GraphQL API (single query)
                    ├── User profile
                    ├── Pinned repositories (up to 6)
                    ├── Contribution calendar (52 weeks)
                    └── Repository languages (top 100 repos → top 6 languages)
```

---

## Key Design Decisions

### Micro-Frontend via Module Federation

The widget is exposed as a remote module using [`@originjs/vite-plugin-federation`](https://github.com/originjs/vite-plugin-federation). This means any host application can lazy-load the widget at runtime without bundling it directly:

```js
// Host app vite config
remotes: {
  githubWidget: "https://github-widget-one.vercel.app/remoteEntry.js"
}

// Host app component
const GithubWidget = React.lazy(() => import("githubWidget/Widget"));
```

`react` and `react-dom` are declared as shared dependencies so the host and widget negotiate a single shared instance rather than shipping two copies.

**Why not an npm package?** Module Federation allows the widget to be updated and redeployed independently — consumers always get the latest version without reinstalling a package.

### GraphQL over REST

A single GraphQL query fetches the user profile, pinned repos, contribution calendar, and language stats all in one round trip. The GitHub REST API would have required at minimum four separate requests to assemble the same data.

### Client-Side In-Memory Cache

`useGithubData` maintains a module-level `Map` with a 5-minute TTL keyed on `username:token`. This prevents redundant API calls when the widget remounts (e.g. during route changes in a host app) without introducing a state management library dependency.

### CSS Namespacing

All class names are prefixed with `gw-` and scoped under a `.gw-root` container. Because the widget runs inside a host application's DOM, global styles or CSS resets in the host could bleed in and break the widget's layout. The prefix is a lightweight alternative to Shadow DOM or CSS Modules.

### No External UI Libraries

The widget intentionally uses only React and vanilla CSS. Pulling in a component library would bloat the bundle and risk version conflicts with whatever the host application already uses.

### `minify: false` and `cssCodeSplit: false`

Module Federation with Vite requires these settings. Minification can break the inter-module imports that the federation runtime relies on, and CSS code splitting produces chunks that the remote entry cannot reliably reference from a foreign host.

---

## Deployment & Known Issues

The widget is deployed on Vercel at `https://github-widget-one.vercel.app/`. Because Module Federation is a runtime bundling technique, deployment introduced a few non-obvious challenges:

- **Hardcoded `base` URL** — Vite's `base` option must point to the exact deployed origin so the remote entry can resolve its own chunk URLs. This means an environment-specific URL is baked into the config, which complicates running under a different domain without a rebuild.
- **`framework: null` in `vercel.json`** — Vercel auto-detects frameworks and applies transformations that conflict with the raw Vite federation output. Disabling framework detection was necessary to get `remoteEntry.js` served correctly.
- **CORS & token exposure** — Because this is purely client-side, the GitHub PAT ships as a `VITE_` environment variable and is therefore visible in the browser. Acceptable for a personal/portfolio widget, but a proxy layer would be needed for anything requiring token confidentiality.

> Full details on the deployment journey are covered in the Medium post linked above.

---

## Replication Steps

### Prerequisites

- Node.js 18+
- A GitHub Personal Access Token with `read:user` and `repo` scopes

### 1. Clone and install

```bash
git clone https://github.com/<your-username>/github_widget.git
cd github_widget
npm install
```

### 2. Configure environment variables

Create a `.env` file in the project root:

```env
VITE_GITHUB_GRAPHQL_TOKEN=ghp_your_token_here
VITE_GITHUB_GRAPHQL_ENDPOINT=https://api.github.com/graphql
```

### 3. Run locally

```bash
npm run dev
```

The widget dev server starts at `http://localhost:5173`. Open `index.html` to see the widget rendered standalone.

### 4. Build

```bash
npm run build
```

Output goes to `dist/`. The key artifact is `dist/remoteEntry.js` — this is the Module Federation entry point that host applications reference.

### 5. Deploy to Vercel

```bash
npm install -g vercel
vercel
```

Or connect the repo in the Vercel dashboard. The `vercel.json` at the root handles build configuration. After deploying, update the `base` URL in `vite.config.ts` to match your Vercel deployment URL, then redeploy:

```ts
// vite.config.ts
base: "https://your-deployment.vercel.app/",
```

### 6. Consume the widget in a host app

Add the remote in your host application's Vite config:

```ts
// host/vite.config.ts
import federation from "@originjs/vite-plugin-federation";

federation({
  remotes: {
    githubWidget: "https://your-deployment.vercel.app/remoteEntry.js",
  },
  shared: ["react", "react-dom"],
});
```

Then use it in a component:

```tsx
import GithubWidget from "githubWidget/Widget";

export default function App() {
  return <GithubWidget username="your-github-username" />;
}
```

---

## Environment Variables Reference

| Variable | Required | Description |
|---|---|---|
| `VITE_GITHUB_GRAPHQL_TOKEN` | Yes | GitHub PAT with `read:user` and `repo` scopes |
| `VITE_GITHUB_GRAPHQL_ENDPOINT` | Yes | GitHub GraphQL endpoint (`https://api.github.com/graphql`) |
