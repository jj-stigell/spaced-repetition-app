const selectNewCards = `SELECT card_id FROM card_list WHERE deck_id = :deckId AND NOT EXISTS (
  SELECT NULL 
  FROM account_card 
  WHERE account_card.account_id = :accountId AND card_list.card_id = account_card.card_id
) ORDER BY learning_order ASC LIMIT :limitReviews`;

module.exports = {
  selectNewCards
};
