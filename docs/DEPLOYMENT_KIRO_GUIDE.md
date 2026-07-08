# Deployment and Kiro Guide

## Best deployment option

Use **Vercel** for the current version because this is a Vite React frontend with no backend requirement.

Settings:

```txt
Framework: Vite
Build command: npm run build
Output directory: dist
Environment variables: none required for current version
```

Netlify also works with the same settings. A `netlify.toml` file is included.

## Kiro workflow

Open the project folder in Kiro and use this prompt:

```txt
Review this React TypeScript Vite project. Improve UI polish, accessibility, and deploy readiness without changing the core research logic. Keep the project static and compatible with Vercel and Netlify. Do not add paid API dependencies.
```

Then run:

```bash
npm install
npm run typecheck
npm run build
```

## GitHub update commands

```bash
git add .
git commit -m "Improve research UI, assets, and deployment setup"
git push origin main
```

## Future backend roadmap

Add backend only after the frontend demo is live:

1. Spring Boot or Node.js API for zipped Java project upload.
2. JavaParser or CKJM-style metric extraction.
3. MySQL/PostgreSQL for analysis history.
4. GitHub webhook for pull request quality gate.
5. Deploy backend on Railway, Render, or AWS.
