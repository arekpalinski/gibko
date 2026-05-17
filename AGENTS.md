# AGENTS.md

## Project

Gibko is a playful Progressive Web App for kids. It encourages gentle stretching through short adventures, energy leaves, a friendly day path, badges, and unlockable forest chapters. The main character is Gibko, a cheerful gibbon. The first prototype chapter is the Rainforest.

## Language Rules

- Keep source code, filenames, comments, commit messages, and Markdown documentation in English.
- Keep UI copy in localization files.
- Polish is the default user-facing language.
- English should remain available as a secondary locale.

## Product Principles

- Build a usable app, not a marketing site.
- Keep the tone playful, warm, and motivating.
- Avoid punishment mechanics. Day-path progress should feel encouraging, not stressful.
- Exercise content must stay gentle and child-friendly.
- The app must clearly say that pain means stopping and asking an adult.
- Do not add medical claims or medical advice.
- Health hints should feel supportive, not alarming.

## Privacy Rules

- No accounts.
- No analytics.
- No tracking.
- No backend calls for child data.
- Store progress locally on the device only.

## Technical Direction

- Use Vite, React, TypeScript, and plain CSS.
- Keep game content data-driven so future chapters and forests can be added without rewriting app flow.
- User-facing "adventures" may still be represented as `Mission` in code until the internal model is renamed.
- Keep full exercise variants in `src/data/exercises.ts`; adventures in `src/data/chapters.ts` should reference them by `exerciseIds`.
- Adventure energy leaves, estimated minutes, estimated time labels, and equipment are derived from referenced exercises.
- Exercise categories already exist as `categories`; keep them as arrays even when empty.
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
- Home screen with energy leaves, day path, exercise time, install prompt, and the next adventure.
- Chapter map with 18 rainforest adventures.
- Adventure flow with manual Start, Done, and Too hard actions.
- Adventure summary with earned energy leaves, three-leaf rating, exercise time, and badges.
- Profile and settings.
- Local reset with confirmation.

## Reward Logic

- Award the full adventure energy-leaf reward at 85% of planned exercise time.
- Award proportional energy leaves below that threshold.
- Award 10 bonus energy leaves when actual exercise time exceeds planned exercise time.
- Use the same timing model for the visible 1-3 leaf adventure rating.

## Verification

Before handing off meaningful code changes, run:

```powershell
npm test
npm run build
```
