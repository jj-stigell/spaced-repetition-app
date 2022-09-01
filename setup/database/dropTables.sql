-- For purging the whole database
BEGIN;
DROP DOMAIN valid_email CASCADE;
DROP TYPE result CASCADE;
DROP TABLE users CASCADE;
DROP TABLE countries CASCADE;
DROP TABLE example_words CASCADE;
DROP TABLE kanji CASCADE;
DROP TABLE radicals CASCADE;
DROP TABLE radical_translations CASCADE;
DROP TABLE kanji_radicals CASCADE;
DROP TABLE example_word_translations CASCADE;
DROP TABLE translation_kanji CASCADE;
DROP TABLE kanji_review_history CASCADE;
DROP TABLE user_kanji_reviews CASCADE;
COMMIT;