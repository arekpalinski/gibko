import type { World } from '../types'

export const worlds: World[] = [
  {
    id: 'cosmic-academy',
    titleKey: 'worlds.cosmicAcademy.title',
    descriptionKey: 'worlds.cosmicAcademy.description',
    badgeId: 'cosmic-rookie',
    missions: [
      {
        id: 'mission-1-launch-pad',
        worldId: 'cosmic-academy',
        titleKey: 'missions.launchPad.title',
        teaserKey: 'missions.launchPad.teaser',
        xp: 80,
        estimatedMinutes: 12,
        exercises: [
          {
            id: 'rocket-start',
            titleKey: 'exercises.rocketStart.title',
            descriptionKey: 'exercises.rocketStart.description',
            icon: 'rocket',
            minutes: 3,
          },
          {
            id: 'radar-arms',
            titleKey: 'exercises.radarArms.title',
            descriptionKey: 'exercises.radarArms.description',
            icon: 'radar',
            minutes: 4,
          },
          {
            id: 'orbital-bend',
            titleKey: 'exercises.orbitalBend.title',
            descriptionKey: 'exercises.orbitalBend.description',
            icon: 'orbit',
            minutes: 5,
          },
        ],
      },
      {
        id: 'mission-2-zero-gravity',
        worldId: 'cosmic-academy',
        titleKey: 'missions.zeroGravity.title',
        teaserKey: 'missions.zeroGravity.teaser',
        xp: 95,
        estimatedMinutes: 14,
        exercises: [
          {
            id: 'cosmic-cat',
            titleKey: 'exercises.cosmicCat.title',
            descriptionKey: 'exercises.cosmicCat.description',
            icon: 'cat',
            minutes: 4,
          },
          {
            id: 'astronaut-walk',
            titleKey: 'exercises.astronautWalk.title',
            descriptionKey: 'exercises.astronautWalk.description',
            icon: 'astronaut',
            minutes: 5,
          },
          {
            id: 'radar-arms-repeat',
            titleKey: 'exercises.radarArms.title',
            descriptionKey: 'exercises.radarArms.description',
            icon: 'radar',
            minutes: 5,
          },
        ],
      },
      {
        id: 'mission-3-comet-trail',
        worldId: 'cosmic-academy',
        titleKey: 'missions.cometTrail.title',
        teaserKey: 'missions.cometTrail.teaser',
        xp: 110,
        estimatedMinutes: 15,
        exercises: [
          {
            id: 'orbital-bend-repeat',
            titleKey: 'exercises.orbitalBend.title',
            descriptionKey: 'exercises.orbitalBend.description',
            icon: 'orbit',
            minutes: 5,
          },
          {
            id: 'rocket-start-repeat',
            titleKey: 'exercises.rocketStart.title',
            descriptionKey: 'exercises.rocketStart.description',
            icon: 'rocket',
            minutes: 5,
          },
          {
            id: 'cosmic-cat-repeat',
            titleKey: 'exercises.cosmicCat.title',
            descriptionKey: 'exercises.cosmicCat.description',
            icon: 'cat',
            minutes: 5,
          },
        ],
      },
    ],
  },
]
