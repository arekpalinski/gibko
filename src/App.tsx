import {
  Award,
  BookOpen,
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  Download,
  Footprints,
  HeartPulse,
  Home,
  Languages,
  Leaf,
  ListChecks,
  Lock,
  Minus,
  PersonStanding,
  Play,
  Plus,
  RotateCcw,
  Settings,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Sun,
  TreePine,
  User,
  Waves,
} from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { Link, NavLink, Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom'
import { badges } from './data/badges'
import { chapters } from './data/chapters'
import {
  DEFAULT_CUSTOM_ADVENTURE_OPTIONS,
  createCustomAdventureMission,
  customAdventureCategoryLabels,
  generateCustomAdventureDraft,
  getAvailableCustomAdventureCategories,
  loadCustomAdventureDraft,
  normalizeCustomAdventureOptions,
  saveCustomAdventureDraft,
} from './data/customAdventure'
import { t } from './i18n/messages'
import {
  clearProgress,
  completeMission,
  createInitialProgress,
  isMissionCompleted,
  isMissionUnlocked,
  loadProgress,
  saveProgress,
} from './state/progress'
import type { Badge, Exercise, ExerciseCategory, LocalizedText, Mission, Progress } from './types'

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>
}

type ExerciseSessionState = {
  completed: boolean
  seconds: number
  started: boolean
  usedDifficultyHelp: boolean
  visited: boolean
}

const assetPath = (fileName: string) => `${import.meta.env.BASE_URL}assets/${fileName}`
const GIBKO_LOGO_SRC = assetPath('gibko-logo-transparent.webp')
const GIBKO_MASCOT_SRC = assetPath('gibko-mascot-stretch-transparent.webp')
const GIBKO_HELLO_SRC = assetPath('gibko-hello-transparent.webp')
const GIBKO_PROFILE_AVATAR_SRC = assetPath('gibko-profile-avatar.webp')
const GIBKO_CUSTOM_ADVENTURE_SRC = assetPath('gibko-custom-adventure.webp')
const GIBKO_CUSTOM_PREVIEW_SRC = assetPath('gibko-custom-preview.webp')
const MAP_RAINFOREST_BOARD_SRC = assetPath('map-rainforest-board.webp')
const MAP_RAINFOREST_THUMB_SRC = assetPath('map-rainforest-thumb.webp')
const MAP_MISTY_THUMB_SRC = assetPath('map-misty-thumb.webp')
const GIBKO_NEXT_CHAPTER_SRC = assetPath('gibko-next-chapter.webp')
const MISSION_COMPLETED_IMAGES = [
  assetPath('gibko-mission-completed-1.webp'),
  assetPath('gibko-mission-completed-2.webp'),
]
const EXERCISE_MASCOT_IMAGES = [1, 2, 3, 4].map((index) =>
  assetPath(`gibko-exercise-${index}.webp`),
)
const COMPLETION_IMAGE_STORAGE_KEY = 'gibko-completion-image-index'
const EXPLORER_TITLE_STEP = 1000
const EXPLORER_TITLES: LocalizedText[] = [
  { pl: 'Mały Listek', en: 'Little Leaf' },
  { pl: 'Zwinna Gałązka', en: 'Nimble Twig' },
  { pl: 'Leśny Tropiciel', en: 'Forest Tracker' },
  { pl: 'Przyjaciel Lian', en: 'Vine Friend' },
  { pl: 'Strażnik Polany', en: 'Clearing Guardian' },
  { pl: 'Wędrowiec Wodospadu', en: 'Waterfall Wanderer' },
  { pl: 'Odkrywca Koron Drzew', en: 'Canopy Explorer' },
  { pl: 'Mistrz Leśnego Rytmu', en: 'Forest Rhythm Master' },
  { pl: 'Strażnik Wielkiego Lasu', en: 'Great Forest Guardian' },
  { pl: 'Legenda Koron Drzew', en: 'Canopy Legend' },
]
export const MAP_REALM_TEASERS: LocalizedText[] = [
  {
    pl: 'Ćwicz, zbieraj listki i odkrywaj nowe krainy!',
    en: 'Exercise, collect leaves, and discover new realms!',
  },
  {
    pl: 'Ruszaj się, zbieraj listki i idź dalej!',
    en: 'Move, collect leaves, and keep going!',
  },
  {
    pl: 'Każde ćwiczenie przybliża Cię do nowej krainy!',
    en: 'Every exercise brings you closer to a new realm!',
  },
  {
    pl: 'Ćwicz z Gibko i odkrywaj kolejne krainy!',
    en: 'Exercise with Gibko and discover more realms!',
  },
  {
    pl: 'Zrób przygodę i ruszaj do kolejnej krainy!',
    en: 'Finish an adventure and move toward the next realm!',
  },
  {
    pl: 'Rozciągaj się, zbieraj listki i odkrywaj las!',
    en: 'Stretch, collect leaves, and discover the forest!',
  },
  {
    pl: 'Każdy ruch prowadzi dalej!',
    en: 'Every move leads you onward!',
  },
]

export function App() {
  const location = useLocation()
  const [progress, setProgressState] = useState(loadProgress)
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null)

  useEffect(() => {
    saveProgress(progress)
    document.documentElement.lang = progress.locale
  }, [progress])

  useEffect(() => {
    const handler = (event: Event) => {
      event.preventDefault()
      setInstallPrompt(event as BeforeInstallPromptEvent)
    }
    const clearInstallPrompt = () => setInstallPrompt(null)

    window.addEventListener('beforeinstallprompt', handler)
    window.addEventListener('appinstalled', clearInstallPrompt)

    return () => {
      window.removeEventListener('beforeinstallprompt', handler)
      window.removeEventListener('appinstalled', clearInstallPrompt)
    }
  }, [])

  const setProgress = (next: Progress) => {
    setProgressState(next)
  }

  const promptInstall = async () => {
    if (!installPrompt) {
      return
    }

    await installPrompt.prompt()
    setInstallPrompt(null)
  }

  const translate = (key: string, values?: Record<string, string | number>) =>
    t(progress.locale, key, values)
  const hideBottomNav = shouldHideBottomNav(location.pathname)

  if (!progress.acceptedSafety || !progress.childName) {
    return (
      <Onboarding
        canInstall={installPrompt !== null}
        onInstall={promptInstall}
        progress={progress}
        setProgress={setProgress}
        translate={translate}
      />
    )
  }

  return (
    <div className="app-shell">
      <main className="phone-frame">
        <Routes>
          <Route
            path="/"
            element={
              <HomeScreen
                canInstall={installPrompt !== null}
                onInstall={promptInstall}
                progress={progress}
                translate={translate}
              />
            }
          />
          <Route path="/map" element={<MapScreen progress={progress} translate={translate} />} />
          <Route
            path="/custom-adventure/setup"
            element={<CustomAdventureSetupScreen progress={progress} translate={translate} />}
          />
          <Route
            path="/custom-adventure/preview"
            element={<CustomAdventurePreviewScreen progress={progress} translate={translate} />}
          />
          <Route
            path="/custom-adventure/play"
            element={
              <MissionScreen
                customAdventure
                progress={progress}
                setProgress={setProgress}
                translate={translate}
              />
            }
          />
          <Route
            path="/chapter/:chapterId/adventure/:adventureSlug"
            element={
              <MissionScreen
                progress={progress}
                setProgress={setProgress}
                translate={translate}
              />
            }
          />
          <Route
            path="/mission/:missionId"
            element={
              <MissionScreen
                progress={progress}
                setProgress={setProgress}
                translate={translate}
              />
            }
          />
          <Route path="/profile" element={<ProfileScreen progress={progress} translate={translate} />} />
          <Route path="/badges" element={<BadgesScreen progress={progress} translate={translate} />} />
          <Route
            path="/settings"
            element={<SettingsScreen progress={progress} setProgress={setProgress} translate={translate} />}
          />
        </Routes>
        {!hideBottomNav ? <BottomNav translate={translate} /> : null}
      </main>
    </div>
  )
}

