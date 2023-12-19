import { Card, CardType, ReviewType } from '../types'

/*
export type Card = {
  id: number
  learningOrder: number
  cardType: CardType
  reviewType: ReviewType
  card: {
    value: string
    keyword: string // English translation of the value.
    answerOptions: AnswerOption[]
  } & (KanjiCard | VocabularyCard | KanaCard)
}

*/

/*
export type KanjiCard = {
  story: string
  hint: string
  onyomi: string
  kunyomi: string
  onyomiRomaji: string
  kunyomiRomaji: string
}
*/

export const kanjiCards: Card[] = [
  {
    id: 12,
    cardType: CardType.KANJI,
    reviewType: ReviewType.RECOGNISE,
    learningOrder: 1,
    card: {
      value: '車',
      keyword: 'car',
      story: 'Looks like a vehicle from a bird\'s eye view',
      hint: 'Pictograph of a car',
      onyomi: 'しゃ',
      kunyomi: 'くるま',
      onyomiRomaji: 'sha',
      kunyomiRomaji: 'kuruma',
      jlptLevel: 5,
      answerOptions: [
        { option: 'car', correct: true },
        { option: 'airplane', correct: false },
        { option: 'boat', correct: false },
        { option: 'bicycle', correct: false }
      ]
    }
  },
  {
    id: 13,
    cardType: CardType.KANJI,
    reviewType: ReviewType.RECOGNISE,
    learningOrder: 1,
    card: {
      value: '家',
      keyword: 'house',
      story: 'Represents a structure with a roof',
      hint: 'Pictograph of a house',
      onyomi: 'か',
      kunyomi: 'いえ',
      onyomiRomaji: 'ka',
      kunyomiRomaji: 'ie',
      jlptLevel: 5,
      answerOptions: [
        { option: 'tree', correct: false },
        { option: 'house', correct: true },
        { option: 'river', correct: false },
        { option: 'mountain', correct: false }
      ]
    }
  },
  {
    id: 14,
    cardType: CardType.KANJI,
    reviewType: ReviewType.RECOGNISE,
    learningOrder: 2,
    card: {
      value: '学',
      keyword: 'school',
      story: 'Symbolizes a place of learning',
      hint: 'Associated with education',
      onyomi: 'がく',
      kunyomi: 'まなぶ',
      onyomiRomaji: 'gaku',
      kunyomiRomaji: 'manabu',
      jlptLevel: 5,
      answerOptions: [
        { option: 'book', correct: false },
        { option: 'teacher', correct: false },
        { option: 'school', correct: true },
        { option: 'student', correct: false }
      ]
    }
  },
  {
    id: 14,
    cardType: CardType.VOCABULARY,
    reviewType: ReviewType.WRITE,
    learningOrder: 2,
    card: {
      value: '大学',
      keyword: 'university',
      reading: 'だいがく',
      readingRomaji: 'daigaku',
      jlptLevel: 5,
      answerOptions: [
        { option: 'elementary school', correct: false },
        { option: 'high school', correct: false },
        { option: 'university', correct: true },
        { option: 'trade school', correct: false }
      ]
    }
  }
]

