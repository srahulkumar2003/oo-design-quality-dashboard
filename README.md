# OO Design Quality Dashboard

An Intelligent Dashboard for Object-Oriented Design Quality Analysis and AI-Powered Suggestions.

This project is based on the CIET 2026 research presentation by **S. Rahul Kumar**. It converts the paper idea into a modern React project with a clean UI, research assets, Docker support, and CI workflow files.

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
- Present dashboard charts for grade distribution and metric comparison

## Research assets included

The uploaded PPT and certificate are included in:

```text
public/research/research1.pptx
public/research/certificate-presentation.png
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
npm run build
npm run preview
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

## Profiles

GitHub:

```text
https://github.com/srahulkumar2003
```

LinkedIn:

```text
https://in.linkedin.com/in/samboju-rahul-kumar-8464a5255
```

Create a public repository in this GitHub profile and keep it public so visitors can view the source code, PPT, certificate, and documentation.

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
