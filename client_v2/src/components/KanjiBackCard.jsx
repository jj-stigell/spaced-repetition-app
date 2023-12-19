const KanjiBackCard = ({ kanji, show }) => {
  if (!show) return null;

  return (
      <div className="p-4 border rounded mt-4">
          <div>Meanings: {kanji.meanings.join(', ')}</div>
          <div>On'yomi: {kanji.onyomi}</div>
          <div>Kun'yomi: {kanji.kunyomi}</div>
          {kanji.examples.map((example, index) => (
              <div key={index} className="mb-2">
                  <div>{example.word}</div>
                  <div>{example.sentence}</div>
              </div>
          ))}
      </div>
  );
};

export default KanjiBackCard;
