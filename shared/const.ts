export const UNAUTHED_ERR_MSG = 'UNAUTHORIZED';

export type LevelKey = 'bronze' | 'silver' | 'gold' | 'diamond' | 'crown';

export interface Level {
  code: LevelKey;
  name: string;
  nameAr: string;
  icon: string;
  minPoints: number;
}

export const LEVELS: Record<LevelKey, Level> = {
  bronze:  { code: 'bronze',  name: 'Bronze',  nameAr: 'برونز', icon: '🥉', minPoints: 0    },
  silver:  { code: 'silver',  name: 'Silver',  nameAr: 'فضي',   icon: '🥈', minPoints: 100  },
  gold:    { code: 'gold',    name: 'Gold',    nameAr: 'ذهبي',  icon: '🥇', minPoints: 300  },
  diamond: { code: 'diamond', name: 'Diamond', nameAr: 'ألماس', icon: '💎', minPoints: 600  },
  crown:   { code: 'crown',   name: 'Crown',   nameAr: 'تاج',   icon: '👑', minPoints: 1000 },
};

export const LEVEL_ORDER: LevelKey[] = ['bronze', 'silver', 'gold', 'diamond', 'crown'];

export function getCurrentLevel(points: number): LevelKey {
  return [...LEVEL_ORDER].reverse().find(k => points >= LEVELS[k].minPoints) ?? 'bronze';
}

export function getNextLevel(points: number): Level | null {
  const cur = getCurrentLevel(points);
  const idx = LEVEL_ORDER.indexOf(cur);
  return LEVEL_ORDER[idx + 1] ? LEVELS[LEVEL_ORDER[idx + 1]] : null;
}

export const POINTS = {
  LESSON_COMPLETE:   50,
  QUIZ_COMPLETE:     25,
  EXERCISE_COMPLETE: 10,
  DAILY_CHALLENGE:   15,
  STREAK_BONUS:       5,
} as const;

export interface Badge {
  id: string;
  icon: string;
  nameEn: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  condition: (p: { points: number; streak: number; completedLessons: string[]; quizScores: Record<string, number> }) => boolean;
}

export const BADGES: Badge[] = [
  {
    id: 'seven-day-streak', icon: '🔥',
    nameEn: '7-Day Streak', nameAr: '7 أيام متتالية',
    description: 'Study for 7 days in a row', descriptionAr: 'ادرس 7 أيام متتالية',
    condition: ({ streak }) => streak >= 7,
  },
  {
    id: 'perfect-score', icon: '⭐',
    nameEn: 'Perfect Score', nameAr: 'درجة كاملة',
    description: 'Get 100% on any quiz', descriptionAr: 'احصل على 100% في أي اختبار',
    condition: ({ quizScores }) => Object.values(quizScores).some(s => s === 100),
  },
  {
    id: 'word-master', icon: '📚',
    nameEn: 'Word Master', nameAr: 'سيد الكلمات',
    description: 'Complete all vocabulary cards', descriptionAr: 'أكمل جميع بطاقات المفردات',
    condition: ({ points }) => points >= 200,
  },
  {
    id: 'week-champion', icon: '🏆',
    nameEn: 'Week Champion', nameAr: 'بطل الأسبوع',
    description: 'Complete all 6 Week 1 lessons', descriptionAr: 'أكمل جميع دروس الأسبوع الأول',
    condition: ({ completedLessons }) => completedLessons.length >= 6,
  },
  {
    id: 'authentic-british', icon: '🎩',
    nameEn: 'Authentic British', nameAr: 'بريطاني أصيل',
    description: 'Reach Gold level', descriptionAr: 'ابلغ مستوى الذهبي',
    condition: ({ points }) => points >= 300,
  },
];

export interface Lesson {
  id: string;
  titleEn: string; titleAr: string;
  descriptionEn: string; descriptionAr: string;
  contentEn: string; contentAr: string;
  examples: { en: string; ar: string }[];
  mistakes: { wrong: string; correct: string; noteEn: string; noteAr: string }[];
  quizQuestion: string; quizQuestionAr: string;
  quizOptions: string[]; quizOptionsAr: string[];
  correctAnswer: number;
  icon: string;
}

