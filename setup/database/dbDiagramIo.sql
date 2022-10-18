-- SRS - APP
-- If schema name is omitted, it will default to "public" schema.
-- You can define the tables with full schema names
-- If schema name is omitted, it will default to "public" schema.

-- Creating references
-- You can also define relaionship separately
-- > many-to-one; < one-to-many; - one-to-one; <> many-to-many
-- Ref: account.country_code > countries.code  
-- Ref: deck.country_code > countries.code


Table account {
  id int [pk, increment]
  email varchar [unique]
  email_verified boolean [default: false]
  member boolean [default: true]
  password_hash char(60)
  language varchar [ref: > country.country_code]
  timezone varchar
  last_login timestamp [default: `now()`]
  created_at timestamp [default: `now()`]
  updated_at timestamp [default: `now()`]
}

Table admin {
  id int [pk, increment]
  account_id int [ref: - account.id]
  admin boolean [default: true]
  created_at timestamp [default: `now()`]
  updated_at timestamp [default: `now()`]
}

Table account_confirmation {
  id int [pk, increment]
  account_id int [ref: > account.id]
  verified boolean
  verification_code varchar(20)
  created_at timestamp [default: `now()`]
  expires_at timestamp
}

Table country {
  id int [pk]
  country_code varchar [unique]
  country_native varchar
  country_english varchar
  language_native varchar
  language_english varchar
  created_at timestamp [default: `now()`]
  updated_at timestamp [default: `now()`]
}

Enum card_type {
  kanji
  word
  sentence
  hiragana
  katakana
}

Table deck {
  id int [pk, increment]
  name varchar [unique]
  subscriber_only boolean [default: false]
  country_code varchar [ref: > country.country_code]
  active boolean [default: false]
  created_at timestamp [default: `now()`]
  updated_at timestamp [default: `now()`]
  Indexes {
    (id) [pk]
  }
}

Table deck_language_info {
  id int [pk, increment]
  deck_id int [ref: > deck.id]
  country_code int [ref: > country.country_code]
  title varchar
  description varchar
  active boolean [default: false]
  created_at timestamp [default: `now()`]
  updated_at timestamp [default: `now()`]
  Indexes {
    (id) [pk]
  }
}

Table account_deck_settings {
  id int [pk, increment]
  deck_id int [ref: > deck.id]
  account_id int [ref: > account.id]
  favorite boolean [default: false]
  max_interval int  [default: 365]
  max_reviews_per_day int [default: 999]
  new_cards_per_day int [default: 15]
  created_at timestamp [default: `now()`]
  updated_at timestamp [default: `now()`]
  Indexes {
    (deck_id, account_id)
  }
}

Table card_list {
  id int [pk, increment]
  deck_id int [ref: > deck.id]
  card_id int [ref: > card.id]
  learning_order int
  created_at timestamp [default: `now()`]
  updated_at timestamp [default: `now()`]
  Indexes {
    (deck_id, card_id)
  }
}

Table card {
  id int [pk, increment]
  type card_type
  language_id varchar [ref: > country.country_code]
  active boolean
  created_at timestamp [default: `now()`]
  updated_at timestamp [default: `now()`]
  Indexes {
    (type, language_id)
  }
}

Table kanji {
  id int [pk, increment]
  card_id int [ref: - card.id]
  character char(1)
  onyomi varchar
  onyomi_romaji varchar
  kunyomi varchar
  kunyomi_romaji varchar
  stroke_count int
  created_at timestamp [default: `now()`]
  updated_at timestamp [default: `now()`]
}

Table word {
  id int [pk, increment]
  card_id int [ref: - card.id]
  word varchar
  reading varchar
  reading_romaji varchar
}

Table radical {
  id int [pk]
  radical varchar(1) [unique]
  reading varchar
  reading_romaji varchar
  stroke_count int
  created_at timestamp [default: `now()`]
  updated_at timestamp [default: `now()`]
}

Table kanji_radical {
  id int [pk]
  radical_id int [ref: > radical.id]
  kanji_id int [ref: > kanji.id]
  created_at timestamp [default: `now()`]
  updated_at timestamp [default: `now()`]
}

Table radical_translation {
  id int [pk, increment]
  radical_id int [ref: > radical.id]
  language_id int [ref: > country.country_code]
  translation varchar
  description varchar
  created_at timestamp [default: `now()`]
  updated_at timestamp [default: `now()`]
}

Table translation_card {
  id int [pk, increment]
  card_id int [ref: > card.id]
  language_id int [ref: > country.country_code]
  created_at timestamp [default: `now()`]
  updated_at timestamp [default: `now()`]
}

Table translation_kanji {
  id int [pk, increment]
  translation_card int [ref: - translation_card.id]
  language_id int [ref: > country.country_code]
  translation varchar
  description varchar
}

Table translation_word {
  id int [pk, increment]
  translation_card int [ref: - translation_card.id]
  language_id int [ref: > country.country_code]
  translation varchar
  description varchar
}

Table account_card {
  id int [pk, increment]
  card_id int [ref: - card.id]
  account_id int [ref: - account.id]
  account_story char(60)
  account_hint char(60)
  easy_factor float
  review_count int
  mature boolean [default: false]
  due_at timestamp
  created_at timestamp [default: `now()`]
  updated_at timestamp [default: `now()`]
  
  Indexes {
    (card_id, account_id)
  }
}


/*
Table ecommerce.order_items {
  order_id int [ref: > ecommerce.orders.id] // inline relationship (many-to-one)
  product_id int
  quantity int [default: 1] // default value
}

Ref: ecommerce.order_items.product_id > ecommerce.products.id

Table ecommerce.orders {
  id int [pk] // primary key
  user_id int [not null, unique]
  status varchar
  created_at varchar [note: 'When order created'] // add column note
}

// Enum for 'products' table below
Enum ecommerce.products_status {
  out_of_stock
  in_stock
  running_low [note: 'less than 20'] // add column note
}

// Indexes: You can define a single or multi-column index 
Table ecommerce.products {
  id int [pk]
  name varchar
  merchant_id int [not null]
  price int
  status ecommerce.products_status
  created_at datetime [default: `now()`]
  
  Indexes {
    (merchant_id, status) [name:'product_status']
    id [unique]
  }
}

Table ecommerce.product_tags {
  id int [pk]
  name varchar
}

Table ecommerce.merchant_periods {
  id int [pk]
  merchant_id int
  country_code int
  start_date datetime
  end_date datetime
}

Table periods {
  id int [pk]
  merchant_id int
  country_code int
  start_date datetime
  end_date datetime
}
*/
-- Ref: ecommerce.products.merchant_id > ecommerce.merchants.id // many-to-one
-- Ref: ecommerce.product_tags.id <> ecommerce.products.id // many-to-many
-- composite foreign key
-- Ref: ecommerce.merchant_periods.(merchant_id, country_code) > ecommerce.merchants.(id, country_code)
