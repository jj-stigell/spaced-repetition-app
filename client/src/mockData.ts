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
