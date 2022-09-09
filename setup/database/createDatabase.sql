-- Enum for review difficulty
CREATE TYPE result AS ENUM ('again', 'hard', 'easy');

CREATE TABLE IF NOT EXISTS account (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password CHAR(60) NOT NULL,
  username VARCHAR(14) NOT NULL UNIQUE CHECK( LENGTH(username) > 1 ), -- Length between 1 - 14 chars
  member BOOLEAN NOT NULL DEFAULT TRUE,
  email_verified BOOLEAN NOT NULL DEFAULT FALSE,
  admin BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  last_login TIMESTAMP NOT NULL DEFAULT NOW()
);

-- information for all the available languages, language_id in ISO 639-1
CREATE TABLE IF NOT EXISTS country (
  id INTEGER PRIMARY KEY,
  language_id CHAR(2) NOT NULL UNIQUE,
  country_en TEXT NOT NULL UNIQUE,
  country_native TEXT NOT NULL UNIQUE,
  language_en TEXT NOT NULL UNIQUE,
  language_native TEXT NOT NULL UNIQUE
); 

-- kanji and its relevant information, JLPT levels are from 1 to 5
CREATE TABLE IF NOT EXISTS kanji (
  id INTEGER PRIMARY KEY,
  kanji CHAR(1) NOT NULL UNIQUE,
  learning_order INTEGER UNIQUE,
  jlpt_level INTEGER CHECK( jlpt_level IN ( 1, 2, 3, 4, 5 ) ),
  onyomi TEXT,  -- Do not enforce readings as not all kanji have both onyomi and kunyomi
  onyomi_romaji TEXT,
  kunyomi TEXT,
  kunyomi_romaji TEXT,
  stroke_count INTEGER
);

-- translation for the kanji in different languages
CREATE TABLE IF NOT EXISTS translation_kanji (
  kanji_id INTEGER,
  language_id CHAR(2),
  keyword TEXT,
  story TEXT,
  hint TEXT,
  other_meanings TEXT,
  FOREIGN KEY (kanji_id) REFERENCES kanji(id),
  FOREIGN KEY (language_id) REFERENCES country(language_id)
);

-- Example words for the kanji in question
CREATE TABLE IF NOT EXISTS example_word (
  id SERIAL PRIMARY KEY,
  word TEXT NOT NULL UNIQUE,
  furigana TEXT NOT NULL,
  romaji TEXT NOT NULL,
  jlpt_level INTEGER CHECK( jlpt_level IN ( 1, 2, 3, 4, 5 ) )
);

-- Translation for the word, multiple languages (e.g. 'fi', 'en', etc.)
CREATE TABLE IF NOT EXISTS example_word_translation (
  id SERIAL PRIMARY KEY,
  word_id INTEGER NOT NULL,
  language_id CHAR(2) NOT NULL,
  translation TEXT NOT NULL,
  type TEXT,  -- verb, noun, transitive-, intrasitive verb, adjective etc.
  description TEXT,
  FOREIGN KEY (word_id) REFERENCES example_word(id),
  FOREIGN KEY (language_id) REFERENCES country(language_id)
);

-- Radicals for kanji
CREATE TABLE IF NOT EXISTS radical (
  id INTEGER PRIMARY KEY,
  radical CHAR(1) NOT NULL UNIQUE,
  reading TEXT NOT NULL,
  reading_romaji TEXT,
  stroke_count INTEGER
);

-- Translation for the radical, multiple languages (e.g. 'fi', 'en', etc.)
CREATE TABLE IF NOT EXISTS radical_translation (
  radical_id INTEGER NOT NULL,
  language_id CHAR(2) NOT NULL,
  translation TEXT NOT NULL,
  description TEXT,
  FOREIGN KEY (radical_id) REFERENCES radical(id),
  FOREIGN KEY (language_id) REFERENCES country(language_id)
);

-- Radicals that make the kanji
CREATE TABLE IF NOT EXISTS kanji_radical (
  radical_id INTEGER NOT NULL,
  kanji_id INTEGER NOT NULL,
  FOREIGN KEY (radical_id) REFERENCES radical(id),
  FOREIGN KEY (kanji_id) REFERENCES kanji(id)
);

-- Keep track of each review done by the account
CREATE TABLE IF NOT EXISTS account_kanji_review (
  id SERIAL PRIMARY KEY,
  account_id INTEGER NOT NULL,
  kanji_id INTEGER NOT NULL,
  reviewed TIMESTAMP NOT NULL DEFAULT NOW(),
  extra_review BOOLEAN NOT NULL DEFAULT FALSE,
  review_result result NOT NULL,
  FOREIGN KEY (account_id) REFERENCES account(id),
  FOREIGN KEY (kanji_id) REFERENCES kanji(id)
);

-- Account specific information for kanji card
CREATE TABLE IF NOT EXISTS account_kanji_card (
  account_id INTEGER NOT NULL,
  kanji_id INTEGER NOT NULL,
  review_count INTEGER NOT NULL DEFAULT 1,
  easy_factor REAL DEFAULT 2.5,
  due_date DATE,
  account_story TEXT,
  account_hint TEXT,
  mature BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (account_id) REFERENCES account(id),
  FOREIGN KEY (kanji_id) REFERENCES kanji(id)
);
