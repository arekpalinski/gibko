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

type AdventureConfig = {
  chapterId?: string
  number: number
  slug: string
  title: LocalizedText
  teaser: LocalizedText
  goal: LocalizedText
  exerciseIds: ExerciseId[]
}

function adventure({
  chapterId = 'rainforest',
  number,
  slug,
  title,
  teaser,
  goal,
  exerciseIds,
}: AdventureConfig) {
  const exercises = getExercises(exerciseIds)

  return {
    id: `${chapterId}-adventure-${number}-${slug}`,
    number,
    slug,
    chapterId,
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
        slug: "canopy-warmup",
        title: text("Rozgrzewka w koronach drzew", "Warm-up in the Treetops"),
        teaser: text("Ramiona i tułów budzą się do spokojnego ruchu.", "Arms and trunk wake up with calm movement."),
        goal: text("łagodna rozgrzewka, ramiona, tułów, skłony boczne", "gentle warm-up, shoulders, trunk, side bends"),
        exerciseIds: [
          "branchReach",
          "leafyArms",
          "vineSideBend",
        ],
      }),
      adventure({
        number: 2,
        slug: "rainy-branches",
        title: text("Deszczowe gałęzie", "Rainy Branches"),
        teaser: text("Nogi i ramiona ruszają po deszczowej ścieżce.", "Legs and arms move along a rainy path."),
        goal: text("nogi, ramiona, lekka koordynacja", "legs, arms, light coordination"),
        exerciseIds: [
          "rainFrog",
          "riverSteps",
          "leafyArms",
        ],
      }),
      adventure({
        number: 3,
        slug: "vine-path",
        title: text("Ścieżka po lianach", "Path Across the Vines"),
        teaser: text("Płynne skłony, spokojne sięganie i lekkie nogi.", "Smooth bends, calm reaching, and light legs."),
        goal: text("tułów, nogi, łagodne rozciąganie", "trunk, legs, gentle stretching"),
        exerciseIds: [
          "vineSideBend",
          "branchReach",
          "rainFrog",
        ],
      }),
      adventure({
        number: 4,
        slug: "forest-feet",
        title: text("Leśne stopy", "Forest Feet"),
        teaser: text("Stopy poznają podłoże, a ciało szuka równowagi.", "Feet explore the ground while the body searches for balance."),
        goal: text("stopy, łydki, równowaga, czucie podłoża", "feet, calves, balance, ground awareness"),
        exerciseIds: [
          "berryFootPress",
          "highLeavesCalfRaise",
          "treeCircleBall",
          "sensoryPath",
          "quietToes",
        ],
      }),
      adventure({
        number: 5,
        slug: "vines-and-stones",
        title: text("Liany i kamienie", "Vines and Stones"),
        teaser: text("Spokojne kroki, miękkie kolana i mocniejsze biodra.", "Calm steps, soft knees, and stronger hips."),
        goal: text("nogi, biodra, łydki, kontrola kolan", "legs, hips, calves, knee control"),
        exerciseIds: [
          "riverSteps",
          "hipHingeTrunk",
          "ankleVineReach",
          "calfStretch",
          "frogLeafSquat",
        ],
      }),
      adventure({
        number: 6,
        slug: "balance-clearing",
        title: text("Polana równowagi", "Balance Clearing"),
        teaser: text("Stopy szukają środka, a ciało ćwiczy spokojne stanie.", "Feet search for center while the body practices calm standing."),
        goal: text("równowaga, stabilizacja, czucie stóp, kontrola tułowia", "balance, stability, foot awareness, trunk control"),
        exerciseIds: [
          "storkOnMoss",
          "wetMossBalance",
          "sideTracks",
          "tinySprings",
          "vineGuard",
        ],
      }),
      adventure({
        number: 7,
        slug: "secret-forest-book",
        title: text("Sekretna książeczka lasu", "Secret Forest Book"),
        teaser: text("Plecy, barki i nogi otwierają się powoli jak duża książka.", "Back, shoulders, and legs open slowly like a large book."),
        goal: text("kręgosłup piersiowy, barki, łopatki, tył nóg", "thoracic spine, shoulders, shoulder blades, back of legs"),
        exerciseIds: [
          "bookOpening",
          "shoulderBladeNut",
          "parrotWings",
          "legSeesSky",
          "rootsUnderFeet",
        ],
      }),
      adventure({
        number: 8,
        slug: "tropical-movement-course",
        title: text("Tropikalny tor ruchu", "Tropical Movement Trail"),
        teaser: text("Całe ciało przechodzi przez krótki, różnorodny tor.", "The whole body moves through a short varied trail."),
        goal: text("całe ciało, koordynacja, mobilność, lekka siła", "full body, coordination, mobility, light strength"),
        exerciseIds: [
          "crossedVines",
          "spiderPath",
          "crabUnderLeaf",
          "lazyTiger",
          "highLowBranch",
        ],
      }),
      adventure({
        number: 9,
        slug: "barefoot-tracks",
        title: text("Ścieżka bosych tropów", "Barefoot Tracks Path"),
        teaser: text("Stopy zbierają sygnały z podłoża i ćwiczą dokładne kroki.", "Feet gather signals from the ground and practice precise steps."),
        goal: text("stopy, łydki, równowaga, czucie podłoża", "feet, calves, balance, ground awareness"),
        exerciseIds: [
          "sensoryPath",
          "quietToes",
          "berryFootPress",
          "highLeavesCalfRaise",
          "narrowBridge",
        ],
      }),
      adventure({
        number: 10,
        slug: "leaf-dance-after-rain",
        title: text("Taniec liści po deszczu", "Dance of Leaves After Rain"),
        teaser: text("Nogi pracują w różnych kierunkach, a na końcu spokojnie odpoczywają.", "Legs work in different directions and then rest calmly."),
        goal: text("biodra, uda, łydki, koordynacja", "hips, thighs, calves, coordination"),
        exerciseIds: [
          "riverSteps",
          "crabUnderLeaf",
          "calfStretch",
          "quadRest",
          "calmTail",
        ],
      }),
      adventure({
        number: 11,
        slug: "long-legs-clearing",
        title: text("Polana długich nóg", "Long-Leg Clearing"),
        teaser: text("Tył nóg i plecy rozciągają się spokojnie, bez pośpiechu.", "Back of legs and back stretch calmly without rushing."),
        goal: text("tył nóg, biodra, plecy, spokojne rozciąganie", "back of legs, hips, back, calm stretching"),
        exerciseIds: [
          "hipHingeTrunk",
          "rootsUnderFeet",
          "ankleVineReach",
          "hamstringTrail",
          "lazyTiger",
        ],
      }),
      adventure({
        number: 12,
        slug: "vine-guards",
        title: text("Strażnicy lian", "Vine Guards"),
        teaser: text("Równowaga, stopy i biodra pilnują spokojnego środka.", "Balance, feet, and hips guard a calm center."),
        goal: text("równowaga, stopy, biodra, kontrola ciała", "balance, feet, hips, body control"),
        exerciseIds: [
          "storkOnMoss",
          "wetMossBalance",
          "forestClock",
          "vineGuard",
          "sideTracks",
        ],
      }),
      adventure({
        number: 13,
        slug: "calm-waterfall",
        title: text("Wodospad spokoju", "Waterfall of Calm"),
        teaser: text("Ciało zwalnia, oddech robi się dłuższy, a plecy odpoczywają.", "The body slows down, breath gets longer, and the back rests."),
        goal: text("wyciszenie, oddech, plecy, szyja, biodra", "calming down, breath, back, neck, hips"),
        exerciseIds: [
          "waterfallBreath",
          "owlNeckTurn",
          "bookOpening",
          "butterflyClearing",
          "leafOnWater",
        ],
      }),
      adventure({
        number: 14,
        slug: "strong-hips-jungle",
        title: text("Dżungla mocnych bioder", "Jungle of Strong Hips"),
        teaser: text("Biodra i pośladki pracują spokojnie, żeby nogi miały dobre wsparcie.", "Hips and glutes work calmly so legs have good support."),
        goal: text("biodra, pośladki, uda, stabilizacja", "hips, glutes, thighs, stability"),
        exerciseIds: [
          "rootBridge",
          "streamClamshell",
          "riverSteps",
          "crabUnderLeaf",
          "hipGate",
        ],
      }),
      adventure({
        number: 15,
        slug: "calm-calf-river",
        title: text("Rzeka spokojnych łydek", "River of Calm Calves"),
        teaser: text("Łydki, kostki i tył nóg dostają spokojną porcję odpoczynku.", "Calves, ankles, and back of legs get a calm recovery set."),
        goal: text("łydki, kostki, tył nóg, regeneracja po intensywnym bieganiu", "calves, ankles, back of legs, recovery after intense running"),
        exerciseIds: [
          "calfStretch",
          "lowCalfStretch",
          "ankleCircles",
          "sensoryPath",
          "hamstringTrail",
        ],
      }),
      adventure({
        number: 16,
        slug: "canopy-and-strong-back",
        title: text("Korony drzew i mocne plecy", "Treetops and Strong Backs"),
        teaser: text("Barki, łopatki i plecy ćwiczą dobrą, swobodną postawę.", "Shoulders, shoulder blades, and back practice free posture."),
        goal: text("barki, łopatki, plecy, tułów", "shoulders, shoulder blades, back, trunk"),
        exerciseIds: [
          "parrotWings",
          "shoulderBladeNut",
          "birdDetective",
          "lazyTiger",
          "highLowBranch",
        ],
      }),
      adventure({
        number: 17,
        slug: "hidden-scout-course",
        title: text("Ukryty tor tropiciela", "Hidden Tracker Trail"),
        teaser: text("Krótki tor dla całego ciała: równowaga, biodra, plecy i sięganie.", "A short full-body trail: balance, hips, back, and reaching."),
        goal: text("całe ciało, równowaga, koordynacja, lekka siła", "full body, balance, coordination, light strength"),
        exerciseIds: [
          "crossedVines",
          "spiderPath",
          "forestClock",
          "rootBridge",
          "mangoReach",
        ],
      }),
      adventure({
        number: 18,
        slug: "great-rainforest-expedition",
        title: text("Wielka wyprawa przez las deszczowy", "Great Rainforest Expedition"),
        teaser: text("Na koniec rozdziału wracają stopy, nogi, biodra, plecy i spokojny oddech.", "At the end of the chapter, feet, legs, hips, back, and calm breath return."),
        goal: text("podsumowanie rozdziału: stopy, nogi, biodra, plecy, oddech", "chapter recap: feet, legs, hips, back, breath"),
        exerciseIds: [
          "sensoryPath",
          "riverSteps",
          "streamClamshell",
          "bookOpening",
          "waterfallBreath",
        ],
      }),
    ],
  },
  {
    id: 'misty-forest',
    title: text('Mglisty las', 'Misty Forest'),
    description: text(
      'Drugi rozdział Gibko: ciche ścieżki, miękki mech, mgła między drzewami i uważny ruch.',
      'Gibko second chapter: quiet paths, soft moss, mist between trees, and mindful movement.',
    ),
    badgeId: 'misty-forest-pathfinder',
    missions: [
      adventure({
        chapterId: 'misty-forest',
        number: 1,
        slug: 'first-steps-in-the-mist',
        title: text('Pierwsze kroki we mgle', 'First Steps in the Mist'),
        teaser: text(
          'Stopy uczą się cichego kroku, a ciało spokojnie szuka ścieżki.',
          'Feet learn a quiet step while the body calmly searches for the path.',
        ),
        goal: text(
          'stopy, kostki, łydki, spokojny krok pięta-palce',
          'feet, ankles, calves, calm heel-to-toe step',
        ),
        exerciseIds: [
          'heelTrail',
          'quietHeelMoss',
          'leafRollStep',
          'berryFootPress',
          'calfStretch',
        ],
      }),
      adventure({
        chapterId: 'misty-forest',
        number: 2,
        slug: 'mossy-balance',
        title: text('Równowaga na mchu', 'Balance on the Moss'),
        teaser: text(
          'Miękki mech sprawdza stopy, kostki i spokojne kolana.',
          'Soft moss tests the feet, ankles, and calm knees.',
        ),
        goal: text(
          'stopy, kostki, nogi, biodra, równowaga',
          'feet, ankles, legs, hips, balance',
        ),
        exerciseIds: [
          'wetMossBalance',
          'sideTracks',
          'softIslandClock',
          'treeCircleBall',
          'storkOnMoss',
        ],
      }),
      adventure({
        chapterId: 'misty-forest',
        number: 3,
        slug: 'quiet-ribs-and-wings',
        title: text('Ciche żebra i skrzydła', 'Quiet Ribs and Wings'),
        teaser: text(
          'Klatka piersiowa, barki i tułów pracują spokojnie na leśnej ziemi.',
          'Chest, shoulders, and trunk work calmly on the forest floor.',
        ),
        goal: text(
          'klatka piersiowa, barki, plecy, brzuch i tułów',
          'chest, shoulders, back, belly and trunk',
        ),
        exerciseIds: [
          'bellyBalloon',
          'groundWingSlides',
          'ribWingSlides',
          'backNutOnFloor',
          'turtleNeck',
        ],
      }),
      adventure({
        chapterId: 'misty-forest',
        number: 4,
        slug: 'knee-tunnel-path',
        title: text('Ścieżka małych tuneli', 'Path of Little Tunnels'),
        teaser: text(
          'Kolana pilnują swojej ścieżki, a biodra pomagają w spokojnym ruchu.',
          'Knees follow their path while hips help with calm movement.',
        ),
        goal: text(
          'nogi, uda, biodra, pośladki, kontrola kolan',
          'legs, thighs, hips, glutes, knee control',
        ),
        exerciseIds: [
          'kneeTunnelSquat',
          'forestCrabKnees',
          'clamshellLeaf',
          'riverSteps',
          'hamstringTrail',
        ],
      }),
      adventure({
        chapterId: 'misty-forest',
        number: 5,
        slug: 'hidden-book-clearing',
        title: text('Polana ukrytej książeczki', 'Hidden Book Clearing'),
        teaser: text(
          'Plecy, barki i biodra otwierają się powoli jak strony leśnej książki.',
          'Back, shoulders, and hips open slowly like pages of a forest book.',
        ),
        goal: text(
          'plecy, barki, klatka piersiowa, biodra',
          'back, shoulders, chest, hips',
        ),
        exerciseIds: [
          'bookOpening',
          'bookOpening',
          'parrotWings',
          'leafOnWater',
          'lazyTiger',
        ],
      }),
      adventure({
        chapterId: 'misty-forest',
        number: 6,
        slug: 'misty-root-bridge',
        title: text('Most z mglistych korzeni', 'Bridge of Misty Roots'),
        teaser: text(
          'Korzenie wzmacniają biodra, pośladki i spokojny tułów.',
          'Roots strengthen hips, glutes, and a calm trunk.',
        ),
        goal: text(
          'biodra, pośladki, brzuch i tułów, plecy',
          'hips, glutes, belly and trunk, back',
        ),
        exerciseIds: [
          'rootBridge',
          'leafDeadBug',
          'legSeesSky',
          'hipHingeTrunk',
          'calmTail',
        ],
      }),
      adventure({
        chapterId: 'misty-forest',
        number: 7,
        slug: 'spider-path-through-fog',
        title: text('Pajęcza ścieżka przez mgłę', 'Spider Path Through the Fog'),
        teaser: text(
          'Dłonie i stopy szukają drogi, a pięty spokojnie zostają przy ziemi.',
          'Hands and feet search for the way while heels calmly stay on the ground.',
        ),
        goal: text(
          'plecy, nogi, uda, łydki, brzuch i tułów',
          'back, legs, thighs, calves, belly and trunk',
        ),
        exerciseIds: [
          'spiderPath',
          'rootsUnderFeet',
          'highLowBranch',
          'lazyTiger',
          'calfStretch',
        ],
      }),
      adventure({
        chapterId: 'misty-forest',
        number: 8,
        slug: 'misty-footprints',
        title: text('Mgliste ślady stóp', 'Misty Footprints'),
        teaser: text(
          'Każdy krok zaczyna się od pięty i kończy spokojnie na palcach.',
          'Each step begins with the heel and calmly finishes on the toes.',
        ),
        goal: text(
          'stopy, kostki, łydki, nogi',
          'feet, ankles, calves, legs',
        ),
        exerciseIds: [
          'sensoryPath',
          'heelTrail',
          'leafRollStep',
          'quietToes',
          'highLeavesCalfRaise',
        ],
      }),
      adventure({
        chapterId: 'misty-forest',
        number: 9,
        slug: 'owl-above-the-mist',
        title: text('Sowa nad mgłą', 'Owl Above the Mist'),
        teaser: text(
          'Szyja, barki i łopatki rozluźniają się po cichej wyprawie.',
          'Neck, shoulders, and shoulder blades relax after a quiet journey.',
        ),
        goal: text(
          'szyja, barki, plecy, klatka piersiowa',
          'neck, shoulders, back, chest',
        ),
        exerciseIds: [
          'owlNeckTurn',
          'turtleNeck',
          'backNutOnFloor',
          'birdDetective',
          'groundWingSlides',
        ],
      }),
      adventure({
        chapterId: 'misty-forest',
        number: 10,
        slug: 'crossed-vines-in-the-fog',
        title: text('Skrzyżowane liany we mgle', 'Crossed Vines in the Fog'),
        teaser: text(
          'Stopy, łydki i biodra ćwiczą spokojną kontrolę na leśnej ścieżce.',
          'Feet, calves, and hips practice calm control on the forest path.',
        ),
        goal: text(
          'stopy, łydki, nogi, biodra',
          'feet, calves, legs, hips',
        ),
        exerciseIds: [
          'crossedVines',
          'treeCircleBall',
          'softIslandClock',
          'hipGate',
          'lowCalfStretch',
        ],
      }),
      adventure({
        chapterId: 'misty-forest',
        number: 11,
        slug: 'quiet-knees-clearing',
        title: text('Polana spokojnych kolan', 'Clearing of Calm Knees'),
        teaser: text(
          'Kolana nie uciekają do środka, a biodra pomagają utrzymać kierunek.',
          'Knees do not fall inward while hips help keep direction.',
        ),
        goal: text(
          'nogi, uda, biodra, pośladki',
          'legs, thighs, hips, glutes',
        ),
        exerciseIds: [
          'kneeTunnelSquat',
          'forestCrabKnees',
          'clamshellLeaf',
          'frogLeafSquat',
          'quadRest',
        ],
      }),
      adventure({
        chapterId: 'misty-forest',
        number: 12,
        slug: 'forest-floor-breath',
        title: text('Oddech leśnej ziemi', 'Forest Floor Breath'),
        teaser: text(
          'Brzuch, tułów i żebra uczą się spokojnego wydechu.',
          'Belly, trunk, and ribs learn a calm exhale.',
        ),
        goal: text(
          'klatka piersiowa, brzuch i tułów, plecy',
          'chest, belly and trunk, back',
        ),
        exerciseIds: [
          'bellyBalloon',
          'leafDeadBug',
          'ribWingSlides',
          'waterfallBreath',
          'leafOnWater',
        ],
      }),
      adventure({
        chapterId: 'misty-forest',
        number: 13,
        slug: 'long-legs-in-the-mist',
        title: text('Długie ścieżki nóg', 'Long Leg Paths'),
        teaser: text(
          'Uda, łydki i biodra odpoczywają po szybkim dniu.',
          'Thighs, calves, and hips rest after a fast day.',
        ),
        goal: text(
          'uda, łydki, biodra, nogi',
          'thighs, calves, hips, legs',
        ),
        exerciseIds: [
          'hamstringTrail',
          'quadRest',
          'calfStretch',
          'lowCalfStretch',
          'butterflyClearing',
        ],
      }),
      adventure({
        chapterId: 'misty-forest',
        number: 14,
        slug: 'mossy-clock-tower',
        title: text('Zegar z miękkiego mchu', 'Clock Tower of Soft Moss'),
        teaser: text(
          'Stopa stoi spokojnie, a druga noga szuka godzin na leśnym zegarze.',
          'One foot stands calmly while the other leg finds hours on the forest clock.',
        ),
        goal: text(
          'stopy, kostki, nogi, biodra, brzuch i tułów',
          'feet, ankles, legs, hips, belly and trunk',
        ),
        exerciseIds: [
          'forestClock',
          'softIslandClock',
          'wetMossBalance',
          'sideTracks',
          'narrowBridge',
        ],
      }),
      adventure({
        chapterId: 'misty-forest',
        number: 15,
        slug: 'shoulder-leaves-after-rain',
        title: text('Liście barków po deszczu', 'Shoulder Leaves After Rain'),
        teaser: text(
          'Barki opadają spokojnie, a łopatki wracają bliżej siebie.',
          'Shoulders lower calmly while shoulder blades come closer together.',
        ),
        goal: text(
          'barki, plecy, klatka piersiowa, szyja',
          'shoulders, back, chest, neck',
        ),
        exerciseIds: [
          'turtleNeck',
          'backNutOnFloor',
          'groundWingSlides',
          'ribWingSlides',
          'parrotWings',
        ],
      }),
      adventure({
        chapterId: 'misty-forest',
        number: 16,
        slug: 'misty-animal-tracks',
        title: text('Tropy zwierząt we mgle', 'Animal Tracks in the Mist'),
        teaser: text(
          'Stopy zostawiają ślady, kolana pilnują tunelu, a plecy pomagają w ruchu.',
          'Feet leave tracks, knees guard the tunnel, and the back helps with movement.',
        ),
        goal: text(
          'stopy, nogi, uda, biodra, plecy',
          'feet, legs, thighs, hips, back',
        ),
        exerciseIds: [
          'heelTrail',
          'kneeTunnelSquat',
          'spiderPath',
          'bookOpening',
          'rootBridge',
        ],
      }),
      adventure({
        chapterId: 'misty-forest',
        number: 17,
        slug: 'quiet-path-to-the-treetops',
        title: text('Cicha ścieżka do koron drzew', 'Quiet Path to the Treetops'),
        teaser: text(
          'Stopy, łydki, barki i tułów pracują razem w spokojnym rytmie.',
          'Feet, calves, shoulders, and trunk work together in a calm rhythm.',
        ),
        goal: text(
          'stopy, łydki, barki, plecy, brzuch i tułów',
          'feet, calves, shoulders, back, belly and trunk',
        ),
        exerciseIds: [
          'leafRollStep',
          'highLeavesCalfRaise',
          'mangoReach',
          'ribWingSlides',
          'leafDeadBug',
        ],
      }),
      adventure({
        chapterId: 'misty-forest',
        number: 18,
        slug: 'great-misty-expedition',
        title: text('Wielka wyprawa przez mglisty las', 'Great Misty Forest Expedition'),
        teaser: text(
          'Ostatnia wyprawa łączy ciche kroki, spokojne kolana, skrzydła i oddech.',
          'The final expedition combines quiet steps, calm knees, wings, and breath.',
        ),
        goal: text(
          'stopy, nogi, biodra, barki, plecy, brzuch i tułów',
          'feet, legs, hips, shoulders, back, belly and trunk',
        ),
        exerciseIds: [
          'heelTrail',
          'softIslandClock',
          'clamshellLeaf',
          'bookOpening',
          'ribWingSlides',
        ],
      }),
    ],
  },
]