export const LESSONS: Lesson[] = [
  {
    id: 'lesson-01', icon: '👤',
    titleEn: 'Pronouns', titleAr: 'الضمائر',
    descriptionEn: 'Master English pronouns — subject, object, and possessive.',
    descriptionAr: 'أتقن ضمائر اللغة الإنجليزية — الفاعل والمفعول والملكية.',
    contentEn: 'Pronouns replace nouns to avoid repetition. Subject pronouns (I, you, he, she, it, we, they) act as the subject. Object pronouns (me, you, him, her, it, us, them) receive the action. Possessive pronouns (mine, yours, his, hers, ours, theirs) show ownership.',
    contentAr: 'الضمائر تحل محل الأسماء لتجنب التكرار. ضمائر الفاعل تعمل كفاعل. ضمائر المفعول تستقبل الفعل. ضمائر الملكية تدل على الملكية.',
    examples: [
      { en: 'She gave him the book.', ar: 'هي أعطته الكتاب.' },
      { en: 'The car is mine.', ar: 'السيارة ملكي.' },
      { en: 'They told us the answer.', ar: 'أخبرونا بالإجابة.' },
    ],
    mistakes: [
      { wrong: 'Me and John went.', correct: 'John and I went.', noteEn: 'Use "I" as subject', noteAr: 'استخدم "I" كفاعل' },
      { wrong: 'Give it to I.', correct: 'Give it to me.', noteEn: 'Use "me" as object', noteAr: 'استخدم "me" كمفعول' },
      { wrong: 'Her and me went.', correct: 'She and I went.', noteEn: 'Both need subject form', noteAr: 'كلاهما يحتاج صيغة الفاعل' },
    ],
    quizQuestion: 'Which pronoun completes: "___ gave the book to her"?',
    quizQuestionAr: 'أي ضمير يكمل: "___ gave the book to her"؟',
    quizOptions: ['Me', 'Him', 'He', 'His'],
    quizOptionsAr: ['Me', 'Him', 'He', 'His'],
    correctAnswer: 2,
  },
  {
    id: 'lesson-02', icon: '🔵',
    titleEn: 'Verb To Be', titleAr: 'فعل To Be',
    descriptionEn: 'The most important verb in English — am, is, are, was, were.',
    descriptionAr: 'أهم فعل في اللغة الإنجليزية — am, is, are, was, were.',
    contentEn: 'The verb "to be" changes form based on subject and tense. Present: I am, you are, he/she/it is, we/you/they are. Past: I/he/she/it was, you/we/they were.',
    contentAr: 'فعل "to be" يتغير حسب الفاعل والزمن. المضارع: I am, you are, he/she/it is. الماضي: was/were.',
    examples: [
      { en: 'She is a doctor.', ar: 'هي طبيبة.' },
      { en: 'They were happy.', ar: 'كانوا سعداء.' },
      { en: 'I am from Saudi Arabia.', ar: 'أنا من المملكة العربية السعودية.' },
    ],
    mistakes: [
      { wrong: 'He are tall.', correct: 'He is tall.', noteEn: 'Singular: is', noteAr: 'المفرد: is' },
      { wrong: 'They is ready.', correct: 'They are ready.', noteEn: 'Plural: are', noteAr: 'الجمع: are' },
      { wrong: 'I is a student.', correct: 'I am a student.', noteEn: 'I always uses "am"', noteAr: '"I" تستخدم دائماً "am"' },
    ],
    quizQuestion: 'Choose the correct: "She ___ very tall."',
    quizQuestionAr: 'اختر الصحيح: "She ___ very tall."',
    quizOptions: ['am', 'are', 'is', 'be'],
    quizOptionsAr: ['am', 'are', 'is', 'be'],
    correctAnswer: 2,
  },
  {
    id: 'lesson-03', icon: '🕐',
    titleEn: 'Present Simple', titleAr: 'المضارع البسيط',
    descriptionEn: 'Use the present simple for habits, facts, and routines.',
    descriptionAr: 'استخدم المضارع البسيط للعادات والحقائق والروتين.',
    contentEn: 'Present simple expresses habits, facts, and permanent situations. Add -s/-es for third person singular (he/she/it). Negatives use "do not / does not".',
    contentAr: 'المضارع البسيط يعبر عن العادات والحقائق. أضف -s/-es للشخص الثالث المفرد.',
    examples: [
      { en: 'He drinks tea every morning.', ar: 'هو يشرب الشاي كل صباح.' },
      { en: 'Water boils at 100°C.', ar: 'الماء يغلي عند 100 درجة.' },
      { en: 'She does not like coffee.', ar: 'هي لا تحب القهوة.' },
    ],
    mistakes: [
      { wrong: 'He go to school.', correct: 'He goes to school.', noteEn: 'Add -s for he/she/it', noteAr: 'أضف -s لـ he/she/it' },
      { wrong: "She don't like it.", correct: "She doesn't like it.", noteEn: 'Use "doesn\'t" for she', noteAr: 'استخدم "doesn\'t" مع she' },
      { wrong: 'Does he likes it?', correct: 'Does he like it?', noteEn: 'No -s after does', noteAr: 'لا -s بعد does' },
    ],
    quizQuestion: 'Complete: "She ___ to work every day."',
    quizQuestionAr: 'أكمل: "She ___ to work every day."',
    quizOptions: ['go', 'goes', 'going', 'gone'],
    quizOptionsAr: ['go', 'goes', 'going', 'gone'],
    correctAnswer: 1,
  },
  {
    id: 'lesson-04', icon: '❓',
    titleEn: 'Questions', titleAr: 'الأسئلة',
    descriptionEn: 'Form yes/no questions and wh-questions correctly.',
    descriptionAr: 'كوّن أسئلة نعم/لا وأسئلة wh- بشكل صحيح.',
    contentEn: 'Yes/No questions: invert subject and auxiliary (Do you? Is she?). Wh-questions: start with what, where, when, why, who, how + auxiliary + subject.',
    contentAr: 'أسئلة نعم/لا: اعكس الفاعل والمساعد. أسئلة wh-: تبدأ بكلمة استفهام + المساعد + الفاعل.',
    examples: [
      { en: 'Do you speak English?', ar: 'هل تتحدث الإنجليزية؟' },
      { en: 'Where does she live?', ar: 'أين تسكن؟' },
      { en: 'What time is it?', ar: 'كم الساعة؟' },
    ],
    mistakes: [
      { wrong: 'Where he lives?', correct: 'Where does he live?', noteEn: 'Use "does" in questions', noteAr: 'استخدم "does" في الأسئلة' },
      { wrong: 'You like tea?', correct: 'Do you like tea?', noteEn: 'Start with "Do"', noteAr: 'ابدأ بـ "Do"' },
      { wrong: 'What he is doing?', correct: 'What is he doing?', noteEn: 'Invert "is" + subject', noteAr: 'اعكس "is" والفاعل' },
    ],
    quizQuestion: '___ you speak British English?',
    quizQuestionAr: '___ you speak British English?',
    quizOptions: ['Is', 'Are', 'Do', 'Does'],
    quizOptionsAr: ['Is', 'Are', 'Do', 'Does'],
    correctAnswer: 2,
  },
  {
    id: 'lesson-05', icon: '📍',
    titleEn: 'Prepositions', titleAr: 'حروف الجر',
    descriptionEn: 'Master in, on, at, by — including British preferences.',
    descriptionAr: 'أتقن in, on, at, by — بما في ذلك التفضيلات البريطانية.',
    contentEn: 'Prepositions of time: at (specific times), on (days/dates), in (months/years). British English prefers "at the weekend" vs American "on the weekend".',
    contentAr: 'حروف جر الزمن: at (أوقات محددة), on (أيام), in (شهور). البريطانيون يفضلون "at the weekend".',
    examples: [
      { en: "I'll see you at the weekend.", ar: 'سأراك في نهاية الأسبوع.' },
      { en: 'She lives in London.', ar: 'هي تسكن في لندن.' },
      { en: 'The meeting is on Monday.', ar: 'الاجتماع يوم الاثنين.' },
    ],
    mistakes: [
      { wrong: "I'll call you in the night.", correct: "I'll call you at night.", noteEn: '"at night" not "in"', noteAr: '"at night" وليس "in"' },
      { wrong: 'She is on home.', correct: 'She is at home.', noteEn: '"at home" is correct', noteAr: '"at home" هو الصحيح' },
      { wrong: 'He was in the bus.', correct: 'He was on the bus.', noteEn: '"on" transport', noteAr: '"on" مع وسائل النقل' },
    ],
    quizQuestion: "British English: \"I'll see you ___ the weekend.\"",
    quizQuestionAr: "الإنجليزية البريطانية: \"I'll see you ___ the weekend.\"",
    quizOptions: ['in', 'on', 'at', 'by'],
    quizOptionsAr: ['in', 'on', 'at', 'by'],
    correctAnswer: 2,
  },
  {
    id: 'lesson-06', icon: '✍️',
    titleEn: 'British Spelling', titleAr: 'الإملاء البريطاني',
    descriptionEn: 'Key spelling differences between British and American English.',
    descriptionAr: 'الفروق الإملائية الرئيسية بين الإنجليزية البريطانية والأمريكية.',
    contentEn: 'British spelling: -our vs -or (colour/color), -re vs -er (centre/center), -ise vs -ize (realise/realize), -ll- vs -l- (travelling/traveling).',
    contentAr: 'الإملاء البريطاني: -our vs -or, -re vs -er, -ise vs -ize.',
    examples: [
      { en: 'colour (UK) vs color (US)', ar: 'colour بريطاني — color أمريكي' },
      { en: 'centre (UK) vs center (US)', ar: 'centre بريطاني — center أمريكي' },
      { en: 'travelling (UK) vs traveling (US)', ar: 'travelling بريطاني — traveling أمريكي' },
    ],
    mistakes: [
      { wrong: 'I visited the sport center.', correct: 'I visited the sports centre.', noteEn: 'British: -re ending', noteAr: 'البريطاني: نهاية -re' },
      { wrong: 'What is your favorite color?', correct: 'What is your favourite colour?', noteEn: 'British: -our & -ite', noteAr: 'البريطاني: -our و -ite' },
      { wrong: 'I realize now.', correct: 'I realise now.', noteEn: 'British: -ise ending', noteAr: 'البريطاني: نهاية -ise' },
    ],
    quizQuestion: 'What is the British English spelling?',
    quizQuestionAr: 'ما هو الإملاء البريطاني الصحيح؟',
    quizOptions: ['color', 'colour', 'coler', 'collour'],
    quizOptionsAr: ['color', 'colour', 'coler', 'collour'],
    correctAnswer: 1,
  },
];

