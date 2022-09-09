-- For purging the whole database
BEGIN;
DROP TYPE result CASCADE;
DROP TABLE account CASCADE;
DROP TABLE country CASCADE;
DROP TABLE example_word CASCADE;
DROP TABLE kanji CASCADE;
DROP TABLE radical CASCADE;
DROP TABLE radical_translation CASCADE;
DROP TABLE kanji_radical CASCADE;
DROP TABLE example_word_translation CASCADE;
DROP TABLE translation_kanji CASCADE;
DROP TABLE account_kanji_review CASCADE;
DROP TABLE account_kanji_card CASCADE;
COMMIT;