CREATE EXTENSION IF NOT EXISTS CITEXT;

-- DOMAIN email makes constraint check that the users email is valid
CREATE DOMAIN IF NOT EXISTS valid_email AS CITEXT CHECK ( VALUE ~ '^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$' );

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email valid_email NOT NULL UNIQUE,
  password CHAR(60) NOT NULL,
  username CITEXT NOT NULL UNIQUE,
  user_created DATE NOT NULL DEFAULT NOW()
);

-- Example words for the kanji in question
CREATE TABLE IF NOT EXISTS example_words (
  id SERIAL PRIMARY KEY,
  word TEXT UNIQUE,
  furigana TEXT,
  jlpt_level INTEGER
);

-- Translation for the word, multiple languages (e.g. 'fi', 'en'), country IDs in ISO 639-1
CREATE TABLE IF NOT EXISTS example_word_translations (
  id SERIAL PRIMARY KEY,
  word_id INTEGER,
  language CHAR(2),
  translation TEXT,
  description TEXT,
  FOREIGN KEY (word_id) REFERENCES example_words(id)
);