/*
export const kanjiCards: Card[] = [
  {
      id: 12,
      cardType: CardType.KANJI,
      reviewType: ReviewType.RECOGNISE,
      card: {
        value: '車',
        keyword: 'car',
        story: 'Looks like a vehicle from a bird\'s eye view',
        hint: 'Pictograph of a car',
        onyomi: 'しゃ',
        kunyomi: 'くるま',
        onyomiRomaji: 'sha',
        kunyomiRomaji: 'kuruma',
        jlptLevel: 5,
        answerOptions: [
            { option: 'car', correct: true },
            { option: 'airplane', correct: false },
            { option: 'boat', correct: false },
            { option: 'bicycle', correct: false }
        ]
      }

      sentences: [
          {
              text: '車を運転する',
              furigana: '1:くるま;3-4:うんてん',
              translation: 'Drive a car',
              audioMan: 'https://dl.sndup.net/krsr/374892374.mp3',
              audioWoman: 'https://dl.sndup.net/krsr/374892374.mp3'
          },
          {
              text: '彼は新しい車を買った',
              furigana: '1:かれ;3:あたら;6:くるま;8:かった',
              translation: 'He bought a new car',
              audioMan: 'https://dl.sndup.net/krsr/374892374.mp3',
              audioWoman: 'https://dl.sndup.net/krsr/374892374.mp3'
          },
          {
              text: '車が故障した',
              furigana: '1:くるま;3-4:こしょう',
              translation: 'The car broke down',
              audioMan: 'https://dl.sndup.net/krsr/374892374.mp3',
              audioWoman: 'https://dl.sndup.net/krsr/374892374.mp3'
          }
      ],
      words: [
          {
              text: '自動車',
              furigana: '1-3:じどうしゃ',
              translation: 'Automobile',
              audioMan: 'https://dl.sndup.net/krsr/374892374.mp3',
              audioWoman: 'https://dl.sndup.net/krsr/374892374.mp3'
          },
          {
              text: '車庫',
              furigana: '1-2:しゃこ',
              translation: 'Garage',
              audioMan: 'https://dl.sndup.net/krsr/374892374.mp3',
              audioWoman: 'https://dl.sndup.net/krsr/374892374.mp3'
          },
          {
              text: '車輪',
              furigana: '1-2:しゃりん',
              translation: 'Wheel',
              audioMan: 'https://dl.sndup.net/krsr/374892374.mp3',
              audioWoman: 'https://dl.sndup.net/krsr/374892374.mp3'
          }
      ],
  },
  {
      id: 13,
      cardType: CardType.KANJI,
      reviewType: ReviewType.RECOGNISE,
      kanji: '家',
      keyword: 'house',
      story: 'Represents a structure with a roof',
      hint: 'Pictograph of a house',
      onyomi: 'か',
      kunyomi: 'いえ',
      onyomiRomaji: 'ka',
      kunyomiRomaji: 'ie',
      jlptLevel: 4,
      sentences: [
          {
              text: '家に帰る',
              furigana: 'いえにかえる',
              translation: 'Return home',
              audioMan: 'path/to/man/voice_home_1.mp3',
              audioWoman: 'path/to/woman/voice_home_1.mp3'
          },
          {
              text: '彼の家は大きい',
              furigana: 'かれのいえはおおきい',
              translation: 'His house is big',
              audioMan: 'path/to/man/voice_big_house_1.mp3',
              audioWoman: 'path/to/woman/voice_big_house_1.mp3'
          },
          {
              text: '家を建てる',
              furigana: 'いえをたてる',
              translation: 'Build a house',
              audioMan: 'path/to/man/voice_build_house_1.mp3',
              audioWoman: 'path/to/woman/voice_build_house_1.mp3'
          }
      ],
      words: [
          {
              text: '家族',
              furigana: 'かぞく',
              translation: 'Family',
              audioMan: 'path/to/man/voice_family_1.mp3',
              audioWoman: 'path/to/woman/voice_family_1.mp3'
          },
          {
              text: '一軒家',
              furigana: 'いっけんや',
              translation: 'Detached house',
              audioMan: 'path/to/man/voice_detached_house_1.mp3',
              audioWoman: 'path/to/woman/voice_detached_house_1.mp3'
          },
          {
              text: '家具',
              furigana: 'かぐ',
              translation: 'Furniture',
              audioMan: 'path/to/man/voice_furniture_1.mp3',
              audioWoman: 'path/to/woman/voice_furniture_1.mp3'
          }
      ],
      answerOptions: [
          { option: 'tree', correct: false },
          { option: 'house', correct: true },
          { option: 'river', correct: false },
          { option: 'mountain', correct: false }
      ]
  },
  {
      id: 14,
      cardType: CardType.KANJI,
      reviewType: ReviewType.RECOGNISE,
      kanji: '学',
      keyword: 'school',
      story: 'Symbolizes a place of learning',
      hint: 'Associated with education',
      onyomi: 'がく',
      kunyomi: 'まなぶ',
      onyomiRomaji: 'gaku',
      kunyomiRomaji: 'manabu',
      jlptLevel: 3,
      sentences: [
          {
              text: '学校に行く',
              furigana: 'がっこうにいく',
              translation: 'Go to school',
              audioMan: 'path/to/man/voice_school_1.mp3',
              audioWoman: 'path/to/woman/voice_school_1.mp3'
          },
          {
              text: '学生は勉強する',
              furigana: 'がくせいはべんきょうする',
              translation: 'Students study',
              audioMan: 'path/to/man/voice_study_1.mp3',
              audioWoman: 'path/to/woman/voice_study_1.mp3'
          },
          {
              text: '学問の重要性',
              furigana: 'がくもんのじゅうようせい',
              translation: 'The importance of learning',
              audioMan: 'path/to/man/voice_learning_importance_1.mp3',
              audioWoman: 'path/to/woman/voice_learning_importance_1.mp3'
          }
      ],
      words: [
          {
              text: '学生',
              furigana: 'がくせい',
              translation: 'Student',
              audioMan: 'path/to/man/voice_student_1.mp3',
              audioWoman: 'path/to/woman/voice_student_1.mp3'
          },
          {
              text: '学習',
              furigana: 'がくしゅう',
              translation: 'Learning',
              audioMan: 'path/to/man/voice_learning_1.mp3',
              audioWoman: 'path/to/woman/voice_learning_1.mp3'
          },
          {
              text: '学者',
              furigana: 'がくしゃ',
              translation: 'Scholar',
              audioMan: 'path/to/man/voice_scholar_1.mp3',
              audioWoman: 'path/to/woman/voice_scholar_1.mp3'
          }
      ],
      answerOptions: [
          { option: 'book', correct: false },
          { option: 'teacher', correct: false },
          { option: 'school', correct: true },
          { option: 'student', correct: false }
      ]
  }
  // Additional cards can be added here
];

*/

