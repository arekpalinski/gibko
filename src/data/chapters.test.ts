import { describe, expect, it } from 'vitest'
import type { Exercise } from '../types'
import { chapters } from './chapters'
import { exerciseLibrary } from './exercises'

describe('chapter content', () => {
  it('keeps the first rainforest chapter at eighteen missions', () => {
    expect(chapters[0].missions).toHaveLength(18)
  })

  it('derives stable adventure ids from chapter order and slugs', () => {
    const adventureIds = new Set<string>()

    chapters.forEach((chapter) => {
      const slugs = new Set<string>()

      chapter.missions.forEach((mission, index) => {
        expect(mission.chapterId).toBe(chapter.id)
        expect(mission.number).toBe(index + 1)
        expect(mission.slug).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
        expect(mission.id).toBe(`mission-${mission.number}-${mission.slug}`)
        expect(slugs.has(mission.slug)).toBe(false)
        expect(adventureIds.has(mission.id)).toBe(false)
        slugs.add(mission.slug)
        adventureIds.add(mission.id)
      })
    })
  })

  it('provides exercise timing and repetition copy for every mission exercise', () => {
    const exercises = chapters.flatMap((chapter) =>
      chapter.missions.flatMap((mission) => mission.exercises),
    )

    expect(exercises.length).toBeGreaterThan(0)
    exercises.forEach((exercise) => {
      expect(exercise.estimatedTimeLabel.pl).toBeTruthy()
      expect(exercise.estimatedTimeLabel.en).toBeTruthy()
      expect(exercise.estimatedMinutes).toBeGreaterThan(0)
      expect(exercise.energyLeaves).toBeGreaterThan(0)
      expect(exercise.equipment.length).toBeGreaterThan(0)
      expect(Array.isArray(exercise.categories)).toBe(true)
      expect(exercise.categories.length).toBeGreaterThan(0)
      expect(exercise.repetitions.pl).toBeTruthy()
      expect(exercise.repetitions.en).toBeTruthy()
      expect(exercise.description.pl).toBeTruthy()
      expect(exercise.description.en).toBeTruthy()
      expect(exercise.note?.pl.startsWith('Podkręcona wersja')).not.toBe(true)
      expect(exercise.note?.en.startsWith('Spicy version')).not.toBe(true)
      if (exercise.challengeOption) {
        expect(exercise.challengeOption.pl).toBeTruthy()
        expect(exercise.challengeOption.en).toBeTruthy()
      }
    })
  })

  it('keeps spicy variants in challenge options instead of health notes', () => {
    const exercises: Exercise[] = Object.values(exerciseLibrary)
    const challengeOptions = exercises.filter((exercise) => exercise.challengeOption)

    expect(challengeOptions).toHaveLength(3)
    challengeOptions.forEach((exercise) => {
      expect(exercise.challengeOption?.pl).toContain('Podkręcona wersja')
      expect(exercise.challengeOption?.en).toContain('Spicy version')
    })
  })

  it('keeps adventures as exercise references with derived totals', () => {
    chapters.forEach((chapter) => {
      chapter.missions.forEach((mission) => {
        expect(mission.exerciseIds).toHaveLength(mission.exercises.length)
        mission.exerciseIds.forEach((exerciseId) => {
          expect(exerciseLibrary[exerciseId as keyof typeof exerciseLibrary]).toBeTruthy()
        })

        const energyLeaves = mission.exercises.reduce((sum, exercise) => sum + exercise.energyLeaves, 0)
        const estimatedMinutes = mission.exercises.reduce((sum, exercise) => sum + exercise.estimatedMinutes, 0)
        const equipment = new Set(
          mission.exercises.flatMap((exercise) =>
            exercise.equipment.filter((item) => item !== 'none'),
          ),
        )

        expect(mission.xp).toBe(energyLeaves)
        expect(mission.estimatedMinutes).toBe(estimatedMinutes)
        expect(mission.estimatedTimeLabel).toEqual({
          pl: `${estimatedMinutes} min`,
          en: `${estimatedMinutes} min`,
        })
        expect(mission.equipment).toEqual(equipment.size > 0 ? Array.from(equipment) : ['none'])
      })
    })
  })
})