export interface VocabItem {
  id: string; en: string; ar: string; example: string;
  category: 'slang' | 'car' | 'hospital' | 'phrases';
}

export const VOCABULARY: VocabItem[] = [
  { id: 'v01', en: 'Mind the gap',       ar: 'احذر من الفجوة',      example: 'Mind the gap as you step off the train.',          category: 'phrases'  },
  { id: 'v02', en: 'Cheers',             ar: 'شكراً / على صحتك',    example: 'Cheers for helping me with that!',                  category: 'slang'    },
  { id: 'v03', en: 'Brilliant',          ar: 'رائع / ممتاز',         example: "That's a brilliant idea!",                         category: 'slang'    },
  { id: 'v04', en: 'Fancy',              ar: 'تريد / يريد',          example: 'Do you fancy a cup of tea?',                        category: 'slang'    },
  { id: 'v05', en: 'Boot',               ar: 'صندوق السيارة',        example: 'Put the bags in the boot.',                         category: 'car'      },
  { id: 'v06', en: 'Bonnet',             ar: 'غطاء المحرك',          example: 'The bonnet needs to be opened for inspection.',     category: 'car'      },
  { id: 'v07', en: 'Motorway',           ar: 'الطريق السريع',        example: 'We drove on the motorway for 3 hours.',             category: 'car'      },
  { id: 'v08', en: 'Petrol',             ar: 'بنزين',                example: 'I need to fill up with petrol.',                    category: 'car'      },
  { id: 'v09', en: 'A&E',               ar: 'الطوارئ',              example: 'He was rushed to A&E after the accident.',          category: 'hospital' },
  { id: 'v10', en: 'GP',                ar: 'طبيب العائلة',         example: 'Book an appointment with your GP.',                 category: 'hospital' },
  { id: 'v11', en: 'Chemist',           ar: 'الصيدلية',             example: 'Get the medicine from the chemist.',                category: 'hospital' },
  { id: 'v12', en: 'Knackered',         ar: 'منهك / متعب',          example: "I'm absolutely knackered after work.",              category: 'slang'    },
  { id: 'v13', en: 'Gutted',            ar: 'محبط جداً',            example: 'I was gutted when we lost the match.',              category: 'slang'    },
  { id: 'v14', en: 'Chuffed',           ar: 'فرحان جداً',           example: "I'm well chuffed with my exam results!",            category: 'slang'    },
  { id: 'v15', en: "Bob's your uncle",  ar: 'والأمر بسيط كذلك',    example: "Add the flour, stir it in, and Bob's your uncle!",  category: 'phrases'  },
];

