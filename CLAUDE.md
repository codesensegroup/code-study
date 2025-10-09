# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **Nuxt 3-based documentation website** for the Code Sense study group in Kaohsiung, Taiwan. The site uses the [@nuxt-themes/docus](https://docus.dev) theme and hosts study notes and technical articles from the group's reading sessions covering topics like Clean Architecture, DDIA, CI/CD, and Web API design.

## Development Commands

```bash
# Start local development server
npm run dev

# Build for production
npm run build

# Generate static site (standard)
npm run generate

# Generate for GitHub Pages deployment
npm run generate:github

# Lint code
npm run lint

# Preview production build
npm run preview
```

## Architecture

### Framework & Stack
- **Nuxt 3** with [@nuxt-themes/docus](https://docus.dev) theme
- **Nuxt Content** for file-based content management
- **Tailwind CSS** with custom configuration
- **Vue 3** with TypeScript support
- **Deployed to GitHub Pages** via GitHub Actions

### Content Management
Content is organized in `content/` directory by topic:
- `content/2.workshop/` - Technical workshops and tutorials
- `content/3.web-api/` - Web API study notes
- `content/4.cicd-2.0/` - CI/CD 2.0 book chapters
- `content/5.ddia/` - Designing Data-Intensive Applications chapters
- `content/6.clean-arch/` - Clean Architecture book chapters
- `content/7.sdi-aig/` - System Design Interview chapters

Each directory contains:
- `_dir.yml` - Directory metadata (title, icon)
- `.md` files - Chapter content with frontmatter metadata

### Image Handling for GitHub Pages
The codebase includes a custom Nitro plugin (`server/plugins/content.ts`) that automatically transforms image paths:
- Images referenced as `images/...` in markdown are automatically prefixed with the `BASE_URL`
- This ensures images load correctly when deployed to GitHub Pages with a subpath
- The `BASE_URL` is determined by the `BASE_URL` environment variable (defaults to `/`)

### Component Customization
Custom components in `components/` override default Docus components:
- `components/content/ProseCode.vue` - Custom code block with copy button and filename display
- `components/content/Image.vue` - Custom image component
- `components/AppHeader.vue`, `AppFooter.vue`, etc. - Custom layout components

### Markdown Extensions
- **Math rendering**: Configured with `remark-math` + `rehype-mathjax` for LaTeX equations
- **Syntax highlighting**: Extended Shiki configuration supporting C, C++, Java, Go, Kotlin, Proto, GraphQL, Groovy, and shell variants

### Tailwind Configuration
- Custom configuration in `tailwind.config.js`
- **Important**: The `2xl` breakpoint is disabled (`'2xl': 'none'`)
- Content scanning limited to `components/**/*.{js,vue,ts}`

## Deployment

### GitHub Pages Deployment
The site is deployed automatically via GitHub Actions (`.github/workflows/deploy.yml`):
1. Triggers on push to `master` branch
2. Sets `BASE_URL=/${{ github.event.repository.name }}` in `.env`
3. Runs `npx nuxi generate`
4. Adds `.nojekyll` file to prevent Jekyll processing
5. Deploys to GitHub Pages

### Environment Variables
- `BASE_URL` - Base path for the site (required for GitHub Pages deployment)
- `DEPLOY_ENV` - Set to `GH_PAGES` when using `npm run generate:github`

## ESLint Configuration
Uses `@nuxt/eslint-config` with custom rules:
- `vue/max-attributes-per-line`: disabled
- `vue/multi-word-component-names`: disabled

## TypeScript Configuration
Custom compiler options in `nuxt.config.ts`:
- `verbatimModuleSyntax: false` - Allows for more flexible module syntax
