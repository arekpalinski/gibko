import type { Chapter, Equipment, Exercise, LocalizedText } from '../types'
import { exerciseLibrary } from './exercises'

const text = (pl: string, en: string): LocalizedText => ({ pl, en })

function exercise(
  exerciseKey: keyof typeof exerciseLibrary,
  details: {
    minutes: number
    durationLabel: LocalizedText
    repetitions: LocalizedText
    description: LocalizedText
    note?: LocalizedText
  },
): Exercise {
  const definition = exerciseLibrary[exerciseKey]

  return {
    id: definition.id,
    exerciseId: definition.id,
    title: definition.title,
    icon: definition.icon,
    ...details,
  }
}

function mission({
  number,
  slug,
  title,
  teaser,
  goal,
  equipment,
  xp,
  estimatedMinutes,
  durationLabel,
  exercises,
}: {
  number: number
  slug: string
  title: LocalizedText
  teaser: LocalizedText
  goal: LocalizedText
  equipment: Equipment[]
  xp: number
  estimatedMinutes: number
  durationLabel: LocalizedText
  exercises: Exercise[]
}) {
  return {
    id: `mission-${number}-${slug}`,
    chapterId: 'rainforest',
    title,
    teaser,
    goal,
    equipment,
    xp,
    estimatedMinutes,
    durationLabel,
    exercises,
  }
}

