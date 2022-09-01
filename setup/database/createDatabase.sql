CREATE EXTENSION IF NOT EXISTS CITEXT;

-- Enum for review difficulty
CREATE TYPE result AS ENUM ('again', 'hard', 'easy');

-- DOMAIN email makes constraint check that the users email is valid
CREATE DOMAIN valid_email AS CITEXT CHECK ( VALUE ~ '^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$' );

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email valid_email NOT NULL UNIQUE,
  password CHAR(60) NOT NULL,
  username CITEXT NOT NULL UNIQUE,
  user_created DATE NOT NULL DEFAULT NOW()
);

-- information for all the available languages, language IDs in ISO 639-1
CREATE TABLE IF NOT EXISTS countries (
  id SERIAL PRIMARY KEY,
  language_id CHAR(2) NOT NULL UNIQUE,
  country_en TEXT NOT NULL UNIQUE,
  country_native TEXT NOT NULL UNIQUE,
  language_en TEXT NOT NULL UNIQUE,
  language_native TEXT NOT NULL UNIQUE
); 

-- kanji and its relevant information, JLPT levels are from 1 to 5
CREATE TABLE IF NOT EXISTS kanji (
  id SERIAL PRIMARY KEY,
  kanji CHAR(1) NOT NULL UNIQUE,
  learning_order INTEGER NOT NULL UNIQUE,
  jlpt_level INTEGER CHECK( jlpt_level IN ( 1, 2, 3, 4, 5 ) ),
  onyomi TEXT,
  kunyomi TEXT,
  stroke_count INTEGER
);

-- translation for the kanji in different languages
CREATE TABLE IF NOT EXISTS translation_kanji (
  id SERIAL PRIMARY KEY,
  kanji_id INTEGER,
  language_id CHAR(2),
  story TEXT,
  hint TEXT,
  FOREIGN KEY (kanji_id) REFERENCES kanji(id),
  FOREIGN KEY (language_id) REFERENCES countries(language_id)
);

-- Example words for the kanji in question
CREATE TABLE IF NOT EXISTS example_words (
  id SERIAL PRIMARY KEY,
  word TEXT NOT NULL UNIQUE,
  furigana TEXT NOT NULL,
  jlpt_level INTEGER CHECK( jlpt_level IN ( 1, 2, 3, 4, 5 ) )
);

-- Translation for the word, multiple languages (e.g. 'fi', 'en', etc.)
CREATE TABLE IF NOT EXISTS example_word_translations (
  id SERIAL PRIMARY KEY,
  word_id INTEGER NOT NULL,
  language_id CHAR(2) NOT NULL,
  translation TEXT NOT NULL,
  description TEXT,
  FOREIGN KEY (word_id) REFERENCES example_words(id),
  FOREIGN KEY (language_id) REFERENCES countries(language_id)
);

-- Radicals for kanji
CREATE TABLE IF NOT EXISTS radicals (
  id INTEGER PRIMARY KEY,
  radical CHAR(1) NOT NULL UNIQUE,
  reading TEXT NOT NULL,
  stroke_count INTEGER
);

-- Translation for the radical, multiple languages (e.g. 'fi', 'en', etc.)
CREATE TABLE IF NOT EXISTS radical_translations (
  radical_id INTEGER NOT NULL,
  language_id CHAR(2) NOT NULL,
  translation TEXT NOT NULL,
  description TEXT,
  FOREIGN KEY (radical_id) REFERENCES radicals(id),
  FOREIGN KEY (language_id) REFERENCES countries(language_id)
);

-- Radicals that make the kanji
CREATE TABLE IF NOT EXISTS kanji_radicals (
  radical_id INTEGER NOT NULL,
  kanji_id INTEGER NOT NULL,
  FOREIGN KEY (radical_id) REFERENCES radicals(id),
  FOREIGN KEY (kanji_id) REFERENCES kanji(id)
);


-- Keep track of each review done by the user
CREATE TABLE IF NOT EXISTS kanji_review_history (
  user_id INTEGER NOT NULL,
  kanji_id INTEGER NOT NULL,
  reviewed DATE NOT NULL DEFAULT now() PRIMARY KEY,
  extra_review BOOLEAN NOT NULL DEFAULT FALSE,
  review_result result NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (kanji_id) REFERENCES kanji(id)
);


-- User specific information for kanji card
CREATE TABLE IF NOT EXISTS user_kanji_reviews (
  user_id INTEGER NOT NULL,
  kanji_id INTEGER NOT NULL,
  review_count INTEGER NOT NULL DEFAULT 1,
  due_date DATE,
  user_story TEXT,
  user_hint TEXT,
  mature BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (kanji_id) REFERENCES kanji(id)
);
