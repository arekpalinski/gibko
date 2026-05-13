export type Locale = 'pl' | 'en'

export type Exercise = {
  id: string
  titleKey: string
  descriptionKey: string
  icon: 'branch' | 'leaf' | 'vine' | 'frog' | 'river'
  minutes: number
}

export type Mission = {
  id: string
  chapterId: string
  titleKey: string
  teaserKey: string
  xp: number
  estimatedMinutes: number
  exercises: Exercise[]
}

export type Chapter = {
  id: string
  titleKey: string
  descriptionKey: string
  badgeId: string
  missions: Mission[]
}

export type Badge = {
  id: string
  titleKey: string
  descriptionKey: string
  icon: 'gibbon' | 'leaf' | 'sun' | 'calendar' | 'weekend'
}

export type Progress = {
  childName: string
  locale: Locale
  xp: number
  streakDays: number
  lastActiveDate: string | null
  exerciseSecondsToday: number
  totalExerciseSeconds: number
  completedMissionIds: string[]
  unlockedMissionIds: string[]
  badgeIds: string[]
  acceptedSafety: boolean
}

export type MissionResult = {
  progress: Progress
  earnedBadgeIds: string[]
}
