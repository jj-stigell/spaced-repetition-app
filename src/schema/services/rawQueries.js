/**
 * Select cards from deck that have no previous reviews for the account.
 * @param {integer} deckId - id of the deck
 * @param {integer} accountId - accounts id number
 * @param {integer} limitReviews - limit how many new cards are selected
 */
const selectNewCardIds = `
SELECT
  card_list.id
FROM
  card_list
WHERE
  deck_id = :deckId
AND NOT EXISTS (
    SELECT
      NULL
    FROM
      account_card
    WHERE
      account_card.account_id = :accountId
      AND card_list.card_id = account_card.card_id
      AND card_list.review_type::text = account_card.review_type::text
)
ORDER BY
  learning_order ASC LIMIT :limitReviews
`;

/**
 * Select account due card in id list from account cards joined to the decks card list
 * @param {integer} deckId - id of the deck
 * @param {integer} accountId - accounts id number
 * @param {integer} limitReviews - limit how many due cards are selected
 * @param {Date} currentDate - current date for the client, can differ from server date, don't use 'CURRENT_DATE'
 */
const selectDueCardIds = `
SELECT
  card_list.id
FROM
  card_list
INNER JOIN
  account_card
    ON account_card.card_id = card_list.card_id
WHERE
  card_list.deck_id = :deckId
  AND card_list.review_type::text = account_card.review_type::text
  AND account_card.account_id = :accountId
  AND account_card.due_at <= :currentDate
ORDER BY
  due_at ASC LIMIT :limitReviews
`;

/**
 * Pushes all cards owned by account with an id "accountId" with "days" days to future
 * @param {Date} currentDate - current date for the client, can differ from server date, don't use 'CURRENT_DATE'
 * @param {Date} newDueDate - new due date for cards due today
 * @param {integer} days - number of days for cards with future due date
 * @param {integer} accountId - accounts id number
 */
const pushAllCardsNDays = `
UPDATE account_card
SET due_at = (CASE
                WHEN due_at <= :currentDate THEN :newDueDate
                ELSE due_at + :days
              END)
WHERE account_id = :accountId
`;

/**
 * Pushes all cards in deck "deckId" owned by account with an id "accountId" with "days" days to future.
 * @param {Date} currentDate - current date for the client, can differ from server date, don't use 'CURRENT_DATE'
 * @param {Date} newDueDate - new due date for cards due today
 * @param {integer} days - number of days for cards with future due date
 * @param {integer} accountId - accounts id number
 * @param {integer} deckId - id of the deck
 */
const pushCardsInDeckNDays = `
UPDATE
  account_card
SET
  due_at = (CASE
              WHEN due_at <= :currentDate THEN :newDueDate
              ELSE due_at + :days
            END)
FROM
  (SELECT
    account_card.id AS account_card_id
  FROM
    card_list
  INNER JOIN
    account_card
      ON account_card.card_id = card_list.card_id
  WHERE
    card_list.deck_id = :deckId
    AND card_list.review_type::text = account_card.review_type::text
    AND account_card.account_id = :accountId) AS found
WHERE
  found.account_card_id = account_card.id
`;

/**
 * Fetch count per day of the accounts past reviews for "limitReviews" amount of days. Arrange from latest review to oldest
 * @param {integer} accountId - accounts id number
 * @param {integer} limitReviews - limit how many new cards are fetched
 */
const fetchDailyReviewHistoryNDays = `
SELECT
  created_at::date AS date,
  COUNT(*) AS reviews  
FROM
  account_review 
WHERE
  account_id = :accountId  
GROUP BY
  created_at::date  
ORDER BY
  created_at::date DESC LIMIT :limitReviews
`;

/**
 * Fetch future due review count per day, "limitReviews" amount of days. Arrange to ASC order, with latest first.
 * @param {integer} accountId - id of the account
 * @param {integer} limitReviews - limit how many new cards are fetched
 * @param {Date} currentDate - current date for the client, can differ from server date, don't use 'CURRENT_DATE'
 */
const fetchDueReviewsNDays = `
SELECT
  CASE
    WHEN DATE(due_at) <= :currentDate THEN :currentDate
    ELSE DATE(due_at)
  END AS date,
  COUNT(*) AS reviews
FROM
  account_card 
WHERE
  account_id = :accountId 
GROUP BY
  due_at::date,
  CASE
    WHEN DATE(due_at) <= :currentDate THEN :currentDate
    ELSE DATE(due_at)
  END
ORDER BY
  DATE(due_at) ASC LIMIT :limitReviews
`;

/**
 * Fetch by accounts learning progress, grouped by "matured", "learning", and "new".
 * more than one card in the account cards.
 * @param {integer} accountId - accounts id number
 * @param {string} reviewType - type of the review, 'RECALL', 'RECOGNISE', etc.
 */
const groupByTypeAndLearningStatus = `
SELECT
  'matured' AS status,
  COUNT(card.id)
FROM
  card
INNER JOIN
  account_card AS acc
    ON acc.card_id = card.id
WHERE
  card.type = :cardType
  AND acc.account_id = :accountId
  AND acc.review_type = :reviewType
  AND acc.mature = true
GROUP BY
  acc.mature
UNION
SELECT
  'learning' AS status,
  COUNT(card.id)
FROM
  card
INNER JOIN
  account_card AS acc
    ON acc.card_id = card.id
WHERE
  card.type = :cardType
  AND acc.account_id = :accountId
  AND acc.review_type = :reviewType
  AND acc.mature = false
GROUP BY
  acc.mature
UNION
SELECT
  'new' AS status,
  COUNT(card.id)
FROM
  card
WHERE
  card.type = :cardType
  AND NOT EXISTS (
    SELECT
      null
    FROM
      account_card
    WHERE
      account_card.account_id = :accountId
      AND account_card.review_type = :reviewType
      AND account_card.card_id = card.id
  )
GROUP BY
  status
`;

/**
 * Count the due cards account has in all decks.
 * @param {integer} accountId - accounts id number
 * @param {Date} currentDate - current date for the client, can differ from server date, don't use 'CURRENT_DATE'
 */
const countDueCardsInDecks = `
SELECT
  card_list.deck_id AS deck_id,
  COUNT(*) AS due_Today
FROM
  card_list
INNER JOIN
  account_card
  ON card_list.card_id = account_card.card_id
WHERE
  due_at <= :currentDate
  AND  account_id = :accountId
  AND card_list.active = true
  AND card_list.review_type::text = account_card.review_type::text
GROUP BY card_list.deck_id
`;

module.exports = {
  selectNewCardIds,
  selectDueCardIds,
  pushAllCardsNDays,
  pushCardsInDeckNDays,
  fetchDailyReviewHistoryNDays,
  fetchDueReviewsNDays,
  groupByTypeAndLearningStatus,
  countDueCardsInDecks
};
