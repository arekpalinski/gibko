import type { Chapter } from '../types'

export const chapters: Chapter[] = [
  {
    id: 'rainforest',
    titleKey: 'chapters.rainforest.title',
    descriptionKey: 'chapters.rainforest.description',
    badgeId: 'rainforest-scout',
    missions: [
      {
        id: 'mission-1-canopy-warmup',
        chapterId: 'rainforest',
        titleKey: 'missions.canopyWarmup.title',
        teaserKey: 'missions.canopyWarmup.teaser',
        xp: 80,
        estimatedMinutes: 12,
        exercises: [
          {
            id: 'branch-reach',
            titleKey: 'exercises.branchReach.title',
            descriptionKey: 'exercises.branchReach.description',
            icon: 'branch',
            minutes: 3,
          },
          {
            id: 'leafy-arms',
            titleKey: 'exercises.leafyArms.title',
            descriptionKey: 'exercises.leafyArms.description',
            icon: 'leaf',
            minutes: 4,
          },
          {
            id: 'vine-side-bend',
            titleKey: 'exercises.vineSideBend.title',
            descriptionKey: 'exercises.vineSideBend.description',
            icon: 'vine',
            minutes: 5,
          },
        ],
      },
      {
        id: 'mission-2-rainy-branches',
        chapterId: 'rainforest',
        titleKey: 'missions.rainyBranches.title',
        teaserKey: 'missions.rainyBranches.teaser',
        xp: 95,
        estimatedMinutes: 14,
        exercises: [
          {
            id: 'rain-frog',
            titleKey: 'exercises.rainFrog.title',
            descriptionKey: 'exercises.rainFrog.description',
            icon: 'frog',
            minutes: 4,
          },
          {
            id: 'river-steps',
            titleKey: 'exercises.riverSteps.title',
            descriptionKey: 'exercises.riverSteps.description',
            icon: 'river',
            minutes: 5,
          },
          {
            id: 'leafy-arms-repeat',
            titleKey: 'exercises.leafyArms.title',
            descriptionKey: 'exercises.leafyArms.description',
            icon: 'leaf',
            minutes: 5,
          },
        ],
      },
      {
        id: 'mission-3-vine-path',
        chapterId: 'rainforest',
        titleKey: 'missions.vinePath.title',
        teaserKey: 'missions.vinePath.teaser',
        xp: 110,
        estimatedMinutes: 15,
        exercises: [
          {
            id: 'vine-side-bend-repeat',
            titleKey: 'exercises.vineSideBend.title',
            descriptionKey: 'exercises.vineSideBend.description',
            icon: 'vine',
            minutes: 5,
          },
          {
            id: 'branch-reach-repeat',
            titleKey: 'exercises.branchReach.title',
            descriptionKey: 'exercises.branchReach.description',
            icon: 'branch',
            minutes: 5,
          },
          {
            id: 'rain-frog-repeat',
            titleKey: 'exercises.rainFrog.title',
            descriptionKey: 'exercises.rainFrog.description',
            icon: 'frog',
            minutes: 5,
          },
        ],
      },
    ],
  },
]
