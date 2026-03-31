export type Day = 'thursday' | 'friday' | 'saturday' | 'sunday'
export type Stage = 'RED' | 'BLUE' | 'BLACK' | 'UV' | 'MAGENTA' | 'INDIGO' | 'GREEN' | 'YELLOW' | 'GOLD' | 'ORANGE' | 'SILVER' | 'PINK' | 'PURPLE'

export interface Set {
  id: string
  artist: string
  stage: Stage
  day: Day
  startTime: string  // HH:MM
  endTime: string    // HH:MM
  special?: string   // e.g. "Anthem", "Spotlight", "Encore"
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
  friday: ['RED', 'BLUE', 'BLACK', 'UV', 'MAGENTA', 'INDIGO', 'GREEN', 'YELLOW', 'GOLD', 'PURPLE'],
  saturday: ['RED', 'BLUE', 'BLACK', 'UV', 'MAGENTA', 'ORANGE', 'SILVER'],
  sunday: ['RED', 'BLUE', 'BLACK', 'UV', 'MAGENTA', 'GREEN', 'YELLOW', 'GOLD', 'PINK', 'PURPLE'],
}

// Helper to generate set IDs
let _id = 0
function s(artist: string, stage: Stage, day: Day, startTime: string, endTime: string, special?: string): Set {
  return { id: `set-${++_id}`, artist, stage, day, startTime, endTime, special }
}

