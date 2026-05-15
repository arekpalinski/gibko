export type Locale = 'pl' | 'en'

export type LocalizedText = Record<Locale, string>

export type Equipment = 'none' | 'softBall' | 'sensoryCushion' | 'sensoryMat'

export type ExerciseIcon =
  | 'back'
  | 'balance'
  | 'ball'
  | 'branch'
  | 'breath'
  | 'foot'
  | 'frog'
  | 'hip'
  | 'leaf'
  | 'mat'
  | 'river'
  | 'vine'

export type ExerciseDefinition = {
  id: string
  title: LocalizedText
  icon: ExerciseIcon
  equipment?: Equipment[]
}

export type Exercise = {
  id: string
  exerciseId: string
  title: LocalizedText
  description: LocalizedText
  durationLabel: LocalizedText
  repetitions: LocalizedText
  note?: LocalizedText
  icon: ExerciseIcon
  minutes: number
}

export type Mission = {
  id: string
  chapterId: string
  title: LocalizedText
  teaser: LocalizedText
  goal: LocalizedText
  equipment: Equipment[]
  xp: number
  estimatedMinutes: number
  durationLabel: LocalizedText
  exercises: Exercise[]
}

export type Chapter = {
  id: string
  title: LocalizedText
  description: LocalizedText
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
  missionStars: Record<string, number>
  unlockedMissionIds: string[]
  badgeIds: string[]
  acceptedSafety: boolean
}

export type MissionResult = {
  progress: Progress
  earnedBadgeIds: string[]
  starsEarned: number
  xpEarned: number
}
