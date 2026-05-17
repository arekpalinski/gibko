import { chapters } from '../data/chapters'
import type { Locale, Mission, MissionResult, Progress } from '../types'

const STORAGE_KEY = 'gibko-progress-v1'

export const firstMissionId = chapters[0]?.missions[0]?.id ?? ''

export function createInitialProgress(locale: Locale = 'pl'): Progress {
  return {
    childName: '',
    locale,
    xp: 0,
    streakDays: 0,
    consecutiveActiveDays: 0,
    lastActiveDate: null,
    exerciseSecondsToday: 0,
    totalExerciseSeconds: 0,
    completedMissionIds: [],
    missionStars: {},
    unlockedMissionIds: firstMissionId ? [firstMissionId] : [],
    badgeIds: [],
    acceptedSafety: false,
  }
}

export function loadProgress(): Progress {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) {
    return createInitialProgress()
  }

  try {
    const parsed = JSON.parse(raw) as Partial<Progress>
    const progress = { ...createInitialProgress(parsed.locale), ...parsed } as Progress

    if (!('consecutiveActiveDays' in parsed)) {
      progress.consecutiveActiveDays = parsed.lastActiveDate ? 1 : 0
    }

    return normalizeProgress(progress)
  } catch {
    return createInitialProgress()
  }
}

export function saveProgress(progress: Progress) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
}

export function clearProgress() {
  localStorage.removeItem(STORAGE_KEY)
}

export function isMissionUnlocked(progress: Progress, missionId: string) {
  return progress.unlockedMissionIds.includes(missionId)
}

export function isMissionCompleted(progress: Progress, missionId: string) {
  return progress.completedMissionIds.includes(missionId)
}

export function completeMission(
  progress: Progress,
  mission: Mission,
  actualSeconds = mission.estimatedMinutes * 60,
  now = new Date(),
  usedDifficultyHelp = false,
): MissionResult {
  const today = toDateKey(now)
  const yesterday = toDateKey(new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1))
  const alreadyCompleted = progress.completedMissionIds.includes(mission.id)
  const activeDayCount = Math.max(0, progress.streakDays)
  const previousConsecutiveActiveDays = progress.lastActiveDate
    ? Math.max(1, progress.consecutiveActiveDays)
    : 0
  const streakDays =
    progress.lastActiveDate === today
      ? Math.max(1, activeDayCount)
      : activeDayCount + 1
  const consecutiveActiveDays =
    progress.lastActiveDate === today
      ? Math.max(1, previousConsecutiveActiveDays)
      : progress.lastActiveDate === yesterday
        ? previousConsecutiveActiveDays + 1
        : 1

  const completedMissionIds = alreadyCompleted
    ? progress.completedMissionIds
    : [...progress.completedMissionIds, mission.id]
  const exerciseSecondsToday =
    progress.lastActiveDate === today
      ? progress.exerciseSecondsToday + actualSeconds
      : actualSeconds

  const unlockedMissionIds = unlockNextMission(progress.unlockedMissionIds, mission.id)
  const earnedBadgeIds = getEarnedBadges(
    { ...progress, completedMissionIds, consecutiveActiveDays, exerciseSecondsToday, streakDays },
    mission,
    now,
  )
  const badgeIds = Array.from(new Set([...progress.badgeIds, ...earnedBadgeIds]))
  const starsEarned = calculateMissionStars(mission, actualSeconds, usedDifficultyHelp)
  const xpEarned = calculateMissionXp(mission, actualSeconds)
  const missionStars = {
    ...progress.missionStars,
    [mission.id]: Math.max(progress.missionStars[mission.id] ?? 0, starsEarned),
  }

  return {
    earnedBadgeIds,
    starsEarned,
    xpEarned,
    progress: {
      ...progress,
      xp: progress.xp + xpEarned,
      streakDays,
      consecutiveActiveDays,
      lastActiveDate: today,
      exerciseSecondsToday,
      totalExerciseSeconds: progress.totalExerciseSeconds + actualSeconds,
      completedMissionIds,
      missionStars,
      unlockedMissionIds,
      badgeIds,
    },
  }
}

