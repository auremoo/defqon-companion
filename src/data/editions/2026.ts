import type { Edition } from './index'
import { lineup, stagesPerDay } from '../lineup'

const edition2026: Edition = {
  year: 2026,
  theme: 'Sacred Oath',
  anthem: 'D-Sturb ft. E-Life — Sacred Oath',
  startDate: '2026-06-25T18:00:00+02:00',
  endDate: '2026-06-28T23:00:00+02:00',
  location: 'Biddinghuizen, Netherlands',
  isCurrent: true,
  cancelled: true,
  keyFacts: [
    'First-ever Code Red heat warning in Netherlands history (38–40 °C)',
    'The Gathering (Thursday) took place — festival cancelled at midnight 26/06',
    'Full ticket refunds issued by Q-dance',
    'Anthem: D-Sturb ft. E-Life — Sacred Oath',
  ],
  stagesPerDay,
  lineup,
}

export default edition2026
