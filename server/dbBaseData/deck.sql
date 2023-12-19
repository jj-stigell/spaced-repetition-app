INSERT INTO deck (deck_name, member_only, category, jlpt_level, language_id, active, created_at, updated_at) VALUES
-- N5 Kanji Decks
('JLPT N5 Kanji Deck 1 (Kanji 1 to 20)', false, 'KANJI', 5, 'JP', true, NOW(), NOW()),
('JLPT N5 Kanji Deck 2 (Kanji 21 to 40)', false, 'KANJI', 5, 'JP', false, NOW(), NOW()),
('JLPT N5 Kanji Deck 3 (Kanji 41 to 60)', false, 'KANJI', 5, 'JP', false, NOW(), NOW()),
('JLPT N5 Kanji Deck 4 (Kanji 61 to 80)', false, 'KANJI', 5, 'JP', false, NOW(), NOW()),
('JLPT N5 Kanji Deck 5 (Kanji 81 to 103)', false, 'KANJI', 5, 'JP', false, NOW(), NOW()),
-- N5 Vocab Decks
('JLPT N5 Vocabulary Deck 1 (Vocabulary 1 to 20)', false, 'VOCABULARY', 5, 'JP', true, NOW(), NOW()),
('JLPT N5 Vocabulary Deck 2 (Vocabulary 21 to 40)', false, 'VOCABULARY', 5, 'JP', false, NOW(), NOW()),
('JLPT N5 Vocabulary Deck 3 (Vocabulary 41 to 60)', false, 'VOCABULARY', 5, 'JP', false, NOW(), NOW()),
-- N5 Kana Decks
('JLPT N5 Hiragana Deck 1', false, 'KANA', 5, 'JP', true, NOW(), NOW()),
('JLPT N5 Hiragana Deck 2', false, 'KANA', 5, 'JP', false, NOW(), NOW()),
('JLPT N5 Katakana Deck 1', false, 'KANA', 5, 'JP', true, NOW(), NOW()),
('JLPT N5 Katakana Deck 2', false, 'KANA', 5, 'JP', false, NOW(), NOW()),
-- N5 Grammar decks
('JLPT N5 Grammar Deck 1, grammar rules 1 to 20', false, 'GRAMMAR', 5, 'JP', false, NOW(), NOW()),
-- new kanji decks
('JLPT N5 Kanji Recall and Recognize from sentence Deck 1', false, 'KANJI', 5, 'JP', true, NOW(), NOW()); -- id 14