function shouldHideBottomNav(pathname: string) {
  return (
    pathname === '/custom-adventure/play' ||
    pathname.startsWith('/mission/') ||
    (pathname.startsWith('/chapter/') && pathname.includes('/adventure/'))
  )
}

function Onboarding({
  canInstall,
  onInstall,
  progress,
  setProgress,
  translate,
}: {
  canInstall: boolean
  onInstall: () => void
  progress: Progress
  setProgress: (progress: Progress) => void
  translate: (key: string, values?: Record<string, string | number>) => string
}) {
  const [step, setStep] = useState<'intro' | 'setup'>('intro')
  const [name, setName] = useState(progress.childName)
  const navigate = useNavigate()

  return (
    <div className="app-shell">
      <main className="phone-frame onboarding-frame">
        {step === 'intro' ? (
          <section className="intro-screen">
            <JungleDecor />
            <img className="intro-logo" src={GIBKO_LOGO_SRC} alt="Gibko" />
            <h1>{translate('onboarding.title')}</h1>
            <p>{translate('onboarding.subtitle')}</p>
            <div className="onboarding-actions">
              <button className="primary-action wide" onClick={() => setStep('setup')} type="button">
                {translate('onboarding.start')}
                <ChevronRight size={20} />
              </button>
              {canInstall && (
                <button className="secondary-action install-action wide" onClick={onInstall} type="button">
                  <Download size={20} />
                  {translate('home.install')}
                </button>
              )}
            </div>
            <ProgressDots activeIndex={0} />
          </section>
        ) : (
          <section className="setup-screen">
            <button className="round-button" onClick={() => setStep('intro')} type="button">
              <ChevronLeft />
            </button>
            <img className="setup-logo" src={GIBKO_LOGO_SRC} alt="Gibko" />
            <h1>{translate('onboarding.nameTitle')}</h1>
            <p>{translate('onboarding.nameSubtitle')}</p>

            <label className="field-label">
              <span>{translate('onboarding.nameLabel')}</span>
              <input
                maxLength={18}
                onChange={(event) => setName(event.target.value)}
                placeholder={translate('onboarding.namePlaceholder')}
                value={name}
              />
            </label>

            <p className="section-label">{translate('onboarding.language')}</p>
            <LanguageChoices progress={progress} setProgress={setProgress} />

            <div className="safety-note">
              <ShieldCheck size={20} />
              <div>
                <strong>{translate('onboarding.safetyTitle')}</strong>
                <p>{translate('onboarding.safetyBody')}</p>
              </div>
            </div>

            <button
              className="primary-action wide"
              disabled={!name.trim()}
              onClick={() => {
                navigate('/')
                setProgress({
                  ...progress,
                  childName: name.trim(),
                  acceptedSafety: true,
                })
              }}
              type="button"
            >
              {translate('onboarding.next')}
              <ChevronRight size={20} />
            </button>
          </section>
        )}
      </main>
    </div>
  )
}

function HomeScreen({
  canInstall,
  onInstall,
  progress,
  translate,
}: {
  canInstall: boolean
  onInstall: () => void
  progress: Progress
  translate: (key: string, values?: Record<string, string | number>) => string
}) {
  const nextAdventure = useMemo(
    () => findNextAdventure(progress) ?? findFirstUnlockedAdventure(progress) ?? chapters[0].missions[0],
    [progress],
  )

  return (
    <Screen className="home-screen">
      <header className="top-row">
        <Wordmark />
        {canInstall ? (
          <button className="install-chip-button" onClick={onInstall} type="button">
            <Download size={18} />
            <span>{translate('home.install')}</span>
          </button>
        ) : (
          <span className="top-row-spacer" />
        )}
      </header>

      <section className="home-hero">
        <div>
          <h1>{translate('home.greeting', { name: progress.childName })}</h1>
          <p>{translate('home.subtitle')}</p>
        </div>
        <img className="hello-mascot" src={GIBKO_HELLO_SRC} alt="Gibko waving hello" />
      </section>

      <StatsRow progress={progress} translate={translate} />

      <section className="mission-card">
        <div className="mission-card-copy">
          <p className="eyebrow">{translate('home.dailyMission')}</p>
          <h2>{localize(progress.locale, nextAdventure.title)}</h2>
          <MissionMeta locale={progress.locale} mission={nextAdventure} />
          <Link className="primary-action" to={getAdventurePath(nextAdventure)}>
            {isMissionCompleted(progress, nextAdventure.id)
              ? translate('mission.repeat')
              : translate('mission.start')}
            <ChevronRight size={20} />
          </Link>
        </div>
        <img className="mission-mascot" src={GIBKO_MASCOT_SRC} alt="Gibko stretching" />
      </section>

      <section className="custom-adventure-card">
        <div className="custom-adventure-copy">
          <p className="eyebrow">{translate('custom.eyebrow')}</p>
          <h2>{translate('custom.homeTitle')}</h2>
          <p>{translate('custom.homeBody')}</p>
          <Link className="primary-action" to="/custom-adventure/setup">
            {translate('custom.homeAction')}
            <ChevronRight size={20} />
          </Link>
        </div>
        <img
          className="custom-adventure-mascot"
          src={GIBKO_CUSTOM_ADVENTURE_SRC}
          alt={translate('custom.homeImageAlt')}
        />
      </section>
    </Screen>
  )
}

