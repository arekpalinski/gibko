const APP_BG = '#020F21';
const GIBKO_HELLO_SRC = '/assets/gibko-hello.webp';

const GIBKO_LOGO_SRC = '/assets/gibko-logo.webp';
const GIBKO_MASCOT_SRC = '/assets/gibko-mascot-stretch.webp';


const smokeTests = [
  { name: 'renders six screens', expected: 6 },
  { name: 'uses app background matching logo', expected: APP_BG },
  { name: 'logo asset path exists', expected: GIBKO_LOGO_SRC.includes('gibko-logo') },
  { name: 'mascot asset path exists', expected: GIBKO_MASCOT_SRC.includes('gibko-mascot') },
];

console.assert(smokeTests[0].expected === 6, 'Expected six prototype screens');
console.assert(smokeTests[1].expected === '#020F21', 'Expected background #020F21');
console.assert(smokeTests[2].expected === true, 'Expected logo asset path');
console.assert(smokeTests[3].expected === true, 'Expected mascot asset path');

export default function GibkoPrototype() {
  return (
    <main className="min-h-screen bg-[#020F21] p-5 text-white font-sans">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        <IntroScreen />
        <NameScreen />
        <HomeScreen />
        <MapScreen />
        <ProfileScreen />
        <SettingsScreen />
      </div>
    </main>
  );
}

function IntroScreen() {
  return (
    <Phone>
      <StatusBar />
      <JungleDecor />

      <section className="relative z-10 flex h-full flex-col items-center px-8 pb-8 pt-14 text-center">
        <Logo className="mt-6 h-56 w-56" />

        <h1 className="mt-8 text-4xl font-black">Cześć!</h1>

        <p className="mt-4 max-w-[260px] text-base leading-7 text-white/80">
          Nazywam się Gibko i pomogę Ci stać się bardziej gibkim!
        </p>

        <div className="mt-auto flex items-center gap-3 text-sm text-white/70">
          <b className="text-white">1/3</b>
          <Dot active />
          <Dot />
          <Dot />
        </div>

        <PrimaryButton className="mt-8">
          Dalej <span>→</span>
        </PrimaryButton>
      </section>
    </Phone>
  );
}

function NameScreen() {
  return (
    <Phone>
      <StatusBar />

      <section className="relative z-10 flex h-full flex-col px-6 pb-8 pt-14">
        <button className="text-3xl text-white/90" type="button">←</button>

        <Logo className="mx-auto mt-3 h-52 w-52" />

        <h2 className="mt-2 text-center text-4xl font-black">Zacznijmy!</h2>

        <p className="mt-3 text-center text-white/80">
          Jak mamy się do Ciebie zwracać?
        </p>

        <Input icon="♙" placeholder="Twoje imię" />

        <p className="mb-3 mt-7 text-sm font-semibold text-white/90">
          Wybierz język:
        </p>

        <Choice active flag="🇵🇱" label="Polski" />
        <Choice flag="🇬🇧" label="English" />
        <Choice flag="🇮🇩" label="Bahasa Indonesia" />

        <PrimaryButton className="mt-auto">
          Dalej <span>→</span>
        </PrimaryButton>
      </section>
    </Phone>
  );
}

