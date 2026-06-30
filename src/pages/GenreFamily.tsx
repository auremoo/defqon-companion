import { useState, useEffect } from 'react'
import PageShell from '../components/PageShell'

const HARD_GENRES = [
  {
    id: 'jumpstyle',
    num: '1',
    name: 'Jumpstyle',
    color: '#f59e0b',
    bpm: '140–150',
    sub: ['Jumpstyle', 'Belgian Jumpstyle', 'Dutch Jumpstyle', 'Tekstyle', 'Jump Hardcore', 'Hard Jump'],
    desc: "Genre né aux Pays-Bas et en Belgique fin des années 90, caractérisé par un kick syncopé et une danse spécifique — le \"jump\". Précurseur du hardstyle moderne.",
  },
  {
    id: 'hardstyle',
    num: '2',
    name: 'Hardstyle',
    color: '#e63946',
    bpm: '140–160',
    sub: [
      'Early Hardstyle (2000–2006)',
      'Nu-Style / Euphoric Hardstyle',
      'Hardstyle Classic',
      'Rawphoric',
      'Xtra Raw',
      'Raw Hardstyle',
      'Dark Raw',
      'Melodic Raw',
      'Atmospheric Raw',
      'Hardcore-Influenced Hardstyle',
      'Psystyle (Psytrance + Hardstyle)',
    ],
    desc: "Né aux Pays-Bas et en Belgique vers 2000, le hardstyle est le pilier de Defqon.1. Kicks distordus, mélodies euphoriques pour l'euphoric, riffs sombres et screeches pour le raw. Le genre dominant de la scène hard dance mondiale.",
  },
  {
    id: 'hardcore',
    num: '3',
    name: 'Hardcore',
    color: '#991b1b',
    bpm: '160–220+',
    sections: [
      {
        label: 'Historique / Racines',
        items: ['Early Hardcore (1991–1994)', 'Gabber (voir section 4)', 'Oldschool Hardcore', 'Rave Hardcore'],
      },
      {
        label: 'Évolutions principales',
        items: ['Millennium Hardcore (1997–2001)', 'Mainstream Hardcore', 'New School Hardcore', 'Modern Hardcore'],
      },
      {
        label: 'Sous-genres',
        items: ['Industrial Hardcore', 'UK Hardcore', 'Happy Hardcore', 'Hardcore Breaks'],
      },
      {
        label: 'Sous-genres extrêmes',
        items: [
          'Frenchcore (180–200 BPM)',
          'Uptempo Hardcore (190–220 BPM)',
          'Terror / Terrorcore (200–300+ BPM)',
          'Speedcore (300–600+ BPM)',
          '— Splittercore, Extratone, Megacore, Flashcore, 22k / Highspeed',
          'Doomcore / Darkcore',
          'Noisekick / Noisecore',
          'Breakcore Hardcore',
          'Deathcore (Hardcore)',
        ],
      },
      {
        label: 'Hybrides',
        items: [
          'Crossbreed (Hardcore + Drum & Bass)',
          'Gabbercore (Gabber + Hardcore)',
          'Hardcore Techno (ancien terme)',
          'Tranccore (Trance + Hardcore)',
          'Hardstyle Hardcore (Fusion)',
        ],
      },
    ],
    desc: "Né à Rotterdam (Pays-Bas) autour de 1990–1991, le hardcore est l'ancêtre de toute la hard music. Plus rapide, plus dur, plus intense que le hardstyle. Un univers à part entière avec une culture profonde.",
  },
  {
    id: 'gabber',
    num: '4',
    name: 'Gabber',
    color: '#d4a20a',
    bpm: '160–180',
    sub: ['Early Gabber', 'Classic Gabber', 'Oldschool Gabber', 'Modern Gabber', 'Hardgabber', 'Gabber Industrial', 'Gabber Trance'],
    desc: "Style emblématique de Rotterdam, années 90. Kicks ultra-distordus, tempo rapide, esthétique de rue. Le gabber est la version la plus brute et identitaire du hardcore néerlandais. Toujours vivant dans la culture.",
  },
  {
    id: 'hardtek',
    num: '5',
    name: 'Hardtek / Tribe',
    color: '#22c55e',
    bpm: '140–170',
    sub: [
      'Hardtek', 'Tribecore', 'Tribe', 'Acidcore', 'Mentalcore',
      'Raggatek', 'Tribetek', 'Industrial Tribe', 'Frenchcore (origin: Tribe)',
      'Hardtek Mental', 'Tekno / Tekstyle (rave underground)',
    ],
    desc: "Né de la scène Tekno / Free Party européenne dans les années 90. Moins commercial que le hardcore ou le hardstyle, il conserve un ADN underground fort. Souvent joué en rave illégale et en free party.",
  },
  {
    id: 'happy',
    num: '6',
    name: 'Happy Hardcore',
    color: '#ec4899',
    bpm: '160–180',
    sub: ['UK Happy Hardcore', 'Freeform Hardcore', 'Happy Hardcore (Classic 90s)', 'Nu Happy Hardcore', 'J-Core', 'Happy Hardstyle', 'Happy Gabber'],
    desc: "Né au Royaume-Uni dans les années 90. Tempos rapides, mélodies joyeuses, voix pitchées et pianos euphoriques. L'antithèse sonore du hardcore sombre — une énergie festive à haute intensité.",
  },
  {
    id: 'autres',
    num: '7',
    name: 'Autres styles associés',
    color: '#9ca3af',
    bpm: '—',
    sub: ['Makina', 'Hard Trance', 'Hard House', 'Hard Dance', 'Eurodance (variantes)', 'Freestyle', 'Electro Hardcore', 'Hands Up', 'Bounce'],
    desc: "Styles connexes qui partagent l'énergie et l'intensité de la hard music sans appartenir directement à l'arbre principal. Souvent présents dans les sets crossover ou comme influences.",
  },
]

