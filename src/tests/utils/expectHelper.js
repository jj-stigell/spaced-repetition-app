const { expect } = require('@jest/globals');

const cardEvaluator = (card, newCard) => {
  expect(card).toBeDefined();
  expect(card.id).toBeDefined();
  expect(card.cardType).toBeDefined();
  expect(card.reviewType).toBeDefined();
  expect(card.createdAt).toBeDefined();
  expect(card.updatedAt).toBeDefined();
  expect(card.accountCard).toBeDefined();

  if (!newCard) {
    expect(card.accountCard.id).toBeDefined();
    expect(card.accountCard.reviewCount).toBeDefined();
    expect(card.accountCard.easyFactor).toBeDefined();
    expect(card.accountCard.accountStory).toBeDefined();
    expect(card.accountCard.accountHint).toBeDefined();
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

module.exports = {
  cardEvaluator
};
