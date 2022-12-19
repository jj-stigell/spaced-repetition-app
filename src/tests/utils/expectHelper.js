const { expect } = require('@jest/globals');
const { accountCard } = require('./constants');

const cardEvaluator = (card, newCard, isMember, hasReviewType) => {
  expect(card).toBeDefined();
  expect(card.id).toBeDefined();
  expect(card.cardType).toBeDefined();
  if (hasReviewType) expect(card.reviewType).toBeDefined();
  expect(card.createdAt).toBeDefined();
  expect(card.updatedAt).toBeDefined();
  expect(card.accountCard).toBeDefined();

  if (!newCard) {
    if (isMember) {
      expect(card.accountCard.accountStory).toBe(accountCard.story);
      expect(card.accountCard.accountHint).toBe(accountCard.hint);
    } else {
      expect(card.accountCard.accountStory).toBe(null);
      expect(card.accountCard.accountHint).toBe(null);
    }
    expect(card.accountCard.id).toBeDefined();
    expect(card.accountCard.reviewCount).toBeDefined();
    expect(card.accountCard.easyFactor).toBeDefined();
    expect(card.accountCard.dueAt).toBeDefined();
    expect(card.accountCard.mature).toBeDefined();
    expect(card.accountCard.createdAt).toBeDefined();
    expect(card.accountCard.updatedAt).toBeDefined();
  }

  switch (card.cardType) {
  case 'KANJI':
    expect(card.kanji).toBeDefined();
    expect(card.kanji.id).toBeDefined();
    expect(card.kanji.kanji).toBeDefined();
    expect(card.kanji.jlptLevel).toBeDefined();
    expect(card.kanji.onyomi).toBeDefined();
    expect(card.kanji.onyomiRomaji).toBeDefined();
    expect(card.kanji.kunyomi).toBeDefined();
    expect(card.kanji.kunyomiRomaji).toBeDefined();
    expect(card.kanji.strokeCount).toBeDefined();
    expect(card.kanji.createdAt).toBeDefined();
    expect(card.kanji.updatedAt).toBeDefined();
    expect(card.kanji.radicals).toBeDefined();
    expect(card.kanji.translation).toBeDefined();
    expect(card.kanji.translation.keyword).toBeDefined();
    expect(card.kanji.translation.story).toBeDefined();
    expect(card.kanji.translation.hint).toBeDefined();
    expect(card.kanji.translation.otherMeanings).toBeDefined();
    expect(card.kanji.translation.description).toBeDefined();
    expect(card.kanji.translation.createdAt).toBeDefined();
    expect(card.kanji.translation.updatedAt).toBeDefined();
    break;
  case 'WORD':
    expect(card.word).toBeDefined();
    expect(card.word.id).toBeDefined();
    expect(card.word.word).toBeDefined();
    expect(card.word.jlptLevel).toBeDefined();
    expect(card.word.furigana).toBeDefined();
    expect(card.word.reading).toBeDefined();
    expect(card.word.readingRomaji).toBeDefined();
    expect(card.word.createdAt).toBeDefined();
    expect(card.word.updatedAt).toBeDefined();
    expect(card.word.translation).toBeDefined();
    expect(card.word.translation.translation).toBeDefined();
    expect(card.word.translation.hint).toBeDefined();
    expect(card.word.translation.description).toBeDefined();
    expect(card.word.translation.createdAt).toBeDefined();
    expect(card.word.translation.updatedAt).toBeDefined();
    break;
  }
};

const bugReportEvaluator = (bugReport) => {
  expect(bugReport.id).toBeDefined();
  expect(bugReport.accountId).toBeDefined();
  expect(bugReport.cardId).toBeDefined();
  expect(bugReport.type).toBeDefined();
  expect(bugReport.bugMessage).toBeDefined();
  expect(bugReport.solvedMessage).toBeDefined();
  expect(bugReport.solved).toBeDefined();
  expect(bugReport.createdAt).toBeDefined();
  expect(bugReport.updatedAt).toBeDefined();
};

const accountCardEvaluator = (accountCard, reviewCount = null, easyFactor = null, story = null, hint = null, mature = null) => {
  expect(accountCard.id).toBeDefined();
  reviewCount ? expect(accountCard.reviewCount).toBe(reviewCount) : expect(accountCard.reviewCount).toBeDefined();
  easyFactor ? expect(accountCard.easyFactor).toBe(easyFactor) : expect(accountCard.easyFactor).toBeDefined();
  story ? expect(accountCard.accountStory).toBe(story) : expect(accountCard.accountStory).toBeDefined();
  hint ? expect(accountCard.accountHint).toBe(hint) : expect(accountCard.accountHint).toBeDefined();
  expect(accountCard.dueAt).toBeDefined();
  mature ? expect(accountCard.mature).toBe(mature) : expect(accountCard.mature).toBeDefined();
  expect(accountCard.createdAt).toBeDefined();
  expect(accountCard.updatedAt).toBeDefined();
};

const sessionEvaluator = (session) => {
  expect(session.id).toBeDefined();
  expect(session.browser).toBeDefined();
  expect(session.os).toBeDefined();
  expect(session.device).toBeDefined();
  expect(session.createdAt).toBeDefined();
  expect(session.expireAt).toBeDefined();
};

module.exports = {
  cardEvaluator,
  bugReportEvaluator,
  accountCardEvaluator,
  sessionEvaluator
};
