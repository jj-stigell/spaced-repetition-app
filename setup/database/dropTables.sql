-- For purging the whole database
BEGIN;
DROP TYPE IF EXISTS result CASCADE;
DROP TABLE IF EXISTS account CASCADE;
DROP TABLE IF EXISTS country CASCADE;
DROP TABLE IF EXISTS example_word CASCADE;
DROP TABLE IF EXISTS kanji CASCADE;
DROP TABLE IF EXISTS radical CASCADE;
DROP TABLE IF EXISTS radical_translation CASCADE;
DROP TABLE IF EXISTS kanji_radical CASCADE;
DROP TABLE IF EXISTS example_word_translation CASCADE;
DROP TABLE IF EXISTS translation_kanji CASCADE;
DROP TABLE IF EXISTS account_kanji_review CASCADE;
DROP TABLE IF EXISTS account_kanji_card CASCADE;
COMMIT;