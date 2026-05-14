import { describe, expect, it } from 'vitest'
import { chapters } from './chapters'

describe('chapter content', () => {
  it('keeps the first rainforest chapter at eighteen missions', () => {
    expect(chapters[0].missions).toHaveLength(18)
  })

  it('provides exercise timing and repetition copy for every mission exercise', () => {
    const exercises = chapters.flatMap((chapter) =>
      chapter.missions.flatMap((mission) => mission.exercises),
    )

    expect(exercises.length).toBeGreaterThan(0)
    exercises.forEach((exercise) => {
      expect(exercise.durationLabel.pl).toBeTruthy()
      expect(exercise.durationLabel.en).toBeTruthy()
      expect(exercise.repetitions.pl).toBeTruthy()
      expect(exercise.repetitions.en).toBeTruthy()
      expect(exercise.description.pl).toBeTruthy()
      expect(exercise.description.en).toBeTruthy()
    })
  })
})
