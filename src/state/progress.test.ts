import { describe, expect, it } from 'vitest'
import { chapters } from '../data/chapters'
import { completeMission, createInitialProgress } from './progress'

describe('progress logic', () => {
  it('adds XP and unlocks the next mission after completion', () => {
    const mission = chapters[0].missions[0]
    const result = completeMission(createInitialProgress(), mission, 37, new Date('2026-05-12T12:00:00'))

    expect(result.progress.xp).toBe(mission.xp)
    expect(result.progress.exerciseSecondsToday).toBe(37)
    expect(result.progress.totalExerciseSeconds).toBe(37)
    expect(result.progress.completedMissionIds).toContain(mission.id)
    expect(result.progress.unlockedMissionIds).toContain(chapters[0].missions[1].id)
  })

  it('keeps a gentle daily streak for consecutive days', () => {
    const mission = chapters[0].missions[0]
    const dayOne = completeMission(createInitialProgress(), mission, 30, new Date('2026-05-12T12:00:00'))
    const dayTwo = completeMission(dayOne.progress, mission, 45, new Date('2026-05-13T12:00:00'))

    expect(dayTwo.progress.streakDays).toBe(2)
    expect(dayTwo.progress.exerciseSecondsToday).toBe(45)
    expect(dayTwo.progress.totalExerciseSeconds).toBe(75)
  })
})