export const lineup: Set[] = [
  // ===== THURSDAY — THE GATHERING (18:00–23:00) =====
  // BLUE
  s('D-Sturb', 'BLUE', 'thursday', '18:00', '19:00', 'Anthem Opening'),
  s('Coone', 'BLUE', 'thursday', '19:00', '20:00'),
  s('D-Block & S-te-Fan', 'BLUE', 'thursday', '20:00', '21:00'),
  s('DJ Isaac', 'BLUE', 'thursday', '21:00', '22:00'),
  s('Ran-D & Adaro', 'BLUE', 'thursday', '22:00', '23:00'),
  // BLACK
  s('Hysta', 'BLACK', 'thursday', '18:00', '19:30', 'Spotlight'),
  // INDIGO
  // (artists TBA for Thursday Indigo)

  // ===== FRIDAY (11:00–23:00) =====
  // RED — Opening Ceremony block
  s('Outsiders', 'RED', 'friday', '12:00', '13:00', 'Opening Ceremony'),
  s('Da Tweekaz', 'RED', 'friday', '13:00', '13:45'),
  s('Darren Styles', 'RED', 'friday', '13:45', '14:30'),
  s('Jay Reeve & Ecstatic ft. Synergy', 'RED', 'friday', '14:30', '15:15'),
  s('Rejecta & Adaro', 'RED', 'friday', '15:15', '16:00'),
  s('Sickmode', 'RED', 'friday', '16:00', '16:45'),
  s('Sound Rush', 'RED', 'friday', '16:45', '17:30'),
  s('Sub Zero Project', 'RED', 'friday', '17:30', '18:15'),
  s('The Purge & Mandy', 'RED', 'friday', '18:15', '19:00'),
  s('The Straikerz — All On Red', 'RED', 'friday', '19:00', '19:45'),
  s('Warface x Restricted', 'RED', 'friday', '19:45', '20:30'),
  s('Showtek', 'RED', 'friday', '20:30', '21:15'),
  s('Brennan Heart', 'RED', 'friday', '21:15', '23:00', 'Spotlight Endshow'),

  // BLUE Friday
  s('Radical Redemption — The Return to the Tribe', 'BLUE', 'friday', '11:00', '12:00', 'Comeback'),
  s('Act of Rage', 'BLUE', 'friday', '12:00', '12:45'),
  s('Anderex', 'BLUE', 'friday', '12:45', '13:30'),
  s('Coldax & Damaxy', 'BLUE', 'friday', '13:30', '14:15'),
  s('Element & Vesto & The Smiler', 'BLUE', 'friday', '14:15', '15:00'),
  s('ERABREAK & Level One', 'BLUE', 'friday', '15:00', '15:45'),
  s('Hard Driver', 'BLUE', 'friday', '15:45', '16:30'),
  s('Infliction & BMBERJCK', 'BLUE', 'friday', '16:30', '17:15'),
  s('Livid', 'BLUE', 'friday', '17:15', '18:00'),
  s('Riot Shift', 'BLUE', 'friday', '18:00', '18:45'),
  s('The Purge & GRAVEDGR', 'BLUE', 'friday', '18:45', '19:30'),
  s('TOZA', 'BLUE', 'friday', '19:30', '20:15'),
  s('Vexxed', 'BLUE', 'friday', '20:15', '21:00'),
  s('Rebelion', 'BLUE', 'friday', '21:00', '23:00', 'Encore'),

  // BLACK Friday
  s('Barber & Unproven', 'BLACK', 'friday', '11:00', '12:00'),
  s('Billx', 'BLACK', 'friday', '12:00', '13:00'),
  s('Da Mouth of Madness & Tha Watcher', 'BLACK', 'friday', '13:00', '14:00'),
  s('The Great Krach Show', 'BLACK', 'friday', '14:00', '15:30', 'Special Show'),
  s('Karun & Gridkiller', 'BLACK', 'friday', '15:30', '16:30'),
  s('Lekkerfaces & Pinotello', 'BLACK', 'friday', '16:30', '17:30'),
  s('Lunakorpz', 'BLACK', 'friday', '17:30', '18:30'),
  s('Neophyte', 'BLACK', 'friday', '18:30', '19:30'),
  s('Sakyra', 'BLACK', 'friday', '19:30', '20:15'),
  s('Satirized', 'BLACK', 'friday', '20:15', '21:00'),
  s('The Dope Doctor', 'BLACK', 'friday', '21:00', '22:00'),
  s('Yoshiko & Juliex', 'BLACK', 'friday', '22:00', '23:00'),

  // UV Friday
  s('Sefa — This is Sefa', 'UV', 'friday', '11:30', '13:00', 'Only Summer Show'),
  s('Creeds & Geck-o', 'UV', 'friday', '13:00', '14:00'),
  s('Adrenalize', 'UV', 'friday', '14:00', '14:45'),
  s('AVI8', 'UV', 'friday', '14:45', '15:30'),
  s('Ben Nicky', 'UV', 'friday', '15:30', '16:15'),
  s('DAVINO', 'UV', 'friday', '16:15', '17:00'),
  s('DEEZL', 'UV', 'friday', '17:00', '17:45'),
  s('DL & Synergy', 'UV', 'friday', '17:45', '18:30'),
  s('KELTEK & Demi Kanon', 'UV', 'friday', '18:30', '19:15'),
  s('Primeshock', 'UV', 'friday', '19:15', '20:00'),
  s('Synthsoldier', 'UV', 'friday', '20:00', '20:45'),
  s('Wasted Penguinz', 'UV', 'friday', '20:45', '21:30'),
  s('Wildstylez', 'UV', 'friday', '21:30', '23:00'),

  // MAGENTA Friday
  s('A-lusion', 'MAGENTA', 'friday', '11:00', '12:00'),
  s('Activator', 'MAGENTA', 'friday', '12:00', '13:00'),
  s('Clive King', 'MAGENTA', 'friday', '13:00', '14:00'),
  s('Davide Sonar', 'MAGENTA', 'friday', '14:00', '15:00'),
  s('DJ Stephanie', 'MAGENTA', 'friday', '15:00', '16:00'),
  s('JDX', 'MAGENTA', 'friday', '16:00', '17:00'),
  s('Qlubtempo Parade', 'MAGENTA', 'friday', '17:00', '18:30', 'Special'),
  s('Ruffian', 'MAGENTA', 'friday', '18:30', '19:30'),
  s('Tatanka', 'MAGENTA', 'friday', '19:30', '20:30'),
  s('The Beholder & Balistic', 'MAGENTA', 'friday', '20:30', '21:30'),
  s('Yoji Biomehanika & Scot Project', 'MAGENTA', 'friday', '21:30', '22:15'),
  s('Zany', 'MAGENTA', 'friday', '22:15', '23:00'),

  // INDIGO Friday
  s('Chapter V', 'INDIGO', 'friday', '11:00', '12:00'),
  s('Dark Entities', 'INDIGO', 'friday', '12:00', '13:00'),
  s('Detailed', 'INDIGO', 'friday', '13:00', '14:00'),
  s('EZG', 'INDIGO', 'friday', '14:00', '15:00'),
  s('Flo', 'INDIGO', 'friday', '15:00', '16:00'),
  s('Onyx', 'INDIGO', 'friday', '16:00', '17:00'),
  s('Sanctuary', 'INDIGO', 'friday', '17:00', '18:00'),
  s('Sparkz', 'INDIGO', 'friday', '18:00', '19:00'),
  s('Spectre', 'INDIGO', 'friday', '19:00', '20:00'),
  s('Spitfire', 'INDIGO', 'friday', '20:00', '21:00'),
  s('Spoontechnicians', 'INDIGO', 'friday', '21:00', '22:00'),
  s('Unique', 'INDIGO', 'friday', '22:00', '22:30'),
  s('Unload', 'INDIGO', 'friday', '22:30', '23:00'),

  // GREEN Friday
  s('Activator', 'GREEN', 'friday', '11:00', '12:00'),
  s('Anime & Jazzy', 'GREEN', 'friday', '12:00', '13:00'),
  s('AREA ONE', 'GREEN', 'friday', '13:00', '14:00'),
  s('BLNK', 'GREEN', 'friday', '14:00', '15:00'),
  s('Charlie Sparks', 'GREEN', 'friday', '15:00', '16:00'),
  s('IMHAPPY', 'GREEN', 'friday', '16:00', '17:00'),
  s('JO3Y3T', 'GREEN', 'friday', '17:00', '18:00'),
  s('Manji (Bloodlust)', 'GREEN', 'friday', '18:00', '19:00'),
  s('Onlynumbers', 'GREEN', 'friday', '19:00', '20:00'),
  s('Stanne', 'GREEN', 'friday', '20:00', '21:00'),
  s('Vieze Asbak', 'GREEN', 'friday', '21:00', '22:00'),
  s('XRTN', 'GREEN', 'friday', '22:00', '23:00'),

  // YELLOW Friday
  s('99PRBLMZ', 'YELLOW', 'friday', '11:00', '12:00'),
  s('Aradia', 'YELLOW', 'friday', '12:00', '13:00'),
  s('Complex', 'YELLOW', 'friday', '13:00', '14:00'),
  s('Cryogenic', 'YELLOW', 'friday', '14:00', '15:00'),
  s('Doris', 'YELLOW', 'friday', '15:00', '15:45'),
  s('Double Trouble', 'YELLOW', 'friday', '15:45', '16:30'),
  s('Remzcore', 'YELLOW', 'friday', '16:30', '17:15'),
  s('Robs & Flo', 'YELLOW', 'friday', '17:15', '18:00'),
  s('Samynator & UDOW', 'YELLOW', 'friday', '18:00', '18:45'),
  s('T.M.O.', 'YELLOW', 'friday', '18:45', '19:30'),
  s('Tharken', 'YELLOW', 'friday', '19:30', '20:15'),
  s('Tharoza', 'YELLOW', 'friday', '20:15', '21:00'),
  s('The Sickest Squad & D\'ort', 'YELLOW', 'friday', '21:00', '22:00'),
  s('Vandal', 'YELLOW', 'friday', '22:00', '23:00'),

  // GOLD Friday
  s('Alee & Da Syndrome', 'GOLD', 'friday', '11:00', '12:00'),
  s('Buzz Fuzz & Gizmo', 'GOLD', 'friday', '12:00', '13:00'),
  s('DJ J.D.A.', 'GOLD', 'friday', '13:00', '14:00'),
  s('Franky Jones', 'GOLD', 'friday', '14:00', '15:00'),
  s('G-Town Madness', 'GOLD', 'friday', '15:00', '16:00'),
  s('Nosferatu', 'GOLD', 'friday', '16:00', '17:00'),
  s('Ruffneck & Ophidian', 'GOLD', 'friday', '17:00', '18:00'),
  s('T-GO & TO-B', 'GOLD', 'friday', '18:00', '19:00'),
  s('The Masochist', 'GOLD', 'friday', '19:00', '20:00'),
  s('Unexist', 'GOLD', 'friday', '20:00', '21:00'),
  s('Vandal!sm & Rob Gee', 'GOLD', 'friday', '21:00', '23:00'),

  // PURPLE Friday
  s('Activate', 'PURPLE', 'friday', '11:00', '12:00'),
  s('D-Venn', 'PURPLE', 'friday', '12:00', '13:00'),
  s('Earsquaker', 'PURPLE', 'friday', '13:00', '14:00'),
  s('Flout Mania', 'PURPLE', 'friday', '14:00', '15:00'),
  s('Harder Class Contest', 'PURPLE', 'friday', '15:00', '16:30', 'Contest'),
  s('Incult', 'PURPLE', 'friday', '16:30', '17:30'),
  s('Innercircle Showcase', 'PURPLE', 'friday', '17:30', '19:00', 'Showcase'),
  s('Spoontech Emergence', 'PURPLE', 'friday', '19:00', '20:30', 'Showcase'),
  s('Strikeblood', 'PURPLE', 'friday', '20:30', '21:45'),
  s('Twintigerz', 'PURPLE', 'friday', '21:45', '23:00'),

  // ===== SATURDAY (11:00–23:00) =====
  // RED Saturday
  s('Creeds & Geck-o', 'RED', 'saturday', '11:00', '12:00', 'Warming-up'),
  s('Warrior Workout', 'RED', 'saturday', '12:00', '13:00', 'Special'),
  s('Bioweapon', 'RED', 'saturday', '13:00', '13:45'),
  s('D-Sturb', 'RED', 'saturday', '13:45', '14:30'),
  s('Dual Damage & Mish', 'RED', 'saturday', '14:30', '15:15'),
  s('Frontliner & Max Enforcer', 'RED', 'saturday', '15:15', '16:00'),
  s('Galactixx', 'RED', 'saturday', '16:00', '16:45'),
  s('Mark With a K & MC Chucky B2B Deepack', 'RED', 'saturday', '16:45', '17:30'),
  s('POWER HOUR', 'RED', 'saturday', '17:30', '18:30', 'Special'),
  s('Serzo & D-Charged', 'RED', 'saturday', '18:30', '19:15'),
  s('Vertile', 'RED', 'saturday', '19:15', '20:00'),
  s('Villain', 'RED', 'saturday', '20:00', '20:45'),
  s('Zatox & Mad Dog', 'RED', 'saturday', '20:45', '21:30'),
  s('The Endshow', 'RED', 'saturday', '21:30', '23:00', 'Endshow'),

  // BLUE Saturday
  s('Phuture Noize', 'BLUE', 'saturday', '11:00', '13:00', 'Encore'),
  s('Aversion', 'BLUE', 'saturday', '13:00', '13:45'),
  s('B-Frontliner', 'BLUE', 'saturday', '13:45', '14:30'),
  s('Chain Reaction & Luna', 'BLUE', 'saturday', '14:30', '15:15'),
  s('Devin Wild', 'BLUE', 'saturday', '15:15', '16:00'),
  s('Digital Punk', 'BLUE', 'saturday', '16:00', '16:45'),
  s('E-Force & Wolv', 'BLUE', 'saturday', '16:45', '17:30'),
  s('End of Line', 'BLUE', 'saturday', '17:30', '18:15'),
  s('Holy Priest', 'BLUE', 'saturday', '18:15', '19:00'),
  s('Kronos', 'BLUE', 'saturday', '19:00', '19:45'),
  s('Mutilator', 'BLUE', 'saturday', '19:45', '20:30'),
  s('Radical Redemption', 'BLUE', 'saturday', '20:30', '21:15'),
  s('The Saints', 'BLUE', 'saturday', '21:15', '22:00'),
  s('Unresolved', 'BLUE', 'saturday', '22:00', '23:00'),

  // BLACK Saturday
  s('Angerfist', 'BLACK', 'saturday', '11:00', '12:15'),
  s('Bulletproof', 'BLACK', 'saturday', '12:15', '13:15'),
  s('Dr. Peacock', 'BLACK', 'saturday', '13:15', '14:15'),
  s('EZG', 'BLACK', 'saturday', '14:15', '15:15'),
  s('Namara', 'BLACK', 'saturday', '15:15', '16:15'),
  s('Noiseflow', 'BLACK', 'saturday', '16:15', '17:00'),
  s('Noiseflow & Cyber Gunz & Schlot', 'BLACK', 'saturday', '17:00', '18:00'),
  s('Nolz & Robs', 'BLACK', 'saturday', '18:00', '19:00'),
  s('Partyraiser', 'BLACK', 'saturday', '19:00', '20:00'),
  s('Restrained', 'BLACK', 'saturday', '20:00', '21:00'),
  s('Rosbeek & Manifest Destiny', 'BLACK', 'saturday', '21:00', '22:00'),
  s('Slaughterhouse', 'BLACK', 'saturday', '22:00', '22:30'),
  s('Tha Playah & Never Surrender', 'BLACK', 'saturday', '22:30', '23:00'),

  // UV Saturday
  s('Atmozfears', 'UV', 'saturday', '11:00', '12:00'),
  s('Audiofreq', 'UV', 'saturday', '12:00', '13:00'),
  s('Noisecontrollers', 'UV', 'saturday', '13:00', '14:00'),
  s('Kutski & Gammer', 'UV', 'saturday', '14:00', '15:00'),
  s('Toneshifterz', 'UV', 'saturday', '15:00', '16:00'),
  s('Digital Madness', 'UV', 'saturday', '16:00', '17:00'),

  // MAGENTA Saturday
  s('Alpha Twins', 'MAGENTA', 'saturday', '11:00', '12:00'),
  s('Artic', 'MAGENTA', 'saturday', '12:00', '13:00'),
  s('Bass Chaserz', 'MAGENTA', 'saturday', '13:00', '14:00', 'Reunion'),
  s('Crypsis', 'MAGENTA', 'saturday', '14:00', '15:00'),
  s('Da Syndrome', 'MAGENTA', 'saturday', '15:00', '16:00'),
  s('DJ Thera', 'MAGENTA', 'saturday', '16:00', '17:00'),
  s('E-Force', 'MAGENTA', 'saturday', '17:00', '18:00'),
  s('Jason Payne', 'MAGENTA', 'saturday', '18:00', '19:00'),
  s('Mind Dimension', 'MAGENTA', 'saturday', '19:00', '20:00'),
  s('OUTBREAK', 'MAGENTA', 'saturday', '20:00', '21:00'),
  s('Regain', 'MAGENTA', 'saturday', '21:00', '22:00'),
  s('Sub Sonik', 'MAGENTA', 'saturday', '22:00', '22:30'),
  s('Titan', 'MAGENTA', 'saturday', '22:30', '23:00'),

  // ORANGE Saturday
  s('Amnesys & Nico & Tetta', 'ORANGE', 'saturday', '11:00', '12:00'),
  s('Destructive Tendencies', 'ORANGE', 'saturday', '12:00', '13:00'),
  s('DJ Rob & MC Joe', 'ORANGE', 'saturday', '13:00', '14:00'),
  s('Dune', 'ORANGE', 'saturday', '14:00', '15:00'),
  s('Marc Acardipane', 'ORANGE', 'saturday', '15:00', '16:00'),
  s('Miss Monica', 'ORANGE', 'saturday', '16:00', '17:00'),
  s('Noize Suppressor', 'ORANGE', 'saturday', '17:00', '18:00'),
  s('Party Animals vs Flamlan & Abraxas', 'ORANGE', 'saturday', '18:00', '19:00'),
  s('Ruffian', 'ORANGE', 'saturday', '19:00', '20:00'),
  s('The Viper', 'ORANGE', 'saturday', '20:00', '21:00'),
  s('Vince & DJ Ruffian', 'ORANGE', 'saturday', '21:00', '23:00'),

  // SILVER Saturday
  s('Argy', 'SILVER', 'saturday', '11:00', '12:15'),
  s('David Forbes', 'SILVER', 'saturday', '12:15', '13:30'),
  s('DJ Thera', 'SILVER', 'saturday', '13:30', '14:45'),
  s('Geck-o', 'SILVER', 'saturday', '14:45', '16:00'),
  s('Marcel Woods', 'SILVER', 'saturday', '16:00', '17:15'),
  s('Olive Anguz', 'SILVER', 'saturday', '17:15', '18:30'),
  s('Panteros666', 'SILVER', 'saturday', '18:30', '19:45'),
  s('Steve Hill & Francesco Zeta', 'SILVER', 'saturday', '19:45', '21:00'),
  s('UBERJAKD', 'SILVER', 'saturday', '21:00', '22:00'),
  s('Will Atkinson', 'SILVER', 'saturday', '22:00', '23:00'),

  // ===== SUNDAY (11:00–23:00) =====
  // RED Sunday
  s('GPF — ERROR_404', 'RED', 'sunday', '11:00', '12:30', 'RED Debut'),
  s('Villain', 'RED', 'sunday', '17:00', '18:00'),
  s('The Defqon.1 Legends', 'RED', 'sunday', '18:00', '21:00', 'Special'),
  s('Gunz For Hire — XV The Underground Kings', 'RED', 'sunday', '21:00', '22:00', '15 Year Legacy'),
  s('4 OF A KIND', 'RED', 'sunday', '22:00', '22:45'),
  s('The Closing Ritual', 'RED', 'sunday', '22:45', '23:00', 'Closing'),

  // BLUE Sunday
  s('Adjuzt', 'BLUE', 'sunday', '11:00', '11:45'),
  s('B-Front', 'BLUE', 'sunday', '11:45', '12:30'),
  s('Chapter V & Dikke Baap', 'BLUE', 'sunday', '12:30', '13:15'),
  s('Krowdexx', 'BLUE', 'sunday', '13:15', '14:00'),
  s('Kruelty', 'BLUE', 'sunday', '14:00', '14:45'),
  s('Livid & Nolz', 'BLUE', 'sunday', '14:45', '15:30'),
  s('Rooler', 'BLUE', 'sunday', '15:30', '16:15'),
  s('So Juice & Fraw & Exproz', 'BLUE', 'sunday', '16:15', '17:00'),
  s('Vertile — Everything Changes LIVE', 'BLUE', 'sunday', '17:00', '18:00', 'LIVE'),
  s('Warface', 'BLUE', 'sunday', '18:00', '19:00'),
  s('Zelecter', 'BLUE', 'sunday', '19:00', '20:00'),

  // BLACK Sunday
  s('Alee', 'BLACK', 'sunday', '11:00', '12:00'),
  s('Charly Lownoise & Mental Theo', 'BLACK', 'sunday', '12:00', '13:00'),
  s('Dimitri K & Deadly Guns', 'BLACK', 'sunday', '13:00', '14:00'),
  s('Endymion', 'BLACK', 'sunday', '14:00', '15:00'),
  s('Korsakoff', 'BLACK', 'sunday', '15:00', '16:00'),
  s('Lil Texas & Dr Donk', 'BLACK', 'sunday', '16:00', '17:00'),
  s('Major Conspiracy', 'BLACK', 'sunday', '17:00', '18:00'),
  s('Nosferatu & D-Fence', 'BLACK', 'sunday', '18:00', '19:00'),
  s('Promo', 'BLACK', 'sunday', '19:00', '20:00'),
  s('The Viper & Mad-E-Fact', 'BLACK', 'sunday', '20:00', '23:00'),

  // UV Sunday
  s('Da Syndrome & Boogshe', 'UV', 'sunday', '11:00', '12:00'),
  s('GLDY LX & Da Syndrome', 'UV', 'sunday', '12:00', '13:00'),
  s('LARSTIG & GASDROP', 'UV', 'sunday', '13:00', '14:00'),
  s('Leprince', 'UV', 'sunday', '14:00', '15:00'),
  s('LNY TNZ x Jebroer', 'UV', 'sunday', '15:00', '16:00'),
  s('Lost Identity', 'UV', 'sunday', '16:00', '17:00'),
  s('Pat B vs Dark-E', 'UV', 'sunday', '17:00', '18:00'),
  s('Paul Elstak', 'UV', 'sunday', '18:00', '19:00'),
  s('Ruthless / Dr. Rude / Hans Glock', 'UV', 'sunday', '19:00', '20:00'),
  s('The Darkraver', 'UV', 'sunday', '20:00', '21:00'),

  // MAGENTA Sunday
  s('Audiotricz LIVE', 'MAGENTA', 'sunday', '11:00', '12:00'),
  s('Bass Modulators', 'MAGENTA', 'sunday', '12:00', '13:00'),
  s('Cyber', 'MAGENTA', 'sunday', '13:00', '14:00'),
  s('DV8', 'MAGENTA', 'sunday', '14:00', '15:00'),
  s('Josh & Wesz', 'MAGENTA', 'sunday', '15:00', '16:00'),
  s('Low-E & Alter Egosz', 'MAGENTA', 'sunday', '16:00', '17:00'),
  s('Omegatypez', 'MAGENTA', 'sunday', '17:00', '18:00'),
  s('Psyko Punkz', 'MAGENTA', 'sunday', '18:00', '19:00'),
  s('The Pitcher & Slim Shore', 'MAGENTA', 'sunday', '19:00', '20:00'),
  s('Wildstylez', 'MAGENTA', 'sunday', '20:00', '23:00'),

  // GREEN Sunday
  s('Catalyst (Warface)', 'GREEN', 'sunday', '11:00', '12:00'),
  s('Cynthia Spiering', 'GREEN', 'sunday', '12:00', '13:00'),
  s('elMefti', 'GREEN', 'sunday', '13:00', '14:00'),
  s('Junkie Kid', 'GREEN', 'sunday', '14:00', '15:00'),
  s('Niotech', 'GREEN', 'sunday', '15:00', '16:00'),
  s('Restricted', 'GREEN', 'sunday', '16:00', '17:00'),
  s('Samuel Moriero', 'GREEN', 'sunday', '17:00', '18:00'),
  s('Vortek\'s', 'GREEN', 'sunday', '18:00', '19:00'),
  s('Zapravka', 'GREEN', 'sunday', '19:00', '23:00'),

  // YELLOW Sunday
  s('Abaddon', 'YELLOW', 'sunday', '11:00', '12:00'),
  s('Amigo', 'YELLOW', 'sunday', '12:00', '13:00'),
  s('Chaotic Hostility', 'YELLOW', 'sunday', '13:00', '14:00'),
  s('Eraized', 'YELLOW', 'sunday', '14:00', '15:00'),
  s('Guizcore', 'YELLOW', 'sunday', '15:00', '16:00'),
  s('Kili', 'YELLOW', 'sunday', '16:00', '17:00'),
  s('Revealer', 'YELLOW', 'sunday', '17:00', '18:00'),
  s('RG', 'YELLOW', 'sunday', '18:00', '19:00'),
  s('Roosterz', 'YELLOW', 'sunday', '19:00', '20:00'),
  s('S-Kill', 'YELLOW', 'sunday', '20:00', '21:00'),
  s('Soulblast', 'YELLOW', 'sunday', '21:00', '22:00'),
  s('Spitnoise — Bounce of Steel', 'YELLOW', 'sunday', '22:00', '23:00'),

  // GOLD Sunday
  s('Art of Fighters', 'GOLD', 'sunday', '11:00', '12:00'),
  s('Catscan', 'GOLD', 'sunday', '12:00', '13:00'),
  s('Critical Mass', 'GOLD', 'sunday', '13:00', '14:00'),
  s('Crystal', 'GOLD', 'sunday', '14:00', '15:00'),
  s('Ode to Bass-D', 'GOLD', 'sunday', '15:00', '16:00'),
  s('Panic & Exertion', 'GOLD', 'sunday', '16:00', '17:00'),
  s('Potato & DJ Francois', 'GOLD', 'sunday', '17:00', '18:00'),
  s('Reeza & Juno B', 'GOLD', 'sunday', '18:00', '19:00'),
  s('Steve-D', 'GOLD', 'sunday', '19:00', '20:00'),
  s('Sunny D', 'GOLD', 'sunday', '20:00', '21:00'),
  s('Tha Playah', 'GOLD', 'sunday', '21:00', '23:00'),

  // PINK Sunday
  s('Fight Switch', 'PINK', 'sunday', '11:00', '12:15'),
  s('MCHUCK', 'PINK', 'sunday', '12:15', '13:30'),
  s('Murdock', 'PINK', 'sunday', '13:30', '14:45'),
  s('NCT', 'PINK', 'sunday', '14:45', '16:00'),
  s('Rataplan', 'PINK', 'sunday', '16:00', '17:15'),
  s('Redpill', 'PINK', 'sunday', '17:15', '18:30'),
  s('Sins of Pandora', 'PINK', 'sunday', '18:30', '19:45'),
  s('T & Sugah', 'PINK', 'sunday', '19:45', '21:00'),
  s('Tantron', 'PINK', 'sunday', '21:00', '22:00'),
  s('Wes S & $avvy', 'PINK', 'sunday', '22:00', '23:00'),

  // PURPLE Sunday
  s('Activate', 'PURPLE', 'sunday', '11:00', '12:00'),
  s('Aranxa', 'PURPLE', 'sunday', '12:00', '13:00'),
  s('Insuspect & MC Primax', 'PURPLE', 'sunday', '13:00', '14:00'),
  s('Josha', 'PURPLE', 'sunday', '14:00', '15:00'),
  s('KidEast', 'PURPLE', 'sunday', '15:00', '16:00'),
  s('Miss Isa', 'PURPLE', 'sunday', '16:00', '17:00'),
  s('MT', 'PURPLE', 'sunday', '17:00', '18:00'),
  s('Resensed', 'PURPLE', 'sunday', '18:00', '19:00'),
  s('Stugats', 'PURPLE', 'sunday', '19:00', '20:00'),
  s('Svenergy', 'PURPLE', 'sunday', '20:00', '23:00'),

  // INDIGO Sunday
  s('Cryex', 'INDIGO', 'sunday', '11:00', '12:30'),
  s('Deluzion', 'INDIGO', 'sunday', '12:30', '14:00'),
  s('Faceless / Sanctuary / Dark Entities', 'INDIGO', 'sunday', '14:00', '15:30'),
  s('Mutilator & Adjuzt', 'INDIGO', 'sunday', '15:30', '17:00'),
  s('Rejecta', 'INDIGO', 'sunday', '17:00', '18:30'),
  s('Spitnoise & Unlocked', 'INDIGO', 'sunday', '18:30', '20:00'),
  s('Synergy & Flo', 'INDIGO', 'sunday', '20:00', '23:00'),
]
