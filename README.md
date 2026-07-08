# OO Design Quality Dashboard

An Intelligent Dashboard for Object-Oriented Design Quality Analysis and AI-Powered Suggestions.

This project is based on the CIET 2026 research presentation by **S. Rahul Kumar**. It converts the research paper idea into a modern React project with a clean UI, research assets, Docker support, GitHub Actions CI, and Vercel/Netlify deployment setup.

## What the project does

- Upload Java `.java` files
- Calculate class-level OO metrics:
  - WMC, Weighted Methods per Class
  - RFC, Response for Class
  - CBO, Coupling Between Objects
  - LCOM, Lack of Cohesion of Methods
  - DIT, Depth of Inheritance Tree
- Generate a weighted design score
- Assign class grades A, B, C, or D
- Show evidence-backed refactoring recommendations
- Export analysis as JSON
- Present dashboard charts for grade distribution, metric comparison, and radar view

## Latest update

- Added a stronger research-backed UX section
- Added metric explanation cards for WMC, RFC, CBO, LCOM, and DIT
- Added a deployment recommendation section
- Added Vercel and Netlify configuration files
- Added final paper and abstract files inside `public/research`
- Added a sample Java test file inside `public/samples`
- Updated documentation for Kiro, GitHub, and deployment workflow

## Research assets included

```text
public/research/research1.pptx
public/research/certificate-presentation.png
public/research/final-paper.docx
public/research/abstract.docx
```

## Tech stack

- React
- TypeScript
- Vite
- Tailwind CSS
- Framer Motion
- GSAP
- Three.js
- Chart.js
- Docker
- GitHub Actions

## Run locally

```bash
npm install
npm run dev
```

Open the local URL shown by Vite.

## Production build

```bash
npm run typecheck
npm run build
npm run preview
```

## Deploy on Vercel

Recommended for the current version.

```txt
Framework: Vite
Build command: npm run build
Output directory: dist
Environment variables: none required
```

Steps:

1. Push this project to GitHub.
2. Go to Vercel and choose **Add New Project**.
3. Import the GitHub repository.
4. Keep the Vite settings above.
5. Click Deploy.

## Deploy on Netlify

Netlify is also supported through `netlify.toml`.

```txt
Build command: npm run build
Publish directory: dist
```

## Docker run

```bash
docker build -t oo-design-quality-dashboard .
docker run -p 8080:80 oo-design-quality-dashboard
```

Open:

```text
http://localhost:8080
```

## Kiro prompt

Use this in Kiro if you want to continue improving the project:

```txt
Review this React TypeScript Vite project. Improve UI polish, accessibility, and deploy readiness without changing the core research logic. Keep the project static and compatible with Vercel and Netlify. Do not add paid API dependencies.
```

## Profiles

GitHub:

```text
https://github.com/srahulkumar2003
```

LinkedIn:

```text
https://in.linkedin.com/in/samboju-rahul-kumar-8464a5255
```

## DevOps and infrastructure scope

**Project:** Object-Oriented Design Quality Dashboard with CI/CD Quality Gate  
**Stack:** React, TypeScript, Tailwind, Chart.js, GSAP, Three.js, Docker, GitHub Actions  
**Infrastructure:** Dockerized frontend, automated CI build, and future backend support for metric history and commit-level trend tracking.

## Future backend roadmap

- Spring Boot or Node.js API for zipped Java project upload
- JavaParser or CKJM-style metric extraction service
- MySQL/PostgreSQL storage for analysis history
- GitHub webhook integration
- Pull request quality gate
- Trend dashboard per commit
