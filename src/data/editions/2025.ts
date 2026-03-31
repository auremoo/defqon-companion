import type { Day, Stage } from '../lineup'
import type { Edition } from './index'

let _id = 0
function s(artist: string, stage: Stage, day: Day, startTime: string, endTime: string, special?: string) {
  return { id: `2025-${++_id}`, artist, stage, day, startTime, endTime, special }
}

const stagesPerDay: Record<Day, Stage[]> = {
  thursday: ['BLUE', 'BLACK', 'INDIGO'],
  friday: ['RED', 'BLUE', 'BLACK', 'UV', 'MAGENTA', 'INDIGO', 'YELLOW', 'GOLD', 'ORANGE', 'PINK'],
  saturday: ['RED', 'BLUE', 'BLACK', 'UV', 'MAGENTA', 'GREEN', 'YELLOW', 'GOLD', 'PURPLE', 'SILVER'],
  sunday: ['RED', 'BLUE', 'BLACK', 'UV', 'MAGENTA', 'GREEN', 'YELLOW', 'GOLD', 'PURPLE'],
}

const edition2025: Edition = {
  year: 2025,
  theme: 'Where Legends Rise',
  startDate: '2025-06-26T18:00:00+02:00',
  endDate: '2025-06-29T23:00:00+02:00',
  location: 'Biddinghuizen, Netherlands',
  isCurrent: false,
  stagesPerDay,
  lineup: [
    // ===== THURSDAY — THE GATHERING =====
    s('Sub Zero Project', 'BLUE', 'thursday', '18:00', '19:00'),
    s('TNT', 'BLUE', 'thursday', '19:00', '20:00'),
    s('Vertile', 'BLUE', 'thursday', '20:00', '21:00'),
    s('Warface & Rooler', 'BLUE', 'thursday', '21:00', '22:00'),
    s('Wildstylez', 'BLUE', 'thursday', '22:00', '23:00'),

    s('Angerfist', 'BLACK', 'thursday', '18:00', '19:00'),
    s('Dimitri K & MC Robs', 'BLACK', 'thursday', '19:00', '20:00'),
    s('Endymion & The Viper', 'BLACK', 'thursday', '20:00', '21:00'),
    s('HYSTA', 'BLACK', 'thursday', '21:00', '22:00'),
    s('N-Vitral', 'BLACK', 'thursday', '22:00', '23:00'),

    s('Adaro & Unresolved', 'INDIGO', 'thursday', '18:00', '19:00'),
    s('Coldax', 'INDIGO', 'thursday', '19:00', '20:00'),
    s('Lunakorpz & Amigo', 'INDIGO', 'thursday', '20:00', '21:00'),
    s('Rejecta & Deluzion', 'INDIGO', 'thursday', '21:00', '22:00'),
    s('The Saints', 'INDIGO', 'thursday', '22:00', '22:30'),
    s('Vexxed', 'INDIGO', 'thursday', '22:30', '23:00'),

    // ===== FRIDAY =====
    // RED
    s('Tripping with Peacock in Concert', 'RED', 'friday', '12:00', '13:00', 'Opening Ceremony'),
    s('Atmozfears & Adrenalize', 'RED', 'friday', '13:00', '13:45'),
    s('Brennan Heart', 'RED', 'friday', '13:45', '14:30'),
    s('Coone', 'RED', 'friday', '14:30', '15:15'),
    s('D-Sturb & Aversion', 'RED', 'friday', '15:15', '16:00'),
    s('Dual Damage', 'RED', 'friday', '16:00', '16:45'),
    s('Galactixx', 'RED', 'friday', '16:45', '17:30'),
    s('Outsiders', 'RED', 'friday', '17:30', '18:15'),
    s('Sound Rush', 'RED', 'friday', '18:15', '19:00'),
    s('B-Front', 'RED', 'friday', '19:00', '19:45'),
    s('Zatox', 'RED', 'friday', '19:45', '20:30'),
    s('D-Block & S-te-Fan', 'RED', 'friday', '20:30', '23:00', 'Spotlight Endshow'),

    // BLUE Friday
    s('Act of Rage', 'BLUE', 'friday', '11:00', '11:45'),
    s('Cryex', 'BLUE', 'friday', '11:45', '12:30'),
    s('Crypsis — My I\'ll Style', 'BLUE', 'friday', '12:30', '13:15'),
    s('E-Force', 'BLUE', 'friday', '13:15', '14:00'),
    s('Jason Payne — Dark Energy', 'BLUE', 'friday', '14:00', '14:45'),
    s('Mutilator', 'BLUE', 'friday', '14:45', '15:30'),
    s('Rejecta', 'BLUE', 'friday', '15:30', '16:15'),
    s('Rooler', 'BLUE', 'friday', '16:15', '17:00'),
    s('Unresolved', 'BLUE', 'friday', '17:00', '17:45'),
    s('Warface', 'BLUE', 'friday', '17:45', '18:30'),
    s('Wolv', 'BLUE', 'friday', '18:30', '19:15'),
    s('CYBERGORE: NIGHTMARE ENGINE', 'BLUE', 'friday', '19:15', '20:00'),
    s('Radianze & Sub Sonik', 'BLUE', 'friday', '20:00', '23:00'),

    // BLACK Friday
    s('Deadly Guns', 'BLACK', 'friday', '11:00', '12:00'),
    s('Dither IS G.A.B.B.E.R.', 'BLACK', 'friday', '12:00', '13:00'),
    s('Karun', 'BLACK', 'friday', '13:00', '14:00'),
    s('Lil Texas', 'BLACK', 'friday', '14:00', '15:00'),
    s('Lunakorpz Live', 'BLACK', 'friday', '15:00', '16:00'),
    s('Major Conspiracy', 'BLACK', 'friday', '16:00', '17:00'),
    s('Never Surrender', 'BLACK', 'friday', '17:00', '18:00'),
    s('Nosferatu & Tha Playah — Combined Forces', 'BLACK', 'friday', '18:00', '19:00'),
    s('Promo', 'BLACK', 'friday', '19:00', '20:00'),
    s('Spitnoise', 'BLACK', 'friday', '20:00', '21:00'),
    s('Partyraiser', 'BLACK', 'friday', '21:00', '23:00', 'Spotlight'),

    // UV Friday
    s('Sephyx', 'UV', 'friday', '11:00', '11:45'),
    s('Bass Modulators', 'UV', 'friday', '11:45', '12:30'),
    s('Da Tweekaz & Darren Styles', 'UV', 'friday', '12:30', '13:15'),
    s('Demi Kanon', 'UV', 'friday', '13:15', '14:00'),
    s('Devin Wild', 'UV', 'friday', '14:00', '14:45'),
    s('Doris — The Final Elixir', 'UV', 'friday', '14:45', '15:30'),
    s('EZG LIVE', 'UV', 'friday', '15:30', '16:15'),
    s('MANDY', 'UV', 'friday', '16:15', '17:00'),
    s('Melo-3 (Ecstatic, Jay Reeve & Solstice)', 'UV', 'friday', '17:00', '17:45'),
    s('Refuzion', 'UV', 'friday', '17:45', '18:30'),
    s('Wasted Penguinz', 'UV', 'friday', '18:30', '19:15'),
    s('Da Tweekaz', 'UV', 'friday', '19:15', '23:00'),

    // MAGENTA Friday
    s('2Faced', 'MAGENTA', 'friday', '11:00', '12:00'),
    s('Alpha Twins', 'MAGENTA', 'friday', '12:00', '13:00'),
    s('Bass Chaserz', 'MAGENTA', 'friday', '13:00', '14:00'),
    s('Deetox', 'MAGENTA', 'friday', '14:00', '15:00'),
    s('Digital Punk', 'MAGENTA', 'friday', '15:00', '16:00'),
    s('DJ Thera — 25 Years of Heartstyle', 'MAGENTA', 'friday', '16:00', '17:00', 'Special'),
    s('Frequencerz', 'MAGENTA', 'friday', '17:00', '18:00'),
    s('Spoontech Classics', 'MAGENTA', 'friday', '18:00', '19:00'),
    s('Titan', 'MAGENTA', 'friday', '19:00', '20:00'),
    s('Crypsis & Chain Reaction — Unlike Others', 'MAGENTA', 'friday', '20:00', '21:00'),
    s('Degos & Re-Done', 'MAGENTA', 'friday', '21:00', '23:00'),

    // INDIGO Friday
    s('Amduscias & Captivator', 'INDIGO', 'friday', '11:00', '12:00'),
    s('Dark Entities', 'INDIGO', 'friday', '12:00', '13:00'),
    s('Element', 'INDIGO', 'friday', '13:00', '14:00'),
    s('Faceless', 'INDIGO', 'friday', '14:00', '15:00'),
    s('Infliction', 'INDIGO', 'friday', '15:00', '16:00'),
    s('Invector', 'INDIGO', 'friday', '16:00', '17:00'),
    s('Malice & Kenai', 'INDIGO', 'friday', '17:00', '18:00'),
    s('Mortis & Spitfire', 'INDIGO', 'friday', '18:00', '19:00'),
    s('Sanctuary', 'INDIGO', 'friday', '19:00', '20:00'),
    s('Sparkz', 'INDIGO', 'friday', '20:00', '21:00'),
    s('Udex', 'INDIGO', 'friday', '21:00', '23:00'),

    // YELLOW Friday
    s('Amigo', 'YELLOW', 'friday', '11:00', '12:00'),
    s('Aradia', 'YELLOW', 'friday', '12:00', '13:00'),
    s('Complex', 'YELLOW', 'friday', '13:00', '14:00'),
    s('F.Noize & Mind Compressor', 'YELLOW', 'friday', '14:00', '15:00'),
    s('Irradiate', 'YELLOW', 'friday', '15:00', '16:00'),
    s('Roosterz', 'YELLOW', 'friday', '16:00', '17:00'),
    s('Soulblast', 'YELLOW', 'friday', '17:00', '18:00'),
    s('Unproven', 'YELLOW', 'friday', '18:00', '19:00'),
    s('Revellers', 'YELLOW', 'friday', '19:00', '20:00'),
    s('Dynamic Noise & TukkerTempo', 'YELLOW', 'friday', '20:00', '23:00'),

    // GOLD Friday
    s('Charly Lownoise', 'GOLD', 'friday', '11:00', '12:00'),
    s('Day-Mar 20 Years', 'GOLD', 'friday', '12:00', '13:00', 'Special'),
    s('DJ Ruffian', 'GOLD', 'friday', '13:00', '14:00'),
    s('Gizmo', 'GOLD', 'friday', '14:00', '15:00'),
    s('Painbringer', 'GOLD', 'friday', '15:00', '16:00'),
    s('Rob Gee', 'GOLD', 'friday', '16:00', '17:00'),
    s('System Overload — Back To The Roots', 'GOLD', 'friday', '17:00', '18:00'),
    s('The Viper', 'GOLD', 'friday', '18:00', '19:00'),
    s('Tommyknocker', 'GOLD', 'friday', '19:00', '20:00'),
    s('Zero', 'GOLD', 'friday', '20:00', '23:00'),

    // ORANGE Friday
    s('ASY*S', 'ORANGE', 'friday', '11:00', '12:30'),
    s('Anderex & Desudo — Orange Heart', 'ORANGE', 'friday', '12:30', '14:00'),
    s('DJ Thera — Tranceparency', 'ORANGE', 'friday', '14:00', '15:30'),
    s('Geck-o — Get On The Train!', 'ORANGE', 'friday', '15:30', '17:00'),
    s('Scot Project', 'ORANGE', 'friday', '17:00', '18:30'),
    s('STOIK', 'ORANGE', 'friday', '18:30', '20:00'),
    s('CRO & Steenwolk', 'ORANGE', 'friday', '20:00', '23:00'),

    // PINK Friday (new for 2025 — drum & bass)
    s('Arcando', 'PINK', 'friday', '11:00', '12:20'),
    s('Murdock', 'PINK', 'friday', '12:20', '13:40'),
    s('Pythius', 'PINK', 'friday', '13:40', '15:00'),
    s('T & Sugah', 'PINK', 'friday', '15:00', '16:20'),
    s('USED', 'PINK', 'friday', '16:20', '17:40'),
    s('Wes S & $aVVy', 'PINK', 'friday', '17:40', '19:00'),
    s('Atmos', 'PINK', 'friday', '19:00', '20:30'),
    s('Yussi', 'PINK', 'friday', '20:30', '23:00'),

    // ===== SATURDAY =====
    // RED Saturday
    s('Warrior Workout', 'RED', 'saturday', '11:00', '12:00', 'Special'),
    s('Adjuzt — LVLDUP ENDGAME', 'RED', 'saturday', '12:00', '13:00'),
    s('DJ Isaac', 'RED', 'saturday', '13:00', '13:45'),
    s('Paul Elstak', 'RED', 'saturday', '13:45', '14:30'),
    s('Phuture Noize & Devin Wild', 'RED', 'saturday', '14:30', '15:15'),
    s('POWER HOUR', 'RED', 'saturday', '15:15', '16:15', 'Special'),
    s('Primeshock', 'RED', 'saturday', '16:15', '17:00'),
    s('Ran-D', 'RED', 'saturday', '17:00', '17:45'),
    s('Rebelion', 'RED', 'saturday', '17:45', '18:30'),
    s('Sickmode', 'RED', 'saturday', '18:30', '19:15'),
    s('Sub Zero Project & Hard Driver', 'RED', 'saturday', '19:15', '20:00'),
    s('The Purge — HYTRIP', 'RED', 'saturday', '20:00', '20:45'),
    s('Vertile', 'RED', 'saturday', '20:45', '21:30'),
    s('The Endshow', 'RED', 'saturday', '21:30', '23:00', 'Endshow'),

    // BLUE Saturday
    s('Bloodlust', 'BLUE', 'saturday', '11:00', '11:45'),
    s('BMBERJCK & Sparkz — Legacy of Sound LIVE', 'BLUE', 'saturday', '11:45', '12:30'),
    s('Chapter Vasto', 'BLUE', 'saturday', '12:30', '13:15'),
    s('Deetox', 'BLUE', 'saturday', '13:15', '14:00'),
    s('Fraw', 'BLUE', 'saturday', '14:00', '14:45'),
    s('Imperatorz', 'BLUE', 'saturday', '14:45', '15:30'),
    s('Killshot & TOZA & Vexxed', 'BLUE', 'saturday', '15:30', '16:15'),
    s('Kronos — The Final Kryptonite', 'BLUE', 'saturday', '16:15', '17:00'),
    s('Mish', 'BLUE', 'saturday', '17:00', '17:45'),
    s('Nightcraft', 'BLUE', 'saturday', '17:45', '18:30'),
    s('Riot Shift', 'BLUE', 'saturday', '18:30', '19:15'),
    s('So Juice & Anderex & DEEZL', 'BLUE', 'saturday', '19:15', '20:00'),
    s('The Straikerz', 'BLUE', 'saturday', '20:00', '21:00'),
    s('Omnya', 'BLUE', 'saturday', '21:00', '23:00'),

    // BLACK Saturday
    s('Barber', 'BLACK', 'saturday', '11:00', '12:00'),
    s('Bulletproof', 'BLACK', 'saturday', '12:00', '13:00'),
    s('Evil Activities', 'BLACK', 'saturday', '13:00', '14:00'),
    s('Gridkiller', 'BLACK', 'saturday', '14:00', '15:00'),
    s('Juliex', 'BLACK', 'saturday', '15:00', '16:00'),
    s('Korsakoff', 'BLACK', 'saturday', '16:00', '17:00'),
    s('Namara & Yoshiko', 'BLACK', 'saturday', '17:00', '18:00'),
    s('Noxiouz', 'BLACK', 'saturday', '18:00', '19:00'),
    s('Triple6 Live: DRS & MBK & Equal2', 'BLACK', 'saturday', '19:00', '20:30'),
    s('XRTN — Exertion', 'BLACK', 'saturday', '20:30', '23:00'),

    // UV Saturday
    s('Audiotricz', 'UV', 'saturday', '11:00', '12:00'),
    s('Code Black', 'UV', 'saturday', '12:00', '13:00'),
    s('Ecstatic — The Essence', 'UV', 'saturday', '13:00', '14:00'),
    s('Frontliner', 'UV', 'saturday', '14:00', '15:00'),
    s('Jay Reeve — Pursuit Of A Dream', 'UV', 'saturday', '15:00', '16:00'),
    s('KELTEK', 'UV', 'saturday', '16:00', '17:00'),
    s('Noisecontrollers — Harmony', 'UV', 'saturday', '17:00', '18:00'),
    s('Solstice', 'UV', 'saturday', '18:00', '19:00'),
    s('Stormerz', 'UV', 'saturday', '19:00', '20:00'),
    s('The Pitcher — 25 years', 'UV', 'saturday', '20:00', '21:00', 'Special'),
    s('Toneshifterz', 'UV', 'saturday', '21:00', '23:00'),

    // MAGENTA Saturday
    s('Deepack 35 Years Special', 'MAGENTA', 'saturday', '11:00', '12:00', 'Special'),
    s('DJ Ghost', 'MAGENTA', 'saturday', '12:00', '13:00'),
    s('DJ Pila', 'MAGENTA', 'saturday', '13:00', '14:00'),
    s('Donkey Rollers', 'MAGENTA', 'saturday', '14:00', '15:00'),
    s('Luna', 'MAGENTA', 'saturday', '15:00', '16:00'),
    s('Pat B', 'MAGENTA', 'saturday', '16:00', '17:00'),
    s('Pavo', 'MAGENTA', 'saturday', '17:00', '18:00'),
    s('Ruthless — Freestyle Classics', 'MAGENTA', 'saturday', '18:00', '19:00'),
    s('Sunny D', 'MAGENTA', 'saturday', '19:00', '20:00'),
    s('Tatanka', 'MAGENTA', 'saturday', '20:00', '21:00'),
    s('Zany', 'MAGENTA', 'saturday', '21:00', '23:00'),

    // GREEN Saturday
    s('Catalyst', 'GREEN', 'saturday', '11:00', '12:30'),
    s('Dikke Baap', 'GREEN', 'saturday', '12:30', '14:00'),
    s('Luna Fields', 'GREEN', 'saturday', '14:00', '15:30'),
    s('Manji', 'GREEN', 'saturday', '15:30', '17:00'),
    s('Spoontechno', 'GREEN', 'saturday', '17:00', '18:30'),
    s('The Purge Hybrid', 'GREEN', 'saturday', '18:30', '20:00'),
    s('Vyral', 'GREEN', 'saturday', '20:00', '23:00'),

    // YELLOW Saturday
    s('Chaotic Hostility & Dr. Z', 'YELLOW', 'saturday', '11:00', '12:00'),
    s('Cryogenic & Kili', 'YELLOW', 'saturday', '12:00', '13:00'),
    s('Dr Donk', 'YELLOW', 'saturday', '13:00', '14:00'),
    s('Guizcore', 'YELLOW', 'saturday', '14:00', '15:00'),
    s('Manifest Destiny', 'YELLOW', 'saturday', '15:00', '16:00'),
    s('Mat Weasel Busters', 'YELLOW', 'saturday', '16:00', '17:00'),
    s('Pinotello', 'YELLOW', 'saturday', '17:00', '18:00'),
    s('S-Kill', 'YELLOW', 'saturday', '18:00', '19:00'),
    s('Satirized', 'YELLOW', 'saturday', '19:00', '20:00'),
    s('The Dope Doctor', 'YELLOW', 'saturday', '20:00', '21:00'),
    s('Trespassed', 'YELLOW', 'saturday', '21:00', '22:00'),
    s('Unlocked', 'YELLOW', 'saturday', '22:00', '23:00'),

    // GOLD Saturday
    s('Bass-D', 'GOLD', 'saturday', '11:00', '12:00'),
    s('Critical Mass', 'GOLD', 'saturday', '12:00', '13:00'),
    s('Dano', 'GOLD', 'saturday', '13:00', '14:00'),
    s('Endymion', 'GOLD', 'saturday', '14:00', '15:00'),
    s('Mental Theo', 'GOLD', 'saturday', '15:00', '16:00'),
    s('Partyraiser', 'GOLD', 'saturday', '16:00', '17:00'),
    s('Rob & MC Joe', 'GOLD', 'saturday', '17:00', '18:00'),
    s('The Darkraver & MD&A', 'GOLD', 'saturday', '18:00', '19:00'),
    s('The Raver', 'GOLD', 'saturday', '19:00', '20:00'),
    s('The Sickest Squad', 'GOLD', 'saturday', '20:00', '21:00'),
    s('Elitepauper DJ Team', 'GOLD', 'saturday', '21:00', '23:00'),

    // PURPLE Saturday
    s('Cardination', 'PURPLE', 'saturday', '11:00', '12:30'),
    s('Digital Madness', 'PURPLE', 'saturday', '12:30', '14:00'),
    s('Double Trouble', 'PURPLE', 'saturday', '14:00', '15:30'),
    s('RAYZEN', 'PURPLE', 'saturday', '15:30', '17:00'),
    s('Savage Academy', 'PURPLE', 'saturday', '17:00', '18:30', 'Showcase'),
    s('Suspect', 'PURPLE', 'saturday', '18:30', '20:00'),
    s('Udow', 'PURPLE', 'saturday', '20:00', '21:30'),
    s('Valido', 'PURPLE', 'saturday', '21:30', '23:00'),

    // SILVER Saturday
    s('Dither', 'SILVER', 'saturday', '11:00', '12:30'),
    s('Kilbourne & SOVA', 'SILVER', 'saturday', '12:30', '14:00'),
    s('Nightshift', 'SILVER', 'saturday', '14:00', '15:30'),
    s('Ophidian & Furyan', 'SILVER', 'saturday', '15:30', '17:00'),
    s('The Outside Agency & Deathmachine', 'SILVER', 'saturday', '17:00', '18:30'),
    s('Nanostorm', 'SILVER', 'saturday', '18:30', '20:00'),
    s('The Silence', 'SILVER', 'saturday', '20:00', '23:00'),

    // ===== SUNDAY FUNDAY =====
    // RED Sunday
    s('Defqon.1 Legends — 25 Years', 'RED', 'sunday', '12:00', '17:00', '5-hour Special'),
    s('The Closing Ritual', 'RED', 'sunday', '22:00', '23:00', 'Closing'),

    // BLUE Sunday
    s('15 Years of Spoontech — Jailbreak', 'BLUE', 'sunday', '11:00', '12:00', 'Special'),
    s('Anderex', 'BLUE', 'sunday', '12:00', '12:45'),
    s('Deluzion', 'BLUE', 'sunday', '12:45', '13:30'),
    s('Digital Punk & Level One', 'BLUE', 'sunday', '13:30', '14:15'),
    s('Exproz & Kruelty', 'BLUE', 'sunday', '14:15', '15:00'),
    s('Mutilator & The Straikerz', 'BLUE', 'sunday', '15:00', '15:45'),
    s('Phuture Noize', 'BLUE', 'sunday', '15:45', '16:30'),
    s('Revelation LIVE', 'BLUE', 'sunday', '16:30', '17:15'),
    s('Sickmode & Krowdexx — NEW LIVE ACT', 'BLUE', 'sunday', '17:15', '18:00', 'LIVE Debut'),
    s('The Purge & The Saints', 'BLUE', 'sunday', '18:00', '18:45'),
    s('The Smiler', 'BLUE', 'sunday', '18:45', '19:30'),
    s('Sanctuary & Coldax & Infliction', 'BLUE', 'sunday', '19:30', '23:00'),

    // UV Sunday
    s('Altijd Larstig & Rob Gasd\'rop', 'UV', 'sunday', '11:00', '12:00'),
    s('Bass Chaserz Special', 'UV', 'sunday', '12:00', '13:00'),
    s('FeestDJRuud', 'UV', 'sunday', '13:00', '14:00'),
    s('GPF', 'UV', 'sunday', '14:00', '15:00'),
    s('Jebroer', 'UV', 'sunday', '15:00', '16:00'),
    s('LNY TNZ', 'UV', 'sunday', '16:00', '17:00'),
    s('Mark with a K & MC Chucky', 'UV', 'sunday', '17:00', '18:00'),
    s('Outsiders & Adaro', 'UV', 'sunday', '18:00', '19:00'),
    s('Potato', 'UV', 'sunday', '19:00', '20:00'),
    s('Unicorn on K', 'UV', 'sunday', '20:00', '23:00'),

    // BLACK Sunday
    s('AniMe', 'BLACK', 'sunday', '11:00', '12:30'),
    s('Billx', 'BLACK', 'sunday', '12:30', '14:00'),
    s('D-Fence', 'BLACK', 'sunday', '14:00', '15:30'),
    s('Mad Dog', 'BLACK', 'sunday', '15:30', '17:00'),
    s('Miss K8', 'BLACK', 'sunday', '17:00', '18:30'),
    s('The Darkraver & Vince', 'BLACK', 'sunday', '18:30', '23:00'),

    // MAGENTA Sunday
    s('Atmozfears', 'MAGENTA', 'sunday', '11:00', '12:30'),
    s('Bass Modulators Rewind', 'MAGENTA', 'sunday', '12:30', '14:00'),
    s('Dr. Rude — Jump Classics', 'MAGENTA', 'sunday', '14:00', '15:30'),
    s('Max Enforcer', 'MAGENTA', 'sunday', '15:30', '17:00'),
    s('Toneshifterz', 'MAGENTA', 'sunday', '17:00', '18:30'),
    s('Jones', 'MAGENTA', 'sunday', '18:30', '20:00'),
    s('Consequent', 'MAGENTA', 'sunday', '20:00', '23:00'),

    // GREEN Sunday (hard techno)
    s('APHOTIC', 'GREEN', 'sunday', '11:00', '12:30'),
    s('Cynthia Spiering', 'GREEN', 'sunday', '12:30', '14:00'),
    s('DAE', 'GREEN', 'sunday', '14:00', '15:30'),
    s('KLUGT', 'GREEN', 'sunday', '15:30', '17:00'),
    s('Mad Dog Down Tempo', 'GREEN', 'sunday', '17:00', '18:30'),
    s('OGUZ', 'GREEN', 'sunday', '18:30', '20:00'),
    s('XRTN', 'GREEN', 'sunday', '20:00', '23:00'),

    // YELLOW Sunday
    s('Akimbo', 'YELLOW', 'sunday', '11:00', '12:00'),
    s('D-Frek', 'YELLOW', 'sunday', '12:00', '13:00'),
    s('Eraized', 'YELLOW', 'sunday', '13:00', '14:00'),
    s('Jur Terreur & Abaddon', 'YELLOW', 'sunday', '14:00', '15:00'),
    s('Maissouille & Radium', 'YELLOW', 'sunday', '15:00', '16:00'),
    s('Remzcore & Levenkhan', 'YELLOW', 'sunday', '16:00', '17:00'),
    s('Samynator LIVE', 'YELLOW', 'sunday', '17:00', '18:00'),
    s('Super Trash Bros. LIVE', 'YELLOW', 'sunday', '18:00', '19:00'),
    s('Tharoza', 'YELLOW', 'sunday', '19:00', '20:00'),
    s('The Vizitor & Vandal!sm', 'YELLOW', 'sunday', '20:00', '23:00'),

    // GOLD Sunday
    s('Buzz Fuzz', 'GOLD', 'sunday', '11:00', '12:30'),
    s('DJ J.D.A.', 'GOLD', 'sunday', '12:30', '14:00'),
    s('JDX — Oldschool Set', 'GOLD', 'sunday', '14:00', '15:30'),
    s('Korsakoff', 'GOLD', 'sunday', '15:30', '17:00'),
    s('Panic', 'GOLD', 'sunday', '17:00', '18:00'),
    s('Ruffneck', 'GOLD', 'sunday', '18:00', '19:00'),
    s('T-Go & Noxa', 'GOLD', 'sunday', '19:00', '20:30'),
    s('Tjerhakkers', 'GOLD', 'sunday', '20:30', '23:00'),

    // PURPLE Sunday
    s('Anamorphic', 'PURPLE', 'sunday', '11:00', '12:30'),
    s('D-Venn', 'PURPLE', 'sunday', '12:30', '14:00'),
    s('Miss Isa', 'PURPLE', 'sunday', '14:00', '15:30'),
    s('Nexor', 'PURPLE', 'sunday', '15:30', '17:00'),
    s('Releazer', 'PURPLE', 'sunday', '17:00', '18:30'),
    s('Repeller', 'PURPLE', 'sunday', '18:30', '20:00'),
    s('Spectre', 'PURPLE', 'sunday', '20:00', '21:30'),
    s('YEYO', 'PURPLE', 'sunday', '21:30', '23:00'),
  ],
}

export default edition2025
