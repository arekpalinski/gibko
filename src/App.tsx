import {
  Award,
  CalendarDays,
  Check,
  ChevronRight,
  Clock,
  Flame,
  Home,
  Lock,
  Map,
  Rocket,
  RotateCcw,
  Settings,
  Sparkles,
  Star,
  Sun,
  User,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { Link, NavLink, Route, Routes, useNavigate, useParams } from 'react-router-dom'
import { badges } from './data/badges'
import { worlds } from './data/worlds'
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
      <main className="app-main">
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
          <Route
            path="/map"
            element={<MapScreen progress={progress} translate={translate} />}
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
          <Route
            path="/settings"
            element={<SettingsScreen progress={progress} setProgress={setProgress} translate={translate} />}
          />
        </Routes>
      </main>
      <BottomNav translate={translate} />
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
  const [name, setName] = useState(progress.childName)

  return (
    <main className="onboarding">
      <section className="hero-panel">
        <div className="hero-orbit">
          <Rocket size={72} />
          <Sparkles className="sparkle-one" />
          <Star className="sparkle-two" />
        </div>
        <h1>{translate('onboarding.title')}</h1>
        <p>{translate('onboarding.subtitle')}</p>
      </section>

      <section className="setup-panel">
        <label>
          <span>{translate('onboarding.nameLabel')}</span>
          <input
            maxLength={18}
            onChange={(event) => setName(event.target.value)}
            placeholder={translate('onboarding.namePlaceholder')}
            value={name}
          />
        </label>

        <LanguageToggle progress={progress} setProgress={setProgress} />

        <div className="safety-note">
          <strong>{translate('onboarding.safetyTitle')}</strong>
          <p>{translate('onboarding.safetyBody')}</p>
        </div>

        <button
          className="primary-action"
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
          {translate('onboarding.start')}
          <ChevronRight size={20} />
        </button>
      </section>
    </main>
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
    () => worlds[0].missions.find((mission) => isMissionUnlocked(progress, mission.id)) ?? worlds[0].missions[0],
    [progress],
  )

  return (
    <div className="screen">
      <header className="screen-header">
        <div>
          <p className="eyebrow">{translate('app.name')}</p>
          <h1>{translate('home.greeting', { name: progress.childName })}</h1>
          <p>{translate('home.subtitle')}</p>
        </div>
        <div className="mascot-badge">
          <Rocket />
        </div>
      </header>

      <StatsRow progress={progress} translate={translate} />

      <section className="install-card">
        <div>
          <h2>{translate('home.install')}</h2>
          <p>{installPrompt ? translate('home.installReady') : translate('home.installFallback')}</p>
        </div>
        <button
          className="icon-button"
          disabled={!installPrompt}
          onClick={() => installPrompt?.prompt()}
          title={translate('home.install')}
          type="button"
        >
          <ChevronRight />
        </button>
      </section>

      <section className="mission-feature">
        <p className="eyebrow">{translate('home.dailyMission')}</p>
        <h2>{translate(dailyMission.titleKey)}</h2>
        <p>{translate(dailyMission.teaserKey)}</p>
        <MissionMeta mission={dailyMission} translate={translate} />
        <Link className="primary-action" to={`/mission/${dailyMission.id}`}>
          {isMissionCompleted(progress, dailyMission.id)
            ? translate('mission.repeat')
            : translate('mission.start')}
          <ChevronRight size={20} />
        </Link>
      </section>
    </div>
  )
}

