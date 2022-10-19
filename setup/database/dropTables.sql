-- For purging the whole database (including migrations)
BEGIN;
DROP TYPE IF EXISTS result CASCADE;
DROP TABLE IF EXISTS admin CASCADE;
DROP TABLE IF EXISTS account CASCADE;
DROP TABLE IF EXISTS country CASCADE;
DROP TABLE IF EXISTS example_word CASCADE;
DROP TABLE IF EXISTS kanji CASCADE;
DROP TABLE IF EXISTS radical CASCADE;
DROP TABLE IF EXISTS translation_radical CASCADE;
DROP TABLE IF EXISTS kanji_radical CASCADE;
DROP TABLE IF EXISTS example_word_translation CASCADE;
DROP TABLE IF EXISTS translation_kanji CASCADE;
DROP TABLE IF EXISTS account_kanji_review CASCADE;
DROP TABLE IF EXISTS account_kanji_card CASCADE;
DROP TABLE IF EXISTS migrations CASCADE;
COMMIT;

-- For purging the whole database (including migrations)
BEGIN;
DROP TYPE IF EXISTS result CASCADE;
DROP TABLE IF EXISTS admin CASCADE;
DROP TABLE IF EXISTS account CASCADE;
DROP TABLE IF EXISTS country CASCADE;
DROP TABLE IF EXISTS japanese_word CASCADE;
DROP TABLE IF EXISTS kanji CASCADE;
DROP TABLE IF EXISTS radical CASCADE;
DROP TABLE IF EXISTS radical_translation CASCADE;
DROP TABLE IF EXISTS kanji_radical CASCADE;
DROP TABLE IF EXISTS japanese_word_translation CASCADE;
DROP TABLE IF EXISTS kanji_translation CASCADE;
DROP TABLE IF EXISTS account_review CASCADE;
DROP TABLE IF EXISTS account_card CASCADE;
DROP TABLE IF EXISTS migrations CASCADE;
DROP TABLE IF EXISTS card CASCADE;
DROP TABLE IF EXISTS deck_translation CASCADE;
DROP TABLE IF EXISTS account_deck_settings CASCADE;
DROP TABLE IF EXISTS deck CASCADE;
DROP TABLE IF EXISTS card_list CASCADE;
COMMIT;