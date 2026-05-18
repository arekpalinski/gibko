import type { Exercise, ExerciseCategory, LocalizedText, Mission } from '../types'
import {
  type ExerciseId,
  exerciseLibrary,
  getAdventureEnergyLeaves,
  getAdventureEquipment,
  getAdventureEstimatedMinutes,
  getAdventureEstimatedTimeLabel,
  getExercises,
} from './exercises'

const text = (pl: string, en: string): LocalizedText => ({ pl, en })

export const CUSTOM_ADVENTURE_STORAGE_KEY = 'gibko-custom-adventure-v1'

export type CustomAdventureOptions = {
  exerciseCount: number
  minMinutes: number
  maxMinutes: number
  categories: ExerciseCategory[]
}

export type CustomAdventureDraft = {
  options: CustomAdventureOptions
  exerciseIds: ExerciseId[]
}

export const DEFAULT_CUSTOM_ADVENTURE_OPTIONS: CustomAdventureOptions = {
  exerciseCount: 3,
  minMinutes: 10,
  maxMinutes: 15,
  categories: [],
}

export const customAdventureCategoryLabels: Record<ExerciseCategory, LocalizedText> = {
  feet: text('Stopy', 'Feet'),
  ankles: text('Kostki', 'Ankles'),
  calves: text('Łydki', 'Calves'),
  thighs: text('Uda', 'Thighs'),
  hips: text('Biodra', 'Hips'),
  glutes: text('Pośladki', 'Glutes'),
  legs: text('Nogi', 'Legs'),
  back: text('Plecy', 'Back'),
  shoulders: text('Ramiona i barki', 'Shoulders'),
  neck: text('Szyja', 'Neck'),
  chest: text('Klatka piersiowa', 'Chest'),
  trunk: text('Brzuch i tułów', 'Trunk'),
}

export function getAvailableCustomAdventureCategories() {
  const usedCategories = new Set<ExerciseCategory>()

  Object.values(exerciseLibrary).forEach((exercise) => {
    exercise.categories.forEach((category) => usedCategories.add(category))
  })

  return (Object.keys(customAdventureCategoryLabels) as ExerciseCategory[]).filter((category) =>
    usedCategories.has(category),
  )
}

export function normalizeCustomAdventureOptions(
  options: Partial<CustomAdventureOptions> = {},
): CustomAdventureOptions {
  const minMinutes = clampNumber(options.minMinutes ?? DEFAULT_CUSTOM_ADVENTURE_OPTIONS.minMinutes, 5, 25)
  const maxMinutes = clampNumber(options.maxMinutes ?? DEFAULT_CUSTOM_ADVENTURE_OPTIONS.maxMinutes, 5, 25)
  const sortedMinMinutes = Math.min(minMinutes, maxMinutes)
  const sortedMaxMinutes = Math.max(minMinutes, maxMinutes)
  const categories = (options.categories ?? []).filter((category): category is ExerciseCategory =>
    category in customAdventureCategoryLabels,
  )

  return {
    exerciseCount: clampNumber(
      options.exerciseCount ?? DEFAULT_CUSTOM_ADVENTURE_OPTIONS.exerciseCount,
      1,
      5,
    ),
    minMinutes: sortedMinMinutes,
    maxMinutes: sortedMaxMinutes,
    categories: Array.from(new Set(categories)),
  }
}

export function generateCustomAdventureDraft(
  options: Partial<CustomAdventureOptions> = {},
  previousExerciseIds: ExerciseId[] = [],
  random = Math.random,
): CustomAdventureDraft {
  const normalizedOptions = normalizeCustomAdventureOptions(options)
  const matchingExercises = getMatchingExercises(normalizedOptions.categories)
  const candidateExercises =
    matchingExercises.length >= normalizedOptions.exerciseCount
      ? matchingExercises
      : Object.values(exerciseLibrary)
  let bestExercises: Exercise[] = []
  let bestScore = Number.POSITIVE_INFINITY

  for (let attempt = 0; attempt < 120; attempt += 1) {
    const pickedExercises = shuffle(candidateExercises, random).slice(0, normalizedOptions.exerciseCount)
    const score = scoreExerciseSet(pickedExercises, normalizedOptions, previousExerciseIds)

    if (score < bestScore) {
      bestExercises = pickedExercises
      bestScore = score
    }
  }

  if (bestExercises.length === 0) {
    bestExercises = Object.values(exerciseLibrary).slice(0, normalizedOptions.exerciseCount)
  }

  return {
    options: normalizedOptions,
    exerciseIds: bestExercises.map((exercise) => exercise.id as ExerciseId),
  }
}

