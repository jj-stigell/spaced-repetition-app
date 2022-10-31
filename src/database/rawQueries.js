// Select new cards, that are not found in the accounts personal cards
const selectNewCardIds = `SELECT card_id FROM card_list WHERE deck_id = :deckId AND NOT EXISTS (
  SELECT NULL 
  FROM account_card 
  WHERE account_card.account_id = :accountId AND card_list.card_id = account_card.card_id
) ORDER BY learning_order ASC LIMIT :limitReviews`;

// Select account due card in id list from account cards joined to the decks card list
const selectDueCardIds = `SELECT card_list.card_id FROM card_list INNER JOIN 
account_card ON account_card.card_id = card_list.card_id 
WHERE card_list.deck_id = :deckId AND account_card.account_id = :accountId AND account_card.due_at <= NOW()
ORDER BY due_at ASC LIMIT :limitReviews`;

// Check if card with and id "cardId" exists and return 1 if true
const findCard = 'SELECT 1 FROM card WHERE id = :cardId';

// Pushes all cards owned by account with an id "accountId" with "days" days to future
const pushAllCardsNDays = 'UPDATE account_card SET due_at = due_at + :days WHERE account_id = :accountId';

// Pushes all cards in deck "deckId" owned by account with an id "accountId" with "days" days to future
const pushCardsInDeckIdNDays = `UPDATE account_card SET due_at = account_card.due_at + :days FROM
  (SELECT card_list.card_id FROM card_list 
  INNER JOIN account_card ON account_card.card_id = card_list.card_id 
  where deck_id = :deckId AND account_id = :accountId)
  AS found WHERE found.card_id = account_card.card_id`;

// Fetch count per day of the accounts past reviews for "limitReviews" amount of days. Arrange from latest review to oldest
const fetchDailyReviewCountNDays = `SELECT created_at::date, COUNT(*) FROM account_review where account_id = :accountId 
  GROUP BY created_at::date ORDER BY created_at::date DESC LIMIT :limitReviews`;

module.exports = {
  selectNewCardIds,
  selectDueCardIds,
  findCard,
  pushAllCardsNDays,
  pushCardsInDeckIdNDays,
  fetchDailyReviewCountNDays
};