export const DAILY_PHRASES = [
  { en: 'Mind the gap!',           ar: 'احذر من الفجوة!',         meaning: 'Watch out for the space between train and platform', phonetic: '/maɪnd ðə ɡæp/' },
  { en: "Bob's your uncle!",      ar: 'والأمر بسيط!',             meaning: 'And there it is — easy!',                             phonetic: "/bɒbz jɔː ʌŋkəl/" },
  { en: 'Fancy a cuppa?',          ar: 'هل تريد كوب شاي؟',        meaning: 'Would you like a cup of tea?',                        phonetic: '/fænsi ə ˈkʌpə/' },
  { en: "It's not my cup of tea", ar: 'هذا ليس ذوقي',            meaning: "It's not something I enjoy",                        phonetic: "/ɪts nɒt maɪ kʌp əv tiː/" },
  { en: 'Brilliant!',              ar: 'رائع!',                    meaning: 'Excellent! Wonderful!',                               phonetic: '/ˈbrɪliənt/' },
  { en: 'Cheers!',                 ar: 'شكراً! / على صحتك!',      meaning: "Thanks / You're welcome / Toast",                    phonetic: '/tʃɪəz/' },
  { en: 'Knackered',               ar: 'منهك تماماً',             meaning: 'Completely exhausted',                               phonetic: '/ˈnækəd/' },
];