/*
import { CardType, ReviewType, Card } from './types'

export const mockCards: Card[] = [
  {
    id: 1,
    learningOrder: 1,
    cardType: CardType.KANJI,
    reviewType: ReviewType.RECOGNISE,
    card: {
      value: '車',
      keyword: 'car',
      story: 'looks like a vehicle from birds eye view',
      hint: 'pictograph',
      onyomi: 'しゃ',
      kunyomi: 'くるま',
      onyomiRomaji: 'sha',
      kunyomiRomaji: 'kuruma',
      answerOptions: [
        {
          option: 'car',
          correct: true
        },
        {
          option: 'airplane',
          correct: false
        },
        {
          option: 'boat',
          correct: false
        },
        {
          option: 'bicycle',
          correct: false
        }
      ]
    }
  },
  {
    id: 2,
    learningOrder: 2,
    cardType: CardType.KANJI,
    reviewType: ReviewType.RECALL,
    card: {
      value: '車',
      keyword: 'car',
      story: 'looks like a vehicle from birds eye view',
      hint: 'pictograph',
      onyomi: 'しゃ',
      kunyomi: 'くるま',
      onyomiRomaji: 'sha',
      kunyomiRomaji: 'kuruma',
      answerOptions: [
        {
          option: '車',
          correct: true
        },
        {
          option: '船',
          correct: false
        },
        {
          option: '倫',
          correct: false
        },
        {
          option: '牛',
          correct: false
        }
      ]
    }
  },
  {
    id: 3,
    learningOrder: 3,
    cardType: CardType.HIRAGANA,
    reviewType: ReviewType.RECOGNISE,
    card: {
      value: 'か',
      keyword: 'ka',
      story: 'shape is almost like "ka" in cursive',
      hint: 'I dont have any hints for you',
      answerOptions: [
        {
          option: 'ka',
          correct: true
        },
        {
          option: 'sa',
          correct: false
        },
        {
          option: 'ha',
          correct: false
        },
        {
          option: 'na',
          correct: false
        }
      ]
    }
  },
  {
    id: 4,
    learningOrder: 4,
    cardType: CardType.KATAKANA,
    reviewType: ReviewType.RECOGNISE,
    card: {
      value: 'ホ',
      keyword: 'ho',
      story: 'Looks like the HOly cross with sunlight shining behind it',
      hint: 'jesus christ',
      answerOptions: [
        {
          option: 'ho',
          correct: true
        },
        {
          option: 'ko',
          correct: false
        },
        {
          option: 'so',
          correct: false
        },
        {
          option: 'no',
          correct: false
        }
      ]
    }
  },
  {
    id: 5,
    learningOrder: 5,
    cardType: CardType.VOCABULARY,
    reviewType: ReviewType.RECALL,
    card: {
      value: '自転車',
      keyword: 'bicycle',
      reading: 'じてんしゃ',
      readingRomaji: 'jitensha',
      answerOptions: [
        {
          option: '自転車',
          correct: true
        },
        {
          option: '自動車',
          correct: false
        },
        {
          option: '自動販売機',
          correct: false
        },
        {
          option: '自分',
          correct: false
        }
      ]
    }
  },
  {
    id: 6,
    learningOrder: 6,
    cardType: CardType.VOCABULARY,
    reviewType: ReviewType.RECOGNISE,
    card: {
      value: '建物',
      keyword: 'building',
      reading: 'たてもの',
      readingRomaji: 'tatemono',
      answerOptions: [
        {
          option: 'building',
          correct: true
        },
        {
          option: 'school',
          correct: false
        },
        {
          option: 'stadium',
          correct: false
        },
        {
          option: 'church',
          correct: false
        }
      ]
    }
  }
]

/*
export const exampleSentences: ExampleSentence[] = [
  {
    id: 354,
    sentence: '昨日は車で学校に行きました。',
    translation: 'Yesterday I went to school by car.',
    furigana: 'きのうはくるまでがっこうにいきました。',
    audio: 'https://dl.sndup.net/mjm2/194544434378608.mp3'
  },
  {
    id: 287,
    sentence: '車のタイヤがパンクされた。',
    translation: 'Cars tire was blown.',
    furigana: 'くるまのたいやがぱんくされた。',
    audio: 'https://dl.sndup.net/pb7r/194544434378718.mp3'
  },
  {
    id: 186,
    sentence: 'あの車は日産です。',
    translation: 'That car is Nissan.',
    furigana: 'あのくるまはにっさんです。',
    audio: 'https://dl.sndup.net/rtr8/194544434378829.mp3'
  }
]
*/