function MapScreen({
  progress,
  translate,
}: {
  progress: Progress
  translate: (key: string, values?: Record<string, string | number>) => string
}) {
  const world = worlds[0]

  return (
    <div className="screen">
      <header className="screen-header compact">
        <div>
          <p className="eyebrow">{translate(world.titleKey)}</p>
          <h1>{translate('map.title')}</h1>
          <p>{translate('map.subtitle')}</p>
        </div>
      </header>

      <section className="mission-path">
        {world.missions.map((mission, index) => {
          const unlocked = isMissionUnlocked(progress, mission.id)
          const completed = isMissionCompleted(progress, mission.id)

          return (
            <article className={`mission-node ${completed ? 'completed' : ''}`} key={mission.id}>
              <div className="node-medal">{completed ? <Check /> : unlocked ? index + 1 : <Lock />}</div>
              <div>
                <h2>{translate(mission.titleKey)}</h2>
                <p>{unlocked ? translate(mission.teaserKey) : translate('mission.locked')}</p>
                <MissionMeta mission={mission} translate={translate} />
              </div>
              {unlocked && (
                <Link className="small-action" to={`/mission/${mission.id}`}>
                  {completed ? translate('mission.repeat') : translate('mission.start')}
                </Link>
              )}
            </article>
          )
        })}
      </section>
    </div>
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
  const mission = worlds.flatMap((world) => world.missions).find((candidate) => candidate.id === missionId)
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
      <div className="screen centered">
        <Lock size={48} />
        <h1>{translate('mission.locked')}</h1>
        <Link className="primary-action" to="/map">
          {translate('nav.map')}
        </Link>
      </div>
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

  if (missionDone) {
    return <Summary mission={mission} earnedBadgeIds={earnedBadgeIds} translate={translate} />
  }

  return (
    <div className="screen">
      <header className="mission-header">
        <p className="eyebrow">
          {exerciseIndex + 1} / {mission.exercises.length}
        </p>
        <h1>{translate(mission.titleKey)}</h1>
        <button className="text-button" onClick={() => navigate('/map')} type="button">
          {translate('nav.map')}
        </button>
      </header>

      <section className="exercise-card">
        <ExerciseIcon exercise={exercise} />
        <h2>{translate(exercise.titleKey)}</h2>
        <p>{translate(exercise.descriptionKey)}</p>

        <div className="exercise-actions">
          <button
            className="secondary-action"
            onClick={() => setStartedExerciseIds([...startedExerciseIds, exercise.id])}
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

        <button
          className="text-button"
          onClick={() => {
            setSkipHint(true)
            finishExercise()
          }}
          type="button"
        >
          {translate('exercise.skip')}
        </button>
        {skipHint && <p className="hint">{translate('exercise.skipHint')}</p>}
      </section>
    </div>
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
    <div className="screen centered">
      <div className="summary-burst">
        <Award size={64} />
      </div>
      <h1>{translate('summary.title')}</h1>
      <p>{translate('summary.body')}</p>
      <strong>
        {translate('summary.earned')} {translate('mission.xp', { xp: mission.xp })}
      </strong>
      {earnedBadges.map((badge) => (
        <BadgePill badge={badge} key={badge.id} translate={translate} />
      ))}
      <Link className="primary-action" to="/">
        {translate('summary.backHome')}
      </Link>
    </div>
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

  return (
    <div className="screen">
      <header className="screen-header compact">
        <div>
          <p className="eyebrow">{progress.childName}</p>
          <h1>{translate('profile.title')}</h1>
          <p>{translate('profile.body')}</p>
        </div>
      </header>
      <StatsRow progress={progress} translate={translate} />
      <section className="badge-grid">
        {earnedBadges.length ? (
          earnedBadges.map((badge) => <BadgePill badge={badge} key={badge.id} translate={translate} />)
        ) : (
          <p>{translate('stats.badges')}: 0</p>
        )}
      </section>
    </div>
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
    <div className="screen">
      <header className="screen-header compact">
        <h1>{translate('settings.title')}</h1>
      </header>
      <section className="settings-list">
        <div className="settings-row">
          <div>
            <strong>{translate('settings.language')}</strong>
          </div>
          <LanguageToggle progress={progress} setProgress={setProgress} />
        </div>
        <div className="safety-note">
          <strong>{translate('settings.safety')}</strong>
          <p>{translate('onboarding.safetyBody')}</p>
        </div>
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
          <RotateCcw size={18} />
          {translate('settings.reset')}
        </button>
      </section>
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
        <Map />
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
  progress,
  translate,
}: {
  progress: Progress
  translate: (key: string) => string
}) {
  return (
    <section className="stats-row">
      <StatCard icon={<Star />} label={translate('stats.xp')} value={progress.xp} />
      <StatCard icon={<Flame />} label={translate('stats.streak')} value={progress.streakDays} />
      <StatCard icon={<Clock />} label={translate('stats.minutesToday')} value={progress.exerciseMinutesToday} />
    </section>
  )
}

function StatCard({ icon, label, value }: { icon: ReactNode; label: string; value: number }) {
  return (
    <article className="stat-card">
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
    astronaut: User,
    cat: Sparkles,
    orbit: RotateCcw,
    radar: Sun,
    rocket: Rocket,
  }
  const Icon = iconMap[exercise.icon]
  return (
    <div className="exercise-icon">
      <Icon size={56} />
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
  const iconMap = {
    calendar: CalendarDays,
    sparkles: Sparkles,
    sun: Sun,
    weekend: Award,
  }
  const Icon = iconMap[badge.icon]

  return (
    <article className="badge-pill">
      <Icon />
      <div>
        <strong>{translate(badge.titleKey)}</strong>
        <p>{translate(badge.descriptionKey)}</p>
      </div>
    </article>
  )
}

function LanguageToggle({
  progress,
  setProgress,
}: {
  progress: Progress
  setProgress: (progress: Progress) => void
}) {
  return (
    <div className="language-toggle">
      <button
        className={progress.locale === 'pl' ? 'selected' : ''}
        onClick={() => setProgress({ ...progress, locale: 'pl' })}
        type="button"
      >
        PL
      </button>
      <button
        className={progress.locale === 'en' ? 'selected' : ''}
        onClick={() => setProgress({ ...progress, locale: 'en' })}
        type="button"
      >
        EN
      </button>
    </div>
  )
}