const noEquipment: Equipment[] = ['none']

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
      mission({
        number: 1,
        slug: 'canopy-warmup',
        title: text('Rozgrzewka w koronach drzew', 'Canopy Warmup'),
        teaser: text(
          'Gibko sprawdza gałęzie, ramiona i miękkie skłony.',
          'Gibko checks branches, arms, and gentle side bends.',
        ),
        goal: text('łagodna rozgrzewka, ramiona, tułów, skłony boczne', 'gentle warmup, arms, trunk, side bends'),
        equipment: noEquipment,
        xp: 80,
        estimatedMinutes: 12,
        durationLabel: text('12 min', '12 min'),
        exercises: [
          exercise('branchReach', {
            minutes: 3,
            durationLabel: text('3 min', '3 min'),
            repetitions: text('10-12 spokojnych sięgnięć', '10-12 calm reaches'),
            description: text(
              'Powoli wyciągnij ręce wysoko, jakby nad głową była wygodna gałąź. Opuść spokojnie i powtórz kilka razy.',
              'Slowly reach your arms up as if there is a comfy branch above your head. Lower gently and repeat a few times.',
            ),
            note: text(
              'Nie wyginaj mocno pleców. Ruch ma być długi i spokojny.',
              'Do not arch your back strongly. Keep the movement long and calm.',
            ),
          }),
          exercise('leafyArms', {
            minutes: 4,
            durationLabel: text('4 min', '4 min'),
            repetitions: text('10 kółek w przód i 10 kółek w tył, 2 rundy', '10 circles forward and 10 backward, 2 rounds'),
            description: text(
              'Rozłóż ręce na boki i zataczaj małe koła. Liście szumią, a ramiona budzą się do ruchu.',
              'Stretch your arms sideways and draw small circles. Leaves rustle while your shoulders wake up.',
            ),
            note: text('Koła są małe. Nie trzeba machać szeroko.', 'Keep the circles small. There is no need for big swings.'),
          }),
          exercise('vineSideBend', {
            minutes: 5,
            durationLabel: text('5 min', '5 min'),
            repetitions: text('8 skłonów na każdą stronę', '8 bends to each side'),
            description: text(
              'Zrób lekki skłon w bok, potem na drugą stronę. Bez szarpania — liana lubi płynny ruch.',
              'Make a gentle side bend, then bend to the other side. No yanking; vines like smooth movement.',
            ),
            note: text(
              'Nie pochylaj się do przodu. Idź bokiem tylko tak daleko, jak jest wygodnie.',
              'Do not lean forward. Move sideways only as far as feels comfortable.',
            ),
          }),
        ],
      }),
      mission({
        number: 2,
        slug: 'rainy-branches',
        title: text('Deszczowe gałęzie', 'Rainy Branches'),
        teaser: text('Trochę ruchu, trochę uśmiechu i ani kropli pośpiechu.', 'A little movement, a little smile, and no hurry.'),
        goal: text('nogi, ramiona, lekka koordynacja', 'legs, arms, light coordination'),
        equipment: noEquipment,
        xp: 95,
        estimatedMinutes: 14,
        durationLabel: text('14 min', '14 min'),
        exercises: [
          exercise('rainFrog', {
            minutes: 4,
            durationLabel: text('4 min', '4 min'),
            repetitions: text('8-10 spokojnych przysiadów', '8-10 calm squats'),
            description: text(
              'Przykucnij tylko tak nisko, jak jest wygodnie. Wstań spokojnie, jak żabka po ciepłym deszczu.',
              'Squat only as low as comfortable. Stand up calmly, like a frog after warm rain.',
            ),
            note: text(
              'Kolana patrzą w stronę palców stóp. Nie trzeba schodzić głęboko.',
              'Knees point toward the toes. You do not need to go deep.',
            ),
          }),
          exercise('riverSteps', {
            minutes: 5,
            durationLabel: text('5 min', '5 min'),
            repetitions: text('8 wykroków na każdą nogę', '8 lunges on each leg'),
            description: text(
              'Rób spokojne wykroki w miejscu, jakby każdy krok omijał małą kałużę na leśnej ścieżce.',
              'Make calm lunges in place, as if each step avoids a tiny puddle on the forest path.',
            ),
            note: text('Krok może być krótki. Najważniejsza jest kontrola.', 'The step can be short. Control matters most.'),
          }),
          exercise('leafyArms', {
            minutes: 5,
            durationLabel: text('5 min', '5 min'),
            repetitions: text('10 kółek w przód i 10 kółek w tył, 2-3 rundy', '10 circles forward and 10 backward, 2-3 rounds'),
            description: text(
              'Rozłóż ręce na boki i zataczaj małe koła. Ramiona pracują lekko, jak liście na wietrze.',
              'Stretch your arms sideways and draw small circles. Your arms move lightly, like leaves in the wind.',
            ),
            note: text('Jeśli ramiona się męczą, opuść je na chwilę.', 'If your arms get tired, lower them for a moment.'),
          }),
        ],
      }),
      mission({
        number: 3,
        slug: 'vine-path',
        title: text('Ścieżka po lianach', 'Vine Path'),
        teaser: text('Dłużej, spokojniej i z gibkim balansem.', 'Longer, calmer, and with flexible balance.'),
        goal: text('tułów, nogi, łagodne rozciąganie', 'trunk, legs, gentle stretching'),
        equipment: noEquipment,
        xp: 110,
        estimatedMinutes: 15,
        durationLabel: text('15 min', '15 min'),
        exercises: [
          exercise('vineSideBend', {
            minutes: 5,
            durationLabel: text('5 min', '5 min'),
            repetitions: text('8 skłonów na każdą stronę', '8 bends to each side'),
            description: text(
              'Zrób lekki skłon w bok, potem na drugą stronę. Ruch jest płynny, bez szarpania.',
              'Make a gentle side bend, then bend to the other side. Keep it smooth, without yanking.',
            ),
            note: text('Oddychaj spokojnie. Nie zatrzymuj oddechu.', 'Breathe calmly. Do not hold your breath.'),
          }),
          exercise('branchReach', {
            minutes: 5,
            durationLabel: text('5 min', '5 min'),
            repetitions: text('12 spokojnych sięgnięć', '12 calm reaches'),
            description: text(
              'Wyciągnij ręce wysoko do góry, zatrzymaj na chwilę i opuść. Spróbuj poczuć długi tułów.',
              'Reach your arms high, pause for a moment, and lower them. Try to feel your trunk grow long.',
            ),
            note: text('Nie stawaj na palcach, jeśli tracisz równowagę.', 'Do not rise onto your toes if you lose balance.'),
          }),
          exercise('rainFrog', {
            minutes: 5,
            durationLabel: text('5 min', '5 min'),
            repetitions: text('10 spokojnych przysiadów', '10 calm squats'),
            description: text(
              'Przykucnij tylko tak nisko, jak jest wygodnie. Wróć do stania powoli i cicho.',
              'Squat only as low as comfortable. Return to standing slowly and quietly.',
            ),
            note: text('Nie śpiesz się. To nie są zawody.', 'Do not rush. This is not a race.'),
          }),
        ],
      }),
      mission({
        number: 4,
        slug: 'forest-feet',
        title: text('Leśne stopy', 'Forest Feet'),
        teaser: text('Stopy odkrywają miękkie tropy, piłeczkę i spokojną równowagę.', 'Feet discover soft tracks, a small ball, and calm balance.'),
        goal: text('stopy, łydki, równowaga, czucie podłoża', 'feet, calves, balance, ground awareness'),
        equipment: ['softBall', 'sensoryMat'],
        xp: 95,
        estimatedMinutes: 15,
        durationLabel: text('13-15 min', '13-15 min'),
        exercises: [
          exercise('berryUnderFoot', {
            minutes: 4,
            durationLabel: text('2 min na stopę', '2 min per foot'),
            repetitions: text('8-10 nacisków na stopę, każdy po 3-5 sekund', '8-10 presses per foot, 3-5 seconds each'),
            description: text(
              'Połóż miękką piłeczkę pod stopą. Dociśnij ją spokojnie, przytrzymaj chwilę i puść. To jak sprawdzanie, czy leśna jagódka jest sprężysta.',
              'Place a soft ball under your foot. Press gently, hold for a moment, and release. It is like checking whether a forest berry is springy.',
            ),
            note: text('Nacisk ma być przyjemny. Jeśli łaskocze albo boli, zmniejsz siłę.', 'The pressure should feel pleasant. If it tickles or hurts, press more gently.'),
          }),
          exercise('tallLeaves', {
            minutes: 3,
            durationLabel: text('2-3 min', '2-3 min'),
            repetitions: text('12-15 wejść na palce', '12-15 toe raises'),
            description: text(
              'Stań prosto, lekko napnij brzuch i powoli wejdź na palce. Zatrzymaj się na chwilę, jakby chcesz zajrzeć ponad wysokie liście. Opuść pięty cicho.',
              'Stand tall, gently brace your belly, and slowly rise onto your toes. Pause as if peeking over tall leaves. Lower your heels quietly.',
            ),
            note: text('Podkręcona wersja: ostatnie 5 powtórzeń wykonaj wolniej: 3 sekundy w górę i 3 sekundy w dół.', 'Spicy version: do the last 5 reps slower: 3 seconds up and 3 seconds down.'),
          }),
          exercise('trackAroundTree', {
            minutes: 4,
            durationLabel: text('2 min na nogę', '2 min per leg'),
            repetitions: text('3-5 kółek piłeczką wokół stopy podporowej', '3-5 ball circles around the standing foot'),
            description: text(
              'Stań na jednej nodze. Drugą stopą przeturlaj piłeczkę dookoła nogi, na której stoisz. Ruch jest wolny, a ciało próbuje zostać spokojne jak pień drzewa.',
              'Stand on one leg. With the other foot, roll the ball around your standing leg. Move slowly while your body tries to stay calm like a tree trunk.',
            ),
            note: text('Ułatwienie: można lekko dotykać ściany palcem.', 'Easier version: lightly touch a wall with one finger.'),
          }),
          exercise('pricklyPath', {
            minutes: 3,
            durationLabel: text('2-3 min', '2-3 min'),
            repetitions: text('4-6 spokojnych przejść po macie', '4-6 calm walks across the mat'),
            description: text(
              'Przejdź powoli po macie sensorycznej z wypustkami albo miękkimi kolcami. Stawiaj całe stopy i sprawdzaj, jak różne miejsca stopy czują podłoże.',
              'Walk slowly across a sensory mat with bumps or soft spikes. Place your whole feet down and notice how different parts of the foot feel the ground.',
            ),
            note: text('Mata ma dawać ciekawe czucie, nie ból. Jeśli jest za intensywnie, przejdź w skarpetkach albo skróć czas.', 'The mat should feel interesting, not painful. If it is too intense, wear socks or shorten the time.'),
          }),
          exercise('quietToes', {
            minutes: 2,
            durationLabel: text('2 min', '2 min'),
            repetitions: text('12-15 razy', '12-15 times'),
            description: text(
              'Stań stabilnie. Unieś same palce stóp, pięty zostają na ziemi. Połóż palce z powrotem jak najciszej, jakby pod stopami leżały śpiące liście.',
              'Stand steadily. Lift only your toes while your heels stay on the floor. Put your toes down as quietly as possible, as if sleeping leaves are under your feet.',
            ),
          }),
        ],
      }),
      mission({
        number: 5,
        slug: 'vines-and-stones',
        title: text('Liany i kamienie', 'Vines and Stones'),
        teaser: text('Nogi ruszają przez strumyk, a biodra uczą się spokojnej kontroli.', 'Legs cross the stream while hips learn calm control.'),
        goal: text('nogi, biodra, łydki, kontrola kolan', 'legs, hips, calves, knee control'),
        equipment: noEquipment,
        xp: 105,
        estimatedMinutes: 16,
        durationLabel: text('14-16 min', '14-16 min'),
        exercises: [
          exercise('steppingStones', {
            minutes: 3,
            durationLabel: text('3 min', '3 min'),
            repetitions: text('8-10 wykroków na każdą nogę', '8-10 lunges on each leg'),
            description: text(
              'Zrób krok do przodu i lekko ugnij oba kolana. Wróć spokojnie. Każdy krok trafia na kamień w strumyku — pewnie, ale bez pośpiechu.',
              'Step forward and gently bend both knees. Return calmly. Each step lands on a stream stone: steady, but never rushed.',
            ),
            note: text('Kolano przedniej nogi patrzy w stronę palców. Nie trzeba schodzić bardzo nisko.', 'The front knee points toward the toes. You do not need to go very low.'),
          }),
          exercise('hipsToTrunk', {
            minutes: 3,
            durationLabel: text('3 min', '3 min'),
            repetitions: text('10-12 pochyłów', '10-12 hinges'),
            description: text(
              'Stań w lekkim rozkroku. Cofnij biodra do tyłu i pochyl tułów, jakby pupa chciała dotknąć pnia za Tobą. Plecy zostają długie, a kolana mogą być lekko ugięte.',
              'Stand with feet a little apart. Send your hips back and lean your trunk forward as if your bottom wants to touch a trunk behind you. Keep your back long and knees softly bent.',
            ),
          }),
          exercise('ankleVine', {
            minutes: 3,
            durationLabel: text('3 min', '3 min'),
            repetitions: text('6-8 skłonów na stronę', '6-8 reaches per side'),
            description: text(
              'Stań szerzej. Przesuń jedną dłoń w stronę przeciwnej kostki albo piszczela. Wróć do środka i zmień stronę. Ruch ma być płynny, bez szarpania.',
              'Stand wider. Slide one hand toward the opposite ankle or shin. Return to center and switch sides. Keep the movement smooth, without yanking.',
            ),
          }),
          exercise('springyCalves', {
            minutes: 3,
            durationLabel: text('2-3 min', '2-3 min'),
            repetitions: text('10-12 razy albo 2 przytrzymania po 20 sekund na stronę', '10-12 times or 2 holds of 20 seconds per side'),
            description: text(
              'Stań jedną nogą trochę z przodu, drugą z tyłu. Tylna pięta zostaje na ziemi. Lekko przenieś ciężar ciała do przodu, aż poczujesz łydkę. Zmień stronę.',
              'Stand with one leg slightly forward and the other behind. Keep the back heel down. Shift weight gently forward until you feel your calf. Switch sides.',
            ),
            note: text('Podkręcona wersja: dodaj delikatne ugięcie tylnego kolana, żeby poczuć niższą część łydki.', 'Spicy version: gently bend the back knee to feel the lower calf.'),
          }),
          exercise('frogOnLeaf', {
            minutes: 3,
            durationLabel: text('2-3 min', '2-3 min'),
            repetitions: text('8-10 spokojnych przysiadów', '8-10 calm squats'),
            description: text(
              'Zrób lekki przysiad tylko do wygodnej wysokości. Ręce mogą iść do przodu dla równowagi. Wstań spokojnie, jak żabka odbijająca się z dużego liścia.',
              'Make a light squat only to a comfortable height. Arms can reach forward for balance. Stand up calmly, like a frog bouncing from a big leaf.',
            ),
          }),
        ],
      }),
      mission({
        number: 6,
        slug: 'balance-clearing',
        title: text('Polana równowagi', 'Balance Clearing'),
        teaser: text('Stopy szukają środka, a ciało ćwiczy spokojne stanie.', 'Feet search for center while the body practices calm standing.'),
        goal: text('równowaga, stabilizacja, czucie stóp, kontrola tułowia', 'balance, stability, foot awareness, trunk control'),
        equipment: ['sensoryCushion'],
        xp: 110,
        estimatedMinutes: 17,
        durationLabel: text('15-17 min', '15-17 min'),
        exercises: [
          exercise('storkOnMoss', {
            minutes: 4,
            durationLabel: text('2 min na nogę', '2 min per leg'),
            repetitions: text('3 próby po 20-25 sekund na nogę', '3 tries of 20-25 seconds per leg'),
            description: text(
              'Stań na jednej nodze. Druga noga jest lekko uniesiona. Ręce mogą być na boki. Spróbuj utrzymać spokojną pozycję jak bocian na mokrym mchu.',
              'Stand on one leg. The other leg is lightly lifted. Arms can reach sideways. Try to hold a calm position like a stork on wet moss.',
            ),
            note: text('Podkręcona wersja: powoli obróć głowę w prawo i w lewo, nie tracąc równowagi.', 'Spicy version: slowly turn your head right and left without losing balance.'),
          }),
          exercise('wetMoss', {
            minutes: 3,
            durationLabel: text('3 min', '3 min'),
            repetitions: text('10 przeniesień ciężaru do przodu i do tyłu', '10 weight shifts forward and backward'),
            description: text(
              'Stań na poduszce sensomotorycznej albo dysku sensorycznym. Przenieś ciężar ciała delikatnie do przodu, potem do tyłu. Stopy pracują cicho i szukają środka.',
              'Stand on a sensory cushion or balance disc. Shift your weight gently forward, then backward. Feet work quietly and search for center.',
            ),
            note: text('Ćwiczenie wykonuj blisko ściany albo stabilnego krzesła.', 'Do this exercise near a wall or a stable chair.'),
          }),
          exercise('sideTracks', {
            minutes: 3,
            durationLabel: text('3 min', '3 min'),
            repetitions: text('10 przeniesień ciężaru na boki', '10 side-to-side weight shifts'),
            description: text(
              'Na poduszce sensomotorycznej przenieś ciężar ciała raz na prawą, raz na lewą stopę. Ruch jest mały, jak zostawianie śladów na miękkiej ziemi.',
              'On the sensory cushion, shift weight once toward the right foot and once toward the left. The movement is small, like leaving tracks in soft ground.',
            ),
          }),
          exercise('smallSprings', {
            minutes: 2,
            durationLabel: text('2 min', '2 min'),
            repetitions: text('10-12 małych podskoków', '10-12 little hops'),
            description: text(
              'Zrób małe, miękkie podskoki na stabilnej podłodze. Ląduj cicho, z lekko ugiętymi kolanami.',
              'Make small, soft hops on a stable floor. Land quietly with knees slightly bent.',
            ),
            note: text('Ważne: nie wykonuj tego na poduszce sensomotorycznej. Podskoki są na stabilnej podłodze.', 'Important: do not do this on a sensory cushion. Hops belong on a stable floor.'),
          }),
          exercise('vineGuard', {
            minutes: 3,
            durationLabel: text('3 min', '3 min'),
            repetitions: text('5-6 razy na nogę', '5-6 times per leg'),
            description: text(
              'Stań na jednej nodze. Wyciągnij ręce na boki i powoli przesuń jedną rękę do przodu, drugą do tyłu. Wróć do środka i zmień układ rąk.',
              'Stand on one leg. Stretch arms sideways and slowly move one arm forward and the other back. Return to center and switch arms.',
            ),
          }),
        ],
      }),
      mission({
        number: 7,
        slug: 'secret-forest-book',
        title: text('Sekretna książeczka lasu', 'Secret Forest Book'),
        teaser: text('Plecy otwierają wielką leśną stronę, a łopatki pracują miękko.', 'The back opens a big forest page while shoulder blades move softly.'),
        goal: text('kręgosłup piersiowy, barki, łopatki, tył nóg', 'upper back, shoulders, shoulder blades, back of legs'),
        equipment: ['softBall'],
        xp: 115,
        estimatedMinutes: 17,
        durationLabel: text('15-17 min', '15-17 min'),
        exercises: [
          exercise('forestBook', {
            minutes: 6,
            durationLabel: text('3 min na stronę', '3 min per side'),
            repetitions: text('6 spokojnych otwarć na stronę', '6 calm openings per side'),
            description: text(
              'Połóż się na boku. Dolna noga jest prosta, górna lekko zgięta. Otwórz górną rękę na drugą stronę ciała, a głowa patrzy za dłonią. Ruch jest wolny, jak przewracanie dużej strony w książce.',
              'Lie on your side. The lower leg is straight and the top leg is slightly bent. Open the top arm across your body while your head follows your hand. Move slowly, like turning a big book page.',
            ),
            note: text('Nie dociskaj barku ani kolana na siłę.', 'Do not force your shoulder or knee down.'),
          }),
          exercise('nutBetweenShoulders', {
            minutes: 3,
            durationLabel: text('2-3 min', '2-3 min'),
            repetitions: text('12-15 delikatnych ściągnięć łopatek', '12-15 gentle shoulder-blade squeezes'),
            description: text(
              'Usiądź albo stań prosto. Ściągnij łopatki lekko do siebie, jakby między nimi był mały orzeszek. Przytrzymaj sekundę i rozluźnij.',
              'Sit or stand tall. Gently pull your shoulder blades toward each other as if a small nut were between them. Hold one second and relax.',
            ),
            note: text('Podkręcona wersja: wykonaj ruch z rękami ustawionymi jak litera W.', 'Spicy version: do the movement with your arms shaped like the letter W.'),
          }),
          exercise('parrotWings', {
            minutes: 3,
            durationLabel: text('3 min', '3 min'),
            repetitions: text('10-12 razy', '10-12 times'),
            description: text(
              'Zegnij ręce w łokciach i unieś je lekko na boki. Otwórz klatkę piersiową, a potem wróć. Ruch ma być szeroki, ale miękki.',
              'Bend your elbows and lift your arms slightly sideways. Open your chest, then return. Keep the movement wide but soft.',
            ),
          }),
          exercise('legToSky', {
            minutes: 4,
            durationLabel: text('3-4 min', '3-4 min'),
            repetitions: text('8-10 uniesień na nogę', '8-10 lifts per leg'),
            description: text(
              'Połóż się na plecach. Unieś jedną nogę do góry — prostą albo lekko ugiętą. Opuść powoli i zmień stronę.',
              'Lie on your back. Lift one leg upward, straight or slightly bent. Lower slowly and switch sides.',
            ),
            note: text('Podkręcona wersja: zatrzymaj nogę u góry na 2 sekundy.', 'Spicy version: hold the leg up for 2 seconds.'),
          }),
          exercise('rootsUnderFeet', {
            minutes: 3,
            durationLabel: text('2-3 min', '2-3 min'),
            repetitions: text('6-8 spokojnych zejść w dół', '6-8 calm folds downward'),
            description: text(
              'Stań w rozkroku. Pochyl się do przodu i spróbuj zbliżyć dłonie do podłogi. Pięty zostają na ziemi, jak mocne korzenie.',
              'Stand with feet apart. Fold forward and try to bring your hands closer to the floor. Heels stay down like strong roots.',
            ),
          }),
        ],
      }),
      mission({
        number: 8,
        slug: 'tropical-movement-course',
        title: text('Tropikalny tor ruchu', 'Tropical Movement Course'),
        teaser: text('Całe ciało przechodzi przez cichy, zielony tor.', 'The whole body moves through a quiet green course.'),
        goal: text('całe ciało, koordynacja, mobilność, lekka siła', 'whole body, coordination, mobility, light strength'),
        equipment: ['softBall'],
        xp: 120,
        estimatedMinutes: 18,
        durationLabel: text('16-18 min', '16-18 min'),
        exercises: [
          exercise('crossedVines', {
            minutes: 3,
            durationLabel: text('3 min', '3 min'),
            repetitions: text('8 wejść na palce z lewą nogą z przodu, 8 z prawą nogą z przodu', '8 toe raises with left leg in front, 8 with right leg in front'),
            description: text(
              'Stań z lekko skrzyżowanymi nogami. Możesz trzymać piłeczkę delikatnie między nogami. Powoli wejdź na palce i wróć. Zamień nogę z przodu.',
              'Stand with legs lightly crossed. You may hold a soft ball gently between your legs. Slowly rise onto your toes and return. Switch the front leg.',
            ),
            note: text('Jeśli równowaga ucieka, rozstaw nogi szerzej albo zrób wersję bez piłeczki.', 'If balance runs away, place feet wider or do it without the ball.'),
          }),
          exercise('spiderPath', {
            minutes: 3,
            durationLabel: text('3 min', '3 min'),
            repetitions: text('5-6 przejść rękami', '5-6 hand walks'),
            description: text(
              'Stań w rozkroku, pochyl się i oprzyj dłonie o podłogę albo stabilne krzesło. Przesuń dłonie trochę do przodu, potem wróć. Pięty zostają na ziemi.',
              'Stand with feet apart, fold forward, and place hands on the floor or a stable chair. Walk your hands a little forward, then back. Heels stay down.',
            ),
            note: text('Ułatwienie: dłonie mogą zostać na krześle albo na udach.', 'Easier version: hands can stay on a chair or on your thighs.'),
          }),
          exercise('crabUnderLeaf', {
            minutes: 3,
            durationLabel: text('3 min', '3 min'),
            repetitions: text('6-8 przejść w bok na każdą stronę', '6-8 sideways walks each way'),
            description: text(
              'Ugnij lekko kolana i zrób kilka małych kroków w bok. Ręce mogą być przed sobą. Poruszaj się cicho, jak krab chowający się pod liściem.',
              'Bend your knees slightly and make a few small steps sideways. Hands can stay in front. Move quietly, like a crab hiding under a leaf.',
            ),
            note: text('Kolana patrzą w stronę palców stóp. Nie zapadają się do środka.', 'Knees point toward the toes. They do not collapse inward.'),
          }),
          exercise('lazyTiger', {
            minutes: 3,
            durationLabel: text('3 min', '3 min'),
            repetitions: text('6-8 razy', '6-8 times'),
            description: text(
              'Z pozycji na czworakach zaokrąglij plecy, potem powoli je wydłuż. Ruch jest spokojny, jak przeciąganie się dużego kota po drzemce.',
              'From all fours, round your back, then slowly lengthen it. Move calmly, like a big cat stretching after a nap.',
            ),
          }),
          exercise('highBranchLowBranch', {
            minutes: 3,
            durationLabel: text('3 min', '3 min'),
            repetitions: text('8-10 razy', '8-10 times'),
            description: text(
              'Wyciągnij ręce wysoko do góry. Potem pochyl się lekko w dół, jakby pod liśćmi była niska gałązka. Wróć spokojnie do góry.',
              'Reach your arms high. Then fold gently downward, as if a low branch is under the leaves. Return calmly upward.',
            ),
          }),
        ],
      }),
      mission({
        number: 9,
        slug: 'barefoot-tracks',
        title: text('Ścieżka bosych tropów', 'Barefoot Tracks Path'),
        teaser: text('Stopy poznają matę, ciszę palców i wąską kładkę.', 'Feet meet the mat, quiet toes, and a narrow bridge.'),
        goal: text('stopy, łydki, równowaga, czucie podłoża', 'feet, calves, balance, ground awareness'),
        equipment: ['sensoryMat', 'softBall'],
        xp: 105,
        estimatedMinutes: 16,
        durationLabel: text('14-16 min', '14-16 min'),
        exercises: [
          exercise('pricklyPath', {
            minutes: 3,
            durationLabel: text('3 min', '3 min'),
            repetitions: text('4-6 spokojnych przejść po macie', '4-6 calm walks across the mat'),
            description: text(
              'Przejdź powoli po macie sensorycznej z wypustkami albo miękkimi kolcami. Stawiaj całe stopy i sprawdzaj, jak różne miejsca stopy czują podłoże.',
              'Walk slowly across a sensory mat with bumps or soft spikes. Place your whole feet down and notice how different parts of the foot feel the ground.',
            ),
            note: text('Mata ma dawać ciekawe czucie, nie ból. Można ćwiczyć w skarpetkach.', 'The mat should feel interesting, not painful. Socks are okay.'),
          }),
          exercise('quietToes', {
            minutes: 2,
            durationLabel: text('2 min', '2 min'),
            repetitions: text('12-15 razy', '12-15 times'),
            description: text(
              'Stań stabilnie. Unieś same palce stóp, pięty zostają na ziemi. Połóż palce z powrotem jak najciszej, jakby pod stopami leżały śpiące liście.',
              'Stand steadily. Lift only your toes while heels stay down. Put your toes back as quietly as possible, as if sleeping leaves are under your feet.',
            ),
          }),
          exercise('berryUnderFoot', {
            minutes: 4,
            durationLabel: text('2 min na stopę', '2 min per foot'),
            repetitions: text('8-10 nacisków na stopę', '8-10 presses per foot'),
            description: text(
              'Połóż miękką piłeczkę pod stopą. Dociśnij ją spokojnie, przytrzymaj chwilę i puść. To jak sprawdzanie sprężystej leśnej jagódki.',
              'Place a soft ball under your foot. Press gently, hold for a moment, and release. It is like testing a springy forest berry.',
            ),
          }),
          exercise('narrowBridge', {
            minutes: 3,
            durationLabel: text('3 min', '3 min'),
            repetitions: text('4 przejścia tam i z powrotem', '4 walks there and back'),
            description: text(
              'Idź po wyobrażonej linii: pięta jednej stopy przed palcami drugiej. Ręce mogą być rozłożone na boki. To wąska kładka nad strumykiem.',
              'Walk on an imaginary line: heel of one foot in front of the toes of the other. Arms can stretch sideways. It is a narrow bridge over a stream.',
            ),
          }),
        ],
      }),
      mission({
        number: 10,
        slug: 'leaf-dance-after-rain',
        title: text('Taniec liści po deszczu', 'Leaf Dance After Rain'),
        teaser: text('Biodra, uda i łydki ruszają jak liście po deszczu.', 'Hips, thighs, and calves move like leaves after rain.'),
        goal: text('biodra, uda, łydki, koordynacja', 'hips, thighs, calves, coordination'),
        equipment: noEquipment,
        xp: 110,
        estimatedMinutes: 17,
        durationLabel: text('15-17 min', '15-17 min'),
        exercises: [
          exercise('steppingStones', {
            minutes: 3,
            durationLabel: text('3 min', '3 min'),
            repetitions: text('8-10 wykroków na każdą nogę', '8-10 lunges on each leg'),
            description: text(
              'Zrób krok do przodu i lekko ugnij oba kolana. Wróć spokojnie. Każdy krok trafia na kamień w strumyku — pewnie, ale bez pośpiechu.',
              'Step forward and gently bend both knees. Return calmly. Each step lands on a stream stone: steady, but never rushed.',
            ),
          }),
          exercise('crabUnderLeaf', {
            minutes: 3,
            durationLabel: text('3 min', '3 min'),
            repetitions: text('6-8 przejść w bok na każdą stronę', '6-8 sideways walks each way'),
            description: text(
              'Ugnij lekko kolana i zrób kilka małych kroków w bok. Ręce mogą być przed sobą. Poruszaj się cicho, jak krab chowający się pod liściem.',
              'Bend your knees slightly and make a few small steps sideways. Hands can stay in front. Move quietly, like a crab hiding under a leaf.',
            ),
          }),
          exercise('springyCalves', {
            minutes: 3,
            durationLabel: text('3 min', '3 min'),
            repetitions: text('2 razy na stronę, przytrzymanie 20-25 sekund', '2 times per side, hold 20-25 seconds'),
            description: text(
              'Stań jedną nogą z przodu, drugą z tyłu. Tylna pięta zostaje na ziemi. Przenieś ciężar ciała lekko do przodu, aż poczujesz spokojne rozciąganie łydki.',
              'Stand with one leg forward and one behind. Keep the back heel down. Shift weight gently forward until you feel a calm calf stretch.',
            ),
          }),
          exercise('thighFrontRest', {
            minutes: 3,
            durationLabel: text('3 min', '3 min'),
            repetitions: text('2 razy na stronę, przytrzymanie 20 sekund', '2 times per side, hold 20 seconds'),
            description: text(
              'Stań stabilnie i złap jedną stopę za sobą. Kolana trzymaj blisko siebie. Poczuj delikatne rozciąganie z przodu uda.',
              'Stand steadily and hold one foot behind you. Keep knees close together. Feel a gentle stretch in the front of the thigh.',
            ),
            note: text('Ułatwienie: można trzymać się ściany albo krzesła.', 'Easier version: hold a wall or chair.'),
          }),
          exercise('calmTail', {
            minutes: 2,
            durationLabel: text('2 min', '2 min'),
            repetitions: text('6-8 obrotów na stronę', '6-8 turns per side'),
            description: text(
              'Stań wygodnie i obróć tułów lekko w jedną stronę, potem w drugą. Ręce miękko podążają za ruchem.',
              'Stand comfortably and turn your trunk gently to one side, then the other. Arms follow the movement softly.',
            ),
          }),
        ],
      }),
      mission({
        number: 11,
        slug: 'long-legs-clearing',
        title: text('Polana długich nóg', 'Long-Leg Clearing'),
        teaser: text('Spokojne skłony i długie nogi bez pośpiechu.', 'Calm folds and long legs without rushing.'),
        goal: text('tył nóg, biodra, plecy, spokojne rozciąganie', 'back of legs, hips, back, calm stretching'),
        equipment: noEquipment,
        xp: 115,
        estimatedMinutes: 18,
        durationLabel: text('15-18 min', '15-18 min'),
        exercises: [
          exercise('hipsToTrunk', {
            minutes: 3,
            durationLabel: text('3 min', '3 min'),
            repetitions: text('10-12 pochyłów', '10-12 hinges'),
            description: text(
              'Stań w lekkim rozkroku. Cofnij biodra do tyłu i pochyl tułów, jakby pupa chciała dotknąć pnia za Tobą. Plecy zostają długie.',
              'Stand with feet a little apart. Send your hips back and lean your trunk forward as if your bottom wants to touch a trunk behind you. Keep your back long.',
            ),
          }),
          exercise('rootsUnderFeet', {
            minutes: 3,
            durationLabel: text('3 min', '3 min'),
            repetitions: text('6-8 spokojnych zejść', '6-8 calm folds'),
            description: text(
              'Stań w rozkroku. Pochyl się do przodu i spróbuj zbliżyć dłonie do podłogi. Pięty zostają na ziemi, jak mocne korzenie.',
              'Stand with feet apart. Fold forward and try to bring your hands closer to the floor. Heels stay down like strong roots.',
            ),
          }),
          exercise('ankleVine', {
            minutes: 3,
            durationLabel: text('3 min', '3 min'),
            repetitions: text('6-8 skłonów na stronę', '6-8 reaches per side'),
            description: text(
              'Stań szerzej. Przesuń jedną dłoń w stronę przeciwnej kostki albo piszczela. Wróć do środka i zmień stronę.',
              'Stand wider. Slide one hand toward the opposite ankle or shin. Return to center and switch sides.',
            ),
          }),
          exercise('trailBackLeg', {
            minutes: 4,
            durationLabel: text('3-4 min', '3-4 min'),
            repetitions: text('2 razy na stronę, przytrzymanie 20-25 sekund', '2 times per side, hold 20-25 seconds'),
            description: text(
              'Usiądź z jedną nogą prostą, drugą wygodnie zgiętą. Pochyl się lekko w stronę prostej nogi. Szukaj spokojnego rozciągania z tyłu uda.',
              'Sit with one leg straight and the other comfortably bent. Lean gently toward the straight leg. Look for a calm stretch in the back of the thigh.',
            ),
          }),
          exercise('lazyTiger', {
            minutes: 3,
            durationLabel: text('2-3 min', '2-3 min'),
            repetitions: text('8-10 razy', '8-10 times'),
            description: text(
              'Z pozycji na czworakach zaokrąglij plecy, potem powoli je wydłuż. Ruch jest spokojny, jak przeciąganie się dużego kota.',
              'From all fours, round your back, then slowly lengthen it. Move calmly, like a big cat stretching.',
            ),
          }),
        ],
      }),
      mission({
        number: 12,
        slug: 'vine-guards',
        title: text('Strażnicy lian', 'Vine Guards'),
        teaser: text('Równowaga pilnuje lian, a stopy uczą się miękkiego środka.', 'Balance guards the vines while feet learn a soft center.'),
        goal: text('równowaga, stopy, biodra, kontrola ciała', 'balance, feet, hips, body control'),
        equipment: ['sensoryCushion'],
        xp: 110,
        estimatedMinutes: 17,
        durationLabel: text('15-17 min', '15-17 min'),
        exercises: [
          exercise('storkOnMoss', {
            minutes: 4,
            durationLabel: text('2 min na nogę', '2 min per leg'),
            repetitions: text('3 próby po 20-25 sekund na nogę', '3 tries of 20-25 seconds per leg'),
            description: text(
              'Stań na jednej nodze. Druga noga jest lekko uniesiona. Ręce mogą być na boki. Spróbuj utrzymać spokojną pozycję jak bocian na mokrym mchu.',
              'Stand on one leg. The other leg is lightly lifted. Arms can reach sideways. Try to hold a calm position like a stork on wet moss.',
            ),
          }),
          exercise('wetMoss', {
            minutes: 3,
            durationLabel: text('3 min', '3 min'),
            repetitions: text('10 przeniesień ciężaru do przodu i do tyłu', '10 weight shifts forward and backward'),
            description: text(
              'Stań na poduszce sensomotorycznej albo dysku sensorycznym. Przenieś ciężar ciała delikatnie do przodu, potem do tyłu. Stopy pracują cicho i szukają środka.',
              'Stand on a sensory cushion or balance disc. Shift your weight gently forward, then backward. Feet work quietly and search for center.',
            ),
          }),
          exercise('forestClock', {
            minutes: 3,
            durationLabel: text('3 min', '3 min'),
            repetitions: text('2 rundy na każdą nogę', '2 rounds on each leg'),
            description: text(
              'Stań na jednej nodze. Drugą stopą dotknij podłogi z przodu, z boku i z tyłu, jakby wskazówka zegara odwiedzała różne godziny.',
              'Stand on one leg. Touch the floor with the other foot in front, to the side, and behind, like a clock hand visiting different hours.',
            ),
          }),
          exercise('vineGuard', {
            minutes: 3,
            durationLabel: text('3 min', '3 min'),
            repetitions: text('5-6 razy na nogę', '5-6 times per leg'),
            description: text(
              'Stań na jednej nodze. Wyciągnij ręce na boki i powoli przesuń jedną rękę do przodu, drugą do tyłu. Wróć do środka i zmień układ rąk.',
              'Stand on one leg. Stretch arms sideways and slowly move one arm forward and the other back. Return to center and switch arms.',
            ),
          }),
          exercise('sideTracks', {
            minutes: 3,
            durationLabel: text('3 min', '3 min'),
            repetitions: text('10 przeniesień ciężaru na boki', '10 side-to-side weight shifts'),
            description: text(
              'Na poduszce sensomotorycznej przenieś ciężar ciała raz na prawą, raz na lewą stronę. Ruch jest mały, jak zostawianie śladów na miękkiej ziemi.',
              'On the sensory cushion, shift weight once to the right side and once to the left. The movement is small, like leaving tracks in soft ground.',
            ),
          }),
        ],
      }),
      mission({
        number: 13,
        slug: 'calm-waterfall',
        title: text('Wodospad spokoju', 'Waterfall of Calm'),
        teaser: text('Cichy oddech, miękkie plecy i chwila spokojnej rzeki.', 'Quiet breathing, soft backs, and a moment of calm river.'),
        goal: text('wyciszenie, oddech, plecy, szyja, biodra', 'calming down, breath, back, neck, hips'),
        equipment: noEquipment,
        xp: 105,
        estimatedMinutes: 16,
        durationLabel: text('14-16 min', '14-16 min'),
        exercises: [
          exercise('waterfallBreath', {
            minutes: 2,
            durationLabel: text('2 min', '2 min'),
            repetitions: text('8-10 spokojnych oddechów', '8-10 calm breaths'),
            description: text(
              'Usiądź wygodnie. Nabierz powietrze nosem, a potem wypuść je wolno ustami, jak spokojny wodospad po deszczu.',
              'Sit comfortably. Breathe in through your nose, then slowly breathe out through your mouth, like a calm waterfall after rain.',
            ),
          }),
          exercise('owlTurnsHead', {
            minutes: 2,
            durationLabel: text('2 min', '2 min'),
            repetitions: text('5 obrotów w każdą stronę', '5 turns each way'),
            description: text(
              'Usiądź albo stań prosto. Powoli obróć głowę w prawo, wróć do środka, potem w lewo. Szyja jest długa, a ruch mały i spokojny.',
              'Sit or stand tall. Slowly turn your head right, return to center, then left. Keep the neck long and the movement small and calm.',
            ),
          }),
          exercise('forestBook', {
            minutes: 6,
            durationLabel: text('3 min na stronę', '3 min per side'),
            repetitions: text('6 spokojnych otwarć na stronę', '6 calm openings per side'),
            description: text(
              'Połóż się na boku. Dolna noga jest prosta, górna lekko zgięta. Otwórz górną rękę na drugą stronę ciała, a głowa patrzy za dłonią.',
              'Lie on your side. The lower leg is straight and the top leg is slightly bent. Open the top arm across your body while your head follows your hand.',
            ),
          }),
          exercise('meadowButterfly', {
            minutes: 3,
            durationLabel: text('3 min', '3 min'),
            repetitions: text('2 przytrzymania po 25-30 sekund', '2 holds of 25-30 seconds'),
            description: text(
              'Usiądź, połącz stopy podeszwami i pozwól kolanom opaść na boki tylko tyle, ile jest wygodnie. Plecy zostają długie.',
              'Sit, bring the soles of your feet together, and let your knees drop sideways only as far as comfortable. Keep your back long.',
            ),
          }),
          exercise('leafOnWater', {
            minutes: 3,
            durationLabel: text('2-3 min', '2-3 min'),
            repetitions: text('6 spokojnych powtórzeń', '6 calm repeats'),
            description: text(
              'Połóż się na plecach i przyciągnij oba kolana bliżej brzucha. Pobujaj się delikatnie na boki, jak liść unoszony przez wodę.',
              'Lie on your back and bring both knees closer to your belly. Rock gently side to side, like a leaf floating on water.',
            ),
          }),
        ],
      }),
      mission({
        number: 14,
        slug: 'strong-hips-jungle',
        title: text('Dżungla mocnych bioder', 'Strong-Hip Jungle'),
        teaser: text('Biodra otwierają bramy, a mały mostek rośnie z korzenia.', 'Hips open gates while a little bridge grows from a root.'),
        goal: text('biodra, pośladki, uda, stabilizacja', 'hips, glutes, thighs, stability'),
        equipment: noEquipment,
        xp: 120,
        estimatedMinutes: 18,
        durationLabel: text('16-18 min', '16-18 min'),
        exercises: [
          exercise('rootBridge', {
            minutes: 3,
            durationLabel: text('3 min', '3 min'),
            repetitions: text('10-12 razy', '10-12 times'),
            description: text(
              'Połóż się na plecach, ugnij kolana i oprzyj stopy o ziemię. Unieś biodra spokojnie do góry i opuść. Brzuch i pośladki pomagają stworzyć mały mostek.',
              'Lie on your back, bend your knees, and place feet on the floor. Lift hips calmly and lower them. Belly and glutes help create a little bridge.',
            ),
          }),
          exercise('streamShell', {
            minutes: 3,
            durationLabel: text('3 min', '3 min'),
            repetitions: text('10 razy na stronę', '10 times per side'),
            description: text(
              'Połóż się na boku z lekko ugiętymi kolanami. Stopy zostają razem, a górne kolano otwiera się do góry jak muszla. Opuść powoli.',
              'Lie on your side with knees slightly bent. Feet stay together while the top knee opens upward like a shell. Lower slowly.',
            ),
          }),
          exercise('steppingStones', {
            minutes: 3,
            durationLabel: text('3 min', '3 min'),
            repetitions: text('8 wykroków na każdą nogę', '8 lunges on each leg'),
            description: text(
              'Zrób krok do przodu i lekko ugnij oba kolana. Wróć spokojnie. Każdy krok trafia na kamień w strumyku.',
              'Step forward and gently bend both knees. Return calmly. Each step lands on a stone in the stream.',
            ),
          }),
          exercise('crabUnderLeaf', {
            minutes: 3,
            durationLabel: text('3 min', '3 min'),
            repetitions: text('6 przejść w bok na każdą stronę', '6 sideways walks each way'),
            description: text(
              'Ugnij lekko kolana i zrób kilka małych kroków w bok. Ruch jest kontrolowany, a kolana patrzą w stronę palców.',
              'Bend knees slightly and make a few small steps sideways. Move with control while knees point toward toes.',
            ),
          }),
          exercise('hipGate', {
            minutes: 3,
            durationLabel: text('3 min', '3 min'),
            repetitions: text('6 otwarć na stronę', '6 openings per side'),
            description: text(
              'Stań stabilnie. Unieś jedno kolano i zatocz nim małe koło na zewnątrz, jakby otwierała się leśna brama. Zmień stronę.',
              'Stand steadily. Lift one knee and draw a small outward circle, as if a forest gate were opening. Switch sides.',
            ),
          }),
        ],
      }),
      mission({
        number: 15,
        slug: 'calm-calf-river',
        title: text('Rzeka spokojnych łydek', 'Calm Calf River'),
        teaser: text('Łydki, kostki i tył nóg dostają spokojny nurt.', 'Calves, ankles, and back legs get a calm current.'),
        goal: text('łydki, kostki, tył nóg, regeneracja po intensywnym bieganiu', 'calves, ankles, back of legs, recovery after intense running'),
        equipment: ['sensoryMat'],
        xp: 110,
        estimatedMinutes: 17,
        durationLabel: text('15-17 min', '15-17 min'),
        exercises: [
          exercise('springyCalves', {
            minutes: 3,
            durationLabel: text('3 min', '3 min'),
            repetitions: text('2 razy na stronę, przytrzymanie 20-25 sekund', '2 times per side, hold 20-25 seconds'),
            description: text(
              'Stań jedną nogą z przodu, drugą z tyłu. Tylna pięta zostaje na ziemi. Przenieś ciężar ciała lekko do przodu, aż poczujesz spokojne rozciąganie łydki.',
              'Stand with one leg forward and one behind. Keep the back heel down. Shift weight gently forward until you feel a calm calf stretch.',
            ),
          }),
          exercise('lowCalf', {
            minutes: 3,
            durationLabel: text('3 min', '3 min'),
            repetitions: text('2 razy na stronę, przytrzymanie 20 sekund', '2 times per side, hold 20 seconds'),
            description: text(
              'Ustaw się jak w ćwiczeniu na łydkę, ale lekko ugnij tylne kolano. Pięta nadal zostaje na ziemi. Rozciąganie powinno być niżej, bliżej kostki.',
              'Set up like the calf stretch, but gently bend the back knee. The heel still stays down. The stretch should feel lower, closer to the ankle.',
            ),
          }),
          exercise('ankleCircles', {
            minutes: 3,
            durationLabel: text('2-3 min', '2-3 min'),
            repetitions: text('8 kółek w każdą stronę na stopę', '8 circles each way per foot'),
            description: text(
              'Usiądź albo stań przy ścianie. Unieś jedną stopę i rysuj nią spokojne kółka w powietrzu. Zmień kierunek i stopę.',
              'Sit or stand by a wall. Lift one foot and draw calm circles in the air. Change direction and switch feet.',
            ),
          }),
          exercise('pricklyPath', {
            minutes: 3,
            durationLabel: text('2-3 min', '2-3 min'),
            repetitions: text('4 spokojne przejścia po macie', '4 calm walks across the mat'),
            description: text(
              'Przejdź powoli po macie sensorycznej z wypustkami albo miękkimi kolcami. Stopy sprawdzają podłoże bez pośpiechu.',
              'Walk slowly across a sensory mat with bumps or soft spikes. Feet explore the ground without rushing.',
            ),
          }),
          exercise('trailBackLeg', {
            minutes: 3,
            durationLabel: text('3 min', '3 min'),
            repetitions: text('2 razy na stronę, przytrzymanie 20-25 sekund', '2 times per side, hold 20-25 seconds'),
            description: text(
              'Usiądź z jedną nogą prostą, drugą wygodnie zgiętą. Pochyl się lekko w stronę prostej nogi. Szukaj spokojnego rozciągania z tyłu uda.',
              'Sit with one leg straight and the other comfortably bent. Lean gently toward the straight leg. Look for a calm stretch in the back of the thigh.',
            ),
          }),
        ],
      }),
      mission({
        number: 16,
        slug: 'canopy-and-strong-back',
        title: text('Korony drzew i mocne plecy', 'Canopy and Strong Back'),
        teaser: text('Barki i plecy pracują jak skrzydła między drzewami.', 'Shoulders and back work like wings between trees.'),
        goal: text('barki, łopatki, plecy, tułów', 'shoulders, shoulder blades, back, trunk'),
        equipment: ['softBall'],
        xp: 115,
        estimatedMinutes: 17,
        durationLabel: text('15-17 min', '15-17 min'),
        exercises: [
          exercise('parrotWings', {
            minutes: 3,
            durationLabel: text('3 min', '3 min'),
            repetitions: text('10-12 razy', '10-12 times'),
            description: text(
              'Zegnij ręce w łokciach i unieś je lekko na boki. Otwórz klatkę piersiową, a potem wróć. Ruch ma być szeroki, ale miękki.',
              'Bend your elbows and lift your arms slightly sideways. Open your chest, then return. Keep the movement wide but soft.',
            ),
          }),
          exercise('nutBetweenShoulders', {
            minutes: 3,
            durationLabel: text('2-3 min', '2-3 min'),
            repetitions: text('12-15 ściągnięć łopatek', '12-15 shoulder-blade squeezes'),
            description: text(
              'Usiądź albo stań prosto. Ściągnij łopatki lekko do siebie, jakby między nimi był mały orzeszek. Przytrzymaj sekundę i rozluźnij.',
              'Sit or stand tall. Gently pull your shoulder blades toward each other as if a small nut were between them. Hold one second and relax.',
            ),
          }),
          exercise('detectiveBird', {
            minutes: 3,
            durationLabel: text('3 min', '3 min'),
            repetitions: text('8 razy na stronę', '8 times per side'),
            description: text(
              'Stań lub usiądź prosto. Jedną rękę połóż na przeciwległym ramieniu, a drugą powoli odsuń w bok i lekko do tyłu. Głowa patrzy za dłonią.',
              'Stand or sit tall. Put one hand on the opposite shoulder and slowly move the other hand sideways and slightly back. Your head follows your hand.',
            ),
          }),
          exercise('lazyTiger', {
            minutes: 3,
            durationLabel: text('3 min', '3 min'),
            repetitions: text('8-10 razy', '8-10 times'),
            description: text(
              'Z pozycji na czworakach zaokrąglij plecy, potem powoli je wydłuż. Ruch jest spokojny i płynny.',
              'From all fours, round your back, then slowly lengthen it. Keep the movement calm and smooth.',
            ),
          }),
          exercise('highBranchLowBranch', {
            minutes: 3,
            durationLabel: text('3 min', '3 min'),
            repetitions: text('8-10 razy', '8-10 times'),
            description: text(
              'Wyciągnij ręce wysoko do góry. Potem pochyl się lekko w dół, jakby pod liśćmi była niska gałązka. Wróć spokojnie do góry.',
              'Reach your arms high. Then fold gently downward, as if a low branch is under the leaves. Return calmly upward.',
            ),
          }),
        ],
      }),
      mission({
        number: 17,
        slug: 'hidden-scout-course',
        title: text('Ukryty tor tropiciela', 'Hidden Scout Course'),
        teaser: text('Tropiciel przechodzi przez liany, zegar, mostek i mango.', 'The scout moves through vines, clock, bridge, and mango.'),
        goal: text('całe ciało, równowaga, koordynacja, lekka siła', 'whole body, balance, coordination, light strength'),
        equipment: ['softBall'],
        xp: 125,
        estimatedMinutes: 19,
        durationLabel: text('17-19 min', '17-19 min'),
        exercises: [
          exercise('crossedVines', {
            minutes: 3,
            durationLabel: text('3 min', '3 min'),
            repetitions: text('8 wejść na palce z lewą nogą z przodu, 8 z prawą nogą z przodu', '8 toe raises with left leg in front, 8 with right leg in front'),
            description: text(
              'Stań z lekko skrzyżowanymi nogami. Możesz trzymać piłeczkę delikatnie między nogami. Powoli wejdź na palce i wróć. Zamień nogę z przodu.',
              'Stand with legs lightly crossed. You may hold a soft ball gently between your legs. Slowly rise onto your toes and return. Switch the front leg.',
            ),
          }),
          exercise('spiderPath', {
            minutes: 3,
            durationLabel: text('3 min', '3 min'),
            repetitions: text('5-6 przejść rękami', '5-6 hand walks'),
            description: text(
              'Stań w rozkroku, pochyl się i oprzyj dłonie o podłogę albo stabilne krzesło. Przesuń dłonie trochę do przodu, potem wróć. Pięty zostają na ziemi.',
              'Stand with feet apart, fold forward, and place hands on the floor or a stable chair. Walk your hands a little forward, then back. Heels stay down.',
            ),
          }),
          exercise('forestClock', {
            minutes: 3,
            durationLabel: text('3 min', '3 min'),
            repetitions: text('2 rundy na każdą nogę', '2 rounds on each leg'),
            description: text(
              'Stań na jednej nodze. Drugą stopą dotknij podłogi z przodu, z boku i z tyłu, jakby wskazówka zegara odwiedzała różne godziny.',
              'Stand on one leg. Touch the floor with the other foot in front, to the side, and behind, like a clock hand visiting different hours.',
            ),
          }),
          exercise('rootBridge', {
            minutes: 3,
            durationLabel: text('3 min', '3 min'),
            repetitions: text('10-12 razy', '10-12 times'),
            description: text(
              'Połóż się na plecach, ugnij kolana i oprzyj stopy o ziemię. Unieś biodra spokojnie do góry i opuść.',
              'Lie on your back, bend your knees, and place feet on the floor. Lift hips calmly and lower them.',
            ),
          }),
          exercise('mangoPicking', {
            minutes: 3,
            durationLabel: text('3 min', '3 min'),
            repetitions: text('8 sięgnięć na stronę', '8 reaches per side'),
            description: text(
              'Stań prosto i sięgnij jedną ręką wysoko po skosie, jak po owoc na drzewie. Wróć i zmień stronę. Pięty mogą zostać na ziemi albo lekko się unieść.',
              'Stand tall and reach one arm high on a diagonal, as if picking fruit from a tree. Return and switch sides. Heels can stay down or lift a little.',
            ),
          }),
        ],
      }),
      mission({
        number: 18,
        slug: 'great-rainforest-expedition',
        title: text('Wielka wyprawa przez las deszczowy', 'Great Rainforest Expedition'),
        teaser: text('Finał rozdziału: stopy, nogi, biodra, plecy i spokojny oddech.', 'Chapter finale: feet, legs, hips, back, and calm breath.'),
        goal: text('podsumowanie rozdziału: stopy, nogi, biodra, plecy, oddech', 'chapter recap: feet, legs, hips, back, breath'),
        equipment: ['sensoryMat', 'softBall'],
        xp: 140,
        estimatedMinutes: 20,
        durationLabel: text('18-20 min', '18-20 min'),
        exercises: [
          exercise('pricklyPath', {
            minutes: 3,
            durationLabel: text('3 min', '3 min'),
            repetitions: text('4-6 przejść po macie', '4-6 walks across the mat'),
            description: text(
              'Przejdź powoli po macie sensorycznej z wypustkami albo miękkimi kolcami. Stopy badają ścieżkę spokojnie i dokładnie.',
              'Walk slowly across a sensory mat with bumps or soft spikes. Feet explore the path calmly and carefully.',
            ),
          }),
          exercise('steppingStones', {
            minutes: 3,
            durationLabel: text('3 min', '3 min'),
            repetitions: text('8 wykroków na każdą nogę', '8 lunges on each leg'),
            description: text(
              'Zrób krok do przodu i lekko ugnij oba kolana. Wróć spokojnie. Każdy krok trafia na kamień w strumyku.',
              'Step forward and gently bend both knees. Return calmly. Each step lands on a stone in the stream.',
            ),
          }),
          exercise('streamShell', {
            minutes: 3,
            durationLabel: text('3 min', '3 min'),
            repetitions: text('10 razy na stronę', '10 times per side'),
            description: text(
              'Połóż się na boku z lekko ugiętymi kolanami. Stopy zostają razem, a górne kolano otwiera się do góry jak muszla. Opuść powoli.',
              'Lie on your side with knees slightly bent. Feet stay together while the top knee opens upward like a shell. Lower slowly.',
            ),
          }),
          exercise('forestBook', {
            minutes: 6,
            durationLabel: text('3 min na stronę', '3 min per side'),
            repetitions: text('6 spokojnych otwarć na stronę', '6 calm openings per side'),
            description: text(
              'Połóż się na boku. Otwórz górną rękę na drugą stronę ciała, a głowa patrzy za dłonią. Ruch jest wolny, jak przewracanie dużej strony w książce.',
              'Lie on your side. Open the top arm across your body while your head follows your hand. Move slowly, like turning a big book page.',
            ),
          }),
          exercise('waterfallBreath', {
            minutes: 2,
            durationLabel: text('2 min', '2 min'),
            repetitions: text('8-10 spokojnych oddechów', '8-10 calm breaths'),
            description: text(
              'Usiądź wygodnie. Nabierz powietrze nosem, a potem wypuść je wolno ustami, jak spokojny wodospad po deszczu.',
              'Sit comfortably. Breathe in through your nose, then slowly breathe out through your mouth, like a calm waterfall after rain.',
            ),
          }),
        ],
      }),
    ],
  },
]
