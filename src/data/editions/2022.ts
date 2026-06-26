import type { Day, Stage } from '../lineup'
import type { Edition } from './index'

let _id = 0
function s(artist: string, stage: Stage, day: Day, startTime: string, endTime: string, special?: string) {
  return { id: `2022-${++_id}`, artist, stage, day, startTime, endTime, special }
}

// Last updated: June 2026. Times are best estimates based on available sources.
// Update when more precise data is available.

const stagesPerDay: Record<Day, Stage[]> = {
  thursday: ['BLUE', 'BLACK', 'INDIGO'],
  friday:   ['RED', 'BLUE', 'BLACK', 'UV', 'MAGENTA', 'INDIGO', 'YELLOW', 'GOLD', 'ORANGE', 'PINK'],
  saturday: ['RED', 'BLUE', 'BLACK', 'UV', 'MAGENTA', 'GREEN', 'YELLOW', 'GOLD', 'PURPLE', 'SILVER'],
  sunday:   ['RED', 'BLUE', 'BLACK', 'UV', 'MAGENTA', 'GREEN', 'YELLOW', 'GOLD', 'PURPLE'],
}

const edition2022: Edition = {
  year: 2022,
  theme: 'Primal Energy',
  anthem: 'D-Block & S-te-Fan x Evelyn Bakker — Primal Energy (Haunted Grounds)',
  startDate: '2022-06-23T18:00:00+02:00',
  endDate: '2022-06-26T23:00:00+02:00',
  location: 'Biddinghuizen, Netherlands',
  isCurrent: false,
  keyFacts: [
    'First Defqon.1 since 2019 — return after two COVID cancellations (2020 & 2021)',
    'Anthem: D-Block & S-te-Fan x Evelyn Bakker — Primal Energy (Haunted Grounds)',
    'First-ever Ghost Stories live show concept performed at Defqon.1',
    'Headhunterz returned to RED main stage for the first time since 2016',
    'Rebelion delivered the RED Closing Ceremony on Sunday',
    'June 23–26, 2022',
  ],
  stagesPerDay,
  lineup: [
    // ===== THURSDAY — THE GATHERING =====
    s('Spitnoise', 'BLACK', 'thursday', '18:00', '19:00', 'Opening'),
    s('Miss K8', 'BLACK', 'thursday', '19:00', '20:00'),
    s('Endymion', 'BLACK', 'thursday', '20:00', '21:00'),
    s('N-Vitral', 'BLACK', 'thursday', '21:00', '22:00'),
    s('Angerfist', 'BLACK', 'thursday', '22:00', '23:00'),

    s('Aversion', 'BLUE', 'thursday', '18:00', '19:00'),
    s('Outsiders', 'BLUE', 'thursday', '19:00', '20:00'),
    s('Ran-D', 'BLUE', 'thursday', '20:00', '21:00'),
    s('Sub Zero Project', 'BLUE', 'thursday', '21:00', '22:00'),
    s('Headhunterz', 'BLUE', 'thursday', '22:00', '23:00'),

    s('Cryex', 'INDIGO', 'thursday', '18:00', '19:00'),
    s('Unresolved', 'INDIGO', 'thursday', '19:00', '20:00'),
    s('Radical Redemption', 'INDIGO', 'thursday', '20:00', '21:00'),
    s('Rebelion', 'INDIGO', 'thursday', '21:00', '22:00'),
    s('Warface', 'INDIGO', 'thursday', '22:00', '23:00'),

    // ===== FRIDAY =====
    s('D-Block & S-te-Fan', 'RED', 'friday', '12:00', '13:00', 'Opening Ceremony — Ghost Stories Live'),
    s('Atmozfears', 'RED', 'friday', '13:00', '13:45'),
    s('Coone', 'RED', 'friday', '13:45', '14:30'),
    s('Wildstylez', 'RED', 'friday', '14:30', '15:15'),
    s('Brennan Heart', 'RED', 'friday', '15:15', '16:00'),
    s('Da Tweekaz', 'RED', 'friday', '16:00', '16:45'),
    s('Sound Rush', 'RED', 'friday', '16:45', '17:30'),
    s('Phuture Noize', 'RED', 'friday', '17:30', '18:15'),
    s('Ran-D', 'RED', 'friday', '18:15', '19:00'),
    s('Headhunterz', 'RED', 'friday', '19:00', '19:45'),
    s('Sub Zero Project', 'RED', 'friday', '19:45', '23:00', 'Spotlight Endshow'),

    s('Audiotricz', 'BLUE', 'friday', '11:00', '12:00'),
    s('Code Black', 'BLUE', 'friday', '12:00', '13:00'),
    s('D-Sturb', 'BLUE', 'friday', '13:00', '14:00'),
    s('Outsiders', 'BLUE', 'friday', '14:00', '15:00'),
    s('Frequencerz', 'BLUE', 'friday', '15:00', '16:00'),
    s('Aversion', 'BLUE', 'friday', '16:00', '17:00'),
    s('Act of Rage', 'BLUE', 'friday', '17:00', '18:00'),
    s('Rooler', 'BLUE', 'friday', '18:00', '19:00'),
    s('Warface', 'BLUE', 'friday', '19:00', '20:00'),
    s('Rebelion', 'BLUE', 'friday', '20:00', '23:00', 'Endshow'),

    s('Mad Dog', 'BLACK', 'friday', '11:00', '12:00'),
    s('Spitnoise', 'BLACK', 'friday', '12:00', '13:00'),
    s('Miss K8', 'BLACK', 'friday', '13:00', '14:00'),
    s('Endymion', 'BLACK', 'friday', '14:00', '15:00'),
    s('Radical Redemption', 'BLACK', 'friday', '15:00', '16:00'),
    s('Partyraiser', 'BLACK', 'friday', '16:00', '17:00'),
    s('N-Vitral', 'BLACK', 'friday', '17:00', '18:00'),
    s('Angerfist', 'BLACK', 'friday', '18:00', '23:00', 'Spotlight Endshow'),

    s('Sefa', 'YELLOW', 'friday', '11:00', '12:30'),
    s('Dr. Peacock', 'YELLOW', 'friday', '12:30', '14:00'),
    s('Demi Kanon', 'YELLOW', 'friday', '14:00', '15:30'),

    // ===== SATURDAY =====
    s('Coone', 'RED', 'saturday', '11:00', '12:00'),
    s('Atmozfears', 'RED', 'saturday', '12:00', '13:00'),
    s('Brennan Heart', 'RED', 'saturday', '13:00', '14:00'),
    s('Wildstylez', 'RED', 'saturday', '14:00', '15:00'),
    s('Da Tweekaz', 'RED', 'saturday', '15:00', '16:00'),
    s('D-Sturb', 'RED', 'saturday', '16:00', '17:00'),
    s('Sound Rush', 'RED', 'saturday', '17:00', '18:00'),
    s('Ran-D', 'RED', 'saturday', '18:00', '19:00'),
    s('D-Block & S-te-Fan', 'RED', 'saturday', '19:00', '23:00', 'Spotlight Endshow'),

    s('Headhunterz', 'BLUE', 'saturday', '11:00', '12:00'),
    s('Frequencerz', 'BLUE', 'saturday', '12:00', '13:00'),
    s('Phuture Noize', 'BLUE', 'saturday', '13:00', '14:00'),
    s('Outsiders', 'BLUE', 'saturday', '14:00', '15:00'),
    s('Sub Zero Project', 'BLUE', 'saturday', '15:00', '16:00'),
    s('Code Black', 'BLUE', 'saturday', '16:00', '17:00'),
    s('Devin Wild', 'BLUE', 'saturday', '17:00', '18:00'),
    s('Act of Rage', 'BLUE', 'saturday', '18:00', '19:00'),
    s('Rooler', 'BLUE', 'saturday', '19:00', '23:00', 'Endshow'),

    s('Bloodlust', 'BLACK', 'saturday', '11:00', '12:30'),
    s('Gunz for Hire', 'BLACK', 'saturday', '12:30', '14:00'),
    s('Miss K8', 'BLACK', 'saturday', '14:00', '15:30'),
    s('Endymion', 'BLACK', 'saturday', '15:30', '17:00'),
    s('N-Vitral', 'BLACK', 'saturday', '17:00', '18:30'),
    s('Partyraiser', 'BLACK', 'saturday', '18:30', '20:00'),

    s('Sefa', 'YELLOW', 'saturday', '11:00', '12:30'),
    s('Dr. Peacock', 'YELLOW', 'saturday', '12:30', '14:00'),

    // ===== SUNDAY — CLOSING CEREMONY =====
    s('Coone', 'RED', 'sunday', '11:00', '12:00'),
    s('Atmozfears', 'RED', 'sunday', '12:00', '13:00'),
    s('Da Tweekaz', 'RED', 'sunday', '13:00', '14:00'),
    s('Brennan Heart', 'RED', 'sunday', '14:00', '15:00'),
    s('Wildstylez', 'RED', 'sunday', '15:00', '16:00'),
    s('Sound Rush', 'RED', 'sunday', '16:00', '17:00'),
    s('D-Block & S-te-Fan', 'RED', 'sunday', '17:00', '18:00'),
    s('Sub Zero Project', 'RED', 'sunday', '18:00', '20:00'),
    s('Rebelion', 'RED', 'sunday', '20:00', '23:00', 'Closing Ceremony'),

    s('Ran-D', 'BLUE', 'sunday', '11:00', '12:00'),
    s('Headhunterz', 'BLUE', 'sunday', '12:00', '13:00'),
    s('D-Sturb', 'BLUE', 'sunday', '13:00', '14:00'),
    s('Aversion', 'BLUE', 'sunday', '14:00', '15:00'),
    s('Code Black', 'BLUE', 'sunday', '15:00', '16:00'),
    s('Frequencerz', 'BLUE', 'sunday', '16:00', '17:00'),
    s('Phuture Noize', 'BLUE', 'sunday', '17:00', '18:00'),
    s('Outsiders', 'BLUE', 'sunday', '18:00', '19:00'),
    s('Warface', 'BLUE', 'sunday', '19:00', '23:00', 'Endshow'),

    s('Angerfist', 'BLACK', 'sunday', '11:00', '13:00'),
    s('Radical Redemption', 'BLACK', 'sunday', '13:00', '15:00'),
    s('Spitnoise', 'BLACK', 'sunday', '15:00', '16:30'),
    s('Endymion', 'BLACK', 'sunday', '16:30', '18:00'),
    s('N-Vitral', 'BLACK', 'sunday', '18:00', '20:00'),
  ],
}

export default edition2022