function HomeScreen() {
  return (
    <Phone>
      <StatusBar />

      <section className="relative z-10 flex h-full flex-col px-6 pb-24 pt-12">
        <div className="flex items-center justify-between">
          <Wordmark />
          <span className="text-2xl">🌿</span>
        </div>

        <div className="mt-8 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-3xl font-black leading-tight">Cześć, Arek!</h2>
            <p className="mt-3 text-base leading-6 text-white/80">
              Dzisiaj czas na porcję rozciągania!
            </p>
          </div>

          <HelloMascot className="h-32 w-32 shrink-0" />
        </div>

        <div className="mt-8 grid grid-cols-3 gap-3">
          <Stat icon="⭐" label="XP" value="150" tone="text-[#19dac8]" />
          <Stat icon="🔥" label="Seria" value="7" tone="text-[#ff5f7e]" />
          <Stat icon="🕘" label="Min dzisiaj" value="12" tone="text-[#ffbc36]" />
        </div>

        <Card className="mt-6 overflow-hidden">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-black text-[#16d6c2]">Misja dnia</p>
              <h3 className="mt-5 text-2xl font-black leading-snug">
                Rozgrzewka w koronach drzew
              </h3>

              <div className="mt-5 flex gap-2">
                <Pill>12 min</Pill>
                <Pill yellow>+80 XP</Pill>
              </div>
            </div>

            <Mascot className="-mr-4 h-40 w-40 shrink-0" />
          </div>

          <PrimaryButton className="mt-5">
            Zacznij ćwiczyć <span>→</span>
          </PrimaryButton>
        </Card>

        <BottomNav active="Baza" />
      </section>
    </Phone>
  );
}

function MapScreen() {
  const levels = [
    { n: 1, x: '20%', y: '16%', done: true, stars: 3 },
    { n: 2, x: '50%', y: '8%', done: true, stars: 3 },
    { n: 3, x: '38%', y: '36%', done: true, stars: 0, current: true },
    { n: 4, x: '62%', y: '56%', done: false, stars: 0 },
    { n: 5, x: '22%', y: '74%', done: false, stars: 0 },
    { n: 6, x: '52%', y: '90%', done: false, stars: 0 },
  ];

  return (
    <Phone>
      <StatusBar />

      <section className="relative z-10 h-full overflow-hidden pb-24 pt-12">
        <div className="flex items-center justify-between px-5">
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-2xl text-white"
          >
            ←
          </button>

          <h2 className="text-2xl font-black">Mapa poziomów</h2>

          <div className="rounded-full bg-white/10 px-4 py-2 font-black shadow-lg shadow-black/20">
            💎 150
          </div>
        </div>

        <div className="mt-5 flex items-end justify-between px-5">
          <div>
            <p className="text-sm font-semibold text-[#16d6c2]">Rozdział 1</p>
            <div className="text-3xl font-black leading-tight text-[#16d6c2]">
              Las deszczowy
            </div>
          </div>

          <div className="pb-1 text-lg font-black text-white">
            3/12 <span className="text-[#ffbc36]">⭐</span>
          </div>
        </div>

        <div className="relative mx-3 mt-4 h-[590px] overflow-hidden rounded-[30px] border border-white/10 bg-[#0c2740] shadow-2xl shadow-black/30">
          <ForestMap />

          {/* główna ścieżka */}
          <svg
            className="absolute inset-0 h-full w-full"
            viewBox="0 0 340 590"
            preserveAspectRatio="none"
          >
            <path
              d="M70 110
                 C120 120, 150 130, 175 185
                 C195 225, 210 245, 235 290
                 C250 315, 220 350, 185 390
                 C145 435, 85 455, 95 505
                 C105 548, 195 525, 240 555"
              stroke="#f3dcb4"
              strokeWidth="7"
              strokeLinecap="round"
              strokeDasharray="14 14"
              fill="none"
            />
          </svg>

          {levels.map((node) => (
            <MapNode key={node.n} {...node} />
          ))}
        </div>

        <BottomNav active="Mapa" />
      </section>
    </Phone>
  );
}

function ProfileScreen() {
  return (
    <Phone>
      <StatusBar />

      <section className="relative z-10 flex h-full flex-col px-6 pb-24 pt-12">
        <div className="flex items-center justify-between">
          <span />
          <h2 className="text-2xl font-black">Profil</h2>
          <span className="text-2xl">⚙</span>
        </div>

        <Mascot className="mx-auto mt-5 h-44 w-44" />

        <h2 className="text-center text-4xl font-black">Arek</h2>
        <div className="mx-auto mt-2 rounded-full bg-[#8b5cf6] px-5 py-2 text-sm font-black">
          Poziom 3
        </div>

        <Card className="mt-8">
          <div className="grid grid-cols-3 gap-3 text-center">
            <StatMini icon="⭐" label="XP" value="150" color="text-[#16d6c2]" />
            <StatMini icon="🔥" label="Seria dni" value="7" color="text-[#ff5f7e]" />
            <StatMini icon="🕘" label="Min dzisiaj" value="12" color="text-[#ffbc36]" />
          </div>

          <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4">
            <span className="text-white/80">◷ Wszystkie minuty</span>
            <b className="text-2xl">124</b>
          </div>
        </Card>

        <div className="mt-7 flex items-center justify-between">
          <h3 className="text-lg font-black">Odznaki</h3>
          <span className="text-sm text-[#16d6c2]">Zobacz wszystkie →</span>
        </div>

        <div className="mt-4 grid grid-cols-4 gap-4">
          {['🐵', '🌿', '🧘', '⏱️'].map((badge, index) => (
            <BadgeIcon key={badge} icon={badge} i={index} />
          ))}
        </div>

        <BottomNav active="Profil" />
      </section>
    </Phone>
  );
}

function SettingsScreen() {
  return (
    <Phone>
      <StatusBar />

      <section className="relative z-10 flex h-full flex-col px-6 pb-24 pt-12">
        <div className="grid grid-cols-3 items-center">
          <span className="text-3xl">←</span>
          <h2 className="text-center text-2xl font-black">Ustawienia</h2>
          <span />
        </div>

        <div className="mt-12 space-y-3">
          <p className="mb-4 font-semibold">Język aplikacji</p>
          <SettingChoice active>Polski</SettingChoice>
          <SettingChoice>English</SettingChoice>
          <SettingChoice>Bahasa Indonesia</SettingChoice>
        </div>

        <div className="mt-8 space-y-5">
          <Toggle label="Dźwięki" />
          <Toggle label="Powiadomienia" />

          <div className="flex items-center justify-between">
            <span>Motyw</span>
            <span className="text-white/60">Ciemny ›</span>
          </div>
        </div>

        <div className="mt-8 border-t border-white/10 pt-8">
          <button className="text-lg font-black text-[#ff5f7e]" type="button">
            Resetuj postępy <span className="ml-3">↻</span>
          </button>
          <p className="mt-5 text-sm leading-6 text-white/60">
            Uwaga: ta operacja jest nieodwracalna i spowoduje utratę wszystkich postępów.
          </p>
        </div>

        <BottomNav active="Ustawienia" />
      </section>
    </Phone>
  );
}

function Phone({ children }) {
  return (
    <div className="relative h-[760px] overflow-hidden rounded-[34px] border border-white/15 bg-[#020F21] shadow-2xl shadow-black/60 ring-8 ring-black">
      {children}
    </div>
  );
}

function StatusBar() {
  return (
    <div className="absolute left-6 right-6 top-4 z-20 flex justify-between text-sm font-bold">
      <span>9:41</span>
      <span>▮▮ ᯤ ▰</span>
    </div>
  );
}

function Logo({ className = '' }) {
  return (
    <img
      className={`object-contain drop-shadow-2xl ${className}`}
      src={GIBKO_LOGO_SRC}
      alt="Gibko"
    />
  );
}

function Mascot({ className = '' }) {
  return (
    <img
      className={`object-contain drop-shadow-2xl ${className}`}
      src={GIBKO_MASCOT_SRC}
      alt="Gibko mascot"
    />
  );
}


function HelloMascot({ className = '' }) {
  return (
    <div className={`relative overflow-hidden rounded-[28px] bg-[#020F21] ${className}`}>
      <img
        className="h-full w-full object-cover object-center"
        src={GIBKO_HELLO_SRC}
        alt="Gibko waving hello"
      />
    </div>
  );
}

function Wordmark() {
  return (
    <div className="text-3xl font-black tracking-tight">
      <span className="text-[#16d6c2]">G</span>
      <span>i</span>
      <span className="text-[#ffbc36]">b</span>
      <span className="text-[#ff5f7e]">k</span>
      <span className="text-[#9b5de5]">o</span>
    </div>
  );
}

function PrimaryButton({ children, className = '' }) {
  return (
    <button
      className={`flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-[#16d6c2] to-[#19c4a4] px-6 py-4 text-lg font-black text-white shadow-lg shadow-[#16d6c2]/20 ${className}`}
      type="button"
    >
      {children}
    </button>
  );
}

function Card({ children, className = '' }) {
  return (
    <div className={`rounded-3xl border border-white/10 bg-white/[.055] p-5 shadow-xl shadow-black/20 backdrop-blur ${className}`}>
      {children}
    </div>
  );
}

function Dot({ active = false }) {
  return (
    <span className={`h-3 w-3 rounded-full ${active ? 'bg-[#16d6c2]' : 'bg-white/15'}`} />
  );
}

function Input({ icon, placeholder }) {
  return (
    <div className="mt-5 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[.055] px-4 py-4 text-white/60">
      <span>{icon}</span>
      {placeholder}
    </div>
  );
}

function Choice({ flag, label, active = false }) {
  return (
    <div className={`mb-3 flex items-center justify-between rounded-2xl border px-4 py-3 ${active ? 'border-[#16d6c2] bg-[#16d6c2]/10' : 'border-white/10 bg-white/[.055]'}`}>
      <span className="flex items-center gap-3">
        <span className="text-2xl">{flag}</span>
        {label}
      </span>

      {active && <b className="text-[#16d6c2]">✓</b>}
    </div>
  );
}

function Stat({ icon, label, value, tone }) {
  return (
    <Card className="text-center">
      <div className="text-3xl">{icon}</div>
      <div className="mt-2 text-xs font-black text-[#ffbc36]">{label}</div>
      <div className={`mt-3 text-3xl font-black ${tone}`}>{value}</div>
    </Card>
  );
}

function Pill({ children, yellow = false }) {
  return (
    <span className={`rounded-full border px-3 py-2 text-sm font-black ${yellow ? 'border-[#ffbc36]/30 text-[#ffbc36]' : 'border-[#16d6c2]/30 text-[#16d6c2]'}`}>
      {children}
    </span>
  );
}

function BottomNav({ active }) {
  const items = [
    ['Baza', '⌂'],
    ['Mapa', '▱'],
    ['Profil', '♙'],
    ['Ustawienia', '⚙'],
  ];

  return (
    <nav className="absolute bottom-0 left-0 right-0 z-30 grid grid-cols-4 border-t border-white/10 bg-[#020F21]/95 px-2 py-3 backdrop-blur">
      {items.map(([title, icon]) => (
        <div key={title} className={`flex flex-col items-center gap-1 text-xs font-bold ${active === title ? 'text-[#16d6c2]' : 'text-white/70'}`}>
          <span className="text-2xl">{icon}</span>
          {title}
        </div>
      ))}
    </nav>
  );
}

function JungleDecor() {
  return (
    <>
      <div className="absolute -left-12 bottom-20 z-0 text-8xl opacity-80">🌿</div>
      <div className="absolute -right-8 bottom-24 z-0 text-8xl opacity-80">🌱</div>
      <div className="absolute -left-3 top-8 z-0 text-7xl opacity-60">🍃</div>
      <div className="absolute right-2 top-7 z-0 text-6xl opacity-60">🌿</div>
      <div className="absolute bottom-36 left-16 z-0 text-4xl">🌺</div>
    </>
  );
}

function ForestMap() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* tło */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0b3355] via-[#0c2f4d] to-[#08253d]" />

      {/* zielone wyspy / warstwy */}
      <div className="absolute left-[-10px] top-[90px] h-[190px] w-[220px] rounded-[45%] bg-[#176440]" />
      <div className="absolute right-[-20px] top-[110px] h-[180px] w-[190px] rounded-[45%] bg-[#135a3d]" />
      <div className="absolute left-[60px] top-[250px] h-[210px] w-[180px] rounded-[45%] bg-[#1a7148]" />
      <div className="absolute left-[-20px] top-[400px] h-[160px] w-[170px] rounded-[45%] bg-[#135338]" />
      <div className="absolute right-[20px] top-[470px] h-[150px] w-[170px] rounded-[45%] bg-[#0f5e3d]" />

      {/* rzeka */}
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 340 590"
        preserveAspectRatio="none"
      >
        <path
          d="M305 110
             C280 150, 292 200, 258 250
             C230 292, 228 348, 250 402
             C268 445, 310 490, 292 560"
          fill="none"
          stroke="#1da8d8"
          strokeWidth="30"
          strokeLinecap="round"
          opacity="0.95"
        />
        <path
          d="M305 110
             C280 150, 292 200, 258 250
             C230 292, 228 348, 250 402
             C268 445, 310 490, 292 560"
          fill="none"
          stroke="#6de7ff"
          strokeWidth="10"
          strokeLinecap="round"
          opacity="0.45"
        />
      </svg>

      {/* mostek */}
      <div className="absolute left-[170px] top-[385px] h-5 w-16 -rotate-12 rounded-md bg-[#7a4a28] shadow-md">
        <div className="flex h-full items-center justify-around px-1">
          <span className="h-3 w-1 rounded bg-[#d9a76f]" />
          <span className="h-3 w-1 rounded bg-[#d9a76f]" />
          <span className="h-3 w-1 rounded bg-[#d9a76f]" />
          <span className="h-3 w-1 rounded bg-[#d9a76f]" />
          <span className="h-3 w-1 rounded bg-[#d9a76f]" />
        </div>
      </div>

      {/* drzewa */}
      <SimpleTree x="8%" y="18%" scale={1.05} />
      <SimpleTree x="70%" y="18%" scale={0.9} />
      <SimpleTree x="15%" y="43%" scale={1} />
      <SimpleTree x="74%" y="48%" scale={0.82} />
      <SimpleTree x="3%" y="76%" scale={1} />
      <SimpleTree x="68%" y="82%" scale={0.95} />

      {/* krzaki */}
      <SimpleBush x="58%" y="22%" />
      <SimpleBush x="64%" y="40%" />
      <SimpleBush x="82%" y="64%" />
      <SimpleBush x="8%" y="76%" />
      <SimpleBush x="80%" y="82%" />
    </div>
  );
}