function MapScreen({
  progress,
  translate,
}: {
  progress: Progress
  translate: (key: string, values?: Record<string, string | number>) => string
}) {
  const chapter = chapters[0]
  const completedCount = chapter.missions.filter((mission) => isMissionCompleted(progress, mission.id)).length
  const mistyForestTitle = { pl: 'Mglisty las', en: 'Misty Forest' }
  const nextRealmUnlocked = false
  const realmTeaser = useMemo(
    () => MAP_REALM_TEASERS[Math.floor(Math.random() * MAP_REALM_TEASERS.length)],
    [],
  )
  const nodes = [
    { x: '23%', y: '12%' },
    { x: '52%', y: '12%' },
    { x: '80%', y: '15%' },
    { x: '66%', y: '28%' },
    { x: '38%', y: '27%' },
    { x: '18%', y: '42%' },
    { x: '48%', y: '44%' },
    { x: '78%', y: '42%' },
    { x: '84%', y: '55%' },
    { x: '58%', y: '55%' },
    { x: '30%', y: '55%' },
    { x: '18%', y: '75%' },
    { x: '45%', y: '78%' },
    { x: '72%', y: '75%' },
    { x: '84%', y: '93%' },
    { x: '64%', y: '94%' },
    { x: '42%', y: '93%' },
    { x: '20%', y: '94%' },
  ]

  return (
    <Screen className="map-screen">
      <header className="map-header">
        <Link className="round-button" to="/">
          <ChevronLeft />
        </Link>
        <span className="map-screen-label">{translate('nav.map')}</span>
        <div className="xp-chip">
          <Leaf size={16} />
          {progress.xp}
        </div>
      </header>

      <section className="realm-switcher" aria-label={translate('map.realmSelector')}>
        <button aria-label={translate('map.previousRealm')} className="realm-arrow" disabled type="button">
          <ChevronLeft />
        </button>
        <div className="realm-track">
          <div className="realm-item active">
            <img src={MAP_RAINFOREST_THUMB_SRC} alt="" />
            <div>
              <strong>{localize(progress.locale, chapter.title)}</strong>
              <span>
                <Leaf size={15} />
                {translate('map.progress', {
                  completed: completedCount,
                  total: chapter.missions.length,
                })}
              </span>
            </div>
          </div>
          <div className={`realm-item next ${nextRealmUnlocked ? '' : 'locked'}`}>
            <img src={MAP_MISTY_THUMB_SRC} alt="" />
            <div>
              <strong>{localize(progress.locale, mistyForestTitle)}</strong>
              <span aria-label={translate('map.lockedRealm')} className="realm-lock-icon" role="img">
                <Lock size={16} />
              </span>
            </div>
          </div>
        </div>
        <button aria-label={translate('map.nextRealm')} className="realm-arrow" type="button">
          <ChevronRight />
        </button>
      </section>

      <section className="forest-map" aria-label={localize(progress.locale, chapter.title)}>
        <ForestMapArt />
        {nodes.map((node, index) => {
          const mission = chapter.missions[index]
          const unlocked = mission ? isMissionUnlocked(progress, mission.id) : false
          const completed = mission ? isMissionCompleted(progress, mission.id) : false
          const isCurrent = mission ? unlocked && !completed : false

          return (
            <MapNode
              completed={completed}
              index={index + 1}
              isCurrent={isCurrent}
              key={index}
              mission={mission}
              position={node}
              stars={mission ? progress.missionStars[mission.id] ?? 1 : 0}
              locale={progress.locale}
              translate={translate}
              unlocked={unlocked}
            />
          )
        })}
      </section>

      <section className="realm-teaser-card">
        <img className="realm-teaser-image" src={GIBKO_NEXT_CHAPTER_SRC} alt="" />
        <p className="realm-teaser-message">{localize(progress.locale, realmTeaser)}</p>
      </section>
    </Screen>
  )
}

function CustomAdventureSetupScreen({
  progress,
  translate,
}: {
  progress: Progress
  translate: (key: string, values?: Record<string, string | number>) => string
}) {
  const navigate = useNavigate()
  const availableCategories = getAvailableCustomAdventureCategories()
  const [options, setOptions] = useState(() =>
    normalizeCustomAdventureOptions(loadCustomAdventureDraft()?.options ?? DEFAULT_CUSTOM_ADVENTURE_OPTIONS),
  )

  const updateOptions = (nextOptions: Partial<typeof options>) => {
    setOptions((currentOptions) => normalizeCustomAdventureOptions({ ...currentOptions, ...nextOptions }))
  }

  const toggleCategory = (category: ExerciseCategory) => {
    updateOptions({
      categories: options.categories.includes(category)
        ? options.categories.filter((selectedCategory) => selectedCategory !== category)
        : [...options.categories, category],
    })
  }

  const buildAdventure = () => {
    const draft = generateCustomAdventureDraft(options, loadCustomAdventureDraft()?.exerciseIds ?? [])
    saveCustomAdventureDraft(draft)
    navigate('/custom-adventure/preview')
  }

  return (
    <Screen className="custom-builder-screen">
      <header className="center-title-row">
        <Link className="round-button" to="/">
          <ChevronLeft />
        </Link>
        <h1>{translate('custom.eyebrow')}</h1>
        <span />
      </header>

      <section className="custom-builder-panel">
        <div className="custom-control-card">
          <div className="custom-control-heading">
            <ListChecks size={20} />
            <span>{translate('custom.exerciseCount')}</span>
          </div>
          <div className="count-stepper">
            <button
              aria-label={translate('custom.decreaseExercises')}
              onClick={() => updateOptions({ exerciseCount: options.exerciseCount - 1 })}
              type="button"
            >
              <Minus size={18} />
            </button>
            <strong>{options.exerciseCount}</strong>
            <button
              aria-label={translate('custom.increaseExercises')}
              onClick={() => updateOptions({ exerciseCount: options.exerciseCount + 1 })}
              type="button"
            >
              <Plus size={18} />
            </button>
          </div>
        </div>

        <div className="custom-control-card">
          <div className="custom-control-heading">
            <SlidersHorizontal size={20} />
            <span>{translate('custom.timeRange')}</span>
          </div>
          <div className="time-range-control">
            <label>
              <span>{translate('custom.timeFrom', { minutes: options.minMinutes })}</span>
              <input
                aria-label={translate('custom.minMinutesLabel')}
                max="25"
                min="5"
                onChange={(event) => updateOptions({ minMinutes: Number(event.currentTarget.value) })}
                step="1"
                type="range"
                value={options.minMinutes}
              />
            </label>
            <label>
              <span>{translate('custom.timeTo', { minutes: options.maxMinutes })}</span>
              <input
                aria-label={translate('custom.maxMinutesLabel')}
                max="25"
                min="5"
                onChange={(event) => updateOptions({ maxMinutes: Number(event.currentTarget.value) })}
                step="1"
                type="range"
                value={options.maxMinutes}
              />
            </label>
          </div>
        </div>

        <div className="custom-control-card">
          <div className="custom-control-heading">
            <PersonStanding size={20} />
            <span>{translate('custom.categories')}</span>
          </div>
          <div className="category-chip-grid">
            <button
              aria-pressed={options.categories.length === 0}
              className={options.categories.length === 0 ? 'category-chip selected' : 'category-chip'}
              onClick={() => updateOptions({ categories: [] })}
              type="button"
            >
              {translate('custom.allCategories')}
            </button>
            {availableCategories.map((category) => {
              const selected = options.categories.includes(category)

              return (
                <button
                  aria-pressed={selected}
                  className={selected ? 'category-chip selected' : 'category-chip'}
                  key={category}
                  onClick={() => toggleCategory(category)}
                  type="button"
                >
                  {localize(progress.locale, customAdventureCategoryLabels[category])}
                </button>
              )
            })}
          </div>
        </div>
      </section>

      <button className="primary-action wide" onClick={buildAdventure} type="button">
        {translate('custom.generate')}
        <ChevronRight size={20} />
      </button>
    </Screen>
  )
}

