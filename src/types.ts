export type Locale = 'pl' | 'en'

export type Exercise = {
  id: string
  titleKey: string
  descriptionKey: string
  icon: 'rocket' | 'radar' | 'orbit' | 'cat' | 'astronaut'
  minutes: number
}

export type Mission = {
  id: string
  worldId: string
  titleKey: string
  teaserKey: string
  xp: number
  estimatedMinutes: number
  exercises: Exercise[]
}

export type World = {
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
  icon: 'sparkles' | 'sun' | 'calendar' | 'weekend'
}

export type Progress = {
  childName: string
  locale: Locale
  xp: number
  streakDays: number
  lastActiveDate: string | null
  exerciseMinutesToday: number
  completedMissionIds: string[]
  unlockedMissionIds: string[]
  badgeIds: string[]
  acceptedSafety: boolean
}

export type MissionResult = {
  progress: Progress
  earnedBadgeIds: string[]
}