export interface Americanism {
  type: string; american: string; british: string;
}

export const AMERICANISMS: Americanism[] = [
  { type: 'Vocabulary',  american: 'Apartment',       british: 'Flat'           },
  { type: 'Vocabulary',  american: 'Elevator',        british: 'Lift'           },
  { type: 'Vocabulary',  american: 'Trunk',           british: 'Boot'           },
  { type: 'Vocabulary',  american: 'Gas',             british: 'Petrol'         },
  { type: 'Vocabulary',  american: 'Sidewalk',        british: 'Pavement'       },
  { type: 'Vocabulary',  american: 'Drugstore',       british: 'Chemist'        },
  { type: 'Vocabulary',  american: 'Eraser',          british: 'Rubber'         },
  { type: 'Spelling',    american: 'Color',           british: 'Colour'         },
  { type: 'Spelling',    american: 'Center',          british: 'Centre'         },
  { type: 'Spelling',    american: 'Realize',         british: 'Realise'        },
  { type: 'Preposition', american: 'on the weekend',  british: 'at the weekend' },
];

export type MistakeStatus = 'red' | 'yellow' | 'green';

export interface Mistake {
  id: string; pattern: string; example: string; correction: string; status: MistakeStatus;
}

export const MISTAKES: Mistake[] = [
  { id: 'm01', pattern: 'Using "me" as subject',        example: 'Me and John went to school.',     correction: 'John and I went to school.',       status: 'red'    },
  { id: 'm02', pattern: 'Missing -s for third person',  example: 'He go to the market every day.',  correction: 'He goes to the market every day.', status: 'red'    },
  { id: 'm03', pattern: 'Wrong "to be" form',           example: 'They is very happy.',             correction: 'They are very happy.',             status: 'yellow' },
  { id: 'm04', pattern: 'American spelling',            example: 'I went to the sport center.',     correction: 'I went to the sports centre.',     status: 'yellow' },
  { id: 'm05', pattern: '"Does" with -s verb',          example: 'Does he likes football?',         correction: 'Does he like football?',           status: 'yellow' },
  { id: 'm06', pattern: '"in the night" vs "at night"', example: 'I study in the night.',           correction: 'I study at night.',               status: 'green'  },
  { id: 'm07', pattern: '"on the bus" vs "in the bus"', example: 'I was in the bus.',               correction: 'I was on the bus.',               status: 'green'  },
];

