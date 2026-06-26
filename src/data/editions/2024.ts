import type { Day, Stage } from '../lineup'
import type { Edition } from './index'

let _id = 0
function s(artist: string, stage: Stage, day: Day, startTime: string, endTime: string, special?: string) {
  return { id: `2024-${++_id}`, artist, stage, day, startTime, endTime, special }
}

// Last updated: June 2026. Times are best estimates based on available sources.
// Update when more precise data is available.

const stagesPerDay: Record<Day, Stage[]> = {
  thursday: ['BLUE', 'BLACK', 'INDIGO'],
  friday:   ['RED', 'BLUE', 'BLACK', 'UV', 'MAGENTA', 'INDIGO', 'YELLOW', 'GOLD', 'ORANGE', 'PINK'],
  saturday: ['RED', 'BLUE', 'BLACK', 'UV', 'MAGENTA', 'GREEN', 'YELLOW', 'GOLD', 'PURPLE', 'SILVER'],
  sunday:   ['RED', 'BLUE', 'BLACK', 'UV', 'MAGENTA', 'GREEN', 'YELLOW', 'GOLD', 'PURPLE'],
}

const edition2024: Edition = {
  year: 2024,
  theme: 'Power of the Tribe',
  anthem: 'Sound Rush — Power of the Tribe',
  startDate: '2024-06-27T18:00:00+02:00',
  endDate: '2024-06-30T23:00:00+02:00',
  location: 'Biddinghuizen, Netherlands',
  isCurrent: false,
  keyFacts: [
    '20th anniversary edition of Defqon.1',
    'Anthem: Sound Rush — Power of the Tribe',
    'Angerfist: first-ever hardcore act to close the RED main stage (Saturday)',
    '5-hour Closing Ceremony on Sunday (vs. usual 3h)',
    'Rooler: first solo performance on RED main stage (Saturday)',
    '~350 artists across 10+ stages',
  ],
  stagesPerDay,
  lineup: [
    // ===== THURSDAY — THE GATHERING =====
    s('Mad Dog', 'BLACK', 'thursday', '18:00', '19:00', 'Opening'),
    s('Spitnoise', 'BLACK', 'thursday', '19:00', '20:00'),
    s('Partyraiser', 'BLACK', 'thursday', '20:00', '21:00'),
    s('Endymion', 'BLACK', 'thursday', '21:00', '22:00'),
    s('N-Vitral', 'BLACK', 'thursday', '22:00', '23:00'),

    s('D-Sturb', 'BLUE', 'thursday', '18:00', '19:00'),
    s('Sound Rush', 'BLUE', 'thursday', '19:00', '20:00'),
    s('Dual Damage', 'BLUE', 'thursday', '20:00', '21:00'),
    s('Sub Zero Project', 'BLUE', 'thursday', '21:00', '22:00'),
    s('Headhunterz', 'BLUE', 'thursday', '22:00', '23:00'),

    s('Cryex', 'INDIGO', 'thursday', '18:00', '19:00'),
    s('Unresolved', 'INDIGO', 'thursday', '19:00', '20:00'),
    s('Warface', 'INDIGO', 'thursday', '20:00', '21:00'),
    s('Rebelion', 'INDIGO', 'thursday', '21:00', '22:00'),
    s('Radical Redemption', 'INDIGO', 'thursday', '22:00', '23:00'),

    // ===== FRIDAY =====
    s('Ran-D', 'RED', 'friday', '12:00', '13:00', 'Opening Ceremony'),
    s('Atmozfears', 'RED', 'friday', '13:00', '13:45'),
    s('Coone', 'RED', 'friday', '13:45', '14:30'),
    s('Brennan Heart', 'RED', 'friday', '14:30', '15:15'),
    s('Da Tweekaz', 'RED', 'friday', '15:15', '16:00'),
    s('Wildstylez', 'RED', 'friday', '16:00', '16:45'),
    s('Phuture Noize', 'RED', 'friday', '16:45', '17:30'),
    s('B-Front', 'RED', 'friday', '17:30', '18:15'),
    s('Devin Wild', 'RED', 'friday', '18:15', '19:00'),
    s('Act of Rage', 'RED', 'friday', '19:00', '19:45'),
    s('D-Block & S-te-Fan', 'RED', 'friday', '19:45', '23:00', 'Spotlight Endshow'),

    s('Sound Rush', 'BLUE', 'friday', '11:00', '12:00'),
    s('Refuzion', 'BLUE', 'friday', '12:00', '13:00'),
    s('Frequencerz', 'BLUE', 'friday', '13:00', '14:00'),
    s('Galactixx', 'BLUE', 'friday', '14:00', '15:00'),
    s('Outsiders', 'BLUE', 'friday', '15:00', '16:00'),
    s('Aversion', 'BLUE', 'friday', '16:00', '17:00'),
    s('D-Sturb', 'BLUE', 'friday', '17:00', '18:00'),
    s('Sub Zero Project', 'BLUE', 'friday', '18:00', '19:00'),
    s('Sickmode', 'BLUE', 'friday', '19:00', '20:00'),
    s('Rooler', 'BLUE', 'friday', '20:00', '23:00', 'Endshow'),

    s('Frenchcore Familia', 'BLACK', 'friday', '11:00', '12:00'),
    s('Angerfist', 'BLACK', 'friday', '12:00', '13:00'),
    s('Bloodlust', 'BLACK', 'friday', '13:00', '14:00'),
    s('Miss K8', 'BLACK', 'friday', '14:00', '15:00'),
    s('Gunz for Hire', 'BLACK', 'friday', '15:00', '16:00'),
    s('Endymion', 'BLACK', 'friday', '16:00', '17:00'),
    s('Sefa', 'YELLOW', 'friday', '11:00', '12:30'),
    s('Dr. Peacock', 'YELLOW', 'friday', '12:30', '14:00'),
    s('Demi Kanon', 'YELLOW', 'friday', '14:00', '15:30'),

    // ===== SATURDAY =====
    s('Ran-D', 'RED', 'saturday', '11:00', '12:00'),
    s('Atmozfears', 'RED', 'saturday', '12:00', '13:00'),
    s('Brennan Heart', 'RED', 'saturday', '13:00', '14:00'),
    s('Rooler', 'RED', 'saturday', '14:00', '15:00', 'First solo RED set'),
    s('Devin Wild', 'RED', 'saturday', '15:00', '16:00'),
    s('Da Tweekaz', 'RED', 'saturday', '16:00', '17:00'),
    s('Headhunterz', 'RED', 'saturday', '17:00', '18:00'),
    s('Wildstylez', 'RED', 'saturday', '18:00', '19:00'),
    s('Angerfist', 'RED', 'saturday', '19:00', '23:00', 'Spotlight Endshow — first hardcore act to close RED'),

    s('Dual Damage', 'BLUE', 'saturday', '11:00', '12:00'),
    s('Sound Rush', 'BLUE', 'saturday', '12:00', '13:00'),
    s('Code Black', 'BLUE', 'saturday', '13:00', '14:00'),
    s('Phuture Noize', 'BLUE', 'saturday', '14:00', '15:00'),
    s('Warface', 'BLUE', 'saturday', '15:00', '16:00'),
    s('Rebelion', 'BLUE', 'saturday', '16:00', '17:00'),
    s('Sub Zero Project', 'BLUE', 'saturday', '17:00', '18:00'),
    s('Coone', 'BLUE', 'saturday', '18:00', '19:00'),
    s('D-Block & S-te-Fan', 'BLUE', 'saturday', '19:00', '20:00'),
    s('Sickmode', 'BLUE', 'saturday', '20:00', '23:00', 'Endshow'),

    s('Radical Redemption', 'BLACK', 'saturday', '11:00', '12:30'),
    s('Miss K8', 'BLACK', 'saturday', '12:30', '14:00'),
    s('N-Vitral', 'BLACK', 'saturday', '14:00', '15:30'),
    s('Gunz for Hire', 'BLACK', 'saturday', '15:30', '17:00'),
    s('Partyraiser', 'BLACK', 'saturday', '17:00', '18:30'),

    s('Sefa', 'YELLOW', 'saturday', '11:00', '12:30'),
    s('Dr. Peacock', 'YELLOW', 'saturday', '12:30', '14:00'),

    // ===== SUNDAY — CLOSING CEREMONY =====
    s('Brennan Heart', 'RED', 'sunday', '11:00', '12:00'),
    s('Refuzion', 'RED', 'sunday', '12:00', '13:00'),
    s('Atmozfears', 'RED', 'sunday', '13:00', '14:00'),
    s('Phuture Noize', 'RED', 'sunday', '14:00', '15:00'),
    s('Wildstylez', 'RED', 'sunday', '15:00', '16:00'),
    s('D-Block & S-te-Fan', 'RED', 'sunday', '16:00', '17:00'),
    s('Headhunterz', 'RED', 'sunday', '17:00', '18:00'),
    s('Sound Rush', 'RED', 'sunday', '18:00', '23:00', 'Closing Ceremony (5h)'),

    s('Coone', 'BLUE', 'sunday', '11:00', '12:00'),
    s('Da Tweekaz', 'BLUE', 'sunday', '12:00', '13:00'),
    s('Rooler', 'BLUE', 'sunday', '13:00', '14:00'),
    s('Warface', 'BLUE', 'sunday', '14:00', '15:00'),
    s('Rebelion', 'BLUE', 'sunday', '15:00', '16:00'),
    s('Sub Zero Project', 'BLUE', 'sunday', '16:00', '17:00'),
    s('D-Sturb', 'BLUE', 'sunday', '17:00', '18:00'),
    s('Ran-D', 'BLUE', 'sunday', '18:00', '19:00'),
    s('Sickmode', 'BLUE', 'sunday', '19:00', '23:00', 'Endshow'),

    s('Angerfist', 'BLACK', 'sunday', '11:00', '12:30'),
    s('Miss K8', 'BLACK', 'sunday', '12:30', '14:00'),
    s('N-Vitral', 'BLACK', 'sunday', '14:00', '15:30'),
    s('Partyraiser', 'BLACK', 'sunday', '15:30', '17:00'),
  ],
}

export default edition2024