export function calculateMissionStars(
  mission: Mission,
  actualSeconds: number,
  usedDifficultyHelp = false,
) {
  if (usedDifficultyHelp) {
    return 1
  }

  const completionRatio = calculateMissionCompletionRatio(mission, actualSeconds)

  if (completionRatio >= 1) {
    return 3
  }

  return completionRatio >= 0.5 ? 2 : 1
}

export function calculateMissionXp(mission: Mission, actualSeconds: number) {
  const safeSeconds = Math.max(0, actualSeconds)
  const requiredSeconds = getMissionFullRewardSeconds(mission)
  const plannedSeconds = getMissionPlannedSeconds(mission)
  const baseXp = Math.min(mission.xp, Math.round(mission.xp * (safeSeconds / requiredSeconds)))
  const extraXp = safeSeconds > plannedSeconds ? 10 : 0

  return baseXp + extraXp
}

export function calculateMissionCompletionRatio(mission: Mission, actualSeconds: number) {
  const safeSeconds = Math.max(0, actualSeconds)
  const requiredSeconds = getMissionFullRewardSeconds(mission)

  return Math.min(1, safeSeconds / requiredSeconds)
}

export function getMissionPlannedSeconds(mission: Mission) {
  return (
    mission.exercises.reduce((sum, exercise) => sum + exercise.estimatedMinutes * 60, 0) ||
    mission.estimatedMinutes * 60
  )
}

function getMissionFullRewardSeconds(mission: Mission) {
  return Math.max(1, getMissionPlannedSeconds(mission) * 0.85)
}

function unlockNextMission(unlockedMissionIds: string[], missionId: string) {
  const allMissions = chapters.flatMap((chapter) => chapter.missions)
  const currentIndex = allMissions.findIndex((mission) => mission.id === missionId)
  const nextMission = allMissions[currentIndex + 1]

  if (!nextMission || unlockedMissionIds.includes(nextMission.id)) {
    return unlockedMissionIds
  }

  return [...unlockedMissionIds, nextMission.id]
}

function getEarnedBadges(progress: Progress, mission: Mission, now: Date) {
  const earned: string[] = []
  const hour = now.getHours()
  const day = now.getDay()
  const chapter = chapters.find((candidate) => candidate.id === mission.chapterId)
  const chapterCompleted =
    chapter?.missions.every((candidate) => progress.completedMissionIds.includes(candidate.id)) ??
    false

  if (chapterCompleted && chapter && !progress.badgeIds.includes(chapter.badgeId)) {
    earned.push(chapter.badgeId)
  }

  if (hour < 10 && !progress.badgeIds.includes('morning-leaf')) {
    earned.push('morning-leaf')
  }

  if (hour >= 18 && !progress.badgeIds.includes('evening-firefly')) {
    earned.push('evening-firefly')
  }

  if (progress.completedMissionIds.length >= 2 && !progress.badgeIds.includes('second-adventure')) {
    earned.push('second-adventure')
  }

  if (progress.exerciseSecondsToday >= 20 * 60 && !progress.badgeIds.includes('daily-20-minutes')) {
    earned.push('daily-20-minutes')
  }

  if (progress.consecutiveActiveDays >= 3 && !progress.badgeIds.includes('streak-3')) {
    earned.push('streak-3')
  }

  if ((day === 0 || day === 6) && !progress.badgeIds.includes('weekend-grove')) {
    earned.push('weekend-grove')
  }

  return earned
}

function normalizeProgress(progress: Progress): Progress {
  const normalized = {
    ...progress,
    consecutiveActiveDays: progress.consecutiveActiveDays ?? (progress.lastActiveDate ? 1 : 0),
    missionStars: progress.missionStars ?? {},
  }

  const unlockedMissionIds = normalizeUnlockedMissions(normalized)

  return {
    ...normalized,
    unlockedMissionIds,
  }
}

function normalizeUnlockedMissions(progress: Progress) {
  const unlockedMissionIds = new Set(progress.unlockedMissionIds)

  if (firstMissionId) {
    unlockedMissionIds.add(firstMissionId)
  }

  progress.completedMissionIds.forEach((missionId) => {
    unlockNextMission(Array.from(unlockedMissionIds), missionId).forEach((unlockedMissionId) => {
      unlockedMissionIds.add(unlockedMissionId)
    })
  })

  return Array.from(unlockedMissionIds)
}

function toDateKey(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}
