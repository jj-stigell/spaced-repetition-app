const InformationPanel = ({ kanji }) => {
  return (
      <div className="p-4 border rounded">
          <div>Meanings: {kanji.meanings.join(', ')}</div>
          <div>On'yomi: {kanji.onyomi}</div>
          <div>Kun'yomi: {kanji.kunyomi}</div>
          {/* Radical information would be added here */}
      </div>
  );
};

export default InformationPanel;