export interface WeekDay {
  day: string; dayAr: string;
  tasks: { id: string; en: string; ar: string }[];
}

export const WEEKLY_PLAN: WeekDay[] = [
  { day: 'Saturday',  dayAr: 'السبت',    tasks: [
    { id: 'sat-1', en: 'Read Lesson 1: Pronouns',      ar: 'اقرأ الدرس الأول: الضمائر'        },
    { id: 'sat-2', en: 'Complete Lesson 1 quiz',       ar: 'أكمل اختبار الدرس الأول'          },
    { id: 'sat-3', en: 'Study 5 vocabulary cards',     ar: 'ادرس 5 بطاقات مفردات'             },
    { id: 'sat-4', en: 'Complete daily challenge',     ar: 'أكمل التحدي اليومي'               },
  ]},
  { day: 'Sunday',   dayAr: 'الأحد',    tasks: [
    { id: 'sun-1', en: 'Read Lesson 2: Verb To Be',    ar: 'اقرأ الدرس الثاني: فعل To Be'    },
    { id: 'sun-2', en: 'Complete Lesson 2 quiz',       ar: 'أكمل اختبار الدرس الثاني'         },
    { id: 'sun-3', en: 'Practice fill-in-the-blank',   ar: 'تدرب على تمارين ملء الفراغ'      },
    { id: 'sun-4', en: 'Review yesterday\'s mistakes', ar: 'راجع أخطاء أمس'                   },
  ]},
  { day: 'Monday',   dayAr: 'الاثنين',  tasks: [
    { id: 'mon-1', en: 'Read Lesson 3: Present Simple', ar: 'اقرأ الدرس الثالث: المضارع البسيط' },
    { id: 'mon-2', en: 'Complete Lesson 3 quiz',        ar: 'أكمل اختبار الدرس الثالث'          },
    { id: 'mon-3', en: 'Study vocabulary (cars)',        ar: 'ادرس مفردات السيارات'               },
    { id: 'mon-4', en: 'Daily challenge',                ar: 'التحدي اليومي'                      },
  ]},
  { day: 'Tuesday',  dayAr: 'الثلاثاء', tasks: [
    { id: 'tue-1', en: 'Read Lesson 4: Questions',     ar: 'اقرأ الدرس الرابع: الأسئلة'       },
    { id: 'tue-2', en: 'Complete Lesson 4 quiz',       ar: 'أكمل اختبار الدرس الرابع'          },
    { id: 'tue-3', en: 'Practice word order exercise', ar: 'تدرب على ترتيب الكلمات'           },
    { id: 'tue-4', en: 'Review journey mistakes',      ar: 'راجع أخطاء الرحلة'                 },
  ]},
  { day: 'Wednesday',dayAr: 'الأربعاء', tasks: [
    { id: 'wed-1', en: 'Read Lesson 5: Prepositions',  ar: 'اقرأ الدرس الخامس: حروف الجر'    },
    { id: 'wed-2', en: 'Complete Lesson 5 quiz',       ar: 'أكمل اختبار الدرس الخامس'          },
    { id: 'wed-3', en: 'Study hospital vocabulary',    ar: 'ادرس مفردات المستشفى'              },
    { id: 'wed-4', en: 'Daily challenge',              ar: 'التحدي اليومي'                      },
  ]},
  { day: 'Thursday', dayAr: 'الخميس',   tasks: [
    { id: 'thu-1', en: 'Read Lesson 6: British Spelling', ar: 'اقرأ الدرس السادس: الإملاء البريطاني' },
    { id: 'thu-2', en: 'Complete Lesson 6 quiz',          ar: 'أكمل اختبار الدرس السادس'              },
    { id: 'thu-3', en: 'Study all Americanisms',          ar: 'ادرس جميع الأمريكانيزمز'               },
    { id: 'thu-4', en: 'Daily challenge',                 ar: 'التحدي اليومي'                         },
  ]},
  { day: 'Friday',   dayAr: 'الجمعة',   tasks: [
    { id: 'fri-1', en: 'Full review: all 6 lessons',   ar: 'مراجعة كاملة: جميع الدروس الستة' },
    { id: 'fri-2', en: 'Complete all practice types',  ar: 'أكمل جميع أنواع التمارين'        },
    { id: 'fri-3', en: 'Check badges earned',          ar: 'تحقق من الشارات المكتسبة'         },
    { id: 'fri-4', en: 'Plan next week',               ar: 'خطط للأسبوع القادم'               },
  ]},
];

