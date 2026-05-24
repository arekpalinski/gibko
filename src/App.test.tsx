import '@testing-library/jest-dom/vitest'
import { act, fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { App, MAP_REALM_TEASERS, getExplorerTitleProgress } from './App'
import { badges } from './data/badges'
import { chapters } from './data/chapters'
import { customAdventureCategoryLabels, getAvailableCustomAdventureCategories } from './data/customAdventure'
import { createInitialProgress, saveProgress } from './state/progress'

function formatTestDuration(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60

  return `${minutes}:${String(seconds).padStart(2, '0')}`
}

describe('mission flow', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('links the home adventure card through the chapter adventure route', async () => {
    const firstMission = chapters[0].missions[0]
    const progress = {
      ...createInitialProgress('en'),
      acceptedSafety: true,
      childName: 'Alex',
    }
    saveProgress(progress)

    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    )

    const startLink = await screen.findByRole('link', { name: 'Start' })

    expect(screen.getByRole('navigation')).toBeInTheDocument()
    expect(startLink).toHaveAttribute(
      'href',
      `/chapter/${firstMission.chapterId}/adventure/${firstMission.slug}`,
    )
  })

  it('hides the bottom navigation while an adventure exercise is active', async () => {
    const firstMission = chapters[0].missions[0]
    const progress = {
      ...createInitialProgress('en'),
      acceptedSafety: true,
      childName: 'Alex',
    }
    saveProgress(progress)

    render(
      <MemoryRouter initialEntries={[`/chapter/${firstMission.chapterId}/adventure/${firstMission.slug}`]}>
        <App />
      </MemoryRouter>,
    )

    expect(await screen.findByText(firstMission.title.en)).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: firstMission.exercises[0].title.en })).toBeInTheDocument()
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument()
  })

  it('shows the install button only when the browser install prompt is available', async () => {
    const prompt = vi.fn().mockResolvedValue(undefined)
    const progress = {
      ...createInitialProgress('en'),
      acceptedSafety: true,
      childName: 'Alex',
    }
    saveProgress(progress)

    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    )

    expect(screen.queryByRole('button', { name: 'Install Gibko' })).not.toBeInTheDocument()

    const installEvent = new Event('beforeinstallprompt')
    Object.defineProperty(installEvent, 'prompt', { value: prompt })
    fireEvent(window, installEvent)

    fireEvent.click(await screen.findByRole('button', { name: 'Install Gibko' }))

    expect(prompt).toHaveBeenCalledOnce()
  })

  it('lets children build a custom adventure from the home screen', async () => {
    const progress = {
      ...createInitialProgress('en'),
      acceptedSafety: true,
      childName: 'Alex',
    }
    saveProgress(progress)

    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    )

    expect(await screen.findByRole('link', { name: 'Build adventure' })).toHaveAttribute(
      'href',
      '/custom-adventure/setup',
    )

    fireEvent.click(screen.getByRole('link', { name: 'Build adventure' }))

    expect(await screen.findByRole('heading', { name: 'My own adventure' })).toBeInTheDocument()
    expect(screen.getByText('Number of exercises')).toBeInTheDocument()
    expect(screen.getByText('Everything')).toBeInTheDocument()
    getAvailableCustomAdventureCategories().forEach((category) => {
      expect(
        screen.getByRole('button', { name: customAdventureCategoryLabels[category].en }),
      ).toBeInTheDocument()
    })

    fireEvent.click(screen.getByRole('button', { name: 'Build adventure' }))

    expect(await screen.findByRole('heading', { name: 'Here is a set for you' })).toBeInTheDocument()
    expect(screen.getByText('Selected exercises')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Start' })).toHaveAttribute('href', '/custom-adventure/play')
    expect(screen.getByRole('button', { name: 'Build again' })).toBeInTheDocument()
  })

  it('links unlocked map nodes through the chapter adventure route', async () => {
    const firstMission = chapters[0].missions[0]
    const progress = {
      ...createInitialProgress('en'),
      acceptedSafety: true,
      childName: 'Alex',
    }
    saveProgress(progress)

    render(
      <MemoryRouter initialEntries={['/map']}>
        <App />
      </MemoryRouter>,
    )

    const mapNodeLink = await screen.findByRole('link', { name: firstMission.title.en })

    expect(screen.getByLabelText('Realm selection')).toBeInTheDocument()
    expect(screen.getByText('Misty Forest')).toBeInTheDocument()
    expect(screen.getByLabelText('Locked')).toBeInTheDocument()
    expect(
      MAP_REALM_TEASERS.some((teaser) => screen.queryByText(teaser.en)),
    ).toBe(true)
    expect(mapNodeLink).toHaveAttribute(
      'href',
      `/chapter/${firstMission.chapterId}/adventure/${firstMission.slug}`,
    )
  })

  it('selects the misty forest map after the rainforest chapter is complete and allows going back', async () => {
    const rainforest = chapters[0]
    const mistyForest = chapters[1]
    const progress = {
      ...createInitialProgress('en'),
      acceptedSafety: true,
      childName: 'Alex',
      completedMissionIds: rainforest.missions.map((mission) => mission.id),
      unlockedMissionIds: [
        ...rainforest.missions.map((mission) => mission.id),
        mistyForest.missions[0].id,
      ],
    }
    saveProgress(progress)

    render(
      <MemoryRouter initialEntries={['/map']}>
        <App />
      </MemoryRouter>,
    )

    const mistyNodeLink = await screen.findByRole('link', { name: mistyForest.missions[0].title.en })

    expect(mistyNodeLink).toHaveAttribute(
      'href',
      `/chapter/${mistyForest.id}/adventure/${mistyForest.missions[0].slug}`,
    )
    expect(screen.queryByRole('link', { name: rainforest.missions[0].title.en })).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Previous realm' }))

    expect(await screen.findByRole('link', { name: rainforest.missions[0].title.en })).toHaveAttribute(
      'href',
      `/chapter/${rainforest.id}/adventure/${rainforest.missions[0].slug}`,
    )
  })

  it('opens the next adventure at its first exercise from the completion screen', async () => {
    const firstMission = chapters[0].missions[0]
    const secondMission = chapters[0].missions[1]
    const progress = {
      ...createInitialProgress('en'),
      acceptedSafety: true,
      childName: 'Alex',
    }
    saveProgress(progress)

    render(
      <MemoryRouter initialEntries={[`/chapter/${firstMission.chapterId}/adventure/${firstMission.slug}`]}>
        <App />
      </MemoryRouter>,
    )

    for (let index = 0; index < firstMission.exercises.length; index += 1) {
      fireEvent.click(await screen.findByRole('button', { name: 'Start' }))
      fireEvent.click(await screen.findByRole('button', { name: 'Done' }))
    }

    expect(await screen.findByText('You earn +0 energy leaves')).toBeInTheDocument()
    expect(await screen.findByRole('link', { name: 'Next adventure' })).toHaveAttribute(
      'href',
      `/chapter/${secondMission.chapterId}/adventure/${secondMission.slug}`,
    )

    fireEvent.click(await screen.findByRole('link', { name: 'Next adventure' }))

    expect(await screen.findByText(secondMission.title.en)).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: secondMission.exercises[0].title.en })).toBeInTheDocument()
    expect(screen.getByText(`1 / ${secondMission.exercises.length}`)).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Adventure complete!' })).not.toBeInTheDocument()
  })

  it('links from the last rainforest adventure completion into the first misty forest adventure', async () => {
    const rainforest = chapters[0]
    const lastRainforestMission = rainforest.missions[rainforest.missions.length - 1]
    const firstMistyMission = chapters[1].missions[0]
    const progress = {
      ...createInitialProgress('en'),
      acceptedSafety: true,
      childName: 'Alex',
      completedMissionIds: rainforest.missions.slice(0, -1).map((mission) => mission.id),
      unlockedMissionIds: rainforest.missions.map((mission) => mission.id),
    }
    saveProgress(progress)

    render(
      <MemoryRouter
        initialEntries={[`/chapter/${lastRainforestMission.chapterId}/adventure/${lastRainforestMission.slug}`]}
      >
        <App />
      </MemoryRouter>,
    )

    for (let index = 0; index < lastRainforestMission.exercises.length; index += 1) {
      fireEvent.click(await screen.findByRole('button', { name: 'Start' }))
      fireEvent.click(await screen.findByRole('button', { name: 'Done' }))
    }

    expect(await screen.findByRole('heading', { name: 'Adventure complete!' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Next adventure' })).toHaveAttribute(
      'href',
      `/chapter/${firstMistyMission.chapterId}/adventure/${firstMistyMission.slug}`,
    )
  })

  it('keeps exercise time when children go back and resume completed exercises', async () => {
    const firstMission = chapters[0].missions[0]
    const [firstExercise, secondExercise] = firstMission.exercises
    const progress = {
      ...createInitialProgress('en'),
      acceptedSafety: true,
      childName: 'Alex',
    }
    saveProgress(progress)

    render(
      <MemoryRouter initialEntries={[`/chapter/${firstMission.chapterId}/adventure/${firstMission.slug}`]}>
        <App />
      </MemoryRouter>,
    )

    expect(await screen.findByText(firstMission.title.en)).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: firstExercise.title.en })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Previous exercise' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Next exercise' })).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Done' })).toBeDisabled()

    vi.useFakeTimers()

    try {
      fireEvent.click(screen.getByRole('button', { name: 'Start' }))
      expect(screen.getByRole('button', { name: 'Start' })).toBeDisabled()
      act(() => {
        vi.advanceTimersByTime(5000)
      })
      fireEvent.click(screen.getByRole('button', { name: 'Done' }))

      expect(screen.getByRole('heading', { name: secondExercise.title.en })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Previous exercise' })).toBeInTheDocument()
      expect(screen.queryByRole('button', { name: 'Next exercise' })).not.toBeInTheDocument()

      fireEvent.click(screen.getByRole('button', { name: 'Start' }))
      act(() => {
        vi.advanceTimersByTime(3000)
      })
      fireEvent.click(screen.getByRole('button', { name: 'Previous exercise' }))

      expect(screen.getByRole('heading', { name: firstExercise.title.en })).toBeInTheDocument()
      expect(screen.getByText('0:05')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Resume' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Next exercise' })).toBeInTheDocument()

      fireEvent.click(screen.getByRole('button', { name: 'Resume' }))
      expect(screen.getByRole('button', { name: 'Resume' })).toBeDisabled()
      act(() => {
        vi.advanceTimersByTime(2000)
      })
      fireEvent.click(screen.getByRole('button', { name: 'Done' }))

      expect(screen.getByRole('heading', { name: secondExercise.title.en })).toBeInTheDocument()
      expect(screen.getByText('0:03')).toBeInTheDocument()
      fireEvent.click(screen.getByRole('button', { name: 'Done' }))

      const expectedSeconds = 10 + Math.max(0, firstMission.exercises.length - 2)

      for (let index = 2; index < firstMission.exercises.length; index += 1) {
        fireEvent.click(screen.getByRole('button', { name: 'Start' }))
        act(() => {
          vi.advanceTimersByTime(1000)
        })
        fireEvent.click(screen.getByRole('button', { name: 'Done' }))
      }

      expect(screen.getByRole('heading', { name: 'Adventure complete!' })).toBeInTheDocument()
      expect(screen.getByText(formatTestDuration(expectedSeconds))).toBeInTheDocument()
    } finally {
      vi.useRealTimers()
    }
  })

  it('keeps Done visible after Too hard instead of switching to Next', async () => {
    const firstMission = chapters[0].missions[0]
    const progress = {
      ...createInitialProgress('en'),
      acceptedSafety: true,
      childName: 'Alex',
    }
    saveProgress(progress)

    render(
      <MemoryRouter initialEntries={[`/chapter/${firstMission.chapterId}/adventure/${firstMission.slug}`]}>
        <App />
      </MemoryRouter>,
    )

    expect(await screen.findByText(firstMission.title.en)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Start' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Done' })).toBeDisabled()

    fireEvent.click(screen.getByRole('button', { name: 'Too hard' }))

    expect(screen.getByText('Good call. Ask an adult for tips and come back when ready.')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Start' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Done' })).toBeEnabled()
    expect(screen.queryByRole('button', { name: 'Next' })).not.toBeInTheDocument()
  })

  it('only shows exercise navigation arrows for already reached exercises', async () => {
    const firstMission = chapters[0].missions[0]
    const [firstExercise, secondExercise, thirdExercise] = firstMission.exercises
    const progress = {
      ...createInitialProgress('en'),
      acceptedSafety: true,
      childName: 'Alex',
    }
    saveProgress(progress)

    render(
      <MemoryRouter initialEntries={[`/chapter/${firstMission.chapterId}/adventure/${firstMission.slug}`]}>
        <App />
      </MemoryRouter>,
    )

    expect(await screen.findByText(firstMission.title.en)).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: firstExercise.title.en })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Previous exercise' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Next exercise' })).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Start' }))
    fireEvent.click(screen.getByRole('button', { name: 'Done' }))

    expect(screen.getByRole('heading', { name: secondExercise.title.en })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Previous exercise' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Next exercise' })).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Start' }))
    fireEvent.click(screen.getByRole('button', { name: 'Done' }))

    expect(screen.getByRole('heading', { name: thirdExercise.title.en })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Previous exercise' }))

    expect(screen.getByRole('heading', { name: secondExercise.title.en })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Previous exercise' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Next exercise' })).toBeInTheDocument()
  })

  it('keeps legacy mission URLs working while using chapter adventure URLs', async () => {
    const firstMission = chapters[0].missions[0]
    const legacyMissionId = `mission-${firstMission.number}-${firstMission.slug}`
    const progress = {
      ...createInitialProgress('en'),
      acceptedSafety: true,
      childName: 'Alex',
    }
    saveProgress(progress)

    render(
      <MemoryRouter initialEntries={[`/mission/${legacyMissionId}`]}>
        <App />
      </MemoryRouter>,
    )

    expect(await screen.findByText(firstMission.title.en)).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: firstMission.exercises[0].title.en })).toBeInTheDocument()
  })

  it('opens numeric debug adventure routes and optional exercise numbers', async () => {
    const firstMission = chapters[0].missions[0]
    const secondMission = chapters[0].missions[1]
    const progress = {
      ...createInitialProgress('en'),
      acceptedSafety: true,
      childName: 'Alex',
      unlockedMissionIds: [firstMission.id, secondMission.id],
    }
    saveProgress(progress)

    render(
      <MemoryRouter initialEntries={['/chapter/1/adventure/2?ex=2']}>
        <App />
      </MemoryRouter>,
    )

    expect(await screen.findByText(secondMission.title.en)).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: secondMission.exercises[1].title.en })).toBeInTheDocument()
    expect(screen.getByText(`2 / ${secondMission.exercises.length}`)).toBeInTheDocument()
  })

  it('does not let numeric debug routes bypass locked adventures', async () => {
    const secondMission = chapters[0].missions[1]
    const progress = {
      ...createInitialProgress('en'),
      acceptedSafety: true,
      childName: 'Alex',
    }
    saveProgress(progress)

    render(
      <MemoryRouter initialEntries={['/chapter/1/adventure/2?ex=2']}>
        <App />
      </MemoryRouter>,
    )

    expect(await screen.findByRole('heading', { name: 'Finish the previous adventure first' })).toBeInTheDocument()
    expect(screen.queryByText(secondMission.title.en)).not.toBeInTheDocument()
  })
})

