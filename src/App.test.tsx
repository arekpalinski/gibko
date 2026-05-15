import '@testing-library/jest-dom/vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it } from 'vitest'
import { App, getExplorerTitleProgress } from './App'
import { chapters } from './data/chapters'
import { createInitialProgress, saveProgress } from './state/progress'

describe('mission flow', () => {
  beforeEach(() => {
    localStorage.clear()
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
      <MemoryRouter initialEntries={[`/mission/${firstMission.id}`]}>
        <App />
      </MemoryRouter>,
    )

    for (let index = 0; index < firstMission.exercises.length; index += 1) {
      fireEvent.click(await screen.findByRole('button', { name: 'Start' }))
      fireEvent.click(await screen.findByRole('button', { name: 'Done' }))
    }

    fireEvent.click(await screen.findByRole('link', { name: 'Next adventure' }))

    expect(await screen.findByText(secondMission.title.en)).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: secondMission.exercises[0].title.en })).toBeInTheDocument()
    expect(screen.getByText(`1 / ${secondMission.exercises.length}`)).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Adventure complete!' })).not.toBeInTheDocument()
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
