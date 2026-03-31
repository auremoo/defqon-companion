export type Day = 'thursday' | 'friday' | 'saturday' | 'sunday'
export type Stage = 'RED' | 'BLUE' | 'BLACK' | 'UV' | 'MAGENTA' | 'INDIGO' | 'GREEN' | 'YELLOW' | 'GOLD' | 'ORANGE' | 'SILVER' | 'PINK' | 'PURPLE'

export interface Set {
  id: string
  artist: string
  stage: Stage
  day: Day
  startTime: string
  endTime: string
  special?: string
}

export const stageColors: Record<Stage, string> = {
  RED: '#e63946',
  BLUE: '#1d3557',
  BLACK: '#111111',
  UV: '#7c3aed',
  MAGENTA: '#e040a0',
  INDIGO: '#4a00e0',
  GREEN: '#16a34a',
  YELLOW: '#f4a261',
  GOLD: '#d4a20a',
  ORANGE: '#ea580c',
  SILVER: '#a8a8a8',
  PINK: '#ec4899',
  PURPLE: '#7b2d8e',
}

export const days: { key: Day; label: string; date: string }[] = [
  { key: 'thursday', label: 'Thursday', date: 'June 25' },
  { key: 'friday', label: 'Friday', date: 'June 26' },
  { key: 'saturday', label: 'Saturday', date: 'June 27' },
  { key: 'sunday', label: 'Sunday', date: 'June 28' },
]

export const stagesPerDay: Record<Day, Stage[]> = {
  thursday: ['BLUE', 'BLACK', 'INDIGO'],
  friday: ['RED', 'BLUE', 'BLACK', 'UV', 'YELLOW', 'MAGENTA', 'GREEN', 'GOLD', 'ORANGE', 'PURPLE', 'INDIGO'],
  saturday: ['RED', 'BLUE', 'BLACK', 'UV', 'YELLOW', 'MAGENTA', 'INDIGO', 'GOLD', 'SILVER', 'PURPLE'],
  sunday: ['RED', 'BLUE', 'BLACK', 'UV', 'YELLOW', 'MAGENTA', 'GREEN', 'GOLD', 'PURPLE', 'PINK'],
}

// Auto-distribute time slots evenly across a day window
function distribute(artists: { name: string; special?: string }[], stage: Stage, day: Day, startH: number, endH: number): Set[] {
  const count = artists.length
  if (count === 0) return []
  const totalMin = (endH - startH) * 60
  const slotMin = Math.floor(totalMin / count)
  return artists.map((a, i) => {
    const sMin = startH * 60 + i * slotMin
    const eMin = sMin + slotMin
    const sH = String(Math.floor(sMin / 60)).padStart(2, '0')
    const sM = String(sMin % 60).padStart(2, '0')
    const eH = String(Math.floor(eMin / 60)).padStart(2, '0')
    const eM = String(eMin % 60).padStart(2, '0')
    return {
      id: `${day}-${stage}-${i}`,
      artist: a.name,
      stage,
      day,
      startTime: `${sH}:${sM}`,
      endTime: `${eH}:${eM}`,
      special: a.special,
    }
  })
}

function a(name: string, special?: string) { return { name, special } }

