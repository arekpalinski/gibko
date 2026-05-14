import type { ExerciseDefinition } from '../types'

export const exerciseLibrary = {
  ankleCircles: {
    id: 'ankle-circles',
    title: { pl: 'Kostka rysuje kółka', en: 'Ankle Circle Drawing' },
    icon: 'foot',
  },
  ankleVine: {
    id: 'ankle-vine',
    title: { pl: 'Liana przy kostce', en: 'Ankle Vine Reach' },
    icon: 'vine',
  },
  berryUnderFoot: {
    id: 'berry-under-foot',
    title: { pl: 'Jagódka pod stopą', en: 'Berry Underfoot' },
    icon: 'ball',
    equipment: ['softBall'],
  },
  branchReach: {
    id: 'branch-reach',
    title: { pl: 'Sięganie po gałąź', en: 'Branch Reach' },
    icon: 'branch',
  },
  calmTail: {
    id: 'calm-tail',
    title: { pl: 'Spokojny ogon', en: 'Calm Tail Turns' },
    icon: 'vine',
  },
  crabUnderLeaf: {
    id: 'crab-under-leaf',
    title: { pl: 'Krab pod liściem', en: 'Crab Under a Leaf' },
    icon: 'hip',
  },
  crossedVines: {
    id: 'crossed-vines',
    title: { pl: 'Skrzyżowane liany', en: 'Crossed Vines' },
    icon: 'balance',
    equipment: ['softBall'],
  },
  detectiveBird: {
    id: 'detective-bird',
    title: { pl: 'Ptak-detektyw', en: 'Detective Bird' },
    icon: 'back',
  },
  forestBook: {
    id: 'forest-book',
    title: { pl: 'Książeczka', en: 'Forest Book' },
    icon: 'back',
  },
  forestClock: {
    id: 'forest-clock',
    title: { pl: 'Leśny zegar', en: 'Forest Clock' },
    icon: 'balance',
  },
  frogOnLeaf: {
    id: 'frog-on-leaf',
    title: { pl: 'Żabka na liściu', en: 'Frog on a Leaf' },
    icon: 'frog',
  },
  highBranchLowBranch: {
    id: 'high-branch-low-branch',
    title: { pl: 'Wysoka gałąź, niska gałąź', en: 'High Branch, Low Branch' },
    icon: 'branch',
  },
  hipGate: {
    id: 'hip-gate',
    title: { pl: 'Biodrowa brama', en: 'Hip Gate' },
    icon: 'hip',
  },
  hipsToTrunk: {
    id: 'hips-to-trunk',
    title: { pl: 'Pupa do pnia', en: 'Hips to the Trunk' },
    icon: 'hip',
  },
  lazyTiger: {
    id: 'lazy-tiger',
    title: { pl: 'Leniwy tygrys', en: 'Lazy Tiger' },
    icon: 'back',
  },
  leafyArms: {
    id: 'leafy-arms',
    title: { pl: 'Liściaste ramiona', en: 'Leafy Arms' },
    icon: 'leaf',
  },
  leafOnWater: {
    id: 'leaf-on-water',
    title: { pl: 'Liść na wodzie', en: 'Leaf on Water' },
    icon: 'breath',
  },
  legToSky: {
    id: 'leg-to-sky',
    title: { pl: 'Noga patrzy w niebo', en: 'Leg Looks at the Sky' },
    icon: 'foot',
  },
  lowCalf: {
    id: 'low-calf',
    title: { pl: 'Niska łydka', en: 'Low Calf Stretch' },
    icon: 'foot',
  },
  mangoPicking: {
    id: 'mango-picking',
    title: { pl: 'Zbieranie mango', en: 'Mango Picking' },
    icon: 'branch',
  },
  meadowButterfly: {
    id: 'meadow-butterfly',
    title: { pl: 'Motyl na polanie', en: 'Meadow Butterfly' },
    icon: 'hip',
  },
  narrowBridge: {
    id: 'narrow-bridge',
    title: { pl: 'Wąska kładka', en: 'Narrow Bridge' },
    icon: 'balance',
  },
  nutBetweenShoulders: {
    id: 'nut-between-shoulders',
    title: { pl: 'Orzeszek między łopatkami', en: 'Nut Between the Shoulder Blades' },
    icon: 'back',
  },
  owlTurnsHead: {
    id: 'owl-turns-head',
    title: { pl: 'Sowa obraca głowę', en: 'Owl Turns Its Head' },
    icon: 'back',
  },
  parrotWings: {
    id: 'parrot-wings',
    title: { pl: 'Papuzie skrzydła', en: 'Parrot Wings' },
    icon: 'back',
  },
  pricklyPath: {
    id: 'prickly-path',
    title: { pl: 'Kolczasta ścieżka', en: 'Prickly Path' },
    icon: 'mat',
    equipment: ['sensoryMat'],
  },
  quietToes: {
    id: 'quiet-toes',
    title: { pl: 'Ciche palce', en: 'Quiet Toes' },
    icon: 'foot',
  },
  rainFrog: {
    id: 'rain-frog',
    title: { pl: 'Żabka po deszczu', en: 'Rain Frog' },
    icon: 'frog',
  },
  riverSteps: {
    id: 'river-steps',
    title: { pl: 'Kroki przez strumyk', en: 'River Steps' },
    icon: 'river',
  },
  rootBridge: {
    id: 'root-bridge',
    title: { pl: 'Mostek z korzenia', en: 'Root Bridge' },
    icon: 'hip',
  },
  rootsUnderFeet: {
    id: 'roots-under-feet',
    title: { pl: 'Korzenie pod stopami', en: 'Roots Underfoot' },
    icon: 'foot',
  },
  sideTracks: {
    id: 'side-tracks',
    title: { pl: 'Ślady na boki', en: 'Side Tracks' },
    icon: 'balance',
    equipment: ['sensoryCushion'],
  },
  smallSprings: {
    id: 'small-springs',
    title: { pl: 'Małe sprężynki', en: 'Little Springs' },
    icon: 'balance',
  },
  spiderPath: {
    id: 'spider-path',
    title: { pl: 'Pajęcza ścieżka', en: 'Spider Path' },
    icon: 'back',
  },
  springyCalves: {
    id: 'springy-calves',
    title: { pl: 'Sprężyste łydki', en: 'Springy Calves' },
    icon: 'foot',
  },
  steppingStones: {
    id: 'stepping-stones',
    title: { pl: 'Kamienie przez strumyk', en: 'Stepping Stones' },
    icon: 'river',
  },
  storkOnMoss: {
    id: 'stork-on-moss',
    title: { pl: 'Bocian na mchu', en: 'Stork on Moss' },
    icon: 'balance',
  },
  streamShell: {
    id: 'stream-shell',
    title: { pl: 'Muszla przy strumyku', en: 'Stream Shell' },
    icon: 'hip',
  },
  tallLeaves: {
    id: 'tall-leaves',
    title: { pl: 'Wysokie liście', en: 'Tall Leaves' },
    icon: 'leaf',
  },
  thighFrontRest: {
    id: 'thigh-front-rest',
    title: { pl: 'Przód uda odpoczywa', en: 'Front Thigh Rest' },
    icon: 'foot',
  },
  trackAroundTree: {
    id: 'track-around-tree',
    title: { pl: 'Trop wokół drzewa', en: 'Track Around the Tree' },
    icon: 'ball',
    equipment: ['softBall'],
  },
  trailBackLeg: {
    id: 'trail-back-leg',
    title: { pl: 'Tylna ścieżka nogi', en: 'Back-Leg Trail' },
    icon: 'foot',
  },
  vineGuard: {
    id: 'vine-guard',
    title: { pl: 'Strażnik liany', en: 'Vine Guard' },
    icon: 'balance',
  },
  vineSideBend: {
    id: 'vine-side-bend',
    title: { pl: 'Skłon po lianę', en: 'Vine Side Bend' },
    icon: 'vine',
  },
  waterfallBreath: {
    id: 'waterfall-breath',
    title: { pl: 'Wodospadowy oddech', en: 'Waterfall Breath' },
    icon: 'breath',
  },
  wetMoss: {
    id: 'wet-moss',
    title: { pl: 'Mokry mech', en: 'Wet Moss' },
    icon: 'balance',
    equipment: ['sensoryCushion'],
  },
} satisfies Record<string, ExerciseDefinition>
