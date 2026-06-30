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

const OTHER_FAMILIES = [
  {
    name: 'House',
    color: '#60a5fa',
    bpm: '120–130',
    desc: "Née à Chicago dans les années 80, la house est l'une des familles les plus larges de la musique électronique. Groove 4×4, piano chords, mélodies funky. De la Deep House aux raves, elle reste la base de nombreux genres modernes.",
    sub: ['Deep House', 'Tech House', 'Progressive House', 'Electro House', 'Bass House', 'Future House'],
  },
  {
    name: 'Techno',
    color: '#a78bfa',
    bpm: '130–160',
    desc: "Née à Detroit dans les années 80, importée en Europe via Berlin. Hypnotique, répétitive, industrielle. Le pilier des clubs underground : Berghain, Tresor, fabric. Schranz, Industrial Techno et Hard Techno sont ses variantes les plus agressives.",
    sub: ['Minimal Techno', 'Detroit Techno', 'Industrial Techno', 'Hard Techno', 'Schranz', 'Peak Time Techno'],
  },
  {
    name: 'Trance',
    color: '#818cf8',
    bpm: '128–145',
    desc: "Née en Allemagne au début des années 90. Mélodies épiques, montées longues, atmosphères planantes. L'Uplifting Trance et la Psytrance ont des points communs avec la hard music par leur intensité et leur BPM.",
    sub: ['Uplifting Trance', 'Progressive Trance', 'Psytrance', 'Hard Trance', 'Tech Trance', 'Dark Psy'],
  },
  {
    name: 'Drum & Bass',
    color: '#34d399',
    bpm: '160–180',
    desc: "Née à Londres au début des années 90, du jungle et du breakbeat. Breakbeats rapides, basses profondes, culture très urbaine et soudée. Présente à Defqon.1 depuis 2025 avec sa propre scène.",
    sub: ['Liquid DnB', 'Neurofunk', 'Jump Up', 'Darkstep', 'Rollers', 'Drumstep'],
  },
  {
    name: 'Dubstep / Riddim',
    color: '#7c3aed',
    bpm: '138–142',
    desc: "Né à South London fin des années 90, popularisé mondialement autour de 2010. Half-time, wobs massifs, drops lourds. Riddim est sa variante la plus répétitive et agressive. Crossover fréquent avec la hard music.",
    sub: ['Brostep', 'Riddim', 'Melodic Dubstep', 'Tearout', 'Deathstep'],
  },
  {
    name: 'Trap / Bass Music',
    color: '#f472b6',
    bpm: '70–150',
    desc: "Issu du hip-hop américain du début des années 2000. Future Bass, Wave et Hybrid Trap sont des variantes électroniques très populaires sur la scène festival. Souvent crossover avec d'autres genres.",
    sub: ['Future Bass', 'Wave', 'Hybrid Trap', 'Melodic Bass', 'Phonk'],
  },
  {
    name: 'Breakbeat',
    color: '#fb923c',
    bpm: '120–140',
    desc: "L'un des premiers genres électroniques de club, né en Angleterre fin des années 80. Rythmes syncopés et cassés. À l'origine de nombreux genres hard (le hardcore en est issu). Big Beat, Nu-Skool, Breaks.",
    sub: ['Nu-Skool Breaks', 'Big Beat', 'Breaks', 'Electro Breaks'],
  },
  {
    name: 'Future Rave',
    color: '#c084fc',
    bpm: '130–145',
    desc: "Genre hybride popularisé par Hardwell et David Guetta vers 2021–2022. Croise la techno mélodique avec l'énergie des gros festivals EDM. Situé entre la hard music et l'EDM mainstream — une zone grise intéressante.",
    sub: ['Melodic Techno × EDM', 'Big Room Techno', 'Festival Techno'],
  },
  {
    name: 'Ambient / IDM',
    color: '#6ee7b7',
    bpm: '60–120',
    desc: "Musique électronique introspective et atmosphérique. Aphex Twin, Boards of Canada, Burial. Aux antipodes de la hard music sur le plan de l'intensité, mais souvent influente sur les sound designs (samples, textures).",
    sub: ['Ambient', 'IDM', 'Downtempo', 'Glitch', 'Electronica', 'Dark Ambient'],
  },
  {
    name: 'EDM',
    color: '#06b6d4',
    bpm: '126–135',
    desc: "L'EDM commercial (Avicii, David Guetta, Martin Garrix, Calvin Harris) partage la même racine électronique mais appartient à une culture totalement différente — pop, mainstream, festival de masse. Showtek est passé du hardstyle à l'EDM mainstream et la communauté hardstyle lui en a tenu rigueur. C'est pourquoi l'EDM ne figure pas dans l'arbre de la hard music, même si techniquement c'est de la musique électronique dansante.",
    sub: ['Big Room House', 'Progressive House', 'Electro House', 'Future House', 'Pop Electronic'],
  },
]

export default function GenreFamily() {
  const [expanded, setExpanded] = useState<string | null>(null)
  const [expandedFamily, setExpandedFamily] = useState<string | null>(null)

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

        {/* ── Other families (interactive chips) ───────────── */}
        <div>
          <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted">
            Autres familles électroniques <span className="normal-case font-normal">(appuie pour en savoir plus)</span>
          </p>
          <div className="flex flex-wrap gap-1.5">
            {OTHER_FAMILIES.map((f) => {
              const active = expandedFamily === f.name
              return (
                <button
                  key={f.name}
                  onClick={() => setExpandedFamily(active ? null : f.name)}
                  className="rounded-full border px-2.5 py-1 text-[10px] font-semibold transition-all"
                  style={{
                    borderColor: active ? f.color + 'aa' : f.color + '50',
                    color: f.color,
                    backgroundColor: active ? f.color + '28' : f.color + '12',
                  }}
                >
                  {f.name}
                </button>
              )
            })}
          </div>

          {/* Info panel for selected family */}
          {expandedFamily && (() => {
            const f = OTHER_FAMILIES.find((x) => x.name === expandedFamily)!
            return (
              <div
                className="mt-3 rounded-xl border p-3 space-y-2"
                style={{ borderColor: f.color + '40', backgroundColor: f.color + '0a' }}
              >
                <div className="flex items-baseline justify-between gap-2">
                  <p className="text-xs font-black uppercase tracking-wider" style={{ color: f.color }}>{f.name}</p>
                  <p className="font-mono text-[10px] text-text-muted">~{f.bpm} BPM</p>
                </div>
                <p className="text-[11px] leading-relaxed text-text-muted">{f.desc}</p>
                <div className="flex flex-wrap gap-1">
                  {f.sub.map((s) => (
                    <span key={s} className="rounded px-1.5 py-0.5 text-[9px] text-text-secondary" style={{ backgroundColor: f.color + '18' }}>{s}</span>
                  ))}
                </div>
              </div>
            )
          })()}
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