export interface Exercise {
  id: string;
  type: 'fill-blank' | 'multiple-choice' | 'correct-sentence' | 'word-order';
  difficulty: 1 | 2 | 3;
  questionEn: string;
  questionAr: string;
  options?: string[];
  words?: string[];
  sentenceEn?: string;
  sentenceAr?: string;
  answer: string;
}

export const EXERCISES: Exercise[] = [
  {
    id: 'ex-01', type: 'multiple-choice', difficulty: 1,
    questionEn: 'Choose the correct pronoun: "___ gave the book to her."',
    questionAr: 'اختر الضمير الصحيح: "___ gave the book to her."',
    options: ['Me', 'Him', 'He', 'His'],
    answer: 'He',
  },
  {
    id: 'ex-02', type: 'fill-blank', difficulty: 1,
    questionEn: 'Complete: "She ___ a doctor." (verb to be)',
    questionAr: 'أكمل: "She ___ a doctor."',
    options: ['am', 'is', 'are', 'be'],
    answer: 'is',
  },
  {
    id: 'ex-03', type: 'multiple-choice', difficulty: 2,
    questionEn: 'British English: "I\'ll see you ___ the weekend."',
    questionAr: 'الإنجليزية البريطانية: "I\'ll see you ___ the weekend."',
    options: ['in', 'on', 'at', 'by'],
    answer: 'at',
  },
  {
    id: 'ex-04', type: 'correct-sentence', difficulty: 2,
    questionEn: 'Correct this sentence:',
    questionAr: 'صحّح هذه الجملة:',
    sentenceEn: 'He go to school every day.',
    sentenceAr: 'He go to school every day.',
    answer: 'He goes to school every day.',
  },
  {
    id: 'ex-05', type: 'word-order', difficulty: 3,
    questionEn: 'Arrange the words:',
    questionAr: 'رتب الكلمات:',
    words: ['she', 'does', 'like', 'not', 'coffee'],
    answer: 'she does not like coffee',
  },
  {
    id: 'ex-06', type: 'multiple-choice', difficulty: 2,
    questionEn: 'What is the British spelling?',
    questionAr: 'ما هو الإملاء البريطاني؟',
    options: ['color', 'colour', 'coler', 'collor'],
    answer: 'colour',
  },
];