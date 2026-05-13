# AGENTS.md

## Project

Gibko is a playful Progressive Web App for kids around age 10. It encourages gentle stretching through short missions, XP, streaks, badges, and unlockable forest chapters. The main character is Gibko, a friendly gibbon. The first prototype chapter is the Rainforest.

## Language Rules

- Keep source code, filenames, comments, commit messages, and Markdown documentation in English.
- Keep UI copy in localization files.
- Polish is the default user-facing language.
- English should remain available as a secondary locale.

## Product Principles

- Build a usable app, not a marketing site.
- Keep the tone playful, warm, and motivating.
- Avoid punishment mechanics. Streaks should feel encouraging, not stressful.
- Exercise content must stay gentle and child-friendly.
- The app must clearly say that pain means stopping and asking an adult.
- Do not add medical claims or medical advice.

## Privacy Rules

- No accounts.
- No analytics.
- No tracking.
- No backend calls for child data.
- Store progress locally on the device only.

## Technical Direction

- Use Vite, React, TypeScript, and plain CSS.
- Keep game content data-driven so future chapters and forests can be added without rewriting app flow.
- Prefer small, focused modules.
- Use `localStorage` for prototype progress.
- Keep GitHub Pages compatibility. The Vite base path is `/gibko/`.
- Use `HashRouter` unless the deployment strategy changes to support SPA fallback routes.

## PWA Direction

- Preserve installability on Android Chrome as the first priority.
- Keep the manifest complete and aligned with GitHub Pages paths.
- Keep offline behavior simple: the app shell should load after installation.

## Current Prototype Scope

- Onboarding with child name, language, and safety note.
- Home screen with XP, streak, minutes today, install prompt, and daily mission.
- Chapter map with the first three missions.
- Mission flow with manual Start, Done, and Too hard actions.
- Mission summary with XP and badges.
- Profile and settings.
- Local reset with confirmation.

## Verification

Before handing off meaningful code changes, run:

```powershell
npm test
npm run build
```
