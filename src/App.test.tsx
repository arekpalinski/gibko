import '@testing-library/jest-dom/vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { App, getExplorerTitleProgress } from './App'
import { badges } from './data/badges'
import { chapters } from './data/chapters'
import { createInitialProgress, saveProgress } from './state/progress'

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

    expect(startLink).toHaveAttribute(
      'href',
      `/chapter/${firstMission.chapterId}/adventure/${firstMission.slug}`,
    )
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

    expect(mapNodeLink).toHaveAttribute(
      'href',
      `/chapter/${firstMission.chapterId}/adventure/${firstMission.slug}`,
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

  it('keeps legacy mission URLs working while using chapter adventure URLs', async () => {
    const firstMission = chapters[0].missions[0]
    const progress = {
      ...createInitialProgress('en'),
      acceptedSafety: true,
      childName: 'Alex',
    }
    saveProgress(progress)

    render(
      <MemoryRouter initialEntries={[`/mission/${firstMission.id}`]}>
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
