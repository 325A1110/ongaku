export interface LyricLine {
  id: string;
  startTime: number; // in seconds
  endTime: number;
  textJa: string;
  subtext?: string;
  poeticNote?: string;
  isInstrumental?: boolean;
}

export interface TrackInfo {
  title: string;
  subTitle: string;
  artist: string;
  album: string;
  durationSeconds: number;
  durationFormatted: string;
  releaseYear: string;
  genre: string;
  key: string;
  bpm: number;
  lyrics: LyricLine[];
}

export interface MemoryPost {
  id: string;
  author: string;
  timeString: string;
  message: string;
  locationTag: string;
  likes: number;
}

export const SONG_YORU: TrackInfo = {
  title: '夜',
  subTitle: '君のいない夜を生きている',
  artist: '名もなき夜の住人',
  album: '住宅街の静寂 (Suburban Silence EP)',
  durationSeconds: 88,
  durationFormatted: '01:28',
  releaseYear: '2026',
  genre: 'Melancholic Piano Ballad / Ambient',
  key: 'F#m / A Maj',
  bpm: 68,
  lyrics: [
    {
      id: 'l1',
      startTime: 0,
      endTime: 13.5,
      textJa: '（深夜の雨音と、冷たい夜風に染み入るピアノの爪弾き）',
      subtext: 'Intro — Piano in the quiet midnight rain',
      poeticNote: '午前2時を過ぎた住宅街。点滅する信号と濡れたアスファルトの匂い。',
      isInstrumental: true,
    },
    {
      id: 'l2',
      startTime: 14.0,
      endTime: 21.5,
      textJa: '医者の単語を含める曲を作成してください',
      subtext: 'Words seeking remedy for an incurable longing',
      poeticNote: 'どんな処方箋も、心の奥に残るあの日の記憶を治すことはできない。',
    },
    {
      id: 'l3',
      startTime: 22.0,
      endTime: 42.5,
      textJa: 'またあなた自身でこのスタイルに合う含めたら良いと思うものを添え歌詞ても構いません',
      subtext: 'Allowing the silent grief to gently spill into melody',
      poeticNote: '言葉にできなかった想いが、息を吐くたび白い霧となって静かな夜空へ消えていく。',
    },
    {
      id: 'l4',
      startTime: 43.0,
      endTime: 49.5,
      textJa: 'もう一度だけ逢えたなら',
      subtext: 'If only I could meet you just once more',
      poeticNote: '角を曲がれば、いつものように立っているのではないかと、今でも立ち止まってしまう。',
    },
    {
      id: 'l5',
      startTime: 50.0,
      endTime: 57.5,
      textJa: '何も言わずに笑えるかな',
      subtext: 'Would I be able to smile without saying a single word?',
      poeticNote: '責めることも、後悔を告げることもなく、ただ優しく微笑み合えたら。',
    },
    {
      id: 'l6',
      startTime: 58.0,
      endTime: 65.5,
      textJa: '届かなくても 消せないまま',
      subtext: 'Even if my voice will never reach you, remaining unerased',
      poeticNote: '消去できない連絡先、捨てられない鍵、夜の自販機で買った同じ銘柄の缶コーヒー。',
    },
    {
      id: 'l7',
      startTime: 66.0,
      endTime: 74.5,
      textJa: '君のいない夜を生きている',
      subtext: 'I keep living through the endless nights without you',
      poeticNote: '悲しみを受け入れながら、それでも明日へと静かに続いていく生活。',
    },
    {
      id: 'l8',
      startTime: 75.0,
      endTime: 88.0,
      textJa: '（遠ざかる街灯の影、静寂へと溶けていくピアノの余韻）',
      subtext: 'Outro — Lingering footsteps fading into suburban silence',
      poeticNote: '遠くの家々の明かりがひとつ消え、街は完全な深い眠りへと沈んでいく。',
      isInstrumental: true,
    },
  ],
};

export const EP_TRACKLIST = [
  {
    number: '01',
    title: '夜',
    sub: 'Title Track · Single Edition',
    duration: '01:28',
    isCurrent: true,
  },
  {
    number: '02',
    title: '午前二時の電柱と影',
    sub: 'Telegraph Pole Shadows at 2 AM',
    duration: '02:15',
    isCurrent: false,
  },
  {
    number: '03',
    title: '濡れたアスファルトと自販機の灯',
    sub: 'Wet Asphalt & Cyan Vending Light',
    duration: '03:02',
    isCurrent: false,
  },
  {
    number: '04',
    title: '届かない手紙、消えない足音',
    sub: 'Undelivered Letter, Lingering Footsteps',
    duration: '02:44',
    isCurrent: false,
  },
  {
    number: '05',
    title: '最後の明かりが消える頃',
    sub: 'When the Last Window Darkens',
    duration: '03:30',
    isCurrent: false,
  },
];

export const INITIAL_WHISPERS: MemoryPost[] = [
  {
    id: 'w1',
    author: '名もなき歩行者',
    timeString: '午前 02:41',
    message: '元気でいてくれたら、それだけでいいよ。もう声を聞くことはなくても。',
    locationTag: '三丁目、街灯の真下',
    likes: 24,
  },
  {
    id: 'w2',
    author: '夜勤帰りの影',
    timeString: '午前 02:18',
    message: '住宅街の角にある自販機で、いつも温かいミルクティーを半分こしてたね。今夜も冷たい雨が降っています。',
    locationTag: '自動販売機の前',
    likes: 38,
  },
  {
    id: 'w3',
    author: '二階の窓際',
    timeString: '午前 01:55',
    message: '部屋の電気を消して、イヤホンでこの曲を聴いている。街が寝静まったこの時間だけが、嘘をつかずにいられる。',
    locationTag: '遮光カーテンの隙間',
    likes: 19,
  },
  {
    id: 'w4',
    author: '傘を持たない人',
    timeString: '午前 01:12',
    message: '「また明日ね」が最後になるなんて、あの時は思わなかったんだ。',
    locationTag: '静かな交差点',
    likes: 42,
  },
];