function CustomAdventurePreviewScreen({
  progress,
  translate,
}: {
  progress: Progress
  translate: (key: string, values?: Record<string, string | number>) => string
}) {
  const [draft, setDraft] = useState(() => {
    const savedDraft = loadCustomAdventureDraft()

    if (savedDraft) {
      return savedDraft
    }

    return generateCustomAdventureDraft(DEFAULT_CUSTOM_ADVENTURE_OPTIONS)
  })
  const mission = useMemo(() => createCustomAdventureMission(draft.exerciseIds), [draft.exerciseIds])

  useEffect(() => {
    saveCustomAdventureDraft(draft)
  }, [draft])

  const regenerateAdventure = () => {
    const nextDraft = generateCustomAdventureDraft(draft.options, draft.exerciseIds)
    setDraft(nextDraft)
  }

  return (
    <Screen className="custom-preview-screen">
      <header className="center-title-row">
        <Link className="round-button" to="/custom-adventure/setup">
          <ChevronLeft />
        </Link>
        <span />
        <span />
      </header>

      <section className="custom-preview-hero">
        <img
          className="custom-preview-mascot"
          src={GIBKO_CUSTOM_PREVIEW_SRC}
          alt={translate('custom.previewImageAlt')}
        />
        <div>
          <h2>{translate('custom.previewHeading')}</h2>
          <p>{translate('custom.previewBody')}</p>
        </div>
      </section>

      <section className="custom-preview-list" aria-label={translate('custom.selectedExercises')}>
        <div className="custom-preview-list-heading">
          <span>{translate('custom.selectedExercises')}</span>
          <strong>
            <Leaf size={16} />
            {translate('custom.energyLeaves', { xp: mission.xp })}
          </strong>
        </div>
        {mission.exercises.map((exercise) => (
          <div className="custom-exercise-row" key={exercise.id}>
            <ExerciseIcon exercise={exercise} />
            <div>
              <strong>{localize(progress.locale, exercise.title)}</strong>
              <span>{localize(progress.locale, exercise.estimatedTimeLabel)}</span>
            </div>
          </div>
        ))}
      </section>

      <div className="custom-preview-actions">
        <Link className="primary-action wide" to="/custom-adventure/play">
          {translate('custom.start')}
          <ChevronRight size={20} />
        </Link>
        <button className="secondary-action wide" onClick={regenerateAdventure} type="button">
          <RotateCcw size={18} />
          {translate('custom.regenerate')}
        </button>
      </div>
    </Screen>
  )
}

