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
    number,
    slug,
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
]
