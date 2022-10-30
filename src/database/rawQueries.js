const selectNewCardIds = `SELECT card_id FROM card_list WHERE deck_id = :deckId AND NOT EXISTS (
  SELECT NULL 
  FROM account_card 
  WHERE account_card.account_id = :accountId AND card_list.card_id = account_card.card_id
) ORDER BY learning_order ASC LIMIT :limitReviews`;

const selectDueCardIds = `SELECT card_list.card_id FROM card_list INNER JOIN 
account_card ON account_card.card_id = card_list.card_id 
WHERE card_list.deck_id = :deckId AND account_card.account_id = :accountId AND account_card.due_at <= NOW()
ORDER BY due_at ASC LIMIT :limitReviews`;

const findCard = 'SELECT 1 FROM card WHERE id = :cardId';

const pushAllCardsNDays = 'UPDATE account_card SET due_at = due_at + :days WHERE account_id = :accountId';

const pushCardsInDeckIdNDays = `UPDATE account_card SET due_at = account_card.due_at + :days FROM
  (SELECT card_list.card_id FROM card_list 
  INNER JOIN account_card ON account_card.card_id = card_list.card_id 
  where deck_id = :deckId AND account_id = :accountId)
  AS found WHERE found.card_id = account_card.card_id`;

module.exports = {
  selectNewCardIds,
  selectDueCardIds,
  findCard,
  pushAllCardsNDays,
  pushCardsInDeckIdNDays
};