const BPM_ROWS = [
  { label: 'Hardstyle',          bpm: '140 – 155',   color: '#e63946' },
  { label: 'Rawstyle',           bpm: '150 – 160',   color: '#3b82f6' },
  { label: 'Hard Techno',        bpm: '140 – 160',   color: '#6b7280' },
  { label: 'Jumpstyle',          bpm: '140 – 150',   color: '#f59e0b' },
  { label: 'Early Hardcore',     bpm: '165 – 180',   color: '#b91c1c' },
  { label: 'Mainstream Hardcore',bpm: '165 – 180',   color: '#991b1b' },
  { label: 'Frenchcore',         bpm: '180 – 200',   color: '#f97316' },
  { label: 'Uptempo Hardcore',   bpm: '190 – 220',   color: '#ea580c' },
  { label: 'Terror',             bpm: '200 – 300+',  color: '#7f1d1d' },
  { label: 'Speedcore',          bpm: '300 – 600+',  color: '#450a0a' },
  { label: 'Gabber',             bpm: '160 – 180',   color: '#d4a20a' },
  { label: 'Hardtek / Tribe',    bpm: '140 – 170',   color: '#22c55e' },
  { label: 'Happy Hardcore',     bpm: '160 – 180',   color: '#ec4899' },
]

const TIMELINE = [
  { period: '1988–1992', event: 'Naissance du Gabber à Rotterdam. Thunderdome, Rave, premières soirées hardcore.' },
  { period: '1992–1995', event: 'Émergence de l\'Early Hardcore, du Rave Hardcore et du Breakbeat Hardcore. La scène s\'internationalise.' },
  { period: '1995–2000', event: 'Développement du Gabber et de la scène Tekno / Free Party en Europe. Premiers sons proto-hardstyle.' },
  { period: '2000–2005', event: 'Naissance du Hardstyle aux Pays-Bas et en Belgique. Styles Euphoric & Nu-Style. Rawstyle, Frenchcore et Jumpstyle explosent.' },
  { period: '1997–2001', event: 'Millennium Hardcore, Happy Hardcore, UK Hardcore — la scène hardcore se diversifie.' },
  { period: '2005–2010', event: 'Uptempo, Terror et Speedcore émergent. Industrial Hardcore se développe. Defqon.1 s\'impose comme référence mondiale.' },
  { period: '2010–2015', event: 'Hard Techno se popularise en club et festival. Le rawstyle devient dominant dans le hardstyle.' },
  { period: '2015–2020', event: 'Rawstyle Xtra Raw, Uptempo, Crossbreed et fusion des styles. Explosion des public festivals.' },
  { period: '2020+',     event: 'Mélanges modernes, hybridations, nouvelles générations d\'artistes. Hard Techno crossover massive.' },
]

