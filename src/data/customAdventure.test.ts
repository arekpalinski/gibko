import { describe, expect, it } from 'vitest'
import {
  createCustomAdventureMission,
  customAdventureCategoryLabels,
  generateCustomAdventureDraft,
  getAvailableCustomAdventureCategories,
} from './customAdventure'
import { exerciseLibrary } from './exercises'
import { calculateMissionXp, completeMission, createInitialProgress, getMissionPlannedSeconds } from '../state/progress'

function seededRandom(seed = 12345) {
  let currentSeed = seed

  return () => {
    currentSeed = (currentSeed * 1664525 + 1013904223) >>> 0
    return currentSeed / 2 ** 32
  }
}

describe('custom adventure builder', () => {
  it('keeps available categories in sync with the exercise library', () => {
    const usedCategories = Array.from(
      new Set(Object.values(exerciseLibrary).flatMap((exercise) => exercise.categories)),
    ).sort()
    const availableCategories = [...getAvailableCustomAdventureCategories()].sort()

    expect(availableCategories).toEqual(usedCategories)
    availableCategories.forEach((category) => {
      expect(customAdventureCategoryLabels[category].pl).toBeTruthy()
      expect(customAdventureCategoryLabels[category].en).toBeTruthy()
    })
  })

  it('generates a reusable custom adventure from selected exercise categories', () => {
    const draft = generateCustomAdventureDraft(
      {
        categories: ['feet', 'thighs', 'hips'],
        exerciseCount: 4,
        minMinutes: 10,
        maxMinutes: 15,
      },
      [],
      seededRandom(),
    )
    const mission = createCustomAdventureMission(draft.exerciseIds)

    expect(draft.exerciseIds).toHaveLength(4)
    expect(mission.exercises).toHaveLength(4)
    expect(mission.xp).toBe(
      mission.exercises.reduce((sum, exercise) => sum + exercise.energyLeaves, 0),
    )
    expect(mission.estimatedMinutes).toBe(
      mission.exercises.reduce((sum, exercise) => sum + exercise.estimatedMinutes, 0),
    )
    expect(
      mission.exercises.every((exercise) =>
        exercise.categories.some((category) => ['feet', 'thighs', 'hips'].includes(category)),
      ),
    ).toBe(true)
    draft.exerciseIds.forEach((exerciseId) => {
      expect(exerciseLibrary[exerciseId]).toBeTruthy()
    })
  })

  it('uses standard adventure reward rules for generated adventures', () => {
    const draft = generateCustomAdventureDraft({ exerciseCount: 2 }, [], seededRandom(99))
    const mission = createCustomAdventureMission(draft.exerciseIds)
    const plannedSeconds = getMissionPlannedSeconds(mission)
    const fullRewardSeconds = plannedSeconds * 0.85
    const halfRewardSeconds = fullRewardSeconds / 2

    expect(calculateMissionXp(mission, fullRewardSeconds)).toBe(mission.xp)
    expect(calculateMissionXp(mission, halfRewardSeconds)).toBe(Math.round(mission.xp / 2))
    expect(calculateMissionXp(mission, plannedSeconds + 1)).toBe(mission.xp + 10)

    const result = completeMission(
      createInitialProgress('en'),
      mission,
      fullRewardSeconds,
      new Date('2026-05-18T12:00:00'),
    )

    expect(result.progress.xp).toBe(mission.xp)
    expect(result.progress.exerciseSecondsToday).toBe(fullRewardSeconds)
    expect(result.progress.totalExerciseSeconds).toBe(fullRewardSeconds)
    expect(result.progress.completedMissionIds).toContain(mission.id)
    expect(result.progress.missionStars[mission.id]).toBe(3)
  })
})
