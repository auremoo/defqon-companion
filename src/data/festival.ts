export const festival = {
  name: 'Defqon.1',
  year: 2026,
  theme: 'Sacred Oath',
  startDate: '2026-06-25T18:00:00+02:00',
  endDate: '2026-06-28T23:00:00+02:00',
  location: 'Biddinghuizen, Netherlands',
  venue: 'Walibi Holland',
  schedule: [
    { day: 'Thursday', label: 'The Gathering', hours: '18:00 – 23:00' },
    { day: 'Friday', hours: '11:00 – 23:00' },
    { day: 'Saturday', hours: '11:00 – 23:00' },
    { day: 'Sunday', label: 'Closing Ceremony', hours: '11:00 – 23:00' },
  ],
  ageRestriction: '18+',
  // Attendance figures — updated manually after each edition (official press releases)
  attendance: {
    perDayRecord: 65_000,   // record single day (2019)
    totalEditionRecord: 230_000, // record total weekend (2019)
    perDayTypical: 55_000,
    totalTypical: 220_000,
  },
  firstEditionYear: 2003,
}

export interface ChecklistItem {
  id: string
  category: 'bracelet' | 'essentials' | 'camping' | 'comfort'
  labelKey: string
  label: string
  checked: boolean
  custom?: boolean
}

export const defaultChecklist: ChecklistItem[] = [
  // Bracelet
  { id: 'bracelet-received', category: 'bracelet', labelKey: 'braceletReceived', label: 'Bracelet received', checked: false },
  { id: 'bracelet-registered', category: 'bracelet', labelKey: 'braceletRegistered', label: 'Register bracelet on Q-dance account', checked: false },
  { id: 'bracelet-cashless', category: 'bracelet', labelKey: 'braceletCashless', label: 'Top up RFID cashless', checked: false },
  { id: 'bracelet-color', category: 'bracelet', labelKey: 'braceletColor', label: 'Check bracelet color & access zones', checked: false },
  { id: 'bracelet-ref', category: 'bracelet', labelKey: 'braceletRef', label: 'Note your bracelet reference number', checked: false },

  { id: 'ticket', category: 'essentials', labelKey: 'ticket', label: 'Festival ticket / invitation', checked: false },
  { id: 'id', category: 'essentials', labelKey: 'id', label: 'ID / Passport', checked: false },
  { id: 'phone', category: 'essentials', labelKey: 'phone', label: 'Phone + charger', checked: false },
  { id: 'powerbank', category: 'essentials', labelKey: 'powerbank', label: 'Power bank', checked: false },
  { id: 'cash', category: 'essentials', labelKey: 'cash', label: 'Cash / payment card', checked: false },
  { id: 'earplugs', category: 'essentials', labelKey: 'earplugs', label: 'Earplugs', checked: false },

  { id: 'tent', category: 'camping', labelKey: 'tent', label: 'Tent', checked: false },
  { id: 'sleeping-bag', category: 'camping', labelKey: 'sleepingBag', label: 'Sleeping bag', checked: false },
  { id: 'mattress', category: 'camping', labelKey: 'mattress', label: 'Air mattress / sleeping pad', checked: false },
  { id: 'flashlight', category: 'camping', labelKey: 'flashlight', label: 'Flashlight / headlamp', checked: false },
  { id: 'towel', category: 'camping', labelKey: 'towel', label: 'Towel', checked: false },

  { id: 'sunscreen', category: 'comfort', labelKey: 'sunscreen', label: 'Sunscreen', checked: false },
  { id: 'rain-gear', category: 'comfort', labelKey: 'rainGear', label: 'Rain poncho / jacket', checked: false },
  { id: 'sneakers', category: 'comfort', labelKey: 'sneakers', label: 'Comfortable shoes', checked: false },
  { id: 'water-bottle', category: 'comfort', labelKey: 'waterBottle', label: 'Reusable water bottle', checked: false },
  { id: 'first-aid', category: 'comfort', labelKey: 'firstAid', label: 'Basic first aid kit', checked: false },
]