const CHARACTERISTICS = [
  { icon: '⚡', label: 'BPM ÉLEVÉ', value: '140 à 300+ BPM' },
  { icon: '🥁', label: 'KICKS PUISSANTS', value: 'Distorsion & impact' },
  { icon: '🔊', label: 'BASSES LOURDES', value: 'Subbass intense' },
  { icon: '🌑', label: 'ATMOSPHÈRES', value: 'Sombres ou énergiques' },
  { icon: '📈', label: 'BUILD-UPS', value: 'Montées & breaks' },
  { icon: '💥', label: 'DROPS EXPLOSIFS', value: 'Release maximal' },
  { icon: '🎤', label: 'SAMPLES / FX', value: 'Vocals, screeches' },
]

const SCENES = [
  { label: 'Rave (90s)', items: 'Gabber, Early Hardcore, Hardcore, Trance', color: '#d4a20a' },
  { label: 'Hardstyle Festivals', items: 'Defqon.1, Qlimax, Decibel, Reverze, Intents…', color: '#e63946' },
  { label: 'Hardcore Festivals', items: 'Thunderdome, Dominator, Masters of Hardcore…', color: '#991b1b' },
  { label: 'Free Party / Tekno', items: 'Tribe, Acidcore, Mentalcore, Hardtek…', color: '#22c55e' },
  { label: 'Clubs / Warehouses', items: 'Hard Techno, Industrial Techno, Schranz…', color: '#6b7280' },
]

