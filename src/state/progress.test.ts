import { describe, expect, it } from 'vitest'
import { worlds } from '../data/worlds'
import { completeMission, createInitialProgress } from './progress'

describe('progress logic', () => {
  it('adds XP and unlocks the next mission after completion', () => {
    const mission = worlds[0].missions[0]
    const result = completeMission(createInitialProgress(), mission, new Date('2026-05-12T12:00:00'))

    expect(result.progress.xp).toBe(mission.xp)
    expect(result.progress.completedMissionIds).toContain(mission.id)
    expect(result.progress.unlockedMissionIds).toContain(worlds[0].missions[1].id)
  })

  it('keeps a gentle daily streak for consecutive days', () => {
    const mission = worlds[0].missions[0]
    const dayOne = completeMission(createInitialProgress(), mission, new Date('2026-05-12T12:00:00'))
    const dayTwo = completeMission(dayOne.progress, mission, new Date('2026-05-13T12:00:00'))

    expect(dayTwo.progress.streakDays).toBe(2)
  })
})
