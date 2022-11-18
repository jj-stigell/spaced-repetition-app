/**
 * Select cards from deck that have no previous reviews for the account
 * @param {integer} deckId - id of the deck
 * @param {integer} accountId - id of the account
 * @param {integer} limitReviews - limit how many new cards are fetched
 */
const selectNewCardIds = `SELECT card_id FROM card_list WHERE deck_id = :deckId AND NOT EXISTS (
  SELECT NULL 
  FROM account_card 
  WHERE account_card.account_id = :accountId AND card_list.card_id = account_card.card_id
) ORDER BY learning_order ASC LIMIT :limitReviews`;

/**
 * Select account due card in id list from account cards joined to the decks card list
 * @param {integer} deckId - id of the deck
 * @param {integer} accountId - id of the account
 * @param {integer} limitReviews - limit how many new cards are fetched
 */
const selectDueCardIds = `SELECT card_list.card_id FROM card_list INNER JOIN 
account_card ON account_card.card_id = card_list.card_id 
WHERE card_list.deck_id = :deckId AND account_card.account_id = :accountId AND account_card.due_at <= NOW()
ORDER BY due_at ASC LIMIT :limitReviews`;

/**
 * Check if card with and id "cardId" exists and return 1 if true
 * @param {integer} cardId - id of the card
 */
const findCard = 'SELECT 1 FROM card WHERE id = :cardId';

/**
 * Pushes all cards owned by account with an id "accountId" with "days" days to future
 * @param {integer} days - amoun of days pushed
 * @param {integer} accountId - id of the account
 */
const pushAllCardsNDays = 'UPDATE account_card SET due_at = due_at + :days WHERE account_id = :accountId';

/**
 * Pushes all cards in deck "deckId" owned by account with an id "accountId" with "days" days to future
 * @param {integer} deckId - id of the deck
 * @param {integer} accountId - id of the account
 * @param {integer} days - amoun of days pushed
 */
const pushCardsInDeckIdNDays = `UPDATE account_card SET due_at = account_card.due_at + :days FROM
  (SELECT card_list.card_id FROM card_list 
  INNER JOIN account_card ON account_card.card_id = card_list.card_id 
  where deck_id = :deckId AND account_id = :accountId)
  AS found WHERE found.card_id = account_card.card_id`;

/**
 * Fetch count per day of the accounts past reviews for "limitReviews" amount of days. Arrange from latest review to oldest
 * @param {integer} accountId - id of the account
 * @param {integer} limitReviews - limit how many new cards are fetched
 */
const fetchDailyReviewHistoryNDays = `SELECT created_at::date AS date, COUNT(*) AS reviews FROM account_review where account_id = :accountId 
  GROUP BY created_at::date ORDER BY created_at::date DESC LIMIT :limitReviews`;

/**
 * Fetch future due review count per day, "limitReviews" amount of days. Arrange to ASC order, with latest first
 * @param {integer} accountId - id of the account
 * @param {integer} limitReviews - limit how many new cards are fetched
 */
const fetchDueReviewsNDays = `SELECT due_at::date AS date, COUNT(*) AS reviews FROM account_card WHERE account_id = :accountId GROUP BY due_at::date
ORDER BY due_at::date ASC LIMIT :limitReviews`;

/**
 * Fetch by accounts learning progress, grouped by "matured", "learning", and "new"
 * @param {integer} accountId - id of the account
 */
const groupByTypeAndLearningStatus = `
SELECT 'matured' AS status, COUNT(acc.mature) FROM card INNER JOIN account_card AS acc
ON acc.card_id = card.id WHERE card.type = :cardType AND acc.account_id = :accountId AND acc.mature = true GROUP BY acc.mature
UNION
SELECT 'learning' AS status, COUNT(acc.mature) FROM card INNER JOIN account_card AS acc
ON acc.card_id = card.id WHERE card.type = :cardType AND acc.account_id = :accountId AND acc.mature = false GROUP BY acc.mature
UNION
SELECT 'new' AS status, COUNT(card.id) FROM card WHERE card.type = :cardType AND NOT EXISTS (
SELECT null FROM account_card WHERE account_card.account_id = :accountId AND account_card.card_id = card.id
) GROUP BY status`;

module.exports = {
  selectNewCardIds,
  selectDueCardIds,
  findCard,
  pushAllCardsNDays,
  pushCardsInDeckIdNDays,
  fetchDailyReviewHistoryNDays,
  fetchDueReviewsNDays,
  groupByTypeAndLearningStatus
};
