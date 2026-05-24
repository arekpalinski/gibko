import { describe, expect, it } from 'vitest'
import type { Exercise } from '../types'
import { chapters } from './chapters'
import { exerciseLibrary } from './exercises'

describe('chapter content', () => {
  it('keeps the first rainforest chapter at eighteen missions', () => {
    expect(chapters[0].missions).toHaveLength(18)
  })

  it('adds the misty forest chapter with eighteen reusable adventures', () => {
    const mistyForest = chapters.find((chapter) => chapter.id === 'misty-forest')

    expect(mistyForest).toBeTruthy()
    expect(mistyForest?.badgeId).toBe('misty-forest-pathfinder')
    expect(mistyForest?.missions).toHaveLength(18)
    expect(mistyForest?.missions[0]).toMatchObject({
      chapterId: 'misty-forest',
      number: 1,
      slug: 'first-steps-in-the-mist',
      exerciseIds: ['heelTrail', 'quietHeelMoss', 'leafRollStep', 'berryFootPress', 'calfStretch'],
    })
    expect(mistyForest?.missions[17]).toMatchObject({
      chapterId: 'misty-forest',
      number: 18,
      slug: 'great-misty-expedition',
    })
  })

  it('derives stable adventure ids from chapter order and slugs', () => {
    const adventureIds = new Set<string>()

    chapters.forEach((chapter) => {
      const slugs = new Set<string>()

      chapter.missions.forEach((mission, index) => {
        expect(mission.chapterId).toBe(chapter.id)
        expect(mission.number).toBe(index + 1)
        expect(mission.slug).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
        expect(mission.id).toBe(`${chapter.id}-adventure-${mission.number}-${mission.slug}`)
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

  it('includes the new standalone exercise drafts in the shared exercise library', () => {
    const newExerciseIds = [
      'heelTrail',
      'quietHeelMoss',
      'leafRollStep',
      'kneeTunnelSquat',
      'forestCrabKnees',
      'clamshellLeaf',
      'softIslandClock',
      'backNutOnFloor',
      'groundWingSlides',
      'turtleNeck',
      'bellyBalloon',
      'leafDeadBug',
      'ribWingSlides',
    ] as const

    newExerciseIds.forEach((exerciseId) => {
      const exercise = exerciseLibrary[exerciseId]

      expect(exercise.id).toBe(exerciseId)
      expect(exercise.title.pl).toBeTruthy()
      expect(exercise.title.en).toBeTruthy()
      expect(exercise.description.pl).toBeTruthy()
      expect(exercise.description.en).toBeTruthy()
      expect(exercise.estimatedMinutes).toBeGreaterThan(0)
      expect(exercise.energyLeaves).toBeGreaterThan(0)
      expect(exercise.categories.length).toBeGreaterThan(0)
      expect(exercise.equipment.length).toBeGreaterThan(0)
    })
  })

  it('keeps harder variants in challenge options instead of health notes', () => {
    const exercises: Exercise[] = Object.values(exerciseLibrary)
    const challengeOptions = exercises.filter((exercise) => exercise.challengeOption)

    expect(challengeOptions.length).toBeGreaterThanOrEqual(8)
    challengeOptions.forEach((exercise) => {
      expect(exercise.challengeOption?.pl).toContain('Podkręcona wersja')
      expect(exercise.challengeOption?.en).toMatch(/^(Challenge option|Spicy version):/)
    })

    expect(exerciseLibrary.heelTrail.challengeOption).toEqual({
      pl: 'Podkręcona wersja: po każdym kroku zatrzymaj się na 1 sekundę.',
      en: 'Challenge option: pause for 1 second after each step.',
    })
    expect(exerciseLibrary.quietHeelMoss.challengeOption).toEqual({
      pl: 'Podkręcona wersja: zrób ćwiczenie na macie sensorycznej z wypustkami, jeśli jest wygodnie.',
      en: 'Challenge option: try it on a sensory mat with bumps if it feels comfortable.',
    })
    expect(exerciseLibrary.kneeTunnelSquat.challengeOption).toEqual({
      pl: 'Podkręcona wersja: zatrzymaj się na dole na 2 sekundy.',
      en: 'Challenge option: pause at the bottom for 2 seconds.',
    })
    expect(exerciseLibrary.softIslandClock.challengeOption).toEqual({
      pl: 'Podkręcona wersja: dotknij podłogi w czterech kierunkach: przód, bok, tył i skos.',
      en: 'Challenge option: touch the floor in four directions: front, side, back, and diagonal.',
    })
    expect(exerciseLibrary.leafDeadBug.challengeOption).toEqual({
      pl: 'Podkręcona wersja: trzymaj mały pluszowy liść albo miękką piłeczkę na brzuchu i postaraj się, żeby nie spadła.',
      en: 'Challenge option: keep a small plush leaf or soft ball on your belly and try not to let it fall.',
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
