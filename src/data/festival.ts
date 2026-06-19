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
  category: 'bracelet' | 'essentials' | 'camping' | 'vetements' | 'hygiene' | 'comfort'
  labelKey: string
  label: string
  checked: boolean
  custom?: boolean
}

export const defaultChecklist: ChecklistItem[] = [
  // Bracelet
  { id: 'bracelet-received',    category: 'bracelet',   labelKey: 'braceletReceived',    label: 'Bracelet reçu', checked: false },
  { id: 'bracelet-registered',  category: 'bracelet',   labelKey: 'braceletRegistered',  label: 'Enregistrer le bracelet sur le compte Q-dance', checked: false },
  { id: 'bracelet-cashless',    category: 'bracelet',   labelKey: 'braceletCashless',    label: 'Recharger le cashless RFID', checked: false },
  { id: 'bracelet-ref',         category: 'bracelet',   labelKey: 'braceletRef',         label: 'Noter le numéro de référence du bracelet', checked: false },

  // Essentiels
  { id: 'ticket',      category: 'essentials', labelKey: 'ticket',      label: 'Billet / invitation festival', checked: false },
  { id: 'id',          category: 'essentials', labelKey: 'id',          label: 'Carte d\'identité / Passeport', checked: false },
  { id: 'phone',       category: 'essentials', labelKey: 'phone',       label: 'Téléphone + chargeur', checked: false },
  { id: 'powerbank',   category: 'essentials', labelKey: 'powerbank',   label: 'Batterie externe', checked: false },
  { id: 'cash',        category: 'essentials', labelKey: 'cash',        label: 'Liquide / carte bancaire', checked: false },
  { id: 'earplugs',    category: 'essentials', labelKey: 'earplugs',    label: 'Bouchons d\'oreilles', checked: false },
  { id: 'bumbag',      category: 'essentials', labelKey: 'bumbag',      label: 'Banane', checked: false },

  // Camping
  { id: 'tent',           category: 'camping', labelKey: 'tent',          label: 'Tente', checked: false },
  { id: 'sleeping-bag',   category: 'camping', labelKey: 'sleepingBag',   label: 'Sac de couchage', checked: false },
  { id: 'mattress',       category: 'camping', labelKey: 'mattress',      label: 'Matelas gonflable', checked: false },
  { id: 'flashlight',     category: 'camping', labelKey: 'flashlight',    label: 'Lampe de poche / frontale', checked: false },
  { id: 'towel',          category: 'camping', labelKey: 'towel',         label: 'Serviette', checked: false },
  { id: 'meals',          category: 'camping', labelKey: 'meals',         label: 'Repas', checked: false },
  { id: 'chairs',         category: 'camping', labelKey: 'chairs',        label: 'Chaises pliantes', checked: false },
  { id: 'padlock',        category: 'camping', labelKey: 'padlock',       label: 'Cadenas', checked: false },
  { id: 'cutlery',        category: 'camping', labelKey: 'cutlery',       label: 'Couverts', checked: false },
  { id: 'ground-mat',     category: 'camping', labelKey: 'groundMat',     label: 'Tapis pour s\'asseoir', checked: false },
  { id: 'defqon-goodies', category: 'camping', labelKey: 'defqonGoodies', label: 'Goodies Defqon de l\'an passé', checked: false },

  // Vêtements
  { id: 'tshirts',    category: 'vetements', labelKey: 'tshirts',    label: '5 t-shirts', checked: false },
  { id: 'underwear',  category: 'vetements', labelKey: 'underwear',  label: '5 caleçons et chaussettes', checked: false },
  { id: 'sweaters',   category: 'vetements', labelKey: 'sweaters',   label: '2 pulls', checked: false },
  { id: 'shorts',     category: 'vetements', labelKey: 'shorts',     label: 'Shorts', checked: false },
  { id: 'jogger',     category: 'vetements', labelKey: 'jogger',     label: 'Jogging ou pantalon', checked: false },
  { id: 'cap',        category: 'vetements', labelKey: 'cap',        label: 'Casquette', checked: false },
  { id: 'gloves',     category: 'vetements', labelKey: 'gloves',     label: 'Gants', checked: false },
  { id: 'sneakers',   category: 'vetements', labelKey: 'sneakers',   label: '2 paires de chaussures', checked: false },
  { id: 'flip-flops', category: 'vetements', labelKey: 'flipFlops',  label: 'Claquettes', checked: false },

  // Hygiène
  { id: 'soap',          category: 'hygiene', labelKey: 'soap',          label: 'Savon', checked: false },
  { id: 'toilet-paper',  category: 'hygiene', labelKey: 'toiletPaper',   label: 'Papier toilette', checked: false },
  { id: 'toothbrush',    category: 'hygiene', labelKey: 'toothbrush',    label: 'Brosse à dent et dentifrice', checked: false },
  { id: 'moisturizer',   category: 'hygiene', labelKey: 'moisturizer',   label: 'Crème hydratante', checked: false },

  // Confort & Santé
  { id: 'sunscreen',   category: 'comfort', labelKey: 'sunscreen',  label: 'Crème solaire', checked: false },
  { id: 'rain-gear',   category: 'comfort', labelKey: 'rainGear',   label: 'Poncho / veste de pluie', checked: false },
  { id: 'glasses',     category: 'comfort', labelKey: 'glasses',    label: 'Lunettes', checked: false },
  { id: 'water-bottle',category: 'comfort', labelKey: 'waterBottle',label: 'Bouteille d\'eau réutilisable', checked: false },
  { id: 'first-aid',   category: 'comfort', labelKey: 'firstAid',   label: 'Trousse de premiers secours (doliprane, ibuprofène, antihistaminique, désensibilisation)', checked: false },
  { id: 'caffeine',    category: 'comfort', labelKey: 'caffeine',   label: 'Sachets de caféine', checked: false },
  { id: 'cigarettes',  category: 'comfort', labelKey: 'cigarettes', label: 'Cigarettes + briquet', checked: false },
]