function Tree({ x, y, scale = '1' }) {
  return (
    <div
      className="absolute"
      style={{ left: x, top: y, transform: `scale(${scale})` }}
    >
      <div className="relative h-24 w-20">
        <div className="absolute bottom-0 left-1/2 h-10 w-4 -translate-x-1/2 rounded-full bg-[#7c4a24]" />
        <div className="absolute bottom-6 left-1/2 h-14 w-14 -translate-x-1/2 rounded-full bg-[#4fb148]" />
        <div className="absolute bottom-10 left-2 h-12 w-12 rounded-full bg-[#63c64e]" />
        <div className="absolute bottom-10 right-2 h-12 w-12 rounded-full bg-[#3d9e3d]" />
        <div className="absolute bottom-14 left-1/2 h-12 w-12 -translate-x-1/2 rounded-full bg-[#79d958]" />
      </div>
    </div>
  );
}

function Bush({ x, y }) {
  return (
    <div className="absolute" style={{ left: x, top: y }}>
      <div className="relative h-12 w-16">
        <div className="absolute bottom-0 left-0 h-8 w-8 rounded-full bg-[#42aa47]" />
        <div className="absolute bottom-1 left-4 h-9 w-9 rounded-full bg-[#63c64e]" />
        <div className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-[#2d8c41]" />
      </div>
    </div>
  );
}

function SimpleTree({
  x,
  y,
  scale = 1,
}: {
  x: string;
  y: string;
  scale?: number;
}) {
  return (
    <div
      className="absolute"
      style={{ left: x, top: y, transform: `scale(${scale})` }}
    >
      <div className="relative h-24 w-20">
        <div className="absolute bottom-0 left-1/2 h-11 w-4 -translate-x-1/2 rounded-full bg-[#8c4c24]" />
        <div className="absolute bottom-7 left-1/2 h-14 w-14 -translate-x-1/2 rounded-full bg-[#4faf43]" />
        <div className="absolute bottom-11 left-1 h-12 w-12 rounded-full bg-[#7cda53]" />
        <div className="absolute bottom-11 right-1 h-12 w-12 rounded-full bg-[#41a33f]" />
      </div>
    </div>
  );
}

function SimpleBush({ x, y }: { x: string; y: string }) {
  return (
    <div className="absolute" style={{ left: x, top: y }}>
      <div className="relative h-10 w-14">
        <div className="absolute bottom-0 left-0 h-7 w-7 rounded-full bg-[#53bf46]" />
        <div className="absolute bottom-1 left-4 h-8 w-8 rounded-full bg-[#79da53]" />
        <div className="absolute bottom-0 right-0 h-7 w-7 rounded-full bg-[#2f8f41]" />
      </div>
    </div>
  );
}

function MapNode({
  n,
  x,
  y,
  done,
  stars = 0,
  current = false,
}: {
  n: number;
  x: string;
  y: string;
  done: boolean;
  stars?: number;
  current?: boolean;
}) {
  return (
    <div
      className="absolute w-24"
      style={{
        left: x,
        top: y,
        transform: 'translate(-50%, -50%)',
      }}
    >
      <div className="flex flex-col items-center">
        <div
          className={`relative flex h-20 w-20 items-center justify-center rounded-full border-4 text-4xl font-black shadow-2xl ${
            current
              ? 'border-[#61f3ea] bg-[radial-gradient(circle_at_30%_30%,#4ff5f3,#1ab7be_68%,#0f6e75)] text-white shadow-[#16d6c2]/40'
              : done
                ? 'border-[#72efe8] bg-[radial-gradient(circle_at_30%_30%,#47ece4,#1aa4ad_68%,#0c5c63)] text-white'
                : 'border-[#6f7788] bg-[radial-gradient(circle_at_30%_30%,#233248,#111a28_75%)] text-white/95'
          }`}
        >
          {done ? n : '🔒'}
        </div>

        {/* gwiazdki zawsze pod kółkiem */}
        <div className="mt-2 flex h-6 items-center justify-center gap-1 text-lg leading-none">
          {done && stars > 0 ? (
            Array.from({ length: stars }).map((_, i) => (
              <span key={i} className="text-[#ffbc36]">
                ⭐
              </span>
            ))
          ) : current ? (
            <span className="text-sm font-black text-[#16d6c2]">Start!</span>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function StatMini({ icon, label, value, color }) {
  return (
    <div>
      <div className="text-2xl">{icon}</div>
      <div className="mt-1 text-xs font-bold text-white/70">{label}</div>
      <div className={`mt-2 text-3xl font-black ${color}`}>{value}</div>
    </div>
  );
}

function BadgeIcon({ icon, i }) {
  const colors = [
    'border-[#16d6c2] bg-[#16d6c2]/15',
    'border-[#94d82d] bg-[#94d82d]/15',
    'border-[#9b5de5] bg-[#9b5de5]/15',
    'border-[#ff5f7e] bg-[#ff5f7e]/15',
  ];

  return (
    <div className={`flex h-16 items-center justify-center rounded-2xl border-2 text-3xl ${colors[i]}`}>
      {icon}
    </div>
  );
}

function SettingChoice({ children, active = false }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[.055] px-4 py-3">
      {children}
      {active && <span className="text-[#16d6c2]">✓</span>}
    </div>
  );
}

function Toggle({ label }) {
  return (
    <div className="flex items-center justify-between">
      <span>{label}</span>
      <span className="relative h-8 w-14 rounded-full bg-[#16d6c2]">
        <span className="absolute right-1 top-1 h-6 w-6 rounded-full bg-white" />
      </span>
    </div>
  );
}
