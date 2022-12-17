const queries = {
  emailAvailableQuery: `query emailAvailable($email: String!) {
    emailAvailable(email: $email)
  }`,
  usernameAvailableQuery: `query usernameAvailable($username: String!) {
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
  decks: `query Decks {
    decks {
      id
      deckName
      type
      subscriberOnly
      languageId
      active
      createdAt
      updatedAt
      deck_translations {
        id
        languageId
        title
        description
        active
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
      reviewInterval
      reviewsPerDay
      newCardsPerDay
      createdAt
      updatedAt
    }
  }`,
  fetchAllBugReports: `query FetchAllBugReports {
    fetchAllBugReports {
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
  fetchBugReportById: `query FetchAllBugReports($bugId: Int!) {
    fetchBugReportById(bugId: $bugId) {
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
  fetchBugReportsByType: `query FetchBugReportsByType($type: BugType!) {
    fetchBugReportsByType(type: $type) {
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
      reviews
    }
  }`,
  reviewHistory: `query ReviewHistory($limitReviews: Int!) {
    reviewHistory(limitReviews: $limitReviews) {
      date
      reviews
    }
  }`,
  learningStatistics: `query LearningStatistics($cardType: CardType!) {
    learningStatistics(cardType: $cardType) {
      matured
      learning
      new
    }
  }`,
  cardsByType: `query CardsByType($cardType: CardType!, $languageId: Language) {
    cardsByType(cardType: $cardType, languageId: $languageId) {
      id
      cardType
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
  cardsFromDeck: `query CardsFromDeck($deckId: Int!, $date: Date, $languageId: Language!, $newCards: Boolean) {
    cardsFromDeck(deckId: $deckId, date: $date, languageId: $languageId, newCards: $newCards) {
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
