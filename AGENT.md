# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **Nuxt 3-based documentation website** for the Code Sense study group in Kaohsiung, Taiwan. The site uses the [@nuxt-themes/docus](https://docus.dev) theme and hosts study notes and technical articles from the group's reading sessions covering topics like Clean Architecture, DDIA, CI/CD, and Web API design.

Live site: https://codesensegroup.github.io/code-study/

## Development Commands

```bash
# Install dependencies (requires Node.js 18+)
npm install

# Start local development server
npm run dev

# Generate static site
npm run generate

# Lint code
npm run lint
```

## Architecture

### Framework & Stack
- **Nuxt 3** with [@nuxt-themes/docus](https://docus.dev) theme
- **Nuxt Content** for file-based content management
- **Tailwind CSS** with `2xl` breakpoint disabled (`tailwind.config.js`)
- **Vue 3** with TypeScript support
- Deployed to **GitHub Pages** via GitHub Actions

### Site Configuration
- `app.config.ts` — Docus theme config (title, sidebar, header, GitHub repo link)
- `nuxt.config.ts` — Nuxt modules, content plugins, syntax highlighting, math rendering
- `BASE_URL` env var controls the base path (validated with Zod, must start with `/`)

### Content Management
Content lives in `content/` with numbered directory prefixes that control navigation order:
- `1.api/`, `2.workshop/`, `3.web-api/`, `4.cicd-2.0/`, `5.ddia/`, `6.clean-arch/`, `7.sdi-aig/`

Each directory has `_dir.yml` (title, icon) and `.md` files with frontmatter metadata.

### Image Handling for GitHub Pages
A custom Nitro plugin (`server/plugins/content.ts`) uses `unist-util-visit` to walk the parsed markdown AST and prefix image paths starting with `images/` with `BASE_URL`. This is necessary because GitHub Pages serves under a subpath.

### Component Customization
Components in `components/` override Docus defaults:
- `components/content/ProseCode.vue` — Code block with copy button and filename display
- `components/content/ProseImg.vue` — Image component with PhotoSwipe lightbox integration
- `components/DocsPageLayout.vue` — Overridden layout supporting reading mode
- `composables/useReadingMode.ts` — Reading mode state (toggled via F/R key or button, persisted to localStorage)

### Markdown Extensions
- **Math rendering**: `remark-math` + `rehype-katex` (not MathJax)
- **Syntax highlighting**: Shiki with themes `github-light` / `github-dark` / `monokai`, preloaded languages include C, C++, Java, Go, Kotlin, Proto, GraphQL, Groovy, shell variants
- **Custom CSS**: `assets/css/override.css` and `assets/css/transitions.css`

### Notable Dependencies
- `photoswipe` — Image lightbox
- `mermaid` — Diagram rendering
- `katex` — Math rendering (client-side)
- `busuanzi.pure.js` — Page view counter
- `reading-time` — Estimated reading time

## CI/CD

### GitHub Actions Workflows
- **`deploy.yml`** — On push to `master`: generates static site with `BASE_URL` set to repo name, deploys to GitHub Pages via `./dist`
- **`build.yml`** — On PRs to `master`: runs `nuxi generate` to verify the build succeeds
- **`commitlint.yml`** — On PRs: enforces [Conventional Commits](https://www.conventionalcommits.org/) via `commitlint`

### Commit Convention
Commits must follow **Conventional Commits** format (`feat:`, `fix:`, `chore:`, etc.). Configured in `commitlint.config.js` with relaxed limits: header max 150 chars, body line max 200 chars.

## ESLint
Uses `@nuxt/eslint-config`. Disabled rules: `vue/max-attributes-per-line`, `vue/multi-word-component-names`.
