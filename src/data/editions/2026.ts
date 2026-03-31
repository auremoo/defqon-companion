import type { Edition } from './index'
import { lineup, stagesPerDay } from '../lineup'

const edition2026: Edition = {
  year: 2026,
  theme: 'Sacred Oath',
  startDate: '2026-06-25T18:00:00+02:00',
  endDate: '2026-06-28T23:00:00+02:00',
  location: 'Biddinghuizen, Netherlands',
  isCurrent: true,
  stagesPerDay,
  lineup,
}

export default edition2026