function MissionScreen({
  customAdventure = false,
  progress,
  setProgress,
  translate,
}: {
  customAdventure?: boolean
  progress: Progress
  setProgress: (progress: Progress) => void
  translate: (key: string, values?: Record<string, string | number>) => string
}) {
  const { adventureSlug, chapterId, missionId } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const customDraft = useMemo(
    () => (customAdventure ? loadCustomAdventureDraft() : null),
    [customAdventure, location.pathname],
  )
  const mission = customAdventure
    ? customDraft
      ? createCustomAdventureMission(customDraft.exerciseIds)
      : undefined
    : findAdventureByRoute({ adventureSlug, chapterId, missionId })
  const initialExerciseIndex = getInitialExerciseIndex(location.search, mission)
  const routeKey = customAdventure
    ? `custom/${customDraft?.exerciseIds.join('-') ?? 'missing'}${location.search}`
    : `${missionId ?? `${chapterId ?? ''}/${adventureSlug ?? ''}`}${location.search}`
  const [exerciseIndex, setExerciseIndex] = useState(0)
  const [exerciseStates, setExerciseStates] = useState<ExerciseSessionState[]>([])
  const [skipHint, setSkipHint] = useState(false)
  const [earnedBadgeIds, setEarnedBadgeIds] = useState<string[]>([])
  const [starsEarned, setStarsEarned] = useState(1)
  const [xpEarned, setXpEarned] = useState(0)
  const [completionImageIndex, setCompletionImageIndex] = useState(0)
  const [nextAdventureId, setNextAdventureId] = useState<string | null>(null)
  const [activeExerciseIndex, setActiveExerciseIndex] = useState<number | null>(null)
  const [activeExerciseStartedAt, setActiveExerciseStartedAt] = useState<number | null>(null)
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const [missionSeconds, setMissionSeconds] = useState(0)
  const [missionDone, setMissionDone] = useState(false)

  useEffect(() => {
    setExerciseIndex(initialExerciseIndex)
    setExerciseStates(createExerciseSessionStates(mission?.exercises.length ?? 0, initialExerciseIndex))
    setSkipHint(false)
    setEarnedBadgeIds([])
    setStarsEarned(1)
    setXpEarned(0)
    setCompletionImageIndex(0)
    setNextAdventureId(null)
    setActiveExerciseIndex(null)
    setActiveExerciseStartedAt(null)
    setElapsedSeconds(0)
    setMissionSeconds(0)
    setMissionDone(false)
  }, [initialExerciseIndex, routeKey])

  useEffect(() => {
    if (activeExerciseStartedAt === null) {
      return
    }

    const intervalId = window.setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - activeExerciseStartedAt) / 1000))
    }, 250)

    return () => window.clearInterval(intervalId)
  }, [activeExerciseStartedAt])

  const exerciseMascotIndex = useMemo(
    () => Math.floor(Math.random() * EXERCISE_MASCOT_IMAGES.length),
    [routeKey, exerciseIndex],
  )

  if (!mission) {
    return (
      <Screen className="centered">
        <h1>{translate('custom.missingTitle')}</h1>
        <p>{translate('custom.missingBody')}</p>
        <Link className="primary-action" to="/custom-adventure/setup">
          {translate('custom.homeAction')}
        </Link>
      </Screen>
    )
  }

  if (!customAdventure && !isMissionUnlocked(progress, mission.id)) {
    return (
      <Screen className="centered">
        <Lock size={48} />
        <h1>{translate('mission.locked')}</h1>
        <Link className="primary-action" to="/map">
          {translate('nav.map')}
        </Link>
      </Screen>
    )
  }

  const exercise = mission.exercises[exerciseIndex]
  const isLastExercise = exerciseIndex === mission.exercises.length - 1
  const currentExerciseState = exerciseStates[exerciseIndex] ?? createExerciseSessionState(true)
  const isCurrentExerciseRunning = activeExerciseIndex === exerciseIndex && activeExerciseStartedAt !== null
  const currentExerciseSeconds = currentExerciseState.seconds + (isCurrentExerciseRunning ? elapsedSeconds : 0)
  const started = currentExerciseState.started || isCurrentExerciseRunning
  const canGoToPreviousExercise = exerciseIndex > 0 && exerciseStates[exerciseIndex - 1]?.completed
  const canGoToNextExercise =
    exerciseIndex < mission.exercises.length - 1 && Boolean(exerciseStates[exerciseIndex + 1]?.visited)
  const exerciseMascotSrc = EXERCISE_MASCOT_IMAGES[exerciseMascotIndex]

  const stopActiveTimer = () => {
    setActiveExerciseIndex(null)
    setActiveExerciseStartedAt(null)
    setElapsedSeconds(0)
  }

  const pauseActiveExercise = () => {
    const pausedStates = pauseExerciseTimer(exerciseStates, activeExerciseIndex, activeExerciseStartedAt)
    setExerciseStates(pausedStates)
    stopActiveTimer()

    return pausedStates
  }

  const goToExercise = (nextExerciseIndex: number) => {
    pauseActiveExercise()
    setSkipHint(false)
    setExerciseIndex(nextExerciseIndex)
  }

  const startExercise = () => {
    if (activeExerciseStartedAt !== null) {
      return
    }

    setSkipHint(false)
    setElapsedSeconds(0)
    setActiveExerciseIndex(exerciseIndex)
    setActiveExerciseStartedAt(Date.now())
    setExerciseStates((states) =>
      ensureExerciseSessionStates(states, mission.exercises.length, initialExerciseIndex).map((state, index) =>
        index === exerciseIndex ? { ...state, started: true, visited: true } : state,
      ),
    )
  }

  const finishExercise = () => {
    setSkipHint(false)
    const pausedStates = pauseExerciseTimer(exerciseStates, activeExerciseIndex, activeExerciseStartedAt)
    const nextStates = pausedStates.map((state, index) => {
      if (index === exerciseIndex) {
        return { ...state, completed: true, started: true, visited: true }
      }

      if (!isLastExercise && index === exerciseIndex + 1) {
        return { ...state, visited: true }
      }

      return state
    })
    const nextMissionSeconds = sumExerciseSessionSeconds(nextStates)
    stopActiveTimer()
    setExerciseStates(nextStates)

    if (!isLastExercise) {
      setExerciseIndex(exerciseIndex + 1)
      return
    }

    const result = completeMission(
      progress,
      mission,
      nextMissionSeconds,
      new Date(),
      nextStates.some((state) => state.usedDifficultyHelp),
    )
    setMissionSeconds(nextMissionSeconds)
    setCompletionImageIndex(getNextCompletionImageIndex())
    setProgress(result.progress)
    setEarnedBadgeIds(result.earnedBadgeIds)
    setStarsEarned(result.starsEarned)
    setXpEarned(result.xpEarned)
    setNextAdventureId(customAdventure ? null : findNextAdventure(result.progress)?.id ?? null)
    setMissionDone(true)
  }

  const markTooHard = () => {
    setSkipHint(true)
    setExerciseStates((states) =>
      ensureExerciseSessionStates(states, mission.exercises.length, initialExerciseIndex).map((state, index) =>
        index === exerciseIndex
          ? { ...state, started: true, usedDifficultyHelp: true, visited: true }
          : state,
      ),
    )
  }

  if (missionDone) {
    return (
      <Summary
        completionImageIndex={completionImageIndex}
        earnedBadgeIds={earnedBadgeIds}
        missionSeconds={missionSeconds}
        nextAdventureId={nextAdventureId}
        starsEarned={starsEarned}
        xpEarned={xpEarned}
        translate={translate}
      />
    )
  }

  return (
    <Screen className="mission-screen">
      <header className="mission-header">
        <button
          aria-label={translate('exercise.exit')}
          className="round-button"
          onClick={() => navigate(customAdventure ? '/custom-adventure/preview' : '/map')}
          type="button"
        >
          <ChevronLeft />
        </button>
        <div className="exercise-progress-header">
          <strong>
            {exerciseIndex + 1} / {mission.exercises.length}
          </strong>
          <div className="exercise-progress-strip" aria-hidden="true">
            {mission.exercises.map((missionExercise, index) => {
              const state = exerciseStates[index]
              const className = [
                index === exerciseIndex ? 'active' : '',
                state?.completed ? 'completed' : '',
                state?.visited ? 'visited' : '',
              ]
                .filter(Boolean)
                .join(' ')

              return <span className={className} key={`${missionExercise.id}-${index}`} />
            })}
          </div>
        </div>
      </header>

      <section className="exercise-hero-panel">
        <div className="exercise-mission-chip">
          <ExerciseIcon exercise={exercise} />
          <span>{localize(progress.locale, mission.title)}</span>
        </div>

        <div className="exercise-title-row">
          <span className="exercise-spark spark-left" aria-hidden="true" />
          <h1>{localize(progress.locale, exercise.title)}</h1>
          <span className="exercise-spark spark-right" aria-hidden="true" />
        </div>

        <p className="exercise-description-card">
          {localize(progress.locale, exercise.description)}
        </p>

        <div className="exercise-mascot-stage">
          <span className="exercise-motion-mark mark-left" aria-hidden="true" />
          <img className="exercise-mascot-art" src={exerciseMascotSrc} alt={translate('exercise.mascotAlt')} />
          <span className="exercise-motion-mark mark-right" aria-hidden="true" />
        </div>
      </section>

      <section className="exercise-card">
        <div className="exercise-details">
          <div>
            <Clock size={18} />
            <span>{translate('exercise.estimatedTime')}</span>
            <strong>{localize(progress.locale, exercise.estimatedTimeLabel)}</strong>
          </div>
          <div>
            <RotateCcw size={18} />
            <span>{translate('exercise.repetitions')}</span>
            <strong>{localize(progress.locale, exercise.repetitions)}</strong>
          </div>
        </div>
        {exercise.note && (
          <p className="exercise-note">
            <HeartPulse size={18} />
            <span>{localize(progress.locale, exercise.note)}</span>
          </p>
        )}
        {exercise.challengeOption && (
          <p className="exercise-challenge">
            <Sparkles size={18} />
            <span>{localize(progress.locale, exercise.challengeOption)}</span>
          </p>
        )}
      </section>

      <section className="exercise-control-panel">
        <div className="exercise-timer" aria-live="polite">
          <Clock size={18} />
          <span>{translate('exercise.timer')}</span>
          <div className="exercise-timer-dots" aria-hidden="true">
            {mission.exercises.map((missionExercise, index) => (
              <i
                className={index === exerciseIndex ? 'active' : ''}
                key={`${missionExercise.id}-timer-${index}`}
              />
            ))}
          </div>
          <strong>{formatDuration(currentExerciseSeconds)}</strong>
        </div>

        <div className="exercise-actions">
          <button
            className="secondary-action"
            disabled={isCurrentExerciseRunning}
            onClick={startExercise}
            type="button"
          >
            <Play size={18} />
            {currentExerciseState.seconds > 0 ? translate('exercise.resume') : translate('exercise.start')}
          </button>
          <button className="primary-action" disabled={!started} onClick={finishExercise} type="button">
            {translate('exercise.done')}
            <Check size={20} />
          </button>
        </div>

        <button className="text-button" onClick={markTooHard} type="button">
          {translate('exercise.skip')}
        </button>
        {skipHint && <p className="hint">{translate('exercise.skipHint')}</p>}

        {(canGoToPreviousExercise || canGoToNextExercise) && (
          <div className="exercise-step-nav">
            {canGoToPreviousExercise && (
              <button
                aria-label={translate('exercise.previous')}
                className="icon-action previous"
                onClick={() => goToExercise(exerciseIndex - 1)}
                type="button"
              >
                <ChevronLeft size={22} />
              </button>
            )}
            {canGoToNextExercise && (
              <button
                aria-label={translate('exercise.forward')}
                className="icon-action next"
                onClick={() => goToExercise(exerciseIndex + 1)}
                type="button"
              >
                <ChevronRight size={22} />
              </button>
            )}
          </div>
        )}
      </section>
    </Screen>
  )
}

