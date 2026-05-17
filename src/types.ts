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

export type ExerciseCategory =
  | 'ankles'
  | 'back'
  | 'balance'
  | 'boneStrength'
  | 'breathing'
  | 'calm'
  | 'calves'
  | 'chest'
  | 'control'
  | 'coordination'
  | 'core'
  | 'energy'
  | 'feet'
  | 'fullBody'
  | 'glutes'
  | 'hips'
  | 'legs'
  | 'mobility'
  | 'neck'
  | 'posture'
  | 'recovery'
  | 'sensory'
  | 'shoulders'
  | 'strength'
  | 'stretching'
  | 'warmup'

export type Exercise = {
  id: string
  title: LocalizedText
  icon: ExerciseIcon
  description: LocalizedText
  estimatedMinutes: number
  estimatedTimeLabel: LocalizedText
  repetitions: LocalizedText
  note?: LocalizedText
  challengeOption?: LocalizedText
  equipment: Equipment[]
  energyLeaves: number
  categories: ExerciseCategory[]
}

export type Mission = {
  id: string
  number: number
  slug: string
  chapterId: string
  title: LocalizedText
  teaser: LocalizedText
  goal: LocalizedText
  exerciseIds: string[]
  equipment: Equipment[]
  xp: number
  estimatedMinutes: number
  estimatedTimeLabel: LocalizedText
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
  icon: 'firefly' | 'footprints' | 'gibbon' | 'leaf' | 'sun' | 'calendar' | 'weekend'
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