export const lineup: Set[] = [
  // ===== THURSDAY — THE GATHERING (18:00–23:00) =====
  ...distribute([
    a('Coone'), a('D-Block & S-te-Fan'), a('D-Sturb', 'Anthem'), a('DJ Isaac'), a('Ran-D & Adaro'),
  ], 'BLUE', 'thursday', 18, 23),

  ...distribute([
    a('Anime'), a('Evil Activities'), a('Gezellige Uptempo'), a('Miss K8'), a('Noxiouz'), a('Hysta', 'Spotlight'),
  ], 'BLACK', 'thursday', 18, 23),

  ...distribute([
    a('Cryex'), a('Deluzion'), a('Faceless / Sanctuary / Dark Entities'), a('Mutilator & Adjuzt'), a('Rejecta'), a('Spitnoise & Unlocked'),
  ], 'INDIGO', 'thursday', 18, 23),

  // ===== FRIDAY (11:00–23:00) =====
  // RED
  ...distribute([
    a('Outsiders', 'Opening Ceremony'), a('Da Tweekaz'), a('Darren Styles'), a('Jay Reeve & Ecstatic ft. MC Synergy'),
    a('RED Race Winner'), a('Rejecta & Adaro'), a('Sickmode'), a('Sound Rush'), a('Sub Zero Project'),
    a('The Purge & Mandy'), a('The Straikerz — All On Red', 'RED Debut'), a('Warface x Restricted'),
    a('Brennan Heart', 'Spotlight Endshow'),
  ], 'RED', 'friday', 12, 23),

  // BLUE Friday — Sefa starts at 11:30, Rebelion Encore at night
  ...distribute([
    a('Sefa — This is Sefa', 'Only Summer Show'), a('Aversion'), a('B-Frontliner'), a('Chain Reaction & Luna — The Classic Journey'),
    a('Devin Wild — Among The Noise'), a('Digital Punk'), a('E-Force & Wolv'), a('Holy Priest'),
    a('Kronos — Choose Your Era'), a('Mutilator'), a('Radical Redemption — The Return to the Tribe', 'Comeback'),
    a('The Saints'), a('Unresolved'), a('Rebelion', 'Encore'),
  ], 'BLUE', 'friday', 11, 23),

  // BLACK Friday
  ...distribute([
    a('Angerfist'), a('Bulletproof'), a('Dr. Peacock'), a('EZG — Maximaal!'), a('Namara'), a('Noiseflow'),
    a('Noiseflow & Cyber Gunz & Schlot — The Great Krach Show', 'Special Show'), a('Partyraiser'),
    a('Restrained'), a('Rosbeek & Manifest Destiny'), a('Slaughterhouse'), a('Tha Playah & Never Surrender'),
  ], 'BLACK', 'friday', 11, 23),

  // UV Friday
  ...distribute([
    a('Sefa — This is Sefa'), a('Anamorphic'), a('Atmozfears'), a('Audiofreq'),
    a('Bass Shock (Bass Modulators & Aftershock)'), a('Kutski & Gammer'), a('Maxtreme'),
    a('More Kords — Zaagphoric'), a('Noisecontrollers — Two Decades'), a('Solstice'),
    a('Toneshifterz'), a('Used — Crossover Set'),
  ], 'UV', 'friday', 11, 23),

  // YELLOW Friday
  ...distribute([
    a('99PRBLMZ'), a('Aradia'), a('Complex'), a('Cryogenic'), a('Doris'), a('Double Trouble'),
    a('Remzcore'), a('Samynator & UDOW'), a('T.M.O.'), a('Tharken'), a('Tharoza — Live or Die'),
    a("The Sickest Squad & D'ort"), a('Vandal'),
  ], 'YELLOW', 'friday', 11, 23),

  // MAGENTA Friday (Saturday lineup from source — the source lists these on Friday)
  ...distribute([
    a('Alpha Twins'), a('Artic'), a('Bass Chaserz — De Reünie', 'Reunion'), a('Crypsis'),
    a('DJ Thera'), a('E-Force'), a('Jason Payne — GOLDSCHOOL'), a('Mind Dimension'),
    a('OUTBREAK'), a('Regain'), a('Sub Sonik — My True DNA'), a('Titan'),
  ], 'MAGENTA', 'friday', 11, 23),

  // GREEN Friday
  ...distribute([
    a('Activator (a.k.a T78) & A*S*Y*S'), a('Anime & Jazzy'), a('AREA ØNE'), a('BLNK'),
    a('Charlie Sparks'), a('IMHAPPY'), a('JO3Y3T'), a('Manji'), a('Onlynumbers'), a('Stanne'),
    a('Vieze Asbak'), a('XRTN'),
  ], 'GREEN', 'friday', 11, 23),

  // GOLD Friday
  ...distribute([
    a('Amnesys & Nico & Tetta'), a('Destructive Tendencies'), a('DJ Rob & MC Joe'), a('Dune'),
    a('Marc Acardipane'), a('Miss Monica'), a('Noize Suppressor'), a('Party Animals vs Flamman & Abraxas'),
    a('The Viper'), a('Vince & DJ Ruffian'),
  ], 'GOLD', 'friday', 11, 23),

  // ORANGE Friday
  ...distribute([
    a('Argy'), a('David Forbes'), a('DJ Thera — Tranceparency'), a('Geck-o — The Soul Shaker'),
    a('Marcel Woods'), a('Olive Anguz'), a('Panteros666'), a('Steve Hill & Francesco Zeta'),
    a('UBERJAKD'), a('Will Atkinson'),
  ], 'ORANGE', 'friday', 11, 23),

  // PURPLE Friday
  ...distribute([
    a('ARK8'), a('Distress'), a('Harder Class', 'Hardcore Contest'), a('HETZKINEN'), a('Modesto'),
    a('Nexor'), a('Nocturnal'), a('Rayzen'), a('Resilience & Refold'), a('Simox'),
  ], 'PURPLE', 'friday', 11, 23),

  // INDIGO Friday (from Saturday in source — Indigo plays Fri+Sat per stagesPerDay)
  // Source confirms INDIGO on Saturday, but original stagesPerDay had it on Friday.
  // Keeping source data: INDIGO on Saturday.

  // ===== SATURDAY (11:00–23:00) =====
  // RED Saturday
  ...distribute([
    a('Creeds & Geck-o', 'Warming-up'), a('Warrior Workout', 'Special'), a('Bioweapon'), a('D-Sturb'),
    a('Dual Damage & Mish'), a('Frontliner & Max Enforcer'), a('Galactixx'),
    a('Mark With a K & MC Chucky B2B Deepack'), a('POWER HOUR', 'Special'),
    a('Serzo & D-Charged'), a('Showtek'), a('Vertile'), a('Zatox & Mad Dog'),
    a('The Endshow', 'Endshow'),
  ], 'RED', 'saturday', 11, 23),

  // BLUE Saturday
  ...distribute([
    a('Act of Rage'), a('Anderex'), a('Coldax & Damaxy'), a('Element & Vasto & The Smiler'),
    a('ERABREAK & Level One'), a('Hard Driver'), a('Infliction & BMBERJCK'),
    a('Regain & Nightcraft — Forsaken Two'), a('Revelation LIVE'), a('Riot Shift'),
    a('The Purge & GRAVEDGR'), a('TOZA'), a('Vexxed'), a('Phuture Noize', 'Encore'),
  ], 'BLUE', 'saturday', 11, 23),

  // BLACK Saturday
  ...distribute([
    a('Barber & Unproven'), a('Billx'),
    a('Hardcore Italia (Mad Dog & Art of Fighters & Noize Suppressor & Tommyknocker)', 'Special'),
    a('Karun & Gridkiller'), a('Lekkerfaces & Pinotello'), a('Lunakorpz'), a('Neophyte'),
    a('Sakyra'), a('Satirized'), a('The Dope Doctor'), a('Yoshiko & Juliëx'),
  ], 'BLACK', 'saturday', 11, 23),

  // UV Saturday
  ...distribute([
    a('Adrenalize'), a('AVI8'), a('Ben Nicky — Xtreme'), a('DEEZL — AEON'),
    a('Digital Madness'), a('DÂVINØ'), a('KELTEK & Demi Kanon'), a('Primeshock'),
    a('Synthsoldier'), a('Wasted Penguinz'), a('Wildstylez'),
  ], 'UV', 'saturday', 11, 23),

  // YELLOW Saturday
  ...distribute([
    a('Aalst'), a('Akimbo'), a('D-Frek & Maissouille'), a('Ditzkickz'), a('Dr.Z'),
    a('DRS & The Herbalist'), a('Equal2'), a('Invaderz'), a('Jur Terreur — Rave Nation LIVE'),
    a('Levenkhan'), a('Missy & Dimma'), a('Revellers'), a('Screecher & Deviation'),
    a('Spitnoise — Bounce of Steel'), a('Tukkertempo — Kick Therapy LIVE'),
  ], 'YELLOW', 'saturday', 11, 23),

  // MAGENTA Saturday
  ...distribute([
    a('A-lusion'), a('Activator'), a('Clive King'), a('Davide Sonar'), a('DJ Stephanie'),
    a('JDX'), a('Qlubtempo Parade (Luna, Pavo, DJ Pila)', 'Special'), a('Tatanka'),
    a('The Beholder & Balistic'), a('Yoji Biomehanika & Scot Project'), a('Zany'),
  ], 'MAGENTA', 'saturday', 11, 23),

  // INDIGO Saturday
  ...distribute([
    a('Chapter V'), a('Dark Entities'), a('Detailed'), a('EZG'), a('ONYX'), a('Sanctuary'),
    a('Sparkz'), a('Spectre'), a('Spitfire'), a('Spoontechnicians'), a('Unique'), a('Unload'),
  ], 'INDIGO', 'saturday', 11, 23),

  // GOLD Saturday
  ...distribute([
    a('Buzz Fuzz & Gizmo'), a('DJ J.D.A.'), a('Franky Jones'), a('G-Town Madness'), a('Nosferatu'),
    a('Ruffneck & Ophidian'), a('T-GO & TO-B'), a('The Masochist'), a('Unexist'),
    a('Vandal!sm & Rob Gee'),
  ], 'GOLD', 'saturday', 11, 23),

  // SILVER Saturday
  ...distribute([
    a('Chaos Project & Furyan'), a('Dither'), a('Dolphin & The DJ Producer'), a('Enzyme X'),
    a('Folie à Deux'), a('Krista Bourgeois LIVE'), a('N-Vitral — Industrial Rave'),
    a('Noisekick'), a('Sandy Warez vs Todiefor'), a('Stormtrooper'), a('The Outside Agency'),
  ], 'SILVER', 'saturday', 11, 23),

  // PURPLE Saturday
  ...distribute([
    a('D-Venn'), a('Earsquaker'), a('Flout Mania'), a('Harder Class', 'Hardstyle Contest'),
    a('Incult'), a('Inner Circle Showcase', 'Showcase'),
    a('Spoontech Emergence (NSIDE & STORAH)', 'Showcase'), a('Strike Blood'), a('Twintigerz'),
  ], 'PURPLE', 'saturday', 11, 23),

  // ===== SUNDAY (11:00–23:00) =====
  // RED Sunday
  ...distribute([
    a('GPF — ERROR_404: NORMAL MUSIC NOT FOUND', 'RED Debut'),
    a('The Defqon.1 Legends', 'Special'),
    a('Gunz For Hire — XV The Underground Kings', '15 Year Legacy'),
    a('4 OF A KIND'),
    a('The Closing Ritual', 'Closing'),
  ], 'RED', 'sunday', 11, 23),

  // BLUE Sunday
  ...distribute([
    a('Adjuzt'), a('B-Front'), a('Chapter V & Dikke Baap'), a('Krowdexx'), a('Kruelty'),
    a('Rooler'), a('So Juice & Fraw & Exproz'), a('Vertile — Everything Changes LIVE', 'LIVE'),
    a('Warface'), a('Zelecter'),
  ], 'BLUE', 'sunday', 11, 23),

  // BLACK Sunday
  ...distribute([
    a('Charly Lownoise & Mental Theo'), a('Dimitri K & Deadly Guns'), a('Endymion'), a('Korsakoff'),
    a('Lil Texas & Dr Donk'), a('Major Conspiracy — Uptemparty LIVE'), a('Nosferatu & D-Fence'),
    a('Promo'), a('The Viper & Mad-E-Fact'),
  ], 'BLACK', 'sunday', 11, 23),

  // UV Sunday
  ...distribute([
    a('GLDY LX & Da Syndrome'), a('LARSTIG & GASDROP & Bass Chaserz & De Kraaien'),
    a('LePrince — Big Sing Along'), a('LNY TNZ x Jebroer'), a('Lost Identity & Teknoclash'),
    a('Pat B vs Dark-E'), a('Paul Elstak'), a('Ruthless / Dr. Rude & Hans Glock'),
    a('The Darkraver & The Most Obvious Mystery Guest'), a('Unicorn on K'),
    a('Unicorn on K & Opgekonkerd — Rainbow Colors'),
  ], 'UV', 'sunday', 11, 23),

  // YELLOW Sunday
  ...distribute([
    a('Abaddon — Pure Domination'), a('Amigo — Uptempo Fiesta'), a('Chaotic Hostility'),
    a('Eraized'), a('Guizcore'), a('Kili'), a('Revealer'), a('Roosterz'), a('S-Kill'),
    a('Soulblast'), a('Unlocked'),
  ], 'YELLOW', 'sunday', 11, 23),

  // MAGENTA Sunday
  ...distribute([
    a('Audiotricz LIVE'), a('Bass Modulators'), a('Cyber'), a('Josh & Wesz'),
    a('Low-E & Alter Egosz & Alphaverb'), a('Omegatypez'), a('Psyko Punkz'),
    a('The Pitcher & Slim Shore — This is who we are!'), a('Wildstylez — Back 2 Basics'),
  ], 'MAGENTA', 'sunday', 11, 23),

  // GREEN Sunday
  ...distribute([
    a('Catalyst'), a('Cynthia Spiering'), a('elMefti'), a('Junkie Kid'), a('Niotech'),
    a('Restricted'), a('Samuel Moriero'), a("Vortek's"), a('Zapravka'),
  ], 'GREEN', 'sunday', 11, 23),

  // GOLD Sunday
  ...distribute([
    a('Art of Fighters'), a('Catscan'), a('Critical Mass'), a('Ode to Bass-D'),
    a('Panic & Exertion'), a('Potato & DJ Francois'), a('Reeza & Juno B — House of Madness'),
    a('Steve-D'), a('Sunny D'), a('Tha Playah'),
  ], 'GOLD', 'sunday', 11, 23),

  // PURPLE Sunday
  ...distribute([
    a('Aranxa'), a('Insuspect & MC Primax'), a('Josha'), a('KidEast'), a('Miss Isa'),
    a('MT'), a('Resensed'), a('Stugats'), a('Svenergy'),
  ], 'PURPLE', 'sunday', 11, 23),

  // PINK Sunday
  ...distribute([
    a('Fight Switch'), a('Murdock'), a('NCT'), a('Rataplan'), a('Redpill'),
    a('Sins of Pandora'), a('T & Sugah'), a('Tantron'), a('Wes S & $avvy'),
  ], 'PINK', 'sunday', 11, 23),
]
