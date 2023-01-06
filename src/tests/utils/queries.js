const queries = {
  emailAvailable: `query emailAvailable($email: String!) {
    emailAvailable(email: $email)
  }`,
  usernameAvailable: `query usernameAvailable($username: String!) {
    usernameAvailable(username: $username)
  }`,
  sessions: `query Sessions {
    sessions {
      id
      browser
      os
      device
      createdAt
      expireAt
    }
  }`,
  decks: `query Decks($date: Date!) {
    decks(date: $date) {
      id
      deckName
      subscriberOnly
      languageId
      active
      createdAt
      updatedAt
      deckTranslations {
        id
        languageId
        title
        description
        active
        createdAt
        updatedAt
      }
      accountDeckSettings {
        id
        accountId
        deckId
        favorite
        dueCards
        reviewInterval
        reviewsPerDay
        newCardsPerDay
        createdAt
        updatedAt
      }
    }
  }`,
  deckSettings: `query DeckSettings($deckId: Int!) {
    deckSettings(deckId: $deckId) {
      id
      accountId
      deckId
      favorite
      dueCards
      reviewInterval
      reviewsPerDay
      newCardsPerDay
      createdAt
      updatedAt
    }
  }`,
  bugReports: `query BugReports {
    bugReports {
      id
      accountId
      cardId
      type
      bugMessage
      solvedMessage
      solved
      createdAt
      updatedAt
    }
  }`,
  bugReportById: `query BugReportById($bugId: Int!) {
    bugReportById(bugId: $bugId) {
      id
      accountId
      cardId
      type
      bugMessage
      solvedMessage
      solved
      createdAt
      updatedAt
    }
  }`,
  bugReportsByType: `query BugReportsByType($type: BugType!) {
    bugReportsByType(type: $type) {
      id
      accountId
      cardId
      type
      bugMessage
      solvedMessage
      solved
      createdAt
      updatedAt
    }
  }`,
  dueCount: `query DueCount($limitReviews: Int!, $date: Date!) {
    dueCount(limitReviews: $limitReviews, date: $date) {
      date
      count
    }
  }`,
  reviewHistory: `query ReviewHistory($limitReviews: Int!) {
    reviewHistory(limitReviews: $limitReviews) {
      date
      count
    }
  }`,
  learningStatisticsByType: `query LearningStatisticsByType($cardType: CardType!, $reviewType: ReviewType!) {
    learningStatisticsByType(cardType: $cardType, reviewType: $reviewType) {
      matured
      learning
      new
    }
  }`,
  cardsByType: `query CardsByType($cardType: CardType!, $languageId: Language) {
    cardsByType(cardType: $cardType, languageId: $languageId) {
      id
      cardType
      reviewType
      createdAt
      updatedAt
      accountCard {
        id
        reviewCount
        easyFactor
        accountStory
        accountHint
        dueAt
        mature
        createdAt
        updatedAt
      }
      kanji {
        id
        kanji
        jlptLevel
        onyomi
        onyomiRomaji
        kunyomi
        kunyomiRomaji
        strokeCount
        createdAt
        updatedAt
        translation {
          keyword
          story
          hint
          otherMeanings
          description
          createdAt
          updatedAt
        }
        radicals {
          radical
          reading
          readingRomaji
          strokeCount
          createdAt
          updatedAt
          translation {
            translation
            description
            createdAt
            updatedAt
          }
        }
      }
      word {
        id
        word
        jlptLevel
        furigana
        reading
        readingRomaji
        createdAt
        updatedAt
        translation {
          translation
          hint
          description
          createdAt
          updatedAt
        }
      }
    }
  }`,
  cardsFromDeck: `query CardsFromDeck($deckId: Int!, $date: Date!, $newCards: Boolean, $languageId: Language!) {
    cardsFromDeck(deckId: $deckId, date: $date, newCards: $newCards, languageId: $languageId) {
      id
      cardType
      reviewType
      createdAt
      updatedAt
      accountCard {
        id
        reviewCount
        easyFactor
        accountStory
        accountHint
        dueAt
        mature
        createdAt
        updatedAt
      }
      kanji {
        id
        kanji
        jlptLevel
        onyomi
        onyomiRomaji
        kunyomi
        kunyomiRomaji
        strokeCount
        createdAt
        updatedAt
        translation {
          keyword
          story
          hint
          otherMeanings
          description
          createdAt
          updatedAt
        }
        radicals {
          radical
          reading
          readingRomaji
          strokeCount
          createdAt
          updatedAt
          translation {
            translation
            description
            createdAt
            updatedAt
          }
        }
      }
      word {
        id
        word
        jlptLevel
        furigana
        reading
        readingRomaji
        createdAt
        updatedAt
        translation {
          translation
          hint
          description
          createdAt
          updatedAt
        }
      }
    }
  }`
};

module.exports = queries;