export default function GenreFamily() {
  const [expanded, setExpanded] = useState<string | null>(null)

  useEffect(() => { document.title = 'Famille de la Hard Music — Defqon Companion' }, [])

  return (
    <PageShell title="Famille de la Hard Music" subtitle="Arbre complet des genres et sous-genres">
      <div className="mx-auto w-full max-w-md space-y-6 pb-6">

        {/* ── Root node ─────────────────────────────────────── */}
        <div className="flex flex-col items-center gap-0">
          <div className="rounded-xl border border-white/20 bg-white/5 px-5 py-2.5 text-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-text-muted">Racine</p>
            <p className="text-sm font-black uppercase tracking-widest text-text-primary">Musique Électronique</p>
          </div>
          <div className="h-5 w-px bg-white/20" />
          {/* Branch line */}
          <div className="relative w-full">
            <div className="absolute left-1/2 top-0 h-5 w-px -translate-x-1/2 bg-red-900/60" />
            <div className="border-t border-red-900/60" />
          </div>
        </div>

        {/* ── Other families (compact) ──────────────────────── */}
        <div className="space-y-3">
          <div>
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted">Autres familles électroniques</p>
            <div className="flex flex-wrap gap-1.5">
              {[
                { name: 'House', color: '#60a5fa', sub: 'Deep, Tech, Progressive, Bass House…' },
                { name: 'Techno', color: '#a78bfa', sub: 'Minimal, Detroit, Industrial, Schranz…' },
                { name: 'Trance', color: '#818cf8', sub: 'Uplifting, Progressive, Psy, Hard Trance…' },
                { name: 'Drum & Bass', color: '#34d399', sub: 'Liquid, Neurofunk, Jump Up, Darkstep…' },
                { name: 'Dubstep / Riddim', color: '#818cf8', sub: 'Brostep, Riddim, Melodic Dubstep…' },
                { name: 'Trap / Bass Music', color: '#f472b6', sub: 'Future Bass, Hybrid Trap, Wave…' },
                { name: 'Breakbeat', color: '#fb923c', sub: 'Nu-Skool, Breaks, Big Beat…' },
                { name: 'Electro', color: '#fbbf24', sub: 'Electro House, Complextro…' },
                { name: 'Ambient / IDM', color: '#6ee7b7', sub: 'Downtempo, Glitch, Electronica…' },
                { name: 'Future Rave', color: '#c084fc', sub: 'Melodic Techno + EDM, Hardwell era…' },
              ].map((f) => (
                <span
                  key={f.name}
                  className="rounded-full border px-2.5 py-1 text-[10px] font-semibold"
                  style={{ borderColor: f.color + '50', color: f.color, backgroundColor: f.color + '12' }}
                  title={f.sub}
                >
                  {f.name}
                </span>
              ))}
            </div>
          </div>

          {/* EDM callout */}
          <div className="rounded-xl border border-yellow-900/40 bg-yellow-950/20 p-3">
            <p className="text-[10px] font-black uppercase tracking-wider text-yellow-500">EDM Commercial — pourquoi absent ?</p>
            <p className="mt-1 text-[11px] leading-relaxed text-text-muted">
              L'EDM (Electronic Dance Music) au sens commercial — Avicii, David Guetta, Martin Garrix, big room, future house — est une branche <span className="text-text-secondary font-semibold">séparée</span> de la hard music. Les deux partagent la même racine électronique mais leurs cultures, leurs scènes et leurs communautés ne se mélangent pas. Showtek, par exemple, est passé du hardstyle à l'EDM mainstream — et la communauté hardstyle lui a reproché. L'EDM commercial n'appartient pas à l'arbre de la hard music.
            </p>
          </div>
        </div>

        {/* ── Hard Music header ─────────────────────────────── */}
        <div
          className="relative overflow-hidden rounded-2xl border border-red-800/60 p-5"
          style={{ background: 'linear-gradient(135deg, #1a0000 0%, #0d0000 60%, #000 100%)' }}
        >
          <div className="absolute inset-0 opacity-5"
            style={{ backgroundImage: 'repeating-linear-gradient(45deg, #e63946 0px, #e63946 1px, transparent 1px, transparent 20px)' }} />
          <div className="relative">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-red-500">Famille principale</p>
            <h2 className="mt-1 text-xl font-black uppercase tracking-wider text-white">Hard Music</h2>
            <p className="text-base font-black uppercase tracking-wider text-red-400">Hard Dance</p>
            <p className="mt-3 text-xs leading-relaxed text-text-muted">
              Terme parapluie regroupant les musiques électroniques rapides, dures et énergiques. Nées à Rotterdam et dans les Pays-Bas autour des années 90–2000, elles partagent un ADN commun : kick puissant, énergie maximale, communauté soudée.
            </p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {HARD_GENRES.map((g) => (
                <span
                  key={g.id}
                  className="rounded-full px-2 py-0.5 text-[9px] font-bold uppercase"
                  style={{ backgroundColor: g.color + '25', color: g.color }}
                >
                  {g.name}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ── 7 genre accordion ─────────────────────────────── */}
        <div>
          <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted">Les 7 familles Hard Music</p>
          <div className="space-y-2">
            {HARD_GENRES.map((g) => {
              const open = expanded === g.id
              return (
                <div
                  key={g.id}
                  className="overflow-hidden rounded-xl border transition-colors"
                  style={{ borderColor: open ? g.color + '60' : '#ffffff15', backgroundColor: open ? g.color + '08' : '#0a0a0a' }}
                >
                  <button
                    className="flex w-full items-center gap-3 p-4 text-left"
                    onClick={() => setExpanded(open ? null : g.id)}
                  >
                    {/* Number badge */}
                    <span
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-black"
                      style={{ backgroundColor: g.color + '25', color: g.color }}
                    >
                      {g.num}
                    </span>
                    <div className="flex-1">
                      <p className="font-black uppercase tracking-wider" style={{ color: g.color }}>{g.name}</p>
                      <p className="text-[10px] text-text-muted">~{g.bpm} BPM</p>
                    </div>
                    <span className="text-text-muted transition-transform" style={{ transform: open ? 'rotate(90deg)' : '' }}>›</span>
                  </button>

                  {open && (
                    <div className="space-y-3 px-4 pb-4">
                      {/* Description */}
                      <p className="text-xs leading-relaxed text-text-muted">{g.desc}</p>

                      {/* Subsections or flat list */}
                      {'sections' in g && g.sections ? (
                        <div className="space-y-3">
                          {g.sections.map((sec) => (
                            <div key={sec.label}>
                              <p
                                className="mb-1.5 text-[9px] font-bold uppercase tracking-widest"
                                style={{ color: g.color + 'cc' }}
                              >
                                {sec.label}
                              </p>
                              <div className="flex flex-wrap gap-1.5">
                                {sec.items.map((item) => (
                                  <span
                                    key={item}
                                    className={`rounded px-2 py-0.5 text-[10px] ${item.startsWith('—') ? 'text-text-muted italic' : 'text-text-secondary'}`}
                                    style={item.startsWith('—') ? {} : { backgroundColor: g.color + '15' }}
                                  >
                                    {item}
                                  </span>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex flex-wrap gap-1.5">
                          {(g.sub ?? []).map((s) => (
                            <span
                              key={s}
                              className="rounded px-2 py-0.5 text-[10px] text-text-secondary"
                              style={{ backgroundColor: g.color + '15' }}
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* ── BPM Guide ─────────────────────────────────────── */}
        <div className="rounded-xl border border-border bg-surface-card overflow-hidden">
          <div className="border-b border-border bg-red-950/30 px-4 py-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-red-400">Guide des BPM</p>
            <p className="text-[10px] text-text-muted">Valeurs approximatives — les frontières sont floues</p>
          </div>
          <div className="divide-y divide-border/50">
            {BPM_ROWS.map((row) => (
              <div key={row.label} className="flex items-center gap-3 px-4 py-2">
                <div className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: row.color }} />
                <span className="flex-1 text-xs text-text-secondary">{row.label}</span>
                <span className="font-mono text-xs font-bold" style={{ color: row.color }}>{row.bpm}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── History timeline ──────────────────────────────── */}
        <div className="rounded-xl border border-border bg-surface-card overflow-hidden">
          <div className="border-b border-border bg-red-950/30 px-4 py-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-red-400">Histoire & Évolution</p>
          </div>
          <div className="relative space-y-0 px-4 py-3">
            {/* Vertical line */}
            <div className="absolute left-7 top-3 bottom-3 w-px bg-red-900/30" />
            {TIMELINE.map((item, i) => (
              <div key={i} className="relative flex gap-4 py-2.5">
                {/* Dot */}
                <div className="relative z-10 flex h-5 w-5 shrink-0 items-center justify-center">
                  <div className="h-2 w-2 rounded-full bg-red-600" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-wider text-red-400">{item.period}</p>
                  <p className="mt-0.5 text-[11px] leading-relaxed text-text-muted">{item.event}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Characteristics ───────────────────────────────── */}
        <div>
          <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted">Caractéristiques communes</p>
          <div className="grid grid-cols-2 gap-2">
            {CHARACTERISTICS.map((c) => (
              <div key={c.label} className="flex items-center gap-2.5 rounded-xl border border-border bg-surface-card p-3">
                <span className="text-lg">{c.icon}</span>
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-wider text-red-400">{c.label}</p>
                  <p className="text-[10px] text-text-muted">{c.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Scenes ────────────────────────────────────────── */}
        <div>
          <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted">Scènes & Contextes</p>
          <div className="space-y-2">
            {SCENES.map((s) => (
              <div
                key={s.label}
                className="rounded-xl border p-3"
                style={{ borderColor: s.color + '35', backgroundColor: s.color + '08' }}
              >
                <p className="text-[10px] font-black uppercase tracking-wider" style={{ color: s.color }}>{s.label}</p>
                <p className="mt-0.5 text-[11px] text-text-muted">{s.items}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── À retenir ─────────────────────────────────────── */}
        <div
          className="rounded-2xl border border-red-900/40 p-5"
          style={{ background: 'linear-gradient(135deg, #0d0000 0%, #000 100%)' }}
        >
          <p className="mb-4 text-center text-[10px] font-black uppercase tracking-[0.3em] text-red-500">À retenir</p>
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: '🔗', title: 'Tout est connecté', body: 'Les frontières entre genres s\'estompent. Beaucoup de styles se mélangent.' },
              { icon: '⚡', title: 'Hard Music = Énergie', body: 'Une seule constante : la puissance, la vitesse et l\'impact.' },
              { icon: '👥', title: 'Culture', body: 'Plus qu\'une musique : un état d\'esprit, une communauté, une culture.' },
              { icon: '📈', title: 'Évolution constante', body: 'De nouveaux sous-genres naissent portés par les artistes et les scènes.' },
            ].map((item) => (
              <div key={item.title} className="space-y-1">
                <p className="text-base">{item.icon}</p>
                <p className="text-[9px] font-black uppercase tracking-wider text-red-400">{item.title}</p>
                <p className="text-[10px] leading-relaxed text-text-muted">{item.body}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </PageShell>
  )
}