export function createCustomAdventureMission(exerciseIds: ExerciseId[]): Mission {
  const exercises = getExercises(exerciseIds)
  const idSeed = exerciseIds.join('-')

  return {
    id: `custom-adventure-${hashString(idSeed)}`,
    number: 0,
    slug: 'custom-adventure',
    chapterId: 'custom',
    title: text('Przygoda po swojemu', 'My Own Adventure'),
    teaser: text(
      'Gibko dobrał krótki zestaw ćwiczeń specjalnie na dziś.',
      'Gibko picked a short exercise set just for today.',
    ),
    goal: text(
      'ćwiczenia dobrane z wybranych kategorii',
      'exercises selected from chosen categories',
    ),
    exerciseIds,
    exercises,
    equipment: getAdventureEquipment(exercises),
    xp: getAdventureEnergyLeaves(exercises),
    estimatedMinutes: getAdventureEstimatedMinutes(exercises),
    estimatedTimeLabel: getAdventureEstimatedTimeLabel(exercises),
  }
}

export function saveCustomAdventureDraft(draft: CustomAdventureDraft) {
  localStorage.setItem(CUSTOM_ADVENTURE_STORAGE_KEY, JSON.stringify(draft))
}

export function loadCustomAdventureDraft(): CustomAdventureDraft | null {
  const raw = localStorage.getItem(CUSTOM_ADVENTURE_STORAGE_KEY)

  if (!raw) {
    return null
  }

  try {
    const parsed = JSON.parse(raw) as Partial<CustomAdventureDraft>
    const exerciseIds = (parsed.exerciseIds ?? []).filter(isExerciseId)

    if (exerciseIds.length === 0) {
      return null
    }

    return {
      options: normalizeCustomAdventureOptions(parsed.options),
      exerciseIds,
    }
  } catch {
    return null
  }
}

function getMatchingExercises(categories: ExerciseCategory[]) {
  const exercises = Object.values(exerciseLibrary)

  if (categories.length === 0) {
    return exercises
  }

  return exercises.filter((exercise) =>
    exercise.categories.some((category) => categories.includes(category)),
  )
}

function scoreExerciseSet(
  exercises: Exercise[],
  options: CustomAdventureOptions,
  previousExerciseIds: ExerciseId[],
) {
  const estimatedMinutes = getAdventureEstimatedMinutes(exercises)
  const lowerDistance = Math.max(0, options.minMinutes - estimatedMinutes)
  const upperDistance = Math.max(0, estimatedMinutes - options.maxMinutes)
  const timePenalty = (lowerDistance + upperDistance) * 100
  const sameSetPenalty = areSameExerciseIds(
    exercises.map((exercise) => exercise.id as ExerciseId),
    previousExerciseIds,
  )
    ? 10000
    : 0

  return timePenalty + sameSetPenalty + Math.abs(options.exerciseCount - exercises.length) * 200
}

function areSameExerciseIds(first: ExerciseId[], second: ExerciseId[]) {
  if (first.length !== second.length) {
    return false
  }

  const firstSorted = [...first].sort()
  const secondSorted = [...second].sort()

  return firstSorted.every((exerciseId, index) => exerciseId === secondSorted[index])
}

function shuffle<T>(items: T[], random: () => number) {
  const shuffled = [...items]

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1))
    const current = shuffled[index]
    shuffled[index] = shuffled[swapIndex]
    shuffled[swapIndex] = current
  }

  return shuffled
}

function clampNumber(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, Math.round(value)))
}

function isExerciseId(value: unknown): value is ExerciseId {
  return typeof value === 'string' && value in exerciseLibrary
}

function hashString(value: string) {
  let hash = 0

  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) >>> 0
  }

  return hash.toString(36)
}