function Summary({
  completionImageIndex,
  earnedBadgeIds,
  missionSeconds,
  nextAdventureId,
  starsEarned,
  xpEarned,
  translate,
}: {
  completionImageIndex: number
  earnedBadgeIds: string[]
  missionSeconds: number
  nextAdventureId: string | null
  starsEarned: number
  xpEarned: number
  translate: (key: string, values?: Record<string, string | number>) => string
}) {
  const earnedBadges = badges.filter((badge) => earnedBadgeIds.includes(badge.id))
  const imageSrc = MISSION_COMPLETED_IMAGES[completionImageIndex % MISSION_COMPLETED_IMAGES.length]

  return (
    <Screen className="centered">
      <img className="summary-mascot" src={imageSrc} alt="Gibko celebrating mission completion" />
      <h1>{translate('summary.title')}</h1>
      <p>{translate('summary.body')}</p>
      <strong className="summary-xp">
        {translate('summary.earned')} {translate('mission.xp', { xp: xpEarned })}
      </strong>
      <div className="summary-stars" aria-label={translate('summary.stars', { stars: starsEarned })}>
        <LeafRating leaves={starsEarned} />
      </div>
      <div className="summary-time">
        <Clock size={18} />
        <span>{translate('summary.time')}</span>
        <strong>{formatDuration(missionSeconds)}</strong>
      </div>
      {earnedBadges.map((badge) => (
        <BadgePill badge={badge} key={badge.id} translate={translate} />
      ))}
      {nextAdventureId && (
        <Link className="primary-action wide" to={getAdventurePathById(nextAdventureId)}>
          {translate('summary.nextAdventure')}
          <ChevronRight size={20} />
        </Link>
      )}
      <Link className={`${nextAdventureId ? 'secondary-action' : 'primary-action'} wide`} to="/">
        {translate('summary.backHome')}
      </Link>
    </Screen>
  )
}

function findNextAdventure(progress: Progress) {
  return chapters
    .flatMap((chapter) => chapter.missions)
    .find((mission) => isMissionUnlocked(progress, mission.id) && !isMissionCompleted(progress, mission.id))
}

function findAdventureByRoute({
  adventureSlug,
  chapterId,
  missionId,
}: {
  adventureSlug?: string
  chapterId?: string
  missionId?: string
}) {
  if (missionId) {
    return chapters.flatMap((chapter) => chapter.missions).find((candidate) => candidate.id === missionId)
  }

  const chapterNumber = parsePositiveInteger(chapterId)
  const chapter = chapterNumber
    ? chapters[chapterNumber - 1]
    : chapters.find((candidate) => candidate.id === chapterId)

  const adventureNumber = parsePositiveInteger(adventureSlug)

  return adventureNumber
    ? chapter?.missions.find((candidate) => candidate.number === adventureNumber)
    : chapter?.missions.find((candidate) => candidate.slug === adventureSlug)
}

function getAdventurePath(mission: Mission) {
  return `/chapter/${mission.chapterId}/adventure/${mission.slug}`
}

function getInitialExerciseIndex(search: string, mission?: Mission) {
  if (!mission) {
    return 0
  }

  const exerciseNumber = parsePositiveInteger(new URLSearchParams(search).get('ex'))

  if (!exerciseNumber) {
    return 0
  }

  return Math.min(exerciseNumber - 1, mission.exercises.length - 1)
}

function createExerciseSessionState(visited = false): ExerciseSessionState {
  return {
    completed: false,
    seconds: 0,
    started: false,
    usedDifficultyHelp: false,
    visited,
  }
}

function createExerciseSessionStates(exerciseCount: number, initialExerciseIndex = 0) {
  return Array.from({ length: exerciseCount }, (_, index) =>
    createExerciseSessionState(index === initialExerciseIndex),
  )
}

function ensureExerciseSessionStates(
  states: ExerciseSessionState[],
  exerciseCount: number,
  initialExerciseIndex = 0,
) {
  return states.length === exerciseCount
    ? states
    : createExerciseSessionStates(exerciseCount, initialExerciseIndex)
}

function pauseExerciseTimer(
  states: ExerciseSessionState[],
  activeExerciseIndex: number | null,
  activeExerciseStartedAt: number | null,
) {
  if (activeExerciseIndex === null || activeExerciseStartedAt === null || !states[activeExerciseIndex]) {
    return states
  }

  const exerciseSeconds = Math.max(1, Math.round((Date.now() - activeExerciseStartedAt) / 1000))

  return states.map((state, index) =>
    index === activeExerciseIndex
      ? { ...state, seconds: state.seconds + exerciseSeconds, started: true, visited: true }
      : state,
  )
}