describe('profile badges', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('links from the profile badge preview to all badges', async () => {
    const progress = {
      ...createInitialProgress('en'),
      acceptedSafety: true,
      childName: 'Alex',
    }
    saveProgress(progress)

    render(
      <MemoryRouter initialEntries={['/profile']}>
        <App />
      </MemoryRouter>,
    )

    expect(await screen.findByRole('link', { name: 'See all →' })).toHaveAttribute('href', '/badges')
  })

  it('shows earned and locked badges on the full badges screen', async () => {
    const progress = {
      ...createInitialProgress('en'),
      acceptedSafety: true,
      badgeIds: ['morning-leaf'],
      childName: 'Alex',
    }
    saveProgress(progress)

    render(
      <MemoryRouter initialEntries={['/badges']}>
        <App />
      </MemoryRouter>,
    )

    expect(await screen.findByRole('heading', { name: 'Badges' })).toBeInTheDocument()
    expect(screen.getByText('Morning Leaf')).toBeInTheDocument()
    expect(screen.getByText('Unlocked')).toBeInTheDocument()
    expect(screen.getAllByText('To discover')).toHaveLength(badges.length - 1)
  })
})

describe('explorer title progress', () => {
  it('uses thousand-point thresholds for explorer titles', () => {
    expect(getExplorerTitleProgress(0)).toMatchObject({
      level: 1,
      pointsToNextTitle: 1000,
      title: { pl: 'Mały Listek' },
      nextTitle: { pl: 'Zwinna Gałązka' },
    })
    expect(getExplorerTitleProgress(999)).toMatchObject({
      level: 1,
      pointsToNextTitle: 1,
    })
    expect(getExplorerTitleProgress(1000)).toMatchObject({
      level: 2,
      pointsToNextTitle: 1000,
      title: { pl: 'Zwinna Gałązka' },
      nextTitle: { pl: 'Leśny Tropiciel' },
    })
    expect(getExplorerTitleProgress(1975)).toMatchObject({
      level: 2,
      pointsToNextTitle: 25,
      nextTitle: { pl: 'Leśny Tropiciel' },
    })
  })

  it('caps explorer titles at the highest title', () => {
    expect(getExplorerTitleProgress(9000)).toMatchObject({
      level: 10,
      pointsToNextTitle: 0,
      title: { pl: 'Legenda Koron Drzew' },
      nextTitle: null,
    })
    expect(getExplorerTitleProgress(12000)).toMatchObject({
      level: 10,
      pointsToNextTitle: 0,
      title: { pl: 'Legenda Koron Drzew' },
      nextTitle: null,
    })
  })
})
