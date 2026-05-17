import type { Chapter, LocalizedText } from '../types'
import {
  type ExerciseId,
  getAdventureEnergyLeaves,
  getAdventureEquipment,
  getAdventureEstimatedMinutes,
  getAdventureEstimatedTimeLabel,
  getExercises,
} from './exercises'

const text = (pl: string, en: string): LocalizedText => ({ pl, en })

function adventure({
  number,
  slug,
  title,
  teaser,
  goal,
  exerciseIds,
}: {
  number: number
  slug: string
  title: LocalizedText
  teaser: LocalizedText
  goal: LocalizedText
  exerciseIds: ExerciseId[]
}) {
  const exercises = getExercises(exerciseIds)

  return {
    id: 'mission-' + number + '-' + slug,
    chapterId: 'rainforest',
    title,
    teaser,
    goal,
    exerciseIds,
    exercises,
    equipment: getAdventureEquipment(exercises),
    xp: getAdventureEnergyLeaves(exercises),
    estimatedMinutes: getAdventureEstimatedMinutes(exercises),
    estimatedTimeLabel: getAdventureEstimatedTimeLabel(exercises),
  }
}

export const chapters: Chapter[] = [
  {
    id: 'rainforest',
    title: text('Las deszczowy', 'Rainforest'),
    description: text(
      'Pierwszy rozdział Gibko: wilgotne liście, miękkie gałęzie i spokojny ruch.',
      'Gibko first chapter: wet leaves, soft branches, and calm movement.',
    ),
    badgeId: 'rainforest-scout',
    missions: [
      adventure({
        number: 1,
        slug: 'canopy-warmup',
        title: text('Rozgrzewka w koronach drzew', 'Canopy Warmup'),
        teaser: text(
          'Gibko sprawdza gałęzie, ramiona i miękkie skłony.',
          'Gibko checks branches, arms, and gentle side bends.',
        ),
        goal: text('łagodna rozgrzewka, ramiona, tułów, skłony boczne', 'gentle warmup, arms, trunk, side bends'),
        exerciseIds: [
          'mission-1-canopy-warmup-branch-reach',
          'mission-1-canopy-warmup-leafy-arms',
          'mission-1-canopy-warmup-vine-side-bend',
        ],
      }),
      adventure({
        number: 2,
        slug: 'rainy-branches',
        title: text('Deszczowe gałęzie', 'Rainy Branches'),
        teaser: text('Trochę ruchu, trochę uśmiechu i ani kropli pośpiechu.', 'A little movement, a little smile, and no hurry.'),
        goal: text('nogi, ramiona, lekka koordynacja', 'legs, arms, light coordination'),
        exerciseIds: [
          'mission-2-rainy-branches-rain-frog',
          'mission-2-rainy-branches-river-steps',
          'mission-2-rainy-branches-leafy-arms',
        ],
      }),
      adventure({
        number: 3,
        slug: 'vine-path',
        title: text('Ścieżka po lianach', 'Vine Path'),
        teaser: text('Dłużej, spokojniej i z gibkim balansem.', 'Longer, calmer, and with flexible balance.'),
        goal: text('tułów, nogi, łagodne rozciąganie', 'trunk, legs, gentle stretching'),
        exerciseIds: [
          'mission-3-vine-path-vine-side-bend',
          'mission-3-vine-path-branch-reach',
          'mission-3-vine-path-rain-frog',
        ],
      }),
      adventure({
        number: 4,
        slug: 'forest-feet',
        title: text('Leśne stopy', 'Forest Feet'),
        teaser: text('Stopy odkrywają miękkie tropy, piłeczkę i spokojną równowagę.', 'Feet discover soft tracks, a small ball, and calm balance.'),
        goal: text('stopy, łydki, równowaga, czucie podłoża', 'feet, calves, balance, ground awareness'),
        exerciseIds: [
          'mission-4-forest-feet-berry-under-foot',
          'mission-4-forest-feet-tall-leaves',
          'mission-4-forest-feet-track-around-tree',
          'mission-4-forest-feet-prickly-path',
          'mission-4-forest-feet-quiet-toes',
        ],
      }),
      adventure({
        number: 5,
        slug: 'vines-and-stones',
        title: text('Liany i kamienie', 'Vines and Stones'),
        teaser: text('Nogi ruszają przez strumyk, a biodra uczą się spokojnej kontroli.', 'Legs cross the stream while hips learn calm control.'),
        goal: text('nogi, biodra, łydki, kontrola kolan', 'legs, hips, calves, knee control'),
        exerciseIds: [
          'mission-5-vines-and-stones-stepping-stones',
          'mission-5-vines-and-stones-hips-to-trunk',
          'mission-5-vines-and-stones-ankle-vine',
          'mission-5-vines-and-stones-springy-calves',
          'mission-5-vines-and-stones-frog-on-leaf',
        ],
      }),
      adventure({
        number: 6,
        slug: 'balance-clearing',
        title: text('Polana równowagi', 'Balance Clearing'),
        teaser: text('Stopy szukają środka, a ciało ćwiczy spokojne stanie.', 'Feet search for center while the body practices calm standing.'),
        goal: text('równowaga, stabilizacja, czucie stóp, kontrola tułowia', 'balance, stability, foot awareness, trunk control'),
        exerciseIds: [
          'mission-6-balance-clearing-stork-on-moss',
          'mission-6-balance-clearing-wet-moss',
          'mission-6-balance-clearing-side-tracks',
          'mission-6-balance-clearing-small-springs',
          'mission-6-balance-clearing-vine-guard',
        ],
      }),
      adventure({
        number: 7,
        slug: 'secret-forest-book',
        title: text('Sekretna książeczka lasu', 'Secret Forest Book'),
        teaser: text('Plecy otwierają wielką leśną stronę, a łopatki pracują miękko.', 'The back opens a big forest page while shoulder blades move softly.'),
        goal: text('kręgosłup piersiowy, barki, łopatki, tył nóg', 'upper back, shoulders, shoulder blades, back of legs'),
        exerciseIds: [
          'mission-7-secret-forest-book-forest-book',
          'mission-7-secret-forest-book-nut-between-shoulders',
          'mission-7-secret-forest-book-parrot-wings',
          'mission-7-secret-forest-book-leg-to-sky',
          'mission-7-secret-forest-book-roots-under-feet',
        ],
      }),
      adventure({
        number: 8,
        slug: 'tropical-movement-course',
        title: text('Tropikalny tor ruchu', 'Tropical Movement Course'),
        teaser: text('Całe ciało przechodzi przez cichy, zielony tor.', 'The whole body moves through a quiet green course.'),
        goal: text('całe ciało, koordynacja, mobilność, lekka siła', 'whole body, coordination, mobility, light strength'),
        exerciseIds: [
          'mission-8-tropical-movement-course-crossed-vines',
          'mission-8-tropical-movement-course-spider-path',
          'mission-8-tropical-movement-course-crab-under-leaf',
          'mission-8-tropical-movement-course-lazy-tiger',
          'mission-8-tropical-movement-course-high-branch-low-branch',
        ],
      }),
      adventure({
        number: 9,
        slug: 'barefoot-tracks',
        title: text('Ścieżka bosych tropów', 'Barefoot Tracks Path'),
        teaser: text('Stopy poznają matę, ciszę palców i wąską kładkę.', 'Feet meet the mat, quiet toes, and a narrow bridge.'),
        goal: text('stopy, łydki, równowaga, czucie podłoża', 'feet, calves, balance, ground awareness'),
        exerciseIds: [
          'mission-9-barefoot-tracks-prickly-path',
          'mission-9-barefoot-tracks-quiet-toes',
          'mission-9-barefoot-tracks-berry-under-foot',
          'mission-9-barefoot-tracks-narrow-bridge',
        ],
      }),
      adventure({
        number: 10,
        slug: 'leaf-dance-after-rain',
        title: text('Taniec liści po deszczu', 'Leaf Dance After Rain'),
        teaser: text('Biodra, uda i łydki ruszają jak liście po deszczu.', 'Hips, thighs, and calves move like leaves after rain.'),
        goal: text('biodra, uda, łydki, koordynacja', 'hips, thighs, calves, coordination'),
        exerciseIds: [
          'mission-10-leaf-dance-after-rain-stepping-stones',
          'mission-10-leaf-dance-after-rain-crab-under-leaf',
          'mission-10-leaf-dance-after-rain-springy-calves',
          'mission-10-leaf-dance-after-rain-thigh-front-rest',
          'mission-10-leaf-dance-after-rain-calm-tail',
        ],
      }),
      adventure({
        number: 11,
        slug: 'long-legs-clearing',
        title: text('Polana długich nóg', 'Long-Leg Clearing'),
        teaser: text('Spokojne skłony i długie nogi bez pośpiechu.', 'Calm folds and long legs without rushing.'),
        goal: text('tył nóg, biodra, plecy, spokojne rozciąganie', 'back of legs, hips, back, calm stretching'),
        exerciseIds: [
          'mission-11-long-legs-clearing-hips-to-trunk',
          'mission-11-long-legs-clearing-roots-under-feet',
          'mission-11-long-legs-clearing-ankle-vine',
          'mission-11-long-legs-clearing-trail-back-leg',
          'mission-11-long-legs-clearing-lazy-tiger',
        ],
      }),
      adventure({
        number: 12,
        slug: 'vine-guards',
        title: text('Strażnicy lian', 'Vine Guards'),
        teaser: text('Równowaga pilnuje lian, a stopy uczą się miękkiego środka.', 'Balance guards the vines while feet learn a soft center.'),
        goal: text('równowaga, stopy, biodra, kontrola ciała', 'balance, feet, hips, body control'),
        exerciseIds: [
          'mission-12-vine-guards-stork-on-moss',
          'mission-12-vine-guards-wet-moss',
          'mission-12-vine-guards-forest-clock',
          'mission-12-vine-guards-vine-guard',
          'mission-12-vine-guards-side-tracks',
        ],
      }),
      adventure({
        number: 13,
        slug: 'calm-waterfall',
        title: text('Wodospad spokoju', 'Waterfall of Calm'),
        teaser: text('Cichy oddech, miękkie plecy i chwila spokojnej rzeki.', 'Quiet breathing, soft backs, and a moment of calm river.'),
        goal: text('wyciszenie, oddech, plecy, szyja, biodra', 'calming down, breath, back, neck, hips'),
        exerciseIds: [
          'mission-13-calm-waterfall-waterfall-breath',
          'mission-13-calm-waterfall-owl-turns-head',
          'mission-13-calm-waterfall-forest-book',
          'mission-13-calm-waterfall-meadow-butterfly',
          'mission-13-calm-waterfall-leaf-on-water',
        ],
      }),
      adventure({
        number: 14,
        slug: 'strong-hips-jungle',
        title: text('Dżungla mocnych bioder', 'Strong-Hip Jungle'),
        teaser: text('Biodra otwierają bramy, a mały mostek rośnie z korzenia.', 'Hips open gates while a little bridge grows from a root.'),
        goal: text('biodra, pośladki, uda, stabilizacja', 'hips, glutes, thighs, stability'),
        exerciseIds: [
          'mission-14-strong-hips-jungle-root-bridge',
          'mission-14-strong-hips-jungle-stream-shell',
          'mission-14-strong-hips-jungle-stepping-stones',
          'mission-14-strong-hips-jungle-crab-under-leaf',
          'mission-14-strong-hips-jungle-hip-gate',
        ],
      }),
      adventure({
        number: 15,
        slug: 'calm-calf-river',
        title: text('Rzeka spokojnych łydek', 'Calm Calf River'),
        teaser: text('Łydki, kostki i tył nóg dostają spokojny nurt.', 'Calves, ankles, and back legs get a calm current.'),
        goal: text('łydki, kostki, tył nóg, regeneracja po intensywnym bieganiu', 'calves, ankles, back of legs, recovery after intense running'),
        exerciseIds: [
          'mission-15-calm-calf-river-springy-calves',
          'mission-15-calm-calf-river-low-calf',
          'mission-15-calm-calf-river-ankle-circles',
          'mission-15-calm-calf-river-prickly-path',
          'mission-15-calm-calf-river-trail-back-leg',
        ],
      }),
      adventure({
        number: 16,
        slug: 'canopy-and-strong-back',
        title: text('Korony drzew i mocne plecy', 'Canopy and Strong Back'),
        teaser: text('Barki i plecy pracują jak skrzydła między drzewami.', 'Shoulders and back work like wings between trees.'),
        goal: text('barki, łopatki, plecy, tułów', 'shoulders, shoulder blades, back, trunk'),
        exerciseIds: [
          'mission-16-canopy-and-strong-back-parrot-wings',
          'mission-16-canopy-and-strong-back-nut-between-shoulders',
          'mission-16-canopy-and-strong-back-detective-bird',
          'mission-16-canopy-and-strong-back-lazy-tiger',
          'mission-16-canopy-and-strong-back-high-branch-low-branch',
        ],
      }),
      adventure({
        number: 17,
        slug: 'hidden-scout-course',
        title: text('Ukryty tor tropiciela', 'Hidden Scout Course'),
        teaser: text('Tropiciel przechodzi przez liany, zegar, mostek i mango.', 'The scout moves through vines, clock, bridge, and mango.'),
        goal: text('całe ciało, równowaga, koordynacja, lekka siła', 'whole body, balance, coordination, light strength'),
        exerciseIds: [
          'mission-17-hidden-scout-course-crossed-vines',
          'mission-17-hidden-scout-course-spider-path',
          'mission-17-hidden-scout-course-forest-clock',
          'mission-17-hidden-scout-course-root-bridge',
          'mission-17-hidden-scout-course-mango-picking',
        ],
      }),
      adventure({
        number: 18,
        slug: 'great-rainforest-expedition',
        title: text('Wielka wyprawa przez las deszczowy', 'Great Rainforest Expedition'),
        teaser: text('Finał rozdziału: stopy, nogi, biodra, plecy i spokojny oddech.', 'Chapter finale: feet, legs, hips, back, and calm breath.'),
        goal: text('podsumowanie rozdziału: stopy, nogi, biodra, plecy, oddech', 'chapter recap: feet, legs, hips, back, breath'),
        exerciseIds: [
          'mission-18-great-rainforest-expedition-prickly-path',
          'mission-18-great-rainforest-expedition-stepping-stones',
          'mission-18-great-rainforest-expedition-stream-shell',
          'mission-18-great-rainforest-expedition-forest-book',
          'mission-18-great-rainforest-expedition-waterfall-breath',
        ],
      }),
    ],
  },
]
