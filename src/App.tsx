import {
  Award,
  Bell,
  BookOpen,
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  Flame,
  Footprints,
  Home,
  Languages,
  Leaf,
  Lock,
  RotateCcw,
  Settings,
  ShieldCheck,
  Star,
  Sun,
  TreePine,
  User,
  Waves,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { Link, NavLink, Route, Routes, useNavigate, useParams } from 'react-router-dom'
import { badges } from './data/badges'
import { chapters } from './data/chapters'
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
import type { Badge, Exercise, Mission, Progress } from './types'

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>
}

const assetPath = (fileName: string) => `${import.meta.env.BASE_URL}assets/${fileName}`
const GIBKO_LOGO_SRC = assetPath('gibko-logo.webp')
const GIBKO_MASCOT_SRC = assetPath('gibko-mascot-stretch.webp')
const GIBKO_HELLO_SRC = assetPath('gibko-hello.webp')
const CHAPTER_TARGET_MISSIONS = 12

export function App() {
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

    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const setProgress = (next: Progress) => {
    setProgressState(next)
  }

  const translate = (key: string, values?: Record<string, string | number>) =>
    t(progress.locale, key, values)

  if (!progress.acceptedSafety || !progress.childName) {
    return <Onboarding progress={progress} setProgress={setProgress} translate={translate} />
  }

  return (
    <div className="app-shell">
      <main className="phone-frame">
        <Routes>
          <Route
            path="/"
            element={
              <HomeScreen
                installPrompt={installPrompt}
                progress={progress}
                translate={translate}
              />
            }
          />
          <Route path="/map" element={<MapScreen progress={progress} translate={translate} />} />
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
          <Route
            path="/settings"
            element={<SettingsScreen progress={progress} setProgress={setProgress} translate={translate} />}
          />
        </Routes>
        <BottomNav translate={translate} />
      </main>
    </div>
  )
}

function Onboarding({
  progress,
  setProgress,
  translate,
}: {
  progress: Progress
  setProgress: (progress: Progress) => void
  translate: (key: string, values?: Record<string, string | number>) => string
}) {
  const [step, setStep] = useState<'intro' | 'setup'>('intro')
  const [name, setName] = useState(progress.childName)

  return (
    <div className="app-shell">
      <main className="phone-frame onboarding-frame">
        {step === 'intro' ? (
          <section className="intro-screen">
            <JungleDecor />
            <img className="intro-logo" src={GIBKO_LOGO_SRC} alt="Gibko" />
            <h1>{translate('onboarding.title')}</h1>
            <p>{translate('onboarding.subtitle')}</p>
            <button className="primary-action wide" onClick={() => setStep('setup')} type="button">
              {translate('onboarding.start')}
              <ChevronRight size={20} />
            </button>
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
              onClick={() =>
                setProgress({
                  ...progress,
                  childName: name.trim(),
                  acceptedSafety: true,
                })
              }
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
  installPrompt,
  progress,
  translate,
}: {
  installPrompt: BeforeInstallPromptEvent | null
  progress: Progress
  translate: (key: string, values?: Record<string, string | number>) => string
}) {
  const dailyMission = useMemo(
    () => chapters[0].missions.find((mission) => isMissionUnlocked(progress, mission.id)) ?? chapters[0].missions[0],
    [progress],
  )

  return (
    <Screen>
      <header className="top-row">
        <Wordmark />
        <button
          className="ghost-icon"
          onClick={() => installPrompt?.prompt()}
          title={translate('home.install')}
          type="button"
        >
          {installPrompt ? <Bell /> : <Leaf />}
        </button>
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
          <h2>{translate(dailyMission.titleKey)}</h2>
          <MissionMeta mission={dailyMission} translate={translate} />
          <Link className="primary-action" to={`/mission/${dailyMission.id}`}>
            {isMissionCompleted(progress, dailyMission.id)
              ? translate('mission.repeat')
              : translate('mission.start')}
            <ChevronRight size={20} />
          </Link>
        </div>
        <img className="mission-mascot" src={GIBKO_MASCOT_SRC} alt="Gibko stretching" />
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
  const nodes = [
    { x: '20%', y: '18%' },
    { x: '51%', y: '10%' },
    { x: '39%', y: '38%' },
    { x: '66%', y: '57%' },
    { x: '23%', y: '75%' },
    { x: '54%', y: '90%' },
  ]

  return (
    <Screen className="map-screen">
      <header className="map-header">
        <Link className="round-button" to="/">
          <ChevronLeft />
        </Link>
        <h1>{translate('map.title')}</h1>
        <div className="xp-chip">
          <Star size={16} />
          {progress.xp}
        </div>
      </header>

      <section className="chapter-heading">
        <div>
          <p>{translate('map.chapter')}</p>
          <h2>{translate(chapter.titleKey)}</h2>
        </div>
        <strong>
          {translate('map.progress', {
            completed: completedCount,
            total: CHAPTER_TARGET_MISSIONS,
          })}
          <Star size={16} />
        </strong>
      </section>

      <section className="forest-map" aria-label={translate(chapter.titleKey)}>
        <ForestMapArt />
        <svg className="map-path" viewBox="0 0 340 590" preserveAspectRatio="none">
          <path
            d="M70 110 C120 120, 150 130, 175 185 C195 225, 210 245, 235 290 C250 315, 220 350, 185 390 C145 435, 85 455, 95 505 C105 548, 195 525, 240 555"
            fill="none"
            stroke="#f3dcb4"
            strokeDasharray="14 14"
            strokeLinecap="round"
            strokeWidth="7"
          />
        </svg>
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
              translate={translate}
              unlocked={unlocked}
            />
          )
        })}
      </section>
    </Screen>
  )
}

