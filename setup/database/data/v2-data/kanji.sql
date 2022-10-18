



INSERT INTO kanji(card_id, kanji,learning_order,jlpt_level,onyomi,onyomi_romaji,kunyomi,kunyomi_romaji,stroke_count) VALUES (14,'一',1,5,'イチ、 イツ','ichi, itsu','ひと-、 ひと.つ','hito-, hito.tsu','1');

INSERT INTO kanji(id,kanji,learning_order,jlpt_level,onyomi,onyomi_romaji,kunyomi,kunyomi_romaji,stroke_count) VALUES (6,'二',2,5,'ニ、 ジ','ni, ji','ふた、 ふた.つ、 ふたたび','futa, futa.tsu, futatabi','2');


INSERT INTO kanji(id,kanji,learning_order,jlpt_level,onyomi,onyomi_romaji,kunyomi,kunyomi_romaji,stroke_count) VALUES (7,'三',3,5,'サン、 ゾウ','san, zou','み、 み.つ、 みっ.つ','mi, mi.tsu, mit.tsu','3');

INSERT INTO kanji(id,kanji,learning_order,jlpt_level,onyomi,onyomi_romaji,kunyomi,kunyomi_romaji,stroke_count) VALUES (8,'山',NULL,5,'サン、 セン','san ,sen','やま','yama','3');





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

