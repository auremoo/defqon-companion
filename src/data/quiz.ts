export type QuizCategory = 'history' | 'artists' | 'music' | 'vocabulary' | 'festival'

export interface QuizQuestion {
  id: string
  category: QuizCategory
  question: string
  answers: string[]
  correct: number
  explanation: string
}

export const questions: QuizQuestion[] = [
  // ─── History ───────────────────────────────────────────────────────────────
  {
    id: 'h1',
    category: 'history',
    question: 'In what year was the very first Defqon.1 festival held?',
    answers: ['2001', '2003', '2005', '2007'],
    correct: 1,
    explanation: 'Defqon.1 was first held in 2003 in Almere, Netherlands, organized by Q-dance.',
  },
  {
    id: 'h2',
    category: 'history',
    question: 'What does "Defqon" stand for or reference?',
    answers: ['Defense Condition (military readiness scale)', 'Define the Condition', 'Defend the Queen', 'Digital Frequency Controller'],
    correct: 0,
    explanation: 'Defqon references DEFCON, the US military Defense Readiness Condition scale — representing maximum intensity.',
  },
  {
    id: 'h3',
    category: 'history',
    question: 'Which company organizes Defqon.1?',
    answers: ['ID&T', 'Q-dance', 'Insomniac', 'Mysteryland'],
    correct: 1,
    explanation: 'Q-dance has organized Defqon.1 since its first edition in 2003.',
  },
  {
    id: 'h4',
    category: 'history',
    question: 'Where is Defqon.1 held since its permanent move?',
    answers: ['Almere, Netherlands', 'Biddinghuizen, Netherlands', 'Utrecht, Netherlands', 'Rotterdam, Netherlands'],
    correct: 1,
    explanation: 'Defqon.1 is held at the Walibi Holland theme park in Biddinghuizen.',
  },
  {
    id: 'h5',
    category: 'history',
    question: 'What iconic moment ends every Defqon.1 edition?',
    answers: ['The Opening Ceremony', 'The Power Hour Endshow', 'The Color Parade', 'The Final Countdown'],
    correct: 1,
    explanation: 'The Power Hour Endshow is the legendary finale where all stages sync to play one last massive set together.',
  },
  {
    id: 'h6',
    category: 'history',
    question: 'What was the theme of Defqon.1 2026?',
    answers: ['Where Legends Rise', 'The Awakening', 'Sacred Oath', 'Worlds Collide'],
    correct: 2,
    explanation: '"Sacred Oath" is the official theme of Defqon.1 2026.',
  },
  {
    id: 'h7',
    category: 'history',
    question: 'Q-dance was founded in which year?',
    answers: ['1997', '1999', '2001', '2003'],
    correct: 1,
    explanation: 'Q-dance was founded in 1999 in the Netherlands, initially organizing raves before expanding to major festivals.',
  },

  // ─── Artists ───────────────────────────────────────────────────────────────
  {
    id: 'a1',
    category: 'artists',
    question: "What is Headhunterz's real name?",
    answers: ['Fabian Bohn', 'Willem Rebergen', 'Joey Reinders', 'Joram Metekohy'],
    correct: 1,
    explanation: 'Headhunterz is Willem Rebergen, one of the most iconic euphoric hardstyle producers from the Netherlands.',
  },
  {
    id: 'a2',
    category: 'artists',
    question: 'Which duo forms D-Block & S-te-Fan?',
    answers: ['Diederik Bakker & Stefan den Daas', 'David Block & Stefan Fans', 'Danny Black & Sam Fens', 'Diego Blanco & Sven Franz'],
    correct: 0,
    explanation: 'D-Block & S-te-Fan are Diederik Bakker and Stefan den Daas, two legendary Dutch euphoric hardstyle producers.',
  },
  {
    id: 'a3',
    category: 'artists',
    question: 'What subgenre is Angerfist primarily known for?',
    answers: ['Euphoric Hardstyle', 'Raw Hardstyle', 'Hardcore / Gabber', 'Frenchcore'],
    correct: 2,
    explanation: 'Angerfist (Danny Masseling) is one of the biggest names in hardcore/gabber music.',
  },
  {
    id: 'a4',
    category: 'artists',
    question: 'Which artist is known for the track "I Am Hardstyle"?',
    answers: ['Wildstylez', 'Headhunterz', 'Brennan Heart', 'Showtek'],
    correct: 1,
    explanation: '"I Am Hardstyle" is one of Headhunterz\'s most iconic anthems, defining the sound of an era.',
  },
  {
    id: 'a5',
    category: 'artists',
    question: "What is Brennan Heart's real name?",
    answers: ['Fabian Bohn', 'Bas Oskam', 'Mark Lentje', 'Joey Reinders'],
    correct: 0,
    explanation: 'Brennan Heart is Fabian Bohn, a major figure in euphoric hardstyle from the Netherlands.',
  },
  {
    id: 'a6',
    category: 'artists',
    question: 'Sefa is primarily known for which fast-paced genre?',
    answers: ['Euphoric Hardstyle', 'Raw Hardstyle', 'Frenchcore / Uptempo', 'Hard Trance'],
    correct: 2,
    explanation: 'Sefa (Josefa Scholte) is a top Frenchcore/uptempo DJ & producer known for blistering fast sets.',
  },
  {
    id: 'a7',
    category: 'artists',
    question: 'Which artist pair formed "Gunz for Hire"?',
    answers: ['Headhunterz & Wildstylez', 'Headhunterz & Brennan Heart', 'Brennan Heart & Wildstylez', 'B-Front & Ran-D'],
    correct: 1,
    explanation: 'Gunz for Hire is the b2b project of Headhunterz and Brennan Heart.',
  },
  {
    id: 'a8',
    category: 'artists',
    question: 'What is Wildstylez\'s real name?',
    answers: ['Joram Metekohy', 'Willem Rebergen', 'Jordy Timmermans', 'Niels de Wit'],
    correct: 0,
    explanation: 'Wildstylez is Joram Metekohy, a key figure in euphoric hardstyle and the Project One collaboration.',
  },

  // ─── Music ─────────────────────────────────────────────────────────────────
  {
    id: 'm1',
    category: 'music',
    question: 'What is the typical BPM range for Euphoric Hardstyle?',
    answers: ['130–140 BPM', '150–160 BPM', '170–180 BPM', '190–200 BPM'],
    correct: 1,
    explanation: 'Euphoric hardstyle typically runs at 150–160 BPM, combining melodic leads with powerful kicks.',
  },
  {
    id: 'm2',
    category: 'music',
    question: 'What is a "reverse bass" in hardstyle?',
    answers: ['A reversed drum loop', 'A signature bass sound that reverses and builds tension', 'Playing bass notes backwards in the mix', 'A silent bass drop'],
    correct: 1,
    explanation: 'The reverse bass is the iconic swooping sound in hardstyle that builds tension before the kick drops.',
  },
  {
    id: 'm3',
    category: 'music',
    question: 'Frenchcore typically reaches what BPM range?',
    answers: ['150–160 BPM', '160–170 BPM', '175–190 BPM', '190–250+ BPM'],
    correct: 3,
    explanation: 'Frenchcore pushes well above 190 BPM, often reaching 200–250+ with distorted kicks and intense energy.',
  },
  {
    id: 'm4',
    category: 'music',
    question: 'What is the "breakdown" in a hardstyle track?',
    answers: ['When the DJ cuts the music abruptly', 'The soft melodic section before the main drop', 'The hardest part of the track', 'The final beat of a set'],
    correct: 1,
    explanation: 'The breakdown is the emotional, melodic section that builds atmosphere before unleashing the main kick drop.',
  },
  {
    id: 'm5',
    category: 'music',
    question: 'What distinguishes "Raw Hardstyle" from Euphoric Hardstyle?',
    answers: ['Raw is slower (100–120 BPM)', 'Raw has darker, distorted kicks and no melodic elements', 'Raw uses only synthesizers', 'Raw is always played at underground venues'],
    correct: 1,
    explanation: 'Raw hardstyle features heavier, more distorted kicks, darker atmospheres, and less focus on melodic euphoria compared to euphoric hardstyle.',
  },
  {
    id: 'm6',
    category: 'music',
    question: 'What is a hardstyle "anthem"?',
    answers: ['A generic term for any hardstyle track', 'The official track of a festival edition, released specifically for the event', 'A track played at 160 BPM or above', 'The closing track of any DJ set'],
    correct: 1,
    explanation: 'A festival anthem is the specially commissioned official track of a Defqon.1 edition, revealed live at the event.',
  },
  {
    id: 'm7',
    category: 'music',
    question: 'What genre is played at the BLACK stage at Defqon.1?',
    answers: ['Euphoric Hardstyle', 'Raw Hardstyle', 'Hardcore', 'Frenchcore'],
    correct: 2,
    explanation: 'The BLACK stage is home to hardcore — faster BPMs, distorted kicks, and relentless energy.',
  },

  // ─── Vocabulary ────────────────────────────────────────────────────────────
  {
    id: 'v1',
    category: 'vocabulary',
    question: 'What does "POWER HOUR" refer to at Defqon.1?',
    answers: ['The first hour when the festival opens', 'The final hour where all stages sync and play together', 'An energy drink sponsor segment', 'The loudest hour of the day'],
    correct: 1,
    explanation: 'The Power Hour is the legendary final segment of Defqon.1 where all stages transition into one synchronized massive endshow.',
  },
  {
    id: 'v2',
    category: 'vocabulary',
    question: 'What is a "gabber"?',
    answers: ['A Dutch word for friend, also referring to hardcore music fans', 'A mixing technique for layering tracks', 'A type of reverb effect used in hardstyle', 'A festival security term'],
    correct: 0,
    explanation: '"Gabber" means "friend/mate" in Dutch slang and refers to the early hardcore scene and its fans who originated this music.',
  },
  {
    id: 'v3',
    category: 'vocabulary',
    question: 'What is the "Melbourne Shuffle"?',
    answers: ['A ticketing system from Australia', 'A dance style popular in the hardstyle community', 'A DJ technique of rapid song transitions', 'A type of stage layout'],
    correct: 1,
    explanation: 'The Melbourne Shuffle is a running-in-place dance style with heel-toe movements, hugely popular at hardstyle events worldwide.',
  },
  {
    id: 'v4',
    category: 'vocabulary',
    question: 'What is a "screeche" in hardstyle production?',
    answers: ['A sample from a guitar', 'A high-pitched stabbing lead sound characteristic of raw hardstyle', 'An off-key vocal ad-lib', 'The feedback from a monitor'],
    correct: 1,
    explanation: 'Screech/screeches are the razor-sharp, high-pitched stabbing synth sounds that define raw hardstyle\'s aggressive character.',
  },
  {
    id: 'v5',
    category: 'vocabulary',
    question: 'What is an "anti-climax" in hardstyle?',
    answers: ['When a festival is cancelled', 'A track structure where the kick never fully drops, building frustration', 'The end section after the main drop', 'When an artist plays under a fake name'],
    correct: 2,
    explanation: 'In hardstyle, the anti-climax is the closing section after the main peak — it winds the track down after the biggest energy moment.',
  },
  {
    id: 'v6',
    category: 'vocabulary',
    question: 'What does "Dediqated" refer to in the Q-dance ecosystem?',
    answers: ['A fan club membership for the most loyal festival-goers', 'A backstage security clearance', 'A premium camping zone', 'A DJ agency'],
    correct: 0,
    explanation: '"Dediqated" is Q-dance\'s loyalty program for their most devoted fans — recognizing years of attendance and community participation.',
  },

  // ─── Festival ──────────────────────────────────────────────────────────────
  {
    id: 'f1',
    category: 'festival',
    question: 'Which stage at Defqon.1 is considered the main stage?',
    answers: ['BLUE', 'BLACK', 'RED', 'GOLD'],
    correct: 2,
    explanation: 'RED is the iconic main stage — the heart of Defqon.1 where the biggest acts perform and the anthem is revealed.',
  },
  {
    id: 'f2',
    category: 'festival',
    question: 'What age restriction applies to Defqon.1?',
    answers: ['16+', '17+', '18+', '21+'],
    correct: 2,
    explanation: 'Defqon.1 is an 18+ event, requiring valid ID for entry to the festival grounds.',
  },
  {
    id: 'f3',
    category: 'festival',
    question: 'The YELLOW stage at Defqon.1 specializes in which genre?',
    answers: ['Euphoric Hardstyle', 'Raw Hardstyle', 'Frenchcore / Uptempo / Terror', 'Hard Trance'],
    correct: 2,
    explanation: 'YELLOW is the domain of Frenchcore, uptempo, and terror — ultra-fast genres with blistering BPMs.',
  },
  {
    id: 'f4',
    category: 'festival',
    question: 'Defqon.1 is hosted at which theme park venue?',
    answers: ['Efteling', 'Walibi Holland', 'Toverland', 'Plopsaland'],
    correct: 1,
    explanation: 'Defqon.1 takes place at the Walibi Holland theme park in Biddinghuizen, Netherlands.',
  },
]

export const categoryColors: Record<QuizCategory, string> = {
  history: '#e63946',
  artists: '#4a00e0',
  music: '#e040a0',
  vocabulary: '#16a34a',
  festival: '#d4a20a',
}

export const categoryLabels: Record<QuizCategory, string> = {
  history: 'History',
  artists: 'Artists',
  music: 'Music',
  vocabulary: 'Vocabulary',
  festival: 'Festival',
}