function MissionScreen({
  progress,
  setProgress,
  translate,
}: {
  progress: Progress
  setProgress: (progress: Progress) => void
  translate: (key: string, values?: Record<string, string | number>) => string
}) {
  const { missionId } = useParams()
  const navigate = useNavigate()
  const mission = chapters.flatMap((chapter) => chapter.missions).find((candidate) => candidate.id === missionId)
  const [exerciseIndex, setExerciseIndex] = useState(0)
  const [startedExerciseIds, setStartedExerciseIds] = useState<string[]>([])
  const [skipHint, setSkipHint] = useState(false)
  const [earnedBadgeIds, setEarnedBadgeIds] = useState<string[]>([])
  const [missionDone, setMissionDone] = useState(false)

  if (!mission) {
    return null
  }

  if (!isMissionUnlocked(progress, mission.id)) {
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
  const started = startedExerciseIds.includes(exercise.id)

  const finishExercise = () => {
    setSkipHint(false)
    if (!isLastExercise) {
      setExerciseIndex(exerciseIndex + 1)
      return
    }

    const result = completeMission(progress, mission)
    setProgress(result.progress)
    setEarnedBadgeIds(result.earnedBadgeIds)
    setMissionDone(true)
  }

  const markTooHard = () => {
    setSkipHint(true)
    if (!started) {
      setStartedExerciseIds([...startedExerciseIds, exercise.id])
    }
  }

  if (missionDone) {
    return <Summary mission={mission} earnedBadgeIds={earnedBadgeIds} translate={translate} />
  }

  return (
    <Screen>
      <header className="mission-header">
        <button className="round-button" onClick={() => navigate('/map')} type="button">
          <ChevronLeft />
        </button>
        <div>
          <p className="eyebrow">
            {exerciseIndex + 1} / {mission.exercises.length}
          </p>
          <h1>{translate(mission.titleKey)}</h1>
        </div>
      </header>

      <section className="exercise-card">
        <ExerciseIcon exercise={exercise} />
        <h2>{translate(exercise.titleKey)}</h2>
        <p>{translate(exercise.descriptionKey)}</p>

        <div className="exercise-actions">
          <button
            className="secondary-action"
            onClick={() => setStartedExerciseIds([...new Set([...startedExerciseIds, exercise.id])])}
            type="button"
          >
            <Clock size={18} />
            {translate('exercise.start')}
          </button>
          <button className="primary-action" disabled={!started} onClick={finishExercise} type="button">
            {isLastExercise ? translate('exercise.done') : translate('exercise.next')}
            <Check size={20} />
          </button>
        </div>

        <button className="text-button" onClick={markTooHard} type="button">
          {translate('exercise.skip')}
        </button>
        {skipHint && <p className="hint">{translate('exercise.skipHint')}</p>}
      </section>
    </Screen>
  )
}

function Summary({
  earnedBadgeIds,
  mission,
  translate,
}: {
  earnedBadgeIds: string[]
  mission: Mission
  translate: (key: string, values?: Record<string, string | number>) => string
}) {
  const earnedBadges = badges.filter((badge) => earnedBadgeIds.includes(badge.id))

  return (
    <Screen className="centered">
      <img className="summary-mascot" src={GIBKO_MASCOT_SRC} alt="Gibko stretching" />
      <h1>{translate('summary.title')}</h1>
      <p>{translate('summary.body')}</p>
      <strong className="summary-xp">
        {translate('summary.earned')} {translate('mission.xp', { xp: mission.xp })}
      </strong>
      {earnedBadges.map((badge) => (
        <BadgePill badge={badge} key={badge.id} translate={translate} />
      ))}
      <Link className="primary-action wide" to="/">
        {translate('summary.backHome')}
      </Link>
    </Screen>
  )
}

function ProfileScreen({
  progress,
  translate,
}: {
  progress: Progress
  translate: (key: string, values?: Record<string, string | number>) => string
}) {
  const earnedBadges = badges.filter((badge) => progress.badgeIds.includes(badge.id))
  const level = Math.max(1, Math.floor(progress.xp / 100) + 1)

  return (
    <Screen>
      <header className="center-title-row">
        <span />
        <h1>{translate('profile.title')}</h1>
        <Link className="ghost-icon" to="/settings">
          <Settings />
        </Link>
      </header>

      <img className="profile-mascot" src={GIBKO_MASCOT_SRC} alt="Gibko stretching" />
      <h2 className="profile-name">{progress.childName}</h2>
      <div className="level-pill">{translate('profile.level', { level })}</div>

      <section className="profile-stats-card">
        <StatsRow compact progress={progress} translate={translate} />
        <div className="total-minutes">
          <span>
            <Clock size={18} />
            {translate('stats.totalMinutes')}
          </span>
          <strong>{progress.totalExerciseMinutes}</strong>
        </div>
      </section>

      <section>
        <div className="section-heading">
          <h3>{translate('stats.badges')}</h3>
          <span>{translate('profile.seeAll')} →</span>
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

        <div className="toggle-row">
          <span>{translate('settings.sounds')}</span>
          <span className="fake-toggle" />
        </div>
        <div className="toggle-row">
          <span>{translate('settings.notifications')}</span>
          <span className="fake-toggle" />
        </div>
        <div className="toggle-row">
          <span>{translate('settings.theme')}</span>
          <span className="muted">{translate('settings.themeDark')} ›</span>
        </div>

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
  return <div className={`screen ${className}`}>{children}</div>
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
      <StatCard icon={<Star />} label={translate('stats.xp')} tone="cyan" value={progress.xp} />
      <StatCard icon={<Flame />} label={translate('stats.streak')} tone="pink" value={progress.streakDays} />
      <StatCard icon={<Clock />} label={translate('stats.minutesToday')} tone="gold" value={progress.exerciseMinutesToday} />
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
  tone: 'cyan' | 'gold' | 'pink'
  value: number
}) {
  return (
    <article className={`stat-card ${tone}`}>
      {icon}
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
  )
}

function MissionMeta({
  mission,
  translate,
}: {
  mission: Mission
  translate: (key: string, values?: Record<string, string | number>) => string
}) {
  return (
    <div className="mission-meta">
      <span>{translate('mission.minutes', { minutes: mission.estimatedMinutes })}</span>
      <span>{translate('mission.xp', { xp: mission.xp })}</span>
    </div>
  )
}

function ExerciseIcon({ exercise }: { exercise: Exercise }) {
  const iconMap = {
    branch: TreePine,
    frog: Footprints,
    leaf: Leaf,
    river: Waves,
    vine: RotateCcw,
  }
  const Icon = iconMap[exercise.icon]
  return (
    <div className="exercise-icon">
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
  mission,
  position,
  translate,
  unlocked,
}: {
  completed: boolean
  index: number
  isCurrent: boolean
  mission?: Mission
  position: { x: string; y: string }
  translate: (key: string, values?: Record<string, string | number>) => string
  unlocked: boolean
}) {
  const content = (
    <>
      <div className={`map-node ${completed ? 'completed' : ''} ${isCurrent ? 'current' : ''}`}>
        {unlocked ? index : <Lock />}
      </div>
      <div className="node-stars">
        {completed ? (
          <>
            <Star />
            <Star />
            <Star />
          </>
        ) : isCurrent ? (
          <strong>{translate('mission.startLabel')}</strong>
        ) : null}
      </div>
    </>
  )

  return (
    <div className="map-node-wrap" style={{ left: position.x, top: position.y }}>
      {mission && unlocked ? (
        <Link aria-label={translate(mission.titleKey)} to={`/mission/${mission.id}`}>
          {content}
        </Link>
      ) : (
        content
      )}
    </div>
  )
}

function ForestMapArt() {
  return (
    <div className="forest-art">
      <div className="forest-layer layer-one" />
      <div className="forest-layer layer-two" />
      <div className="forest-layer layer-three" />
      <svg className="river" viewBox="0 0 340 590" preserveAspectRatio="none">
        <path
          d="M305 110 C280 150, 292 200, 258 250 C230 292, 228 348, 250 402 C268 445, 310 490, 292 560"
          fill="none"
          opacity="0.95"
          stroke="#1da8d8"
          strokeLinecap="round"
          strokeWidth="30"
        />
        <path
          d="M305 110 C280 150, 292 200, 258 250 C230 292, 228 348, 250 402 C268 445, 310 490, 292 560"
          fill="none"
          opacity="0.45"
          stroke="#6de7ff"
          strokeLinecap="round"
          strokeWidth="10"
        />
      </svg>
      <div className="bridge">
        <span />
        <span />
        <span />
        <span />
        <span />
      </div>
      <SimpleTree x="8%" y="18%" />
      <SimpleTree x="70%" y="18%" />
      <SimpleTree x="15%" y="43%" />
      <SimpleTree x="74%" y="48%" />
      <SimpleTree x="3%" y="76%" />
      <SimpleTree x="68%" y="82%" />
      <SimpleBush x="58%" y="22%" />
      <SimpleBush x="64%" y="40%" />
      <SimpleBush x="82%" y="64%" />
      <SimpleBush x="8%" y="76%" />
    </div>
  )
}

function SimpleTree({ x, y }: { x: string; y: string }) {
  return (
    <div className="simple-tree" style={{ left: x, top: y }}>
      <span />
      <span />
      <span />
      <span />
    </div>
  )
}

function SimpleBush({ x, y }: { x: string; y: string }) {
  return (
    <div className="simple-bush" style={{ left: x, top: y }}>
      <span />
      <span />
      <span />
    </div>
  )
}