function sumExerciseSessionSeconds(states: ExerciseSessionState[]) {
  return states.reduce((total, state) => total + state.seconds, 0)
}

function parsePositiveInteger(value: string | null | undefined) {
  if (!value || !/^\d+$/.test(value)) {
    return null
  }

  const parsed = Number(value)

  return parsed > 0 ? parsed : null
}

function getAdventurePathById(missionId: string) {
  const mission = chapters.flatMap((chapter) => chapter.missions).find((candidate) => candidate.id === missionId)

  return mission ? getAdventurePath(mission) : '/'
}

function findFirstUnlockedAdventure(progress: Progress) {
  return chapters
    .flatMap((chapter) => chapter.missions)
    .find((mission) => isMissionUnlocked(progress, mission.id))
}

function getNextCompletionImageIndex() {
  const lastIndex = Number(localStorage.getItem(COMPLETION_IMAGE_STORAGE_KEY) ?? '1')
  const nextIndex = lastIndex === 0 ? 1 : 0
  localStorage.setItem(COMPLETION_IMAGE_STORAGE_KEY, String(nextIndex))
  return nextIndex
}

function formatDuration(totalSeconds: number) {
  const safeSeconds = Math.max(0, Math.round(totalSeconds))
  const minutes = Math.floor(safeSeconds / 60)
  const seconds = safeSeconds % 60

  return `${minutes}:${String(seconds).padStart(2, '0')}`
}

function localize(locale: Progress['locale'], value: LocalizedText) {
  return value[locale] ?? value.en
}

export function getExplorerTitleProgress(xp: number) {
  const safeXp = Math.max(0, xp)
  const level = Math.min(EXPLORER_TITLES.length, Math.floor(safeXp / EXPLORER_TITLE_STEP) + 1)
  const nextTitle = EXPLORER_TITLES[level] ?? null
  const pointsToNextTitle = nextTitle ? level * EXPLORER_TITLE_STEP - safeXp : 0

  return {
    level,
    title: EXPLORER_TITLES[level - 1],
    nextTitle,
    pointsToNextTitle,
  }
}

function ProfileScreen({
  progress,
  translate,
}: {
  progress: Progress
  translate: (key: string, values?: Record<string, string | number>) => string
}) {
  const earnedBadges = badges.filter((badge) => progress.badgeIds.includes(badge.id))
  const explorerTitle = getExplorerTitleProgress(progress.xp)

  return (
    <Screen className="profile-screen">
      <header className="profile-top-row" aria-label={translate('profile.title')}>
        <Link className="ghost-icon" to="/settings">
          <Settings />
        </Link>
      </header>

      <img className="profile-mascot" src={GIBKO_PROFILE_AVATAR_SRC} alt="Gibko profile avatar" />
      <h2 className="profile-name">{progress.childName}</h2>
      <div className="explorer-title-label">{translate('profile.titleLabel')}</div>
      <div className="level-pill">{localize(progress.locale, explorerTitle.title)}</div>
      <p className="title-progress-hint">
        {explorerTitle.nextTitle
          ? translate('profile.nextTitleHint', {
              points: explorerTitle.pointsToNextTitle,
              title: localize(progress.locale, explorerTitle.nextTitle),
            })
          : translate('profile.maxTitleHint')}
      </p>

      <section className="profile-stats-card">
        <StatsRow compact progress={progress} translate={translate} />
        <div className="total-minutes">
          <span>
            <Clock size={18} />
            {translate('stats.totalMinutes')}
          </span>
          <strong>{formatDuration(progress.totalExerciseSeconds)}</strong>
        </div>
      </section>

      <section>
        <div className="section-heading">
          <h3>{translate('stats.badges')}</h3>
          <Link className="text-link" to="/badges">
            {translate('profile.seeAll')} →
          </Link>
        </div>
        <div className="badge-grid">
          {earnedBadges.length ? (
            earnedBadges.map((badge) => <BadgePill badge={badge} key={badge.id} translate={translate} />)
          ) : (
            badges.map((badge) => <BadgeIcon badge={badge} key={badge.id} translate={translate} />)
          )}
        </div>
      </section>
    </Screen>
  )
}

function BadgesScreen({
  progress,
  translate,
}: {
  progress: Progress
  translate: (key: string, values?: Record<string, string | number>) => string
}) {
  return (
    <Screen className="badges-screen">
      <header className="center-title-row">
        <Link className="round-button" to="/profile">
          <ChevronLeft />
        </Link>
        <h1>{translate('badges.title')}</h1>
        <span />
      </header>

      <section className="all-badges-list">
        {badges.map((badge) => {
          const earned = progress.badgeIds.includes(badge.id)

          return (
            <article className={`badge-detail ${earned ? 'earned' : 'locked'}`} key={badge.id}>
              <BadgeGlyph badge={badge} />
              <div>
                <strong>{translate(badge.titleKey)}</strong>
                <p>{translate(badge.descriptionKey)}</p>
                <span>{earned ? translate('badges.unlocked') : translate('badges.locked')}</span>
              </div>
            </article>
          )
        })}
      </section>
    </Screen>
  )
}

function SettingsScreen({
  progress,
  setProgress,
  translate,
}: {
  progress: Progress
  setProgress: (progress: Progress) => void
  translate: (key: string, values?: Record<string, string | number>) => string
}) {
  return (
    <Screen>
      <header className="center-title-row">
        <Link className="round-button" to="/">
          <ChevronLeft />
        </Link>
        <h1>{translate('settings.title')}</h1>
        <span />
      </header>

      <section className="settings-list">
        <p className="section-label">{translate('settings.language')}</p>
        <LanguageChoices progress={progress} setProgress={setProgress} />

        <div className="safety-note">
          <ShieldCheck size={20} />
          <div>
            <strong>{translate('settings.safety')}</strong>
            <p>{translate('onboarding.safetyBody')}</p>
          </div>
        </div>

        <div className="reset-zone">
          <button
            className="danger-action"
            onClick={() => {
              if (window.confirm(translate('settings.resetConfirm'))) {
                clearProgress()
                setProgress(createInitialProgress(progress.locale))
              }
            }}
            type="button"
          >
            {translate('settings.reset')}
            <RotateCcw size={18} />
          </button>
          <p>{translate('settings.resetHint')}</p>
        </div>
      </section>
    </Screen>
  )
}

function Screen({ children, className = '' }: { children: ReactNode; className?: string }) {
  const location = useLocation()
  const screenRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const screen = screenRef.current
    if (!screen) {
      return
    }

    if (typeof screen.scrollTo === 'function') {
      screen.scrollTo({ left: 0, top: 0 })
      return
    }

    screen.scrollLeft = 0
    screen.scrollTop = 0
  }, [location.pathname])

  return (
    <div className={`screen ${className}`} ref={screenRef}>
      {children}
    </div>
  )
}

