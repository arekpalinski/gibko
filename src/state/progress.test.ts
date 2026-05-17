import { beforeEach, describe, expect, it } from 'vitest'
import { chapters } from '../data/chapters'
import {
  calculateMissionXp,
  calculateMissionStars,
  clearProgress,
  completeMission,
  createInitialProgress,
  getMissionPlannedSeconds,
  loadProgress,
} from './progress'

const storageKey = 'gibko-progress-v1'

describe('progress logic', () => {
  beforeEach(() => {
    clearProgress()
  })

  it('adds XP and unlocks the next mission after completion', () => {
    const mission = chapters[0].missions[0]
    const fullRewardSeconds = getMissionPlannedSeconds(mission) * 0.85
    const result = completeMission(
      createInitialProgress(),
      mission,
      fullRewardSeconds,
      new Date('2026-05-12T12:00:00'),
    )

    expect(result.progress.xp).toBe(mission.xp)
    expect(result.xpEarned).toBe(mission.xp)
    expect(result.progress.exerciseSecondsToday).toBe(fullRewardSeconds)
    expect(result.progress.totalExerciseSeconds).toBe(fullRewardSeconds)
    expect(result.progress.completedMissionIds).toContain(mission.id)
    expect(result.progress.missionStars[mission.id]).toBe(3)
    expect(result.progress.unlockedMissionIds).toContain(chapters[0].missions[1].id)
  })

  it('awards proportional XP below the full reward time threshold', () => {
    const mission = chapters[0].missions[0]
    const fullRewardSeconds = getMissionPlannedSeconds(mission) * 0.85
    const actualSeconds = fullRewardSeconds / 2
    const result = completeMission(
      createInitialProgress(),
      mission,
      actualSeconds,
      new Date('2026-05-12T12:00:00'),
    )

    expect(calculateMissionXp(mission, actualSeconds)).toBe(Math.round(mission.xp / 2))
    expect(result.xpEarned).toBe(Math.round(mission.xp / 2))
    expect(result.progress.xp).toBe(Math.round(mission.xp / 2))
    expect(result.progress.missionStars[mission.id]).toBe(2)
  })

  it('awards only a tiny reward and one leaf for a near-instant completion', () => {
    const mission = chapters[0].missions[0]
    const result = completeMission(
      createInitialProgress(),
      mission,
      1,
      new Date('2026-05-12T12:00:00'),
    )

    expect(result.xpEarned).toBe(0)
    expect(result.starsEarned).toBe(1)
    expect(result.progress.xp).toBe(0)
    expect(result.progress.missionStars[mission.id]).toBe(1)
  })

  it('adds ten bonus XP when the child spends longer than the planned mission time', () => {
    const mission = chapters[0].missions[0]
    const plannedSeconds = getMissionPlannedSeconds(mission)
    const result = completeMission(
      createInitialProgress(),
      mission,
      plannedSeconds + 1,
      new Date('2026-05-12T12:00:00'),
    )

    expect(calculateMissionXp(mission, plannedSeconds + 1)).toBe(mission.xp + 10)
    expect(result.xpEarned).toBe(mission.xp + 10)
    expect(result.progress.xp).toBe(mission.xp + 10)
    expect(result.starsEarned).toBe(3)
  })

  it('counts unique active days without requiring consecutive days', () => {
    const mission = chapters[0].missions[0]
    const dayOne = completeMission(createInitialProgress(), mission, 30, new Date('2026-05-12T12:00:00'))
    const dayTwo = completeMission(dayOne.progress, mission, 45, new Date('2026-05-14T12:00:00'))

    expect(dayTwo.progress.streakDays).toBe(2)
    expect(dayTwo.progress.consecutiveActiveDays).toBe(1)
    expect(dayTwo.progress.exerciseSecondsToday).toBe(45)
    expect(dayTwo.progress.totalExerciseSeconds).toBe(75)
  })

  it('adds exercise time across multiple missions on the same day', () => {
    const firstMission = chapters[0].missions[0]
    const secondMission = chapters[0].missions[1]
    const firstResult = completeMission(
      createInitialProgress(),
      firstMission,
      120,
      new Date('2026-05-12T12:00:00'),
    )
    const secondResult = completeMission(
      firstResult.progress,
      secondMission,
      180,
      new Date('2026-05-12T13:00:00'),
    )

    expect(secondResult.progress.exerciseSecondsToday).toBe(300)
    expect(secondResult.progress.totalExerciseSeconds).toBe(300)
    expect(secondResult.progress.streakDays).toBe(1)
    expect(secondResult.progress.consecutiveActiveDays).toBe(1)
  })

  it('scores one star when the child used the too-hard help', () => {
    const mission = chapters[0].missions[0]

    expect(calculateMissionStars(mission, mission.estimatedMinutes * 60, true)).toBe(1)
  })

  it('scores three stars for a steady full mission without difficulty help', () => {
    const mission = chapters[0].missions[0]
    const plannedSeconds = mission.exercises.reduce((sum, exercise) => sum + exercise.estimatedMinutes * 60, 0)

    expect(calculateMissionStars(mission, plannedSeconds, false)).toBe(3)
  })

  it('scores three stars exactly at the steady-time threshold', () => {
    const mission = chapters[0].missions[0]
    const thresholdSeconds = getMissionPlannedSeconds(mission) * 0.85

    expect(calculateMissionStars(mission, thresholdSeconds, false)).toBe(3)
    expect(calculateMissionStars(mission, thresholdSeconds - 1, false)).toBe(2)
  })

  it('keeps the best star score when a mission is repeated', () => {
    const mission = chapters[0].missions[0]
    const firstTry = completeMission(
      createInitialProgress(),
      mission,
      mission.estimatedMinutes * 60,
      new Date('2026-05-12T12:00:00'),
      true,
    )
    const secondTry = completeMission(
      firstTry.progress,
      mission,
      mission.estimatedMinutes * 60,
      new Date('2026-05-12T13:00:00'),
    )

    expect(firstTry.starsEarned).toBe(1)
    expect(secondTry.starsEarned).toBe(3)
    expect(secondTry.progress.missionStars[mission.id]).toBe(3)
  })

  it('does not duplicate completed missions when repeated', () => {
    const mission = chapters[0].missions[0]
    const firstTry = completeMission(
      createInitialProgress(),
      mission,
      120,
      new Date('2026-05-12T12:00:00'),
    )
    const secondTry = completeMission(
      firstTry.progress,
      mission,
      180,
      new Date('2026-05-12T13:00:00'),
    )

    expect(secondTry.progress.completedMissionIds.filter((missionId) => missionId === mission.id)).toHaveLength(1)
  })

  it('does not unlock a bogus mission after the last mission', () => {
    const allMissions = chapters.flatMap((chapter) => chapter.missions)
    const lastMission = allMissions[allMissions.length - 1]
    const progress = {
      ...createInitialProgress(),
      unlockedMissionIds: allMissions.map((mission) => mission.id),
    }
    const result = completeMission(progress, lastMission, 120, new Date('2026-05-12T12:00:00'))

    expect(result.progress.completedMissionIds).toContain(lastMission.id)
    expect(result.progress.unlockedMissionIds).toEqual(progress.unlockedMissionIds)
  })

  it('awards the chapter badge when all missions in the chapter are complete', () => {
    const chapter = chapters[0]
    const initialResult = {
      progress: createInitialProgress(),
      earnedBadgeIds: [] as string[],
      starsEarned: 1,
      xpEarned: 0,
    }
    const finalResult = chapter.missions.reduce(
      (result, mission, index) =>
        completeMission(result.progress, mission, 120, new Date(2026, 4, 12, 8 + index)),
      initialResult,
    )

    expect(finalResult.earnedBadgeIds).toContain(chapter.badgeId)
    expect(finalResult.progress.badgeIds).toContain(chapter.badgeId)
  })

  it('awards morning and weekend badges for an early weekend mission', () => {
    const mission = chapters[0].missions[0]
    const result = completeMission(createInitialProgress(), mission, 120, new Date('2026-05-16T09:00:00'))

    expect(result.earnedBadgeIds).toContain('morning-leaf')
    expect(result.earnedBadgeIds).toContain('weekend-grove')
  })

  it('awards the evening firefly badge after 18:00', () => {
    const mission = chapters[0].missions[0]
    const result = completeMission(createInitialProgress(), mission, 120, new Date('2026-05-12T18:00:00'))

    expect(result.earnedBadgeIds).toContain('evening-firefly')
    expect(result.progress.badgeIds).toContain('evening-firefly')
  })

  it('does not award the evening firefly badge before 18:00', () => {
    const mission = chapters[0].missions[0]
    const result = completeMission(createInitialProgress(), mission, 120, new Date('2026-05-12T17:59:00'))

    expect(result.earnedBadgeIds).not.toContain('evening-firefly')
    expect(result.progress.badgeIds).not.toContain('evening-firefly')
  })

  it('awards the returning gibbon badge after the second completed adventure', () => {
    const firstMission = chapters[0].missions[0]
    const secondMission = chapters[0].missions[1]
    const firstResult = completeMission(createInitialProgress(), firstMission, 120, new Date('2026-05-12T12:00:00'))
    const secondResult = completeMission(firstResult.progress, secondMission, 120, new Date('2026-05-12T13:00:00'))

    expect(firstResult.earnedBadgeIds).not.toContain('second-adventure')
    expect(secondResult.earnedBadgeIds).toContain('second-adventure')
    expect(secondResult.progress.badgeIds).toContain('second-adventure')
  })

  it('awards the forest marathoner badge after twenty exercise minutes in one day', () => {
    const firstMission = chapters[0].missions[0]
    const secondMission = chapters[0].missions[1]
    const firstResult = completeMission(createInitialProgress(), firstMission, 19 * 60, new Date('2026-05-12T12:00:00'))
    const secondResult = completeMission(firstResult.progress, secondMission, 60, new Date('2026-05-12T13:00:00'))

    expect(firstResult.earnedBadgeIds).not.toContain('daily-20-minutes')
    expect(secondResult.progress.exerciseSecondsToday).toBe(20 * 60)
    expect(secondResult.earnedBadgeIds).toContain('daily-20-minutes')
    expect(secondResult.progress.badgeIds).toContain('daily-20-minutes')
  })

  it('does not award the streak badge after three active days with gaps', () => {
    const mission = chapters[0].missions[0]
    const dayOne = completeMission(createInitialProgress(), mission, 120, new Date('2026-05-12T12:00:00'))
    const dayTwo = completeMission(dayOne.progress, mission, 120, new Date('2026-05-15T12:00:00'))
    const dayThree = completeMission(dayTwo.progress, mission, 120, new Date('2026-05-18T12:00:00'))

    expect(dayThree.progress.streakDays).toBe(3)
    expect(dayThree.progress.consecutiveActiveDays).toBe(1)
    expect(dayThree.earnedBadgeIds).not.toContain('streak-3')
    expect(dayThree.progress.badgeIds).not.toContain('streak-3')
  })

  it('awards the streak badge after three active days in a row', () => {
    const mission = chapters[0].missions[0]
    const dayOne = completeMission(createInitialProgress(), mission, 120, new Date('2026-05-12T12:00:00'))
    const dayTwo = completeMission(dayOne.progress, mission, 120, new Date('2026-05-13T12:00:00'))
    const dayThree = completeMission(dayTwo.progress, mission, 120, new Date('2026-05-14T12:00:00'))

    expect(dayThree.progress.streakDays).toBe(3)
    expect(dayThree.progress.consecutiveActiveDays).toBe(3)
    expect(dayThree.earnedBadgeIds).toContain('streak-3')
    expect(dayThree.progress.badgeIds).toContain('streak-3')
  })

  it('loads legacy local progress without mission stars safely', () => {
    const legacyProgress = {
      childName: 'Ola',
      locale: 'pl',
      xp: 80,
      streakDays: 1,
      lastActiveDate: '2026-05-12',
      exerciseSecondsToday: 120,
      totalExerciseSeconds: 120,
      completedMissionIds: [
        chapters[0].missions[0].id,
        chapters[0].missions[1].id,
        chapters[0].missions[2].id,
      ],
      unlockedMissionIds: [],
      badgeIds: [],
      acceptedSafety: true,
    }

    localStorage.setItem(storageKey, JSON.stringify(legacyProgress))

    const loadedProgress = loadProgress()

    expect(loadedProgress.childName).toBe('Ola')
    expect(loadedProgress.consecutiveActiveDays).toBe(1)
    expect(loadedProgress.missionStars).toEqual({})
    expect(loadedProgress.unlockedMissionIds).toContain(chapters[0].missions[0].id)
    expect(loadedProgress.unlockedMissionIds).toContain(chapters[0].missions[3].id)
  })

  it('creates fresh progress with the requested locale', () => {
    const progress = createInitialProgress('en')

    expect(progress.locale).toBe('en')
    expect(progress.consecutiveActiveDays).toBe(0)
    expect(progress.unlockedMissionIds).toEqual([chapters[0].missions[0].id])
    expect(progress.acceptedSafety).toBe(false)
  })
})
