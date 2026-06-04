import { chapters } from '../data/chapters'
import type { Locale, Mission, MissionResult, Progress } from '../types'

const STORAGE_KEY = 'gibko-progress-v1'

export const firstMissionId = chapters[0]?.missions[0]?.id ?? ''
export const ACTIVITY_WINDOW_DAYS = 30

export type ActivityDay = {
  active: boolean
  date: string
}

export type ActivityGrowthStageId =
  | 'sprout'
  | 'leaf'
  | 'branch'
  | 'young-tree'
  | 'strong-tree'
  | 'forest-guardian'

const ACTIVITY_GROWTH_STAGES: Array<{
  id: ActivityGrowthStageId
  max: number
  min: number
}> = [
  { id: 'sprout', min: 0, max: 5 },
  { id: 'leaf', min: 6, max: 10 },
  { id: 'branch', min: 11, max: 15 },
  { id: 'young-tree', min: 16, max: 20 },
  { id: 'strong-tree', min: 21, max: 25 },
  { id: 'forest-guardian', min: 26, max: ACTIVITY_WINDOW_DAYS },
]

export function createInitialProgress(locale: Locale = 'pl'): Progress {
  return {
    childName: '',
    locale,
    activeDates: [],
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

export function loadProgress(now = new Date()): Progress {
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

    if (!('activeDates' in parsed)) {
      progress.activeDates = parsed.lastActiveDate ? [parsed.lastActiveDate] : []
    }

    return normalizeProgress(progress, now)
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

export function getCanonicalMissionId(missionId: string) {
  const allMissions = chapters.flatMap((chapter) => chapter.missions)

  if (allMissions.some((mission) => mission.id === missionId)) {
    return missionId
  }

  const legacyMission = allMissions.find(
    (mission) => missionId === getLegacyMissionId(mission),
  )

  return legacyMission?.id ?? missionId
}

export function completeMission(
  progress: Progress,
  mission: Mission,
  actualSeconds = mission.estimatedMinutes * 60,
  now = new Date(),
  usedDifficultyHelp = false,
): MissionResult {
  const normalizedProgress = normalizeProgress(progress, now)
  const today = toDateKey(now)
  const yesterday = toDateKey(new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1))
  const activeDates = addActiveDate(normalizedProgress.activeDates, today)
  const alreadyCompleted = normalizedProgress.completedMissionIds.includes(mission.id)
  const activeDayCount = Math.max(0, normalizedProgress.streakDays)
  const previousConsecutiveActiveDays = normalizedProgress.lastActiveDate
    ? Math.max(1, normalizedProgress.consecutiveActiveDays)
    : 0
  const streakDays =
    normalizedProgress.lastActiveDate === today
      ? Math.max(1, activeDayCount)
      : activeDayCount + 1
  const consecutiveActiveDays =
    normalizedProgress.lastActiveDate === today
      ? Math.max(1, previousConsecutiveActiveDays)
      : normalizedProgress.lastActiveDate === yesterday
        ? previousConsecutiveActiveDays + 1
        : 1

  const completedMissionIds = alreadyCompleted
    ? normalizedProgress.completedMissionIds
    : [...normalizedProgress.completedMissionIds, mission.id]
  const exerciseSecondsToday =
    normalizedProgress.lastActiveDate === today
      ? normalizedProgress.exerciseSecondsToday + actualSeconds
      : actualSeconds

  const unlockedMissionIds = unlockNextMission(normalizedProgress.unlockedMissionIds, mission.id)
  const earnedBadgeIds = getEarnedBadges(
    { ...normalizedProgress, activeDates, completedMissionIds, consecutiveActiveDays, exerciseSecondsToday, streakDays },
    mission,
    now,
  )
  const badgeIds = Array.from(new Set([...normalizedProgress.badgeIds, ...earnedBadgeIds]))
  const starsEarned = calculateMissionStars(mission, actualSeconds, usedDifficultyHelp)
  const xpEarned = calculateMissionXp(mission, actualSeconds)
  const missionStars = {
    ...normalizedProgress.missionStars,
    [mission.id]: Math.max(normalizedProgress.missionStars[mission.id] ?? 0, starsEarned),
  }

  return {
    earnedBadgeIds,
    starsEarned,
    xpEarned,
    progress: {
      ...normalizedProgress,
      xp: normalizedProgress.xp + xpEarned,
      streakDays,
      consecutiveActiveDays,
      activeDates,
      lastActiveDate: today,
      exerciseSecondsToday,
      totalExerciseSeconds: normalizedProgress.totalExerciseSeconds + actualSeconds,
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

export function getLastActivityDays(activeDates: string[], now = new Date()): ActivityDay[] {
  const activeDateSet = new Set(normalizeDateKeyList(activeDates))

  return Array.from({ length: ACTIVITY_WINDOW_DAYS }, (_, index) => {
    const daysAgo = ACTIVITY_WINDOW_DAYS - 1 - index
    const date = new Date(now.getFullYear(), now.getMonth(), now.getDate() - daysAgo)
    const dateKey = toDateKey(date)

    return {
      active: activeDateSet.has(dateKey),
      date: dateKey,
    }
  })
}

export function getActivitySummary(progress: Pick<Progress, 'activeDates'>, now = new Date()) {
  const days = getLastActivityDays(progress.activeDates, now)
  const activeDays = days.filter((day) => day.active).length

  return {
    activeDays,
    days,
    stage: getActivityGrowthStage(activeDays),
  }
}

export function getActivityGrowthStage(activeDays: number): ActivityGrowthStageId {
  const safeActiveDays = Math.min(ACTIVITY_WINDOW_DAYS, Math.max(0, Math.floor(activeDays)))

  return (
    ACTIVITY_GROWTH_STAGES.find(
      (stage) => safeActiveDays >= stage.min && safeActiveDays <= stage.max,
    ) ?? ACTIVITY_GROWTH_STAGES[0]
  ).id
}

function getMissionFullRewardSeconds(mission: Mission) {
  return Math.max(1, getMissionPlannedSeconds(mission) * 0.85)
}

function unlockNextMission(unlockedMissionIds: string[], missionId: string) {
  const allMissions = chapters.flatMap((chapter) => chapter.missions)
  const currentIndex = allMissions.findIndex((mission) => mission.id === getCanonicalMissionId(missionId))
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

function normalizeProgress(progress: Progress, now = new Date()): Progress {
  const today = toDateKey(now)
  const normalized = normalizeProgressMissionIds({
    ...progress,
    activeDates: normalizeDateKeyList(progress.activeDates),
    consecutiveActiveDays: progress.consecutiveActiveDays ?? (progress.lastActiveDate ? 1 : 0),
    exerciseSecondsToday: progress.lastActiveDate === today ? progress.exerciseSecondsToday : 0,
    missionStars: progress.missionStars ?? {},
  })

  const unlockedMissionIds = normalizeUnlockedMissions(normalized)

  return {
    ...normalized,
    unlockedMissionIds,
  }
}

function normalizeProgressMissionIds(progress: Progress): Progress {
  const missionStars = Object.entries(progress.missionStars).reduce<Record<string, number>>(
    (normalizedStars, [missionId, stars]) => {
      const canonicalMissionId = getCanonicalMissionId(missionId)

      normalizedStars[canonicalMissionId] = Math.max(normalizedStars[canonicalMissionId] ?? 0, stars)

      return normalizedStars
    },
    {},
  )

  return {
    ...progress,
    completedMissionIds: normalizeMissionIdList(progress.completedMissionIds),
    missionStars,
    unlockedMissionIds: normalizeMissionIdList(progress.unlockedMissionIds),
  }
}

function normalizeMissionIdList(missionIds: string[]) {
  return Array.from(new Set(missionIds.map(getCanonicalMissionId)))
}

function addActiveDate(activeDates: string[], dateKey: string) {
  return normalizeDateKeyList([...activeDates, dateKey])
}

function normalizeDateKeyList(dateKeys: unknown) {
  if (!Array.isArray(dateKeys)) {
    return []
  }

  return Array.from(
    new Set(
      dateKeys.filter((dateKey): dateKey is string =>
        typeof dateKey === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateKey),
      ),
    ),
  ).sort()
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

function getLegacyMissionId(mission: Mission) {
  return `mission-${mission.number}-${mission.slug}`
}
