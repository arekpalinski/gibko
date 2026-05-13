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
    lastActiveDate: null,
    exerciseSecondsToday: 0,
    totalExerciseSeconds: 0,
    completedMissionIds: [],
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
    return normalizeProgress({ ...createInitialProgress(parsed.locale), ...parsed } as Progress)
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
): MissionResult {
  const today = toDateKey(now)
  const yesterday = toDateKey(new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1))
  const alreadyCompleted = progress.completedMissionIds.includes(mission.id)
  const streakDays =
    progress.lastActiveDate === today
      ? progress.streakDays
      : progress.lastActiveDate === yesterday
        ? progress.streakDays + 1
        : 1

  const completedMissionIds = alreadyCompleted
    ? progress.completedMissionIds
    : [...progress.completedMissionIds, mission.id]

  const unlockedMissionIds = unlockNextMission(progress.unlockedMissionIds, mission.id)
  const earnedBadgeIds = getEarnedBadges(
    { ...progress, completedMissionIds, streakDays },
    mission,
    now,
  )
  const badgeIds = Array.from(new Set([...progress.badgeIds, ...earnedBadgeIds]))

  return {
    earnedBadgeIds,
    progress: {
      ...progress,
      xp: progress.xp + mission.xp,
      streakDays,
      lastActiveDate: today,
      exerciseSecondsToday:
        progress.lastActiveDate === today
          ? progress.exerciseSecondsToday + actualSeconds
          : actualSeconds,
      totalExerciseSeconds: progress.totalExerciseSeconds + actualSeconds,
      completedMissionIds,
      unlockedMissionIds,
      badgeIds,
    },
  }
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

  if (progress.streakDays >= 3 && !progress.badgeIds.includes('streak-3')) {
    earned.push('streak-3')
  }

  if ((day === 0 || day === 6) && !progress.badgeIds.includes('weekend-grove')) {
    earned.push('weekend-grove')
  }

  return earned
}

function normalizeProgress(progress: Progress): Progress {
  if (!firstMissionId || progress.unlockedMissionIds.includes(firstMissionId)) {
    return progress
  }

  return {
    ...progress,
    unlockedMissionIds: [firstMissionId, ...progress.unlockedMissionIds],
  }
}

function toDateKey(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}
