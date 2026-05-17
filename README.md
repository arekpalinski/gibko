# Gibko

![Gibko logo](public/assets/gibko-logo-transparent.webp)

Gibko is a playful Progressive Web App that helps kids build a gentle stretching habit. The app follows Gibko, a cheerful gibbon, through forest chapters filled with short movement adventures, energy leaves, day-path progress, badges, and simple health hints.

The goal is not to make a serious fitness tracker. Gibko should feel like a small mobile game that happens to make stretching more inviting: open the app, start the next adventure, move for a few minutes, collect energy leaves, and come back another day.

## Current Prototype

- A locally stored child profile with name, language, and safety acceptance.
- Polish UI by default, with English available as a secondary language.
- A rainforest chapter with 18 data-driven adventures.
- Exercise variants stored separately from adventures, each with estimated time, repetitions, equipment, energy leaves, categories, health hints, and optional challenge options.
- Energy leaves awarded from real exercise time: full reward at 85% of planned time, proportional rewards below that, and a small bonus for going longer than planned.
- Three-leaf adventure ratings based on the same real-time logic.
- A map, profile, settings, install prompt, PWA manifest, and offline app shell.

## Repository Rules

Code, commit messages, Markdown files, and agent instructions are written in English. User-facing text belongs in localization files so the app can keep Polish and English UI copy side by side.

## Stack

- Vite
- React
- TypeScript
- React Router
- vite-plugin-pwa
- lucide-react
- Vitest

## Local Development

```powershell
npm install
npm run dev
```

The development server usually serves the app at:

```text
http://localhost:5173/gibko/
```

## Verification

```powershell
npm test
npm run build
```

## Deployment

The app is configured for GitHub Pages as a project site:

```text
https://arekpalinski.github.io/gibko/
```

GitHub Actions builds and deploys the `dist` folder after pushes to `main`.