/*
export const mockRadarData = [
    {
      label: 'kanji',
      value: 1
    },
    {
      label: 'kana',
      value: 2
    },
    {
      label: 'vocabulary',
      value: 3
    },
    {
      label: 'grammar',
      value: 4
    },
    {
      label: 'listening',
      value: 5
    },
    {
      label: 'reading',
      value: 10
    }
  ]

  export const textDetailedData = {
    id: 2,
    cardType: CardType.KANJI,
    data: {
      kanji: '車',
      keyword: 'car',
      story: 'looks like a vehicle from birds eye view',
      hint: 'pictograph',
      onyomi: 'しゃ',
      kunyomi: 'くるま',
      onyomiRomaji: 'sha',
      kunyomiRomaji: 'kuruma',
      strokeCount: 7,
      radicals: [
        {
          radical: '⾞',
          translation: 'car',
          position: null
        },
        {
          radical: '⼇',
          translation: 'lid',
          position: 'top'
        }
      ],
      exampleWords: [
        {
          id: 276,
          type: 'kunyomi',
          example: '車椅子',
          translation: 'wheelchair',
          furigana: 'くるまいす',
          audio: 'https://dl.sndup.net/kpfp/194544434412958.mp3'
        },
        {
          id: 967,
          type: 'kunyomi',
          example: '火の車',
          translation: 'fiery chariot',
          furigana: 'ひのくるま',
          audio: 'https://dl.sndup.net/j3hy/194544434413002.mp3'
        },
        {
          id: 764,
          type: 'onyomi',
          example: '車検',
          translation: 'vehicle inspection',
          furigana: 'しゃけん',
          audio: 'https://dl.sndup.net/b65q/194544434413043.mp3'
        },
        {
          id: 456,
          type: 'onyomi',
          example: '自動車',
          translation: 'automobile',
          furigana: 'じどうしゃ',
          audio: 'https://dl.sndup.net/sk7p/194758734413112.mp3'
        }
      ],
      exampleSentences: [
        {
          id: 354,
          example: '昨日は車で学校に行きました。',
          translation: 'Yesterday I went to school by car.',
          furigana: 'きのうはくるまでがっこうにいきました。',
          audio: 'https://dl.sndup.net/mjm2/194544434378608.mp3'
        },
        {
          id: 287,
          example: '車のタイヤがパンクされた。',
          translation: 'Cars tire was blown.',
          furigana: 'くるまのたいやがぱんくされた。',
          audio: 'https://dl.sndup.net/pb7r/194544434378718.mp3'
        },
        {
          id: 186,
          example: 'あの車は日産です。',
          translation: 'That car is Nissan.',
          furigana: 'あのくるまはにっさんです。',
          audio: 'https://dl.sndup.net/rtr8/194544434378829.mp3'
        }
      ]
    },
    personalData: {
      reviewCount: 23,
      mature: true
    }
  }

*/
