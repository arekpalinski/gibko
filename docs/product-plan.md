# Product Plan

## Vision

Gibko helps kids build a light stretching habit through playful adventures with Gibko, a friendly gibbon mascot. It should feel closer to a small mobile game than to a workout checklist.

## Audience

- Kids who can follow short, simple movement instructions.
- Primary use is independent on Android phones.
- Parents may help with installation or with exercises that feel unclear.

## Core Loop

1. Open Gibko.
2. See the next suggested adventure.
3. Complete several gentle exercises in a short adventure.
4. Earn energy leaves based on real exercise time.
5. Unlock the next adventure.
6. Return on another day to keep a friendly day path.

## Content Model

- Chapter: a themed forest area such as Rainforest.
- Adventure: a short session made of several exercises.
- Exercise: one simple movement with a playful name and short instruction.
- Badge: a reward for chapter completion or special behavior.

Future chapters should contain around 10-30 adventures each.

The code currently still uses the `Mission` type for adventures. Prefer user-facing copy that says "adventure" unless working directly with internal names.

## Prototype Scope

The first prototype includes one rainforest chapter with 18 adventures. Exercise content is data-driven so movements can be reused in later chapters while chapter-specific titles, descriptions, timing, repetitions, and health hints can stay playful.

## Reward Model

- Full energy-leaf reward starts at 85% of planned adventure time.
- Shorter completions earn proportional energy leaves.
- Going beyond the planned time grants a small 10-leaf bonus.
- The visible 1-3 leaf rating follows the same timing model, with "Too hard" keeping the result gentle and honest.