function BottomNav({ translate }: { translate: (key: string) => string }) {
  return (
    <nav className="bottom-nav">
      <NavLink to="/">
        <Home />
        {translate('nav.home')}
      </NavLink>
      <NavLink to="/map">
        <BookOpen />
        {translate('nav.map')}
      </NavLink>
      <NavLink to="/profile">
        <User />
        {translate('nav.profile')}
      </NavLink>
      <NavLink to="/settings">
        <Settings />
        {translate('nav.settings')}
      </NavLink>
    </nav>
  )
}

function StatsRow({
  compact = false,
  progress,
  translate,
}: {
  compact?: boolean
  progress: Progress
  translate: (key: string) => string
}) {
  return (
    <section className={`stats-row ${compact ? 'compact' : ''}`}>
      <StatCard icon={<Leaf />} label={translate('stats.xp')} tone="green" value={progress.xp} />
      <StatCard icon={<Footprints />} label={translate('stats.streak')} tone="pink" value={progress.streakDays} />
      <StatCard icon="🕘" label={translate('stats.minutesToday')} tone="gold" value={formatDuration(progress.exerciseSecondsToday)} />
    </section>
  )
}

function StatCard({
  icon,
  label,
  tone,
  value,
}: {
  icon: ReactNode
  label: string
  tone: 'cyan' | 'gold' | 'green' | 'pink'
  value: number | string
}) {
  return (
    <article className={`stat-card ${tone}`}>
      <span className="stat-emoji">{icon}</span>
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
  )
}

function MissionMeta({
  locale,
  mission,
}: {
  locale: Progress['locale']
  mission: Mission
}) {
  return (
    <div className="mission-meta">
      <span>{localize(locale, mission.estimatedTimeLabel)}</span>
      <span className="energy-leaves-pill">
        +{mission.xp}
        <Leaf size={14} />
      </span>
    </div>
  )
}

function ExerciseIcon({ exercise }: { exercise: Exercise }) {
  const iconMap = {
    back: RotateCcw,
    balance: Footprints,
    ball: Award,
    branch: TreePine,
    breath: Waves,
    foot: Footprints,
    frog: Footprints,
    hip: User,
    leaf: Leaf,
    mat: TreePine,
    river: Waves,
    vine: RotateCcw,
  }
  const Icon = iconMap[exercise.icon]
  return (
    <div className={`exercise-icon exercise-icon-${exercise.icon}`}>
      <Icon size={58} />
    </div>
  )
}

function BadgePill({
  badge,
  translate,
}: {
  badge: Badge
  translate: (key: string) => string
}) {
  return (
    <article className="badge-pill">
      <BadgeGlyph badge={badge} />
      <div>
        <strong>{translate(badge.titleKey)}</strong>
        <p>{translate(badge.descriptionKey)}</p>
      </div>
    </article>
  )
}

function BadgeIcon({ badge, translate }: { badge: Badge; translate: (key: string) => string }) {
  return (
    <div className="badge-icon" title={translate(badge.titleKey)}>
      <BadgeGlyph badge={badge} />
    </div>
  )
}

function BadgeGlyph({ badge }: { badge: Badge }) {
  const iconMap = {
    calendar: CalendarDays,
    firefly: Sparkles,
    footprints: Footprints,
    gibbon: Award,
    leaf: Leaf,
    sun: Sun,
    weekend: TreePine,
  }
  const Icon = iconMap[badge.icon]
  return <Icon />
}

function LanguageChoices({
  progress,
  setProgress,
}: {
  progress: Progress
  setProgress: (progress: Progress) => void
}) {
  return (
    <div className="language-choices">
      <button
        className={progress.locale === 'pl' ? 'selected' : ''}
        onClick={() => setProgress({ ...progress, locale: 'pl' })}
        type="button"
      >
        <Languages size={18} />
        Polski
        {progress.locale === 'pl' && <Check size={18} />}
      </button>
      <button
        className={progress.locale === 'en' ? 'selected' : ''}
        onClick={() => setProgress({ ...progress, locale: 'en' })}
        type="button"
      >
        <Languages size={18} />
        English
        {progress.locale === 'en' && <Check size={18} />}
      </button>
    </div>
  )
}

function Wordmark() {
  return (
    <div className="wordmark" aria-label="Gibko">
      <span>G</span>
      <span>i</span>
      <span>b</span>
      <span>k</span>
      <span>o</span>
    </div>
  )
}

function ProgressDots({ activeIndex }: { activeIndex: number }) {
  return (
    <div className="progress-dots">
      {[0, 1, 2].map((index) => (
        <span className={index === activeIndex ? 'active' : ''} key={index} />
      ))}
    </div>
  )
}

function JungleDecor() {
  return (
    <div className="jungle-decor" aria-hidden="true">
      <Leaf className="leaf leaf-one" />
      <Leaf className="leaf leaf-two" />
      <TreePine className="leaf leaf-three" />
      <span className="flower">✿</span>
    </div>
  )
}

function MapNode({
  completed,
  index,
  isCurrent,
  locale,
  mission,
  position,
  stars,
  translate,
  unlocked,
}: {
  completed: boolean
  index: number
  isCurrent: boolean
  locale: Progress['locale']
  mission?: Mission
  position: { x: string; y: string }
  stars: number
  translate: (key: string, values?: Record<string, string | number>) => string
  unlocked: boolean
}) {
  const content = (
    <>
      <div
        className={`map-node ${completed ? 'completed' : ''} ${isCurrent ? 'current' : ''} ${
          unlocked ? '' : 'locked'
        }`}
      >
        {unlocked ? index : <Lock />}
      </div>
      <div className="node-stars">
        {completed ? (
          <LeafRating leaves={stars} />
        ) : isCurrent ? (
          <strong>{translate('mission.startLabel')}</strong>
        ) : null}
      </div>
    </>
  )

  return (
    <div className="map-node-wrap" style={{ left: position.x, top: position.y }}>
      {mission && unlocked ? (
        <Link aria-label={localize(locale, mission.title)} to={getAdventurePath(mission)}>
          {content}
        </Link>
      ) : (
        content
      )}
    </div>
  )
}

function LeafRating({ leaves }: { leaves: number }) {
  return (
    <>
      {Array.from({ length: Math.max(1, Math.min(3, leaves)) }, (_, index) => (
        <Leaf key={index} />
      ))}
    </>
  )
}

function ForestMapArt() {
  return (
    <div className="forest-art">
      <img className="forest-board-image" src={MAP_RAINFOREST_BOARD_SRC} alt="" />
    </div>
  )
}
