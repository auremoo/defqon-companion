export interface DefqonColor {
  id: string
  name: string
  bpm: string
  artists: string[]
  hex: string
  spotifyTrackId?: string
  spotifyTrackLabel?: string
  spotify?: string
  youtube?: string
  apple?: string
  deezer?: string
  soundcloud?: string
}

export const colors: DefqonColor[] = [
  {
    id: 'red',
    name: 'RED',
    bpm: '150–160',
    artists: ['Headhunterz', 'Wildstylez', 'D-Block & S-te-Fan', 'Sound Rush', 'Sub Zero Project'],
    hex: '#e63946',
    spotifyTrackId: '0JAwAgwSP2GT9dfngdvUFZ',
    spotifyTrackLabel: 'Headhunterz — Dragonborn',
    spotify: 'https://open.spotify.com/search/defqon%20red%20euphoric%20hardstyle',
    youtube: 'https://www.youtube.com/results?search_query=defqon+red+stage',
    apple: 'https://music.apple.com/search?term=euphoric+hardstyle+defqon',
    deezer: 'https://www.deezer.com/search/euphoric%20hardstyle%20defqon',
  },
  {
    id: 'blue',
    name: 'BLUE',
    bpm: '150–160',
    artists: ['Warface', 'B-Front', 'Rebelion', 'Act of Rage', 'Ran-D'],
    hex: '#1d3557',
    spotifyTrackId: '1UymZaSfQII4vUkz4U5btm',
    spotifyTrackLabel: 'D-Sturb & Sefa — Nothing Like The Oldschool',
    spotify: 'https://open.spotify.com/search/defqon%20blue%20raw%20hardstyle',
    youtube: 'https://www.youtube.com/results?search_query=defqon+blue+raw+stage',
    apple: 'https://music.apple.com/search?term=raw+hardstyle',
    deezer: 'https://www.deezer.com/search/raw%20hardstyle',
  },
  {
    id: 'black',
    name: 'BLACK',
    bpm: '160–200',
    artists: ['Angerfist', 'Miss K8', 'Destructive Tendencies', 'Nosferatu', 'Dr. Peacock'],
    hex: '#111111',
    spotifyTrackId: '7s110BVIPaRVSvmUCj0JPD',
    spotifyTrackLabel: 'Angerfist — Solid Stigma',
    spotify: 'https://open.spotify.com/search/defqon%20black%20hardcore',
    youtube: 'https://www.youtube.com/results?search_query=defqon+black+hardcore+stage',
    apple: 'https://music.apple.com/search?term=hardcore+defqon',
    deezer: 'https://www.deezer.com/search/hardcore%20defqon',
  },
  {
    id: 'yellow',
    name: 'YELLOW',
    bpm: '190–250+',
    artists: ['Sefa', 'Dr. Peacock', 'Billx', 'Partyraiser', 'The Speed Freak'],
    hex: '#f4a261',
    spotifyTrackId: '5mcCXajUIebp1q1OEJgo9Z',
    spotifyTrackLabel: 'Sefa — Requiem For Frenchcore',
    spotify: 'https://open.spotify.com/search/frenchcore%20uptempo%20defqon',
    youtube: 'https://www.youtube.com/results?search_query=defqon+yellow+frenchcore',
    apple: 'https://music.apple.com/search?term=frenchcore+uptempo',
    deezer: 'https://www.deezer.com/search/frenchcore%20uptempo',
  },
  {
    id: 'indigo',
    name: 'INDIGO',
    bpm: '150–165',
    artists: ['Radical Redemption', 'Digital Punk', 'E-Force', 'Rooler', 'Vertex'],
    hex: '#4a00e0',
    spotifyTrackId: '3wm8Rei9gYJRGKfWVCAB2x',
    spotifyTrackLabel: 'Rebelion — DAS IST KEIN TECHNO',
    spotify: 'https://open.spotify.com/search/extra%20raw%20hardstyle',
    youtube: 'https://www.youtube.com/results?search_query=defqon+indigo+extra+raw',
    apple: 'https://music.apple.com/search?term=extra+raw+hardstyle',
    deezer: 'https://www.deezer.com/search/extra%20raw%20hardstyle',
  },
  {
    id: 'magenta',
    name: 'MAGENTA',
    bpm: '140–155',
    artists: ['Technoboy', 'Tuneboy', 'The Prophet', 'Showtek', 'Brennan Heart'],
    hex: '#e040a0',
    spotifyTrackId: '10ZpPhFc9rMNdlyW3WsL0s',
    spotifyTrackLabel: 'Headhunterz — Scrap Attack (Defqon.1 Anthem 2009)',
    spotify: 'https://open.spotify.com/search/early%20hardstyle%20classics',
    youtube: 'https://www.youtube.com/results?search_query=defqon+magenta+early+hardstyle',
    apple: 'https://music.apple.com/search?term=early+hardstyle+classics',
    deezer: 'https://www.deezer.com/search/early%20hardstyle%20classics',
  },
  {
    id: 'silver',
    name: 'SILVER',
    bpm: '170–200',
    artists: ['Sei2ure', 'Tymon', 'Drokz', 'The Outside Agency', 'Ophidian'],
    hex: '#a8a8a8',
    spotifyTrackId: '7k1775YU8KGkwCcmJHyiUf',
    spotifyTrackLabel: 'Ophidian — Dark Euphoria',
    spotify: 'https://open.spotify.com/search/industrial%20hardcore',
    youtube: 'https://www.youtube.com/results?search_query=defqon+silver+industrial',
    apple: 'https://music.apple.com/search?term=industrial+hardcore',
    deezer: 'https://www.deezer.com/search/industrial%20hardcore',
  },
  {
    id: 'gold',
    name: 'GOLD',
    bpm: '150–180',
    artists: ['Paul Elstak', 'Darkraver', 'Neophyte', 'Evil Activities', 'Korsakoff'],
    hex: '#d4a20a',
    spotifyTrackId: '2YH2qTSiCGvVexz8Zv21HN',
    spotifyTrackLabel: '3 Steps Ahead — Drop It',
    spotify: 'https://open.spotify.com/search/early%20rave%20gabber%20hardcore',
    youtube: 'https://www.youtube.com/results?search_query=defqon+gold+early+rave',
    apple: 'https://music.apple.com/search?term=early+rave+gabber',
    deezer: 'https://www.deezer.com/search/early%20rave%20gabber',
  },
  {
    id: 'purple',
    name: 'PURPLE',
    bpm: '150–170',
    artists: ['Emerging DJs', 'Contest winners', 'Rising producers'],
    hex: '#7b2d8e',
    spotifyTrackId: '7e9UdKyi2yOawX2MNSBCIv',
    spotifyTrackLabel: 'Refuzion & POPR3B3L — Hardstyle DNA 2024',
    spotify: 'https://open.spotify.com/search/new%20hardstyle%20talent',
    youtube: 'https://www.youtube.com/results?search_query=defqon+purple+talent+stage',
    apple: 'https://music.apple.com/search?term=new+hardstyle+talent',
    deezer: 'https://www.deezer.com/search/new%20hardstyle%20talent',
  },
]
